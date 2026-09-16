"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "./Reveal";

const STEPS = [
  { n: "01", title: "Assess", body: "Understand how the business runs today, department by department." },
  { n: "02", title: "Diagnose", body: "Separate symptoms from causes, and problems from opportunities." },
  { n: "03", title: "Prioritize", body: "Rank by value created and effort required, not by what's newest." },
  { n: "04", title: "Design", body: "Model the future-state operating model before anything is built." },
  { n: "05", title: "Build", body: "Develop and integrate the systems the design depends on." },
  { n: "06", title: "Implement", body: "Roll out, train, and get the organization genuinely using it." },
  { n: "07", title: "Measure", body: "Track the business outcomes the case was approved against." },
  { n: "08", title: "Optimize", body: "Keep improving once the first version is live and understood." },
];

export function MethodologySection() {
  const reduce = useReducedMotion();

  return (
    <section className="section" id="methodology">
      <div className="wrap">
        <Reveal className="sec-head">
          <h2>A clear path from complexity to growth.</h2>
          <p className="lede">
            Eight stages, in order. We don&apos;t skip to the build, because the build is the
            expensive part to get wrong.
          </p>
        </Reveal>

        <div className="grid gap-px overflow-hidden rounded-card border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
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
