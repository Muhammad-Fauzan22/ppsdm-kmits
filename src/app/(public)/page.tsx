"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { DimensionRadarChart } from '@/components/Charts';

export default function LandingPage() {
    // 9 Dimensions Data (Light Theme Colors)
    const dimensions = [
        {
            title: "Leadership",
            icon: "groups",
            desc: "Cultivating the ability to guide, inspire, and influence others towards shared goals.",
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            title: "Ethics",
            icon: "balance",
            desc: "Building moral character and integrity as the foundation of professional life.",
            color: "text-red-600",
            bg: "bg-red-50"
        },
        {
            title: "Technology",
            icon: "memory",
            desc: "Mastering digital tools and maintaining fluency in emerging tech landscapes.",
            color: "text-cyan-600",
            bg: "bg-cyan-50"
        },
        {
            title: "Global Mindset",
            icon: "public",
            desc: "Understanding diverse cultures and operating effectively in international contexts.",
            color: "text-green-600",
            bg: "bg-green-50"
        },
        {
            title: "Critical Thinking",
            icon: "psychology",
            desc: "Analyzing information objectively to form reasoned judgments and solve problems.",
            color: "text-purple-600",
            bg: "bg-purple-50"
        },
        {
            title: "Creativity",
            icon: "lightbulb",
            desc: "Generating novel ideas and innovative solutions to complex challenges.",
            color: "text-yellow-600",
            bg: "bg-yellow-50"
        },
        {
            title: "Collaboration",
            icon: "handshake",
            desc: "Working synergistically within teams to achieve collective success.",
            color: "text-orange-600",
            bg: "bg-orange-50"
        },
        {
            title: "Communication",
            icon: "chat",
            desc: "Articulating thoughts clearly and listening effectively across various mediums.",
            color: "text-teal-600",
            bg: "bg-teal-50"
        },
        {
            title: "Adaptability",
            icon: "sync",
            desc: "Maintaining resilience and flexibility in the face of rapid change.",
            color: "text-pink-600",
            bg: "bg-pink-50"
        }
    ];

    // Radar Chart Data
    const radarData = [
        { dimension: 'Leadership', score: 85, fullMark: 100 },
        { dimension: 'Ethics', score: 90, fullMark: 100 },
        { dimension: 'Technology', score: 75, fullMark: 100 },
        { dimension: 'Global', score: 60, fullMark: 100 },
        { dimension: 'Critical', score: 80, fullMark: 100 },
        { dimension: 'Creativity', score: 70, fullMark: 100 },
        { dimension: 'Collab', score: 85, fullMark: 100 },
        { dimension: 'Comm.', score: 75, fullMark: 100 },
        { dimension: 'Adapt.', score: 80, fullMark: 100 },
    ];

    return (
        <div className="bg-slate-50 text-slate-900 font-sans min-h-screen selection:bg-blue-100 selection:text-blue-900">
            {/* 1. Header (Light Variant) */}
            <Header variant="light" />

            {/* 2. Hero Section */}
            <section className="relative pt-20 pb-20 lg:pt-32 lg:pb-40 overflow-hidden bg-white">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-70"></div>

                <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center relative z-10">
                    <p className="text-blue-600 font-bold uppercase tracking-wider text-sm mb-4">
                        Original PPSDM ITS
                    </p>

                    <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl mb-6 leading-tight">
                        Membangun Insan <br />
                        <span className="text-blue-600">
                            ITS Seutuhnya
                        </span>
                    </h1>

                    <p className="mt-6 text-lg leading-8 text-slate-600 max-w-2xl mx-auto">
                        Portal pengembangan diri terintegrasi untuk mahasiswa Institut Teknologi Sepuluh Nopember. Jelajahi potensi diri Anda melalui 9 dimensi pengembangan komprehensif.
                    </p>

                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/auth/register"
                            className="w-full sm:w-auto rounded-lg bg-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all hover:-translate-y-0.5"
                        >
                            Mulai Perjalanan Anda &rarr;
                        </Link>
                        <Link
                            href="#features"
                            className="w-full sm:w-auto rounded-lg bg-white px-8 py-3.5 text-sm font-bold text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all hover:-translate-y-0.5 shadow-sm"
                        >
                            Pelajari Lebih Lanjut
                        </Link>
                    </div>

                    {/* Hero Image / Illustration Placeholder */}
                    <div className="mt-16 relative mx-auto max-w-5xl rounded-2xl overflow-hidden shadow-2xl border border-slate-200 aspect-[16/9] bg-slate-100">
                        {/* Setup for future hero image like standard student photo */}
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-200 text-slate-400">
                            <span className="material-symbols-outlined text-6xl">image</span>
                            <span className="ml-2 font-medium">Hero Image Area</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. 9 Dimensions Grid */}
            <section id="features" className="py-24 bg-white">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">9 Dimensi Pengembangan</h2>
                        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                            Kerangka kerja holistik untuk membentuk karakter mahasiswa yang unggul, adaptif, dan siap menghadapi tantangan global.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {dimensions.map((dim, index) => (
                            <div key={index} className="group relative bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                                <div className={`size-12 rounded-xl ${dim.bg} flex items-center justify-center mb-6`}>
                                    <span className={`material-symbols-outlined text-2xl ${dim.color}`}>{dim.icon}</span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-3">{dim.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{dim.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Visualization & Radar Chart */}
            <section className="py-24 bg-slate-50">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl border border-slate-100 flex flex-col lg:flex-row gap-12 items-center">

                        {/* Text Content */}
                        <div className="flex-1">
                            <div className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wide mb-4">
                                Keunggulan Integratif
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-6">
                                Visualisasikan Potensi Anda
                            </h2>
                            <p className="text-lg text-slate-600 mb-8">
                                Lihat bagaimana keseimbangan 9 dimensi membentuk profil unik Anda. Platform kami membantu Anda mengidentifikasi area kekuatan dan peluang pengembangan.
                            </p>

                            <ul className="space-y-6">
                                <li className="flex gap-4">
                                    <div className="size-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-blue-600">analytics</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">Analisis Mendalam</h4>
                                        <p className="text-sm text-slate-500 mt-1">Data real-time tentang perkembangan Anda.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="size-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-blue-600">verified</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">Rekomendasi Personal</h4>
                                        <p className="text-sm text-slate-500 mt-1">Saran kegiatan sesuai kebutuhan Anda.</p>
                                    </div>
                                </li>
                            </ul>

                            <div className="mt-10">
                                <Link href="/auth/register" className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                                    Coba Simulasi Profil &rarr;
                                </Link>
                            </div>
                        </div>

                        {/* Chart Preview */}
                        <div className="flex-1 w-full flex justify-center">
                            <div className="bg-slate-50 rounded-2xl p-6 w-full max-w-md border border-slate-200/60 shadow-inner">
                                <DimensionRadarChart data={radarData} color="#2563EB" /> {/* Blue-600 */}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Testimoni Mahasiswa (Light) */}
            <section className="py-24 bg-white">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-12">Apa Kata Mahasiswa</h2>
                    <p className="text-slate-600 max-w-2xl mx-auto -mt-8 mb-16">Mereka yang telah merasakan dampak positif pengembangan diri.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 text-left">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="size-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">DL</div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm">Devi Lestari</h4>
                                    <p className="text-xs text-slate-500">Statistika '22</p>
                                </div>
                            </div>
                            <p className="text-sm text-slate-600 italic">"Saya menemukan passion public speaking lewat workshop komunikasi. Sangat membantu!"</p>
                        </div>
                        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 text-left">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="size-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm">RP</div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm">Rudi Santoso</h4>
                                    <p className="text-xs text-slate-500">Teknik Informatika '20</p>
                                </div>
                            </div>
                            <p className="text-sm text-slate-600 italic">"Program ini menguatkan soft skill saya. Sangat berharga untuk persiapan dunia kerja."</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer (Dark Accent) */}
            <footer className="bg-[#0f172a] text-white py-16 border-t border-slate-800">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="size-8 rounded bg-blue-600 flex items-center justify-center text-white">
                                <span className="material-symbols-outlined text-lg">school</span>
                            </div>
                            <h3 className="text-xl font-bold tracking-tight">PPSDM KMM</h3>
                        </div>
                        <p className="text-sm text-slate-400 mb-2 max-w-sm">Membangun karakter unggul mahasiswa ITS melalui pengembangan diri yang terintegrasi dan terukur.</p>

                        <div className="mt-8 flex gap-4">
                            <a href="#" className="size-8 flex items-center justify-center rounded bg-white/5 hover:bg-white/10 transition-colors"><span className="material-symbols-outlined text-sm">share</span></a>
                            <a href="#" className="size-8 flex items-center justify-center rounded bg-white/5 hover:bg-white/10 transition-colors"><span className="material-symbols-outlined text-sm">play_arrow</span></a>
                            <a href="#" className="size-8 flex items-center justify-center rounded bg-white/5 hover:bg-white/10 transition-colors"><span className="material-symbols-outlined text-sm">mail</span></a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6">Tautan Cepat</h4>
                        <ul className="space-y-3 text-sm text-slate-400">
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Beranda</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Tentang Kami</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">9 Dimensi</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Berita & Artikel</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">FAQ</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6">Hubungi Kami</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li className="flex gap-3">
                                <span className="material-symbols-outlined text-blue-500 shrink-0">location_on</span>
                                <span>Gedung Rektorat Lt. 1, Kampus ITS Sukolilo, Surabaya 60111</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="material-symbols-outlined text-blue-500 shrink-0">call</span>
                                <span>(031) 5994251</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="material-symbols-outlined text-blue-500 shrink-0">email</span>
                                <span>ppsdm@its.ac.id</span>
                            </li>
                        </ul>

                        <div className="mt-8">
                            <h5 className="font-bold text-white text-xs mb-2">Dapatkan Informasi Terbaru</h5>
                            <p className="text-xs text-slate-500 mb-3">Berlangganan newsletter kami untuk update kegiatan.</p>
                            <div className="flex gap-2">
                                <input type="email" placeholder="Email Anda" className="bg-white/5 border border-white/10 rounded px-3 py-2 text-xs w-full focus:outline-none focus:border-blue-500" />
                                <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-2 rounded font-bold transition-colors">Langganan</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
                    <p>&copy; 2024 PPSDM KMM - Institut Teknologi Sepuluh Nopember. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-slate-400">Kebijakan Privasi</a>
                        <a href="#" className="hover:text-slate-400">Syarat & Ketentuan</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
