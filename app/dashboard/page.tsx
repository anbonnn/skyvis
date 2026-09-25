import Link from "next/link";
import { sql } from "@vercel/postgres";
import { requireUser } from "@/lib/auth-helpers";
import { AppShell, PageHead, Card, Stat } from "@/components/app/AppShell";
import { NewAssessmentButton } from "@/components/app/Actions";
import { totalQuestions } from "@/lib/scoring";

export const dynamic = "force-dynamic";

const NAV = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/map", label: "Business map" },
  { href: "/dashboard/team", label: "Team" },
];

export default async function DashboardPage() {
  const user = await requireUser();
  if (user.role === "staff" && !user.companyId) {
    return (
      <AppShell user={user}>
        <PageHead title="SKYVIS staff" sub="You're signed in as staff." />
        <Link href="/admin" className="btn btn-p">Open the admin panel</Link>
      </AppShell>
    );
  }

  const { rows: assessments } = await sql`
    SELECT a.id, a.title, a.status, a.created_at,
           count(r.id) FILTER (WHERE r.submitted_at IS NOT NULL) AS submitted,
           count(r.id) AS started
    FROM assessments a
    LEFT JOIN responses r ON r.assessment_id = a.id
    WHERE a.company_id = ${user.companyId}
    GROUP BY a.id
    ORDER BY a.created_at DESC
  `;

  const { rows: team } = await sql`
    SELECT count(*)::int AS n FROM users WHERE company_id = ${user.companyId}
  `;

  const isAdmin = user.role === "company_admin" || user.role === "staff";

  return (
    <AppShell nav={NAV} user={user}>
      <PageHead
        title={user.companyName ?? "Your company"}
        sub="Assessments, responses, and results."
        action={isAdmin ? <NewAssessmentButton /> : undefined}
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Stat value={assessments.length} label="Assessments" />
        <Stat value={team[0]?.n ?? 0} label="People in your team" />
        <Stat value={totalQuestions()} label="Questions per response" />
      </div>

      <h2 className="mb-4 text-[1.15rem]">Assessments</h2>
      {assessments.length === 0 ? (
        <Card>
          <p className="text-[var(--text-2)]">
            No assessments yet.{" "}
            {isAdmin
              ? "Create one, then invite colleagues to respond."
              : "Ask your company administrator to start one."}
          </p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {assessments.map((a) => (
            <Link
              key={a.id}
              href={`/dashboard/assessments/${a.id}`}
              className="flex flex-wrap items-center gap-4 rounded-[14px] border border-[var(--line)] bg-[var(--surface)] px-6 py-5 transition-colors hover:border-[var(--sky)]"
            >
              <div>
                <div className="font-display text-[1.05rem] font-bold">{a.title}</div>
                <div className="mt-1 text-[0.84rem] text-[var(--text-3)]">
                  {new Date(a.created_at).toLocaleDateString()} · {a.status}
                </div>
              </div>
              <div className="ml-auto text-right">
                <div className="font-display text-[1.3rem] font-bold">{a.submitted}</div>
                <div className="text-[0.78rem] text-[var(--text-3)]">
                  submitted{Number(a.started) > Number(a.submitted) ? ` · ${Number(a.started) - Number(a.submitted)} in progress` : ""}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}
