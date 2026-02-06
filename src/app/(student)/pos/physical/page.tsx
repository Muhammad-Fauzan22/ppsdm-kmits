"use client";

import React from 'react';

export default function BiometricPage() {
    return (
        <div className="bg-[#f6f6f8] dark:bg-[#111118] font-[family-name:var(--font-manrope)] text-slate-900 dark:text-white min-h-screen flex flex-col overflow-x-hidden">
            {/* Top Navigation */}
            <nav className="border-b border-solid border-[#282839] bg-[#111118] px-4 md:px-10 py-3 sticky top-0 z-50">
                <div className="max-w-[1400px] mx-auto flex items-center justify-between whitespace-nowrap">
                    <div className="flex items-center gap-4 text-white">
                        <div className="size-8 bg-[#1313ec] rounded flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-xl">hexagon</span>
                        </div>
                        <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">PPSDM KMM</h2>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-transparent hover:bg-[#282839] text-white text-sm font-bold transition-colors">
                            <span className="truncate">Dashboard</span>
                        </button>
                        <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-transparent hover:bg-[#282839] text-white text-sm font-bold transition-colors">
                            <span className="truncate">Analysis</span>
                        </button>
                        <div className="w-px h-6 bg-[#282839] mx-1 my-auto"></div>
                        <button className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-[#282839] text-white hover:bg-[#3b3b54] transition-colors">
                            <span className="material-symbols-outlined text-[20px]">person</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content Layout */}
            <div className="flex-1 flex justify-center py-8 px-4 md:px-10">
                <div className="flex flex-col max-w-[1200px] w-full flex-1 gap-8">
                    {/* Page Header */}
                    <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#282839] pb-6">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-[#1313ec] text-sm font-bold uppercase tracking-wider">
                                <span className="material-symbols-outlined text-sm">monitor_heart</span>
                                Physical Dimension
                            </div>
                            <h1 className="dark:text-white text-slate-900 text-4xl font-black leading-tight tracking-[-0.033em]">Biometric Sync Hub</h1>
                            <p className="text-[#9d9db9] text-base font-normal max-w-2xl">
                                Centralize your physical inputs from wearables to power your 9-axis development profile.
                            </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <button className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-5 bg-[#1313ec] hover:bg-[#1313ec]/90 transition text-white text-sm font-bold leading-normal tracking-[0.015em] shadow-[0_0_15px_rgba(19,19,236,0.3)]">
                                <span className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">sync</span>
                                    Sync Now
                                </span>
                            </button>
                            <span className="text-xs text-[#9d9db9] mt-1">Last synced: 2 mins ago</span>
                        </div>
                    </header>

                    {/* Dashboard Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* Left Column: Data Ingestion (Span 4) */}
                        <div className="lg:col-span-4 flex flex-col gap-6">
                            {/* Wearable Connections Card */}
                            <div className="rounded-xl border border-[#282839] bg-white dark:bg-[#1c1c27] p-5 flex flex-col gap-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="dark:text-white text-slate-900 text-lg font-bold">Data Sources</h3>
                                    <span className="material-symbols-outlined text-[#9d9db9]" title="Manage Sources">settings</span>
                                </div>
                                {/* Garmin (Connected) */}
                                <div className="flex items-center gap-4 rounded-lg border border-[#3b3b54] bg-[#f6f6f8] dark:bg-[#15151e] p-4 group hover:border-[#1313ec]/40 transition-colors cursor-pointer">
                                    <div className="flex items-center justify-center size-10 rounded-full bg-[#282839] text-white">
                                        <span className="material-symbols-outlined">watch</span>
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <h4 className="dark:text-white text-slate-900 text-sm font-bold">Garmin Connect</h4>
                                        <p className="text-[#0bda68] text-xs font-medium flex items-center gap-1">
                                            <span className="size-1.5 rounded-full bg-[#0bda68]"></span> Connected
                                        </p>
                                    </div>
                                    <div className="custom-toggle">
                                        <span className="material-symbols-outlined text-[#1313ec]">toggle_on</span>
                                    </div>
                                </div>
                                {/* Apple Health (Disconnected) */}
                                <div className="flex items-center gap-4 rounded-lg border border-[#3b3b54] bg-[#f6f6f8] dark:bg-[#15151e] p-4 group hover:border-white/20 transition-colors cursor-pointer opacity-80">
                                    <div className="flex items-center justify-center size-10 rounded-full bg-[#282839] text-white">
                                        <span className="material-symbols-outlined">health_and_safety</span>
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <h4 className="dark:text-white text-slate-900 text-sm font-bold">Apple Health</h4>
                                        <p className="text-[#9d9db9] text-xs font-medium">Disconnected</p>
                                    </div>
                                    <div className="custom-toggle">
                                        <span className="material-symbols-outlined text-[#9d9db9]">toggle_off</span>
                                    </div>
                                </div>
                                {/* Fitbit (Disconnected) */}
                                <div className="flex items-center gap-4 rounded-lg border border-[#3b3b54] bg-[#f6f6f8] dark:bg-[#15151e] p-4 group hover:border-white/20 transition-colors cursor-pointer opacity-80">
                                    <div className="flex items-center justify-center size-10 rounded-full bg-[#282839] text-white">
                                        <span className="material-symbols-outlined">directions_run</span>
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <h4 className="dark:text-white text-slate-900 text-sm font-bold">Fitbit</h4>
                                        <p className="text-[#9d9db9] text-xs font-medium">Disconnected</p>
                                    </div>
                                    <div className="custom-toggle">
                                        <span className="material-symbols-outlined text-[#9d9db9]">toggle_off</span>
                                    </div>
                                </div>
                                <div className="mt-2 pt-4 border-t border-[#282839] flex items-center justify-center gap-2 text-xs text-[#9d9db9]">
                                    <span className="material-symbols-outlined text-[14px]">lock</span>
                                    <span>Data encrypted & locally processed</span>
                                </div>
                            </div>

                            {/* 9-Axis Impact Card */}
                            <div className="rounded-xl border border-[#282839] bg-white dark:bg-[#1c1c27] p-5 flex flex-col gap-4 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                    <span className="material-symbols-outlined text-8xl">radar</span>
                                </div>
                                <div className="flex flex-col gap-1 z-10">
                                    <h3 className="dark:text-white text-slate-900 text-lg font-bold">Physical Impact</h3>
                                    <p className="text-[#9d9db9] text-sm">Contribution to 9-Axis Profile</p>
                                </div>
                                <div className="flex items-center gap-6 py-2 z-10">
                                    {/* Circular Progress Simulation */}
                                    <div className="relative size-24 flex items-center justify-center">
                                        <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                                            <path className="text-[#282839]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4"></path>
                                            <path className="text-[#1313ec] drop-shadow-[0_0_4px_rgba(19,19,236,0.8)]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="75, 100" strokeLinecap="round" strokeWidth="4"></path>
                                        </svg>
                                        <div className="absolute flex flex-col items-center">
                                            <span className="text-xl font-bold dark:text-white text-slate-900">75%</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 flex-1">
                                        <div className="flex justify-between text-xs dark:text-white text-slate-900">
                                            <span>Growth</span>
                                            <span className="text-[#0bda68]">+12%</span>
                                        </div>
                                        <div className="w-full bg-[#282839] rounded-full h-1.5">
                                            <div className="bg-[#0bda68] h-1.5 rounded-full" style={{ width: '60%' }}></div>
                                        </div>
                                        <div className="text-xs text-[#9d9db9] mt-1">
                                            High HRV is boosting your resilience score.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Data Interpretation (Span 8) */}
                        <div className="lg:col-span-8 flex flex-col gap-6">
                            {/* AI Energy Optimization Engine */}
                            <div className="relative rounded-xl border border-[#1313ec]/30 bg-gradient-to-br from-white dark:from-[#1c1c27] to-[#0f0f25] p-6 shadow-[0_0_30px_rgba(19,19,236,0.1)] overflow-hidden">
                                {/* Background decoration */}
                                <div className="absolute -right-10 -top-10 size-40 bg-[#1313ec]/20 blur-[60px] rounded-full pointer-events-none"></div>
                                <div className="relative z-10 flex flex-col md:flex-row gap-6">
                                    <div className="shrink-0 flex items-start">
                                        <div className="size-12 rounded-lg bg-[#1313ec]/20 flex items-center justify-center text-[#1313ec] shadow-[0_0_15px_rgba(19,19,236,0.3)] border border-[#1313ec]/20">
                                            <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 flex flex-col gap-3">
                                        <div className="flex flex-wrap justify-between items-start gap-2">
                                            <div>
                                                <h3 className="text-lg font-bold dark:text-white text-slate-900">PPSDM Energy Forecast</h3>
                                                <p className="text-sm text-[#1313ec] font-medium tracking-wide uppercase mt-1">AI Optimized Study Window</p>
                                            </div>
                                            <div className="px-3 py-1 bg-[#282839] rounded border border-white/10 text-white text-sm font-bold">
                                                Today
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-lg bg-black/5 dark:bg-black/20 border border-black/5 dark:border-white/5 backdrop-blur-sm">
                                            <p className="dark:text-white text-slate-900 text-base leading-relaxed">
                                                Based on your high sleep quality and morning HRV spike, your cognitive peak is predicted between <strong className="text-[#1313ec] text-lg">09:00 - 11:30</strong>.
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-[#9d9db9]">
                                            <span className="material-symbols-outlined text-sm">lightbulb</span>
                                            <span>Suggestion: Schedule your hardest analysis module during this window.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Main Metrics Row */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Active Hours */}
                                <div className="flex flex-col gap-3 rounded-xl p-5 border border-[#282839] bg-white dark:bg-[#1c1c27]">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[#9d9db9] text-sm font-medium">Active Hours</p>
                                        <span className="material-symbols-outlined text-[#9d9db9] text-[20px]">directions_walk</span>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <p className="dark:text-white text-slate-900 text-3xl font-bold tracking-tight">6.5 <span className="text-lg font-normal text-[#9d9db9]">hrs</span></p>
                                    </div>
                                    <div className="flex items-center gap-2 mt-auto">
                                        <div className="px-2 py-0.5 rounded bg-[#0bda68]/10 text-[#0bda68] text-xs font-bold flex items-center gap-0.5">
                                            <span className="material-symbols-outlined text-[12px]">trending_up</span> +10%
                                        </div>
                                        <span className="text-xs text-[#9d9db9]">vs yesterday</span>
                                    </div>
                                </div>
                                {/* Sleep Quality */}
                                <div className="flex flex-col gap-3 rounded-xl p-5 border border-[#282839] bg-white dark:bg-[#1c1c27]">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[#9d9db9] text-sm font-medium">Sleep Quality</p>
                                        <span className="material-symbols-outlined text-[#9d9db9] text-[20px]">bedtime</span>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <p className="dark:text-white text-slate-900 text-3xl font-bold tracking-tight">85 <span className="text-lg font-normal text-[#9d9db9]">/100</span></p>
                                    </div>
                                    <div className="flex items-center gap-2 mt-auto">
                                        <div className="px-2 py-0.5 rounded bg-[#0bda68]/10 text-[#0bda68] text-xs font-bold flex items-center gap-0.5">
                                            <span className="material-symbols-outlined text-[12px]">trending_up</span> +5%
                                        </div>
                                        <span className="text-xs text-[#9d9db9]">Restful</span>
                                    </div>
                                </div>
                                {/* HRV */}
                                <div className="flex flex-col gap-3 rounded-xl p-5 border border-[#282839] bg-white dark:bg-[#1c1c27]">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[#9d9db9] text-sm font-medium">Heart Rate Var.</p>
                                        <span className="material-symbols-outlined text-[#9d9db9] text-[20px]">ecg_heart</span>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <p className="dark:text-white text-slate-900 text-3xl font-bold tracking-tight">42 <span className="text-lg font-normal text-[#9d9db9]">ms</span></p>
                                    </div>
                                    <div className="flex items-center gap-2 mt-auto">
                                        <div className="px-2 py-0.5 rounded bg-[#fa6938]/10 text-[#fa6938] text-xs font-bold flex items-center gap-0.5">
                                            <span className="material-symbols-outlined text-[12px]">trending_down</span> -2%
                                        </div>
                                        <span className="text-xs text-[#9d9db9]">High Readiness</span>
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Visualization Chart */}
                            <div className="flex flex-col rounded-xl border border-[#282839] bg-white dark:bg-[#1c1c27] p-6 h-full min-h-[300px]">
                                <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                                    <div>
                                        <h3 className="dark:text-white text-slate-900 text-lg font-bold">Activity vs. Readiness</h3>
                                        <p className="text-[#9d9db9] text-sm">Correlating your physical exertion with recovery</p>
                                    </div>
                                    <div className="flex bg-[#111118] p-1 rounded-lg">
                                        <button className="px-3 py-1 rounded bg-[#282839] text-white text-xs font-bold">Day</button>
                                        <button className="px-3 py-1 rounded text-[#9d9db9] hover:text-white text-xs font-bold transition">Week</button>
                                        <button className="px-3 py-1 rounded text-[#9d9db9] hover:text-white text-xs font-bold transition">Month</button>
                                    </div>
                                </div>
                                {/* CSS Chart Representation */}
                                <div className="flex-1 w-full flex items-end justify-between gap-2 md:gap-4 relative pt-10">
                                    {/* Grid lines */}
                                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                                        <div className="w-full h-px bg-[#282839] border-t border-dashed border-[#3b3b54]"></div>
                                        <div className="w-full h-px bg-[#282839] border-t border-dashed border-[#3b3b54]"></div>
                                        <div className="w-full h-px bg-[#282839] border-t border-dashed border-[#3b3b54]"></div>
                                        <div className="w-full h-px bg-[#282839] border-t border-dashed border-[#3b3b54]"></div>
                                        <div className="w-full h-px bg-[#282839]"></div>
                                    </div>
                                    {/* Bars */}
                                    <div className="relative z-10 w-full bg-[#3b3b54] rounded-t-sm h-[40%] hover:bg-[#1313ec]/50 transition-all group">
                                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black text-xs text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">Mon</div>
                                    </div>
                                    <div className="relative z-10 w-full bg-[#3b3b54] rounded-t-sm h-[55%] hover:bg-[#1313ec]/50 transition-all group"></div>
                                    <div className="relative z-10 w-full bg-[#3b3b54] rounded-t-sm h-[45%] hover:bg-[#1313ec]/50 transition-all group"></div>
                                    <div className="relative z-10 w-full bg-[#3b3b54] rounded-t-sm h-[70%] hover:bg-[#1313ec]/50 transition-all group"></div>
                                    <div className="relative z-10 w-full bg-[#1313ec] rounded-t-sm h-[85%] shadow-[0_0_20px_rgba(19,19,236,0.4)] group">
                                        <div className="absolute top-2 left-1/2 -translate-x-1/2 size-2 bg-white rounded-full animate-pulse"></div>
                                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold px-2 py-1 rounded">Today</div>
                                    </div>
                                    <div className="relative z-10 w-full bg-[#3b3b54]/30 rounded-t-sm h-[60%] border border-[#3b3b54] border-dashed"></div>
                                    <div className="relative z-10 w-full bg-[#3b3b54]/30 rounded-t-sm h-[50%] border border-[#3b3b54] border-dashed"></div>
                                </div>
                                <div className="flex justify-between text-xs text-[#9d9db9] mt-2 px-1">
                                    <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span className="text-[#1313ec] font-bold">Fri</span><span>Sat</span><span>Sun</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>
        </div>
    );
}
