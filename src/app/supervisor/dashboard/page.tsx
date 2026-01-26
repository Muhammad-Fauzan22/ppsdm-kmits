"use client";

import Link from "next/link";

export default function SupervisorDashboard() {
    return (
        <div className="bg-[#f6f6f8] dark:bg-[#101622] text-[#111318] dark:text-white font-[family-name:var(--font-inter)] transition-colors duration-200 flex flex-col h-screen overflow-hidden">
            {/* Navbar */}
            <header className="flex-none flex items-center justify-between whitespace-nowrap border-b border-solid border-[#dbdfe6] dark:border-gray-800 bg-white dark:bg-[#1a202c] px-6 lg:px-10 py-3 z-10 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="size-8 flex items-center justify-center rounded-lg bg-[#135bec]/10 text-[#135bec]">
                        <span className="material-symbols-outlined text-xl">school</span>
                    </div>
                    <h2 className="text-[#111318] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">PPSDM KMM Portal</h2>
                </div>
                <div className="flex flex-1 justify-end gap-8">
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/supervisor/dashboard" className="text-[#135bec] text-sm font-semibold leading-normal border-b-2 border-[#135bec] py-1">Dashboard</Link>
                        <Link href="#" className="text-[#616f89] dark:text-gray-400 hover:text-[#135bec] dark:hover:text-[#135bec] text-sm font-medium leading-normal transition-colors">Mentees</Link>
                        <Link href="#" className="text-[#616f89] dark:text-gray-400 hover:text-[#135bec] dark:hover:text-[#135bec] text-sm font-medium leading-normal transition-colors">Approvals</Link>
                        <Link href="#" className="text-[#616f89] dark:text-gray-400 hover:text-[#135bec] dark:hover:text-[#135bec] text-sm font-medium leading-normal transition-colors">Reports</Link>
                    </div>
                    <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-[#111318] dark:text-white">Dr. Sarah Connor</p>
                            <p className="text-xs text-[#616f89] dark:text-gray-400">Supervisor</p>
                        </div>
                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-white dark:border-gray-700 shadow-sm" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBtZivMKWd6TZoIoG6bLv7rlzSiq5Fp5alAeSFpn18Z0hDb92MuRgB-Xk3mhssuLWTekPqhU5tZ5NKs2optAREB9RBlK17aYcVS54guHm3i8vqsPvKoQa4uKTeVOwhjSKl0mng7jDQj6QZ_Vu9GDwg92hiIPmKdlqiOQj0qUxlCB15XhYmSGwRofyrwxD2KlulwMYZavAbmgKbBTv0jVWgrb8-6HGaYM8R0DFC-tQYUqLNjre_GlH4a-UrP6CutSOQvw1s2TV6jRJ8')" }}></div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto bg-[#f6f6f8] dark:bg-[#101622] p-6 lg:p-10">
                <div className="mx-auto max-w-7xl flex flex-col gap-6">
                    {/* Page Header */}
                    <div className="flex flex-wrap justify-between items-end gap-4">
                        <div className="flex min-w-72 flex-col gap-1">
                            <div className="flex items-center gap-2 text-sm text-[#616f89] dark:text-gray-400 mb-1">
                                <span>Home</span>
                                <span className="material-symbols-outlined text-[10px]">arrow_forward_ios</span>
                                <span className="text-[#135bec] font-medium">Dashboard</span>
                            </div>
                            <h1 className="text-[#111318] dark:text-white text-3xl font-bold leading-tight tracking-tight">Supervisor Dashboard</h1>
                            <p className="text-[#616f89] dark:text-gray-400 text-sm font-normal">Monitor student performance and manage approvals.</p>
                        </div>
                        <button className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-[#135bec] hover:bg-[#0e45b5] text-white text-sm font-semibold leading-normal transition-all shadow-md active:scale-95">
                            <span className="material-symbols-outlined text-[20px]">mail</span>
                            <span>Message All</span>
                        </button>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Total Mentees */}
                        <div className="flex flex-col gap-2 rounded-xl p-5 bg-white dark:bg-[#1a202c] border border-[#dbdfe6] dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <p className="text-[#616f89] dark:text-gray-400 text-sm font-medium">Total Mentees</p>
                                <span className="material-symbols-outlined text-[#616f89] dark:text-gray-500 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-lg text-lg">groups</span>
                            </div>
                            <p className="text-[#111318] dark:text-white text-3xl font-bold">42</p>
                            <p className="text-[#616f89] dark:text-gray-500 text-xs mt-1">Active in current semester</p>
                        </div>
                        {/* Need Attention */}
                        <div className="flex flex-col gap-2 rounded-xl p-5 bg-white dark:bg-[#1a202c] border border-[#ef4444]/30 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                            <div className="absolute right-0 top-0 h-full w-1 bg-[#ef4444]"></div>
                            <div className="flex items-center justify-between">
                                <p className="text-[#111318] dark:text-white text-sm font-semibold">Need Attention</p>
                                <span className="material-symbols-outlined text-[#ef4444] bg-[#fef2f2] dark:bg-[#ef4444]/10 p-1.5 rounded-lg text-lg">warning</span>
                            </div>
                            <div className="flex items-end gap-2">
                                <p className="text-[#ef4444] text-3xl font-bold">3</p>
                                <span className="text-[#ef4444] text-xs font-medium mb-1.5 bg-[#fef2f2] dark:bg-[#ef4444]/10 px-1.5 py-0.5 rounded">+2 Critical</span>
                            </div>
                            <p className="text-[#616f89] dark:text-gray-500 text-xs mt-1">Students below performance threshold</p>
                        </div>
                        {/* Pending Approvals */}
                        <div className="flex flex-col gap-2 rounded-xl p-5 bg-white dark:bg-[#1a202c] border border-[#dbdfe6] dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <p className="text-[#616f89] dark:text-gray-400 text-sm font-medium">Pending Approvals</p>
                                <span className="material-symbols-outlined text-[#f59e0b] bg-[#fffbeb] dark:bg-[#f59e0b]/10 p-1.5 rounded-lg text-lg">history_edu</span>
                            </div>
                            <div className="flex items-end gap-2">
                                <p className="text-[#111318] dark:text-white text-3xl font-bold">5</p>
                                <span className="text-[#22c55e] text-xs font-medium mb-1.5 bg-[#f0fdf4] dark:bg-[#22c55e]/10 px-1.5 py-0.5 rounded">+1 Today</span>
                            </div>
                            <p className="text-[#616f89] dark:text-gray-500 text-xs mt-1">Logbooks & final reports</p>
                        </div>
                    </div>

                    {/* Filters & Toolbar */}
                    <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center justify-between bg-white dark:bg-[#1a202c] p-4 rounded-xl border border-[#dbdfe6] dark:border-gray-700 shadow-sm">
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <div className="relative min-w-[200px]">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <span className="material-symbols-outlined text-gray-400 text-xl">search</span>
                                </span>
                                <input className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm pl-10 h-10 focus:border-[#135bec] focus:ring-[#135bec] dark:text-white" placeholder="Search by Name or NRP..." type="text" />
                            </div>
                            <div className="flex gap-2">
                                <div className="relative">
                                    <select className="appearance-none block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-[#135bec] focus:border-[#135bec] sm:text-sm rounded-lg bg-white dark:bg-gray-800 dark:text-white h-10 min-w-[140px]">
                                        <option>Batch 2023</option>
                                        <option>Batch 2022</option>
                                        <option>Batch 2021</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                        <span className="material-symbols-outlined text-lg">expand_more</span>
                                    </div>
                                </div>
                                <div className="relative">
                                    <select className="appearance-none block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-[#135bec] focus:border-[#135bec] sm:text-sm rounded-lg bg-white dark:bg-gray-800 dark:text-white h-10 min-w-[160px]">
                                        <option>All Departments</option>
                                        <option>Informatics</option>
                                        <option>Information Systems</option>
                                        <option>Computer Eng.</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                        <span className="material-symbols-outlined text-lg">expand_more</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-2 text-gray-500 hover:text-[#135bec] transition-colors">
                                <span className="material-symbols-outlined">filter_list</span>
                            </button>
                            <button className="p-2 text-gray-500 hover:text-[#135bec] transition-colors">
                                <span className="material-symbols-outlined">download</span>
                            </button>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="rounded-xl border border-[#dbdfe6] dark:border-gray-700 bg-white dark:bg-[#1a202c] shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-800 border-b border-[#dbdfe6] dark:border-gray-700">
                                        <th className="px-6 py-3 text-xs font-semibold text-[#616f89] dark:text-gray-400 uppercase tracking-wider">Student Name</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-[#616f89] dark:text-gray-400 uppercase tracking-wider">NRP</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-[#616f89] dark:text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-[#616f89] dark:text-gray-400 uppercase tracking-wider">Last Activity</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-[#616f89] dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#dbdfe6] dark:divide-gray-700 text-sm">
                                    {/* Row 1: At Risk */}
                                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">AF</div>
                                                <div>
                                                    <p className="font-medium text-[#111318] dark:text-white group-hover:text-[#135bec] transition-colors">Ahmad Fauzi</p>
                                                    <p className="text-xs text-gray-500 md:hidden">5025201042</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-[#616f89] dark:text-gray-400 font-mono tabular-nums">5025201042</td>
                                        <td className="px-6 py-3">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#fef2f2] text-[#ef4444] border border-[#ef4444]/20">
                                                <span className="size-1.5 rounded-full bg-[#ef4444] animate-pulse"></span>
                                                At Risk
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-[#616f89] dark:text-gray-400">2 hours ago</td>
                                        <td className="px-6 py-3 text-right">
                                            <button className="text-gray-400 hover:text-[#135bec] dark:hover:text-white transition-colors p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                                                <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                                            </button>
                                        </td>
                                    </tr>
                                    {/* Row 2: On Track */}
                                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400">SA</div>
                                                <p className="font-medium text-[#111318] dark:text-white group-hover:text-[#135bec] transition-colors">Siti Aminah</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-[#616f89] dark:text-gray-400 font-mono tabular-nums">5025201015</td>
                                        <td className="px-6 py-3">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#f0fdf4] dark:bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20">
                                                <span className="size-1.5 rounded-full bg-[#22c55e]"></span>
                                                On Track
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-[#616f89] dark:text-gray-400">1 day ago</td>
                                        <td className="px-6 py-3 text-right">
                                            <button className="text-gray-400 hover:text-[#135bec] dark:hover:text-white transition-colors p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                                                <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                                            </button>
                                        </td>
                                    </tr>
                                    {/* Row 3: On Track */}
                                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400">BS</div>
                                                <p className="font-medium text-[#111318] dark:text-white group-hover:text-[#135bec] transition-colors">Budi Santoso</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-[#616f89] dark:text-gray-400 font-mono tabular-nums">5025201033</td>
                                        <td className="px-6 py-3">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#f0fdf4] dark:bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20">
                                                <span className="size-1.5 rounded-full bg-[#22c55e]"></span>
                                                On Track
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-[#616f89] dark:text-gray-400">4 hours ago</td>
                                        <td className="px-6 py-3 text-right">
                                            <button className="text-gray-400 hover:text-[#135bec] dark:hover:text-white transition-colors p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                                                <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                                            </button>
                                        </td>
                                    </tr>
                                    {/* Row 4: Pending Approval */}
                                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group bg-[#fffbeb]/30 dark:bg-[#f59e0b]/5">
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-xs font-bold text-orange-600 dark:text-orange-400">RK</div>
                                                <p className="font-medium text-[#111318] dark:text-white group-hover:text-[#135bec] transition-colors">Rina Kartika</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-[#616f89] dark:text-gray-400 font-mono tabular-nums">5025201099</td>
                                        <td className="px-6 py-3">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#fffbeb] dark:bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20">
                                                <span className="size-1.5 rounded-full bg-[#f59e0b]"></span>
                                                Pending
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-[#616f89] dark:text-gray-400">5 mins ago</td>
                                        <td className="px-6 py-3 text-right">
                                            <button className="text-[#135bec] hover:text-[#0e45b5] transition-colors text-xs font-bold mr-2 uppercase tracking-wide">Review</button>
                                            <button className="text-gray-400 hover:text-[#135bec] dark:hover:text-white transition-colors p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 align-middle">
                                                <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                                            </button>
                                        </td>
                                    </tr>
                                    {/* Row 5: Inactive */}
                                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-xs font-bold text-red-600 dark:text-red-400">EP</div>
                                                <p className="font-medium text-[#111318] dark:text-white group-hover:text-[#135bec] transition-colors">Eko Prasetyo</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-[#616f89] dark:text-gray-400 font-mono tabular-nums">5025201150</td>
                                        <td className="px-6 py-3">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                                                <span className="size-1.5 rounded-full bg-gray-500"></span>
                                                Inactive
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-[#616f89] dark:text-gray-400">1 week ago</td>
                                        <td className="px-6 py-3 text-right">
                                            <button className="text-gray-400 hover:text-[#135bec] dark:hover:text-white transition-colors p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                                                <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                                            </button>
                                        </td>
                                    </tr>
                                    {/* Row 6: On Track */}
                                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-xs font-bold text-teal-600 dark:text-teal-400">DL</div>
                                                <p className="font-medium text-[#111318] dark:text-white group-hover:text-[#135bec] transition-colors">Dewi Lestari</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-[#616f89] dark:text-gray-400 font-mono tabular-nums">5025201102</td>
                                        <td className="px-6 py-3">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#f0fdf4] dark:bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20">
                                                <span className="size-1.5 rounded-full bg-[#22c55e]"></span>
                                                On Track
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-[#616f89] dark:text-gray-400">3 days ago</td>
                                        <td className="px-6 py-3 text-right">
                                            <button className="text-gray-400 hover:text-[#135bec] dark:hover:text-white transition-colors p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                                                <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination */}
                        <div className="flex items-center justify-between border-t border-[#dbdfe6] dark:border-gray-700 bg-white dark:bg-[#1a202c] px-6 py-3">
                            <div className="flex items-center gap-2">
                                <p className="text-xs text-[#616f89] dark:text-gray-400">Showing <span className="font-medium text-[#111318] dark:text-white">1</span> to <span className="font-medium text-[#111318] dark:text-white">6</span> of <span className="font-medium text-[#111318] dark:text-white">42</span> results</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="inline-flex items-center justify-center rounded-md border border-[#dbdfe6] dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1.5 text-xs font-medium text-[#111318] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50">Previous</button>
                                <button className="inline-flex items-center justify-center rounded-md border border-[#dbdfe6] dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1.5 text-xs font-medium text-[#111318] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700">Next</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
