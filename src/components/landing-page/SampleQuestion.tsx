"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuestionOption {
    id: string;
    label: string;
    text: string;
}

const sampleQuestion = {
    question: "Saat tim Anda mengalami deadlock dan deadline tinggal 2 jam lagi, apa reaksi insting Anda?",
    options: [
        { id: "A", label: "A", text: "Saya akan kerjakan sendiri semua agar sempurna" },
        { id: "B", label: "B", text: "Saya bagi tugas sesuai keahlian tim" },
        { id: "C", label: "C", text: "Saya panik dan bingung harus mulai dari mana" }
    ] as QuestionOption[]
};

export default function SampleQuestion() {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    return (
        <section className="py-24 px-4 bg-gradient-to-b from-[#0A0F1A] to-[#0D1220]">
            <div className="max-w-3xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block text-amber-400 font-bold tracking-widest text-sm uppercase mb-4"
                    >
                        Try It Yourself
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4"
                    >
                        Coba 1 Soal Asesmen Leadership
                    </motion.h2>
                </div>

                {/* Question Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-[#111827] border border-white/10 rounded-2xl p-8 shadow-xl"
                >
                    {/* Question */}
                    <p className="text-lg sm:text-xl text-white font-medium mb-8 leading-relaxed">
                        "{sampleQuestion.question}"
                    </p>

                    {/* Options */}
                    <div className="space-y-3 mb-8">
                        {sampleQuestion.options.map((option) => (
                            <motion.button
                                key={option.id}
                                onClick={() => setSelectedOption(option.id)}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${selectedOption === option.id
                                        ? 'bg-blue-600/20 border-blue-500 text-white'
                                        : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/10'
                                    }`}
                            >
                                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full mr-3 font-bold text-sm ${selectedOption === option.id
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white/10 text-slate-400'
                                    }`}>
                                    {option.label}
                                </span>
                                {option.text}
                            </motion.button>
                        ))}
                    </div>

                    {/* Result hint */}
                    <AnimatePresence>
                        {selectedOption && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl"
                            >
                                <p className="text-sm text-slate-400">
                                    {selectedOption === 'B' ? (
                                        <span className="text-green-400">
                                            ✓ Respon yang menunjukkan kepemimpinan efektif! Anda cenderung kolaboratif dan delegatif.
                                        </span>
                                    ) : (
                                        <span className="text-amber-400">
                                            Menarik! Respon ini memberikan insight tentang gaya kepemimpinan Anda. Asesmen lengkap akan memberikan analisis mendalam.
                                        </span>
                                    )}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Teaser */}
                    <p className="text-center text-slate-500 text-sm mt-6">
                        Inilah sedikit gambaran dari <span className="text-white font-semibold">72 pertanyaan</span> yang akan mengungkap potensi Anda.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
