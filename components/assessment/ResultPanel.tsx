"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { RadarChart, ScoreBars } from "@/components/RadarChart";
import { averageScore, maturityBand, rankDimensions, type Scores } from "@/lib/dimensions";
import { useLanguage } from "@/lib/language";

const COPY = {
  mn: {
    preparing: "Таны дижитал үнэлгээг бэлтгэж байна",
    overall: "Нийт дижитал бэлэн байдал",
    radarAria: "Арван хэмжигдэхүүнээр гарсан таны бэлэн байдлын профайл.",
    notSubmitted: "Одоогоор юу ч илгээгээгүй байна. ",
    wireUp: " -ийг CRM эсвэл имэйл үйлчилгээ тайгаа холбоход энэ үр дүн багийн тандаа автоматаар ирнэ.",
    back: "Сайт руу буцах",
    maturity: (name: string) => `${name} бэлэн байдал.`,
    summary: (copy: string, strongest: string, w1: string, w2: string) =>
      `${copy} Таны хамгийн хүчтэй хэмжигдэхүүн бол ${strongest}. Хамгийн их сайжруулах шаардлагатай хоёр хэмжигдэхүүн бол ${w1} болон ${w2} — эдгээр нь дэлгэрэнгүй тайлан дахь тэргүүлэх зөвлөмжийг тодорхойлно.`,
  },
  en: {
    preparing: "Your digital assessment is being prepared",
    overall: "Overall digital maturity",
    radarAria: "Your maturity profile across ten dimensions.",
    notSubmitted: "Nothing has been submitted yet. Wire ",
    wireUp: " to your CRM or email provider and this result will reach your team automatically.",
    back: "Back to site",
    maturity: (name: string) => `${name} maturity.`,
    summary: (copy: string, strongest: string, w1: string, w2: string) =>
      `${copy} Your strongest dimension is ${strongest}. The two with the most room are ${w1} and ${w2} — expect those to lead the recommended actions in your full report.`,
  },
};

export function ResultPanel({ scores, onClose }: { scores: Scores; onClose: () => void }) {
  const { locale } = useLanguage();
  const t = COPY[locale];
  const overall = averageScore(scores);
  const band = maturityBand(overall, locale);
  const ranked = rankDimensions(scores, locale);
  const format = (label: string) => (locale === "mn" ? label : label.toLowerCase());
  const weakest = ranked.slice(0, 2).map((d) => format(d.label));
  const strongest = format(ranked[ranked.length - 1].label);

  const reduce = useReducedMotion();
  const [shown, setShown] = useState(reduce ? overall : 0);

  useEffect(() => {
    if (reduce) return;
    let frame = 0;
    let start: number | null = null;
    const tick = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / 1200, 1);
      setShown(overall * (1 - Math.pow(1 - p, 3)));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [overall, reduce]);

  return (
    <div>
      <div className="pb-[6px] pt-5 text-center">
        <div className="mb-[18px] text-[0.85rem] font-semibold text-[var(--sky)]">
          {t.preparing}
        </div>
        <div className="font-display text-[4.6rem] font-extrabold leading-none tracking-[-0.045em] text-[var(--sky)]">
          {shown.toFixed(1)}
          <small className="text-[1.1rem] font-semibold tracking-[-0.02em] text-[var(--text-3)]"> / 5</small>
        </div>
        <div className="mt-[6px] text-[0.84rem] font-semibold text-[var(--text-3)]">
          {t.overall}
        </div>
      </div>

      <div className="my-9 grid items-center gap-[34px] sm:grid-cols-2">
        <RadarChart scores={scores} label={t.radarAria} />
        <ScoreBars scores={scores} />
      </div>

      <div className="rounded-[14px] border border-[var(--line)] bg-[var(--bg-alt)] px-6 py-[22px] text-[0.92rem] leading-[1.6] text-[var(--text-2)]">
        <strong className="text-[var(--text)]">{t.maturity(band.name)}</strong>{" "}
        {t.summary(band.copy, strongest, weakest[0], weakest[1])}
      </div>

      <div className="mt-[14px] rounded-[14px] border border-[var(--line)] bg-[var(--bg-alt)] px-6 py-[22px] text-[0.92rem] leading-[1.6] text-[var(--text-2)]">
        {t.notSubmitted}
        <code className="text-[var(--text)]">app/api/assessment/route.ts</code>
        {t.wireUp}
      </div>

      <div className="mt-10 flex items-center gap-3 border-t border-[var(--line)] pt-7">
        <button type="button" className="btn btn-s" onClick={onClose}>
          {t.back}
        </button>
      </div>
    </div>
  );
}
