"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function StudentPersonalOSPage() {
    return (
        <div className="bg-background-dark text-white min-h-screen flex flex-col font-sans">
            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto relative custom-scrollbar">
                {/* Top Bar */}
                <header className="flex items-center justify-between px-8 py-5 border-b border-white/10 bg-background-dark/80 backdrop-blur-md sticky top-0 z-30">
                    <div className="flex flex-col">
                        <motion.h2
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-white text-2xl font-bold font-grotesk leading-tight"
                        >
                            Personal Dashboard
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-slate-400 text-sm"
                        >
                            Welcome back, Student. Ready to learn?
                        </motion.p>
                    </div>
                    <div className="flex items-center gap-6">
                        {/* Search Bar */}
                        <div className="hidden md:flex items-center h-11 bg-white/5 border border-white/10 rounded-xl px-4 w-80 focus-within:border-brand-blue/50 focus-within:ring-1 focus-within:ring-brand-blue/50 transition-all">
                            <span className="material-symbols-outlined text-slate-400">search</span>
                            <input className="bg-transparent border-none text-white placeholder-slate-500 text-sm w-full focus:ring-0 ml-2" placeholder="Search modules, tasks, or RPI..." type="text" />
                            <div className="hidden xl:flex items-center gap-1 ml-auto">
                                <kbd className="hidden bg-white/10 px-1.5 py-0.5 rounded text-[10px] text-slate-400 font-mono">⌘</kbd>
                                <kbd className="hidden bg-white/10 px-1.5 py-0.5 rounded text-[10px] text-slate-400 font-mono">K</kbd>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/10">
                                <span className="material-symbols-outlined">notifications</span>
                                <span className="absolute top-2 right-2 size-2 bg-brand-accent rounded-full border-2 border-background-dark"></span>
                            </button>
                        </div>
                    </div>
                </header>

                <div className="p-8 pb-20 max-w-[1600px] mx-auto w-full">
                    {/* Bento Grid Layout */}
                    <div className="grid grid-cols-12 gap-6 auto-rows-[minmax(100px,auto)]">
                        {/* 1. Holistic Radar Widget (Main Feature) */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="col-span-12 lg:col-span-8 bg-card-dark rounded-2xl border border-white/10 p-6 flex flex-col relative overflow-hidden group glass-card"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                            <div className="flex justify-between items-start mb-6 z-10">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="material-symbols-outlined text-brand-accent text-xl">radar</span>
                                        <h3 className="text-white text-lg font-bold font-grotesk">Holistic Development Radar</h3>
                                    </div>
                                    <p className="text-slate-400 text-sm">9-Axis Assessment: Current vs Target Goal</p>
                                </div>
                                <div className="flex gap-2 bg-black/20 p-1 rounded-lg border border-white/10">
                                    <button className="px-3 py-1 text-xs font-medium bg-brand-blue/20 text-white rounded shadow-sm">Analysis</button>
                                    <button className="px-3 py-1 text-xs font-medium text-slate-400 hover:text-white transition-colors">History</button>
                                </div>
                            </div>
                            <div className="flex flex-col lg:flex-row flex-1 gap-8 items-center justify-center relative z-10">
                                {/* Chart Area */}
                                <div className="flex-1 max-w-[500px] h-[320px] relative flex items-center justify-center">
                                    {/* Custom SVG Spider Chart simulation */}
                                    <svg className="w-full h-full drop-shadow-2xl" viewBox="0 0 400 360">
                                        {/* Grid Lines (Pentagons) */}
                                        <g className="stroke-white/10" fill="none" strokeWidth="1">
                                            <polygon opacity="0.3" points="200,40 350,130 310,290 90,290 50,130"></polygon>
                                            <polygon opacity="0.5" points="200,80 300,140 270,250 130,250 100,140"></polygon>
                                            <polygon opacity="0.7" points="200,120 250,150 230,210 170,210 150,150"></polygon>
                                        </g>
                                        {/* Axes Labels */}
                                        <g className="text-[10px] font-bold fill-slate-400 font-grotesk" textAnchor="middle">
                                            <text x="200" y="25">Leadership</text>
                                            <text x="375" y="130">Tech</text>
                                            <text x="330" y="310">Global</text>
                                            <text x="70" y="310">Ethics</text>
                                            <text x="25" y="130">Research</text>
                                        </g>
                                        {/* Target Area (Gold) */}
                                        <polygon fill="none" opacity="0.6" points="200,50 340,135 300,280 100,280 60,135" stroke="#FFBD07" strokeDasharray="4 4" strokeWidth="2"></polygon>
                                        {/* Current Area (Blue - Filled) */}
                                        <polygon fill="rgba(19, 91, 236, 0.5)" points="200,90 310,145 270,250 120,260 90,150" stroke="#135bec" strokeWidth="3"></polygon>
                                        {/* Data Points */}
                                        <circle cx="200" cy="90" fill="#135bec" r="4" stroke="white" strokeWidth="2"></circle>
                                        <circle cx="310" cy="145" fill="#135bec" r="4" stroke="white" strokeWidth="2"></circle>
                                        <circle cx="270" cy="250" fill="#135bec" r="4" stroke="white" strokeWidth="2"></circle>
                                        <circle cx="120" cy="260" fill="#135bec" r="4" stroke="white" strokeWidth="2"></circle>
                                        <circle cx="90" cy="150" fill="#135bec" r="4" stroke="white" strokeWidth="2"></circle>
                                    </svg>
                                </div>
                                {/* Legend / Stats */}
                                <div className="flex flex-col gap-4 min-w-[180px]">
                                    <div className="p-3 rounded-xl bg-black/20 border border-white/10 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="size-3 rounded-full bg-brand-blue border border-white"></div>
                                            <span className="text-sm font-medium text-white">Current</span>
                                        </div>
                                        <span className="text-lg font-bold font-grotesk text-white">725</span>
                                    </div>
                                    <div className="p-3 rounded-xl bg-black/20 border border-white/10 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="size-3 rounded-full border-2 border-brand-accent border-dashed"></div>
                                            <span className="text-sm font-medium text-white">Target</span>
                                        </div>
                                        <span className="text-lg font-bold font-grotesk text-brand-accent">900</span>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-white/10">
                                        <p className="text-xs text-slate-400 mb-2">Focus Area:</p>
                                        <div className="flex items-center gap-2 text-white">
                                            <span className="material-symbols-outlined text-brand-accent text-sm">trending_up</span>
                                            <span className="font-bold">Tech Competency</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/10 rounded-full mt-2 overflow-hidden">
                                            <div className="h-full bg-brand-accent w-[65%] rounded-full"></div>
                                        </div>
                                        <p className="text-[10px] text-right text-slate-400 mt-1">+12% from last month</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                        {/* 2. Next Action AI Widget */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="col-span-12 lg:col-span-4 bg-card-dark rounded-2xl border border-white/10 p-6 flex flex-col glass-card"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-2">
                                    <div className="size-8 rounded-lg bg-gradient-to-br from-brand-blue to-blue-800 flex items-center justify-center shadow-lg shadow-brand-blue/20">
                                        <span className="material-symbols-outlined text-white text-sm">smart_toy</span>
                                    </div>
                                    <h3 className="text-white text-lg font-bold font-grotesk">Next Action AI</h3>
                                </div>
                                <button className="text-slate-400 hover:text-white transition-colors">
                                    <span className="material-symbols-outlined">more_horiz</span>
                                </button>
                            </div>
                            <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1">
                                {/* High Priority Item */}
                                <div className="p-3 rounded-xl bg-brand-blue/10 border border-brand-blue/30 flex items-start gap-3 group hover:bg-brand-blue/20 transition-all cursor-pointer">
                                    <div className="mt-1">
                                        <input className="rounded border-brand-blue/50 text-brand-blue bg-transparent focus:ring-offset-background-dark focus:ring-brand-blue size-4 cursor-pointer" type="checkbox" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-white font-medium text-sm leading-snug">Submit KMM Proposal</h4>
                                            <span className="text-[10px] font-bold text-brand-accent bg-brand-accent/10 px-1.5 py-0.5 rounded border border-brand-accent/20">Urgent</span>
                                        </div>
                                        <p className="text-xs text-slate-400 mt-1">Deadline: Due in 2 days</p>
                                    </div>
                                    <button className="opacity-0 group-hover:opacity-100 transition-opacity bg-brand-blue text-white text-[10px] px-2 py-1 rounded font-bold self-center">Start</button>
                                </div>
                                {/* Suggested Item */}
                                <div className="p-3 rounded-xl bg-black/20 border border-white/10 flex items-start gap-3 group hover:border-slate-500/30 transition-all cursor-pointer">
                                    <div className="mt-1">
                                        <input className="rounded border-white/10 text-brand-blue bg-transparent focus:ring-offset-background-dark focus:ring-brand-blue size-4 cursor-pointer" type="checkbox" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-white font-medium text-sm leading-snug">Review &apos;Data Structures&apos;</h4>
                                            <span className="text-[10px] font-bold text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded border border-green-400/20">Suggest</span>
                                        </div>
                                        <p className="text-xs text-slate-400 mt-1">Chapter 4 - Linked Lists</p>
                                    </div>
                                </div>
                                {/* Regular Item */}
                                <div className="p-3 rounded-xl bg-black/20 border border-white/10 flex items-start gap-3 group hover:border-slate-500/30 transition-all cursor-pointer">
                                    <div className="mt-1">
                                        <input className="rounded border-white/10 text-brand-blue bg-transparent focus:ring-offset-background-dark focus:ring-brand-blue size-4 cursor-pointer" type="checkbox" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-white font-medium text-sm leading-snug">Complete Reflection</h4>
                                        </div>
                                        <p className="text-xs text-slate-400 mt-1">Weekly self-assessment</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                        {/* 3. Animated Seno Mascot */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="col-span-12 lg:col-span-4 bg-gradient-to-br from-brand-blue to-background-dark rounded-2xl border border-brand-blue/30 p-6 flex items-center justify-between relative overflow-hidden"
                        >
                            {/* Background Decor */}
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                            <div className="flex-1 z-10">
                                <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-4 rounded-xl rounded-bl-none mb-2 shadow-lg">
                                    <p className="text-white text-sm italic">&quot;Don&apos;t forget to hydrate! You&apos;ve been coding for 2 hours straight.&quot;</p>
                                </div>
                                <p className="text-brand-accent font-bold text-xs uppercase tracking-wider pl-2">- Seno, Your Assistant</p>
                            </div>
                            <div className="w-24 h-24 shrink-0 relative z-10 flex items-center justify-center">
                                {/* Abstract Mascot Representation */}
                                <div className="w-20 h-20 bg-brand-accent rounded-full flex items-center justify-center relative animate-bounce" style={{ animationDuration: "3s" }}>
                                    <div className="w-16 h-12 bg-white rounded-full absolute bottom-4"></div>
                                    <div className="w-4 h-4 bg-black rounded-full absolute left-5 top-7"></div>
                                    <div className="w-4 h-4 bg-black rounded-full absolute right-5 top-7"></div>
                                    <div className="w-2 h-1 bg-pink-400 rounded-full absolute left-4 top-10 opacity-50"></div>
                                    <div className="w-2 h-1 bg-pink-400 rounded-full absolute right-4 top-10 opacity-50"></div>
                                </div>
                            </div>
                        </motion.div>
                        {/* 4. Productivity Dashboard */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.45 }}
                            className="col-span-12 lg:col-span-8 bg-card-dark rounded-2xl border border-white/10 p-6 glass-card"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-slate-400">timer</span>
                                    <h3 className="text-white text-lg font-bold font-grotesk">Productivity Hub</h3>
                                </div>
                                <div className="flex gap-4 text-sm text-slate-400">
                                    <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-brand-blue"></span> Study</span>
                                    <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-brand-accent"></span> Focus</span>
                                </div>
                            </div>
                            <div className="flex flex-col lg:flex-row gap-8 items-center lg:h-[180px]">
                                {/* Weekly Graph */}
                                <div className="flex-1 h-full w-full flex items-end justify-between gap-2 px-2">
                                    <div className="w-full flex flex-col justify-end gap-2 group cursor-pointer h-full">
                                        <div className="w-full bg-white/5 rounded-t-sm h-[30%] group-hover:bg-brand-blue/50 transition-colors"></div>
                                        <span className="text-xs text-slate-400 text-center">M</span>
                                    </div>
                                    <div className="w-full flex flex-col justify-end gap-2 group cursor-pointer h-full">
                                        <div className="w-full bg-white/5 rounded-t-sm h-[50%] group-hover:bg-brand-blue/50 transition-colors"></div>
                                        <span className="text-xs text-slate-400 text-center">T</span>
                                    </div>
                                    <div className="w-full flex flex-col justify-end gap-2 group cursor-pointer h-full">
                                        <div className="w-full bg-brand-blue rounded-t-sm h-[80%] shadow-[0_0_15px_rgba(19,91,236,0.5)]"></div>
                                        <span className="text-xs text-white font-bold text-center">W</span>
                                    </div>
                                    <div className="w-full flex flex-col justify-end gap-2 group cursor-pointer h-full">
                                        <div className="w-full bg-white/5 rounded-t-sm h-[40%] group-hover:bg-brand-blue/50 transition-colors"></div>
                                        <span className="text-xs text-slate-400 text-center">T</span>
                                    </div>
                                    <div className="w-full flex flex-col justify-end gap-2 group cursor-pointer h-full">
                                        <div className="w-full bg-white/5 rounded-t-sm h-[60%] group-hover:bg-brand-blue/50 transition-colors"></div>
                                        <span className="text-xs text-slate-400 text-center">F</span>
                                    </div>
                                    <div className="w-full flex flex-col justify-end gap-2 group cursor-pointer h-full">
                                        <div className="w-full bg-white/5 rounded-t-sm h-[20%] group-hover:bg-brand-blue/50 transition-colors"></div>
                                        <span className="text-xs text-slate-400 text-center">S</span>
                                    </div>
                                    <div className="w-full flex flex-col justify-end gap-2 group cursor-pointer h-full">
                                        <div className="w-full bg-white/5 rounded-t-sm h-[10%] group-hover:bg-brand-blue/50 transition-colors"></div>
                                        <span className="text-xs text-slate-400 text-center">S</span>
                                    </div>
                                </div>
                                {/* Divider */}
                                <div className="hidden lg:block w-px h-full bg-white/10"></div>
                                {/* Pomodoro Timer */}
                                <div className="w-64 shrink-0 flex flex-col items-center justify-center gap-4">
                                    <div className="relative size-32">
                                        <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                                            <path className="text-white/10" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2.5"></path>
                                            <path className="text-brand-accent" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="75, 100" strokeLinecap="round" strokeWidth="2.5"></path>
                                        </svg>
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                                            <span className="text-2xl font-bold text-white font-grotesk block">25:00</span>
                                            <span className="text-[10px] text-slate-400 uppercase tracking-widest">Focus</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 w-full">
                                        <button className="flex-1 bg-brand-blue hover:bg-blue-600 text-white py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-1 transition-colors">
                                            <span className="material-symbols-outlined text-sm">play_arrow</span> Start
                                        </button>
                                        <button className="size-9 border border-white/10 hover:bg-white/5 text-slate-400 rounded-lg flex items-center justify-center transition-colors">
                                            <span className="material-symbols-outlined text-sm">settings</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                        {/* 5. Quick Access Panel (Floating/Bottom) */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="col-span-12 mt-4"
                        >
                            <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-4 px-1">Quick Access Dock</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                <Link
                                    href="/assessment-results"
                                    className="bg-white/5 hover:bg-brand-blue/20 hover:border-brand-blue/50 border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center gap-2 group transition-all min-h-[100px]"
                                    aria-label="View Transcripts"
                                >
                                    <span className="material-symbols-outlined text-3xl text-slate-400 group-hover:text-brand-blue transition-colors">article</span>
                                    <span className="text-sm font-medium text-white">Transcripts</span>
                                </Link>
                                <Link
                                    href="/weekly-plan"
                                    className="bg-white/5 hover:bg-brand-blue/20 hover:border-brand-blue/50 border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center gap-2 group transition-all min-h-[100px]"
                                    aria-label="View Schedule"
                                >
                                    <span className="material-symbols-outlined text-3xl text-slate-400 group-hover:text-brand-accent transition-colors">calendar_month</span>
                                    <span className="text-sm font-medium text-white">Schedule</span>
                                </Link>
                                <Link
                                    href="/library"
                                    className="bg-white/5 hover:bg-brand-blue/20 hover:border-brand-blue/50 border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center gap-2 group transition-all min-h-[100px]"
                                    aria-label="Open Library"
                                >
                                    <span className="material-symbols-outlined text-3xl text-slate-400 group-hover:text-blue-400 transition-colors">local_library</span>
                                    <span className="text-sm font-medium text-white">Library</span>
                                </Link>
                                <button
                                    onClick={() => alert("Tuition payment feature coming soon!")}
                                    className="bg-white/5 hover:bg-brand-blue/20 hover:border-brand-blue/50 border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center gap-2 group transition-all min-h-[100px]"
                                    aria-label="View Tuition"
                                >
                                    <span className="material-symbols-outlined text-3xl text-slate-400 group-hover:text-green-400 transition-colors">attach_money</span>
                                    <span className="text-sm font-medium text-white">Tuition</span>
                                </button>
                                <Link
                                    href="/community"
                                    className="bg-white/5 hover:bg-brand-blue/20 hover:border-brand-blue/50 border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center gap-2 group transition-all min-h-[100px]"
                                    aria-label="Go to Forum"
                                >
                                    <span className="material-symbols-outlined text-3xl text-slate-400 group-hover:text-purple-400 transition-colors">forum</span>
                                    <span className="text-sm font-medium text-white">Forum</span>
                                </Link>
                                <button
                                    onClick={() => alert("Widget store coming soon!")}
                                    className="bg-transparent border-2 border-dashed border-white/10 hover:border-slate-400 rounded-xl p-4 flex flex-col items-center justify-center gap-2 group transition-all text-slate-400 hover:text-white min-h-[100px]"
                                    aria-label="Add New Widget"
                                >
                                    <span className="material-symbols-outlined text-3xl">add</span>
                                    <span className="text-sm font-medium">Add Widget</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
}
