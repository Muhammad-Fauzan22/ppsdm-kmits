"use client";

import React, { useState } from 'react';
import { useHealthStore } from '@/lib/stores/useHealthStore';
import { ShieldCheck, Activity, Calendar, FileText, AlertCircle } from 'lucide-react';

const RISK_FACTORS = [
    { id: 'diabetes', label: 'Family History of Diabetes' },
    { id: 'heart', label: 'Family History of Heart Disease' },
    { id: 'smoke', label: 'Active Smoker' },
    { id: 'sedentary', label: 'Sedentary Lifestyle (< 30m walk/day)' },
];

const CHECKUPS = [
    { id: 'dental', label: 'Dental Checkup', frequency: 'Every 6 months' },
    { id: 'eye', label: 'Eye Exam', frequency: 'Yearly' },
    { id: 'general', label: 'General MCU', frequency: 'Yearly' },
];

export default function PreventiveCare() {
    const { riskScore, checkups, stressLogs, logStress } = useHealthStore();
    const [selectedRisks, setSelectedRisks] = useState<string[]>([]);
    const [stressLevel, setStressLevel] = useState(5);
    const [stressNote, setStressNote] = useState('');

    const calculatedRisk = selectedRisks.length * 25; // Dummy logic

    const handleStressLog = () => {
        if (!stressNote) return;
        logStress(stressLevel, stressNote);
        setStressNote('');
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full min-h-[600px]">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                <ShieldCheck className="w-6 h-6 text-red-500" />
                Preventive Care
            </h2>

            <div className="space-y-6 overflow-y-auto custom-scrollbar pr-2">

                {/* Risk Assessment */}
                <div className="border rounded-xl p-5 bg-red-50/50">
                    <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500" /> Risk Assessment
                    </h3>
                    <div className="space-y-2 mb-4">
                        {RISK_FACTORS.map(factor => (
                            <label key={factor.id} className="flex items-center gap-3 p-2 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-red-500 rounded focus:ring-red-500"
                                    checked={selectedRisks.includes(factor.id)}
                                    onChange={(e) => {
                                        if (e.target.checked) setSelectedRisks([...selectedRisks, factor.id]);
                                        else setSelectedRisks(selectedRisks.filter(id => id !== factor.id));
                                    }}
                                />
                                <span className="text-sm text-gray-700">{factor.label}</span>
                            </label>
                        ))}
                    </div>
                    <div className="flex items-center justify-between bg-white p-3 rounded-lg border">
                        <span className="text-sm font-medium text-gray-500">Estimated Risk Score</span>
                        <span className={`font-black text-lg ${calculatedRisk > 50 ? 'text-red-600' : 'text-green-600'}`}>
                            {calculatedRisk}%
                        </span>
                    </div>
                </div>

                {/* Stress Monitor */}
                <div className="border rounded-xl p-5 bg-purple-50/50">
                    <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-purple-500" /> Stress Monitor
                    </h3>
                    <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-400 mb-2">
                            <span>Zen</span>
                            <span>Burnout</span>
                        </div>
                        <input
                            type="range"
                            min="1" max="10"
                            value={stressLevel}
                            onChange={(e) => setStressLevel(parseInt(e.target.value))}
                            className="w-full accent-purple-600"
                        />
                        <div className="text-center font-bold text-purple-700 mt-1">{stressLevel}/10</div>
                    </div>
                    <div className="flex gap-2">
                        <input
                            className="flex-1 px-3 py-2 rounded-lg border text-sm"
                            placeholder="What's causing this?"
                            value={stressNote}
                            onChange={(e) => setStressNote(e.target.value)}
                        />
                        <button
                            onClick={handleStressLog}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold text-sm"
                        >
                            Log
                        </button>
                    </div>
                </div>

                {/* Checkups */}
                <div className="border rounded-xl p-5">
                    <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-500" /> Medical Checkups
                    </h3>
                    <div className="space-y-3">
                        {CHECKUPS.map(chk => (
                            <div key={chk.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <div className="font-bold text-sm text-gray-800">{chk.label}</div>
                                    <div className="text-xs text-gray-500">{chk.frequency}</div>
                                </div>
                                <button className="text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-gray-600 hover:text-blue-600 hover:border-blue-500 transition">
                                    Schedule
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
