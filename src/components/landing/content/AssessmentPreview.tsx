"use client";

import { motion } from "framer-motion";
import { Brain } from "lucide-react";
import { useState } from "react";

export function AssessmentPreview() {
    const [selected, setSelected] = useState<number | null>(null);

    const options = [
        { id: 1, text: "Saya akan kerjakan sendiri semua agar sempurna", analysis: "Perfeksionisme tinggi, namun berisiko burnout. Perlu belajar delegasi." },
        { id: 2, text: "Saya bagi tugas sesuai keahlian tim", analysis: "Excellent! Ini menunjukkan kemampuan leadership dan trust building." },
        { id: 3, text: "Saya panik dan bingung harus mulai dari mana", analysis: "Indikasi stress management perlu ditingkatkan. Tenang, ini bisa dilatih." }
    ];

    return (
        <section className="py-24 bg-its-dark relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-[0.02]" />

            <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                <span className="text-brand-accent font-bold tracking-widest text-sm uppercase mb-6 block">Try It Yourself</span>
                <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-12">
                    Coba 1 Soal Asesmen Leadership
                </h2>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-sm text-left">
                    <p className="text-lg md:text-xl text-white mb-8 font-medium">
                        "Saat tim Anda mengalami deadlock dan deadline tinggal 2 jam lagi, apa reaksi insting Anda?"
                    </p>

                    <div className="space-y-4">
                        {options.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => setSelected(opt.id)}
                                className={`w-full p-4 rounded-xl text-left transition-all border ${selected === opt.id ? 'bg-brand-blue border-brand-blue text-white' : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700'}`}
                            >
                                <span className="font-bold mr-3">{String.fromCharCode(64 + opt.id)}.</span>
                                {opt.text}
                            </button>
                        ))}
                    </div>

                    {selected && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-8 p-6 bg-brand-blue/20 border border-brand-blue/50 rounded-xl shadow-lg shadow-brand-blue/10"
                        >
                            <div className="flex items-start gap-3">
                                <Brain className="text-green-400 w-6 h-6" />
                                <div>
                                    <h5 className="text-green-400 font-bold text-sm uppercase tracking-wide mb-1">Instant Analysis</h5>
                                    <p className="text-white text-sm leading-relaxed">
                                        {options.find(o => o.id === selected)?.analysis}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                <p className="mt-8 text-slate-500 text-sm">
                    Inilah sedikit gambaran dari <span className="text-white font-bold">72 pertanyaan</span> yang akan mengungkap potensi Anda.
                </p>
            </div>
        </section>
    );
}
