"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    BarChart3,
    PieChart,
    LineChart,
    TrendingUp,
    Users,
    Download,
    Calendar,
    ArrowUpRight,
    Search,
    Bell,
    Settings,
    HelpCircle,
    ChevronDown,
    Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ASSETS } from "@/config/assets";

// --- MOCK DATA ---
const TOP_COURSES = [
    { name: "Introduction to AI", views: "12.5k", completions: "8.2k", rating: "4.8", trend: "+12%" },
    { name: "Advanced Data Structures", views: "8.1k", completions: "5.4k", rating: "4.6", trend: "+5%" },
    { name: "Cybersecurity Basics", views: "6.4k", completions: "4.1k", rating: "4.7", trend: "+8%" },
    { name: "Cloud Architecture", views: "4.2k", completions: "2.8k", rating: "4.9", trend: "+15%" },
];

export default function AnalyticsPage() {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-[#111318] text-[#111318] dark:text-white font-sans transition-colors duration-300">

            {/* Top Navigation */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-gray-200 dark:border-[#282e39] px-6 py-3 bg-white dark:bg-[#111318] sticky top-0 z-50 w-full shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/admin/dashboard" className="size-8 text-primary hover:opacity-80 transition-opacity">
                        <svg className="size-8" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path clipRule="evenodd" d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z" fill="currentColor" fillRule="evenodd"></path>
                        </svg>
                    </Link>
                    <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Analytics Overview</h2>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group w-64 hidden md:block">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="w-4 h-4 text-gray-400" />
                        </div>
                        <input
                            className="block w-full pl-10 pr-3 py-1.5 border border-gray-200 dark:border-[#3b4354] rounded-lg leading-5 bg-gray-50 dark:bg-[#1c1f27] text-gray-900 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-xs transition-all shadow-sm"
                            placeholder="Search reports..."
                            type="text"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 border border-gray-200 dark:border-[#3b4354]" style={{ backgroundImage: `url('${ASSETS.avatar.student}')` }}></div>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 w-full overflow-hidden relative">

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col h-full overflow-y-auto bg-background-light dark:bg-[#111318] custom-scrollbar p-6 lg:p-8">

                    {/* Header & Controls */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-[#111318] dark:text-white">Platform Performance</h1>
                            <p className="text-gray-500 dark:text-[#9da6b9]">Insights into user engagement, content consumption, and system growth.</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#1c1f27] border border-gray-200 dark:border-[#282e39] rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#222630] transition-colors">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                Last 30 Days
                                <ChevronDown className="w-3 h-3 text-gray-400" />
                            </button>
                            <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#1c1f27] border border-gray-200 dark:border-[#282e39] rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#222630] transition-colors">
                                <Filter className="w-4 h-4 text-gray-500" />
                                Filter
                            </button>
                            <button className="flex items-center gap-2 px-3 py-2 bg-primary text-white border border-primary rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm">
                                <Download className="w-4 h-4" />
                                Export
                            </button>
                        </div>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <AnalyticsCard
                            title="Total Active Learners"
                            value="8,245"
                            change="+12.5%"
                            trend="up"
                            icon={Users}
                            chartColor="#135bec"
                        />
                        <AnalyticsCard
                            title="Course Completion Rate"
                            value="68.4%"
                            change="+2.1%"
                            trend="up"
                            icon={CheckCircle}
                            chartColor="#22c55e"
                        />
                        <AnalyticsCard
                            title="Avg. Time Spent"
                            value="45m"
                            change="-1.2%"
                            trend="down"
                            icon={Clock}
                            chartColor="#f59e0b"
                        />
                        <AnalyticsCard
                            title="Total Certificates"
                            value="1,203"
                            change="+8.9%"
                            trend="up"
                            icon={Award}
                            chartColor="#a855f7"
                        />
                    </div>

                    {/* Main Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Learning Activity Chart (2/3) */}
                        <div className="lg:col-span-2 bg-white dark:bg-[#1c1f27] border border-gray-200 dark:border-[#282e39] rounded-xl p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-[#111318] dark:text-white">Learning Activity Trends</h3>
                                <div className="flex items-center gap-2">
                                    <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                                        <span className="w-2 h-2 rounded-full bg-primary"></span> Courses
                                    </span>
                                    <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                                        <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Quizzes
                                    </span>
                                </div>
                            </div>
                            <div className="h-[300px] w-full relative">
                                {/* Simulated Bar Chart */}
                                <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
                                    {/* Grid Lines */}
                                    <line x1="0" y1="10" x2="100" y2="10" stroke="#e5e7eb" strokeWidth="0.1" className="dark:stroke-gray-800" />
                                    <line x1="0" y1="20" x2="100" y2="20" stroke="#e5e7eb" strokeWidth="0.1" className="dark:stroke-gray-800" />
                                    <line x1="0" y1="30" x2="100" y2="30" stroke="#e5e7eb" strokeWidth="0.1" className="dark:stroke-gray-800" />
                                    <line x1="0" y1="40" x2="100" y2="40" stroke="#e5e7eb" strokeWidth="0.1" className="dark:stroke-gray-800" />

                                    {/* Bars (Simulated) */}
                                    {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95].map((x, i) => {
                                        const h1 = Math.random() * 30 + 5;
                                        const h2 = Math.random() * 20 + 2;
                                        return (
                                            <g key={i}>
                                                <rect x={x} y={50 - h1} width="2" height={h1} fill="#135bec" rx="0.5" />
                                                <rect x={x} y={50 - h1 - h2 - 1} width="2" height={h2} fill="#22d3ee" rx="0.5" />
                                            </g>
                                        )
                                    })}
                                </svg>
                            </div>
                        </div>

                        {/* Engagement By Category (1/3) */}
                        <div className="lg:col-span-1 bg-white dark:bg-[#1c1f27] border border-gray-200 dark:border-[#282e39] rounded-xl p-6 shadow-sm flex flex-col">
                            <h3 className="text-lg font-bold text-[#111318] dark:text-white mb-6">Engagement by Category</h3>
                            <div className="flex-1 flex items-center justify-center relative">
                                {/* Donut Chart Simulation */}
                                <svg viewBox="0 0 100 100" className="w-[200px] h-[200px] transform -rotate-90">
                                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#1e293b" strokeWidth="20" className="stroke-gray-100 dark:stroke-[#282e39]" />
                                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#135bec" strokeWidth="20" strokeDasharray="150 251" strokeDashoffset="0" /> {/* Blue */}
                                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#a855f7" strokeWidth="20" strokeDasharray="60 251" strokeDashoffset="-150" /> {/* Purple */}
                                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f59e0b" strokeWidth="20" strokeDasharray="41 251" strokeDashoffset="-210" /> {/* Orange */}
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-bold text-[#111318] dark:text-white">12.5k</span>
                                    <span className="text-xs text-gray-500">Total Views</span>
                                </div>
                            </div>
                            <div className="mt-6 flex flex-col gap-3">
                                <LegendItem color="bg-primary" label="Technology" value="60%" />
                                <LegendItem color="bg-purple-500" label="Management" value="24%" />
                                <LegendItem color="bg-yellow-500" label="Soft Skills" value="16%" />
                            </div>
                        </div>
                    </div>

                    {/* Top Content Table */}
                    <div className="bg-white dark:bg-[#1c1f27] border border-gray-200 dark:border-[#282e39] rounded-xl overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-[#282e39] flex items-center justify-between">
                            <h3 className="font-bold text-lg text-[#111318] dark:text-white">Top Performing Content</h3>
                            <Link href="#" className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
                                View Report <ArrowUpRight className="w-3 h-3" />
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 dark:bg-[#20242d]">
                                    <tr>
                                        <th className="p-4 text-xs font-semibold text-gray-500 dark:text-[#9da6b9] uppercase tracking-wider">Course Name</th>
                                        <th className="p-4 text-xs font-semibold text-gray-500 dark:text-[#9da6b9] uppercase tracking-wider text-right">Views</th>
                                        <th className="p-4 text-xs font-semibold text-gray-500 dark:text-[#9da6b9] uppercase tracking-wider text-right">Completions</th>
                                        <th className="p-4 text-xs font-semibold text-gray-500 dark:text-[#9da6b9] uppercase tracking-wider text-right">Avg. Rating</th>
                                        <th className="p-4 text-xs font-semibold text-gray-500 dark:text-[#9da6b9] uppercase tracking-wider text-right">Weekly Trend</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-[#282e39] font-sans text-sm">
                                    {TOP_COURSES.map((course, i) => (
                                        <tr key={i} className="group hover:bg-gray-50 dark:hover:bg-[#222630] transition-colors">
                                            <td className="p-4 font-medium text-[#111318] dark:text-gray-200">{course.name}</td>
                                            <td className="p-4 text-right text-gray-600 dark:text-gray-400">{course.views}</td>
                                            <td className="p-4 text-right text-gray-600 dark:text-gray-400">{course.completions}</td>
                                            <td className="p-4 text-right">
                                                <span className="inline-flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-500 px-2 py-0.5 rounded text-xs font-bold">
                                                    ★ {course.rating}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right text-green-500 font-medium">{course.trend}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
}

// --- SUB COMPONENTS ---

import { Award, CheckCircle, Clock } from "lucide-react";

function AnalyticsCard({ title, value, change, trend, icon: Icon, chartColor }: any) {
    return (
        <div className="bg-white dark:bg-[#1c1f27] border border-gray-200 dark:border-[#282e39] rounded-xl p-5 shadow-sm hover:border-primary/50 transition-all cursor-default">
            <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                    <span className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">{title}</span>
                    <h4 className="text-2xl font-bold text-[#111318] dark:text-white mt-1">{value}</h4>
                </div>
                <div className={cn("p-2 rounded-lg", trend === 'up' ? 'bg-green-50 dark:bg-green-900/10 text-green-600 dark:text-green-500' : 'bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-500')}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <div className="flex items-center justify-between">
                <span className={cn("text-xs font-bold flex items-center gap-1", trend === 'up' ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500')}>
                    {change} <span className="font-normal text-gray-400">vs last month</span>
                </span>
                {/* Mini Sparkline Simulation */}
                <svg width="60" height="20" viewBox="0 0 60 20">
                    <path d="M0,15 Q10,5 20,10 T40,8 T60,2" fill="none" stroke={chartColor} strokeWidth="2" strokeLinecap="round" />
                </svg>
            </div>
        </div>
    )
}

function LegendItem({ color, label, value }: any) {
    return (
        <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
                <span className={cn("w-3 h-3 rounded-full", color)}></span>
                <span className="text-gray-600 dark:text-gray-300">{label}</span>
            </div>
            <span className="font-bold text-[#111318] dark:text-white">{value}</span>
        </div>
    )
}
