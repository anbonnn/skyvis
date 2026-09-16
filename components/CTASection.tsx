"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language";

const COPY = {
  mn: {
    h2: "Юу боломжтой болохыг харах бэлэн үү?",
    body: "Бизнесээ өнөөдөр хаана байгаагийн тодорхой дүр зургаас эхэлж — дараа нь хаашаа явж болохын тухай бодит замын карт аваарай.",
    ctaPrimary: "Дижитал үнэлгээгээ эхлүүлэх",
    ctaSecondary: "SKYVIS-тэй холбогдох",
  },
  en: {
    h2: "Ready to see what's possible?",
    body: "Start with a clear view of where your business is today — and a practical roadmap for where it can go next.",
    ctaPrimary: "Start your digital assessment",
    ctaSecondary: "Talk to SKYVIS",
  },
};

export function CTASection() {
  const { locale } = useLanguage();
  const t = COPY[locale];

  return (
    <section className="section relative overflow-hidden bg-[var(--ink)] text-white">
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 22% 108%, rgba(30,139,245,0.4), transparent 58%)" }}
      />
      <div className="wrap relative">
        <h2 className="max-w-[16ch] text-white">{t.h2}</h2>
        <p className="mt-[22px] max-w-[52ch] text-[1.08rem] text-[#afc5e0]">{t.body}</p>
        <div className="mt-[38px] flex flex-wrap gap-3">
          <Link href="/assessment" className="btn btn-p">{t.ctaPrimary}</Link>
          <Link href="#contact" className="btn btn-on-dark">{t.ctaSecondary}</Link>
        </div>
      </div>
    </section>
  );
}
