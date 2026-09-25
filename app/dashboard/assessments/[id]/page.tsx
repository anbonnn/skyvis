import Link from "next/link";
import { notFound } from "next/navigation";
import { sql } from "@vercel/postgres";
import { requireUser } from "@/lib/auth-helpers";
import { AppShell, PageHead, Card, Stat } from "@/components/app/AppShell";
import { RadarChart } from "@/components/RadarChart";
import { agreementProfile, companyProfile, overallScore } from "@/lib/scoring";
import { maturityBand, type Scores } from "@/lib/dimensions";

export const dynamic = "force-dynamic";

const NAV = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/map", label: "Business map" },
  { href: "/dashboard/team", label: "Team" },
];

export default async function AssessmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();

  const { rows: a } = await sql`
    SELECT id, title, status, created_at FROM assessments
    WHERE id = ${id} AND company_id = ${user.companyId} LIMIT 1
  `;
  if (!a.length) notFound();
  const assessment = a[0];

  const { rows: responses } = await sql`
    SELECT r.id, r.scores, r.submitted_at, r.answers,
           u.id AS user_id, u.name, u.email, u.job_role, u.department
    FROM responses r
    JOIN users u ON u.id = r.user_id
    WHERE r.assessment_id = ${id}
    ORDER BY u.created_at
  `;

  const submitted = responses.filter((r) => r.submitted_at);
  const scoreSets = submitted.map((r) => r.scores as Scores);
  const mine = responses.find((r) => r.user_id === user.id);

  const profile = scoreSets.length ? companyProfile(scoreSets) : null;
  const overall = profile ? overallScore(profile) : 0;
  const band = profile ? maturityBand(overall) : null;
  const agreement = scoreSets.length > 1 ? agreementProfile(scoreSets) : [];
  const contested = [...agreement].sort((x, y) => y.spread - x.spread).slice(0, 3);

  return (
    <AppShell nav={NAV} user={user}>
      <PageHead
        title={assessment.title}
        sub={`${submitted.length} of ${responses.length || 0} responses submitted · ${assessment.status}`}
        action={
          assessment.status === "open" && !mine?.submitted_at ? (
            <Link href={`/assessment?a=${assessment.id}`} className="btn btn-p">
              {mine ? "Continue your response" : "Start your response"}
            </Link>
          ) : undefined
        }
      />

      {!scoreSets.length ? (
        <Card>
          <p className="text-[var(--text-2)]">
            No submitted responses yet. Results appear once at least one person completes the assessment.
          </p>
        </Card>
      ) : (
        <>
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <Stat value={overall.toFixed(1)} label="Overall maturity (mean of respondents)" />
            <Stat value={band?.name ?? "—"} label="Band" />
            <Stat value={submitted.length} label="Respondents" />
          </div>

          <div className="mb-8 grid gap-6 lg:grid-cols-2">
            <Card>
              <h2 className="mb-4 text-[1.1rem]">Company profile</h2>
              {profile && <RadarChart scores={profile} label="Maturity across ten dimensions." />}
            </Card>

            <Card>
              <h2 className="mb-2 text-[1.1rem]">Where respondents disagree</h2>
              <p className="mb-5 text-[0.89rem] text-[var(--text-2)]">
                A wide spread means people inside the same organization describe the same capability
                differently. That gap is usually more diagnostic than the average.
              </p>
              {scoreSets.length < 2 ? (
                <p className="text-[0.9rem] text-[var(--text-3)]">
                  Needs at least two submitted responses.
                </p>
              ) : (
                <ul className="grid gap-4">
                  {contested.map((d) => (
                    <li key={d.key}>
                      <div className="mb-1 flex justify-between text-[0.87rem]">
                        <span className="font-medium">{d.label}</span>
                        <span className="text-[var(--text-3)]">
                          {d.min.toFixed(1)} – {d.max.toFixed(1)}
                        </span>
                      </div>
                      <div className="h-[6px] rounded-full bg-[var(--line)]">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(d.spread / 4) * 100}%`,
                            background: d.spread >= 1.5 ? "#E4572E" : d.spread >= 0.8 ? "#F2A03D" : "var(--sky)",
                          }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>

          <h2 className="mb-4 text-[1.15rem]">Responses</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] border-collapse text-[0.92rem]">
              <thead>
                <tr className="border-b border-[var(--line)] text-left text-[0.8rem] text-[var(--text-3)]">
                  <th className="pb-3 font-semibold">Respondent</th>
                  <th className="pb-3 font-semibold">Role</th>
                  <th className="pb-3 font-semibold">Department</th>
                  <th className="pb-3 text-right font-semibold">Overall</th>
                  <th className="pb-3 text-right font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {responses.map((r) => (
                  <tr key={r.id} className="border-b border-[var(--line)]">
                    <td className="py-3">
                      <div className="font-medium">{r.name || r.email}</div>
                    </td>
                    <td className="py-3 text-[var(--text-2)]">{r.job_role || "—"}</td>
                    <td className="py-3 text-[var(--text-2)]">{r.department || "—"}</td>
                    <td className="py-3 text-right">
                      {r.submitted_at ? overallScore(r.scores as Scores).toFixed(1) : "—"}
                    </td>
                    <td className="py-3 text-right text-[var(--text-2)]">
                      {r.submitted_at ? "Submitted" : "In progress"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </AppShell>
  );
}
