import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { Counter } from "./Counter";

const BEFORE = ["POS running standalone", "Excel for everything else", "Manual inventory counts", "Separate accounting system", "Delayed reporting"];
const DURING = ["POS integration layer", "Inventory automation", "ERP integration", "BI dashboard", "Central data platform"];
const AFTER = ["Real-time stock visibility", "Automated replenishment", "Tighter inventory control", "Same-day reporting", "Decisions made on data"];

function Panel({ title, items, highlight = false }: { title: string; items: string[]; highlight?: boolean }) {
  return (
    <div
      className={`rounded-[14px] border p-[22px] ${
        highlight ? "border-[var(--sky)] bg-[rgba(30,139,245,0.14)]" : "border-white/[0.14] bg-white/[0.04]"
      }`}
    >
      <h4 className={`mb-4 font-display text-[0.8rem] font-bold tracking-[0.05em] ${highlight ? "text-[var(--sky-2)]" : "text-[#7fb8f5]"}`}>
        {title}
      </h4>
      <ul className="m-0 grid list-none gap-[9px] p-0">
        {items.map((i) => (
          <li key={i} className="flex items-start gap-[9px] text-[0.9rem] font-medium leading-[1.45] text-[#d5e3f4]">
            <span className={`mt-2 h-[5px] w-[5px] shrink-0 rounded-full ${highlight ? "bg-[var(--sky-2)]" : "bg-[#5c8fc4]"}`} />
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CaseStudySection() {
  return (
    <section className="section tint" id="case">
      <div className="wrap">
        <Reveal>
          <div className="relative overflow-hidden rounded-card bg-[var(--ink)] p-[clamp(30px,4.5vw,66px)] text-white">
            <div
              className="pointer-events-none absolute -right-[14%] -top-[38%] h-[130%] w-[60%]"
              style={{ background: "radial-gradient(circle at center, rgba(30,139,245,0.34), transparent 66%)" }}
            />
            <div className="relative">
              <p className="mb-4 text-[0.85rem] font-semibold text-[#7fb8f5]">Transformation example · Retail</p>
              <h2 className="text-white">From fragmented retail operations to connected digital operations.</h2>
              <p className="lede mt-5 !text-[#a9c0dc]">
                A distribution business running 300 outlets on a POS that didn&apos;t speak to
                accounting, with inventory reconciled by hand and reporting that arrived days late.
              </p>

              <div className="my-[clamp(34px,4vw,52px)] grid items-center gap-[clamp(12px,1.8vw,24px)] lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
                <Panel title="Before" items={BEFORE} />
                <div className="flex items-center justify-center text-[var(--sky)] max-lg:rotate-90">
                  <ArrowRight size={30} strokeWidth={1.8} />
                </div>
                <Panel title="SKYVIS transformation" items={DURING} highlight />
                <div className="flex items-center justify-center text-[var(--sky)] max-lg:rotate-90">
                  <ArrowRight size={30} strokeWidth={1.8} />
                </div>
                <Panel title="After" items={AFTER} />
              </div>

              <div className="grid gap-[clamp(14px,2vw,22px)] border-t border-white/[0.14] pt-[clamp(26px,3vw,38px)] sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <div className="metric-v text-white"><Counter to={300} /></div>
                  <p className="mt-2 text-[0.88rem] font-medium text-[#9db6d3]">Outlets connected</p>
                </div>
                <div>
                  <div className="metric-v text-white"><Counter to={40} suffix="%" /></div>
                  <p className="mt-2 text-[0.88rem] font-medium text-[#9db6d3]">Less manual work</p>
                </div>
                <div>
                  <div className="metric-v text-white">Real time</div>
                  <p className="mt-2 text-[0.88rem] font-medium text-[#9db6d3]">Reporting cadence</p>
                </div>
                <div>
                  <div className="metric-v text-white">One</div>
                  <p className="mt-2 text-[0.88rem] font-medium text-[#9db6d3]">Integrated operation</p>
                </div>
              </div>

              <p className="mt-[26px] max-w-[66ch] text-[0.82rem] text-[#7c96b5]">
                Illustrative project figures shown for the purpose of this example. Replace with
                verified, client-approved results before publishing.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
