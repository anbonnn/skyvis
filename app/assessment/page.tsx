import { redirect } from "next/navigation";
import { sql } from "@vercel/postgres";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { AssessmentWizard } from "@/components/assessment/AssessmentWizard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Digital assessment",
  description:
    "Answer the SKYVIS instrument across strategy, operations, technology, data, automation, and people.",
};

export default async function AssessmentPage({
  searchParams,
}: {
  searchParams: Promise<{ a?: string }>;
}) {
  const { a: requestedAssessment } = await searchParams;
  const session = await auth();
  const user = session?.user;

  // Signed out: the wizard runs as a public self-assessment and nothing is stored.
  if (!user?.companyId) {
    return <AssessmentWizard />;
  }

  let assessmentId = requestedAssessment ?? null;

  if (!assessmentId) {
    const { rows } = await sql`
      SELECT id FROM assessments
      WHERE company_id = ${user.companyId} AND status = 'open'
      ORDER BY created_at DESC LIMIT 1
    `;
    if (!rows.length) redirect("/dashboard");
    assessmentId = rows[0].id as string;
  }

  const { rows: mine } = await sql`
    SELECT answers, submitted_at FROM responses
    WHERE assessment_id = ${assessmentId} AND user_id = ${user.id} LIMIT 1
  `;

  if (mine[0]?.submitted_at) redirect(`/dashboard/assessments/${assessmentId}`);

  return (
    <AssessmentWizard
      assessmentId={assessmentId}
      savedAnswers={(mine[0]?.answers as Record<string, number>) ?? {}}
    />
  );
}
