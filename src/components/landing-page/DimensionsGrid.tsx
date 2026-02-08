"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
    Brain,
    Target,
    Wallet,
    Dumbbell,
    Users,
    Sparkles,
    Shield,
    Flower2,
    Leaf
} from 'lucide-react';

/**
 * DimensionsGrid - 9 Dimensions with Netflix-style hover previews
 * and Mobile Legends rarity effects
 */

type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

interface Dimension {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    type: "hard Skill" | "soft Skill";
    validation: string;
    gradient: string;
    href: string;
    rarity: Rarity;
    stats: {
        assessments: number;
        modules: number;
        avgTime: string;
    };
}

const rarityStyles: Record<Rarity, { border: string; glow: string; badge: string }> = {
    common: {
        border: 'border-[#A0A0A0]/30',
        glow: '',
        badge: 'bg-[#A0A0A0]/20 text-[#A0A0A0]'
    },
    rare: {
        border: 'border-[#4CAF50]/50',
        glow: 'hover:shadow-[0_0_15px_rgba(76,175,80,0.3)]',
        badge: 'bg-[#4CAF50]/20 text-[#4CAF50]'
    },
    epic: {
        border: 'border-[#9C27B0]/50',
        glow: 'hover:shadow-[0_0_20px_rgba(156,39,176,0.4)]',
        badge: 'bg-[#9C27B0]/20 text-[#9C27B0]'
    },
    legendary: {
        border: 'border-[#FF9800]/50',
        glow: 'hover:shadow-[0_0_25px_rgba(255,152,0,0.5)]',
        badge: 'bg-[#FF9800]/20 text-[#FF9800]'
    },
};

const dimensions: Dimension[] = [
    {
        id: "cognitive",
        title: "Kognitif & Intelektual",
        description: "Kemampuan berpikir kritis, kreativitas, dan mindset pembelajar untuk memecahkan masalah kompleks.",
        icon: <Brain className="w-6 h-6" />,
        type: "hard Skill",
        validation: "Reliability α = 0.87 (Excellent)",
        gradient: "from-violet-600 to-indigo-700",
        href: "/dashboard/dimensions/cognitive",
        rarity: "legendary",
        stats: { assessments: 12, modules: 8, avgTime: "15 min" }
    },
    {
        id: "self-management",
        title: "Manajemen Diri",
        description: "Produktivitas, manajemen waktu, dan pembentukan kebiasaan positif untuk efektivitas tinggi.",
        icon: <Target className="w-6 h-6" />,
        type: "soft Skill",
        validation: "Reliability α = 0.87 (Excellent)",
        gradient: "from-blue-500 to-cyan-600",
        href: "/dashboard/dimensions/self-management",
        rarity: "epic",
        stats: { assessments: 10, modules: 6, avgTime: "12 min" }
    },
    {
        id: "financial",
        title: "Kecerdasan Finansial",
        description: "Literasi keuangan, investasi dasar, dan perencanaan masa depan yang mandiri.",
        icon: <Wallet className="w-6 h-6" />,
        type: "hard Skill",
        validation: "Indonesian Norms (N=1500)",
        gradient: "from-emerald-500 to-teal-600",
        href: "/dashboard/dimensions/financial",
        rarity: "rare",
        stats: { assessments: 8, modules: 5, avgTime: "10 min" }
    },
    {
        id: "physical",
        title: "Kesehatan Fisik",
        description: "Kebugaran fisik, nutrisi, dan manajemen energi untuk performa puncak.",
        icon: <Dumbbell className="w-6 h-6" />,
        type: "soft Skill",
        validation: "Validation Study (r=0.48 with GPA)",
        gradient: "from-orange-500 to-amber-600",
        href: "/dashboard/dimensions/physical",
        rarity: "rare",
        stats: { assessments: 6, modules: 4, avgTime: "8 min" }
    },
    {
        id: "emotional-social",
        title: "Emotional & Social",
        description: "Kecerdasan emosi, empati, dan kemampuan membangun hubungan interpersonal yang kuat.",
        icon: <Users className="w-6 h-6" />,
        type: "soft Skill",
        validation: "Predicts Leadership (β=0.58)",
        gradient: "from-pink-500 to-rose-600",
        href: "/dashboard/dimensions/emotional-social",
        rarity: "epic",
        stats: { assessments: 15, modules: 7, avgTime: "18 min" }
    },
    {
        id: "mental-health",
        title: "Kesehatan Mental",
        description: "Ketahanan mental, manajemen stres, dan kesejahteraan psikologis.",
        icon: <Sparkles className="w-6 h-6" />,
        type: "soft Skill",
        validation: "Clinical Screening Validity",
        gradient: "from-purple-500 to-fuchsia-600",
        href: "/dashboard/dimensions/mental-health",
        rarity: "legendary",
        stats: { assessments: 14, modules: 9, avgTime: "20 min" }
    },
    {
        id: "character",
        title: "Karakter & Etika",
        description: "Integritas, keberanian moral, dan tanggung jawab etis dalam tindakan.",
        icon: <Shield className="w-6 h-6" />,
        type: "soft Skill",
        validation: "Validated vs VIA-IS (r=0.70)",
        gradient: "from-red-500 to-orange-600",
        href: "/dashboard/dimensions/character",
        rarity: "epic",
        stats: { assessments: 11, modules: 6, avgTime: "14 min" }
    },
    {
        id: "spiritual",
        title: "Spiritualitas",
        description: "Pencarian makna hidup, rasa syukur, dan koneksi dengan tujuan yang lebih besar.",
        icon: <Flower2 className="w-6 h-6" />,
        type: "soft Skill",
        validation: "Multicultural Validity",
        gradient: "from-amber-500 to-yellow-600",
        href: "/dashboard/dimensions/spiritual",
        rarity: "rare",
        stats: { assessments: 7, modules: 4, avgTime: "10 min" }
    },
    {
        id: "environmental",
        title: "Lingkungan & Gaya Hidup",
        description: "Kesadaran lingkungan, gaya hidup berkelanjutan, dan keseimbangan digital.",
        icon: <Leaf className="w-6 h-6" />,
        type: "hard Skill",
        validation: "Validated vs NEP Scale",
        gradient: "from-green-500 to-emerald-600",
        href: "/dashboard/dimensions/environmental",
        rarity: "common",
        stats: { assessments: 5, modules: 3, avgTime: "8 min" }
    }
];

