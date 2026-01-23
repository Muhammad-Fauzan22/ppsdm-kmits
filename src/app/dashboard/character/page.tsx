"use client";

import React from 'react';
import { motion } from 'framer-motion';
import CharacterTracker from '@/components/character/CharacterTracker';
import EthicsLab from '@/components/character/EthicsLab';
import EtiquetteGuide from '@/components/character/EtiquetteGuide';
import { ShieldCheck } from 'lucide-react';

export default function CharacterDashboard() {
    return (
        <div className="p-6 space-y-8 min-h-screen bg-[#F8FAFC]">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4"
            >
                <div className="p-3 bg-amber-600 rounded-xl shadow-lg shadow-amber-200">
                    <ShieldCheck className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Character & Ethics</h1>
                    <p className="text-slate-500 font-medium">Building the moral foundation for professional leadership.</p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="h-full"
                >
                    <CharacterTracker />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="h-full"
                >
                    <EthicsLab />
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <EtiquetteGuide />
            </motion.div>
        </div>
    );
}
