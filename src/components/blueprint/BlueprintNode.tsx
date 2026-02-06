"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Database, Cpu, Send, RefreshCw } from 'lucide-react';

export type NodeType = 'input' | 'process' | 'output' | 'feedback' | 'storage';

interface BlueprintNodeProps {
    x: number;
    y: number;
    label: string;
    subLabel?: string;
    type: NodeType;
    status?: 'active' | 'idle' | 'warning' | 'error';
    onClick: () => void;
    delay?: number;
}

const TYPE_CONFIG = {
    input: { color: 'border-emerald-500', bg: 'bg-emerald-500/10', icon: Database, text: 'text-emerald-400' },
    process: { color: 'border-cyan-500', bg: 'bg-cyan-500/10', icon: Cpu, text: 'text-cyan-400' },
    output: { color: 'border-purple-500', bg: 'bg-purple-500/10', icon: Send, text: 'text-purple-400' },
    feedback: { color: 'border-amber-500', bg: 'bg-amber-500/10', icon: RefreshCw, text: 'text-amber-400' },
    storage: { color: 'border-slate-500', bg: 'bg-slate-500/10', icon: Database, text: 'text-slate-400' },
};

export default function BlueprintNode({ x, y, label, subLabel, type, status = 'active', onClick, delay = 0 }: BlueprintNodeProps) {
    const config = TYPE_CONFIG[type];
    const Icon = config.icon;

    return (
        <motion.div
            className={`absolute w-48 p-4 rounded-lg border-2 backdrop-blur-sm cursor-pointer group hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all z-10 
                ${config.color} ${config.bg}`}
            style={{ left: x, top: y }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, duration: 0.5 }}
            onClick={onClick}
            whileHover={{ scale: 1.05 }}
        >
            {/* Connection Dots - Visual decoration */}
            <div className="absolute -left-1 top-1/2 w-2 h-2 bg-slate-900 border border-slate-600 rounded-full -translate-y-1/2"></div>
            <div className="absolute -right-1 top-1/2 w-2 h-2 bg-slate-900 border border-slate-600 rounded-full -translate-y-1/2"></div>

            <div className="flex items-center gap-3 mb-2">
                <div className={`p-1.5 rounded-md bg-slate-900 ${config.text}`}>
                    <Icon className="w-4 h-4" />
                </div>
                <div className={`text-xs font-bold uppercase tracking-wider ${config.text}`}>
                    {type} UNIT
                </div>
            </div>

            <div className={`text-sm font-bold text-slate-100 group-hover:text-white`}>
                {label}
            </div>
            {subLabel && (
                <div className="text-[10px] text-slate-400 font-mono mt-1">
                    {subLabel}
                </div>
            )}

            {/* Status Indicator */}
            <div className="absolute top-2 right-2 flex gap-1">
                <div className={`w-1.5 h-1.5 rounded-full ${status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`}></div>
            </div>
        </motion.div>
    );
}
