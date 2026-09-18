import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { sql } from "@vercel/postgres";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").trim().toLowerCase();
        const password = String(credentials?.password ?? "");
        if (!email || !password) return null;

        const { rows } = await sql`
          SELECT u.id, u.email, u.name, u.role, u.password_hash,
                 u.company_id, c.name AS company_name
          FROM users u
          LEFT JOIN companies c ON c.id = u.company_id
          WHERE u.email = ${email}
          LIMIT 1
        `;

        const row = rows[0];
        // Compare regardless of whether the user exists, so a missing account
        // and a wrong password take the same time to answer.
        const hash = row?.password_hash ?? "$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalid";
        const ok = await bcrypt.compare(password, hash);
        if (!row || !ok) return null;

        return {
          id: row.id,
          email: row.email,
          name: row.name,
          role: row.role,
          companyId: row.company_id,
          companyName: row.company_name,
        };
      },
    }),
  ],
});
