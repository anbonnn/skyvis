import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { auth } from "@/auth";
import type { MapData, OrgNode, Process, ProcessStep } from "@/lib/map-types";

export const runtime = "nodejs";

async function requireCompany() {
  const session = await auth();
  const user = session?.user;
  if (!user?.companyId) return null;
  return user;
}

/** Full graph for the signed-in user's company. */
export async function GET() {
  const user = await requireCompany();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });

  const { rows: nodes } = await sql`
    SELECT id, parent_id, label, node_type, headcount, purpose, systems,
           manual_level, variance, declared, position
    FROM org_nodes WHERE company_id = ${user.companyId}
    ORDER BY position, created_at
  `;

  const { rows: procs } = await sql`
    SELECT id, name, short_name, trigger, ends_when, position
    FROM processes WHERE company_id = ${user.companyId}
    ORDER BY position, created_at
  `;

  const { rows: steps } = await sql`
    SELECT s.id, s.process_id, s.node_id, s.seq, s.action, s.sys, s.kind, s.rule
    FROM process_steps s
    JOIN processes p ON p.id = s.process_id
    WHERE p.company_id = ${user.companyId}
    ORDER BY s.seq
  `;

  const data: MapData = {
    nodes: nodes as OrgNode[],
    processes: (procs as Omit<Process, "steps">[]).map((p) => ({
      ...p,
      steps: (steps as (ProcessStep & { process_id: string })[])
        .filter((s) => s.process_id === p.id)
        .map(({ process_id, ...rest }) => rest),
    })),
  };

  return NextResponse.json({ ok: true, data });
}

/**
 * Single write endpoint. One action per request keeps the client simple
 * and avoids a route file per verb.
 */
