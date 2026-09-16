export type DimensionKey =
  | "strategy" | "customer" | "process" | "org" | "people"
  | "tech" | "data" | "auto" | "ai" | "gov";

export interface Dimension {
  key: DimensionKey;
  label: string;
  full: string;
}

/** The ten dimensions of the SKYVIS Digital Assessment. */
export const DIMENSIONS: Dimension[] = [
  { key: "strategy", label: "Strategy",     full: "Business strategy" },
  { key: "customer", label: "Customer",     full: "Customer experience" },
  { key: "process",  label: "Process",      full: "Business processes" },
  { key: "org",      label: "Organization", full: "Organization" },
  { key: "people",   label: "People",       full: "People & skills" },
  { key: "tech",     label: "Technology",   full: "Technology" },
  { key: "data",     label: "Data",         full: "Data" },
  { key: "auto",     label: "Automation",   full: "Automation" },
  { key: "ai",       label: "AI readiness", full: "AI readiness" },
  { key: "gov",      label: "Governance",   full: "Governance & security" },
];

export type Scores = Record<DimensionKey, number>;

/** Example profile used in the marketing section. Averages 2.7 / 5. */
export const DEMO_SCORES: Scores = {
  strategy: 3.1, customer: 2.9, process: 2.4, org: 2.8, people: 2.5,
  tech: 3.4, data: 2.6, auto: 1.9, ai: 1.9, gov: 3.2,
};

export function averageScore(scores: Scores): number {
  const values = DIMENSIONS.map((d) => scores[d.key]);
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function rankDimensions(scores: Scores): Dimension[] {
  return [...DIMENSIONS].sort((a, b) => scores[a.key] - scores[b.key]);
}

export function maturityBand(overall: number) {
  if (overall < 2) {
    return {
      name: "Early",
      copy: "Foundations come first. At this stage the fastest return usually comes from connecting the systems you already own rather than buying new ones.",
    };
  }
  if (overall < 3) {
    return {
      name: "Developing",
      copy: "The pieces exist but aren't working together. Integration and process standardisation typically produce more value here than new software.",
    };
  }
  if (overall < 4) {
    return {
      name: "Established",
      copy: "Core capability is in place. The next gains come from automation, and from making data available at the moment decisions get made.",
    };
  }
  return {
    name: "Advanced",
    copy: "Strong position. Focus shifts to compounding it — AI applied to specific operations, and continuous optimisation rather than projects.",
  };
}
