"use client";

import React, { useState } from "react";
import Link from "next/link";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, AreaChart, Area, Tooltip } from "recharts";

export default function SupervisorStudentView() {
    const competenceData = [
        { subject: 'Technical', A: 120, fullMark: 150 },
        { subject: 'Attendance', A: 98, fullMark: 150 },
        { subject: 'Participation', A: 86, fullMark: 150 },
        { subject: 'Soft Skills', A: 99, fullMark: 150 },
        { subject: 'Theory', A: 85, fullMark: 150 },
        { subject: 'Labs', A: 65, fullMark: 150 },
    ];

    const gradeTrendData = [
        { week: 'W1', val: 3.2 }, { week: 'W2', val: 3.3 }, { week: 'W3', val: 3.4 },
        { week: 'W4', val: 3.5 }, { week: 'W5', val: 3.45 }, { week: 'W6', val: 3.42 },
    ];

    const assignmentData = [
        { week: 'W1', val: 80 }, { week: 'W2', val: 82 }, { week: 'W3', val: 85 },
        { week: 'W4', val: 88 }, { week: 'W5', val: 90 }, { week: 'W6', val: 88.5 },
    ];

    return (
        <div className="min-h-screen bg-[#0E1218] text-gray-300 font-sans p-6 overflow-hidden">

            {/* Header */}
            <header className="flex justify-between items-center mb-8 border-b border-[#2D303E] pb-6">
                <div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                        <span>Home</span> / <span>Students</span> / <span className="text-white">Profile View</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Student Deep-Dive</h1>
                    <div className="flex gap-4 text-sm font-bold text-gray-400">
                        <button className="text-blue-500 border-b-2 border-blue-500 pb-2">Overview</button>
                        <button className="hover:text-white pb-2">Academic Radar</button>
                        <button className="hover:text-white pb-2">RPI Timeline</button>
                        <button className="hover:text-white pb-2">Activity Log</button>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400">Semester:</span>
                    <div className="bg-[#1C2028] border border-[#2D303E] px-3 py-1.5 rounded text-sm text-white font-bold flex items-center gap-2 cursor-pointer">
                        Fall 2024 (Current) <span className="material-symbols-outlined text-sm">expand_more</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-[300px_1fr_300px] gap-6 h-[calc(100vh-180px)]">

                {/* Left Column: Student Profile */}
                <aside className="space-y-6">
                    {/* Portrait Card */}
                    <div className="bg-[#161B22] border border-[#2D303E] rounded-2xl p-6 text-center">
                        <div className="size-32 mx-auto rounded-full bg-yellow-200 border-4 border-[#2D303E] mb-4 relative">
                            {/* Avatar Placeholder */}
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Student" className="w-full h-full rounded-full" />
                            <div className="absolute bottom-2 right-2 size-4 bg-green-500 rounded-full border-2 border-[#161B22]"></div>
                        </div>
                        <h2 className="text-xl font-bold text-white">Alexandria Rahel</h2>
                        <p className="text-xs text-gray-500 mb-4 font-mono">ID: 2024001</p>
                        <div className="inline-flex items-center gap-2 bg-[#252932] px-3 py-1 rounded-full text-[10px] font-bold text-gray-300">
                            <span className="material-symbols-outlined text-sm">school</span> Computer Science
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[#161B22] border border-[#2D303E] p-4 rounded-xl">
                            <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">GPA</p>
                            <p className="text-2xl font-bold text-white flex items-baseline gap-1">
                                3.42 <span className="text-[10px] text-red-500">▼ 0.1</span>
                            </p>
                        </div>
                        <div className="bg-[#161B22] border border-[#2D303E] p-4 rounded-xl">
                            <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Credits</p>
                            <p className="text-2xl font-bold text-white">112</p>
                        </div>
                        <div className="bg-[#161B22] border border-[#2D303E] p-4 rounded-xl">
                            <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Attendance</p>
                            <p className="text-2xl font-bold text-white flex items-baseline gap-1">
                                94% <span className="text-[10px] text-green-500">▲ 2%</span>
                            </p>
                        </div>
                        <div className="bg-[#161B22] border border-orange-500/30 p-4 rounded-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-1">
                                <span className="size-2 rounded-full bg-orange-500 animate-pulse block"></span>
                            </div>
                            <p className="text-[10px] text-orange-500 uppercase font-bold mb-1">Risk Level</p>
                            <p className="text-md font-bold text-orange-400">Moderate</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <button className="w-full bg-[#1C2028] hover:bg-[#252932] border border-[#2D303E] text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors">
                            <span className="material-symbols-outlined text-sm">mail</span> Email Student
                        </button>
                        <button className="w-full bg-[#1C2028] hover:bg-[#252932] border border-[#2D303E] text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors">
                            <span className="material-symbols-outlined text-sm">chat</span> WhatsApp
                        </button>
                        <button className="w-full bg-[#1C2028] hover:bg-[#252932] border border-[#2D303E] text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors">
                            <span className="material-symbols-outlined text-sm">calendar_month</span> Schedule Meeting
                        </button>
                    </div>

                    {/* Last Note */}
                    <div className="bg-[#161B22] border border-[#2D303E] rounded-xl p-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-bold text-gray-500 uppercase">Last Note</span>
                            <span className="text-[10px] text-gray-600">2 days ago</span>
                        </div>
                        <p className="text-xs text-gray-400 italic leading-relaxed mb-4">
                            "Discussed the drop in Data Structures grades. Student mentioned health issues last month. Agreed to submit make-up..."
                        </p>
                        <button className="text-blue-500 text-[10px] font-bold hover:underline">View all notes</button>
                    </div>
                </aside>

                {/* Middle Column: Analytics */}
                <main className="grid grid-rows-[300px_1fr] gap-6 overflow-hidden">

                    {/* Top Row Charts */}
                    <div className="grid grid-cols-3 gap-6">
                        {/* Radar */}
                        <div className="bg-[#161B22] border border-[#2D303E] rounded-2xl p-4 flex flex-col relative">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-bold text-sm text-white">Competency Map</h3>
                                <span className="material-symbols-outlined text-gray-600 text-sm">more_horiz</span>
                            </div>
                            <div className="flex-1 -ml-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={competenceData}>
                                        <PolarGrid stroke="#30363D" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                                        <Radar name="Mike" dataKey="A" stroke="#3B82F6" strokeWidth={2} fill="#3B82F6" fillOpacity={0.3} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* GPA Trend */}
                        <div className="bg-[#161B22] border border-[#2D303E] rounded-2xl p-4 flex flex-col relative">
                            <div className="flex justify-between items-center mb-1">
                                <h3 className="font-bold text-sm text-gray-400">GPA Trend</h3>
                                <span className="bg-red-900/30 text-red-500 text-[10px] px-1.5 py-0.5 rounded font-bold">-0.12%</span>
                            </div>
                            <p className="text-2xl font-bold text-white mb-4">3.42</p>
                            <div className="flex-1">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={gradeTrendData}>
                                        <defs>
                                            <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <Tooltip contentStyle={{ backgroundColor: '#1C2028', border: 'none', borderRadius: '8px', fontSize: '12px' }} />
                                        <Area type="monotone" dataKey="val" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorGpa)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex justify-between text-[10px] text-gray-500 mt-2">
                                <span>Sem 1</span>
                                <span>Sem 5</span>
                            </div>
                        </div>

                        {/* Assignment Scores */}
                        <div className="bg-[#161B22] border border-[#2D303E] rounded-2xl p-4 flex flex-col relative">
                            <div className="flex justify-between items-center mb-1">
                                <h3 className="font-bold text-sm text-gray-400">Assignment Scores</h3>
                                <span className="bg-green-900/30 text-green-500 text-[10px] px-1.5 py-0.5 rounded font-bold">+5.2%</span>
                            </div>
                            <p className="text-2xl font-bold text-white mb-4">88.5 <span className="text-xs text-gray-500 font-normal">avg</span></p>
                            <div className="flex-1">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={assignmentData}>
                                        <defs>
                                            <linearGradient id="colorAssign" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <Area type="monotone" dataKey="val" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorAssign)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex justify-between text-[10px] text-gray-500 mt-2">
                                <span>Week 1</span>
                                <span>Week 12</span>
                            </div>
                        </div>
                    </div>

                    {/* Timeline / Activity Log */}
                    <div className="bg-[#161B22] border border-[#2D303E] rounded-2xl p-6 overflow-hidden flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-white">Recent Activity & Milestones</h3>
                            <button className="text-blue-500 text-xs font-bold hover:underline">View Full Log</button>
                        </div>

                        <div className="relative space-y-8 flex-1 overflow-y-auto pr-2">
                            {/* Vertical Line */}
                            <div className="absolute left-1.5 top-2 bottom-2 w-px bg-[#30363D]"></div>

                            {[
                                { title: "Missed Deadline: Linear Algebra Quiz", desc: "Automatically flagged by LMS.", time: "Today, 09:41 AM", color: "bg-red-500" },
                                { title: "Submitted: Thesis Proposal Draft", desc: "File: thesis_v1.pdf", time: "Yesterday, 4:20 PM", color: "bg-green-500" },
                                { title: "Supervisor Meeting Logged", desc: "Topic: Semester goals and internship search.", time: "Oct 24, 2024", color: "bg-blue-400" },
                                { title: "Mid-Term Exam Period Started", desc: "Academic Milestone", time: "Oct 20, 2024", color: "bg-blue-600" },
                            ].map((item, i) => (
                                <div key={i} className="relative pl-6">
                                    <div className={`absolute left-0 top-1.5 size-3 rounded-full ${item.color} border-2 border-[#161B22]`}></div>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="text-sm font-bold text-white">{item.title}</h4>
                                            <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                                        </div>
                                        <span className="text-[10px] text-gray-500 font-mono hidden xl:block">{item.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>

                {/* Right Column: Supervisor Actions */}
                <aside className="">
                    <div className="bg-[#161B22] border border-[#2D303E] rounded-2xl p-6 h-full flex flex-col">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="material-symbols-outlined text-blue-500 text-lg">warning</span>
                            <h3 className="font-bold text-white text-xs uppercase tracking-wider">Supervisor Actions</h3>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="text-[10px] text-gray-400 uppercase font-bold mb-1 block">Action Type</label>
                                <div className="bg-[#252932] border border-[#30363D] text-white text-sm px-3 py-2 rounded-lg flex justify-between items-center cursor-pointer">
                                    Academic Warning <span className="material-symbols-outlined text-sm">expand_more</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] text-gray-400 uppercase font-bold mb-1 block">Note to Student</label>
                                <textarea className="w-full h-32 bg-[#252932] border border-[#30363D] text-white text-sm p-3 rounded-lg resize-none placeholder-gray-600 focus:outline-none focus:border-blue-500" placeholder="Write your message here..."></textarea>
                            </div>
                            <div>
                                <label className="text-[10px] text-gray-400 uppercase font-bold mb-2 block">Severity</label>
                                <div className="grid grid-cols-3 gap-2">
                                    <button className="bg-[#1C2028] border border-[#30363D] text-gray-400 py-1.5 rounded textxs font-bold hover:text-white">Low</button>
                                    <button className="bg-[#302008] border border-orange-500/50 text-orange-500 py-1.5 rounded text-xs font-bold">Med</button>
                                    <button className="bg-[#1C2028] border border-[#30363D] text-gray-400 py-1.5 rounded text-xs font-bold hover:text-white">High</button>
                                </div>
                            </div>
                        </div>

                        <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 mt-auto transition-colors">
                            <span className="material-symbols-outlined text-sm">send</span> Send Intervention
                        </button>
                    </div>
                </aside>

            </div>
        </div>
    );
}
