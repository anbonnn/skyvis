import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";
import { sql } from "@vercel/postgres";

export const runtime = "nodejs";

/**
 * One-time schema setup.
 *
 * Call once after deploying, with the SETUP_SECRET you set in the
 * environment: POST /api/setup with header `x-setup-secret`.
 * Also creates the first SKYVIS staff account from STAFF_EMAIL and
 * STAFF_PASSWORD. Remove those two variables once it has run.
 */
export async function POST(request: Request) {
  const secret = process.env.SETUP_SECRET;
  if (!secret || request.headers.get("x-setup-secret") !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const schema = await readFile(path.join(process.cwd(), "lib", "schema.sql"), "utf8");
  for (const statement of schema.split(";").map((s) => s.trim()).filter(Boolean)) {
    await sql.query(statement);
  }

  const email = process.env.STAFF_EMAIL?.trim().toLowerCase();
  const password = process.env.STAFF_PASSWORD;
  let staffCreated = false;

  if (email && password && password.length >= 10) {
    const { rows } = await sql`SELECT id FROM users WHERE email = ${email} LIMIT 1`;
    if (!rows.length) {
      const hash = await bcrypt.hash(password, 12);
      await sql`
        INSERT INTO users (email, password_hash, name, role)
        VALUES (${email}, ${hash}, 'SKYVIS', 'staff')
      `;
      staffCreated = true;
    }
  }

  return NextResponse.json({ ok: true, staffCreated });
}
