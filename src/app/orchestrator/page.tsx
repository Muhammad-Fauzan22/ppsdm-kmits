"use client";

import Link from "next/link";

export default function OrchestratorPage() {
    const stats = [
        { label: "Active Programs", value: "12", change: "+2 this week", icon: "rocket_launch", positive: true },
        { label: "Total Registrants", value: "1,850", change: "↑ 15% vs LY", icon: "groups", positive: true },
        { label: "Avg. Engagement", value: "88%", change: "+5% trend", icon: "monitoring", positive: true },
        { label: "Success Probability", value: "94%", change: "stable", icon: "verified", positive: false },
    ];

    const programs = [
        { name: "Leadership Training 101", type: "Soft Skills", status: "Active", statusColor: "green", participants: 450 },
        { name: "Python for Data Science", type: "Technical", status: "Draft", statusColor: "yellow", participants: 0 },
        { name: "Public Speaking Workshop", type: "Communication", status: "Active", statusColor: "green", participants: 300 },
    ];

    return (
        <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#101622] font-display text-[#111318] dark:text-white flex flex-col">
            {/* SideNavBar */}
            <div className="flex h-screen w-full overflow-hidden">
                <aside className="w-64 flex-shrink-0 bg-white dark:bg-[#1a202c] border-r border-[#f0f2f4] dark:border-[#2d3748] flex flex-col justify-between hidden md:flex">
                    <div className="flex flex-col h-full">
                        {/* Brand */}
                        <div className="p-4 border-b border-[#f0f2f4] dark:border-[#2d3748]">
                            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                                <div
                                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                                    style={{
                                        backgroundImage:
                                            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCR7hEcbUO5Jn_EHXGXPP3Zw7lWn-OB_ROVWUegWzjH-0CLGh7JDc0BKh8yFbfPYcZs5OFJz6qoZzmJBXVyZTtu5e7vznQl8yFBBi2r_MXDDqa4zKuXu4yBUsIfEA2W_kL7D6VpqvznsldbK0j8JiktkV4JWlMJSo_fteS7CfXh2QYv_nnWKMrsF3fHiESFxDpqKLfnoyM9dvZgzW6mc9e6FtsblRaYhhjvJ3zuVtITfTUlQVZ_UTERCxV_yzsp4gQTaoNVynstjeo")',
                                    }}
                                ></div>
                                <div className="flex flex-col">
                                    <h1 className="text-base font-bold leading-normal">BEM Orchestrator</h1>
                                    <p className="text-[#616f89] dark:text-gray-400 text-xs font-normal">KM ITS Ecosystem</p>
                                </div>
                            </Link>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-2">
                            <Link
                                href="/orchestrator"
                                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#eef4ff] dark:bg-[#2b6cee]/20 text-[#2b6cee]"
                            >
                                <span className="material-symbols-outlined text-[24px]">view_kanban</span>
                                <span className="text-sm font-medium leading-normal">Orchestrator</span>
                            </Link>
                            <Link
                                href="/admin"
                                className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#111318] dark:text-gray-200 hover:bg-[#f0f2f4] dark:hover:bg-[#2d3748]"
                            >
                                <span className="material-symbols-outlined text-[24px]">bar_chart</span>
                                <span className="text-sm font-medium leading-normal">Reports</span>
                            </Link>
                        </nav>

                        {/* Ecosystem Widget */}
                        <div className="p-4 border-t border-[#f0f2f4] dark:border-[#2d3748]">
                            <div className="bg-gradient-to-br from-[#2b6cee] to-[#1a4bb0] rounded-lg p-4 text-white">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="material-symbols-outlined text-[20px]">hub</span>
                                    <span className="text-xs font-bold uppercase tracking-wider opacity-80">Ecosystem</span>
                                </div>
                                <p className="text-sm font-medium mb-3">3 Connected Programs in KM ITS Network</p>
                                <div className="flex -space-x-2">
                                    <div className="w-6 h-6 rounded-full border border-white bg-gray-200"></div>
                                    <div className="w-6 h-6 rounded-full border border-white bg-gray-300"></div>
                                    <div className="w-6 h-6 rounded-full border border-white bg-gray-400"></div>
                                    <div className="w-6 h-6 rounded-full border border-white bg-[#ffffff33] flex items-center justify-center text-[10px] font-bold">
                                        +2
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* TopNavBar */}
                    <header className="flex items-center justify-between whitespace-nowrap border-b border-[#f0f2f4] dark:border-[#2d3748] bg-white dark:bg-[#1a202c] px-6 py-3 z-10">
                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-3 text-[#111318] dark:text-white">
                                <span className="material-symbols-outlined text-[#2b6cee] text-[28px]">account_tree</span>
                                <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Program Lifecycle Board</h2>
                            </div>
                        </div>
                        <button className="hidden sm:flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-[#2b6cee] hover:bg-blue-700 transition-colors text-white text-sm font-bold">
                            Create Program
                        </button>
                    </header>

                    {/* Workspace */}
                    <main className="flex-1 flex flex-col overflow-y-auto p-6 md:p-8">
                        <div className="space-y-6 max-w-[1200px] mx-auto">
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {stats.map((stat, idx) => (
                                    <div
                                        key={idx}
                                        className="flex flex-col p-6 rounded-xl bg-white dark:bg-[#1a202c] border border-[#dbdfe6] dark:border-[#2d3748] shadow-sm relative overflow-hidden group hover:shadow-md transition-all"
                                    >
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <span className="material-symbols-outlined text-6xl text-[#2b6cee]">{stat.icon}</span>
                                        </div>
                                        <p className="text-[#616f89] dark:text-gray-400 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
                                        <div className="flex items-end gap-3 mt-2">
                                            <p className="text-4xl font-bold tracking-tight">{stat.value}</p>
                                            <div
                                                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold mb-1 ${stat.positive
                                                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                                                    }`}
                                            >
                                                {stat.positive && <span className="material-symbols-outlined text-[14px]">trending_up</span>}
                                                <span>{stat.change}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Programs Table */}
                            <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-[#dbdfe6] dark:border-[#2d3748] shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-[#dbdfe6] dark:border-[#2d3748] flex justify-between items-center">
                                    <h3 className="font-bold text-lg">Active Programs</h3>
                                    <button className="text-[#2b6cee] text-sm font-bold hover:underline">View All</button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-[#f9f8fa] dark:bg-gray-800/50 border-b border-[#dbdfe6] dark:border-[#2d3748]">
                                                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-[#616f89] dark:text-gray-400">
                                                    Program Name
                                                </th>
                                                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-[#616f89] dark:text-gray-400">
                                                    Status
                                                </th>
                                                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-[#616f89] dark:text-gray-400">
                                                    Participants
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#dbdfe6] dark:divide-[#2d3748]">
                                            {programs.map((program, idx) => (
                                                <tr key={idx} className="group hover:bg-[#f0f2f4] dark:hover:bg-gray-800/30 transition-colors">
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                                                <span className="material-symbols-outlined">lightbulb</span>
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-sm">{program.name}</p>
                                                                <p className="text-[#616f89] dark:text-gray-500 text-xs">{program.type}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <span
                                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${program.statusColor === "green"
                                                                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
                                                                    : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800"
                                                                }`}
                                                        >
                                                            <span className={`w-1.5 h-1.5 rounded-full ${program.statusColor === "green" ? "bg-green-500" : "bg-yellow-500"}`}></span>
                                                            {program.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        {program.participants > 0 ? (
                                                            <span className="text-sm font-medium">+{program.participants}</span>
                                                        ) : (
                                                            <span className="text-xs text-[#616f89] dark:text-gray-500 italic">No participants</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
