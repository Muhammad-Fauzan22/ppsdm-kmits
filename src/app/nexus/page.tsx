"use client";

import Link from "next/link";

export default function NexusDashboard() {
    return (
        <div className="min-h-screen bg-[#102216] text-white font-display flex overflow-hidden selection:bg-[#13ec5b] selection:text-[#102216]">
            {/* Left Panel: Navigation & Profile */}
            <aside className="w-72 flex flex-col border-r border-[#3b5443]/30 bg-[#141e18] h-screen shrink-0 z-20">
                {/* Logo Area */}
                <div className="p-6 pb-2">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-gradient-to-tr from-[#13ec5b] to-emerald-700 flex items-center justify-center shadow-[0_0_15px_rgba(19,236,91,0.3)]">
                            <span className="material-symbols-outlined text-[#102216]" style={{ fontSize: "24px" }}>
                                hub
                            </span>
                        </div>
                        <div>
                            <h1 className="text-white text-lg font-bold tracking-wide leading-none">PPSDM KMITS</h1>
                            <p className="text-[#13ec5b] text-xs font-normal tracking-wider opacity-80">NEXUS v2.4</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 flex flex-col gap-2 overflow-y-auto">
                    <Link
                        href="/nexus"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#13ec5b]/10 border border-[#13ec5b]/20 text-white group transition-all hover:bg-[#13ec5b]/20"
                    >
                        <span className="material-symbols-outlined text-[#13ec5b] group-hover:scale-110 transition-transform">
                            dashboard
                        </span>
                        <span className="font-medium">My Nexus</span>
                    </Link>
                    <Link
                        href="/portfolio"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-all"
                    >
                        <span className="material-symbols-outlined">folder_open</span>
                        <span className="font-medium">Portfolio</span>
                    </Link>
                    <Link
                        href="/mentorship"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-all"
                    >
                        <span className="material-symbols-outlined">groups</span>
                        <span className="font-medium">Mentors</span>
                    </Link>
                </nav>

                {/* Profile & Well-being Widget */}
                <div className="p-4 mt-auto">
                    <div className="bg-[#1a2c22] rounded-xl p-5 border border-[#3b5443]/50 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div
                                className="size-12 rounded-full bg-cover bg-center border-2 border-[#13ec5b]/30"
                                style={{
                                    backgroundImage:
                                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCn3ZodjtJSdCyz9Q0YhcDqYNL1bWr3xGv7sqilJ9GL0xzCCXJi3VU4PubRff2MwlT6G9Kgc_jxEfy0z8fBc2_yYWnNzzwKgyaDllmbqC3VF0M2UDBxQTuYiTqgmZTiaABEXpFZF-MPHGknI_oceSLFANcZANzXPZe9ITjnjkev150zoG6Q-cuCgyENTtO6BP74C8nGUsm-O0slGzbWTcF5UhLaGOszY3EFyfdcL4GrCzVlA2bR8xxO8-eQaerBB-rn1sn2UxOHc6E')",
                                }}
                            ></div>
                            <div>
                                <h3 className="text-white font-semibold text-sm">Alex Johnson</h3>
                                <p className="text-gray-400 text-xs">Junior • Sem 2</p>
                            </div>
                        </div>
                        <div className="h-px bg-[#3b5443]/50 w-full"></div>
                        {/* Well-being Radial */}
                        <div className="flex items-center justify-between">
                            <div className="relative size-16">
                                <div
                                    className="absolute inset-0 rounded-full"
                                    style={{ background: "conic-gradient(#13ec5b 84%, #28392e 0)" }}
                                ></div>
                                <div className="absolute inset-1 bg-[#1a2c22] rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">84%</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-xs text-gray-400 uppercase tracking-wider">Well-being</span>
                                <span className="text-[#13ec5b] font-bold text-lg">Good</span>
                                <span className="text-[10px] text-gray-500">+5% this week</span>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Center Panel: Main Dashboard */}
            <main className="flex-1 flex flex-col h-screen overflow-y-auto relative z-10 scroll-smooth">
                {/* Header */}
                <header className="px-8 pt-8 pb-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">Welcome back, Alex.</h2>
                    <p className="text-gray-400">Your digital nervous system is active and synchronized.</p>
                </header>

                <div className="p-8 flex flex-col gap-8">
                    {/* Row 1: Pulse Check & Recommended Action */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Pulse Check Widget */}
                        <div className="lg:col-span-5 flex flex-col gap-4">
                            <div className="bg-[#1a2c22] rounded-2xl p-6 border border-[#3b5443]/50 shadow-lg relative overflow-hidden group">
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#13ec5b]/10 rounded-full blur-3xl group-hover:bg-[#13ec5b]/20 transition-all duration-700"></div>
                                <div className="flex justify-between items-center mb-6 relative z-10">
                                    <h3 className="text-white font-medium text-lg">Pulse Check</h3>
                                    <span className="text-xs font-mono text-[#13ec5b] bg-[#13ec5b]/10 px-2 py-1 rounded">
                                        DAILY SYNC
                                    </span>
                                </div>
                                <div className="flex justify-between px-2 mb-4 text-gray-400">
                                    {["sentiment_very_dissatisfied", "sentiment_dissatisfied", "sentiment_neutral", "sentiment_satisfied", "sentiment_very_satisfied"].map(
                                        (icon, idx) => (
                                            <span
                                                key={idx}
                                                className={`material-symbols-outlined hover:text-[#13ec5b] cursor-pointer transition-colors ${idx === 3 ? "text-[#13ec5b] scale-125 drop-shadow-[0_0_8px_rgba(19,236,91,0.5)]" : ""
                                                    }`}
                                            >
                                                {icon}
                                            </span>
                                        )
                                    )}
                                </div>
                                <p className="text-center text-sm text-gray-400 mt-2">
                                    Energy Level: <span className="text-white font-medium">Resilient</span>
                                </p>
                            </div>
                            {/* Mini Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#1a2c22] rounded-xl p-4 border border-[#3b5443]/30 flex flex-col items-center justify-center gap-1">
                                    <span className="text-2xl font-bold text-white">12</span>
                                    <span className="text-xs text-gray-400 uppercase tracking-wide">Active Goals</span>
                                </div>
                                <div className="bg-[#1a2c22] rounded-xl p-4 border border-[#3b5443]/30 flex flex-col items-center justify-center gap-1">
                                    <span className="text-2xl font-bold text-white">4</span>
                                    <span className="text-xs text-gray-400 uppercase tracking-wide">Badges</span>
                                </div>
                            </div>
                        </div>

                        {/* Next Recommended Action (Hero) */}
                        <div className="lg:col-span-7">
                            <div className="h-full bg-gradient-to-br from-[#1a2c22] to-[#102216] rounded-2xl border border-[#13ec5b]/40 p-8 flex flex-col justify-between relative overflow-hidden group">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                                <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#13ec5b]/5 rounded-full blur-[80px]"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="flex size-2 bg-[#13ec5b] rounded-full animate-pulse"></span>
                                        <span className="text-[#13ec5b] text-xs font-bold tracking-widest uppercase">High Priority</span>
                                    </div>
                                    <h3 className="text-3xl font-bold text-white mb-2 leading-tight">
                                        Complete Peer Review for Leadership Module
                                    </h3>
                                    <p className="text-gray-300 max-w-md">
                                        Your input is pending for 3 team members. This activity contributes to your Social & Leadership
                                        tracks.
                                    </p>
                                </div>
                                <div className="relative z-10 mt-8 flex items-center gap-4">
                                    <button className="bg-[#13ec5b] hover:bg-green-400 text-[#102216] font-bold text-base px-8 py-3 rounded-lg shadow-[0_0_20px_rgba(19,236,91,0.2)] hover:shadow-[0_0_30px_rgba(19,236,91,0.4)] transition-all flex items-center gap-2">
                                        <span>Start Action</span>
                                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </button>
                                    <span className="text-sm text-gray-500 font-medium">~15 mins est.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Growth Timeline Section */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between px-1">
                            <h3 className="text-xl font-bold text-white">Growth Timeline</h3>
                            <div className="flex gap-2">
                                <button className="size-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 text-gray-400">
                                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                                </button>
                                <button className="size-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 text-gray-400">
                                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                                </button>
                            </div>
                        </div>
                        <div className="bg-[#1a2c22] rounded-2xl border border-[#3b5443]/30 p-6 overflow-x-auto relative">
                            {/* Timeline Tracks */}
                            <div className="min-w-[800px] flex flex-col gap-6 relative z-10">
                                {/* Dates Header */}
                                <div className="flex text-xs text-gray-500 uppercase tracking-widest pl-24 mb-2">
                                    {["Oct 10", "Oct 17", "Today", "Oct 31", "Nov 07", "Nov 14"].map((date, idx) => (
                                        <div key={idx} className={`w-32 ${idx === 2 ? "text-[#13ec5b] font-bold" : ""}`}>
                                            {date}
                                        </div>
                                    ))}
                                </div>
                                {/* Track 1: Academic */}
                                <div className="flex items-center group">
                                    <div className="w-24 text-gray-400 font-medium text-sm shrink-0 flex items-center gap-2">
                                        <span className="size-2 rounded-full bg-blue-400"></span> Academic
                                    </div>
                                    <div className="flex-1 relative h-8 flex items-center">
                                        <div className="absolute inset-x-0 h-1 bg-white/5 rounded"></div>
                                        <div className="absolute left-10 top-1/2 -translate-y-1/2 size-3 rounded-full bg-blue-400 border-2 border-[#1a2c22]"></div>
                                    </div>
                                </div>
                                {/* Track 2: Leadership */}
                                <div className="flex items-center group">
                                    <div className="w-24 text-gray-400 font-medium text-sm shrink-0 flex items-center gap-2">
                                        <span className="size-2 rounded-full bg-purple-400"></span> Leadership
                                    </div>
                                    <div className="flex-1 relative h-8 flex items-center">
                                        <div className="absolute inset-x-0 h-1 bg-white/5 rounded"></div>
                                        <div className="absolute left-[280px] top-1/2 -translate-y-1/2 h-6 px-3 rounded-full bg-purple-500/20 border border-purple-500 text-purple-300 text-[10px] font-bold flex items-center justify-center backdrop-blur-sm z-10">
                                            Peer Review
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Right Panel: Contextual Widgets */}
            <aside className="w-80 flex flex-col border-l border-[#3b5443]/30 bg-[#141e18]/50 h-screen shrink-0 overflow-y-auto p-6 gap-6">
                {/* Mentor Status */}
                <div className="flex flex-col gap-3">
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wide">Mentor Status</h4>
                    <div className="bg-[#1a2c22] rounded-xl p-4 border border-[#3b5443]/50 flex items-center gap-4 hover:border-[#13ec5b]/40 transition-colors cursor-pointer group">
                        <div className="relative">
                            <div
                                className="size-12 rounded-full bg-cover bg-center"
                                style={{
                                    backgroundImage:
                                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCQCJ4exQDRoJGnUNVS7DpyHl9JtenoLwQPKGzlCsC6njz5M_3X-TXO5_HNBCerg1WplvWouk120DnWsuDmrxzzp-qW3RBJCt-YbkK7xbIMAxjEDDCHS6B9wE1PexnoQvci6cravQ2-BWVIfdiB1r_4Ijcw965hbF1LD4MaHjTPLZtf5nfR9ZMdxSDJ1pdzWk5-_qhVjC39o3uQFJ6vBrzbZrg_UJEjQyizYyvjRt2_yFWpwyWtk5Ee0BHVo0OAPZnsZPON5D46-Nc')",
                                }}
                            ></div>
                            <div className="absolute bottom-0 right-0 size-3 bg-[#13ec5b] border-2 border-[#1a2c22] rounded-full animate-pulse"></div>
                        </div>
                        <div className="flex-1">
                            <h5 className="text-white font-medium text-sm">Dr. Aris</h5>
                            <p className="text-[#13ec5b] text-xs">Online Now</p>
                        </div>
                        <button className="text-gray-400 hover:text-white group-hover:bg-white/10 p-2 rounded-full transition-all">
                            <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
                        </button>
                    </div>
                </div>

                {/* Deadlines Widget */}
                <div className="flex flex-col gap-3 flex-1">
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wide">Closest Deadlines</h4>
                    <div className="flex flex-col gap-2">
                        {/* Item 1: Urgent */}
                        <div className="bg-[#1a2c22] rounded-xl p-4 border-l-4 border-l-red-500 border-y border-r border-[#3b5443]/30 flex flex-col gap-2">
                            <div className="flex justify-between items-start">
                                <h5 className="text-white text-sm font-medium leading-tight">Physics Lab Report</h5>
                                <span className="bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded">2h left</span>
                            </div>
                            <p className="text-gray-500 text-xs">Academic Track</p>
                        </div>
                        {/* Item 2: Medium */}
                        <div className="bg-[#1a2c22] rounded-xl p-4 border-l-4 border-l-yellow-500 border-y border-r border-[#3b5443]/30 flex flex-col gap-2">
                            <div className="flex justify-between items-start">
                                <h5 className="text-white text-sm font-medium leading-tight">Scholarship Essay</h5>
                                <span className="bg-yellow-500/20 text-yellow-400 text-[10px] font-bold px-2 py-0.5 rounded">2d left</span>
                            </div>
                            <p className="text-gray-500 text-xs">Personal Track</p>
                        </div>
                    </div>
                </div>

                {/* Upcoming Event */}
                <div className="mt-auto bg-gradient-to-br from-[#13ec5b]/20 to-transparent rounded-xl p-4 border border-[#13ec5b]/20">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-[#13ec5b]">event_upcoming</span>
                        <span className="text-white font-medium text-sm">Upcoming Event</span>
                    </div>
                    <p className="text-white text-xs mb-3">Campus Innovation Hackathon registration closes soon.</p>
                    <button className="w-full py-2 rounded bg-[#1a2c22] hover:bg-white/10 text-white text-xs font-medium transition-colors border border-white/10">
                        View Details
                    </button>
                </div>
            </aside>
        </div>
    );
}
