'use client';

import React from 'react';
import {
  Navbar,
  HeroSection,
  DimensionsGrid,
  Methodology,
  VideoTestimonials,
  FAQSection,
  CTASection,
  Footer,
  ActivityNotification,
  ExitIntentPopup,
  UrgencyCountdown,
  MiniQuiz,
  ROICalculator
} from './index';

/**
 * NewLandingPage - Master Landing Page Component
 * Integrates all world-class conversion components:
 * - Real-time Social Proof (ActivityNotification)
 * - Exit Intent Protection (ExitIntentPopup)
 * - Urgency/Scarcity (UrgencyCountdown)
 * - Trust Building (VideoTestimonials)
 * - Interactive Engagement (MiniQuiz, ROICalculator)
 */

const NewLandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0A0F1A] text-white selection:bg-orange-500/30 selection:text-orange-200">
      {/* Navigation */}
      <Navbar />

      <main id="main-content" className="relative">
        {/* Hero Section with Benefit-Focused UVP */}
        <HeroSection />

        {/* Urgency Countdown - Immediately visible after hero to drive action */}
        <UrgencyCountdown
          hoursFromNow={12}
          headline="Pendaftaran Program Mentoring Batch 5 Ditutup Dalam"
        />

        {/* 9 Dimensions Grid - Netflix-style discovery */}
        <DimensionsGrid />

        {/* Methodology - How it works */}
        <Methodology />

        {/* Value Demonstration - ROI Calculator */}
        <ROICalculator />

        {/* Social Proof - Video Testimonials */}
        <VideoTestimonials
          headline="Kisah Nyata Transformasi Mahasiswa"
          subheadline="Dengar langsung bagaimana mereka menemukan karir impian melalui asesmen holistik"
        />

        {/* Interactive Engagement - Mini Quiz Teaser */}
        <MiniQuiz />

        {/* FAQ Section */}
        <FAQSection />

        {/* Final CTA with Gamification */}
        <CTASection />
      </main>

      {/* Footer */}
      <Footer />

      {/* --- Global Conversion Layers --- */}

      {/* 1. FOMO: Real-time user activity updates */}
      <ActivityNotification
        enabled={true}
        position="bottom-left"
        initialDelay={5000}
      />

      {/* 2. Retention: Exit intent popup with last-chance offer */}
      <ExitIntentPopup
        enabled={true}
        headline="Tunggu! Jangan Lewatkan Potensimu"
        subheadline="Dapatkan laporan analisis kepribadian singkat (Halaman 1) secara GRATIS jika mendaftar sekarang."
        offer="Akses Gratis Validasi 24 Jam"
        ctaText="Klaim Analisis Gratis"
      />
    </div>
  );
};

export default NewLandingPage;
