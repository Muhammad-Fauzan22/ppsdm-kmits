"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function MarketSyncPage() {
    const skills = [
        { name: "React.js & Next.js", market: 90, user: 65, gap: -25, critical: true },
        { name: "TypeScript", market: 75, user: 80, gap: 5, critical: false },
        { name: "GraphQL", market: 80, user: 40, gap: -40, critical: false },
        { name: "Cloud Infrastructure (AWS)", market: 85, user: 70, gap: -15, critical: true },
    ];

    return (
        <div className="min-h-screen bg-[#0E1016] text-white p-6 font-sans">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <span>Roadmap</span> / <span className="text-white">Market Sync</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Market Sync: Gap Analysis</h1>
                    <p className="text-gray-400 text-sm">Aligning your profile with <span className="text-blue-500 font-bold">54,000+</span> live job postings.</p>
                </div>
                <div className="flex gap-4">
                    {/* Role Dropdown */}
                    <div className="bg-[#1C1E26] border border-[#2D303E] px-4 py-2 rounded-lg flex items-center justify-between min-w-[200px] cursor-pointer hover:bg-[#252830]">
                        <span className="text-sm font-bold text-gray-300">Role: Full Stack Dev</span>
                        <span className="material-symbols-outlined text-gray-500 text-sm">expand_more</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Skill Gap Analysis */}
                <div className="lg:col-span-2">
                    <div className="bg-[#16181D] border border-[#2D303E] rounded-2xl p-6 mb-6">

                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold flex items-center gap-3">
                                <span className="size-4 bg-blue-600 rounded-sm"></span> Top 5 In-Demand Skills vs. Your Mastery
                            </h3>
                            <div className="flex gap-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                <div className="flex items-center gap-2">
                                    <div className="size-2 rounded-full bg-blue-900"></div> Industry Demand
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="size-2 rounded-full bg-gray-500"></div> Your Mastery
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {skills.map((skill) => (
                                <div key={skill.name}>
                                    <div className="flex justify-between items-end mb-2">
                                        <h4 className="font-bold text-sm">{skill.name}</h4>
                                        <span className={`text-xs font-bold ${skill.gap >= 0 ? 'text-green-500' : 'text-red-400'}`}>
                                            {skill.gap > 0 ? '+' : ''}{skill.gap}% {skill.gap >= 0 ? 'Above Market' : 'Gap'}
                                        </span>
                                    </div>

                                    {/* Progress Bars */}
                                    <div className="relative h-3 bg-[#1C1E26] rounded-full overflow-hidden">
                                        {/* Market Bar (Base) */}
                                        <div className="absolute top-0 left-0 h-full bg-blue-900 rounded-full" style={{ width: `${skill.market}%` }}></div>
                                        {/* User Bar (Overlay) */}
                                        <div className="absolute top-0 left-0 h-full bg-gray-600 rounded-full opacity-70" style={{ width: `${skill.user}%` }}></div>
                                        {/* Gap Marker */}
                                        {skill.gap < 0 && (
                                            <div className="absolute top-0 h-full bg-blue-600 animate-pulse" style={{ left: `${skill.user}%`, width: `${Math.abs(skill.gap)}%` }}></div>
                                        )}
                                    </div>

                                    <p className="text-[10px] text-gray-500 mt-1">
                                        {skill.gap < 0 ? `Market wants ${skill.market}% proficiency. You are at ${skill.user}%.` : `You exceed the market average of ${skill.market}%.`}
                                    </p>
                                </div>
                            ))}
                        </div>

                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-[#16181D] border border-[#2D303E] rounded-2xl p-6">
                            <div className="flex items-center gap-2 text-gray-400 mb-2">
                                <span className="material-symbols-outlined text-sm">trending_up</span>
                                <span className="text-xs font-bold uppercase">Projected Growth (2025)</span>
                            </div>
                            <p className="text-4xl font-bold text-white mb-2">+22%</p>
                            <p className="text-xs text-gray-500">
                                Increase in demand for <span className="text-white font-bold">Full Stack Engineers</span>.
                            </p>
                            <div className="flex gap-1 mt-4">
                                {[1, 2, 3, 4, 5].map(i => <div key={i} className={`h-1.5 flex-1 rounded-full ${i < 5 ? 'bg-blue-600' : 'bg-[#1C1E26]'}`}></div>)}
                            </div>
                        </div>
                        <div className="bg-[#16181D] border border-[#2D303E] rounded-2xl p-6">
                            <div className="flex items-center gap-2 text-gray-400 mb-2">
                                <span className="material-symbols-outlined text-sm">payments</span>
                                <span className="text-xs font-bold uppercase">Salary Potential</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="size-20 rounded-full border-4 border-[#1C1E26] border-t-blue-500 border-r-blue-500 flex items-center justify-center">
                                    <div className="text-center">
                                        <p className="text-sm font-bold text-white leading-none">$95k</p>
                                        <p className="text-[8px] text-gray-500 uppercase font-bold">Avg. Entry</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500 mb-1">Top tier earners reach</p>
                                    <span className="text-green-500 font-bold">$140k+</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Recommended Actions */}
                <div className="space-y-4">
                    <h3 className="font-bold flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-yellow-500 text-lg">bolt</span> Recommended Actions
                    </h3>
                    <p className="text-xs text-gray-500 mb-4">Based on your gap analysis.</p>

                    {/* Action Card 1: Critical */}
                    <div className="bg-[#16181D] border border-[#2D303E] p-4 rounded-xl relative overflow-hidden group hover:border-blue-500/50 transition-colors">
                        <div className="absolute top-0 right-0 bg-red-500/10 text-red-500 text-[10px] font-bold px-2 py-1 rounded-bl-lg">Critical Priority</div>
                        <div className="flex items-center gap-3 mb-3 mt-2">
                            <div className="size-10 bg-blue-900/20 text-blue-500 rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined">code_blocks</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-white">Advanced React Patterns</h4>
                                <p className="text-[10px] text-gray-500">Bridge the 25% gap in your React proficiency.</p>
                            </div>
                        </div>
                        <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2">
                            Start Module <span className="material-symbols-outlined text-xs">arrow_forward</span>
                        </button>
                    </div>

                    {/* Action Card 2: High */}
                    <div className="bg-[#16181D] border border-[#2D303E] p-4 rounded-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-orange-500/10 text-orange-500 text-[10px] font-bold px-2 py-1 rounded-bl-lg">High Priority</div>
                        <div className="flex items-center gap-3 mb-3 mt-2">
                            <div className="size-10 bg-purple-900/20 text-purple-500 rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined">dataset</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-white">Mastering GraphQL</h4>
                                <p className="text-[10px] text-gray-500">Required for 70% of senior backend roles.</p>
                            </div>
                        </div>
                        <button className="w-full bg-[#252830] hover:bg-[#2D303E] text-white py-2 rounded-lg text-xs font-bold border border-[#2D303E] flex items-center justify-center gap-2">
                            View Course <span className="material-symbols-outlined text-xs">visibility</span>
                        </button>
                    </div>

                    {/* Action Card 3: Medium */}
                    <div className="bg-[#16181D] border border-[#2D303E] p-4 rounded-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-blue-500/10 text-blue-500 text-[10px] font-bold px-2 py-1 rounded-bl-lg">Medium Priority</div>
                        <div className="flex items-center gap-3 mb-3 mt-2">
                            <div className="size-10 bg-cyan-900/20 text-cyan-500 rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined">cloud</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-white">AWS Essentials</h4>
                                <p className="text-[10px] text-gray-500">You are close! Only 15% more to meet market.</p>
                            </div>
                        </div>
                        <button className="w-full bg-[#252830] hover:bg-[#2D303E] text-white py-2 rounded-lg text-xs font-bold border border-[#2D303E] flex items-center justify-center gap-2">
                            View Course <span className="material-symbols-outlined text-xs">visibility</span>
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
}
