"use client";

import Link from "next/link";
import { Reveal } from "./Reveal";
import { RadarChart, ScoreBars } from "./RadarChart";
import { Counter } from "./Counter";
import { getDimensions, DEMO_SCORES } from "@/lib/dimensions";
import { useLanguage } from "@/lib/language";

const COPY = {
  mn: {
    h2: "Дижитал бэлэн байдлаа мэдэж, дараа нь юу хийхээ мэдэрх.",
    lede:
      "SKYVIS Дижитал Үнэлгээ нь таны байгууллага технологиор ашиг тус бий болгох чадавхийг арван хэмжигдэхүүнээр үнэлж, ижил төрлийн үйл ажиллагаатай харьцуулж, эрэмбэлэгдсэн төлөвлөгөө болгон хувиргадаг.",
    footnote:
      "Оноо дан ганцаараа юу ч өөрчлөхгүй. Бид хэмждэг хэмжигдэхүүн бүрийг чухал зүйл рүү хөрвүүлдэг: өнөөдөр танд юу зардал болж байгаа, эхлээд юу хийхээ.",
    cta: "Үнэлгээ хийлгэх хүсэлт илгээх",
    panelTitle: "Дижитал бэлэн байдлын профайл",
    radarAria: "Арван хэмжигдэхүүн дундаж 2.7/5 үнэлгээтэй радар диаграм.",
    overall: "Нийт дижитал бэлэн байдал",
  },
  en: {
    h2: "Know your digital maturity. Know what to do next.",
    lede:
      "The SKYVIS Digital Assessment evaluates the capabilities that determine how effectively your organization can use technology to create business value — measured across ten dimensions, scored against comparable operations, and translated into a prioritised plan.",
    footnote:
      "A score on its own changes nothing. Every dimension we measure is carried through to the thing that matters: what it costs you today, and what to do about it first.",
    cta: "Request an assessment",
    panelTitle: "Digital maturity profile",
    radarAria: "Radar chart showing maturity scores across ten dimensions, averaging 2.7 out of 5.",
    overall: "Overall digital maturity",
  },
};

export function AssessmentSection() {
  const { locale } = useLanguage();
  const t = COPY[locale];
  const dimensions = getDimensions(locale);

  return (
    <section className="section" id="assessment">
      <div className="wrap">
        <Reveal className="sec-head">
          <h2>{t.h2}</h2>
          <p className="lede">{t.lede}</p>
        </Reveal>

        <div className="grid items-center gap-[clamp(30px,4vw,60px)] lg:grid-cols-[0.92fr_1.08fr]">
          <Reveal>
            <div className="flex flex-wrap gap-2">
              {dimensions.map((d) => (
                <span
                  key={d.key}
                  className="rounded-full border border-[var(--line-2)] px-[15px] py-[7px] text-[0.85rem] font-medium text-[var(--text-2)]"
                >
                  {d.full}
                </span>
              ))}
            </div>
            <p className="lede mt-7">{t.footnote}</p>
            <Link href="/assessment" className="btn btn-p mt-7">{t.cta}</Link>
          </Reveal>

          <Reveal>
            <div
              className="overflow-hidden rounded-card border border-[var(--line)] bg-[var(--surface)]"
              style={{ boxShadow: "var(--shadow-lg)" }}
            >
              <div className="flex items-center justify-between gap-4 border-b border-[var(--line)] px-6 py-[18px]">
                <b className="font-display text-[0.95rem] font-bold">{t.panelTitle}</b>
              </div>
              <div className="grid sm:grid-cols-[1fr_250px]">
                <div className="flex items-center justify-center px-[10px] pb-[22px] pt-[18px]">
                  <RadarChart scores={DEMO_SCORES} label={t.radarAria} />
                </div>
                <div className="flex flex-col gap-5 border-t border-[var(--line)] p-6 sm:border-l sm:border-t-0">
                  <div>
                    <div className="font-display text-[3.3rem] font-extrabold leading-none tracking-[-0.045em] text-[var(--sky)]">
                      <Counter to={2.7} decimals={1} />
                      <small className="text-[1.1rem] font-semibold tracking-[-0.02em] text-[var(--text-3)]"> / 5</small>
                    </div>
                    <div className="mt-[6px] text-[0.84rem] font-semibold text-[var(--text-3)]">
                      {t.overall}
                    </div>
                  </div>
                  <ScoreBars scores={DEMO_SCORES} />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
