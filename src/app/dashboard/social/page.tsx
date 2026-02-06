"use client";

import React from 'react';
import { motion } from 'framer-motion';
import EmotionalIntelligence from '@/components/social/EmotionalIntelligence';
import CommunicationLab from '@/components/social/CommunicationLab';
import LeadershipSystem from '@/components/social/LeadershipSystem';
import { Users } from 'lucide-react';

export default function SocialDashboard() {
    return (
        <div className="p-6 space-y-8 min-h-screen bg-[#F8FAFC]">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4"
            >
                <div className="p-3 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200">
                    <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Emotional & Social Intelligence</h1>
                    <p className="text-slate-500 font-medium">Master your emotions, communicate with impact, and lead effective teams.</p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="h-full"
                >
                    <EmotionalIntelligence />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="h-full"
                >
                    <LeadershipSystem />
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <CommunicationLab />
            </motion.div>
        </div>
    );
}
