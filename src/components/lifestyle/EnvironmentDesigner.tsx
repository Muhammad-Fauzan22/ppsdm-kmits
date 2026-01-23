"use client";

import React from 'react';
import { useLifestyleStore } from '@/lib/stores/useLifestyleStore';
import { Smartphone, Zap, Trash2, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EnvironmentDesigner() {
    const { digitalHabits, updateDigitalHabits } = useLifestyleStore();

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full min-h-[400px]">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                <Smartphone className="w-6 h-6 text-slate-600" />
                Digital Environment
            </h2>

            <div className="flex-1 flex flex-col gap-6">
                {/* Zen Mode */}
                <div
                    onClick={() => updateDigitalHabits({ zenMode: !digitalHabits.zenMode })}
                    className={`cursor-pointer rounded-xl p-6 border-2 transition-all flex items-center justify-between
                        ${digitalHabits.zenMode ? 'bg-slate-900 border-slate-900 text-white' : 'bg-gray-50 border-gray-200 hover:border-slate-300 text-gray-800'}
                    `}
                >
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${digitalHabits.zenMode ? 'bg-white/10' : 'bg-white shadow-sm'}`}>
                            {digitalHabits.zenMode ? <Moon className="w-6 h-6 text-indigo-300" /> : <Sun className="w-6 h-6 text-orange-400" />}
                        </div>
                        <div>
                            <div className="font-bold text-lg">Zen Mode</div>
                            <div className={`text-xs ${digitalHabits.zenMode ? 'text-slate-400' : 'text-gray-500'}`}>
                                {digitalHabits.zenMode ? 'Distractions Blocked. Focus Active.' : 'Tap to reduce digital noise.'}
                            </div>
                        </div>
                    </div>
                    <div className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${digitalHabits.zenMode ? 'bg-green-500' : 'bg-gray-300'}`}>
                        <motion.div
                            layout
                            className="bg-white w-4 h-4 rounded-full shadow"
                            initial={false}
                            animate={{ x: digitalHabits.zenMode ? 24 : 0 }}
                        />
                    </div>
                </div>

                {/* Goals */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm font-bold text-gray-600">
                        <span>Daily Screen Time Limit</span>
                        <span>{Math.floor(digitalHabits.screenTimeGoal / 60)}h {digitalHabits.screenTimeGoal % 60}m</span>
                    </div>
                    <input
                        type="range" min="30" max="480" step="30"
                        value={digitalHabits.screenTimeGoal}
                        onChange={(e) => updateDigitalHabits({ screenTimeGoal: parseInt(e.target.value) })}
                        className="w-full accent-slate-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                </div>

                {/* Checklist */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex-1">
                    <h3 className="font-bold text-gray-700 mb-3 text-sm flex items-center gap-2">
                        <Trash2 className="w-4 h-4" /> Digital Declutter Audit
                    </h3>
                    <div className="space-y-2">
                        {['Unfollow 5 toxic accounts', 'Delete unused apps', 'Clear desktop icons', 'Turn off non-human notifications'].map((item, i) => (
                            <label key={i} className="flex items-center gap-3 p-2 hover:bg-white rounded-lg transition cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-slate-600 focus:ring-slate-500" />
                                <span className="text-sm text-gray-600">{item}</span>
                            </label>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
