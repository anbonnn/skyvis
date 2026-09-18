import Link from "next/link";
import { sql } from "@vercel/postgres";
import { requireStaff } from "@/lib/auth-helpers";
import { AppShell, PageHead, Stat } from "@/components/app/AppShell";

export const dynamic = "force-dynamic";

const NAV = [{ href: "/admin", label: "Companies" }];

export default async function AdminPage() {
  const user = await requireStaff();

  const { rows: companies } = await sql`
    SELECT c.id, c.name, c.field, c.employee_count, c.years_operating, c.created_at,
           count(DISTINCT u.id) AS users,
           count(DISTINCT a.id) AS assessments,
           count(DISTINCT r.id) FILTER (WHERE r.submitted_at IS NOT NULL) AS responses
    FROM companies c
    LEFT JOIN users u ON u.company_id = c.id
    LEFT JOIN assessments a ON a.company_id = c.id
    LEFT JOIN responses r ON r.assessment_id = a.id
    GROUP BY c.id
    ORDER BY c.created_at DESC
  `;

  const totals = companies.reduce(
    (acc, c) => ({
      users: acc.users + Number(c.users),
      assessments: acc.assessments + Number(c.assessments),
      responses: acc.responses + Number(c.responses),
    }),
    { users: 0, assessments: 0, responses: 0 }
  );

  return (
    <AppShell nav={NAV} user={user}>
      <PageHead title="Registered companies" sub="Every organization using the SKYVIS assessment." />

      <div className="mb-8 grid gap-4 sm:grid-cols-4">
        <Stat value={companies.length} label="Companies" />
        <Stat value={totals.users} label="Users" />
        <Stat value={totals.assessments} label="Assessments" />
        <Stat value={totals.responses} label="Submitted responses" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-[0.92rem]">
          <thead>
            <tr className="border-b border-[var(--line)] text-left text-[0.8rem] text-[var(--text-3)]">
              <th className="pb-3 font-semibold">Company</th>
              <th className="pb-3 font-semibold">Field</th>
              <th className="pb-3 font-semibold">Size</th>
              <th className="pb-3 text-right font-semibold">Users</th>
              <th className="pb-3 text-right font-semibold">Assessments</th>
              <th className="pb-3 text-right font-semibold">Responses</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((c) => (
              <tr key={c.id} className="border-b border-[var(--line)]">
                <td className="py-3">
                  <Link href={`/admin/companies/${c.id}`} className="font-medium text-[var(--sky)]">
                    {c.name}
                  </Link>
                  <div className="text-[0.8rem] text-[var(--text-3)]">
                    joined {new Date(c.created_at).toLocaleDateString()}
                  </div>
                </td>
                <td className="py-3 text-[var(--text-2)]">{c.field || "—"}</td>
                <td className="py-3 text-[var(--text-2)]">{c.employee_count || "—"}</td>
                <td className="py-3 text-right">{c.users}</td>
                <td className="py-3 text-right">{c.assessments}</td>
                <td className="py-3 text-right">{c.responses}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {companies.length === 0 && (
          <p className="py-10 text-center text-[var(--text-3)]">No companies registered yet.</p>
        )}
      </div>
    </AppShell>
  );
}
