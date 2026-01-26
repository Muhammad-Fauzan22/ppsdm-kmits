"use client";

import React from 'react';
import Link from 'next/link';

export default function AnalyticsPage() {
    return (
        <div className="bg-[#f6f6f8] dark:bg-[#101622] text-slate-900 dark:text-slate-100 font-[family-name:var(--font-inter)] antialiased overflow-hidden">
            <div className="flex h-screen w-full">
                {/* Sidebar */}
                <aside className="w-64 flex-shrink-0 bg-white dark:bg-[#151b2b] border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-colors duration-200 z-20">
                    <div className="flex flex-col h-full">
                        {/* Branding Area */}
                        <div className="h-16 flex items-center px-6 border-b border-slate-100 dark:border-slate-800/50">
                            <div className="size-8 bg-[#135bec] rounded-lg flex items-center justify-center text-white mr-3">
                                <span className="material-symbols-outlined text-[20px]">analytics</span>
                            </div>
                            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">PPSDM Analytics</span>
                        </div>
                        {/* User Profile Summary */}
                        <div className="p-4 border-b border-slate-100 dark:border-slate-800/50">
                            <div className="flex items-center gap-3">
                                <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 ring-2 ring-[#135bec]/10" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAz85TV4N1_cLq18xp9LV2mgcdahuuE2bpCEGqjN3EqtbGSqSMDrvnHj8mIrFJMbcsjcpyAI3iE2JjP_C-g8CRm_m3Np016-NOF78M2LE-QKm18hD5q0byM7BQ_eZRw-FqnxzEpFJPX06FIkyrzW4at6W8sZIJzD89ldUo5pflfibg-yBqxFiJLqlzJmGV7KWDlv3wDDvzFux119V2XtB8yyTrTLtzviVHpga6MKfwJLrNXeqGRJ0OzuCAYeSdTbeVleijXA9WeXIE")' }}></div>
                                <div className="flex flex-col overflow-hidden">
                                    <h1 className="text-slate-900 dark:text-white text-sm font-semibold truncate">Alex Chen</h1>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs truncate">Computer Science • Cohort A</p>
                                </div>
                            </div>
                        </div>
                        {/* Navigation */}
                        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                            <Link className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-[#135bec] transition-colors group" href="/dashboard">
                                <span className="material-symbols-outlined text-[20px] group-hover:text-[#135bec]">dashboard</span>
                                <span className="text-sm font-medium">Dashboard</span>
                            </Link>
                            <Link className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-[#135bec] transition-colors group" href="#">
                                <span className="material-symbols-outlined text-[20px] group-hover:text-[#135bec]">school</span>
                                <span className="text-sm font-medium">Courses</span>
                            </Link>
                            {/* Active State */}
                            <Link className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#135bec]/10 text-[#135bec] dark:text-[#135bec] dark:bg-[#135bec]/20 transition-colors" href="#">
                                <span className="material-symbols-outlined text-[20px] fill-1">trending_up</span>
                                <span className="text-sm font-semibold">Insights</span>
                            </Link>
                            <Link className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-[#135bec] transition-colors group" href="/community">
                                <span className="material-symbols-outlined text-[20px] group-hover:text-[#135bec]">groups</span>
                                <span className="text-sm font-medium">Community</span>
                            </Link>
                            <Link className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-[#135bec] transition-colors group" href="#">
                                <span className="material-symbols-outlined text-[20px] group-hover:text-[#135bec]">settings</span>
                                <span className="text-sm font-medium">Settings</span>
                            </Link>
                        </nav>
                        {/* Bottom Action */}
                        <div className="p-4 border-t border-slate-100 dark:border-slate-800/50">
                            <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-2 px-4 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                <span className="material-symbols-outlined text-[18px]">logout</span>
                                Sign Out
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#f6f6f8] dark:bg-[#101622] relative">
                    {/* Top Header */}
                    <header className="h-16 flex items-center justify-between px-8 bg-white dark:bg-[#151b2b] border-b border-slate-200 dark:border-slate-800 flex-shrink-0 z-10">
                        {/* Breadcrumbs */}
                        <nav className="flex items-center text-sm font-medium text-slate-500 dark:text-slate-400">
                            <Link className="hover:text-[#135bec] transition-colors" href="#">Home</Link>
                            <span className="mx-2 text-slate-300 dark:text-slate-600">/</span>
                            <span className="text-slate-900 dark:text-white">Insights</span>
                        </nav>
                        <div className="flex items-center gap-4">
                            {/* Search */}
                            <div className="relative hidden md:block group">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 group-focus-within:text-[#135bec] transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">search</span>
                                </span>
                                <input className="form-input block w-64 rounded-lg border-0 bg-slate-100 dark:bg-slate-800/50 py-1.5 pl-10 pr-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-[#135bec]/50 sm:text-sm sm:leading-6 transition-all" placeholder="Search insights..." type="text" />
                            </div>
                            {/* Notifications */}
                            <button className="relative p-2 text-slate-400 hover:text-[#135bec] transition-colors">
                                <span className="absolute top-2 right-2 size-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#151b2b]"></span>
                                <span className="material-symbols-outlined">notifications</span>
                            </button>
                        </div>
                    </header>

                    {/* Scrollable Dashboard Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                        <div className="max-w-[1400px] mx-auto space-y-6">
                            {/* Page Header & Controls */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Personal Growth Trajectory</h2>
                                    <p className="text-slate-500 dark:text-slate-400 mt-1">AI-driven analysis of your performance vs. cohort benchmarks.</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    {/* Segmented Control */}
                                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                                        <button className="px-4 py-1.5 text-sm font-medium rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm transition-all">Weekly</button>
                                        <button className="px-4 py-1.5 text-sm font-medium rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all">Monthly</button>
                                    </div>
                                    {/* Export */}
                                    <button className="flex items-center gap-2 bg-[#135bec] hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-blue-500/20">
                                        <span className="material-symbols-outlined text-[18px]">download</span>
                                        Export Report
                                    </button>
                                </div>
                            </div>

                            {/* Key Metrics Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Metric 1 */}
                                <div className="bg-white dark:bg-[#151b2b] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                                            <span className="material-symbols-outlined text-[20px]">schedule</span>
                                        </div>
                                        <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
                                            <span className="material-symbols-outlined text-[14px] mr-1">arrow_upward</span> 2.4%
                                        </span>
                                    </div>
                                    <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">98%</div>
                                    <p className="text-xs text-slate-500 font-medium">Attendance Rate</p>
                                </div>
                                {/* Metric 2 */}
                                <div className="bg-white dark:bg-[#151b2b] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400">
                                            <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
                                        </div>
                                        <span className="flex items-center text-xs font-medium text-slate-500 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                                            <span className="material-symbols-outlined text-[14px] mr-1">remove</span> 0%
                                        </span>
                                    </div>
                                    <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">100%</div>
                                    <p className="text-xs text-slate-500 font-medium">Assignment Completion</p>
                                </div>
                                {/* Metric 3 */}
                                <div className="bg-white dark:bg-[#151b2b] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600 dark:text-orange-400">
                                            <span className="material-symbols-outlined text-[20px]">leaderboard</span>
                                        </div>
                                        <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
                                            <span className="material-symbols-outlined text-[14px] mr-1">arrow_upward</span> 5%
                                        </span>
                                    </div>
                                    <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Top 15%</div>
                                    <p className="text-xs text-slate-500 font-medium">Cohort Ranking</p>
                                </div>
                                {/* Metric 4 */}
                                <div className="bg-white dark:bg-[#151b2b] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="p-2 bg-pink-50 dark:bg-pink-900/20 rounded-lg text-pink-600 dark:text-pink-400">
                                            <span className="material-symbols-outlined text-[20px]">bolt</span>
                                        </div>
                                        <span className="flex items-center text-xs font-medium text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full">
                                            <span className="material-symbols-outlined text-[14px] mr-1">arrow_downward</span> 1h
                                        </span>
                                    </div>
                                    <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">32h</div>
                                    <p className="text-xs text-slate-500 font-medium">Focus Hours / Week</p>
                                </div>
                            </div>
                            {/* Main Visualization Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Main Multi-Axis Chart */}
                                <div className="lg:col-span-2 bg-white dark:bg-[#151b2b] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[400px]">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-base font-semibold text-slate-900 dark:text-white">Performance vs Soft Skills Trajectory</h3>
                                        <div className="flex items-center gap-4 text-xs">
                                            <div className="flex items-center gap-1.5">
                                                <div className="size-3 bg-[#135bec] rounded-sm"></div>
                                                <span className="text-slate-500">Academic</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <div className="size-3 bg-blue-300 rounded-sm"></div>
                                                <span className="text-slate-500">Soft Skills</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-4 h-0.5 border-t-2 border-dashed border-slate-400"></div>
                                                <span className="text-slate-500">Prediction</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Chart Area */}
                                    <div className="relative flex-1 w-full pl-8 pb-8 pt-4">
                                        {/* Y Axis Left Labels */}
                                        <div className="absolute left-0 top-4 bottom-8 w-8 flex flex-col justify-between text-[10px] text-slate-400 text-right pr-2">
                                            <span>100</span><span>80</span><span>60</span><span>40</span><span>20</span><span>0</span>
                                        </div>
                                        {/* Chart Grid */}
                                        <div className="h-full w-full border-l border-b border-slate-100 dark:border-slate-700/50 relative grid grid-cols-7 gap-4 items-end px-4">
                                            {/* Grid Lines */}
                                            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                                                <div className="border-t border-slate-50 dark:border-slate-800 w-full h-0"></div>
                                                <div className="border-t border-slate-50 dark:border-slate-800 w-full h-0"></div>
                                                <div className="border-t border-slate-50 dark:border-slate-800 w-full h-0"></div>
                                                <div className="border-t border-slate-50 dark:border-slate-800 w-full h-0"></div>
                                                <div className="border-t border-slate-50 dark:border-slate-800 w-full h-0"></div>
                                                <div className="border-t border-slate-50 dark:border-slate-800 w-full h-0"></div>
                                            </div>
                                            {/* Chart Bars (Simplified for React) */}
                                            {/* Note: In a real app we might map this. Hardcoding for fidelity to snippet */}
                                            <div className="relative flex flex-col items-center justify-end h-full group">
                                                <div className="w-full flex gap-1 items-end justify-center h-full">
                                                    <div className="w-3 bg-[#135bec]/80 rounded-t-sm h-[60%] transition-all group-hover:bg-[#135bec]"></div>
                                                    <div className="w-3 bg-blue-300/80 rounded-t-sm h-[55%] transition-all group-hover:bg-blue-400"></div>
                                                </div>
                                                <span className="absolute -bottom-6 text-[10px] text-slate-400">Wk 1</span>
                                            </div>
                                            {/* More Bars - abbreviated for brevity as they are just visual placeholders in snippet */}
                                            <div className="relative flex flex-col items-center justify-end h-full group">
                                                <div className="w-full flex gap-1 items-end justify-center h-full">
                                                    <div className="w-3 bg-[#135bec]/80 rounded-t-sm h-[82%] transition-all group-hover:bg-[#135bec]"></div>
                                                    <div className="w-3 bg-blue-300/80 rounded-t-sm h-[78%] transition-all group-hover:bg-blue-400"></div>
                                                </div>
                                                <span className="absolute -bottom-6 text-[10px] text-slate-400">Wk 5</span>
                                            </div>

                                            {/* Prediction Group (Faded) */}
                                            <div className="relative flex flex-col items-center justify-end h-full group opacity-60">
                                                <div className="w-full flex gap-1 items-end justify-center h-full">
                                                    <div className="w-3 border-2 border-[#135bec] border-dashed bg-[#135bec]/10 rounded-t-sm h-[88%]"></div>
                                                    <div className="w-3 border-2 border-blue-300 border-dashed bg-blue-300/10 rounded-t-sm h-[82%]"></div>
                                                </div>
                                                <span className="absolute -bottom-6 text-[10px] text-slate-400 italic">Pred</span>
                                            </div>

                                            {/* Trend Line SVG Overlay */}
                                            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" preserveAspectRatio="none">
                                                <path d="M 40 240 L 400 150 L 490 120" fill="none" stroke="#135bec" strokeWidth="2" strokeDasharray="4 2"></path>
                                                {/* Simplified path for React */}
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Success Prediction Widget */}
                                <div className="bg-white dark:bg-[#151b2b] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[#135bec]">psychology_alt</span>
                                            AI Success Score
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-1">Probability of passing Advanced Certification based on current data.</p>
                                    </div>
                                    <div className="flex flex-col items-center justify-center my-6 relative">
                                        {/* Donut Chart Simulated with Conic Gradient */}
                                        <div className="size-48 rounded-full flex items-center justify-center relative" style={{ background: 'conic-gradient(#135bec 0% 84%, #e2e8f0 84% 100%)' }}>
                                            <div className="size-36 bg-white dark:bg-[#151b2b] rounded-full flex flex-col items-center justify-center z-10">
                                                <span className="text-4xl font-bold text-slate-900 dark:text-white">84<span className="text-lg align-top text-slate-400">%</span></span>
                                                <span className="text-xs font-semibold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full mt-1">+2% vs L.M.</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-100 dark:border-blue-900/20">
                                        <p className="text-sm text-blue-800 dark:text-blue-300 font-medium leading-tight">
                                            "Your consistency in Project Alpha suggests a high aptitude for Management roles."
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {/* Bottom Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Cohort Comparison Heatmap */}
                                <div className="bg-white dark:bg-[#151b2b] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-base font-semibold text-slate-900 dark:text-white">Skill Cluster vs Cohort</h3>
                                        <button className="text-xs text-[#135bec] font-medium hover:underline">View Details</button>
                                    </div>
                                    <div className="space-y-6">
                                        {/* Skill 1 */}
                                        <div>
                                            <div className="flex justify-between text-sm mb-1.5">
                                                <span className="font-medium text-slate-700 dark:text-slate-300">Technical Proficiency</span>
                                                <span className="text-slate-500 text-xs">Top 10% Range</span>
                                            </div>
                                            <div className="relative h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                {/* Cohort Average Marker (Background) */}
                                                <div className="absolute top-0 left-0 h-full bg-slate-300 dark:bg-slate-500 w-[65%] rounded-full opacity-50"></div>
                                                {/* User Score */}
                                                <div className="absolute top-0 left-0 h-full bg-[#135bec] w-[78%] rounded-full shadow-[0_0_10px_rgba(19,91,236,0.5)]"></div>
                                            </div>
                                            <div className="flex justify-between text-xs text-slate-400 mt-1">
                                                <span>Avg: 65%</span>
                                                <span className="text-[#135bec] font-bold">You: 78%</span>
                                            </div>
                                        </div>
                                        {/* Skill 2 */}
                                        <div>
                                            <div className="flex justify-between text-sm mb-1.5">
                                                <span className="font-medium text-slate-700 dark:text-slate-300">Leadership & Initiative</span>
                                                <span className="text-slate-500 text-xs">Top 5% Range</span>
                                            </div>
                                            <div className="relative h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div className="absolute top-0 left-0 h-full bg-slate-300 dark:bg-slate-500 w-[70%] rounded-full opacity-50"></div>
                                                <div className="absolute top-0 left-0 h-full bg-[#135bec] w-[85%] rounded-full shadow-[0_0_10px_rgba(19,91,236,0.5)]"></div>
                                            </div>
                                            <div className="flex justify-between text-xs text-slate-400 mt-1">
                                                <span>Avg: 70%</span>
                                                <span className="text-[#135bec] font-bold">You: 85%</span>
                                            </div>
                                        </div>
                                        {/* Skill 3 */}
                                        <div>
                                            <div className="flex justify-between text-sm mb-1.5">
                                                <span className="font-medium text-slate-700 dark:text-slate-300">Communication</span>
                                                <span className="text-slate-500 text-xs">Median Range</span>
                                            </div>
                                            <div className="relative h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div className="absolute top-0 left-0 h-full bg-slate-300 dark:bg-slate-500 w-[80%] rounded-full opacity-50"></div>
                                                <div className="absolute top-0 left-0 h-full bg-yellow-400 w-[75%] rounded-full"></div>
                                            </div>
                                            <div className="flex justify-between text-xs text-slate-400 mt-1">
                                                <span>Avg: 80%</span>
                                                <span className="text-yellow-600 font-bold">You: 75%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* AI Insight Feed */}
                                <div className="bg-white dark:bg-[#151b2b] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                                    <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-purple-500">auto_awesome</span>
                                        Generated Insights
                                    </h3>
                                    <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar max-h-[250px]">
                                        {/* Insight Card 1 */}
                                        <div className="flex gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 transition-colors hover:border-[#135bec]/30">
                                            <div className="flex-shrink-0 mt-0.5">
                                                <span className="material-symbols-outlined text-blue-500 text-[20px]">trending_up</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Accelerated Growth in Technical Skills</p>
                                                <p className="text-xs text-slate-500 mt-1">You've improved your coding efficiency by 15% this month, outpacing the cohort average.</p>
                                            </div>
                                        </div>
                                        {/* Insight Card 2 */}
                                        <div className="flex gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 transition-colors hover:border-yellow-500/30">
                                            <div className="flex-shrink-0 mt-0.5">
                                                <span className="material-symbols-outlined text-yellow-500 text-[20px]">lightbulb</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Focus Recommendation</p>
                                                <p className="text-xs text-slate-500 mt-1">Consider dedicating 2 extra hours to Public Speaking workshops to balance your soft skill profile.</p>
                                            </div>
                                        </div>
                                        {/* Insight Card 3 */}
                                        <div className="flex gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 transition-colors hover:border-green-500/30">
                                            <div className="flex-shrink-0 mt-0.5">
                                                <span className="material-symbols-outlined text-green-500 text-[20px]">verified</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Milestone Reached</p>
                                                <p className="text-xs text-slate-500 mt-1">You are now in the top 15% for Project Leadership. Keep up the peer mentoring.</p>
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
        /* Custom scrollbar for data-dense areas */
        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #cbd5e1;
            border-radius: 20px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #334155;
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .fill-1 {
            font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>
        </div>
    );
}
