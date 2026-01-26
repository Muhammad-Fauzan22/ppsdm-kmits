"use client";

import React from "react";
import Link from "next/link";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

export default function StudentDashboard() {
    const competenceData = [
        { subject: 'Leadership', A: 120, fullMark: 150 },
        { subject: 'Tech', A: 98, fullMark: 150 },
        { subject: 'Global', A: 86, fullMark: 150 },
        { subject: 'Social', A: 99, fullMark: 150 },
        { subject: 'Ethics', A: 85, fullMark: 150 },
        { subject: 'Spirit', A: 65, fullMark: 150 },
        { subject: 'Creative', A: 100, fullMark: 150 },
        { subject: 'Comms', A: 110, fullMark: 150 },
    ];

    const activities = [
        { name: "Staff of ITS Expo 2024", date: "Oct 24, 2023", category: "Leadership", status: "Approved" },
        { name: "Workshop: Data Science 101", date: "Oct 20, 2023", category: "Technology", status: "Pending" },
        { name: "Volunteering at Local Shelter", date: "Sep 15, 2023", category: "Social", status: "Rejected" },
        { name: "National Debate Competition", date: "Aug 28, 2023", category: "Communication", status: "Approved" },
    ];

    return (
        <div className="min-h-screen bg-[#0E1218] text-white font-sans flex h-screen overflow-hidden">

            {/* Sidebar */}
            <aside className="w-64 bg-[#0B0E14] border-r border-[#1F2937] flex flex-col p-4">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="size-8 rounded bg-blue-600 flex items-center justify-center text-white">
                        <span className="font-bold">I</span>
                    </div>
                    <div>
                        <h1 className="font-bold text-sm">PPSDM KM ITS</h1>
                        <p className="text-[10px] text-gray-500">Student Dashboard</p>
                    </div>
                </div>

                <nav className="flex-1 space-y-1">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-900/30 text-blue-400 border border-blue-800/50">
                        <span className="material-symbols-outlined text-[20px]">dashboard</span>
                        <span className="text-sm font-bold">Dashboard</span>
                    </button>
                    <Link href="/student/activities/management" className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-[#151921] transition-colors">
                        <span className="material-symbols-outlined text-[20px]">list_alt</span>
                        <span className="text-sm font-medium">Activity Log</span>
                    </Link>
                    <Link href="#" className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-[#151921] transition-colors">
                        <span className="material-symbols-outlined text-[20px]">school</span>
                        <span className="text-sm font-medium">Transcript</span>
                    </Link>
                    <Link href="#" className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-[#151921] transition-colors">
                        <span className="material-symbols-outlined text-[20px]">menu_book</span>
                        <span className="text-sm font-medium">Guide</span>
                    </Link>
                </nav>

                <div className="mt-auto space-y-1">
                    <Link href="/student/settings" className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-[#151921] transition-colors">
                        <span className="material-symbols-outlined text-[20px]">settings</span>
                        <span className="text-sm font-medium">Settings</span>
                    </Link>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-900/10 transition-colors">
                        <span className="material-symbols-outlined text-[20px]">logout</span>
                        <span className="text-sm font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">

                <div className="grid grid-cols-12 gap-6 mb-6">

                    {/* Profile Card */}
                    <div className="col-span-4 bg-[#151921] rounded-2xl p-6 border border-[#1F2937] flex flex-col items-center justify-center text-center">
                        <div className="size-24 rounded-full bg-orange-200 border-4 border-[#1F2937] overflow-hidden mb-4">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="w-full h-full" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-1">Mahasiswa ITS</h2>
                        <p className="text-sm text-gray-400 mb-4">Department of Informatics</p>
                        <div className="bg-[#1F2937] rounded-full px-4 py-1 text-xs font-mono text-gray-300 mb-6">NRP: 5025201001</div>

                        <div className="w-full bg-[#0E1218] rounded-xl p-4 border border-[#1F2937]">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-[10px] font-bold text-gray-500 uppercase">Holistic Score</span>
                                <div className="text-right">
                                    <span className="text-blue-500 font-bold">Excellent</span>
                                    <span className="text-2xl font-bold text-yellow-500 ml-2">780</span>
                                    <span className="text-xs text-gray-500">/1000</span>
                                </div>
                            </div>
                            <div className="w-full h-2 bg-[#1F2937] rounded-full overflow-hidden">
                                <div className="h-full bg-yellow-500 w-[78%] rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    {/* Welcome Banner */}
                    <div className="col-span-8 bg-[#151921] rounded-2xl overflow-hidden relative border border-[#1F2937] flex flex-col justify-center p-10 group">
                        {/* Background Accent */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#151921] via-transparent to-blue-900/20"></div>
                        <div className="absolute -right-20 -top-20 size-64 bg-blue-600/10 rounded-full blur-3xl"></div>

                        <div className="relative z-10 max-w-lg">
                            <div className="inline-flex items-center gap-2 bg-yellow-500/20 text-yellow-500 text-[10px] font-bold px-2 py-1 rounded mb-4 border border-yellow-500/20">
                                <span className="bg-yellow-500 text-black px-1 rounded text-[9px]">UPDATE</span>
                                Term 2024/2025 Started
                            </div>
                            <h2 className="text-4xl font-bold text-white mb-4">Halo, Mahasiswa!</h2>
                            <p className="text-gray-400 mb-8 leading-relaxed">
                                Siap kembangkan potensimu hari ini? Cek aktivitas terbaru atau input kegiatan barumu sekarang.
                            </p>
                            <div className="flex gap-4">
                                <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-colors">
                                    <span className="material-symbols-outlined text-lg">add_circle</span> Input Kegiatan
                                </button>
                                <Link href="#" className="bg-[#2D323E] hover:bg-[#373C48] text-white font-bold py-3 px-6 rounded-lg transition-colors border border-[#3E4451]">
                                    View Guidebook
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-3 gap-6 mb-6">
                    {[
                        { title: 'Input Kegiatan', desc: 'Log new achievement', icon: 'edit_square', color: 'bg-blue-600' },
                        { title: 'Lihat Transkrip', desc: 'Check valid points', icon: 'visibility', color: 'bg-green-600' },
                        { title: 'Panduan', desc: 'Holistic handbook', icon: 'menu_book', color: 'bg-yellow-600' },
                    ].map((action, i) => (
                        <div key={i} className="bg-[#151921] hover:bg-[#1E232D] border border-[#1F2937] p-6 rounded-2xl flex items-center gap-4 cursor-pointer transition-colors group">
                            <div className={`size-12 rounded-xl ${action.color}/20 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <span className={`material-symbols-outlined text-xl ${action.color.replace('bg-', 'text-')}`}>{action.icon}</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-white">{action.title}</h3>
                                <p className="text-xs text-gray-500">{action.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-12 gap-6">

                    {/* Competence Map */}
                    <div className="col-span-4 bg-[#151921] border border-[#1F2937] rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-white">Competence Map</h3>
                            <button className="text-gray-500 hover:text-white"><span className="material-symbols-outlined">more_horiz</span></button>
                        </div>
                        <div className="h-64 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={competenceData}>
                                    <PolarGrid stroke="#374151" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                                    <Radar name="Student" dataKey="A" stroke="#F59E0B" strokeWidth={2} fill="#F59E0B" fillOpacity={0.3} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Recent Activities */}
                    <div className="col-span-8 bg-[#151921] border border-[#1F2937] rounded-2xl p-6 flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-gray-400">history</span>
                                <h3 className="font-bold text-white">Recent Activities</h3>
                            </div>
                            <Link href="/student/activities/management" className="text-xs font-bold text-blue-500 flex items-center gap-1 hover:underline">
                                View All <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                            </Link>
                        </div>

                        <div className="flex-1 overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="text-xs font-bold text-gray-500 uppercase border-b border-[#2D323E]">
                                        <th className="pb-3 pl-4">Activity Name</th>
                                        <th className="pb-3">Date</th>
                                        <th className="pb-3">Category</th>
                                        <th className="pb-3 text-right pr-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#2D323E]">
                                    {activities.map((activity, i) => (
                                        <tr key={i} className="hover:bg-[#1E232D] transition-colors group">
                                            <td className="py-4 pl-4 font-bold text-white group-hover:text-blue-400 transition-colors">
                                                {activity.name}
                                                <div className="block md:hidden text-[10px] text-gray-500 font-normal mt-1">{activity.category}</div>
                                            </td>
                                            <td className="py-4 text-gray-400">{activity.date}</td>
                                            <td className="py-4">
                                                <span className="bg-[#1F2937] text-gray-300 px-2 py-1 rounded text-xs border border-[#374151]">
                                                    {activity.category}
                                                </span>
                                            </td>
                                            <td className="py-4 text-right pr-4">
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase
                                                     ${activity.status === 'Approved' ? 'bg-green-900/20 text-green-500 border border-green-900/50' :
                                                        activity.status === 'Pending' ? 'bg-yellow-900/20 text-yellow-500 border border-yellow-900/50' :
                                                            'bg-red-900/20 text-red-500 border border-red-900/50'}`}>
                                                    {activity.status}
                                                </span>
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
    );
}
