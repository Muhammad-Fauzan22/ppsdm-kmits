"use client";

import Link from "next/link";

export default function SupervisorPage() {
    const mentees = [
        {
            name: "Aisyah Pratiwi",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAo-r3v6lImK1nM4G0xB4Tqx3T4r2xV3Xw2Y6Z7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6K7L8M9N0O1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4C5D6E7F8G9H0",
            status: "On Track",
            statusColor: "green",
            progress: 85,
            lastContact: "yesterday",
            nextMeeting: "Mar 15, 10:00 AM",
        },
        {
            name: "Budi Santoso",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCn3ZodjtJSdCyz9Q0YhcDqYNL1bWr3xGv7sqilJ9GL0xzCCXJi3VU4PubRff2MwlT6G9Kgc_jxEfy0z8fBc2_yYWnNzzwKgyaDllmbqC3VF0M2UDBxQTuYiTqgmZTiaABEXpFZF-MPHGknI_oceSLFANcZANzXPZe9ITjnjkev150zoG6Q-cuCgyENTtO6BP74C8nGUsm-O0slGzbWTcF5UhLaGOszY3EFyfdcL4GrCzVlA2bR8xxO8-eQaerBB-rn1sn2UxOHc6E",
            status: "Needs Attention",
            statusColor: "yellow",
            progress: 60,
            lastContact: "5 days ago",
            nextMeeting: "Reschedule Required",
        },
        {
            name: "Citra Dewi",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAUKsIbSOxCQtEs6YlxaaFq8t-XkUPH2OZKBBeDF2SMaEf0q5Mm3LhgHEnXDt0MAkYph2_sISQoZDwI8GbutO2SY2VsllL_biFUE2rA5o7-3e6utVe3RJqZewQWAUIZOjJtGReKpGfLaKsHfEXjJdUZjZQT3UwJ6QKqK4_xy2wJ3EXED4jfW0hSXU6bKYFVVpWzgHooNe8MHyMANajkXSIZVx-TuJrciJbDL5OpSxGhsPQbLq4S5lVqVFcqHy3VimTPJ2mHMsl6yt8",
            status: "On Track",
            statusColor: "green",
            progress: 92,
            lastContact: "today",
            nextMeeting: "Mar 10, 2:00 PM",
        },
    ];

    return (
        <div className="min-h-screen bg-[#f4f2f7] dark:bg-[#1a1625] font-display text-[#1e1529] dark:text-white flex flex-col">
            {/* Full-width Header */}
            <header className="bg-white dark:bg-[#251f30] border-b border-[#e1dce8] dark:border-[#3a2e4a] px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="size-10 bg-gradient-to-br from-[#7c3aed] to-[#6d28d9] rounded-xl flex items-center justify-center text-white shadow-md shadow-purple-500/30">
                            <span className="material-symbols-outlined">groups</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold">Supervisor Portal</h1>
                            <p className="text-xs text-[#7c6c91] dark:text-gray-400">PPSDM KMITS</p>
                        </div>
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-4 py-2 rounded-lg font-medium text-sm shadow-sm transition-colors">
                        <span className="material-symbols-outlined text-[18px]">calendar_add_on</span>
                        Schedule Session
                    </button>
                    <div className="relative">
                        <span className="absolute -top-1 -right-1 size-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                            3
                        </span>
                        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                            <span className="material-symbols-outlined text-[#7c6c91] dark:text-gray-400">notifications</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-8">
                <div className="max-w-6xl mx-auto space-y-8">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white dark:bg-[#251f30] rounded-xl p-5 border border-[#e1dce8] dark:border-[#3a2e4a] shadow-sm">
                            <div className="flex items-center gap-3 text-[#7c6c91] dark:text-gray-400 text-sm font-medium mb-2">
                                <span className="material-symbols-outlined text-[20px] text-[#7c3aed]">group</span>
                                Total Mentees
                            </div>
                            <p className="text-3xl font-bold">12</p>
                        </div>
                        <div className="bg-white dark:bg-[#251f30] rounded-xl p-5 border border-[#e1dce8] dark:border-[#3a2e4a] shadow-sm">
                            <div className="flex items-center gap-3 text-[#7c6c91] dark:text-gray-400 text-sm font-medium mb-2">
                                <span className="material-symbols-outlined text-[20px] text-green-500">check_circle</span>
                                On Track
                            </div>
                            <p className="text-3xl font-bold text-green-600 dark:text-green-400">10</p>
                        </div>
                        <div className="bg-white dark:bg-[#251f30] rounded-xl p-5 border border-[#e1dce8] dark:border-[#3a2e4a] shadow-sm">
                            <div className="flex items-center gap-3 text-[#7c6c91] dark:text-gray-400 text-sm font-medium mb-2">
                                <span className="material-symbols-outlined text-[20px] text-yellow-500">warning</span>
                                Needs Attention
                            </div>
                            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">2</p>
                        </div>
                        <div className="bg-white dark:bg-[#251f30] rounded-xl p-5 border border-[#e1dce8] dark:border-[#3a2e4a] shadow-sm">
                            <div className="flex items-center gap-3 text-[#7c6c91] dark:text-gray-400 text-sm font-medium mb-2">
                                <span className="material-symbols-outlined text-[20px] text-[#7c3aed]">event</span>
                                This Week
                            </div>
                            <p className="text-3xl font-bold">5</p>
                            <p className="text-xs text-[#7c6c91]">scheduled sessions</p>
                        </div>
                    </div>

                    {/* Mentee Network Section */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">My Mentees</h2>
                            <div className="flex items-center gap-2 text-sm">
                                <button className="px-3 py-1.5 rounded-lg bg-[#7c3aed]/10 text-[#7c3aed] font-medium">All</button>
                                <button className="px-3 py-1.5 rounded-lg text-[#7c6c91] hover:bg-gray-100 dark:hover:bg-gray-800">On Track</button>
                                <button className="px-3 py-1.5 rounded-lg text-[#7c6c91] hover:bg-gray-100 dark:hover:bg-gray-800">Needs Attention</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {mentees.map((mentee, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white dark:bg-[#251f30] rounded-xl p-5 border border-[#e1dce8] dark:border-[#3a2e4a] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div
                                            className="size-14 rounded-full bg-cover bg-center border-2 border-[#7c3aed]/30"
                                            style={{ backgroundImage: `url("${mentee.avatar}")` }}
                                        ></div>
                                        <div className="flex-1">
                                            <h3 className="font-bold group-hover:text-[#7c3aed] transition-colors">{mentee.name}</h3>
                                            <span
                                                className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${mentee.statusColor === "green"
                                                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                                        : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                                                    }`}
                                            >
                                                <span className={`w-1.5 h-1.5 rounded-full ${mentee.statusColor === "green" ? "bg-green-500" : "bg-yellow-500"}`}></span>
                                                {mentee.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <div className="flex justify-between text-xs text-[#7c6c91] dark:text-gray-400 mb-1">
                                                <span>Goal Progress</span>
                                                <span className="font-bold text-[#1e1529] dark:text-white">{mentee.progress}%</span>
                                            </div>
                                            <div className="h-2 bg-[#e1dce8] dark:bg-[#3a2e4a] rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] rounded-full"
                                                    style={{ width: `${mentee.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between text-xs text-[#7c6c91] dark:text-gray-400 pt-2 border-t border-[#e1dce8] dark:border-[#3a2e4a]">
                                            <span>Last contact: {mentee.lastContact}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium text-[#7c3aed]">
                                                <span className="material-symbols-outlined text-[14px] align-middle mr-1">event</span>
                                                {mentee.nextMeeting}
                                            </span>
                                            <button className="p-1.5 rounded-full bg-[#7c3aed]/10 text-[#7c3aed] hover:bg-[#7c3aed]/20 transition-colors group-hover:scale-110">
                                                <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
