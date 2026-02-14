"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { ASSETS } from "@/config/assets";
import { Icon } from "@/components/ui/Icon";

// --- MOCK DATA ---
const MENTEES = [
    { name: "Ahmad Fauzi", nrp: "5025201042", status: "Risk", lastActivity: "2 hours ago", initials: "AF", color: "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300" },
    { name: "Siti Aminah", nrp: "5025201015", status: "On Track", lastActivity: "1 day ago", initials: "SA", color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" },
    { name: "Budi Santoso", nrp: "5025201033", status: "On Track", lastActivity: "4 hours ago", initials: "BS", color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
    { name: "Rina Kartika", nrp: "5025201099", status: "Pending", lastActivity: "5 mins ago", initials: "RK", color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" },
    { name: "Eko Prasetyo", nrp: "5025201150", status: "Inactive", lastActivity: "1 week ago", initials: "EP", color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" },
    { name: "Dewi Lestari", nrp: "5025201102", status: "On Track", lastActivity: "3 days ago", initials: "DL", color: "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400" },
];

export default function SupervisorDashboard() {
    return (
        <div className="flex h-screen w-full flex-col overflow-hidden bg-background-light dark:bg-background-dark font-sans text-slate-900 dark:text-white transition-colors duration-200">

            {/* Navbar */}
            <header className="flex-none flex items-center justify-between whitespace-nowrap border-b border-[#dbdfe6] dark:border-gray-800 bg-white dark:bg-[#1a202c] px-6 lg:px-10 py-3 z-10 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="size-8 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon name="School" className="w-5 h-5" />
                    </div>
                    <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">PPSDM KMM Portal</h2>
                </div>
                <div className="flex flex-1 justify-end gap-8">
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="#" className="text-primary text-sm font-semibold leading-normal border-b-2 border-primary py-1">Dashboard</Link>
                        <Link href="#" className="text-slate-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal transition-colors">Mentees</Link>
                        <Link href="#" className="text-slate-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal transition-colors">Approvals</Link>
                        <Link href="#" className="text-slate-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal transition-colors">Reports</Link>
                    </div>
                    <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">Dr. Sarah Connor</p>
                            <p className="text-xs text-slate-500 dark:text-gray-400">Supervisor</p>
                        </div>
                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-white dark:border-gray-700 shadow-sm" style={{ backgroundImage: `url('${ASSETS.avatar.student}')` }}></div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-6 lg:p-10">
                <div className="mx-auto max-w-7xl flex flex-col gap-6">

                    {/* Page Header */}
                    <div className="flex flex-wrap justify-between items-end gap-4">
                        <div className="flex min-w-72 flex-col gap-1">
                            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400 mb-1">
                                <span>Home</span>
                                <Icon name="ChevronRight" size="xs" className="scale-75" />
                                <span className="text-primary font-medium">Dashboard</span>
                            </div>
                            <h1 className="text-slate-900 dark:text-white text-3xl font-bold leading-tight tracking-tight">Supervisor Dashboard</h1>
                            <p className="text-slate-500 dark:text-gray-400 text-sm font-normal">Monitor student performance and manage approvals.</p>
                        </div>
                        <button className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary hover:bg-blue-700 text-white text-sm font-semibold leading-normal transition-all shadow-md active:scale-95">
                            <Icon name="MessageSquare" className="w-5 h-5" />
                            <span>Message All</span>
                        </button>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Total Mentees */}
                        <div className="flex flex-col gap-2 rounded-xl p-5 bg-white dark:bg-[#1a202c] border border-[#dbdfe6] dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <p className="text-slate-500 dark:text-gray-400 text-sm font-medium">Total Mentees</p>
                                <div className="bg-gray-100 dark:bg-gray-800 p-1.5 rounded-lg text-slate-500 dark:text-gray-500">
                                    <Icon name="Users" className="w-5 h-5" />
                                </div>
                            </div>
                            <p className="text-slate-900 dark:text-white text-3xl font-bold">42</p>
                            <p className="text-slate-500 dark:text-gray-500 text-xs mt-1">Active in current semester</p>
                        </div>

                        {/* Need Attention */}
                        <div className="flex flex-col gap-2 rounded-xl p-5 bg-white dark:bg-[#1a202c] border border-red-500/30 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                            <div className="absolute right-0 top-0 h-full w-1 bg-red-500"></div>
                            <div className="flex items-center justify-between">
                                <p className="text-slate-900 dark:text-white text-sm font-semibold">Need Attention</p>
                                <div className="bg-red-50 dark:bg-red-500/10 p-1.5 rounded-lg text-red-500">
                                    <Icon name="AlertCircle" className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="flex items-end gap-2">
                                <p className="text-red-500 text-3xl font-bold">3</p>
                                <span className="text-red-500 text-xs font-medium mb-1.5 bg-red-50 dark:bg-red-500/10 px-1.5 py-0.5 rounded">+2 Critical</span>
                            </div>
                            <p className="text-slate-500 dark:text-gray-500 text-xs mt-1">Students below performance threshold</p>
                        </div>

                        {/* Pending Approvals */}
                        <div className="flex flex-col gap-2 rounded-xl p-5 bg-white dark:bg-[#1a202c] border border-[#dbdfe6] dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <p className="text-slate-500 dark:text-gray-400 text-sm font-medium">Pending Approvals</p>
                                <div className="bg-amber-50 dark:bg-amber-500/10 p-1.5 rounded-lg text-amber-500">
                                    <Icon name="History" className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="flex items-end gap-2">
                                <p className="text-slate-900 dark:text-white text-3xl font-bold">5</p>
                                <span className="text-green-500 text-xs font-medium mb-1.5 bg-green-50 dark:bg-green-500/10 px-1.5 py-0.5 rounded">+1 Today</span>
                            </div>
                            <p className="text-slate-500 dark:text-gray-500 text-xs mt-1">Logbooks & final reports</p>
                        </div>
                    </div>

                    {/* Filters & Toolbar */}
                    <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center justify-between bg-white dark:bg-[#1a202c] p-4 rounded-xl border border-[#dbdfe6] dark:border-gray-700 shadow-sm">
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <div className="relative min-w-[200px]">
                                <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm pl-10 h-10 focus:border-primary focus:ring-primary dark:text-white"
                                    placeholder="Search by Name or NRP..."
                                    type="text"
                                />
                            </div>
                            <div className="flex gap-2">
                                <div className="relative">
                                    <select className="appearance-none block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-lg bg-white dark:bg-gray-800 dark:text-white h-10 min-w-[140px]">
                                        <option>Batch 2023</option>
                                        <option>Batch 2022</option>
                                        <option>Batch 2021</option>
                                    </select>
                                    <Icon name="ChevronDown" className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                </div>
                                <div className="relative">
                                    <select className="appearance-none block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-lg bg-white dark:bg-gray-800 dark:text-white h-10 min-w-[160px]">
                                        <option>All Departments</option>
                                        <option>Informatics</option>
                                        <option>Information Systems</option>
                                    </select>
                                    <Icon name="ChevronDown" className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-2 text-gray-500 hover:text-primary transition-colors">
                                <Icon name="Filter" className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-gray-500 hover:text-primary transition-colors">
                                <Icon name="Download" className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="rounded-xl border border-[#dbdfe6] dark:border-gray-700 bg-white dark:bg-[#1a202c] shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-800 border-b border-[#dbdfe6] dark:border-gray-700">
                                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Student Name</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">NRP</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Last Activity</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#dbdfe6] dark:divide-gray-700 text-sm">
                                    {MENTEES.map((mentee, i) => (
                                        <tr key={i} className={cn("hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group", mentee.status === 'Pending' ? "bg-amber-50/50 dark:bg-amber-900/5" : "")}>
                                            <td className="px-6 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn("size-8 rounded-full flex items-center justify-center text-xs font-bold", mentee.color)}>
                                                        {mentee.initials}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-900 dark:text-white group-hover:text-primary transition-colors">{mentee.name}</p>
                                                        <p className="text-xs text-gray-500 md:hidden">{mentee.nrp}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3 text-slate-500 dark:text-gray-400 font-mono tabular-nums">{mentee.nrp}</td>
                                            <td className="px-6 py-3">
                                                <StatusBadge status={mentee.status} />
                                            </td>
                                            <td className="px-6 py-3 text-slate-500 dark:text-gray-400">{mentee.lastActivity}</td>
                                            <td className="px-6 py-3 text-right">
                                                {mentee.status === 'Pending' && (
                                                    <button className="text-primary hover:text-blue-700 transition-colors text-xs font-bold mr-3 uppercase tracking-wide">Review</button>
                                                )}
                                                <button className="text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 inline-block align-middle">
                                                    <Icon name="MoreHorizontal" className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between border-t border-[#dbdfe6] dark:border-gray-700 bg-white dark:bg-[#1a202c] px-6 py-3">
                            <div className="flex items-center gap-2">
                                <p className="text-xs text-slate-500 dark:text-gray-400">Showing <span className="font-medium text-slate-900 dark:text-white">1</span> to <span className="font-medium text-slate-900 dark:text-white">6</span> of <span className="font-medium text-slate-900 dark:text-white">42</span> results</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="inline-flex items-center justify-center rounded-md border border-[#dbdfe6] dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1.5 text-xs font-medium text-slate-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50">Previous</button>
                                <button className="inline-flex items-center justify-center rounded-md border border-[#dbdfe6] dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1.5 text-xs font-medium text-slate-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700">Next</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- SUB COMPONENTS ---

function StatusBadge({ status }: { status: string }) {
    if (status === 'Risk') {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 dark:bg-red-900/10 text-red-500 border border-red-500/20">
                <span className="size-1.5 rounded-full bg-red-500 animate-pulse"></span>
                At Risk
            </span>
        );
    }
    if (status === 'On Track') {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 dark:bg-green-900/10 text-green-500 border border-green-500/20">
                <span className="size-1.5 rounded-full bg-green-500"></span>
                On Track
            </span>
        );
    }
    if (status === 'Pending') {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-900/10 text-amber-500 border border-amber-500/20">
                <span className="size-1.5 rounded-full bg-amber-500"></span>
                Pending
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
            <span className="size-1.5 rounded-full bg-gray-500"></span>
            Inactive
        </span>
    );
}
