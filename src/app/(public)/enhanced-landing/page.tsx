"use client";

import {
  HeroSection,
  ProblemSolution,
  FAQSection,
  AssessmentEngineShowcase,
  CTASection,
  DimensionsGrid,
  Testimonials,
  Footer
} from "@/components/landing-page";
import Navbar from "@/components/landing-page/Navbar";

export default function EnhancedLandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0F1A]">
      <Navbar />

      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Problem/Solution Section */}
        <ProblemSolution />

        {/* 9 Dimensions Grid */}
        <DimensionsGrid />

        {/* Assessment Engine Showcase */}
        <AssessmentEngineShowcase />

        {/* Testimonials */}
        <Testimonials />

        {/* CTA Section */}
        <CTASection />

        {/* FAQ Section */}
        <FAQSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
