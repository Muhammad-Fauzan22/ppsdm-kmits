"use client";

// Prevent static generation - this page requires runtime data
export const dynamic = 'force-dynamic';

import React from 'react';

export default function StackableCredentialsPage() {
    return (
        <div className="bg-[#f6f6f8] dark:bg-[#101022] font-[family-name:var(--font-manrope)] text-slate-900 dark:text-white min-h-screen flex flex-col overflow-x-hidden">
            {/* Top Navigation */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-[#282839] bg-white dark:bg-[#101022] px-6 py-3 sticky top-0 z-50">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-4 dark:text-white text-slate-900">
                        <div className="size-8 rounded bg-[#1313ec] flex items-center justify-center text-white">
                            <span className="material-symbols-outlined text-xl">school</span>
                        </div>
                        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">PPSDM KMM</h2>
                    </div>
                    <nav className="hidden md:flex items-center gap-9">
                        <a className="text-slate-600 dark:text-[#9d9db9] hover:text-[#1313ec] dark:hover:text-white text-sm font-medium transition-colors" href="#">Dashboard</a>
                        <a className="text-slate-900 dark:text-white text-sm font-medium transition-colors" href="#">Portfolio</a>
                        <a className="text-slate-600 dark:text-[#9d9db9] hover:text-[#1313ec] dark:hover:text-white text-sm font-medium transition-colors" href="#">Courses</a>
                        <a className="text-slate-600 dark:text-[#9d9db9] hover:text-[#1313ec] dark:hover:text-white text-sm font-medium transition-colors" href="#">Certifications</a>
                    </nav>
                </div>
                <div className="flex flex-1 justify-end gap-6 items-center">
                    <label className="hidden md:flex flex-col min-w-40 !h-10 max-w-64">
                        <div className="flex w-full flex-1 items-stretch rounded-lg h-full border border-slate-200 dark:border-none">
                            <div className="text-slate-500 dark:text-[#9d9db9] flex border-none bg-slate-50 dark:bg-[#282839] items-center justify-center pl-4 rounded-l-lg border-r-0">
                                <span className="material-symbols-outlined">search</span>
                            </div>
                            <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg rounded-l-none text-slate-900 dark:text-white focus:outline-0 focus:ring-0 border-none bg-slate-50 dark:bg-[#282839] h-full placeholder:text-slate-500 dark:placeholder:text-[#9d9db9] px-4 pl-2 text-sm font-normal" placeholder="Search" />
                        </div>
                    </label>
                    <div className="flex items-center gap-3">
                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-slate-200 dark:border-[#282839]" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBAX9eVV7eob1O1ct13urK2VfZAH4G8lbmJd-ETMsk-0Tpl-62178eGcjgjvN8C4RSsU9nAz_CN8GJuSoGHtBNdmGNzm-y_EsEY9Bigir6Itv7GLHBOupo01-K-G2xkDtrQwyRdPxPHDD18Jtbc4HszVKocMm3PgMNMjSd09sooD0w74rA91ib6caf8_0KMI4gEqs2jThpUP_0-mkXW85W8S2tMw0dQpoeeWXcsGAofOhR-mrWisbZQQRD9clJn5R6Jy3zeae5EDR0")' }}></div>
                        <div className="hidden lg:block">
                            <p className="text-sm font-bold dark:text-white text-slate-900">Sarah Jenkins</p>
                            <p className="text-xs dark:text-[#9d9db9] text-slate-500">Project Manager</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 md:px-8 py-8">
                {/* Header Section with Selector */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-10">
                    <div className="flex flex-col gap-2 max-w-2xl">
                        <div className="flex items-center gap-2 text-[#1313ec] font-bold text-sm uppercase tracking-wider mb-1">
                            <span className="material-symbols-outlined text-lg">timeline</span>
                            <span>Portfolio / Stack</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">Stackable Credential Roadmap</h1>
                        <p className="text-slate-600 dark:text-[#9d9db9] text-base font-normal leading-relaxed">
                            Visual guide showing how your micro-courses, badges, and projects 'stack' to form a professional certification.
                        </p>
                    </div>
                    <div className="w-full lg:w-auto min-w-[300px]">
                        <label className="flex flex-col gap-2">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Target Certification Path</span>
                            <div className="relative">
                                <select className="appearance-none w-full bg-white dark:bg-[#181824] border border-slate-200 dark:border-[#282839] text-slate-900 dark:text-white h-12 px-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1313ec]/50 font-medium">
                                    <option value="pmp">Global Project Management Professional</option>
                                    <option value="agile">Agile Certified Practitioner</option>
                                    <option value="data">Data Science Specialist</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 dark:text-[#9d9db9]">
                                    <span className="material-symbols-outlined">expand_more</span>
                                </div>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Dashboard Stats Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
                    {/* Overall Progress Card */}
                    <div className="lg:col-span-4 bg-white dark:bg-[#181824] border border-slate-200 dark:border-[#282839] rounded-xl p-6 flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-slate-500 dark:text-[#9d9db9] text-sm font-medium mb-1">Total Path Completion</p>
                                <h3 className="text-4xl font-black text-slate-900 dark:text-white">65%</h3>
                            </div>
                            <div className="size-12 rounded-full bg-[#1313ec]/10 flex items-center justify-center text-[#1313ec]">
                                <span className="material-symbols-outlined">show_chart</span>
                            </div>
                        </div>
                        {/* Simple Progress Bar */}
                        <div className="w-full bg-slate-100 dark:bg-[#282839] rounded-full h-3 mb-4 overflow-hidden">
                            <div className="bg-[#1313ec] h-3 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                            <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#282839]/50">
                                <p className="text-xs text-slate-500 dark:text-[#9d9db9] uppercase font-bold tracking-wider mb-1">Earned</p>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                                    <span className="text-lg font-bold text-slate-900 dark:text-white">5 Badges</span>
                                </div>
                            </div>
                            <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#282839]/50">
                                <p className="text-xs text-slate-500 dark:text-[#9d9db9] uppercase font-bold tracking-wider mb-1">Remaining</p>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-orange-500 text-sm">schedule</span>
                                    <span className="text-lg font-bold text-slate-900 dark:text-white">3 Units</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Completion by Tier Chart */}
                    <div className="lg:col-span-4 bg-white dark:bg-[#181824] border border-slate-200 dark:border-[#282839] rounded-xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-slate-900 dark:text-white font-bold text-base">Progress by Tier</p>
                            <span className="text-xs font-medium px-2 py-1 rounded bg-green-500/10 text-green-500">+15% this month</span>
                        </div>
                        <div className="flex items-end justify-between h-[140px] gap-4 px-2">
                            {/* Tier 1 Column */}
                            <div className="flex flex-col items-center gap-2 w-full group cursor-pointer">
                                <div className="w-full bg-[#1313ec]/20 dark:bg-[#1313ec]/20 h-full rounded-t-lg relative overflow-hidden">
                                    <div className="absolute bottom-0 w-full bg-[#1313ec] h-full transition-all duration-500 group-hover:bg-[#1313ec]/90"></div>
                                </div>
                                <p className="text-xs font-bold text-slate-600 dark:text-[#9d9db9] tracking-wide">Foundation</p>
                            </div>
                            {/* Tier 2 Column */}
                            <div className="flex flex-col items-center gap-2 w-full group cursor-pointer">
                                <div className="w-full bg-slate-100 dark:bg-[#282839] h-full rounded-t-lg relative overflow-hidden">
                                    <div className="absolute bottom-0 w-full bg-[#1313ec] h-[60%] transition-all duration-500 group-hover:bg-[#1313ec]/90"></div>
                                </div>
                                <p className="text-xs font-bold text-slate-600 dark:text-[#9d9db9] tracking-wide">Advanced</p>
                            </div>
                            {/* Tier 3 Column */}
                            <div className="flex flex-col items-center gap-2 w-full group cursor-pointer">
                                <div className="w-full bg-slate-100 dark:bg-[#282839] h-full rounded-t-lg relative overflow-hidden">
                                    <div className="absolute bottom-0 w-full bg-[#1313ec] h-[0%] transition-all duration-500 group-hover:bg-[#1313ec]/90"></div>
                                </div>
                                <p className="text-xs font-bold text-slate-600 dark:text-[#9d9db9] tracking-wide">Capstone</p>
                            </div>
                        </div>
                    </div>

                    {/* Gap Indicators (Action Panel) */}
                    <div className="lg:col-span-4 bg-white dark:bg-[#181824] border border-slate-200 dark:border-[#282839] rounded-xl p-6 flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-1.5 rounded bg-orange-500/10 text-orange-500">
                                <span className="material-symbols-outlined text-lg">warning</span>
                            </div>
                            <p className="text-slate-900 dark:text-white font-bold text-base">Gap Indicators</p>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-[#9d9db9] mb-4">You are missing 2 key requirements to unlock the final certification exam.</p>
                        <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
                            {/* Gap Item 1 */}
                            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-[#282839] bg-slate-50 dark:bg-[#15151e] hover:border-[#1313ec]/50 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="size-2 rounded-full bg-orange-500"></div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">Budgeting 101</p>
                                        <p className="text-xs text-slate-500 dark:text-[#9d9db9]">Advanced Tier</p>
                                    </div>
                                </div>
                                <button className="text-xs font-bold text-[#1313ec] opacity-0 group-hover:opacity-100 transition-opacity">Enroll</button>
                            </div>
                            {/* Gap Item 2 */}
                            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-[#282839] bg-slate-50 dark:bg-[#15151e] hover:border-[#1313ec]/50 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="size-2 rounded-full bg-orange-500"></div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">Stakeholder Mgmt</p>
                                        <p className="text-xs text-slate-500 dark:text-[#9d9db9]">Advanced Tier</p>
                                    </div>
                                </div>
                                <button className="text-xs font-bold text-[#1313ec] opacity-0 group-hover:opacity-100 transition-opacity">Enroll</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* The Stack Visualization */}
                <section className="bg-white dark:bg-[#181824] rounded-xl border border-slate-200 dark:border-[#282839] overflow-hidden">
                    <div className="p-6 border-b border-slate-200 dark:border-[#282839] flex justify-between items-center">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Credential Stack</h3>
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="size-3 rounded-full bg-[#1313ec]"></div>
                                <span className="text-slate-600 dark:text-[#9d9db9]">Completed</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="size-3 rounded-full border border-dashed border-slate-400 dark:border-slate-500 bg-transparent"></div>
                                <span className="text-slate-600 dark:text-[#9d9db9]">Pending</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="size-3 rounded-full bg-slate-200 dark:bg-[#282839]"></div>
                                <span className="text-slate-600 dark:text-[#9d9db9]">Locked</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-8 overflow-x-auto">
                        <div className="flex min-w-max gap-8 items-stretch relative">
                            {/* Connector Line Layer */}
                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 dark:bg-[#282839] -z-10 -translate-y-1/2"></div>
                            {/* TIER 1: Foundation */}
                            <div className="flex flex-col gap-6 relative z-10">
                                <div className="bg-slate-100 dark:bg-[#282839] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#9d9db9] w-fit mx-auto border border-slate-200 dark:border-[#282839]">Tier 1: Foundation</div>
                                <div className="flex gap-4">
                                    {/* Card 1 */}
                                    <div className="w-64 p-5 rounded-xl bg-[#1313ec] text-white shadow-lg shadow-[#1313ec]/20 transform hover:-translate-y-1 transition-transform cursor-pointer relative group">
                                        <div className="absolute top-3 right-3 text-white/40 group-hover:text-white transition-colors">
                                            <span className="material-symbols-outlined text-lg">verified</span>
                                        </div>
                                        <div className="size-10 rounded-lg bg-white/20 flex items-center justify-center mb-4">
                                            <span className="material-symbols-outlined">menu_book</span>
                                        </div>
                                        <h4 className="font-bold text-lg mb-1">Intro to PM</h4>
                                        <p className="text-sm text-white/70 mb-3">Foundational concepts & terminology.</p>
                                        <div className="text-xs font-medium bg-white/10 px-2 py-1 rounded w-fit">Completed Apr 12</div>
                                    </div>
                                    {/* Card 2 */}
                                    <div className="w-64 p-5 rounded-xl bg-[#1313ec] text-white shadow-lg shadow-[#1313ec]/20 transform hover:-translate-y-1 transition-transform cursor-pointer relative group">
                                        <div className="absolute top-3 right-3 text-white/40 group-hover:text-white transition-colors">
                                            <span className="material-symbols-outlined text-lg">verified</span>
                                        </div>
                                        <div className="size-10 rounded-lg bg-white/20 flex items-center justify-center mb-4">
                                            <span className="material-symbols-outlined">groups</span>
                                        </div>
                                        <h4 className="font-bold text-lg mb-1">Team Dynamics</h4>
                                        <p className="text-sm text-white/70 mb-3">Leadership & communication basics.</p>
                                        <div className="text-xs font-medium bg-white/10 px-2 py-1 rounded w-fit">Completed May 05</div>
                                    </div>
                                </div>
                            </div>
                            {/* Arrow Connector */}
                            <div className="flex items-center text-slate-300 dark:text-[#282839]">
                                <span className="material-symbols-outlined text-4xl">chevron_right</span>
                            </div>
                            {/* TIER 2: Advanced */}
                            <div className="flex flex-col gap-6 relative z-10">
                                <div className="bg-slate-100 dark:bg-[#282839] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#9d9db9] w-fit mx-auto border border-slate-200 dark:border-[#282839]">Tier 2: Advanced</div>
                                <div className="flex gap-4">
                                    {/* Card 3 (Completed) */}
                                    <div className="w-64 p-5 rounded-xl bg-[#1313ec] text-white shadow-lg shadow-[#1313ec]/20 transform hover:-translate-y-1 transition-transform cursor-pointer relative group">
                                        <div className="absolute top-3 right-3 text-white/40 group-hover:text-white transition-colors">
                                            <span className="material-symbols-outlined text-lg">verified</span>
                                        </div>
                                        <div className="size-10 rounded-lg bg-white/20 flex items-center justify-center mb-4">
                                            <span className="material-symbols-outlined">warning</span>
                                        </div>
                                        <h4 className="font-bold text-lg mb-1">Risk Mgmt</h4>
                                        <p className="text-sm text-white/70 mb-3">Identifying and mitigating project risks.</p>
                                        <div className="text-xs font-medium bg-white/10 px-2 py-1 rounded w-fit">Completed Jun 20</div>
                                    </div>
                                    {/* Card 4 (Missing/Next) */}
                                    <div className="w-64 p-5 rounded-xl bg-white dark:bg-[#1c1c27] border-2 border-dashed border-[#1313ec]/50 text-slate-900 dark:text-white shadow-none hover:shadow-lg hover:border-[#1313ec] transition-all cursor-pointer relative group flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="size-10 rounded-lg bg-[#1313ec]/10 flex items-center justify-center text-[#1313ec]">
                                                    <span className="material-symbols-outlined">attach_money</span>
                                                </div>
                                                <span className="px-2 py-1 bg-[#1313ec] text-white text-[10px] uppercase font-bold rounded animate-pulse">Next Step</span>
                                            </div>
                                            <h4 className="font-bold text-lg mb-1">Budgeting</h4>
                                            <p className="text-sm text-slate-500 dark:text-[#9d9db9] mb-3">Cost estimation & control.</p>
                                        </div>
                                        <button className="w-full py-2 rounded-lg bg-[#1313ec] text-white text-sm font-bold hover:bg-[#1313ec]/90">Enroll Now</button>
                                    </div>
                                    {/* Card 5 (Missing) */}
                                    <div className="w-64 p-5 rounded-xl bg-white dark:bg-[#1c1c27] border-2 border-dashed border-slate-300 dark:border-[#282839] text-slate-900 dark:text-white opacity-70 hover:opacity-100 transition-all cursor-pointer relative flex flex-col justify-between">
                                        <div>
                                            <div className="size-10 rounded-lg bg-slate-100 dark:bg-[#282839] flex items-center justify-center mb-4 text-slate-500">
                                                <span className="material-symbols-outlined">handshake</span>
                                            </div>
                                            <h4 className="font-bold text-lg mb-1">Stakeholder</h4>
                                            <p className="text-sm text-slate-500 dark:text-[#9d9db9] mb-3">Managing client expectations.</p>
                                        </div>
                                        <button className="w-full py-2 rounded-lg border border-slate-300 dark:border-[#3b3b54] text-slate-500 dark:text-[#9d9db9] text-sm font-bold hover:bg-slate-50 dark:hover:bg-[#282839]">View Details</button>
                                    </div>
                                </div>
                            </div>
                            {/* Arrow Connector */}
                            <div className="flex items-center text-slate-300 dark:text-[#282839]">
                                <span className="material-symbols-outlined text-4xl">chevron_right</span>
                            </div>
                            {/* TIER 3: Capstone */}
                            <div className="flex flex-col gap-6 relative z-10">
                                <div className="bg-slate-100 dark:bg-[#282839] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#9d9db9] w-fit mx-auto border border-slate-200 dark:border-[#282839]">Tier 3: Capstone</div>
                                <div className="flex gap-4">
                                    {/* Final Exam (Locked) */}
                                    <div className="w-64 p-5 rounded-xl bg-slate-50 dark:bg-[#15151e] border border-slate-200 dark:border-[#282839] text-slate-400 dark:text-slate-600 grayscale relative">
                                        <div className="absolute inset-0 flex items-center justify-center z-20">
                                            <div className="bg-slate-200 dark:bg-[#282839] p-3 rounded-full text-slate-500 dark:text-slate-400 shadow-sm">
                                                <span className="material-symbols-outlined">lock</span>
                                            </div>
                                        </div>
                                        <div className="opacity-50 pointer-events-none filter blur-[1px]">
                                            <div className="size-10 rounded-lg bg-slate-200 dark:bg-[#282839] flex items-center justify-center mb-4">
                                                <span className="material-symbols-outlined">workspace_premium</span>
                                            </div>
                                            <h4 className="font-bold text-lg mb-1">Final Exam</h4>
                                            <p className="text-sm mb-3">Comprehensive certification assessment.</p>
                                            <div className="h-8 bg-slate-200 dark:bg-[#282839] rounded w-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sticky Action Footer for Mobile/Small Screens context */}
                    <div className="p-4 bg-slate-50 dark:bg-[#15151e] border-t border-slate-200 dark:border-[#282839] flex justify-between items-center">
                        <div className="flex gap-2 items-center">
                            <span className="material-symbols-outlined text-[#1313ec]">info</span>
                            <span className="text-sm text-slate-600 dark:text-[#9d9db9]">Complete all Tier 2 modules to unlock the Capstone.</span>
                        </div>
                        <button className="px-6 py-2.5 bg-white dark:bg-[#282839] hover:bg-slate-50 dark:hover:bg-[#3b3b54] text-slate-900 dark:text-white text-sm font-bold rounded-lg border border-slate-200 dark:border-[#282839] transition-colors">
                            Download Syllabus
                        </button>
                    </div>
                </section>
            </main>

            <style jsx global>{`
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>
        </div>
    );
}
