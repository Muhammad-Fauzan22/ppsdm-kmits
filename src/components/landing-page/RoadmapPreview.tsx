"use client";

import React from 'react';
import { motion } from 'framer-motion';

const roadmapItems = [
    { semester: "Semester 1", focus: "Adaptasi & Self-Discovery", status: "completed" as const },
    { semester: "Semester 2", focus: "Basic Leadership & Teamwork", status: "current" as const },
    { semester: "Semester 3", focus: "Functional Competence", status: "locked" as const },
    { semester: "Semester 4", focus: "Complex Problem Solving", status: "locked" as const },
    { semester: "Semester 5", focus: "Professional Ethics", status: "locked" as const },
    { semester: "Semester 6", focus: "Innovation & Entrepreneurship", status: "locked" as const }
];

export default function RoadmapPreview() {
    return (
        <section className="py-24 px-4 bg-gradient-to-b from-[#0A0F1A] to-[#050810]">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div>
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-block text-amber-400 font-bold tracking-widest text-sm uppercase mb-4"
                        >
                            Your Personal Roadmap
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6"
                        >
                            Bukan Sekadar Kuliah,
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                                Ini Legacy-mu.
                            </span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-slate-400 text-lg leading-relaxed mb-8"
                        >
                            Setiap mahasiswa memiliki start point yang berbeda. Algoritma kami akan merancang roadmap
                            pengembangan diri yang unik untuk Anda, disesuaikan dengan target karir dan hasil asesmen.
                        </motion.p>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="flex gap-8"
                        >
                            <div>
                                <div className="text-4xl font-bold text-white">48+</div>
                                <div className="text-xs text-slate-500 uppercase tracking-wider">Modul Skill</div>
                            </div>
                            <div className="w-px h-12 bg-slate-700" />
                            <div>
                                <div className="text-4xl font-bold text-white">8</div>
                                <div className="text-xs text-slate-500 uppercase tracking-wider">Semester Plan</div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right - Roadmap Preview Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 shadow-2xl">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500" />
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-white font-bold text-sm">Rizky's Roadmap</span>
                                            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-slate-400">Demo</span>
                                        </div>
                                        <span className="text-slate-500 text-xs">Informatics Engineering '24</span>
                                    </div>
                                </div>
                                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold">
                                    On Track
                                </span>
                            </div>

                            {/* Roadmap Items */}
                            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2">
                                {roadmapItems.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`p-4 rounded-xl border transition-all cursor-pointer ${item.status === 'completed'
                                                ? 'bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/15'
                                                : item.status === 'current'
                                                    ? 'bg-white/5 border-white/20 hover:bg-white/10'
                                                    : 'opacity-50 border-slate-800 grayscale'
                                            }`}
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <span className={`text-xs font-bold uppercase ${item.status === 'completed' ? 'text-blue-400' : 'text-slate-500'
                                                }`}>
                                                {item.semester}
                                            </span>
                                            {item.status === 'completed' && (
                                                <span className="material-symbols-outlined text-blue-400 text-base">check_circle</span>
                                            )}
                                            {item.status === 'locked' && (
                                                <span className="material-symbols-outlined text-slate-600 text-base">lock</span>
                                            )}
                                        </div>
                                        <h4 className="text-white font-semibold">{item.focus}</h4>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Decorative Glows */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500 rounded-full blur-[80px] opacity-20 pointer-events-none" />
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500 rounded-full blur-[80px] opacity-20 pointer-events-none" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
