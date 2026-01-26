"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

export default function LandingPage() {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end start"],
    });

    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
    const y = useTransform(scrollYProgress, [0, 0.5], [0, -100]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-its-dark font-sans text-slate-200 selection:bg-brand-blue selection:text-white overflow-x-hidden">
            {/* Dynamic Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-blue/20 rounded-full blur-[128px] animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-its-gold/10 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Header */}
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="fixed top-0 z-[100] w-full border-b border-white/5 bg-its-dark/80 backdrop-blur-lg supports-[backdrop-filter]:bg-its-dark/60"
            >
                <div className="flex h-20 items-center justify-between px-6 lg:px-12 max-w-7xl mx-auto">
                    <div className="flex items-center gap-3">
                        <motion.div
                            whileHover={{ rotate: 15 }}
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-its-blue to-brand-blue shadow-lg shadow-brand-blue/20"
                        >
                            <span className="material-symbols-outlined text-white">analytics</span>
                        </motion.div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold font-heading tracking-tight text-white leading-none">PPSDM KMM</span>
                            <span className="text-[10px] uppercase tracking-widest text-its-gold font-bold">ITS Surabaya</span>
                        </div>
                    </div>
                    <nav className="hidden lg:flex items-center gap-10">
                        {["Metodologi", "9 Dimensi", "Demo", "FAQ"].map((item) => (
                            <Link key={item} className="text-sm font-medium hover:text-brand-accent transition-colors relative group" href={`#${item.toLowerCase().replace(' ', '-')}`}>
                                {item}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-accent transition-all group-hover:w-full"></span>
                            </Link>
                        ))}
                        <Link href="/auth/login">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-brand-blue hover:bg-brand-blue/90 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg shadow-brand-blue/30"
                            >
                                Mulai Sekarang
                            </motion.button>
                        </Link>
                    </nav>
                    <button className="lg:hidden flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                </div>
            </motion.header>

            <main className="flex-1 pt-20 relative z-10">
                {/* Hero Section */}
                <section ref={targetRef} className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 py-24 text-center overflow-hidden">
                    <motion.div
                        style={{ opacity, scale, y }}
                        className="relative z-10 max-w-5xl mx-auto flex flex-col items-center"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-3 rounded-full border border-brand-blue/30 bg-brand-blue/10 px-4 py-1.5 text-xs font-semibold text-brand-accent backdrop-blur-md mb-8 hover:bg-brand-blue/20 transition-colors cursor-default"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-accent"></span>
                            </span>
                            Join 12,450+ ITS Students Shaping the Future
                        </motion.div>

                        <motion.h1
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="text-5xl md:text-7xl lg:text-8xl font-black font-heading tracking-tighter text-white leading-[1.05] mb-8"
                        >
                            <motion.span variants={itemVariants} className="block">Elevate Your</motion.span>
                            <motion.span variants={itemVariants} className="gradient-text block">Human Capital</motion.span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8, duration: 1 }}
                            className="text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto font-light leading-relaxed mb-12"
                        >
                            Platform pengembangan terpadu berbasis data untuk mahasiswa ITS. Bangun portofolio kompetensi melalui asesmen presisi, roadmap terukur, dan bimbingan mentor eksklusif.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-6"
                        >
                            <Link href="/onboarding">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full sm:w-auto px-8 py-5 bg-white text-its-blue font-bold rounded-2xl hover:bg-brand-accent transition-colors shadow-2xl shadow-brand-accent/20 flex items-center justify-center gap-2 text-lg active:shadow-none"
                                >
                                    Mulai Assessment Gratis
                                    <span className="material-symbols-outlined">bolt</span>
                                </motion.button>
                            </Link>
                            <motion.button
                                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full sm:w-auto px-8 py-5 glass-card text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 text-lg border-white/20"
                            >
                                <span className="material-symbols-outlined">play_circle</span>
                                Tonton Demo
                            </motion.button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5, duration: 1 }}
                            className="mt-20 flex flex-wrap justify-center items-center gap-12"
                        >
                            <StatsCounter number="9" label="Dimensi Utama" />
                            <div className="w-px h-8 bg-white/20 hidden sm:block"></div>
                            <StatsCounter number="450+" label="Materi Kursus" />
                            <div className="w-px h-8 bg-white/20 hidden sm:block"></div>
                            <StatsCounter number="100%" label="Kurikulum ITS" />
                        </motion.div>
                    </motion.div>
                </section>

                {/* Methodology Section */}
                <section className="py-24 px-6 lg:px-12 bg-[#05080F]/50 backdrop-blur-sm" id="metodologi">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-20">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-3xl md:text-5xl font-bold font-heading text-white mb-4"
                            >
                                Metodologi Kami
                            </motion.h2>
                            <p className="text-slate-400">Transformasi potensi menjadi aksi melalui 4 langkah strategis.</p>
                        </div>
                        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div className="hidden md:block absolute top-12 left-1/2 -translate-x-1/2 w-4/5 h-px timeline-line"></div>
                            <MethodologyCard icon="psychology" step="1" title="Assessment" desc="Uji 9 dimensi kompetensi dasar Anda dengan AI-driven testing." />
                            <MethodologyCard icon="map" step="2" title="Roadmap" desc="Dapatkan rencana belajar personal sesuai minat dan gap kompetensi." />
                            <MethodologyCard icon="groups_3" step="3" title="Mentorship" desc="Bimbingan langsung dari alumni dan profesional industri." />
                            <MethodologyCard icon="verified" step="4" title="Portfolio" desc="Klaim sertifikat dan hasilkan portofolio yang divalidasi ITS." />
                        </div>
                    </div>
                </section>

                {/* 9 Dimensions Section */}
                <section className="py-24 px-6 lg:px-12" id="9-dimensi">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                            <div>
                                <motion.h2
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="text-4xl font-bold font-heading text-white mb-4"
                                >
                                    The 9 Dimensions
                                </motion.h2>
                                <p className="text-slate-400 max-w-xl">Kurikulum komprehensif yang membagi pengembangan menjadi kategori Hard Skills yang teknis dan Soft Skills yang esensial.</p>
                            </div>
                            <div className="flex gap-4">
                                <span className="px-4 py-2 rounded-full border border-brand-blue text-brand-blue text-xs font-bold uppercase tracking-wider">Soft Skills Focus</span>
                                <span className="px-4 py-2 rounded-full border border-its-gold text-its-gold text-xs font-bold uppercase tracking-wider">Hard Skills Focus</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <DimensionCard type="soft" icon="diversity_3" title="Leadership" desc="Mampu mengarahkan visi dan menginspirasi tim." progress={65} />
                            <DimensionCard type="hard" icon="code" title="Tech Mastery" desc="Penguasaan perangkat lunak dan metodologi engineering." progress={40} />
                            <DimensionCard type="soft" icon="forum" title="Communication" desc="Keahlian menyampaikan ide kompleks secara sederhana." progress={80} />
                            <DimensionCard type="hard" icon="analytics" title="Data Analytics" desc="Pengambilan keputusan berbasis data modern." progress={25} />
                            <DimensionCard type="soft" icon="auto_fix_high" title="Ethics & Growth" desc="Integritas akademik dan mentalitas pembelajar." progress={90} />
                            <DimensionCard type="hard" icon="business_center" title="Project Mgmt" desc="Manajemen sumber daya dan waktu framework Agile." progress={55} />
                        </div>
                    </div>
                </section>

                {/* Demo Section */}
                <section className="py-24 px-6 lg:px-12 relative overflow-hidden" id="demo">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col lg:flex-row gap-16 items-center">
                            <div className="lg:w-1/2 space-y-8">
                                <motion.h2
                                    initial={{ opacity: 0, x: -50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="text-4xl md:text-5xl font-bold font-heading text-white"
                                >
                                    Mission Control <br /><span className="text-brand-accent">Personal Dashboard</span>
                                </motion.h2>
                                <p className="text-slate-400 text-lg leading-relaxed">Rasakan langsung visualisasi radar kompetensi Anda. Platform kami melacak pertumbuhan setiap dimensi secara real-time untuk memastikan Anda tetap di jalur kesuksesan.</p>

                                <div className="glass-card p-6 rounded-2xl border-brand-blue/20">
                                    <p className="text-brand-accent text-xs font-bold mb-4 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-sm animate-spin-slow">settings</span>
                                        LIVE PREVIEW
                                    </p>
                                    <div className="space-y-4">
                                        {/* Mock Chart or Data */}
                                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: "75%" }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                                className="h-full bg-brand-accent"
                                            />
                                        </div>
                                        <div className="flex justify-between text-xs text-slate-400">
                                            <span>Current Progress</span>
                                            <span className="text-white font-bold">75%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:w-1/2 w-full max-w-[550px]">
                                <motion.div
                                    initial={{ opacity: 0, rotateY: 30 }}
                                    whileInView={{ opacity: 1, rotateY: 0 }}
                                    transition={{ type: "spring", stiffness: 50 }}
                                    className="glass-card p-8 rounded-[2.5rem] border-white/10 relative transform perspective-1000"
                                >
                                    {/* Simplified Radar Chart Visual */}
                                    <div className="aspect-square w-full rounded-full bg-gradient-to-tr from-brand-blue/10 to-transparent flex items-center justify-center p-8 relative">
                                        <div className="absolute inset-0 border border-white/5 rounded-full"></div>
                                        <div className="absolute inset-8 border border-white/5 rounded-full"></div>
                                        <div className="absolute inset-16 border border-white/5 rounded-full"></div>

                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                            className="absolute inset-0 bg-gradient-to-t from-brand-blue/20 to-transparent w-full h-1/2 origin-bottom left-0 top-0 pointer-events-none"
                                            style={{ borderRight: "1px solid rgba(255,255,255,0.1)" }}
                                        />

                                        <div className="relative z-10 text-center">
                                            <h3 className="text-3xl font-bold text-white">850</h3>
                                            <p className="text-xs text-brand-accent uppercase tracking-widest">Total Score</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-its-dark pt-20 pb-10 px-6 lg:px-12 border-t border-white/5">
                    <div className="max-w-7xl mx-auto text-center">
                        <p className="text-slate-500 text-sm">© 2024 PPSDM KMM ITS. Excellence in Student Development.</p>
                    </div>
                </footer>
            </main>
        </div>
    );
}

