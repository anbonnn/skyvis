"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Wordmark } from "@/components/Wordmark";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    setError("");
    setBusy(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) {
      // Deliberately vague: never reveal whether the address is registered.
      setError("Those details don't match an account.");
      setBusy(false);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-[420px] px-6 py-16">
      <Wordmark href="/" />
      <h1 className="mt-10 text-[1.9rem]">Sign in</h1>
      <p className="lede mt-3">Access your assessments and results.</p>

      <div className="mt-8 grid gap-[18px]">
        <div className="field">
          <label htmlFor="email">Work email</label>
          <input id="email" type="email" value={email} autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()} />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={password} autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()} />
        </div>
      </div>

      {error && (
        <p className="mt-5 rounded-[10px] border border-[#E4572E] bg-[#E4572E]/10 px-4 py-3 text-[0.9rem]">
          {error}
        </p>
      )}

      <button className="btn btn-p mt-7 w-full" onClick={submit} disabled={busy}>
        {busy ? "Signing in…" : "Sign in"}
      </button>

      <p className="mt-6 text-center text-[0.9rem] text-[var(--text-2)]">
        No account yet? <Link href="/register" className="font-semibold text-[var(--sky)]">Register your company</Link>
      </p>
    </main>
  );
}
