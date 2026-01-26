"use client";

import Link from "next/link";

export default function AssessmentHub() {
    return (
        <div className="bg-[#f6f6f8] dark:bg-[#101622] text-[#111318] dark:text-white font-[family-name:var(--font-lexend)] overflow-x-hidden transition-colors duration-200 min-h-screen flex flex-col group/design-root">
            {/* Top Navigation */}
            <header className="border-b border-solid border-[#e5e7eb] dark:border-[#282e39] bg-white dark:bg-[#111318]">
                <div className="flex items-center justify-between whitespace-nowrap px-4 py-3 lg:px-10">
                    <div className="flex items-center gap-4">
                        <div className="size-8 text-[#135bec]">
                            <svg className="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path d="M24 4L6 14V34L24 44L42 34V14L24 4Z" fill="currentColor" stroke="currentColor" strokeLinejoin="round" strokeWidth="4"></path>
                                <path d="M24 14L34 20M24 14L14 20M24 14V26" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4"></path>
                            </svg>
                        </div>
                        <h2 className="text-[#111318] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">PPSDM KMM</h2>
                    </div>
                    <div className="flex flex-1 justify-end gap-8">
                        <div className="hidden md:flex items-center gap-9">
                            <Link className="text-[#111318] dark:text-white text-sm font-medium leading-normal hover:text-[#135bec] transition-colors" href="/dashboard">Home</Link>
                            <Link className="text-[#135bec] text-sm font-bold leading-normal" href="/assessment">Assessment</Link>
                            <Link className="text-[#111318] dark:text-white text-sm font-medium leading-normal hover:text-[#135bec] transition-colors" href="#">Progress</Link>
                            <Link className="text-[#111318] dark:text-white text-sm font-medium leading-normal hover:text-[#135bec] transition-colors" href="#">Profile</Link>
                        </div>
                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-[#135bec]/20" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBYckk_XKSvoUY0OybpiNpRWvN9DYmc4n06wq4ih82ekyJqtP_y_XEd0oRwdo9D1s-dlZpmwe3S9VFcTCnAZiSB-GsY_PyZkpfwDChmhUvmUUbow6F1BRUgwR2KivvbTu8WDoRo909N5AaxxPKaqN4RePAw0sxmKhdiCTemCuwv6iah-wsepOi14kWyLtN50EC1gwF9qcS07UgEdiQmBm7qHvvXNldxaPTHohmA6CbBxBuBmISkoFAHspYCAs80UxUGQUJ86iN2uhk')" }}></div>
                    </div>
                </div>
            </header>

            <div className="layout-container flex h-full grow flex-col">
                <div className="px-4 md:px-12 lg:px-20 xl:px-40 flex flex-1 justify-center py-5">
                    <div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
                        {/* Breadcrumbs */}
                        <div className="flex flex-wrap gap-2 p-4">
                            <Link className="text-[#64748b] dark:text-[#9da6b9] text-sm font-medium leading-normal hover:underline" href="/dashboard">Home</Link>
                            <span className="text-[#64748b] dark:text-[#9da6b9] text-sm font-medium leading-normal">/</span>
                            <span className="text-[#111318] dark:text-white text-sm font-medium leading-normal">Assessment</span>
                        </div>

                        {/* Page Heading & Overall Stats */}
                        <div className="flex flex-col lg:flex-row gap-8 p-4 mb-8">
                            {/* Left: Titles */}
                            <div className="flex flex-col gap-3 flex-1">
                                <h1 className="text-[#111318] dark:text-white text-4xl lg:text-5xl font-black leading-tight tracking-[-0.033em]">
                                    Assessment <span className="text-[#135bec]">Mission Control</span>
                                </h1>
                                <p className="text-[#64748b] dark:text-[#9da6b9] text-lg font-normal leading-normal max-w-xl">
                                    Track your developmental progress across 9 dimensions. Complete missions to level up your profile.
                                </p>
                                <div className="mt-6 flex gap-4">
                                    <div className="px-4 py-2 bg-[#135bec]/10 dark:bg-[#135bec]/20 rounded-lg border border-[#135bec]/20">
                                        <span className="text-[#135bec] font-bold text-sm uppercase tracking-wider">Status: Active</span>
                                    </div>
                                    <div className="px-4 py-2 bg-[#f1f5f9] dark:bg-[#1e293b] rounded-lg border border-transparent dark:border-[#334155]">
                                        <span className="text-[#64748b] dark:text-[#9da6b9] font-medium text-sm">Next Review: 2 Days</span>
                                    </div>
                                </div>
                            </div>
                            {/* Right: Overall Gauge */}
                            <div className="bg-white dark:bg-[#1c1f27] rounded-xl p-6 shadow-sm border border-[#e5e7eb] dark:border-[#282e39] flex flex-col items-center justify-center min-w-[300px]">
                                <div className="relative size-40">
                                    <svg className="size-full" viewBox="0 0 36 36">
                                        {/* Background Circle */}
                                        <path className="text-gray-200 dark:text-[#282e39]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                                        {/* Progress Circle */}
                                        <path className="text-[#135bec]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="40, 100" strokeLinecap="round" strokeWidth="3"></path>
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-4xl font-black text-[#111318] dark:text-white">40%</span>
                                    </div>
                                </div>
                                <p className="text-[#64748b] dark:text-[#9da6b9] text-sm font-medium mt-2">Overall Completion</p>
                            </div>
                        </div>

                        {/* 3x3 Grid of Dimensions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                            {/* Card 1: Spiritual (Completed) */}
                            <Link href="/assessment/run?type=spiritual" className="group relative flex flex-col gap-4 rounded-xl bg-white dark:bg-[#1c1f27] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-[0_0_4px_rgba(0,0,0,0.2)] border border-[#e5e7eb] dark:border-[#282e39] hover:border-[#135bec]/50 hover:dark:border-[#135bec] hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden">
                                <div className="flex items-center justify-between">
                                    <div className="size-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                        <span className="material-symbols-outlined text-3xl">self_improvement</span>
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">check_circle</span>
                                        Complete
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-[#111318] dark:text-white mb-1 group-hover:text-[#135bec] transition-colors">Spiritual</h3>
                                    <p className="text-sm text-[#64748b] dark:text-[#9da6b9]">Inner peace & values alignment.</p>
                                </div>
                                <div className="mt-auto pt-4">
                                    <div className="flex justify-between text-xs font-medium mb-2">
                                        <span className="text-[#64748b] dark:text-[#9da6b9]">Progress</span>
                                        <span className="text-green-600 dark:text-green-400">100%</span>
                                    </div>
                                    <div className="h-2 w-full bg-[#f1f5f9] dark:bg-[#282e39] rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 rounded-full" style={{ width: "100%" }}></div>
                                    </div>
                                </div>
                            </Link>
                            {/* Card 2: Financial (In Progress) */}
                            <div className="group relative flex flex-col gap-4 rounded-xl bg-white dark:bg-[#1c1f27] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-[0_0_4px_rgba(0,0,0,0.2)] border border-[#e5e7eb] dark:border-[#282e39] hover:border-[#135bec]/50 hover:dark:border-[#135bec] hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden">
                                <div className="flex items-center justify-between">
                                    <div className="size-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                        <span className="material-symbols-outlined text-3xl">monitoring</span>
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-wide">
                                        Active
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-[#111318] dark:text-white mb-1 group-hover:text-[#135bec] transition-colors">Financial</h3>
                                    <p className="text-sm text-[#64748b] dark:text-[#9da6b9]">Budgeting & investment basics.</p>
                                </div>
                                <div className="mt-auto pt-4">
                                    <div className="flex justify-between text-xs font-medium mb-2">
                                        <span className="text-[#64748b] dark:text-[#9da6b9]">Progress</span>
                                        <span className="text-[#135bec]">40%</span>
                                    </div>
                                    <div className="h-2 w-full bg-[#f1f5f9] dark:bg-[#282e39] rounded-full overflow-hidden">
                                        <div className="h-full bg-[#135bec] rounded-full" style={{ width: "40%" }}></div>
                                    </div>
                                </div>
                            </div>
                            {/* Card 3: Social (Low Progress) */}
                            <div className="group relative flex flex-col gap-4 rounded-xl bg-white dark:bg-[#1c1f27] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-[0_0_4px_rgba(0,0,0,0.2)] border border-[#e5e7eb] dark:border-[#282e39] hover:border-[#135bec]/50 hover:dark:border-[#135bec] hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden">
                                <div className="flex items-center justify-between">
                                    <div className="size-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                        <span className="material-symbols-outlined text-3xl">groups</span>
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-wide">
                                        Active
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-[#111318] dark:text-white mb-1 group-hover:text-[#135bec] transition-colors">Social</h3>
                                    <p className="text-sm text-[#64748b] dark:text-[#9da6b9]">Communication & networking.</p>
                                </div>
                                <div className="mt-auto pt-4">
                                    <div className="flex justify-between text-xs font-medium mb-2">
                                        <span className="text-[#64748b] dark:text-[#9da6b9]">Progress</span>
                                        <span className="text-[#135bec]">20%</span>
                                    </div>
                                    <div className="h-2 w-full bg-[#f1f5f9] dark:bg-[#282e39] rounded-full overflow-hidden">
                                        <div className="h-full bg-[#135bec] rounded-full" style={{ width: "20%" }}></div>
                                    </div>
                                </div>
                            </div>
                            {/* Card 4: Intellectual (Not Started) */}
                            <div className="group relative flex flex-col gap-4 rounded-xl bg-white dark:bg-[#1c1f27] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-[0_0_4px_rgba(0,0,0,0.2)] border border-[#e5e7eb] dark:border-[#282e39] hover:border-[#135bec]/50 hover:dark:border-[#135bec] hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden opacity-80 hover:opacity-100">
                                <div className="flex items-center justify-between">
                                    <div className="size-12 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                                        <span className="material-symbols-outlined text-3xl">psychology</span>
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wide">
                                        Not Started
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-[#111318] dark:text-white mb-1 group-hover:text-[#135bec] transition-colors">Intellectual</h3>
                                    <p className="text-sm text-[#64748b] dark:text-[#9da6b9]">Critical thinking & knowledge.</p>
                                </div>
                                <div className="mt-auto pt-4">
                                    <div className="flex justify-between text-xs font-medium mb-2">
                                        <span className="text-[#64748b] dark:text-[#9da6b9]">Progress</span>
                                        <span className="text-[#64748b] dark:text-[#9da6b9]">0%</span>
                                    </div>
                                    <div className="h-2 w-full bg-[#f1f5f9] dark:bg-[#282e39] rounded-full overflow-hidden">
                                        <div className="h-full bg-[#135bec] rounded-full" style={{ width: "0%" }}></div>
                                    </div>
                                </div>
                            </div>
                            {/* Card 5: Physical (In Progress) */}
                            <div className="group relative flex flex-col gap-4 rounded-xl bg-white dark:bg-[#1c1f27] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-[0_0_4px_rgba(0,0,0,0.2)] border border-[#e5e7eb] dark:border-[#282e39] hover:border-[#135bec]/50 hover:dark:border-[#135bec] hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden">
                                <div className="flex items-center justify-between">
                                    <div className="size-12 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                                        <span className="material-symbols-outlined text-3xl">favorite</span>
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-wide">
                                        Active
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-[#111318] dark:text-white mb-1 group-hover:text-[#135bec] transition-colors">Physical</h3>
                                    <p className="text-sm text-[#64748b] dark:text-[#9da6b9]">Health, nutrition & exercise.</p>
                                </div>
                                <div className="mt-auto pt-4">
                                    <div className="flex justify-between text-xs font-medium mb-2">
                                        <span className="text-[#64748b] dark:text-[#9da6b9]">Progress</span>
                                        <span className="text-[#135bec]">65%</span>
                                    </div>
                                    <div className="h-2 w-full bg-[#f1f5f9] dark:bg-[#282e39] rounded-full overflow-hidden">
                                        <div className="h-full bg-[#135bec] rounded-full" style={{ width: "65%" }}></div>
                                    </div>
                                </div>
                            </div>
                            {/* Card 6: Occupational (Low Progress) */}
                            <div className="group relative flex flex-col gap-4 rounded-xl bg-white dark:bg-[#1c1f27] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-[0_0_4px_rgba(0,0,0,0.2)] border border-[#e5e7eb] dark:border-[#282e39] hover:border-[#135bec]/50 hover:dark:border-[#135bec] hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden">
                                <div className="flex items-center justify-between">
                                    <div className="size-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                                        <span className="material-symbols-outlined text-3xl">work</span>
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-wide">
                                        Active
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-[#111318] dark:text-white mb-1 group-hover:text-[#135bec] transition-colors">Occupational</h3>
                                    <p className="text-sm text-[#64748b] dark:text-[#9da6b9]">Career path & skill building.</p>
                                </div>
                                <div className="mt-auto pt-4">
                                    <div className="flex justify-between text-xs font-medium mb-2">
                                        <span className="text-[#64748b] dark:text-[#9da6b9]">Progress</span>
                                        <span className="text-[#135bec]">10%</span>
                                    </div>
                                    <div className="h-2 w-full bg-[#f1f5f9] dark:bg-[#282e39] rounded-full overflow-hidden">
                                        <div className="h-full bg-[#135bec] rounded-full" style={{ width: "10%" }}></div>
                                    </div>
                                </div>
                            </div>
                            {/* Card 7: Emotional (Halfway) */}
                            <div className="group relative flex flex-col gap-4 rounded-xl bg-white dark:bg-[#1c1f27] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-[0_0_4px_rgba(0,0,0,0.2)] border border-[#e5e7eb] dark:border-[#282e39] hover:border-[#135bec]/50 hover:dark:border-[#135bec] hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden">
                                <div className="flex items-center justify-between">
                                    <div className="size-12 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                                        <span className="material-symbols-outlined text-3xl">sentiment_satisfied</span>
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-wide">
                                        Active
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-[#111318] dark:text-white mb-1 group-hover:text-[#135bec] transition-colors">Emotional</h3>
                                    <p className="text-sm text-[#64748b] dark:text-[#9da6b9]">Awareness & resilience.</p>
                                </div>
                                <div className="mt-auto pt-4">
                                    <div className="flex justify-between text-xs font-medium mb-2">
                                        <span className="text-[#64748b] dark:text-[#9da6b9]">Progress</span>
                                        <span className="text-[#135bec]">50%</span>
                                    </div>
                                    <div className="h-2 w-full bg-[#f1f5f9] dark:bg-[#282e39] rounded-full overflow-hidden">
                                        <div className="h-full bg-[#135bec] rounded-full" style={{ width: "50%" }}></div>
                                    </div>
                                </div>
                            </div>
                            {/* Card 8: Environmental (Locked/Not Started) */}
                            <div className="group relative flex flex-col gap-4 rounded-xl bg-white dark:bg-[#1c1f27] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-[0_0_4px_rgba(0,0,0,0.2)] border border-[#e5e7eb] dark:border-[#282e39] hover:border-[#135bec]/50 hover:dark:border-[#135bec] hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden opacity-80 hover:opacity-100">
                                <div className="flex items-center justify-between">
                                    <div className="size-12 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
                                        <span className="material-symbols-outlined text-3xl">eco</span>
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wide">
                                        Locked
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-[#111318] dark:text-white mb-1 group-hover:text-[#135bec] transition-colors flex gap-2 items-center">Environmental <span className="material-symbols-outlined text-sm">lock</span></h3>
                                    <p className="text-sm text-[#64748b] dark:text-[#9da6b9]">Harmony with surroundings.</p>
                                </div>
                                <div className="mt-auto pt-4">
                                    <div className="flex justify-between text-xs font-medium mb-2">
                                        <span className="text-[#64748b] dark:text-[#9da6b9]">Progress</span>
                                        <span className="text-[#64748b] dark:text-[#9da6b9]">0%</span>
                                    </div>
                                    <div className="h-2 w-full bg-[#f1f5f9] dark:bg-[#282e39] rounded-full overflow-hidden">
                                        <div className="h-full bg-[#135bec] rounded-full" style={{ width: "0%" }}></div>
                                    </div>
                                </div>
                            </div>
                            {/* Card 9: Creative (High Progress) */}
                            <div className="group relative flex flex-col gap-4 rounded-xl bg-white dark:bg-[#1c1f27] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-[0_0_4px_rgba(0,0,0,0.2)] border border-[#e5e7eb] dark:border-[#282e39] hover:border-[#135bec]/50 hover:dark:border-[#135bec] hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden">
                                <div className="flex items-center justify-between">
                                    <div className="size-12 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600 dark:text-pink-400">
                                        <span className="material-symbols-outlined text-3xl">palette</span>
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-wide">
                                        Active
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-[#111318] dark:text-white mb-1 group-hover:text-[#135bec] transition-colors">Creative</h3>
                                    <p className="text-sm text-[#64748b] dark:text-[#9da6b9]">Innovation & expression.</p>
                                </div>
                                <div className="mt-auto pt-4">
                                    <div className="flex justify-between text-xs font-medium mb-2">
                                        <span className="text-[#64748b] dark:text-[#9da6b9]">Progress</span>
                                        <span className="text-[#135bec]">80%</span>
                                    </div>
                                    <div className="h-2 w-full bg-[#f1f5f9] dark:bg-[#282e39] rounded-full overflow-hidden">
                                        <div className="h-full bg-[#135bec] rounded-full" style={{ width: "80%" }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