// Sub-components for cleaner code
function StatsCounter({ number, label }: { number: string, label: string }) {
    return (
        <div className="flex flex-col items-center group cursor-default">
            <motion.span
                whileHover={{ scale: 1.2, color: "#00d4ff" }}
                className="text-3xl font-bold text-white transition-colors"
            >
                {number}
            </motion.span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500 group-hover:text-white transition-colors">{label}</span>
        </div>
    );
}

function MethodologyCard({ icon, step, title, desc }: { icon: string, step: string, title: string, desc: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -10 }}
            viewport={{ once: true }}
            className="relative z-10 flex flex-col items-center text-center group"
        >
            <div className="w-24 h-24 rounded-3xl glass-card flex items-center justify-center mb-6 group-hover:bg-brand-blue/20 transition-all duration-500 border-brand-blue/30 relative">
                <span className="material-symbols-outlined text-4xl text-brand-accent group-hover:scale-110 transition-transform">{icon}</span>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-brand-blue rounded-full flex items-center justify-center text-white font-bold border-4 border-[#05080F] z-10">
                    {step}
                </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-accent transition-colors">{title}</h3>
            <p className="text-sm text-slate-500 max-w-[200px] leading-relaxed">{desc}</p>
        </motion.div>
    );
}

function DimensionCard({ type, icon, title, desc, progress }: { type: 'soft' | 'hard', icon: string, title: string, desc: string, progress: number }) {
    const colorClass = type === 'soft' ? 'text-brand-blue' : 'text-its-gold';
    const borderClass = type === 'soft' ? 'border-brand-blue' : 'border-its-gold';
    const bgClass = type === 'soft' ? 'bg-brand-blue' : 'bg-its-gold';

    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className={`glass-card p-8 rounded-2xl cursor-pointer group transition-all border-l-4 ${borderClass}`}
        >
            <div className="flex justify-between items-start mb-6">
                <div className={`size-14 rounded-xl ${bgClass}/20 flex items-center justify-center`}>
                    <span className={`material-symbols-outlined text-3xl ${colorClass}`}>{icon}</span>
                </div>
                <span className={`text-xs font-bold ${colorClass} uppercase`}>{type} Skill</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-white transition-colors">{title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 group-hover:text-slate-300">{desc}</p>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${progress}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className={`h-full ${bgClass}`}
                />
            </div>
        </motion.div>
    );
}