export async function POST(request: Request) {
  const user = await requireCompany();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  if (user.role !== "company_admin" && user.role !== "staff") {
    return NextResponse.json({ ok: false, error: "Not permitted" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const action = String(body?.action ?? "");
  const p = body?.payload ?? {};
  const company = user.companyId;

  try {
    switch (action) {
      case "createNode": {
        const { rows } = await sql`
          INSERT INTO org_nodes (company_id, parent_id, label, node_type, headcount,
                                 purpose, systems, manual_level, variance, declared, position)
          VALUES (${company}, ${p.parent_id || null}, ${String(p.label || "Untitled")},
                  ${String(p.node_type || "position")}, ${p.headcount ?? null},
                  ${p.purpose || null}, ${p.systems ?? null}, ${p.manual_level || null},
                  ${p.variance || null}, ${Boolean(p.declared)}, ${Number(p.position ?? 0)})
          RETURNING id
        `;
        return NextResponse.json({ ok: true, id: rows[0].id });
      }

      case "updateNode": {
        await sql`
          UPDATE org_nodes SET
            label        = coalesce(${p.label ?? null}, label),
            node_type    = coalesce(${p.node_type ?? null}, node_type),
            parent_id    = ${p.parent_id === undefined ? null : p.parent_id},
            headcount    = ${p.headcount ?? null},
            purpose      = ${p.purpose ?? null},
            systems      = ${p.systems ?? null},
            manual_level = ${p.manual_level ?? null},
            variance     = ${p.variance ?? null},
            declared     = coalesce(${p.declared ?? null}, declared)
          WHERE id = ${p.id} AND company_id = ${company}
        `;
        return NextResponse.json({ ok: true });
      }

      case "deleteNode": {
        // Children cascade; steps pointing at it are left with a null owner,
        // which surfaces as "no one is staffed to do this".
        await sql`DELETE FROM org_nodes WHERE id = ${p.id} AND company_id = ${company}`;
        return NextResponse.json({ ok: true });
      }

      case "createProcess": {
        const { rows } = await sql`
          INSERT INTO processes (company_id, name, short_name, trigger, ends_when, position)
          VALUES (${company}, ${String(p.name || "New process")}, ${p.short_name || null},
                  ${p.trigger || null}, ${p.ends_when || null}, ${Number(p.position ?? 0)})
          RETURNING id
        `;
        return NextResponse.json({ ok: true, id: rows[0].id });
      }

      case "updateProcess": {
        await sql`
          UPDATE processes SET
            name       = coalesce(${p.name ?? null}, name),
            short_name = ${p.short_name ?? null},
            trigger    = ${p.trigger ?? null},
            ends_when  = ${p.ends_when ?? null}
          WHERE id = ${p.id} AND company_id = ${company}
        `;
        return NextResponse.json({ ok: true });
      }

      case "deleteProcess": {
        await sql`DELETE FROM processes WHERE id = ${p.id} AND company_id = ${company}`;
        return NextResponse.json({ ok: true });
      }

      case "addStep": {
        const { rows: owned } = await sql`
          SELECT id FROM processes WHERE id = ${p.process_id} AND company_id = ${company} LIMIT 1
        `;
        if (!owned.length) return NextResponse.json({ ok: false }, { status: 404 });

        const { rows: last } = await sql`
          SELECT coalesce(max(seq), -1) + 1 AS next FROM process_steps WHERE process_id = ${p.process_id}
        `;
        const { rows } = await sql`
          INSERT INTO process_steps (process_id, node_id, seq, action, sys, kind, rule)
          VALUES (${p.process_id}, ${p.node_id || null}, ${last[0].next},
                  ${String(p.action || "New step")}, ${p.sys || null},
                  ${String(p.kind || "unknown")}, ${p.rule || null})
          RETURNING id
        `;
        return NextResponse.json({ ok: true, id: rows[0].id });
      }

      case "updateStep": {
        await sql`
          UPDATE process_steps s SET
            node_id = ${p.node_id === undefined ? null : p.node_id},
            action  = coalesce(${p.action ?? null}, s.action),
            sys     = ${p.sys ?? null},
            kind    = coalesce(${p.kind ?? null}, s.kind),
            rule    = ${p.rule ?? null}
          FROM processes pr
          WHERE s.id = ${p.id} AND s.process_id = pr.id AND pr.company_id = ${company}
        `;
        return NextResponse.json({ ok: true });
      }

      case "deleteStep": {
        await sql`
          DELETE FROM process_steps s USING processes pr
          WHERE s.id = ${p.id} AND s.process_id = pr.id AND pr.company_id = ${company}
        `;
        return NextResponse.json({ ok: true });
      }

      case "moveStep": {
        const dir = Number(p.dir) > 0 ? 1 : -1;
        const { rows: cur } = await sql`
          SELECT s.id, s.seq, s.process_id FROM process_steps s
          JOIN processes pr ON pr.id = s.process_id
          WHERE s.id = ${p.id} AND pr.company_id = ${company} LIMIT 1
        `;
        if (!cur.length) return NextResponse.json({ ok: false }, { status: 404 });

        // Two explicit queries — the client does not support composed fragments.
        const { rows: other } = dir > 0
          ? await sql`
              SELECT id, seq FROM process_steps
              WHERE process_id = ${cur[0].process_id} AND seq > ${cur[0].seq}
              ORDER BY seq ASC LIMIT 1`
          : await sql`
              SELECT id, seq FROM process_steps
              WHERE process_id = ${cur[0].process_id} AND seq < ${cur[0].seq}
              ORDER BY seq DESC LIMIT 1`;
        if (!other.length) return NextResponse.json({ ok: true });

        await sql`UPDATE process_steps SET seq = ${other[0].seq} WHERE id = ${cur[0].id}`;
        await sql`UPDATE process_steps SET seq = ${cur[0].seq} WHERE id = ${other[0].id}`;
        return NextResponse.json({ ok: true });
      }

      default:
        return NextResponse.json({ ok: false, error: "Unknown action" }, { status: 400 });
    }
  } catch (err) {
    console.error("map write failed:", err);
    return NextResponse.json({ ok: false, error: "Write failed" }, { status: 500 });
  }
}
