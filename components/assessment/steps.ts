import type { DimensionKey } from "@/lib/dimensions";

export interface Question {
  dim: DimensionKey;
  q: string;
  a: [string, string, string, string, string];
}

export interface QuestionStep {
  title: string;
  head: string;
  sub: string;
  questions: Question[];
}

/** Steps 2–7 of the wizard. Step 1 is company info, step 8 is contact. */
export const QUESTION_STEPS: QuestionStep[] = [
  {
    title: "Business strategy",
    head: "How clearly is the direction set?",
    sub: "Strategy decides which technology is worth building. We start here.",
    questions: [
      {
        dim: "strategy",
        q: "Does your organization have a documented digital strategy?",
        a: ["No strategy exists", "Discussed, never written down", "A draft exists but isn't used", "Documented and shared with leadership", "Documented, funded, and reviewed quarterly"],
      },
      {
        dim: "strategy",
        q: "How well do technology investments map to business goals?",
        a: ["They don't — purchases are reactive", "Loosely, decided case by case", "Some initiatives have a business case", "Most have a business case with owners", "Every initiative is tied to a tracked outcome"],
      },
      {
        dim: "customer",
        q: "How well do you understand your customer's experience end to end?",
        a: ["We rely on assumptions", "Anecdotal feedback only", "We collect feedback but rarely act", "We measure key moments and act on them", "We track the full journey and design against it"],
      },
      {
        dim: "customer",
        q: "Can a customer transact with you through digital channels?",
        a: ["No digital channel", "Information only, no transactions", "Basic online ordering", "Full digital transactions on one channel", "Consistent experience across all channels"],
      },
    ],
  },
  {
    title: "Operations",
    head: "How does work actually move?",
    sub: "This is where most of the recoverable cost sits.",
    questions: [
      {
        dim: "process",
        q: "Are your core business processes documented?",
        a: ["Not documented anywhere", "A few, informally", "Key processes documented, often outdated", "Most documented and maintained", "All documented, owned, and reviewed"],
      },
      {
        dim: "process",
        q: "How much of your team's day goes to manual, repetitive work?",
        a: ["Most of the day", "Well over half", "Roughly half", "A meaningful minority", "Very little — it's been automated"],
      },
      {
        dim: "process",
        q: "Do branches, teams, or outlets follow the same process?",
        a: ["Every location does it differently", "Broadly similar, no standard", "A standard exists, adherence varies", "Standardised with known exceptions", "Standardised, measured, and enforced"],
      },
      {
        dim: "auto",
        q: "How much of the handoff between systems is automated?",
        a: ["Everything is re-keyed by hand", "One or two exports", "Some integrations, many manual steps", "Most handoffs are automated", "End-to-end automated with exception handling"],
      },
    ],
  },
  {
    title: "Technology",
    head: "What are you running today?",
    sub: "The landscape, and how well the pieces talk to each other.",
    questions: [
      {
        dim: "tech",
        q: "Which core systems are in place?",
        a: ["Spreadsheets only", "One system, e.g. accounting", "Two or three, unconnected", "Core suite in place, partly integrated", "Integrated ERP, CRM, POS, and HR"],
      },
      {
        dim: "tech",
        q: "How well do your systems exchange data?",
        a: ["They don't", "Manual export and import", "A few point-to-point links", "Most connected through integrations", "A managed integration layer or API platform"],
      },
      {
        dim: "tech",
        q: "Where does your infrastructure run?",
        a: ["Local machines and files", "On-premise servers only", "Mostly on-premise, some cloud", "Mostly cloud", "Cloud-native with managed operations"],
      },
      {
        dim: "gov",
        q: "How is access, security, and IT governance handled?",
        a: ["No defined policy", "Informal, handled ad hoc", "Basic policies, limited enforcement", "Defined policies with regular review", "Governed, audited, and monitored continuously"],
      },
    ],
  },
  {
    title: "Data",
    head: "Can you see the business?",
    sub: "Visibility is the capability everything else depends on.",
    questions: [
      {
        dim: "data",
        q: "How available is the data you need to run the business?",
        a: ["Scattered and hard to find", "Available but only in each system", "Consolidated manually when needed", "Centrally available to analysts", "Centrally available in near real time"],
      },
      {
        dim: "data",
        q: "How much do you trust your data's accuracy?",
        a: ["We routinely find errors", "Trusted for some areas only", "Broadly trusted after checking", "Trusted, with known quality rules", "Quality is monitored and owned"],
      },
      {
        dim: "data",
        q: "How is management reporting produced?",
        a: ["Manually in spreadsheets", "Exported and reassembled each month", "Semi-automated reports", "Dashboards refreshed automatically", "Self-service analytics across the business"],
      },
      {
        dim: "data",
        q: "How quickly do decision-makers get the numbers?",
        a: ["Weeks after period end", "A week or more", "A few days", "Next day", "Live"],
      },
    ],
  },
  {
    title: "Automation & AI",
    head: "What's already working without hands on it?",
    sub: "AI readiness is mostly a data and process question, not a model question.",
    questions: [
      {
        dim: "auto",
        q: "How much of your repetitive work is automated today?",
        a: ["None", "One or two small tasks", "Several processes in one department", "Automation across multiple departments", "Automation is the default for new processes"],
      },
      {
        dim: "ai",
        q: "Is AI used anywhere in your operations?",
        a: ["Not at all", "Individuals experiment informally", "One pilot underway", "One or more solutions in production", "AI embedded in core operations"],
      },
      {
        dim: "ai",
        q: "Is your data ready to support AI?",
        a: ["Data isn't structured or centralised", "Some structured data, poor quality", "Structured, centralised for some domains", "Good quality across key domains", "Governed, labelled, and AI-ready"],
      },
      {
        dim: "auto",
        q: "Do you measure the time your processes take?",
        a: ["Never measured", "Estimated occasionally", "Measured for a few processes", "Measured for most core processes", "Measured continuously with targets"],
      },
    ],
  },
  {
    title: "People & culture",
    head: "Will the organization carry it?",
    sub: "Transformation fails here more often than it fails technically.",
    questions: [
      {
        dim: "people",
        q: "How would you rate digital skills across the organization?",
        a: ["Very limited", "Basic in a few roles", "Adequate in core roles", "Strong in most roles", "Strong, with ongoing development"],
      },
      {
        dim: "org",
        q: "Who owns digital change?",
        a: ["Nobody", "IT, by default", "A part-time owner", "A named leader with a mandate", "A leader, a team, and a budget"],
      },
      {
        dim: "org",
        q: "How does the organization handle change?",
        a: ["Change is usually resisted", "Slow and difficult", "Manageable with effort", "Generally accepted", "Change is planned and supported as standard"],
      },
      {
        dim: "people",
        q: "How do employees adopt new systems after rollout?",
        a: ["Adoption typically fails", "Partial, with workarounds", "Adopted after a long ramp", "Adopted with training support", "Adopted quickly, measured after launch"],
      },
    ],
  },
];

export const TOTAL_STEPS = QUESTION_STEPS.length + 2; // company info + questions + contact
