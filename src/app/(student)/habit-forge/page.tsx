"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function HabitForgePage() {
    const [habits, setHabits] = useState([
        { id: 1, title: "Deep Work Session (2h)", time: "09:00 AM - 11:00 AM", streak: 12, completed: true },
        { id: 2, title: "Hydration (2L)", time: "throughout the day", streak: 0, completed: false },
        { id: 3, title: "Code Review", time: "Before 5 PM", streak: 5, completed: false },
        { id: 4, title: "Read Technical Paper", time: "Evening Routine", streak: 3, completed: false },
    ]);

    // Simple Grid Heatmap Generator
    const generateHeatmap = () => {
        const days = 364; // Approx 1 year
        return Array.from({ length: days }).map((_, i) => ({
            level: Math.random() > 0.7 ? 3 : Math.random() > 0.4 ? 2 : Math.random() > 0.2 ? 1 : 0
        }));
    };

    const [heatmapData] = useState(generateHeatmap());

    return (
        <div className="min-h-screen bg-[#0E1218] text-gray-300 font-sans p-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Consistency & Bio-Rhythms</h1>
                <p className="max-w-3xl text-sm text-gray-400">
                    Track your long-term consistency and optimize your daily energy levels. Identify the correlation between your sleep patterns and peak productivity hours.
                </p>
                <div className="flex gap-4 mt-6">
                    <div className="bg-[#1C2028] px-4 py-3 rounded-lg flex items-center gap-3 border border-[#30363D]">
                        <span className="material-symbols-outlined text-orange-500 text-2xl">local_fire_department</span>
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Current Streak</p>
                            <p className="text-xl font-bold text-white leading-none">12 <span className="text-xs font-normal text-gray-400">days</span></p>
                        </div>
                    </div>
                    <div className="bg-[#1C2028] px-4 py-3 rounded-lg flex items-center gap-3 border border-[#30363D]">
                        <span className="material-symbols-outlined text-green-500 text-2xl">verified</span>
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Comp. Rate</p>
                            <p className="text-xl font-bold text-white leading-none">85%</p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Heatmap & Habits */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Heatmap Card */}
                    <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-500">calendar_month</span> Consistency Heatmap
                            </h3>
                            <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase font-bold">
                                <span>Less</span>
                                <div className="flex gap-1">
                                    <div className="size-3 bg-[#1C2028] rounded-sm"></div>
                                    <div className="size-3 bg-blue-900 rounded-sm"></div>
                                    <div className="size-3 bg-blue-700 rounded-sm"></div>
                                    <div className="size-3 bg-blue-500 rounded-sm"></div>
                                </div>
                                <span>More</span>
                            </div>
                        </div>

                        {/* CSS Grid for Heatmap */}
                        <div className="grid grid-cols-[repeat(52,1fr)] gap-1 w-full h-32">
                            {heatmapData.map((d, i) => (
                                <div
                                    key={i}
                                    className={`rounded-sm w-full h-full ${d.level === 0 ? 'bg-[#1C2028]' :
                                        d.level === 1 ? 'bg-blue-900' :
                                            d.level === 2 ? 'bg-blue-700' : 'bg-blue-500'
                                        }`}
                                ></div>
                            ))}
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-500 mt-2 font-mono uppercase">
                            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                        </div>
                    </div>

                    {/* Today's Habits */}
                    <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-white">Today&apos;s Habits</h3>
                            <button className="text-blue-500 text-xs font-bold flex items-center gap-1 hover:text-blue-400">
                                <span className="material-symbols-outlined text-[16px]">add</span> Add Habit
                            </button>
                        </div>

                        <div className="space-y-3">
                            {habits.map((habit) => (
                                <div key={habit.id} className={`p-4 rounded-xl border ${habit.completed ? 'bg-[#1C2028] border-[#30363D]' : 'bg-[#1C2028]/50 border-[#30363D]'} flex items-center gap-4 transition-all hover:border-gray-600`}>
                                    <div className={`size-6 rounded flex items-center justify-center cursor-pointer transition-colors ${habit.completed ? 'bg-blue-600' : 'border-2 border-gray-600 hover:border-blue-500'}`}>
                                        {habit.completed && <span className="material-symbols-outlined text-white text-sm">check</span>}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className={`text-sm font-bold ${habit.completed ? 'text-white' : 'text-gray-300'}`}>{habit.title}</h4>
                                        <p className="text-xs text-gray-500">{habit.time}</p>
                                    </div>
                                    <div className="bg-[#0E1218] px-2 py-1 rounded text-[10px] font-bold text-orange-500 flex items-center gap-1 border border-[#30363D]">
                                        <span className="material-symbols-outlined text-[12px]">local_fire_department</span> {habit.streak}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Right Column: Logging & Stats */}
                <div className="space-y-6">

                    {/* Logging Panel */}
                    <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6">
                        <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-blue-500">edit_note</span> Log Today&apos;s Stats
                        </h3>

                        <div className="space-y-6">
                            {/* Energy Slider */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-gray-400">Energy Level</span>
                                    <span className="bg-blue-900/30 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-900/50">7/10</span>
                                </div>
                                <input type="range" min="1" max="10" defaultValue="7" className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                                <div className="flex justify-between text-[10px] text-gray-600 mt-1">
                                    <span>Lethargic</span>
                                    <span>Active</span>
                                    <span>Peak</span>
                                </div>
                            </div>

                            {/* Sleep Slider */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-gray-400">Sleep Duration</span>
                                    <span className="bg-purple-900/30 text-purple-400 text-[10px] font-bold px-2 py-0.5 rounded border border-purple-900/50">6.5 hrs</span>
                                </div>
                                <input type="range" min="0" max="12" step="0.5" defaultValue="6.5" className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500" />
                                <div className="flex justify-between text-[10px] text-gray-600 mt-1">
                                    <span>0h</span>
                                    <span>8h</span>
                                    <span>12h+</span>
                                </div>
                            </div>

                            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all">
                                Save Logs
                            </button>
                        </div>
                    </div>

                    {/* Stats: Peak Zone */}
                    <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6">
                        <h3 className="font-bold text-white mb-2">Peak Zone</h3>
                        <p className="text-xs text-gray-400 mb-6">Based on your logs, you are most productive between:</p>

                        <div className="flex items-center gap-4">
                            <div className="size-24 rounded-full border-4 border-[#252830] border-t-blue-500 border-r-blue-500 relative flex items-center justify-center">
                                <div className="text-center">
                                    <span className="material-symbols-outlined text-yellow-500 block">bolt</span>
                                    <span className="text-[10px] font-bold text-white block">10 AM</span>
                                    <span className="text-[10px] text-gray-500 block">- 1 PM</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-start gap-2">
                                    <div className="size-2 rounded-full bg-green-500 mt-1"></div>
                                    <div>
                                        <p className="text-xs font-bold text-white">Deep Work</p>
                                        <p className="text-[10px] text-gray-500">Schedule hard tasks here</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="size-2 rounded-full bg-orange-500 mt-1"></div>
                                    <div>
                                        <p className="text-xs font-bold text-white">Meetings</p>
                                        <p className="text-[10px] text-gray-500">Avoid if possible</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
