"use client";

import React from 'react';

export default function MentalPulsePage() {
    return (
        <div className="bg-[#f6f8f7] dark:bg-[#102218] text-[#111814] dark:text-white font-[family-name:var(--font-lexend)] overflow-hidden flex h-screen w-full">
            {/* Side Navigation */}
            <aside className="flex w-[280px] flex-col border-r border-[#f0f4f2] dark:border-[#1f362a] bg-white dark:bg-[#152a1f] transition-all hidden md:flex">
                <div className="flex h-full flex-col justify-between p-4">
                    <div className="flex flex-col gap-4">
                        {/* Branding */}
                        <div className="flex gap-3 items-center px-2 py-4">
                            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 shadow-sm" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBU4zxX6PMlY_RxC46L7VLVwD6Pk72iioRa91NqYyAeeQHqhYscdxvA5czGdbiAvzq7eM7815ngyUcHiSelP8jMK_rn6LbkxDATdgl59qyYhB1m7XdY7x_pzayyF8uUaV2fMH3pGRxxv9wjuka3zYaW7bnMm-yNhCy7RGHqWrkhQgTQudIl4YmwNrS6LU6e2y8RQnrc1NfII38316HHVRGNkILEtGNfCsrW9028CAJhGpuSUd8v7ts7hA3gNy7Bj0w-gZBsnVCyt3U")' }}></div>
                            <div className="flex flex-col">
                                <h1 className="text-[#111814] dark:text-white text-base font-bold leading-normal">PPSDM KMM</h1>
                                <p className="text-[#618972] dark:text-[#8ab09a] text-xs font-normal leading-normal">Student Portal</p>
                            </div>
                        </div>
                        {/* Nav Links */}
                        <div className="flex flex-col gap-2 mt-4">
                            <a className="flex items-center gap-3 px-3 py-3 hover:bg-[#f0f4f2] dark:hover:bg-[#1f362a] rounded-lg group transition-colors" href="#">
                                <span className="material-symbols-outlined text-[#618972] group-hover:text-[#111814] dark:text-[#8ab09a] dark:group-hover:text-white">dashboard</span>
                                <p className="text-[#111814] dark:text-[#e0e0e0] text-sm font-medium leading-normal">Dashboard</p>
                            </a>
                            <a className="flex items-center gap-3 px-3 py-3 hover:bg-[#f0f4f2] dark:hover:bg-[#1f362a] rounded-lg group transition-colors" href="#">
                                <span className="material-symbols-outlined text-[#618972] group-hover:text-[#111814] dark:text-[#8ab09a] dark:group-hover:text-white">school</span>
                                <p className="text-[#111814] dark:text-[#e0e0e0] text-sm font-medium leading-normal">Academics</p>
                            </a>
                            {/* Active State */}
                            <a className="flex items-center gap-3 px-3 py-3 rounded-lg bg-[#13ec6d]/10 dark:bg-[#13ec6d]/20" href="#">
                                <span className="material-symbols-outlined text-[#10853d] dark:text-[#13ec6d]">ecg_heart</span>
                                <p className="text-[#111814] dark:text-white text-sm font-bold leading-normal">Wellbeing</p>
                            </a>
                            <a className="flex items-center gap-3 px-3 py-3 hover:bg-[#f0f4f2] dark:hover:bg-[#1f362a] rounded-lg group transition-colors" href="#">
                                <span className="material-symbols-outlined text-[#618972] group-hover:text-[#111814] dark:text-[#8ab09a] dark:group-hover:text-white">bolt</span>
                                <p className="text-[#111814] dark:text-[#e0e0e0] text-sm font-medium leading-normal">POS Energy</p>
                            </a>
                            <a className="flex items-center gap-3 px-3 py-3 hover:bg-[#f0f4f2] dark:hover:bg-[#1f362a] rounded-lg group transition-colors" href="#">
                                <span className="material-symbols-outlined text-[#618972] group-hover:text-[#111814] dark:text-[#8ab09a] dark:group-hover:text-white">settings</span>
                                <p className="text-[#111814] dark:text-[#e0e0e0] text-sm font-medium leading-normal">Settings</p>
                            </a>
                        </div>
                    </div>
                    {/* Bottom Action */}
                    <div className="flex flex-col gap-4">
                        <div className="p-4 rounded-xl bg-gradient-to-br from-[#e0f7ea] to-[#f0fdf4] dark:from-[#1a3826] dark:to-[#102218] border border-[#13ec6d]/20">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="material-symbols-outlined text-[#13ec6d]">support_agent</span>
                                <p className="text-xs font-bold text-[#10853d] dark:text-[#13ec6d]">Need help?</p>
                            </div>
                            <p className="text-xs text-[#618972] dark:text-[#a0c4b0] mb-3">Professional counselors are available 24/7.</p>
                            <button className="w-full py-2 bg-white dark:bg-[#2a4a38] text-[#111814] dark:text-white text-xs font-bold rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#345c46]">Chat Now</button>
                        </div>
                    </div>
                </div>
            </aside>
            {/* Main Content Wrapper */}
            <div className="flex flex-1 flex-col h-full overflow-hidden relative">
                {/* Top Navigation */}
                <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#f0f4f2] dark:border-[#1f362a] bg-white dark:bg-[#152a1f] px-8 py-4 z-10">
                    <div className="flex items-center gap-4">
                        <button className="md:hidden text-[#111814] dark:text-white">
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <h2 className="text-[#111814] dark:text-white text-xl font-bold leading-tight tracking-tight">Mental Pulse</h2>
                    </div>
                    <div className="flex items-center gap-6">
                        {/* Search */}
                        <label className="hidden md:flex flex-col min-w-40 !h-10 w-64 group">
                            <div className="flex w-full flex-1 items-stretch rounded-xl h-full bg-[#f0f4f2] dark:bg-[#1f362a] transition-all group-focus-within:ring-2 group-focus-within:ring-[#13ec6d]/50">
                                <div className="text-[#618972] dark:text-[#8ab09a] flex border-none items-center justify-center pl-4 rounded-l-xl">
                                    <span className="material-symbols-outlined">search</span>
                                </div>
                                <input className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111814] dark:text-white focus:outline-0 border-none bg-transparent h-full placeholder:text-[#618972] dark:placeholder:text-[#5a7a6a] px-3 text-sm font-normal leading-normal" placeholder="Search resources..." />
                            </div>
                        </label>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center justify-center rounded-full size-10 bg-[#f0f4f2] dark:bg-[#1f362a] text-[#111814] dark:text-white hover:bg-[#e0e8e4] dark:hover:bg-[#2a4535] transition-colors relative">
                                <span className="material-symbols-outlined text-[20px]">notifications</span>
                                <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border border-white dark:border-[#1f362a]"></span>
                            </button>
                            <button className="flex items-center justify-center rounded-full size-10 bg-[#f0f4f2] dark:bg-[#1f362a] text-[#111814] dark:text-white hover:bg-[#e0e8e4] dark:hover:bg-[#2a4535] transition-colors">
                                <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
                            </button>
                            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-white dark:ring-[#1f362a] cursor-pointer" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBp1cKsYK0jZg9PPy9a2FL8qx2rq7J0512dgm9pMGRLxHlI2az5k-qQ2OJB_kPLyK9QIbb0FOO7V7Hjdjgfoa44pg51OsjoYvfxkG9lLruGZus6MAwg_PZHj0N4KdS2XC4SeSASFN7Q95_Ys_-CO5SsUKjTVj6k1t8r-k7rVd2lI7jhxoP596mXkwXVEGtLQColsi8Sy4OSAzz5YwDnjPyoRDfgMuBCF8-iYo_cENc559rRFCAmftun0WLydWjmFfMknzv-7Pc6GC4")' }}></div>
                        </div>
                    </div>
                </header>
                {/* Scrollable Content Area */}
                <main className="flex-1 overflow-y-auto bg-[#f6f8f7] dark:bg-[#102218] p-6 md:p-10 pb-20">
                    <div className="max-w-[1200px] mx-auto flex flex-col gap-8">
                        {/* Hero / Greeting */}
                        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                            <div className="flex flex-col gap-1">
                                <h1 className="text-[#111814] dark:text-white text-3xl md:text-4xl font-extrabold tracking-tight">Good morning, Alex</h1>
                                <p className="text-[#618972] dark:text-[#8ab09a] text-base md:text-lg">Ready to track your journey today?</p>
                            </div>
                            {/* Integrated Quick Log */}
                            <div className="bg-white dark:bg-[#152a1f] p-1.5 rounded-full shadow-sm flex items-center border border-gray-100 dark:border-[#2a4535]">
                                <span className="px-4 text-xs font-bold text-[#618972] dark:text-[#8ab09a] uppercase tracking-wider hidden sm:block">Log Mood:</span>
                                <div className="flex gap-1">
                                    <button className="group relative flex flex-col items-center justify-center size-10 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                                        <span className="material-symbols-outlined text-[#ef4444] group-hover:scale-110 transition-transform filled">sentiment_very_dissatisfied</span>
                                        <span className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold bg-gray-800 text-white px-2 py-0.5 rounded">Stressed</span>
                                    </button>
                                    <button className="group relative flex flex-col items-center justify-center size-10 rounded-full hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all">
                                        <span className="material-symbols-outlined text-[#f97316] group-hover:scale-110 transition-transform">sentiment_dissatisfied</span>
                                        <span className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold bg-gray-800 text-white px-2 py-0.5 rounded">Anxious</span>
                                    </button>
                                    <button className="group relative flex flex-col items-center justify-center size-10 rounded-full hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-all">
                                        <span className="material-symbols-outlined text-[#eab308] group-hover:scale-110 transition-transform">sentiment_neutral</span>
                                        <span className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold bg-gray-800 text-white px-2 py-0.5 rounded">Okay</span>
                                    </button>
                                    <button className="group relative flex flex-col items-center justify-center size-10 rounded-full hover:bg-green-50 dark:hover:bg-green-900/20 transition-all">
                                        <span className="material-symbols-outlined text-[#10b981] group-hover:scale-110 transition-transform">sentiment_satisfied</span>
                                        <span className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold bg-gray-800 text-white px-2 py-0.5 rounded">Good</span>
                                    </button>
                                    <button className="group relative flex flex-col items-center justify-center size-10 rounded-full bg-[#13ec6d]/10 dark:bg-[#13ec6d]/20 hover:bg-[#13ec6d]/20 dark:hover:bg-[#13ec6d]/30 transition-all">
                                        <span className="material-symbols-outlined text-[#10853d] dark:text-[#13ec6d] group-hover:scale-110 transition-transform">sentiment_very_satisfied</span>
                                        <span className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold bg-gray-800 text-white px-2 py-0.5 rounded">Thriving</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Dashboard Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Column 1: Calendar (4 cols) */}
                            <div className="lg:col-span-4 flex flex-col">
                                <div className="bg-white dark:bg-[#152a1f] rounded-2xl p-6 shadow-sm border border-[#f0f4f2] dark:border-[#1f362a] h-full flex flex-col">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-lg font-bold text-[#111814] dark:text-white">Mood Calendar</h3>
                                        <div className="flex items-center gap-2">
                                            <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
                                            <span className="text-sm font-medium text-[#618972] dark:text-[#8ab09a]">October 2023</span>
                                            <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
                                        </div>
                                    </div>
                                    {/* Calendar Grid */}
                                    <div className="grid grid-cols-7 gap-2 mb-4 flex-1">
                                        {/* Days Header */}
                                        <div className="text-center text-xs font-bold text-[#618972] dark:text-[#5a7a6a] py-2">S</div>
                                        <div className="text-center text-xs font-bold text-[#618972] dark:text-[#5a7a6a] py-2">M</div>
                                        <div className="text-center text-xs font-bold text-[#618972] dark:text-[#5a7a6a] py-2">T</div>
                                        <div className="text-center text-xs font-bold text-[#618972] dark:text-[#5a7a6a] py-2">W</div>
                                        <div className="text-center text-xs font-bold text-[#618972] dark:text-[#5a7a6a] py-2">T</div>
                                        <div className="text-center text-xs font-bold text-[#618972] dark:text-[#5a7a6a] py-2">F</div>
                                        <div className="text-center text-xs font-bold text-[#618972] dark:text-[#5a7a6a] py-2">S</div>
                                        {/* Days */}
                                        <div className="text-center text-sm text-gray-300 dark:text-gray-700 py-1">29</div>
                                        <div className="text-center text-sm text-gray-300 dark:text-gray-700 py-1">30</div>
                                        {/* Active Days */}
                                        <div className="flex justify-center items-center aspect-square"><div className="size-8 rounded-full bg-[#f0f4f2] dark:bg-[#1f362a] flex items-center justify-center text-sm">1</div></div>
                                        <div className="flex justify-center items-center aspect-square"><div className="size-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 flex items-center justify-center text-sm font-bold">2</div></div>
                                        <div className="flex justify-center items-center aspect-square"><div className="size-8 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 flex items-center justify-center text-sm font-bold">3</div></div>
                                        <div className="flex justify-center items-center aspect-square"><div className="size-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 flex items-center justify-center text-sm font-bold">4</div></div>
                                        <div className="flex justify-center items-center aspect-square"><div className="size-8 rounded-full bg-[#13ec6d] text-[#111814] flex items-center justify-center text-sm font-bold shadow-lg shadow-[#13ec6d]/30">5</div></div>
                                        <div className="flex justify-center items-center aspect-square"><div className="size-8 rounded-full bg-[#f0f4f2] dark:bg-[#1f362a] flex items-center justify-center text-sm">6</div></div>
                                        <div className="flex justify-center items-center aspect-square"><div className="size-8 rounded-full bg-[#f0f4f2] dark:bg-[#1f362a] flex items-center justify-center text-sm">7</div></div>
                                        {/* ... more days placeholders ... */}
                                        <div className="flex justify-center items-center aspect-square"><div className="size-8 rounded-full bg-[#f0f4f2] dark:bg-[#1f362a] flex items-center justify-center text-sm">8</div></div>
                                        <div className="flex justify-center items-center aspect-square"><div className="size-8 rounded-full bg-[#f0f4f2] dark:bg-[#1f362a] flex items-center justify-center text-sm">9</div></div>
                                        <div className="flex justify-center items-center aspect-square"><div className="size-8 rounded-full bg-[#f0f4f2] dark:bg-[#1f362a] flex items-center justify-center text-sm">10</div></div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-[#f0f4f2] dark:border-[#1f362a] flex justify-between items-center text-xs text-[#618972] dark:text-[#8ab09a]">
                                        <span className="flex items-center gap-1"><div className="size-2 rounded-full bg-[#13ec6d]"></div> Good</span>
                                        <span className="flex items-center gap-1"><div className="size-2 rounded-full bg-orange-400"></div> Anxious</span>
                                        <span className="flex items-center gap-1"><div className="size-2 rounded-full bg-red-400"></div> Stressed</span>
                                    </div>
                                </div>
                            </div>
                            {/* Column 2: Seno AI (4 cols) */}
                            <div className="lg:col-span-4 flex flex-col">
                                <div className="bg-gradient-to-b from-[#e0f7ea] to-white dark:from-[#1a3826] dark:to-[#152a1f] rounded-2xl p-6 shadow-sm border border-[#13ec6d]/20 h-full flex flex-col relative overflow-hidden">
                                    {/* Background Decoration */}
                                    <div className="absolute -top-10 -right-10 size-32 bg-[#13ec6d]/10 rounded-full blur-2xl"></div>
                                    <div className="flex items-center gap-3 mb-4 z-10">
                                        <div className="size-10 rounded-full bg-white dark:bg-[#2a4a38] flex items-center justify-center shadow-sm">
                                            <span className="material-symbols-outlined text-[#13ec6d]">smart_toy</span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-[#111814] dark:text-white">Seno AI Insight</h3>
                                            <p className="text-xs text-[#618972] dark:text-[#a0c4b0]">Based on your logs</p>
                                        </div>
                                    </div>
                                    <div className="flex-1 z-10">
                                        <p className="text-[#111814] dark:text-gray-200 font-medium leading-relaxed mb-4">
                                            &quot;I noticed your stress levels were elevated yesterday. A balanced approach works best.&quot;
                                        </p>
                                        <div className="bg-white/60 dark:bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/50 dark:border-white/10">
                                            <p className="text-sm text-[#111814] dark:text-white font-bold mb-2">Seno suggests:</p>
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-[#1f362a] shadow-sm">
                                                    <div className="flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-orange-500 text-sm">self_improvement</span>
                                                        <span className="text-sm text-[#111814] dark:text-white">5 min Meditation</span>
                                                    </div>
                                                    <span className="text-[10px] font-bold bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded-full">Spiritual</span>
                                                </div>
                                                <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-[#1f362a] shadow-sm">
                                                    <div className="flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-blue-500 text-sm">directions_walk</span>
                                                        <span className="text-sm text-[#111814] dark:text-white">Short Walk</span>
                                                    </div>
                                                    <span className="text-[10px] font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">Physical</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex gap-2">
                                        <button className="flex-1 py-2 bg-[#13ec6d] text-[#111814] text-sm font-bold rounded-lg shadow-sm hover:brightness-105 transition-all">Start Now</button>
                                        <button className="p-2 bg-white dark:bg-[#2a4a38] text-[#618972] dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-[#345c46]"><span className="material-symbols-outlined text-xl">thumb_up</span></button>
                                    </div>
                                </div>
                            </div>
                            {/* Column 3: Stress Chart (4 cols) */}
                            <div className="lg:col-span-4 flex flex-col">
                                <div className="bg-white dark:bg-[#152a1f] rounded-2xl p-6 shadow-sm border border-[#f0f4f2] dark:border-[#1f362a] h-full flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-[#111814] dark:text-white">Weekly Pulse</h3>
                                            <p className="text-xs text-[#618972] dark:text-[#8ab09a]">Stress vs. Energy</p>
                                        </div>
                                        <div className="flex gap-2 text-xs font-bold">
                                            <span className="flex items-center gap-1 text-red-500"><div className="size-2 rounded-full bg-red-500"></div> Stress</span>
                                            <span className="flex items-center gap-1 text-[#13ec6d]"><div className="size-2 rounded-full bg-[#13ec6d]"></div> Energy</span>
                                        </div>
                                    </div>
                                    {/* Custom CSS Chart */}
                                    <div className="relative flex-1 min-h-[160px] w-full mt-2">
                                        {/* Grid Lines */}
                                        <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-gray-300 dark:text-gray-700">
                                            <div className="border-b border-dashed border-gray-100 dark:border-gray-800 w-full h-0"></div>
                                            <div className="border-b border-dashed border-gray-100 dark:border-gray-800 w-full h-0"></div>
                                            <div className="border-b border-dashed border-gray-100 dark:border-gray-800 w-full h-0"></div>
                                            <div className="border-b border-gray-200 dark:border-gray-700 w-full h-0"></div>
                                        </div>
                                        {/* Chart SVG */}
                                        <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 50">
                                            {/* Stress Line (Red) */}
                                            <polyline className="opacity-80 drop-shadow-sm" fill="none" points="0,35 16,30 32,40 48,25 64,20 80,30 100,25" stroke="#ef4444" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" vectorEffect="non-scaling-stroke"></polyline>
                                            {/* Energy Line (Green/Primary) */}
                                            <path className="drop-shadow-sm" d="M0,20 L16,15 L32,18 L48,10 L64,15 L80,10 L100,5" fill="none" stroke="#13ec6d" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" vectorEffect="non-scaling-stroke"></path>
                                            {/* Area under green */}
                                            <path className="opacity-20" d="M0,20 L16,15 L32,18 L48,10 L64,15 L80,10 L100,5 V50 H0 Z" fill="url(#gradientEnergy)"></path>
                                            <defs>
                                                <linearGradient id="gradientEnergy" x1="0%" x2="0%" y1="0%" y2="100%">
                                                    <stop offset="0%" style={{ stopColor: '#13ec6d', stopOpacity: 1 }}></stop>
                                                    <stop offset="100%" style={{ stopColor: '#13ec6d', stopOpacity: 0 }}></stop>
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                        {/* Points for hover effect (simplified) */}
                                        <div className="absolute inset-0 flex justify-between items-end pb-0 pt-2 px-0">
                                            <div className="w-2 h-full relative group cursor-pointer">
                                                <div className="absolute bottom-[60%] left-1/2 -translate-x-1/2 size-2 bg-[#13ec6d] rounded-full ring-2 ring-white dark:ring-[#152a1f] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            </div>
                                            {/* Add more interaction points if needed using JS, visual only here */}
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-2 font-medium">
                                        <span>Mon</span>
                                        <span>Tue</span>
                                        <span>Wed</span>
                                        <span>Thu</span>
                                        <span>Fri</span>
                                        <span>Sat</span>
                                        <span>Sun</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Recommendations Section */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-[#111814] dark:text-white">Recommended for You</h3>
                                <a className="text-[#13ec6d] text-sm font-bold hover:underline" href="#">View All</a>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Activity Card 1 */}
                                <div className="group cursor-pointer rounded-2xl bg-white dark:bg-[#152a1f] overflow-hidden border border-[#f0f4f2] dark:border-[#1f362a] hover:shadow-md transition-all hover:-translate-y-1">
                                    <div className="h-40 bg-cover bg-center relative" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBQ6MhEa0cSbmQX8X0oecdk26FSg0Uo0Tfc2Z7Kv8bCqxCGoa6uwxual2qrMLd3C3K4tb2elIF0NIv6Qr3eWYvz3W6isHw6s_ArBGGvfv6Lxu7WVGU5zpTOAVXiPTulF-Y2Zc-2bryn71rMRZRvBkQDTrQ-Frqypmk02P9ULmxJMHnwgx5_kGpOt6iVSHLk9E8_xdEbaIgJB7vQXfzwdcYbl-rcli76snTBmlPJYVtf3oq7CuKqOIj__S2r-sYpN03sBWsMTDoWVqI")' }}>
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                                        <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-[#111814] dark:text-white flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm text-purple-500">spa</span> Spiritual
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="text-base font-bold text-[#111814] dark:text-white">Mindful Breathing</h4>
                                            <span className="text-xs font-medium text-[#618972] dark:text-[#8ab09a]">10 min</span>
                                        </div>
                                        <p className="text-sm text-[#618972] dark:text-[#a0c4b0] mb-4 line-clamp-2">A simple technique to reduce anxiety and center your thoughts.</p>
                                        <div className="flex items-center gap-2">
                                            <button className="flex-1 bg-[#f0f4f2] dark:bg-[#1f362a] text-[#111814] dark:text-white text-xs font-bold py-2 rounded-lg group-hover:bg-[#13ec6d] group-hover:text-[#111814] transition-colors">Start Session</button>
                                        </div>
                                    </div>
                                </div>
                                {/* Activity Card 2 */}
                                <div className="group cursor-pointer rounded-2xl bg-white dark:bg-[#152a1f] overflow-hidden border border-[#f0f4f2] dark:border-[#1f362a] hover:shadow-md transition-all hover:-translate-y-1">
                                    <div className="h-40 bg-cover bg-center relative" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCuewqTnIom2DQVynlud5Tjj-GI8Fmo7wceYbRyXpAA_-877ivPirAH-gCCk8FyuIyl4BpD7vV__HqLtqRjFSfxVnqs4OwNoMyp9djnTc8cb3yM4WG65Kg30-917CE7s0Eas-MbKC94eboJeCZN4Ok1FBa3oyVqx7lYKD-aa_kiiQGWgVni92LRKkZVROXriwvHHLWlW2a4omKJa6n-PyiYgkHFCkO-tmv4DAwKDtrQcUPO-0xH3qrKbfoUFC9jiFu-e0czTa2IoOM")' }}>
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                                        <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-[#111814] dark:text-white flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm text-blue-500">fitness_center</span> Physical
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="text-base font-bold text-[#111814] dark:text-white">Morning Stretch</h4>
                                            <span className="text-xs font-medium text-[#618972] dark:text-[#8ab09a]">15 min</span>
                                        </div>
                                        <p className="text-sm text-[#618972] dark:text-[#a0c4b0] mb-4 line-clamp-2">Wake up your body and boost your energy levels for the day.</p>
                                        <div className="flex items-center gap-2">
                                            <button className="flex-1 bg-[#f0f4f2] dark:bg-[#1f362a] text-[#111814] dark:text-white text-xs font-bold py-2 rounded-lg group-hover:bg-[#13ec6d] group-hover:text-[#111814] transition-colors">Start Session</button>
                                        </div>
                                    </div>
                                </div>
                                {/* Activity Card 3 */}
                                <div className="group cursor-pointer rounded-2xl bg-white dark:bg-[#152a1f] overflow-hidden border border-[#f0f4f2] dark:border-[#1f362a] hover:shadow-md transition-all hover:-translate-y-1">
                                    <div className="h-40 bg-cover bg-center relative" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCL-4nT3ZKG7ikj4k0dJXtxC_W9QVhrjWFmLxWZfgaZiyO1qMwIZZk6DincooTp6olqEd1Pk7n_FegvAEj5WYRmOqg_isefcJ38223jpEbwNfqUi9OhsFX3ECS3r7W-7FB-oxERpDVe4pPP1XCUzR9m5RPGVOITh6iYk_M1_FIl347gNBhKimGNCt4dJOlT_tPyKvTZPD2SU8ewSKWnLCX9IuWo6m7zK4SLe7dNBls-uAiQxG030vOlMPzrc2JGmUl8LQNss0kgBPQ")' }}>
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                                        <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-[#111814] dark:text-white flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm text-yellow-500">edit_note</span> Reflection
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="text-base font-bold text-[#111814] dark:text-white">Gratitude Journal</h4>
                                            <span className="text-xs font-medium text-[#618972] dark:text-[#8ab09a]">5 min</span>
                                        </div>
                                        <p className="text-sm text-[#618972] dark:text-[#a0c4b0] mb-4 line-clamp-2">Log three things you are grateful for today.</p>
                                        <div className="flex items-center gap-2">
                                            <button className="flex-1 bg-[#f0f4f2] dark:bg-[#1f362a] text-[#111814] dark:text-white text-xs font-bold py-2 rounded-lg group-hover:bg-[#13ec6d] group-hover:text-[#111814] transition-colors">Start Session</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .material-symbols-outlined.filled {
          font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>
        </div>
    );
}
