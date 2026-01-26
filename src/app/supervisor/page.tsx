"use client";

import Link from "next/link";

export default function SupervisorDashboard() {
    return (
        <div className="bg-[#f6f6f8] dark:bg-[#101622] font-[family-name:var(--font-inter)] text-slate-900 dark:text-white h-screen overflow-hidden flex">
            {/* Sidebar Navigation */}
            <aside className="w-[280px] bg-[#135bec] flex flex-col h-full shrink-0 shadow-xl z-20 relative">
                {/* Logo & Role Indicator */}
                <div className="px-6 py-8">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="size-10 rounded-lg bg-white/20 flex items-center justify-center text-white backdrop-blur-sm shadow-inner">
                            <span className="material-symbols-outlined text-[24px]">school</span>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-white text-xl font-bold leading-tight tracking-tight">PPSDM KMM</h1>
                            <p className="text-white/60 text-[10px] font-medium uppercase tracking-widest">Platform</p>
                        </div>
                    </div>
                    {/* Role Switcher Context */}
                    <div className="mt-6 flex items-center justify-between px-3 py-2 rounded-lg bg-white/10 border border-white/5 cursor-pointer hover:bg-white/15 transition-all group">
                        <div className="flex flex-col">
                            <span className="text-white/60 text-[10px] font-medium uppercase">Current Role</span>
                            <span className="text-white text-sm font-semibold">Supervisor Mode</span>
                        </div>
                        <span className="material-symbols-outlined text-white/70 group-hover:text-white text-[20px]">expand_more</span>
                    </div>
                </div>
                {/* Navigation Links */}
                <nav className="flex-1 px-4 flex flex-col gap-1.5 overflow-y-auto custom-scrollbar">
                    {/* Dashboard (Active) */}
                    <Link className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white text-[#135bec] shadow-sm group relative transition-all" href="/supervisor">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/0 rounded-r-full"></div>
                        <span className="material-symbols-outlined text-[24px]" data-weight="fill">dashboard</span>
                        <span className="text-sm font-bold">Dashboard</span>
                    </Link>
                    {/* My Mentees */}
                    <Link className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-all group" href="#">
                        <span className="material-symbols-outlined text-[24px]">groups</span>
                        <span className="text-sm font-medium">My Mentees</span>
                    </Link>
                    {/* Approvals (With Badge) */}
                    <Link className="flex items-center justify-between px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-all group" href="#">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-[24px]">approval_delegation</span>
                            <span className="text-sm font-medium">Approvals</span>
                        </div>
                        <span className="flex items-center justify-center size-5 rounded-full bg-red-500 text-white text-[10px] font-bold shadow-sm">3</span>
                    </Link>
                    {/* Analytics */}
                    <Link className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-all group" href="/supervisor/analytics">
                        <span className="material-symbols-outlined text-[24px]">monitoring</span>
                        <span className="text-sm font-medium">Analytics</span>
                    </Link>
                </nav>
                {/* Sidebar Footer: Mini Profile */}
                <div className="p-4 mt-auto">
                    <div className="bg-[#0f4ac4] rounded-xl p-4 border border-white/5 shadow-lg">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="size-10 rounded-full bg-white/20 bg-cover bg-center ring-2 ring-white/10" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCnp5gglNpDJQV8YuF7RSdzRl-ItEdKquKek6RlBavbeMWMslpRseQ3r91owOQm-SSDl4AG9jLL_NOsPZfKzDQ3qINV5_NB5QIKRh55yfJFgPg-Aip3fk002FyMYCav85OR1l00k3UjAchZzNmi-ZvzjoW7MckJBXeVoFWEEWxAWTQRwifVSSDBcc_uRunjb5AMt397Xd5N0cjl2vPjzw4q4uWGX_GF5j6H_-59_e1Mmngm4sQF6f8s0mCScDauP9banD67jAHOUNs')" }}></div>
                            <div className="flex flex-col min-w-0">
                                <p className="text-white text-sm font-bold truncate">Dr. A. Supervisor</p>
                                <p className="text-white/60 text-xs font-medium truncate">NIP: 19823001</p>
                            </div>
                        </div>
                        <button className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white text-xs font-semibold border border-white/5">
                            <span className="material-symbols-outlined text-[16px]">logout</span>
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>
            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Header Section with Image and Gradient */}
                <div className="shrink-0 relative h-[220px] w-full overflow-hidden bg-[#101622]">
                    <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAYhfypujIg7_3AL2FVuP0cWovMvFkwDY_VOxX8QkPzdbq0xojBdtyShpukmGs50HZMn0AbVdCiR03yt42ocF6wPfT35MF73hsdBFwl47Sen4iso68nTw07i8sr_NQ9OgoWq1LRhwkN05Cy_zodQ3hEFTR-aj-gi3QRxWGB9J0b28en-th-1ZMAnr6emspwAb66S8-yj6bGvbYsNiEjCp-NbQgLpY3n-81-LSVQu4akyBu-2DizQRkED4TCOeH9UBRtPlL28lHHzfw')" }}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#f6f6f8] dark:from-[#101622] via-transparent to-black/30"></div>
                    <div className="relative h-full flex flex-col justify-end p-8 max-w-[1200px] mx-auto w-full">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#135bec]/20 text-[#135bec] border border-[#135bec]/20 dark:text-blue-300 dark:border-blue-400/30">Supervisor Dashboard</span>
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Welcome back, Dr. Supervisor</h2>
                            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl">You have <span className="text-[#135bec] font-bold dark:text-blue-400">3 pending approvals</span> waiting for your review today.</p>
                        </div>
                    </div>
                </div>
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-8 pt-2">
                    <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-8">
                        {/* Stats Section */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {/* Pending Approvals Card */}
                            <div className="bg-white dark:bg-[#161e2c] rounded-xl p-5 border border-slate-200 dark:border-slate-700/50 shadow-sm flex flex-col justify-between h-[140px] relative overflow-hidden group hover:border-[#135bec]/50 transition-colors">
                                <div className="absolute -right-4 -top-4 size-24 bg-[#135bec]/5 rounded-full group-hover:bg-[#135bec]/10 transition-colors"></div>
                                <div className="flex justify-between items-start z-10">
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">Pending Approvals</p>
                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-[#135bec] rounded-lg">
                                        <span className="material-symbols-outlined text-[20px]">pending_actions</span>
                                    </div>
                                </div>
                                <div className="flex items-end gap-3 z-10">
                                    <p className="text-slate-900 dark:text-white text-3xl font-bold">3</p>
                                    <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded mb-1">
                                        <span className="material-symbols-outlined text-[14px]">trending_up</span>
                                        <span>+1 this week</span>
                                    </div>
                                </div>
                            </div>
                            {/* Active Mentees Card */}
                            <div className="bg-white dark:bg-[#161e2c] rounded-xl p-5 border border-slate-200 dark:border-slate-700/50 shadow-sm flex flex-col justify-between h-[140px] relative overflow-hidden group hover:border-purple-500/50 transition-colors">
                                <div className="absolute -right-4 -top-4 size-24 bg-purple-500/5 rounded-full group-hover:bg-purple-500/10 transition-colors"></div>
                                <div className="flex justify-between items-start z-10">
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">Active Mentees</p>
                                    <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-lg">
                                        <span className="material-symbols-outlined text-[20px]">groups</span>
                                    </div>
                                </div>
                                <div className="flex items-end gap-3 z-10">
                                    <p className="text-slate-900 dark:text-white text-3xl font-bold">12</p>
                                    <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded mb-1">
                                        <span className="material-symbols-outlined text-[14px]">person_add</span>
                                        <span>+2 new</span>
                                    </div>
                                </div>
                            </div>
                            {/* Logbook Reviews Card */}
                            <div className="bg-white dark:bg-[#161e2c] rounded-xl p-5 border border-slate-200 dark:border-slate-700/50 shadow-sm flex flex-col justify-between h-[140px] relative overflow-hidden group hover:border-orange-500/50 transition-colors">
                                <div className="absolute -right-4 -top-4 size-24 bg-orange-500/5 rounded-full group-hover:bg-orange-500/10 transition-colors"></div>
                                <div className="flex justify-between items-start z-10">
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">Logbook Reviews</p>
                                    <div className="p-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-lg">
                                        <span className="material-symbols-outlined text-[20px]">assignment</span>
                                    </div>
                                </div>
                                <div className="flex items-end gap-3 z-10">
                                    <p className="text-slate-900 dark:text-white text-3xl font-bold">98%</p>
                                    <span className="text-slate-400 text-xs font-medium mb-1.5">Completion rate</span>
                                </div>
                            </div>
                        </div>
                        {/* Main Section: Priority Tasks */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[#135bec] dark:text-blue-400">priority_high</span>
                                    Action Required
                                </h3>
                                <button className="text-xs font-semibold text-[#135bec] dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300">View All Tasks</button>
                            </div>
                            <div className="bg-white dark:bg-[#161e2c] rounded-xl border border-slate-200 dark:border-slate-700/50 overflow-hidden shadow-sm">
                                <div className="grid grid-cols-1 divide-y divide-slate-100 dark:divide-slate-700/50">
                                    {/* Task Item 1 */}
                                    <div className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                        <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-slate-500 dark:text-slate-400">description</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Internship Final Report Approval</h4>
                                                <span className="px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px] font-bold uppercase">High Priority</span>
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Submitted by <span className="font-medium text-slate-700 dark:text-slate-300">Ahmad Fikri</span> • 2 hours ago</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">Details</button>
                                            <button className="px-3 py-1.5 rounded-lg bg-[#135bec] text-white text-xs font-semibold hover:bg-blue-700 shadow-sm shadow-blue-500/20">Review</button>
                                        </div>
                                    </div>
                                    {/* Task Item 2 */}
                                    <div className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                        <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-slate-500 dark:text-slate-400">calendar_month</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Monthly Mentoring Schedule</h4>
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Requested by <span className="font-medium text-slate-700 dark:text-slate-300">Siti Nurhaliza</span> • 5 hours ago</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">Dismiss</button>
                                            <button className="px-3 py-1.5 rounded-lg bg-[#135bec] text-white text-xs font-semibold hover:bg-blue-700 shadow-sm shadow-blue-500/20">Approve</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
