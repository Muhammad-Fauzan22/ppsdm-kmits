"use client";

import Link from "next/link";

export default function RpiPlanner() {
    return (
        <div className="bg-[#f8f6f6] dark:bg-[#201212] font-[family-name:var(--font-lexend)] text-[#171212] antialiased min-h-screen flex flex-col overflow-x-hidden selection:bg-[#c72929] selection:text-white">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 w-full bg-white dark:bg-[#201212] border-b border-[#e4dcdc] shadow-sm">
                <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo & Branding */}
                        <div className="flex items-center gap-4">
                            <div className="size-8 rounded bg-[#c72929]/10 flex items-center justify-center text-[#c72929]">
                                <span className="material-symbols-outlined">school</span>
                            </div>
                            <h2 className="text-[#171212] dark:text-white text-lg font-bold tracking-tight">PPSDM KMM</h2>
                        </div>
                        {/* Navigation Links */}
                        <nav className="hidden md:flex items-center gap-8">
                            <Link className="text-[#171212] dark:text-white hover:text-[#c72929] text-sm font-medium transition-colors" href="/dashboard">Dashboard</Link>
                            <Link className="text-[#c72929] text-sm font-bold border-b-2 border-[#c72929] py-5" href="/rpi">RPI Plan</Link>
                            <Link className="text-[#171212] dark:text-white hover:text-[#c72929] text-sm font-medium transition-colors" href="#">Courses</Link>
                            <Link className="text-[#171212] dark:text-white hover:text-[#c72929] text-sm font-medium transition-colors" href="/profile">Profile</Link>
                        </nav>
                        {/* User & Logout */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-center bg-no-repeat bg-cover rounded-full size-9 border border-[#e4dcdc]" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBTU_D-RtgdJKQU4vUzVjar8upJ_ztergu28Yb13GCSctvuOkQM8pwt2fjM_tbTf5gHazxa6kcgo-7YF6tpMjRoyfEqj_VVueW1I35RUAqvVIl-N1rGJ417esdpNdurwiUKdAlIHIXu6PgIiUv85uhZfrmvr8AT_NHZUawpsN-AD60cHY6zh45N-tj-1a8ua37xl9ysV56L1lgF2EC6rSc17z2WJD_racuVbpqcXhYX-B-4hXBqQXYVBtFBc0EczjmSm9xhGvh4dYE')" }}></div>
                                <div className="hidden lg:block text-xs">
                                    <p className="font-bold text-[#171212] dark:text-white">Alex Johnson</p>
                                    <p className="text-[#856666]">Comp. Engineering</p>
                                </div>
                            </div>
                            <button className="flex items-center justify-center rounded-lg h-9 px-4 bg-[#c72929]/10 hover:bg-[#c72929]/20 text-[#c72929] text-sm font-bold transition-colors">
                                <span className="material-symbols-outlined text-[18px] mr-2">logout</span>
                                <span>Log Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header & Stats Section */}
                <div className="mb-8 space-y-6">
                    {/* Page Heading */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-xl border border-[#e4dcdc] shadow-sm">
                        <div className="space-y-1">
                            <h1 className="text-3xl font-black tracking-tight text-[#171212] dark:text-white">Individual Development Plan (RPI)</h1>
                            <p className="text-[#856666] text-base max-w-2xl">Map your academic and career journey from now until graduation. Drag milestones to plan your path.</p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                            <div className="flex items-center gap-2 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full border border-yellow-200 text-sm font-medium">
                                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                                Status: Draft
                            </div>
                            <button className="flex items-center justify-center rounded-lg h-11 px-6 bg-[#c72929] hover:bg-red-700 text-white text-sm font-bold shadow-md transition-all active:scale-95">
                                <span className="material-symbols-outlined mr-2">send</span>
                                Submit to Supervisor
                            </button>
                        </div>
                    </div>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-zinc-900 p-5 rounded-lg border border-[#e4dcdc] shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-[#856666] text-sm font-medium mb-1">Total Credits</p>
                                <p className="text-2xl font-bold text-[#171212] dark:text-white">112 <span className="text-[#856666] text-lg font-normal">/ 144</span></p>
                            </div>
                            <div className="size-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                <span className="material-symbols-outlined">pie_chart</span>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-zinc-900 p-5 rounded-lg border border-[#e4dcdc] shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-[#856666] text-sm font-medium mb-1">Pending Approval</p>
                                <p className="text-2xl font-bold text-[#171212] dark:text-white">3 <span className="text-[#856666] text-lg font-normal">Milestones</span></p>
                            </div>
                            <div className="size-10 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center">
                                <span className="material-symbols-outlined">pending_actions</span>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-zinc-900 p-5 rounded-lg border border-[#e4dcdc] shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-[#856666] text-sm font-medium mb-1">Graduation Target</p>
                                <p className="text-2xl font-bold text-[#171212] dark:text-white">July 2025</p>
                            </div>
                            <div className="size-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                                <span className="material-symbols-outlined">school</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Split Layout: Timeline (Left) & Toolbox (Right) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* LEFT COLUMN: Vertical Timeline */}
                    <div className="lg:col-span-8 xl:col-span-9 relative">
                        {/* Timeline Vertical Line */}
                        <div className="timeline-line absolute left-[24px] top-0 bottom-0 w-[2px] bg-[#e4dcdc] z-0"></div>
                        <div className="space-y-12 pb-20">
                            {/* Semester Node: Current */}
                            <div className="relative pl-16 group">
                                {/* Node Circle */}
                                <div className="absolute left-0 top-0 size-12 bg-white border-2 border-[#c72929] rounded-full flex items-center justify-center z-10 shadow-sm">
                                    <span className="material-symbols-outlined text-[#c72929]">play_arrow</span>
                                </div>
                                {/* Header */}
                                <div className="flex items-center justify-between mb-4 pt-2">
                                    <div>
                                        <h3 className="text-lg font-bold text-[#171212] dark:text-white">Semester 4 (Current)</h3>
                                        <p className="text-sm text-[#856666]">Feb 2024 - Jun 2024 • 24 Credits</p>
                                    </div>
                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded uppercase tracking-wider">Active</span>
                                </div>
                                {/* Cards Container */}
                                <div className="space-y-3">
                                    {/* Approved Card */}
                                    <div className="bg-white dark:bg-zinc-900 border border-[#e4dcdc] hover:border-[#c72929]/50 transition-colors p-4 rounded-lg shadow-sm flex gap-4 cursor-move group/card relative">
                                        <div className="text-[#856666]/30 group-hover/card:text-[#856666] pt-1">
                                            <span className="material-symbols-outlined">drag_indicator</span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-[#171212] dark:text-white">Research Methodology</h4>
                                                <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs font-medium">
                                                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                                    Approved
                                                </div>
                                            </div>
                                            <p className="text-sm text-[#856666] mt-1">Core Subject • 3 Credits</p>
                                        </div>
                                    </div>
                                    {/* Pending Card */}
                                    <div className="bg-white dark:bg-zinc-900 border border-[#e4dcdc] hover:border-[#c72929]/50 transition-colors p-4 rounded-lg shadow-sm flex gap-4 cursor-move group/card relative">
                                        <div className="text-[#856666]/30 group-hover/card:text-[#856666] pt-1">
                                            <span className="material-symbols-outlined">drag_indicator</span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-[#171212] dark:text-white">Student Council Leadership</h4>
                                                <div className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded text-xs font-medium">
                                                    <span className="material-symbols-outlined text-[14px]">pending</span>
                                                    Pending
                                                </div>
                                            </div>
                                            <p className="text-sm text-[#856666] mt-1">Organization • Extra-curricular</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Semester Node: Upcoming */}
                            <div className="relative pl-16 group">
                                {/* Node Circle */}
                                <div className="absolute left-0 top-0 size-12 bg-white border-2 border-[#e4dcdc] group-hover:border-[#c72929] transition-colors rounded-full flex items-center justify-center z-10">
                                    <span className="material-symbols-outlined text-[#856666] group-hover:text-[#c72929] transition-colors">calendar_month</span>
                                </div>
                                {/* Header */}
                                <div className="flex items-center justify-between mb-4 pt-2">
                                    <div>
                                        <h3 className="text-lg font-bold text-[#171212] dark:text-white">Semester 5 (Upcoming)</h3>
                                        <p className="text-sm text-[#856666]">Aug 2024 - Dec 2024 • Planned</p>
                                    </div>
                                </div>
                                {/* Cards Container */}
                                <div className="space-y-3">
                                    {/* Pending Card */}
                                    <div className="bg-white dark:bg-zinc-900 border border-[#e4dcdc] hover:border-[#c72929]/50 transition-colors p-4 rounded-lg shadow-sm flex gap-4 cursor-move group/card relative">
                                        <div className="text-[#856666]/30 group-hover/card:text-[#856666] pt-1">
                                            <span className="material-symbols-outlined">drag_indicator</span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-[#171212] dark:text-white">Internship Application (KP)</h4>
                                                <div className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded text-xs font-medium">
                                                    <span className="material-symbols-outlined text-[14px]">pending</span>
                                                    Pending Review
                                                </div>
                                            </div>
                                            <p className="text-sm text-[#856666] mt-1">Career Prep • Submit by Oct 15</p>
                                        </div>
                                    </div>
                                    {/* Empty State Drop Zone */}
                                    <div className="border-2 border-dashed border-[#e4dcdc] rounded-lg p-4 flex flex-col items-center justify-center text-center bg-[#f8f6f6]/50 hover:bg-[#c72929]/5 hover:border-[#c72929]/30 transition-all cursor-copy min-h-[80px]">
                                        <span className="text-[#856666] text-sm font-medium">Drag items here to plan</span>
                                    </div>
                                </div>
                            </div>
                            {/* Semester Node: Future */}
                            <div className="relative pl-16 group">
                                {/* Node Circle */}
                                <div className="absolute left-0 top-0 size-12 bg-white border-2 border-[#e4dcdc] rounded-full flex items-center justify-center z-10">
                                    <span className="text-[#856666] font-bold text-sm">S6</span>
                                </div>
                                {/* Header */}
                                <div className="flex items-center justify-between mb-4 pt-2">
                                    <div>
                                        <h3 className="text-lg font-bold text-[#171212] dark:text-white">Semester 6</h3>
                                        <p className="text-sm text-[#856666]">Feb 2025 - Jun 2025</p>
                                    </div>
                                </div>
                                {/* Cards Container */}
                                <div className="space-y-3">
                                    {/* Pending Card */}
                                    <div className="bg-white dark:bg-zinc-900 border border-[#e4dcdc] hover:border-[#c72929]/50 transition-colors p-4 rounded-lg shadow-sm flex gap-4 cursor-move group/card relative opacity-80 hover:opacity-100">
                                        <div className="text-[#856666]/30 group-hover/card:text-[#856666] pt-1">
                                            <span className="material-symbols-outlined">drag_indicator</span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-[#171212] dark:text-white">Community Service (KKN)</h4>
                                                <div className="flex items-center gap-1 text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded text-xs font-medium">
                                                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                                                    Draft
                                                </div>
                                            </div>
                                            <p className="text-sm text-[#856666] mt-1">Required • 4 Credits</p>
                                        </div>
                                    </div>
                                    {/* Empty State Drop Zone */}
                                    <div className="border-2 border-dashed border-[#e4dcdc] rounded-lg p-4 flex flex-col items-center justify-center text-center bg-[#f8f6f6]/50 hover:bg-[#c72929]/5 hover:border-[#c72929]/30 transition-all cursor-copy min-h-[80px]">
                                        <span className="text-[#856666] text-sm font-medium">Drag items here to plan</span>
                                    </div>
                                </div>
                            </div>
                            {/* Graduation Goal */}
                            <div className="relative pl-16 pt-4">
                                <div className="absolute left-0 top-4 size-12 bg-[#c72929] text-white border-4 border-white shadow-md rounded-full flex items-center justify-center z-10">
                                    <span className="material-symbols-outlined">flag</span>
                                </div>
                                <div className="border-t-2 border-[#e4dcdc] border-dashed mt-6 pt-6">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-xl font-black text-[#171212] dark:text-white">GRADUATION GOAL</h3>
                                        <span className="bg-[#c72929]/10 text-[#c72929] px-3 py-1 rounded-full text-xs font-bold">JULY 2025</span>
                                    </div>
                                    <p className="text-[#856666] text-sm mt-1">Final Year Project & Defense Completed</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* RIGHT COLUMN: Sticky Toolbox */}
                    <div className="lg:col-span-4 xl:col-span-3">
                        <div className="sticky top-24 space-y-6">
                            {/* Toolbox Header */}
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-[#171212] dark:text-white">Planning Toolbox</h3>
                                <span className="material-symbols-outlined text-[#856666]" title="Help">help</span>
                            </div>
                            {/* Draggable Categories */}
                            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-[#e4dcdc] shadow-lg p-4 space-y-6">
                                {/* Category 1 */}
                                <div>
                                    <h4 className="text-xs font-bold text-[#856666] uppercase tracking-wider mb-3">Academics</h4>
                                    <div className="space-y-2">
                                        <div className="bg-[#f8f6f6] dark:bg-zinc-800 p-3 rounded-lg border border-[#e4dcdc] hover:border-[#c72929] hover:shadow-md cursor-grab active:cursor-grabbing transition-all flex items-center gap-3 group">
                                            <span className="material-symbols-outlined text-blue-600 bg-blue-50 p-1.5 rounded-md text-[20px]">menu_book</span>
                                            <div className="flex-1">
                                                <p className="font-bold text-sm text-[#171212] dark:text-white group-hover:text-[#c72929]">Major Course</p>
                                                <p className="text-xs text-[#856666]">Core / Elective</p>
                                            </div>
                                            <span className="material-symbols-outlined text-[#856666]/50 text-[18px]">drag_pan</span>
                                        </div>
                                        <div className="bg-[#f8f6f6] dark:bg-zinc-800 p-3 rounded-lg border border-[#e4dcdc] hover:border-[#c72929] hover:shadow-md cursor-grab active:cursor-grabbing transition-all flex items-center gap-3 group">
                                            <span className="material-symbols-outlined text-purple-600 bg-purple-50 p-1.5 rounded-md text-[20px]">science</span>
                                            <div className="flex-1">
                                                <p className="font-bold text-sm text-[#171212] dark:text-white group-hover:text-[#c72929]">Lab Work</p>
                                                <p className="text-xs text-[#856666]">Practical Session</p>
                                            </div>
                                            <span className="material-symbols-outlined text-[#856666]/50 text-[18px]">drag_pan</span>
                                        </div>
                                    </div>
                                </div>
                                {/* Category 2 */}
                                <div>
                                    <h4 className="text-xs font-bold text-[#856666] uppercase tracking-wider mb-3">Enrichment</h4>
                                    <div className="space-y-2">
                                        <div className="bg-[#f8f6f6] dark:bg-zinc-800 p-3 rounded-lg border border-[#e4dcdc] hover:border-[#c72929] hover:shadow-md cursor-grab active:cursor-grabbing transition-all flex items-center gap-3 group">
                                            <span className="material-symbols-outlined text-orange-600 bg-orange-50 p-1.5 rounded-md text-[20px]">groups</span>
                                            <div className="flex-1">
                                                <p className="font-bold text-sm text-[#171212] dark:text-white group-hover:text-[#c72929]">Organization</p>
                                                <p className="text-xs text-[#856666]">Club / Committee</p>
                                            </div>
                                            <span className="material-symbols-outlined text-[#856666]/50 text-[18px]">drag_pan</span>
                                        </div>
                                        <div className="bg-[#f8f6f6] dark:bg-zinc-800 p-3 rounded-lg border border-[#e4dcdc] hover:border-[#c72929] hover:shadow-md cursor-grab active:cursor-grabbing transition-all flex items-center gap-3 group">
                                            <span className="material-symbols-outlined text-teal-600 bg-teal-50 p-1.5 rounded-md text-[20px]">workspace_premium</span>
                                            <div className="flex-1">
                                                <p className="font-bold text-sm text-[#171212] dark:text-white group-hover:text-[#c72929]">Certification</p>
                                                <p className="text-xs text-[#856666]">Skill / Language</p>
                                            </div>
                                            <span className="material-symbols-outlined text-[#856666]/50 text-[18px]">drag_pan</span>
                                        </div>
                                        <div className="bg-[#f8f6f6] dark:bg-zinc-800 p-3 rounded-lg border border-[#e4dcdc] hover:border-[#c72929] hover:shadow-md cursor-grab active:cursor-grabbing transition-all flex items-center gap-3 group">
                                            <span className="material-symbols-outlined text-pink-600 bg-pink-50 p-1.5 rounded-md text-[20px]">work</span>
                                            <div className="flex-1">
                                                <p className="font-bold text-sm text-[#171212] dark:text-white group-hover:text-[#c72929]">Internship</p>
                                                <p className="text-xs text-[#856666]">Professional Exp</p>
                                            </div>
                                            <span className="material-symbols-outlined text-[#856666]/50 text-[18px]">drag_pan</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Quick Info */}
                            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex gap-3 items-start">
                                <span className="material-symbols-outlined text-blue-600 text-lg mt-0.5">info</span>
                                <p className="text-sm text-blue-800">
                                    Approved plans (Green) cannot be moved without supervisor permission.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <style jsx>{`
                /* Custom scrollbar for cleaner look */
                ::-webkit-scrollbar {
                    width: 8px;
                }
                ::-webkit-scrollbar-track {
                    background: transparent;
                }
                ::-webkit-scrollbar-thumb {
                    background: #e4dcdc;
                    border-radius: 4px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: #c72929;
                }
            `}</style>
        </div>
    );
}
