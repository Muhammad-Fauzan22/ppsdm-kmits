"use client";

import React from 'react';
import { motion } from 'framer-motion';

// Simulated Nodes
const NODES = [
    { id: 'me', label: 'YOU', x: 50, y: 50, size: 20, color: 'bg-white text-slate-900' },
    { id: 'm1', label: 'Mentor Budi', x: 20, y: 30, size: 12, color: 'bg-purple-500 text-white' },
    { id: 'p1', label: 'Peer Group A', x: 80, y: 40, size: 14, color: 'bg-indigo-500 text-white' },
    { id: 'r1', label: 'Library', x: 30, y: 80, size: 10, color: 'bg-emerald-500 text-white' },
    { id: 'o1', label: 'BEM ITS', x: 70, y: 20, size: 16, color: 'bg-amber-500 text-white' },
    { id: 'w1', label: 'Internship', x: 60, y: 80, size: 12, color: 'bg-cyan-500 text-white' },
];

const LINKS = [
    { from: 'me', to: 'm1' },
    { from: 'me', to: 'p1' },
    { from: 'me', to: 'r1' },
    { from: 'me', to: 'o1' },
    { from: 'me', to: 'w1' },
    { from: 'p1', to: 'o1' },
    { from: 'm1', to: 'w1' },
];

export default function EcosystemMap() {
    return (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 h-full relative overflow-hidden group">
            <div className="absolute top-4 left-4 z-10">
                <h3 className="font-bold text-slate-300 text-sm uppercase tracking-wider">Ecosystem Map</h3>
            </div>

            {/* SVG Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {LINKS.map((link, i) => {
                    const from = NODES.find(n => n.id === link.from)!;
                    const to = NODES.find(n => n.id === link.to)!;
                    return (
                        <motion.line
                            key={i}
                            x1={`${from.x}%`} y1={`${from.y}%`}
                            x2={`${to.x}%`} y2={`${to.y}%`}
                            className="stroke-slate-700"
                            strokeWidth="1"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                        />
                    );
                })}
            </svg>

            {/* Nodes */}
            {NODES.map((node) => (
                <motion.div
                    key={node.id}
                    className={`absolute rounded-full flex items-center justify-center shadow-lg cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition z-10 ${node.color}`}
                    style={{ left: `${node.x}%`, top: `${node.y}%`, width: node.size * 3, height: node.size * 3 }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                >
                    <span className="text-[8px] font-bold text-center leading-tight px-1">{node.label}</span>
                </motion.div>
            ))}
        </div>
    );
}
