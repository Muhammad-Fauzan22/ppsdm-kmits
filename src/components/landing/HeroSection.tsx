"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BoomerangVideo } from "@/components/hero/BoomerangVideo";
import { ArrowRight, Compass } from "lucide-react";

export function HeroSection() {
    return (
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-its-dark pt-20">
            {/* Dynamic Background (CSS Only - High Performance) */}
            {/* Premium Animated Background */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
                <BoomerangVideo opacity={0.4} />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
                >
                    <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
                    <span className="text-sm font-medium text-brand-accent tracking-wide uppercase">
                        Platform Pengembangan Mahasiswa #1 di ITS
                    </span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-black font-heading tracking-tight text-white mb-6 leading-[1.1]"
                >
                    Kuliah Bukan Sekadar <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent via-brand-blue to-white">
                        Mengejar IPK
                    </span>
                </motion.h1>

                {/* Subline */}
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto mb-10 font-sans leading-relaxed"
                >
                    Temukan potensi tersembunyimu dengan asesmen berbasis sains.
                    Bangun portofolio holistik yang dilirik industri global.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link
                        href="/auth/register"
                        className="w-full sm:w-auto px-8 py-4 bg-brand-blue hover:bg-brand-blue/90 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg shadow-brand-blue/25 flex items-center justify-center gap-3 group"
                    >
                        Mulai Asesmen Gratis
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        href="#dimensions"
                        className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 backdrop-blur-sm transition-all flex items-center justify-center gap-3 group"
                    >
                        <Compass className="w-5 h-5 text-its-gold group-hover:rotate-12 transition-transform" />
                        Pelajari 9 Dimensi
                    </Link>
                </motion.div>

                {/* Trust Indicators */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                    className="mt-20 pt-10 border-t border-white/5"
                >
                    <p className="text-sm text-slate-500 uppercase tracking-widest font-semibold mb-6">
                        Dipercaya oleh Ekosistem ITS
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Logos could be images, using text placeholders for now to keep it light */}
                        <span className="text-xl font-bold font-heading text-white">BEM ITS</span>
                        <span className="text-xl font-bold font-heading text-white">LMM</span>
                        <span className="text-xl font-bold font-heading text-white">TENDIK</span>
                        <span className="text-xl font-bold font-heading text-white">IKOMA</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
