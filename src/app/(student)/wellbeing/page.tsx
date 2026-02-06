"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function WellbeingPage() {
    const [selectedMood, setSelectedMood] = useState<number | null>(4);

    const moodIcons = [
        { id: 1, icon: "sentiment_very_dissatisfied", color: "text-red-500", label: "Very Badge" },
        { id: 2, icon: "sentiment_dissatisfied", color: "text-orange-500", label: "Bad" },
        { id: 3, icon: "sentiment_neutral", color: "text-yellow-500", label: "Neutral" },
        { id: 4, icon: "sentiment_satisfied", color: "text-green-500", label: "Good" },
        { id: 5, icon: "sentiment_very_satisfied", color: "text-green-600", label: "Amazing" },
    ];

    const weeklyData = [
        { day: 'Mon', stress: 30, energy: 60 },
        { day: 'Tue', stress: 45, energy: 55 },
        { day: 'Wed', stress: 25, energy: 70 },
        { day: 'Thu', stress: 60, energy: 40 },
        { day: 'Fri', stress: 40, energy: 65 },
        { day: 'Sat', stress: 20, energy: 80 },
        { day: 'Sun', stress: 35, energy: 75 },
    ];

    const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans p-8">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <p className="font-bold text-lg mb-1">Mental Pulse</p>
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Good morning, Alex</h1>
                    <p className="text-slate-500">Ready to track your journey today?</p>
                </div>
                <div className="bg-white px-6 py-3 rounded-full shadow-sm border border-slate-100 flex items-center gap-4">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Log Mood:</span>
                    <div className="flex gap-3">
                        {moodIcons.map((m) => (
                            <button
                                key={m.id}
                                onClick={() => setSelectedMood(m.id)}
                                className={`transition-transform hover:scale-110 ${selectedMood === m.id ? 'scale-125' : 'opacity-60 hover:opacity-100'}`}
                            >
                                <span className={`material-symbols-outlined text-2xl ${m.color}`}>{m.icon}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">

                {/* 1. Mood Calendar */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg">Mood Calendar</h3>
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                            <button className="hover:text-slate-900">‹</button>
                            <span>October 2023</span>
                            <button className="hover:text-slate-900">›</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-2 mb-4 text-center">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                            <div key={d} className="text-xs font-bold text-slate-400">{d}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                        {/* Placeholder empty days */}
                        <div /><div />

                        {calendarDays.slice(0, 10).map((d) => (
                            <div
                                key={d}
                                className={`aspect-square rounded-full flex items-center justify-center text-xs font-bold ${d === 5 ? 'bg-green-500 text-white shadow-lg shadow-green-200' :
                                        d === 2 ? 'bg-red-100 text-red-500' :
                                            d === 3 ? 'bg-orange-100 text-orange-500' :
                                                d === 4 ? 'bg-green-100 text-green-600' :
                                                    'text-slate-400 hover:bg-slate-50'
                                    }`}
                            >
                                {d}
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center gap-4 mt-8 text-[10px] font-bold text-slate-400 uppercase">
                        <div className="flex items-center gap-1"><div className="size-2 rounded-full bg-green-500"></div> Good</div>
                        <div className="flex items-center gap-1"><div className="size-2 rounded-full bg-orange-500"></div> Anxious</div>
                        <div className="flex items-center gap-1"><div className="size-2 rounded-full bg-red-400"></div> Stressed</div>
                    </div>
                </div>

                {/* 2. Seno AI Insight */}
                <div className="bg-[#F0FDF4] p-6 rounded-3xl border border-green-100 relative overflow-hidden flex flex-col">
                    <div className="flex items-start gap-3 mb-6 relative z-10">
                        <div className="size-10 bg-green-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-200">
                            <span className="material-symbols-outlined">smart_toy</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-slate-900">Seno AI Insight</h3>
                            <p className="text-xs text-green-700">Based on your logs</p>
                        </div>
                    </div>

                    <div className="mb-6 relative z-10">
                        <p className="font-serif text-lg leading-relaxed text-slate-800 italic">
                            "I noticed your stress levels were elevated yesterday. A balanced approach works best."
                        </p>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100 mb-6 relative z-10">
                        <p className="text-xs font-bold text-slate-500 uppercase mb-3">Seno suggests:</p>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-orange-400 text-sm">self_improvement</span>
                                    <span className="text-sm font-bold text-slate-700">5 min Meditation</span>
                                </div>
                                <span className="bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded">Spiritual</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-blue-500 text-sm">directions_walk</span>
                                    <span className="text-sm font-bold text-slate-700">Short Walk</span>
                                </div>
                                <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded">Physical</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto flex gap-2 relative z-10">
                        <button className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-200 transition-colors">
                            Start Now
                        </button>
                        <button className="size-12 bg-white text-green-600 rounded-xl flex items-center justify-center border border-green-100 hover:bg-green-50">
                            <span className="material-symbols-outlined">thumb_up</span>
                        </button>
                    </div>

                    {/* Background Blob */}
                    <div className="absolute -top-10 -right-10 size-40 bg-green-200/30 rounded-full blur-3xl"></div>
                </div>

                {/* 3. Weekly Pulse Chart */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg">Weekly Pulse</h3>
                        <div className="flex gap-3 text-[10px] font-bold uppercase">
                            <span className="text-red-500 flex items-center gap-1"><span className="size-2 rounded-full bg-red-500"></span> Stress</span>
                            <span className="text-green-500 flex items-center gap-1"><span className="size-2 rounded-full bg-green-500"></span> Energy</span>
                        </div>
                    </div>
                    <p className="text-xs text-slate-400 mb-4">Stress vs. Energy</p>

                    <div className="flex-1 w-full" style={{ height: '192px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={weeklyData}>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    cursor={{ stroke: '#E2E8F0' }}
                                />
                                <Line type="monotone" dataKey="stress" stroke="#EF4444" strokeWidth={2} dot={false} />
                                <Line type="monotone" dataKey="energy" stroke="#22C55E" strokeWidth={2} dot={false} />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} dy={10} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

            {/* Recommendations Row */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-900">Recommended for You</h2>
                    <button className="text-green-600 font-bold text-sm hover:underline">View All</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1 */}
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden group hover:shadow-lg transition-shadow cursor-pointer">
                        <div className="h-40 bg-slate-200 relative">
                            {/* Placeholder generic nature image */}
                            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop)' }}></div>
                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 uppercase tracking-wide">
                                <span className="material-symbols-outlined text-sm">spa</span> Spiritual
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-slate-900">Mindful Breathing</h4>
                                <span className="text-xs text-green-600 font-medium">10 min</span>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                A simple technique to reduce anxiety and center your thoughts.
                            </p>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden group hover:shadow-lg transition-shadow cursor-pointer">
                        <div className="h-40 bg-slate-200 relative">
                            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1544367563-121910aa6e8a?q=80&w=2560&auto=format&fit=crop)' }}></div>
                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 uppercase tracking-wide">
                                <span className="material-symbols-outlined text-sm">accessibility_new</span> Physical
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-slate-900">Morning Stretch</h4>
                                <span className="text-xs text-green-600 font-medium">15 min</span>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Wake up your body and boost your energy levels for the day.
                            </p>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden group hover:shadow-lg transition-shadow cursor-pointer">
                        <div className="h-40 bg-slate-200 relative">
                            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=2560&auto=format&fit=crop)' }}></div>
                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 uppercase tracking-wide">
                                <span className="material-symbols-outlined text-sm">edit_note</span> Reflection
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-slate-900">Gratitude Journal</h4>
                                <span className="text-xs text-green-600 font-medium">5 min</span>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Log three things you are grateful for today.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
