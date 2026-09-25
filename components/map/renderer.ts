import {
  NODE_TYPES, SHELL_RADIUS, STEP_KINDS,
  type MapData, type OrgNode, type Process, type StepKind,
} from "@/lib/map-types";

const NS = "http://www.w3.org/2000/svg";

export interface ViewState {
  rx: number; ry: number; zoom: number;
  spin: boolean; shells: boolean; labels: boolean;
  mode: "structure" | "process";
  procIndex: number;
  selectedNodeId: string | null;
  selectedStepIndex: number | null;
  filters: Record<StepKind, boolean>;
}

export function defaultView(): ViewState {
  return {
    rx: -0.3, ry: 0.5, zoom: 1,
    spin: true, shells: true, labels: false,
    mode: "structure", procIndex: 0,
    selectedNodeId: null, selectedStepIndex: null,
    filters: { none: true, paper: true, shadow: true, system: true, unknown: true },
  };
}

function el(tag: string, attrs: Record<string, string | number | null | undefined>) {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) {
    const v = attrs[k];
    if (v !== null && v !== undefined) e.setAttribute(k, String(v));
  }
  return e;
}

function polyPoints(cx: number, cy: number, r: number, sides: number, rotDeg = 0) {
  const out: string[] = [];
  const rot = (rotDeg * Math.PI) / 180;
  for (let i = 0; i < sides; i++) {
    const a = rot - Math.PI / 2 + (i * 2 * Math.PI) / sides;
    out.push(`${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`);
  }
  return out.join(" ");
}

/** Each level gets its own silhouette — perspective makes size alone unreliable. */
function shapeEl(
  shape: string, cx: number, cy: number, r: number,
  attrs: Record<string, string | number | null | undefined>
) {
  const a = { ...attrs };
  if (shape === "circle") return el("circle", { ...a, cx: cx.toFixed(1), cy: cy.toFixed(1), r: r.toFixed(1) });
  const pts =
    shape === "square" ? polyPoints(cx, cy, r * 1.12, 4, 45)
    : shape === "triangle" ? polyPoints(cx, cy, r * 1.28, 3)
    : polyPoints(cx, cy, r * 1.06, 6);
  return el("polygon", { ...a, points: pts, "stroke-linejoin": "round" });
}

