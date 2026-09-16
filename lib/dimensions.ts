import type { Locale } from "@/lib/language";

export type DimensionKey =
  | "strategy" | "customer" | "process" | "org" | "people"
  | "tech" | "data" | "auto" | "ai" | "gov";

export interface Dimension {
  key: DimensionKey;
  label: string;
  full: string;
}

const DIMENSION_ORDER: DimensionKey[] = [
  "strategy", "customer", "process", "org", "people", "tech", "data", "auto", "ai", "gov",
];

const DIMENSION_TEXT: Record<DimensionKey, Record<Locale, { label: string; full: string }>> = {
  strategy: {
    mn: { label: "Стратеги", full: "Бизнесийн стратеги" },
    en: { label: "Strategy", full: "Business strategy" },
  },
  customer: {
    mn: { label: "Харилцагч", full: "Харилцагчийн туршлага" },
    en: { label: "Customer", full: "Customer experience" },
  },
  process: {
    mn: { label: "Процесс", full: "Бизнес процесс" },
    en: { label: "Process", full: "Business processes" },
  },
  org: {
    mn: { label: "Байгууллага", full: "Байгууллага" },
    en: { label: "Organization", full: "Organization" },
  },
  people: {
    mn: { label: "Хүн", full: "Хүн, чадвар" },
    en: { label: "People", full: "People & skills" },
  },
  tech: {
    mn: { label: "Технологи", full: "Технологи" },
    en: { label: "Technology", full: "Technology" },
  },
  data: {
    mn: { label: "Дата", full: "Дата" },
    en: { label: "Data", full: "Data" },
  },
  auto: {
    mn: { label: "Автомат", full: "Автоматжуулалт" },
    en: { label: "Automation", full: "Automation" },
  },
  ai: {
    mn: { label: "ХО", full: "Хиймэл оюуны бэлэн байдал" },
    en: { label: "AI readiness", full: "AI readiness" },
  },
  gov: {
    mn: { label: "Засаглал", full: "Засаглал, аюулгүй байдал" },
    en: { label: "Governance", full: "Governance & security" },
  },
};

/** The ten dimensions of the SKYVIS Digital Assessment, in the given language. */
export function getDimensions(locale: Locale): Dimension[] {
  return DIMENSION_ORDER.map((key) => ({ key, ...DIMENSION_TEXT[key][locale] }));
}

export type Scores = Record<DimensionKey, number>;

/** Example profile used in the marketing section. Averages 2.7 / 5. */
export const DEMO_SCORES: Scores = {
  strategy: 3.1, customer: 2.9, process: 2.4, org: 2.8, people: 2.5,
  tech: 3.4, data: 2.6, auto: 1.9, ai: 1.9, gov: 3.2,
};

export function averageScore(scores: Scores): number {
  const values = DIMENSION_ORDER.map((key) => scores[key]);
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function rankDimensions(scores: Scores, locale: Locale): Dimension[] {
  return [...getDimensions(locale)].sort((a, b) => scores[a.key] - scores[b.key]);
}

export function maturityBand(overall: number, locale: Locale) {
  if (overall < 2) {
    return locale === "mn"
      ? {
          name: "Эхлэл шатны",
          copy: "Юуны түрүүнд суурь тавих шаардлагатай. Энэ шатанд шинэ систем худалдан авахаас илүү, эзэмшдэг системүүдээ хооронд нь холбох нь хамгийн хурдан үр өгөөж өгдөг.",
        }
      : {
          name: "Early",
          copy: "Foundations come first. At this stage the fastest return usually comes from connecting the systems you already own rather than buying new ones.",
        };
  }
  if (overall < 3) {
    return locale === "mn"
      ? {
          name: "Хөгжиж буй",
          copy: "Хэрэгсэлүүд бий, гэвч хоорондоо холбогдож ажиллахгүй байна. Энэ шатанд интеграц болон процессыг стандартчлах нь шинэ програм хангамжаас илүү үнэ цэнэ бий болгодог.",
        }
      : {
          name: "Developing",
          copy: "The pieces exist but aren't working together. Integration and process standardisation typically produce more value here than new software.",
        };
  }
  if (overall < 4) {
    return locale === "mn"
      ? {
          name: "Тогтсон",
          copy: "Үндсэн чадавхи бүрдсэн байна. Дараагийн өсөлт автоматжуулалт болон шийдвэр гаргах мөч бүрд датаг бэлэн байлгахаас гардаг.",
        }
      : {
          name: "Established",
          copy: "Core capability is in place. The next gains come from automation, and from making data available at the moment decisions get made.",
        };
  }
  return locale === "mn"
    ? {
        name: "Дэвшилтэт",
        copy: "Хүчтэй байр суурьтай байна. Одоо анхаарлыг тодорхой үйл ажиллагаанд хэрэгжсэн хиймэл оюун, төсөл бус тасралтгүй сайжруулалт руу чиглэх нь чухал.",
      }
    : {
        name: "Advanced",
        copy: "Strong position. Focus shifts to compounding it — AI applied to specific operations, and continuous optimisation rather than projects.",
      };
}
