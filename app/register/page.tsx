"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Wordmark } from "@/components/Wordmark";

const FIELDS = [
  "Retail & distribution", "Manufacturing", "Logistics", "Hospitality",
  "Financial services", "Professional services", "Other",
];
const SIZES = ["1–20", "21–100", "101–500", "501–2,000", "2,000+"];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    companyName: "", registrationNumber: "", field: "", employeeCount: "",
    yearsOperating: "", name: "", jobRole: "", email: "", password: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });

  async function submit() {
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error || "Registration failed");
        setBusy(false);
        return;
      }
      const signedIn = await signIn("credentials", {
        email: form.email, password: form.password, redirect: false,
      });
      if (signedIn?.error) {
        router.push("/login");
        return;
      }
      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Try again.");
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-[620px] px-6 py-12">
      <Wordmark href="/" />
      <h1 className="mt-10 text-[clamp(1.8rem,1.4rem+1.6vw,2.4rem)]">Register your company</h1>
      <p className="lede mt-3">
        Create the account that will own your assessments. You can invite colleagues once you&apos;re in.
      </p>

      <div className="mt-9 grid gap-[18px] sm:grid-cols-2">
        <div className="field sm:col-span-2">
          <label htmlFor="companyName">Company name</label>
          <input id="companyName" value={form.companyName} onChange={set("companyName")} />
        </div>
        <div className="field">
          <label htmlFor="registrationNumber">Registration number</label>
          <input id="registrationNumber" value={form.registrationNumber} onChange={set("registrationNumber")} />
        </div>
        <div className="field">
          <label htmlFor="field">Field</label>
          <select id="field" value={form.field} onChange={set("field")}>
            <option value="">Select</option>
            {FIELDS.map((f) => <option key={f}>{f}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="employeeCount">Number of employees</label>
          <select id="employeeCount" value={form.employeeCount} onChange={set("employeeCount")}>
            <option value="">Select</option>
            {SIZES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="yearsOperating">Years operating</label>
          <input id="yearsOperating" type="number" min="0" value={form.yearsOperating} onChange={set("yearsOperating")} />
        </div>

        <div className="sm:col-span-2 mt-2 border-t border-[var(--line)] pt-6">
          <h2 className="text-[1.1rem]">Your account</h2>
        </div>
        <div className="field">
          <label htmlFor="name">Your name</label>
          <input id="name" value={form.name} onChange={set("name")} autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="jobRole">Your role</label>
          <input id="jobRole" value={form.jobRole} onChange={set("jobRole")} placeholder="e.g. Operations Director" />
        </div>
        <div className="field">
          <label htmlFor="email">Work email</label>
          <input id="email" type="email" value={form.email} onChange={set("email")} autoComplete="email" />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={form.password} onChange={set("password")} autoComplete="new-password" />
          <span className="text-[0.78rem] text-[var(--text-3)]">At least 10 characters.</span>
        </div>
      </div>

      {error && (
        <p className="mt-5 rounded-[10px] border border-[#E4572E] bg-[#E4572E]/10 px-4 py-3 text-[0.9rem]">
          {error}
        </p>
      )}

      <button className="btn btn-p mt-8 w-full" onClick={submit} disabled={busy}>
        {busy ? "Creating account…" : "Create account"}
      </button>

      <p className="mt-6 text-center text-[0.9rem] text-[var(--text-2)]">
        Already registered? <Link href="/login" className="font-semibold text-[var(--sky)]">Sign in</Link>
      </p>
    </main>
  );
}
