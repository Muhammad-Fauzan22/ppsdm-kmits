"use client";

import React from 'react';
import { motion } from 'framer-motion';
import WellnessCompanion from '@/components/mental/WellnessCompanion';
import MindfulnessSuite from '@/components/mental/MindfulnessSuite';
import TherapeuticToolkit from '@/components/mental/TherapeuticToolkit';
import { Flower } from 'lucide-react';

export default function MentalHealthDashboard() {
    return (
        <div className="p-6 space-y-8 min-h-screen bg-[#F8FAFC]">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4"
            >
                <div className="p-3 bg-teal-500 rounded-xl shadow-lg shadow-teal-200">
                    <Flower className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Mental & Psychological Health</h1>
                    <p className="text-slate-500 font-medium">Your private space for mindfulness, resilience, and growth.</p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="h-full"
                >
                    <WellnessCompanion />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="h-full"
                >
                    <MindfulnessSuite />
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <TherapeuticToolkit />
            </motion.div>
        </div>
    );
}
