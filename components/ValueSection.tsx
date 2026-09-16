"use client";

import { Reveal } from "./Reveal";
import { useLanguage } from "@/lib/language";

const VALUES = {
  mn: [
    { metric: "Зардал", dir: "↓", title: "Байх ёсгүй ажлыг арилгах", body: "Хосолмол оруулга, тохируулга, ярилцах ёсгүй системүүдийн хоорондох гар аргаар шилжүүлэлт." },
    { metric: "Хугацаа", dir: "↓", title: "Давтагдах давхаргыг автоматжуулах", body: "Багийн тань өдөр бүр давтдаг ажлууд ихэвчлэн хамгийн хямд автоматжуулагдах ба хамгийн хурдан өгөөж өгдөг." },
    { metric: "Харагдац", dir: "↑", title: "Бизнесийг цаг хугацаанд харах", body: "Тоо баримтын нэг л хувилбар, шийдвэр гарах мөчид бэлэн байх, нэг долоо хоногийн дараа биш." },
    { metric: "Өсөлт", dir: "↑", title: "Өргөжих чадвартай үйл ажиллагаа бүтээх", body: "Ажилтны тоог тэр хэмжээгээр нэмэхгүйгээр салбар, бүтээгдэхүүн, зах зээл нэмнэ." },
  ],
  en: [
    { metric: "Cost", dir: "↓", title: "Take out work that shouldn't exist", body: "Duplicate entry, reconciliation, and manual handoffs between systems that should be talking." },
    { metric: "Time", dir: "↓", title: "Automate the repetitive layer", body: "The tasks your team repeats daily are usually the cheapest thing to automate and the fastest to pay back." },
    { metric: "Visibility", dir: "↑", title: "See the business in real time", body: "One version of the numbers, available when the decision is being made rather than a week after." },
    { metric: "Growth", dir: "↑", title: "Build operations that scale", body: "Add outlets, products, or markets without adding headcount in proportion." },
  ],
};

const HEAD = {
  mn: {
    h2: "Бизнес сайжирсан тохиолдолд л технологи үнэ цэнэтэй байдаг.",
    lede: "Бидний зөвлөж буй санаачилга бүр эхлээд бизнес кэйс байдлаар бичигддэг. Хэмжигдэхгүй бол замын карт руу орохгүй.",
    bridge: "SKYVIS технологийн хөрөнгө оруулалтыг хэмжигдэхүүнтэй бизнесийн үр дүнд холбодог.",
  },
  en: {
    h2: "Technology is only valuable when the business improves.",
    lede: "Every initiative we recommend is written as a business case first. If it can't be measured, it doesn't make the roadmap.",
    bridge: "SKYVIS connects technology investment to measurable business outcomes.",
  },
};

export function ValueSection() {
  const { locale } = useLanguage();
  const values = VALUES[locale];
  const head = HEAD[locale];

  return (
    <section className="section tint" id="value">
      <div className="wrap">
        <Reveal className="sec-head">
          <h2>{head.h2}</h2>
          <p className="lede">{head.lede}</p>
        </Reveal>

        <div className="grid gap-[clamp(14px,2vw,24px)] sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
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
          <p className="bridge">{head.bridge}</p>
        </Reveal>
      </div>
    </section>
  );
}
