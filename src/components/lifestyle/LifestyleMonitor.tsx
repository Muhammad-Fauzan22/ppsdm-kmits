"use client";

import React, { useState } from 'react';
import { useLifestyleStore } from '@/lib/stores/useLifestyleStore';
import { Scale, Coffee, Briefcase, Moon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function LifestyleMonitor() {
    const { logBalance, balanceLogs } = useLifestyleStore();
    const [hours, setHours] = useState({ work: 8, leisure: 4, sleep: 7, other: 5 });

    const data = [
        { name: 'Work', value: hours.work, color: '#f59e0b' },
        { name: 'Leisure', value: hours.leisure, color: '#10b981' },
        { name: 'Sleep', value: hours.sleep, color: '#6366f1' },
        { name: 'Other', value: Math.max(0, 24 - (hours.work + hours.leisure + hours.sleep)), color: '#e5e7eb' },
    ];

    const handleSave = () => {
        logBalance({
            workHours: hours.work,
            leisureHours: hours.leisure,
            sleepHours: hours.sleep,
            mood: 'Balanced',
            date: new Date().toISOString()
        });
        alert("Day logged!");
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full min-h-[400px]">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                <Scale className="w-6 h-6 text-teal-600" />
                Life Balance Calculator
            </h2>

            <div className="flex flex-col md:flex-row h-full gap-6">
                {/* Chart */}
                <div className="w-full md:w-1/2 relative" style={{ height: '250px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <div className="text-3xl font-black text-gray-800">24h</div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold text-gray-500">
                            <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> Work / Study</span>
                            <span>{hours.work}h</span>
                        </div>
                        <input type="range" min="0" max="16" value={hours.work} onChange={e => setHours({ ...hours, work: parseInt(e.target.value) })} className="w-full h-2 bg-amber-100 rounded-lg appearance-none cursor-pointer accent-amber-500" />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold text-gray-500">
                            <span className="flex items-center gap-1"><Coffee className="w-3 h-3" /> Leisure / Social</span>
                            <span>{hours.leisure}h</span>
                        </div>
                        <input type="range" min="0" max="16" value={hours.leisure} onChange={e => setHours({ ...hours, leisure: parseInt(e.target.value) })} className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold text-gray-500">
                            <span className="flex items-center gap-1"><Moon className="w-3 h-3" /> Sleep</span>
                            <span>{hours.sleep}h</span>
                        </div>
                        <input type="range" min="0" max="12" value={hours.sleep} onChange={e => setHours({ ...hours, sleep: parseInt(e.target.value) })} className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                    </div>

                    <button onClick={handleSave} className="w-full py-2 mt-4 bg-teal-600 text-white rounded-lg font-bold hover:bg-teal-700">Save Day</button>

                    <div className="text-xs text-center text-gray-400 mt-2">
                        {balanceLogs.length} days logged total
                    </div>
                </div>
            </div>
        </div>
    );
}
