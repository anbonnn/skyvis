"use client";

import { useState } from "react";
import {
  NODE_TYPES, STEP_KINDS,
  type MapData, type NodeType, type Process, type StepKind,
} from "@/lib/map-types";
import type { ViewState } from "./renderer";

type Write = (action: string, payload: Record<string, unknown>) => Promise<{ ok: boolean }>;

export function MapEditor({
  data, view, setView, write, canEdit, busy, proc,
}: {
  data: MapData;
  view: ViewState;
  setView: (fn: (v: ViewState) => ViewState) => void;
  write: Write;
  canEdit: boolean;
  busy: boolean;
  proc?: Process;
}) {
  const [tab, setTab] = useState<"structure" | "process">("structure");
  const selected = data.nodes.find((n) => n.id === view.selectedNodeId) ?? null;

  return (
    <aside className="flex min-h-0 flex-col gap-4 overflow-y-auto">
      <div className="flex gap-1 rounded-[9px] border border-[var(--line)] bg-[var(--bg-alt)] p-[3px]">
        {(["structure", "process"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-[7px] px-3 py-[6px] text-[0.76rem] font-semibold capitalize ${
              tab === t ? "bg-[var(--surface)] text-[var(--sky)] shadow-sm" : "text-[var(--text-2)]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "structure"
        ? <StructurePanel data={data} selectedId={view.selectedNodeId} setView={setView} write={write} canEdit={canEdit} busy={busy} selected={selected} />
        : <ProcessPanel data={data} view={view} setView={setView} write={write} canEdit={canEdit} busy={busy} proc={proc} />}
    </aside>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[14px] border border-[var(--line)] bg-[var(--surface)]">
      <h3 className="border-b border-[var(--line)] px-4 py-3 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--text-3)]">
        {title}
      </h3>
      <div className="p-4">{children}</div>
    </div>
  );
}

function StructurePanel({
  data, selectedId, setView, write, canEdit, busy, selected,
}: {
  data: MapData;
  selectedId: string | null;
  setView: (fn: (v: ViewState) => ViewState) => void;
  write: Write;
  canEdit: boolean;
  busy: boolean;
  selected: MapData["nodes"][number] | null;
}) {
  const [label, setLabel] = useState("");
  const [nodeType, setNodeType] = useState<NodeType>("position");
  const [parent, setParent] = useState("");
  const [declared, setDeclared] = useState(false);

  const hasCompany = data.nodes.some((n) => n.node_type === "company");

  return (
    <>
      {canEdit && (
        <Card title="Add">
          {!hasCompany && (
            <p className="mb-3 rounded-[8px] bg-[#FFF6E6] px-3 py-2 text-[0.78rem] text-[#8A5A00]">
              Start with the company node — everything hangs from it.
            </p>
          )}
          <label className="mb-1 block text-[0.72rem] font-semibold text-[var(--text-3)]">Name</label>
          <input className="mb-3 w-full rounded-[9px] border border-[var(--line-2)] px-3 py-2 text-[0.85rem]"
            value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Operations" />

          <label className="mb-1 block text-[0.72rem] font-semibold text-[var(--text-3)]">Level</label>
          <select className="mb-3 w-full rounded-[9px] border border-[var(--line-2)] px-3 py-2 text-[0.85rem]"
            value={nodeType} onChange={(e) => setNodeType(e.target.value as NodeType)}>
            {(Object.keys(NODE_TYPES) as NodeType[]).map((k) => (
              <option key={k} value={k}>{NODE_TYPES[k].label}</option>
            ))}
          </select>

          <label className="mb-1 block text-[0.72rem] font-semibold text-[var(--text-3)]">Belongs to</label>
          <select className="mb-3 w-full rounded-[9px] border border-[var(--line-2)] px-3 py-2 text-[0.85rem]"
            value={parent} onChange={(e) => setParent(e.target.value)}>
            <option value="">— none —</option>
            {data.nodes.map((n) => <option key={n.id} value={n.id}>{n.label}</option>)}
          </select>

          <label className="mb-3 flex items-center gap-2 text-[0.78rem] text-[var(--text-2)]">
            <input type="checkbox" checked={declared} onChange={(e) => setDeclared(e.target.checked)} />
            Required by policy, not staffed
          </label>

          <button
            disabled={busy || !label.trim()}
            onClick={async () => {
              await write("createNode", {
                label: label.trim(), node_type: nodeType,
                parent_id: parent || null, declared,
              });
              setLabel("");
            }}
            className="w-full rounded-[9px] bg-[var(--sky)] px-3 py-2 text-[0.8rem] font-semibold text-white disabled:opacity-40"
          >
            Add node
          </button>
        </Card>
      )}

      <Card title={`Nodes (${data.nodes.length})`}>
        <div className="grid max-h-[260px] gap-[2px] overflow-y-auto">
          {data.nodes.map((n) => (
            <button
              key={n.id}
              onClick={() => setView((v) => ({ ...v, selectedNodeId: n.id, selectedStepIndex: null }))}
              className={`flex items-center gap-2 rounded-[7px] px-[9px] py-[7px] text-left text-[0.82rem] ${
                selectedId === n.id ? "bg-[#EAF3FE] font-semibold" : "text-[var(--text-2)] hover:bg-[var(--bg-alt)]"
              }`}
            >
              <i className="h-2 w-2 shrink-0" style={{
                background: n.declared ? "transparent" : NODE_TYPES[n.node_type].color,
                border: n.declared ? `1.5px dashed ${NODE_TYPES[n.node_type].color}` : "none",
                borderRadius: NODE_TYPES[n.node_type].shape === "circle" ? "50%" : 2,
              }} />
              <span className="flex-1 truncate">{n.label}</span>
              <span className="text-[0.7rem] text-[var(--text-3)]">{NODE_TYPES[n.node_type].label}</span>
            </button>
          ))}
          {!data.nodes.length && <p className="py-6 text-center text-[0.82rem] text-[var(--text-3)]">Nothing yet.</p>}
        </div>
      </Card>

      {selected && (
        <Card title="Selected">
          <NodeDetail node={selected} write={write} canEdit={canEdit} busy={busy} data={data} />
        </Card>
      )}
    </>
  );
}

function NodeDetail({
  node, write, canEdit, busy, data,
}: {
  node: MapData["nodes"][number];
  write: Write; canEdit: boolean; busy: boolean; data: MapData;
}) {
  const [form, setForm] = useState({
    label: node.label,
    purpose: node.purpose ?? "",
    headcount: node.headcount?.toString() ?? "",
    systems: (node.systems ?? []).join(", "),
    manual_level: node.manual_level ?? "",
    variance: node.variance ?? "",
  });

  const field = (k: keyof typeof form, label: string, placeholder = "") => (
    <div className="mb-3">
      <label className="mb-1 block text-[0.72rem] font-semibold text-[var(--text-3)]">{label}</label>
      <input
        className="w-full rounded-[9px] border border-[var(--line-2)] px-3 py-2 text-[0.85rem] disabled:bg-[var(--bg-alt)]"
        value={form[k]} placeholder={placeholder} disabled={!canEdit}
        onChange={(e) => setForm({ ...form, [k]: e.target.value })}
      />
    </div>
  );

  return (
    <>
      <p className="mb-3 text-[0.72rem] uppercase tracking-[0.1em] text-[var(--sky)]">
        {NODE_TYPES[node.node_type].label}
        {node.declared && <span className="ml-2 text-[#B26A00]">· not staffed</span>}
      </p>

      {field("label", "Name")}
      {field("purpose", "Purpose", "What this exists to achieve")}
      {field("headcount", "Headcount")}
      {field("systems", "Systems", "Excel, Jira, paper…")}
      {field("manual_level", "Manual work", "High / Medium / Low")}
      {field("variance", "Variance", "How it differs between sites")}

      {canEdit && (
        <div className="flex gap-2">
          <button
            disabled={busy}
            onClick={() => write("updateNode", {
              id: node.id, label: form.label, purpose: form.purpose || null,
              headcount: form.headcount ? Number(form.headcount) : null,
              systems: form.systems ? form.systems.split(",").map((s) => s.trim()).filter(Boolean) : null,
              manual_level: form.manual_level || null, variance: form.variance || null,
              parent_id: node.parent_id,
            })}
            className="flex-1 rounded-[9px] bg-[var(--sky)] px-3 py-2 text-[0.8rem] font-semibold text-white disabled:opacity-40"
          >
            Save
          </button>
          <button
            disabled={busy}
            onClick={() => {
              const kids = data.nodes.filter((n) => n.parent_id === node.id).length;
              const msg = kids
                ? `Delete "${node.label}" and its ${kids} child node(s)?`
                : `Delete "${node.label}"?`;
              if (confirm(msg)) write("deleteNode", { id: node.id });
            }}
            className="rounded-[9px] border border-[#E03E2D]/40 px-3 py-2 text-[0.8rem] font-semibold text-[#E03E2D]"
          >
            Delete
          </button>
        </div>
      )}
    </>
  );
}

function ProcessPanel({
  data, view, setView, write, canEdit, busy, proc,
}: {
  data: MapData;
  view: ViewState;
  setView: (fn: (v: ViewState) => ViewState) => void;
  write: Write; canEdit: boolean; busy: boolean; proc?: Process;
}) {
  const [name, setName] = useState("");
  const [step, setStep] = useState({ node_id: "", action: "", sys: "", kind: "unknown" as StepKind, rule: "" });

  return (
    <>
      {canEdit && (
        <Card title="New process">
          <input
            className="mb-3 w-full rounded-[9px] border border-[var(--line-2)] px-3 py-2 text-[0.85rem]"
            value={name} onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Order to delivery"
          />
          <button
            disabled={busy || !name.trim()}
            onClick={async () => { await write("createProcess", { name: name.trim(), short_name: name.trim() }); setName(""); }}
            className="w-full rounded-[9px] bg-[var(--sky)] px-3 py-2 text-[0.8rem] font-semibold text-white disabled:opacity-40"
          >
            Add process
          </button>
        </Card>
      )}

      {!proc ? (
        <Card title="Steps">
          <p className="py-6 text-center text-[0.82rem] text-[var(--text-3)]">
            Create a process, then add its steps in order.
          </p>
        </Card>
      ) : (
        <>
          <Card title={`Steps — ${proc.name}`}>
            <div className="grid gap-[2px]">
              {proc.steps.map((s, i) => {
                const owner = data.nodes.find((n) => n.id === s.node_id);
                const k = STEP_KINDS[s.kind];
                return (
                  <div
                    key={s.id}
                    className={`rounded-[9px] p-[9px] ${
                      view.selectedStepIndex === i ? "bg-[#EAF3FE]" : "hover:bg-[var(--bg-alt)]"
                    }`}
                  >
                    <button
                      className="flex w-full gap-[10px] text-left"
                      onClick={() => setView((v) => ({
                        ...v, selectedStepIndex: i, selectedNodeId: s.node_id, mode: "process",
                      }))}
                    >
                      <span className="mt-[2px] grid h-5 w-5 shrink-0 place-items-center rounded-full text-[0.65rem] font-bold text-white"
                        style={{ background: k.c }}>{i + 1}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[0.8rem] font-bold">
                          {owner?.label ?? <span className="text-[#E03E2D]">no owner</span>}
                        </span>
                        <span className="block text-[0.76rem] leading-[1.4] text-[var(--text-2)]">{s.action}</span>
                        <span className="mt-1 inline-block rounded-[5px] px-[6px] py-[1px] text-[0.66rem] font-semibold"
                          style={{ background: `${k.c}1E`, color: k.c }}>{s.sys || k.label}</span>
                      </span>
                    </button>
                    {canEdit && (
                      <div className="mt-2 flex gap-2 pl-[30px]">
                        <button onClick={() => write("moveStep", { id: s.id, dir: -1 })}
                          className="text-[0.7rem] text-[var(--text-3)] hover:text-[var(--sky)]">↑</button>
                        <button onClick={() => write("moveStep", { id: s.id, dir: 1 })}
                          className="text-[0.7rem] text-[var(--text-3)] hover:text-[var(--sky)]">↓</button>
                        <button onClick={() => write("deleteStep", { id: s.id })}
                          className="text-[0.7rem] text-[var(--text-3)] hover:text-[#E03E2D]">remove</button>
                      </div>
                    )}
                  </div>
                );
              })}
              {!proc.steps.length && (
                <p className="py-6 text-center text-[0.82rem] text-[var(--text-3)]">No steps yet.</p>
              )}
            </div>
          </Card>

          {canEdit && (
            <Card title="Add step">
              <label className="mb-1 block text-[0.72rem] font-semibold text-[var(--text-3)]">Who does it</label>
              <select className="mb-3 w-full rounded-[9px] border border-[var(--line-2)] px-3 py-2 text-[0.85rem]"
                value={step.node_id} onChange={(e) => setStep({ ...step, node_id: e.target.value })}>
                <option value="">— select —</option>
                {data.nodes.filter((n) => n.node_type === "position" || n.node_type === "team")
                  .map((n) => <option key={n.id} value={n.id}>{n.label}</option>)}
              </select>

              <label className="mb-1 block text-[0.72rem] font-semibold text-[var(--text-3)]">What they do</label>
              <textarea className="mb-3 min-h-[60px] w-full rounded-[9px] border border-[var(--line-2)] px-3 py-2 text-[0.85rem]"
                value={step.action} onChange={(e) => setStep({ ...step, action: e.target.value })}
                placeholder="Write it as they would say it" />

              <label className="mb-1 block text-[0.72rem] font-semibold text-[var(--text-3)]">System used</label>
              <input className="mb-3 w-full rounded-[9px] border border-[var(--line-2)] px-3 py-2 text-[0.85rem]"
                value={step.sys} onChange={(e) => setStep({ ...step, sys: e.target.value })}
                placeholder="Excel, Jira, paper, verbal…" />

              <label className="mb-1 block text-[0.72rem] font-semibold text-[var(--text-3)]">How it&apos;s carried</label>
              <select className="mb-3 w-full rounded-[9px] border border-[var(--line-2)] px-3 py-2 text-[0.85rem]"
                value={step.kind} onChange={(e) => setStep({ ...step, kind: e.target.value as StepKind })}>
                {(Object.keys(STEP_KINDS) as StepKind[]).map((k) => (
                  <option key={k} value={k}>{STEP_KINDS[k].label} — {STEP_KINDS[k].note}</option>
                ))}
              </select>

              <label className="mb-1 block text-[0.72rem] font-semibold text-[var(--text-3)]">Rule or timing</label>
              <input className="mb-3 w-full rounded-[9px] border border-[var(--line-2)] px-3 py-2 text-[0.85rem]"
                value={step.rule} onChange={(e) => setStep({ ...step, rule: e.target.value })}
                placeholder="e.g. within 1 business day" />

              <button
                disabled={busy || !step.action.trim()}
                onClick={async () => {
                  await write("addStep", { process_id: proc.id, ...step, node_id: step.node_id || null });
                  setStep({ node_id: "", action: "", sys: "", kind: "unknown", rule: "" });
                }}
                className="w-full rounded-[9px] bg-[var(--sky)] px-3 py-2 text-[0.8rem] font-semibold text-white disabled:opacity-40"
              >
                Add step
              </button>
            </Card>
          )}
        </>
      )}
    </>
  );
}
