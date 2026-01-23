"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface MandalaSegmentProps {
    index: number;
    startAngle: number;
    endAngle: number;
    innerRadius: number;
    outerRadius: number;
    color: string;
    label?: string;
    onClick?: () => void;
    opacity?: number;
    active?: boolean;
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
    var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}

function describeArc(x: number, y: number, innerRadius: number, outerRadius: number, startAngle: number, endAngle: number) {
    var start = polarToCartesian(x, y, outerRadius, endAngle);
    var end = polarToCartesian(x, y, outerRadius, startAngle);
    var start2 = polarToCartesian(x, y, innerRadius, endAngle);
    var end2 = polarToCartesian(x, y, innerRadius, startAngle);

    var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    var d = [
        "M", start.x, start.y,
        "A", outerRadius, outerRadius, 0, largeArcFlag, 0, end.x, end.y,
        "L", end2.x, end2.y,
        "A", innerRadius, innerRadius, 0, largeArcFlag, 1, start2.x, start2.y,
        "Z"
    ].join(" ");

    return d;
}

export default function MandalaSegment({ startAngle, endAngle, innerRadius, outerRadius, color, label, onClick, opacity = 0.8, active }: MandalaSegmentProps) {
    // Center point is 0,0 relative to the group translation in Canvas
    const d = describeArc(0, 0, innerRadius, outerRadius, startAngle, endAngle);

    // Label placement
    const midAngle = startAngle + (endAngle - startAngle) / 2;
    const labelRadius = innerRadius + (outerRadius - innerRadius) / 2;
    const labelPos = polarToCartesian(0, 0, labelRadius, midAngle);

    return (
        <g
            onClick={onClick}
            className="cursor-pointer hover:opacity-100 transition-opacity"
            style={{ opacity: active ? 1 : opacity }}
        >
            <motion.path
                d={d}
                fill={color}
                stroke="#0f172a" // slate-900 border
                strokeWidth="2"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: active ? 1 : opacity }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            />
            {label && (
                <text
                    x={labelPos.x}
                    y={labelPos.y}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fill="white"
                    fontSize="10"
                    fontWeight="bold"
                    className="pointer-events-none select-none drop-shadow-md"
                    transform={`rotate(${midAngle > 0 && midAngle < 180 ? midAngle - 90 : midAngle + 90} ${labelPos.x} ${labelPos.y})`}
                >
                    {label}
                </text>
            )}
        </g>
    );
}
