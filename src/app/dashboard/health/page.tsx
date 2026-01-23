"use client";

import React from 'react';
import { motion } from 'framer-motion';
import HealthTracker from '@/components/health/HealthTracker';
import PreventiveCare from '@/components/health/PreventiveCare';
import FitnessCommunity from '@/components/health/FitnessCommunity';
import { HeartPulse } from 'lucide-react';

export default function HealthDashboard() {
    return (
        <div className="p-6 space-y-8 min-h-screen bg-[#F8FAFC]">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4"
            >
                <div className="p-3 bg-red-500 rounded-xl shadow-lg shadow-red-200">
                    <HeartPulse className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Physical Health & Vitality</h1>
                    <p className="text-slate-500 font-medium">Holistic tracking for nutrition, fitness, and well-being.</p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="h-full"
                >
                    <HealthTracker />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="h-full"
                >
                    <PreventiveCare />
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <FitnessCommunity />
            </motion.div>
        </div>
    );
}
