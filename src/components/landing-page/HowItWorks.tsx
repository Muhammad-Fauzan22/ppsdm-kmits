"use client";

import React from 'react';
import { motion } from 'framer-motion';

const steps = [
    {
        num: "01",
        title: "Ambil Asesmen",
        description: "Jawab 72 pertanyaan psikometrik yang dirancang oleh ahli psikologi untuk memetakan profil unik Anda."
    },
    {
        num: "02",
        title: "Dapatkan Peta",
        description: "Terima laporan analisis gap kompetensi 9 dimensi dan rekomendasi pengembangan yang personal."
    },
    {
        num: "03",
        title: "Jalankan Misi",
        description: "Ikuti modul pembelajaran mikro dan tantangan nyata untuk meningkatkan skill yang masih kurang."
    },
    {
        num: "04",
        title: "Panen Prestasi",
        description: "Bangun portofolio holistik yang terverifikasi untuk menunjang karir dan beasiswa."
    }
];

export default function HowItWorks() {
    return (
        <section className="py-24 px-4 bg-[#0A0F1A]">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block text-cyan-400 font-bold tracking-widest text-sm uppercase mb-4"
                    >
                        The Journey
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
                    >
                        Dari Potensi Menjadi
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                            Kompetensi
                        </span>
                    </motion.h2>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden lg:block absolute top-16 left-[12%] w-[76%] h-0.5 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15 }}
                            className="relative bg-[#111827] border border-white/5 rounded-2xl p-6 hover:border-cyan-500/30 transition-all group"
                        >
                            {/* Step Number */}
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform">
                                <span className="text-white font-bold text-lg">{step.num}</span>
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                                {step.title}
                            </h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
