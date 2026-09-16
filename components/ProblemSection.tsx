"use client";

import { ArrowRight, Check, X } from "lucide-react";
import { Reveal } from "./Reveal";
import { useLanguage } from "@/lib/language";

const COPY = {
  mn: {
    h2: "Ихэнх бизнесийн асуудал технологид биш, харагдацад байдаг.",
    lede:
      "Системүүд нэг нэгээрээ худалдан авагдаж, процессууд тэдгээрийн хоорондох цоорхойн эргэн тойронд бий болж, бизнес хэрхэн ажилладаг тухай бүхэл дүр зураг хэлтэс хэлтсээр тархдаг. Асуудал програм хангамжид биш. Хэн ч бүхэл дүр зургийг харж чадахгүй байгаа явдал.",
    currentTitle: "Ихэнх байгууллага өнөөдөр хаана байна",
    current: ["Хоорондоо холбогдоогүй системүүд", "Гар аргаар хийгддэг процессууд", "Тархай бутархай дата", "Удаан гарах шийдвэрүүд"],
    futureTitle: "SKYVIS хаашаа хүргэдэг",
    future: ["Холбогдсон системүүд", "Автоматжуулсан процессууд", "Нэгдсэн дата", "Илүү сайн шийдвэрүүд"],
    pains: [
      "Багууд хооронд давхардсан ажил",
      "Хэлтэс дотор түгжигдсэн дата",
      "Хэтэрхий орой ирдэг тайлагнал",
      "Тодорхой өгөөжгүй технологийн зардал",
    ],
    bridge: "Технологи санал болгохоосоо өмнө бид таны бизнес хэрхэн ажилладгийг ойлгодог.",
  },
  en: {
    h2: "Most businesses don't have a technology problem. They have a visibility problem.",
    lede:
      "Systems get bought one at a time, processes grow around the gaps between them, and the picture of how the business actually runs ends up scattered across departments. The software isn't the issue. Nobody can see the whole.",
    currentTitle: "Where most operations are today",
    current: ["Disconnected systems", "Manual processes", "Fragmented data", "Slow decisions"],
    futureTitle: "Where SKYVIS takes them",
    future: ["Connected systems", "Automated processes", "Unified data", "Better decisions"],
    pains: [
      "Duplicate work across teams",
      "Data trapped in departments",
      "Reporting that arrives too late",
      "Technology spend without clear ROI",
    ],
    bridge: "Before recommending technology, we understand how your business actually works.",
  },
};

export function ProblemSection() {
  const { locale } = useLanguage();
  const t = COPY[locale];

  return (
    <section className="section tint" id="problem">
      <div className="wrap">
        <Reveal className="sec-head">
          <h2>{t.h2}</h2>
          <p className="lede">{t.lede}</p>
        </Reveal>

        <Reveal>
          <div className="grid items-stretch gap-[clamp(18px,3vw,38px)] md:grid-cols-[1fr_auto_1fr]">
            <div className="rounded-card border border-[var(--line)] bg-[var(--surface)] p-[clamp(24px,3vw,34px)]">
              <h4 className="mb-[22px] text-[0.92rem] font-bold text-[var(--text-3)]">
                {t.currentTitle}
              </h4>
              <ul className="m-0 grid list-none gap-[2px] p-0">
                {t.current.map((item, i) => (
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
                {t.futureTitle}
              </h4>
              <ul className="m-0 grid list-none gap-[2px] p-0">
                {t.future.map((item, i) => (
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
            {t.pains.map((p) => (
              <div key={p} className="bg-[var(--bg)] px-[22px] py-5 text-[0.95rem] font-medium text-[var(--text-2)]">
                {p}
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <p className="bridge">{t.bridge}</p>
        </Reveal>
      </div>
    </section>
  );
}
