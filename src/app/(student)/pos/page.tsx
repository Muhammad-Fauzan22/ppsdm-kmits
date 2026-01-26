"use client";

import Link from "next/link";

export default function StudentPersonalOSPage() {
    return (
        <div className="bg-[#f5f7f8] dark:bg-[#101418] text-slate-900 dark:text-white overflow-x-hidden min-h-screen flex font-[family-name:var(--font-noto-sans)]">
            {/* Sidebar */}
            <aside className="hidden lg:flex w-72 flex-col bg-[#1e242c] border-r border-[#27303a] h-screen sticky top-0 shrink-0">
                <div className="flex flex-col h-full justify-between p-6">
                    <div className="flex flex-col gap-8">
                        {/* Branding */}
                        <div className="flex items-center gap-3">
                            <div className="bg-[#003366] aspect-square rounded-xl size-10 flex items-center justify-center text-[#FFBD07]">
                                <span className="material-symbols-outlined text-[28px]">school</span>
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-white text-lg font-bold leading-none tracking-tight font-[family-name:var(--font-space-grotesk)]">PPSDM KMM</h1>
                                <p className="text-[#9aabbc] text-xs font-normal mt-1">Student OS v2.0</p>
                            </div>
                        </div>
                        {/* Navigation */}
                        <nav className="flex flex-col gap-2">
                            <Link className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#003366]/20 border border-[#003366]/30 group transition-all duration-200" href="#">
                                <span className="material-symbols-outlined text-[#FFBD07]" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
                                <span className="text-white font-medium">Dashboard</span>
                            </Link>
                            <Link className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#9aabbc] hover:bg-[#27303a]/50 hover:text-white transition-all duration-200" href="#">
                                <span className="material-symbols-outlined">description</span>
                                <span className="font-medium">RPI Plan</span>
                            </Link>
                            <Link className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#9aabbc] hover:bg-[#27303a]/50 hover:text-white transition-all duration-200" href="#">
                                <span className="material-symbols-outlined">folder_open</span>
                                <span className="font-medium">Portfolio</span>
                            </Link>
                            <Link className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#9aabbc] hover:bg-[#27303a]/50 hover:text-white transition-all duration-200" href="#">
                                <span className="material-symbols-outlined">person</span>
                                <span className="font-medium">My Profile</span>
                            </Link>
                            <Link className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#9aabbc] hover:bg-[#27303a]/50 hover:text-white transition-all duration-200" href="#">
                                <span className="material-symbols-outlined">settings</span>
                                <span className="font-medium">Settings</span>
                            </Link>
                        </nav>
                        {/* Semester Status Mini Widget */}
                        <div className="p-4 rounded-xl bg-[#151a21] border border-[#27303a] mt-4">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-xs text-[#9aabbc] uppercase tracking-wider font-bold">Sem 4 Progress</span>
                                <span className="text-[#FFBD07] text-sm font-bold">85%</span>
                            </div>
                            <div className="h-2 w-full bg-[#27303a] rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-[#003366] to-[#FFBD07] w-[85%] rounded-full"></div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Link className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#9aabbc] hover:text-red-400 transition-colors" href="#">
                            <span className="material-symbols-outlined">logout</span>
                            <span className="font-medium">Log Out</span>
                        </Link>
                    </div>
                </div>
            </aside>
            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto relative">
                {/* Top Bar */}
                <header className="flex items-center justify-between px-8 py-5 border-b border-[#27303a] bg-[#101418]/80 backdrop-blur-md sticky top-0 z-50">
                    <div className="flex items-center gap-4 lg:hidden">
                        <button className="text-white p-1">
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-white text-2xl font-bold font-[family-name:var(--font-space-grotesk)] leading-tight">Personal Dashboard</h2>
                        <p className="text-[#9aabbc] text-sm">Welcome back, Student. Ready to learn?</p>
                    </div>
                    <div className="flex items-center gap-6">
                        {/* Search Bar */}
                        <div className="hidden md:flex items-center h-11 bg-[#1e242c] border border-[#27303a] rounded-xl px-4 w-80 focus-within:border-[#003366]/50 focus-within:ring-1 focus-within:ring-[#003366]/50 transition-all">
                            <span className="material-symbols-outlined text-[#9aabbc]">search</span>
                            <input className="bg-transparent border-none text-white placeholder-[#9aabbc] text-sm w-full focus:ring-0" placeholder="Search modules, tasks, or RPI..." type="text" />
                            <div className="hidden xl:flex items-center gap-1">
                                <kbd className="hidden bg-[#27303a] px-1.5 py-0.5 rounded text-[10px] text-[#9aabbc] font-mono">⌘</kbd>
                                <kbd className="hidden bg-[#27303a] px-1.5 py-0.5 rounded text-[10px] text-[#9aabbc] font-mono">K</kbd>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="relative p-2 text-[#9aabbc] hover:text-white transition-colors rounded-lg hover:bg-[#27303a]">
                                <span className="material-symbols-outlined">notifications</span>
                                <span className="absolute top-2 right-2 size-2 bg-[#FFBD07] rounded-full border-2 border-[#101418]"></span>
                            </button>
                            <div className="size-10 rounded-full bg-cover bg-center border-2 border-[#003366] cursor-pointer" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBfbHz2HuDF7It8zj88KqzMSGzaDN8lq8tnnvDbrqzwZVDhuQ91xFy_4tSmP3iNf0MCEoBm57LND_1kCDCUg_QAP_4IXH3XQsr6Gudwhz7UFTOWPa2rHw4XKo5YlKBwqVHAeqYyZxx79LVMUmmpwXHE_NPlJbUIyPsk63vAGf-17juVc7H7uhuqW1S93b9GXn1yHTuigYDTPnNOD3UfgVmIgF5fhM0Y3t61UDvuTnBG_nV17Ox-5EqzTUuAudvXyclQ_f0IIE_J6xw')" }}></div>
                        </div>
                    </div>
                </header>
                <div className="p-8 pb-20 max-w-[1600px] mx-auto w-full">
                    {/* Bento Grid Layout */}
                    <div className="grid grid-cols-12 gap-6 auto-rows-[minmax(100px,auto)]">
                        {/* 1. Holistic Radar Widget (Main Feature) */}
                        <div className="col-span-12 lg:col-span-8 bg-[#1e242c] rounded-2xl border border-[#27303a] p-6 flex flex-col relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#003366]/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                            <div className="flex justify-between items-start mb-6 z-10">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="material-symbols-outlined text-[#FFBD07] text-xl">radar</span>
                                        <h3 className="text-white text-lg font-bold font-[family-name:var(--font-space-grotesk)]">Holistic Development Radar</h3>
                                    </div>
                                    <p className="text-[#9aabbc] text-sm">9-Axis Assessment: Current vs Target Goal</p>
                                </div>
                                <div className="flex gap-2 bg-[#151a21] p-1 rounded-lg border border-[#27303a]">
                                    <button className="px-3 py-1 text-xs font-medium bg-[#003366]/20 text-white rounded shadow-sm">Analysis</button>
                                    <button className="px-3 py-1 text-xs font-medium text-[#9aabbc] hover:text-white transition-colors">History</button>
                                </div>
                            </div>
                            <div className="flex flex-col lg:flex-row flex-1 gap-8 items-center justify-center relative z-10">
                                {/* Chart Area */}
                                <div className="flex-1 max-w-[500px] h-[320px] relative flex items-center justify-center">
                                    {/* Custom SVG Spider Chart simulation */}
                                    <svg className="w-full h-full drop-shadow-2xl" viewBox="0 0 400 360">
                                        {/* Grid Lines (Pentagons) */}
                                        <g className="stroke-[#27303a]" fill="none" strokeWidth="1">
                                            <polygon opacity="0.3" points="200,40 350,130 310,290 90,290 50,130"></polygon>
                                            <polygon opacity="0.5" points="200,80 300,140 270,250 130,250 100,140"></polygon>
                                            <polygon opacity="0.7" points="200,120 250,150 230,210 170,210 150,150"></polygon>
                                        </g>
                                        {/* Axes Labels */}
                                        <g className="text-[10px] font-bold fill-[#9aabbc] font-[family-name:var(--font-space-grotesk)]" textAnchor="middle">
                                            <text x="200" y="25">Leadership</text>
                                            <text x="375" y="130">Tech</text>
                                            <text x="330" y="310">Global</text>
                                            <text x="70" y="310">Ethics</text>
                                            <text x="25" y="130">Research</text>
                                        </g>
                                        {/* Target Area (Gold) */}
                                        <polygon fill="none" opacity="0.6" points="200,50 340,135 300,280 100,280 60,135" stroke="#FFBD07" strokeDasharray="4 4" strokeWidth="2"></polygon>
                                        {/* Current Area (Blue - Filled) */}
                                        <polygon fill="rgba(0, 51, 102, 0.5)" points="200,90 310,145 270,250 120,260 90,150" stroke="#003366" strokeWidth="3"></polygon>
                                        {/* Data Points */}
                                        <circle cx="200" cy="90" fill="#003366" r="4" stroke="white" strokeWidth="2"></circle>
                                        <circle cx="310" cy="145" fill="#003366" r="4" stroke="white" strokeWidth="2"></circle>
                                        <circle cx="270" cy="250" fill="#003366" r="4" stroke="white" strokeWidth="2"></circle>
                                        <circle cx="120" cy="260" fill="#003366" r="4" stroke="white" strokeWidth="2"></circle>
                                        <circle cx="90" cy="150" fill="#003366" r="4" stroke="white" strokeWidth="2"></circle>
                                    </svg>
                                </div>
                                {/* Legend / Stats */}
                                <div className="flex flex-col gap-4 min-w-[180px]">
                                    <div className="p-3 rounded-xl bg-[#151a21] border border-[#27303a] flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="size-3 rounded-full bg-[#003366] border border-white"></div>
                                            <span className="text-sm font-medium text-white">Current</span>
                                        </div>
                                        <span className="text-lg font-bold font-[family-name:var(--font-space-grotesk)] text-white">725</span>
                                    </div>
                                    <div className="p-3 rounded-xl bg-[#151a21] border border-[#27303a] flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="size-3 rounded-full border-2 border-[#FFBD07] border-dashed"></div>
                                            <span className="text-sm font-medium text-white">Target</span>
                                        </div>
                                        <span className="text-lg font-bold font-[family-name:var(--font-space-grotesk)] text-[#FFBD07]">900</span>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-[#27303a]">
                                        <p className="text-xs text-[#9aabbc] mb-2">Focus Area:</p>
                                        <div className="flex items-center gap-2 text-white">
                                            <span className="material-symbols-outlined text-[#FFBD07] text-sm">trending_up</span>
                                            <span className="font-bold">Tech Competency</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-[#27303a] rounded-full mt-2 overflow-hidden">
                                            <div className="h-full bg-[#FFBD07] w-[65%] rounded-full"></div>
                                        </div>
                                        <p className="text-[10px] text-right text-[#9aabbc] mt-1">+12% from last month</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* 2. Next Action AI Widget */}
                        <div className="col-span-12 lg:col-span-4 bg-[#1e242c] rounded-2xl border border-[#27303a] p-6 flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-2">
                                    <div className="size-8 rounded-lg bg-gradient-to-br from-[#003366] to-[#004080] flex items-center justify-center shadow-lg shadow-[#003366]/20">
                                        <span className="material-symbols-outlined text-white text-sm">smart_toy</span>
                                    </div>
                                    <h3 className="text-white text-lg font-bold font-[family-name:var(--font-space-grotesk)]">Next Action AI</h3>
                                </div>
                                <button className="text-[#9aabbc] hover:text-white transition-colors">
                                    <span className="material-symbols-outlined">more_horiz</span>
                                </button>
                            </div>
                            <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1">
                                {/* High Priority Item */}
                                <div className="p-3 rounded-xl bg-[#003366]/10 border border-[#003366]/30 flex items-start gap-3 group hover:bg-[#003366]/20 transition-all cursor-pointer">
                                    <div className="mt-1">
                                        <input className="rounded border-[#003366]/50 text-[#003366] bg-transparent focus:ring-offset-[#101418] focus:ring-[#003366] size-4 cursor-pointer" type="checkbox" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-white font-medium text-sm leading-snug">Submit KMM Proposal</h4>
                                            <span className="text-[10px] font-bold text-[#FFBD07] bg-[#FFBD07]/10 px-1.5 py-0.5 rounded border border-[#FFBD07]/20">Urgent</span>
                                        </div>
                                        <p className="text-xs text-[#9aabbc] mt-1">Deadline: Due in 2 days</p>
                                    </div>
                                    <button className="opacity-0 group-hover:opacity-100 transition-opacity bg-[#003366] text-white text-[10px] px-2 py-1 rounded font-bold self-center">Start</button>
                                </div>
                                {/* Suggested Item */}
                                <div className="p-3 rounded-xl bg-[#151a21] border border-[#27303a] flex items-start gap-3 group hover:border-[#9aabbc]/30 transition-all cursor-pointer">
                                    <div className="mt-1">
                                        <input className="rounded border-[#27303a] text-[#003366] bg-transparent focus:ring-offset-[#101418] focus:ring-[#003366] size-4 cursor-pointer" type="checkbox" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-white font-medium text-sm leading-snug">Review 'Data Structures'</h4>
                                            <span className="text-[10px] font-bold text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded border border-green-400/20">Suggest</span>
                                        </div>
                                        <p className="text-xs text-[#9aabbc] mt-1">Chapter 4 - Linked Lists</p>
                                    </div>
                                </div>
                                {/* Regular Item */}
                                <div className="p-3 rounded-xl bg-[#151a21] border border-[#27303a] flex items-start gap-3 group hover:border-[#9aabbc]/30 transition-all cursor-pointer">
                                    <div className="mt-1">
                                        <input className="rounded border-[#27303a] text-[#003366] bg-transparent focus:ring-offset-[#101418] focus:ring-[#003366] size-4 cursor-pointer" type="checkbox" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-white font-medium text-sm leading-snug">Complete Reflection</h4>
                                        </div>
                                        <p className="text-xs text-[#9aabbc] mt-1">Weekly self-assessment</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* 3. Animated Seno Mascot */}
                        <div className="col-span-12 lg:col-span-4 bg-gradient-to-br from-[#003366] to-[#050f1a] rounded-2xl border border-[#003366]/30 p-6 flex items-center justify-between relative overflow-hidden">
                            {/* Background Decor */}
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                            <div className="flex-1 z-10">
                                <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-4 rounded-xl rounded-bl-none mb-2 shadow-lg">
                                    <p className="text-white text-sm italic">"Don't forget to hydrate! You've been coding for 2 hours straight."</p>
                                </div>
                                <p className="text-[#FFBD07] font-bold text-xs uppercase tracking-wider pl-2">- Seno, Your Assistant</p>
                            </div>
                            <div className="w-24 h-24 shrink-0 relative z-10 flex items-center justify-center">
                                {/* Abstract Mascot Representation */}
                                <div className="w-20 h-20 bg-[#FFBD07] rounded-full flex items-center justify-center relative animate-bounce" style={{ animationDuration: "3s" }}>
                                    <div className="w-16 h-12 bg-white rounded-full absolute bottom-4"></div>
                                    <div className="w-4 h-4 bg-black rounded-full absolute left-5 top-7"></div>
                                    <div className="w-4 h-4 bg-black rounded-full absolute right-5 top-7"></div>
                                    <div className="w-2 h-1 bg-pink-400 rounded-full absolute left-4 top-10 opacity-50"></div>
                                    <div className="w-2 h-1 bg-pink-400 rounded-full absolute right-4 top-10 opacity-50"></div>
                                </div>
                            </div>
                        </div>
                        {/* 4. Productivity Dashboard */}
                        <div className="col-span-12 lg:col-span-8 bg-[#1e242c] rounded-2xl border border-[#27303a] p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[#9aabbc]">timer</span>
                                    <h3 className="text-white text-lg font-bold font-[family-name:var(--font-space-grotesk)]">Productivity Hub</h3>
                                </div>
                                <div className="flex gap-4 text-sm text-[#9aabbc]">
                                    <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-[#003366]"></span> Study</span>
                                    <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-[#FFBD07]"></span> Focus</span>
                                </div>
                            </div>
                            <div className="flex flex-col lg:flex-row gap-8 items-center lg:h-[180px]">
                                {/* Weekly Graph */}
                                <div className="flex-1 h-full w-full flex items-end justify-between gap-2 px-2">
                                    <div className="w-full flex flex-col justify-end gap-2 group cursor-pointer h-full">
                                        <div className="w-full bg-[#27303a] rounded-t-sm h-[30%] group-hover:bg-[#003366]/50 transition-colors"></div>
                                        <span className="text-xs text-[#9aabbc] text-center">M</span>
                                    </div>
                                    <div className="w-full flex flex-col justify-end gap-2 group cursor-pointer h-full">
                                        <div className="w-full bg-[#27303a] rounded-t-sm h-[50%] group-hover:bg-[#003366]/50 transition-colors"></div>
                                        <span className="text-xs text-[#9aabbc] text-center">T</span>
                                    </div>
                                    <div className="w-full flex flex-col justify-end gap-2 group cursor-pointer h-full">
                                        <div className="w-full bg-[#003366] rounded-t-sm h-[80%] shadow-[0_0_15px_rgba(0,51,102,0.5)]"></div>
                                        <span className="text-xs text-white font-bold text-center">W</span>
                                    </div>
                                    <div className="w-full flex flex-col justify-end gap-2 group cursor-pointer h-full">
                                        <div className="w-full bg-[#27303a] rounded-t-sm h-[40%] group-hover:bg-[#003366]/50 transition-colors"></div>
                                        <span className="text-xs text-[#9aabbc] text-center">T</span>
                                    </div>
                                    <div className="w-full flex flex-col justify-end gap-2 group cursor-pointer h-full">
                                        <div className="w-full bg-[#27303a] rounded-t-sm h-[60%] group-hover:bg-[#003366]/50 transition-colors"></div>
                                        <span className="text-xs text-[#9aabbc] text-center">F</span>
                                    </div>
                                    <div className="w-full flex flex-col justify-end gap-2 group cursor-pointer h-full">
                                        <div className="w-full bg-[#27303a] rounded-t-sm h-[20%] group-hover:bg-[#003366]/50 transition-colors"></div>
                                        <span className="text-xs text-[#9aabbc] text-center">S</span>
                                    </div>
                                    <div className="w-full flex flex-col justify-end gap-2 group cursor-pointer h-full">
                                        <div className="w-full bg-[#27303a] rounded-t-sm h-[10%] group-hover:bg-[#003366]/50 transition-colors"></div>
                                        <span className="text-xs text-[#9aabbc] text-center">S</span>
                                    </div>
                                </div>
                                {/* Divider */}
                                <div className="hidden lg:block w-px h-full bg-[#27303a]"></div>
                                {/* Pomodoro Timer */}
                                <div className="w-64 shrink-0 flex flex-col items-center justify-center gap-4">
                                    <div className="relative size-32">
                                        <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                                            <path className="text-[#27303a]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2.5"></path>
                                            <path className="text-[#FFBD07]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="75, 100" strokeLinecap="round" strokeWidth="2.5"></path>
                                        </svg>
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                                            <span className="text-2xl font-bold text-white font-[family-name:var(--font-space-grotesk)] block">25:00</span>
                                            <span className="text-[10px] text-[#9aabbc] uppercase tracking-widest">Focus</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 w-full">
                                        <button className="flex-1 bg-[#003366] hover:bg-[#004080] text-white py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-1 transition-colors">
                                            <span className="material-symbols-outlined text-sm">play_arrow</span> Start
                                        </button>
                                        <button className="size-9 border border-[#27303a] hover:bg-[#27303a] text-[#9aabbc] rounded-lg flex items-center justify-center transition-colors">
                                            <span className="material-symbols-outlined text-sm">settings</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* 5. Quick Access Panel (Floating/Bottom) */}
                        <div className="col-span-12 mt-4">
                            <h3 className="text-[#9aabbc] text-sm font-bold uppercase tracking-wider mb-4 px-1">Quick Access Dock</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                <Link className="bg-[#1e242c] hover:bg-[#003366]/20 hover:border-[#003366]/50 border border-[#27303a] rounded-xl p-4 flex flex-col items-center justify-center gap-2 group transition-all" href="#">
                                    <span className="material-symbols-outlined text-3xl text-[#9aabbc] group-hover:text-[#003366] transition-colors">article</span>
                                    <span className="text-sm font-medium text-white">Transcripts</span>
                                </Link>
                                <Link className="bg-[#1e242c] hover:bg-[#003366]/20 hover:border-[#003366]/50 border border-[#27303a] rounded-xl p-4 flex flex-col items-center justify-center gap-2 group transition-all" href="#">
                                    <span className="material-symbols-outlined text-3xl text-[#9aabbc] group-hover:text-[#FFBD07] transition-colors">calendar_month</span>
                                    <span className="text-sm font-medium text-white">Schedule</span>
                                </Link>
                                <Link className="bg-[#1e242c] hover:bg-[#003366]/20 hover:border-[#003366]/50 border border-[#27303a] rounded-xl p-4 flex flex-col items-center justify-center gap-2 group transition-all" href="#">
                                    <span className="material-symbols-outlined text-3xl text-[#9aabbc] group-hover:text-blue-400 transition-colors">local_library</span>
                                    <span className="text-sm font-medium text-white">Library</span>
                                </Link>
                                <Link className="bg-[#1e242c] hover:bg-[#003366]/20 hover:border-[#003366]/50 border border-[#27303a] rounded-xl p-4 flex flex-col items-center justify-center gap-2 group transition-all" href="#">
                                    <span className="material-symbols-outlined text-3xl text-[#9aabbc] group-hover:text-green-400 transition-colors">attach_money</span>
                                    <span className="text-sm font-medium text-white">Tuition</span>
                                </Link>
                                <Link className="bg-[#1e242c] hover:bg-[#003366]/20 hover:border-[#003366]/50 border border-[#27303a] rounded-xl p-4 flex flex-col items-center justify-center gap-2 group transition-all" href="#">
                                    <span className="material-symbols-outlined text-3xl text-[#9aabbc] group-hover:text-purple-400 transition-colors">forum</span>
                                    <span className="text-sm font-medium text-white">Forum</span>
                                </Link>
                                <button className="bg-transparent border-2 border-dashed border-[#27303a] hover:border-[#9aabbc] rounded-xl p-4 flex flex-col items-center justify-center gap-2 group transition-all text-[#9aabbc] hover:text-white">
                                    <span className="material-symbols-outlined text-3xl">add</span>
                                    <span className="text-sm font-medium">Add Widget</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
