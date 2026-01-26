"use client";

import React, { useState } from 'react';

export default function RoadmapPage() {
    const [selectedNode, setSelectedNode] = useState<string | null>(null);

    const nodes = {
        'advanced-vis': {
            id: 'advanced-vis',
            title: 'Advanced Visualization',
            progress: 60,
            status: 'In Progress',
            description: 'Learn to create complex interactive visualizations using D3.js and WebGL. This node covers force-directed graphs, geospatial mapping, and large dataset rendering optimization.',
            prereqs: [
                { name: 'Foundational Literacy', status: 'verified', time: '2 months ago' },
                { name: 'Basic JS Logic', status: 'suggested', time: 'Optional' }
            ],
            resources: [
                { type: 'video', title: 'Module 4: Graph Theory Intro', duration: '15 mins' },
                { type: 'article', title: 'D3.js Documentation Guide', duration: '10 mins read' }
            ]
        }
    };

    return (
        <div className="bg-[#f6f8f8] dark:bg-[#101d22] text-slate-900 dark:text-white font-[family-name:var(--font-space-grotesk)] overflow-hidden h-screen flex flex-col">
            {/* Top Navigation Bar */}
            <header className="flex-none z-50 bg-[#111618]/90 backdrop-blur-md border-b border-[#283539]">
                <div className="px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="size-8 text-[#13b6ec]">
                            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path clipRule="evenodd" d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z" fill="currentColor" fillRule="evenodd"></path>
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-white text-xl font-bold leading-tight tracking-wider uppercase">PPSDM KMM Roadmap</h2>
                            <p className="text-xs text-[#13b6ec]/80 font-mono tracking-widest">COMPETENCY MATRIX v2.4</p>
                        </div>
                    </div>
                    {/* Profile Stats Mini (Integrated) */}
                    <div className="hidden md:flex items-center gap-6 px-6 py-2 bg-[#18282e] rounded-full border border-[#283539]">
                        <div className="flex flex-col items-center px-2">
                            <span className="text-xs text-[#9db2b9] uppercase tracking-wide">Level</span>
                            <span className="text-[#13b6ec] font-bold">12</span>
                        </div>
                        <div className="h-8 w-px bg-[#283539]"></div>
                        <div className="flex flex-col items-center px-2">
                            <span className="text-xs text-[#9db2b9] uppercase tracking-wide">Skills</span>
                            <span className="text-white font-bold">45/100</span>
                        </div>
                        <div className="h-8 w-px bg-[#283539]"></div>
                        <div className="flex flex-col items-center px-2">
                            <span className="text-xs text-[#9db2b9] uppercase tracking-wide">XP</span>
                            <span className="text-white font-bold">850</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                            <button className="flex size-10 cursor-pointer items-center justify-center rounded-lg bg-[#283539] hover:bg-[#3b4d54] text-white transition-colors">
                                <span className="material-symbols-outlined">notifications</span>
                            </button>
                            <button className="flex size-10 cursor-pointer items-center justify-center rounded-lg bg-[#283539] hover:bg-[#3b4d54] text-white transition-colors">
                                <span className="material-symbols-outlined">settings</span>
                            </button>
                        </div>
                        <div className="size-10 rounded-full bg-cover bg-center border-2 border-[#283539]" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBRCyQd0vU2psM9XbgSquwZc2pVdeFlY6Cgytlb4yK3CaOzM8_5CxrXOr2Nekg9BWSL-dPFYHEXj3FphDRVgSbQ4VALn3Yk3jDmjsUETMb6und54XTTVhZi9_SXvZep5bO94kJijFGDtIL_mliGCcaW7bwe0NAHESkTBubxw0TPoNoplcZy22lx7sRKEWqkhHN9Cs16VaffATskot5e-Y4UWkLo4qollVobhAcBjid63MUYaWaQtsN9dGHHDt0u0d4VgyMM93C52Sc")' }}></div>
                    </div>
                </div>
            </header>

            {/* Main Content Area: The Skill Tree Canvas */}
            <main className="flex-1 relative overflow-hidden bg-[#101d22] bg-grid-pattern">
                {/* Canvas Elements Container (Simulated Pan/Zoom Area) */}
                <div className="absolute inset-0 flex items-center justify-center">
                    {/* Connection Lines (SVG Layer) */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="grad1" x1="0%" x2="100%" y1="0%" y2="0%">
                                <stop offset="0%" stopColor="#13b6ec" stopOpacity="1"></stop>
                                <stop offset="100%" stopColor="#13b6ec" stopOpacity="0.2"></stop>
                            </linearGradient>
                        </defs>
                        {/* Connections from Root */}
                        <path className="opacity-50" d="M50% 50% L30% 30%" stroke="#13b6ec" strokeWidth="2"></path>
                        <path className="opacity-50" d="M50% 50% L70% 30%" stroke="#13b6ec" strokeWidth="2"></path>
                        <path d="M50% 50% L50% 75%" stroke="#3b4d54" strokeDasharray="5,5" strokeWidth="2"></path>
                        {/* Connections from Left Branch */}
                        <path className="opacity-30" d="M30% 30% L20% 15%" stroke="#13b6ec" strokeWidth="2"></path>
                        <path className="opacity-30" d="M30% 30% L40% 15%" stroke="#13b6ec" strokeWidth="2"></path>
                        {/* Connections from Right Branch */}
                        <path d="M70% 30% L60% 15%" stroke="#3b4d54" strokeWidth="2"></path>
                        <path d="M70% 30% L80% 15%" stroke="#3b4d54" strokeWidth="2"></path>
                    </svg>
                    {/* Nodes Layer */}
                    <div className="relative w-full h-full z-10">
                        {/* Root Node (Center) */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer" onClick={() => setSelectedNode(null)}>
                            <div className="relative flex items-center justify-center size-24 rounded-full bg-[#18282e] border-2 border-[#13b6ec] shadow-[0_0_10px_rgba(19,182,236,0.5),0_0_20px_rgba(19,182,236,0.3)] transition-transform group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(19,182,236,0.7),0_0_30px_rgba(19,182,236,0.5)]">
                                <span className="material-symbols-outlined text-4xl text-white">hub</span>
                                {/* Status Badge */}
                                <div className="absolute -bottom-2 bg-[#13b6ec] text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Mastered</div>
                            </div>
                            <span className="mt-4 text-white font-bold bg-black/50 px-3 py-1 rounded backdrop-blur-sm border border-[#13b6ec]/30">Foundational Literacy</span>
                        </div>
                        {/* Branch Node A (Top Left - Verified) */}
                        <div className="absolute top-[30%] left-[30%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer">
                            <div className="relative flex items-center justify-center size-20 rounded-full bg-[#18282e] border-2 border-[#13b6ec] shadow-[0_0_10px_rgba(19,182,236,0.5),0_0_20px_rgba(19,182,236,0.3)] transition-transform group-hover:scale-110">
                                <span className="material-symbols-outlined text-3xl text-white">analytics</span>
                            </div>
                            <span className="mt-3 text-sm text-gray-200 font-medium bg-black/50 px-2 py-1 rounded backdrop-blur-sm">Data Analysis</span>
                        </div>
                        {/* Leaf Node A1 (Top Left Far - Verified) */}
                        <div className="absolute top-[15%] left-[20%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer opacity-80 hover:opacity-100">
                            <div className="flex items-center justify-center size-16 rounded-full bg-[#18282e] border border-[#13b6ec]/50 transition-transform group-hover:scale-110">
                                <span className="material-symbols-outlined text-2xl text-[#13b6ec]">functions</span>
                            </div>
                            <span className="mt-2 text-xs text-gray-400">Statistics</span>
                        </div>
                        {/* Leaf Node A2 (Top Left Center - Verified) */}
                        <div className="absolute top-[15%] left-[40%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer opacity-80 hover:opacity-100">
                            <div className="flex items-center justify-center size-16 rounded-full bg-[#18282e] border border-[#13b6ec]/50 transition-transform group-hover:scale-110">
                                <span className="material-symbols-outlined text-2xl text-[#13b6ec]">database</span>
                            </div>
                            <span className="mt-2 text-xs text-gray-400">SQL Basics</span>
                        </div>
                        {/* Branch Node B (Top Right - Locked/In Progress) */}
                        <div className="absolute top-[30%] left-[70%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer">
                            <div className="relative flex items-center justify-center size-20 rounded-full bg-[#18282e] border-2 border-[#3b4d54] transition-transform group-hover:scale-110 group-hover:border-white">
                                <span className="material-symbols-outlined text-3xl text-[#5c727b]">brush</span>
                                <div className="absolute -top-1 -right-1 bg-[#3b4d54] rounded-full p-1 border border-black">
                                    <span className="material-symbols-outlined text-[12px] text-gray-300 block">lock</span>
                                </div>
                            </div>
                            <span className="mt-3 text-sm text-gray-500 font-medium">UI/UX Design</span>
                        </div>
                        {/* Leaf Node B1 (Locked) */}
                        <div className="absolute top-[15%] left-[60%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center opacity-50 grayscale">
                            <div className="flex items-center justify-center size-16 rounded-full bg-[#18282e] border border-[#3b4d54]">
                                <span className="material-symbols-outlined text-2xl text-gray-500">contrast</span>
                            </div>
                            <span className="mt-2 text-xs text-gray-600">Color Theory</span>
                        </div>
                        {/* Leaf Node B2 (Locked) */}
                        <div className="absolute top-[15%] left-[80%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center opacity-50 grayscale">
                            <div className="flex items-center justify-center size-16 rounded-full bg-[#18282e] border border-[#3b4d54]">
                                <span className="material-symbols-outlined text-2xl text-gray-500">accessibility_new</span>
                            </div>
                            <span className="mt-2 text-xs text-gray-600">A11y</span>
                        </div>
                        {/* Branch Node C (Bottom Center - Selected/Active) */}
                        <div className="absolute top-[75%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer z-20" onClick={() => setSelectedNode('advanced-vis')}>
                            {/* Pulsing Ring */}
                            <div className="absolute inset-0 rounded-full animate-ping border border-[#13b6ec]/50 opacity-75"></div>
                            <div className="relative flex items-center justify-center size-24 rounded-full bg-[#18282e] border-2 border-dashed border-[#13b6ec] shadow-[0_0_30px_rgba(19,182,236,0.3)] transition-transform group-hover:scale-105">
                                <span className="material-symbols-outlined text-4xl text-white">neurology</span>
                                <div className="absolute -bottom-3 bg-[#18282e] border border-[#13b6ec]/50 text-[#13b6ec] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                                    <span className="size-1.5 rounded-full bg-[#13b6ec] animate-pulse"></span>
                                    In Progress
                                </div>
                            </div>
                            <span className="mt-5 text-[#13b6ec] font-bold text-lg bg-black/60 px-4 py-1 rounded-lg backdrop-blur-md border border-[#13b6ec]/50">Advanced Visualization</span>
                        </div>
                    </div>
                </div>

                {/* Floating UI: Search Bar (Top Left) */}
                <div className="absolute top-6 left-6 z-30 w-80">
                    <div className="flex w-full items-stretch rounded-lg h-12 bg-[#18282e]/90 backdrop-blur border border-[#3b4d54] shadow-lg group focus-within:border-[#13b6ec]/50 focus-within:shadow-[0_0_10px_rgba(19,182,236,0.5),0_0_20px_rgba(19,182,236,0.3)] transition-all">
                        <div className="text-[#9db2b9] flex items-center justify-center pl-4">
                            <span className="material-symbols-outlined">search</span>
                        </div>
                        <input className="w-full bg-transparent border-none text-white focus:ring-0 placeholder:text-[#5c727b] px-3 font-[family-name:var(--font-space-grotesk)] text-sm" placeholder="Search skills, nodes, or ID..." />
                        <div className="text-[#5c727b] flex items-center justify-center pr-3 text-xs font-mono">
                            CTRL+K
                        </div>
                    </div>
                </div>

                {/* Floating UI: Legend (Bottom Left) */}
                <div className="absolute bottom-6 left-6 z-30 bg-[#18282e]/90 backdrop-blur border border-[#3b4d54] rounded-lg shadow-xl p-4 w-64">
                    <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-3 border-b border-[#3b4d54] pb-2">Map Legend</h3>
                    <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-3 items-center">
                        <div className="w-8 h-0.5 bg-[#13b6ec] shadow-[0_0_8px_rgba(19,182,236,0.8)]"></div>
                        <p className="text-gray-300 text-xs">Verified Path</p>
                        <div className="w-8 h-0.5 border-t-2 border-dashed border-[#13b6ec]"></div>
                        <p className="text-gray-300 text-xs">In Progress</p>
                        <div className="w-8 h-0.5 bg-[#3b4d54]"></div>
                        <p className="text-gray-400 text-xs">Locked / Future</p>
                        <div className="size-3 rounded-full border border-[#13b6ec] shadow-[0_0_5px_rgba(19,182,236,1)] bg-[#13b6ec]/20"></div>
                        <p className="text-white text-xs">Available Node</p>
                    </div>
                </div>

                {/* Floating UI: Zoom Controls (Bottom Right) */}
                <div className={`absolute bottom-6 right-6 lg:right-[${selectedNode ? '420px' : '6rem'}] z-30 flex flex-col gap-2 transition-all duration-300`}>
                    <button className="size-10 flex items-center justify-center bg-[#18282e]/90 backdrop-blur border border-[#3b4d54] rounded-lg text-white hover:bg-[#283539] hover:border-[#13b6ec]/50 active:scale-95 transition-all">
                        <span className="material-symbols-outlined">add</span>
                    </button>
                    <button className="size-10 flex items-center justify-center bg-[#18282e]/90 backdrop-blur border border-[#3b4d54] rounded-lg text-white hover:bg-[#283539] hover:border-[#13b6ec]/50 active:scale-95 transition-all">
                        <span className="material-symbols-outlined">remove</span>
                    </button>
                    <button className="size-10 flex items-center justify-center bg-[#18282e]/90 backdrop-blur border border-[#3b4d54] rounded-lg text-white hover:bg-[#283539] hover:border-[#13b6ec]/50 active:scale-95 transition-all" title="Reset View">
                        <span className="material-symbols-outlined">center_focus_strong</span>
                    </button>
                </div>

                {/* Info Sidebar (Right Side) */}
                <aside className={`absolute top-0 right-0 h-full w-full max-w-[400px] bg-[#111618]/95 backdrop-blur-xl border-l border-[#283539] z-40 transform transition-transform duration-300 flex flex-col shadow-2xl ${selectedNode ? 'translate-x-0' : 'translate-x-full'}`}>
                    {/* Sidebar Header */}
                    <div className="p-6 border-b border-[#283539] flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-[#13b6ec]/20 text-[#13b6ec] text-[10px] font-bold px-2 py-0.5 rounded border border-[#13b6ec]/30 uppercase">Skill Node #104</span>
                                <span className="bg-yellow-500/20 text-yellow-400 text-[10px] font-bold px-2 py-0.5 rounded border border-yellow-500/30 uppercase">High Priority</span>
                            </div>
                            <h2 className="text-2xl font-bold text-white leading-tight">Advanced Visualization</h2>
                        </div>
                        <button className="text-gray-500 hover:text-white transition-colors" onClick={() => setSelectedNode(null)}>
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8">
                        {/* Progress Section */}
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <label className="text-sm font-medium text-gray-300">Proficiency Progress</label>
                                <span className="text-[#13b6ec] font-bold text-lg">60%</span>
                            </div>
                            <div className="h-2 w-full bg-[#283539] rounded-full overflow-hidden">
                                <div className="h-full bg-[#13b6ec] w-[60%] shadow-[0_0_10px_rgba(19,182,236,0.5)]"></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Finish 2 more modules to verify this skill.</p>
                        </div>
                        {/* Description */}
                        <div>
                            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-base text-[#13b6ec]">info</span> About
                            </h4>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                Learn to create complex interactive visualizations using D3.js and WebGL. This node covers force-directed graphs, geospatial mapping, and large dataset rendering optimization.
                            </p>
                        </div>
                        {/* Prerequisites */}
                        <div>
                            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-base text-[#13b6ec]">account_tree</span> Prerequisites
                            </h4>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-[#18282e] border border-[#13b6ec]/30">
                                    <span className="material-symbols-outlined text-[#13b6ec] text-xl">check_circle</span>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-white">Foundational Literacy</p>
                                        <p className="text-xs text-gray-500">Verified • 2 months ago</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-[#18282e] border border-[#283539] opacity-70">
                                    <span className="material-symbols-outlined text-gray-500 text-xl">lock_open</span>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-gray-300">Basic JS Logic</p>
                                        <p className="text-xs text-gray-500">Suggested • Optional</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Resources */}
                        <div>
                            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-base text-[#13b6ec]">library_books</span> Learning Resources
                            </h4>
                            <div className="grid gap-2">
                                <a className="flex items-center gap-3 p-3 rounded hover:bg-[#283539] transition-colors group" href="#">
                                    <div className="size-8 rounded bg-[#283539] group-hover:bg-[#3b4d54] flex items-center justify-center text-[#13b6ec]">
                                        <span className="material-symbols-outlined text-lg">play_circle</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-white truncate group-hover:text-[#13b6ec] transition-colors">Module 4: Graph Theory Intro</p>
                                        <p className="text-xs text-gray-500">Video • 15 mins</p>
                                    </div>
                                    <span className="material-symbols-outlined text-gray-600 group-hover:text-white text-sm">open_in_new</span>
                                </a>
                                <a className="flex items-center gap-3 p-3 rounded hover:bg-[#283539] transition-colors group" href="#">
                                    <div className="size-8 rounded bg-[#283539] group-hover:bg-[#3b4d54] flex items-center justify-center text-[#13b6ec]">
                                        <span className="material-symbols-outlined text-lg">article</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-white truncate group-hover:text-[#13b6ec] transition-colors">D3.js Documentation Guide</p>
                                        <p className="text-xs text-gray-500">Article • 10 mins read</p>
                                    </div>
                                    <span className="material-symbols-outlined text-gray-600 group-hover:text-white text-sm">open_in_new</span>
                                </a>
                            </div>
                        </div>
                    </div>
                    {/* Sidebar Footer Actions */}
                    <div className="p-6 border-t border-[#283539] bg-[#111618]">
                        <button className="w-full flex items-center justify-center gap-2 bg-[#13b6ec] hover:bg-cyan-400 text-black font-bold py-3 px-4 rounded-lg shadow-[0_0_10px_rgba(19,182,236,0.5),0_0_20px_rgba(19,182,236,0.3)] hover:shadow-[0_0_15px_rgba(19,182,236,0.7),0_0_30px_rgba(19,182,236,0.5)] transition-all">
                            <span className="material-symbols-outlined">play_arrow</span>
                            Resume Learning
                        </button>
                    </div>
                </aside>
            </main>

            <style jsx global>{`
        .bg-grid-pattern {
            background-size: 40px 40px;
            background-image: 
                linear-gradient(to right, rgba(59, 77, 84, 0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(59, 77, 84, 0.1) 1px, transparent 1px);
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>
        </div>
    );
}
