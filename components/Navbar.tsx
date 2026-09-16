"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Wordmark } from "./Wordmark";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/#services", label: "Services" },
  { href: "/#assessment", label: "Assessment" },
  { href: "/#methodology", label: "Methodology" },
  { href: "/#industries", label: "Industries" },
  { href: "/#about", label: "About" },
  { href: "/#insights", label: "Insights" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 border-b border-transparent backdrop-blur-[14px] backdrop-saturate-150 transition-colors",
        scrolled && "border-b-[var(--line)]"
      )}
      style={{ background: "color-mix(in srgb, var(--bg) 88%, transparent)" }}
    >
      <div className="wrap">
        <div className="flex h-[74px] items-center gap-7">
          <Wordmark />

          <div className="ml-auto hidden gap-1 lg:flex">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-full px-[14px] py-[9px] text-[0.93rem] font-medium text-[var(--text-2)] transition-colors hover:bg-[var(--bg-alt)] hover:text-[var(--text)]"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <Link href="/assessment" className="btn btn-p btn-sm ml-[6px] hidden lg:inline-flex">
            Start your assessment
          </Link>

          <button
            className="ml-auto p-[10px] lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {open && (
          <div className="border-t border-[var(--line)] pb-[22px] pt-[14px] lg:hidden">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block border-b border-[var(--line)] px-1 py-3 font-medium text-[var(--text-2)]"
              >
                {l.label}
              </Link>
            ))}
            <Link href="/assessment" className="btn btn-p mt-[18px] w-full">
              Start your assessment
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
