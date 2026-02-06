"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface CenterCoreProps {
    onClick: () => void;
    imageUrl?: string;
}

export default function CenterCore({ onClick, imageUrl }: CenterCoreProps) {
    return (
        <g onClick={onClick} className="cursor-pointer group">
            {/* Pulsing Aura */}
            <motion.circle
                cx="0" cy="0" r="40"
                className="fill-cyan-500/20"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.circle
                cx="0" cy="0" r="35"
                className="fill-purple-500/20"
                animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.3, 0.6] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            />

            {/* Core Circle */}
            <circle cx="0" cy="0" r="30" className="fill-slate-900 stroke-cyan-500 stroke-2" />

            {/* Inner Content (Avatar or Text) */}
            <foreignObject x="-25" y="-25" width="50" height="50">
                <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-slate-800">
                    {imageUrl ? (
                        <img src={imageUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-white font-bold text-xs text-center leading-none">
                            CORE<br />SELF
                        </div>
                    )}
                </div>
            </foreignObject>
        </g>
    );
}
