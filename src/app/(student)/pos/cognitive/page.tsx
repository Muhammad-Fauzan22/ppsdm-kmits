"use client";

import React from 'react';

export default function CognitiveDashboardPage() {
    return (
        <div className="bg-[#f6f6f8] dark:bg-[#101022] text-slate-900 dark:text-white font-[family-name:var(--font-space-grotesk)] overflow-hidden selection:bg-[#1313ec] selection:text-white min-h-screen">
            <div className="flex h-screen w-full">
                {/* Sidebar (Hidden on mobile for simplicity in this view, usually part of layout) */}
                <aside className="hidden lg:flex flex-col w-72 h-full border-r border-white/5 bg-[#11111e]">
                    <div className="p-6 pb-2">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="bg-center bg-no-repeat bg-cover rounded-full size-12 shadow-lg ring-2 ring-white/10" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDwblM_pxQ2jOk8wcl-ngZW-sCnvsodCxEL7CFiooTka_715EVRPSvDgAQcLYvotgQadUSvPfbmVplXVkGtCaYuwe9E3t_yAJGTZkseZpWnkPFJlLM_ROY9PrIIXbyU4-5UfUAXLU5HOHd89wz5dKKHNBFb4N9IWeojZVdB08pGy2c8QFY8jLONdhr_6sQIvmQy4kpvOzBFW0T34pDnYdD0fiM2jp760nte7-ph-xgNWIwG0YpwMftKafSf3SiYczvJ1ncqwXoj40g")' }}></div>
                            <div className="flex flex-col">
                                <h1 className="text-white text-lg font-bold leading-tight">Seno</h1>
                                <p className="text-[#9d9db9] text-xs font-medium uppercase tracking-wider">Student ID: 4821</p>
                            </div>
                        </div>
                    </div>
                    <nav className="flex-1 px-4 flex flex-col gap-2 overflow-y-auto">
                        <a className="flex items-center gap-4 px-4 py-3 rounded-xl text-[#9d9db9] hover:text-white hover:bg-white/5 transition-colors group" href="#">
                            <span className="material-symbols-outlined text-[24px] group-hover:scale-110 transition-transform">dashboard</span>
                            <span className="text-sm font-medium">Dashboard</span>
                        </a>
                        <a className="flex items-center gap-4 px-4 py-3 rounded-xl text-[#9d9db9] hover:text-white hover:bg-white/5 transition-colors group" href="#">
                            <span className="material-symbols-outlined text-[24px] group-hover:scale-110 transition-transform">menu_book</span>
                            <span className="text-sm font-medium">Courses</span>
                        </a>
                        {/* Active State */}
                        <a className="flex items-center gap-4 px-4 py-3 rounded-xl bg-[#1313ec] shadow-[0_0_20px_rgba(19,19,236,0.3)] text-white group" href="#">
                            <span className="material-symbols-outlined text-[24px] fill-1">psychology</span>
                            <span className="text-sm font-bold">Mental Health</span>
                        </a>
                        <a className="flex items-center gap-4 px-4 py-3 rounded-xl text-[#9d9db9] hover:text-white hover:bg-white/5 transition-colors group" href="#">
                            <span className="material-symbols-outlined text-[24px] group-hover:scale-110 transition-transform">calendar_month</span>
                            <span className="text-sm font-medium">Schedule</span>
                        </a>
                        <a className="flex items-center gap-4 px-4 py-3 rounded-xl text-[#9d9db9] hover:text-white hover:bg-white/5 transition-colors group" href="#">
                            <span className="material-symbols-outlined text-[24px] group-hover:scale-110 transition-transform">analytics</span>
                            <span className="text-sm font-medium">Reports</span>
                        </a>
                    </nav>
                    <div className="p-4 mt-auto">
                        <a className="flex items-center gap-4 px-4 py-3 rounded-xl text-[#9d9db9] hover:text-white hover:bg-white/5 transition-colors group" href="#">
                            <span className="material-symbols-outlined text-[24px] group-hover:rotate-90 transition-transform">settings</span>
                            <span className="text-sm font-medium">Settings</span>
                        </a>
                        <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/5">
                            <div className="flex items-center gap-2 text-xs text-[#9d9db9] mb-2">
                                <span className="material-symbols-outlined text-sm">wifi_tethering</span>
                                <span>System Status</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-white text-sm font-medium">Online</span>
                                <div className="size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col h-full overflow-y-auto relative z-0 custom-scrollbar">
                    {/* Top Gradient Glow */}
                    <div className="absolute top-0 left-0 w-full h-96 bg-[#1313ec]/10 blur-[100px] pointer-events-none -z-10"></div>

                    <div className="w-full max-w-[1400px] mx-auto p-6 lg:p-10 flex flex-col gap-8">
                        {/* Page Header */}
                        <header className="flex flex-wrap justify-between items-end gap-6">
                            <div className="flex flex-col gap-2">
                                <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-white">Mental Health Insights</h1>
                                <p className="text-[#9d9db9] text-lg font-normal max-w-2xl">Real-time cognitive load monitoring & AI-driven wellness recommendations.</p>
                            </div>
                            <div className="flex items-center gap-3 bg-[#16162a] px-4 py-2 rounded-full border border-white/10">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1313ec] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#1313ec]"></span>
                                </span>
                                <span className="text-sm font-medium text-white">Live Monitoring Active</span>
                            </div>
                        </header>

                        {/* Bento Grid Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Mental Bandwidth (Hero Stat) */}
                            <div className="lg:col-span-4 flex flex-col relative overflow-hidden rounded-2xl bg-[#16162a] border border-white/10 shadow-xl group">
                                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <span className="material-symbols-outlined text-9xl text-[#1313ec]">bolt</span>
                                </div>
                                <div className="p-8 flex flex-col h-full justify-between relative z-10">
                                    <div className="flex flex-col gap-1">
                                        <h3 className="text-[#9d9db9] text-base font-medium flex items-center gap-2">
                                            <span className="material-symbols-outlined text-lg">vital_signs</span>
                                            Mental Bandwidth
                                        </h3>
                                        <div className="mt-4 flex items-baseline gap-2">
                                            <span className="text-6xl font-bold text-white tracking-tighter">32%</span>
                                            <span className="text-red-400 font-medium bg-red-500/10 px-2 py-1 rounded text-sm">-15% since 8am</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-4 mt-8">
                                        <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                                            <div className="bg-gradient-to-r from-red-500 to-orange-400 h-2 rounded-full" style={{ width: '32%' }}></div>
                                        </div>
                                        <p className="text-sm text-white/80 leading-relaxed">
                                            Your cognitive resources are critically low. Complex problem solving capability is reduced.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Seno AI Insight (Card) */}
                            <div className="lg:col-span-8 flex flex-col">
                                <div className="relative flex flex-col h-full justify-end rounded-2xl overflow-hidden shadow-xl border border-white/10 group">
                                    {/* Background Image with Overlay */}
                                    <div className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDCy9yW4T8B6kVwS8OTi1pF6XXOwx2pEEYvYIMzWzTAjyqDYmwQG1Ex9ulRhH21T9slcL43XUCUT6g3mBnkJscGX14RgpB5tH3D1Yetp3xvyHP5JCJLvem9HVpa-rZVeXAWQ_RpyKLPDKqtUbMixg_Z9XqFthSiB1wAeO6sMbX4mXIZMDciSxKXttlAjyepFkcEs9JXCEuBixN_ntBUdIyD8Dc4L_rqEvx6vtMqgD-eNfL4KFJwS0HvbU4MpCfWQcNjc7nZmP5MTFI")' }}></div>
                                    <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#101022] via-[#101022]/80 to-transparent"></div>

                                    {/* Content */}
                                    <div className="relative z-10 p-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                                        <div className="flex flex-col gap-3 max-w-xl">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="size-6 rounded bg-[#1313ec] flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-white text-sm">smart_toy</span>
                                                </div>
                                                <span className="text-[#1313ec] font-bold uppercase tracking-widest text-xs">Seno Insight</span>
                                            </div>
                                            <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                                                "You've studied 6 hours straight. My analysis suggests diminishing returns."
                                            </h2>
                                            <p className="text-gray-300 text-sm md:text-base font-medium">
                                                Seno recommends a 15-min walk to reset your cortisol levels and restore focus.
                                            </p>
                                        </div>
                                        <button className="flex-shrink-0 bg-[#1313ec] hover:bg-blue-600 active:bg-blue-700 text-white font-bold h-12 px-6 rounded-lg transition-all shadow-[0_0_20px_rgba(19,19,236,0.4)] hover:shadow-[0_0_30px_rgba(19,19,236,0.6)] flex items-center gap-2">
                                            <span className="material-symbols-outlined">directions_walk</span>
                                            Start 15-min Break
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Gauges Row */}
                            {/* Focus Fatigue */}
                            <div className="lg:col-span-4 bg-[#16162a] border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col gap-1">
                                        <h4 className="text-white text-lg font-medium">Focus Fatigue</h4>
                                        <span className="text-xs text-[#9d9db9] font-medium uppercase tracking-wide">Current Strain</span>
                                    </div>
                                    <span className="bg-red-500/10 text-red-400 px-2 py-1 rounded text-xs font-bold uppercase">High</span>
                                </div>
                                <div className="flex-1 min-h-[160px] flex flex-col justify-end relative">
                                    {/* SVG Chart */}
                                    <svg className="w-full h-32 overflow-visible" preserveAspectRatio="none" viewBox="0 0 200 100">
                                        <defs>
                                            <linearGradient id="gradientFatigue" x1="0" x2="0" y1="0" y2="1">
                                                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.5"></stop>
                                                <stop offset="100%" stopColor="#ef4444" stopOpacity="0"></stop>
                                            </linearGradient>
                                        </defs>
                                        <path d="M0 80 Q 50 80 80 50 T 160 20 T 200 10" fill="url(#gradientFatigue)" stroke="none"></path>
                                        <path d="M0 80 Q 50 80 80 50 T 160 20 T 200 10" fill="none" stroke="#ef4444" strokeLinecap="round" strokeWidth="3"></path>
                                    </svg>
                                    <div className="flex justify-between mt-2 text-xs text-[#9d9db9] font-medium">
                                        <span>8am</span>
                                        <span>Now</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                                    <span className="material-symbols-outlined text-red-400 text-sm">trending_up</span>
                                    <span className="text-sm text-white">+12% in last hour</span>
                                </div>
                            </div>

                            {/* Information Overload */}
                            <div className="lg:col-span-4 bg-[#16162a] border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col gap-1">
                                        <h4 className="text-white text-lg font-medium">Info Overload</h4>
                                        <span className="text-xs text-[#9d9db9] font-medium uppercase tracking-wide">Input Volume</span>
                                    </div>
                                    <span className="bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded text-xs font-bold uppercase">Moderate</span>
                                </div>
                                <div className="flex-1 min-h-[160px] flex flex-col justify-end relative">
                                    {/* SVG Chart */}
                                    <svg className="w-full h-32 overflow-visible" preserveAspectRatio="none" viewBox="0 0 200 100">
                                        <defs>
                                            <linearGradient id="gradientInfo" x1="0" x2="0" y1="0" y2="1">
                                                <stop offset="0%" stopColor="#eab308" stopOpacity="0.5"></stop>
                                                <stop offset="100%" stopColor="#eab308" stopOpacity="0"></stop>
                                            </linearGradient>
                                        </defs>
                                        <path d="M0 60 Q 40 50 70 60 T 140 40 T 200 50" fill="url(#gradientInfo)" stroke="none"></path>
                                        <path d="M0 60 Q 40 50 70 60 T 140 40 T 200 50" fill="none" stroke="#eab308" strokeLinecap="round" strokeWidth="3"></path>
                                    </svg>
                                    <div className="flex justify-between mt-2 text-xs text-[#9d9db9] font-medium">
                                        <span>8am</span>
                                        <span>Now</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                                    <span className="material-symbols-outlined text-yellow-400 text-sm">remove</span>
                                    <span className="text-sm text-white">Stable flow</span>
                                </div>
                            </div>

                            {/* Burnout Risk */}
                            <div className="lg:col-span-4 bg-[#16162a] border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col gap-1">
                                        <h4 className="text-white text-lg font-medium">Burnout Risk</h4>
                                        <span className="text-xs text-[#9d9db9] font-medium uppercase tracking-wide">Prediction</span>
                                    </div>
                                    <span className="bg-orange-500/10 text-orange-400 px-2 py-1 rounded text-xs font-bold uppercase">Trending Up</span>
                                </div>
                                <div className="flex-1 min-h-[160px] flex flex-col justify-end relative">
                                    {/* SVG Chart */}
                                    <svg className="w-full h-32 overflow-visible" preserveAspectRatio="none" viewBox="0 0 200 100">
                                        <defs>
                                            <linearGradient id="gradientBurnout" x1="0" x2="0" y1="0" y2="1">
                                                <stop offset="0%" stopColor="#f97316" stopOpacity="0.5"></stop>
                                                <stop offset="100%" stopColor="#f97316" stopOpacity="0"></stop>
                                            </linearGradient>
                                        </defs>
                                        <path d="M0 90 L 40 85 L 80 70 L 120 60 L 160 40 L 200 30" fill="url(#gradientBurnout)" stroke="none"></path>
                                        <path d="M0 90 L 40 85 L 80 70 L 120 60 L 160 40 L 200 30" fill="none" stroke="#f97316" strokeLinecap="round" strokeWidth="3"></path>
                                    </svg>
                                    <div className="flex justify-between mt-2 text-xs text-[#9d9db9] font-medium">
                                        <span>Mon</span>
                                        <span>Tue</span>
                                        <span>Wed</span>
                                        <span>Thu</span>
                                        <span>Today</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                                    <span className="material-symbols-outlined text-orange-400 text-sm">trending_up</span>
                                    <span className="text-sm text-white">+2% increase (7 Days)</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions & Resources */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-white text-xl font-bold">Recommended Actions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <button className="bg-[#16162a] hover:bg-white/5 border border-white/10 p-4 rounded-xl flex items-center gap-4 transition-all group text-left">
                                    <div className="size-10 rounded-lg bg-[#1313ec]/20 flex items-center justify-center text-[#1313ec] group-hover:bg-[#1313ec] group-hover:text-white transition-colors">
                                        <span className="material-symbols-outlined">self_improvement</span>
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-sm">Guided Meditation</p>
                                        <p className="text-[#9d9db9] text-xs">5 min - Reset focus</p>
                                    </div>
                                </button>
                                <button className="bg-[#16162a] hover:bg-white/5 border border-white/10 p-4 rounded-xl flex items-center gap-4 transition-all group text-left">
                                    <div className="size-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                        <span className="material-symbols-outlined">headphones</span>
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-sm">Lo-fi Focus Music</p>
                                        <p className="text-[#9d9db9] text-xs">Spotify Integration</p>
                                    </div>
                                </button>
                                <button className="bg-[#16162a] hover:bg-white/5 border border-white/10 p-4 rounded-xl flex items-center gap-4 transition-all group text-left">
                                    <div className="size-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                        <span className="material-symbols-outlined">support_agent</span>
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-sm">Contact Counselor</p>
                                        <p className="text-[#9d9db9] text-xs">Available now</p>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Spacer for bottom scrolling */}
                        <div className="h-10"></div>
                    </div>
                </main>
            </div>

            <style jsx global>{`
        /* Custom scrollbar for dark mode webkit */
        .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: #101022; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #2a2a40; 
            border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #3b3b54; 
        }
        
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>
        </div>
    );
}
