"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Dimension {
    id: string;
    title: string;
    description: string;
    icon: string;
    type: "hard Skill" | "soft Skill";
    validation: string;
    gradient: string;
    href: string;
}

const dimensions: Dimension[] = [
    {
        id: "cognitive",
        title: "Kognitif & Intelektual",
        description: "Kemampuan berpikir kritis, kreativitas, dan mindset pembelajar untuk memecahkan masalah kompleks.",
        icon: "psychology",
        type: "hard Skill",
        validation: "Reliability α = 0.87 (Excellent)",
        gradient: "from-violet-600 to-indigo-700",
        href: "/dashboard/dimensions/cognitive"
    },
    {
        id: "self-management",
        title: "Manajemen Diri",
        description: "Produktivitas, manajemen waktu, dan pembentukan kebiasaan positif untuk efektivitas tinggi.",
        icon: "target",
        type: "soft Skill",
        validation: "Reliability α = 0.87 (Excellent)",
        gradient: "from-blue-500 to-cyan-600",
        href: "/dashboard/dimensions/self-management"
    },
    {
        id: "financial",
        title: "Kecerdasan Finansial",
        description: "Literasi keuangan, investasi dasar, dan perencanaan masa depan yang mandiri.",
        icon: "monetization_on",
        type: "hard Skill",
        validation: "Indonesian Norms (N=1500)",
        gradient: "from-emerald-500 to-teal-600",
        href: "/dashboard/dimensions/financial"
    },
    {
        id: "physical",
        title: "Kesehatan Fisik",
        description: "Kebugaran fisik, nutrisi, dan manajemen energi untuk performa puncak.",
        icon: "fitness_center",
        type: "soft Skill",
        validation: "Validation Study (r=0.48 with GPA)",
        gradient: "from-orange-500 to-amber-600",
        href: "/dashboard/dimensions/physical"
    },
    {
        id: "emotional-social",
        title: "Emotional & Social",
        description: "Kecerdasan emosi, empati, dan kemampuan membangun hubungan interpersonal yang kuat.",
        icon: "handshake",
        type: "soft Skill",
        validation: "Predicts Leadership (β=0.58)",
        gradient: "from-pink-500 to-rose-600",
        href: "/dashboard/dimensions/emotional-social"
    },
    {
        id: "mental-health",
        title: "Kesehatan Mental",
        description: "Ketahanan mental, manajemen stres, dan kesejahteraan psikologis.",
        icon: "self_improvement",
        type: "soft Skill",
        validation: "Clinical Screening Validity",
        gradient: "from-purple-500 to-fuchsia-600",
        href: "/dashboard/dimensions/mental-health"
    },
    {
        id: "character",
        title: "Karakter & Etika",
        description: "Integritas, keberanian moral, dan tanggung jawab etis dalam tindakan.",
        icon: "shield",
        type: "soft Skill",
        validation: "Validated vs VIA-IS (r=0.70)",
        gradient: "from-red-500 to-orange-600",
        href: "/dashboard/dimensions/character"
    },
    {
        id: "spiritual",
        title: "Spiritualitas",
        description: "Pencarian makna hidup, rasa syukur, dan koneksi dengan tujuan yang lebih besar.",
        icon: "volunteer_activism",
        type: "soft Skill",
        validation: "Multicultural Validity",
        gradient: "from-amber-500 to-yellow-600",
        href: "/dashboard/dimensions/spiritual"
    },
    {
        id: "environmental",
        title: "Lingkungan & Gaya Hidup",
        description: "Kesadaran lingkungan, gaya hidup berkelanjutan, dan keseimbangan digital.",
        icon: "eco",
        type: "hard Skill",
        validation: "Validated vs NEP Scale",
        gradient: "from-green-500 to-emerald-600",
        href: "/dashboard/dimensions/environmental"
    }
];

export default function DimensionsGrid() {
    return (
        <section id="9-dimensi" className="py-24 px-4 bg-[#0A0F1A]">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block text-blue-400 font-bold tracking-widest text-sm uppercase mb-4"
                    >
                        Holistic Framework
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
                    >
                        9 Dimensi Pengembangan
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-slate-400 max-w-2xl mx-auto text-lg"
                    >
                        Kurikulum komprehensif untuk membentuk mahasiswa yang tidak hanya cerdas akademik, tapi juga matang karakter.
                    </motion.p>
                </div>

                {/* Dimensions Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {dimensions.map((dim, index) => (
                        <motion.div
                            key={dim.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            className="group relative"
                        >
                            <Link href={dim.href}>
                                <div className="relative bg-[#111827] border border-white/5 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/5 overflow-hidden h-full">
                                    {/* Background Gradient on Hover */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${dim.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                                    <div className="relative z-10">
                                        {/* Icon */}
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${dim.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                                            <span className="material-symbols-outlined text-white text-2xl">{dim.icon}</span>
                                        </div>

                                        {/* Type Badge */}
                                        <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded mb-3 ${dim.type === "hard Skill"
                                                ? "bg-blue-500/20 text-blue-400"
                                                : "bg-amber-500/20 text-amber-400"
                                            }`}>
                                            {dim.type}
                                        </span>

                                        {/* Title */}
                                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                                            {dim.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-slate-500 text-sm leading-relaxed mb-4">
                                            {dim.description}
                                        </p>

                                        {/* Validation Badge */}
                                        <div className="flex items-center gap-2 text-xs text-green-400">
                                            <span className="material-symbols-outlined text-sm">verified_user</span>
                                            <span>{dim.validation}</span>
                                        </div>

                                        {/* CTA */}
                                        <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-slate-400 group-hover:text-blue-400 transition-colors">
                                            <span>Pelajari Detil</span>
                                            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
