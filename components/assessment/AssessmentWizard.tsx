"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Wordmark } from "@/components/Wordmark";
import { DIMENSIONS, type DimensionKey, type Scores } from "@/lib/dimensions";
import { QUESTION_STEPS, TOTAL_STEPS } from "./steps";
import { ResultPanel } from "./ResultPanel";

type Answers = Record<string, number>;

interface Company {
  company: string;
  industry: string;
  employees: string;
  locations: string;
  revenue: string;
}

interface Contact {
  name: string;
  email: string;
  phone: string;
  role: string;
}

const RESULT_STEP = TOTAL_STEPS + 1;

export function AssessmentWizard({
  assessmentId,
  savedAnswers,
}: {
  assessmentId?: string;
  savedAnswers?: Answers;
} = {}) {
  const router = useRouter();
  const topRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Answers>(savedAnswers ?? {});
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [hint, setHint] = useState("");
  const [company, setCompany] = useState<Company>({
    company: "", industry: "", employees: "", locations: "", revenue: "",
  });
  const [contact, setContact] = useState<Contact>({ name: "", email: "", phone: "", role: "" });

  const scores: Scores = useMemo(() => {
    const sums: Partial<Record<DimensionKey, number>> = {};
    const counts: Partial<Record<DimensionKey, number>> = {};

    QUESTION_STEPS.forEach((s, si) =>
      s.questions.forEach((q, qi) => {
        const value = answers[`q${si}_${qi}`];
        if (!value) return;
        sums[q.dim] = (sums[q.dim] ?? 0) + value;
        counts[q.dim] = (counts[q.dim] ?? 0) + 1;
      })
    );

    return DIMENSIONS.reduce((acc, d) => {
      const c = counts[d.key] ?? 0;
      acc[d.key] = c ? Math.round(((sums[d.key] ?? 0) / c) * 10) / 10 : 2.5;
      return acc;
    }, {} as Scores);
  }, [answers]);

  // Autosave progress so a long instrument can be paused and resumed.
  useEffect(() => {
    if (!assessmentId || !Object.keys(answers).length) return;
    setSaveState("saving");
    const t = setTimeout(() => {
      fetch("/api/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assessmentId, answers }),
      })
        .then(() => setSaveState("saved"))
        .catch(() => setSaveState("idle"));
    }, 900);
    return () => clearTimeout(t);
  }, [answers, assessmentId]);

  const isQuestionStep = step >= 2 && step <= QUESTION_STEPS.length + 1;
  const questionStep = isQuestionStep ? QUESTION_STEPS[step - 2] : null;
  const isResult = step === RESULT_STEP;

  function scrollTop() {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function next() {
    if (questionStep) {
      const si = step - 2;
      const missing = questionStep.questions.filter((_, qi) => !answers[`q${si}_${qi}`]).length;
      if (missing > 0) {
        setHint(missing === 1 ? "One question left on this step." : `${missing} questions left on this step.`);
        return;
      }
    }

    if (step === TOTAL_STEPS) {
      if (assessmentId) {
        void fetch("/api/responses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ assessmentId, answers, submit: true }),
        }).catch(() => {
          /* The result still renders; the response is saved on the next attempt. */
        });
      }
      setStep(RESULT_STEP);
      scrollTop();
      return;
    }

    setHint("");
    setStep((s) => s + 1);
    scrollTop();
  }

  function back() {
    setHint("");
    setStep((s) => Math.max(1, s - 1));
    scrollTop();
  }

  const progress = isResult ? 100 : (step / TOTAL_STEPS) * 100;

  return (
    <div ref={topRef}>
      <div className="sticky top-0 z-10 border-b border-[var(--line)] bg-[var(--bg)]">
        <div className="wrap">
          <div className="flex h-[70px] items-center gap-[18px]">
            <Wordmark className="!text-[1.05rem]" />
            <span className="text-[0.85rem] text-[var(--text-3)]">
              {isResult ? "Complete" : `Step ${step} of ${TOTAL_STEPS}`}
              {assessmentId && saveState !== "idle" && (
                <span className="ml-2">{saveState === "saving" ? "· saving…" : "· saved"}</span>
              )}
            </span>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="ml-auto cursor-pointer rounded-full border border-[var(--line-2)] px-[18px] py-[9px] text-[0.88rem] font-semibold text-[var(--text-2)] transition-colors hover:border-[var(--sky)] hover:text-[var(--sky)]"
            >
              Close
            </button>
          </div>
        </div>
        <div className="h-[3px] bg-[var(--line)]">
          <div
            className="h-full bg-[var(--sky)] transition-[width] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mx-auto max-w-[790px] px-6 pb-[90px] pt-[clamp(34px,5vw,60px)]">
        {step === 1 && (
          <div>
            <div className="mb-[14px] text-[0.85rem] font-semibold text-[var(--sky)]">Company information</div>
            <h2 className="text-[clamp(1.6rem,1.2rem+1.6vw,2.2rem)]">Tell us about your organization.</h2>
            <p className="lede mb-[38px] mt-4">Context shapes the benchmark. Nothing here is scored.</p>

            <div className="grid gap-[18px] sm:grid-cols-2">
              <div className="field sm:col-span-2">
                <label htmlFor="company">Company name</label>
                <input
                  id="company" type="text" placeholder="Your company" value={company.company}
                  onChange={(e) => setCompany({ ...company, company: e.target.value })}
                />
              </div>
              <Select
                id="industry" label="Industry" value={company.industry}
                onChange={(v) => setCompany({ ...company, industry: v })}
                options={["Retail & distribution", "Manufacturing", "Logistics", "Hospitality", "Financial services", "Professional services", "Other"]}
              />
              <Select
                id="employees" label="Number of employees" value={company.employees}
                onChange={(v) => setCompany({ ...company, employees: v })}
                options={["1–20", "21–100", "101–500", "501–2,000", "2,000+"]}
              />
              <Select
                id="locations" label="Number of locations" value={company.locations}
                onChange={(v) => setCompany({ ...company, locations: v })}
                options={["1", "2–10", "11–50", "51–200", "200+"]}
              />
              <Select
                id="revenue" label="Approximate annual revenue" value={company.revenue}
                onChange={(v) => setCompany({ ...company, revenue: v })}
                options={["Under ₮1bn", "₮1–10bn", "₮10–50bn", "₮50–200bn", "Over ₮200bn", "Prefer not to say"]}
              />
            </div>
          </div>
        )}

        {questionStep && (
          <div>
            <div className="mb-[14px] text-[0.85rem] font-semibold text-[var(--sky)]">{questionStep.title}</div>
            <h2 className="text-[clamp(1.6rem,1.2rem+1.6vw,2.2rem)]">{questionStep.head}</h2>
            <p className="lede mb-[38px] mt-4">{questionStep.sub}</p>

            {questionStep.questions.map((q, qi) => {
              const name = `q${step - 2}_${qi}`;
              return (
                <div key={name} className={`py-[26px] ${qi ? "border-t border-[var(--line)]" : "pt-[6px]"}`}>
                  <p className="mb-4 text-[1.02rem] font-semibold tracking-[-0.015em]">{q.q}</p>
                  <div className="grid gap-2">
                    {q.a.map((option, oi) => (
                      <label key={option} className="opt">
                        <input
                          type="radio"
                          name={name}
                          checked={answers[name] === oi + 1}
                          onChange={() => {
                            setAnswers((a) => ({ ...a, [name]: oi + 1 }));
                            setHint("");
                          }}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {step === TOTAL_STEPS && (
          <div>
            <div className="mb-[14px] text-[0.85rem] font-semibold text-[var(--sky)]">Almost done</div>
            <h2 className="text-[clamp(1.6rem,1.2rem+1.6vw,2.2rem)]">Where should we send your results?</h2>
            <p className="lede mb-[38px] mt-4">
              You&apos;ll see your maturity profile on the next screen. A SKYVIS consultant prepares
              the full written assessment — dimension by dimension, with prioritised actions — and
              sends it within two working days.
            </p>
            <div className="grid gap-[18px] sm:grid-cols-2">
              <Field id="name" label="Full name" value={contact.name} autoComplete="name" onChange={(v) => setContact({ ...contact, name: v })} />
              <Field id="email" label="Work email" type="email" value={contact.email} autoComplete="email" onChange={(v) => setContact({ ...contact, email: v })} />
              <Field id="phone" label="Phone" type="tel" value={contact.phone} autoComplete="tel" onChange={(v) => setContact({ ...contact, phone: v })} />
              <Field id="role" label="Your role" placeholder="e.g. Operations Director" value={contact.role} onChange={(v) => setContact({ ...contact, role: v })} />
            </div>
          </div>
        )}

        {isResult && <ResultPanel scores={scores} onClose={() => router.push("/")} />}

        {!isResult && (
          <div className="mt-10 flex items-center gap-3 border-t border-[var(--line)] pt-7">
            <button
              type="button"
              className="btn btn-s"
              onClick={back}
              style={{ visibility: step === 1 ? "hidden" : "visible" }}
            >
              Back
            </button>
            <span className="text-[0.85rem] text-[var(--text-3)]">{hint}</span>
            <button type="button" className="btn btn-p ml-auto" onClick={next}>
              {step === TOTAL_STEPS ? "See my results" : "Continue"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  id, label, value, onChange, type = "text", placeholder, autoComplete,
}: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; autoComplete?: string;
}) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id} type={type} value={value} placeholder={placeholder} autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Select({
  id, label, value, onChange, options,
}: {
  id: string; label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Select</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
