"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { dimensions } from "@/data/dimensions";

export default function DimensionDetailPage() {
    const params = useParams();
    const slug = params?.slug as string;

    const dimension = dimensions.find((d) => d.slug === slug);

    if (!dimension) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4 font-heading">Dimensi Tidak Ditemukan</h1>
                    <p className="text-slate-400 mb-8">Maaf, dimensi yang Anda cari tidak tersedia dalam database kami.</p>
                    <Link href="/" className="px-6 py-3 bg-brand-blue rounded-full text-white font-bold hover:bg-brand-accent hover:text-brand-blue transition-all">
                        Kembali ke Beranda
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden font-sans">
            {/* Background Noise & Gradient */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
            <div
                className={`absolute top-0 right-0 w-[50%] h-[50%] blur-[120px] rounded-full opacity-20 pointer-events-none ${dimension.type === "soft" ? "bg-brand-blue" : "bg-its-gold"
                    }`}
            ></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 relative z-10">
                {/* Breadcrumb */}
                <Link
                    href="/#dimensions"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-12 group"
                >
                    <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
                    Kembali ke 9 Dimensi
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-24">
                    {/* Left Column: Hero & Description */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div
                                className={`p-4 rounded-2xl ${dimension.type === "soft"
                                    ? "bg-brand-blue/10 text-brand-accent border border-brand-blue/20"
                                    : "bg-its-gold/10 text-its-gold border border-its-gold/20"
                                    }`}
                            >
                                <span className="material-symbols-outlined text-4xl">
                                    {dimension.icon}
                                </span>
                            </div>
                            <div>
                                <span
                                    className={`uppercase tracking-widest font-bold text-xs ${dimension.type === "soft" ? "text-brand-blue" : "text-its-gold"
                                        }`}
                                >
                                    {dimension.type} Skill
                                </span>
                                <h1 className="text-4xl md:text-6xl font-bold font-heading mt-1 leading-tight">
                                    {dimension.title}
                                </h1>
                            </div>
                        </div>

                        <p className="text-xl text-slate-300 leading-relaxed mb-8 font-light">
                            {dimension.longDescription}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-12">
                            <Link
                                href={dimension.assessmentLink}
                                className={`px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg hover:scale-105 ${dimension.type === "soft"
                                    ? "bg-brand-blue hover:bg-brand-accent text-white hover:text-brand-blue shadow-brand-blue/20"
                                    : "bg-its-gold hover:bg-white text-slate-900 hover:text-its-gold shadow-its-gold/20"
                                    }`}
                            >
                                <span>Mulai Assessment</span>
                                <span className="material-symbols-outlined">quiz</span>
                            </Link>
                        </div>

                        {/* Validasi Ilmiah Section - Specific to this dimension */}
                        <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-brand-accent">verified</span>
                                Validasi Riset
                            </h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Reliabilitas (Alpha)</p>
                                    <p className="text-3xl font-bold text-white">{dimension.research.psychometricProperties.alpha}</p>
                                    <p className="text-xs text-green-400 mt-1">Excellent Reliability</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Validitas (CFI)</p>
                                    <p className="text-3xl font-bold text-white">{dimension.research.psychometricProperties.cfi || "N/A"}</p>
                                    <p className="text-xs text-green-400 mt-1">Strong Fit</p>
                                </div>
                                <div className="col-span-2 pt-4 border-t border-white/5">
                                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Norma Mahasiswa</p>
                                    <div className="flex items-end gap-3">
                                        <p className="text-2xl font-bold text-white">Mean: {dimension.research.normativeData.mean}</p>
                                        <p className="text-sm text-slate-400 mb-1">(SD: {dimension.research.normativeData.sd})</p>
                                    </div>
                                    <p className="text-sm text-slate-300 mt-2 italic">"{dimension.research.normativeData.interpretation}"</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Research Details & Modules */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="space-y-6"
                    >
                        {/* Key Findings Card */}
                        <div className="glass-card p-8 rounded-3xl border border-white/10 bg-slate-800/50 backdrop-blur-md">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                                <span className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                                    <span className="material-symbols-outlined">lightbulb</span>
                                </span>
                                Temuan Kunci Riset
                            </h3>
                            <ul className="space-y-4">
                                {dimension.research.keyFindings.map((finding, idx) => (
                                    <li key={idx} className="flex gap-4 items-start">
                                        <span className="text-indigo-400 font-bold text-lg mt-[-2px]">•</span>
                                        <p className="text-slate-300 text-sm leading-relaxed">{finding}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Modules Card */}
                        <div className="glass-card p-8 rounded-3xl border border-white/10 bg-slate-800/50 backdrop-blur-md">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                                <span className="p-2 rounded-lg bg-pink-500/20 text-pink-400">
                                    <span className="material-symbols-outlined">library_books</span>
                                </span>
                                Kurikulum Pengembangan
                            </h3>
                            <div className="space-y-3">
                                {dimension.modules.map((module, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 cursor-pointer group"
                                    >
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs text-slate-300 group-hover:bg-brand-blue group-hover:text-white transition-colors">
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-sm text-white group-hover:text-brand-accent transition-colors">
                                                {module}
                                            </h4>
                                        </div>
                                        <span className="material-symbols-outlined text-slate-500 group-hover:text-white text-sm">
                                            arrow_forward_ios
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 rounded-3xl bg-gradient-to-br from-brand-blue/20 to-transparent border border-brand-blue/20 text-center">
                            <p className="text-sm text-slate-300 mb-4">Siap untuk mengetahui profil {dimension.title} Anda?</p>
                            <Link href={dimension.assessmentLink} className="text-brand-accent font-bold hover:underline">
                                Ambil Assessment Sekarang &rarr;
                            </Link>
                        </div>

                    </motion.div>
                </div>
            </div>
        </div>
    );
}
