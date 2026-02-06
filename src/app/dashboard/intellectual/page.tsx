"use client";

import React from 'react';
import { motion } from 'framer-motion';
import LearningEngine from '@/components/intellectual/LearningEngine';
import CreativityLab from '@/components/intellectual/CreativityLab';
import DigitalZone from '@/components/intellectual/DigitalZone';
import { BrainCircuit } from 'lucide-react';

export default function IntellectualDashboard() {
    return (
        <div className="p-6 space-y-8 min-h-screen bg-[#F8FAFC]">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4"
            >
                <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-200">
                    <BrainCircuit className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Intellectual Intelligence</h1>
                    <p className="text-slate-500 font-medium">Manage knowledge, sharpen skills, and foster innovation.</p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="h-full"
                >
                    <LearningEngine />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="h-full"
                >
                    <CreativityLab />
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <DigitalZone />
            </motion.div>
        </div>
    );
}
