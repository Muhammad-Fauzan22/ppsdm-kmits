"use client";

export default function SupervisorMobileDashboard() {
    return (
        <div className="bg-[#f6f6f8] dark:bg-[#101622] font-[family-name:var(--font-inter)] min-h-screen flex items-center justify-center py-8 px-4 text-slate-900 dark:text-white">
            {/* Desktop Presentation Wrapper */}
            <div className="relative w-full max-w-[375px] h-[812px] bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border-[8px] border-slate-900 overflow-hidden flex flex-col group/design-root">
                {/* Status Bar Simulation */}
                <div className="h-8 bg-white dark:bg-slate-900 w-full flex justify-between items-center px-6 pt-2 z-20 absolute top-0">
                    <span className="text-[10px] font-semibold text-slate-900 dark:text-white">9:41</span>
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 bg-slate-900 dark:bg-white rounded-full opacity-20"></div>
                        <div className="w-3 h-3 bg-slate-900 dark:bg-white rounded-full opacity-20"></div>
                        <div className="w-3 h-3 bg-slate-900 dark:bg-white rounded-full opacity-60"></div>
                    </div>
                </div>
                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto no-scrollbar bg-slate-50 dark:bg-slate-950 pb-[100px] pt-8">
                    {/* Header Section */}
                    <div className="p-4 pb-2">
                        <div className="bg-cover bg-center flex flex-col justify-end overflow-hidden bg-white dark:bg-slate-800 rounded-2xl min-h-[180px] shadow-sm relative group" style={{ backgroundImage: 'linear-gradient(180deg, rgba(19, 91, 236, 0) 0%, rgba(16, 22, 34, 0.8) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCxlymJVjnzH0kk9yWYa32jLWYRr9Sj7NlnGxEmp-FLSLUJlrzhkxLa8ejwmLL4N9B5aqy_qQBfPmkGdD-7Qu8YXlaDp9Yc_rQt4ADGgFZ0lBh5FMjNUpkDQ3yz-3CWAqo5qcLBWmZI6h5zOywTXKlDfHoYQwXiYkbqA2vJwieCXV3ectRYavFKYbnG8ExMThKkWBawpTEzVMZ53nQ0iF5vuIdh61M_2yMKyKYTWjSbnl5cgrFTX5zOmZG1AXVtYCwcSo6pvbAhFJI")' }}>
                            <div className="flex p-4 flex-col z-10">
                                <span className="text-white/80 text-xs font-medium uppercase tracking-wider mb-1">Welcome back</span>
                                <p className="text-white tracking-tight text-2xl font-bold leading-tight">Supervisor Dashboard</p>
                            </div>
                        </div>
                    </div>
                    {/* Stats Section */}
                    <div className="px-4 py-2">
                        <h2 className="text-slate-900 dark:text-white text-lg font-bold mb-3 px-1">Overview</h2>
                        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                            <div className="flex min-w-[140px] flex-1 flex-col gap-2 rounded-2xl p-4 bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
                                <div className="flex justify-between items-start">
                                    <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600 dark:text-orange-400">
                                        <span className="material-symbols-outlined text-[20px]">pending_actions</span>
                                    </div>
                                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+2 new</span>
                                </div>
                                <div>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Pending Approvals</p>
                                    <p className="text-slate-900 dark:text-white text-2xl font-bold mt-1">5</p>
                                </div>
                            </div>
                            <div className="flex min-w-[140px] flex-1 flex-col gap-2 rounded-2xl p-4 bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
                                <div className="flex justify-between items-start">
                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-[#135bec]">
                                        <span className="material-symbols-outlined text-[20px]">groups</span>
                                    </div>
                                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+1 mo</span>
                                </div>
                                <div>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Total Mentees</p>
                                    <p className="text-slate-900 dark:text-white text-2xl font-bold mt-1">12</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Quick Actions / List */}
                    <div className="px-4 pt-2">
                        <h2 className="text-slate-900 dark:text-white text-lg font-bold mb-3 px-1">Quick Actions</h2>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-slate-700 flex items-center justify-center text-[#135bec]">
                                        <span className="material-symbols-outlined text-[20px]">person_add</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-slate-900 dark:text-white">Add New Mentee</span>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">Assign a new team member</span>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-slate-400 text-[20px]">chevron_right</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-slate-700 flex items-center justify-center text-purple-600">
                                        <span className="material-symbols-outlined text-[20px]">summarize</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-slate-900 dark:text-white">Generate Report</span>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">Weekly team performance</span>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-slate-400 text-[20px]">chevron_right</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* MOBILE BOTTOM NAVIGATION COMPONENT */}
                <div className="absolute bottom-0 w-full bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shadow-nav z-50 pb-6 pt-2">
                    <nav className="flex justify-around items-end w-full px-2 font-[family-name:var(--font-poppins)]">
                        {/* Item 1: Dashboard (Active) */}
                        <button className="group flex flex-col items-center gap-1 min-w-[64px] transition-all duration-200">
                            <div className="bg-[#135bec] text-white px-5 py-1.5 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-blue-900/20 transform translate-y-[-4px]">
                                <span className="material-symbols-outlined text-[24px]">home</span>
                            </div>
                            <span className="text-[11px] font-medium text-[#135bec] dark:text-blue-400">Dashboard</span>
                        </button>
                        {/* Item 2: Mentees */}
                        <button className="group flex flex-col items-center gap-1.5 min-w-[64px] text-slate-400 dark:text-slate-500 hover:text-[#135bec] dark:hover:text-blue-400 transition-colors pb-1">
                            <div className="flex items-center justify-center">
                                <span className="material-symbols-outlined text-[26px] group-hover:scale-110 transition-transform">group</span>
                            </div>
                            <span className="text-[11px] font-medium">Mentees</span>
                        </button>
                        {/* Item 3: Approvals (With Badge) */}
                        <button className="group flex flex-col items-center gap-1.5 min-w-[64px] text-slate-400 dark:text-slate-500 hover:text-[#135bec] dark:hover:text-blue-400 transition-colors pb-1 relative">
                            <div className="flex items-center justify-center relative">
                                <span className="material-symbols-outlined text-[26px] group-hover:scale-110 transition-transform">checklist</span>
                                {/* Notification Badge */}
                                <div className="absolute -top-1.5 -right-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 border-[2px] border-white dark:border-slate-900 px-1">
                                    <span className="text-[9px] font-bold text-white leading-none font-sans">5</span>
                                </div>
                            </div>
                            <span className="text-[11px] font-medium">Approvals</span>
                        </button>
                        {/* Item 4: Analytics */}
                        <button className="group flex flex-col items-center gap-1.5 min-w-[64px] text-slate-400 dark:text-slate-500 hover:text-[#135bec] dark:hover:text-blue-400 transition-colors pb-1">
                            <div className="flex items-center justify-center">
                                <span className="material-symbols-outlined text-[26px] group-hover:scale-110 transition-transform">bar_chart</span>
                            </div>
                            <span className="text-[11px] font-medium">Analytics</span>
                        </button>
                    </nav>
                    {/* Home Indicator (Simulated iOS) */}
                    <div className="w-32 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mt-4"></div>
                </div>
            </div>
            {/* Context Label for Presentation */}
            <div className="fixed bottom-4 right-4 text-xs text-slate-400 font-mono hidden md:block">
                Supervisor View • Mobile Navigation Component
            </div>
            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}
