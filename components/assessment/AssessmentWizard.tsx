"use client";

import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { Wordmark } from "@/components/Wordmark";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/lib/language";
import { getDimensions, type DimensionKey, type Scores } from "@/lib/dimensions";
import { getQuestionSteps, TOTAL_STEPS } from "./steps";
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

const COPY = {
  mn: {
    complete: "Дууссан",
    stepOf: (step: number, total: number) => `Алхам ${step} / ${total}`,
    close: "Хаах",
    companyInfo: "Байгууллагын мэдээлэл",
    tellUs: "Байгууллагаасаа өгүүлээрэй.",
    contextLede: "Нөхцөл байдал харьцуулалтыг тодорхойлдог. Энд юуг ч оноогддоггүй.",
    companyName: "Байгууллагын нэр",
    companyPlaceholder: "Таны байгууллага",
    industry: "Салбар",
    industryOptions: ["Жижиглэн худалдаа, дистрибьюшн", "Үйлдвэрлэл", "Ложистик", "Зочид буудал, үйлчилгээ", "Санхүүгийн үйлчилгээ", "Мэргэжлийн үйлчилгээ", "Бусад"],
    employees: "Ажилтны тоо",
    employeesOptions: ["1–20", "21–100", "101–500", "501–2,000", "2,000+"],
    locations: "Салбарын тоо",
    locationsOptions: ["1", "2–10", "11–50", "51–200", "200+"],
    revenue: "Ойролцоо жилийн орлого",
    revenueOptions: ["₮1 тэрбумаас доош", "₮1–10 тэрбум", "₮10–50 тэрбум", "₮50–200 тэрбум", "₮200 тэрбумаас дээш", "Хэлэхгүй байх"],
    select: "Сонгох",
    almostDone: "Бараг дууссан",
    sendResults: "Үр дүнгээ хаана авах вэ?",
    sendResultsLede:
      "Дараагийн дэлгэцэнд бэлэн байдлын профайлаа харах болно. SKYVIS-ийн зөвлөх бүрэн бичгээр үнэлгээг — хэмжигдэхүүн бүрээр, тэргүүлэх арга хэмжээтэй — бэлтгэн, ажлын хоёр өдрийн дотор илгээнэ.",
    fullName: "Овог нэр",
    workEmail: "Ажлын имэйл",
    phone: "Утас",
    role: "Албан тушаал",
    rolePlaceholder: "ж.нь. Үйл ажиллагааны захирал",
    back: "Буцах",
    continueBtn: "Үргэлжлүүлэх",
    seeResults: "Үр дүнгээ харах",
    oneLeft: "Энэ алхамд нэг асуулт үлдсэн.",
    manyLeft: (n: number) => `Энэ алхамд ${n} асуулт үлдсэн.`,
  },
  en: {
    complete: "Complete",
    stepOf: (step: number, total: number) => `Step ${step} of ${total}`,
    close: "Close",
    companyInfo: "Company information",
    tellUs: "Tell us about your organization.",
    contextLede: "Context shapes the benchmark. Nothing here is scored.",
    companyName: "Company name",
    companyPlaceholder: "Your company",
    industry: "Industry",
    industryOptions: ["Retail & distribution", "Manufacturing", "Logistics", "Hospitality", "Financial services", "Professional services", "Other"],
    employees: "Number of employees",
    employeesOptions: ["1–20", "21–100", "101–500", "501–2,000", "2,000+"],
    locations: "Number of locations",
    locationsOptions: ["1", "2–10", "11–50", "51–200", "200+"],
    revenue: "Approximate annual revenue",
    revenueOptions: ["Under ₮1bn", "₮1–10bn", "₮10–50bn", "₮50–200bn", "Over ₮200bn", "Prefer not to say"],
    select: "Select",
    almostDone: "Almost done",
    sendResults: "Where should we send your results?",
    sendResultsLede:
      "You'll see your maturity profile on the next screen. A SKYVIS consultant prepares the full written assessment — dimension by dimension, with prioritised actions — and sends it within two working days.",
    fullName: "Full name",
    workEmail: "Work email",
    phone: "Phone",
    role: "Your role",
    rolePlaceholder: "e.g. Operations Director",
    back: "Back",
    continueBtn: "Continue",
    seeResults: "See my results",
    oneLeft: "One question left on this step.",
    manyLeft: (n: number) => `${n} questions left on this step.`,
  },
};

