"use client";

import { useLanguage } from "@/lib/language";
import { cn } from "@/lib/utils";

export function LanguageToggle({ className }: { className?: string }) {
  const { locale, toggleLocale } = useLanguage();
  const next = locale === "mn" ? "EN" : "MN";

  return (
    <button
      type="button"
      onClick={toggleLocale}
      className={cn(
        "rounded-full border border-[var(--line-2)] px-[13px] py-[7px] text-[0.82rem] font-bold tracking-[0.02em] text-[var(--text-2)] transition-colors hover:border-[var(--sky)] hover:text-[var(--sky)]",
        className
      )}
      aria-label={locale === "mn" ? "Switch to English" : "Монгол хэл рүү шилжих"}
    >
      {next}
    </button>
  );
}
