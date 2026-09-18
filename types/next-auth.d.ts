import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "member" | "company_admin" | "staff";
      companyId: string | null;
      companyName: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role?: "member" | "company_admin" | "staff";
    companyId?: string | null;
    companyName?: string | null;
  }
}
