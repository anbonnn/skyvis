import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql } from "@vercel/postgres";

export const runtime = "nodejs";

function bad(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function POST(request: Request) {
  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return bad("Invalid request");
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  const companyName = String(body.companyName ?? "").trim();

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return bad("Enter a valid email address");
  if (password.length < 10) return bad("Password must be at least 10 characters");
  if (!companyName) return bad("Company name is required");

  const { rows: existing } = await sql`SELECT id FROM users WHERE email = ${email} LIMIT 1`;
  if (existing.length) return bad("An account with that email already exists", 409);

  const hash = await bcrypt.hash(password, 12);
  const years = body.yearsOperating ? Number(body.yearsOperating) : null;

  const { rows: company } = await sql`
    INSERT INTO companies (name, registration_number, field, employee_count, years_operating)
    VALUES (${companyName}, ${body.registrationNumber || null}, ${body.field || null},
            ${body.employeeCount || null}, ${Number.isFinite(years) ? years : null})
    RETURNING id
  `;

  await sql`
    INSERT INTO users (company_id, email, password_hash, name, job_role, role)
    VALUES (${company[0].id}, ${email}, ${hash}, ${body.name || null},
            ${body.jobRole || null}, 'company_admin')
  `;

  return NextResponse.json({ ok: true });
}
