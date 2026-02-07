"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { TrustBadges, InlineTrustIndicators } from './TrustBadges';
import { UrgencyCountdown } from './UrgencyCountdown';

/**
 * HeroSection - Optimized for world-class conversion
 * Features: Benefit-focused UVP, visual cue to CTA, trust badges, urgency
 */

const trustedBy = [
    { name: "BEM ITS", abbr: "BEM KM" },
    { name: "LMM", abbr: "LMM" },
    { name: "HMTI", abbr: "HMTI" },
    { name: "Fakultas Psikologi", abbr: "FPsi" }
];

export default function HeroSection() {
    return (
        <section className="relative flex min-h-[95vh] lg:min-h-screen flex-col items-center justify-center px-4 py-20 text-center overflow-hidden">
            {/* Video Background */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    poster="/assets/hero-video/poster.jpg"
                >
                    <source src="/assets/hero-video/hero.webm" type="video/webm" />
                    <source src="/assets/hero-video/hero.mp4" type="video/mp4" />
                </video>
            </div>

            {/* Gradient Overlay for readability */}
            <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#0A0F1A]/90 via-[#0A0F1A]/70 to-[#0A0F1A]/95" />
            <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#0A0F1A]/80 via-transparent to-[#0A0F1A]/80" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center max-w-5xl mx-auto space-y-6">
                {/* Badge - Benefit focused */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 rounded-full border border-[#FFD700]/30 bg-[#FFD700]/10 backdrop-blur-md px-4 py-1.5 text-xs font-semibold text-[#FFD700]"
                >
                    <span className="flex h-2 w-2 rounded-full bg-[#FFD700] animate-pulse" />
                    GRATIS UNTUK SELURUH MAHASISWA ITS
                </motion.div>

                {/* Main Headline - Benefit focused UVP */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight text-white leading-[1.1] font-display"
                >
                    <span className="block mb-2">Temukan Potensi Tersembunyi</span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FF6B00] to-[#FF4081]">
                        & Bangun Karir Impian
                    </span>
                    <span className="block text-3xl sm:text-4xl lg:text-5xl mt-2 font-bold text-white/90">
                        dalam 9 Dimensi
                    </span>
                </motion.h1>

                {/* Subheadline - Specific promise */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl font-light"
                >
                    Asesmen psikometri berbasis sains yang memetakan <span className="text-white font-medium">9 dimensi</span> kemampuanmu.
                    <br className="hidden sm:block" />
                    Dapatkan roadmap pengembangan personal yang spesifik untukmu.
                </motion.p>

                {/* VISUAL CUE: Arrow pointing to CTA */}
                <motion.div
                    initial={{ opacity: 0, x: -20, rotate: -10 }}
                    animate={{ opacity: 1, x: 0, rotate: 0 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="absolute left-[10%] top-[60%] hidden lg:block"
                >
                    <div className="relative">
                        <span className="absolute -top-8 -left-2 text-yellow-400 font-handwriting text-xl -rotate-12">Mulai di sini!</span>
                        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/80 transform rotate-45">
                            <path d="M5 25C5 25 15 20 25 25C35 30 35 45 45 50M45 50V35M45 50H30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </motion.div>

                {/* CTA Buttons - High contrast, single focus */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.5 }}
                    className="flex flex-col items-center gap-4 pt-4 relative z-20"
                >
                    {/* Primary CTA - Big Orange Button (#F59E0B) */}
                    <Link
                        href="/try-assessment"
                        className="group relative flex h-16 items-center justify-center gap-3 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] px-10 text-lg font-bold text-white transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(245,158,11,0.5)] overflow-hidden"
                    >
                        {/* Shine effect */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                            animate={{ x: ['-200%', '200%'] }}
                            transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                        />
                        <span className="relative">Dapatkan Analisis Gratis Sekarang</span>
                        <span className="relative material-symbols-outlined transition-transform group-hover:translate-x-1 text-lg">arrow_forward</span>
                    </Link>

                    {/* Micro-copy below CTA - Risk Reversal */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="flex flex-col items-center gap-1"
                    >
                        <p className="text-sm text-slate-400">
                            ⚡ Hanya butuh 15 menit • <span className="text-green-400 font-medium">100% Gratis</span> • Tanpa kartu kredit
                        </p>
                        <p className="text-xs text-slate-500">
                            Garansi Privasi Data 100%
                        </p>
                    </motion.div>
                </motion.div>

                {/* Inline Trust Indicators */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.8 }}
                    className="pt-6"
                >
                    <InlineTrustIndicators />
                </motion.div>

                {/* Trusted By - Enhanced Visibility */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.9 }}
                    className="pt-8 flex flex-col items-center gap-4"
                >
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm">
                        <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-sm font-medium text-white/90">
                            Dipercaya <span className="font-bold text-white">2,000+ Mahasiswa ITS</span>
                        </span>
                        <div className="flex -space-x-1 ml-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-5 h-5 rounded-full bg-gray-500 border border-[#0A0F1A]" />
                            ))}
                        </div>
                    </div>

                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mt-2">
                        Berkolaborasi dengan Ekosistem Kampus
                    </p>
                    <div className="flex items-center gap-4 sm:gap-6 opacity-70 hover:opacity-100 transition-opacity">
                        {trustedBy.filter(p => !p.name.includes('5,000')).map((partner, idx) => (
                            <div
                                key={idx}
                                className="text-sm font-bold text-slate-400 hover:text-white transition-colors cursor-default"
                            >
                                {partner.abbr}
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Visual Cue - Scroll indicator pointing down */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 1.2 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2"
                >
                    <motion.div className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]" />
                </motion.div>
            </motion.div>
        </section>
    );
}
