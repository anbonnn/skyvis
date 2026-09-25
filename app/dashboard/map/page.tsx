import { sql } from "@vercel/postgres";
import { requireUser } from "@/lib/auth-helpers";
import { AppShell, PageHead } from "@/components/app/AppShell";
import { BusinessMap } from "@/components/map/BusinessMap";
import type { MapData, OrgNode, Process, ProcessStep } from "@/lib/map-types";

export const dynamic = "force-dynamic";

const NAV = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/map", label: "Business map" },
  { href: "/dashboard/team", label: "Team" },
];

export default async function MapPage() {
  const user = await requireUser();
  const canEdit = user.role === "company_admin" || user.role === "staff";

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

  return (
    <AppShell nav={NAV} user={user}>
      <PageHead
        title="Business map"
        sub="How the organization is structured, and how work actually moves through it."
      />
      <BusinessMap initial={data} canEdit={canEdit} />
    </AppShell>
  );
}