export function AssessmentWizard() {
  const router = useRouter();
  const topRef = useRef<HTMLDivElement>(null);
  const { locale } = useLanguage();
  const t = COPY[locale];
  const QUESTION_STEPS = getQuestionSteps(locale);

  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Answers>({});
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

    return getDimensions(locale).reduce((acc, d) => {
      const c = counts[d.key] ?? 0;
      acc[d.key] = c ? Math.round(((sums[d.key] ?? 0) / c) * 10) / 10 : 2.5;
      return acc;
    }, {} as Scores);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, locale]);

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
        setHint(missing === 1 ? t.oneLeft : t.manyLeft(missing));
        return;
      }
    }

    if (step === TOTAL_STEPS) {
      // Submit here. See app/api/assessment/route.ts for the endpoint stub.
      void fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, contact, answers, scores }),
      }).catch(() => {
        /* Result still shows if the endpoint isn't wired up yet. */
      });
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
              {isResult ? t.complete : t.stepOf(step, TOTAL_STEPS)}
            </span>
            <LanguageToggle className="ml-auto" />
            <button
              type="button"
              onClick={() => router.push("/")}
              className="cursor-pointer rounded-full border border-[var(--line-2)] px-[18px] py-[9px] text-[0.88rem] font-semibold text-[var(--text-2)] transition-colors hover:border-[var(--sky)] hover:text-[var(--sky)]"
            >
              {t.close}
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
            <div className="mb-[14px] text-[0.85rem] font-semibold text-[var(--sky)]">{t.companyInfo}</div>
            <h2 className="text-[clamp(1.6rem,1.2rem+1.6vw,2.2rem)]">{t.tellUs}</h2>
            <p className="lede mb-[38px] mt-4">{t.contextLede}</p>

            <div className="grid gap-[18px] sm:grid-cols-2">
              <div className="field sm:col-span-2">
                <label htmlFor="company">{t.companyName}</label>
                <input
                  id="company" type="text" placeholder={t.companyPlaceholder} value={company.company}
                  onChange={(e) => setCompany({ ...company, company: e.target.value })}
                />
              </div>
              <Select
                id="industry" label={t.industry} value={company.industry}
                onChange={(v) => setCompany({ ...company, industry: v })}
                options={t.industryOptions} selectLabel={t.select}
              />
              <Select
                id="employees" label={t.employees} value={company.employees}
                onChange={(v) => setCompany({ ...company, employees: v })}
                options={t.employeesOptions} selectLabel={t.select}
              />
              <Select
                id="locations" label={t.locations} value={company.locations}
                onChange={(v) => setCompany({ ...company, locations: v })}
                options={t.locationsOptions} selectLabel={t.select}
              />
              <Select
                id="revenue" label={t.revenue} value={company.revenue}
                onChange={(v) => setCompany({ ...company, revenue: v })}
                options={t.revenueOptions} selectLabel={t.select}
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
            <div className="mb-[14px] text-[0.85rem] font-semibold text-[var(--sky)]">{t.almostDone}</div>
            <h2 className="text-[clamp(1.6rem,1.2rem+1.6vw,2.2rem)]">{t.sendResults}</h2>
            <p className="lede mb-[38px] mt-4">{t.sendResultsLede}</p>
            <div className="grid gap-[18px] sm:grid-cols-2">
              <Field id="name" label={t.fullName} value={contact.name} autoComplete="name" onChange={(v) => setContact({ ...contact, name: v })} />
              <Field id="email" label={t.workEmail} type="email" value={contact.email} autoComplete="email" onChange={(v) => setContact({ ...contact, email: v })} />
              <Field id="phone" label={t.phone} type="tel" value={contact.phone} autoComplete="tel" onChange={(v) => setContact({ ...contact, phone: v })} />
              <Field id="role" label={t.role} placeholder={t.rolePlaceholder} value={contact.role} onChange={(v) => setContact({ ...contact, role: v })} />
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
              {t.back}
            </button>
            <span className="text-[0.85rem] text-[var(--text-3)]">{hint}</span>
            <button type="button" className="btn btn-p ml-auto" onClick={next}>
              {step === TOTAL_STEPS ? t.seeResults : t.continueBtn}
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
  id, label, value, onChange, options, selectLabel,
}: {
  id: string; label: string; value: string; onChange: (v: string) => void; options: string[]; selectLabel: string;
}) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{selectLabel}</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
