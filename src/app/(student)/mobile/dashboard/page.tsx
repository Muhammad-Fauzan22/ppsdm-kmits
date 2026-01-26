"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function MobileDashboard() {
    return (
        <div className="min-h-screen bg-[#0E1218] flex justify-center items-center py-10 bg-dotted-pattern">
            {/* Mobile Frame */}
            <div className="w-[390px] h-[844px] bg-[#0B0D11] rounded-[40px] border-8 border-[#1C1F26] overflow-hidden relative shadow-2xl flex flex-col">

                {/* Status Bar (Fake) */}
                <div className="h-12 flex justify-between items-center px-6 pt-2 text-white text-xs font-bold relative z-20">
                    <span>9:41</span>
                    <div className="flex gap-1.5">
                        <span className="material-symbols-outlined text-xs">signal_cellular_alt</span>
                        <span className="material-symbols-outlined text-xs">wifi</span>
                        <span className="material-symbols-outlined text-xs">battery_full</span>
                    </div>
                </div>

                {/* Header */}
                <div className="px-6 mb-6">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <div className="size-8 rounded-full bg-blue-600 flex items-center justify-center">
                                <span className="material-symbols-outlined text-white text-sm">school</span>
                            </div>
                            <span className="font-bold text-white text-sm">PPSDM Student</span>
                        </div>
                        <div className="flex gap-3">
                            <span className="material-symbols-outlined text-gray-400">notifications</span>
                            <div className="size-6 rounded-full bg-yellow-200 border border-yellow-500 overflow-hidden">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" className="w-full h-full" />
                            </div>
                        </div>
                    </div>

                    <p className="text-gray-400 text-xs mb-1">Welcome back,</p>
                    <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 gap-4 px-6 mb-8">
                    <div className="bg-[#161B22] p-4 rounded-2xl border border-[#2D303E] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-symbols-outlined text-4xl text-blue-500">star</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2 text-blue-400">
                            <span className="material-symbols-outlined text-sm">star</span>
                            <span className="text-xs font-bold">GPA</span>
                        </div>
                        <p className="text-2xl font-bold text-white">3.8</p>
                    </div>
                    <div className="bg-[#161B22] p-4 rounded-2xl border border-[#2D303E] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-symbols-outlined text-4xl text-green-500">book</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2 text-green-400">
                            <span className="material-symbols-outlined text-sm">credit_card</span>
                            <span className="text-xs font-bold">Credits</span>
                        </div>
                        <p className="text-2xl font-bold text-white">85</p>
                    </div>
                </div>

                {/* Upcoming */}
                <div className="px-6 flex-1 overflow-y-auto no-scrollbar pb-24">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-white text-lg">Upcoming</h3>
                        <button className="text-blue-500 text-xs font-bold">See all</button>
                    </div>

                    <div className="space-y-4">
                        {/* Card 1 */}
                        <div className="bg-[#161B22] rounded-2xl border border-[#2D303E] overflow-hidden">
                            <div className="h-24 bg-gradient-to-br from-orange-300 to-pink-500 relative"></div>
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-white text-lg">UX Design Class</h4>
                                    <span className="bg-[#0B0D11] text-blue-400 text-[10px] font-bold px-2 py-1 rounded">10:00 AM</span>
                                </div>
                                <p className="text-xs text-gray-500">Room 304 • Prof. Anderson</p>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-[#161B22] rounded-2xl border border-[#2D303E] overflow-hidden">
                            <div className="h-24 bg-gradient-to-br from-emerald-400 to-cyan-600 relative"></div>
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-white text-lg">Data Structures</h4>
                                    <span className="bg-[#0B0D11] text-gray-400 text-[10px] font-bold px-2 py-1 rounded">2:00 PM</span>
                                </div>
                                <p className="text-xs text-gray-500">Lab 2 • Dr. Chen</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Nav */}
                <div className="absolute bottom-0 w-full h-20 bg-[#0B0D11]/90 backdrop-blur-md border-t border-[#2D303E] flex items-center justify-around px-2 z-30 rounded-b-[32px]">
                    {[
                        { icon: "dashboard", label: "Dashboard", active: true },
                        { icon: "verified_user", label: "Assessment", active: false },
                        { icon: "menu_book", label: "Library", active: false },
                        { icon: "timeline", label: "RPI", active: false },
                        { icon: "emoji_events", label: "Portfolio", active: false },
                    ].map((item) => (
                        <div key={item.label} className="flex flex-col items-center gap-1 w-14">
                            <span className={`material-symbols-outlined text-xl ${item.active ? 'text-blue-500' : 'text-gray-500'}`}>{item.icon}</span>
                            <span className={`text-[9px] font-medium ${item.active ? 'text-white' : 'text-gray-600'}`}>{item.label}</span>
                        </div>
                    ))}
                </div>

                {/* Home Indicator */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-700 rounded-full z-40"></div>

            </div>
        </div>
    );
}
