import Link from "next/link";
import { Store, Factory, Truck, Hotel, Landmark, Users } from "lucide-react";
import { Reveal } from "./Reveal";

const INDUSTRIES = [
  { Icon: Store, title: "Retail & distribution", body: "POS, inventory accuracy, replenishment, and multi-outlet reporting." },
  { Icon: Factory, title: "Manufacturing", body: "Production planning, traceability, quality data, and machine reporting." },
  { Icon: Truck, title: "Logistics", body: "Warehouse operations, fleet visibility, and delivery exception handling." },
  { Icon: Hotel, title: "Hospitality", body: "Front-of-house systems, cost control, and guest data that stays connected." },
  { Icon: Landmark, title: "Financial services", body: "Process automation, regulatory reporting, and controlled data access." },
  { Icon: Users, title: "Professional services", body: "Utilisation, project margin, and knowledge that doesn't live in inboxes." },
];

export function IndustriesSection() {
  return (
    <section className="section" id="industries">
      <div className="wrap">
        <Reveal className="sec-head">
          <h2>Transformation built around your business.</h2>
          <p className="lede">
            The assessment framework is consistent. What we look for inside it changes completely by
            industry.
          </p>
        </Reveal>

        <div className="grid gap-[clamp(14px,2vw,22px)] sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map(({ Icon, title, body }, i) => (
            <Reveal key={title} delay={i * 0.04}>
              <Link
                href="/assessment"
                className="flex h-full flex-col gap-3 rounded-[14px] border border-[var(--line)] bg-[var(--surface)] p-[26px] transition-all hover:border-[var(--sky)] hover:shadow-[var(--shadow)]"
              >
                <Icon size={26} strokeWidth={1.6} className="text-[var(--sky)]" />
                <h3 className="text-[1.05rem]">{title}</h3>
                <p className="text-[0.91rem] leading-[1.55] text-[var(--text-2)]">{body}</p>
                <span className="mt-auto pt-[10px] text-[0.87rem] font-semibold text-[var(--sky)]">
                  Explore industry
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
