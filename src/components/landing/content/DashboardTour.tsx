"use client";

import { motion } from "framer-motion";
import Image from "next/image";

// Sample content for dashboard features
const slides = [
    {
        id: "radar",
        title: "Holistic Development Radar",
        desc: "Visualisasi 9 dimensi dengan progress tracking dan color-coded development stages.",
        image: "/assets/dashboard-preview.png" // Placeholder, assuming this asset exists or will be added
    },
    {
        id: "goals",
        title: "Goal Tracking System",
        desc: "SMART metrics dengan progress bars dan predictive completion dates.",
        image: "/assets/dashboard-preview.png"
    },
    {
        id: "pathway",
        title: "Learning Pathway Navigator",
        desc: "Google Maps untuk pengembangan skill dengan prerequisite mapping.",
        image: "/assets/dashboard-preview.png"
    }
];

export function DashboardTour() {
    return (
        <section id="mission-control" className="py-24 bg-slate-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <span className="text-brand-blue font-bold tracking-widest text-sm uppercase mb-2 block">Mission Control</span>
                        <h2 className="text-4xl md:text-5xl font-bold font-heading text-slate-900 mb-6">
                            Dashboard Cerdas Anda
                        </h2>
                        <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                            Pusat kendali untuk pengembangan diri. Pantau kemajuan, tetapkan target, dan dapatkan rekomendasi berbasis AI dalam satu tampilan terpadu.
                        </p>

                        <div className="space-y-8">
                            {slides.map((slide, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ x: 10 }}
                                    className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white transition-colors cursor-pointer"
                                >
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-bold">
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-800">{slide.title}</h3>
                                        <p className="text-slate-500 text-sm mt-1">{slide.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-10 flex gap-4">
                            <div className="flex flex-col">
                                <span className="text-3xl font-bold text-slate-900">87 min</span>
                                <span className="text-sm text-slate-500">Daily usage avg</span>
                            </div>
                            <div className="w-px bg-slate-300 h-12 mx-4"></div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-bold text-slate-900">+18%</span>
                                <span className="text-sm text-slate-500">Growth / 6mo</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        {/* Decorative Elements */}
                        <div className="absolute -top-10 -right-10 w-64 h-64 bg-its-gold opacity-20 blur-[80px] rounded-full"></div>
                        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-brand-blue opacity-20 blur-[80px] rounded-full"></div>

                        {/* Browser Frame Mockup */}
                        <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-500">
                            <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                <div className="ml-4 bg-white px-3 py-1 rounded-md text-xs text-slate-400 flex-1 text-center">ppsdm.its.ac.id/dashboard</div>
                            </div>

                            {/* Placeholder for dashboard image content - using a gradient/abstract rep if image missing */}
                            <div className="aspect-[16/10] bg-slate-50 relative flex items-center justify-center overflow-hidden group">
                                {/* We can incorporate an actual screenshot later, for now we simulate the radar chart */}
                                <div className="w-2/3 h-2/3 border-4 border-dashed border-slate-200 rounded-full flex items-center justify-center relative animate-spin-slow">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/10 to-transparent rounded-full transform rotate-45"></div>
                                    <span className="text-slate-300 font-bold text-xl">Interactive Radar Chart</span>
                                </div>

                                {/* Floating Cards */}
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute bottom-8 left-8 bg-white p-4 rounded-xl shadow-lg border border-slate-100 max-w-xs"
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="material-symbols-outlined text-green-500">check_circle</span>
                                        <span className="font-bold text-xs text-slate-700">Goal Achieved</span>
                                    </div>
                                    <p className="text-xs text-slate-500">Selamat! Anda telah menyelesaikan modul Leadership.</p>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
