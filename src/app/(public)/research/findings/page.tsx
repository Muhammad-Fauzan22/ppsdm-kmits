"use client";

import React from "react";
import Link from "next/link";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function ResearchFindingsPage() {
    const chartData = [
        { year: '2019', val: 75 },
        { year: '2020', val: 78 },
        { year: '2021', val: 65 },
        { year: '2022', val: 82 },
        { year: '2023', val: 88 },
        { year: '2024', val: 92 },
    ];

    return (
        <div className="min-h-screen bg-[#0E1218] text-white font-sans overflow-x-hidden">

            {/* Navbar */}
            <nav className="border-b border-[#2D303E] px-8 py-4 flex justify-between items-center bg-[#0E1218]/90 backdrop-blur sticky top-0 z-50">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-500">school</span>
                        <span className="font-bold text-lg">PPSDM Research</span>
                    </div>
                    <div className="hidden md:flex gap-6 text-sm font-medium text-gray-400">
                        <Link href="#" className="hover:text-white transition-colors">Findings</Link>
                        <Link href="#" className="hover:text-white transition-colors">Methodology</Link>
                        <Link href="#" className="hover:text-white transition-colors">Publications</Link>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">search</span>
                        <input type="text" placeholder="Search findings..." className="bg-[#1C2028] border border-[#2D303E] rounded-full pl-10 pr-4 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-blue-500" />
                    </div>
                    <button className="text-gray-400 hover:text-white"><span className="material-symbols-outlined">notifications</span></button>
                    <div className="size-8 rounded-full bg-orange-200 overflow-hidden border border-[#2D303E]">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Prof" alt="Researcher profile picture" className="w-full h-full" />
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-12">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                            <span>Home</span> <span className="material-symbols-outlined text-[10px]">chevron_right</span> <span className="text-white">Research</span>
                        </div>
                        <h1 className="text-4xl font-bold mb-4 leading-tight">Institutional Research & Developmental <br /> Findings</h1>
                        <p className="text-gray-400 max-w-2xl text-lg leading-relaxed">
                            Shaping the future of student development through rigorous, data-driven insights and longitudinal analysis.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button className="bg-[#1C2028] border border-[#2D303E] text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-[#252932] transition-colors">
                            <span className="material-symbols-outlined text-sm">share</span> Share
                        </button>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20">
                            <span className="material-symbols-outlined text-sm">download</span> Export Report
                        </button>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-[#161B22] border border-[#2D303E] p-6 rounded-2xl">
                        <p className="text-xs text-gray-400 font-bold uppercase mb-2">Student Profiles Analyzed</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-white">12,000+</span>
                            <span className="text-xs font-bold text-green-500 bg-green-900/20 px-1.5 py-0.5 rounded">▲ 12%</span>
                        </div>
                    </div>
                    <div className="bg-[#161B22] border border-[#2D303E] p-6 rounded-2xl bg-gradient-to-br from-[#161B22] to-[#1e1b4b]">
                        <p className="text-xs text-gray-400 font-bold uppercase mb-2">Longitudinal Data Depth</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-white">5 Years</span>
                            <span className="text-xs text-gray-500">2019-2024</span>
                        </div>
                    </div>
                    <div className="bg-[#161B22] border border-[#2D303E] p-6 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-bl-full"></div>
                        <p className="text-xs text-gray-400 font-bold uppercase mb-2">Research Papers</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-white">45+</span>
                            <button className="text-xs font-bold text-blue-500 hover:underline">View archive</button>
                        </div>
                    </div>
                </div>

                {/* Chart Section */}
                <div className="bg-[#161B22] border border-[#2D303E] rounded-3xl p-8 mb-12">
                    <div className="flex justify-between items-center mb-8 border-b border-[#2D303E] pb-6">
                        <div>
                            <h2 className="font-bold text-xl mb-1">Data Visualization Gallery</h2>
                        </div>
                        <div className="flex bg-[#0D1117] rounded-lg p-1 border border-[#2D303E]">
                            {['Growth Trends', 'Demographics', 'Assessment Scores'].map((tab, i) => (
                                <button key={tab} className={`px-4 py-1.5 text-xs font-bold rounded ${i === 0 ? 'bg-[#21262D] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}>
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <h3 className="font-bold text-lg mb-1">Longitudinal Skill Acquisition</h3>
                                <p className="text-xs text-gray-500">Average competency growth per academic cohort.</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="bg-[#21262D] text-gray-300 text-xs px-3 py-2 rounded flex items-center gap-2">
                                    All Cohorts <span className="material-symbols-outlined text-[10px]">expand_more</span>
                                </button>
                                <button className="bg-[#21262D] text-gray-300 text-xs px-3 py-2 rounded flex items-center gap-2">
                                    By Year <span className="material-symbols-outlined text-[10px]">expand_more</span>
                                </button>
                            </div>
                        </div>

                        <div className="w-full" style={{ height: '256px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} barCategoryGap="30%">
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1C2028', border: '1px solid #2D303E', borderRadius: '8px', fontSize: '12px', color: '#fff' }}
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    />
                                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6B7280' }} dy={10} />
                                    <Bar dataKey="val" radius={[4, 4, 0, 0]}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === 5 ? '#2563EB' : '#1D4ED8'} fillOpacity={index === 5 ? 1 : 0.6} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="flex justify-center gap-6 mt-6">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span className="size-2 rounded-full bg-blue-600"></span> Core Competencies
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span className="size-2 rounded-full bg-blue-900"></span> Elective Skills
                            </div>
                        </div>
                    </div>
                </div>

                {/* Publications */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">Recent Publications</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div className="bg-[#161B22] border border-[#2D303E] rounded-2xl p-6 hover:border-blue-800 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase mb-4">
                                <span className="text-blue-500">Cognitive Development</span>
                                <span className="text-gray-600">•</span>
                                <span className="text-gray-500">Oct 2023</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">The Impact of Remote Learning on Cognitive Development</h3>
                            <p className="text-sm text-gray-400 leading-relaxed mb-6">
                                This study analyzes the longitudinal effects of remote learning modalities on student cognitive flexibility across three academic years. Findings suggest a bimodal distribution in adaptability.
                            </p>
                            <div className="flex justify-between items-center border-t border-[#2D303E] pt-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-2">
                                        <div className="size-6 rounded-full bg-yellow-200 border border-[#161B22]"></div>
                                        <div className="size-6 rounded-full bg-gray-200 border border-[#161B22]"></div>
                                    </div>
                                    <span className="text-xs text-gray-500">Dr. Sarah Lin, et al.</span>
                                </div>
                                <span className="text-blue-500 text-xs font-bold flex items-center gap-1">
                                    Download PDF <span className="material-symbols-outlined text-sm">download</span>
                                </span>
                            </div>
                        </div>

                        <div className="bg-[#161B22] border border-[#2D303E] rounded-2xl p-6 hover:border-blue-800 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase mb-4">
                                <span className="text-blue-500">Institutional Resilience</span>
                                <span className="text-gray-600">•</span>
                                <span className="text-gray-500">Aug 2023</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">Institutional Resilience in Post-Pandemic Cohorts</h3>
                            <p className="text-sm text-gray-400 leading-relaxed mb-6">
                                An examination of structural and social support systems implemented in 2021 and their correlation with student retention rates. Data indicates a significant positive correlation.
                            </p>
                            <div className="flex justify-between items-center border-t border-[#2D303E] pt-4">
                                <div className="flex items-center gap-2">
                                    <div className="size-6 rounded-full bg-blue-200 border border-[#161B22]"></div>
                                    <span className="text-xs text-gray-500">Prof. James Chen</span>
                                </div>
                                <span className="text-blue-500 text-xs font-bold flex items-center gap-1">
                                    Download PDF <span className="material-symbols-outlined text-sm">download</span>
                                </span>
                            </div>
                        </div>

                    </div>
                    <div className="text-center mt-6">
                        <button className="text-gray-400 hover:text-white text-sm font-medium flex items-center justify-center gap-2 mx-auto">
                            View all 45 publications <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                    </div>
                </div>

                {/* Footer Methodology */}
                <div className="bg-[#161B22] border border-[#2D303E] rounded-3xl p-8 md:p-12">
                    <h2 className="text-2xl font-bold mb-6">Research Methodology</h2>
                    <p className="text-gray-400 max-w-3xl mb-12">
                        Our findings are based on a comprehensive, mixed-methods approach ensuring both statistical significance and qualitative depth.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[#0D1117] border border-[#2D303E] p-6 rounded-2xl flex gap-4">
                            <div className="size-10 bg-blue-900/30 text-blue-500 rounded-lg flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined">dataset</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-2">Data Collection</h4>
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    Data is aggregated from standardized testing (n=8,500), annual student surveys (n=12,000), and longitudinal tracking of alumni career placement.
                                </p>
                            </div>
                        </div>
                        <div className="bg-[#0D1117] border border-[#2D303E] p-6 rounded-2xl flex gap-4">
                            <div className="size-10 bg-blue-900/30 text-blue-500 rounded-lg flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined">security</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-2">Privacy & Ethics</h4>
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    All personal identifiers are anonymized via SHA-256 encryption. Research protocols are reviewed quarterly by the Institutional Review Board (IRB).
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-[#2D303E]">
                        <Link href="#" className="text-blue-500 font-bold text-sm flex items-center gap-1 hover:underline">
                            Read full documentation <span className="material-symbols-outlined text-sm">open_in_new</span>
                        </Link>
                    </div>
                </div>

                <footer className="mt-16 border-t border-[#2D303E] pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                    <div className="flex items-center gap-2 mb-4 md:mb-0">
                        <span className="material-symbols-outlined">school</span>
                        <span className="font-bold text-gray-400">PPSDM Research Division</span>
                    </div>
                    <div className="flex gap-8">
                        <Link href="#" className="hover:text-white">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white">Terms of Use</Link>
                        <Link href="#" className="hover:text-white">Contact Data Team</Link>
                    </div>
                    <p className="mt-4 md:mt-0">© 2024 PPSDM. All rights reserved.</p>
                </footer>

            </main>
        </div>
    );
}
