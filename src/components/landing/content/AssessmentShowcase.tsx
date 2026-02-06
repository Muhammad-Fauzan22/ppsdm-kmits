"use client";

import { motion } from "framer-motion";

const features = [
    {
        title: "Scientific Foundation",
        items: [
            "72 Pertanyaan Tervalidasi (α=0.87)",
            "Norma 2,000+ Mahasiswa Indonesia",
            "Cross-cultural Adaptation"
        ],
        icon: "psychology"
    },
    {
        title: "Intelligent Scoring",
        items: [
            "IRT-based Scoring (Item Response Theory)",
            "Personalized Weighting sesuai jurusan",
            "Confidence Intervals (±3.2 poin)"
        ],
        icon: "calculate"
    },
    {
        title: "Actionable Insights",
        items: [
            "Visual Radar Chart (9 Dimensi)",
            "Gap Analysis (Current vs Ideal)",
            "Development Priority Matrix"
        ],
        icon: "insights"
    }
];

const timelineSteps = [
    { step: "01", title: "Registrasi Cepat", desc: "SSO ITS (2 menit)" },
    { step: "02", title: "Assessment Holistik", desc: "30 menit, 9 dimensi" },
    { step: "03", title: "Analisis Otomatis", desc: "Instant AI Scoring" },
    { step: "04", title: "Personalized Report", desc: "40+ Halaman PDF" },
    { step: "05", title: "Action Plan", desc: "Intervensi Spesifik" }
];

export function AssessmentShowcase() {
    return (
        <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-brand-blue opacity-10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-indigo-600 opacity-10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
                <div className="text-center mb-20">
                    <span className="text-brand-accent font-bold tracking-widest text-sm uppercase mb-2 block">Psychometric Engine</span>
                    <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6">
                        Assessment Psikometrik Tervalidasi
                    </h2>
                    <p className="text-slate-300 max-w-3xl mx-auto text-lg">
                        Bukan sekadar tes biasa, tetapi pemetaan potensi mendalam yang dibangun di atas riset ilmiah.
                    </p>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                    {features.map((feature, idx) => (
                        <div key={idx} className="glass-card p-8 rounded-3xl border border-white/10 hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-brand-blue to-indigo-600 shadow-lg shadow-brand-blue/20">
                                    <span className="material-symbols-outlined text-2xl text-white">{feature.icon}</span>
                                </div>
                                <h3 className="text-xl font-bold">{feature.title}</h3>
                            </div>
                            <ul className="space-y-3">
                                {feature.items.map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                                        <span className="material-symbols-outlined text-brand-accent text-sm">check_circle</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Process Timeline */}
                <div className="relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 hidden md:block rounded-full"></div>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                        {timelineSteps.map((step, idx) => (
                            <div key={idx} className="relative group text-center md:text-left">
                                <div className="w-12 h-12 rounded-full bg-slate-800 border-4 border-slate-900 group-hover:border-brand-blue transition-colors flex items-center justify-center font-bold text-white relative z-10 mx-auto md:mx-0 shadow-xl">
                                    {step.step}
                                </div>
                                <div className="mt-6 md:pl-2">
                                    <h4 className="font-bold text-lg mb-1 group-hover:text-brand-accent transition-colors">{step.title}</h4>
                                    <p className="text-sm text-slate-400">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sample Output Preview - Visual Representation */}
                <div className="mt-24 text-center">
                    <button className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-medium transition-all hover:scale-105 flex items-center gap-3 mx-auto">
                        <span className="material-symbols-outlined">picture_as_pdf</span>
                        Lihat Contoh Laporan Lengkap (PDF)
                    </button>
                </div>
            </div>
        </section>
    );
}
