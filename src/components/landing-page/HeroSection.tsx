"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function HeroSection() {
    return (
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 py-24 text-center overflow-hidden its-gradient">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

            <div className="relative z-10 max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-3 rounded-full border border-brand-blue/30 bg-brand-blue/10 px-4 py-1.5 text-xs font-semibold text-brand-accent backdrop-blur-md mb-8"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-accent"></span>
                    </span>
                    Join 12,450+ ITS Students Shaping the Future
                </motion.div>

                <motion.h1
                    className="text-5xl md:text-7xl lg:text-8xl font-black font-heading tracking-tighter text-white leading-[1.05] mb-8"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    Elevate Your <br />
                    <span className="gradient-text">Human Capital</span>
                </motion.h1>

                <motion.p
                    className="text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto font-light leading-relaxed mb-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    Platform pengembangan terpadu berbasis data untuk mahasiswa ITS. Bangun portofolio kompetensi melalui asesmen presisi, roadmap terukur, dan bimbingan mentor eksklusif.
                </motion.p>

                <motion.div
                    className="flex flex-col sm:flex-row items-center justify-center gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <a href="/auth/login" className="w-full sm:w-auto">
                        <button className="w-full px-8 py-5 bg-white text-its-blue font-bold rounded-2xl hover:bg-brand-accent transition-all hover:scale-105 shadow-2xl shadow-brand-accent/20 flex items-center justify-center gap-2 text-lg">
                            Mulai Assessment Gratis
                            <span className="material-symbols-outlined">bolt</span>
                        </button>
                    </a>
                    <button className="w-full sm:w-auto px-8 py-5 glass-card text-white font-bold rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-lg border-white/20">
                        <span className="material-symbols-outlined">play_circle</span>
                        Tonton Demo
                    </button>
                </motion.div>

                <motion.div
                    className="mt-20 flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                >
                    <div className="flex flex-col items-center">
                        <span className="text-3xl font-bold text-white">9</span>
                        <span className="text-[10px] uppercase tracking-widest font-bold">Dimensi Utama</span>
                    </div>
                    <div className="w-px h-8 bg-white/20"></div>
                    <div className="flex flex-col items-center">
                        <span className="text-3xl font-bold text-white">450+</span>
                        <span className="text-[10px] uppercase tracking-widest font-bold">Materi Kursus</span>
                    </div>
                    <div className="w-px h-8 bg-white/20"></div>
                    <div className="flex flex-col items-center">
                        <span className="text-3xl font-bold text-white">100%</span>
                        <span className="text-[10px] uppercase tracking-widest font-bold">Kurikulum ITS</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