function DimensionCard({ dim, index }: { dim: Dimension; index: number }) {
    const [isHovered, setIsHovered] = useState(false);
    const rarity = rarityStyles[dim.rarity];

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="group relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link href={dim.href}>
                {/* Netflix-style card with scale on hover */}
                <motion.div
                    className={cn(
                        "relative bg-[#111827] border rounded-2xl p-6 overflow-hidden h-full",
                        "transition-all duration-300",
                        rarity.border,
                        rarity.glow,
                        dim.rarity === 'legendary' && 'animate-legendary-pulse'
                    )}
                    whileHover={{
                        scale: 1.03,
                        y: -8,
                        transition: { duration: 0.3, delay: 0.15 }
                    }}
                >
                    {/* Background Gradient on Hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${dim.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                    <div className="relative z-10">
                        {/* Header: Icon + Rarity Badge */}
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${dim.gradient} flex items-center justify-center shadow-lg group-hover:text-white transition-colors text-white/90`}>
                                {dim.icon}
                            </div>
                            <span className={cn("text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded", rarity.badge)}>
                                {dim.rarity}
                            </span>
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
                        <div className="flex items-center gap-2 text-xs text-green-400 mb-3">
                            <span className="material-symbols-outlined text-sm">verified_user</span>
                            <span>{dim.validation}</span>
                        </div>

                        {/* Netflix-style Preview Panel (appears on hover) */}
                        <AnimatePresence>
                            {isHovered && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="border-t border-white/10 pt-3 mt-3"
                                >
                                    <div className="flex items-center justify-between text-xs">
                                        <div className="text-center">
                                            <div className="text-white font-bold">{dim.stats.assessments}</div>
                                            <div className="text-slate-500">Assessments</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-white font-bold">{dim.stats.modules}</div>
                                            <div className="text-slate-500">Modules</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-white font-bold">{dim.stats.avgTime}</div>
                                            <div className="text-slate-500">Avg Time</div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* CTA */}
                        <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-slate-400 group-hover:text-blue-400 transition-colors">
                            <span>Pelajari Detil</span>
                            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </div>
                    </div>
                </motion.div>
            </Link>
        </motion.div>
    );
}

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

                    {/* Rarity Legend */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="flex items-center justify-center gap-4 mt-6 text-xs"
                    >
                        {(['common', 'rare', 'epic', 'legendary'] as Rarity[]).map((r) => (
                            <div key={r} className="flex items-center gap-1.5">
                                <div className={cn("w-2 h-2 rounded-full", {
                                    'bg-[#A0A0A0]': r === 'common',
                                    'bg-[#4CAF50]': r === 'rare',
                                    'bg-[#9C27B0]': r === 'epic',
                                    'bg-[#FF9800]': r === 'legendary',
                                })} />
                                <span className="text-slate-500 capitalize">{r}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Dimensions Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {dimensions.map((dim, index) => (
                        <DimensionCard key={dim.id} dim={dim} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
