import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { LanguageProvider } from "@/lib/language";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const SITE = "https://skyvis.mn";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "SKYVIS — Бизнесийн үнэлгээ, дижитал шилжилт, технологи",
    template: "%s · SKYVIS",
  },
  description:
    "SKYVIS нь таны бизнесийг үнэлж, дижитал боломжуудыг тодорхойлж, технологи, автоматжуулалт, хиймэл оюуны тусламжтайгаар үйл ажиллагааг өөрчилдөг.",
  keywords: [
    "дижитал шилжилт", "дижитал бэлэн байдлын үнэлгээ", "бизнес процессын үнэлгээ",
    "ERP интеграц", "POS интеграц", "Монгол", "Улаанбаатар",
    "digital transformation", "digital maturity assessment", "ERP integration", "Mongolia",
  ],
  openGraph: {
    type: "website",
    url: SITE,
    siteName: "SKYVIS",
    title: "SKYVIS — Бизнесээ хаашаа хөгжүүлж болохыг харцгаая",
    description:
      "Бүс нутгийн байгууллагуудад зориулсан бизнесийн үнэлгээ, дижитал шилжилт, технологийн хөгжүүлэлт.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SKYVIS — Бизнесээ хаашаа хөгжүүлж болохыг харцгаая",
    description: "Бизнесийн үнэлгээ, дижитал шилжилт, технологийн хөгжүүлэлт.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn" className={`${inter.variable} ${manrope.variable}`}>
      <body className="font-sans">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
