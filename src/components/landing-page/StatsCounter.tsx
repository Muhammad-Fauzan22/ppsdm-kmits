'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Star, Award, Zap } from 'lucide-react';

const stats = [
    {
        id: 1,
        label: "Mahasiswa Bergabung",
        value: "2,143",
        icon: <Users className="w-5 h-5 text-blue-400" />,
        color: "from-blue-500/20 to-blue-600/10"
    },
    {
        id: 2,
        label: "Peningkatan Produktivitas",
        value: "94%",
        icon: <Zap className="w-5 h-5 text-yellow-400" />,
        color: "from-yellow-500/20 to-yellow-600/10"
    },
    {
        id: 3,
        label: "Kepuasan User",
        value: "4.9/5",
        icon: <Star className="w-5 h-5 text-orange-400" />,
        color: "from-orange-500/20 to-orange-600/10"
    },
    {
        id: 4,
        label: "Fakultas Terdaftar",
        value: "7",
        icon: <Award className="w-5 h-5 text-purple-400" />,
        color: "from-purple-500/20 to-purple-600/10"
    }
];

export default function StatsCounter() {
    return (
        <section className="py-8 bg-[#0A0F1A] border-y border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative p-4 rounded-xl bg-gradient-to-br ${stat.color} border border-white/5 flex flex-col items-center justify-center text-center hover:scale-105 transition-transform`}
                        >
                            <div className="mb-2 p-2 rounded-full bg-white/5">
                                {stat.icon}
                            </div>
                            <div className="text-2xl md:text-3xl font-bold text-white mb-1 font-display">
                                {stat.value}
                            </div>
                            <div className="text-xs md:text-sm text-slate-400 font-medium">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
