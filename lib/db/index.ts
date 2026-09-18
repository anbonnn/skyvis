import { sql } from "@vercel/postgres";

export { sql };

export interface Company {
  id: string;
  name: string;
  registration_number: string | null;
  field: string | null;
  employee_count: string | null;
  years_operating: number | null;
  created_at: string;
}

export interface User {
  id: string;
  company_id: string | null;
  email: string;
  name: string | null;
  job_role: string | null;
  department: string | null;
  role: "member" | "company_admin" | "staff";
  created_at: string;
}

export interface Assessment {
  id: string;
  company_id: string;
  title: string;
  instrument_version: string;
  status: "open" | "closed";
  created_at: string;
  closed_at: string | null;
}

export interface ResponseRow {
  id: string;
  assessment_id: string;
  user_id: string;
  answers: Record<string, number>;
  scores: Record<string, number> | null;
  submitted_at: string | null;
  updated_at: string;
}
