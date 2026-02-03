"use client";

import React from "react";
import Link from "next/link";
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell } from "recharts";

export default function CohortAnalytics() {

    // Mock Data
    const subjectData = [
        { subject: 'Math', mentee: 90, dept: 78 },
        { subject: 'Ethics', mentee: 95, dept: 92 },
        { subject: 'Lab', mentee: 82, dept: 85 },
        { subject: 'Physics', mentee: 72, dept: 76 },
        { subject: 'History', mentee: 92, dept: 80 },
    ];

    const roster = [
        { name: "Alexander Smith", id: "2023-CS-001", gpa: 3.8, login: "2 hours ago", status: "On Track", trend: [10, 20, 15, 30, 40, 35, 50] },
        { name: "Maria Garcia", id: "2023-IS-042", gpa: 3.2, login: "1 day ago", status: "On Track", trend: [20, 25, 20, 30, 25, 40, 50] },
        { name: "James Wilson", id: "2023-SE-089", gpa: 2.4, login: "5 days ago", status: "Review Needed", trend: [50, 40, 30, 20, 10, 15, 20] },
        { name: "Chen Wei", id: "2023-DS-104", gpa: 3.9, login: "4 hours ago", status: "On Track", trend: [10, 30, 40, 40, 50, 45, 60] },
    ];

    // Sparkline Component
    const Sparkline = ({ data, color }: { data: number[], color: string }) => {
        const points = data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - (d / 60) * 100}`).join(" ");
        return (
            <svg className="w-24 h-8 overflow-visible">
                <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        );
    };

    return (
        <div className="p-8 max-w-[1600px] mx-auto">

            <div className="flex items-center gap-2 text-sm text-gray-500 font-medium mb-6">
                <Link href="/supervisor/dashboard" className="text-gray-400 hover:text-white">Home</Link> /
                <Link href="/supervisor/dashboard" className="text-gray-400 hover:text-white">Supervisor</Link> /
                <span className="text-white">Analytics</span>
            </div>

            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Cohort Analytics Report</h1>
                    <p className="text-gray-400">Fall Semester 2023 - Cohort Alpha</p>
                </div>
                <div className="flex gap-4">
                    <button className="bg-[#1C2028] text-gray-300 border border-[#2D303E] px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-[#252A36]">
                        <span className="material-symbols-outlined text-sm">calendar_month</span> Sep 2023 - Dec 2023
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors">
                        <span className="material-symbols-outlined text-sm">print</span> Print Report
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-[#151921] border border-[#2D303E] p-6 rounded-xl">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-bold text-gray-400">Avg. Cohort GPA</span>
                        <span className="bg-green-900/20 text-green-500 text-[10px] font-bold px-1.5 py-0.5 rounded border border-green-900/40">↗ +0.2%</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">3.42</h2>
                    <div className="w-full h-1.5 bg-[#1F2937] rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 w-[75%] rounded-full"></div>
                    </div>
                </div>
                <div className="bg-[#151921] border border-[#2D303E] p-6 rounded-xl">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-bold text-gray-400">Engagement Score</span>
                        <span className="bg-green-900/20 text-green-500 text-[10px] font-bold px-1.5 py-0.5 rounded border border-green-900/40">↗ +5%</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">88%</h2>
                    <div className="w-full h-1.5 bg-[#1F2937] rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 w-[88%] rounded-full"></div>
                    </div>
                </div>
                <div className="bg-[#151921] border border-[#2D303E] p-6 rounded-xl">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-bold text-gray-400">Pending Reviews</span>
                        <span className="bg-yellow-900/20 text-yellow-500 text-[10px] font-bold px-1.5 py-0.5 rounded border border-yellow-900/40">Action needed</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">12</h2>
                    <div className="w-full h-1.5 bg-[#1F2937] rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500 w-[30%] rounded-full"></div>
                    </div>
                </div>
                <div className="bg-[#151921] border border-[#2D303E] p-6 rounded-xl">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-bold text-gray-400">Risk Level</span>
                        <span className="bg-[#1F2937] text-gray-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-[#2D303E]">0% Change</span>
                    </div>
                    <h2 className="text-3xl font-bold text-green-500 mb-4">Low</h2>
                    <div className="flex gap-1 w-full h-1.5">
                        <div className="h-full bg-green-500 w-[33%] rounded-full"></div>
                        <div className="h-full bg-[#1F2937] w-[33%] rounded-full"></div>
                        <div className="h-full bg-[#1F2937] w-[33%] rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

                {/* Bar Chart */}
                <div className="lg:col-span-2 bg-[#151921] border border-[#2D303E] rounded-xl p-6">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="font-bold text-lg text-white">Performance by Subject</h3>
                            <p className="text-sm text-gray-400">Mentees Average vs Department Average</p>
                        </div>
                        <div className="flex gap-4 text-xs font-bold">
                            <span className="flex items-center gap-2 text-gray-400"><span className="size-3 bg-blue-600 rounded-sm"></span> My Mentees</span>
                            <span className="flex items-center gap-2 text-gray-400"><span className="size-3 bg-gray-600 rounded-sm"></span> Dept Avg</span>
                        </div>
                    </div>
                    <div style={{ width: '100%', height: '256px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={subjectData} barGap={8}>
                                <XAxis dataKey="subject" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                />
                                <Bar dataKey="mentee" fill="#2563EB" radius={[4, 4, 0, 0]} barSize={20} />
                                <Bar dataKey="dept" fill="#4B5563" radius={[4, 4, 0, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Heatmap (Simulated Grid) */}
                <div className="lg:col-span-1 bg-[#151921] border border-[#2D303E] rounded-xl p-6">
                    <h3 className="font-bold text-lg text-white mb-1">Engagement Activity</h3>
                    <p className="text-sm text-gray-400 mb-6">Student activity submissions (Last 90 days)</p>

                    <div className="grid grid-cols-12 gap-1.5">
                        {Array.from({ length: 84 }).map((_, i) => {
                            const opacity = Math.random() > 0.7 ? 'bg-blue-600' : Math.random() > 0.4 ? 'bg-blue-900/50' : 'bg-[#1F2937]';
                            return (
                                <div key={i} className={`size-3 rounded-sm ${opacity}`}></div>
                            )
                        })}
                    </div>

                    <div className="flex justify-end items-center gap-2 mt-4 text-[10px] text-gray-500 font-medium">
                        <span>Less</span>
                        <div className="flex gap-1">
                            <div className="size-3 rounded-sm bg-[#1F2937]"></div>
                            <div className="size-3 rounded-sm bg-blue-900/50"></div>
                            <div className="size-3 rounded-sm bg-blue-600"></div>
                        </div>
                        <span>More</span>
                    </div>
                </div>

            </div>

            {/* Roster Table */}
            <div className="bg-[#151921] border border-[#2D303E] rounded-xl overflow-hidden">
                <div className="p-6 border-b border-[#2D303E] flex justify-between items-center bg-[#1C2028]">
                    <h3 className="font-bold text-lg text-white">Mentee Roster</h3>
                    <button className="text-blue-500 text-sm font-bold hover:underline">View All Mentees</button>
                </div>

                <table className="w-full text-left text-sm">
                    <thead className="bg-[#151921] text-xs font-bold text-gray-400 uppercase">
                        <tr>
                            <th className="px-6 py-4">Student Name</th>
                            <th className="px-6 py-4">Student ID</th>
                            <th className="px-6 py-4">Current GPA</th>
                            <th className="px-6 py-4">Activity Trend</th>
                            <th className="px-6 py-4">Last Login</th>
                            <th className="px-6 py-4 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2D303E]">
                        {roster.map((student, i) => (
                            <tr key={i} className="hover:bg-[#1E232D] transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 rounded-full bg-gray-700 overflow-hidden">
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} alt={`Avatar of ${student.name}`} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-white">{student.name}</p>
                                            <p className="text-xs text-gray-500">Computer Science</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-mono text-gray-400">{student.id}</td>
                                <td className="px-6 py-4 font-bold text-white">{student.gpa}</td>
                                <td className="px-6 py-4">
                                    <Sparkline
                                        data={student.trend}
                                        color={student.status === 'Review Needed' ? '#F59E0B' : '#3B82F6'}
                                    />
                                </td>
                                <td className="px-6 py-4 text-gray-400">{student.login}</td>
                                <td className="px-6 py-4 text-right">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase
                                        ${student.status === 'On Track' ? 'bg-green-900/20 text-green-500 border border-green-900/50' :
                                            'bg-yellow-900/20 text-yellow-500 border border-yellow-900/50'}`}>
                                        {student.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}
