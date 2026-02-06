import HeroSection from "@/components/landing-page/HeroSection";
import ProblemSolution from "@/components/landing-page/ProblemSolution";
import AssessmentEngineShowcase from "@/components/landing-page/AssessmentEngineShowcase";
import CTASection from "@/components/landing-page/CTASection";
import FAQSection from "@/components/landing-page/FAQSection";
import Footer from "@/components/landing-page/Footer";
import Testimonials from "@/components/landing-page/Testimonials";

/**
 * PPSDM KMITS Landing Page
 * Platform pengembangan holistik untuk mahasiswa KM ITS
 */
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0A0F1A]">
      <HeroSection />
      <ProblemSolution />
      <AssessmentEngineShowcase />
      <Testimonials />
      <CTASection />
      <FAQSection />
      <Footer />
    </main>
  );
}
