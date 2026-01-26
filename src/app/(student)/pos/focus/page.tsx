"use client";

import React from 'react';

export default function HabitForgePage() {
    return (
        <div className="bg-[#f6f6f8] dark:bg-[#101622] text-slate-900 dark:text-white font-[family-name:var(--font-inter)] overflow-hidden flex h-screen w-full">
            {/* Sidebar */}
            <div className="hidden md:flex w-64 flex-col bg-[#111318] border-r border-[#282e39]">
                <div className="flex flex-col h-full p-4 justify-between">
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col px-2">
                            <h1 className="text-white text-lg font-bold tracking-tight">POS System</h1>
                            <p className="text-[#9da6b9] text-xs font-normal">PPSDM KMM</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#9da6b9] hover:bg-[#282e39] hover:text-white transition-colors group" href="#">
                                <span className="material-symbols-outlined text-[20px] group-hover:text-white">dashboard</span>
                                <p className="text-sm font-medium">Dashboard</p>
                            </a>
                            <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#135bec]/10 text-[#135bec] transition-colors" href="#">
                                <span className="material-symbols-outlined text-[20px] fill-1">local_fire_department</span>
                                <p className="text-sm font-bold">Habit Forge</p>
                            </a>
                            <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#9da6b9] hover:bg-[#282e39] hover:text-white transition-colors group" href="#">
                                <span className="material-symbols-outlined text-[20px] group-hover:text-white">monitoring</span>
                                <p className="text-sm font-medium">Energy Analytics</p>
                            </a>
                            <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#9da6b9] hover:bg-[#282e39] hover:text-white transition-colors group" href="#">
                                <span className="material-symbols-outlined text-[20px] group-hover:text-white">settings</span>
                                <p className="text-sm font-medium">Settings</p>
                            </a>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#282e39]/50 border border-[#282e39]">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#135bec] to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                                JD
                            </div>
                            <div className="flex flex-col">
                                <p className="text-white text-sm font-medium">Jane Doe</p>
                                <p className="text-[#9da6b9] text-xs">Pro Plan</p>
                            </div>
                        </div>
                        <button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg h-10 px-4 bg-[#282e39] hover:bg-[#333b49] text-white text-sm font-medium transition-colors">
                            <span className="material-symbols-outlined text-[18px]">logout</span>
                            <span>Log Out</span>
                        </button>
                    </div>
                </div>
            </div>
            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Top Header */}
                <header className="h-16 border-b border-[#282e39] bg-[#111318]/95 backdrop-blur flex items-center justify-between px-6 shrink-0 z-10">
                    <div className="flex items-center gap-3">
                        <button className="md:hidden text-white">
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <h2 className="text-white text-lg font-semibold">Habit Forge & Energy Analytics</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1e293b] rounded-full border border-[#282e39]">
                            <span className="block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-xs text-[#9da6b9] font-medium">System Online</span>
                        </div>
                        <button className="text-[#9da6b9] hover:text-white">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                    </div>
                </header>
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10 scroll-smooth">
                    <div className="max-w-7xl mx-auto flex flex-col gap-8">
                        {/* Intro Section */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                            <div className="max-w-2xl">
                                <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">Consistency & Bio-Rhythms</h1>
                                <p className="text-[#9da6b9] text-base font-normal leading-relaxed">
                                    Track your long-term consistency and optimize your daily energy levels. Identify the correlation between your sleep patterns and peak productivity hours.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <div className="flex flex-col items-center bg-[#1e293b] px-5 py-3 rounded-xl border border-[#282e39]">
                                    <span className="text-xs text-[#9da6b9] uppercase font-bold tracking-wider">Current Streak</span>
                                    <div className="flex items-center gap-1 text-white">
                                        <span className="material-symbols-outlined text-orange-500 text-[20px] fill-1">local_fire_department</span>
                                        <span className="text-2xl font-bold">12</span>
                                        <span className="text-sm text-[#9da6b9] self-end mb-1">days</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center bg-[#1e293b] px-5 py-3 rounded-xl border border-[#282e39]">
                                    <span className="text-xs text-[#9da6b9] uppercase font-bold tracking-wider">Comp. Rate</span>
                                    <div className="flex items-center gap-1 text-white">
                                        <span className="material-symbols-outlined text-green-500 text-[20px]">check_circle</span>
                                        <span className="text-2xl font-bold">85%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Dashboard Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* LEFT COLUMN: HABIT FORGE (Span 7) */}
                            <div className="lg:col-span-7 flex flex-col gap-6">
                                {/* Heatmap Card */}
                                <div className="bg-[#1e293b] rounded-xl border border-[#282e39] p-6 shadow-sm">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-white text-lg font-bold flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[#135bec]">calendar_month</span>
                                            Consistency Heatmap
                                        </h3>
                                        <div className="flex items-center gap-2 text-xs text-[#9da6b9]">
                                            <span>Less</span>
                                            <div className="w-3 h-3 bg-[#334155] rounded-sm"></div>
                                            <div className="w-3 h-3 bg-[#135bec]/40 rounded-sm"></div>
                                            <div className="w-3 h-3 bg-[#135bec]/70 rounded-sm"></div>
                                            <div className="w-3 h-3 bg-[#135bec] rounded-sm"></div>
                                            <span>More</span>
                                        </div>
                                    </div>
                                    {/* Github Style Grid Simulation */}
                                    <div className="w-full overflow-x-auto pb-2">
                                        <div className="min-w-[600px] flex flex-col gap-1">
                                            {/* Days Labels */}
                                            <div className="flex text-[10px] text-[#64748b] mb-1 pl-8 justify-between w-full">
                                                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => <span key={month}>{month}</span>)}
                                            </div>
                                            <div className="flex gap-2">
                                                {/* Row Labels */}
                                                <div className="flex flex-col justify-between text-[10px] text-[#64748b] pt-1 h-[110px]">
                                                    <span>Mon</span>
                                                    <span>Wed</span>
                                                    <span>Fri</span>
                                                </div>
                                                {/* The Grid - Simulated with React */}
                                                <div className="grid grid-rows-7 grid-flow-col gap-1 flex-1 h-[110px]" id="heatmap-grid">
                                                    {Array.from({ length: 364 }).map((_, i) => {
                                                        const colors = ['bg-[#334155]', 'bg-[#334155]', 'bg-[#334155]', 'bg-[#135bec]/30', 'bg-[#135bec]/60', 'bg-[#135bec]'];
                                                        const color = colors[Math.floor(Math.random() * colors.length)];
                                                        return <div key={i} className={`w-3 h-3 rounded-sm ${color} hover:ring-1 hover:ring-white cursor-pointer transition-all`} title="Activity Level"></div>;
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Habit Checklist */}
                                <div className="bg-[#1e293b] rounded-xl border border-[#282e39] p-6 shadow-sm flex flex-col h-full">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-white text-lg font-bold">Today's Habits</h3>
                                        <button className="text-[#135bec] text-sm font-medium hover:text-blue-400 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[16px]">add</span> Add Habit
                                        </button>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        {/* Item 1 */}
                                        <label className="group flex items-center justify-between p-3 rounded-lg bg-[#111318] border border-[#282e39] hover:border-[#135bec]/50 transition-colors cursor-pointer select-none">
                                            <div className="flex items-center gap-4">
                                                <input defaultChecked className="w-5 h-5 rounded border-[#3b4354] bg-transparent text-[#135bec] focus:ring-0 focus:ring-offset-0 transition-colors" type="checkbox" />
                                                <div className="flex flex-col">
                                                    <span className="text-white text-base font-medium group-hover:text-[#135bec] transition-colors decoration-2 peer-checked:line-through">Deep Work Session (2h)</span>
                                                    <span className="text-[#64748b] text-xs">09:00 AM - 11:00 AM</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 bg-orange-500/10 px-2 py-1 rounded text-orange-500">
                                                <span className="material-symbols-outlined text-[16px] fill-1">local_fire_department</span>
                                                <span className="text-xs font-bold">12</span>
                                            </div>
                                        </label>
                                        {/* Item 2 */}
                                        <label className="group flex items-center justify-between p-3 rounded-lg bg-[#111318] border border-[#282e39] hover:border-[#135bec]/50 transition-colors cursor-pointer select-none">
                                            <div className="flex items-center gap-4">
                                                <input className="w-5 h-5 rounded border-[#3b4354] bg-transparent text-[#135bec] focus:ring-0 focus:ring-offset-0 transition-colors" type="checkbox" />
                                                <div className="flex flex-col">
                                                    <span className="text-white text-base font-medium group-hover:text-[#135bec] transition-colors">Hydration (2L)</span>
                                                    <span className="text-[#64748b] text-xs"> throughout the day</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 bg-[#282e39] px-2 py-1 rounded text-[#9da6b9]">
                                                <span className="material-symbols-outlined text-[16px]">local_fire_department</span>
                                                <span className="text-xs font-bold">0</span>
                                            </div>
                                        </label>
                                        {/* Item 3 */}
                                        <label className="group flex items-center justify-between p-3 rounded-lg bg-[#111318] border border-[#282e39] hover:border-[#135bec]/50 transition-colors cursor-pointer select-none">
                                            <div className="flex items-center gap-4">
                                                <input className="w-5 h-5 rounded border-[#3b4354] bg-transparent text-[#135bec] focus:ring-0 focus:ring-offset-0 transition-colors" type="checkbox" />
                                                <div className="flex flex-col">
                                                    <span className="text-white text-base font-medium group-hover:text-[#135bec] transition-colors">Code Review</span>
                                                    <span className="text-[#64748b] text-xs">Before 5 PM</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 bg-orange-500/10 px-2 py-1 rounded text-orange-500">
                                                <span className="material-symbols-outlined text-[16px] fill-1">local_fire_department</span>
                                                <span className="text-xs font-bold">5</span>
                                            </div>
                                        </label>
                                        {/* Item 4 */}
                                        <label className="group flex items-center justify-between p-3 rounded-lg bg-[#111318] border border-[#282e39] hover:border-[#135bec]/50 transition-colors cursor-pointer select-none">
                                            <div className="flex items-center gap-4">
                                                <input className="w-5 h-5 rounded border-[#3b4354] bg-transparent text-[#135bec] focus:ring-0 focus:ring-offset-0 transition-colors" type="checkbox" />
                                                <div className="flex flex-col">
                                                    <span className="text-white text-base font-medium group-hover:text-[#135bec] transition-colors">Read Technical Paper</span>
                                                    <span className="text-[#64748b] text-xs">Evening Routine</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 bg-orange-500/10 px-2 py-1 rounded text-orange-500">
                                                <span className="material-symbols-outlined text-[16px] fill-1">local_fire_department</span>
                                                <span className="text-xs font-bold">3</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                                {/* Habit Pairing Suggestion */}
                                <div className="bg-gradient-to-r from-[#1e293b] to-[#1e293b] border border-[#282e39] rounded-xl p-1 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#135bec]/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                                    <div className="bg-[#111318]/80 backdrop-blur-sm rounded-lg p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                                <span className="material-symbols-outlined">lightbulb</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <p className="text-xs text-[#9da6b9] uppercase font-bold tracking-wide">Habit Pairing Suggestion</p>
                                                <p className="text-white font-medium">After <span className="text-[#135bec]">Morning Standup</span>, immediately <span className="text-[#135bec]">Update Jira Status</span>.</p>
                                            </div>
                                        </div>
                                        <button className="px-4 py-2 bg-[#135bec]/20 hover:bg-[#135bec]/30 text-[#135bec] border border-[#135bec]/20 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap">
                                            Add to Routine
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {/* RIGHT COLUMN: ENERGY ANALYTICS (Span 5) */}
                            <div className="lg:col-span-5 flex flex-col gap-6">
                                {/* Daily Logger */}
                                <div className="bg-[#1e293b] rounded-xl border border-[#282e39] p-6 shadow-sm">
                                    <h3 className="text-white text-lg font-bold mb-5 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[#135bec]">edit_note</span>
                                        Log Today's Stats
                                    </h3>
                                    <div className="flex flex-col gap-6">
                                        {/* Energy Slider */}
                                        <div className="flex flex-col gap-2">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-white font-medium">Energy Level</span>
                                                <span className="text-[#135bec] font-bold bg-[#135bec]/10 px-2 py-0.5 rounded">7/10</span>
                                            </div>
                                            <div className="relative w-full h-6 flex items-center">
                                                <input className="w-full h-2 bg-[#334155] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#135bec] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgba(19,91,236,0.3)] hover:[&::-webkit-slider-thumb]:scale-110 transition-all" max="10" min="1" type="range" defaultValue="7" />
                                            </div>
                                            <div className="flex justify-between text-[10px] text-[#64748b]">
                                                <span>Lethargic</span>
                                                <span>Active</span>
                                                <span>Peak</span>
                                            </div>
                                        </div>
                                        {/* Sleep Slider */}
                                        <div className="flex flex-col gap-2">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-white font-medium">Sleep Duration</span>
                                                <span className="text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded">6.5 hrs</span>
                                            </div>
                                            <div className="relative w-full h-6 flex items-center">
                                                <input className="w-full h-2 bg-[#334155] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgba(168,85,247,0.3)] hover:[&::-webkit-slider-thumb]:scale-110 transition-all" max="12" min="0" step="0.5" type="range" defaultValue="6.5" />
                                            </div>
                                            <div className="flex justify-between text-[10px] text-[#64748b]">
                                                <span>0h</span>
                                                <span>4h</span>
                                                <span>8h</span>
                                                <span>12h+</span>
                                            </div>
                                        </div>
                                        <button className="w-full py-2.5 rounded-lg bg-[#135bec] hover:bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-900/20 transition-all mt-2">
                                            Save Logs
                                        </button>
                                    </div>
                                </div>
                                {/* Peak Zone */}
                                <div className="bg-[#1e293b] rounded-xl border border-[#282e39] p-6 shadow-sm relative overflow-hidden">
                                    <h3 className="text-white text-lg font-bold mb-1">Peak Zone</h3>
                                    <p className="text-[#9da6b9] text-sm mb-6">Based on your logs, you are most productive between:</p>
                                    <div className="flex items-center justify-center gap-8">
                                        {/* Radial Gauge Simulation with CSS Conic Gradient */}
                                        <div className="relative w-32 h-32 rounded-full flex items-center justify-center" style={{ background: 'conic-gradient(#135bec 0% 70%, #334155 70% 100%)' }}>
                                            <div className="absolute w-28 h-28 bg-[#1e293b] rounded-full flex flex-col items-center justify-center">
                                                <span className="material-symbols-outlined text-yellow-400 mb-1">bolt</span>
                                                <span className="text-white text-xs font-bold">10 AM</span>
                                                <span className="text-[#9da6b9] text-[10px]">-</span>
                                                <span className="text-white text-xs font-bold">1 PM</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-start gap-2">
                                                <div className="mt-1 w-2 h-2 rounded-full bg-green-500"></div>
                                                <div>
                                                    <p className="text-white text-sm font-bold">Deep Work</p>
                                                    <p className="text-[#64748b] text-xs">Schedule hard tasks here</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <div className="mt-1 w-2 h-2 rounded-full bg-yellow-500"></div>
                                                <div>
                                                    <p className="text-white text-sm font-bold">Meetings</p>
                                                    <p className="text-[#64748b] text-xs">Avoid if possible</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Correlation Chart */}
                                <div className="bg-[#1e293b] rounded-xl border border-[#282e39] p-6 shadow-sm flex flex-col grow">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 className="text-white text-lg font-bold">Sleep vs. Energy</h3>
                                            <p className="text-[#9da6b9] text-xs">Last 7 days correlation</p>
                                        </div>
                                        <div className="flex gap-2 text-xs">
                                            <span className="flex items-center gap-1 text-[#9da6b9]"><span className="w-2 h-2 rounded-full bg-purple-500"></span> Sleep</span>
                                            <span className="flex items-center gap-1 text-[#9da6b9]"><span className="w-2 h-2 rounded-full bg-[#135bec]"></span> Energy</span>
                                        </div>
                                    </div>
                                    {/* SVG Chart Simulation */}
                                    <div className="w-full h-48 relative mt-auto">
                                        {/* Grid Lines */}
                                        <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-[#475569]">
                                            <div className="border-b border-[#334155] w-full h-0"></div>
                                            <div className="border-b border-[#334155]/50 w-full h-0"></div>
                                            <div className="border-b border-[#334155]/50 w-full h-0"></div>
                                            <div className="border-b border-[#334155]/50 w-full h-0"></div>
                                            <div className="border-b border-[#334155] w-full h-0"></div>
                                        </div>
                                        <svg className="absolute inset-0 w-full h-full p-1" preserveAspectRatio="none" viewBox="0 0 100 100">
                                            {/* Sleep Line (Purple) */}
                                            <path d="M0,70 Q15,60 25,40 T50,30 T75,50 T100,20" fill="none" stroke="#a855f7" strokeLinecap="round" strokeWidth="2"></path>
                                            {/* Sleep Area */}
                                            <path d="M0,70 Q15,60 25,40 T50,30 T75,50 T100,20 V100 H0 Z" fill="url(#gradientSleep)" opacity="0.2"></path>
                                            {/* Energy Line (Blue) */}
                                            <path d="M0,60 Q15,50 25,30 T50,20 T75,45 T100,10" fill="none" filter="drop-shadow(0px 2px 4px rgba(19,91,236,0.5))" stroke="#135bec" strokeLinecap="round" strokeWidth="3"></path>
                                            <defs>
                                                <linearGradient id="gradientSleep" x1="0%" x2="0%" y1="0%" y2="100%">
                                                    <stop offset="0%" stopColor="#a855f7" stopOpacity="1"></stop>
                                                    <stop offset="100%" stopColor="#a855f7" stopOpacity="0"></stop>
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                        {/* Tooltip simulation */}
                                        <div className="absolute top-[15%] left-[48%] bg-white text-slate-900 text-[10px] font-bold px-2 py-1 rounded shadow-lg transform -translate-x-1/2 -translate-y-1/2 z-10 hidden group-hover:block">
                                            Energy Peak
                                        </div>
                                    </div>
                                    {/* X Axis */}
                                    <div className="flex justify-between text-[10px] text-[#64748b] mt-2 px-1">
                                        <span>Mon</span>
                                        <span>Tue</span>
                                        <span>Wed</span>
                                        <span>Thu</span>
                                        <span>Fri</span>
                                        <span>Sat</span>
                                        <span>Sun</span>
                                    </div>
                                    <div className="mt-4 p-3 bg-[#135bec]/10 rounded-lg border border-[#135bec]/20">
                                        <p className="text-xs text-[#135bec] font-medium flex gap-2 items-start">
                                            <span className="material-symbols-outlined text-[16px]">auto_graph</span>
                                            Insight: You report 20% higher energy levels when you sleep more than 7 hours.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx global>{`
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .material-symbols-outlined.fill-1 {
            font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>
        </div>
    );
}
