"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BadgeCheck, ArrowRight, FileText, Award } from 'lucide-react';

export default function PortfolioPage() {
    return (
        <div className="bg-background-dark min-h-screen text-white font-sans p-6 lg:p-10">
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mb-10"
            >
                <div className="flex justify-between items-end">
                    <div>
                        <span className="text-brand-blue font-bold tracking-wider uppercase text-xs mb-2 block">
                            Career Portfolio
                        </span>
                        <h1 className="text-4xl font-extrabold font-grotesk tracking-tight">
                            Achievements & Skills
                        </h1>
                        <p className="text-slate-400 mt-2 max-w-2xl">
                            Showcase your verified skills, project history, and academic milestones.
                        </p>
                    </div>
                </div>
            </motion.header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* 1. Verifier Card */}
                <Link href="/portfolio/verifier">
                    <motion.div
                        whileHover={{ scale: 1.02, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="group relative h-72 rounded-2xl overflow-hidden glass-card border border-brand-blue/30 cursor-pointer shadow-lg shadow-brand-blue/10"
                    >
                        {/* Background with Grid */}
                        <div className="absolute inset-0 bg-[#0A2718]/30" />
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#10B981 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>

                        {/* Content */}
                        <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                            <div className="flex justify-between items-start">
                                <div className="bg-[#0A2718] border border-green-900/50 text-emerald-400 p-3 rounded-xl">
                                    <BadgeCheck className="w-8 h-8" />
                                </div>
                                <div className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20 animate-pulse">
                                    Blockchain Active
                                </div>
                            </div>

                            <div>
                                <h3 className="text-2xl font-bold font-grotesk mb-1 text-white group-hover:text-emerald-400 transition-colors">Activity Verifier</h3>
                                <p className="text-sm text-slate-300 mb-4 line-clamp-2">
                                    Scan QR codes to mint proofs of attendance and verify your extracurricular activities on-chain.
                                </p>
                                <div className="flex items-center gap-2 text-xs font-mono text-emerald-500">
                                    <span>Access Tool</span>
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </div>
                            </div>
                        </div>

                        {/* Hover Effect */}
                        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-emerald-500/20 blur-3xl group-hover:bg-emerald-500/30 transition-all duration-500 rounded-full pointer-events-none"></div>
                    </motion.div>
                </Link>

                {/* 2. CV Builder (Placeholder) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="group relative h-72 rounded-2xl overflow-hidden glass-card border border-white/5 opacity-80"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-transparent" />

                    <div className="absolute top-4 right-4 bg-white/5 text-slate-400 px-3 py-1 rounded-full text-xs font-bold border border-white/5">
                        COMING SOON
                    </div>

                    <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                        <div className="bg-purple-900/20 border border-purple-900/50 text-purple-400 p-3 rounded-xl w-fit">
                            <FileText className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold font-grotesk mb-1 text-slate-300">Live CV</h3>
                            <p className="text-sm text-slate-500 mb-4">
                                Auto-generated resume based on your verified skills and projects.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* 3. Badges & Certs (Placeholder) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="group relative h-72 rounded-2xl overflow-hidden glass-card border border-white/5 opacity-80"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 to-transparent" />
                    <div className="absolute top-4 right-4 bg-white/5 text-slate-400 px-3 py-1 rounded-full text-xs font-bold border border-white/5">
                        COMING SOON
                    </div>

                    <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                        <div className="bg-amber-900/20 border border-amber-900/50 text-amber-400 p-3 rounded-xl w-fit">
                            <Award className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold font-grotesk mb-1 text-slate-300">Certifications</h3>
                            <p className="text-sm text-slate-500 mb-4">
                                Digital wallet for your certificates and earned badges.
                            </p>
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
