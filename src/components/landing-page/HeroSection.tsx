"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamic import untuk HeroBoomerang agar tidak SSR
const HeroBoomerang = dynamic(() => import('@/components/HeroBoomerang'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 animate-pulse" />
    ),
});

export default function HeroSection() {
    return (
        <section className="relative flex min-h-[700px] lg:min-h-[800px] flex-col items-center justify-center px-4 py-20 text-center overflow-hidden">
            {/* Video Boomerang Background */}
            <div className="absolute inset-0 z-0">
                <HeroBoomerang />
            </div>
            
            {/* Gradient Overlay untuk readability */}
            <div className="absolute inset-0 z-[1] bg-gradient-to-b from-slate-950/70 via-slate-950/50 to-slate-950/80" />
            <div className="absolute inset-0 z-[1] bg-gradient-to-r from-slate-950/60 via-transparent to-slate-950/60" />
            
            {/* Abstract Noise Texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] brightness-100 contrast-150 mix-blend-overlay pointer-events-none z-[2]" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-1.5 text-xs font-medium text-white"
                >
                    <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.6)]" />
                    Accepting New Students 2024
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight text-white leading-[1.1] font-display drop-shadow-2xl"
                >
                    Membangun Insan <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400">
                        ITS Seutuhnya
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="text-lg sm:text-xl text-slate-200 max-w-2xl font-light font-body drop-shadow-lg"
                >
                    Empowering students through holistic development and structured mentorship. Join a community dedicated to excellence in every dimension.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.5 }}
                    className="flex flex-col sm:flex-row gap-4 pt-4"
                >
                    <Link
                        href="/auth/login"
                        className="group flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 text-base font-bold text-white transition-all hover:from-blue-500 hover:to-indigo-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30 font-body border border-white/10"
                    >
                        <span>Mulai Perjalanan Anda</span>
                        <span className="material-symbols-outlined transition-transform group-hover:translate-x-1 text-lg">arrow_forward</span>
                    </Link>
                    <Link
                        href="#program"
                        className="flex h-12 items-center justify-center rounded-xl border border-white/30 bg-white/10 px-8 text-base font-bold text-white transition-all hover:bg-white/20 hover:border-white/50 backdrop-blur-sm font-body hover:scale-105"
                    >
                        Pelajari Lebih Lanjut
                    </Link>
                </motion.div>
                
                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.8 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60"
                >
                    <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2"
                    >
                        <motion.div className="w-1.5 h-1.5 rounded-full bg-white/60" />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
