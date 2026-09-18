import { sql } from "@vercel/postgres";
import { requireUser } from "@/lib/auth-helpers";
import { AppShell, PageHead, Card } from "@/components/app/AppShell";
import { InviteForm } from "@/components/app/Actions";

export const dynamic = "force-dynamic";

const NAV = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/team", label: "Team" },
];

export default async function TeamPage() {
  const user = await requireUser();
  const isAdmin = user.role === "company_admin" || user.role === "staff";

  const { rows: members } = await sql`
    SELECT u.id, u.name, u.email, u.job_role, u.department, u.role, u.created_at,
           count(r.id) FILTER (WHERE r.submitted_at IS NOT NULL) AS submitted
    FROM users u
    LEFT JOIN responses r ON r.user_id = u.id
    WHERE u.company_id = ${user.companyId}
    GROUP BY u.id
    ORDER BY u.created_at
  `;

  const { rows: pending } = await sql`
    SELECT email, job_role, department, expires_at
    FROM invitations
    WHERE company_id = ${user.companyId} AND accepted_at IS NULL AND expires_at > now()
    ORDER BY created_at DESC
  `;

  return (
    <AppShell nav={NAV} user={user}>
      <PageHead title="Team" sub="Who can respond, and who already has." />

      {isAdmin && <div className="mb-8"><InviteForm /></div>}

      <h2 className="mb-4 text-[1.15rem]">Members ({members.length})</h2>
      <div className="mb-8 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-[0.92rem]">
          <thead>
            <tr className="border-b border-[var(--line)] text-left text-[0.8rem] text-[var(--text-3)]">
              <th className="pb-3 font-semibold">Name</th>
              <th className="pb-3 font-semibold">Role</th>
              <th className="pb-3 font-semibold">Department</th>
              <th className="pb-3 font-semibold">Access</th>
              <th className="pb-3 text-right font-semibold">Responses</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="border-b border-[var(--line)]">
                <td className="py-3">
                  <div className="font-medium">{m.name || "—"}</div>
                  <div className="text-[0.82rem] text-[var(--text-3)]">{m.email}</div>
                </td>
                <td className="py-3 text-[var(--text-2)]">{m.job_role || "—"}</td>
                <td className="py-3 text-[var(--text-2)]">{m.department || "—"}</td>
                <td className="py-3 text-[var(--text-2)]">
                  {m.role === "company_admin" ? "Administrator" : "Member"}
                </td>
                <td className="py-3 text-right">{m.submitted}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pending.length > 0 && (
        <>
          <h2 className="mb-4 text-[1.15rem]">Pending invitations ({pending.length})</h2>
          <Card>
            <ul className="grid gap-3">
              {pending.map((p) => (
                <li key={p.email} className="flex flex-wrap items-center gap-3 text-[0.92rem]">
                  <span className="font-medium">{p.email}</span>
                  <span className="text-[var(--text-3)]">
                    {[p.job_role, p.department].filter(Boolean).join(" · ") || "no role given"}
                  </span>
                  <span className="ml-auto text-[0.82rem] text-[var(--text-3)]">
                    expires {new Date(p.expires_at).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </>
      )}
    </AppShell>
  );
}
