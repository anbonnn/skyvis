import Link from "next/link";
import { Reveal } from "./Reveal";
import { RadarChart, ScoreBars } from "./RadarChart";
import { Counter } from "./Counter";
import { DIMENSIONS, DEMO_SCORES } from "@/lib/dimensions";

const CHAIN = [
  { k: "Current state", v: "Inventory counted by hand across 300 outlets." },
  { k: "Gap", v: "No live stock position between POS and accounting." },
  { k: "Opportunity", v: "Automated replenishment against real demand." },
  { k: "Business impact", v: "Less capital held in slow stock, fewer lost sales." },
  { k: "Recommended action", v: "Integrate POS to ERP, then automate reorder points." },
];

export function AssessmentSection() {
  return (
    <section className="section" id="assessment">
      <div className="wrap">
        <Reveal className="sec-head">
          <h2>Know your digital maturity. Know what to do next.</h2>
          <p className="lede">
            The SKYVIS Digital Assessment evaluates the capabilities that determine how effectively
            your organization can use technology to create business value — measured across ten
            dimensions, scored against comparable operations, and translated into a prioritised plan.
          </p>
        </Reveal>

        <div className="grid items-center gap-[clamp(30px,4vw,60px)] lg:grid-cols-[0.92fr_1.08fr]">
          <Reveal>
            <div className="flex flex-wrap gap-2">
              {DIMENSIONS.map((d) => (
                <span
                  key={d.key}
                  className="rounded-full border border-[var(--line-2)] px-[15px] py-[7px] text-[0.85rem] font-medium text-[var(--text-2)]"
                >
                  {d.full}
                </span>
              ))}
            </div>
            <p className="lede mt-7">
              A score on its own changes nothing. Every dimension we measure is carried through to
              the thing that matters: what it costs you today, and what to do about it first.
            </p>
            <Link href="/assessment" className="btn btn-p mt-7">Request an assessment</Link>
          </Reveal>

          <Reveal>
            <div
              className="overflow-hidden rounded-card border border-[var(--line)] bg-[var(--surface)]"
              style={{ boxShadow: "var(--shadow-lg)" }}
            >
              <div className="flex items-center justify-between gap-4 border-b border-[var(--line)] px-6 py-[18px]">
                <b className="font-display text-[0.95rem] font-bold">Digital maturity profile</b>
                <span className="text-[0.8rem] text-[var(--text-3)]">Example · retail distribution, 300 outlets</span>
              </div>
              <div className="grid sm:grid-cols-[1fr_250px]">
                <div className="flex items-center justify-center px-[10px] pb-[22px] pt-[18px]">
                  <RadarChart
                    scores={DEMO_SCORES}
                    label="Radar chart showing maturity scores across ten dimensions, averaging 2.7 out of 5."
                  />
                </div>
                <div className="flex flex-col gap-5 border-t border-[var(--line)] p-6 sm:border-l sm:border-t-0">
                  <div>
                    <div className="font-display text-[3.3rem] font-extrabold leading-none tracking-[-0.045em] text-[var(--sky)]">
                      <Counter to={2.7} decimals={1} />
                      <small className="text-[1.1rem] font-semibold tracking-[-0.02em] text-[var(--text-3)]"> / 5</small>
                    </div>
                    <div className="mt-[6px] text-[0.84rem] font-semibold text-[var(--text-3)]">
                      Overall digital maturity
                    </div>
                  </div>
                  <ScoreBars scores={DEMO_SCORES} />
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <div className="mt-11 grid gap-px overflow-hidden rounded-[14px] border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-5">
            {CHAIN.map((c) => (
              <div key={c.k} className="bg-[var(--surface)] px-[18px] py-5">
                <b className="mb-[7px] block font-display text-[0.82rem] font-bold text-[var(--sky)]">{c.k}</b>
                <p className="text-[0.9rem] font-medium leading-[1.5] text-[var(--text-2)]">{c.v}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
