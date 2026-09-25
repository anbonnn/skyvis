"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { NODE_TYPES, STEP_KINDS, type MapData, type NodeType, type StepKind } from "@/lib/map-types";
import { defaultView, render, type ViewState } from "./renderer";
import { MapEditor } from "./MapEditor";

export function BusinessMap({ initial, canEdit }: { initial: MapData; canEdit: boolean }) {
  const [data, setData] = useState<MapData>(initial);
  const [view, setView] = useState<ViewState>(defaultView());
  const [busy, setBusy] = useState(false);

  const svgRef = useRef<SVGSVGElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef(view);
  const dataRef = useRef(data);
  const drag = useRef<{ x: number; y: number } | null>(null);

  viewRef.current = view;
  dataRef.current = data;

  // Imperative draw loop: the scene is rebuilt each frame, so React state
  // only drives the panels, never 60fps DOM work.
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const svg = svgRef.current;
      const box = boxRef.current;
      if (svg && box) {
        const r = box.getBoundingClientRect();
        const W = Math.max(360, r.width);
        const H = Math.max(360, r.height);
        if (viewRef.current.spin && !drag.current) viewRef.current.ry += 0.0022;
        render(svg, dataRef.current, viewRef.current, W, H);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const reload = useCallback(async () => {
    const res = await fetch("/api/map");
    const json = await res.json();
    if (json.ok) setData(json.data as MapData);
  }, []);

  const write = useCallback(
    async (action: string, payload: Record<string, unknown>) => {
      setBusy(true);
      try {
        const res = await fetch("/api/map", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, payload }),
        });
        const json = await res.json();
        await reload();
        return json;
      } finally {
        setBusy(false);
      }
    },
    [reload]
  );

  function onPointerDown(e: React.PointerEvent) {
    const target = e.target as Element;
    const stepG = target.closest("g[data-step]");
    if (stepG) {
      const i = Number(stepG.getAttribute("data-step"));
      const proc = data.processes[view.procIndex];
      setView((v) => ({ ...v, selectedStepIndex: i, selectedNodeId: proc?.steps[i]?.node_id ?? null }));
      return;
    }
    const nodeG = target.closest("g[data-id]");
    if (nodeG) {
      setView((v) => ({ ...v, selectedNodeId: nodeG.getAttribute("data-id"), selectedStepIndex: null }));
      return;
    }
    drag.current = { x: e.clientX, y: e.clientY };
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!drag.current) return;
    viewRef.current.ry += (e.clientX - drag.current.x) * 0.006;
    viewRef.current.rx = Math.max(-1.3, Math.min(1.3, viewRef.current.rx + (e.clientY - drag.current.y) * 0.006));
    drag.current = { x: e.clientX, y: e.clientY };
  }

  useEffect(() => {
    const up = () => { drag.current = null; };
    window.addEventListener("pointerup", up);
    return () => window.removeEventListener("pointerup", up);
  }, []);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      viewRef.current.zoom = Math.max(0.45, Math.min(3, viewRef.current.zoom * (e.deltaY > 0 ? 0.93 : 1.07)));
    };
    box.addEventListener("wheel", onWheel, { passive: false });
    return () => box.removeEventListener("wheel", onWheel);
  }, []);

  const set = (patch: Partial<ViewState>) => setView((v) => ({ ...v, ...patch }));
  const proc = data.processes[view.procIndex];

  return (
    <div className="grid min-h-0 grid-rows-[auto_auto_1fr]">
      <div className="flex flex-wrap items-center gap-4 border-b border-[var(--line)] px-1 pb-3">
        <div className="flex gap-1 rounded-[9px] border border-[var(--line)] bg-[var(--bg-alt)] p-[3px]">
          {(["structure", "process"] as const).map((m) => (
            <button
              key={m}
              onClick={() => set({ mode: m, selectedStepIndex: null })}
              className={`rounded-[7px] px-[14px] py-[6px] text-[0.78rem] font-semibold capitalize ${
                view.mode === m ? "bg-[var(--surface)] text-[var(--sky)] shadow-sm" : "text-[var(--text-2)]"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {view.mode === "process" && data.processes.length > 0 && (
          <select
            className="rounded-[9px] border border-[var(--line-2)] bg-[var(--surface)] px-3 py-2 text-[0.8rem] font-medium"
            value={view.procIndex}
            onChange={(e) => set({ procIndex: Number(e.target.value), selectedStepIndex: null })}
          >
            {data.processes.map((p, i) => (
              <option key={p.id} value={i}>{p.short_name || p.name}</option>
            ))}
          </select>
        )}

        {view.mode === "process" && (
          <div className="flex flex-wrap gap-[6px]">
            {(Object.keys(STEP_KINDS) as StepKind[]).map((k) => {
              const on = view.filters[k];
              return (
                <button
                  key={k}
                  onClick={() => set({ filters: { ...view.filters, [k]: !on } })}
                  className="flex items-center gap-[7px] rounded-full border px-3 py-[5px] text-[0.73rem] font-semibold"
                  style={{
                    borderColor: on ? STEP_KINDS[k].c : "var(--line-2)",
                    color: on ? STEP_KINDS[k].c : "var(--text-3)",
                  }}
                  title={STEP_KINDS[k].note}
                >
                  <i className="h-2 w-2 rounded-full" style={{ background: STEP_KINDS[k].c, opacity: on ? 1 : 0.3 }} />
                  {STEP_KINDS[k].label}
                </button>
              );
            })}
          </div>
        )}

        <div className="ml-auto flex gap-[6px]">
          {([["spin", "Spin"], ["shells", "Shells"], ["labels", "Labels"]] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => set({ [key]: !view[key] } as Partial<ViewState>)}
              className={`rounded-[8px] border px-3 py-[6px] text-[0.74rem] font-semibold ${
                view[key] ? "border-[var(--sky)] bg-[#EAF3FE] text-[var(--sky)]" : "border-[var(--line-2)] text-[var(--text-2)]"
              }`}
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => { viewRef.current.rx = -0.3; viewRef.current.ry = 0.5; viewRef.current.zoom = 1; }}
            className="rounded-[8px] border border-[var(--line-2)] px-3 py-[6px] text-[0.74rem] font-semibold text-[var(--text-2)]"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-5 px-1 py-3 text-[0.72rem] text-[var(--text-2)]">
        {(Object.keys(NODE_TYPES) as NodeType[]).map((k) => (
          <span key={k} className="flex items-center gap-[6px]">
            <i className="h-[9px] w-[9px]" style={{
              background: NODE_TYPES[k].color,
              borderRadius: NODE_TYPES[k].shape === "circle" ? "50%" : 2,
            }} />
            {NODE_TYPES[k].label}
          </span>
        ))}
        <span className="flex items-center gap-[6px]">
          <i className="h-[9px] w-[9px] rounded-full border-2 border-dashed border-[#93A9C2]" />
          Declared, not staffed
        </span>
        <span className="ml-auto text-[var(--text-3)]">Drag to rotate · scroll to zoom · click to select</span>
      </div>

      <div className="grid min-h-0 gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div
          ref={boxRef}
          className="relative min-h-[480px] overflow-hidden rounded-[14px] border border-[var(--line)]"
          style={{ background: "radial-gradient(ellipse 60% 55% at 50% 45%, #EDF4FD, transparent 72%), var(--bg-alt)" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
        >
          <svg ref={svgRef} className="block h-full w-full cursor-grab touch-none" />
        </div>

        <MapEditor
          data={data}
          view={view}
          setView={setView}
          write={write}
          canEdit={canEdit}
          busy={busy}
          proc={proc}
        />
      </div>
    </div>
  );
}
