"use client";

import React from 'react';
import { motion } from 'framer-motion';

const PHASES = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Alumni'];
const CURRENT_PHASE_INDEX = 2; // Junior (example)

export default function DevelopmentCycle() {
    return (
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 h-full flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 pointer-events-none"></div>

            <div className="relative w-48 h-48 mb-6">
                {/* Circle Track */}
                <svg className="w-full h-full -rotate-90">
                    <circle cx="96" cy="96" r="88" className="stroke-slate-800" strokeWidth="8" fill="none" />
                    <motion.circle
                        cx="96" cy="96" r="88"
                        className="stroke-cyan-500"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: (CURRENT_PHASE_INDEX + 1) / PHASES.length }}
                        transition={{ duration: 2, ease: "easeOut" }}
                    />
                </svg>

                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Current Phase</div>
                    <div className="text-2xl font-black text-white">{PHASES[CURRENT_PHASE_INDEX]}</div>
                    <div className="text-xs text-cyan-400 font-mono mt-1">Year {CURRENT_PHASE_INDEX + 1}</div>
                </div>
            </div>

            {/* Phase List */}
            <div className="w-full space-y-2">
                {PHASES.map((phase, i) => (
                    <div key={phase} className="flex items-center gap-3 text-sm">
                        <div className={`w-2 h-2 rounded-full ${i <= CURRENT_PHASE_INDEX ? 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 'bg-slate-700'}`}></div>
                        <div className={`flex-1 font-medium ${i <= CURRENT_PHASE_INDEX ? 'text-white' : 'text-slate-600'}`}>
                            {phase}
                        </div>
                        {i === CURRENT_PHASE_INDEX && <div className="text-[10px] bg-cyan-900/30 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">ACTIVE</div>}
                    </div>
                ))}
            </div>
        </div>
    );
}
