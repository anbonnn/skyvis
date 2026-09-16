import type { Metadata } from "next";
import { AssessmentWizard } from "@/components/assessment/AssessmentWizard";

export const metadata: Metadata = {
  title: "Digital assessment",
  description:
    "Answer 24 questions across strategy, operations, technology, data, automation, and people to see your digital maturity profile.",
};

export default function AssessmentPage() {
  return <AssessmentWizard />;
}
