import type { Metadata } from "next";
import { AssessmentWizard } from "@/components/assessment/AssessmentWizard";

export const metadata: Metadata = {
  title: "Дижитал үнэлгээ",
  description:
    "Стратеги, үйл ажиллагаа, технологи, дата, автоматжуулалт, хүний нөөцийг хамарсан 24 асуултад хариулж дижитал бэлэн байдлын профайлаа харна уу.",
};

export default function AssessmentPage() {
  return <AssessmentWizard />;
}
