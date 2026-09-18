import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe half of the Auth.js config.
 *
 * Middleware runs on the edge runtime, where bcrypt and the Postgres client
 * cannot load. This file holds only what middleware needs; the credentials
 * provider and database lookups live in auth.ts, which runs in Node.
 */
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as { role?: string }).role ?? "member";
        token.companyId = (user as { companyId?: string | null }).companyId ?? null;
        token.companyName = (user as { companyName?: string | null }).companyName ?? null;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "member" | "company_admin" | "staff";
        session.user.companyId = (token.companyId as string | null) ?? null;
        session.user.companyName = (token.companyName as string | null) ?? null;
      }
      return session;
    },
    authorized({ auth, request }) {
      const path = request.nextUrl.pathname;
      const user = auth?.user;

      if (path.startsWith("/admin")) return user?.role === "staff";
      if (path.startsWith("/dashboard")) return !!user;
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
