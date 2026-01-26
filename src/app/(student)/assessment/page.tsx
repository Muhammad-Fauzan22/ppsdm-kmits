"use client";

import Link from "next/link";

export default function AssessmentHubPage() {
    return (
        <div className="bg-[#f6f6f8] dark:bg-[#101622] text-[#111318] dark:text-white transition-colors duration-200 min-h-screen flex flex-col font-[family-name:var(--font-inter)]">
            <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
                {/* TopNavBar */}
                <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a2332] px-6 lg:px-10 py-3 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="size-8 flex items-center justify-center rounded bg-[#135bec] text-white">
                            <span className="material-symbols-outlined text-xl">school</span>
                        </div>
                        <h2 className="text-[#111318] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">PPSDM KMM Ecosystem</h2>
                    </div>
                    <div className="flex flex-1 justify-end gap-8 items-center">
                        <nav className="hidden md:flex items-center gap-8">
                            <Link className="text-[#616f89] hover:text-[#135bec] dark:text-slate-400 dark:hover:text-white text-sm font-medium transition-colors" href="#">Dashboard</Link>
                            <Link className="text-[#135bec] dark:text-white text-sm font-bold transition-colors" href="#">Assessments</Link>
                            <Link className="text-[#616f89] hover:text-[#135bec] dark:text-slate-400 dark:hover:text-white text-sm font-medium transition-colors" href="#">Reports</Link>
                            <Link className="text-[#616f89] hover:text-[#135bec] dark:text-slate-400 dark:hover:text-white text-sm font-medium transition-colors" href="#">My Profile</Link>
                        </nav>
                        <div className="flex items-center gap-4">
                            <button className="text-[#616f89] hover:text-[#135bec]">
                                <span className="material-symbols-outlined">notifications</span>
                            </button>
                            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9 border-2 border-slate-100" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBco75AiMR_6Dn78XsGAWrR1wxEshF-gJEViVVkfFvR2lcW4uwGCIiyxYpyZHeCcvX3lGfx2sb1VdVwXjqC3r6A-i6X2vCJXy-JEL6jJa0ROTGbmTiXXTXlLj7IR1I7MgkqRT6AluQQQnSSIapVORj1-Qaz775-K8I-n2GKevO2zI3tLvgc5sLNVXMTSycpouDle0eXyGQhJjq2CxHmE9HdpjJ0Duzl5QeIxZLfyozTcAPujUXjATou4GwIpE_06HdQ8IPERa8E6eQ')" }}></div>
                        </div>
                    </div>
                </header>
                <main className="flex-1 flex flex-col items-center py-6 px-4 md:px-10">
                    <div className="w-full max-w-[1200px] flex flex-col gap-6">
                        {/* Breadcrumbs */}
                        <div className="flex flex-wrap gap-2 text-sm">
                            <Link className="text-[#616f89] hover:text-[#135bec]" href="#">Home</Link>
                            <span className="text-[#616f89]">/</span>
                            <Link className="text-[#616f89] hover:text-[#135bec]" href="#">Assessment</Link>
                            <span className="text-[#616f89]">/</span>
                            <span className="text-[#135bec] font-medium">Hub & Results</span>
                        </div>
                        {/* Page Header & Key Stats */}
                        <div className="flex flex-col lg:flex-row gap-8 justify-between items-start lg:items-end pb-4 border-b border-slate-200 dark:border-slate-800">
                            <div className="flex flex-col gap-2 max-w-2xl">
                                <h1 className="text-3xl md:text-4xl font-black text-[#111318] dark:text-white tracking-tight">Dimensional Assessment Hub</h1>
                                <p className="text-[#616f89] dark:text-slate-400 text-base md:text-lg">Track your growth across 9 developmental dimensions. Complete assessments to unlock AI-driven insights.</p>
                            </div>
                            <div className="flex gap-4 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
                                <div className="flex flex-col gap-1 rounded-xl bg-white dark:bg-[#1a2332] p-4 border border-slate-200 dark:border-slate-700 min-w-[140px] shadow-sm">
                                    <div className="flex items-center gap-2 text-[#616f89] text-xs uppercase font-bold tracking-wider">
                                        <span className="material-symbols-outlined text-lg">donut_large</span> Completion
                                    </div>
                                    <p className="text-2xl font-bold text-[#111318] dark:text-white">78%</p>
                                </div>
                                <div className="flex flex-col gap-1 rounded-xl bg-white dark:bg-[#1a2332] p-4 border border-slate-200 dark:border-slate-700 min-w-[140px] shadow-sm">
                                    <div className="flex items-center gap-2 text-[#616f89] text-xs uppercase font-bold tracking-wider">
                                        <span className="material-symbols-outlined text-lg">analytics</span> Avg. Score
                                    </div>
                                    <p className="text-2xl font-bold text-[#135bec]">82<span className="text-sm text-[#616f89] font-medium">/100</span></p>
                                </div>
                                <div className="flex flex-col gap-1 rounded-xl bg-white dark:bg-[#1a2332] p-4 border border-slate-200 dark:border-slate-700 min-w-[140px] shadow-sm">
                                    <div className="flex items-center gap-2 text-[#616f89] text-xs uppercase font-bold tracking-wider">
                                        <span className="material-symbols-outlined text-lg">schedule</span> Pending
                                    </div>
                                    <p className="text-2xl font-bold text-orange-600">2</p>
                                </div>
                            </div>
                        </div>
                        {/* Content Grid: Hub (Left/Top) & Results (Right/Bottom) */}
                        <div className="flex flex-col gap-10">
                            {/* Section 1: Assessment Hub Grid */}
                            <section className="flex flex-col gap-4">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-[#111318] dark:text-white flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[#135bec]">grid_view</span>
                                        Dimensions Grid
                                    </h2>
                                    <div className="flex gap-2">
                                        <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[#616f89] bg-white dark:bg-[#1a2332] border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-700">
                                            <span className="material-symbols-outlined text-sm">filter_list</span> Filter
                                        </button>
                                        <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[#616f89] bg-white dark:bg-[#1a2332] border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-700">
                                            <span className="material-symbols-outlined text-sm">sort</span> Sort
                                        </button>
                                    </div>
                                </div>
                                {/* 3x3 Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {/* Card 1: Excellent */}
                                    <div className="group bg-white dark:bg-[#1a2332] rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <span className="inline-flex items-center rounded-full bg-green-50 dark:bg-green-900/20 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-400 ring-1 ring-inset ring-green-600/20">Completed</span>
                                                <h3 className="mt-2 text-lg font-bold text-[#111318] dark:text-white">Critical Thinking</h3>
                                                <p className="text-xs text-[#616f89] mt-1">Last taken: Oct 24, 2023</p>
                                            </div>
                                            <div className="relative size-14">
                                                <svg className="size-full -rotate-90" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                                                    <path className="text-slate-100 dark:text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                                                    <path className="text-green-500" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="92, 100" strokeWidth="3"></path>
                                                </svg>
                                                <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-[#111318] dark:text-white">92</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                            <button className="flex-1 text-xs font-semibold text-[#616f89] hover:text-[#135bec] transition-colors py-1">View Details</button>
                                            <div className="w-px bg-slate-200 dark:bg-slate-700 h-4 self-center"></div>
                                            <button className="flex-1 text-xs font-semibold text-[#616f89] hover:text-[#135bec] transition-colors py-1">View History</button>
                                        </div>
                                    </div>
                                    {/* Card 2: Good */}
                                    <div className="group bg-white dark:bg-[#1a2332] rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-[#135bec]"></div>
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/20 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-700/10">Completed</span>
                                                <h3 className="mt-2 text-lg font-bold text-[#111318] dark:text-white">Communication</h3>
                                                <p className="text-xs text-[#616f89] mt-1">Last taken: Oct 20, 2023</p>
                                            </div>
                                            <div className="relative size-14">
                                                <svg className="size-full -rotate-90" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                                                    <path className="text-slate-100 dark:text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                                                    <path className="text-[#135bec]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="78, 100" strokeWidth="3"></path>
                                                </svg>
                                                <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-[#111318] dark:text-white">78</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                            <button className="flex-1 text-xs font-semibold text-[#616f89] hover:text-[#135bec] transition-colors py-1">View Details</button>
                                            <div className="w-px bg-slate-200 dark:bg-slate-700 h-4 self-center"></div>
                                            <button className="flex-1 text-xs font-semibold text-[#616f89] hover:text-[#135bec] transition-colors py-1">Retake</button>
                                        </div>
                                    </div>
                                    {/* Card 3: Pending */}
                                    <div className="group bg-white dark:bg-[#1a2332] rounded-xl border border-dashed border-orange-300 dark:border-orange-700 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden bg-orange-50/30 dark:bg-orange-900/10">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <span className="inline-flex items-center rounded-full bg-orange-50 dark:bg-orange-900/20 px-2 py-1 text-xs font-medium text-orange-700 dark:text-orange-400 ring-1 ring-inset ring-orange-600/20">Action Required</span>
                                                <h3 className="mt-2 text-lg font-bold text-[#111318] dark:text-white">Leadership</h3>
                                                <p className="text-xs text-orange-700 dark:text-orange-400 font-medium mt-1">Due in 2 days</p>
                                            </div>
                                            <div className="relative size-14 opacity-50">
                                                <svg className="size-full -rotate-90" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                                                    <path className="text-slate-200 dark:text-slate-600" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                                                </svg>
                                                <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-[#616f89]">--</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-4 pt-4 border-t border-orange-200/50 dark:border-orange-800/50">
                                            <button className="w-full text-xs font-bold text-white bg-[#135bec] hover:bg-primary-dark rounded py-2 transition-colors">Start Assessment</button>
                                        </div>
                                    </div>
                                    {/* Card 4: Average */}
                                    <div className="group bg-white dark:bg-[#1a2332] rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400"></div>
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <span className="inline-flex items-center rounded-full bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 text-xs font-medium text-yellow-700 dark:text-yellow-400 ring-1 ring-inset ring-yellow-600/20">In Progress</span>
                                                <h3 className="mt-2 text-lg font-bold text-[#111318] dark:text-white">Digital Literacy</h3>
                                                <p className="text-xs text-[#616f89] mt-1">Saved: 2 hours ago</p>
                                            </div>
                                            <div className="relative size-14">
                                                <svg className="size-full -rotate-90" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                                                    <path className="text-slate-100 dark:text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                                                    <path className="text-yellow-400" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="45, 100" strokeWidth="3"></path>
                                                </svg>
                                                <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-[#111318] dark:text-white">45%</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                            <button className="w-full text-xs font-bold text-[#135bec] hover:text-primary-dark rounded py-2 transition-colors border border-[#135bec]/20 hover:border-[#135bec]/50">Resume</button>
                                        </div>
                                    </div>
                                    {/* Card 5: Low Score */}
                                    <div className="group bg-white dark:bg-[#1a2332] rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <span className="inline-flex items-center rounded-full bg-red-50 dark:bg-red-900/20 px-2 py-1 text-xs font-medium text-red-700 dark:text-red-400 ring-1 ring-inset ring-red-600/20">Needs Attention</span>
                                                <h3 className="mt-2 text-lg font-bold text-[#111318] dark:text-white">Emotional IQ</h3>
                                                <p className="text-xs text-[#616f89] mt-1">Last taken: Oct 15, 2023</p>
                                            </div>
                                            <div className="relative size-14">
                                                <svg className="size-full -rotate-90" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                                                    <path className="text-slate-100 dark:text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                                                    <path className="text-red-500" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="54, 100" strokeWidth="3"></path>
                                                </svg>
                                                <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-[#111318] dark:text-white">54</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                            <button className="flex-1 text-xs font-semibold text-[#616f89] hover:text-[#135bec] transition-colors py-1">View Details</button>
                                            <div className="w-px bg-slate-200 dark:bg-slate-700 h-4 self-center"></div>
                                            <button className="flex-1 text-xs font-semibold text-[#616f89] hover:text-[#135bec] transition-colors py-1">Improve</button>
                                        </div>
                                    </div>
                                    {/* Card 6: Placeholder for grid */}
                                    <div className="group bg-white dark:bg-[#1a2332] rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex items-center justify-center min-h-[160px]">
                                        <div className="text-center">
                                            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
                                                <span className="material-symbols-outlined">add</span>
                                            </div>
                                            <h3 className="mt-2 text-sm font-semibold text-[#111318] dark:text-white">Explore More</h3>
                                            <p className="text-xs text-[#616f89]">4 more dimensions available</p>
                                            <button className="mt-3 text-xs font-bold text-[#135bec] hover:underline">View All</button>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            {/* Section 2: Detailed Results Dashboard */}
                            <section className="flex flex-col gap-5">
                                <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
                                    <h2 className="text-xl font-bold text-[#111318] dark:text-white flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[#135bec]">analytics</span>
                                        Performance Analysis
                                    </h2>
                                    <button className="text-sm font-medium text-[#135bec] hover:text-[#0e46b5]">Download Report</button>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                    {/* Breakdown Column (Left) */}
                                    <div className="lg:col-span-7 flex flex-col gap-6">
                                        <div className="bg-white dark:bg-[#1a2332] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                                            <h3 className="text-base font-bold text-[#111318] dark:text-white mb-4">Dimensional Breakdown</h3>
                                            <div className="flex flex-col gap-4">
                                                {/* Row 1 */}
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="font-medium text-[#111318] dark:text-white">Critical Thinking</span>
                                                        <span className="font-bold text-green-600">92/100</span>
                                                    </div>
                                                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5">
                                                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "92%" }}></div>
                                                    </div>
                                                </div>
                                                {/* Row 2 */}
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="font-medium text-[#111318] dark:text-white">Problem Solving</span>
                                                        <span className="font-bold text-[#135bec]">85/100</span>
                                                    </div>
                                                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5">
                                                        <div className="bg-[#135bec] h-2.5 rounded-full" style={{ width: "85%" }}></div>
                                                    </div>
                                                </div>
                                                {/* Row 3 */}
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="font-medium text-[#111318] dark:text-white">Communication</span>
                                                        <span className="font-bold text-[#135bec]">78/100</span>
                                                    </div>
                                                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5">
                                                        <div className="bg-[#135bec] h-2.5 rounded-full" style={{ width: "78%" }}></div>
                                                    </div>
                                                </div>
                                                {/* Row 4 */}
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="font-medium text-[#111318] dark:text-white">Emotional Intelligence</span>
                                                        <span className="font-bold text-red-500">54/100</span>
                                                    </div>
                                                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5">
                                                        <div className="bg-red-500 h-2.5 rounded-full" style={{ width: "54%" }}></div>
                                                    </div>
                                                </div>
                                                {/* Row 5 */}
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="font-medium text-[#111318] dark:text-white">Adaptability</span>
                                                        <span className="font-bold text-yellow-500">68/100</span>
                                                    </div>
                                                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5">
                                                        <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: "68%" }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Insight & Peer Column (Right) */}
                                    <div className="lg:col-span-5 flex flex-col gap-6">
                                        {/* AI Insight Card */}
                                        <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/30 dark:to-[#1a2332] rounded-xl border border-indigo-100 dark:border-indigo-900 shadow-sm p-6 relative overflow-hidden">
                                            <div className="absolute -top-6 -right-6 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl"></div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
                                                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                                                </div>
                                                <h3 className="text-base font-bold text-indigo-900 dark:text-indigo-100">AI Actionable Insights</h3>
                                            </div>
                                            <div className="prose prose-sm text-[#111318] dark:text-slate-300">
                                                <p className="mb-3">
                                                    Your strong <span className="font-bold text-green-600 dark:text-green-400">Critical Thinking</span> score places you in the top 10%. However, <span className="font-bold text-red-600 dark:text-red-400">Emotional Intelligence</span> is a priority area.
                                                </p>
                                                <div className="bg-white/60 dark:bg-slate-800/60 rounded-lg p-3 border border-indigo-100 dark:border-indigo-900/30">
                                                    <p className="text-xs font-bold uppercase tracking-wider text-[#616f89] mb-1">Recommended Action</p>
                                                    <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Enroll in "Empathy & Leadership Workshop" starting Nov 12th.</p>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Peer Comparison */}
                                        <div className="bg-white dark:bg-[#1a2332] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                                            <h3 className="text-base font-bold text-[#111318] dark:text-white mb-4">Peer Comparison (Percentile)</h3>
                                            <div className="flex items-end justify-between h-32 px-4 gap-4">
                                                {/* User Bar */}
                                                <div className="flex flex-col items-center gap-2 w-1/2 h-full justify-end group">
                                                    <span className="text-lg font-bold text-[#135bec]">Top 15%</span>
                                                    <div className="w-full bg-[#135bec] rounded-t-lg relative h-[85%] hover:opacity-90 transition-opacity">
                                                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                    </div>
                                                    <span className="text-xs font-medium text-[#616f89]">You</span>
                                                </div>
                                                {/* Average Bar */}
                                                <div className="flex flex-col items-center gap-2 w-1/2 h-full justify-end">
                                                    <span className="text-sm font-semibold text-[#616f89]">Average</span>
                                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-t-lg h-[50%]"></div>
                                                    <span className="text-xs font-medium text-[#616f89]">Cohort</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </main>
                <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a2332] py-8 px-10 text-center">
                    <p className="text-sm text-[#616f89]">© 2023 PPSDM KMM Assessment Ecosystem. All rights reserved.</p>
                </footer>
            </div>
            <style jsx global>{`
                .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
                .material-symbols-filled { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
            `}</style>
        </div>
    );
}
