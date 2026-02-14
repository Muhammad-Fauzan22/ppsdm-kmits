"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Activity, Brain, User, Shield, Zap, BookOpen, Heart, Smartphone, ArrowRight } from "lucide-react";

export default function AssessmentHubPage() {
    return (
        <div className="bg-slate-900/50 min-h-screen text-white font-sans p-6 lg:p-10">
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mb-10"
            >
                <span className="text-blue-500 font-bold tracking-wider uppercase text-xs mb-2 block">
                    Know Yourself
                </span>
                <h1 className="text-4xl font-extrabold font-grotesk tracking-tight">
                    Assessment Center
                </h1>
                <p className="text-slate-400 mt-2 max-w-2xl">
                    Discover your strengths across 9 dimensions of holistic development.
                </p>
            </motion.header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* 4. Physical Health */}
                <Link href="/dashboard/assessment/physical-health">
                    <motion.div
                        whileHover={{ scale: 1.02, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="group relative h-64 rounded-2xl overflow-hidden glass-card border border-emerald-500/30 cursor-pointer"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 to-transparent" />
                        <div className="absolute top-4 right-4 bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold">
                            Recommended
                        </div>
                        <div className="absolute bottom-0 left-0 p-6 w-full">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="bg-emerald-600 size-10 rounded-lg flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
                                    <Activity className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold font-grotesk">Physical Health</h3>
                            </div>
                            <p className="text-slate-300 text-sm mb-4">
                                Vitality, Sleep, Nutrition & Energy Levels.
                            </p>
                            <div className="flex items-center text-emerald-500 text-xs font-bold uppercase tracking-wider gap-1">
                                Start Assessment <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </div>
                        </div>
                    </motion.div>
                </Link>

                {/* 6. Mental Health */}
                <Link href="/dashboard/assessment/mental-health">
                    <motion.div
                        whileHover={{ scale: 1.02, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="group relative h-64 rounded-2xl overflow-hidden glass-card border border-rose-500/30 cursor-pointer"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-rose-900/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-6 w-full">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="bg-rose-600 size-10 rounded-lg flex items-center justify-center text-white shadow-lg shadow-rose-600/30">
                                    <Heart className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold font-grotesk">Mental Health</h3>
                            </div>
                            <p className="text-slate-300 text-sm mb-4">
                                Emotional Well-being, Resilience & Stress Management.
                            </p>
                            <div className="flex items-center text-rose-500 text-xs font-bold uppercase tracking-wider gap-1">
                                Start Assessment <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </div>
                        </div>
                    </motion.div>
                </Link>

                {/* 2. Cognitive */}
                <Link href="/dashboard/assessment/cognitive">
                    <motion.div
                        whileHover={{ scale: 1.02, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="group relative h-64 rounded-2xl overflow-hidden glass-card border border-blue-500/30 cursor-pointer"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-6 w-full">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="bg-blue-600 size-10 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                                    <Brain className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold font-grotesk">Cognitive</h3>
                            </div>
                            <p className="text-slate-300 text-sm mb-4">
                                Critical Thinking, Problem Solving & Focus.
                            </p>
                            <div className="flex items-center text-blue-500 text-xs font-bold uppercase tracking-wider gap-1">
                                Start Assessment <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </div>
                        </div>
                    </motion.div>
                </Link>

                {/* Coming Soon: Technology */}
                <div className="relative h-64 rounded-2xl overflow-hidden glass-card border border-white/5 opacity-60">
                    <div className="absolute top-4 right-4 bg-white/5 text-slate-400 px-3 py-1 rounded-full text-xs font-bold">
                        COMING SOON
                    </div>
                    <div className="absolute bottom-0 left-0 p-6 w-full">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-purple-600/20 size-10 rounded-lg flex items-center justify-center text-purple-400">
                                <Smartphone className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold font-grotesk text-slate-300">Technology</h3>
                        </div>
                        <p className="text-slate-500 text-sm">
                            Digital Literacy & Tech Proficiency.
                        </p>
                    </div>
                </div>

                {/* Coming Soon: Financial */}
                <div className="relative h-64 rounded-2xl overflow-hidden glass-card border border-white/5 opacity-60">
                    <div className="absolute top-4 right-4 bg-white/5 text-slate-400 px-3 py-1 rounded-full text-xs font-bold">
                        COMING SOON
                    </div>
                    <div className="absolute bottom-0 left-0 p-6 w-full">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-yellow-600/20 size-10 rounded-lg flex items-center justify-center text-yellow-500">
                                <Shield className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold font-grotesk text-slate-300">Financial</h3>
                        </div>
                        <p className="text-slate-500 text-sm">
                            Financial Literacy & Management.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
