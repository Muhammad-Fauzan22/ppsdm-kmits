import HeroSection from "@/components/landing-page/HeroSection";
import ProblemSolution from "@/components/landing-page/ProblemSolution";
import DimensionsGrid from "@/components/landing-page/DimensionsGrid";
import HowItWorks from "@/components/landing-page/HowItWorks";
import RoadmapPreview from "@/components/landing-page/RoadmapPreview";
import Testimonials from "@/components/landing-page/Testimonials";
import SampleQuestion from "@/components/landing-page/SampleQuestion";
import FAQSection from "@/components/landing-page/FAQSection";
import CTASection from "@/components/landing-page/CTASection";
import Footer from "@/components/landing-page/Footer";

/**
 * PPSDM KMITS Landing Page
 * Platform pengembangan holistik untuk mahasiswa KM ITS
 */
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0A0F1A]">
      {/* Hero with Video Background */}
      <HeroSection />

      {/* The Reality Check - Problem/Solution */}
      <ProblemSolution />

      {/* 9 Dimensi Pengembangan */}
      <DimensionsGrid />

      {/* The Journey - How It Works */}
      <HowItWorks />

      {/* Personal Roadmap Preview */}
      <RoadmapPreview />

      {/* Sample Assessment Question */}
      <SampleQuestion />

      {/* Impact Stories - Testimonials */}
      <Testimonials />

      {/* Final CTA */}
      <CTASection />

      {/* FAQ */}
      <FAQSection />

      {/* Footer with Stats & Water Reminder */}
      <Footer />
    </main>
  );
}
