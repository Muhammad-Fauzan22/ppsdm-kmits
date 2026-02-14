"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Wifi, ShieldCheck, Calendar, Drama, RefreshCw, Trees, CheckCircle, Trophy, Clock, Fingerprint, GraduationCap, Scan } from 'lucide-react';

export default function VerifierPage() {
    return (
        <div className="min-h-full bg-background-dark text-white font-sans p-6 lg:p-8">
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
                <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1 font-medium">
                        <Link href="/portfolio" className="hover:text-brand-blue transition-colors">Portfolio</Link>
                        <span>/</span>
                        <span className="text-white">Verifier</span>
                    </div>
                    <h1 className="text-3xl font-bold font-grotesk mb-2">Activity Verifier</h1>
                    <p className="text-slate-400 max-w-2xl text-sm">
                        Bridge your physical campus presence with your digital blockchain portfolio. Scan into events to mint your proof of attendance.
                    </p>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full flex items-center gap-2 text-xs font-bold animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    <Wifi className="w-4 h-4" />
                    Blockchain Network: Active
                </div>
            </motion.header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Left Column: Stats & List */}
                <div className="space-y-6">
                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="grid grid-cols-2 gap-4"
                    >
                        <div className="glass-card bg-card-dark border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
                            <div className="absolute top-4 right-4 text-slate-700 group-hover:text-brand-blue/50 transition-colors">
                                <ShieldCheck className="w-16 h-16" />
                            </div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Skill Impact</p>
                            <div className="flex items-baseline gap-2 mb-4 relative z-10">
                                <span className="text-4xl font-bold text-white">+15 XP</span>
                                <span className="text-xs text-slate-400">Pending Mint</span>
                            </div>
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-brand-blue w-1/2 animate-shimmer"></div>
                            </div>
                        </div>

                        <div className="glass-card bg-card-dark border border-white/10 p-6 rounded-2xl relative overflow-hidden">
                            <div className="absolute top-4 right-4 text-slate-700">
                                <Calendar className="w-16 h-16" />
                            </div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Verified Events</p>
                            <div className="flex items-baseline gap-2 mb-4 relative z-10">
                                <span className="text-4xl font-bold text-white">12</span>
                                <span className="text-xs text-slate-400">This Semester</span>
                            </div>
                            <p className="text-[10px] text-slate-500 font-mono">Last verified: 2 days ago</p>
                        </div>
                    </motion.div>

                    {/* Pending Verification List */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-card bg-card-dark border border-white/10 rounded-2xl overflow-hidden"
                    >
                        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20">
                            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-300">Pending Verification</h3>
                            <button className="text-brand-blue text-xs font-bold hover:underline">View History</button>
                        </div>

                        <div className="divide-y divide-white/5">
                            {/* Item 1 */}
                            <div className="p-4 hover:bg-white/5 transition-colors group">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex gap-4">
                                        <div className="size-10 bg-orange-500/10 text-orange-500 rounded-lg flex items-center justify-center border border-orange-500/20">
                                            <Drama className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-white group-hover:text-brand-blue transition-colors">Leadership Seminar 101</h4>
                                            <p className="text-xs text-slate-500">Auditorium B • Org: Student Council</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-slate-500 font-mono">Today, 10:30 AM</span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-orange-400 font-mono ml-14">
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    Verifying on Blockchain (Confirming Blocks...)
                                </div>
                                <p className="text-[8px] text-slate-600 font-mono ml-14 mt-1">TxHash: 0x82...3f9a</p>
                            </div>

                            {/* Item 2 */}
                            <div className="p-4 hover:bg-white/5 transition-colors group">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex gap-4">
                                        <div className="size-10 bg-emerald-500/10 text-emerald-500 rounded-lg flex items-center justify-center border border-emerald-500/20">
                                            <Trees className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">Campus Clean-up Drive</h4>
                                            <p className="text-xs text-slate-500">Main Grounds • Org: EcoClub</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-slate-500 font-mono">Yesterday</span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-mono ml-14">
                                    <CheckCircle className="w-4 h-4" />
                                    Verified via Polygon
                                </div>
                            </div>

                            {/* Item 3 */}
                            <div className="p-4 hover:bg-white/5 transition-colors group opacity-60">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex gap-4">
                                        <div className="size-10 bg-blue-500/10 text-blue-500 rounded-lg flex items-center justify-center border border-blue-500/20">
                                            <Trophy className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-white">Badminton Tournament</h4>
                                            <p className="text-xs text-slate-500">Sports Center • Org: Athletics Dept</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-slate-500 font-mono">2 days ago</span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono ml-14">
                                    <Clock className="w-4 h-4" />
                                    Waiting for Organizer Approval
                                </div>
                            </div>
                        </div>

                        <div className="p-3 bg-black/20 text-center">
                            <p className="text-[10px] text-slate-500">Only events from the last 30 days are shown here.</p>
                        </div>
                    </motion.div>
                </div>

                {/* Right Column: Scanner & ID */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-card-dark border border-white/10 rounded-[32px] p-8 flex flex-col items-center shadow-2xl relative overflow-hidden glass-card"
                >
                    <div className="absolute inset-0 bg-brand-blue/5 rotate-12 scale-150 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="w-full flex justify-between items-center mb-8 relative z-10 border-b border-white/10 pb-4">
                        <div>
                            <p className="text-[10px] font-bold text-brand-blue uppercase tracking-widest mb-1">Digital ID</p>
                            <h3 className="text-xl font-bold text-white">Student Pass</h3>
                        </div>
                        <div className="size-8 rounded-full bg-brand-blue/20 flex items-center justify-center border border-brand-blue/30">
                            <Fingerprint className="text-brand-blue w-4 h-4" />
                        </div>
                    </div>

                    {/* QR Frame */}
                    <div className="relative size-64 bg-white rounded-3xl p-4 mb-4 z-10 shadow-[0_0_50px_rgba(37,99,235,0.2)] group cursor-pointer transition-transform hover:scale-105">
                        <div className="absolute inset-0 border-[3px] border-transparent group-hover:border-brand-blue rounded-3xl transition-colors"></div>

                        {/* Corner Markers */}
                        <div className="absolute top-0 left-0 size-8 border-t-4 border-l-4 border-brand-blue rounded-tl-xl -translate-x-1 -translate-y-1"></div>
                        <div className="absolute top-0 right-0 size-8 border-t-4 border-r-4 border-brand-blue rounded-tr-xl translate-x-1 -translate-y-1"></div>
                        <div className="absolute bottom-0 left-0 size-8 border-b-4 border-l-4 border-brand-blue rounded-bl-xl -translate-x-1 translate-y-1"></div>
                        <div className="absolute bottom-0 right-0 size-8 border-b-4 border-r-4 border-brand-blue rounded-br-xl translate-x-1 translate-y-1"></div>

                        <div className="w-full h-full bg-black rounded-xl flex items-center justify-center overflow-hidden relative">
                            {/* Faux QR Code Pattern */}
                            <div className="absolute inset-0 bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PPSDM-VERIFIER')] opacity-80 mix-blend-screen bg-cover"></div>
                            <div className="size-16 bg-white p-1 rounded relative z-10">
                                <div className="w-full h-full bg-black flex items-center justify-center">
                                    <GraduationCap className="text-white w-8 h-8" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mb-12 relative z-10">
                        <div className="flex justify-center items-center gap-2 text-[10px] text-slate-400 font-mono mb-2">
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Token refreshes in <span className="text-brand-blue font-bold">00:42</span>
                        </div>
                        <p className="text-xs text-slate-500">Scan at event entrance</p>
                    </div>

                    <div className="w-full h-px bg-white/10 mb-8"></div>

                    {/* Action Button */}
                    <button className="w-full bg-brand-blue hover:bg-blue-600 text-white font-bold py-4 rounded-full shadow-lg shadow-brand-blue/30 flex items-center justify-center gap-3 transition-all active:scale-95 relative z-10">
                        <Scan className="w-6 h-6" />
                        Scan Event Code
                    </button>
                    <p className="text-[10px] text-slate-500 text-center mt-4 max-w-xs mx-auto leading-relaxed relative z-10">
                        Use this button to scan an event organizer&apos;s code instead of showing yours.
                    </p>

                </motion.div>
            </div>
        </div>
    );
}
