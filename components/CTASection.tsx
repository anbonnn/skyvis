import Link from "next/link";

export function CTASection() {
  return (
    <section className="section relative overflow-hidden bg-[var(--ink)] text-white">
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 22% 108%, rgba(30,139,245,0.4), transparent 58%)" }}
      />
      <div className="wrap relative">
        <h2 className="max-w-[16ch] text-white">Ready to see what&apos;s possible?</h2>
        <p className="mt-[22px] max-w-[52ch] text-[1.08rem] text-[#afc5e0]">
          Start with a clear view of where your business is today — and a practical roadmap for
          where it can go next.
        </p>
        <div className="mt-[38px] flex flex-wrap gap-3">
          <Link href="/assessment" className="btn btn-p">Start your digital assessment</Link>
          <Link href="#contact" className="btn btn-on-dark">Talk to SKYVIS</Link>
        </div>
      </div>
    </section>
  );
}
