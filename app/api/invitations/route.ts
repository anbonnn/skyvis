import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
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
  const email = String(body?.email ?? "").trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Enter a valid email address" }, { status: 400 });
  }

  const { rows: already } = await sql`SELECT id FROM users WHERE email = ${email} LIMIT 1`;
  if (already.length) {
    return NextResponse.json({ ok: false, error: "That person already has an account" }, { status: 409 });
  }

  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

  await sql`
    INSERT INTO invitations (company_id, email, token, job_role, department, invited_by, expires_at)
    VALUES (${user.companyId}, ${email}, ${token}, ${body?.jobRole || null},
            ${body?.department || null}, ${user.id}, ${expires})
  `;

  const origin = new URL(request.url).origin;
  const link = `${origin}/invite/${token}`;

  // Email delivery is not wired up yet — see README. The link is returned so
  // the inviter can send it themselves in the meantime.
  return NextResponse.json({ ok: true, link, emailed: false });
}
