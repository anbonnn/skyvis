"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import { DIMENSIONS, type Scores } from "@/lib/dimensions";

const CX = 160;
const CY = 146;
const R = 104;

function point(index: number, radius: number, count: number) {
  const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
  return [CX + Math.cos(angle) * radius, CY + Math.sin(angle) * radius] as const;
}

export function RadarChart({ scores, label }: { scores: Scores; label: string }) {
  const reduce = useReducedMotion();
  const n = DIMENSIONS.length;

  const { rings, axes, shape, nodes, labels } = useMemo(() => {
    const rings = [1, 2, 3, 4, 5].map((level) => {
      const d = DIMENSIONS.map((_, i) => {
        const [x, y] = point(i, (R * level) / 5, n);
        return `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
      }).join("");
      return `${d}Z`;
    });

    const axes = DIMENSIONS.map((_, i) => point(i, R, n));

    const shape =
      DIMENSIONS.map((dim, i) => {
        const value = Math.max(0.4, scores[dim.key] ?? 0);
        const [x, y] = point(i, (R * value) / 5, n);
        return `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
      }).join("") + "Z";

    const nodes = DIMENSIONS.map((dim, i) =>
      point(i, (R * Math.max(0.4, scores[dim.key] ?? 0)) / 5, n)
    );

    const labels = DIMENSIONS.map((dim, i) => {
      const [x, y] = point(i, R + 22, n);
      const cos = Math.cos((Math.PI * 2 * i) / n - Math.PI / 2);
      const anchor = cos > 0.3 ? "start" : cos < -0.3 ? "end" : "middle";
      return { x, y: y + 3.5, anchor, text: dim.label };
    });

    return { rings, axes, shape, nodes, labels };
  }, [scores, n]);

  return (
    <svg viewBox="0 0 320 300" role="img" aria-label={label} className="w-full">
      {rings.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="var(--line)" strokeWidth={1} />
      ))}
      {axes.map(([x, y], i) => (
        <line key={i} x1={CX} y1={CY} x2={x} y2={y} stroke="var(--line-2)" strokeWidth={1} />
      ))}
      <motion.path
        d={shape}
        fill="color-mix(in srgb, var(--sky) 22%, transparent)"
        stroke="var(--sky)"
        strokeWidth={2}
        strokeLinejoin="round"
        style={{ transformOrigin: `${CX}px ${CY}px` }}
        initial={reduce ? false : { scale: 0.2, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2.6} fill="var(--sky)" />
      ))}
      {labels.map((l, i) => (
        <text
          key={i}
          x={l.x}
          y={l.y}
          textAnchor={l.anchor as "start" | "middle" | "end"}
          className="fill-[var(--text-3)] text-[9.5px] font-medium"
        >
          {l.text}
        </text>
      ))}
    </svg>
  );
}

export function ScoreBars({ scores, count = 4 }: { scores: Scores; count?: number }) {
  const weakest = useMemo(
    () => [...DIMENSIONS].sort((a, b) => scores[a.key] - scores[b.key]).slice(0, count),
    [scores, count]
  );

  return (
    <div className="grid gap-[11px]">
      {weakest.map((dim) => {
        const value = scores[dim.key];
        return (
          <div key={dim.key} className="grid gap-[6px]">
            <div className="flex justify-between text-[0.79rem] font-medium text-[var(--text-2)]">
              <span>{dim.label}</span>
              <span>{value.toFixed(1)}</span>
            </div>
            <div className={`bar ${value < 2.2 ? "warn" : ""}`}>
              <span style={{ width: `${(value / 5) * 100}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
