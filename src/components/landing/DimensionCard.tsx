"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

import { DimensionData } from "@/data/dimensions";

interface DimensionCardProps {
    dimension: DimensionData;
    index: number;
}

export function DimensionCard({ dimension, index }: DimensionCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="relative h-[420px] w-full z-10 group/wrapper">
            <motion.div
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className={`absolute left-0 top-0 w-full transition-all duration-300 ease-out ${isHovered
                        ? "z-50 scale-105 h-auto shadow-2xl shadow-black/50"
                        : "z-10 h-full"
                    }`}
            >
                {/* Animated Border Gradient */}
                <div
                    className={`absolute inset-0 rounded-3xl opacity-20 group-hover/wrapper:opacity-100 transition-opacity duration-500 blur-xl ${dimension.type === "soft"
                        ? "bg-gradient-to-br from-brand-blue via-brand-accent to-brand-blue"
                        : "bg-gradient-to-br from-its-gold via-amber-400 to-its-gold"
                        }`}
                />

                {/* Card Content */}
                <div className={`relative h-full bg-[#0A0F1A] border-white/10 rounded-[1.4rem] overflow-hidden flex flex-col transition-colors duration-300 ${isHovered ? "border-white/20 bg-[#0A0F1A]" : "border-white/10 bg-[#0A0F1A]/90 backdrop-blur-xl"
                    }`}>
                    {/* Background Mesh Gradient */}
                    <div
                        className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] opacity-20 transition-all duration-500 ${dimension.type === "soft"
                            ? "bg-brand-blue group-hover/wrapper:opacity-40"
                            : "bg-its-gold group-hover/wrapper:opacity-40"
                            } -translate-y-1/2 translate-x-1/2`}
                    />

                    <div className="p-6 md:p-8 flex flex-col h-full relative z-10">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                            <div
                                className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover/wrapper:scale-110 group-hover/wrapper:rotate-3 shadow-lg ${dimension.type === "soft"
                                    ? "bg-brand-blue/10 text-brand-accent shadow-brand-blue/20"
                                    : "bg-its-gold/10 text-its-gold shadow-its-gold/20"
                                    }`}
                            >
                                <span className="material-symbols-outlined text-3xl md:text-4xl">
                                    {dimension.icon}
                                </span>
                            </div>
                            <span
                                className={`text-[10px] font-bold uppercase tracking-widest border px-3 py-1 rounded-full backdrop-blur-md ${dimension.type === "soft"
                                    ? "text-brand-accent border-brand-blue/30 bg-brand-blue/5"
                                    : "text-its-gold border-its-gold/30 bg-its-gold/5"
                                    }`}
                            >
                                {dimension.type} Skill
                            </span>
                        </div>

                        {/* Title */}
                        <div className="mb-3">
                            <h3
                                className={`text-2xl font-bold font-heading transition-colors duration-300 ${isHovered
                                    ? "text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300"
                                    : "text-white"
                                    }`}
                            >
                                {dimension.title}
                            </h3>
                            {dimension.tagline && (
                                <p className="text-xs font-bold uppercase tracking-wide opacity-70 mt-1" style={{ color: dimension.type === 'soft' ? '#00d4ff' : '#fbbf24' }}>
                                    {dimension.tagline}
                                </p>
                            )}
                        </div>

                        {/* Short Description */}
                        <p className="text-slate-400 text-sm leading-relaxed mb-6 group-hover/wrapper:text-slate-300 transition-colors line-clamp-3 group-hover/wrapper:line-clamp-none">
                            {dimension.description}
                        </p>

                        {/* Expandable Content */}
                        <motion.div
                            initial={false}
                            animate={{
                                height: isHovered ? "auto" : 0,
                                opacity: isHovered ? 1 : 0,
                            }}
                            className="overflow-hidden"
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            <div className="pt-4 border-t border-white/5 space-y-4 pb-2">
                                {dimension.stat && (
                                    <div className="bg-white/5 rounded-lg p-3 flex items-center gap-3 border border-white/10">
                                        <span className="material-symbols-outlined text-green-400">monitoring</span>
                                        <p className="text-xs text-slate-300">{dimension.stat}</p>
                                    </div>
                                )}

                                <p className="text-sm text-slate-300 leading-relaxed font-light">
                                    {dimension.longDescription}
                                </p>

                                <Link
                                    href={dimension.link}
                                    className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-lg ${dimension.type === "soft"
                                        ? "bg-brand-blue hover:bg-brand-accent text-white hover:text-its-dark shadow-brand-blue/20 hover:shadow-brand-accent/40"
                                        : "bg-its-gold hover:bg-amber-300 text-its-dark hover:text-black shadow-its-gold/20 hover:shadow-amber-300/40"
                                        }`}
                                >
                                    <span>Pelajari Selengkapnya</span>
                                    <span className="material-symbols-outlined text-lg group-hover/wrapper:translate-x-1 transition-transform">
                                        arrow_forward
                                    </span>
                                </Link>
                            </div>
                        </motion.div>

                        {/* Progress Bar (Fades out on hover to make room) */}
                        <motion.div
                            animate={{ opacity: isHovered ? 0 : 1 }}
                            className="mt-auto pt-4"
                        >
                            <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                                <span>Mastery Level</span>
                                <span className={dimension.type === 'soft' ? 'text-brand-accent' : 'text-its-gold'}>{dimension.progress}%</span>
                            </div>
                            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 ${dimension.type === "soft" ? "bg-brand-blue" : "bg-its-gold"
                                        }`}
                                    style={{ width: `${dimension.progress}%` }}
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
