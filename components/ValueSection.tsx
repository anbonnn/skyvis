import { Reveal } from "./Reveal";

const VALUES = [
  { metric: "Cost", dir: "↓", title: "Take out work that shouldn't exist", body: "Duplicate entry, reconciliation, and manual handoffs between systems that should be talking." },
  { metric: "Time", dir: "↓", title: "Automate the repetitive layer", body: "The tasks your team repeats daily are usually the cheapest thing to automate and the fastest to pay back." },
  { metric: "Visibility", dir: "↑", title: "See the business in real time", body: "One version of the numbers, available when the decision is being made rather than a week after." },
  { metric: "Growth", dir: "↑", title: "Build operations that scale", body: "Add outlets, products, or markets without adding headcount in proportion." },
];

export function ValueSection() {
  return (
    <section className="section tint" id="value">
      <div className="wrap">
        <Reveal className="sec-head">
          <h2>Technology is only valuable when the business improves.</h2>
          <p className="lede">
            Every initiative we recommend is written as a business case first. If it can&apos;t be
            measured, it doesn&apos;t make the roadmap.
          </p>
        </Reveal>

        <div className="grid gap-[clamp(14px,2vw,24px)] sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, i) => (
            <Reveal key={v.metric} delay={i * 0.05}>
              <div className="border-t-2 border-[var(--sky)] pt-6">
                <div className="metric-v">
                  {v.metric} <em className="not-italic text-[1.1rem] text-[var(--sky)]">{v.dir}</em>
                </div>
                <h3 className="mb-2 mt-[14px] text-base">{v.title}</h3>
                <p className="text-[0.93rem] leading-[1.55] text-[var(--text-2)]">{v.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="bridge">
            SKYVIS connects technology investment to measurable business outcomes.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
