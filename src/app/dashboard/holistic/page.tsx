"use client";

import React from 'react';
import { motion } from 'framer-motion';
import PersonalDevelopmentRadar from '@/components/holistic/PersonalDevelopmentRadar';
import DevelopmentCycle from '@/components/holistic/DevelopmentCycle';
import EcosystemMap from '@/components/holistic/EcosystemMap';
import DevelopmentTimeline from '@/components/holistic/DevelopmentTimeline';
import { Grid, Cpu } from 'lucide-react';
import { useHolisticSync } from '@/hooks/useHolisticSync';

export default function HolisticDashboard() {
    useHolisticSync();

    return (
        <div className="p-6 min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 mb-8"
            >
                <div className="p-3 bg-cyan-500/10 border border-cyan-500/50 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                    <Cpu className="w-8 h-8 text-cyan-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                        NEXUS CORE <span className="text-xs bg-cyan-900/50 text-cyan-400 px-2 py-1 rounded border border-cyan-800">SYSTEM ONLINE</span>
                    </h1>
                    <p className="text-slate-400 font-medium">Holistic Visualization of Your Personal OS.</p>
                </div>
            </motion.div>

            <div className="grid grid-cols-12 gap-6 h-[800px]">
                {/* Left: Cycle - 3 cols */}
                <motion.div
                    className="col-span-12 lg:col-span-3 h-full"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <DevelopmentCycle />
                </motion.div>

                {/* Center: Radar - 6 cols */}
                <motion.div
                    className="col-span-12 lg:col-span-6 h-full flex flex-col gap-6"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex-1 bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
                        <div className="absolute top-4 right-4 text-xs font-mono text-cyan-500 flex items-center gap-2">
                            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-ping"></div>
                            LIVE DATA
                        </div>
                        <PersonalDevelopmentRadar />
                    </div>

                    <div className="h-64">
                        <DevelopmentTimeline />
                    </div>
                </motion.div>

                {/* Right: Map - 3 cols */}
                <motion.div
                    className="col-span-12 lg:col-span-3 h-full"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <EcosystemMap />
                </motion.div>
            </div>
        </div>
    );
}
