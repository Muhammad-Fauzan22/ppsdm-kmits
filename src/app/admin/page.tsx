"use client";

import Link from "next/link";

export default function AdminPage() {
    return (
        <div className="bg-[#f6f6f8] dark:bg-[#101622] text-slate-900 dark:text-slate-100 overflow-hidden h-screen flex font-[family-name:var(--font-inter)]">
            {/* Sidebar Navigation */}
            <aside className="w-64 h-full flex flex-col justify-between bg-white dark:bg-[#0B0E14] border-r border-slate-200 dark:border-slate-800 shrink-0 z-20">
                {/* Header & Nav */}
                <div className="flex flex-col p-4 gap-8">
                    {/* Brand */}
                    <div className="flex items-center gap-3 px-2">
                        <div className="bg-[#135bec]/20 p-2 rounded-lg">
                            <div className="text-[#135bec] material-symbols-outlined text-[28px]">shield_person</div>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">PPSDM KMM</h1>
                            <span className="text-xs font-semibold tracking-wider text-[#135bec] uppercase">Admin View</span>
                        </div>
                    </div>
                    {/* Navigation Links */}
                    <nav className="flex flex-col gap-1">
                        {/* Active Item */}
                        <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#135bec] text-white group shadow-lg shadow-[#135bec]/20 transition-all" href="/admin">
                            <span className="material-symbols-outlined text-[20px]">dashboard</span>
                            <span className="text-sm font-medium">Console</span>
                        </Link>
                        {/* Inactive Items */}
                        <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors" href="/admin/orchestrator">
                            <span className="material-symbols-outlined text-[20px]">hub</span>
                            <span className="text-sm font-medium">Orchestrator</span>
                        </Link>
                        <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors" href="/admin/users">
                            <span className="material-symbols-outlined text-[20px]">group</span>
                            <span className="text-sm font-medium">Users</span>
                        </Link>
                        <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors" href="#">
                            <span className="material-symbols-outlined text-[20px]">settings</span>
                            <span className="text-sm font-medium">Config</span>
                        </Link>
                    </nav>
                </div>
                {/* Footer / User Profile */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B0E14]">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-white/5 cursor-pointer transition-colors">
                            <div className="relative">
                                <div className="w-9 h-9 rounded-full bg-cover bg-center border border-slate-300 dark:border-slate-600" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBoTjh9vEjttsNbDYjYKsrk2oZuuMukSMeNjJMvtC3iZNgpSp5mHmnCwB5TNlWfSBfsEEXCRtXpQHX2C1cheqrG8cBa3sXeUMZVB3L7s1xLyywnGAhpiqpxVDuqiT6-lmLvd-p7QztGBobJGdWmOIvaAoihePAmb_MAin-dkPKf3ZRhDL4RIk8Ubum3XCKYonEgb42h-EuNx7m6GLApymbFhFkDVa4Lj3SsryTLXJXtOGSddexHymfXegmu5kbp9256wo1oeVeAoAk')" }}></div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-[#0B0E14]"></div>
                            </div>
                            <div className="flex flex-col flex-1 overflow-hidden">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">System Admin</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">admin@ppsdm.kmm</p>
                            </div>
                        </div>
                        <button className="flex items-center justify-center gap-2 w-full py-2 text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors">
                            <span className="material-symbols-outlined text-[16px]">logout</span>
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>
            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Top Navigation / Breadcrumbs (Optional Context) */}
                <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-[#101622]/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <span>PPSDM</span>
                        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                        <span className="text-slate-900 dark:text-white font-medium">Console</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-slate-500 hover:text-[#135bec] transition-colors">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <button className="p-2 text-slate-500 hover:text-[#135bec] transition-colors">
                            <span className="material-symbols-outlined">help</span>
                        </button>
                    </div>
                </header>
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="max-w-[1200px] mx-auto flex flex-col gap-8">
                        {/* Page Heading */}
                        <div className="flex flex-wrap justify-between items-end gap-4">
                            <div className="flex flex-col gap-1">
                                <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">System Overview</h2>
                                <p className="text-slate-500 dark:text-slate-400">Real-time command center dashboard</p>
                            </div>
                            <div className="flex gap-3">
                                <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                                    Last 24 Hours
                                </button>
                                <button className="px-4 py-2 bg-[#135bec] hover:bg-blue-600 text-white rounded-lg text-sm font-medium shadow-lg shadow-[#135bec]/20 transition-colors flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">refresh</span>
                                    Refresh Data
                                </button>
                            </div>
                        </div>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Stat Card 1 */}
                            <div className="p-6 rounded-xl bg-white dark:bg-[#1A1F2B] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4 group hover:border-[#135bec]/50 transition-colors cursor-default">
                                <div className="flex justify-between items-start">
                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-[#135bec]">
                                        <span className="material-symbols-outlined">memory</span>
                                    </div>
                                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">-5%</span>
                                </div>
                                <div>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">System Load</p>
                                    <p className="text-3xl font-bold text-slate-900 dark:text-white">34%</p>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-auto overflow-hidden">
                                    <div className="bg-[#135bec] h-1.5 rounded-full" style={{ width: "34%" }}></div>
                                </div>
                            </div>
                            {/* Stat Card 2 */}
                            <div className="p-6 rounded-xl bg-white dark:bg-[#1A1F2B] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4 group hover:border-[#135bec]/50 transition-colors cursor-default">
                                <div className="flex justify-between items-start">
                                    <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400">
                                        <span className="material-symbols-outlined">group</span>
                                    </div>
                                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">+12%</span>
                                </div>
                                <div>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Active Users</p>
                                    <p className="text-3xl font-bold text-slate-900 dark:text-white">1,204</p>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-auto overflow-hidden">
                                    <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: "65%" }}></div>
                                </div>
                            </div>
                            {/* Stat Card 3 */}
                            <div className="p-6 rounded-xl bg-white dark:bg-[#1A1F2B] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4 group hover:border-[#135bec]/50 transition-colors cursor-default">
                                <div className="flex justify-between items-start">
                                    <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-emerald-600 dark:text-emerald-400">
                                        <span className="material-symbols-outlined">check_circle</span>
                                    </div>
                                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">Stable</span>
                                </div>
                                <div>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Orchestration Status</p>
                                    <p className="text-3xl font-bold text-slate-900 dark:text-white">Healthy</p>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-auto overflow-hidden">
                                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: "100%" }}></div>
                                </div>
                            </div>
                        </div>
                        {/* Main Chart Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {/* Large Chart */}
                            <div className="lg:col-span-2 p-6 rounded-xl bg-white dark:bg-[#1A1F2B] border border-slate-200 dark:border-slate-800 shadow-sm">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Network Traffic Activity</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Inbound and outbound data flow</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-slate-900 dark:text-white">12.5 TB</p>
                                        <p className="text-sm text-emerald-500 font-medium flex items-center justify-end gap-1">
                                            <span className="material-symbols-outlined text-[16px]">trending_up</span>
                                            +8% vs last 24h
                                        </p>
                                    </div>
                                </div>
                                <div className="w-full h-[250px] relative">
                                    {/* Abstract Chart Lines using SVG */}
                                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 300">
                                        <defs>
                                            <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                                <stop offset="0%" stopColor="#135bec" stopOpacity="0.2"></stop>
                                                <stop offset="100%" stopColor="#135bec" stopOpacity="0"></stop>
                                            </linearGradient>
                                        </defs>
                                        <path d="M0 250 Q 100 200, 200 230 T 400 180 T 600 210 T 800 100 T 1000 150 V 300 H 0 Z" fill="url(#chartGradient)"></path>
                                        <path d="M0 250 Q 100 200, 200 230 T 400 180 T 600 210 T 800 100 T 1000 150" fill="none" stroke="#135bec" strokeLinecap="round" strokeWidth="3"></path>
                                        <path d="M0 280 Q 150 260, 300 270 T 500 240 T 700 260 T 1000 220" fill="none" opacity="0.5" stroke="#94a3b8" strokeDasharray="5,5" strokeWidth="2"></path>
                                    </svg>
                                    {/* X Axis Labels */}
                                    <div className="flex justify-between mt-2 px-2 text-xs font-medium text-slate-400">
                                        <span>00:00</span>
                                        <span>04:00</span>
                                        <span>08:00</span>
                                        <span>12:00</span>
                                        <span>16:00</span>
                                        <span>20:00</span>
                                        <span>23:59</span>
                                    </div>
                                </div>
                            </div>
                            {/* Side Panel / Quick Actions */}
                            <div className="lg:col-span-1 flex flex-col gap-4">
                                <div className="p-6 rounded-xl bg-[#135bec] text-white shadow-lg shadow-[#135bec]/25 relative overflow-hidden">
                                    {/* Background Pattern Decoration */}
                                    <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-white/10 blur-2xl"></div>
                                    <div className="absolute -left-10 -bottom-10 w-32 h-32 rounded-full bg-black/10 blur-xl"></div>
                                    <h3 className="text-lg font-bold mb-1 relative z-10">Quick Maintenance</h3>
                                    <p className="text-blue-100 text-sm mb-6 relative z-10">Run diagnostics on selected nodes.</p>
                                    <div className="flex flex-col gap-3 relative z-10">
                                        <button className="w-full py-2 px-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-sm font-medium flex items-center justify-between transition-colors">
                                            <span>Run Health Check</span>
                                            <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                                        </button>
                                        <button className="w-full py-2 px-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-sm font-medium flex items-center justify-between transition-colors">
                                            <span>Clear Cache</span>
                                            <span className="material-symbols-outlined text-[18px]">cleaning_services</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="flex-1 p-6 rounded-xl bg-white dark:bg-[#1A1F2B] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Recent Alerts</h3>
                                    <div className="flex flex-col gap-4 overflow-y-auto max-h-[200px] pr-2 custom-scrollbar">
                                        <div className="flex gap-3 items-start">
                                            <div className="mt-1 w-2 h-2 rounded-full bg-amber-500 shrink-0"></div>
                                            <div className="flex flex-col gap-1">
                                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">High Latency on Node A</p>
                                                <p className="text-xs text-slate-500">10 mins ago</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 items-start">
                                            <div className="mt-1 w-2 h-2 rounded-full bg-red-500 shrink-0"></div>
                                            <div className="flex flex-col gap-1">
                                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Failed Backup Job</p>
                                                <p className="text-xs text-slate-500">32 mins ago</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 items-start">
                                            <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>
                                            <div className="flex flex-col gap-1">
                                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Config Update Applied</p>
                                                <p className="text-xs text-slate-500">1 hour ago</p>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="mt-auto pt-4 text-xs font-semibold text-[#135bec] hover:underline text-center">View All Logs</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <style jsx global>{`
                    .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
                    .custom-scrollbar::-webkit-scrollbar-track { background: #101622; }
                    .custom-scrollbar::-webkit-scrollbar-thumb { background: #2d3648; border-radius: 4px; }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #4a5568; }
                `}</style>
            </main>
        </div>
    );
}
