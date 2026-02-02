"use client";

import { motion } from "framer-motion";

const problems = [
    {
        title: "Pemahaman Diri yang Terfragmentasi",
        description: "Kebanyakan mahasiswa hanya fokus pada IPK, tanpa memahami 8 dimensi perkembangan lainnya. Tidak ada alat untuk mengukur perkembangan karakter, kesehatan mental, dan kecerdasan finansial secara terintegrasi.",
        icon: "psychology_alt"
    },
    {
        title: "Sistem Pendidikan yang Parsial",
        description: "Kurikulum kampus sering kali fokus pada aspek kognitif, meninggalkan dimensi penting lainnya. Tidak ada roadmap pengembangan diri yang personal dan berbasis data.",
        icon: "school"
    },
    {
        title: "Preparasi Karir yang Tidak Holistik",
        description: "Lulusan teknik sering kali unggul teknis tetapi tertinggal dalam soft skills dan leadership. Kesenjangan antara kompetensi akademik dan kebutuhan dunia kerja yang kompleks.",
        icon: "work_alert"
    }
];

const solutions = [
    {
        title: "Assessment Berbasis Sains",
        description: "72 pertanyaan psikometrik tervalidasi dengan reliabilitas α=0.87. Norma dari 2,000+ mahasiswa Indonesia dengan instant personalized feedback.",
        icon: "science"
    },
    {
        title: "Personalized Development Pathways",
        description: "Rekomendasi intervensi yang disesuaikan dengan profil unik Anda. Learning path otomatis berdasarkan gap analysis dan progress tracking real-time.",
        icon: "alt_route"
    },
    {
        title: "Ecosystem Integration",
        description: "Terhubung dengan sistem ITS, BEM, Himpunan, UKM. Jembatan alumni-mahasiswa dan industry partnership pathways.",
        icon: "hub"
    }
];

export function ProblemSolution() {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                {/* Problem Section */}
                <div className="mb-24">
                    <div className="text-center mb-16">
                        <span className="text-brand-blue font-bold tracking-widest text-sm uppercase mb-2 block">The Challenge</span>
                        <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-its-dark to-slate-700 mb-4">
                            Tantangan Pengembangan Diri di Era Digital
                        </h2>
                        <div className="h-1 w-24 bg-brand-blue mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {problems.map((item, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -10 }}
                                className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-all duration-300"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-6">
                                    <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed text-sm">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Feature Divider */}
                <div className="flex items-center justify-center mb-24">
                    <div className="h-px bg-slate-200 w-full max-w-xs"></div>
                    <div className="mx-4 text-slate-400 text-sm font-semibold tracking-widest uppercase">Memperkenalkan Solusi</div>
                    <div className="h-px bg-slate-200 w-full max-w-xs"></div>
                </div>

                {/* Solution Section */}
                <div>
                    <div className="text-center mb-16">
                        <span className="text-its-gold font-bold tracking-widest text-sm uppercase mb-2 block">The Solution</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                            PPSDM KMITS: <span className="text-brand-blue">Sistem Saraf Digital</span> untuk Pengembangan Holistik
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">Platform terintegrasi yang menjembatani kesenjangan antara potensi akademik dan kesuksesan kehidupan nyata.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {solutions.map((item, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -10 }}
                                className="p-8 rounded-3xl bg-gradient-to-br from-brand-blue/5 to-white border border-brand-blue/10 hover:border-brand-blue/30 transition-all duration-300 group"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-brand-blue text-white flex items-center justify-center mb-6 shadow-lg shadow-brand-blue/20 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                                </div>
                                <h3 className="text-xl font-bold text-brand-dark mb-3">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed text-sm">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
