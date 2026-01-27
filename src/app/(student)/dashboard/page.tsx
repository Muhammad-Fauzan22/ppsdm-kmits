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
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-12 gap-6 mb-6">

                {/* Profile Card */}
                <div className="col-span-12 lg:col-span-4 bg-white dark:bg-card-dark rounded-2xl p-6 border border-slate-200 dark:border-white/10 flex flex-col items-center justify-center text-center shadow-soft">
                    <div className="size-24 rounded-full bg-orange-200 border-4 border-white dark:border-card-dark overflow-hidden mb-4 shadow-md">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="w-full h-full" alt="Avatar" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Mahasiswa ITS</h2>
                    <p className="text-sm text-slate-500 mb-4">Department of Informatics</p>
                    <div className="bg-slate-100 dark:bg-white/5 rounded-full px-4 py-1 text-xs font-mono text-slate-600 dark:text-slate-300 mb-6">NRP: 5025201001</div>

                    <div className="w-full bg-slate-50 dark:bg-black/20 rounded-xl p-4 border border-slate-200 dark:border-white/5">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-[10px] font-bold text-slate-500 uppercase">Holistic Score</span>
                            <div className="text-right">
                                <span className="text-brand-blue font-bold">Excellent</span>
                                <span className="text-2xl font-bold text-its-gold ml-2">780</span>
                                <span className="text-xs text-slate-500">/1000</span>
                            </div>
                        </div>
                        <div className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-its-gold w-[78%] rounded-full shadow-[0_0_10px_rgba(255,215,0,0.5)]"></div>
                        </div>
                    </div>
                </div>

                {/* Welcome Banner */}
                <div className="col-span-12 lg:col-span-8 bg-brand-blue rounded-2xl overflow-hidden relative border border-brand-blue/50 flex flex-col justify-center p-10 group shadow-lg shadow-brand-blue/20">
                    {/* Background Accent */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                    <div className="absolute -right-20 -top-20 size-64 bg-white/10 rounded-full blur-3xl"></div>

                    <div className="relative z-10 max-w-lg">
                        <div className="inline-flex items-center gap-2 bg-white/10 text-white text-[10px] font-bold px-2 py-1 rounded mb-4 border border-white/20 backdrop-blur-md">
                            <span className="bg-its-gold text-its-dark px-1.5 py-0.5 rounded text-[9px]">UPDATE</span>
                            Term 2024/2025 Started
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Halo, Mahasiswa!</h2>
                        <p className="text-blue-100 mb-8 leading-relaxed">
                            Siap kembangkan potensimu hari ini? Cek aktivitas terbaru atau input kegiatan barumu sekarang.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button className="bg-white text-brand-blue hover:bg-blue-50 font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg active:scale-95">
                                <span className="material-symbols-outlined text-lg">add_circle</span> Input Kegiatan
                            </button>
                            <Link href="#" className="bg-blue-800/50 hover:bg-blue-800/70 text-white font-bold py-3 px-6 rounded-xl transition-all border border-blue-400/30 backdrop-blur-sm">
                                View Guidebook
                            </Link>
                        </div>
                    </div>
                </div>

            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {[
                    { title: 'Input Kegiatan', desc: 'Log new achievement', icon: 'edit_square', color: 'bg-brand-blue', text: 'text-brand-blue' },
                    { title: 'Lihat Transkrip', desc: 'Check valid points', icon: 'visibility', color: 'bg-emerald-600', text: 'text-emerald-600' },
                    { title: 'Panduan', desc: 'Holistic handbook', icon: 'menu_book', color: 'bg-its-gold', text: 'text-its-gold' },
                ].map((action, i) => (
                    <div key={i} className="bg-white dark:bg-card-dark hover:bg-slate-50 dark:hover:bg-white/5 border border-slate-200 dark:border-white/10 p-6 rounded-2xl flex items-center gap-4 cursor-pointer transition-all hover:translate-y-[-2px] hover:shadow-lg group">
                        <div className={`size-12 rounded-xl ${action.text} bg-current/10 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <span className={`material-symbols-outlined text-xl`}>{action.icon}</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-brand-blue transition-colors">{action.title}</h3>
                            <p className="text-xs text-slate-500">{action.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-12 gap-6">

                {/* Competence Map */}
                <div className="col-span-12 lg:col-span-4 bg-white dark:bg-card-dark border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-soft">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-900 dark:text-white">Competence Map</h3>
                        <button className="text-slate-400 hover:text-brand-blue"><span className="material-symbols-outlined">more_horiz</span></button>
                    </div>
                    <div className="h-64 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={competenceData}>
                                <PolarGrid stroke="#e2e8f0" strokeOpacity={0.5} />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                                <Radar name="Student" dataKey="A" stroke="#FFD700" strokeWidth={2} fill="#FFD700" fillOpacity={0.4} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="col-span-12 lg:col-span-8 bg-white dark:bg-card-dark border border-slate-200 dark:border-white/10 rounded-2xl p-6 flex flex-col shadow-soft">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-brand-blue">history</span>
                            <h3 className="font-bold text-slate-900 dark:text-white">Recent Activities</h3>
                        </div>
                        <Link href="/student/activities/management" className="text-xs font-bold text-brand-blue flex items-center gap-1 hover:underline">
                            View All <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </Link>
                    </div>

                    <div className="flex-1 overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="text-xs font-bold text-slate-400 uppercase border-b border-slate-100 dark:border-white/5">
                                    <th className="pb-3 pl-4">Activity Name</th>
                                    <th className="pb-3">Date</th>
                                    <th className="pb-3">Category</th>
                                    <th className="pb-3 text-right pr-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                {activities.map((activity, i) => (
                                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group text-slate-600 dark:text-slate-300">
                                        <td className="py-4 pl-4 font-bold text-slate-900 dark:text-white group-hover:text-brand-blue transition-colors">
                                            {activity.name}
                                            <div className="block md:hidden text-[10px] text-slate-400 font-normal mt-1">{activity.category}</div>
                                        </td>
                                        <td className="py-4 text-slate-500">{activity.date}</td>
                                        <td className="py-4">
                                            <span className="bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 px-2.5 py-0.5 rounded text-xs border border-slate-200 dark:border-white/10 font-medium">
                                                {activity.category}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right pr-4">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                                                 ${activity.status === 'Approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20' :
                                                    activity.status === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20' :
                                                        'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-500/20'}`}>
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

        </div>
    );
}
