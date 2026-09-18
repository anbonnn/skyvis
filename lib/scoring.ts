import { DIMENSIONS, type DimensionKey, type Scores } from "./dimensions";
import { QUESTION_STEPS } from "@/components/assessment/steps";

export type Answers = Record<string, number>;

/** Per-dimension mean for one respondent's answers. */
export function scoreAnswers(answers: Answers): Scores {
  const sums: Partial<Record<DimensionKey, number>> = {};
  const counts: Partial<Record<DimensionKey, number>> = {};

  QUESTION_STEPS.forEach((step, si) =>
    step.questions.forEach((q, qi) => {
      const v = answers[`q${si}_${qi}`];
      if (!v) return;
      const dim = q.dim as DimensionKey;
      sums[dim] = (sums[dim] ?? 0) + v;
      counts[dim] = (counts[dim] ?? 0) + 1;
    })
  );

  return DIMENSIONS.reduce((acc, d) => {
    const c = counts[d.key] ?? 0;
    acc[d.key] = c ? Math.round(((sums[d.key] ?? 0) / c) * 10) / 10 : 0;
    return acc;
  }, {} as Scores);
}

export function overallScore(scores: Scores): number {
  const vals = DIMENSIONS.map((d) => scores[d.key]).filter((v) => v > 0);
  if (!vals.length) return 0;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

export interface DimensionAgreement {
  key: DimensionKey;
  label: string;
  mean: number;
  min: number;
  max: number;
  spread: number;
  respondents: number;
}

/**
 * Where respondents disagree.
 *
 * The spread between the highest and lowest answer on a dimension is often
 * more diagnostic than the mean: when leadership and operational staff
 * describe the same capability a full level apart, that divergence is itself
 * the finding.
 */
export function agreementProfile(all: Scores[]): DimensionAgreement[] {
  return DIMENSIONS.map((d) => {
    const vals = all.map((s) => s[d.key]).filter((v) => v > 0);
    if (!vals.length) {
      return { key: d.key, label: d.full, mean: 0, min: 0, max: 0, spread: 0, respondents: 0 };
    }
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    return {
      key: d.key,
      label: d.full,
      mean: Math.round(mean * 10) / 10,
      min,
      max,
      spread: Math.round((max - min) * 10) / 10,
      respondents: vals.length,
    };
  });
}

/** Company profile: the mean across every submitted response. */
export function companyProfile(all: Scores[]): Scores {
  return DIMENSIONS.reduce((acc, d) => {
    const vals = all.map((s) => s[d.key]).filter((v) => v > 0);
    acc[d.key] = vals.length
      ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10
      : 0;
    return acc;
  }, {} as Scores);
}

export function totalQuestions(): number {
  return QUESTION_STEPS.reduce((n, s) => n + s.questions.length, 0);
}
