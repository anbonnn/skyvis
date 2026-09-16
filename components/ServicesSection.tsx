"use client";

import { Reveal } from "./Reveal";
import { useLanguage } from "@/lib/language";

const SERVICES = {
  mn: [
    {
      kicker: "Үнэлэх",
      title: "Дижитал үнэлгээ",
      body: "Одоогийн дижитал бэлэн байдал, үйл ажиллагааны бэрхшээл, технологийн орчин, тэдгээрийн хооронд нуугдаж буй боломжуудаа ойлгоно.",
      items: ["Дижитал бэлэн байдлын үнэлгээ", "Процессын үнэлгээ", "Технологийн үнэлгээ", "Датагийн үнэлгээ", "ХО-ын бэлэн байдал", "Цоорхойн шинжилгээ"],
    },
    {
      kicker: "Стратеги",
      title: "Шилжилтийн замын карт",
      body: "Үнэлгээний дүгнэлтийг байгууллага тань санхүүжүүлж, ажилтнаар хангаж, бодитоор хэрэгжүүлж чадах дараалалтай төлөвлөгөө болгон хувиргана.",
      items: ["Дижитал стратеги", "Процессын шинэ загвар", "Зорилтот үйл ажиллагааны загвар", "Технологийн замын карт", "Тэргүүлэх чиглэл тодорхойлолт", "Бизнес кэйс", "ROI шинжилгээ"],
    },
    {
      kicker: "Бүтээх",
      title: "Технологийн хөгжүүлэлт",
      body: "Замын карт шаарддаг системүүдийг бүтээж, одоо ашиглаж буй системүүдтэй нэгтгэнэ.",
      items: ["Захиалгын програм хангамж", "Веб аппликейшн", "Мобайл аппликейшн", "ERP, POS интеграц", "Датагийн платформ", "BI дашбоард", "ХО шийдэл", "Автоматжуулалт"],
    },
    {
      kicker: "Шилжих",
      title: "Хэрэгжилт, оптимчлол",
      body: "Өөрчлөлтийг бодит байгууллага, бодит хүмүүс, өдөр тутмын дадалд тогтвортой болгоно.",
      items: ["Хэрэгжилт", "Өөрчлөлтийн менежмент", "Ажилтны сургалт", "Системийн нэвтрүүлэлт", "Гүйцэтгэлийн хэмжилт", "Тасралтгүй сайжруулалт"],
    },
  ],
  en: [
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
  ],
};

const HEAD = {
  mn: {
    h2: "Үнэлгээнээс шилжилт хүртэл.",
    lede: "Дөрвөн уялдаатай чиглэл. Ихэнх харилцагч эхнээс нь эхэлж, дөрөв дэх хүртэл бидэнтэй хамт явдаг ч тус бүр нь дангаараа хэрэгжиж чадна.",
  },
  en: {
    h2: "From assessment to transformation.",
    lede: "Four connected practices. Most clients start at the first and keep us through the fourth, but each one stands on its own.",
  },
};

export function ServicesSection() {
  const { locale } = useLanguage();
  const services = SERVICES[locale];
  const head = HEAD[locale];

  return (
    <section className="section tint" id="services">
      <div className="wrap">
        <Reveal className="sec-head">
          <h2>{head.h2}</h2>
          <p className="lede">{head.lede}</p>
        </Reveal>

        <div className="grid gap-[clamp(16px,2vw,26px)] md:grid-cols-2">
          {services.map((s, i) => (
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