/** Icosahedron subdivided once — the wireframe shell for each layer. */
function geodesic(radius: number): [number[], number[]][] {
  const t = (1 + Math.sqrt(5)) / 2;
  let v: number[][] = [
    [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t],
    [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
  ];
  const faces = [
    [0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],
    [3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1],
  ];
  const norm = (p: number[]) => {
    const l = Math.hypot(p[0], p[1], p[2]);
    return [(p[0] / l) * radius, (p[1] / l) * radius, (p[2] / l) * radius];
  };
  v = v.map(norm);

  const mid: Record<string, number> = {};
  const mp = (a: number, b: number) => {
    const k = `${Math.min(a, b)}_${Math.max(a, b)}`;
    if (mid[k] !== undefined) return mid[k];
    v.push(norm([(v[a][0] + v[b][0]) / 2, (v[a][1] + v[b][1]) / 2, (v[a][2] + v[b][2]) / 2]));
    mid[k] = v.length - 1;
    return mid[k];
  };

  const f2: number[][] = [];
  faces.forEach((tr) => {
    const a = mp(tr[0], tr[1]), b = mp(tr[1], tr[2]), c = mp(tr[2], tr[0]);
    f2.push([tr[0], a, c], [tr[1], b, a], [tr[2], c, b], [a, b, c]);
  });

  const seen: Record<string, 1> = {};
  const edges: [number[], number[]][] = [];
  f2.forEach((tr) => {
    ([[tr[0], tr[1]], [tr[1], tr[2]], [tr[2], tr[0]]] as [number, number][]).forEach(([x, y]) => {
      const k = `${Math.min(x, y)}_${Math.max(x, y)}`;
      if (!seen[k]) { seen[k] = 1; edges.push([v[x], v[y]]); }
    });
  });
  return edges;
}

const SHELL_EDGES: Record<number, [number[], number[]][]> = {
  1: geodesic(SHELL_RADIUS[1]),
  2: geodesic(SHELL_RADIUS[2]),
  3: geodesic(SHELL_RADIUS[3]),
};

/** Even distribution on a sphere — a lat/long grid clumps at the poles. */
function fibSphere(i: number, n: number, r: number): [number, number, number] {
  if (n <= 1) return [0, 0, r];
  const off = 2 / n;
  const inc = Math.PI * (3 - Math.sqrt(5));
  const y = i * off - 1 + off / 2;
  const rad = Math.sqrt(Math.max(0, 1 - y * y));
  const phi = i * inc;
  return [Math.cos(phi) * rad * r, y * r, Math.sin(phi) * rad * r];
}

type Placed = OrgNode & { _x: number; _y: number; _z: number };

function layout(nodes: OrgNode[]): Placed[] {
  const byShell: Record<number, OrgNode[]> = {};
  nodes.forEach((n) => {
    const shell = NODE_TYPES[n.node_type]?.shell ?? 3;
    (byShell[shell] = byShell[shell] || []).push(n);
  });
  const out: Placed[] = [];
  Object.keys(byShell).forEach((key) => {
    const shell = Number(key);
    const arr = byShell[shell];
    const R = SHELL_RADIUS[shell] ?? 460;
    arr.forEach((n, i) => {
      const [x, y, z] = fibSphere(i, arr.length, R);
      out.push({ ...n, _x: x, _y: y, _z: z });
    });
  });
  return out;
}

export function render(
  svg: SVGSVGElement, data: MapData, view: ViewState, W: number, H: number
) {
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  svg.setAttribute("viewBox", `0 0 ${Math.round(W)} ${Math.round(H)}`);
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

  const defs = el("defs", {});
  const glow = el("filter", { id: "mapGlow", x: "-90%", y: "-90%", width: "280%", height: "280%" });
  glow.appendChild(el("feGaussianBlur", { stdDeviation: 2.4, result: "b" }));
  const merge = el("feMerge", {});
  merge.appendChild(el("feMergeNode", { in: "b" }));
  merge.appendChild(el("feMergeNode", { in: "SourceGraphic" }));
  glow.appendChild(merge);
  defs.appendChild(glow);
  svg.appendChild(defs);

  if (!data.nodes.length) {
    const t = el("text", {
      x: W / 2, y: H / 2, "text-anchor": "middle", "font-size": 13, fill: "#8195AD",
    });
    t.textContent = "No organization mapped yet — add the company node to begin.";
    svg.appendChild(t);
    return;
  }

  const placed = layout(data.nodes);
  const byId: Record<string, Placed> = {};
  placed.forEach((n) => { byId[n.id] = n; });

  const proj = (x: number, y: number, z: number) => {
    const cy = Math.cos(view.ry), sy = Math.sin(view.ry);
    const cx = Math.cos(view.rx), sx = Math.sin(view.rx);
    const X = x * cy - z * sy;
    let Z = x * sy + z * cy;
    const Y = y * cx - Z * sx;
    Z = y * sx + Z * cx;
    const F = 1500;
    const s = (F / (F - Z)) * view.zoom;
    return { x: W / 2 + X * s, y: H / 2 + Y * s, z: Z, s };
  };

  const parts: { z: number; el: Element }[] = [];
  const proc: Process | undefined = data.processes[view.procIndex];
  const flowFirst: Record<string, number> = {};
  if (view.mode === "process" && proc) {
    proc.steps.forEach((s, i) => {
      if (s.node_id && flowFirst[s.node_id] === undefined) flowFirst[s.node_id] = i;
    });
  }

  if (view.shells) {
    [1, 2, 3].forEach((shell) => {
      if (!data.nodes.some((n) => NODE_TYPES[n.node_type]?.shell === shell)) return;
      SHELL_EDGES[shell].forEach(([p1, p2]) => {
        const a = proj(p1[0], p1[1], p1[2]);
        const b = proj(p2[0], p2[1], p2[2]);
        const dp = ((a.z + b.z) / 2 + SHELL_RADIUS[3]) / (SHELL_RADIUS[3] * 2);
        parts.push({ z: -9999, el: el("line", {
          x1: a.x.toFixed(1), y1: a.y.toFixed(1), x2: b.x.toFixed(1), y2: b.y.toFixed(1),
          stroke: "#5C7FA6", "stroke-width": 0.55, opacity: (0.05 + 0.13 * dp).toFixed(3),
        })});
      });
    });
  }

  // reporting lines
  placed.forEach((n) => {
    if (!n.parent_id) return;
    const parent = byId[n.parent_id];
    if (!parent) return;
    const a = proj(n._x, n._y, n._z);
    const b = proj(parent._x, parent._y, parent._z);
    const dp = ((a.z + b.z) / 2 + SHELL_RADIUS[3]) / (SHELL_RADIUS[3] * 2);
    const dimmed = view.mode === "process" && flowFirst[n.id] === undefined && flowFirst[parent.id] === undefined;
    parts.push({ z: Math.min(a.z, b.z), el: el("line", {
      x1: a.x.toFixed(1), y1: a.y.toFixed(1), x2: b.x.toFixed(1), y2: b.y.toFixed(1),
      stroke: n.declared ? "#B0BECE" : "#7FA0C4",
      "stroke-dasharray": n.declared ? "3 3" : null,
      "stroke-width": (0.8 + 0.9 * dp).toFixed(2),
      opacity: (dimmed ? 0.08 : 0.22 + 0.45 * dp).toFixed(3),
    })});
  });

  // process path
  if (view.mode === "process" && proc) {
    for (let i = 0; i < proc.steps.length - 1; i++) {
      const A = proc.steps[i].node_id ? byId[proc.steps[i].node_id!] : undefined;
      const B = proc.steps[i + 1].node_id ? byId[proc.steps[i + 1].node_id!] : undefined;
      if (!A || !B || A.id === B.id) continue;
      const kindA = proc.steps[i].kind, kindB = proc.steps[i + 1].kind;
      if (!view.filters[kindA] && !view.filters[kindB]) continue;
      const a = proj(A._x, A._y, A._z);
      const b = proj(B._x, B._y, B._z);
      const dp = ((a.z + b.z) / 2 + SHELL_RADIUS[3]) / (SHELL_RADIUS[3] * 2);
      const sel = view.selectedStepIndex === i || view.selectedStepIndex === i + 1;

      const hit = el("g", { "data-step": i + 1, style: "cursor:pointer" });
      hit.appendChild(el("line", {
        x1: a.x.toFixed(1), y1: a.y.toFixed(1), x2: b.x.toFixed(1), y2: b.y.toFixed(1),
        stroke: "transparent", "stroke-width": 16,
      }));
      parts.push({ z: Math.min(a.z, b.z) + 0.5, el: hit });

      parts.push({ z: Math.min(a.z, b.z) + 1, el: el("line", {
        x1: a.x.toFixed(1), y1: a.y.toFixed(1), x2: b.x.toFixed(1), y2: b.y.toFixed(1),
        stroke: STEP_KINDS[kindB].c,
        "stroke-width": (sel ? 2.6 : 1.4 + 1.3 * dp).toFixed(2),
        "stroke-dasharray": "14 26", "stroke-linecap": "round",
        opacity: (sel ? 0.95 : 0.4 + 0.45 * dp).toFixed(3),
      })});
    }
  }

  placed.forEach((n) => {
    const t = NODE_TYPES[n.node_type] ?? NODE_TYPES.position;
    const p = proj(n._x, n._y, n._z);
    const dp = (p.z + SHELL_RADIUS[3]) / (SHELL_RADIUS[3] * 2);
    const rad = Math.max(2.5, t.r * p.s);
    const selected = view.selectedNodeId === n.id;

    const stepIdx = flowFirst[n.id];
    const inFlow = stepIdx !== undefined;
    const kind: StepKind | null =
      view.mode === "process" && inFlow && proc ? proc.steps[stepIdx].kind : null;
    const filteredOut = kind !== null && !view.filters[kind];
    const dimmed = view.mode === "process" && (!inFlow || filteredOut) && n.node_type === "position";
    const fill = kind && !filteredOut ? STEP_KINDS[kind].c : t.color;

    const g = el("g", { "data-id": n.id, style: "cursor:pointer" });
    g.appendChild(shapeEl(t.shape, p.x, p.y, rad * 2.6, {
      fill, opacity: (dimmed ? 0.02 : 0.06 + 0.09 * dp).toFixed(3),
    }));

    if (n.declared) {
      g.appendChild(shapeEl(t.shape, p.x, p.y, rad, {
        fill: "#FFFFFF", stroke: fill, "stroke-width": 1.8, "stroke-dasharray": "3 2.5",
        opacity: (dimmed ? 0.25 : 0.75 + 0.25 * dp).toFixed(3),
      }));
    } else {
      g.appendChild(shapeEl(t.shape, p.x, p.y, rad, {
        fill, filter: "url(#mapGlow)", stroke: "#FFFFFF",
        "stroke-width": rad > 6 ? 1.2 : 0.8,
        opacity: (dimmed ? 0.2 : 0.62 + 0.38 * dp).toFixed(3),
      }));
    }

    if (selected) {
      g.appendChild(shapeEl(t.shape, p.x, p.y, rad * 1.9, {
        fill: "none", stroke: "#16202F", "stroke-width": 1.4, opacity: 0.85,
      }));
    }

    if (view.mode === "process" && inFlow) {
      g.appendChild(el("circle", {
        cx: (p.x - rad - 9).toFixed(1), cy: (p.y - rad - 4).toFixed(1), r: 8,
        fill: STEP_KINDS[proc!.steps[stepIdx].kind].c, opacity: 0.92,
      }));
      const num = el("text", {
        x: (p.x - rad - 9).toFixed(1), y: (p.y - rad - 1).toFixed(1),
        "text-anchor": "middle", "font-size": 9, "font-weight": 700, fill: "#FFFFFF",
      });
      num.textContent = proc!.steps
        .map((s, i) => (s.node_id === n.id ? i + 1 : null))
        .filter(Boolean)
        .join(",");
      g.appendChild(num);
    }

    const showLabel =
      view.labels || selected || n.node_type === "company" ||
      n.node_type === "department" || (view.mode === "process" && inFlow);

    if (showLabel && !dimmed) {
      const label = el("text", {
        x: (p.x + rad + 7).toFixed(1), y: (p.y + 3.5).toFixed(1),
        fill: selected ? "#16202F" : "#3E5573", "font-weight": 600,
        "font-size": n.node_type === "company" ? 13 : n.node_type === "department" ? 11 : 10,
        opacity: (0.55 + 0.45 * dp).toFixed(3),
      });
      label.textContent = n.label + (n.headcount && n.headcount > 1 ? ` (${n.headcount})` : "");
      g.appendChild(label);
    }

    parts.push({ z: p.z, el: g });
  });

  parts.sort((a, b) => a.z - b.z);
  const frag = document.createDocumentFragment();
  parts.forEach((x) => frag.appendChild(x.el));
  svg.appendChild(frag);
}
