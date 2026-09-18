import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { Providers } from "@/components/app/Providers";
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
    default: "SKYVIS — Business assessment, digital transformation, technology",
    template: "%s · SKYVIS",
  },
  description:
    "SKYVIS assesses your business, identifies digital opportunities, and transforms operations through technology, automation, and AI.",
  keywords: [
    "digital transformation", "digital maturity assessment", "business process assessment",
    "ERP integration", "POS integration", "Mongolia", "Ulaanbaatar",
  ],
  openGraph: {
    type: "website",
    url: SITE,
    siteName: "SKYVIS",
    title: "SKYVIS — See where your business can go",
    description:
      "Business assessment, digital transformation, and technology development for organizations across the region.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SKYVIS — See where your business can go",
    description: "Business assessment, digital transformation, and technology development.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
