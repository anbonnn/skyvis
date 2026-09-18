import Link from "next/link";
import { Wordmark } from "@/components/Wordmark";
import { signOut } from "@/auth";

export function AppShell({
  children,
  nav,
  user,
}: {
  children: React.ReactNode;
  nav?: { href: string; label: string }[];
  user?: { name?: string | null; email?: string | null; companyName?: string | null };
}) {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--bg)]">
        <div className="wrap flex h-[66px] items-center gap-6">
          <Wordmark href="/dashboard" />
          {nav && (
            <nav className="hidden gap-1 sm:flex">
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="rounded-full px-[13px] py-2 text-[0.9rem] font-medium text-[var(--text-2)] hover:bg-[var(--bg-alt)] hover:text-[var(--text)]"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          )}
          <div className="ml-auto flex items-center gap-4">
            {user?.companyName && (
              <span className="hidden text-[0.85rem] text-[var(--text-3)] md:inline">
                {user.companyName}
              </span>
            )}
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button type="submit" className="btn btn-s btn-sm">Sign out</button>
            </form>
          </div>
        </div>
      </header>
      <main className="wrap py-10 pb-24">{children}</main>
    </>
  );
}

export function PageHead({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end gap-4 border-b border-[var(--line)] pb-6">
      <div>
        <h1 className="text-[clamp(1.6rem,1.2rem+1.4vw,2.1rem)]">{title}</h1>
        {sub && <p className="lede mt-2">{sub}</p>}
      </div>
      {action && <div className="ml-auto">{action}</div>}
    </div>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[14px] border border-[var(--line)] bg-[var(--surface)] p-6 ${className}`}>
      {children}
    </div>
  );
}

export function Stat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <Card>
      <div className="font-display text-[2.1rem] font-extrabold leading-none tracking-[-0.04em]">{value}</div>
      <div className="mt-2 text-[0.85rem] font-medium text-[var(--text-3)]">{label}</div>
    </Card>
  );
}
