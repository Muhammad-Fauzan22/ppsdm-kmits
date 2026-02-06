"use client";

import React, { useState } from 'react';
import { Coffee, Mail, Network, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TIPS = [
    {
        id: 'email',
        category: 'Professional Email',
        icon: Mail,
        color: 'bg-blue-500',
        tips: [
            "Always include a clear subject line.",
            "Use professional salutations (e.g., 'Dear', 'Hello').",
            "Keep it concise. Respect the recipient's time.",
            "Proofread before hitting send."
        ]
    },
    {
        id: 'dining',
        category: 'Business Dining',
        icon: Coffee,
        color: 'bg-orange-500',
        tips: [
            "Wait for the host to sit before you sit.",
            "Place your napkin on your lap immediately.",
            "Wait for everyone to be served before eating.",
            "Keep phone off the table."
        ]
    },
    {
        id: 'network',
        category: 'Networking',
        icon: Network,
        color: 'bg-purple-500',
        tips: [
            "Firm handshake, eye contact, and a smile.",
            "Listen more than you speak.",
            "Have your elevator pitch ready.",
            "Follow up within 24 hours."
        ]
    }
];

export default function EtiquetteGuide() {
    const [index, setIndex] = useState(0);
    const activeTip = TIPS[index];

    const next = () => setIndex((prev) => (prev + 1) % TIPS.length);
    const prev = () => setIndex((prev) => (prev - 1 + TIPS.length) % TIPS.length);

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full min-h-[400px]">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                <Coffee className="w-6 h-6 text-gray-700" />
                Social Grace & Etiquette
            </h2>

            <div className="flex-1 relative flex items-center justify-center bg-gray-50 rounded-2xl overflow-hidden border">
                <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTip.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="relative z-10 w-3/4 max-w-sm bg-white p-8 rounded-2xl shadow-xl text-center border-t-4 border-t-current"
                        style={{ borderColor: activeTip.color }}
                    >
                        <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6 text-white shadow-lg ${activeTip.color}`}>
                            <activeTip.icon className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">{activeTip.category}</h3>
                        <ul className="text-left space-y-3 text-gray-600 text-sm">
                            {activeTip.tips.map((tip, i) => (
                                <li key={i} className="flex gap-2">
                                    <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${activeTip.color.replace('bg-', 'bg-opacity-50 ')}`}></span>
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </AnimatePresence>

                {/* Controls */}
                <button onClick={prev} className="absolute left-4 p-3 bg-white rounded-full shadow hover:bg-gray-50 transition z-20">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <button onClick={next} className="absolute right-4 p-3 bg-white rounded-full shadow hover:bg-gray-50 transition z-20">
                    <ArrowRight className="w-5 h-5 text-gray-600" />
                </button>
            </div>
        </div>
    );
}
