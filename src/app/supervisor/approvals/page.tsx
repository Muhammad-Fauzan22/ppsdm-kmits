"use client";

import React, { useState } from "react";
import { Icon } from "@/components/ui/Icon";

export default function SupervisorApprovals() {
    const [selectedRequest, setSelectedRequest] = useState<string | null>("REQ-001");

    const requests = [
        { id: "REQ-001", user: "Sarah Jenkins", avatar: "Sarah", title: "Intro to Data Science Workshop", type: "Certificate", status: "Pending", time: "2m ago" },
        { id: "REQ-002", user: "Michael Chen", avatar: "Michael", title: "Advanced Python Certification", type: "Course", status: "Pending", time: "1h ago" },
        { id: "REQ-003", user: "Alex Lee", avatar: "Alex", title: "Volunteer: Community Cleanup", type: "Activity", status: "Pending", time: "3h ago" },
        { id: "REQ-004", user: "Emily Watson", avatar: "Emily", title: "Web Development Bootcamp", type: "Certificate", status: "Pending", time: "Yesterday" },
        { id: "REQ-005", user: "Jessica Robinson", avatar: "Jessica", title: "UI/UX Design Fundamentals", type: "Course", status: "Pending", time: "Yesterday" },
    ];

    const currentRequest = requests.find(r => r.id === selectedRequest) || requests[0];

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden">

            {/* Left Panel: Request List */}
            <div className="w-96 border-r border-[#2D303E] bg-[#111318] flex flex-col">
                <div className="p-6 border-b border-[#2D303E]">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Pending Requests</h2>
                        <button className="bg-blue-600/10 text-blue-500 text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1 hover:bg-blue-600/20 transition-colors">
                            <Icon name="CheckCheck" size="sm" /> Approve All
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 font-medium">12 items waiting for review</p>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {requests.map(req => (
                        <div
                            key={req.id}
                            onClick={() => setSelectedRequest(req.id)}
                            className={`p-4 border-b border-[#1F2937] cursor-pointer transition-colors hover:bg-[#1C2028] ${selectedRequest === req.id ? 'bg-[#151921] border-l-4 border-l-blue-600' : 'border-l-4 border-l-transparent'}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-gray-700 overflow-hidden">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${req.avatar}`} alt={`Avatar of ${req.user}`} />
                                    </div>
                                    <div>
                                        <h3 className={`text-sm font-bold ${selectedRequest === req.id ? 'text-white' : 'text-gray-300'}`}>{req.user}</h3>
                                        <p className="text-xs text-blue-400 font-medium truncate w-40">{req.title}</p>
                                    </div>
                                </div>
                                <span className="text-[10px] text-gray-500 font-medium">{req.time}</span>
                            </div>
                            <div className="pl-13 ml-12 flex gap-2">
                                <span className="bg-yellow-900/20 text-yellow-600 text-[10px] font-bold px-2 py-0.5 rounded border border-yellow-900/30">Pending</span>
                                <span className="text-[10px] text-gray-500 py-0.5">{req.type}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Panel: Detail View */}
            <div className="flex-1 bg-[#0E1015] flex flex-col p-8 overflow-y-auto">

                <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-3">
                        <span className="bg-[#1C2028] text-blue-400 text-xs font-bold px-2 py-1 rounded border border-[#2D303E]">Certificate Request</span>
                        <span className="text-gray-500 text-xs font-mono">ID: #{currentRequest.id}</span>
                    </div>
                    <div className="flex gap-2">
                        <button className="text-gray-500 hover:text-white"><Icon name="Printer" /></button>
                        <button className="text-gray-500 hover:text-white"><Icon name="MoreVertical" /></button>
                    </div>
                </div>

                <h1 className="text-3xl font-bold mb-8">{currentRequest.title}</h1>

                {/* Student Info Card */}
                <div className="bg-[#151921] border border-[#2D303E] rounded-xl p-4 flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-full bg-gray-700 overflow-hidden">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentRequest.avatar}`} alt={`Avatar of ${currentRequest.user}`} />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-lg">{currentRequest.user}</h3>
                            <p className="text-sm text-gray-400">Student ID: 2023001 • Computer Science Dept.</p>
                        </div>
                    </div>
                    <div className="bg-[#1C2028] rounded-lg px-4 py-2 text-right border border-[#2D303E]">
                        <p className="text-[10px] text-gray-400 uppercase font-bold">Total Credits</p>
                        <p className="text-xl font-bold text-white">124 <span className="text-sm text-gray-500 font-normal">/ 140</span></p>
                    </div>
                </div>

                <div className="space-y-8 max-w-4xl">
                    <div>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Activity Description</h3>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            I attended a 3-day intensive workshop focusing on Python and the Pandas library for data manipulation. The workshop covered data cleaning, visualization using Matplotlib, and basic statistical analysis.
                        </p>
                        <p className="text-gray-300 leading-relaxed">
                            The final project involved analyzing a real-world dataset regarding global climate change trends over the last 50 years. I have attached the completion certificate provided by the workshop organizers.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Attachments (1)</h3>
                        <div className="bg-[#1C2028] border border-[#2D303E] rounded-xl overflow-hidden group w-96">
                            {/* Preview Placeholder */}
                            <div className="h-48 bg-[#252A36] flex items-center justify-center relative">
                                <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                    <Icon name="FileText" className="text-3xl text-white" />
                                </div>
                                <div className="absolute inset-x-8 top-8 bottom-8 flex flex-col gap-2 opacity-50">
                                    <div className="h-2 bg-gray-500 rounded w-full"></div>
                                    <div className="h-2 bg-gray-500 rounded w-3/4"></div>
                                    <div className="h-2 bg-gray-500 rounded w-full"></div>
                                </div>
                            </div>
                            {/* File Info */}
                            <div className="p-4 flex items-center justify-between bg-[#151921] border-t border-[#2D303E]">
                                <div className="flex items-center gap-3">
                                    <div className="bg-red-900/20 p-2 rounded text-red-500">
                                        <Icon name="FileText" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white truncate w-48">certificate_sjenkins_datascience.pdf</p>
                                        <p className="text-xs text-gray-500">2.4 MB • Uploaded Oct 24, 2023</p>
                                    </div>
                                </div>
                                <button className="text-gray-500 hover:text-white">
                                    <Icon name="Download" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Request Details</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-[#151921] border border-[#2D303E] p-4 rounded-lg">
                                <p className="text-[10px] text-gray-500 mb-1">Activity Date</p>
                                <p className="text-sm font-bold text-white">Oct 20 - Oct 23, 2023</p>
                            </div>
                            <div className="bg-[#151921] border border-[#2D303E] p-4 rounded-lg">
                                <p className="text-[10px] text-gray-500 mb-1">Category</p>
                                <p className="text-sm font-bold text-white">Technical Skill</p>
                            </div>
                            <div className="bg-[#151921] border border-[#2D303E] p-4 rounded-lg">
                                <p className="text-[10px] text-gray-500 mb-1">Supervisor</p>
                                <p className="text-sm font-bold text-white">Prof. Alan Grant</p>
                            </div>
                            <div className="bg-[#151921] border border-[#2D303E] p-4 rounded-lg">
                                <p className="text-[10px] text-gray-500 mb-1">Credit Value</p>
                                <p className="text-sm font-bold text-white">2.0 Points</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="mt-auto pt-8 border-t border-[#2D303E] flex justify-between items-center">
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#2D303E] text-gray-400 hover:text-white hover:bg-[#1C2028] transition-colors font-medium text-sm">
                            <span className="size-5 border border-gray-500 rounded flex items-center justify-center text-[10px]">R</span>
                            Reject
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#2D303E] text-gray-400 hover:text-white hover:bg-[#1C2028] transition-colors font-medium text-sm">
                            <span className="size-5 border border-gray-500 rounded flex items-center justify-center text-[10px]">A</span>
                            Approve
                        </button>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 rounded-lg border border-[#2D303E] text-white hover:bg-[#1C2028] transition-colors font-bold text-sm">
                            <Icon name="X" className="text-lg" /> Reject Request
                        </button>
                        <button className="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors font-bold text-sm shadow-lg shadow-blue-900/40">
                            <Icon name="Check" className="text-lg" /> Approve Request
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
