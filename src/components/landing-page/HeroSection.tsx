"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HeroSection() {
    return (
        <section className="relative flex min-h-[600px] flex-col items-center justify-center px-4 py-20 text-center mesh-gradient overflow-hidden">
            {/* Abstract decorative elements */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>

            <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm"
                >
                    <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                    Accepting New Students 2024
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight text-white leading-[1.1] font-display"
                >
                    Membangun Insan <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                        ITS Seutuhnya
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="text-lg sm:text-xl text-slate-300 max-w-2xl font-light font-body"
                >
                    Empowering students through holistic development and structured mentorship. Join a community dedicated to excellence in every dimension.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.5 }}
                    className="flex flex-col sm:flex-row gap-4 pt-4"
                >
                    <Link href="/auth/login">
                        <button className="group flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-8 text-base font-bold text-white transition-all hover:bg-primary/90 hover:scale-105 shadow-xl shadow-primary/30 font-body">
                            <span>Mulai Perjalanan Anda</span>
                            <span className="material-symbols-outlined transition-transform group-hover:translate-x-1 text-lg">arrow_forward</span>
                        </button>
                    </Link>
                    <Link href="#program">
                        <button className="flex h-12 items-center justify-center rounded-lg border border-white/20 bg-white/5 px-8 text-base font-bold text-white transition-all hover:bg-white/10 hover:border-white/40 backdrop-blur-sm font-body">
                            Pelajari Lebih Lanjut
                        </button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
