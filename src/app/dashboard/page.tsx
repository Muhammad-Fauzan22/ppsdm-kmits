"use client";

import Link from "next/link";

export default function StudentDashboard() {
    return (
        <div className="bg-student-bg dark:bg-student-dark text-text-dark dark:text-white font-[family-name:var(--font-inter)] h-screen flex overflow-hidden">
            {/* Adaptive Sidebar */}
            <aside className="flex flex-col w-72 h-full bg-[#003366] text-white flex-shrink-0 transition-all duration-300 shadow-xl z-20">
                {/* Sidebar Header */}
                <div className="h-20 flex items-center justify-between px-6 border-b border-white/10 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="size-8 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/20">
                            <span className="material-symbols-outlined text-[20px] text-white">school</span>
                        </div>
                        <div>
                            <h1 className="font-bold text-lg leading-tight tracking-tight">PPSDM KMM</h1>
                            <p className="text-xs text-white/50 font-medium">Student Portal</p>
                        </div>
                    </div>
                    {/* Collapse Toggle */}
                    <button className="p-1 rounded hover:bg-white/10 text-white/70 hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-[20px]">menu_open</span>
                    </button>
                </div>
                {/* Navigation Menu */}
                <nav className="flex-1 overflow-y-auto sidebar-scroll px-4 py-6 space-y-2">
                    {/* Dashboard (Active) */}
                    <Link className="group flex items-center gap-3 px-4 py-3 bg-white/10 rounded-lg text-white shadow-sm border border-white/5 transition-all" href="/dashboard">
                        <span className="material-symbols-outlined text-[24px]">dashboard</span>
                        <span className="text-sm font-medium">Dashboard</span>
                    </Link>
                    {/* Assessment */}
                    <Link className="group flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-all" href="#">
                        <span className="material-symbols-outlined text-[24px]">description</span>
                        <span className="text-sm font-medium">Assessment</span>
                    </Link>
                    {/* Library */}
                    <Link className="group flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-all" href="#">
                        <span className="material-symbols-outlined text-[24px]">local_library</span>
                        <span className="text-sm font-medium">Library</span>
                    </Link>
                    {/* RPI */}
                    <Link className="group flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-all" href="#">
                        <span className="material-symbols-outlined text-[24px]">show_chart</span>
                        <span className="text-sm font-medium">RPI</span>
                    </Link>
                </nav>
                {/* Sidebar Footer (Profile) */}
                <div className="p-4 border-t border-white/10 shrink-0">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                        <div className="size-10 rounded-full bg-cover bg-center border-2 border-white/20 shadow-sm" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBBWJQWvyUYlYkbTFXF9hf4klI-97Yb9j1V66nE_8QhcsZOwd4k40q9V9LjyQAH-wUhEnKRJ5YJtZWVDgD05qT6-LtBZ1vxs03mq0cqrRyOZLTYwjf-bxbeB-NMmZqxLJJKrJk9ROP2PmeNycAQRB4ENKpAdeMsK5wvhVaECBuNZLn0qKVXttK5f6Aq1XNfpnMK-3XNjaC4MTlb7GIcp8aK1PLjmOkD_yrU7Tl_pJuAXQ9ygxpw8pMrZ-gGu7_h10dMF_9Mk-CoyME')" }}></div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">Amelia Suryani</p>
                            <p className="text-xs text-white/60 truncate">Student ID: 29384</p>
                        </div>
                        <button aria-label="Logout" className="text-white/50 hover:text-red-400 transition-colors">
                            <span className="material-symbols-outlined text-[20px]">logout</span>
                        </button>
                    </div>
                </div>
            </aside>
            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#f5f7f8] dark:bg-[#0f1923] relative">
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-5xl mx-auto p-8 lg:p-12 flex flex-col gap-8">
                        {/* Page Heading */}
                        <header className="flex flex-col gap-2">
                            <h2 className="text-[#101418] dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">Dashboard</h2>
                            <p className="text-[#5e758d] dark:text-gray-400 text-base font-normal">Welcome back, Amelia. Here is your daily overview.</p>
                        </header>
                        {/* Stats Row */}
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Stat Card 1 */}
                            <div className="flex flex-col gap-4 rounded-xl p-6 bg-white dark:bg-[#1e2730] border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <p className="text-[#101418] dark:text-gray-200 text-sm font-semibold uppercase tracking-wider">Assignments Due</p>
                                    <div className="size-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                                        <span className="material-symbols-outlined">assignment_late</span>
                                    </div>
                                </div>
                                <div className="flex items-end gap-2">
                                    <p className="text-[#101418] dark:text-white text-4xl font-bold leading-none">2</p>
                                    <p className="text-[#5e758d] text-sm mb-1">pending tasks</p>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                                    <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: "70%" }}></div>
                                </div>
                            </div>
                            {/* Stat Card 2 */}
                            <div className="flex flex-col gap-4 rounded-xl p-6 bg-white dark:bg-[#1e2730] border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <p className="text-[#101418] dark:text-gray-200 text-sm font-semibold uppercase tracking-wider">Average Score</p>
                                    <div className="size-10 rounded-full bg-blue-50 flex items-center justify-center text-[#003366]">
                                        <span className="material-symbols-outlined">grade</span>
                                    </div>
                                </div>
                                <div className="flex items-end gap-2">
                                    <p className="text-[#101418] dark:text-white text-4xl font-bold leading-none">88.5</p>
                                    <div className="flex items-center text-[#078838] text-sm font-medium mb-1 gap-0.5">
                                        <span className="material-symbols-outlined text-[16px]">trending_up</span>
                                        <span>+2.5%</span>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                                    <div className="bg-[#003366] h-1.5 rounded-full" style={{ width: "88%" }}></div>
                                </div>
                            </div>
                            {/* Stat Card 3 */}
                            <div className="flex flex-col gap-4 rounded-xl p-6 bg-white dark:bg-[#1e2730] border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <p className="text-[#101418] dark:text-gray-200 text-sm font-semibold uppercase tracking-wider">Library Items</p>
                                    <div className="size-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                                        <span className="material-symbols-outlined">book</span>
                                    </div>
                                </div>
                                <div className="flex items-end gap-2">
                                    <p className="text-[#101418] dark:text-white text-4xl font-bold leading-none">5</p>
                                    <p className="text-[#5e758d] text-sm mb-1">books borrowed</p>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                                    <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: "40%" }}></div>
                                </div>
                            </div>
                        </section>
                        {/* Chart Section */}
                        <section className="bg-white dark:bg-[#1e2730] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-8">
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                                <div>
                                    <h3 className="text-[#101418] dark:text-white text-xl font-bold">Performance Index (RPI) History</h3>
                                    <p className="text-[#5e758d] text-sm mt-1">Recap of your academic performance this semester.</p>
                                </div>
                                <div className="bg-[#f5f7f8] dark:bg-[#0f1923] px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center gap-3">
                                    <div>
                                        <p className="text-xs text-[#5e758d] uppercase font-bold">Current RPI</p>
                                        <p className="text-lg font-bold text-[#003366] dark:text-blue-400">3.85</p>
                                    </div>
                                    <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>
                                    <div>
                                        <p className="text-xs text-[#5e758d] uppercase font-bold">Target</p>
                                        <p className="text-lg font-bold text-[#101418] dark:text-white">4.00</p>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full h-[250px] relative">
                                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 478 150" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_custom" x1="239" x2="239" y1="0" y2="150">
                                            <stop stopColor="#003366" stopOpacity="0.15"></stop>
                                            <stop offset="1" stopColor="#003366" stopOpacity="0"></stop>
                                        </linearGradient>
                                    </defs>
                                    {/* Fill Area */}
                                    <path d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V150H0V109Z" fill="url(#paint0_linear_custom)"></path>
                                    {/* Stroke Line */}
                                    <path d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25" stroke="#003366" strokeLinecap="round" strokeWidth="3" vectorEffect="non-scaling-stroke"></path>
                                    {/* Data Points (Circles) */}
                                    <circle cx="36.3" cy="21" fill="#fff" r="4" stroke="#003366" strokeWidth="2"></circle>
                                    <circle cx="145.2" cy="33" fill="#fff" r="4" stroke="#003366" strokeWidth="2"></circle>
                                    <circle cx="254.1" cy="45" fill="#fff" r="4" stroke="#003366" strokeWidth="2"></circle>
                                    <circle cx="363" cy="1" fill="#fff" r="4" stroke="#003366" strokeWidth="2"></circle>
                                </svg>
                            </div>
                            <div className="flex justify-between mt-6 px-4 border-t border-gray-100 dark:border-gray-700 pt-4">
                                {["Aug", "Sep", "Oct", "Nov", "Dec"].map(m => (
                                    <p key={m} className="text-[#5e758d] text-xs font-bold uppercase tracking-widest">{m}</p>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
                <style jsx global>{`
                    .sidebar-scroll::-webkit-scrollbar { width: 4px; }
                    .sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
                    .sidebar-scroll::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.2); border-radius: 20px; }
                `}</style>
            </main>
        </div>
    );
}
