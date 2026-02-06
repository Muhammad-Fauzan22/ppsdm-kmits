"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Scale,
    Cpu,
    Globe,
    Brain,
    Lightbulb,
    Handshake,
    MessageSquare,
    RefreshCw
} from 'lucide-react';

const iconMap: { [key: string]: any } = {
    groups: Users,
    balance: Scale,
    memory: Cpu,
    public: Globe,
    psychology: Brain,
    lightbulb: Lightbulb,
    handshake: Handshake,
    chat: MessageSquare,
    autorenew: RefreshCw
};

export default function DimensionsGrid() {
    const dimensions = [
        { title: "Leadership", desc: "Cultivating the ability to guide, inspire, and influence others.", icon: "groups", color: "text-blue-400", bg: "bg-blue-500/20" },
        { title: "Ethics", desc: "Building moral character and integrity as the foundation.", icon: "balance", color: "text-red-400", bg: "bg-red-500/20" },
        { title: "Technology", desc: "Mastering digital tools and emerging tech landscapes.", icon: "memory", color: "text-cyan-400", bg: "bg-cyan-500/20" },
        { title: "Global Mindset", desc: "Understanding diverse cultures and operating internationally.", icon: "public", color: "text-green-400", bg: "bg-green-500/20" },
        { title: "Critical Thinking", desc: "Analyzing information objectively to solve problems.", icon: "psychology", color: "text-purple-400", bg: "bg-purple-500/20" },
        { title: "Creativity", desc: "Generating novel ideas and innovative solutions.", icon: "lightbulb", color: "text-yellow-400", bg: "bg-yellow-500/20" },
        { title: "Collaboration", desc: "Working synergistically within teams.", icon: "handshake", color: "text-orange-400", bg: "bg-orange-500/20" },
        { title: "Communication", desc: "Articulating thoughts clearly across various mediums.", icon: "chat", color: "text-teal-400", bg: "bg-teal-500/20" },
        { title: "Adaptability", desc: "Maintaining resilience in the face of rapid change.", icon: "autorenew", color: "text-pink-400", bg: "bg-pink-500/20" }
    ];

    return (
        <section className="py-20 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto bg-background-light dark:bg-background-dark">
            <div className="flex flex-col items-center gap-4 text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
                    9 Dimensions of Development
                </h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-lg font-body">
                    Explore the core competencies fostered through our comprehensive programs.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {dimensions.map((dim, index) => {
                    const IconComponent = iconMap[dim.icon] || Lightbulb;
                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            className="group glass-card p-6 rounded-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/50 relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative z-10 flex flex-col gap-4">
                                <div className={`size-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${dim.bg} ${dim.color}`}>
                                    <IconComponent className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white font-display">{dim.title}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-body">{dim.desc}</p>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
