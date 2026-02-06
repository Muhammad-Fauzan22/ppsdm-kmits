"use client";

import React from 'react';

export default function CrisisSimulatorPage() {
    return (
        <div className="bg-[#f6f6f8] dark:bg-[#101022] text-slate-900 dark:text-white font-[family-name:var(--font-space-grotesk)] overflow-hidden h-screen flex flex-col">
            {/* Top Navigation */}
            <header className="flex-none flex items-center justify-between border-b border-solid border-[#282839] dark:bg-[#111118] px-8 py-4">
                <div className="flex items-center gap-4 text-white">
                    <div className="size-8 rounded bg-[#1313ec] flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-xl">smart_toy</span>
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-[#111118] dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">PPSDM KMM</h2>
                        <span className="text-xs text-slate-400 uppercase tracking-widest font-medium">Leadership Assessment Module</span>
                    </div>
                </div>
                <div className="flex flex-1 justify-center">
                    <div className="bg-[#1a1a24] border border-[#282839] px-4 py-2 rounded-full flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#1313ec] text-xl">timer</span>
                        <span className="text-white font-bold text-lg tracking-widest tabular-nums">04:30</span>
                        <span className="text-slate-500 text-sm">|</span>
                        <span className="text-slate-400 text-sm font-medium">Turn 4/10</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button className="flex items-center justify-center rounded-lg h-10 px-4 bg-[#1313ec]/20 hover:bg-[#1313ec]/30 text-[#1313ec] border border-[#1313ec]/30 transition-colors text-sm font-bold leading-normal">
                        <span className="material-symbols-outlined mr-2 text-lg">pause</span>
                        Pause
                    </button>
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-[#1313ec]/50" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBcR7DSbRqeyHk-yXvf59mSUFs6wQRMLR3kFLChjLA-TV8lvrbjMBCCj5cfR2nOON5WxkdWfcThwWIsI53w410y3yJALm2C3TFnQVl0WBZIHtcYeBRJMGZLFVEwFLhoSL0OcayMAUsxQRC7OpQmljHBDvBfzM0lPiUkDXMeyufm2RQIlPMmlCKvKGqHHVizht8gRECnO-UmiITwMsSqLh56N49rtYGcQl5MyPi7JQjpUFcT7v_CM8LPD9oMZpnAuz-ereqUQRjNm4M")' }}></div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex overflow-hidden">
                {/* Left Column: Scenario & Chat (Crisis Feed) */}
                <div className="flex-1 flex flex-col min-w-0 border-r border-[#282839] bg-[#111118]/50 relative">
                    {/* Scenario Header */}
                    <div className="p-8 border-b border-[#282839] bg-[#1a1a24]/30 backdrop-blur-sm sticky top-0 z-10">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-xs font-bold uppercase border border-red-500/20 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[14px]">warning</span> Critical
                                    </span>
                                    <span className="text-slate-500 text-sm">Scenario #402</span>
                                </div>
                                <h1 className="text-3xl font-bold text-[#111118] dark:text-white tracking-tight">The Data Leak</h1>
                            </div>
                        </div>
                    </div>

                    {/* Chat / Terminal Feed */}
                    <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6 custom-scrollbar">
                        {/* AI Message */}
                        <div className="flex gap-4 max-w-3xl">
                            <div className="size-10 rounded-full bg-slate-800 border border-slate-700 flex-none flex items-center justify-center mt-1">
                                <span className="material-symbols-outlined text-slate-400">smart_toy</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-sm font-bold text-slate-400">Crisis Bot • 04:28 PM</span>
                                <div className="p-5 rounded-r-2xl rounded-bl-2xl bg-[#1a1a24] border border-[#282839] text-slate-200 leading-relaxed">
                                    <p className="mb-3"><span className="text-[#1313ec] font-bold">[System Alert]</span> New intelligence received.</p>
                                    <p>Your Head of IT has just confirmed that the breach originated from a compromised executive account. The press has gotten wind of the story and a reporter from a major tech blog is on line 1 asking for a statement.</p>
                                    <p className="mt-3">Internal chatter is spiking. Your team is panicking and looking for direction. Silence is being interpreted as guilt.</p>
                                    <p className="font-bold text-white mt-4">What is your immediate move?</p>
                                </div>
                            </div>
                        </div>

                        {/* Previous User Choice (History) */}
                        <div className="flex gap-4 max-w-3xl self-end flex-row-reverse opacity-60">
                            <div className="size-10 rounded-full bg-[#1313ec]/20 border border-[#1313ec]/30 flex-none flex items-center justify-center mt-1">
                                <span className="material-symbols-outlined text-[#1313ec]">person</span>
                            </div>
                            <div className="flex flex-col gap-2 items-end">
                                <span className="text-sm font-bold text-slate-400">You • Turn 3</span>
                                <div className="p-4 rounded-l-2xl rounded-br-2xl bg-[#1313ec]/10 border border-[#1313ec]/20 text-white">
                                    Authorized the initial server diagnostics scan.
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Decision Console (Bottom Fixed) */}
                    <div className="p-6 border-t border-[#282839] bg-[#1a1a24]">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">alt_route</span> Available Actions
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button className="group text-left p-4 rounded-xl border border-[#282839] bg-[#111118] hover:bg-[#1313ec] hover:border-[#1313ec] transition-all duration-200 shadow-lg hover:shadow-[#1313ec]/20 flex flex-col gap-2 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="material-symbols-outlined text-white">check_circle</span>
                                </div>
                                <span className="text-xs font-bold text-[#1313ec] group-hover:text-white/80 uppercase tracking-wider">Option A • Defensive</span>
                                <p className="text-white font-medium text-sm">Lock down all servers immediately and issue a 'No Comment'.</p>
                            </button>
                            <button className="group text-left p-4 rounded-xl border border-[#282839] bg-[#111118] hover:bg-[#1313ec] hover:border-[#1313ec] transition-all duration-200 shadow-lg hover:shadow-[#1313ec]/20 flex flex-col gap-2 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="material-symbols-outlined text-white">check_circle</span>
                                </div>
                                <span className="text-xs font-bold text-[#1313ec] group-hover:text-white/80 uppercase tracking-wider">Option B • Collaborative</span>
                                <p className="text-white font-medium text-sm">Gather the leadership team for an emergency briefing first.</p>
                            </button>
                            <button className="group text-left p-4 rounded-xl border border-[#282839] bg-[#111118] hover:bg-[#1313ec] hover:border-[#1313ec] transition-all duration-200 shadow-lg hover:shadow-[#1313ec]/20 flex flex-col gap-2 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="material-symbols-outlined text-white">check_circle</span>
                                </div>
                                <span className="text-xs font-bold text-[#1313ec] group-hover:text-white/80 uppercase tracking-wider">Option C • Transparent</span>
                                <p className="text-white font-medium text-sm">Draft a public apology immediately to maintain transparency.</p>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Analytics & Feedback */}
                <div className="w-96 flex-none bg-[#111118] border-l border-[#282839] overflow-y-auto custom-scrollbar flex flex-col">
                    {/* Real-time Metrics */}
                    <div className="p-6 border-b border-[#282839]">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[#1313ec]">analytics</span> Live Metrics
                        </h3>
                        {/* Stress Level */}
                        <div className="mb-8">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-slate-400 text-sm font-medium">Org. Stress Level</span>
                                <span className="text-red-400 font-bold text-xl">High (65%)</span>
                            </div>
                            <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden relative">
                                {/* Markers */}
                                <div className="absolute left-[33%] top-0 bottom-0 w-0.5 bg-[#101022] z-10"></div>
                                <div className="absolute left-[66%] top-0 bottom-0 w-0.5 bg-[#101022] z-10"></div>
                                <div className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 w-[65%] rounded-full shadow-[0_0_10px_rgba(248,113,113,0.5)]"></div>
                            </div>
                            <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">trending_up</span>
                                Stress trending upward (+15% since start)
                            </p>
                        </div>
                        {/* Scores Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#1a1a24] border border-[#282839] p-4 rounded-xl flex flex-col gap-1">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="material-symbols-outlined text-purple-400">psychology</span>
                                    <span className="text-xs font-bold text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded">+2%</span>
                                </div>
                                <span className="text-slate-400 text-xs uppercase">Empathy</span>
                                <span className="text-white text-2xl font-bold">72</span>
                            </div>
                            <div className="bg-[#1a1a24] border border-[#282839] p-4 rounded-xl flex flex-col gap-1">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="material-symbols-outlined text-blue-400">strategy</span>
                                    <span className="text-xs font-bold text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded">+5%</span>
                                </div>
                                <span className="text-slate-400 text-xs uppercase">Strategy</span>
                                <span className="text-white text-2xl font-bold">85</span>
                            </div>
                        </div>
                    </div>

                    {/* AI Feedback Panel */}
                    <div className="flex-1 p-6 flex flex-col">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[#1313ec]">psychology_alt</span> AI Analysis Log
                        </h3>
                        <div className="flex-1 flex flex-col gap-4">
                            {/* Current Log */}
                            <div className="bg-[#1313ec]/5 border border-[#1313ec]/20 rounded-xl p-4 relative group">
                                <div className="absolute -left-1 top-4 h-8 w-1 bg-[#1313ec] rounded-r"></div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[#1313ec] text-xs font-bold uppercase tracking-wider">Latest Action Analysis</span>
                                    <span className="text-slate-500 text-[10px]">Just now</span>
                                </div>
                                <p className="text-slate-300 text-sm leading-relaxed mb-3">
                                    The choice to <span className="text-white font-medium">run diagnostics</span> was logically sound but delayed communication.
                                </p>
                                <div className="bg-[#111118] rounded border border-[#1313ec]/10 p-3 text-xs text-slate-400 font-mono">
                                    &gt; Impact: Anxiety +5<br />
                                    &gt; Impact: Knowledge +10<br />
                                    &gt; Rec: Follow up quickly.
                                </div>
                            </div>
                            {/* Past Logs Accordion Style */}
                            <details className="group bg-[#1a1a24] border border-[#282839] rounded-xl overflow-hidden">
                                <summary className="flex cursor-pointer items-center justify-between p-4 bg-[#1a1a24] hover:bg-[#20202c] transition-colors">
                                    <div className="flex flex-col">
                                        <span className="text-white text-sm font-medium">Turn 2: Team Briefing</span>
                                        <span className="text-slate-500 text-xs">Strategy Score Impact: High</span>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform">expand_more</span>
                                </summary>
                                <div className="p-4 pt-0 border-t border-[#282839]/50 bg-[#15151e]">
                                    <p className="text-slate-400 text-sm mt-3">
                                        Excellent choice to involve stakeholders early. This boosted team morale significantly, although it cost valuable time.
                                    </p>
                                    <div className="flex gap-2 mt-3">
                                        <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-1 rounded border border-green-500/20">+10 Morale</span>
                                        <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-1 rounded border border-red-500/20">-15mins Time</span>
                                    </div>
                                </div>
                            </details>
                            <details className="group bg-[#1a1a24] border border-[#282839] rounded-xl overflow-hidden">
                                <summary className="flex cursor-pointer items-center justify-between p-4 bg-[#1a1a24] hover:bg-[#20202c] transition-colors">
                                    <div className="flex flex-col">
                                        <span className="text-white text-sm font-medium">Turn 1: Initial Alert</span>
                                        <span className="text-slate-500 text-xs">Reaction Time: Optimal</span>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform">expand_more</span>
                                </summary>
                                <div className="p-4 pt-0 border-t border-[#282839]/50 bg-[#15151e]">
                                    <p className="text-slate-400 text-sm mt-3">
                                        Immediate acknowledgement of the crisis set a proactive tone.
                                    </p>
                                </div>
                            </details>
                        </div>
                        {/* Helper Tip */}
                        <div className="mt-auto pt-6">
                            <div className="flex gap-3 items-start p-3 bg-blue-500/5 rounded-lg border border-blue-500/10">
                                <span className="material-symbols-outlined text-blue-400 text-lg mt-0.5">lightbulb</span>
                                <p className="text-xs text-blue-200/80 leading-relaxed">
                                    <span className="font-bold text-blue-300">Pro Tip:</span> In data leak scenarios, transparency often yields higher long-term trust scores than immediate containment attempts.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #111118;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #282839;
          border-radius: 3px;
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>
        </div>
    );
}
