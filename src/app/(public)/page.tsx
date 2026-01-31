"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import {
    Activity,
    Menu,
    Award,
    Zap,
    PlayCircle,
    GraduationCap,
    ShieldCheck,
    Workflow,
    Frown,
    FolderX,
    BatteryWarning,
    Radar,
    Puzzle,
    Rocket,
    Brain,
    Clock,
    DollarSign,
    Dumbbell,
    Users,
    Sparkles,
    Scale,
    Flower2,
    Leaf,
    HelpCircle,
    CheckCircle,
    Landmark,
    Building2,
    MapPin,
    Phone,
    Mail,
    Database,
    Code,
    Blocks,
    User,
    UserPlus,
    UserCog,
    UsersRound,
    GraduationCap as AlumniIcon,
    Radio,
    FileText,
    Calendar,
    Microscope,
    Lightbulb,
    Target,
    HeadphonesIcon,
    Newspaper,
    ChevronDown,
    ExternalLink,
    TrendingUp,
    Globe
} from "lucide-react";
import { cn } from "@/lib/utils";
import HeroVideo from '@/components/HeroVideo';
import { ITS_FACULTIES } from "@/lib/its_programs";
import { ITS_MAIN_NAV, ITS_SECONDARY_NAV, ITS_STATS } from "@/lib/its_website_structure";

export default function LandingPage() {
    return (
        <Suspense fallback={null}>
            <LandingContent />
        </Suspense>
    );
}

