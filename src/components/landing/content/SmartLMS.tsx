"use client";

import { motion } from "framer-motion";

export function SmartLMS() {
    return (
        <section className="py-24 bg-slate-900 text-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="text-center mb-16">
                    <span className="text-brand-accent font-bold tracking-widest text-sm uppercase mb-2 block">AI-Powered Learning</span>
                    <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6">
                        Sistem Pembelajaran Cerdas
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Konten Grade-A yang di-generate AI dari sumber terpercaya (OpenStax, MIT OCW, dll).
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Pipeline Visual */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-brand-blue/20 blur-[100px] rounded-full pointer-events-none"></div>
                        <div className="relative z-10 space-y-4">
                            {[
                                { step: "Source Acquisition", desc: "OpenStax, MIT OCW" },
                                { step: "Semantic Analysis", desc: "Knowledge Graph Building" },
                                { step: "Deep Understanding", desc: "Yi-34B-200K / GPT-4" },
                                { step: "Pedagogical Design", desc: "Bloom's Taxonomy" },
                                { step: "Multimodal Generation", desc: "Text, Audio, Visual" }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center font-bold text-sm">
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">{item.step}</h4>
                                        <p className="text-xs text-slate-400">{item.desc}</p>
                                    </div>
                                    {idx < 4 && (
                                        <div className="absolute left-[30px] h-8 w-0.5 bg-white/10 -bottom-4 z-0"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Content Preview */}
                    <div className="space-y-8">
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                                <span className="material-symbols-outlined text-brand-accent">auto_stories</span>
                                Sample Generated Content
                            </h3>

                            <div className="space-y-4">
                                <div className="bg-black/40 p-4 rounded-xl flex items-center justify-between">
                                    <span className="text-slate-300">Atomic Habits Summary</span>
                                    <span className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs font-bold">Grade A (89.5)</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-black/40 p-4 rounded-xl text-center hover:bg-brand-blue/20 transition-colors cursor-pointer border border-white/5">
                                        <span className="material-symbols-outlined text-3xl mb-2 text-slate-300">podcasts</span>
                                        <p className="text-xs text-slate-400">Audio Podcast</p>
                                    </div>
                                    <div className="bg-black/40 p-4 rounded-xl text-center hover:bg-brand-blue/20 transition-colors cursor-pointer border border-white/5">
                                        <span className="material-symbols-outlined text-3xl mb-2 text-slate-300">quiz</span>
                                        <p className="text-xs text-slate-400">Gamified Quiz</p>
                                    </div>
                                    <div className="bg-black/40 p-4 rounded-xl text-center hover:bg-brand-blue/20 transition-colors cursor-pointer border border-white/5">
                                        <span className="material-symbols-outlined text-3xl mb-2 text-slate-300">slideshow</span>
                                        <p className="text-xs text-slate-400">Slides PDF</p>
                                    </div>
                                    <div className="bg-black/40 p-4 rounded-xl text-center hover:bg-brand-blue/20 transition-colors cursor-pointer border border-white/5">
                                        <span className="material-symbols-outlined text-3xl mb-2 text-slate-300">account_tree</span>
                                        <p className="text-xs text-slate-400">Mind Map</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-8 justify-center lg:justify-start">
                            <div>
                                <div className="text-3xl font-bold text-white">500+</div>
                                <div className="text-xs text-slate-500 uppercase">Modules Available</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-white">100%</div>
                                <div className="text-xs text-slate-500 uppercase">Open Source</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
