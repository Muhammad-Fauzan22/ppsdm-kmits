"use client";

import React from 'react';

export default function CoCreatePage() {
    return (
        <div className="bg-[#f6f6f8] dark:bg-[#111118] font-[family-name:var(--font-manrope)] text-slate-900 dark:text-white h-screen flex flex-col overflow-hidden selection:bg-[#1313ec]/30">
            {/* Top Navigation */}
            <header className="flex shrink-0 items-center justify-between whitespace-nowrap border-b border-solid border-[#282839] bg-[#111118] px-6 py-3 z-30">
                <div className="flex items-center gap-4 text-white">
                    <div className="size-8 flex items-center justify-center rounded bg-[#1313ec]/20 text-[#1313ec]">
                        <span className="material-symbols-outlined">hub</span>
                    </div>
                    <div>
                        <h2 className="text-white text-base font-bold leading-tight tracking-[-0.015em]">PPSDM KMM | Co-Create</h2>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-xs text-slate-400 font-medium">Seno AI Online</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-1 justify-end gap-6 items-center">
                    <div className="hidden md:flex items-center gap-6">
                        <a className="text-slate-300 hover:text-white text-sm font-medium leading-normal transition-colors" href="#">File</a>
                        <a className="text-slate-300 hover:text-white text-sm font-medium leading-normal transition-colors" href="#">View</a>
                        <a className="text-slate-300 hover:text-white text-sm font-medium leading-normal transition-colors" href="#">Export</a>
                    </div>
                    <div className="h-6 w-px bg-[#282839] hidden md:block"></div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-[#1313ec] hover:bg-blue-700 transition-colors text-white text-sm font-bold leading-normal tracking-[0.015em]">
                            <span className="mr-2 material-symbols-outlined text-[18px]">ios_share</span>
                            <span className="truncate">Share</span>
                        </button>
                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9 ring-2 ring-[#282839]" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBcbNN-oqLzByd4ppdMfAYchm8YR5PtfDoPCXWwFyfa3EpLNpTO3tH7ziFmLt9aZFw3S_OG58Zlc8aENabSZzqZ6VjBXCKSpL2__XKSn757p3dqbrCQxnE-Z57qGCaX4Q7aUskoXLIkuNiP2zkf-jpNjd79e5RGaEYg-N_ePbJ9d0rvkBYfBd5pmvNHeQ3NdHVdv8bQrROeePytoXEYK_VzTHm4ZG3ktx82EglUkvnXdne3DfsB67jVRiZrZf1Fn9EEm60eEfxnAwE")' }}></div>
                    </div>
                </div>
            </header>

            {/* Main Workspace */}
            <main className="flex flex-1 overflow-hidden relative">
                {/* Infinite Canvas Area */}
                <section className="flex-1 relative bg-grid-pattern overflow-hidden cursor-grab active:cursor-grabbing group/canvas">
                    {/* Floating Toolbar (Bottom Center) */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
                        <div className="flex justify-between gap-1 p-1.5 bg-[#1c1c26]/90 backdrop-blur-md border border-[#282839] rounded-xl shadow-2xl">
                            <button className="p-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors group relative">
                                <span className="material-symbols-outlined">arrow_selector_tool</span>
                                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Select</span>
                            </button>
                            <button className="p-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors group relative">
                                <span className="material-symbols-outlined">title</span>
                                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Text</span>
                            </button>
                            <button className="p-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors group relative">
                                <span className="material-symbols-outlined">sticky_note_2</span>
                                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Sticky</span>
                            </button>
                            <button className="p-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors group relative">
                                <span className="material-symbols-outlined">shapes</span>
                                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Shape</span>
                            </button>
                            <div className="w-px h-6 my-auto bg-white/10 mx-1"></div>
                            <button className="p-2.5 rounded-lg text-[#1313ec] hover:text-blue-400 hover:bg-[#1313ec]/10 transition-colors group relative">
                                <span className="material-symbols-outlined">auto_awesome</span>
                                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">AI Generate</span>
                            </button>
                        </div>
                    </div>

                    {/* Canvas Content Simulation */}
                    <div className="w-full h-full flex items-center justify-center relative scale-90 md:scale-100 origin-center transition-transform duration-500">
                        {/* SVG Connections Background */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ overflow: 'visible' }}>
                            {/* Line from Center to Left */}
                            <path d="M 50% 50% C 40% 50%, 35% 35%, 28% 30%" fill="none" stroke="#282839" strokeWidth="2"></path>
                            {/* Line from Center to Right */}
                            <path d="M 50% 50% C 60% 50%, 65% 65%, 72% 70%" fill="none" stroke="#282839" strokeWidth="2"></path>
                            {/* Line from Center to Bottom */}
                            <path d="M 50% 50% L 50% 75%" fill="none" stroke="#282839" strokeDasharray="6,4" strokeWidth="2"></path>
                        </svg>
                        {/* Central Node */}
                        <div className="absolute z-10 p-6 bg-[#1c1c26] border-2 border-[#1313ec]/50 rounded-2xl shadow-[0_0_30px_rgba(19,19,236,0.15)] w-80 flex flex-col items-center text-center gap-3 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#1313ec] to-purple-600 rounded-lg flex items-center justify-center text-white mb-2 shadow-lg">
                                <span className="material-symbols-outlined text-2xl">eco</span>
                            </div>
                            <h3 className="text-xl font-bold text-white leading-tight">Project Outline: Renewable Energy</h3>
                            <p className="text-xs text-slate-400">Main Focus: Sustainable implementation in developing regions.</p>
                            <div className="flex gap-2 mt-2">
                                <button className="text-xs px-3 py-1.5 bg-[#1313ec]/10 text-[#1313ec] hover:bg-[#1313ec]/20 rounded font-bold transition-colors">Expand</button>
                                <button className="text-xs px-3 py-1.5 bg-white/5 text-slate-300 hover:bg-white/10 rounded font-bold transition-colors">Edit</button>
                            </div>
                            {/* User Cursor Simulation */}
                            <div className="absolute -bottom-6 -right-6 flex items-center gap-2 pointer-events-none">
                                <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19177L11.7841 12.3673H5.65376Z" fill="#1313EC" stroke="white"></path>
                                </svg>
                                <span className="px-2 py-0.5 bg-[#1313ec] text-[10px] font-bold text-white rounded shadow">You</span>
                            </div>
                        </div>
                        {/* Generated Node: Solar (Top Left) */}
                        <div className="absolute top-[30%] left-[28%] -translate-x-1/2 -translate-y-1/2 p-4 bg-[#1c1c26] border border-[#282839] hover:border-slate-500 transition-colors rounded-xl shadow-lg w-56 cursor-pointer">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-amber-500 material-symbols-outlined">wb_sunny</span>
                                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Generated</span>
                            </div>
                            <h4 className="text-white font-bold mb-1">Solar Infrastructure</h4>
                            <p className="text-[11px] text-slate-400 leading-relaxed">Cost-benefit analysis of photovoltaic cells in tropical climates.</p>
                        </div>
                        {/* Generated Node: Wind (Bottom Right) */}
                        <div className="absolute top-[70%] left-[72%] -translate-x-1/2 -translate-y-1/2 p-4 bg-[#1c1c26] border border-[#282839] hover:border-slate-500 transition-colors rounded-xl shadow-lg w-56 cursor-pointer">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-cyan-400 material-symbols-outlined">air</span>
                                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Generated</span>
                            </div>
                            <h4 className="text-white font-bold mb-1">Wind Farm Policy</h4>
                            <p className="text-[11px] text-slate-400 leading-relaxed">Regulatory frameworks for offshore wind turbines.</p>
                        </div>
                        {/* Note (Bottom Center) */}
                        <div className="absolute top-[75%] left-[50%] -translate-x-1/2 p-4 bg-[#fff9c4] text-slate-900 -rotate-2 rounded shadow-md w-48 shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
                            <p className="font-handwriting text-sm font-medium leading-snug">Don't forget to include the recent case study from East Java!</p>
                        </div>
                    </div>

                    {/* Zoom Controls (Bottom Right) */}
                    <div className="absolute bottom-8 right-8 flex flex-col bg-[#1c1c26] border border-[#282839] rounded-lg overflow-hidden shadow-xl z-20">
                        <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5"><span className="material-symbols-outlined text-[20px]">add</span></button>
                        <div className="h-px w-full bg-[#282839]"></div>
                        <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5"><span className="material-symbols-outlined text-[20px]">remove</span></button>
                    </div>
                </section>

                {/* Sidebar: Seno AI */}
                <aside className="w-96 shrink-0 bg-[#111118] border-l border-[#282839] flex flex-col shadow-[-4px_0_24px_rgba(0,0,0,0.2)] z-30">
                    {/* Sidebar Header */}
                    <div className="p-4 border-b border-[#282839] bg-[#111118]/50 backdrop-blur-sm z-10">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-white font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#1313ec]">smart_toy</span>
                                Seno AI Companion
                            </h3>
                            <button className="text-slate-400 hover:text-white transition-colors">
                                <span className="material-symbols-outlined">more_horiz</span>
                            </button>
                        </div>
                        <div className="flex gap-2">
                            <button className="flex-1 bg-[#1c1c26] border border-[#282839] hover:bg-white/5 text-xs font-medium text-slate-300 py-1.5 px-2 rounded transition-colors text-center">Chat</button>
                            <button className="flex-1 bg-[#1313ec]/10 border border-[#1313ec]/20 text-xs font-bold text-[#1313ec] py-1.5 px-2 rounded transition-colors text-center">Co-Create</button>
                        </div>
                    </div>
                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
                        {/* Welcome Message */}
                        <div className="flex gap-3">
                            <div className="size-8 shrink-0 rounded-full bg-[#1313ec] flex items-center justify-center text-white shadow-lg shadow-[#1313ec]/20">
                                <span className="material-symbols-outlined text-sm">smart_toy</span>
                            </div>
                            <div className="flex flex-col gap-1 max-w-[85%]">
                                <div className="bg-[#1c1c26] border border-[#282839] p-3 rounded-2xl rounded-tl-none">
                                    <p className="text-sm text-slate-200 leading-relaxed">
                                        Hello! I'm ready to help you brainstorm on <span className="text-white font-bold">Renewable Energy</span>. Would you like to generate a mind map or draft an outline first?
                                    </p>
                                </div>
                                <span className="text-[10px] text-slate-500 ml-1">10:42 AM</span>
                            </div>
                        </div>
                        {/* Live Suggestion Block (Contextual) */}
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#1313ec] to-purple-600 rounded-xl opacity-30 blur group-hover:opacity-60 transition duration-500"></div>
                            <div className="relative bg-[#1a1a24] rounded-lg p-4 border border-[#1313ec]/30">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2 text-[#1313ec]">
                                        <span className="material-symbols-outlined text-lg animate-pulse">lightbulb</span>
                                        <span className="text-xs font-bold uppercase tracking-wider">Live Insight</span>
                                    </div>
                                    <button className="text-slate-500 hover:text-white"><span className="material-symbols-outlined text-sm">close</span></button>
                                </div>
                                <p className="text-sm text-white mb-3 leading-relaxed">
                                    Since you added "Wind Energy", consider including a section on <strong>noise pollution impact</strong> and mitigation strategies.
                                </p>
                                <div className="flex gap-2">
                                    <button className="flex-1 bg-[#1313ec] hover:bg-blue-600 text-white text-xs font-bold py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1">
                                        <span className="material-symbols-outlined text-sm">add_circle</span>
                                        Add Node
                                    </button>
                                    <button className="px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg transition-colors">
                                        <span className="material-symbols-outlined text-sm">refresh</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* User Message */}
                        <div className="flex gap-3 flex-row-reverse">
                            <div className="size-8 shrink-0 rounded-full bg-slate-700 bg-center bg-cover" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBIQCrYEPDAGuefUrLbGAXs1fHGJQPGetiJF1LC6w5s823WOFVo3FAb-qC3Dyj4eIa0dHRNyrqm1LqvyrgFr_dJDvuOYs6ZzYlzWzpFV--N8rMdgmkk6WjF6ltXVD3EqX_DRS5VBD28zq6MCCHPvvj3muAjbSI32BUOFMu6oiY5JQgph2U8NGZKGkrHINMBUlSuB8bTVlqFQXo3ZXv1o5ITOOLvY5D7qsKCaDe6u0J1JaHnTZvocLZz7GA0uW18OiIW4f5z7Et_Z9o")' }}></div>
                            <div className="flex flex-col gap-1 items-end max-w-[85%]">
                                <div className="bg-[#1313ec] p-3 rounded-2xl rounded-tr-none text-white shadow-lg shadow-[#1313ec]/10">
                                    <p className="text-sm leading-relaxed">
                                        Create a sub-branch for "Micro-Hydro" systems in rural Indonesia.
                                    </p>
                                </div>
                                <span className="text-[10px] text-slate-500 mr-1">10:45 AM</span>
                            </div>
                        </div>
                        {/* AI Response (Processing) */}
                        <div className="flex gap-3">
                            <div className="size-8 shrink-0 rounded-full bg-[#1313ec] flex items-center justify-center text-white">
                                <span className="material-symbols-outlined text-sm">smart_toy</span>
                            </div>
                            <div className="flex flex-col gap-1 max-w-[85%]">
                                <div className="bg-[#1c1c26] border border-[#282839] p-3 rounded-2xl rounded-tl-none flex items-center gap-3">
                                    <div className="flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                                    </div>
                                    <p className="text-xs text-slate-400">Generating nodes...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Input Area */}
                    <div className="p-4 bg-[#111118] border-t border-[#282839] relative">
                        {/* Quick Prompts Pill List */}
                        <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar">
                            <button className="whitespace-nowrap px-3 py-1 bg-[#1c1c26] hover:bg-white/10 border border-[#282839] rounded-full text-[11px] font-medium text-slate-300 transition-colors">Summarize Canvas</button>
                            <button className="whitespace-nowrap px-3 py-1 bg-[#1c1c26] hover:bg-white/10 border border-[#282839] rounded-full text-[11px] font-medium text-slate-300 transition-colors">Find Sources</button>
                            <button className="whitespace-nowrap px-3 py-1 bg-[#1c1c26] hover:bg-white/10 border border-[#282839] rounded-full text-[11px] font-medium text-slate-300 transition-colors">Suggest Layout</button>
                        </div>
                        <div className="relative bg-[#1c1c26] rounded-xl border border-[#282839] focus-within:border-[#1313ec] focus-within:ring-1 focus-within:ring-[#1313ec]/50 transition-all shadow-sm">
                            <textarea className="w-full bg-transparent text-sm text-white p-3 pr-10 min-h-[50px] max-h-32 resize-none outline-none placeholder:text-slate-500" placeholder="Ask Seno to create, refine, or explain..."></textarea>
                            <div className="flex items-center justify-between px-2 pb-2">
                                <button className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
                                    <span className="material-symbols-outlined justify-center text-[20px]">add_photo_alternate</span>
                                </button>
                                <button className="p-2 bg-[#1313ec] hover:bg-blue-600 text-white rounded-lg transition-colors shadow-lg shadow-[#1313ec]/20">
                                    <span className="material-symbols-outlined text-[18px] block">send</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>
            </main>

            <style jsx global>{`
        /* Custom Dot Pattern Background for Canvas */
        .bg-grid-pattern {
            background-color: #111118;
            background-image: radial-gradient(#282839 1.5px, transparent 1.5px);
            background-size: 24px 24px;
        }
        /* Hide scrollbar for clean UI */
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
         .material-symbols-outlined {
            font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>
        </div>
    );
}
