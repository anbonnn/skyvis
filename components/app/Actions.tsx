"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function NewAssessmentButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function create() {
    setBusy(true);
    const res = await fetch("/api/assessments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: `Assessment ${new Date().getFullYear()}` }),
    });
    const data = await res.json();
    setBusy(false);
    if (data.ok) router.push(`/dashboard/assessments/${data.id}`);
    else router.refresh();
  }

  return (
    <button className="btn btn-p" onClick={create} disabled={busy}>
      {busy ? "Creating…" : "New assessment"}
    </button>
  );
}

export function InviteForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [department, setDepartment] = useState("");
  const [link, setLink] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function invite() {
    setError(""); setLink(""); setBusy(true);
    const res = await fetch("/api/invitations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, jobRole, department }),
    });
    const data = await res.json();
    setBusy(false);
    if (!data.ok) { setError(data.error || "Could not create the invitation"); return; }
    setLink(data.link);
    setEmail(""); setJobRole(""); setDepartment("");
    router.refresh();
  }

  return (
    <div className="rounded-[14px] border border-[var(--line)] bg-[var(--surface)] p-6">
      <h3 className="mb-1 text-[1.05rem]">Invite a colleague</h3>
      <p className="mb-5 text-[0.9rem] text-[var(--text-2)]">
        Capture role and department — responses are far more useful when they can be read by function.
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="field">
          <label htmlFor="inviteEmail">Work email</label>
          <input id="inviteEmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="inviteRole">Role</label>
          <input id="inviteRole" value={jobRole} onChange={(e) => setJobRole(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="inviteDept">Department</label>
          <input id="inviteDept" value={department} onChange={(e) => setDepartment(e.target.value)} />
        </div>
      </div>

      {error && <p className="mt-4 text-[0.88rem] text-[#E4572E]">{error}</p>}

      {link && (
        <div className="mt-4 rounded-[10px] border border-[var(--line)] bg-[var(--bg-alt)] p-4">
          <p className="mb-2 text-[0.86rem] text-[var(--text-2)]">
            Invitation created. Email sending isn&apos;t configured yet — send this link yourself:
          </p>
          <code className="block break-all text-[0.8rem]">{link}</code>
          <button
            className="btn btn-s btn-sm mt-3"
            onClick={() => navigator.clipboard.writeText(link)}
          >
            Copy link
          </button>
        </div>
      )}

      <button className="btn btn-p mt-5" onClick={invite} disabled={busy}>
        {busy ? "Creating…" : "Create invitation"}
      </button>
    </div>
  );
}
