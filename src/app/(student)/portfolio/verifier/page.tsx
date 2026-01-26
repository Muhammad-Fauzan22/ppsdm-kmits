"use client";

import React from "react";
import Link from "next/link";

export default function VerifierPage() {
    return (
        <div className="min-h-screen bg-[#0E1015] text-white font-sans p-8">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                        <span>Portfolio</span> / <span className="text-white">020 Verifier</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-2">020 Activity Verifier</h1>
                    <p className="text-gray-400 max-w-2xl">
                        Bridge your physical campus presence with your digital blockchain portfolio. Scan into events to mint your proof of attendance.
                    </p>
                </div>
                <div className="bg-[#0A2718] border border-green-900 text-green-500 px-4 py-2 rounded-full flex items-center gap-2 text-xs font-bold animate-pulse">
                    <span className="material-symbols-outlined text-sm">wifi_tethering</span>
                    Blockchain Network: Active
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Left Column: Stats & List */}
                <div className="space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#15171E] border border-[#262A35] p-6 rounded-2xl relative overflow-hidden group">
                            <div className="absolute top-4 right-4 text-[#262A35] group-hover:text-blue-900 transition-colors">
                                <span className="material-symbols-outlined text-6xl">verified</span>
                            </div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Skill Impact</p>
                            <div className="flex items-baseline gap-2 mb-4">
                                <span className="text-4xl font-bold">+15 XP</span>
                                <span className="text-xs text-gray-400">Pending Mint</span>
                            </div>
                            <div className="w-full h-1 bg-[#262A35] rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600 w-1/2 animate-shimmer"></div>
                            </div>
                        </div>

                        <div className="bg-[#15171E] border border-[#262A35] p-6 rounded-2xl relative overflow-hidden">
                            <div className="absolute top-4 right-4 text-[#262A35]">
                                <span className="material-symbols-outlined text-6xl">event</span>
                            </div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Verified Events</p>
                            <div className="flex items-baseline gap-2 mb-4">
                                <span className="text-4xl font-bold">12</span>
                                <span className="text-xs text-gray-400">This Semester</span>
                            </div>
                            <p className="text-[10px] text-gray-500">Last verified: 2 days ago</p>
                        </div>
                    </div>

                    {/* Pending Verification List */}
                    <div className="bg-[#15171E] border border-[#262A35] rounded-2xl overflow-hidden">
                        <div className="p-4 border-b border-[#262A35] flex justify-between items-center">
                            <h3 className="font-bold text-sm uppercase tracking-wider">Pending Verification</h3>
                            <button className="text-blue-500 text-xs font-bold hover:underline">View History</button>
                        </div>

                        <div className="divide-y divide-[#262A35]">
                            {/* Item 1 */}
                            <div className="p-4 hover:bg-[#1A1D24] transition-colors group">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex gap-4">
                                        <div className="size-10 bg-orange-900/20 text-orange-500 rounded-lg flex items-center justify-center">
                                            <span className="material-symbols-outlined">theater_comedy</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-white group-hover:text-blue-400 transition-colors">Leadership Seminar 101</h4>
                                            <p className="text-xs text-gray-500">Auditorium B • Org: Student Council</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-gray-500 font-mono">Today, 10:30 AM</span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-orange-500 font-mono ml-14">
                                    <span className="material-symbols-outlined text-xs animate-spin">sync</span>
                                    Verifying on Blockchain (Confirming Blocks...)
                                </div>
                                <p className="text-[8px] text-gray-600 font-mono ml-14 mt-1">TxHash: 0x82...3f9a</p>
                            </div>

                            {/* Item 2 */}
                            <div className="p-4 hover:bg-[#1A1D24] transition-colors group">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex gap-4">
                                        <div className="size-10 bg-green-900/20 text-green-500 rounded-lg flex items-center justify-center">
                                            <span className="material-symbols-outlined">forest</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-white group-hover:text-green-400 transition-colors">Campus Clean-up Drive</h4>
                                            <p className="text-xs text-gray-500">Main Grounds • Org: EcoClub</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-gray-500 font-mono">Yesterday</span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-green-500 font-mono ml-14">
                                    <span className="material-symbols-outlined text-xs">check_circle</span>
                                    Verified via Polygon
                                </div>
                            </div>

                            {/* Item 3 */}
                            <div className="p-4 hover:bg-[#1A1D24] transition-colors group opacity-60">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex gap-4">
                                        <div className="size-10 bg-blue-900/20 text-blue-500 rounded-lg flex items-center justify-center">
                                            <span className="material-symbols-outlined">sports_tennis</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-white">Badminton Tournament</h4>
                                            <p className="text-xs text-gray-500">Sports Center • Org: Athletics Dept</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-gray-500 font-mono">2 days ago</span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono ml-14">
                                    <span className="material-symbols-outlined text-xs">schedule</span>
                                    Waiting for Organizer Approval
                                </div>
                            </div>
                        </div>

                        <div className="p-3 bg-[#1A1D24] text-center">
                            <p className="text-[10px] text-gray-500">Only events from the last 30 days are shown here.</p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Scanner & ID */}
                <div className="bg-[#0A0C10] border border-[#262A35] rounded-[32px] p-8 flex flex-col items-center shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-blue-900/5 rotate-12 scale-150 rounded-full blur-3xl"></div>

                    <div className="w-full flex justify-between items-center mb-8 relative z-10 border-b border-[#262A35] pb-4">
                        <div>
                            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">Digital ID</p>
                            <h3 className="text-xl font-bold text-white">Student Pass</h3>
                        </div>
                        <div className="size-8 rounded-full bg-blue-900/30 flex items-center justify-center border border-blue-500/50">
                            <span className="material-symbols-outlined text-blue-400 text-sm">fingerprint</span>
                        </div>
                    </div>

                    {/* QR Frame */}
                    <div className="relative size-64 bg-white rounded-3xl p-4 mb-4 z-10 shadow-[0_0_50px_rgba(37,99,235,0.2)] group cursor-pointer">
                        <div className="absolute inset-0 border-[3px] border-transparent group-hover:border-blue-500 rounded-3xl transition-colors"></div>

                        {/* Corner Markers */}
                        <div className="absolute top-0 left-0 size-8 border-t-4 border-l-4 border-blue-500 rounded-tl-xl -translate-x-1 -translate-y-1"></div>
                        <div className="absolute top-0 right-0 size-8 border-t-4 border-r-4 border-blue-500 rounded-tr-xl translate-x-1 -translate-y-1"></div>
                        <div className="absolute bottom-0 left-0 size-8 border-b-4 border-l-4 border-blue-500 rounded-bl-xl -translate-x-1 translate-y-1"></div>
                        <div className="absolute bottom-0 right-0 size-8 border-b-4 border-r-4 border-blue-500 rounded-br-xl translate-x-1 translate-y-1"></div>

                        <div className="w-full h-full bg-black rounded-xl flex items-center justify-center overflow-hidden relative">
                            {/* Faux QR Code Pattern */}
                            <div className="absolute inset-0 bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PPSDM-VERIFIER')] opacity-80 mix-blend-screen bg-cover"></div>
                            <div className="size-16 bg-white p-1 rounded relative z-10">
                                <div className="w-full h-full bg-black flex items-center justify-center">
                                    <span className="material-symbols-outlined text-white text-3xl">school</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mb-12 relative z-10">
                        <div className="flex justify-center items-center gap-2 text-[10px] text-gray-400 font-mono mb-2">
                            <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                            Token refreshes in <span className="text-blue-500 font-bold">00:42</span>
                        </div>
                        <p className="text-xs text-gray-600">Scan at event entrance</p>
                    </div>

                    <div className="w-full h-px bg-[#262A35] mb-8"></div>

                    {/* Action Button */}
                    <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-full shadow-lg shadow-blue-900/40 flex items-center justify-center gap-3 transition-all active:scale-95 relative z-10">
                        <span className="material-symbols-outlined">qr_code_scanner</span>
                        Scan Event Code
                    </button>
                    <p className="text-[10px] text-gray-500 text-center mt-4 max-w-xs mx-auto leading-relaxed relative z-10">
                        Use this button to scan an event organizer's code instead of showing yours.
                    </p>

                </div>
            </div>
        </div>
    );
}
