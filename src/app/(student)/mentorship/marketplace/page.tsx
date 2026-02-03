"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function MentorshipMarketplace() {
    return (
        <div className="min-h-screen bg-[#0E1015] text-white font-sans">

            {/* Gradient Banner */}
            <div className="bg-gradient-to-r from-[#16181D] to-[#252836] border-b border-[#2D303E] pb-12 pt-16 px-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-purple-900/20 to-transparent"></div>
                <div className="relative z-10 max-w-5xl mx-auto text-center">
                    <h1 className="text-4xl font-bold mb-4">Level Up with a Mentor</h1>
                    <p className="text-gray-400 mb-8 text-lg">Find senior students to help you master new skills, debug code, or prepare for exams.</p>

                    <div className="bg-[#1C1E26] p-2 rounded-xl flex items-center max-w-xl mx-auto border border-[#2D303E] shadow-xl">
                        <span className="material-symbols-outlined text-gray-500 ml-3">search</span>
                        <input type="text" placeholder="Search by skill (e.g., Python, Design)..." className="bg-transparent w-full p-3 outline-none text-white placeholder-gray-600" />
                        <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg transition-colors">Find</button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-8 grid grid-cols-[1fr_300px] gap-8">

                {/* Main Content */}
                <div>
                    {/* Filters */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex gap-2">
                            <span className="text-sm text-gray-500 mr-2 py-1.5">Popular:</span>
                            {['Python', 'UI Design', 'Public Speaking', 'Level 5+ Only'].map((tag, i) => (
                                <button key={tag} className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-colors ${i === 2 ? 'bg-blue-600 border-blue-600 text-white' : 'bg-[#1C1E26] border-[#2D303E] text-gray-400 hover:text-white'}`}>
                                    {tag} {i === 2 && <span className="ml-1">×</span>}
                                </button>
                            ))}
                        </div>
                        <button className="flex items-center gap-2 text-gray-400 text-xs font-bold">
                            <span className="material-symbols-outlined">tune</span> All Filters
                        </button>
                    </div>

                    <div className="mb-4 text-xs text-gray-500 font-bold uppercase tracking-wider">Recommended Mentors <span className="text-gray-600 ml-auto float-right font-normal normal-case tracking-normal">Showing 24 available</span></div>

                    {/* Mentor Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Card 1 */}
                        <div className="bg-[#16181D] border border-[#2D303E] rounded-2xl p-5 hover:border-gray-600 transition-colors group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="size-12 rounded-full bg-yellow-200 overflow-hidden border-2 border-[#2D303E]">
                                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="Avatar of Sarah Jenkins" className="w-full h-full" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-sm">Sarah Jenkins</h3>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="bg-blue-900/30 text-blue-400 text-[9px] font-bold px-1.5 py-0.5 rounded border border-blue-800 flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[10px]">diamond</span> LVL 12
                                            </span>
                                            <span className="size-2 rounded-full bg-green-500"></span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 bg-yellow-500/10 px-1.5 py-0.5 rounded text-yellow-500 text-xs font-bold">
                                    <span className="material-symbols-outlined text-xs">star</span> 4.9
                                </div>
                            </div>

                            <p className="text-xs text-gray-400 mb-4 line-clamp-2 h-8">
                                Expert in Public Speaking and Debate. National finalist 2023.
                            </p>

                            <div className="flex flex-wrap gap-2 mb-6">
                                <span className="bg-[#1C1E26] text-gray-400 text-[10px] px-2 py-1 rounded">Debate</span>
                                <span className="bg-[#1C1E26] text-gray-400 text-[10px] px-2 py-1 rounded">Speech</span>
                                <span className="bg-[#1C1E26] text-gray-400 text-[10px] px-2 py-1 rounded">Communication</span>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-[#2D303E]">
                                <div>
                                    <p className="text-[9px] text-gray-500 font-bold uppercase">Session Cost</p>
                                    <p className="text-sm font-bold text-white">50 XP</p>
                                </div>
                                <button className="bg-white hover:bg-gray-200 text-black text-xs font-bold px-4 py-2 rounded-lg">Request</button>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-[#16181D] border border-[#2D303E] rounded-2xl p-5 hover:border-gray-600 transition-colors group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="size-12 rounded-full bg-blue-200 overflow-hidden border-2 border-[#2D303E]">
                                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=David" alt="Avatar of David Kim" className="w-full h-full" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-sm">David Kim</h3>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="bg-purple-900/30 text-purple-400 text-[9px] font-bold px-1.5 py-0.5 rounded border border-purple-800 flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[10px]">diamond</span> LVL 15
                                            </span>
                                            <span className="size-2 rounded-full bg-gray-500"></span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 bg-yellow-500/10 px-1.5 py-0.5 rounded text-yellow-500 text-xs font-bold">
                                    <span className="material-symbols-outlined text-xs">star</span> 5.0
                                </div>
                            </div>

                            <p className="text-xs text-gray-400 mb-4 line-clamp-2 h-8">
                                Senior CS student. Python & Data Science tutor for 2 years.
                            </p>

                            <div className="flex flex-wrap gap-2 mb-6">
                                <span className="bg-[#1C1E26] text-gray-400 text-[10px] px-2 py-1 rounded">Python</span>
                                <span className="bg-[#1C1E26] text-gray-400 text-[10px] px-2 py-1 rounded">Data Science</span>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-[#2D303E]">
                                <div>
                                    <p className="text-[9px] text-gray-500 font-bold uppercase">Session Cost</p>
                                    <p className="text-sm font-bold text-white">Free</p>
                                </div>
                                <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-lg">Request</button>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-[#16181D] border border-[#2D303E] rounded-2xl p-5 hover:border-gray-600 transition-colors group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="size-12 rounded-full bg-pink-200 overflow-hidden border-2 border-[#2D303E]">
                                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Maria" alt="Avatar of Maria Garcia" className="w-full h-full" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-sm">Maria Garcia</h3>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="bg-orange-900/30 text-orange-400 text-[9px] font-bold px-1.5 py-0.5 rounded border border-orange-800 flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[10px]">bolt</span> LVL 9
                                            </span>
                                            <span className="size-2 rounded-full bg-green-500"></span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 bg-yellow-500/10 px-1.5 py-0.5 rounded text-yellow-500 text-xs font-bold">
                                    <span className="material-symbols-outlined text-xs">star</span> 4.7
                                </div>
                            </div>

                            <p className="text-xs text-gray-400 mb-4 line-clamp-2 h-8">
                                UI/UX Design enthusiast. I can help with Figma & wireframing.
                            </p>

                            <div className="flex flex-wrap gap-2 mb-6">
                                <span className="bg-[#1C1E26] text-gray-400 text-[10px] px-2 py-1 rounded">Figma</span>
                                <span className="bg-[#1C1E26] text-gray-400 text-[10px] px-2 py-1 rounded">Prototyping</span>
                                <span className="bg-[#1C1E26] text-gray-400 text-[10px] px-2 py-1 rounded">Wireframing</span>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-[#2D303E]">
                                <div>
                                    <p className="text-[9px] text-gray-500 font-bold uppercase">Session Cost</p>
                                    <p className="text-sm font-bold text-white">25 XP</p>
                                </div>
                                <button className="bg-white hover:bg-gray-200 text-black text-xs font-bold px-4 py-2 rounded-lg">Request</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-6">

                    <div className="bg-[#16181D] border border-[#2D303E] rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3">
                            <span className="material-symbols-outlined text-blue-500">trending_up</span>
                        </div>
                        <h3 className="font-bold text-white mb-6 text-sm">Peer Coaching XP</h3>

                        <div className="text-center mb-4">
                            <p className="text-5xl font-bold text-white mb-1">1380</p>
                            <p className="text-xs text-gray-500">Total Earned XP</p>
                        </div>

                        <div className="mb-1 flex justify-between text-[10px] font-bold uppercase text-gray-500">
                            <span>Current Rank: Mentor</span>
                            <span className="text-blue-500">Master</span>
                        </div>
                        <div className="w-full h-2 bg-[#2D303E] rounded-full mb-2 overflow-hidden">
                            <div className="h-full bg-blue-600 w-3/4 rounded-full"></div>
                        </div>
                        <p className="text-[10px] text-center text-gray-500">120 XP needed to level up!</p>
                    </div>

                    <div className="bg-[#16181D] border border-[#2D303E] rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-white text-sm">Top Mentors</h3>
                            <button className="text-blue-500 text-xs font-bold hover:underline">View All</button>
                        </div>

                        <div className="space-y-4">
                            {[
                                { rank: 1, name: "Anna K.", sessions: 24, rating: 5.0, img: "Alex" },
                                { rank: 2, name: "Mike T.", sessions: 21, rating: 4.9, img: "Mike" },
                                { rank: 3, name: "Jessica L.", sessions: 19, rating: 4.8, img: "Jess" },
                            ].map((m) => (
                                <div key={m.rank} className="flex items-center gap-3">
                                    <span className={`font-bold text-sm w-4 ${m.rank === 1 ? 'text-yellow-500' : 'text-gray-500'}`}>{m.rank}</span>
                                    <div className="size-8 rounded-full bg-gray-700 overflow-hidden">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${m.img}`} alt={`Avatar of ${m.name}`} className="w-full h-full" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-white">{m.name}</p>
                                        <p className="text-[10px] text-gray-500">{m.sessions} Sessions</p>
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] font-bold text-yellow-500">
                                        <span className="material-symbols-outlined text-[10px]">star</span> {m.rating}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
