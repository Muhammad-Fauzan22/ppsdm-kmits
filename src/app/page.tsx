"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProblemSolution } from "@/components/landing/content/ProblemSolution";
import { DimensionCard } from "@/components/landing/DimensionCard";
import { SocialProof } from "@/components/landing/SocialProof";
import { HowItWorks } from "@/components/landing/content/HowItWorks";
import { RoadmapPreview } from "@/components/landing/content/RoadmapPreview";
import { AssessmentPreview } from "@/components/landing/content/AssessmentPreview";
import { FAQ } from "@/components/landing/content/FAQ";
import { dimensions } from "@/data/dimensions";

// --- Components ---

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "#methodology", label: "Metodologi" },
    { href: "#dimensions", label: "9 Dimensi" },
    { href: "#dashboard", label: "Dashboard" },
    { href: "#faq", label: "FAQ" },
  ];

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

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="text-sm font-medium text-slate-300 hover:text-white hover:text-glow transition-all">{link.label}</a>
          ))}
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-white hover:text-brand-accent transition-colors">
              Login
            </Link>
            <Link href="/register" className="bg-brand-blue hover:bg-brand-blue/90 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg shadow-brand-blue/30 hover:shadow-brand-blue/50 active:scale-95 flex items-center gap-2 group">
              Coba Asesmen
            </Link>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 text-white">
          <span className="material-symbols-outlined">{isMobileMenuOpen ? "close" : "menu"}</span>
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="lg:hidden bg-its-dark/95 backdrop-blur-xl border-t border-white/5 overflow-hidden">
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
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="text-brand-accent font-bold tracking-widest text-sm uppercase mb-2 block">Holistic Framework</span>
          <h2 className="text-3xl md:text-5xl font-bold font-heading text-white mb-4">9 Dimensi Pengembangan</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Kurikulum komprehensif untuk membentuk mahasiswa yang tidak hanya cerdas akademik, tapi juga matang karakter.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {dimensions.map((dim, index) => (
            <DimensionCard key={dim.id} dimension={dim} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-its-blue to-brand-blue text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-10"></div>
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <h2 className="text-4xl md:text-6xl font-black font-heading text-white mb-8 tracking-tight">
          Semester Baru, <br />Diri yang Baru.
        </h2>
        <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
          Jangan biarkan potensi Anda terkubur. Mulai perjalanan transformasi Anda menjadi mahasiswa paripurna hari ini.
        </p>
        <Link href="/register" className="inline-flex items-center gap-3 bg-white text-its-blue px-10 py-5 rounded-xl font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/20">
          Mulai Transformasi Sekarang
          <span className="material-symbols-outlined">rocket_launch</span>
        </Link>
        <div className="mt-8 text-sm text-blue-200 font-medium">
          100% Gratis untuk Mahasiswa ITS • Login dengan myITS
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="py-12 bg-its-dark border-t border-white/5 text-center">
      <div className="flex items-center justify-center gap-3 mb-6 opacity-50 grayscale hover:grayscale-0 transition-all">
        {/* Logo Placeholder */}
        <span className="material-symbols-outlined text-3xl">analytics</span>
        <span className="text-xl font-bold font-heading">PPSDM KMITS</span>
      </div>
      <div className="flex justify-center gap-8 mb-8 text-sm text-slate-400">
        <a href="#" className="hover:text-white transition-colors">Tentang Kami</a>
        <a href="#" className="hover:text-white transition-colors">Kontak</a>
        <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
      </div>
      <p className="text-slate-600 text-xs">© 2026 PPSDM KM ITS. Excellence in Student Development.</p>
    </footer>
  )
}

// --- Main Page Component ---
// Full 10-Section Structure:
// 1. HeroSection
// 2. ProblemSolution (Reality Check + Solution)
// 3. DimensionsSection (The Framework)
// 4. HowItWorks (Process Flow)
// 5. RoadmapPreview (Personalization)
// 6. SocialProof (Trust Signals)
// 7. AssessmentPreview (Interactive Demo)
// 8. FAQ (Objection Handling)
// 9. FinalCTA
// 10. Footer

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-its-dark text-slate-100 overflow-x-hidden font-sans selection:bg-brand-accent selection:text-its-dark">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ProblemSolution />
        <DimensionsSection />
        <HowItWorks />
        <RoadmapPreview />
        <SocialProof />
        <AssessmentPreview />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
