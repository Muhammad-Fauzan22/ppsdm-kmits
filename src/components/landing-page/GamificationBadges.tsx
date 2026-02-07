'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Shield, Zap, Crown, Target, Star } from 'lucide-react';

const badges = [
    {
        id: 'explorer',
        name: 'Self Explorer',
        desc: 'Menyelesaikan Asesmen 9 Dimensi',
        icon: <Target className="w-8 h-8 text-blue-400" />,
        color: "from-blue-500/20 to-cyan-500/20",
        borderColor: "border-blue-500/50"
    },
    {
        id: 'visionary',
        name: 'Visionary',
        desc: 'Membuat Roadmap Karir 5 Tahun',
        icon: <Zap className="w-8 h-8 text-yellow-400" />,
        color: "from-yellow-500/20 to-orange-500/20",
        borderColor: "border-yellow-500/50"
    },
    {
        id: 'guardian',
        name: 'Guardian',
        desc: 'Mentor Terverifikasi KM ITS',
        icon: <Shield className="w-8 h-8 text-green-400" />,
        color: "from-green-500/20 to-emerald-500/20",
        borderColor: "border-green-500/50"
    },
    {
        id: 'legend',
        name: 'ITS Legend',
        desc: 'Top 1% Global Leaderboard',
        icon: <Crown className="w-8 h-8 text-purple-400" />,
        color: "from-purple-500/20 to-pink-500/20",
        borderColor: "border-purple-500/50"
    }
];

export default function GamificationBadges() {
    return (
        <section className="py-20 bg-[#0A0F1A] overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block"
                    >
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-4 font-display">
                            Unlock Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Achievements</span>
                        </h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                            Kumpulkan badges eksklusif seiring perkembangan 9 dimensimu. Jadilah legenda di angkatanmu.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {badges.map((badge, index) => (
                        <motion.div
                            key={badge.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                            className={`relative group p-6 rounded-2xl bg-gradient-to-br ${badge.color} border ${badge.borderColor} backdrop-blur-sm`}
                        >
                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />

                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="mb-4 p-4 rounded-full bg-black/20 ring-4 ring-white/5 group-hover:ring-white/10 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                                    {badge.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{badge.name}</h3>
                                <p className="text-sm text-slate-300">{badge.desc}</p>
                            </div>

                            {/* Shine effect on hover */}
                            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
