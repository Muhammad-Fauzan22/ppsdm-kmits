"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function AnalyticsPage() {
    const [dateRange, setDateRange] = useState("Last 30 Days");

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen flex flex-col overflow-x-hidden font-display">
            {/* Top Navigation */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-border-dark bg-white dark:bg-[#111318] px-6 lg:px-10 py-3 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <div className="size-8 flex items-center justify-center bg-primary rounded-lg text-white">
                        <span className="material-symbols-outlined text-xl">analytics</span>
                    </div>
                    <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">PPSDM KMM Analytics</h2>
                </div>
                <div className="flex flex-1 justify-end gap-8 items-center">
                    <div className="hidden md:flex items-center gap-9">
                        <Link legacyBehavior href="/admin/dashboard"><a className="text-slate-600 dark:text-white text-sm font-medium leading-normal hover:text-primary transition-colors">Dashboard</a></Link>
                        <Link legacyBehavior href="/admin/reports"><a className="text-slate-500 dark:text-[#9da6b9] text-sm font-medium leading-normal hover:text-primary transition-colors">Reports</a></Link>
                        <Link legacyBehavior href="/admin/settings"><a className="text-slate-500 dark:text-[#9da6b9] text-sm font-medium leading-normal hover:text-primary transition-colors">Settings</a></Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="text-slate-500 dark:text-[#9da6b9] hover:text-white">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        <div className="relative size-9 ring-2 ring-primary/20 rounded-full overflow-hidden">
                            <Image
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwOG01rGZ8dWHJCxFu4b3WFtbxkNOnWbGHWHOattOoqx1zuyvYKsWUSUZI9r_PlTIghZeNLomj_c3IbFFjj1oDJdZcz_oHZItTgXeLTpydo22GzSHU-hAEa-PfT3vIEOb79kEAo0jH3187Kh6-ExqnA7ne0j5MckLw4n19nzn7SIGietx1dLYV0f8pG-bFPPhwUQv2bEDFHjSdnIfchr5Bgg4LsALtOhA5X--U7xjB0dKJ5iqNfitfj38z_FAKlMEiGbnSL01tF5k"
                                alt="User profile"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 w-full max-w-[1440px] mx-auto p-4 lg:p-8 gap-6 flex-col lg:flex-row">
                {/* Main Content Area */}
                <main className="flex-1 flex flex-col min-w-0">
                    {/* Breadcrumbs */}
                    <div className="flex flex-wrap gap-2 pb-2">
                        <Link legacyBehavior href="/admin"><a className="text-slate-500 dark:text-[#9da6b9] text-sm font-medium leading-normal hover:text-primary">Admin</a></Link>
                        <span className="text-slate-500 dark:text-[#9da6b9] text-sm font-medium leading-normal">/</span>
                        <span className="text-slate-900 dark:text-white text-sm font-medium leading-normal">Analytics</span>
                    </div>

                    {/* Page Header + Date Picker */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 py-4 mb-2">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">Deep Analytics</h1>
                            <p className="text-slate-500 dark:text-[#9da6b9] text-base font-normal">System-wide developmental insights & trends</p>
                        </div>
                        <div className="flex flex-col min-w-48">
                            <label className="sr-only" htmlFor="date-range">Date Range</label>
                            <div className="relative">
                                <select
                                    className="w-full appearance-none rounded-lg bg-white dark:bg-card-dark border border-slate-200 dark:border-[#3b4354] text-slate-900 dark:text-white py-2.5 pl-4 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    id="date-range"
                                    value={dateRange}
                                    onChange={(e) => setDateRange(e.target.value)}
                                >
                                    <option>Last 30 Days</option>
                                    <option>This Semester</option>
                                    <option>Academic Year 2023/2024</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500 dark:text-[#9da6b9]">
                                    <span className="material-symbols-outlined text-lg">calendar_today</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filter Chips */}
                    <div className="flex gap-3 pb-6 flex-wrap">
                        <button className="group flex h-9 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark px-4 hover:border-primary/50 transition-all">
                            <p className="text-slate-700 dark:text-white text-sm font-medium">Faculty: <span className="text-primary font-bold">All</span></p>
                            <span className="material-symbols-outlined text-slate-400 dark:text-[#9da6b9] group-hover:text-primary text-lg">keyboard_arrow_down</span>
                        </button>
                        <button className="group flex h-9 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark px-4 hover:border-primary/50 transition-all">
                            <p className="text-slate-700 dark:text-white text-sm font-medium">Year: <span className="text-primary font-bold">2023/2024</span></p>
                            <span className="material-symbols-outlined text-slate-400 dark:text-[#9da6b9] group-hover:text-primary text-lg">keyboard_arrow_down</span>
                        </button>
                        <button className="group flex h-9 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark px-4 hover:border-primary/50 transition-all">
                            <p className="text-slate-700 dark:text-white text-sm font-medium">Granularity: <span className="text-primary font-bold">Weekly</span></p>
                            <span className="material-symbols-outlined text-slate-400 dark:text-[#9da6b9] group-hover:text-primary text-lg">keyboard_arrow_down</span>
                        </button>
                        <button className="ml-auto flex size-9 items-center justify-center rounded-lg bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark text-slate-500 dark:text-[#9da6b9] hover:text-primary hover:border-primary/50 transition-all">
                            <span className="material-symbols-outlined">filter_list</span>
                        </button>
                    </div>

                    {/* Dimensional Growth Grid (Small Multiples) */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-slate-900 dark:text-white text-lg font-bold">Dimensional Growth</h3>
                            <Link legacyBehavior href="/admin/reports/dimensions">
                                <a className="text-primary text-sm font-medium hover:underline flex items-center gap-1">View Full Report <span className="material-symbols-outlined text-sm">arrow_forward</span></a>
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {/* Chart Card 1 */}
                            <div className="bg-white dark:bg-card-dark rounded-xl p-5 border border-slate-200 dark:border-border-dark shadow-sm flex flex-col justify-between h-40 relative overflow-hidden group hover:border-primary/50 transition-all">
                                <div className="flex justify-between items-start z-10">
                                    <div>
                                        <p className="text-slate-500 dark:text-[#9da6b9] text-xs font-semibold uppercase tracking-wider">Social Resilience</p>
                                        <div className="flex items-baseline gap-2 mt-1">
                                            <h4 className="text-2xl font-bold text-slate-900 dark:text-white">84.2</h4>
                                            <span className="text-red-500 text-xs font-medium flex items-center bg-red-500/10 px-1.5 py-0.5 rounded">-1.2%</span>
                                        </div>
                                    </div>
                                </div>
                                {/* SVG Line Chart */}
                                <div className="absolute bottom-0 left-0 right-0 h-20 w-full opacity-50 dark:opacity-70 group-hover:opacity-100 transition-opacity">
                                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                                        <path d="M0,35 Q10,32 20,25 T40,20 T60,28 T80,15 T100,20" fill="none" stroke="#ef4444" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
                                        <path d="M0,35 Q10,32 20,25 T40,20 T60,28 T80,15 T100,20 V40 H0 Z" fill="url(#gradient-red)" opacity="0.2"></path>
                                        <defs>
                                            <linearGradient id="gradient-red" x1="0" x2="0" y1="0" y2="1">
                                                <stop offset="0%" stopColor="#ef4444"></stop>
                                                <stop offset="100%" stopColor="#ef4444" stopOpacity="0"></stop>
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                            </div>

                            {/* Chart Card 2 */}
                            <div className="bg-white dark:bg-card-dark rounded-xl p-5 border border-slate-200 dark:border-border-dark shadow-sm flex flex-col justify-between h-40 relative overflow-hidden group hover:border-primary/50 transition-all">
                                <div className="flex justify-between items-start z-10">
                                    <div>
                                        <p className="text-slate-500 dark:text-[#9da6b9] text-xs font-semibold uppercase tracking-wider">Cognitive Agility</p>
                                        <div className="flex items-baseline gap-2 mt-1">
                                            <h4 className="text-2xl font-bold text-slate-900 dark:text-white">91.5</h4>
                                            <span className="text-emerald-500 text-xs font-medium flex items-center bg-emerald-500/10 px-1.5 py-0.5 rounded">+4.3%</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-20 w-full opacity-50 dark:opacity-70 group-hover:opacity-100 transition-opacity">
                                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                                        <path d="M0,30 Q25,35 50,15 T100,5" fill="none" stroke="#10b981" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
                                        <path d="M0,30 Q25,35 50,15 T100,5 V40 H0 Z" fill="url(#gradient-green)" opacity="0.2"></path>
                                        <defs>
                                            <linearGradient id="gradient-green" x1="0" x2="0" y1="0" y2="1">
                                                <stop offset="0%" stopColor="#10b981"></stop>
                                                <stop offset="100%" stopColor="#10b981" stopOpacity="0"></stop>
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                            </div>

                            {/* Chart Card 3 */}
                            <div className="bg-white dark:bg-card-dark rounded-xl p-5 border border-slate-200 dark:border-border-dark shadow-sm flex flex-col justify-between h-40 relative overflow-hidden group hover:border-primary/50 transition-all">
                                <div className="flex justify-between items-start z-10">
                                    <div>
                                        <p className="text-slate-500 dark:text-[#9da6b9] text-xs font-semibold uppercase tracking-wider">Emotional Intelligence</p>
                                        <div className="flex items-baseline gap-2 mt-1">
                                            <h4 className="text-2xl font-bold text-slate-900 dark:text-white">76.8</h4>
                                            <span className="text-primary text-xs font-medium flex items-center bg-primary/10 px-1.5 py-0.5 rounded">+0.8%</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-20 w-full opacity-50 dark:opacity-70 group-hover:opacity-100 transition-opacity">
                                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                                        <path d="M0,25 Q15,25 30,20 T60,22 T100,10" fill="none" stroke="#135bec" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
                                        <path d="M0,25 Q15,25 30,20 T60,22 T100,10 V40 H0 Z" fill="url(#gradient-primary)" opacity="0.2"></path>
                                        <defs>
                                            <linearGradient id="gradient-primary" x1="0" x2="0" y1="0" y2="1">
                                                <stop offset="0%" stopColor="#135bec"></stop>
                                                <stop offset="100%" stopColor="#135bec" stopOpacity="0"></stop>
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                            </div>

                            {/* Chart Card 4 */}
                            <div className="bg-white dark:bg-card-dark rounded-xl p-5 border border-slate-200 dark:border-border-dark shadow-sm flex flex-col justify-between h-40 relative overflow-hidden group hover:border-primary/50 transition-all">
                                <div className="flex justify-between items-start z-10">
                                    <div>
                                        <p className="text-slate-500 dark:text-[#9da6b9] text-xs font-semibold uppercase tracking-wider">Academic Integrity</p>
                                        <div className="flex items-baseline gap-2 mt-1">
                                            <h4 className="text-2xl font-bold text-slate-900 dark:text-white">98.1</h4>
                                            <span className="text-emerald-500 text-xs font-medium flex items-center bg-emerald-500/10 px-1.5 py-0.5 rounded">+0.2%</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-20 w-full opacity-50 dark:opacity-70 group-hover:opacity-100 transition-opacity">
                                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                                        <path d="M0,15 L20,15 L40,12 L60,12 L80,10 L100,8" fill="none" stroke="#10b981" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
                                        <path d="M0,15 L20,15 L40,12 L60,12 L80,10 L100,8 V40 H0 Z" fill="url(#gradient-green)" opacity="0.2"></path>
                                    </svg>
                                </div>
                            </div>

                            {/* Chart Card 5 */}
                            <div className="bg-white dark:bg-card-dark rounded-xl p-5 border border-slate-200 dark:border-border-dark shadow-sm flex flex-col justify-between h-40 relative overflow-hidden group hover:border-primary/50 transition-all">
                                <div className="flex justify-between items-start z-10">
                                    <div>
                                        <p className="text-slate-500 dark:text-[#9da6b9] text-xs font-semibold uppercase tracking-wider">Leadership Potential</p>
                                        <div className="flex items-baseline gap-2 mt-1">
                                            <h4 className="text-2xl font-bold text-slate-900 dark:text-white">65.4</h4>
                                            <span className="text-emerald-500 text-xs font-medium flex items-center bg-emerald-500/10 px-1.5 py-0.5 rounded">+12.4%</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-20 w-full opacity-50 dark:opacity-70 group-hover:opacity-100 transition-opacity">
                                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                                        <path d="M0,38 Q25,35 40,20 T70,25 T100,5" fill="none" stroke="#10b981" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
                                        <path d="M0,38 Q25,35 40,20 T70,25 T100,5 V40 H0 Z" fill="url(#gradient-green)" opacity="0.2"></path>
                                    </svg>
                                </div>
                            </div>

                            {/* Chart Card 6 */}
                            <div className="bg-white dark:bg-card-dark rounded-xl p-5 border border-slate-200 dark:border-border-dark shadow-sm flex flex-col justify-between h-40 relative overflow-hidden group hover:border-primary/50 transition-all">
                                <div className="flex justify-between items-start z-10">
                                    <div>
                                        <p className="text-slate-500 dark:text-[#9da6b9] text-xs font-semibold uppercase tracking-wider">Ethical Reasoning</p>
                                        <div className="flex items-baseline gap-2 mt-1">
                                            <h4 className="text-2xl font-bold text-slate-900 dark:text-white">88.9</h4>
                                            <span className="text-slate-500 dark:text-[#9da6b9] text-xs font-medium flex items-center bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">0.0%</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-20 w-full opacity-50 dark:opacity-70 group-hover:opacity-100 transition-opacity">
                                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                                        <path d="M0,20 L100,20" fill="none" stroke="#94a3b8" strokeDasharray="4" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
                                    </svg>
                                </div>
                            </div>

                            {/* Chart Card 7 */}
                            <div className="bg-white dark:bg-card-dark rounded-xl p-5 border border-slate-200 dark:border-border-dark shadow-sm flex flex-col justify-between h-40 relative overflow-hidden group hover:border-primary/50 transition-all">
                                <div className="flex justify-between items-start z-10">
                                    <div>
                                        <p className="text-slate-500 dark:text-[#9da6b9] text-xs font-semibold uppercase tracking-wider">Spiritual Wellness</p>
                                        <div className="flex items-baseline gap-2 mt-1">
                                            <h4 className="text-2xl font-bold text-slate-900 dark:text-white">72.1</h4>
                                            <span className="text-primary text-xs font-medium flex items-center bg-primary/10 px-1.5 py-0.5 rounded">+2.1%</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-20 w-full opacity-50 dark:opacity-70 group-hover:opacity-100 transition-opacity">
                                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                                        <path d="M0,30 C20,30 40,25 50,15 S80,10 100,12" fill="none" stroke="#135bec" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
                                        <path d="M0,30 C20,30 40,25 50,15 S80,10 100,12 V40 H0 Z" fill="url(#gradient-primary)" opacity="0.2"></path>
                                    </svg>
                                </div>
                            </div>

                            {/* Chart Card 8 */}
                            <div className="bg-white dark:bg-card-dark rounded-xl p-5 border border-slate-200 dark:border-border-dark shadow-sm flex flex-col justify-between h-40 relative overflow-hidden group hover:border-primary/50 transition-all">
                                <div className="flex justify-between items-start z-10">
                                    <div>
                                        <p className="text-slate-500 dark:text-[#9da6b9] text-xs font-semibold uppercase tracking-wider">Physical Health</p>
                                        <div className="flex items-baseline gap-2 mt-1">
                                            <h4 className="text-2xl font-bold text-slate-900 dark:text-white">60.2</h4>
                                            <span className="text-red-500 text-xs font-medium flex items-center bg-red-500/10 px-1.5 py-0.5 rounded">-5.4%</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-20 w-full opacity-50 dark:opacity-70 group-hover:opacity-100 transition-opacity">
                                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                                        <path d="M0,10 C20,10 30,20 50,25 S80,35 100,38" fill="none" stroke="#ef4444" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
                                        <path d="M0,10 C20,10 30,20 50,25 S80,35 100,38 V40 H0 Z" fill="url(#gradient-red)" opacity="0.2"></path>
                                    </svg>
                                </div>
                            </div>

                            {/* Chart Card 9 */}
                            <div className="bg-white dark:bg-card-dark rounded-xl p-5 border border-slate-200 dark:border-border-dark shadow-sm flex flex-col justify-between h-40 relative overflow-hidden group hover:border-primary/50 transition-all">
                                <div className="flex justify-between items-start z-10">
                                    <div>
                                        <p className="text-slate-500 dark:text-[#9da6b9] text-xs font-semibold uppercase tracking-wider">Collaborative Spirit</p>
                                        <div className="flex items-baseline gap-2 mt-1">
                                            <h4 className="text-2xl font-bold text-slate-900 dark:text-white">81.0</h4>
                                            <span className="text-emerald-500 text-xs font-medium flex items-center bg-emerald-500/10 px-1.5 py-0.5 rounded">+1.5%</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-20 w-full opacity-50 dark:opacity-70 group-hover:opacity-100 transition-opacity">
                                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                                        <path d="M0,28 Q20,25 40,25 T60,20 T100,15" fill="none" stroke="#10b981" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
                                        <path d="M0,28 Q20,25 40,25 T60,20 T100,15 V40 H0 Z" fill="url(#gradient-green)" opacity="0.2"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Usage by Hour Chart */}
                    <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-border-dark p-6 shadow-sm flex flex-col flex-1 min-h-[300px]">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-slate-900 dark:text-white text-lg font-bold">System Usage by Hour</h3>
                                <p className="text-slate-500 dark:text-[#9da6b9] text-sm">Average active users per hour (Last 7 Days)</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="size-3 bg-primary rounded-full"></span>
                                <span className="text-xs text-slate-500 dark:text-[#9da6b9]">Active Users</span>
                            </div>
                        </div>
                        {/* CSS Bar Chart */}
                        <div className="flex-1 flex items-end gap-1 md:gap-2 lg:gap-3 h-48 w-full mt-4 pb-2 border-b border-slate-200 dark:border-[#3b4354]">
                            {/* Loop for 24 hours */}
                            {[45, 10, 5, 3, 2, 5, 12, 25, 45, 60, 75, 85, 70, 95, 80, 85, 65, 55, 40, 35, 45, 50, 30, 20].map((height, index) => (
                                <div key={index} className="flex flex-col justify-end items-center flex-1 h-full group relative cursor-pointer">
                                    <div
                                        className="w-full bg-primary/20 dark:bg-primary/30 rounded-t-sm hover:bg-primary transition-all relative group-hover:shadow-[0_0_10px_rgba(19,91,236,0.5)]"
                                        style={{ height: `${height}%` }}
                                    ></div>
                                    {height > 90 && (
                                        <div className="absolute -top-10 bg-slate-900 text-white text-xs px-2 py-1 rounded">1.2k</div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between w-full text-xs text-slate-400 dark:text-[#9da6b9] mt-2 font-mono">
                            <span>00:00</span>
                            <span>06:00</span>
                            <span>12:00</span>
                            <span>18:00</span>
                            <span>23:59</span>
                        </div>
                    </div>
                </main>

                {/* Right Sidebar (AI Insights) */}
                <aside className="w-full lg:w-80 xl:w-96 flex flex-col gap-4">
                    <div className="bg-[#eef2ff] dark:bg-[#151b28] rounded-xl p-5 border border-primary/20 dark:border-primary/10">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined text-primary text-2xl">auto_awesome</span>
                            <h3 className="text-slate-900 dark:text-white text-lg font-bold">AI Insights</h3>
                        </div>
                        <div className="flex flex-col gap-3">
                            {/* Insight Card 1: Critical */}
                            <div className="bg-white dark:bg-card-dark p-4 rounded-lg border border-red-200 dark:border-red-900/30 shadow-sm relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                                <div className="flex gap-3">
                                    <div className="mt-0.5 text-red-500">
                                        <span className="material-symbols-outlined">trending_down</span>
                                    </div>
                                    <div>
                                        <h4 className="text-slate-900 dark:text-white font-bold text-sm mb-1">Social Score Drop</h4>
                                        <p className="text-slate-600 dark:text-[#9da6b9] text-sm leading-relaxed">Social dimension scores dropped <span className="text-red-500 font-bold">5%</span> this month, specifically within the Engineering faculty.</p>
                                        <button className="text-xs font-bold text-red-500 mt-2 inline-block hover:underline">Investigate Causes</button>
                                    </div>
                                </div>
                            </div>
                            {/* Insight Card 2: Positive */}
                            <div className="bg-white dark:bg-card-dark p-4 rounded-lg border border-emerald-200 dark:border-emerald-900/30 shadow-sm relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
                                <div className="flex gap-3">
                                    <div className="mt-0.5 text-emerald-500">
                                        <span className="material-symbols-outlined">trending_up</span>
                                    </div>
                                    <div>
                                        <h4 className="text-slate-900 dark:text-white font-bold text-sm mb-1">Leadership Growth</h4>
                                        <p className="text-slate-600 dark:text-[#9da6b9] text-sm leading-relaxed">Leadership potential metrics are at an all-time high of <span className="text-emerald-500 font-bold">85%</span> for Year 3 students.</p>
                                    </div>
                                </div>
                            </div>
                            {/* Insight Card 3: Info/Usage */}
                            <div className="bg-white dark:bg-card-dark p-4 rounded-lg border border-primary/20 dark:border-primary/20 shadow-sm relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                                <div className="flex gap-3">
                                    <div className="mt-0.5 text-primary">
                                        <span className="material-symbols-outlined">schedule</span>
                                    </div>
                                    <div>
                                        <h4 className="text-slate-900 dark:text-white font-bold text-sm mb-1">Peak Usage Detected</h4>
                                        <p className="text-slate-600 dark:text-[#9da6b9] text-sm leading-relaxed">System load peaked at <span className="font-bold text-slate-800 dark:text-white">14:00 PM</span> on Tuesday. Consider scheduling maintenance off-hours.</p>
                                    </div>
                                </div>
                            </div>
                            {/* Insight Card 4: Recommendation */}
                            <div className="bg-white dark:bg-card-dark p-4 rounded-lg border border-amber-200 dark:border-amber-900/30 shadow-sm relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400"></div>
                                <div className="flex gap-3">
                                    <div className="mt-0.5 text-amber-500">
                                        <span className="material-symbols-outlined">lightbulb</span>
                                    </div>
                                    <div>
                                        <h4 className="text-slate-900 dark:text-white font-bold text-sm mb-1">Recommendation</h4>
                                        <p className="text-slate-600 dark:text-[#9da6b9] text-sm leading-relaxed">Consider launching a "Physical Wellness" survey to address the declining health metric.</p>
                                        <button className="mt-3 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-white px-3 py-1.5 rounded font-medium transition-colors">Draft Survey</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mini Calendar / Quick Actions */}
                    <div className="bg-white dark:bg-card-dark rounded-xl p-5 border border-slate-200 dark:border-border-dark shadow-sm">
                        <h3 className="text-slate-900 dark:text-white text-sm font-bold uppercase tracking-wider mb-3">Quick Export</h3>
                        <div className="flex flex-col gap-2">
                            <button className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-[#2e3545] hover:bg-slate-50 dark:hover:bg-[#252a36] group transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-2 rounded-lg">
                                        <span className="material-symbols-outlined text-lg">description</span>
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">Monthly Report</p>
                                        <p className="text-xs text-slate-500 dark:text-[#9da6b9]">PDF, 2.4MB</p>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">download</span>
                            </button>
                            <button className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-[#2e3545] hover:bg-slate-50 dark:hover:bg-[#252a36] group transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-2 rounded-lg">
                                        <span className="material-symbols-outlined text-lg">table_chart</span>
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">Raw Data</p>
                                        <p className="text-xs text-slate-500 dark:text-[#9da6b9]">CSV, 14MB</p>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">download</span>
                            </button>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
