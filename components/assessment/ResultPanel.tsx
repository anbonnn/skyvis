"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { RadarChart, ScoreBars } from "@/components/RadarChart";
import { averageScore, maturityBand, rankDimensions, type Scores } from "@/lib/dimensions";

export function ResultPanel({ scores, onClose }: { scores: Scores; onClose: () => void }) {
  const overall = averageScore(scores);
  const band = maturityBand(overall);
  const ranked = rankDimensions(scores);
  const weakest = ranked.slice(0, 2).map((d) => d.label.toLowerCase());
  const strongest = ranked[ranked.length - 1].label.toLowerCase();

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
          Your digital assessment is being prepared
        </div>
        <div className="font-display text-[4.6rem] font-extrabold leading-none tracking-[-0.045em] text-[var(--sky)]">
          {shown.toFixed(1)}
          <small className="text-[1.1rem] font-semibold tracking-[-0.02em] text-[var(--text-3)]"> / 5</small>
        </div>
        <div className="mt-[6px] text-[0.84rem] font-semibold text-[var(--text-3)]">
          Overall digital maturity
        </div>
      </div>

      <div className="my-9 grid items-center gap-[34px] sm:grid-cols-2">
        <RadarChart scores={scores} label="Your maturity profile across ten dimensions." />
        <ScoreBars scores={scores} />
      </div>

      <div className="rounded-[14px] border border-[var(--line)] bg-[var(--bg-alt)] px-6 py-[22px] text-[0.92rem] leading-[1.6] text-[var(--text-2)]">
        <strong className="text-[var(--text)]">{band.name} maturity.</strong> {band.copy} Your
        strongest dimension is {strongest}. The two with the most room are {weakest[0]} and{" "}
        {weakest[1]} — expect those to lead the recommended actions in your full report.
      </div>

      <div className="mt-[14px] rounded-[14px] border border-[var(--line)] bg-[var(--bg-alt)] px-6 py-[22px] text-[0.92rem] leading-[1.6] text-[var(--text-2)]">
        Nothing has been submitted yet. Wire <code className="text-[var(--text)]">app/api/assessment/route.ts</code>{" "}
        to your CRM or email provider and this result will reach your team automatically.
      </div>

      <div className="mt-10 flex items-center gap-3 border-t border-[var(--line)] pt-7">
        <button type="button" className="btn btn-s" onClick={onClose}>
          Back to site
        </button>
      </div>
    </div>
  );
}
