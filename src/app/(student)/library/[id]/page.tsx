"use client";

import Link from "next/link";
import { useState } from "react";

export default function ResourceDetailPage({ params }: { params: { id: string } }) {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div className="bg-[#f8fafc] dark:bg-[#101622] font-[family-name:var(--font-lexend)] text-slate-900 min-h-screen flex flex-col">
            {/* Top Navigation Bar */}
            <nav className="sticky top-0 z-50 w-full bg-white border-b border-slate-200">
                <div className="px-6 md:px-10 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        {/* Logo Area */}
                        <div className="flex items-center gap-3 text-[#0b1e42]">
                            <div className="size-8 bg-[#135bec]/10 rounded flex items-center justify-center text-[#135bec]">
                                <span className="material-symbols-outlined">school</span>
                            </div>
                            <h2 className="text-[#0b1e42] text-lg font-bold tracking-tight">PPSDM KM ITS</h2>
                        </div>
                        {/* Desktop Links */}
                        <div className="hidden md:flex items-center gap-6">
                            <Link href="/dashboard" className="text-slate-600 hover:text-[#135bec] text-sm font-medium transition-colors">Dashboard</Link>
                            <Link href="/library" className="text-[#135bec] text-sm font-medium transition-colors">Library</Link>
                            <Link href="#" className="text-slate-600 hover:text-[#135bec] text-sm font-medium transition-colors">My Progress</Link>
                            <Link href="#" className="text-slate-600 hover:text-[#135bec] text-sm font-medium transition-colors">Community</Link>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex relative group">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px]">search</span>
                            <input className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm w-64 focus:ring-2 focus:ring-[#135bec]/20 text-slate-700 placeholder:text-slate-400" placeholder="Search resources..." type="text" />
                        </div>
                        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                            <div className="flex flex-col items-end hidden sm:flex">
                                <span className="text-sm font-bold text-slate-900 leading-none">Budi Santoso</span>
                                <span className="text-xs text-slate-500">Mahasiswa S1</span>
                            </div>
                            <div className="size-10 rounded-full bg-slate-200 bg-cover bg-center border-2 border-white shadow-sm" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCRH7GhuR4eccR6YaAEHdGzwjVvECChy3C6_6O8Jg8TWmZWcI_dYO8VeHZgDqQ9MCfR23UoyskrjK1bLLm4ESG2mUSvGsn3WXQd6_EOYFyUKPUdxmZaOj5xNdYAWarOmTmg5D5HI1lAWjhirnWyIBfENhPh1PEq7kSc91Ruv4EHc7CST6jF2gwzheclmV8uZcso-Xbcqb4uAHwrxAu2HS8zC-d8HRvJlwUA-MP2OaB3qvF27CWgORou2FgskmFSGyYGscFnf_JANqE')" }}></div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content Wrapper */}
            <main className="flex-1 flex flex-col">
                {/* Hero Section */}
                <section className="relative w-full bg-gradient-to-br from-[#0b1e42] via-[#0f3575] to-[#135bec] text-white overflow-hidden">
                    {/* Watermark / Abstract Pattern */}
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] opacity-[0.03] pointer-events-none translate-x-1/3 -translate-y-1/4">
                        <svg className="w-full h-full fill-white" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                            <path d="M42.7,-62.9C50.9,-52.8,50.1,-34.4,51.7,-19.2C53.4,-4,57.4,8,54.5,18.7C51.6,29.4,41.8,38.8,31.4,48.3C21,57.9,10,67.5,-2.5,70.9C-15,74.4,-29,71.6,-41.6,63.1C-54.2,54.6,-65.4,40.3,-70.5,23.6C-75.6,6.9,-74.7,-12.3,-65.5,-26.8C-56.3,-41.3,-38.8,-51.1,-24.3,-58.1C-9.8,-65.1,1.7,-69.3,14.3,-68.8C26.9,-68.4,40.6,-63.3,42.7,-62.9Z" transform="translate(100 100)"></path>
                        </svg>
                    </div>
                    <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 relative z-10">
                        <div className="flex flex-col md:flex-row gap-10 items-start">
                            {/* Book Cover */}
                            <div className="shrink-0 relative group perspective-1000">
                                <div className="w-48 h-72 md:w-56 md:h-80 bg-white rounded-lg shadow-2xl overflow-hidden transform transition-transform duration-500 hover:rotate-y-12">
                                    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBFUyyJDDSKJxD2JoGf5XxOdwZyOIQZW0jnSae8qh0TJpE0lb_P8ZdwQ4r2H5xMvvKiUITLrlcb9OASZyoDr_gF4qSVhRanzQWANL4IJHe2k_Y6L7JW5m8wcfdwG_iKEYfZlOzQhESAntt0wFR4eXsBTKu1yleFHjca_MLCTUXwdmP4-QUvTuYho5u0FJoqHwM1gOOE2U_xUPaxF_FYUb6YcW7i-y3eMo1Xx7Uq8Uqco4mN0iD10mHg_oBA1Hp8oIC2VjmoYNzuTyY')" }}></div>
                                    {/* Shine effect */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                </div>
                            </div>
                            {/* Book Metadata */}
                            <div className="flex-1 flex flex-col justify-center h-full pt-2">
                                <div className="inline-flex items-center gap-2 mb-3">
                                    <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-100 text-xs font-semibold backdrop-blur-sm">
                                        Computer Science
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-100 text-xs font-semibold backdrop-blur-sm flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[14px]">verified</span> Verified Resource
                                    </span>
                                </div>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-2 tracking-tight">
                                    Dasar-Dasar Kecerdasan Buatan
                                </h1>
                                <p className="text-blue-100 text-lg md:text-xl font-light mb-6">
                                    Prof. Dr. Eng. Agus Zainal <span className="mx-2 opacity-50">•</span> 2024 Edition
                                </p>
                                <p className="text-blue-50/80 max-w-2xl leading-relaxed mb-8">
                                    Explore the fundamentals of Artificial Intelligence through our Quantum Alchemy Engine. Transform this static PDF into interactive mind maps, quizzes, and audio lessons instantly.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <button className="flex items-center gap-2 px-6 py-3 bg-white text-[#135bec] font-bold rounded-lg hover:bg-blue-50 transition-all shadow-lg shadow-blue-900/20 active:scale-95">
                                        <span className="material-symbols-outlined">picture_as_pdf</span>
                                        Baca PDF Asli
                                    </button>
                                    <button className="flex items-center gap-2 px-6 py-3 bg-transparent border border-white/30 text-white font-bold rounded-lg hover:bg-white/10 transition-all backdrop-blur-sm active:scale-95">
                                        <span className="material-symbols-outlined">auto_awesome</span>
                                        Chat dengan Buku
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Navigation Tabs */}
                <div className="sticky top-[73px] z-40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-slate-200">
                    <div className="max-w-7xl mx-auto px-6 md:px-10">
                        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                            {/* Tab Items */}
                            <a className="flex items-center gap-2 px-4 py-4 border-b-[3px] border-[#135bec] text-[#135bec] group min-w-max" href="#">
                                <span className="material-symbols-outlined fill-current">flash_on</span>
                                <span className="font-bold text-sm">Microlearning</span>
                            </a>
                            <a className="flex items-center gap-2 px-4 py-4 border-b-[3px] border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-all group min-w-max" href="#">
                                <span className="material-symbols-outlined">hub</span>
                                <span className="font-medium text-sm">Mind Map</span>
                            </a>
                            <a className="flex items-center gap-2 px-4 py-4 border-b-[3px] border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-all group min-w-max" href="#">
                                <span className="material-symbols-outlined">trophy</span>
                                <span className="font-medium text-sm">Gamification</span>
                            </a>
                            <a className="flex items-center gap-2 px-4 py-4 border-b-[3px] border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-all group min-w-max" href="#">
                                <span className="material-symbols-outlined">podcasts</span>
                                <span className="font-medium text-sm">Podcast</span>
                            </a>
                            <a className="flex items-center gap-2 px-4 py-4 border-b-[3px] border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-all group min-w-max" href="#">
                                <span className="material-symbols-outlined">co_present</span>
                                <span className="font-medium text-sm">Slides</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="max-w-7xl mx-auto px-6 md:px-10 py-8 w-full flex-1">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Main Content (Left Column) */}
                        <div className="lg:col-span-8 space-y-8">
                            {/* Section Header */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">Key Concepts (Flashcards)</h2>
                                    <p className="text-slate-500 mt-1">Master the core terminology of AI through spaced repetition.</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2 text-slate-400 hover:text-[#135bec] transition-colors hover:bg-blue-50 rounded-lg">
                                        <span className="material-symbols-outlined">grid_view</span>
                                    </button>
                                    <button className="p-2 text-slate-400 hover:text-[#135bec] transition-colors hover:bg-blue-50 rounded-lg">
                                        <span className="material-symbols-outlined">view_carousel</span>
                                    </button>
                                </div>
                            </div>

                            {/* Flashcards Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                {/* Card 1 */}
                                <div className="group h-64 perspective-1000 cursor-pointer">
                                    <div className="relative w-full h-full bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between transition-all hover:shadow-md hover:border-[#135bec]/50 group-hover:-translate-y-1 duration-300">
                                        <div className="flex justify-between items-start">
                                            <div className="p-3 bg-blue-50 text-[#135bec] rounded-lg">
                                                <span className="material-symbols-outlined">neurology</span>
                                            </div>
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Concept 01</span>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 mb-2">Neural Networks</h3>
                                            <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">A computing system made up of a number of simple, highly interconnected processing elements, which process information by their dynamic state response to external inputs.</p>
                                        </div>
                                        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
                                            <div className="bg-[#135bec] w-3/4 h-full rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                                {/* Card 2 */}
                                <div className="group h-64 perspective-1000 cursor-pointer">
                                    <div className="relative w-full h-full bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between transition-all hover:shadow-md hover:border-[#135bec]/50 group-hover:-translate-y-1 duration-300">
                                        <div className="flex justify-between items-start">
                                            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                                                <span className="material-symbols-outlined">psychology</span>
                                            </div>
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Concept 02</span>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 mb-2">Machine Learning</h3>
                                            <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">The study of computer algorithms that improve automatically through experience and by the use of data.</p>
                                        </div>
                                        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
                                            <div className="bg-purple-500 w-1/2 h-full rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                                {/* Card 3 */}
                                <div className="group h-64 perspective-1000 cursor-pointer">
                                    <div className="relative w-full h-full bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between transition-all hover:shadow-md hover:border-[#135bec]/50 group-hover:-translate-y-1 duration-300">
                                        <div className="flex justify-between items-start">
                                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                                                <span className="material-symbols-outlined">checklist</span>
                                            </div>
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Concept 03</span>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 mb-2">Supervised Learning</h3>
                                            <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">A type of machine learning where the algorithm is trained on a labeled dataset.</p>
                                        </div>
                                        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
                                            <div className="bg-emerald-500 w-full h-full rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                                {/* Card 4 */}
                                <div className="group h-64 perspective-1000 cursor-pointer">
                                    <div className="relative w-full h-full bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between transition-all hover:shadow-md hover:border-[#135bec]/50 group-hover:-translate-y-1 duration-300">
                                        <div className="flex justify-between items-start">
                                            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                                                <span className="material-symbols-outlined">data_exploration</span>
                                            </div>
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Concept 04</span>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 mb-2">Data Mining</h3>
                                            <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">The process of discovering patterns in large data sets involving methods at the intersection of machine learning, statistics, and database systems.</p>
                                        </div>
                                        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
                                            <div className="bg-amber-500 w-1/4 h-full rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar (Right Column) */}
                        <aside className="lg:col-span-4 space-y-6">
                            {/* Podcast Widget */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                                    <h3 className="font-bold text-slate-700 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[#135bec]">headphones</span> Audio Companion
                                    </h3>
                                    <button className="text-xs font-bold text-[#135bec] hover:underline">View All</button>
                                </div>
                                <div className="p-5">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="size-16 rounded-lg bg-cover bg-center shrink-0" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDJp5A0n8XCprnlVfZZn4P7Zyi4R3YzKEghbXIAN6qjnpXyio053O_tLbtln3drTXfZEjwY1I-lTYduJ80pRs0EoT6CceLklJeitHbv8DqJJE-qOasHQ5LT1Y-gprzzcQr2C8Xu6hfOuiud-kOo1BvbFNjir9BWsP1UsSQTSouMooW3SeYgWdTRvi1fJkPZZ7DsvIJjjqDDEX4o9Uom_7bMzjhBBSjUh_fhtmcxWj5DjH5s5504sc0KkdPSS0OS35BPeJylNL56NG0')" }}></div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 line-clamp-1">Ep 1: Pengenalan AI</h4>
                                            <p className="text-xs text-slate-500 mb-2">15 mins • Prof. Agus Zainal</p>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-700">Playing</span>
                                        </div>
                                    </div>
                                    {/* Waveform Visual */}
                                    <div className="flex items-center gap-1 h-8 mb-4 justify-center px-2">
                                        <div className="w-1 bg-slate-200 h-3 rounded-full"></div>
                                        <div className="w-1 bg-slate-300 h-5 rounded-full"></div>
                                        <div className="w-1 bg-[#135bec] h-8 rounded-full animate-pulse"></div>
                                        <div className="w-1 bg-[#135bec]/60 h-6 rounded-full"></div>
                                        <div className="w-1 bg-[#135bec]/40 h-4 rounded-full"></div>
                                        <div className="w-1 bg-slate-200 h-3 rounded-full"></div>
                                        <div className="w-1 bg-slate-200 h-2 rounded-full"></div>
                                        <div className="w-1 bg-[#135bec] h-5 rounded-full"></div>
                                        <div className="w-1 bg-[#135bec] h-7 rounded-full"></div>
                                        <div className="w-1 bg-slate-300 h-4 rounded-full"></div>
                                        <div className="w-1 bg-slate-200 h-3 rounded-full"></div>
                                        <div className="w-1 bg-slate-200 h-2 rounded-full"></div>
                                        <div className="w-1 bg-[#135bec]/80 h-6 rounded-full"></div>
                                        <div className="w-1 bg-slate-300 h-4 rounded-full"></div>
                                        <div className="w-1 bg-slate-200 h-2 rounded-full"></div>
                                    </div>
                                    {/* Controls */}
                                    <div className="flex items-center justify-between">
                                        <button className="text-slate-400 hover:text-[#135bec]"><span className="material-symbols-outlined">replay_10</span></button>
                                        <button className="size-10 bg-[#135bec] text-white rounded-full flex items-center justify-center hover:bg-[#0d43b3] transition-colors shadow-lg shadow-[#135bec]/30">
                                            <span className="material-symbols-outlined">pause</span>
                                        </button>
                                        <button className="text-slate-400 hover:text-[#135bec]"><span className="material-symbols-outlined">forward_10</span></button>
                                    </div>
                                </div>
                            </div>

                            {/* Gamification Status */}
                            <div className="bg-gradient-to-br from-[#135bec] to-[#0b1e42] rounded-2xl text-white shadow-lg relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <span className="material-symbols-outlined text-8xl">military_tech</span>
                                </div>
                                <div className="p-6 relative z-10">
                                    <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-yellow-400">star</span>
                                        Your Progress
                                    </h3>
                                    <p className="text-blue-200 text-sm mb-6">Level 5: Novice Alchemist</p>
                                    <div className="flex items-end justify-between mb-2">
                                        <span className="text-xs font-bold uppercase tracking-wider text-blue-200">XP Gained</span>
                                        <span className="text-xl font-bold">1,540 <span className="text-sm font-normal text-blue-300">/ 2,000</span></span>
                                    </div>
                                    <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden mb-6">
                                        <div className="bg-yellow-400 h-full w-[75%] rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)]"></div>
                                    </div>
                                    <button className="w-full py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2">
                                        Take Weekly Quiz
                                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </button>
                                </div>
                            </div>

                            {/* Mind Map Teaser */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-1 group cursor-pointer hover:border-[#135bec]/50 transition-colors">
                                <div className="bg-slate-50 rounded-xl overflow-hidden relative h-32">
                                    <div className="absolute inset-0 flex items-center justify-center opacity-30">
                                        {/* Simple SVG pattern */}
                                        <svg height="100%" viewBox="0 0 100 100" width="100%">
                                            <circle cx="50" cy="50" fill="#135bec" r="4"></circle>
                                            <circle cx="20" cy="30" fill="#94a3b8" r="3"></circle>
                                            <circle cx="80" cy="30" fill="#94a3b8" r="3"></circle>
                                            <circle cx="30" cy="80" fill="#94a3b8" r="3"></circle>
                                            <line stroke="#cbd5e1" strokeWidth="1" x1="50" x2="20" y1="50" y2="30"></line>
                                            <line stroke="#cbd5e1" strokeWidth="1" x1="50" x2="80" y1="50" y2="30"></line>
                                            <line stroke="#cbd5e1" strokeWidth="1" x1="50" x2="30" y1="50" y2="80"></line>
                                        </svg>
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="px-4 py-2 bg-white rounded-lg shadow-sm font-bold text-sm text-slate-700 group-hover:text-[#135bec] group-hover:shadow-md transition-all">
                                            Explore Mind Map
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>

                {/* Floating AI Chat Button */}
                <button className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-[#135bec] text-white shadow-xl hover:bg-[#0d43b3] transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 group">
                    <span className="material-symbols-outlined">auto_awesome</span>
                    <span className="font-bold pr-2 hidden group-hover:inline-block transition-all duration-300">Ask AI</span>
                </button>
            </main>
        </div>
    );
}
