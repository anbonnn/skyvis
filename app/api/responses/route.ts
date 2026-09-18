import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { auth } from "@/auth";
import { scoreAnswers } from "@/lib/scoring";

export const runtime = "nodejs";

/** Save progress (autosave) or submit a completed response. */
export async function POST(request: Request) {
  const session = await auth();
  const user = session?.user;
  if (!user?.id) return NextResponse.json({ ok: false }, { status: 401 });

  const body = await request.json().catch(() => null);
  const assessmentId = String(body?.assessmentId ?? "");
  const answers = (body?.answers ?? {}) as Record<string, number>;
  const submit = Boolean(body?.submit);

  if (!assessmentId) {
    return NextResponse.json({ ok: false, error: "Missing assessment" }, { status: 400 });
  }

  // The assessment must belong to this user's company and still be open.
  const { rows: a } = await sql`
    SELECT id FROM assessments
    WHERE id = ${assessmentId} AND company_id = ${user.companyId} AND status = 'open'
    LIMIT 1
  `;
  if (!a.length) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });

  const scores = submit ? scoreAnswers(answers) : null;

  await sql`
    INSERT INTO responses (assessment_id, user_id, answers, scores, submitted_at, updated_at)
    VALUES (${assessmentId}, ${user.id}, ${JSON.stringify(answers)},
            ${scores ? JSON.stringify(scores) : null},
            ${submit ? new Date().toISOString() : null}, now())
    ON CONFLICT (assessment_id, user_id) DO UPDATE
      SET answers = excluded.answers,
          scores = coalesce(excluded.scores, responses.scores),
          submitted_at = coalesce(excluded.submitted_at, responses.submitted_at),
          updated_at = now()
  `;

  return NextResponse.json({ ok: true, scores });
}
