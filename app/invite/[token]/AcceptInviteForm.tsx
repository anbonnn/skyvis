"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";

export function AcceptInviteForm({
  token, email, jobRole, department,
}: {
  token: string; email: string; jobRole: string | null; department: string | null;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [role, setRole] = useState(jobRole ?? "");
  const [dept, setDept] = useState(department ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    setError("");
    setBusy(true);
    const res = await fetch(`/api/invitations/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, jobRole: role, department: dept, password }),
    });
    const data = await res.json();
    if (!data.ok) {
      setError(data.error || "Could not accept the invitation");
      setBusy(false);
      return;
    }
    await signIn("credentials", { email, password, redirect: false });
    router.push("/dashboard");
  }

  return (
    <>
      <div className="mt-8 grid gap-[18px]">
        <div className="field">
          <label>Email</label>
          <input value={email} disabled />
        </div>
        <div className="field">
          <label htmlFor="name">Your name</label>
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="role">Your role</label>
          <input id="role" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Warehouse Supervisor" />
        </div>
        <div className="field">
          <label htmlFor="dept">Department</label>
          <input id="dept" value={dept} onChange={(e) => setDept(e.target.value)} placeholder="e.g. Operations" />
        </div>
        <div className="field">
          <label htmlFor="password">Choose a password</label>
          <input id="password" type="password" value={password} autoComplete="new-password"
            onChange={(e) => setPassword(e.target.value)} />
          <span className="text-[0.78rem] text-[var(--text-3)]">At least 10 characters.</span>
        </div>
      </div>

      {error && (
        <p className="mt-5 rounded-[10px] border border-[#E4572E] bg-[#E4572E]/10 px-4 py-3 text-[0.9rem]">{error}</p>
      )}

      <button className="btn btn-p mt-7 w-full" onClick={submit} disabled={busy}>
        {busy ? "Joining…" : "Join and start"}
      </button>
    </>
  );
}
