"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const WAYPOINTS = [
  { x: 52, y: 382, r: 7, label: "Business", lx: 68, ly: 398 },
  { x: 176, y: 320, r: 7, label: "Assessment", lx: 192, ly: 336 },
  { x: 292, y: 246, r: 7, label: "Insights", lx: 308, ly: 262 },
  { x: 410, y: 162, r: 7, label: "Transformation", lx: 300, ly: 150 },
  { x: 518, y: 74, r: 8.5, label: "Growth", lx: 424, ly: 60, lead: true },
];

const SCATTER = [
  [46, 252, 3.5], [92, 316, 3], [34, 352, 4], [128, 268, 3], [76, 390, 3.5],
  [150, 356, 3], [196, 396, 3.5], [112, 222, 2.5], [210, 330, 3], [248, 392, 3], [168, 300, 2.5],
];

const LATTICE_NODES = [
  [392, 62, 4], [470, 34, 4.5], [524, 88, 4], [440, 118, 3.5], [546, 146, 3],
];

const LATTICE_LINES = [
  [392, 62, 470, 34], [470, 34, 524, 88], [392, 62, 440, 118], [440, 118, 524, 88],
  [440, 118, 470, 34], [392, 62, 524, 88], [524, 88, 546, 146], [440, 118, 546, 146],
];

const PATH =
  "M52,382 C112,360 132,344 176,320 C224,294 248,276 292,246 C340,212 368,190 410,162 C456,132 486,104 518,74";

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden py-[clamp(56px,6vw,96px)] pb-[clamp(64px,7vw,110px)]">
      <div
        className="pointer-events-none absolute -inset-y-[30%] -left-[20%] right-[40%] opacity-[0.85]"
        style={{ background: "radial-gradient(ellipse at 30% 40%, var(--sky-soft), transparent 62%)" }}
      />
      <div className="wrap relative">
        <div className="grid items-center gap-[clamp(32px,4vw,64px)] lg:grid-cols-[1.02fr_0.98fr]">
          <div>
            <h1 className="max-w-[13ch]">See where your business can go.</h1>
            <p className="lede mt-[26px] max-w-[46ch]">
              SKYVIS assesses how your business operates today, identifies the digital
              opportunities inside it, and transforms your operations through technology,
              automation, and AI.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/assessment" className="btn btn-p">Start your digital assessment</Link>
              <Link href="#methodology" className="btn btn-s">Explore our approach</Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-[18px] gap-y-2 border-t border-[var(--line)] pt-[22px] text-[0.87rem] font-medium text-[var(--text-3)]">
              {["Business assessment", "Digital transformation", "Technology development"].map((t, i, arr) => (
                <span key={t} className="flex items-center gap-[18px]">
                  {t}
                  {i < arr.length - 1 && <i className="h-1 w-1 rounded-full bg-[var(--line-2)]" />}
                </span>
              ))}
            </div>
          </div>

          <div className="order-2 lg:order-none">
            <svg
              viewBox="0 0 560 430"
              role="img"
              aria-label="A path rising from scattered, disconnected operations through assessment and insight toward a connected digital future."
            >
              <g>
                {SCATTER.map(([cx, cy, r], i) => (
                  <circle key={i} cx={cx} cy={cy} r={r} fill="var(--text-3)" opacity={0.35} />
                ))}
              </g>

              <g>
                {LATTICE_LINES.map(([x1, y1, x2, y2], i) => (
                  <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--sky)" strokeWidth={1} opacity={0.28} />
                ))}
                {LATTICE_NODES.map(([cx, cy, r], i) => (
                  <circle key={i} cx={cx} cy={cy} r={r} fill="var(--sky)" opacity={0.55} />
                ))}
              </g>

              <path d={PATH} fill="none" stroke="var(--line-2)" strokeWidth={2} />
              <motion.path
                d={PATH}
                fill="none"
                stroke="var(--sky)"
                strokeWidth={2.5}
                strokeLinecap="round"
                initial={reduce ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2.1, ease: [0.33, 1, 0.5, 1], delay: 0.25 }}
              />

              {WAYPOINTS.map((w) => (
                <g key={w.label}>
                  <circle cx={w.x} cy={w.y} r={w.r} fill="var(--bg)" stroke="var(--sky)" strokeWidth={2.5} />
                  <circle cx={w.x} cy={w.y} r={w.r / 2.4} fill="var(--sky)" />
                  <text
                    x={w.lx}
                    y={w.ly}
                    className={`text-[12.5px] font-semibold ${w.lead ? "fill-[var(--text)]" : "fill-[var(--text-2)]"}`}
                  >
                    {w.label}
                  </text>
                </g>
              ))}

              <text x={52} y={418} className="fill-[var(--text-3)] text-[11px]">Fragmented today</text>
              <text x={430} y={196} className="fill-[var(--text-3)] text-[11px]">Connected</text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
