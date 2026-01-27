"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function DimensionsGrid() {
    const dimensions = [
        {
            title: "Leadership",
            desc: "Cultivating the ability to guide, inspire, and influence others towards shared goals.",
            icon: "groups",
            colorClass: "bg-blue-500/20 text-blue-400"
        },
        {
            title: "Ethics",
            desc: "Building moral character and integrity as the foundation of professional life.",
            icon: "balance",
            colorClass: "bg-red-500/20 text-red-400"
        },
        {
            title: "Technology",
            desc: "Mastering digital tools and maintaining fluency in emerging tech landscapes.",
            icon: "memory",
            colorClass: "bg-cyan-500/20 text-cyan-400"
        },
        {
            title: "Global Mindset",
            desc: "Understanding diverse cultures and operating effectively in international contexts.",
            icon: "public",
            colorClass: "bg-green-500/20 text-green-400"
        },
        {
            title: "Critical Thinking",
            desc: "Analyzing information objectively to form reasoned judgments and solve problems.",
            icon: "psychology",
            colorClass: "bg-purple-500/20 text-purple-400"
        },
        {
            title: "Creativity",
            desc: "Generating novel ideas and innovative solutions to complex challenges.",
            icon: "lightbulb",
            colorClass: "bg-yellow-500/20 text-yellow-400"
        },
        {
            title: "Collaboration",
            desc: "Working synergistically within teams to achieve collective success.",
            icon: "handshake",
            colorClass: "bg-orange-500/20 text-orange-400"
        },
        {
            title: "Communication",
            desc: "Articulating thoughts clearly and listening effectively across various mediums.",
            icon: "chat",
            colorClass: "bg-teal-500/20 text-teal-400"
        },
        {
            title: "Adaptability",
            desc: "Maintaining resilience and flexibility in the face of rapid change.",
            icon: "autorenew",
            colorClass: "bg-pink-500/20 text-pink-400"
        }
    ];

    return (
        <section className="py-20 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto bg-background-light dark:bg-background-dark">
            <div className="flex flex-col items-center gap-4 text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
                    9 Dimensions of Development
                </h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-lg font-body">
                    Explore the core competencies fostered through our comprehensive programs designed to shape future leaders.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {dimensions.map((dim, index) => (
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
                            <div className={`size-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${dim.colorClass}`}>
                                <span className="material-symbols-outlined text-3xl">{dim.icon}</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white font-display">{dim.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-body">{dim.desc}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
