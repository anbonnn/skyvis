import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { auth } from "@/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await auth();
  const user = session?.user;
  if (!user?.companyId) return NextResponse.json({ ok: false }, { status: 401 });
  if (user.role !== "company_admin" && user.role !== "staff") {
    return NextResponse.json({ ok: false, error: "Not permitted" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const action = String(body?.action ?? "create");

  if (action === "close") {
    await sql`
      UPDATE assessments SET status = 'closed', closed_at = now()
      WHERE id = ${String(body?.id ?? "")} AND company_id = ${user.companyId}
    `;
    return NextResponse.json({ ok: true });
  }

  const title = String(body?.title ?? "").trim() || `Assessment ${new Date().getFullYear()}`;
  const { rows } = await sql`
    INSERT INTO assessments (company_id, title, created_by)
    VALUES (${user.companyId}, ${title}, ${user.id})
    RETURNING id
  `;
  return NextResponse.json({ ok: true, id: rows[0].id });
}
