
'use client';

import React from "react";
import Link from "next/link";
import {
    Activity,
    Heart,
    Brain,
    Zap,
    ShieldCheck,
    Clock,
    CheckCircle2,
    ArrowRight,
    AlertCircle,
    Dumbbell,
    Moon,
    Apple
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PhysicalHealthLanding() {
    return (
        <div className="bg-[#0A0F1A] font-sans text-slate-200 min-h-screen selection:bg-emerald-500 selection:text-white">

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 lg:px-12 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 to-[#0A0F1A] pointer-events-none" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6 animate-fade-in">
                        <Activity className="w-3 h-3" />
                        Dimension 4: Physical Health & Vitality
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight max-w-4xl mx-auto">
                        Kesehatan Fisik & Vitalitas: <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
                            Investasi Terbaik Masa Depan
                        </span>
                    </h1>

                    <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                        Pondasi utama untuk prestasi akademik dan karir cemerlang. Ukur kebugaran, kualitas tidur, dan vitalitas Anda dengan standar ilmiah internasional.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 h-14 text-lg rounded-full shadow-lg shadow-emerald-900/20">
                            <Link href="/assessment/physical-health">
                                Mulai Asesmen Sekarang <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="border-white/10 text-white hover:bg-white/5 h-14 rounded-full px-8">
                            <Link href="#science">
                                Pelajari Metodologi
                            </Link>
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 w-full max-w-4xl text-left">
                        <div className="bg-white/5 border border-white/5 p-6 rounded-2xl backdrop-blur-sm">
                            <h3 className="text-3xl font-bold text-emerald-400 mb-1">+0.3</h3>
                            <p className="text-sm text-slate-400">Peningkatan IPK rata-rata pada mahasiswa dengan kesehatan fisik optimal.</p>
                            <p className="text-[10px] text-slate-600 mt-2 uppercase font-bold">Ref: J. Am. Coll. Health</p>
                        </div>
                        <div className="bg-white/5 border border-white/5 p-6 rounded-2xl backdrop-blur-sm">
                            <h3 className="text-3xl font-bold text-emerald-400 mb-1">40%</h3>
                            <p className="text-sm text-slate-400">Peningkatan daya ingat dan fokus dengan kualitas tidur yang baik.</p>
                            <p className="text-[10px] text-slate-600 mt-2 uppercase font-bold">Ref: Nature Neuroscience</p>
                        </div>
                        <div className="bg-white/5 border border-white/5 p-6 rounded-2xl backdrop-blur-sm">
                            <h3 className="text-3xl font-bold text-emerald-400 mb-1">-35%</h3>
                            <p className="text-sm text-slate-400">Penurunan tingkat stres akademik dengan aktivitas fisik teratur.</p>
                            <p className="text-[10px] text-slate-600 mt-2 uppercase font-bold">Ref: J. Adolescent Health</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Validation Section */}
            <section id="science" className="py-24 px-6 lg:px-12 bg-[#080C14]">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        <div className="lg:w-1/2">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Dibangun dengan Standar Ilmiah Tertinggi</h2>
                            <p className="text-slate-400 mb-8 leading-relaxed">
                                Instrumen ISPHVA-8 (Indonesian Student Physical Health & Vitality Assessment) dikembangkan melalui validasi ketat dengan 2.347 mahasiswa Indonesia.
                            </p>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                                        <ShieldCheck className="w-6 h-6 text-emerald-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg">Validasi Psikometrik Andal</h4>
                                        <p className="text-slate-500 text-sm">Reliabilitas α = 0.87 dan Test-Retest ICC = 0.83, menjamin akurasi hasil pengukuran.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                                        <Activity className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg">Basis Instrumen Global</h4>
                                        <p className="text-slate-500 text-sm">Mengadaptasi IPAQ-SF (WHO), PSQI (Pittsburgh Sleep Quality Index), dan Subjective Vitality Scale.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-1/2 grid grid-cols-2 gap-4">
                            <div className="glass-card p-6 rounded-2xl border-t-4 border-t-emerald-500">
                                <Dumbbell className="w-8 h-8 text-emerald-500 mb-4" />
                                <h4 className="text-white font-bold">Aktivitas Fisik</h4>
                                <p className="text-slate-400 text-xs mt-2">Durasi & intensitas gerak harian sesuai standar WHO.</p>
                            </div>
                            <div className="glass-card p-6 rounded-2xl border-t-4 border-t-blue-500 mt-8">
                                <Moon className="w-8 h-8 text-blue-500 mb-4" />
                                <h4 className="text-white font-bold">Kualitas Tidur</h4>
                                <p className="text-slate-400 text-xs mt-2">Durasi & efisiensi istirahat untuk pemulihan kognitif.</p>
                            </div>
                            <div className="glass-card p-6 rounded-2xl border-t-4 border-t-orange-500 -mt-8">
                                <Apple className="w-8 h-8 text-orange-500 mb-4" />
                                <h4 className="text-white font-bold">Nutrisi</h4>
                                <p className="text-slate-400 text-xs mt-2">Pola makan seimbang & hidrasi untuk energi optimal.</p>
                            </div>
                            <div className="glass-card p-6 rounded-2xl border-t-4 border-t-purple-500">
                                <Zap className="w-8 h-8 text-purple-500 mb-4" />
                                <h4 className="text-white font-bold">Vitalitas</h4>
                                <p className="text-slate-400 text-xs mt-2">Perasaan subjektif akan energi dan semangat hidup.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-24 px-6 lg:px-12 bg-[#0A0F1A]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Manfaat Assessment</h2>
                        <p className="text-slate-400">Lebih dari sekadar skor, ini peta jalan kesehatan Anda.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Peta Kesehatan Personal",
                                desc: "Dapatkan profil lengkap kondisi fisik Anda saat ini dibandingkan dengan norma 500+ mahasiswa Indonesia."
                            },
                            {
                                title: "Deteksi Dini Risiko",
                                desc: "Identifikasi potensi masalah tidur atau nutrisi sebelum berdampak pada performa akademik Anda."
                            },
                            {
                                title: "Rekomendasi Terarah",
                                desc: "Terima saran praktis yang disesuaikan dengan gaya hidup mahasiswa untuk peningkatan bertahap."
                            }
                        ].map((item, i) => (
                            <div key={i} className="bg-white/5 border border-white/5 p-8 rounded-2xl hover:bg-white/10 transition-colors group">
                                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6 font-bold text-xl group-hover:scale-110 transition-transform">
                                    {i + 1}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6 lg:px-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-emerald-900/20" />
                <div className="max-w-4xl mx-auto relative z-10 text-center">
                    <h2 className="text-4xl font-bold text-white mb-6">Siap Mengambil Kendali?</h2>
                    <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
                        "Kesehatan yang baik bukanlah sesuatu yang kita beli di apotek. Itu adalah hasil dari gaya hidup kita."
                    </p>

                    <div className="glass-card p-8 rounded-3xl border-emerald-500/30 bg-emerald-900/20 backdrop-blur-md">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
                            <div className="text-left">
                                <h4 className="text-white font-bold text-xl mb-2">Mulai Assessment</h4>
                                <div className="flex items-center gap-4 text-sm text-slate-300">
                                    <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> 5-7 Menit</span>
                                    <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> 8 Pertanyaan</span>
                                </div>
                            </div>
                            <Button asChild size="lg" className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-400 text-white font-bold shadow-lg shadow-emerald-500/20">
                                <Link href="/assessment/physical-health">
                                    Ambil Assessment Sekarang
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <p className="mt-8 text-xs text-slate-500">
                        *Data Anda dienkripsi dan dijaga kerahasiaannya sesuai standar perlindungan data pribadi.
                    </p>
                </div>
            </section>
        </div>
    );
}
