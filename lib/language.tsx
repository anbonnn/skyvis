"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Locale = "mn" | "en";

const STORAGE_KEY = "skyvis-locale";

const LanguageContext = createContext<{
  locale: Locale;
  toggleLocale: () => void;
  setLocale: (locale: Locale) => void;
} | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("mn");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "mn" || stored === "en") setLocale(stored);
    } catch {
      /* localStorage unavailable */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    try {
      window.localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      /* localStorage unavailable */
    }
  }, [locale]);

  function toggleLocale() {
    setLocale((l) => (l === "mn" ? "en" : "mn"));
  }

  return (
    <LanguageContext.Provider value={{ locale, toggleLocale, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
