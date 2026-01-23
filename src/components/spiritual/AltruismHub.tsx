"use client";

import React, { useState } from 'react';
import { useSpiritualStore } from '@/lib/stores/useSpiritualStore';
import { HeartHandshake, Award, Clock } from 'lucide-react';

export default function AltruismHub() {
    const { volunteerLogs, logVolunteer } = useSpiritualStore();
    const [activity, setActivity] = useState('');
    const [hours, setHours] = useState('');
    const [impact, setImpact] = useState('');

    const totalHours = volunteerLogs.reduce((acc, log) => acc + log.hours, 0);
    const GOAL_HOURS = 100;

    const handleLog = () => {
        if (!activity || !hours) return;
        logVolunteer({
            activity,
            hours: parseFloat(hours),
            impact,
            date: new Date().toISOString()
        });
        setActivity('');
        setHours('');
        setImpact('');
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full min-h-[500px]">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                <HeartHandshake className="w-6 h-6 text-emerald-500" />
                Altruism & Service
            </h2>

            <div className="flex flex-col md:flex-row gap-6 h-full">

                {/* Stats & Goal */}
                <div className="w-full md:w-1/3 space-y-4">
                    <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-100 text-center">
                        <div className="text-sm font-bold text-emerald-600 uppercase mb-1">Total Service</div>
                        <div className="text-5xl font-black text-emerald-800 mb-2">{totalHours}</div>
                        <div className="text-xs text-emerald-600/70">Hours Contributed</div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6 border text-center">
                        <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                            <span>Progress to Goal</span>
                            <span>{Math.min(100, Math.round((totalHours / GOAL_HOURS) * 100))}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full transition-all duration-1000"
                                style={{ width: `${Math.min(100, (totalHours / GOAL_HOURS) * 100)}%` }}
                            ></div>
                        </div>
                        <div className="text-xs text-gray-400">Target: {GOAL_HOURS} Hours of Goodness</div>
                    </div>
                </div>

                {/* Logger */}
                <div className="flex-1 flex flex-col">
                    <div className="bg-white border rounded-xl p-4 mb-4 shadow-sm">
                        <h3 className="font-bold text-gray-700 text-sm mb-3">Log Contribution</h3>
                        <div className="flex gap-2 mb-2">
                            <input
                                className="flex-1 p-2 bg-gray-50 border rounded-lg text-sm"
                                placeholder="Activity (e.g., Beach Cleanup)"
                                value={activity}
                                onChange={(e) => setActivity(e.target.value)}
                            />
                            <div className="w-24 relative">
                                <Clock className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    className="w-full p-2 pl-8 bg-gray-50 border rounded-lg text-sm"
                                    type="number"
                                    placeholder="Hrs"
                                    value={hours}
                                    onChange={(e) => setHours(e.target.value)}
                                />
                            </div>
                        </div>
                        <input
                            className="w-full p-2 bg-gray-50 border rounded-lg text-sm mb-3"
                            placeholder="Impact Note (e.g., Collected 10kg trash)"
                            value={impact}
                            onChange={(e) => setImpact(e.target.value)}
                        />
                        <button
                            onClick={handleLog}
                            className="w-full py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition"
                        >
                            Log Service
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <h3 className="font-bold text-gray-400 text-xs uppercase mb-2">Contribution History</h3>
                        <div className="space-y-2">
                            {volunteerLogs.length === 0 && <div className="text-center text-sm text-gray-300 py-4">No services logged yet. Go change the world!</div>}
                            {volunteerLogs.map(log => (
                                <div key={log.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center border">
                                    <div>
                                        <div className="font-bold text-gray-800 text-sm">{log.activity}</div>
                                        <div className="text-xs text-gray-500">{log.impact}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-mono font-bold text-emerald-600">{log.hours}h</div>
                                        <div className="text-[10px] text-gray-400">{new Date(log.date).toLocaleDateString()}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
