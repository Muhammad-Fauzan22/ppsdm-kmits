"use client";

import React from "react";
import Link from "next/link";

export default function SupervisorDashboard() {

    // Mock Data
    const students = [
        { name: "Budi Santoso", id: "5025201001", status: "On Track", lastActive: "2 hours ago", color: "bg-green-500", labelColor: "text-green-500 bg-green-900/20 border-green-900/50" },
        { name: "Siti Aminah", id: "5025201045", status: "Risk", lastActive: "5 days ago", color: "bg-red-500", labelColor: "text-red-500 bg-red-900/20 border-red-900/50" },
        { name: "Ahmad Dhani", id: "5025211022", status: "On Track", lastActive: "10 mins ago", color: "bg-green-500", labelColor: "text-green-500 bg-green-900/20 border-green-900/50" },
        { name: "Kevin Sanjaya", id: "5025211044", status: "Warning", lastActive: "1 day ago", color: "bg-yellow-500", labelColor: "text-yellow-500 bg-yellow-900/20 border-yellow-900/50" },
        { name: "Dian Rahmawati", id: "5025221008", status: "On Track", lastActive: "3 hours ago", color: "bg-green-500", labelColor: "text-green-500 bg-green-900/20 border-green-900/50" },
    ];

    return (
        <div className="p-8 max-w-[1600px] mx-auto">

            <div className="flex items-center gap-2 text-sm text-gray-500 font-medium mb-6">
                <Link href="/supervisor/dashboard" className="text-gray-400 hover:text-white">Home</Link> /
                <span className="text-white">Dashboard</span>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

                {/* Total Mentees */}
                <div className="bg-[#151921] border border-[#2D303E] rounded-xl p-6 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Mentees</span>
                        <span className="material-symbols-outlined text-blue-500">groups</span>
                    </div>
                    <h2 className="text-5xl font-bold text-white mb-2">42</h2>
                    <p className="text-sm font-bold text-green-500">+2 since last semester</p>
                </div>

                {/* Need Attention */}
                <div className="bg-[#1C1212] border border-red-900/30 rounded-xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="material-symbols-outlined text-6xl text-red-500">warning</span>
                    </div>
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-bold text-red-400 uppercase tracking-widest">Need Attention</span>
                        <span className="material-symbols-outlined text-red-500">warning</span>
                    </div>
                    <h2 className="text-5xl font-bold text-white mb-2">5</h2>
                    <p className="text-sm font-bold text-red-500">Requires immediate review</p>
                </div>

                {/* Pending Approvals */}
                <div className="bg-[#151921] border border-[#2D303E] rounded-xl p-6 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pending Approvals</span>
                        <span className="material-symbols-outlined text-gray-400">checklist</span>
                    </div>
                    <h2 className="text-5xl font-bold text-white mb-2">12</h2>
                    <p className="text-sm font-medium text-gray-500">Logbook entries & proposals</p>
                </div>

            </div>

            {/* Student List Section */}
            <div className="bg-[#151921] border border-[#2D303E] rounded-xl flex flex-col">

                {/* Toolbar */}
                <div className="p-6 border-b border-[#2D303E] flex justify-between items-center">
                    <div className="relative">
                        <span className="material-symbols-outlined text-gray-400 absolute left-3 top-2.5">search</span>
                        <input type="text" placeholder="Search by Name or NRP..." className="bg-[#0E1015] border border-[#2D303E] rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-blue-500 outline-none w-80 placeholder-gray-600 transition-colors" />
                    </div>

                    <div className="flex gap-3">
                        <button className="bg-[#0E1015] border border-[#2D303E] text-gray-300 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-[#1C2028]">
                            Class Year <span className="material-symbols-outlined text-sm">expand_more</span>
                        </button>
                        <button className="bg-[#0E1015] border border-[#2D303E] text-gray-300 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-[#1C2028]">
                            Student Type <span className="material-symbols-outlined text-sm">expand_more</span>
                        </button>
                        <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">mail</span> Message All
                        </button>
                    </div>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-12 px-6 py-3 bg-[#1C2028] border-b border-[#2D303E] text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <div className="col-span-4">Student Name</div>
                    <div className="col-span-3">NRP</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-3">Last Activity</div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-[#2D303E]">
                    {students.map((student, i) => (
                        <div key={i} className="grid grid-cols-12 px-6 py-4 items-center hover:bg-[#1C2028] transition-colors group cursor-pointer">
                            <div className="col-span-4 flex items-center gap-4">
                                <div className={`size-10 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-white uppercase`}>
                                    {student.name.substring(0, 2)}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{student.name}</h4>
                                    <p className="text-xs text-gray-500">Informatics 2020</p>
                                </div>
                            </div>
                            <div className="col-span-3 text-sm font-mono text-gray-400">
                                {student.id}
                            </div>
                            <div className="col-span-2">
                                <span className={`text-[10px] font-bold px-2 py-1 rounded border capitalize ${student.labelColor}`}>
                                    {student.status}
                                </span>
                            </div>
                            <div className="col-span-3 flex justify-between items-center pr-2">
                                <span className="text-sm text-gray-400">{student.lastActive}</span>
                                <button className="text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="material-symbols-outlined">more_vert</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-[#2D303E] flex justify-between items-center text-xs text-gray-500">
                    <p>Showing 1 to 5 of 42 results</p>
                    <div className="flex border border-[#2D303E] rounded-lg overflow-hidden">
                        <button className="px-3 py-1.5 hover:bg-[#2D303E] transition-colors"><span className="material-symbols-outlined text-xs">chevron_left</span></button>
                        <button className="px-3 py-1.5 bg-[#2D303E] text-white font-bold text-blue-500">1</button>
                        <button className="px-3 py-1.5 hover:bg-[#2D303E] transition-colors">2</button>
                        <button className="px-3 py-1.5 hover:bg-[#2D303E] transition-colors">3</button>
                        <button className="px-3 py-1.5 hover:bg-[#2D303E] transition-colors">...</button>
                        <button className="px-3 py-1.5 hover:bg-[#2D303E] transition-colors"><span className="material-symbols-outlined text-xs">chevron_right</span></button>
                    </div>
                </div>

            </div>

        </div>
    );
}
