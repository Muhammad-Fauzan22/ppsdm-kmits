"use client";

import Link from "next/link";

export default function SupervisorAnalytics() {
    return (
        <div className="bg-[#f6f6f8] dark:bg-[#101622] text-slate-900 dark:text-white font-[family-name:var(--font-lexend)] overflow-x-hidden antialiased min-h-screen flex flex-col">
            {/* Top Navigation */}
            <header className="sticky top-0 z-50 w-full border-b border-[#e2e8f0] dark:border-[#334155] bg-white/95 dark:bg-[#1e293b]/95 backdrop-blur">
                <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-[#135bec]">
                            <span className="material-symbols-outlined text-[28px]">school</span>
                            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">PPSDM KMM</h2>
                        </div>
                        <div className="hidden h-6 w-px bg-[#e2e8f0] dark:bg-[#334155] md:block"></div>
                        <nav className="hidden md:flex items-center gap-6">
                            <Link className="text-sm font-medium text-slate-500 hover:text-[#135bec] dark:text-slate-400 dark:hover:text-white transition-colors" href="/dashboard">Home</Link>
                            <Link className="text-sm font-medium text-slate-500 hover:text-[#135bec] dark:text-slate-400 dark:hover:text-white transition-colors" href="/supervisor">Supervisor</Link>
                            <Link className="text-sm font-medium text-[#135bec] dark:text-white" href="/supervisor/analytics">Analytics</Link>
                        </nav>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 justify-center py-6">
                <div className="flex w-full max-w-[1400px] flex-col gap-6 px-4 sm:px-6 lg:px-8">
                    {/* Header... */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Cohort Analytics Report</h1>
                            <p className="mt-1 text-base text-slate-500 dark:text-slate-400">Fall Semester 2023 - Cohort Alpha</p>
                        </div>
                        <button className="flex items-center gap-2 rounded-lg bg-[#135bec] px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#135bec]/90 transition-colors">
                            <span className="material-symbols-outlined text-[20px]">print</span>
                            Print Report
                        </button>
                    </div>
                    {/* KPI Cards... */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            { label: "Avg. Cohort GPA", value: "3.42", trend: "+0.2%", color: "bg-[#135bec]", width: "85%", trendCol: "text-green-700 bg-green-100" },
                            { label: "Engagement Score", value: "88%", trend: "+5%", color: "bg-green-500", width: "88%", trendCol: "text-green-700 bg-green-100" },
                            { label: "Pending Reviews", value: "12", trend: "Action needed", color: "bg-orange-500", width: "30%", trendCol: "text-orange-700 bg-orange-100" },
                            { label: "Risk Level", value: "Low", trend: "0% Change", color: "bg-slate-300", width: "0%", trendCol: "text-slate-600 bg-slate-100" },
                        ].map((card, i) => (
                            <div key={i} className="relative overflow-hidden rounded-xl border border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1e293b] p-5 shadow-sm">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.label}</p>
                                        <h3 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{card.value}</h3>
                                    </div>
                                    <span className={`flex items-center rounded-full px-2 py-0.5 text-xs font-medium dark:bg-opacity-10 ${card.trendCol}`}>
                                        {card.trend}
                                    </span>
                                </div>
                                <div className="mt-4 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-700">
                                    <div className={`h-1.5 rounded-full ${card.color}`} style={{ width: card.width }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Charts & Heatmap */}
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Bar Chart... */}
                        <div className="rounded-xl border border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1e293b] p-6 shadow-sm lg:col-span-2">
                            <div className="mb-6"><h3 className="text-lg font-bold text-slate-900 dark:text-white">Performance by Subject</h3></div>
                            <div className="relative h-64 w-full">
                                {/* Grid container */}
                                <div className="absolute inset-0 flex flex-col justify-between text-xs text-slate-400 z-0">
                                    {[100, 75, 50, 25, 0].map(v => (
                                        <div key={v} className="flex w-full items-center"><span className="w-8">{v}</span><div className="ml-2 h-px w-full bg-slate-100 dark:bg-slate-700/50"></div></div>
                                    ))}
                                </div>
                                {/* Bars */}
                                <div className="absolute inset-0 ml-10 flex items-end justify-between px-4 pb-6 z-10">
                                    {[
                                        { topic: "Math", my: 85, dept: 72 },
                                        { topic: "Ethics", my: 92, dept: 88 },
                                        { topic: "Lab", my: 78, dept: 82 },
                                        { topic: "Physics", my: 65, dept: 70 },
                                        { topic: "History", my: 88, dept: 75 }
                                    ].map((sub) => (
                                        <div key={sub.topic} className="group flex h-full w-full flex-col justify-end items-center gap-2 px-1">
                                            <div className="flex h-full items-end gap-1 sm:gap-3">
                                                <div className="relative w-4 sm:w-8 rounded-t-sm bg-[#135bec]" style={{ height: `${sub.my}%` }}></div>
                                                <div className="relative w-4 sm:w-8 rounded-t-sm bg-slate-300 dark:bg-slate-600" style={{ height: `${sub.dept}%` }}></div>
                                            </div>
                                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{sub.topic}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {/* Heatmap */}
                        <div className="rounded-xl border border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1e293b] p-6 shadow-sm">
                            <div className="mb-4"><h3 className="text-lg font-bold text-slate-900 dark:text-white">Engagement Activity</h3></div>
                            <div className="grid grid-flow-col grid-rows-7 gap-1.5 auto-cols-fr overflow-hidden">
                                {Array.from({ length: 84 }).map((_, i) => {
                                    // Randomized opacity simulation
                                    const opacity = [0.2, 0.4, 0.6, 0.8, 1][Math.floor(Math.random() * 5)];
                                    const isGray = Math.random() > 0.7;
                                    return (
                                        <div key={i} className={`h-3 w-3 rounded-[2px] ${isGray ? 'bg-slate-200 dark:bg-slate-700' : 'bg-[#135bec]'}`} style={{ opacity: isGray ? 1 : opacity }}></div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    {/* Mentee Roster Table */}
                    <div className="overflow-hidden rounded-xl border border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1e293b] shadow-sm">
                        <table className="w-full text-left text-sm text-slate-500 dark:text-slate-400">
                            <thead className="bg-slate-50 text-xs uppercase text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                <tr><th className="px-6 py-3">Student Name</th><th className="px-6 py-3">GPA</th><th className="px-6 py-3">Status</th></tr>
                            </thead>
                            <tbody className="divide-y divide-[#e2e8f0] dark:divide-[#334155]">
                                {[
                                    { name: "Alexander Smith", id: "2023-CS-001", gpa: 3.8, status: "On Track", color: "green" },
                                    { name: "Maria Garcia", id: "2023-IS-042", gpa: 3.2, status: "On Track", color: "green" },
                                    { name: "James Wilson", id: "2023-SE-089", gpa: 2.4, status: "Review Needed", color: "orange" },
                                    { name: "Chen Wei", id: "2023-DS-104", gpa: 3.9, status: "On Track", color: "green" },
                                ].map((s, i) => (
                                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{s.name}</td>
                                        <td className="px-6 py-4 font-bold">{s.gpa}</td>
                                        <td className="px-6 py-4"><span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium bg-${s.color}-100 text-${s.color}-800 dark:bg-${s.color}-500/10 dark:text-${s.color}-400`}>{s.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
