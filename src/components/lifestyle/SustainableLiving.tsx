"use client";

import React, { useState } from 'react';
import { useLifestyleStore } from '@/lib/stores/useLifestyleStore';
import { Leaf, Bike, Car, Bus, Footprints } from 'lucide-react';

export default function SustainableLiving() {
    const { carbonFootprint, updateCarbon, logSustainableAction, sustainabilityLogs } = useLifestyleStore();
    const [action, setAction] = useState('');

    const handleLog = () => {
        if (!action) return;
        logSustainableAction(action, 'medium');
        setAction('');
    };

    const getScoreColor = (score: number) => {
        if (score < 150) return 'text-green-600 bg-green-50 border-green-200';
        if (score < 300) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full min-h-[500px]">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                <Leaf className="w-6 h-6 text-green-600" />
                Sustainable Living
            </h2>

            <div className="flex flex-col md:flex-row gap-6 h-full">

                {/* Calculator */}
                <div className="w-full md:w-1/2 space-y-4">
                    <div className={`p-6 rounded-2xl border text-center transition-colors ${getScoreColor(carbonFootprint.totalFootprint)}`}>
                        <div className="text-xs font-bold uppercase tracking-wider mb-1">Carbon Footprint Estimate</div>
                        <div className="text-5xl font-black mb-2">{Math.round(carbonFootprint.totalFootprint)}</div>
                        <div className="text-xs opacity-80">Points / Month</div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-bold text-gray-500 uppercase block">Main Transport</label>
                        <div className="grid grid-cols-4 gap-2">
                            {[
                                { id: 'walk', icon: Footprints, label: 'Walk' },
                                { id: 'bike', icon: Bike, label: 'Bike' },
                                { id: 'public', icon: Bus, label: 'Bus' },
                                { id: 'car', icon: Car, label: 'Car' }
                            ].map(opt => (
                                <button
                                    key={opt.id}
                                    onClick={() => updateCarbon({ transport: opt.id as any })}
                                    className={`flex flex-col items-center justify-center p-2 rounded-xl border transition
                                        ${carbonFootprint.transport === opt.id ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-500 hover:bg-gray-50'}
                                    `}
                                >
                                    <opt.icon className="w-5 h-5 mb-1" />
                                    <span className="text-[10px] font-bold">{opt.label}</span>
                                </button>
                            ))}
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Monthly Electricity (kwh)</label>
                            <input
                                type="number"
                                value={carbonFootprint.electricityBill}
                                onChange={(e) => updateCarbon({ electricityBill: parseInt(e.target.value) || 0 })}
                                className="w-full p-2 border rounded-lg text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Habit Log */}
                <div className="flex-1 flex flex-col">
                    <h3 className="font-bold text-gray-700 text-sm mb-3">Green Actions Log</h3>

                    <div className="flex gap-2 mb-4">
                        <input
                            className="flex-1 p-2 bg-gray-50 border rounded-lg text-sm"
                            placeholder="I brought my own bag..."
                            value={action}
                            onChange={(e) => setAction(e.target.value)}
                        />
                        <button
                            onClick={handleLog}
                            className="px-4 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700"
                        >
                            +
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2">
                        {sustainabilityLogs.length === 0 && <div className="text-center text-xs text-gray-400 italic py-4">No eco-actions yet. Start today!</div>}
                        {sustainabilityLogs.map(log => (
                            <div key={log.id} className="p-3 bg-green-50/50 border border-green-100 rounded-lg text-sm flex justify-between items-center">
                                <span className="text-green-900 font-medium">{log.action}</span>
                                <span className="text-[10px] text-green-600">{new Date(log.date).toLocaleDateString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
