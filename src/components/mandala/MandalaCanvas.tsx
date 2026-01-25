"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MandalaSegment from './MandalaSegment';
import CenterCore from './CenterCore';
import { useHolisticStore, RadarPoint } from '@/lib/stores/useHolisticStore';

// Data mapping
// Layer 1: Dimensions (from store)
// Layer 2: Skills (Mocked)
// Layer 3: Resources (Mocked)
// Layer 4: Impact (Mocked)

const COLORS = [
    '#06b6d4', // Cyan (Intellectual)
    '#ef4444', // Red (Physical)
    '#8b5cf6', // Violet (Mental)
    '#f59e0b', // Amber (Social)
    '#10b981', // Emerald (Spiritual)
    '#3b82f6', // Blue (Character)
    '#ec4899', // Pink (Financial)
    '#6366f1', // Indigo (Professional)
    '#84cc16', // Lime (Lifestyle)
];

export default function MandalaCanvas() {
    const { radarData } = useHolisticStore(); // Expects 9 items

    // Zoom state
    const [viewBox, setViewBox] = useState({ x: -400, y: -400, w: 800, h: 800 });
    const [focusedSegment, setFocusedSegment] = useState<string | null>(null);

    // Dimensions Layer (Inner Ring)
    // 360 / 9 = 40 degrees per segment
    const dimensionSegments = useMemo(() => {
        const count = radarData.length || 9;
        const anglePerSeg = 360 / count;
        return radarData.map((d, i) => ({
            ...d,
            startAngle: i * anglePerSeg,
            endAngle: (i + 1) * anglePerSeg,
            innerRadius: 40,
            outerRadius: 120,
            color: COLORS[i % COLORS.length],
            opacity: 0.6 + (d.value / 100) * 0.4, // Opacity based on score
        }));
    }, [radarData]);

    const handleZoom = (x: number, y: number, label: string) => {
        // Zoom in on the specific segment area
        setViewBox({ x: x - 200, y: y - 200, w: 400, h: 400 });
        setFocusedSegment(label);
    };

    const handleReset = () => {
        setViewBox({ x: -400, y: -400, w: 800, h: 800 });
        setFocusedSegment(null);
    };

    return (
        <div className="w-full h-full relative bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
            {/* Reset Button */}
            <AnimatePresence>
                {focusedSegment && (
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        onClick={handleReset}
                        className="absolute bottom-8 z-20 px-4 py-2 bg-slate-800 text-white rounded-full border border-slate-700 shadow-lg hover:bg-slate-700 transition"
                    >
                        Reset View
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Info Overlay */}
            <div className="absolute top-4 left-4 z-10 p-4">
                <h2 className="text-2xl font-black text-white tracking-widest">
                    SOUL <span className="text-cyan-500">MANDALA</span>
                </h2>
                <p className="text-slate-400 text-xs font-mono">
                    {focusedSegment ? `FOCUSED SECTOR: ${focusedSegment.toUpperCase()}` : 'HOLISTIC DEVELOPMENT LAYERS'}
                </p>
            </div>

            <motion.svg
                viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
                className="w-full h-full max-w-[800px] max-h-[800px]"
                animate={{ viewBox: `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}` }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
            >
                <g transform="translate(0,0)">
                    {/* Background Rings */}
                    <circle r="120" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
                    <circle r="200" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
                    <circle r="280" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
                    <circle r="360" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />

                    {/* Layer 5: Impact (Outer) */}
                    {dimensionSegments.map((seg, i) => (
                        <MandalaSegment
                            key={`impact-${i}`} index={i}
                            startAngle={seg.startAngle} endAngle={seg.endAngle}
                            innerRadius={280} outerRadius={360}
                            color={seg.color}
                            opacity={0.2}
                        // label="Impact"
                        />
                    ))}

                    {/* Layer 4: Resources */}
                    {dimensionSegments.map((seg, i) => (
                        <MandalaSegment
                            key={`res-${i}`} index={i}
                            startAngle={seg.startAngle} endAngle={seg.endAngle}
                            innerRadius={200} outerRadius={280}
                            color={seg.color}
                            opacity={0.4}
                        // label="Resources"
                        />
                    ))}

                    {/* Layer 3: Skills */}
                    {dimensionSegments.map((seg, i) => (
                        <MandalaSegment
                            key={`skill-${i}`} index={i}
                            startAngle={seg.startAngle} endAngle={seg.endAngle}
                            innerRadius={120} outerRadius={200}
                            color={seg.color}
                            opacity={0.6}
                        // label="Skills"
                        />
                    ))}

                    {/* Layer 2: Dimensions (Active Interaction) */}
                    {dimensionSegments.map((seg, i) => {
                        // Calculate center of this segment for zoom target
                        const midAngle = (seg.startAngle + seg.endAngle) / 2;
                        const rad = (seg.innerRadius + seg.outerRadius) / 2;
                        const angleRad = (midAngle - 90) * Math.PI / 180;
                        const targetX = rad * Math.cos(angleRad);
                        const targetY = rad * Math.sin(angleRad);

                        return (
                            <MandalaSegment
                                key={`dim-${i}`} index={i}
                                startAngle={seg.startAngle} endAngle={seg.endAngle}
                                innerRadius={seg.innerRadius} outerRadius={seg.outerRadius}
                                color={seg.color}
                                label={seg.subject}
                                opacity={seg.opacity}
                                active={focusedSegment === seg.subject}
                                onClick={() => handleZoom(targetX, targetY, seg.subject)}
                            />
                        );
                    })}

                    {/* Layer 1: Core */}
                    <CenterCore onClick={handleReset} />
                </g>
            </motion.svg>
        </div>
    );
}
