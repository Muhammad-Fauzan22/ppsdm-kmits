"use client";

import React from 'react';

export default function AssessmentLabPage() {
    return (
        <div className="bg-[#f6f6f8] dark:bg-[#101622] font-[family-name:var(--font-inter)] text-slate-900 dark:text-white antialiased overflow-hidden flex flex-col h-screen w-full">
            {/* Header */}
            <header className="flex-none h-16 border-b border-gray-200 dark:border-[#2a3447] bg-[#f6f6f8] dark:bg-[#101622] px-6 flex items-center justify-between z-10">
                <div className="flex items-center gap-4">
                    <div className="size-8 rounded bg-[#135bec]/20 flex items-center justify-center text-[#135bec]">
                        <span className="material-symbols-outlined fill">science</span>
                    </div>
                    <div>
                        <h2 className="text-sm font-bold leading-tight tracking-wide text-gray-900 dark:text-white uppercase">PPSDM KMM</h2>
                        <p className="text-xs text-gray-500 dark:text-[#9da6b9]">Scientific Assessment Lab</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1a2230] border border-[#2a3447]">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-xs font-medium text-[#9da6b9]">System Online</span>
                    </div>
                    <button className="flex items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-[#135bec] hover:bg-blue-600 transition-colors text-white text-sm font-bold leading-normal tracking-[0.015em] shadow-lg shadow-blue-900/20">
                        <span className="truncate">Submit Assessment</span>
                    </button>
                    <div className="w-px h-8 bg-gray-200 dark:bg-[#2a3447] mx-2"></div>
                    <div className="bg-center bg-no-repeat bg-cover rounded-full size-9 border-2 border-[#1a2230] cursor-pointer ring-2 ring-transparent hover:ring-[#135bec]/50 transition-all" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCa8ImLF0FTwyeZ4N7ofiVif_A-6CgCftVXVE6ClZNG0_gZi2V5ub1HnE5XmXfvhrvneVQfL0XLPGNJ-CGFVs0TWj7rSJe-KdIVXIZdv0ei1WLG2Vg4ZVa1obfnaoiilJfeQTyp4Fb17IpQ10yZ0K-a3H4dYWqBgit97TTg1ZxhVrlyMaHoFmAnZgNd61fsCc1WwShda1EU3XBY7pg5v2LIrsGrsxjDYn5YPLkxqrZAXBvISZBinlWJ74nPXV-vUsjAVCJKns7Q5XE")' }}>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="flex-none w-72 bg-[#f6f6f8] dark:bg-[#101622] border-r border-gray-200 dark:border-[#2a3447] flex flex-col justify-between p-4 overflow-y-auto">
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-1 pb-4 border-b border-gray-200 dark:border-[#2a3447]">
                            <span className="text-[#135bec] text-xs font-bold uppercase tracking-wider">Current Session</span>
                            <h1 className="text-gray-900 dark:text-white text-lg font-bold leading-normal">Module 4</h1>
                            <p className="text-gray-500 dark:text-[#9da6b9] text-sm font-normal">Adv. Data Interpretation</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Resources</p>
                            <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-200 dark:bg-[#1a2230] border border-transparent dark:border-[#2a3447] text-gray-900 dark:text-white group hover:border-[#135bec]/50 transition-all">
                                <span className="material-symbols-outlined text-[#135bec] group-hover:scale-110 transition-transform text-[20px]">menu_book</span>
                                <p className="text-sm font-medium">Instructions</p>
                            </button>
                            <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1a2230]/50 text-gray-600 dark:text-[#9da6b9] transition-colors">
                                <span className="material-symbols-outlined text-[20px]">library_books</span>
                                <p className="text-sm font-medium">Reference Material</p>
                            </button>
                            <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1a2230]/50 text-gray-600 dark:text-[#9da6b9] transition-colors">
                                <span className="material-symbols-outlined text-[20px]">science</span>
                                <p className="text-sm font-medium">Methodology Guide</p>
                            </button>
                            <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1a2230]/50 text-gray-600 dark:text-[#9da6b9] transition-colors">
                                <span className="material-symbols-outlined text-[20px]">edit_note</span>
                                <p className="text-sm font-medium">Research Notes</p>
                            </button>
                        </div>
                        <div className="mt-4 p-4 rounded-lg bg-blue-50 dark:bg-[#135bec]/5 border border-blue-100 dark:border-[#135bec]/10">
                            <h4 className="text-blue-900 dark:text-blue-100 text-sm font-semibold mb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">info</span>
                                Tip
                            </h4>
                            <p className="text-blue-800 dark:text-blue-200/70 text-xs leading-relaxed">
                                Use the T-Test methodology for analyzing the variance in the dataset. Ensure your null hypothesis is clearly stated.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 pt-4 border-t border-gray-200 dark:border-[#2a3447]">
                        <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-2 text-[#9da6b9]">
                                <span className="material-symbols-outlined text-[20px]">timer</span>
                                <span className="text-xs font-medium uppercase tracking-wider">Time Remaining</span>
                            </div>
                        </div>
                        <div className="text-2xl font-mono font-bold text-gray-900 dark:text-white px-1 tracking-tight">
                            00:45:22
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-[#1a2230] rounded-full h-1.5 overflow-hidden">
                            <div className="bg-[#135bec] h-1.5 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                    </div>
                </aside>

                {/* Main Workspace */}
                <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-[#0b0f17]">
                    <div className="max-w-[1100px] mx-auto p-6 md:p-10 flex flex-col gap-6">
                        {/* Page Heading */}
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="bg-[#1a2230] border border-[#2a3447] text-[#9da6b9] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Scenario 1/5</span>
                                    <span className="bg-[#1a2230] border border-[#2a3447] text-[#9da6b9] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Difficulty: Hard</span>
                                </div>
                                <h1 className="text-gray-900 dark:text-white text-3xl font-bold leading-tight">Case Study #884: Climate Anomalies</h1>
                                <p className="text-gray-500 dark:text-[#9da6b9] text-sm max-w-2xl">Analyze the provided dataset regarding localized climate anomalies in sector 7 and propose a hypothesis for the variance observed in the last 24 hours.</p>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1a2230] border border-gray-200 dark:border-[#2a3447] rounded-lg text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-[#2a3447] transition-colors shadow-sm">
                                <span className="material-symbols-outlined text-[18px]">visibility</span>
                                View Full Prompt
                            </button>
                        </div>

                        {/* Tabs & Visualization Container */}
                        <div className="bg-white dark:bg-[#1a2230] rounded-xl border border-gray-200 dark:border-[#2a3447] shadow-sm overflow-hidden">
                            {/* Tabs */}
                            <div className="border-b border-gray-200 dark:border-[#2a3447] bg-gray-50/50 dark:bg-black/20 px-6">
                                <div className="flex gap-8">
                                    <button className="group flex items-center gap-2 border-b-2 border-[#135bec] py-4 px-1 text-[#135bec]">
                                        <span className="material-symbols-outlined text-[20px]">monitoring</span>
                                        <p className="text-sm font-bold tracking-[0.015em]">Data Visualization</p>
                                    </button>
                                    <button className="group flex items-center gap-2 border-b-2 border-transparent py-4 px-1 text-gray-500 dark:text-[#9da6b9] hover:text-gray-900 dark:hover:text-white transition-colors">
                                        <span className="material-symbols-outlined text-[20px]">dataset</span>
                                        <p className="text-sm font-bold tracking-[0.015em]">Raw Data Set</p>
                                    </button>
                                    <button className="group flex items-center gap-2 border-b-2 border-transparent py-4 px-1 text-gray-500 dark:text-[#9da6b9] hover:text-gray-900 dark:hover:text-white transition-colors">
                                        <span className="material-symbols-outlined text-[20px]">terminal</span>
                                        <p className="text-sm font-bold tracking-[0.015em]">Simulation Log</p>
                                    </button>
                                </div>
                            </div>

                            {/* Chart Content */}
                            <div className="p-6 md:p-8">
                                <div className="flex flex-col gap-6">
                                    <div className="flex flex-wrap items-end justify-between gap-4">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Variable Variance in Controlled Environments</h3>
                                            <p className="text-sm text-[#9da6b9] mt-1">Real-time telemetry from sensor array T-01 through T-07</p>
                                        </div>
                                        <div className="flex items-baseline gap-3 bg-[#f6f6f8] dark:bg-[#101622] px-4 py-2 rounded-lg border border-gray-200 dark:border-[#2a3447]">
                                            <span className="text-sm text-[#9da6b9] font-medium">Variance</span>
                                            <span className="text-2xl font-bold text-gray-900 dark:text-white">12.4%</span>
                                            <span className="flex items-center text-sm font-medium text-emerald-500">
                                                <span className="material-symbols-outlined text-[16px]">trending_up</span>
                                                +2.1%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="relative h-[250px] w-full mt-4">
                                        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 478 150" xmlns="http://www.w3.org/2000/svg">
                                            <defs>
                                                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                                    <stop offset="0%" stopColor="#135bec" stopOpacity="0.2"></stop>
                                                    <stop offset="100%" stopColor="#135bec" stopOpacity="0"></stop>
                                                </linearGradient>
                                            </defs>
                                            <line opacity="0.5" stroke="#2a3447" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="478" y1="0" y2="0"></line>
                                            <line opacity="0.5" stroke="#2a3447" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="478" y1="50" y2="50"></line>
                                            <line opacity="0.5" stroke="#2a3447" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="478" y1="100" y2="100"></line>
                                            <line opacity="0.5" stroke="#2a3447" strokeWidth="1" x1="0" x2="478" y1="150" y2="150"></line>
                                            <path d="M0 109 C18.15 109 18.15 21 36.3 21 C54.46 21 54.46 41 72.61 41 C90.76 41 90.76 93 108.92 93 C127.07 93 127.07 33 145.23 33 C163.38 33 163.38 101 181.53 101 C199.69 101 199.69 61 217.84 61 C236 61 236 45 254.15 45 C272.3 45 272.3 121 290.46 121 C308.61 121 308.61 149 326.76 149 C344.92 149 344.92 1 363.07 1 C381.23 1 381.23 81 399.38 81 C417.53 81 417.53 129 435.69 129 C453.84 129 453.84 25 472 25 V150 H0 Z" fill="url(#chartGradient)"></path>
                                            <path d="M0 109 C18.15 109 18.15 21 36.3 21 C54.46 21 54.46 41 72.61 41 C90.76 41 90.76 93 108.92 93 C127.07 93 127.07 33 145.23 33 C163.38 33 163.38 101 181.53 101 C199.69 101 199.69 61 217.84 61 C236 61 236 45 254.15 45 C272.3 45 272.3 121 290.46 121 C308.61 121 308.61 149 326.76 149 C344.92 149 344.92 1 363.07 1 C381.23 1 381.23 81 399.38 81 C417.53 81 417.53 129 435.69 129 C453.84 129 453.84 25 472 25" fill="none" stroke="#135bec" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path>
                                            <circle cx="217.84" cy="61" fill="#101622" r="4" stroke="#fff" strokeWidth="2"></circle>
                                            <circle cx="363.07" cy="1" fill="#101622" r="4" stroke="#fff" strokeWidth="2"></circle>
                                        </svg>
                                    </div>
                                    <div className="flex justify-between px-2 pt-2 border-t border-gray-200 dark:border-[#2a3447] mt-2">
                                        <p className="text-xs font-mono font-bold text-[#9da6b9]">T-01</p>
                                        <p className="text-xs font-mono font-bold text-[#9da6b9]">T-02</p>
                                        <p className="text-xs font-mono font-bold text-[#9da6b9]">T-03</p>
                                        <p className="text-xs font-mono font-bold text-[#9da6b9]">T-04</p>
                                        <p className="text-xs font-mono font-bold text-[#9da6b9]">T-05</p>
                                        <p className="text-xs font-mono font-bold text-[#9da6b9]">T-06</p>
                                        <p className="text-xs font-mono font-bold text-[#9da6b9]">T-07</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Response Area */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left: Input */}
                            <div className="lg:col-span-2 bg-white dark:bg-[#1a2230] rounded-xl border border-gray-200 dark:border-[#2a3447] p-6 flex flex-col gap-4 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[#135bec] text-[20px]">edit_note</span>
                                        Hypothesis Formulation
                                    </h3>
                                    <span className="text-xs text-[#9da6b9] flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[14px]">cloud_done</span>
                                        Draft saved 30s ago
                                    </span>
                                </div>
                                <div className="flex flex-col border border-gray-200 dark:border-[#2a3447] rounded-lg overflow-hidden bg-[#f6f6f8] dark:bg-[#101622] focus-within:ring-2 focus-within:ring-[#135bec]/50 transition-shadow">
                                    {/* Editor Toolbar */}
                                    <div className="flex items-center gap-1 p-2 border-b border-gray-200 dark:border-[#2a3447] bg-gray-50 dark:bg-[#151b26]">
                                        <button className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-[#2a3447] text-gray-600 dark:text-gray-400">
                                            <span className="material-symbols-outlined text-[18px]">format_bold</span>
                                        </button>
                                        <button className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-[#2a3447] text-gray-600 dark:text-gray-400">
                                            <span className="material-symbols-outlined text-[18px]">format_italic</span>
                                        </button>
                                        <button className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-[#2a3447] text-gray-600 dark:text-gray-400">
                                            <span className="material-symbols-outlined text-[18px]">format_underlined</span>
                                        </button>
                                        <div className="w-px h-4 bg-gray-300 dark:bg-[#2a3447] mx-1"></div>
                                        <button className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-[#2a3447] text-gray-600 dark:text-gray-400">
                                            <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
                                        </button>
                                        <button className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-[#2a3447] text-gray-600 dark:text-gray-400">
                                            <span className="material-symbols-outlined text-[18px]">format_list_numbered</span>
                                        </button>
                                        <div className="w-px h-4 bg-gray-300 dark:bg-[#2a3447] mx-1"></div>
                                        <button className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-[#2a3447] text-gray-600 dark:text-gray-400">
                                            <span className="material-symbols-outlined text-[18px]">functions</span>
                                        </button>
                                    </div>
                                    <textarea className="w-full h-48 bg-transparent p-4 text-sm text-gray-900 dark:text-gray-200 border-none outline-none resize-none font-sans leading-relaxed" placeholder="State your null hypothesis and describe the statistical methodology you will employ to validate it..."></textarea>
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button className="px-4 py-2 rounded-lg border border-gray-200 dark:border-[#2a3447] text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#2a3447] transition-colors">Save Draft</button>
                                    <button className="px-4 py-2 rounded-lg bg-[#135bec] hover:bg-blue-600 text-white text-sm font-medium transition-colors shadow-lg shadow-[#135bec]/20">Finalize & Attach</button>
                                </div>
                            </div>

                            {/* Right: Data Points */}
                            <div className="bg-white dark:bg-[#1a2230] rounded-xl border border-gray-200 dark:border-[#2a3447] p-6 flex flex-col gap-4 shadow-sm h-fit">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-[#9da6b9]">Key Parameters</h3>
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-[#f6f6f8] dark:bg-[#101622] border border-gray-100 dark:border-[#2a3447]">
                                        <div className="flex items-center gap-3">
                                            <span className="p-1.5 rounded bg-blue-100 dark:bg-blue-900/30 text-[#135bec]">
                                                <span className="material-symbols-outlined text-[18px]">thermostat</span>
                                            </span>
                                            <div className="flex flex-col">
                                                <span className="text-xs text-[#9da6b9]">Mean Temp</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">24.5 °C</span>
                                            </div>
                                        </div>
                                        <span className="text-xs font-mono text-emerald-500">σ = 0.4</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-[#f6f6f8] dark:bg-[#101622] border border-gray-100 dark:border-[#2a3447]">
                                        <div className="flex items-center gap-3">
                                            <span className="p-1.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-500">
                                                <span className="material-symbols-outlined text-[18px]">water_drop</span>
                                            </span>
                                            <div className="flex flex-col">
                                                <span className="text-xs text-[#9da6b9]">Humidity</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">58.2 %</span>
                                            </div>
                                        </div>
                                        <span className="text-xs font-mono text-rose-500">σ = 2.1</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-[#f6f6f8] dark:bg-[#101622] border border-gray-100 dark:border-[#2a3447]">
                                        <div className="flex items-center gap-3">
                                            <span className="p-1.5 rounded bg-orange-100 dark:bg-orange-900/30 text-orange-500">
                                                <span className="material-symbols-outlined text-[18px]">air</span>
                                            </span>
                                            <div className="flex flex-col">
                                                <span className="text-xs text-[#9da6b9]">Pressure</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">1013 hPa</span>
                                            </div>
                                        </div>
                                        <span className="text-xs font-mono text-[#9da6b9]">σ = 0.1</span>
                                    </div>
                                </div>
                                <button className="w-full mt-2 py-2 text-xs font-medium text-[#135bec] hover:text-blue-400 border border-dashed border-gray-300 dark:border-[#2a3447] rounded hover:bg-[#135bec]/5 transition-colors">
                                    + Add Parameter Filter
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <style jsx global>{`
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .material-symbols-outlined.fill {
            font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>
        </div>
    );
}
