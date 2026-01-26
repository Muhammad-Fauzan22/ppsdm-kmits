"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AreaChart, Area, ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis, LineChart, Line, XAxis, Tooltip } from "recharts";

export default function BiometricSyncPage() {
    // Mock Data
    const physicalImpactData = [
        { name: 'Growth', value: 75, fill: '#3B82F6' }
    ];

    const heartRateData = [
        { time: '10:00', val: 65 }, { time: '10:05', val: 70 }, { time: '10:10', val: 72 },
        { time: '10:15', val: 68 }, { time: '10:20', val: 75 }, { time: '10:25', val: 80 }
    ];

    return (
        <div className="min-h-screen bg-[#0E1218] text-white p-8 font-sans">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-blue-500 text-sm">monitor_heart</span>
                        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Physical Dimension</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Biometric Sync Hub</h1>
                    <p className="text-gray-400 max-w-xl text-sm">Centralize your physical inputs from wearables to power your 9-axis development profile.</p>
                </div>
                <div className="text-right">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-blue-900/40 flex items-center gap-2 transiton-all">
                        <span className="material-symbols-outlined text-[18px]">sync</span>
                        Sync Now
                    </button>
                    <p className="text-[10px] text-gray-500 mt-2">Last synced: 2 mins ago</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Data Sources */}
                <div className="space-y-6">
                    <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg">Data Sources</h3>
                            <span className="material-symbols-outlined text-gray-500">settings</span>
                        </div>

                        <div className="space-y-4">
                            {/* Garmin */}
                            <div className="bg-[#0E1218] p-4 rounded-xl border border-blue-500/30 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="size-10 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs">G</div>
                                    <div>
                                        <h4 className="font-bold text-sm">Garmin Connect</h4>
                                        <p className="text-[10px] text-green-500 font-bold flex items-center gap-1">
                                            <span className="size-1.5 bg-green-500 rounded-full"></span> Connected
                                        </p>
                                    </div>
                                </div>
                                <div className="w-10 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                                    <div className="absolute right-1 top-1 size-4 bg-white rounded-full"></div>
                                </div>
                            </div>

                            {/* Apple Health */}
                            <div className="bg-[#0E1218] p-4 rounded-xl border border-[#30363D] flex items-center justify-between opacity-60 hover:opacity-100 transition-opacity">
                                <div className="flex items-center gap-4">
                                    <div className="size-10 rounded-full bg-white text-black flex items-center justify-center">
                                        <span className="material-symbols-outlined text-black text-sm">health_and_safety</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm">Apple Health</h4>
                                        <p className="text-[10px] text-gray-500">Disconnected</p>
                                    </div>
                                </div>
                                <div className="w-10 h-6 bg-[#30363D] rounded-full relative cursor-pointer">
                                    <div className="absolute left-1 top-1 size-4 bg-gray-500 rounded-full"></div>
                                </div>
                            </div>

                            {/* Fitbit */}
                            <div className="bg-[#0E1218] p-4 rounded-xl border border-[#30363D] flex items-center justify-between opacity-60 hover:opacity-100 transition-opacity">
                                <div className="flex items-center gap-4">
                                    <div className="size-10 rounded-full bg-teal-500 text-white flex items-center justify-center">
                                        <span className="material-symbols-outlined text-sm">directions_run</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm">Fitbit</h4>
                                        <p className="text-[10px] text-gray-500">Disconnected</p>
                                    </div>
                                </div>
                                <div className="w-10 h-6 bg-[#30363D] rounded-full relative cursor-pointer">
                                    <div className="absolute left-1 top-1 size-4 bg-gray-500 rounded-full"></div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center gap-2 text-[10px] text-gray-500 justify-center">
                            <span className="material-symbols-outlined text-xs">lock</span>
                            Data encrypted & locally processed
                        </div>
                    </div>

                    {/* Physical Impact Chart */}
                    <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6">
                        <h3 className="font-bold text-md mb-1">Physical Impact</h3>
                        <p className="text-xs text-gray-400 mb-6">Contribution to 9-Axis Profile</p>

                        <div className="flex items-center gap-6">
                            <div className="size-24 relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadialBarChart innerRadius="70%" outerRadius="100%" barSize={10} data={physicalImpactData} startAngle={90} endAngle={-270}>
                                        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                                        <RadialBar background dataKey="value" cornerRadius={10} />
                                    </RadialBarChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xl font-bold">75%</span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-gray-300">Growth</span>
                                    <span className="text-green-500 font-bold">+12%</span>
                                </div>
                                <div className="w-full bg-[#30363D] h-1.5 rounded-full mb-3">
                                    <div className="bg-green-500 h-full rounded-full w-[75%]"></div>
                                </div>
                                <p className="text-[10px] text-gray-400 leading-snug">
                                    High HRV is boosting your resilience score.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: AI Insights & Metrics */}
                <div className="lg:col-span-2 space-y-6">

                    {/* AI Energy Forecast */}
                    <div className="bg-gradient-to-br from-[#1E2532] to-[#161B22] border border-blue-500/20 rounded-2xl p-6 relative overflow-hidden">
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className="flex items-start gap-4">
                                <div className="size-10 rounded-lg bg-blue-600/20 text-blue-500 flex items-center justify-center border border-blue-500/30">
                                    <span className="material-symbols-outlined">auto_awesome</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-white">PPSDM Energy Forecast</h3>
                                    <p className="text-xs text-blue-400 font-bold uppercase tracking-wider">AI OPTIMIZED STUDY WINDOW</p>
                                </div>
                            </div>
                            <span className="px-3 py-1 bg-[#30363D] rounded text-xs text-gray-300 font-medium">Today</span>
                        </div>

                        <div className="bg-[#0E1218]/50 p-4 rounded-xl border border-white/5 mb-4 relative z-10 backdrop-blur-sm">
                            <p className="text-sm text-gray-300 leading-relaxed">
                                Based on your high sleep quality and morning HRV spike, your cognitive peak is predicted between <span className="text-blue-400 font-bold">09:00 - 11:30</span>.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-gray-400 relative z-10">
                            <span className="material-symbols-outlined text-sm">lightbulb</span>
                            Suggestion: Schedule your hardest analysis module during this window.
                        </div>

                        {/* Background Splashes */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    </div>

                    {/* Metric Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Active Hours */}
                        <div className="bg-[#161B22] border border-[#30363D] p-5 rounded-2xl">
                            <div className="flex justify-between text-gray-400 mb-2">
                                <span className="text-xs">Active Hours</span>
                                <span className="material-symbols-outlined text-sm">directions_walk</span>
                            </div>
                            <div className="flex items-baseline gap-1 mb-2">
                                <span className="text-3xl font-bold">6.5</span>
                                <span className="text-sm text-gray-500">hrs</span>
                            </div>
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-green-500/10 text-green-500 text-[10px] font-bold">
                                <span className="material-symbols-outlined text-[10px]">trending_up</span> +10%
                                <span className="text-gray-500 font-normal ml-1">vs yesterday</span>
                            </div>
                        </div>

                        {/* Sleep Quality */}
                        <div className="bg-[#161B22] border border-[#30363D] p-5 rounded-2xl">
                            <div className="flex justify-between text-gray-400 mb-2">
                                <span className="text-xs">Sleep Quality</span>
                                <span className="material-symbols-outlined text-sm">bedtime</span>
                            </div>
                            <div className="flex items-baseline gap-1 mb-2">
                                <span className="text-3xl font-bold">85</span>
                                <span className="text-sm text-gray-500">/100</span>
                            </div>
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-green-500/10 text-green-500 text-[10px] font-bold">
                                <span className="material-symbols-outlined text-[10px]">trending_up</span> +5%
                                <span className="text-gray-500 font-normal ml-1">Restful</span>
                            </div>
                        </div>

                        {/* HRV */}
                        <div className="bg-[#161B22] border border-[#30363D] p-5 rounded-2xl">
                            <div className="flex justify-between text-gray-400 mb-2">
                                <span className="text-xs">Heart Rate Var.</span>
                                <span className="material-symbols-outlined text-sm">ecg_heart</span>
                            </div>
                            <div className="flex items-baseline gap-1 mb-2">
                                <span className="text-3xl font-bold">42</span>
                                <span className="text-sm text-gray-500">ms</span>
                            </div>
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-orange-500/10 text-orange-500 text-[10px] font-bold">
                                <span className="material-symbols-outlined text-[10px]">trending_down</span> -2%
                                <span className="text-gray-500 font-normal ml-1">High Readiness</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Chart */}
                    <div className="bg-[#161B22] border border-[#30363D] p-6 rounded-2xl h-80 flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="font-bold text-md mb-1">Activity vs. Readiness</h3>
                                <p className="text-xs text-gray-400">Correlating your physical exertion with recovery</p>
                            </div>
                            <div className="flex bg-[#0E1218] rounded-lg p-1 border border-[#30363D]">
                                {['Day', 'Week', 'Month'].map((t, i) => (
                                    <button key={t} className={`text-xs px-3 py-1 rounded font-medium transition-colors ${i === 0 ? 'bg-[#30363D] text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 w-full relative">
                            {/* Chart Placeholder / Implementation */}
                            {/* Using Recharts for Activity */}
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={heartRateData}>
                                    <defs>
                                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6B7280' }} />
                                    <Tooltip contentStyle={{ backgroundColor: '#0E1218', border: '1px solid #30363D', borderRadius: '8px' }} />
                                    <Area type="monotone" dataKey="val" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorVal)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
