import type { DimensionKey } from "@/lib/dimensions";
import type { Locale } from "@/lib/language";

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
const STEPS_MN: QuestionStep[] = [
  {
    title: "Бизнесийн стратеги",
    head: "Чиглэл хэр тодорхой тодорхойлогдсон бэ?",
    sub: "Стратеги нь ямар технологид хөрөнгө оруулах нь зохимжтойг тодорхойлдог. Бид эндээс эхэлдэг.",
    questions: [
      {
        dim: "strategy",
        q: "Байгууллагад бичгээр баримтжуулсан дижитал стратеги бий юу?",
        a: ["Стратеги байхгүй", "Ярилцсан, гэхдээ бичигдээгүй", "Ноорог бий, гэхдээ ашиглагддаггүй", "Баримтжуулсан, удирдлагад танилцуулсан", "Баримтжуулсан, санхүүжсэн, улирал бүр хянагддаг"],
      },
      {
        dim: "strategy",
        q: "Технологийн хөрөнгө оруулалт бизнесийн зорилготой хэр сайн уялддаг вэ?",
        a: ["Уялддаггүй — худалдан авалт нөхцөл байдлаас хамаарна", "Сул уялдаатай, тохиолдол бүрээр шийддэг", "Зарим санаачилга бизнес кэйстэй", "Ихэнх нь эзэнтэй бизнес кэйстэй", "Санаачилга бүр хянагддаг үр дүнтэй холбоотой"],
      },
      {
        dim: "customer",
        q: "Харилцагчийн туршлагыг эхнээс дуустал хэр сайн ойлгодог вэ?",
        a: ["Таамаглалд тулгуурладаг", "Зөвхөн санамсаргүй санал хүсэлт", "Санал хүсэлт цуглуулдаг, гэхдээ ховор арга хэмжээ авдаг", "Гол мөчүүдийг хэмжиж, арга хэмжээ авдаг", "Бүхэл замналыг хянаж, түүн дээр үндэслэн зохиомжлодог"],
      },
      {
        dim: "customer",
        q: "Харилцагч тантай дижитал сувгаар гүйлгээ хийж чадах уу?",
        a: ["Дижитал суваг байхгүй", "Мэдээлэл л байдаг, гүйлгээ хийхгүй", "Энгийн онлайн захиалга боломжтой", "Нэг сувагт бүрэн дижитал гүйлгээ", "Бүх сувагт нэгдсэн туршлага"],
      },
    ],
  },
  {
    title: "Үйл ажиллагаа",
    head: "Ажил бодит байдалд хэрхэн урсдаг вэ?",
    sub: "Энэ бол сэргээж авах зардлын ихэнх хувь оршдог газар.",
    questions: [
      {
        dim: "process",
        q: "Байгууллагын үндсэн бизнес процессууд баримтжуулагдсан уу?",
        a: ["Хаана ч баримтжуулаагүй", "Хэдэн процесс, албан бус", "Гол процессууд баримтжуулагдсан, ихэвчлэн хуучирсан", "Ихэнх нь баримтжуулагдаж, шинэчлэгддэг", "Бүгд баримтжуулагдсан, эзэнтэй, хянагддаг"],
      },
      {
        dim: "process",
        q: "Багийн тань өдрийн хэдэн хувь нь гар аргаар давтагддаг ажилд зарцуулагддаг вэ?",
        a: ["Өдрийн ихэнх хувь", "Тэн хагасаас ихээхэн илүү", "Ойролцоогоор тэн хагас", "Бага хувь", "Маш бага — автоматжуулагдсан"],
      },
      {
        dim: "process",
        q: "Салбар, баг, цэгүүд ижил процессыг дагадаг уу?",
        a: ["Байршил бүр өөр өөрөөр хийдэг", "Ерөнхийдөө ижилсэх, стандарт байхгүй", "Стандарт бий, дагах нь харилцан адилгүй", "Стандартчилагдсан, мэдэгдэж буй онцгой тохиолдолтой", "Стандартчилагдсан, хэмжигддэг, хэрэгжүүлдэг"],
      },
      {
        dim: "auto",
        q: "Системүүдийн хоорондох шилжилтийн хэдэн хувь автоматжуулагдсан бэ?",
        a: ["Бүгд гараар дахин оруулдаг", "Нэг, хоёр экспорт", "Хэдэн интеграц, ихэнх нь гар аргаар", "Ихэнх шилжилт автоматжуулагдсан", "Эхнээс дуустал автоматжуулагдсан, онцгой тохиолдол зохицуулагддаг"],
      },
    ],
  },
  {
    title: "Технологи",
    head: "Өнөөдөр юу ашиглаж байна вэ?",
    sub: "Технологийн орчин, хэсгүүд хоорондоо хэр сайн ярилцдаг вэ.",
    questions: [
      {
        dim: "tech",
        q: "Ямар үндсэн системүүд ажиллаж байна вэ?",
        a: ["Зөвхөн хүснэгт", "Нэг систем, ж.нь. санхүү", "Хоёр, гурав, хоорондоо холбогдоогүй", "Үндсэн бүрдэл бий, хэсэгчлэн интеграцчлагдсан", "Интеграцчлагдсан ERP, CRM, POS, ХН"],
      },
      {
        dim: "tech",
        q: "Систем тань датагаа хоорондоо хэр сайн солилцдог вэ?",
        a: ["Солилцдоггүй", "Гар аргаар экспорт, импорт", "Цөөн тооны цэг хоорондын холболт", "Ихэнх нь интеграцаар холбогдсон", "Удирддаг интеграцийн давхарга эсвэл API платформ"],
      },
      {
        dim: "tech",
        q: "Дэд бүтэц тань хаана ажиллаж байна вэ?",
        a: ["Дотоод компьютер, файлууд", "Зөвхөн дотоод серверүүд", "Ихэнхдээ дотоод, хэсэгчлэн үүлэн", "Ихэнхдээ үүлэн", "Үүлэн орчинд төрсөн, удирддаг үйл ажиллагаатай"],
      },
      {
        dim: "gov",
        q: "Хандалт, аюулгүй байдал, IT засаглал хэрхэн зохицуулагддаг вэ?",
        a: ["Тодорхой бодлого байхгүй", "Албан бус, тохиолдол бүрээр", "Үндсэн бодлого, хэрэгжилт хязгаарлагдмал", "Тодорхойлсон бодлого, тогтмол хяналттай", "Засаглагдсан, аудит хийгддэг, тасралтгүй хянагддаг"],
      },
    ],
  },
  {
    title: "Дата",
    head: "Бизнесээ харж чадаж байна уу?",
    sub: "Харагдац бол бусад бүх чадавхи түшиглэдэг суурь чадавхи.",
    questions: [
      {
        dim: "data",
        q: "Бизнесээ ажиллуулахад хэрэгтэй дата хэр хүртээмжтэй вэ?",
        a: ["Тархай бутархай, олдоход хэцүү", "Байдаг ч зөвхөн систем тус бүрт", "Шаардлагатай тохиолдолд гар аргаар нэгтгэдэг", "Аналистуудад төвлөрсөн хүртээмжтэй", "Бодит цаг хугацаанд ойрхон, төвлөрсөн хүртээмжтэй"],
      },
      {
        dim: "data",
        q: "Датагийн үнэн зөв байдалд хэр итгэдэг вэ?",
        a: ["Байнга алдаа олдог", "Зөвхөн зарим хэсэгт итгэдэг", "Шалгасны дараа ерөнхийдөө итгэдэг", "Итгэлтэй, мэдэгдэж буй чанарын дүрэмтэй", "Чанар хянагддаг, эзэнтэй"],
      },
      {
        dim: "data",
        q: "Удирдлагын тайлан хэрхэн бэлтгэгддэг вэ?",
        a: ["Хүснэгтэд гар аргаар", "Сар бүр экспортлож дахин цуглуулдаг", "Хагас автоматжуулсан тайлан", "Автоматаар шинэчлэгддэг дашбоард", "Бизнес даяар өөрөө үйлчлэх аналитик"],
      },
      {
        dim: "data",
        q: "Шийдвэр гаргагчид тоо баримтыг хэр хурдан авдаг вэ?",
        a: ["Тухайн үеийн дараа хэдэн долоо хоногийн дараа", "Долоо хоног, түүнээс дээш", "Хэдэн өдрийн дараа", "Дараа өдөр нь", "Бодит цагт"],
      },
    ],
  },
  {
    title: "Автоматжуулалт, ХО",
    head: "Хүн оролцуулахгүйгээр өнөөдөр юу ажиллаж байна вэ?",
    sub: "ХО-ын бэлэн байдал нь ихэнхдээ моделийн асуулт биш, дата болон процессын асуулт юм.",
    questions: [
      {
        dim: "auto",
        q: "Давтагдах ажлын хэдэн хувь өнөөдөр автоматжуулагдсан бэ?",
        a: ["Байхгүй", "Нэг, хоёр жижиг ажил", "Нэг хэлтэст хэд хэдэн процесс", "Хэд хэдэн хэлтэст автоматжуулалт", "Шинэ процесс бүрт автоматжуулалт стандарт болсон"],
      },
      {
        dim: "ai",
        q: "Хиймэл оюун байгууллагад хаана нэгэн газар ашиглагддаг уу?",
        a: ["Ашиглагддаггүй", "Хувь хүмүүс албан бусаар туршдаг", "Нэг туршилт хэрэгжиж байна", "Нэг эсвэл түүнээс дээш шийдэл бүтээгдэлд орсон", "ХО үндсэн үйл ажиллагаанд суулгагдсан"],
      },
      {
        dim: "ai",
        q: "Дата тань ХО дэмжихэд бэлэн үү?",
        a: ["Дата бүтэцлэгдээгүй, төвлөрсөн бус", "Хэсэгчлэн бүтэцлэгдсэн, чанар муутай", "Бүтэцлэгдсэн, зарим салбарт төвлөрсөн", "Гол салбарт сайн чанартай", "Засаглагдсан, шошголсон, ХО-д бэлэн"],
      },
      {
        dim: "auto",
        q: "Процессуудынхаа зарцуулах хугацааг хэмждэг үү?",
        a: ["Хэзээ ч хэмждэггүй", "Заримдаа тооцоолдог", "Хэдэн процессод хэмждэг", "Ихэнх үндсэн процессод хэмждэг", "Зорилттойгоор тасралтгүй хэмждэг"],
      },
    ],
  },
  {
    title: "Хүн, соёл",
    head: "Байгууллага үүнийг үүрч чадах уу?",
    sub: "Шилжилт технологийн хувьд биш, энэ хэсэгт илүү олонтой бүтэлгүйтдэг.",
    questions: [
      {
        dim: "people",
        q: "Байгууллага даяар дижитал ур чадварыг хэрхэн үнэлэх вэ?",
        a: ["Маш хязгаарлагдмал", "Цөөн ажлын байранд суурь мэдлэгтэй", "Гол ажлын байранд хангалттай", "Ихэнх ажлын байранд хүчтэй", "Хүчтэй, тасралтгүй хөгжүүлдэг"],
      },
      {
        dim: "org",
        q: "Дижитал өөрчлөлтийг хэн эзэмшдэг вэ?",
        a: ["Хэн ч биш", "IT, автоматаар", "Хагас цагийн эзэн", "Эрх мэдэлтэй нэрлэгдсэн удирдагч", "Удирдагч, баг, төсөвтэй"],
      },
      {
        dim: "org",
        q: "Байгууллага өөрчлөлтийг хэрхэн шингээдэг вэ?",
        a: ["Ихэвчлэн эсэргүүцэлтэй тулгардаг", "Удаан, хэцүү", "Хүчин зүтгэлтэйгээр удаадаг", "Ерөнхийдөө хүлээж авдаг", "Өөрчлөлт стандарт байдлаар төлөвлөгдөж, дэмжигддэг"],
      },
      {
        dim: "people",
        q: "Нэвтрүүлсний дараа ажилтнууд шинэ системийг хэрхэн эзэмшдэг вэ?",
        a: ["Эзэмшилт ихэвчлэн бүтэлгүйтдэг", "Хэсэгчлэн, зайлсхийх аргаар", "Урт хугацааны дараа эзэмшдэг", "Сургалтын дэмжлэгтэйгээр эзэмшдэг", "Хурдан эзэмшиж, эхлэлээс хойш хэмжигддэг"],
      },
    ],
  },
];

const STEPS_EN: QuestionStep[] = [
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

export function getQuestionSteps(locale: Locale): QuestionStep[] {
  return locale === "mn" ? STEPS_MN : STEPS_EN;
}

export const TOTAL_STEPS = STEPS_EN.length + 2; // company info + questions + contact
