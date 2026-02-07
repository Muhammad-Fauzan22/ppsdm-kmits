"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const trustedBy = [
    { name: "BEM ITS", abbr: "BEM ITS" },
    { name: "LMM", abbr: "LMM" },
    { name: "TENDIK", abbr: "TENDIK" },
    { name: "IKOMA", abbr: "IKOMA" }
];

export default function HeroSection() {
    return (
        <section className="relative flex min-h-[90vh] lg:min-h-screen flex-col items-center justify-center px-4 py-20 text-center overflow-hidden">
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
            <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#0A0F1A]/80 via-[#0A0F1A]/60 to-[#0A0F1A]/90" />
            <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#0A0F1A]/70 via-transparent to-[#0A0F1A]/70" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center max-w-5xl mx-auto space-y-6">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 backdrop-blur-md px-4 py-1.5 text-xs font-semibold text-amber-400"
                >
                    <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                    PLATFORM PENGEMBANGAN MAHASISWA #1 DI ITS
                </motion.div>

                {/* Main Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight text-white leading-[1.1] font-display"
                >
                    <span className="italic font-serif">Kuliah Bukan Sekadar</span>
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 italic font-serif">
                        Mengejar IPK
                    </span>
                </motion.h1>

                {/* Subheadline */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl font-light"
                >
                    Temukan potensi tersembunyimu dengan asesmen berbasis sains.
                    <br className="hidden sm:block" />
                    Bangun portofolio holistik yang dilirik industri global.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.5 }}
                    className="flex flex-col sm:flex-row gap-4 pt-4"
                >
                    <Link
                        href="/auth/login"
                        className="group flex h-14 items-center justify-center gap-3 rounded-xl bg-blue-600 px-8 text-base font-bold text-white transition-all hover:bg-blue-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30"
                    >
                        <span>Mulai Asesmen Gratis</span>
                        <span className="material-symbols-outlined transition-transform group-hover:translate-x-1 text-lg">arrow_forward</span>
                    </Link>
                    <Link
                        href="#9-dimensi"
                        className="group flex h-14 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 text-base font-semibold text-white transition-all hover:bg-white/10 hover:border-white/30 backdrop-blur-sm"
                    >
                        <span className="material-symbols-outlined text-slate-400">explore</span>
                        Pelajari 9 Dimensi
                    </Link>
                </motion.div>

                {/* Trusted By */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.7 }}
                    className="pt-12 flex flex-col items-center gap-4"
                >
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                        Dipercaya oleh Ekosistem ITS
                    </p>
                    <div className="flex items-center gap-6 sm:gap-10">
                        {trustedBy.map((partner, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 + idx * 0.1 }}
                                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-bold text-slate-400 hover:text-white hover:border-white/20 transition-colors cursor-default"
                            >
                                {partner.abbr}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2"
                >
                    <motion.div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                </motion.div>
            </motion.div>
        </section>
    );
}
