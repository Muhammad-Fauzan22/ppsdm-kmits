"use client";

import React from 'react';
import { motion } from 'framer-motion';

const layers = [
    {
        id: 1,
        title: "Core Extraction & Validation",
        subtitle: "OCR Extract → Validate Confidence (≥5/10)",
        icon: "document_scanner",
        color: "text-blue-400",
        border: "border-blue-500/30",
        bg: "bg-blue-500/10",
        details: ["GPT-5 Vision OCR", "Metadata Extraction", "Confidence Validation"]
    },
    {
        id: 2,
        title: "Parallel Analysis (3 AI)",
        subtitle: "Immersive Detection + Web Intelligence + Synthesis",
        icon: "hub",
        color: "text-cyan-400",
        border: "border-cyan-500/30",
        bg: "bg-cyan-500/10",
        details: ["VR/AR Readiness Score", "SerpAPI Reviews", "Triangulation Synthesis"]
    },
    {
        id: 3,
        title: "Audio Learning",
        subtitle: "Podcast Scripts + Microlearning + Flashcards",
        icon: "headphones",
        color: "text-teal-400",
        border: "border-teal-500/30",
        bg: "bg-teal-500/10",
        details: ["Complete Podcast Scripts", "10+ Microlearning Bites", "Auto-Duration Est."]
    },
    {
        id: 4,
        title: "Gamification Engine",
        subtitle: "Badges + Quests + Points System",
        icon: "sports_esports",
        color: "text-purple-400",
        border: "border-purple-500/30",
        bg: "bg-purple-500/10",
        details: ["8-10 Achievement Badges", "5-7 Learning Quests", "Leaderboard Metrics"]
    },
    {
        id: 5,
        title: "Output Generation",
        subtitle: "7 Standardized Output Files",
        icon: "output",
        color: "text-orange-400",
        border: "border-orange-500/30",
        bg: "bg-orange-500/10",
        details: ["Module MD & Index JSON", "Immersive Analysis JSON", "Gamification & Audio MD"]
    },
    {
        id: 6,
        title: "Storage & Distribution",
        subtitle: "Supabase + Google Drive Integration",
        icon: "cloud_upload",
        color: "text-indigo-400",
        border: "border-indigo-500/30",
        bg: "bg-indigo-500/10",
        details: ["Auto-Folder Creation", "7-File Upload", "Shareable Links Gen"]
    },
    {
        id: 7,
        title: "Notifications & Analytics",
        subtitle: "Dashboard Update + Real-time Logs",
        icon: "analytics",
        color: "text-green-400",
        border: "border-green-500/30",
        bg: "bg-green-500/10",
        details: ["Status Dashboard Update", "Processing Logs", "Performance Metrics"]
    }
];

export default function PipelineShowcase() {
    return (
        <section className="py-24 relative overflow-hidden bg-background-dark">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-4"
                    >
                        <span className="material-symbols-outlined text-sm">settings_suggest</span>
                        <span className="text-sm font-semibold tracking-wide uppercase">AI-Powered Transformation</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-white mb-6 font-display"
                    >
                        7-Layer Immersive Pipeline
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-lg text-slate-400 max-w-2xl mx-auto"
                    >
                        Mengotomatisasi transformasi buku teks statis menjadi pengalaman pembelajaran imersif yang siap untuk Era AI.
                    </motion.p>
                </div>

                <div className="relative">
                    {/* Central Connecting Line (Desktop) */}
                    <div className="absolute left-1/2 top-4 bottom-4 w-0.5 bg-gradient-to-b from-transparent via-slate-700 to-transparent hidden lg:block -translate-x-1/2"></div>

                    <div className="space-y-12 lg:space-y-0">
                        {layers.map((layer, index) => (
                            <motion.div
                                key={layer.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ margin: "-100px" }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className={`flex flex-col lg:flex-row items-center gap-8 ${index % 2 === 0 ? 'lg:flex-row-reverse' : ''
                                    }`}
                            >
                                {/* Content Card */}
                                <div className="w-full lg:w-[calc(50%-40px)]">
                                    <div className={`glass-card p-6 md:p-8 rounded-2xl border ${layer.border} hover:bg-white/5 transition-all duration-300 group`}>
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`p-3 rounded-xl ${layer.bg} ${layer.color}`}>
                                                <span className="material-symbols-outlined text-2xl">{layer.icon}</span>
                                            </div>
                                            <span className="text-xs font-mono text-slate-500 bg-slate-800/50 px-2 py-1 rounded">
                                                LAYER {layer.id}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400 transition-all">
                                            {layer.title}
                                        </h3>
                                        <p className="text-sm font-semibold text-slate-300 mb-4 font-mono">
                                            {layer.subtitle}
                                        </p>

                                        <ul className="space-y-2">
                                            {layer.details.map((detail, idx) => (
                                                <li key={idx} className="flex items-center gap-2 text-sm text-slate-400">
                                                    <span className={`w-1.5 h-1.5 rounded-full ${layer.color.replace('text-', 'bg-')}`}></span>
                                                    {detail}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Center Node */}
                                <div className="hidden lg:flex w-20 justify-center relative z-10">
                                    <div className={`w-4 h-4 rounded-full border-2 border-slate-700 bg-background-dark outline outline-4 outline-background-dark ${layer.color.replace('text', 'bg').replace('400', '500')}`}></div>
                                </div>

                                {/* Spacer for alternate side */}
                                <div className="w-full lg:w-[calc(50%-40px)] hidden lg:block"></div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Automation Badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-20 text-center"
                >
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-900/40 to-cyan-900/40 border border-blue-500/30 backdrop-blur-md">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                        </span>
                        <span className="text-cyan-100 font-mono text-sm">Optimized Flow: Layer 2 runs in parallel (~30% faster)</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
