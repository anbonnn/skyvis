import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ProblemSection } from "@/components/ProblemSection";
import { AssessmentSection } from "@/components/AssessmentSection";
import { ServicesSection } from "@/components/ServicesSection";
import { MethodologySection } from "@/components/MethodologySection";
import { ValueSection } from "@/components/ValueSection";
import { AboutSection } from "@/components/AboutSection";
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
        <AboutSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
