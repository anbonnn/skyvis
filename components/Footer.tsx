import Link from "next/link";
import { Wordmark } from "./Wordmark";

const NAV = [
  { href: "/#services", label: "Services" },
  { href: "/#assessment", label: "Assessment" },
  { href: "/#methodology", label: "Methodology" },
  { href: "/#industries", label: "Industries" },
  { href: "/#about", label: "About" },
  { href: "/#insights", label: "Insights" },
];

export function Footer() {
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
              See. Transform. Grow.
            </div>
            <p className="mt-5 max-w-[34ch] text-[0.92rem]">
              Business assessment, digital transformation, and technology development.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-display text-[0.85rem] font-bold tracking-[0.03em] text-white">Company</h4>
            <ul className="m-0 grid list-none gap-[11px] p-0">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="text-[0.92rem] transition-colors hover:text-white">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-display text-[0.85rem] font-bold tracking-[0.03em] text-white">Contact</h4>
            <ul className="m-0 grid list-none gap-[11px] p-0 text-[0.92rem]">
              <li>Ulaanbaatar, Mongolia</li>
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
          <div>© {new Date().getFullYear()} SKYVIS. All rights reserved.</div>
          <div>Business assessment · Digital transformation · Technology</div>
        </div>
      </div>
    </footer>
  );
}
