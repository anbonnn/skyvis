import { ArrowRight, Check, X } from "lucide-react";
import { Reveal } from "./Reveal";

const CURRENT = ["Disconnected systems", "Manual processes", "Fragmented data", "Slow decisions"];
const FUTURE = ["Connected systems", "Automated processes", "Unified data", "Better decisions"];
const PAINS = [
  "Duplicate work across teams",
  "Data trapped in departments",
  "Reporting that arrives too late",
  "Technology spend without clear ROI",
];

export function ProblemSection() {
  return (
    <section className="section tint" id="problem">
      <div className="wrap">
        <Reveal className="sec-head">
          <h2>Most businesses don&apos;t have a technology problem. They have a visibility problem.</h2>
          <p className="lede">
            Systems get bought one at a time, processes grow around the gaps between them, and the
            picture of how the business actually runs ends up scattered across departments. The
            software isn&apos;t the issue. Nobody can see the whole.
          </p>
        </Reveal>

        <Reveal>
          <div className="grid items-stretch gap-[clamp(18px,3vw,38px)] md:grid-cols-[1fr_auto_1fr]">
            <div className="rounded-card border border-[var(--line)] bg-[var(--surface)] p-[clamp(24px,3vw,34px)]">
              <h4 className="mb-[22px] text-[0.92rem] font-bold text-[var(--text-3)]">
                Where most operations are today
              </h4>
              <ul className="m-0 grid list-none gap-[2px] p-0">
                {CURRENT.map((item, i) => (
                  <li
                    key={item}
                    className={`flex items-center gap-[13px] py-[13px] text-base font-medium ${i ? "border-t border-dashed border-[var(--line)]" : ""}`}
                  >
                    <X size={19} className="shrink-0 text-[#8b9ab0]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-center text-[var(--sky)] max-md:rotate-90">
              <ArrowRight size={34} strokeWidth={1.8} />
            </div>

            <div
              className="rounded-card border border-[var(--sky)] p-[clamp(24px,3vw,34px)]"
              style={{ background: "linear-gradient(180deg, var(--sky-soft), var(--surface) 60%)" }}
            >
              <h4 className="mb-[22px] text-[0.92rem] font-bold text-[var(--sky)]">
                Where SKYVIS takes them
              </h4>
              <ul className="m-0 grid list-none gap-[2px] p-0">
                {FUTURE.map((item, i) => (
                  <li
                    key={item}
                    className={`flex items-center gap-[13px] py-[13px] text-base font-medium ${i ? "border-t border-dashed border-[color-mix(in_srgb,var(--sky)_26%,transparent)]" : ""}`}
                  >
                    <Check size={19} className="shrink-0 text-[var(--sky)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-11 grid overflow-hidden rounded-[14px] border border-[var(--line)] bg-[var(--line)] gap-px sm:grid-cols-2 lg:grid-cols-4">
            {PAINS.map((p) => (
              <div key={p} className="bg-[var(--bg)] px-[22px] py-5 text-[0.95rem] font-medium text-[var(--text-2)]">
                {p}
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <p className="bridge">
            Before recommending technology, we understand how your business actually works.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
