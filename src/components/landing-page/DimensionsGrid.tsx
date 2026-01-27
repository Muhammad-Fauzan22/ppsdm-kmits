"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function DimensionsGrid() {
    const dimensions = [
        {
            title: "Leadership",
            type: "Soft Skill",
            desc: "Mampu mengarahkan visi dan menginspirasi tim dalam lingkungan yang dinamis.",
            icon: "diversity_3",
            color: "brand-blue",
            progress: 65
        },
        {
            title: "Tech Mastery",
            type: "Hard Skill",
            desc: "Penguasaan perangkat lunak dan metodologi engineering standar global.",
            icon: "code",
            color: "its-gold",
            progress: 40
        },
        {
            title: "Communication",
            type: "Soft Skill",
            desc: "Keahlian menyampaikan ide kompleks secara sederhana dan persuasif.",
            icon: "forum",
            color: "brand-blue",
            progress: 80
        },
        {
            title: "Data Analytics",
            type: "Hard Skill",
            desc: "Pengambilan keputusan berbasis data menggunakan tools statistik modern.",
            icon: "analytics",
            color: "its-gold",
            progress: 25
        },
        {
            title: "Ethics & Growth",
            type: "Soft Skill",
            desc: "Integritas akademik dan mentalitas pembelajar sepanjang hayat.",
            icon: "auto_fix_high",
            color: "brand-blue",
            progress: 90
        },
        {
            title: "Project Management",
            type: "Hard Skill",
            desc: "Manajemen sumber daya dan waktu melalui framework Agile/Scrum.",
            icon: "business_center",
            color: "its-gold",
            progress: 55
        }
    ];

    return (
        <section className="py-24 px-6 lg:px-12" id="dimensions">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl font-bold font-heading text-white mb-4">The 9 Dimensions</h2>
                        <p className="text-slate-400 max-w-xl">Kurikulum komprehensif yang membagi pengembangan menjadi kategori Hard Skills yang teknis dan Soft Skills yang esensial.</p>
                    </motion.div>
                    <motion.div
                        className="flex gap-4"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="px-4 py-2 rounded-full border border-brand-blue text-brand-blue text-xs font-bold uppercase tracking-wider">Soft Skills Focus</span>
                        <span className="px-4 py-2 rounded-full border border-its-gold text-its-gold text-xs font-bold uppercase tracking-wider">Hard Skills Focus</span>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dimensions.map((dim, index) => (
                        <motion.div
                            key={index}
                            className={`glass-card card-hover p-8 rounded-2xl cursor-pointer group transition-all border-l-4 ${dim.color === 'brand-blue' ? 'border-l-brand-blue' : 'border-l-its-gold'}`}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -10, rotateX: 5, rotateY: 5 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className={`size-14 rounded-xl flex items-center justify-center ${dim.color === 'brand-blue' ? 'bg-brand-blue/20' : 'bg-its-gold/20'}`}>
                                    <span className={`material-symbols-outlined text-3xl ${dim.color === 'brand-blue' ? 'text-brand-blue' : 'text-its-gold'}`}>{dim.icon}</span>
                                </div>
                                <span className={`text-xs font-bold uppercase ${dim.color === 'brand-blue' ? 'text-brand-blue' : 'text-its-gold'}`}>{dim.type}</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{dim.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-6">{dim.desc}</p>

                            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                <motion.div
                                    className={`h-full ${dim.color === 'brand-blue' ? 'bg-brand-blue' : 'bg-its-gold'}`}
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${dim.progress}%` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
