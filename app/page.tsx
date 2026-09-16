import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ProblemSection } from "@/components/ProblemSection";
import { AssessmentSection } from "@/components/AssessmentSection";
import { ServicesSection } from "@/components/ServicesSection";
import { MethodologySection } from "@/components/MethodologySection";
import { ValueSection } from "@/components/ValueSection";
import { IndustriesSection } from "@/components/IndustriesSection";
import { CaseStudySection } from "@/components/CaseStudySection";
import { AboutSection } from "@/components/AboutSection";
import { InsightsSection } from "@/components/InsightsSection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ProblemSection />
        <AssessmentSection />
        <ServicesSection />
        <MethodologySection />
        <ValueSection />
        <IndustriesSection />
        <CaseStudySection />
        <AboutSection />
        <InsightsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
