"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { HeroVideoSection } from "@/components/landing/HeroVideoSection";
import { DimensionCard } from "@/components/landing/DimensionCard";
import { dimensions, DimensionData } from "@/data/dimensions";
import { ProblemSolution } from "@/components/landing/content/ProblemSolution";
import { AssessmentShowcase } from "@/components/landing/content/AssessmentShowcase";
import { DashboardTour } from "@/components/landing/content/DashboardTour";
import { EcosystemIntegration } from "@/components/landing/content/EcosystemIntegration";
import { SuccessStories } from "@/components/landing/content/SuccessStories";
import { ResearchValidation } from "@/components/landing/content/ResearchValidation";
import { ComparisonTable } from "@/components/landing/content/ComparisonTable";
import { FinalCTA } from "@/components/landing/content/FinalCTA";
import { FAQ } from "@/components/landing/content/FAQ";
import { Footer } from "@/components/landing/content/Footer";
import { SmartLMS } from "@/components/landing/content/SmartLMS";
import { Roadmap } from "@/components/landing/content/Roadmap";
import { PlatformAccess } from "@/components/landing/content/PlatformAccess";

const navLinks = [
  { href: "#methodology", label: "Metodologi" },
  { href: "#dimensions", label: "9 Dimensi" },
  { href: "#mission-control", label: "Mission Control" },
  { href: "#faq", label: "FAQ" },
];

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <header className="fixed top-0 z-[100] w-full border-b border-white/5 bg-its-dark/80 backdrop-blur-xl supports-[backdrop-filter]:bg-its-dark/60">
      <div className="flex h-20 items-center justify-between px-6 lg:px-12 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-its-blue to-brand-blue shadow-lg shadow-brand-blue/30 group-hover:shadow-brand-accent/40 transition-all duration-300">
            <span className="material-symbols-outlined text-white relative z-10">analytics</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold font-heading tracking-tight text-white leading-none group-hover:text-brand-accent transition-colors">PPSDM KMITS</span>
            <span className="text-[10px] uppercase tracking-widest text-its-gold font-bold">Holistic Ecosystem</span>
          </div>
        </Link>
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="text-sm font-medium text-slate-300 hover:text-white hover:text-glow transition-all">{link.label}</a>
          ))}
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-white hover:text-brand-accent transition-colors">
              Login
            </Link>
            <Link href="/register" className="bg-brand-blue hover:bg-brand-blue/90 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg shadow-brand-blue/30 hover:shadow-brand-blue/50 active:scale-95 flex items-center gap-2 group">
              Coba Asesmen Gratis
            </Link>
          </div>
        </nav>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-colors">
          <span className="material-symbols-outlined">{isMobileMenuOpen ? "close" : "menu"}</span>
        </button>
      </div>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="lg:hidden bg-its-dark/95 backdrop-blur-xl border-t border-white/5">
            <nav className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-slate-300 hover:text-white transition-colors py-2">{link.label}</a>
              ))}
              <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="bg-brand-blue hover:bg-brand-blue/90 text-white px-6 py-3 rounded-full font-bold text-sm transition-all text-center mt-2">Mulai Sekarang</Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function DimensionsSection() {
  return (
    <section id="dimensions" className="py-24 px-6 lg:px-12 relative overflow-hidden bg-slate-900 border-b border-slate-800">
      {/* Background Ambience */}
      <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-brand-blue/5 to-transparent pointer-events-none"></div>
      <div className="absolute left-0 bottom-0 w-1/3 h-1/2 bg-gradient-to-t from-its-gold/5 one pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-its-gold font-bold tracking-widest text-sm uppercase mb-2 block">Holistic Framework</span>
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-white mb-4">9 Dimensi Pengembangan</h2>
            <p className="text-slate-400 max-w-xl">Dari Kognitif Hingga Spiritual. Membentuk manusia utuh yang cerdas akal dan mulia hati.</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {dimensions.map((dim, index) => (
            <DimensionCard key={dim.id} dimension={dim} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
      <div className="relative flex min-h-screen w-full flex-col font-sans">
        <Header />
        <main className="flex-1 pt-20">
          <HeroVideoSection />
          <ProblemSolution />
          <DimensionsSection />
          <AssessmentShowcase />
          <DashboardTour />
          <SmartLMS />
          <EcosystemIntegration />
          <SuccessStories />
          <ResearchValidation />
          <ComparisonTable />
          <PlatformAccess />
          <Roadmap />
          <FinalCTA />
          <FAQ />
        </main>
        <Footer />
      </div>
    </div>
  );
}
