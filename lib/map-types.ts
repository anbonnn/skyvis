export type NodeType = "company" | "department" | "team" | "position";
export type StepKind = "none" | "paper" | "shadow" | "system" | "unknown";

export interface OrgNode {
  id: string;
  parent_id: string | null;
  label: string;
  node_type: NodeType;
  headcount: number | null;
  purpose: string | null;
  systems: string[] | null;
  manual_level: string | null;
  variance: string | null;
  declared: boolean;
  position: number;
}

export interface ProcessStep {
  id: string;
  node_id: string | null;
  seq: number;
  action: string;
  sys: string | null;
  kind: StepKind;
  rule: string | null;
}

export interface Process {
  id: string;
  name: string;
  short_name: string | null;
  trigger: string | null;
  ends_when: string | null;
  position: number;
  steps: ProcessStep[];
}

export interface MapData {
  nodes: OrgNode[];
  processes: Process[];
}

/** Shape, shell and colour per level. */
export const NODE_TYPES: Record<NodeType, {
  shell: number; r: number; color: string; label: string;
  shape: "hex" | "square" | "triangle" | "circle";
}> = {
  company:    { shell: 0, r: 23, color: "#0F2340", label: "Company",    shape: "hex" },
  department: { shell: 1, r: 13, color: "#1565D8", label: "Department", shape: "square" },
  team:       { shell: 2, r: 11, color: "#4E9BE8", label: "Team",       shape: "triangle" },
  position:   { shell: 3, r: 7,  color: "#93A9C2", label: "Position",   shape: "circle" },
};

export const SHELL_RADIUS = [0, 160, 290, 410];

/**
 * How the work is carried. "No system" and "Excel" are different findings —
 * this distinction is what decides whether the remedy is software or not.
 */
export const STEP_KINDS: Record<StepKind, { c: string; label: string; note: string }> = {
  none:    { c: "#E03E2D", label: "No system",     note: "Verbal, from memory, or nothing at all" },
  paper:   { c: "#C9508A", label: "Paper",         note: "Printed or handwritten" },
  shadow:  { c: "#D9880F", label: "Excel / chat",  note: "Real work on unofficial tools" },
  system:  { c: "#1565D8", label: "System",        note: "A proper system of record" },
  unknown: { c: "#94A3B5", label: "Not yet known", note: "Needs an interview before it can be classified" },
};
