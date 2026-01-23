"use client";

import React from 'react';
import { motion } from 'framer-motion';
import MeaningExplorer from '@/components/spiritual/MeaningExplorer';
import SpiritualPractice from '@/components/spiritual/SpiritualPractice';
import AltruismHub from '@/components/spiritual/AltruismHub';
import { Sparkles } from 'lucide-react';

export default function SpiritualDashboard() {
    return (
        <div className="p-6 space-y-8 min-h-screen bg-[#F8FAFC]">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4"
            >
                <div className="p-3 bg-violet-600 rounded-xl shadow-lg shadow-violet-200">
                    <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Spiritual Development</h1>
                    <p className="text-slate-500 font-medium">Discover your purpose, practice stillness, and serve something greater.</p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="h-full"
                >
                    <MeaningExplorer />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="h-full"
                >
                    <AltruismHub />
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <SpiritualPractice />
            </motion.div>
        </div>
    );
}
