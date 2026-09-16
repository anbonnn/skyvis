import { Reveal } from "./Reveal";

const SERVICES = [
  {
    kicker: "Assess",
    title: "Digital assessment",
    body: "Understand your current digital maturity, operational challenges, technology landscape, and the opportunities hiding between them.",
    items: ["Digital maturity assessment", "Process assessment", "Technology assessment", "Data assessment", "AI readiness", "Gap analysis"],
  },
  {
    kicker: "Strategy",
    title: "Transformation roadmap",
    body: "Turn assessment findings into a sequenced plan your organization can actually fund, staff, and deliver.",
    items: ["Digital strategy", "Process redesign", "Target operating model", "Technology roadmap", "Prioritization", "Business cases", "ROI analysis"],
  },
  {
    kicker: "Build",
    title: "Technology development",
    body: "Build the systems the roadmap calls for — and integrate them with what you already run.",
    items: ["Custom software", "Web applications", "Mobile applications", "ERP & POS integration", "Data platforms", "BI dashboards", "AI solutions", "Automation"],
  },
  {
    kicker: "Transform",
    title: "Implementation & optimization",
    body: "Make the change hold in a real organization, with real people and existing habits.",
    items: ["Implementation", "Change management", "Employee training", "System rollout", "Performance measurement", "Continuous improvement"],
  },
];

export function ServicesSection() {
  return (
    <section className="section tint" id="services">
      <div className="wrap">
        <Reveal className="sec-head">
          <h2>From assessment to transformation.</h2>
          <p className="lede">
            Four connected practices. Most clients start at the first and keep us through the
            fourth, but each one stands on its own.
          </p>
        </Reveal>

        <div className="grid gap-[clamp(16px,2vw,26px)] md:grid-cols-2">
          {SERVICES.map((s, i) => (
            <Reveal key={s.kicker} delay={i * 0.05}>
              <div className="card h-full">
                <div className="card-k">{s.kicker}</div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <ul>
                  {s.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