function LandingContent() {
    return (
        <div className="bg-[#0A0F1A] font-sans text-slate-200 antialiased selection:bg-[#135bec] selection:text-white overflow-x-hidden min-h-screen flex flex-col">
            {/* Header is now handled by (public)/layout.tsx */}
            <main className="flex-1">

                {/* Hero Section */}
                <HeroVideo />

                {/* ITS Stats Bar */}
                <section className="bg-gradient-to-r from-[#013880] to-[#135bec] py-6 px-6 lg:px-12">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 text-center">
                            <div>
                                <div className="text-2xl font-bold text-white">{ITS_STATS.faculties}</div>
                                <div className="text-xs text-white/70">Fakultas</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">{ITS_STATS.studyPrograms}</div>
                                <div className="text-xs text-white/70">Program Studi</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">30K+</div>
                                <div className="text-xs text-white/70">Mahasiswa</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">1.5K+</div>
                                <div className="text-xs text-white/70">Dosen</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">100K+</div>
                                <div className="text-xs text-white/70">Alumni</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">5K+</div>
                                <div className="text-xs text-white/70">Publikasi</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">200+</div>
                                <div className="text-xs text-white/70">Paten</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">300+</div>
                                <div className="text-xs text-white/70">Mitra Global</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pain Points Section */}
                <section className="py-20 px-6 lg:px-12 bg-black relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#013880]/10 pointer-events-none"></div>
                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
                            <div className="max-w-2xl">
                                <h2 className="text-3xl font-bold font-heading text-white mb-2">The Reality Gap</h2>
                                <p className="text-slate-400">Mengapa mahasiswa dengan IPK tinggi sering gagal di dunia nyata?</p>
                            </div>
                            <div className="hidden md:block w-32 h-1 bg-white/10 rounded-full"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="dark-glass-card p-8 rounded-2xl border-l-4 border-l-red-500 hover:border-l-red-400 transition-all group">
                                <div className="size-12 rounded-lg bg-red-500/10 flex items-center justify-center mb-6 text-red-500">
                                    <Frown className="w-8 h-8 group-hover:animate-pulse" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Academic Tunnel Vision</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">Fokus hanya pada teori dan nilai ujian, tanpa memahami aplikasi praktis di industri.</p>
                            </div>
                            <div className="dark-glass-card p-8 rounded-2xl border-l-4 border-l-orange-500 hover:border-l-orange-400 transition-all group">
                                <div className="size-12 rounded-lg bg-orange-500/10 flex items-center justify-center mb-6 text-orange-500">
                                    <FolderX className="w-8 h-8 group-hover:animate-pulse" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">No Portfolio, No Proof</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">Lulus tanpa proyek nyata yang bisa ditunjukkan ke calon employer.</p>
                            </div>
                            <div className="dark-glass-card p-8 rounded-2xl border-l-4 border-l-yellow-500 hover:border-l-yellow-400 transition-all group">
                                <div className="size-12 rounded-lg bg-yellow-500/10 flex items-center justify-center mb-6 text-yellow-500">
                                    <BatteryWarning className="w-8 h-8 group-hover:animate-pulse" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Wrong Skill Priority</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">Belajar hal yang outdated sementara industri sudah berubah.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* === PROGRAM STUDI SECTION - 37 Programs === */}
                <section id="programs" className="py-24 px-6 lg:px-12 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#013880]/5 to-transparent pointer-events-none"></div>
                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 bg-[#FFD700]/10 text-[#FFD700] px-4 py-2 rounded-full text-sm font-medium mb-6">
                                <Landmark className="w-4 h-4" />
                                Fakultas & Program Studi
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold font-heading text-white mb-4">
                                37 Program Sarjana Unggulan
                            </h2>
                            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                                Pilih jalur karir Anda dari 7 Fakultas terdepan di Institut Teknologi Sepuluh Nopember
                            </p>
                        </div>

                        {/* Faculties Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                            {ITS_FACULTIES.map((faculty, index) => (
                                <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#135bec]/50 transition-all group">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="size-12 rounded-xl bg-gradient-to-br from-[#013880] to-[#135bec] flex items-center justify-center text-white font-bold text-lg">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-white group-hover:text-[#00d4ff] transition-colors">
                                                {faculty.name}
                                            </h3>
                                            <p className="text-sm text-slate-400">Fakultas Ke-{index + 1}</p>
                                        </div>
                                        <span className="text-xs bg-[#FFD700]/20 text-[#FFD700] px-2 py-1 rounded">
                                            {faculty.programs.length} Program
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {faculty.programs.map((program, pIndex) => (
                                            <div key={pIndex} className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors p-2 rounded hover:bg-white/5">
                                                <GraduationCap className="w-4 h-4 text-[#135bec]" />
                                                <span>{program}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <a
                                        href="https://www.its.ac.id"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-4 inline-flex items-center gap-2 text-sm text-[#00d4ff] hover:text-[#00d4ff]/80 transition-colors"
                                    >
                                        <ExternalLink className="w-3 h-3" />
                                        Kunjungi Website Fakultas
                                    </a>
                                </div>
                            ))}
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-[#013880]/20 border border-[#013880]/50 rounded-xl p-6 text-center">
                                <div className="text-3xl font-bold text-white mb-1">37</div>
                                <div className="text-sm text-slate-400">Program Studi</div>
                            </div>
                            <div className="bg-[#013880]/20 border border-[#013880]/50 rounded-xl p-6 text-center">
                                <div className="text-3xl font-bold text-white mb-1">7</div>
                                <div className="text-sm text-slate-400">Fakultas</div>
                            </div>
                            <div className="bg-[#013880]/20 border border-[#013880]/50 rounded-xl p-6 text-center">
                                <div className="text-3xl font-bold text-white mb-1">144</div>
                                <div className="text-sm text-slate-400">Total SKS</div>
                            </div>
                            <div className="bg-[#013880]/20 border border-[#013880]/50 rounded-xl p-6 text-center">
                                <div className="text-3xl font-bold text-white mb-1">4</div>
                                <div className="text-sm text-slate-400">Tahun Studi</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Navigation Quick Links */}
                <section className="py-16 px-6 lg:px-12 bg-gradient-to-b from-black to-[#0A0F1A]">
                    <div className="max-w-7xl mx-auto">
                        <h3 className="text-2xl font-bold text-white mb-8 text-center">Jelajahi ITS</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <a href="https://www.its.ac.id/admission/" target="_blank" className="group">
                                <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center hover:border-[#135bec]/50 hover:bg-[#135bec]/10 transition-all">
                                    <FileText className="w-8 h-8 text-[#00d4ff] mx-auto mb-3 group-hover:scale-110 transition-transform" />
                                    <h4 className="text-white font-medium mb-1">Pendaftaran</h4>
                                    <p className="text-xs text-slate-400">Info PMB & Jalur Masuk</p>
                                </div>
                            </a>
                            <a href="https://www.its.ac.id/beasiswa/" target="_blank" className="group">
                                <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center hover:border-[#FFD700]/50 hover:bg-[#FFD700]/10 transition-all">
                                    <Award className="w-8 h-8 text-[#FFD700] mx-auto mb-3 group-hover:scale-110 transition-transform" />
                                    <h4 className="text-white font-medium mb-1">Beasiswa</h4>
                                    <p className="text-xs text-slate-400">Info Beasiswa ITS</p>
                                </div>
                            </a>
                            <a href="https://www.its.ac.id/riset/" target="_blank" className="group">
                                <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center hover:border-[#135bec]/50 hover:bg-[#135bec]/10 transition-all">
                                    <Microscope className="w-8 h-8 text-[#00d4ff] mx-auto mb-3 group-hover:scale-110 transition-transform" />
                                    <h4 className="text-white font-medium mb-1">Riset</h4>
                                    <p className="text-xs text-slate-400">Penelitian & Inovasi</p>
                                </div>
                            </a>
                            <a href="https://www.its.ac.id/inovasi/" target="_blank" className="group">
                                <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center hover:border-[#135bec]/50 hover:bg-[#135bec]/10 transition-all">
                                    <Lightbulb className="w-8 h-8 text-[#00d4ff] mx-auto mb-3 group-hover:scale-110 transition-transform" />
                                    <h4 className="text-white font-medium mb-1">Inovasi</h4>
                                    <p className="text-xs text-slate-400">Startup & Technopreneur</p>
                                </div>
                            </a>
                        </div>
                    </div>
                </section>

                {/* 9 Dimensions Section */}
                <section id="dimensions" className="py-24 px-6 lg:px-12 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#135bec]/5 to-transparent pointer-events-none"></div>
                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 bg-[#135bec]/10 text-[#00d4ff] px-4 py-2 rounded-full text-sm font-medium mb-6">
                                <Radar className="w-4 h-4" />
                                9 Dimensions
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold font-heading text-white mb-4">
                                Holistic Talent Development
                            </h2>
                            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                                Mengembangkan 9 dimensi kompetensi untuk menciptakan talenta unggul yang siap bersaing global
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { icon: Brain, title: "Cognitive Intelligence", desc: "Berpikir kritis, analitis, dan problem-solving", color: "#135bec" },
                                { icon: Users, title: "Social Intelligence", desc: "Emotional intelligence dan interpersonal skills", color: "#00d4ff" },
                                { icon: Rocket, title: "Execution Excellence", desc: "Delivery, project management, getting things done", color: "#FFD700" },
                                { icon: Zap, title: "Technical Mastery", desc: "Hard skills spesifik bidang keahlian", color: "#135bec" },
                                { icon: Dumbbell, title: "Physical Vitality", desc: "Energi, kesehatan, dan well-being", color: "#00d4ff" },
                                { icon: Scale, title: "Ethical Integrity", desc: "Moral compass dan professional ethics", color: "#FFD700" },
                                { icon: Globe, title: "Global Readiness", desc: "Cross-cultural competence dan bahasa", color: "#135bec" },
                                { icon: TrendingUp, title: "Adaptability", desc: "Learning agility dan resilience", color: "#00d4ff" },
                                { icon: Sparkles, title: "Creative Innovation", desc: "Original thinking dan ideation", color: "#FFD700" },
                            ].map((dim, i) => (
                                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/30 transition-all group">
                                    <div className="size-12 rounded-xl flex items-center justify-center mb-4 transition-all group-hover:scale-110" style={{ backgroundColor: `${dim.color}20` }}>
                                        <dim.icon className="w-6 h-6" style={{ color: dim.color }} />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">{dim.title}</h3>
                                    <p className="text-slate-400 text-sm">{dim.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 px-6 lg:px-12">
                    <div className="max-w-5xl mx-auto text-center">
                        <h2 className="text-4xl md:text-6xl font-bold font-heading text-white mb-6">
                            Siap untuk <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#135bec] to-[#00d4ff]">Level Up?</span>
                        </h2>
                        <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
                            Bergabung dengan ribuan mahasiswa ITS yang sedang membangun masa depan mereka melalui pembelajaran berbasis proyek nyata
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/auth/login" className="inline-flex items-center justify-center gap-2 bg-[#135bec] hover:bg-[#135bec]/90 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg shadow-[#135bec]/30 hover:shadow-[#135bec]/50">
                                <Rocket className="w-5 h-5" />
                                Mulai Perjalanan Anda
                            </Link>
                            <a href="https://www.its.ac.id/admission/" target="_blank" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full font-bold text-lg transition-all border border-white/20">
                                <ExternalLink className="w-5 h-5" />
                                Info Pendaftaran ITS
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-black border-t border-white/10 py-16 px-6 lg:px-12">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                        {/* Brand */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#013880] to-[#135bec]">
                                    <Activity className="text-white w-6 h-6" />
                                </div>
                                <div>
                                    <span className="text-lg font-bold text-white">PPSDM KMITS</span>
                                    <span className="block text-xs text-[#FFD700]">ITS Surabaya</span>
                                </div>
                            </div>
                            <p className="text-slate-400 text-sm mb-4">
                                Learning Management System untuk pengembangan talenta holistik berbasis project-based learning.
                            </p>
                            <div className="flex gap-4">
                                <a href="https://www.its.ac.id" target="_blank" className="text-slate-400 hover:text-white transition-colors">
                                    <Globe className="w-5 h-5" />
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-white font-bold mb-4">Tautan Cepat ITS</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="https://www.its.ac.id/admission/" target="_blank" className="text-slate-400 hover:text-[#00d4ff] transition-colors">Pendaftaran</a></li>
                                <li><a href="https://www.its.ac.id/beasiswa/" target="_blank" className="text-slate-400 hover:text-[#00d4ff] transition-colors">Beasiswa</a></li>
                                <li><a href="https://www.its.ac.id/news/" target="_blank" className="text-slate-400 hover:text-[#00d4ff] transition-colors">Berita</a></li>
                                <li><a href="https://my.its.ac.id/" target="_blank" className="text-slate-400 hover:text-[#00d4ff] transition-colors">myITS Portal</a></li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="text-white font-bold mb-4">Kontak</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-[#135bec]" />
                                    Jl. Raya ITS, Sukolilo, Surabaya 60111
                                </li>
                                <li className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-[#135bec]" />
                                    +62 31 599 5111
                                </li>
                                <li className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-[#135bec]" />
                                    info@its.ac.id
                                </li>
                            </ul>
                        </div>

                        {/* Stats */}
                        <div>
                            <h4 className="text-white font-bold mb-4">Statistik</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 rounded-lg p-3 text-center">
                                    <div className="text-xl font-bold text-[#FFD700]">30K+</div>
                                    <div className="text-xs text-slate-400">Mahasiswa</div>
                                </div>
                                <div className="bg-white/5 rounded-lg p-3 text-center">
                                    <div className="text-xl font-bold text-[#FFD700]">7</div>
                                    <div className="text-xs text-slate-400">Fakultas</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-slate-500 text-sm">
                            © {new Date().getFullYear()} PPSDM KMITS - Institut Teknologi Sepuluh Nopember
                        </p>
                        <p className="text-slate-600 text-xs">
                            Dikembangkan untuk Indonesia Emas 2045
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
