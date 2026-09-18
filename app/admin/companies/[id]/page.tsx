import Link from "next/link";
import { notFound } from "next/navigation";
import { sql } from "@vercel/postgres";
import { requireStaff } from "@/lib/auth-helpers";
import { AppShell, PageHead, Card, Stat } from "@/components/app/AppShell";
import { RadarChart } from "@/components/RadarChart";
import { agreementProfile, companyProfile, overallScore } from "@/lib/scoring";
import { maturityBand, DIMENSIONS, type Scores } from "@/lib/dimensions";
import { QUESTION_STEPS } from "@/components/assessment/steps";

export const dynamic = "force-dynamic";

const NAV = [{ href: "/admin", label: "Companies" }];

export default async function AdminCompanyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireStaff();

  const { rows: c } = await sql`SELECT * FROM companies WHERE id = ${id} LIMIT 1`;
  if (!c.length) notFound();
  const company = c[0];

  const { rows: members } = await sql`
    SELECT id, name, email, job_role, department, role, created_at
    FROM users WHERE company_id = ${id} ORDER BY created_at
  `;

  const { rows: responses } = await sql`
    SELECT r.id, r.scores, r.answers, r.submitted_at,
           a.id AS assessment_id, a.title AS assessment_title,
           u.name, u.email, u.job_role, u.department
    FROM responses r
    JOIN assessments a ON a.id = r.assessment_id
    JOIN users u ON u.id = r.user_id
    WHERE a.company_id = ${id}
    ORDER BY r.updated_at DESC
  `;

  const submitted = responses.filter((r) => r.submitted_at);
  const scoreSets = submitted.map((r) => r.scores as Scores);
  const profile = scoreSets.length ? companyProfile(scoreSets) : null;
  const overall = profile ? overallScore(profile) : 0;
  const agreement = scoreSets.length > 1 ? agreementProfile(scoreSets) : [];

  return (
    <AppShell nav={NAV} user={user}>
      <PageHead
        title={company.name}
        sub={[company.field, company.employee_count && `${company.employee_count} employees`,
             company.years_operating && `${company.years_operating} years operating`]
             .filter(Boolean).join(" · ")}
        action={<Link href="/admin" className="btn btn-s">Back</Link>}
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-4">
        <Stat value={profile ? overall.toFixed(1) : "—"} label="Overall maturity" />
        <Stat value={profile ? maturityBand(overall).name : "—"} label="Band" />
        <Stat value={members.length} label="Users" />
        <Stat value={submitted.length} label="Submitted responses" />
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-1 text-[1.1rem]">Company profile</h2>
          <p className="mb-4 text-[0.85rem] text-[var(--text-3)]">
            Registration number: {company.registration_number || "not given"}
          </p>
          {profile ? (
            <RadarChart scores={profile} label="Maturity across ten dimensions." />
          ) : (
            <p className="text-[0.9rem] text-[var(--text-3)]">No submitted responses yet.</p>
          )}
        </Card>

        <Card>
          <h2 className="mb-2 text-[1.1rem]">Dimension detail</h2>
          <p className="mb-4 text-[0.85rem] text-[var(--text-2)]">
            Spread shows how far apart respondents are. Anything at or above 1.5 is worth raising in
            the findings — it usually means management and operational staff see different organizations.
          </p>
          {!agreement.length ? (
            <p className="text-[0.9rem] text-[var(--text-3)]">Needs two or more submitted responses.</p>
          ) : (
            <table className="w-full border-collapse text-[0.88rem]">
              <thead>
                <tr className="border-b border-[var(--line)] text-left text-[0.78rem] text-[var(--text-3)]">
                  <th className="pb-2 font-semibold">Dimension</th>
                  <th className="pb-2 text-right font-semibold">Mean</th>
                  <th className="pb-2 text-right font-semibold">Range</th>
                  <th className="pb-2 text-right font-semibold">Spread</th>
                </tr>
              </thead>
              <tbody>
                {agreement.map((d) => (
                  <tr key={d.key} className="border-b border-[var(--line)]">
                    <td className="py-2">{d.label}</td>
                    <td className="py-2 text-right">{d.mean.toFixed(1)}</td>
                    <td className="py-2 text-right text-[var(--text-2)]">
                      {d.min.toFixed(1)}–{d.max.toFixed(1)}
                    </td>
                    <td className="py-2 text-right font-semibold"
                        style={{ color: d.spread >= 1.5 ? "#E4572E" : d.spread >= 0.8 ? "#F2A03D" : "inherit" }}>
                      {d.spread.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>

      <h2 className="mb-4 text-[1.15rem]">Employees ({members.length})</h2>
      <div className="mb-10 overflow-x-auto">
        <table className="w-full min-w-[620px] border-collapse text-[0.92rem]">
          <thead>
            <tr className="border-b border-[var(--line)] text-left text-[0.8rem] text-[var(--text-3)]">
              <th className="pb-3 font-semibold">Name</th>
              <th className="pb-3 font-semibold">Email</th>
              <th className="pb-3 font-semibold">Role</th>
              <th className="pb-3 font-semibold">Department</th>
              <th className="pb-3 font-semibold">Access</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="border-b border-[var(--line)]">
                <td className="py-3 font-medium">{m.name || "—"}</td>
                <td className="py-3 text-[var(--text-2)]">{m.email}</td>
                <td className="py-3 text-[var(--text-2)]">{m.job_role || "—"}</td>
                <td className="py-3 text-[var(--text-2)]">{m.department || "—"}</td>
                <td className="py-3 text-[var(--text-2)]">
                  {m.role === "company_admin" ? "Administrator" : "Member"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mb-4 text-[1.15rem]">Answers</h2>
      {submitted.length === 0 ? (
        <Card><p className="text-[var(--text-2)]">No submitted responses yet.</p></Card>
      ) : (
        <div className="grid gap-6">
          {submitted.map((r) => (
            <Card key={r.id}>
              <div className="mb-4 flex flex-wrap items-center gap-3 border-b border-[var(--line)] pb-4">
                <div>
                  <div className="font-display text-[1rem] font-bold">{r.name || r.email}</div>
                  <div className="text-[0.82rem] text-[var(--text-3)]">
                    {[r.job_role, r.department].filter(Boolean).join(" · ") || "no role given"} ·{" "}
                    {r.assessment_title}
                  </div>
                </div>
                <div className="ml-auto text-right">
                  <div className="font-display text-[1.3rem] font-bold">
                    {overallScore(r.scores as Scores).toFixed(1)}
                  </div>
                  <div className="text-[0.78rem] text-[var(--text-3)]">overall</div>
                </div>
              </div>

              <div className="mb-5 flex flex-wrap gap-2">
                {DIMENSIONS.map((d) => {
                  const v = (r.scores as Scores)[d.key];
                  return (
                    <span key={d.key}
                      className="rounded-full border border-[var(--line-2)] px-3 py-1 text-[0.78rem] text-[var(--text-2)]">
                      {d.label} {v ? v.toFixed(1) : "—"}
                    </span>
                  );
                })}
              </div>

              <details>
                <summary className="cursor-pointer text-[0.88rem] font-semibold text-[var(--sky)]">
                  Question-by-question answers
                </summary>
                <div className="mt-4 grid gap-4">
                  {QUESTION_STEPS.map((step, si) => (
                    <div key={step.title}>
                      <div className="mb-2 text-[0.8rem] font-semibold text-[var(--text-3)]">{step.title}</div>
                      <ul className="grid gap-2">
                        {step.questions.map((q, qi) => {
                          const v = (r.answers as Record<string, number>)[`q${si}_${qi}`];
                          return (
                            <li key={q.q} className="text-[0.87rem]">
                              <span className="text-[var(--text-2)]">{q.q}</span>
                              <br />
                              <span className="font-medium">
                                {v ? `${v} · ${q.a[v - 1]}` : "no answer"}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              </details>
            </Card>
          ))}
        </div>
      )}
    </AppShell>
  );
}
