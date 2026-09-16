"use client";

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "./Reveal";
import { useLanguage } from "@/lib/language";

const STEPS = {
  mn: [
    { n: "01", title: "Үнэлэх", body: "Бизнес өнөөдөр хэлтэс хэлтсээр хэрхэн ажилладгийг ойлгоно." },
    { n: "02", title: "Оношлох", body: "Шинж тэмдгийг шалтгаанаас, асуудлыг боломжоос салгана." },
    { n: "03", title: "Тэргүүлэх", body: "Хамгийн шинэ зүйлээр биш, бий болгох үнэ цэнэ болон шаардлагатай хүчин зүтгэлээр эрэмбэлнэ." },
    { n: "04", title: "Загварчлах", body: "Юу ч бүтээхээсээ өмнө ирээдүйн үйл ажиллагааны загварыг зохиомжлоно." },
    { n: "05", title: "Бүтээх", body: "Загвар шаарддаг системүүдийг хөгжүүлж, нэгтгэнэ." },
    { n: "06", title: "Хэрэгжүүлэх", body: "Нэвтрүүлж, сургаж, байгууллагаар бодитоор ашиглуулна." },
    { n: "07", title: "Хэмжих", body: "Кэйс баталгаажсан бизнесийн үр дүнг хянан хэмжинэ." },
    { n: "08", title: "Оптимчлох", body: "Анхны хувилбар ажиллаж, ойлгогдсоны дараа ч сайжруулалтыг үргэлжлүүлнэ." },
  ],
  en: [
    { n: "01", title: "Assess", body: "Understand how the business runs today, department by department." },
    { n: "02", title: "Diagnose", body: "Separate symptoms from causes, and problems from opportunities." },
    { n: "03", title: "Prioritize", body: "Rank by value created and effort required, not by what's newest." },
    { n: "04", title: "Design", body: "Model the future-state operating model before anything is built." },
    { n: "05", title: "Build", body: "Develop and integrate the systems the design depends on." },
    { n: "06", title: "Implement", body: "Roll out, train, and get the organization genuinely using it." },
    { n: "07", title: "Measure", body: "Track the business outcomes the case was approved against." },
    { n: "08", title: "Optimize", body: "Keep improving once the first version is live and understood." },
  ],
};

const HEAD = {
  mn: {
    h2: "Нарийн байдлаас өсөлт хүртэлх тодорхой зам.",
    lede: "Найм шат, дэс дараалалтай. Бид шууд бүтээх шат руу үсэрдэггүй, учир нь бүтээх нь алдаа гаргахад хамгийн өртөгтэй хэсэг юм.",
  },
  en: {
    h2: "A clear path from complexity to growth.",
    lede: "Eight stages, in order. We don't skip to the build, because the build is the expensive part to get wrong.",
  },
};

export function MethodologySection() {
  const reduce = useReducedMotion();
  const { locale } = useLanguage();
  const steps = STEPS[locale];
  const head = HEAD[locale];

  return (
    <section className="section" id="methodology">
      <div className="wrap">
        <Reveal className="sec-head">
          <h2>{head.h2}</h2>
          <p className="lede">{head.lede}</p>
        </Reveal>

        <div className="grid gap-px overflow-hidden rounded-card border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div
              key={s.n}
              className="relative bg-[var(--surface)] p-[clamp(22px,2.6vw,30px)] transition-colors hover:bg-[var(--bg-alt)]"
            >
              <motion.span
                className="absolute left-0 top-0 h-[2px] bg-[var(--sky)]"
                initial={reduce ? false : { width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.09 }}
              />
              <div className="text-[0.85rem] font-bold tracking-[0.02em] text-[var(--sky)]">{s.n}</div>
              <h3 className="mb-[9px] mt-[14px] text-[1.08rem]">{s.title}</h3>
              <p className="text-[0.92rem] leading-[1.55] text-[var(--text-2)]">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
