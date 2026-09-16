import Link from "next/link";
import { cn } from "@/lib/utils";

export function Wordmark({
  href = "/",
  className,
  onDark = false,
}: {
  href?: string;
  className?: string;
  onDark?: boolean;
}) {
  const content = (
    <>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-[22px] w-[22px] shrink-0">
        <path
          d="M2 20.5 L11 11 L15.5 15 L22 6"
          stroke="var(--sky)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="22" cy="6" r="2.6" fill="var(--sky)" />
      </svg>
      SKYVIS
    </>
  );

  const classes = cn(
    "flex items-center gap-[10px] font-display text-[1.22rem] font-extrabold tracking-[0.01em]",
    onDark && "text-white",
    className
  );

  if (!href) return <div className={classes}>{content}</div>;
  return (
    <Link href={href} className={classes} aria-label="SKYVIS home">
      {content}
    </Link>
  );
}
