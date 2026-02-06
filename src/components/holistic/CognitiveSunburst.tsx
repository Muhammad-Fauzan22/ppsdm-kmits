/**
 * Cognitive Sunburst Component
 * 
 * Visualisasi hierarki kompetensi kognitif dalam bentuk sunburst diagram
 * Berdasarkan spesifikasi dari ASSESSMENT BROU/10 Diagram untuk Visualisasi Holist.txt
 * 
 * Features:
 * - 4-level hierarchical visualization
 * - Interactive zoom dan pan
 * - Color coding berdasarkan mastery level
 * - Tooltip dengan detail kompetensi
 * - Comparison dengan faculty average
 */

'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface SunburstNode {
    name: string;
    value: number;
    children?: SunburstNode[];
    level?: number;
    mastery?: 'mastered' | 'developing' | 'needs_work';
    color?: string;
}

interface CognitiveSunburstProps {
    data: SunburstNode;
    width?: number;
    height?: number;
    showComparison?: boolean;
    onNodeClick?: (node: SunburstNode) => void;
    className?: string;
}

// Color scales for mastery levels
const MASTERY_COLORS = {
    mastered: '#10b981',      // Green
    developing: '#f59e0b',    // Yellow/Orange
    needs_work: '#ef4444'     // Red
};

// Level colors (blues gradient)
const LEVEL_COLORS = [
    '#1e40af',  // Level 0 - Darkest blue
    '#2563eb',  // Level 1
    '#3b82f6',  // Level 2
    '#60a5fa',  // Level 3 - Lightest blue
];

