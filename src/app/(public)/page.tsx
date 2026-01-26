"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { DimensionRadarChart } from '@/components/Charts';

export default function LandingPage() {
    // 9 Dimensions Data
    const dimensions = [
        {
            title: "Leadership",
            icon: "groups",
            desc: "Cultivating the ability to guide, inspire, and influence others towards shared goals.",
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            title: "Ethics",
            icon: "balance",
            desc: "Building moral character and integrity as the foundation of professional life.",
            color: "text-red-500",
            bg: "bg-red-500/10"
        },
        {
            title: "Technology",
            icon: "memory", // or 'developer_mode'
            desc: "Mastering digital tools and maintaining fluency in emerging tech landscapes.",
            color: "text-cyan-500",
            bg: "bg-cyan-500/10"
        },
        {
            title: "Global Mindset",
            icon: "public",
            desc: "Understanding diverse cultures and operating effectively in international contexts.",
            color: "text-green-500",
            bg: "bg-green-500/10"
        },
        {
            title: "Critical Thinking",
            icon: "psychology",
            desc: "Analyzing information objectively to form reasoned judgments and solve problems.",
            color: "text-purple-500",
            bg: "bg-purple-500/10"
        },
        {
            title: "Creativity",
            icon: "lightbulb",
            desc: "Generating novel ideas and innovative solutions to complex challenges.",
            color: "text-yellow-500",
            bg: "bg-yellow-500/10"
        },
        {
            title: "Collaboration",
            icon: "handshake", // or 'connect_without_contact'
            desc: "Working synergistically within teams to achieve collective success.",
            color: "text-orange-500",
            bg: "bg-orange-500/10"
        },
        {
            title: "Communication",
            icon: "chat",
            desc: "Articulating thoughts clearly and listening effectively across various mediums.",
            color: "text-teal-500",
            bg: "bg-teal-500/10"
        },
        {
            title: "Adaptability",
            icon: "sync",
            desc: "Maintaining resilience and flexibility in the face of rapid change.",
            color: "text-pink-500",
            bg: "bg-pink-500/10"
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
        <div className="bg-[#020617] text-white font-sans min-h-screen selection:bg-blue-500/30">
            {/* 1. Header with Dark Variant */}
            <Header variant="dark" />

            {/* 2. Hero Section */}
            <section className="relative pt-20 pb-20 lg:pt-32 lg:pb-32 overflow-hidden bg-gradient-to-b from-[#020617] via-[#0B1120] to-[#020617]">
                {/* Background Glows */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] -z-10 animate-pulse-slow"></div>
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] -z-10"></div>

                <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm shadow-lg hover:border-white/20 transition-colors cursor-pointer">
                        <span className="flex size-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-xs font-medium tracking-wide text-gray-300 uppercase">Unveiling New Students 2024</span>
                    </div>

                    <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl mb-6 leading-[1.1]">
                        Membangun Insan <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-text-shimmer bg-[size:200%_auto]">
                            ITS Seutuhnya
                        </span>
                    </h1>

                    <p className="mt-6 text-lg leading-8 text-gray-400 max-w-2xl mx-auto font-light">
                        Empowering students through holistic development and structured mentorship. Join a community dedicated to excellence in every dimension.
                    </p>

                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/auth/register"
                            className="w-full sm:w-auto rounded-full bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-500 hover:shadow-blue-600/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all hover:-translate-y-0.5"
                        >
                            Mulai Perjalanan Anda &rarr;
                        </Link>
                        <Link
                            href="#features"
                            className="w-full sm:w-auto rounded-full bg-white/5 px-8 py-3.5 text-sm font-semibold text-white border border-white/10 hover:bg-white/10 transition-all hover:-translate-y-0.5 backdrop-blur-sm"
                        >
                            Pelajari Lebih Lanjut
                        </Link>
                    </div>
                </div>
            </section>

            {/* 3. 9 Dimensions Grid */}
            <section id="features" className="py-24 bg-[#0B1120]">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">9 Dimensions of Development</h2>
                        <p className="mt-4 text-lg text-gray-400 font-light">
                            Explore the core competencies fostered through our comprehensive programs designed to shape future leaders.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {dimensions.map((dim, index) => (
                            <div key={index} className="group relative bg-[#111827] p-6 rounded-xl border border-white/5 hover:border-white/10 transition-all hover:bg-[#162032]">
                                <div className={`size-12 rounded-lg ${dim.bg} flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300`}>
                                    <span className={`material-symbols-outlined text-2xl ${dim.color}`}>{dim.icon}</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{dim.title}</h3>
                                <p className="text-sm text-gray-400 leading-relaxed font-light">{dim.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Visualization & Radar Chart */}
            <section className="py-24 bg-[#020617] relative overflow-hidden">
                <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>

                <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Text Content */}
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">
                                Visualize Your <br />
                                <span className="text-blue-500">Growth Journey</span>
                            </h2>
                            <p className="text-lg text-gray-400 mb-8 font-light">
                                Track your progress across all 9 dimensions with our dynamic assessment tools. Identify strengths, uncover areas for improvement, and chart a personalized path to success.
                            </p>

                            <ul className="space-y-6">
                                <li className="flex gap-4">
                                    <div className="size-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-blue-500 text-sm">check</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">Real-time Analytics</h4>
                                        <p className="text-sm text-gray-500 mt-1">Get instant feedback as your developments milestones.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="size-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-blue-500 text-sm">check</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">Personalized Recommendations</h4>
                                        <p className="text-sm text-gray-500 mt-1">Receive curated program suggestions based on your profile.</p>
                                    </div>
                                </li>
                            </ul>

                            <div className="mt-10">
                                <Link href="/auth/register" className="inline-flex items-center text-sm font-semibold text-white border border-white/20 rounded-lg px-5 py-2.5 hover:bg-white/5 transition-colors">
                                    View Sample Report
                                </Link>
                            </div>
                        </div>

                        {/* Chart Preview Card */}
                        <div className="relative">
                            <div className="bg-[#111827] rounded-3xl p-8 border border-white/5 shadow-2xl relative overflow-hidden">
                                {/* Header */}
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Student Profile</p>
                                        <h3 className="text-2xl font-bold text-white mt-1">Mahasiswa ITS</h3>
                                    </div>
                                    <div className="size-10 rounded-full bg-white/5 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-gray-400">person</span>
                                    </div>
                                </div>

                                {/* Chart Component */}
                                <div className="h-[320px] w-full flex items-center justify-center -ml-4">
                                    <DimensionRadarChart data={radarData} color="#3B82F6" />
                                </div>

                                <div className="absolute bottom-6 right-6">
                                    <span className="text-xs font-medium text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full">Balanced Growth</span>
                                </div>
                            </div>

                            {/* Decorative Elements */}
                            <div className="absolute -top-10 -right-10 size-32 bg-blue-500/20 rounded-full blur-3xl -z-10"></div>
                            <div className="absolute -bottom-10 -left-10 size-32 bg-purple-500/20 rounded-full blur-3xl -z-10"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Student Voices */}
            <section className="py-24 bg-[#0B1120] border-t border-white/5">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight text-white">Student Voices</h2>
                        <p className="mt-2 text-gray-400 font-light">None so deaf as those that will not hear. Hear from those who have transformed their potential.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Testimonial 1 */}
                        <div className="bg-[#111827] p-8 rounded-2xl border border-white/5 relative">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="size-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold">IA</div>
                                <div>
                                    <h4 className="font-bold text-white text-sm">Isti Aminah</h4>
                                    <p className="text-xs text-gray-500">Arsitektur '20</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-300 italic">"PPSDM helped me balance my academic life with meaningful soft skill development."</p>
                        </div>
                        {/* Testimonial 2 */}
                        <div className="bg-[#111827] p-8 rounded-2xl border border-white/5 relative">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="size-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 font-bold">RP</div>
                                <div>
                                    <h4 className="font-bold text-white text-sm">Rizky Pratama</h4>
                                    <p className="text-xs text-gray-500">Teknik Mesin '21</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-300 italic">"The mentorship program connected me with alumni who guided my career path."</p>
                        </div>
                        {/* Testimonial 3 */}
                        <div className="bg-[#111827] p-8 rounded-2xl border border-white/5 relative">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="size-10 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-500 font-bold">DL</div>
                                <div>
                                    <h4 className="font-bold text-white text-sm">Devi Lestari</h4>
                                    <p className="text-xs text-gray-500">Statistika '22</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-300 italic">"I discovered my passion for public speaking through the communication workshops."</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#0f172a] text-white py-12 border-t border-white/5">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="size-8 rounded bg-white flex items-center justify-center text-[#013880]">
                                <span className="material-symbols-outlined">school</span>
                            </div>
                            <h3 className="text-xl font-bold">Institut Teknologi Sepuluh Nopember</h3>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">Kampus ITS Sukolilo, Surabaya 60111</p>
                        <p className="text-sm text-gray-400">Jawa Timur, Indonesia</p>
                        <p className="text-sm text-gray-400">Phone: +62-31-5994251</p>
                        <div className="mt-8 text-xs text-gray-500">
                            &copy; 2024 PPSDM KM Institut Teknologi Sepuluh Nopember. All rights reserved.
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/" className="hover:text-white transition-colors">Beranda</Link></li>
                            <li><Link href="/about" className="hover:text-white transition-colors">Tentang PPSDM</Link></li>
                            <li><Link href="/programs" className="hover:text-white transition-colors">Program Unggulan</Link></li>
                            <li><Link href="/calendar" className="hover:text-white transition-colors">Kalender Kegiatan</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Connect</h4>
                        <div className="flex gap-4">
                            <a href="#" className="size-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-600 transition-colors">
                                <span className="material-symbols-outlined text-sm">mail</span>
                            </a>
                            <a href="#" className="size-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-600 transition-colors">
                                <span className="material-symbols-outlined text-sm">public</span>
                            </a>
                            <a href="#" className="size-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-600 transition-colors">
                                <span className="material-symbols-outlined text-sm">rss_feed</span>
                            </a>
                        </div>
                        <div className="mt-12 flex gap-4 text-xs text-gray-500">
                            <Link href="/privacy" className="hover:text-gray-300">Privacy Policy</Link>
                            <Link href="/terms" className="hover:text-gray-300">Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
