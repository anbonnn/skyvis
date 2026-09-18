import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql } from "@vercel/postgres";

export const runtime = "nodejs";

/** Accept an invitation: creates the user and marks the invite used. */
export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const body = await request.json().catch(() => null);
  const password = String(body?.password ?? "");
  if (password.length < 10) {
    return NextResponse.json({ ok: false, error: "Password must be at least 10 characters" }, { status: 400 });
  }

  const { rows } = await sql`
    SELECT id, company_id, email, accepted_at, expires_at
    FROM invitations WHERE token = ${token} LIMIT 1
  `;
  const invite = rows[0];
  if (!invite) return NextResponse.json({ ok: false, error: "Invalid invitation" }, { status: 404 });
  if (invite.accepted_at) return NextResponse.json({ ok: false, error: "Already used" }, { status: 409 });
  if (new Date(invite.expires_at) < new Date()) {
    return NextResponse.json({ ok: false, error: "This invitation has expired" }, { status: 410 });
  }

  const { rows: existing } = await sql`SELECT id FROM users WHERE email = ${invite.email} LIMIT 1`;
  if (existing.length) {
    return NextResponse.json({ ok: false, error: "An account already exists for this email" }, { status: 409 });
  }

  const hash = await bcrypt.hash(password, 12);
  await sql`
    INSERT INTO users (company_id, email, password_hash, name, job_role, department, role)
    VALUES (${invite.company_id}, ${invite.email}, ${hash}, ${body?.name || null},
            ${body?.jobRole || null}, ${body?.department || null}, 'member')
  `;
  await sql`UPDATE invitations SET accepted_at = now() WHERE id = ${invite.id}`;

  return NextResponse.json({ ok: true });
}
