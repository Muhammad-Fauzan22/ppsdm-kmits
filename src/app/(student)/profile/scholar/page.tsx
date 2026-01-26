"use client";

import React from "react";
import Link from "next/link";

export default function ScholarProfilePage() {
    return (
        <div className="min-h-screen bg-[#0E1015] text-white font-sans p-8">

            {/* Header */}
            <div className="bg-[#151921] rounded-3xl p-8 border border-[#2D303E] shadow-2xl relative mb-8 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/5 rotate-12 blur-3xl"></div>

                <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
                    <div className="flex items-center gap-6">
                        <div className="size-32 rounded-3xl bg-orange-100 border-4 border-[#2D303E] overflow-hidden shadow-2xl relative">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&clothing=hoodie&clothingColor=blue02" className="w-full h-full" />
                            <div className="absolute bottom-0 inset-x-0 bg-blue-600 text-center text-[10px] font-bold py-1 uppercase tracking-widest text-white">
                                Verified
                            </div>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold mb-1">Scholar Alex Smith</h1>
                            <p className="text-gray-400 mb-4">Computer Science Department • Class of 2025</p>
                            <div className="bg-[#1C2028] border border-[#2D303E] rounded px-3 py-1 inline-flex items-center gap-2 text-xs font-mono text-gray-500">
                                <span className="material-symbols-outlined text-sm">fingerprint</span> ID: 884-291-KMM
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-4 min-w-[300px]">
                        <div className="flex gap-2">
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg hover:bg-blue-500">
                                <span className="material-symbols-outlined text-sm">download</span> Download CV
                            </button>
                            <button className="bg-[#1C2028] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 border border-[#2D303E] hover:bg-[#252932]">
                                <span className="material-symbols-outlined text-sm">share</span> Share Profile
                            </button>
                        </div>

                        <div className="w-full">
                            <div className="flex justify-between text-xs font-bold uppercase mb-2 text-blue-500">
                                <span>Level 4 Scholar</span>
                                <span className="text-gray-500">750/1000 XP</span>
                            </div>
                            <div className="h-3 w-full bg-[#1C2028] rounded-full overflow-hidden border border-[#2D303E]">
                                <div className="h-full bg-blue-600 w-3/4 rounded-full shadow-[0_0_10px_#2563EB]"></div>
                            </div>
                            <p className="text-[10px] text-gray-500 mt-2 text-right">Next Reward: <span className="text-blue-400">Advanced Research Access Grant</span></p>
                        </div>

                        <div className="flex gap-2">
                            {['12 Badges', 'Top 5%', 'Project Lead'].map((badge, i) => (
                                <div key={badge} className="bg-[#1C2028] border border-[#2D303E] rounded px-2 py-1 flex items-center gap-2">
                                    <span className={`material-symbols-outlined text-xs ${i === 0 ? 'text-yellow-500' : i === 1 ? 'text-green-500' : 'text-purple-500'}`}>
                                        {i === 0 ? 'emoji_events' : i === 1 ? 'leaderboard' : 'stars'}
                                    </span>
                                    <span className="text-[10px] font-bold">{badge}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Left Col: Trophy Case */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-blue-500">military_tech</span>
                            <h2 className="font-bold text-lg">Trophy Case</h2>
                        </div>
                        <div className="bg-[#1C2028] rounded p-1 flex text-[10px] font-bold">
                            <button className="bg-blue-600 text-white px-3 py-1 rounded">All</button>
                            <button className="text-gray-500 px-3 py-1">Academic</button>
                            <button className="text-gray-500 px-3 py-1">Extracurricular</button>
                        </div>
                    </div>

                    <div className="bg-[#151921] border border-[#2D303E] rounded-[32px] p-8 min-h-[400px] flex items-center justify-center relative overflow-hidden">

                        {/* Hex Grid Layout */}
                        <div className="grid grid-cols-4 gap-4 relative z-10 scale-90">

                            {/* Hex Items (Top Row) */}
                            <div className="col-span-4 flex justify-center gap-4 mb-4">
                                {/* Hex 1 */}
                                <div className="w-24 h-28 relative flex items-center justify-center group">
                                    <svg className="absolute w-full h-full text-[#1C2028] group-hover:text-blue-900 transition-colors" viewBox="0 0 100 115" fill="currentColor">
                                        <path d="M50 0 L93.3 25 V75 L50 100 L6.7 75 V25 Z" stroke="#3B82F6" strokeWidth="2" />
                                    </svg>
                                    <div className="relative z-10 text-center flex flex-col items-center">
                                        <span className="material-symbols-outlined text-blue-500 text-2xl mb-1">lightbulb</span>
                                        <span className="text-[8px] font-bold text-blue-500 uppercase tracking-widest">Innovator</span>
                                    </div>
                                </div>
                                {/* Hex 2 */}
                                <div className="w-24 h-28 relative flex items-center justify-center group">
                                    <svg className="absolute w-full h-full text-[#1C2028] group-hover:text-purple-900 transition-colors" viewBox="0 0 100 115" fill="currentColor">
                                        <path d="M50 0 L93.3 25 V75 L50 100 L6.7 75 V25 Z" stroke="#A855F7" strokeWidth="2" />
                                    </svg>
                                    <div className="relative z-10 text-center flex flex-col items-center">
                                        <span className="material-symbols-outlined text-purple-500 text-2xl mb-1">record_voice_over</span>
                                        <span className="text-[8px] font-bold text-purple-500 uppercase tracking-widest">Orator</span>
                                    </div>
                                </div>
                                {/* Hex 3 */}
                                <div className="w-24 h-28 relative flex items-center justify-center group">
                                    <svg className="absolute w-full h-full text-[#1C2028] group-hover:text-green-900 transition-colors" viewBox="0 0 100 115" fill="currentColor">
                                        <path d="M50 0 L93.3 25 V75 L50 100 L6.7 75 V25 Z" stroke="#22C55E" strokeWidth="2" />
                                    </svg>
                                    <div className="relative z-10 text-center flex flex-col items-center">
                                        <span className="material-symbols-outlined text-green-500 text-2xl mb-1">terminal</span>
                                        <span className="text-[8px] font-bold text-green-500 uppercase tracking-widest">Coder</span>
                                    </div>
                                </div>
                                {/* Hex 4 */}
                                <div className="w-24 h-28 relative flex items-center justify-center group">
                                    <svg className="absolute w-full h-full text-[#1C2028] group-hover:text-orange-900 transition-colors" viewBox="0 0 100 115" fill="currentColor">
                                        <path d="M50 0 L93.3 25 V75 L50 100 L6.7 75 V25 Z" stroke="#F97316" strokeWidth="2" />
                                    </svg>
                                    <div className="relative z-10 text-center flex flex-col items-center">
                                        <span className="material-symbols-outlined text-orange-500 text-2xl mb-1">groups</span>
                                        <span className="text-[8px] font-bold text-orange-500 uppercase tracking-widest">Leader</span>
                                    </div>
                                </div>
                            </div>


                            {/* Hex Items (Bottom Row - Offset) */}
                            <div className="col-span-4 flex justify-center gap-4 -mt-10">
                                {/* Locked Hex 1 */}
                                <div className="w-24 h-28 relative flex items-center justify-center opacity-30">
                                    <svg className="absolute w-full h-full text-[#1C2028]" viewBox="0 0 100 115" fill="currentColor">
                                        <path d="M50 0 L93.3 25 V75 L50 100 L6.7 75 V25 Z" stroke="#4B5563" strokeWidth="1" />
                                    </svg>
                                    <div className="relative z-10 text-center flex flex-col items-center">
                                        <span className="material-symbols-outlined text-gray-500 text-2xl mb-1">science</span>
                                        <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Research</span>
                                        <span className="material-symbols-outlined text-[10px] text-gray-600 mt-1">lock</span>
                                    </div>
                                </div>

                                {/* Locked Hex 2 */}
                                <div className="w-24 h-28 relative flex items-center justify-center opacity-30">
                                    <svg className="absolute w-full h-full text-[#1C2028]" viewBox="0 0 100 115" fill="currentColor">
                                        <path d="M50 0 L93.3 25 V75 L50 100 L6.7 75 V25 Z" stroke="#4B5563" strokeWidth="1" />
                                    </svg>
                                    <div className="relative z-10 text-center flex flex-col items-center">
                                        <span className="material-symbols-outlined text-gray-500 text-2xl mb-1">volunteer_activism</span>
                                        <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Charity</span>
                                        <span className="material-symbols-outlined text-[10px] text-gray-600 mt-1">lock</span>
                                    </div>
                                </div>

                                {/* Locked Hex 3 */}
                                <div className="w-24 h-28 relative flex items-center justify-center opacity-30">
                                    <svg className="absolute w-full h-full text-[#1C2028]" viewBox="0 0 100 115" fill="currentColor">
                                        <path d="M50 0 L93.3 25 V75 L50 100 L6.7 75 V25 Z" stroke="#4B5563" strokeWidth="1" />
                                    </svg>
                                    <div className="relative z-10 text-center flex flex-col items-center">
                                        <span className="material-symbols-outlined text-gray-500 text-2xl mb-1">sports_esports</span>
                                        <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Gamer</span>
                                        <span className="material-symbols-outlined text-[10px] text-gray-600 mt-1">lock</span>
                                    </div>
                                </div>

                                {/* Locked Hex 4 */}
                                <div className="w-24 h-28 relative flex items-center justify-center opacity-30">
                                    <svg className="absolute w-full h-full text-[#1C2028]" viewBox="0 0 100 115" fill="currentColor">
                                        <path d="M50 0 L93.3 25 V75 L50 100 L6.7 75 V25 Z" stroke="#4B5563" strokeWidth="1" />
                                    </svg>
                                    <div className="relative z-10 text-center flex flex-col items-center">
                                        <span className="material-symbols-outlined text-gray-500 text-2xl mb-1">translate</span>
                                        <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Polyglot</span>
                                        <span className="material-symbols-outlined text-[10px] text-gray-600 mt-1">lock</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Right Col: Skills & Map */}
                <div className="flex flex-col gap-6">

                    {/* Skills Matrix */}
                    <div className="bg-[#151921] border border-[#2D303E] rounded-[32px] p-8">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="material-symbols-outlined text-blue-500">psychology</span>
                            <h2 className="font-bold text-lg">Skills Matrix</h2>
                        </div>

                        <p className="text-xs text-gray-500 mb-4">Verified competencies based on coursework and projects.</p>

                        <div className="flex flex-wrap gap-2 mb-8">
                            {['Python', 'Public Speaking', 'Data Analysis', 'React.js', 'UI Design', 'Project Mgmt', 'Machine Learning', 'Technical Writing', 'Git'].map((skill, i) => (
                                <span key={skill} className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-colors ${i < 5 ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-900/40' : 'bg-[#1C2028] border-[#2D303E] text-gray-400'}`}>
                                    {skill}
                                </span>
                            ))}
                        </div>

                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Recent Endorsements</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="size-8 rounded-full overflow-hidden border border-[#2D303E]">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=ProfA" className="w-full h-full" />
                                </div>
                                <div className="text-xs">
                                    <p className="font-bold text-white">Prof. Miller</p>
                                    <p className="text-gray-500">Endorsed <span className="text-blue-500">Data Analysis</span></p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="size-8 rounded-full overflow-hidden border border-[#2D303E]">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=ProfB" className="w-full h-full" />
                                </div>
                                <div className="text-xs">
                                    <p className="font-bold text-white">Sarah Lee</p>
                                    <p className="text-gray-500">Endorsed <span className="text-blue-500">Public Speaking</span></p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map Placeholder */}
                    <div className="flex-1 bg-[#151921] border border-[#2D303E] rounded-[32px] overflow-hidden relative min-h-[200px]">
                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-white z-10">Campus Location</div>

                        {/* Faux Map Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900">
                            <div className="w-full h-full opacity-30" style={{ backgroundImage: 'radial-gradient(#4B5563 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="font-mono text-2xl text-gray-700 font-bold tracking-[0.2em]">300×300</span>
                            </div>
                        </div>

                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 pt-12">
                            <h4 className="font-bold text-white text-sm">Innovation Hub, Building C</h4>
                            <p className="text-[10px] text-gray-400">Currently working on: Capstone Project</p>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
