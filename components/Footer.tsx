"use client";

import Link from "next/link";
import { Wordmark } from "./Wordmark";
import { useLanguage } from "@/lib/language";

const NAV = {
  mn: [
    { href: "/#services", label: "Үйлчилгээ" },
    { href: "/#assessment", label: "Үнэлгээ" },
    { href: "/#methodology", label: "Арга зүй" },
    { href: "/#about", label: "Бидний тухай" },
  ],
  en: [
    { href: "/#services", label: "Services" },
    { href: "/#assessment", label: "Assessment" },
    { href: "/#methodology", label: "Methodology" },
    { href: "/#about", label: "About" },
  ],
};

const COPY = {
  mn: {
    tagline: "Хар. Шилжи. Өс.",
    body: "Бизнесийн үнэлгээ, дижитал шилжилт, технологийн хөгжүүлэлт.",
    company: "Байгууллага",
    contact: "Холбоо барих",
    location: "Улаанбаатар, Монгол улс",
    rights: "Бүх эрх хуулиар хамгаалагдсан.",
    stripe: "Бизнесийн үнэлгээ · Дижитал шилжилт · Технологи",
  },
  en: {
    tagline: "See. Transform. Grow.",
    body: "Business assessment, digital transformation, and technology development.",
    company: "Company",
    contact: "Contact",
    location: "Ulaanbaatar, Mongolia",
    rights: "All rights reserved.",
    stripe: "Business assessment · Digital transformation · Technology",
  },
};

export function Footer() {
  const { locale } = useLanguage();
  const nav = NAV[locale];
  const t = COPY[locale];

  return (
    <footer
      className="border-t border-white/10 bg-[var(--ink)] pb-[34px] pt-[clamp(48px,5vw,72px)] text-[#8fa8c6]"
      id="contact"
    >
      <div className="wrap">
        <div className="grid gap-[38px] pb-[42px] md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Wordmark onDark />
            <div className="mt-4 font-display text-[1.05rem] font-bold tracking-[-0.02em] text-white">
              {t.tagline}
            </div>
            <p className="mt-5 max-w-[34ch] text-[0.92rem]">{t.body}</p>
          </div>

          <div>
            <h4 className="mb-4 font-display text-[0.85rem] font-bold tracking-[0.03em] text-white">{t.company}</h4>
            <ul className="m-0 grid list-none gap-[11px] p-0">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="text-[0.92rem] transition-colors hover:text-white">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-display text-[0.85rem] font-bold tracking-[0.03em] text-white">{t.contact}</h4>
            <ul className="m-0 grid list-none gap-[11px] p-0 text-[0.92rem]">
              <li>{t.location}</li>
              <li>
                <a href="mailto:hello@skyvis.mn" className="transition-colors hover:text-white">
                  hello@skyvis.mn
                </a>
              </li>
            </ul>
            <div className="mt-[22px] flex gap-5 text-[0.92rem]">
              <a href="#" className="transition-colors hover:text-white">LinkedIn</a>
              <a href="#" className="transition-colors hover:text-white">Facebook</a>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-[14px] border-t border-white/10 pt-[26px] text-[0.85rem]">
          <div>© {new Date().getFullYear()} SKYVIS. {t.rights}</div>
          <div>{t.stripe}</div>
        </div>
      </div>
    </footer>
  );
}
