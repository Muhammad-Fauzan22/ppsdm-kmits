"use client";

import React from 'react';
import { motion } from 'framer-motion';
import EnvironmentDesigner from '@/components/lifestyle/EnvironmentDesigner';
import SustainableLiving from '@/components/lifestyle/SustainableLiving';
import LifestyleMonitor from '@/components/lifestyle/LifestyleMonitor';
import { Palmtree } from 'lucide-react';

export default function LifestyleDashboard() {
    return (
        <div className="p-6 space-y-8 min-h-screen bg-[#F8FAFC]">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4"
            >
                <div className="p-3 bg-emerald-600 rounded-xl shadow-lg shadow-emerald-200">
                    <Palmtree className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Environmental & Lifestyle</h1>
                    <p className="text-slate-500 font-medium">Design your habitat, live sustainably, and find your balance.</p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="h-full"
                >
                    <EnvironmentDesigner />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="h-full"
                >
                    <SustainableLiving />
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <LifestyleMonitor />
            </motion.div>
        </div>
    );
}