export const CognitiveSunburst: React.FC<CognitiveSunburstProps> = ({
    data,
    width = 600,
    height = 600,
    showComparison = true,
    onNodeClick,
    className = ''
}) => {
    const [hoveredNode, setHoveredNode] = useState<SunburstNode | null>(null);
    const [zoomedNode, setZoomedNode] = useState<SunburstNode | null>(null);
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) / 2 - 40;

    // Calculate arc parameters
    const calculateArc = (
        node: SunburstNode,
        startAngle: number,
        endAngle: number,
        innerRadius: number,
        outerRadius: number
    ) => {
        const startRad = (startAngle * Math.PI) / 180;
        const endRad = (endAngle * Math.PI) / 180;

        const x1 = centerX + innerRadius * Math.cos(startRad);
        const y1 = centerY + innerRadius * Math.sin(startRad);
        const x2 = centerX + outerRadius * Math.cos(startRad);
        const y2 = centerY + outerRadius * Math.sin(startRad);
        const x3 = centerX + outerRadius * Math.cos(endRad);
        const y3 = centerY + outerRadius * Math.sin(endRad);
        const x4 = centerX + innerRadius * Math.cos(endRad);
        const y4 = centerY + innerRadius * Math.sin(endRad);

        const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

        return `M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1} ${y1}`;
    };

    // Flatten data for rendering
    const flattenData = (
        node: SunburstNode,
        startAngle: number = 0,
        endAngle: number = 360,
        level: number = 0,
        result: Array<{ node: SunburstNode; startAngle: number; endAngle: number; level: number }> = []
    ): Array<{ node: SunburstNode; startAngle: number; endAngle: number; level: number }> => {
        result.push({ node, startAngle, endAngle, level });

        if (node.children && node.children.length > 0) {
            const anglePerChild = (endAngle - startAngle) / node.children.length;
            node.children.forEach((child, index) => {
                const childStart = startAngle + index * anglePerChild;
                const childEnd = childStart + anglePerChild;
                flattenData(child, childStart, childEnd, level + 1, result);
            });
        }

        return result;
    };

    const flattenedData = useMemo(() => flattenData(data), [data]);

    // Calculate radius for each level
    const getLevelRadius = (level: number) => {
        const levels = 4;
        return (level + 1) * (maxRadius / levels);
    };

    // Get color based on mastery level
    const getNodeColor = (node: SunburstNode, level: number) => {
        if (node.mastery) {
            return MASTERY_COLORS[node.mastery];
        }
        return LEVEL_COLORS[level % LEVEL_COLORS.length];
    };

    // Handle node click
    const handleNodeClick = (node: SunburstNode) => {
        if (zoomedNode === node) {
            setZoomedNode(null);
        } else {
            setZoomedNode(node);
        }
        if (onNodeClick) {
            onNodeClick(node);
        }
    };

    // Handle mouse move for tooltip
    const handleMouseMove = (e: React.MouseEvent<SVGElement>, node: SunburstNode) => {
        setTooltipPosition({
            x: e.clientX,
            y: e.clientY
        });
        setHoveredNode(node);
        setShowTooltip(true);
    };

    // Calculate overall metrics
    const calculateMetrics = () => {
        const allNodes = flattenedData.map(d => d.node);
        const totalValue = allNodes.reduce((sum, n) => sum + n.value, 0);
        const masteredCount = allNodes.filter(n => n.mastery === 'mastered').length;
        const developingCount = allNodes.filter(n => n.mastery === 'developing').length;
        const needsWorkCount = allNodes.filter(n => n.mastery === 'needs_work').length;

        return {
            totalValue,
            masteryRate: (masteredCount / allNodes.length) * 100,
            developingRate: (developingCount / allNodes.length) * 100,
            needsWorkRate: (needsWorkCount / allNodes.length) * 100
        };
    };

    const metrics = calculateMetrics();

    return (
        <div className={`relative ${className}`}>
            <svg
                width={width}
                height={height}
                className="overflow-visible"
            >
                {/* Background gradient */}
                <defs>
                    <radialGradient id="sunburstGradient" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="rgba(59, 130, 246, 0.05)" />
                        <stop offset="100%" stopColor="rgba(59, 130, 246, 0.15)" />
                    </radialGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Background circle */}
                <circle
                    cx={centerX}
                    cy={centerY}
                    r={maxRadius}
                    fill="url(#sunburstGradient)"
                />

                {/* Render arcs */}
                {flattenedData.map((item, index) => {
                    const innerRadius = item.level === 0 ? 0 : getLevelRadius(item.level - 1);
                    const outerRadius = getLevelRadius(item.level);
                    const isHovered = hoveredNode === item.node;
                    const isZoomed = zoomedNode === item.node;

                    return (
                        <g key={`${item.node.name}-${index}`}>
                            <motion.path
                                d={calculateArc(item.node, item.startAngle, item.endAngle, innerRadius, outerRadius)}
                                fill={getNodeColor(item.node, item.level)}
                                stroke="white"
                                strokeWidth={isHovered ? 2 : 1}
                                opacity={isHovered || isZoomed ? 1 : 0.8}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: isHovered || isZoomed ? 1 : 0.8, scale: 1 }}
                                transition={{ delay: index * 0.05, duration: 0.3 }}
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleNodeClick(item.node)}
                                onMouseMove={(e) => handleMouseMove(e, item.node)}
                                onMouseLeave={() => {
                                    setHoveredNode(null);
                                    setShowTooltip(false);
                                }}
                                filter={isHovered ? 'url(#glow)' : undefined}
                            />

                            {/* Label for larger arcs */}
                            {item.endAngle - item.startAngle > 20 && item.level < 3 && (
                                <text
                                    x={centerX + ((innerRadius + outerRadius) / 2) * Math.cos(((item.startAngle + item.endAngle) / 2 * Math.PI) / 180)}
                                    y={centerY + ((innerRadius + outerRadius) / 2) * Math.sin(((item.startAngle + item.endAngle) / 2 * Math.PI) / 180)}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    className={`text-xs font-semibold transition-all ${isHovered ? 'fill-white scale-110' : 'fill-white/80'
                                        }`}
                                    style={{
                                        pointerEvents: 'none',
                                        fontSize: `${Math.max(10, (item.endAngle - item.startAngle) / 5)}px`
                                    }}
                                >
                                    {item.node.name}
                                </text>
                            )}
                        </g>
                    );
                })}

                {/* Center label */}
                <g>
                    <circle
                        cx={centerX}
                        cy={centerY}
                        r={40}
                        fill="white"
                        stroke="rgba(59, 130, 246, 0.3)"
                        strokeWidth={2}
                    />
                    <text
                        x={centerX}
                        y={centerY - 5}
                        textAnchor="middle"
                        className="text-sm font-bold text-blue-600"
                    >
                        {data.name}
                    </text>
                    <text
                        x={centerX}
                        y={centerY + 12}
                        textAnchor="middle"
                        className="text-xs text-gray-600"
                    >
                        {data.value}
                    </text>
                </g>
            </svg>

            {/* Tooltip */}
            <AnimatePresence>
                {showTooltip && hoveredNode && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="fixed bg-white rounded-lg shadow-xl p-4 z-50 border border-gray-200"
                        style={{
                            left: tooltipPosition.x + 20,
                            top: tooltipPosition.y - 20,
                            minWidth: '220px'
                        }}
                    >
                        <h4 className="font-bold text-gray-800 mb-2">{hoveredNode.name}</h4>
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Skor:</span>
                                <span className="font-semibold text-blue-600">{hoveredNode.value}</span>
                            </div>
                            {hoveredNode.mastery && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Mastery:</span>
                                    <span className={`font-semibold ${hoveredNode.mastery === 'mastered' ? 'text-green-600' :
                                            hoveredNode.mastery === 'developing' ? 'text-yellow-600' :
                                                'text-red-600'
                                        }`}>
                                        {hoveredNode.mastery.replace('_', ' ').toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Metrics Panel */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-3 text-sm">Metrik Kognitif</h4>
                <div className="space-y-3">
                    <div>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-600">Mastered</span>
                            <span className="font-bold text-green-600">{metrics.masteryRate.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${metrics.masteryRate}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="bg-green-500 h-2 rounded-full"
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-600">Developing</span>
                            <span className="font-bold text-yellow-600">{metrics.developingRate.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${metrics.developingRate}%` }}
                                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                                className="bg-yellow-500 h-2 rounded-full"
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-600">Needs Work</span>
                            <span className="font-bold text-red-600">{metrics.needsWorkRate.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${metrics.needsWorkRate}%` }}
                                transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                                className="bg-red-500 h-2 rounded-full"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-3 text-sm">Legenda</h4>
                <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-green-500" />
                        <span className="text-gray-600">Mastered (≥80)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-yellow-500" />
                        <span className="text-gray-600">Developing (50-79)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-red-500" />
                        <span className="text-gray-600">Needs Work (&lt;50)</span>
                    </div>
                </div>
            </div>

            {/* Zoom controls */}
            {zoomedNode && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => setZoomedNode(null)}
                    className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                >
                    ← Reset Zoom
                </motion.button>
            )}
        </div>
    );
};

export default CognitiveSunburst;
