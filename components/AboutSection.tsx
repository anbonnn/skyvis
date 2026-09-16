import { Reveal } from "./Reveal";

const PRINCIPLES = [
  { title: "Understand first", body: "We start with the business, not the software. Until we know how work actually moves through your organization, any recommendation is a guess." },
  { title: "Build for impact", body: "Every technology initiative should solve a business problem someone can name, and improve a number someone already watches." },
  { title: "Transform continuously", body: "Digital transformation is a capability an organization keeps, not a project it finishes. We build for the second year, not the launch." },
];

export function AboutSection() {
  return (
    <section className="section" id="about">
      <div className="wrap">
        <Reveal className="sec-head">
          <h2>We bridge business and technology.</h2>
          <p className="lede">
            SKYVIS brings together business strategy, operational understanding, technology, data,
            automation, and AI to help organizations transform the way they work. We are based in
            Ulaanbaatar and work with clients across the region.
          </p>
        </Reveal>

        <Reveal>
          <div className="mt-[clamp(36px,4vw,56px)] grid gap-px border-y border-[var(--line)] bg-[var(--line)] md:grid-cols-3">
            {PRINCIPLES.map((p) => (
              <div key={p.title} className="bg-[var(--bg)] px-[clamp(20px,2.4vw,32px)] py-[clamp(26px,3vw,38px)]">
                <h3 className="mb-3 text-[1.1rem]">{p.title}</h3>
                <p className="text-[0.95rem] leading-[1.6] text-[var(--text-2)]">{p.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
