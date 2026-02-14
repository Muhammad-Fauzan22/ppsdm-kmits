"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Map, Users, BadgeCheck } from 'lucide-react';

export default function Methodology() {
    const steps = [
        {
            Icon: Brain,
            title: "1. Assessment",
            desc: "Uji 9 dimensi kompetensi dasar Anda dengan AI-driven testing."
        },
        {
            Icon: Map,
            title: "2. Roadmap",
            desc: "Dapatkan rencana belajar personal sesuai minat dan gap kompetensi."
        },
        {
            Icon: Users,
            title: "3. Mentorship",
            desc: "Bimbingan langsung dari alumni dan profesional industri."
        },
        {
            Icon: BadgeCheck,
            title: "4. Portfolio",
            desc: "Klaim sertifikat dan hasilkan portofolio yang divalidasi ITS."
        }
    ];

    return (
        <section className="py-24 px-6 lg:px-12 bg-[#05080F]" id="how-it-works">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl md:text-5xl font-bold font-heading text-white mb-4">Metodologi Kami</h2>
                    <p className="text-slate-400">Transformasi potensi menjadi aksi melalui 4 langkah strategis.</p>
                </motion.div>

                <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="hidden md:block absolute top-12 left-1/2 -translate-x-1/2 w-4/5 h-px timeline-line"></div>

                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            className="relative z-10 flex flex-col items-center text-center group"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                        >
                            <div className="w-24 h-24 rounded-3xl glass-card flex items-center justify-center mb-6 group-hover:bg-brand-blue/20 transition-all duration-500 border-brand-blue/30 group-hover:scale-110 shadow-lg group-hover:shadow-brand-blue/20">
                                <step.Icon className="text-4xl text-brand-accent w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                            <p className="text-sm text-slate-500 max-w-[200px]">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
