import Link from "next/link";
import { Reveal } from "./Reveal";

const POSTS = [
  {
    category: "Fundamentals",
    title: "How to measure digital maturity without turning it into a vanity score",
    art: "trend",
    href: "/#insights",
  },
  {
    category: "Decisions",
    title: "ERP or custom software: how to tell which one your operation actually needs",
    art: "network",
    href: "/#insights",
  },
  {
    category: "Delivery",
    title: "Why transformation projects fail, and what the successful ones do differently",
    art: "bars",
    href: "/#insights",
  },
];

function Art({ kind, id }: { kind: string; id: string }) {
  if (kind === "trend") {
    return (
      <svg viewBox="0 0 400 140" preserveAspectRatio="none" className="h-full w-full">
        <defs>
          <linearGradient id={id} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#0d2748" />
            <stop offset="1" stopColor="#1e8bf5" />
          </linearGradient>
        </defs>
        <rect width="400" height="140" fill={`url(#${id})`} />
        <g stroke="#7fc0ff" strokeWidth="1.2" opacity="0.55" fill="none">
          <path d="M0 108 L70 88 L140 96 L210 62 L280 70 L350 34 L400 42" />
          <path d="M0 126 L70 116 L140 120 L210 100 L280 106 L350 84 L400 90" opacity="0.5" />
        </g>
        <g fill="#bee0ff">
          <circle cx="70" cy="88" r="3" />
          <circle cx="210" cy="62" r="3" />
          <circle cx="350" cy="34" r="3.6" />
        </g>
      </svg>
    );
  }
  if (kind === "network") {
    return (
      <svg viewBox="0 0 400 140" preserveAspectRatio="none" className="h-full w-full">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#102c50" />
            <stop offset="1" stopColor="#0a1a30" />
          </linearGradient>
        </defs>
        <rect width="400" height="140" fill={`url(#${id})`} />
        <g stroke="#1e8bf5" strokeWidth="1.1" opacity="0.65">
          <line x1="60" y1="40" x2="170" y2="96" />
          <line x1="170" y1="96" x2="300" y2="48" />
          <line x1="60" y1="40" x2="300" y2="48" />
          <line x1="170" y1="96" x2="240" y2="120" />
          <line x1="300" y1="48" x2="360" y2="100" />
          <line x1="240" y1="120" x2="360" y2="100" />
        </g>
        <g fill="#6fc0ff">
          <circle cx="60" cy="40" r="4.5" />
          <circle cx="170" cy="96" r="5" />
          <circle cx="300" cy="48" r="4.5" />
          <circle cx="240" cy="120" r="3.5" />
          <circle cx="360" cy="100" r="4" />
        </g>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 400 140" preserveAspectRatio="none" className="h-full w-full">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0a1a30" />
          <stop offset="1" stopColor="#14406f" />
        </linearGradient>
      </defs>
      <rect width="400" height="140" fill={`url(#${id})`} />
      <g fill="#1e8bf5" opacity="0.8">
        <rect x="48" y="86" width="26" height="40" rx="3" />
        <rect x="98" y="66" width="26" height="60" rx="3" />
        <rect x="148" y="74" width="26" height="52" rx="3" />
        <rect x="198" y="46" width="26" height="80" rx="3" />
        <rect x="248" y="58" width="26" height="68" rx="3" />
        <rect x="298" y="28" width="26" height="98" rx="3" fill="#6fc0ff" />
      </g>
    </svg>
  );
}

export function InsightsSection() {
  return (
    <section className="section tint" id="insights">
      <div className="wrap">
        <Reveal className="sec-head">
          <h2>Ideas for better business</h2>
          <p className="lede">
            What we&apos;ve learned from assessing operations and building the systems that fix them.
          </p>
        </Reveal>

        <div className="grid gap-[clamp(16px,2.4vw,28px)] md:grid-cols-3">
          {POSTS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.05}>
              <Link
                href={p.href}
                className="flex h-full flex-col overflow-hidden rounded-[14px] border border-[var(--line)] bg-[var(--surface)] transition-colors hover:border-[var(--line-2)]"
              >
                <div className="h-[140px] overflow-hidden bg-[var(--ink)]">
                  <Art kind={p.art} id={`art-${i}`} />
                </div>
                <div className="flex flex-1 flex-col gap-[10px] p-6">
                  <div className="text-[0.78rem] font-bold tracking-[0.04em] text-[var(--sky)]">{p.category}</div>
                  <h3 className="text-[1.04rem] leading-[1.32]">{p.title}</h3>
                  <span className="mt-auto pt-3 text-[0.87rem] font-semibold text-[var(--text-2)]">Read more</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
