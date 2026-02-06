"use client";

import React from 'react';

export default function ImpactDashboardPage() {
    return (
        <div className="font-[family-name:var(--font-public-sans)] bg-[#f6f6f8] dark:bg-[#102218] text-slate-900 dark:text-white transition-colors duration-200 flex h-screen overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-[#111118] border-r border-slate-200 dark:border-[#282839] flex flex-col justify-between p-4 hidden md:flex z-20">
                <div className="flex flex-col gap-6">
                    {/* Branding */}
                    <div className="flex flex-col px-2">
                        <h1 className="text-[#1313ec] dark:text-white text-xl font-bold leading-normal flex items-center gap-2">
                            <span className="material-symbols-outlined text-[#1313ec]">school</span>
                            PPSDM Admin
                        </h1>
                        <p className="text-slate-500 dark:text-[#9d9db9] text-xs font-normal leading-normal mt-1">Executive View</p>
                    </div>
                    {/* Navigation */}
                    <nav className="flex flex-col gap-2">
                        <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#1313ec]/10 dark:bg-[#282839] group transition-all" href="#">
                            <span className="material-symbols-outlined text-[#1313ec] dark:text-white">dashboard</span>
                            <p className="text-[#1313ec] dark:text-white text-sm font-medium leading-normal">Overview</p>
                        </a>
                        <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1e1e2d] transition-all text-slate-600 dark:text-[#9d9db9]" href="#">
                            <span className="material-symbols-outlined">domain</span>
                            <p className="text-sm font-medium leading-normal">Departments</p>
                        </a>
                        <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1e1e2d] transition-all text-slate-600 dark:text-[#9d9db9]" href="#">
                            <span className="material-symbols-outlined">bar_chart</span>
                            <p className="text-sm font-medium leading-normal">IKU Metrics</p>
                        </a>
                        <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1e1e2d] transition-all text-slate-600 dark:text-[#9d9db9]" href="#">
                            <span className="material-symbols-outlined">description</span>
                            <p className="text-sm font-medium leading-normal">Reports</p>
                        </a>
                        <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1e1e2d] transition-all text-slate-600 dark:text-[#9d9db9]" href="#">
                            <span className="material-symbols-outlined">settings</span>
                            <p className="text-sm font-medium leading-normal">Settings</p>
                        </a>
                    </nav>
                </div>
                {/* Bottom User Profile */}
                <div className="flex items-center gap-3 px-3 py-2 border-t border-slate-200 dark:border-[#282839] pt-4">
                    <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-700 overflow-hidden relative">
                        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAuBgS3HF3xqzy_aPVXkGD80hROzmwz6MWBRhhTutjR0GKZ6taK34w8xLxJRw7adWqn3ea6OkyRuevItOAXmdhzaBwW4wFasXZc1YYAHmjdI1-53cCwOdRlJfEgYInfZ15AQfEEYKmAS31gLc6oza-MmRmMbK_NyqZE-cDc6RIJvIc0rFNh_Q27cmFrtR52K2g3nXVf4KmWwrMJAZU7t3K7NIP_gKNXDOw8JHElotUEe9Pb-87Bb3AX0L4cBMbJ_cly4JOjBcNbHHQ")' }}></div>
                    </div>
                    <div className="flex flex-col">
                        <p className="text-sm font-medium dark:text-white text-slate-800">Dr. Haryanto</p>
                        <p className="text-xs text-slate-500 dark:text-[#9d9db9]">Chief Administrator</p>
                    </div>
                </div>
            </aside>
            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-y-auto relative bg-[#f6f6f8] dark:bg-[#102218]">
                {/* Top Header & Breadcrumbs */}
                <header className="w-full px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/50 bg-white/50 dark:bg-[#111118]/50 backdrop-blur-sm sticky top-0 z-10">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-[#9d9db9] mb-1">
                            <span>Admin</span>
                            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                            <span className="font-semibold text-[#1313ec] dark:text-white">Impact Dashboard</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-[#282839] rounded-lg border border-slate-200 dark:border-[#3b3b54]">
                            <span className="material-symbols-outlined text-slate-500 dark:text-[#9d9db9] text-sm">calendar_month</span>
                            <span className="text-sm font-medium text-slate-700 dark:text-white">Fiscal Year 2024</span>
                            <span className="material-symbols-outlined text-slate-500 dark:text-[#9d9db9] text-sm">arrow_drop_down</span>
                        </div>
                        <button className="relative p-2 text-slate-500 dark:text-[#9d9db9] hover:bg-slate-100 dark:hover:bg-[#282839] rounded-lg">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#111118]"></span>
                        </button>
                    </div>
                </header>
                <div className="p-6 md:p-8 max-w-[1400px] mx-auto w-full flex flex-col gap-6">
                    {/* Page Title Section */}
                    <div className="flex flex-wrap justify-between items-end gap-4">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">Institutional Impact Dashboard</h2>
                            <p className="text-slate-500 dark:text-[#9d9db9] text-base">Key Performance Indicators & Strategic Outcomes</p>
                        </div>
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-[#1313ec] hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-lg shadow-[#1313ec]/20 transition-all">
                            <span className="material-symbols-outlined text-lg">download</span>
                            Export Report
                        </button>
                    </div>
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Card 1 */}
                        <div className="flex flex-col gap-4 p-6 rounded-xl bg-white dark:bg-[#1e1e2d] border border-slate-200 dark:border-[#3b3b54] shadow-sm">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2 text-slate-600 dark:text-[#9d9db9]">
                                    <span className="material-symbols-outlined text-[#1313ec]">school</span>
                                    <p className="text-sm font-semibold uppercase tracking-wider">Employability Readiness</p>
                                </div>
                                <span className="flex items-center gap-1 text-[#0bda68] bg-[#0bda68]/10 px-2 py-0.5 rounded text-xs font-bold">
                                    <span className="material-symbols-outlined text-sm">trending_up</span> +4.2% YoY
                                </span>
                            </div>
                            <div>
                                <p className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">87%</p>
                                <p className="text-slate-400 text-sm mt-1">Weighted Score Campus-Wide</p>
                            </div>
                            {/* Micro Sparkline */}
                            <div className="h-1.5 w-full bg-slate-100 dark:bg-[#282839] rounded-full overflow-hidden">
                                <div className="bg-[#1313ec] h-1.5 rounded-full" style={{ width: '87%' }}></div>
                            </div>
                        </div>
                        {/* Card 2 */}
                        <div className="flex flex-col gap-4 p-6 rounded-xl bg-white dark:bg-[#1e1e2d] border border-slate-200 dark:border-[#3b3b54] shadow-sm">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2 text-slate-600 dark:text-[#9d9db9]">
                                    <span className="material-symbols-outlined text-[#1313ec]">analytics</span>
                                    <p className="text-sm font-semibold uppercase tracking-wider">IKU Achievement</p>
                                </div>
                                <span className="flex items-center gap-1 text-[#0bda68] bg-[#0bda68]/10 px-2 py-0.5 rounded text-xs font-bold">
                                    <span className="material-symbols-outlined text-sm">arrow_upward</span> +12% Target
                                </span>
                            </div>
                            <div>
                                <p className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">76%</p>
                                <p className="text-slate-400 text-sm mt-1">Total Institutional Target Met</p>
                            </div>
                            {/* Micro Sparkline */}
                            <div className="h-1.5 w-full bg-slate-100 dark:bg-[#282839] rounded-full overflow-hidden">
                                <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '76%' }}></div>
                            </div>
                        </div>
                        {/* Card 3 */}
                        <div className="flex flex-col gap-4 p-6 rounded-xl bg-white dark:bg-[#1e1e2d] border border-slate-200 dark:border-[#3b3b54] shadow-sm">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2 text-slate-600 dark:text-[#9d9db9]">
                                    <span className="material-symbols-outlined text-[#1313ec]">domain</span>
                                    <p className="text-sm font-semibold uppercase tracking-wider">Active Departments</p>
                                </div>
                                <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded text-xs font-bold">
                                    <span className="material-symbols-outlined text-sm">remove</span> Stable
                                </span>
                            </div>
                            <div>
                                <p className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">14</p>
                                <p className="text-slate-400 text-sm mt-1">Contributing to impact metrics</p>
                            </div>
                            {/* Micro Dots Visualization */}
                            <div className="flex gap-1 pt-1">
                                <div className="w-2 h-2 rounded-full bg-[#1313ec]"></div>
                                <div className="w-2 h-2 rounded-full bg-[#1313ec]"></div>
                                <div className="w-2 h-2 rounded-full bg-[#1313ec]"></div>
                                <div className="w-2 h-2 rounded-full bg-[#1313ec]"></div>
                                <div className="w-2 h-2 rounded-full bg-[#1313ec]/50"></div>
                                <div className="w-2 h-2 rounded-full bg-[#1313ec]/20"></div>
                            </div>
                        </div>
                    </div>
                    {/* Main Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Chart 1: Trend Line */}
                        <div className="flex flex-col gap-4 p-6 rounded-xl bg-white dark:bg-[#1e1e2d] border border-slate-200 dark:border-[#3b3b54] shadow-sm min-h-[360px]">
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col">
                                    <h3 className="text-slate-900 dark:text-white text-lg font-bold">Readiness Score Trend</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">Last 12 Months Performance</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-[#1313ec] dark:text-white">+5.4%</p>
                                    <p className="text-xs text-[#0bda68]">Growth Rate</p>
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col justify-end relative mt-4">
                                {/* Simulated Line Chart SVG */}
                                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 150">
                                    <defs>
                                        <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                            <stop offset="0%" stopColor="#1313ec" stopOpacity="0.2"></stop>
                                            <stop offset="100%" stopColor="#1313ec" stopOpacity="0"></stop>
                                        </linearGradient>
                                    </defs>
                                    {/* Grid Lines */}
                                    <line opacity="0.3" stroke="#3b3b54" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="500" y1="150" y2="150"></line>
                                    <line opacity="0.3" stroke="#3b3b54" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="500" y1="100" y2="100"></line>
                                    <line opacity="0.3" stroke="#3b3b54" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="500" y1="50" y2="50"></line>
                                    {/* The Data Line */}
                                    <path d="M0,120 Q50,110 100,90 T200,80 T300,50 T400,60 T500,20" fill="url(#chartGradient)" stroke="none"></path>
                                    <path d="M0,120 Q50,110 100,90 T200,80 T300,50 T400,60 T500,20" fill="none" stroke="#1313ec" strokeLinecap="round" strokeWidth="3"></path>
                                    {/* Points */}
                                    <circle cx="100" cy="90" fill="#1313ec" r="4" stroke="white" strokeWidth="2"></circle>
                                    <circle cx="300" cy="50" fill="#1313ec" r="4" stroke="white" strokeWidth="2"></circle>
                                    <circle cx="500" cy="20" fill="#1313ec" r="4" stroke="white" strokeWidth="2"></circle>
                                </svg>
                                {/* X Axis Labels */}
                                <div className="flex justify-between mt-4 text-xs font-medium text-slate-400 dark:text-[#9d9db9] uppercase tracking-wide">
                                    <span>Jan</span>
                                    <span>Mar</span>
                                    <span>May</span>
                                    <span>Jul</span>
                                    <span>Sep</span>
                                    <span>Nov</span>
                                </div>
                            </div>
                        </div>
                        {/* Chart 2: IKU Contribution */}
                        <div className="flex flex-col gap-4 p-6 rounded-xl bg-white dark:bg-[#1e1e2d] border border-slate-200 dark:border-[#3b3b54] shadow-sm min-h-[360px]">
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex flex-col">
                                    <h3 className="text-slate-900 dark:text-white text-lg font-bold">IKU Contribution</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">By Strategic Category</p>
                                </div>
                                <button className="p-2 hover:bg-slate-100 dark:hover:bg-[#282839] rounded-lg">
                                    <span className="material-symbols-outlined text-slate-400 text-lg">more_horiz</span>
                                </button>
                            </div>
                            <div className="flex flex-col gap-6 justify-center flex-1">
                                {/* Category 1 */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between text-sm font-semibold">
                                        <span className="text-slate-600 dark:text-slate-300">Research & Innovation</span>
                                        <span className="text-slate-900 dark:text-white">92%</span>
                                    </div>
                                    <div className="w-full h-3 bg-slate-100 dark:bg-[#282839] rounded-full overflow-hidden">
                                        <div className="h-full bg-[#1313ec] rounded-full" style={{ width: '92%' }}></div>
                                    </div>
                                </div>
                                {/* Category 2 */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between text-sm font-semibold">
                                        <span className="text-slate-600 dark:text-slate-300">Graduate Employability</span>
                                        <span className="text-slate-900 dark:text-white">78%</span>
                                    </div>
                                    <div className="w-full h-3 bg-slate-100 dark:bg-[#282839] rounded-full overflow-hidden">
                                        <div className="h-full bg-cyan-500 rounded-full" style={{ width: '78%' }}></div>
                                    </div>
                                </div>
                                {/* Category 3 */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between text-sm font-semibold">
                                        <span className="text-slate-600 dark:text-slate-300">Community Service</span>
                                        <span className="text-slate-900 dark:text-white">65%</span>
                                    </div>
                                    <div className="w-full h-3 bg-slate-100 dark:bg-[#282839] rounded-full overflow-hidden">
                                        <div className="h-full bg-purple-500 rounded-full" style={{ width: '65%' }}></div>
                                    </div>
                                </div>
                                {/* Category 4 */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between text-sm font-semibold">
                                        <span className="text-slate-600 dark:text-slate-300">Global Partnerships</span>
                                        <span className="text-slate-900 dark:text-white">84%</span>
                                    </div>
                                    <div className="w-full h-3 bg-slate-100 dark:bg-[#282839] rounded-full overflow-hidden">
                                        <div className="h-full bg-pink-500 rounded-full" style={{ width: '84%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Bottom Section: Detailed Grid & Insights */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-10">
                        {/* Left: Dimension Growth Trends (Heatmap style) */}
                        <div className="xl:col-span-2 flex flex-col gap-4 p-6 rounded-xl bg-white dark:bg-[#1e1e2d] border border-slate-200 dark:border-[#3b3b54] shadow-sm">
                            <div className="flex justify-between items-center">
                                <h3 className="text-slate-900 dark:text-white text-lg font-bold">Dimension Growth Trends</h3>
                                <button className="text-xs font-bold text-[#1313ec] uppercase tracking-wider hover:underline">View Full Matrix</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="py-3 px-2 text-xs font-bold text-slate-500 dark:text-[#9d9db9] uppercase tracking-wider border-b border-slate-200 dark:border-[#3b3b54]">Department</th>
                                            <th className="py-3 px-2 text-xs font-bold text-slate-500 dark:text-[#9d9db9] uppercase tracking-wider border-b border-slate-200 dark:border-[#3b3b54] text-center">Leadership</th>
                                            <th className="py-3 px-2 text-xs font-bold text-slate-500 dark:text-[#9d9db9] uppercase tracking-wider border-b border-slate-200 dark:border-[#3b3b54] text-center">Tech Skills</th>
                                            <th className="py-3 px-2 text-xs font-bold text-slate-500 dark:text-[#9d9db9] uppercase tracking-wider border-b border-slate-200 dark:border-[#3b3b54] text-center">Collaboration</th>
                                            <th className="py-3 px-2 text-xs font-bold text-slate-500 dark:text-[#9d9db9] uppercase tracking-wider border-b border-slate-200 dark:border-[#3b3b54] text-center">Impact</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        <tr className="group hover:bg-slate-50 dark:hover:bg-[#282839]/50 transition-colors">
                                            <td className="py-4 px-2 font-medium text-slate-700 dark:text-white border-b border-slate-100 dark:border-[#282839]">Computer Science</td>
                                            <td className="py-4 px-2 text-center border-b border-slate-100 dark:border-[#282839]"><span className="px-2 py-1 rounded bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 font-bold">+12%</span></td>
                                            <td className="py-4 px-2 text-center border-b border-slate-100 dark:border-[#282839]"><span className="px-2 py-1 rounded bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 font-bold">+18%</span></td>
                                            <td className="py-4 px-2 text-center border-b border-slate-100 dark:border-[#282839]"><span className="px-2 py-1 rounded bg-slate-100 text-slate-600 dark:bg-[#3b3b54] dark:text-slate-300">+2%</span></td>
                                            <td className="py-4 px-2 text-center border-b border-slate-100 dark:border-[#282839]"><span className="px-2 py-1 rounded bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 font-bold">+8%</span></td>
                                        </tr>
                                        <tr className="group hover:bg-slate-50 dark:hover:bg-[#282839]/50 transition-colors">
                                            <td className="py-4 px-2 font-medium text-slate-700 dark:text-white border-b border-slate-100 dark:border-[#282839]">Civil Engineering</td>
                                            <td className="py-4 px-2 text-center border-b border-slate-100 dark:border-[#282839]"><span className="px-2 py-1 rounded bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 font-bold">+5%</span></td>
                                            <td className="py-4 px-2 text-center border-b border-slate-100 dark:border-[#282839]"><span className="px-2 py-1 rounded bg-slate-100 text-slate-600 dark:bg-[#3b3b54] dark:text-slate-300">+1%</span></td>
                                            <td className="py-4 px-2 text-center border-b border-slate-100 dark:border-[#282839]"><span className="px-2 py-1 rounded bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 font-bold">+14%</span></td>
                                            <td className="py-4 px-2 text-center border-b border-slate-100 dark:border-[#282839]"><span className="px-2 py-1 rounded bg-slate-100 text-slate-600 dark:bg-[#3b3b54] dark:text-slate-300">0%</span></td>
                                        </tr>
                                        <tr className="group hover:bg-slate-50 dark:hover:bg-[#282839]/50 transition-colors">
                                            <td className="py-4 px-2 font-medium text-slate-700 dark:text-white border-b border-slate-100 dark:border-[#282839]">Architecture</td>
                                            <td className="py-4 px-2 text-center border-b border-slate-100 dark:border-[#282839]"><span className="px-2 py-1 rounded bg-slate-100 text-slate-600 dark:bg-[#3b3b54] dark:text-slate-300">-2%</span></td>
                                            <td className="py-4 px-2 text-center border-b border-slate-100 dark:border-[#282839]"><span className="px-2 py-1 rounded bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 font-bold">+7%</span></td>
                                            <td className="py-4 px-2 text-center border-b border-slate-100 dark:border-[#282839]"><span className="px-2 py-1 rounded bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 font-bold">+9%</span></td>
                                            <td className="py-4 px-2 text-center border-b border-slate-100 dark:border-[#282839]"><span className="px-2 py-1 rounded bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 font-bold">-4%</span></td>
                                        </tr>
                                        <tr className="group hover:bg-slate-50 dark:hover:bg-[#282839]/50 transition-colors">
                                            <td className="py-4 px-2 font-medium text-slate-700 dark:text-white">Business Mgmt</td>
                                            <td className="py-4 px-2 text-center"><span className="px-2 py-1 rounded bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 font-bold">+15%</span></td>
                                            <td className="py-4 px-2 text-center"><span className="px-2 py-1 rounded bg-slate-100 text-slate-600 dark:bg-[#3b3b54] dark:text-slate-300">+3%</span></td>
                                            <td className="py-4 px-2 text-center"><span className="px-2 py-1 rounded bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 font-bold">+11%</span></td>
                                            <td className="py-4 px-2 text-center"><span className="px-2 py-1 rounded bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 font-bold">+6%</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/* Right: Strategic Insights & Leaderboard */}
                        <div className="flex flex-col gap-6">
                            {/* AI Insight Card */}
                            <div className="p-6 rounded-xl bg-gradient-to-br from-[#1313ec]/10 to-transparent dark:from-[#282839] dark:to-[#1e1e2d] border border-[#1313ec]/20 dark:border-[#3b3b54]">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="material-symbols-outlined text-[#1313ec]">auto_awesome</span>
                                    <h3 className="text-slate-900 dark:text-white text-base font-bold">Strategic Insight</h3>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                    Engineering Faculty leads in industry partnerships (+12%), significantly boosting the employability score. However, Humanities departments require targeted support in digital literacy initiatives to meet FY2024 IKU targets.
                                </p>
                            </div>
                            {/* Mini Leaderboard */}
                            <div className="flex flex-col flex-1 p-6 rounded-xl bg-white dark:bg-[#1e1e2d] border border-slate-200 dark:border-[#3b3b54] shadow-sm">
                                <h3 className="text-slate-900 dark:text-white text-lg font-bold mb-4">Top Performers</h3>
                                <div className="flex flex-col gap-4">
                                    {/* Item 1 */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-[#1313ec]/10 flex items-center justify-center text-[#1313ec] font-bold text-sm">1</div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-800 dark:text-white">Industrial Eng.</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">Score: 94/100</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-green-500">+2.1%</span>
                                    </div>
                                    {/* Item 2 */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-slate-100 dark:bg-[#282839] flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold text-sm">2</div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-800 dark:text-white">Informatics</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">Score: 91/100</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-green-500">+5.4%</span>
                                    </div>
                                    {/* Item 3 */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-slate-100 dark:bg-[#282839] flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold text-sm">3</div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-800 dark:text-white">Visual Design</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">Score: 88/100</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-slate-400">0.0%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <style jsx global>{`
            .material-symbols-outlined {
                font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            }
        `}</style>
            </main>
        </div>
    );
}
