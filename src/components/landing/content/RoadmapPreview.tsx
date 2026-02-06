"use client";

import { motion } from "framer-motion";

const items = [
    { sem: "Semester 1", focus: "Adaptasi & Self-Discovery", status: "completed" },
    { sem: "Semester 2", focus: "Basic Leadership & Teamwork", status: "current" },
    { sem: "Semester 3", focus: "Functional Competence", status: "locked" },
    { sem: "Semester 4", focus: "Complex Problem Solving", status: "locked" },
    { sem: "Semester 5", focus: "Professional Ethics", status: "locked" },
    { sem: "Semester 6", focus: "Innovation & Entrepreneurship", status: "locked" },
];

export function RoadmapPreview() {
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2">
                        <span className="text-its-gold font-bold tracking-widest text-sm uppercase mb-2 block">Your Personal Roadmap</span>
                        <h2 className="text-3xl md:text-5xl font-bold font-heading text-slate-900 mb-6">
                            Bukan Sekadar Kuliah,<br /> Ini <span className="bg-gradient-to-r from-its-blue to-brand-blue bg-clip-text text-transparent">Legacy-mu</span>.
                        </h2>
                        <p className="text-slate-600 text-lg leading-relaxed mb-8">
                            Setiap mahasiswa memiliki start point yang berbeda. Algoritma kami akan merancang roadmap pengembangan diri yang unik untuk Anda, disesuaikan dengan target karir dan hasil asesmen.
                        </p>
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-3xl font-bold text-its-blue">48+</span>
                                <span className="text-xs text-slate-500 uppercase tracking-wider">Modul Skill</span>
                            </div>
                            <div className="w-px h-12 bg-slate-200" />
                            <div className="flex flex-col gap-1">
                                <span className="text-3xl font-bold text-its-blue">8</span>
                                <span className="text-xs text-slate-500 uppercase tracking-wider">Semester Plan</span>
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-1/2 relative">
                        {/* Visual Mockup of Roadmap */}
                        <div className="relative z-10 bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl">
                            <div className="flex items-center justify-between mb-8 border-b border-slate-700 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-blue to-cyan-500" />
                                    <div>
                                        <h4 className="text-white font-bold text-sm">Rizky's Roadmap</h4>
                                        <p className="text-slate-400 text-xs">Informatics Engineering '24</p>
                                    </div>
                                </div>
                                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold">On Track</span>
                            </div>

                            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {items.map((item, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className={`p-4 rounded-xl border ${item.status === 'completed' ? 'bg-brand-blue/10 border-brand-blue/30' : item.status === 'current' ? 'bg-white/5 border-white/20' : 'opacity-50 grayscale border-slate-800'}`}
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <span className={`text-xs font-bold uppercase ${item.status === 'completed' ? 'text-brand-blue' : 'text-slate-400'}`}>{item.sem}</span>
                                            {item.status === 'completed' && <span className="material-symbols-outlined text-brand-blue text-sm">check_circle</span>}
                                            {item.status === 'locked' && <span className="material-symbols-outlined text-slate-600 text-sm">lock</span>}
                                        </div>
                                        <h5 className="text-white font-bold">{item.focus}</h5>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Decor */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-its-gold rounded-full blur-[80px] opacity-20" />
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-brand-blue rounded-full blur-[80px] opacity-20" />
                    </div>
                </div>
            </div>
        </section>
    );
}
