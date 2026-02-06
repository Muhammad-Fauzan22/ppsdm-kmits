"use client";

import { motion } from "framer-motion";

export function Roadmap() {
    const timeline = [
        { year: "2024", title: "Foundation", items: ["9 Dimensi Assessment", "Personalized Dashboard", "Basic LMS Integration"], status: "done" },
        { year: "2025", title: "Expansion", items: ["AI Mentor & Career Coach", "Advanced Predictive Analytics", "Mobile App Native"], status: "planned" },
        { year: "2026", title: "Innovation", items: ["VR/AR Learning Experiences", "Blockchain Credentialing", "Global Network Expansion"], status: "vision" },
        { year: "2028", title: "Global Benchmark", items: ["Standard for Higher Ed", "Research Hub", "Export to 10+ Countries"], status: "vision" }
    ];

    return (
        <section className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="text-center mb-16">
                    <span className="text-brand-blue font-bold tracking-widest text-sm uppercase mb-2 block">Vision 2028</span>
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                        Menjadi <span className="text-brand-blue">Global Benchmark</span>
                    </h2>
                </div>

                <div className="relative">
                    {/* Line */}
                    <div className="hidden md:block absolute top-[40px] left-0 w-full h-1 bg-slate-200 rounded-full"></div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {timeline.map((item, idx) => (
                            <div key={idx} className="relative pt-0 md:pt-16 md:text-center group">
                                {/* Dot */}
                                <div className={`hidden md:block absolute top-[32px] left-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-4 border-white transition-colors z-10 ${item.status === 'done' ? 'bg-green-500' : item.status === 'planned' ? 'bg-brand-blue' : 'bg-slate-300'}`}></div>

                                <h3 className="text-4xl font-bold text-slate-200 group-hover:text-slate-300 transition-colors mb-2">{item.year}</h3>
                                <h4 className="font-bold text-lg text-gray-900 mb-4">{item.title}</h4>
                                <ul className="space-y-2">
                                    {item.items.map((sub, i) => (
                                        <li key={i} className="text-sm text-gray-600 flex items-center md:justify-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'done' ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                                            {sub}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Live Stats */}
                <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
                    {[
                        { label: "Active Users", val: "2,347" },
                        { label: "Assessments", val: "8,921" },
                        { label: "Goals Achieved", val: "15,683" },
                        { label: "Learning Hours", val: "124k+" }
                    ].map((stat, idx) => (
                        <div key={idx} className="text-center">
                            <div className="text-2xl font-bold text-gray-900">{stat.val}</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
