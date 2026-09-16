"use client";

import { Reveal } from "./Reveal";
import { useLanguage } from "@/lib/language";

const PRINCIPLES = {
  mn: [
    { title: "Эхлээд ойлгох", body: "Бид програм хангамжаас биш, бизнесээс эхэлдэг. Ажил байгууллага дотор бодитоор хэрхэн урсдагийг мэдэхээс өмнө ямар ч зөвлөмж таамаглал л байдаг." },
    { title: "Үр дүнд чиглэсэн бүтээх", body: "Технологийн санаачилга бүр хэн нэгэн нэрлэж чадах бизнесийн асуудлыг шийдэж, хэн нэгэн хянадаг тоог сайжруулах ёстой." },
    { title: "Тасралтгүй шилжих", body: "Дижитал шилжилт бол байгууллагын тогтвортой чадавхи, дуусдаг төсөл биш. Бид эхний хувилбар гарахад биш, хоёр дахь онд зориулж бүтээдэг." },
  ],
  en: [
    { title: "Understand first", body: "We start with the business, not the software. Until we know how work actually moves through your organization, any recommendation is a guess." },
    { title: "Build for impact", body: "Every technology initiative should solve a business problem someone can name, and improve a number someone already watches." },
    { title: "Transform continuously", body: "Digital transformation is a capability an organization keeps, not a project it finishes. We build for the second year, not the launch." },
  ],
};

const HEAD = {
  mn: {
    h2: "Бид бизнес болон технологийг холбодог.",
    lede: "SKYVIS нь бизнесийн стратеги, үйл ажиллагааны мэдлэг, технологи, дата, автоматжуулалт, хиймэл оюуныг нэгтгэн байгууллагуудад ажиллах хэвшилээ өөрчлөхөд тусалдаг. Бид Улаанбаатарт төвтэй бөгөөд бүс нутгийн харилцагчидтай ажилладаг.",
  },
  en: {
    h2: "We bridge business and technology.",
    lede: "SKYVIS brings together business strategy, operational understanding, technology, data, automation, and AI to help organizations transform the way they work. We are based in Ulaanbaatar and work with clients across the region.",
  },
};

export function AboutSection() {
  const { locale } = useLanguage();
  const principles = PRINCIPLES[locale];
  const head = HEAD[locale];

  return (
    <section className="section" id="about">
      <div className="wrap">
        <Reveal className="sec-head">
          <h2>{head.h2}</h2>
          <p className="lede">{head.lede}</p>
        </Reveal>

        <Reveal>
          <div className="mt-[clamp(36px,4vw,56px)] grid gap-px border-y border-[var(--line)] bg-[var(--line)] md:grid-cols-3">
            {principles.map((p) => (
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
