"use client";

import Link from "next/link";
import React from "react";

export default function SupervisorRAGPage() {
    return (
        <div className="font-[family-name:var(--font-inter)] bg-[#f6f6f8] dark:bg-[#101622] text-slate-900 dark:text-white antialiased overflow-x-hidden min-h-screen">
            <div className="flex flex-col min-h-screen">
                {/* Top Navigation */}
                <header className="bg-white dark:bg-[#1e2736] border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30">
                    <div className="px-4 md:px-6 lg:px-8 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            {/* Logo Area */}
                            <div className="flex items-center gap-3">
                                <div className="size-8 bg-[#135bec]/10 text-[#135bec] rounded-lg flex items-center justify-center">
                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
                                </div>
                                <h1 className="text-slate-900 dark:text-white text-lg font-bold tracking-tight hidden sm:block">PPSDM Supervisor Portal</h1>
                            </div>
                            {/* Search */}
                            <div className="hidden md:flex relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-slate-400">search</span>
                                </div>
                                <input className="block w-64 rounded-lg border-0 py-1.5 pl-10 text-slate-900 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-[#135bec] sm:text-sm sm:leading-6 bg-slate-50 dark:bg-slate-800 dark:ring-slate-700 dark:text-white" placeholder="Search students, IDs..." type="text" />
                            </div>
                        </div>
                        {/* Nav Links & Profile */}
                        <div className="flex items-center gap-6">
                            <nav className="hidden lg:flex items-center gap-6">
                                <Link className="text-[#135bec] text-sm font-semibold" href="#">Dashboard</Link>
                                <Link className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm font-medium transition-colors" href="#">Students</Link>
                                <Link className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm font-medium transition-colors" href="#">Interventions</Link>
                                <Link className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm font-medium transition-colors" href="#">Reports</Link>
                            </nav>
                            <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-800 pl-6">
                                <button className="relative text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors">
                                    <span className="material-symbols-outlined">notifications</span>
                                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900"></span>
                                </button>
                                <button className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors">
                                    <span className="material-symbols-outlined">chat_bubble</span>
                                </button>
                                <div className="h-8 w-8 rounded-full bg-cover bg-center ring-2 ring-white dark:ring-slate-800 ml-2" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDThHedLfRZ2IIBOJfb66j9iR5_e9bzzoli-UOuOlx6qgDuwTUiIzrltH2TeOynBccwn3evWHwPTf_c9cnIuZuco7n7cw5AjSiIsOdwQwg0OK3mLqDQzoKecavFcve9JJDjluUEX1KKS78niYUorG_1_WQDAzcO39ZjkxCb0C0e96o75JZ5ShjVQ6M7qAfIN1tqJ6Pznbof8bbZj7GKLXnTtQHWC8PIEu76fcrPbL--6kTiYvnQMUfdRtbg9A3h3l5hHF3T-vJ4DdY')" }}></div>
                            </div>
                        </div>
                    </div>
                </header>
                {/* Main Content */}
                <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
                    {/* Page Heading & Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Cohort Alpha-21 Overview</h2>
                                <span className="px-2.5 py-0.5 rounded-full bg-[#135bec]/10 text-[#135bec] text-xs font-semibold border border-[#135bec]/20">Active Session</span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">Command Center • Last updated: Just now</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                                <span className="material-symbols-outlined text-[18px]">download</span>
                                Export Report
                            </button>
                            <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#135bec] hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm shadow-blue-500/30">
                                <span className="material-symbols-outlined text-[18px]">bolt</span>
                                Bulk Action
                            </button>
                        </div>
                    </div>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {/* Stat 1 */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Students</p>
                                <span className="p-1.5 bg-slate-100 dark:bg-slate-700 rounded text-slate-600 dark:text-slate-300">
                                    <span className="material-symbols-outlined text-[20px]">groups</span>
                                </span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-bold text-slate-900 dark:text-white">35</h3>
                                <span className="text-emerald-600 text-xs font-medium flex items-center bg-emerald-50 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded">
                                    <span className="material-symbols-outlined text-[14px] mr-0.5">trending_up</span> +2
                                </span>
                            </div>
                        </div>
                        {/* Stat 2: Red Risk */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl border-l-4 border-l-[#EF4444] border-y border-r border-y-slate-200 border-r-slate-200 dark:border-y-slate-700 dark:border-r-slate-700 p-4 shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-[#EF4444] text-sm font-bold">Critical Risk (Red)</p>
                                <span className="p-1.5 bg-red-50 dark:bg-red-900/20 rounded text-[#EF4444]">
                                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                                </span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-bold text-slate-900 dark:text-white">5</h3>
                                <span className="text-[#EF4444] text-xs font-medium flex items-center">
                                    Action Required
                                </span>
                            </div>
                        </div>
                        {/* Stat 3: Amber Risk */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl border-l-4 border-l-[#F59E0B] border-y border-r border-y-slate-200 border-r-slate-200 dark:border-y-slate-700 dark:border-r-slate-700 p-4 shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-[#F59E0B] text-sm font-bold">Monitoring (Amber)</p>
                                <span className="p-1.5 bg-amber-50 dark:bg-amber-900/20 rounded text-[#F59E0B]">
                                    <span className="material-symbols-outlined text-[20px]">remove_red_eye</span>
                                </span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-bold text-slate-900 dark:text-white">8</h3>
                                <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">
                                    -2 since yesterday
                                </span>
                            </div>
                        </div>
                        {/* Stat 4: Green */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl border-l-4 border-l-[#10B981] border-y border-r border-y-slate-200 border-r-slate-200 dark:border-y-slate-700 dark:border-r-slate-700 p-4 shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-[#10B981] text-sm font-bold">On Track (Green)</p>
                                <span className="p-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded text-[#10B981]">
                                    <span className="material-symbols-outlined text-[20px]">check_circle</span>
                                </span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-bold text-slate-900 dark:text-white">22</h3>
                                <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">
                                    Stable
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* Two Column Layout: Main Grid (Left) + Analytics Panel (Right) */}
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                        {/* LEFT: RAG Status Board (8 cols) */}
                        <div className="xl:col-span-8 flex flex-col gap-6">
                            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col h-full">
                                {/* Table Header Controls */}
                                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
                                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <span className="material-symbols-outlined text-slate-400">table_chart</span>
                                        Student Status Grid
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <div className="relative">
                                            <select className="appearance-none bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-1.5 pl-3 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#135bec]">
                                                <option>All Risks</option>
                                                <option>High (Red)</option>
                                                <option>Medium (Amber)</option>
                                                <option>Low (Green)</option>
                                            </select>
                                            <span className="absolute right-2 top-1.5 pointer-events-none text-slate-500">
                                                <span className="material-symbols-outlined text-[18px]">expand_more</span>
                                            </span>
                                        </div>
                                        <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500 transition-colors" title="Filter">
                                            <span className="material-symbols-outlined">filter_list</span>
                                        </button>
                                    </div>
                                </div>
                                {/* Dense Data Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm whitespace-nowrap">
                                        <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[11px] tracking-wider border-b border-slate-200 dark:border-slate-700">
                                            <tr>
                                                <th className="px-4 py-3">Student</th>
                                                <th className="px-4 py-3">Status (RAG)</th>
                                                <th className="px-4 py-3">Engagement</th>
                                                <th className="px-4 py-3">Last Login</th>
                                                <th className="px-4 py-3">Submission Rate</th>
                                                <th className="px-4 py-3 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-slate-700 dark:text-slate-300">
                                            {/* High Risk Row */}
                                            <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 rounded-full bg-cover bg-center border border-slate-200 dark:border-slate-600" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBYTrrUPKdw8RnFvE-mPBtDK-_QrLrFAb4x6bQ1dMqzb5uULuf5kWUcaQiHMGvlRSeDyRUhZpDx1jkaD7I7jJSJv1JCbvIVb3ZVyXwhW0veX69Fv8dAWZbOQpEnCMCfOHimVOMVEMTwG_fNNE4yQfBTyUBScMLPUCaa78D37PlztaLTkljtNKv_pLRMcUvHT6qH-QJWVUKkFNltCNQsjBvH1QstRWFhAZAEGYwTJ2ZPypjgxUWxUz1NqldBvW-ZE3W-nD8kGB9qQNM')" }}></div>
                                                        <div>
                                                            <div className="font-semibold text-slate-900 dark:text-white">Alex Morgan</div>
                                                            <div className="text-xs text-slate-500">ID: #88219</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800">
                                                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                                        Critical
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 w-32">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-medium w-8">42%</span>
                                                        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                            <div className="h-full bg-red-500 rounded-full" style={{ width: "42%" }}></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-slate-500">7 days ago</td>
                                                <td className="px-4 py-3 text-red-600 font-medium">65% <span className="material-symbols-outlined text-[14px] align-middle">trending_down</span></td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button className="p-1.5 rounded bg-[#135bec]/10 text-[#135bec] hover:bg-[#135bec] hover:text-white transition-colors" title="Message">
                                                            <span className="material-symbols-outlined text-[18px]">mail</span>
                                                        </button>
                                                        <button className="p-1.5 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition-colors" title="Schedule">
                                                            <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            {/* Medium Risk Row */}
                                            <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 rounded-full bg-cover bg-center border border-slate-200 dark:border-slate-600" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAHhfyVIdvaj2OqasCcZAE89f5ygsxciyZYt3kn8b_1YipenwcAcdE_3bAMVUQ03TTGmEypgWveD0aq11Y7Q5KdQEp_nmiow5jp-q7S1zgaNi4-7gliyO2bZR3OFyL1tXN0PEAhs3yMKw8QlBSevb51BDXYrM1ppdtNoX7wX0DFbZfWiSfAS9KfpyDemJZ9TWpFWdKh47oh3GVVS-v1gSpS11yo5gHT5YUj1IIppSoPyxwJmSaM26yHMCh9K6u-9l4z-XInwuuCsLA')" }}></div>
                                                        <div>
                                                            <div className="font-semibold text-slate-900 dark:text-white">Sarah Chen</div>
                                                            <div className="text-xs text-slate-500">ID: #88245</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800">
                                                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                                        Monitor
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-medium w-8">68%</span>
                                                        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                            <div className="h-full bg-amber-500 rounded-full" style={{ width: "68%" }}></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-slate-500">2 days ago</td>
                                                <td className="px-4 py-3 text-slate-900 dark:text-white font-medium">82%</td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button className="p-1.5 rounded bg-[#135bec]/10 text-[#135bec] hover:bg-[#135bec] hover:text-white transition-colors" title="Message">
                                                            <span className="material-symbols-outlined text-[18px]">mail</span>
                                                        </button>
                                                        <button className="p-1.5 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition-colors" title="Schedule">
                                                            <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            {/* Low Risk Row */}
                                            <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 rounded-full bg-cover bg-center border border-slate-200 dark:border-slate-600" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCfLR3yVhzoPg0Qf5oVIOHDMhhw_s-VYy0iY_AzrDtDeGHbOUkL8FdEN3ZayEHiueG3wHA1qQ0AAH-5I49bmDNTtsFFS8u8TnG-7P1UWMcBXZYGYroOw3jx2dr1xbMV1DEZOWKLuL2lIsGHCAlgrFfX2Aysd5kraMDEpHyDU-j9ZC_C3VgtKu8_icl0V7FCbNjNoUKupm3SjX6iIfSkhEhIQG1BDPKWrAIxVwiWWbP-dqWgrwNDF6T907I-oJJipeeCgC0V1WcI3vc')" }}></div>
                                                        <div>
                                                            <div className="font-semibold text-slate-900 dark:text-white">James Wilson</div>
                                                            <div className="text-xs text-slate-500">ID: #88301</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800">
                                                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                                        On Track
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-medium w-8">92%</span>
                                                        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: "92%" }}></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-slate-500">Today</td>
                                                <td className="px-4 py-3 text-emerald-600 font-medium">98% <span className="material-symbols-outlined text-[14px] align-middle">trending_up</span></td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button className="p-1.5 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition-colors" title="View Profile">
                                                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            {/* Another Medium Risk Row */}
                                            <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 rounded-full bg-[#135bec]/10 flex items-center justify-center text-[#135bec] font-bold text-xs border border-[#135bec]/20">
                                                            MR
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-slate-900 dark:text-white">Maria Rodriguez</div>
                                                            <div className="text-xs text-slate-500">ID: #88112</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800">
                                                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                                        Monitor
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-medium w-8">61%</span>
                                                        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                            <div className="h-full bg-amber-500 rounded-full" style={{ width: "61%" }}></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-slate-500">4 days ago</td>
                                                <td className="px-4 py-3 text-slate-900 dark:text-white font-medium">78%</td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button className="p-1.5 rounded bg-[#135bec]/10 text-[#135bec] hover:bg-[#135bec] hover:text-white transition-colors" title="Message">
                                                            <span className="material-symbols-outlined text-[18px]">mail</span>
                                                        </button>
                                                        <button className="p-1.5 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition-colors" title="Schedule">
                                                            <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                {/* Pagination */}
                                <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                                    <span className="text-sm text-slate-500 dark:text-slate-400">Showing 1-4 of 35 students</span>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1 rounded border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm hover:bg-white dark:hover:bg-slate-700 disabled:opacity-50">Previous</button>
                                        <button className="px-3 py-1 rounded border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm hover:bg-white dark:hover:bg-slate-700">Next</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* RIGHT: Analytics & Early Warning (4 cols) */}
                        <div className="xl:col-span-4 flex flex-col gap-6">
                            {/* Chart Card */}
                            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-slate-900 dark:text-white">Cohort Trends</h3>
                                    <button className="text-xs text-[#135bec] font-medium hover:underline">View Report</button>
                                </div>
                                <div className="mb-4">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Cohort Avg vs Dept Avg</p>
                                    <div className="flex items-end gap-2 mt-1">
                                        <span className="text-2xl font-bold text-slate-900 dark:text-white">78%</span>
                                        <span className="text-emerald-600 text-sm font-medium mb-1">+2.4% vs Dept</span>
                                    </div>
                                </div>
                                {/* CSS Chart Visual */}
                                <div className="relative h-48 w-full mt-2">
                                    {/* Grid lines */}
                                    <div className="absolute inset-0 flex flex-col justify-between text-xs text-slate-400">
                                        <div className="border-b border-dashed border-slate-200 dark:border-slate-700 w-full pb-0.5">100%</div>
                                        <div className="border-b border-dashed border-slate-200 dark:border-slate-700 w-full pb-0.5">75%</div>
                                        <div className="border-b border-dashed border-slate-200 dark:border-slate-700 w-full pb-0.5">50%</div>
                                        <div className="border-b border-dashed border-slate-200 dark:border-slate-700 w-full pb-0.5">25%</div>
                                        <div>0%</div>
                                    </div>
                                    {/* Dept Avg Line (Gray/Dotted) */}
                                    <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                                        <polyline fill="none" points="0,80 50,75 100,85 150,80 200,70 250,75 300,72 350,70 400,65" stroke="#94a3b8" strokeDasharray="4,4" strokeWidth="2"></polyline>
                                    </svg>
                                    {/* Cohort Line (Primary Color) */}
                                    <svg className="absolute inset-0 h-full w-full drop-shadow-md" preserveAspectRatio="none">
                                        <defs>
                                            <linearGradient id="gradientPrimary" x1="0" x2="0" y1="0" y2="1">
                                                <stop offset="0%" stopColor="#135bec" stopOpacity="0.2"></stop>
                                                <stop offset="100%" stopColor="#135bec" stopOpacity="0"></stop>
                                            </linearGradient>
                                        </defs>
                                        <polyline fill="url(#gradientPrimary)" points="0,90 50,85 100,60 150,65 200,40 250,45 300,30 350,35 400,25" stroke="#135bec" strokeWidth="3"></polyline>
                                    </svg>
                                </div>
                                <div className="flex justify-between text-xs text-slate-400 mt-2 px-1">
                                    <span>W1</span><span>W4</span><span>W8</span><span>W12</span>
                                </div>
                            </div>
                            {/* Early Warning System */}
                            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col flex-1">
                                <div className="p-5 border-b border-slate-200 dark:border-slate-700">
                                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[#F59E0B]" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                                        Early Warning System
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-1">Automated pattern detection &amp; flags</p>
                                </div>
                                <div className="flex-1 p-4 flex flex-col gap-3 overflow-y-auto max-h-[400px]">
                                    {/* Warning Card 1 */}
                                    <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-lg p-3">
                                        <div className="flex gap-3">
                                            <div className="mt-0.5 text-red-600">
                                                <span className="material-symbols-outlined text-[20px]">group_remove</span>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Attendance Drop</h4>
                                                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">3 students missed &gt;2 consecutive sessions this week.</p>
                                                <button className="mt-2 text-xs font-semibold text-red-600 hover:text-red-700 flex items-center">
                                                    Review List <span className="material-symbols-outlined text-[14px] ml-1">arrow_forward</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Warning Card 2 */}
                                    <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-lg p-3">
                                        <div className="flex gap-3">
                                            <div className="mt-0.5 text-amber-600">
                                                <span className="material-symbols-outlined text-[20px]">trending_down</span>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Grade Decline (Math)</h4>
                                                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">Cohort average dipped 5% below dept average.</p>
                                                <div className="mt-2 flex gap-2">
                                                    <button className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">Details</button>
                                                    <button className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">Suggest Action</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Warning Card 3 */}
                                    <div className="bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700 rounded-lg p-3">
                                        <div className="flex gap-3">
                                            <div className="mt-0.5 text-slate-500">
                                                <span className="material-symbols-outlined text-[20px]">schedule</span>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Engagement Lag</h4>
                                                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">5 students have not logged in for 7+ days.</p>
                                                <button className="mt-2 text-xs font-semibold text-[#135bec] hover:text-blue-700 flex items-center">
                                                    Send Reminder <span className="material-symbols-outlined text-[14px] ml-1">send</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <style jsx global>{`
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
      `}</style>
        </div>
    );
}
