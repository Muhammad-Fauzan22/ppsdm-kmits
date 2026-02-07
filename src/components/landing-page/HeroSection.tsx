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
    { name: "BEM ITS", abbr: "BEM" },
    { name: "LMM", abbr: "LMM" },
    { name: "HMTI", abbr: "HMTI" },
    { name: "5,000+ Mahasiswa", abbr: "5K+" }
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
                    <span className="block mb-2">Temukan Potensi Tersembunyimu</span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FF6B00] to-[#FF4081]">
                        dalam 15 Menit
                    </span>
                </motion.h1>

                {/* Subheadline - Specific promise */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl font-light"
                >
                    Asesmen psikometri berbasis sains mengukur <span className="text-white font-medium">9 dimensi</span> kemampuanmu.
                    <br className="hidden sm:block" />
                    Dapatkan roadmap pengembangan personal yang spesifik untukmu.
                </motion.p>

                {/* CTA Buttons - High contrast, single focus */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.5 }}
                    className="flex flex-col items-center gap-4 pt-4"
                >
                    {/* Primary CTA - Big Orange Button */}
                    <Link
                        href="/auth/login"
                        className="group relative flex h-16 items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF4081] px-10 text-lg font-bold text-white transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,107,0,0.5)] overflow-hidden"
                    >
                        {/* Shine effect */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                            animate={{ x: ['-200%', '200%'] }}
                            transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                        />
                        <span className="relative">Mulai Asesmen Gratis</span>
                        <span className="relative material-symbols-outlined transition-transform group-hover:translate-x-1 text-lg">arrow_forward</span>
                    </Link>

                    {/* Micro-copy below CTA */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="text-sm text-slate-400"
                    >
                        ⚡ Hanya butuh 15 menit • Tanpa kartu kredit • Hasil langsung
                    </motion.p>

                    {/* Secondary CTA - Less prominent */}
                    <Link
                        href="#9-dimensi"
                        className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
                    >
                        <span className="material-symbols-outlined text-lg">explore</span>
                        Pelajari 9 Dimensi Pengembangan
                        <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">chevron_right</span>
                    </Link>
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

                {/* Trusted By */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.9 }}
                    className="pt-8 flex flex-col items-center gap-4"
                >
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                        Dipercaya Ekosistem ITS
                    </p>
                    <div className="flex items-center gap-4 sm:gap-6">
                        {trustedBy.map((partner, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1 + idx * 0.1 }}
                                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-bold text-slate-400 hover:text-white hover:border-white/20 transition-colors cursor-default"
                            >
                                {partner.abbr}
                            </motion.div>
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
