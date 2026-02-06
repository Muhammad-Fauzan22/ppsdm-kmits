"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function AILogicPage() {
    const [salaryWeight, setSalaryWeight] = useState(50);

    return (
        <div className="flex h-screen bg-[#0E1016] text-white font-sans overflow-hidden">
            {/* Main Canvas Area */}
            <main className="flex-1 flex flex-col relative">
                {/* Header */}
                <header className="p-8 pb-4 z-10">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <Link href="#">Home</Link> / <Link href="#">Insights</Link> / <span className="text-white">XAI Logic Explorer</span>
                    </div>
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">AI Logic Explorer</h1>
                            <p className="text-gray-400 max-w-lg">Transparency regarding your &quot;Senior Data Analyst&quot; path recommendation.</p>
                        </div>
                        <div className="bg-[#1C1E26] border border-[#2D303E] px-4 py-2 rounded-lg flex items-center gap-4">
                            <div className="size-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 font-bold uppercase">Data Trust Score</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-xl font-bold">92/100</span>
                                    <span className="text-green-500 text-xs font-bold">+5%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 relative overflow-hidden bg-[#0E1016]">
                    {/* Background Grid */}
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                    {/* Visualization Area */}
                    <div className="absolute inset-x-8 inset-y-4 border border-[#2D303E] rounded-3xl bg-[#0B0C11]/80 backdrop-blur-sm relative overflow-hidden">
                        <div className="absolute top-4 right-4 z-10">
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-[#1C1E26] border border-[#2D303E] rounded text-xs text-gray-400 hover:text-white">
                                <span className="material-symbols-outlined text-sm">restart_alt</span> Reset View
                            </button>
                        </div>

                        <div className="p-6">
                            <h3 className="font-bold mb-4">Decision Logic Flow</h3>

                            {/* SVG Graph Visualization Placeholder */}
                            <div className="relative h-[600px] w-full">
                                {/* Nodes */}

                                {/* Center Node: AI Logic */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-24 rounded-full bg-[#1C1E26] border-2 border-blue-600 shadow-[0_0_40px_rgba(37,99,235,0.3)] z-20 flex flex-col items-center justify-center">
                                    <span className="material-symbols-outlined text-blue-500 text-3xl mb-1">psychology</span>
                                    <span className="text-[10px] font-bold tracking-wider">AI LOGIC</span>
                                </div>

                                {/* Left Node: Python Skill */}
                                <div className="absolute top-1/3 left-1/4 -translate-y-1/2 p-4 bg-[#1C1E26] border border-[#2D303E] rounded-xl w-64 z-10">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-bold text-gray-400">INPUT FEATURE</span>
                                        <span className="bg-purple-900/50 text-purple-300 text-[10px] px-1.5 py-0.5 rounded border border-purple-800">40% Impact</span>
                                    </div>
                                    <h4 className="font-bold text-sm mb-1">Technical Skills</h4>
                                    <p className="text-[10px] text-gray-500">Python, SQL, Tableau</p>

                                    {/* Connector Line (Fake) */}
                                    <svg className="absolute top-1/2 -right-[150px] w-[150px] h-[100px] pointer-events-none" style={{ transform: 'translateY(50%)' }}>
                                        <path d="M0,0 C75,0 75,100 150,100" fill="none" stroke="#4B5563" strokeWidth="2" strokeDasharray="4,4" className="animate-dash" />
                                    </svg>
                                </div>

                                {/* Result Node */}
                                <div className="absolute top-1/2 left-3/4 translate-y-[-50%] p-1 bg-blue-600/10 border border-blue-500 rounded-xl w-72 z-10 backdrop-blur-md">
                                    <div className="bg-[#0E1016] rounded-lg p-4 border border-blue-500/30 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-2">
                                            <span className="material-symbols-outlined text-blue-500">star</span>
                                        </div>
                                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Recommendation</h4>
                                        <h3 className="text-xl font-bold text-blue-400 mb-4">Data Analyst</h3>

                                        <div className="flex justify-between items-end border-t border-gray-800 pt-3">
                                            <div>
                                                <p className="text-[10px] text-gray-500">Match Score</p>
                                                <p className="font-bold">94%</p>
                                            </div>
                                            <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded font-bold">View Path</button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                {/* Left Floating Panel: Explanation */}
                <div className="absolute top-32 left-16 w-80 bg-[#16181D] border border-[#2D303E] rounded-2xl p-5 shadow-2xl z-30">
                    <div className="bg-blue-900/20 text-blue-400 text-[10px] font-bold px-2 py-1 rounded w-fit mb-3 border border-blue-900/50">Top Match</div>
                    <h3 className="text-lg font-bold text-white mb-2">Senior Data Analyst</h3>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs text-gray-400">Confidence Match</span>
                        <span className="font-mono font-bold text-white">88%</span>
                    </div>
                    <div className="w-full bg-gray-800 h-1 rounded-full mb-4">
                        <div className="bg-blue-600 h-full rounded-full w-[88%]"></div>
                    </div>

                    <p className="text-xs text-gray-400 leading-relaxed mb-4">
                        This path was selected because your <span className="text-white">Python assessment scores</span> align with current market demand in FinTech.
                    </p>

                    <button className="w-full bg-[#1C1E26] hover:bg-[#252830] border border-[#2D303E] text-white text-xs font-bold py-2.5 rounded-lg transition-colors">
                        View Career Details
                    </button>
                </div>

                {/* Bottom Left Panel: Contributors */}
                <div className="absolute bottom-8 left-16 w-64 bg-[#16181D] border border-[#2D303E] rounded-2xl p-1 shadow-2xl z-30">
                    <div className="px-4 py-3 border-b border-[#2D303E]">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Top Contributors</h4>
                    </div>
                    <div className="p-2 space-y-1">
                        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#1C1E26] group cursor-pointer transition-colors">
                            <div className="size-8 rounded bg-purple-900/30 text-purple-400 flex items-center justify-center font-bold text-xs border border-purple-500/20 group-hover:bg-purple-900/50">
                                <span className="material-symbols-outlined text-[16px]">school</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-bold text-white">Skills</p>
                                <p className="text-[10px] text-gray-500">Score: 94/100</p>
                            </div>
                            <span className="text-xs font-bold text-purple-400">+40%</span>
                        </div>
                        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#1C1E26] group cursor-pointer transition-colors">
                            <div className="size-8 rounded bg-blue-900/30 text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-500/20 group-hover:bg-blue-900/50">
                                <span className="material-symbols-outlined text-[16px]">trending_up</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-bold text-white">Market</p>
                                <p className="text-[10px] text-gray-500">High Growth</p>
                            </div>
                            <span className="text-xs font-bold text-blue-400">+35%</span>
                        </div>
                        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#1C1E26] group cursor-pointer transition-colors">
                            <div className="size-8 rounded bg-green-900/30 text-green-400 flex items-center justify-center font-bold text-xs border border-green-500/20 group-hover:bg-green-900/50">
                                <span className="material-symbols-outlined text-[16px]">interests</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-bold text-white">Interest</p>
                                <p className="text-[10px] text-gray-500">Based on survey</p>
                            </div>
                            <span className="text-xs font-bold text-green-400">+25%</span>
                        </div>
                    </div>
                </div>

            </main>

            {/* Right Sidebar: Controls */}
            <aside className="w-80 bg-[#16181D] border-l border-[#2D303E] p-6 flex flex-col z-20">
                <h2 className="text-lg font-bold mb-1">Fine-tune Model</h2>
                <p className="text-xs text-gray-400 mb-8">Adjust weights to see how the recommendation changes.</p>

                <div className="space-y-8 flex-1">
                    {/* Slider 1 */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-purple-400 text-sm">school</span>
                                <span className="text-sm font-bold">Skills Importance</span>
                            </div>
                            <span className="bg-[#2D303E] text-xs px-2 py-0.5 rounded text-gray-300">High</span>
                        </div>
                        <input type="range" className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-white" />
                        <div className="flex justify-between text-[10px] text-gray-600 mt-1 uppercase font-bold tracking-wider">
                            <span>Low</span>
                            <span>Critical</span>
                        </div>
                    </div>

                    {/* Slider 2 */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-400 text-sm">currency_exchange</span>
                                <span className="text-sm font-bold">Salary Weight</span>
                            </div>
                            <span className="bg-[#2D303E] text-xs px-2 py-0.5 rounded text-gray-300">Med</span>
                        </div>
                        <input type="range" className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-white" />
                        <div className="flex justify-between text-[10px] text-gray-600 mt-1 uppercase font-bold tracking-wider">
                            <span>Low</span>
                            <span>Critical</span>
                        </div>
                    </div>

                    {/* Slider 3 */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-green-400 text-sm">public</span>
                                <span className="text-sm font-bold">Remote Work</span>
                            </div>
                            <span className="bg-[#2D303E] text-xs px-2 py-0.5 rounded text-gray-300">Low</span>
                        </div>
                        <input type="range" className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-white" />
                        <div className="flex justify-between text-[10px] text-gray-600 mt-1 uppercase font-bold tracking-wider">
                            <span>Low</span>
                            <span>Critical</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg flex gap-3 items-start mb-4">
                        <span className="material-symbols-outlined text-yellow-500 text-sm mt-0.5">lightbulb</span>
                        <p className="text-[10px] text-yellow-200 leading-relaxed">
                            Adjusting weights will regenerate your career roadmap.
                        </p>
                    </div>

                    <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
                        <span className="material-symbols-outlined text-[18px]">refresh</span>
                        Recalculate Logic
                    </button>
                </div>
            </aside>
        </div>
    );
}
