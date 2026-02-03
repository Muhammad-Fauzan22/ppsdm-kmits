/**
 * Holistic Radar Chart Component
 * 
 * Visualisasi 9-dimension assessment dalam bentuk radar chart interaktif
 * Berdasarkan spesifikasi dari ASSESSMENT BROU/10 Diagram untuk Visualisasi Holist.txt
 * 
 * Features:
 * - 9-axis radar chart dengan progressive layers
 * - Interactive hover effects dan tooltips
 * - Comparison dengan periode sebelumnya
 * - Faculty average comparison
 * - Development target visualization
 * - Quadrant analysis
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface RadarData {
    dimension: string;
    score: number;
    previousScore?: number;
    facultyAverage?: number;
    target?: number;
    color: string;
}

interface RadarChartProps {
    data: RadarData[];
    width?: number;
    height?: number;
    showComparison?: boolean;
    showTarget?: boolean;
    onDimensionClick?: (dimension: string) => void;
    className?: string;
}

// Dimension colors
const DIMENSION_COLORS = {
    'Kognitif': '#3b82f6',
    'Manajemen Diri': '#10b981',
    'Finansial': '#ef4444',
    'Kesehatan Fisik': '#14b8a6',
    'Kecerdasan Emosional': '#8b5cf6',
    'Kesehatan Mental': '#6366f1',
    'Karakter & Etika': '#f59e0b',
    'Spiritual': '#f97316',
    'Lingkungan': '#06b6d4'
};

// Quadrant groupings
const QUADRANTS = {
    'Cognitive': ['Kognitif', 'Manajemen Diri', 'Finansial'],
    'Affective': ['Kecerdasan Emosional', 'Kesehatan Mental', 'Karakter & Etika'],
    'Social': ['Spiritual', 'Lingkungan', 'Kesehatan Fisik']
};

export const HolisticRadarChart: React.FC<RadarChartProps> = ({
    data,
    width = 800,
    height = 800,
    showComparison = true,
    showTarget = true,
    onDimensionClick,
    className = ''
}) => {
    const [hoveredDimension, setHoveredDimension] = useState<string | null>(null);
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const svgRef = useRef<SVGSVGElement>(null);

    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) / 2 - 80;
    const numDimensions = data.length;
    const angleStep = (2 * Math.PI) / numDimensions;

    // Calculate position for a point on the radar
    const calculatePosition = (index: number, value: number) => {
        const angle = index * angleStep - Math.PI / 2;
        const radius = (value / 100) * maxRadius;
        return {
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle)
        };
    };

    // Generate polygon points
    const generatePolygonPoints = (scores: number[]) => {
        return scores.map((score, index) => {
            const pos = calculatePosition(index, score);
            return `${pos.x},${pos.y}`;
        }).join(' ');
    };

    // Calculate overall metrics
    const overallScore = data.reduce((sum, d) => sum + d.score, 0) / numDimensions;
    const balanceIndex = 1 - (Math.sqrt(
        data.reduce((sum, d) => sum + Math.pow(d.score - overallScore, 2), 0) / numDimensions
    ) / 100);

    // Identify strengths and growth areas
    const sortedData = [...data].sort((a, b) => b.score - a.score);
    const strengths = sortedData.slice(0, 3);
    const growthAreas = sortedData.slice(-3).reverse();

    // Handle dimension click
    const handleDimensionClick = (dimension: string) => {
        if (onDimensionClick) {
            onDimensionClick(dimension);
        }
    };

    // Handle mouse move for tooltip
    const handleMouseMove = (e: React.MouseEvent<SVGCircleElement>, dimension: string) => {
        if (svgRef.current) {
            const rect = svgRef.current.getBoundingClientRect();
            setTooltipPosition({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
        }
        setHoveredDimension(dimension);
        setShowTooltip(true);
    };

    // Generate grid levels
    const gridLevels = [20, 40, 60, 80, 100];

    return (
        <div className={`relative ${className}`}>
            <svg
                ref={svgRef}
                width={width}
                height={height}
                className="overflow-visible"
            >
                {/* Background gradient */}
                <defs>
                    <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="rgba(59, 130, 246, 0.05)" />
                        <stop offset="100%" stopColor="rgba(59, 130, 246, 0.15)" />
                    </radialGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
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
                    fill="url(#radarGradient)"
                />

                {/* Grid levels */}
                {gridLevels.map((level) => (
                    <polygon
                        key={level}
                        points={generatePolygonPoints(data.map(() => level))}
                        fill="none"
                        stroke="rgba(156, 163, 175, 0.3)"
                        strokeWidth={1}
                        strokeDasharray={level === 100 ? '0' : '4,4'}
                    />
                ))}

                {/* Axis lines */}
                {data.map((_, index) => {
                    const pos = calculatePosition(index, 100);
                    return (
                        <line
                            key={`axis-${index}`}
                            x1={centerX}
                            y1={centerY}
                            x2={pos.x}
                            y2={pos.y}
                            stroke="rgba(156, 163, 175, 0.3)"
                            strokeWidth={1}
                        />
                    );
                })}

                {/* Development target area */}
                {showTarget && data[0]?.target && (
                    <polygon
                        points={generatePolygonPoints(data.map(d => d.target || 80))}
                        fill="rgba(16, 185, 129, 0.1)"
                        stroke="rgba(16, 185, 129, 0.3)"
                        strokeWidth={2}
                        strokeDasharray="8,4"
                    />
                )}

                {/* Faculty average */}
                {showComparison && data[0]?.facultyAverage && (
                    <polygon
                        points={generatePolygonPoints(data.map(d => d.facultyAverage || 60))}
                        fill="none"
                        stroke="rgba(156, 163, 175, 0.5)"
                        strokeWidth={2}
                        strokeDasharray="4,4"
                    />
                )}

                {/* Previous assessment */}
                {showComparison && data[0]?.previousScore && (
                    <polygon
                        points={generatePolygonPoints(data.map(d => d.previousScore || d.score - 5))}
                        fill="none"
                        stroke="rgba(139, 92, 246, 0.5)"
                        strokeWidth={2}
                        strokeDasharray="6,3"
                    />
                )}

                {/* Current assessment */}
                <motion.polygon
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    points={generatePolygonPoints(data.map(d => d.score))}
                    fill="rgba(59, 130, 246, 0.2)"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    filter="url(#glow)"
                />

                {/* Dimension points and labels */}
                {data.map((dimension, index) => {
                    const pos = calculatePosition(index, dimension.score);
                    const labelPos = calculatePosition(index, 115);
                    const isHovered = hoveredDimension === dimension.dimension;

                    return (
                        <g key={dimension.dimension}>
                            {/* Dimension point */}
                            <motion.circle
                                cx={pos.x}
                                cy={pos.y}
                                r={isHovered ? 8 : 5}
                                fill={DIMENSION_COLORS[dimension.dimension as keyof typeof DIMENSION_COLORS] || '#3b82f6'}
                                stroke="white"
                                strokeWidth={2}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleDimensionClick(dimension.dimension)}
                                onMouseMove={(e) => handleMouseMove(e, dimension.dimension)}
                                onMouseLeave={() => {
                                    setHoveredDimension(null);
                                    setShowTooltip(false);
                                }}
                            />

                            {/* Dimension label */}
                            <text
                                x={labelPos.x}
                                y={labelPos.y}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className={`text-xs font-semibold transition-all ${isHovered ? 'fill-blue-600 scale-110' : 'fill-gray-700'
                                    }`}
                                style={{
                                    transform: `translate(${labelPos.x < centerX ? '-50%' : '50%'}, ${labelPos.y < centerY ? '-50%' : '50%'})`
                                }}
                            >
                                {dimension.dimension}
                            </text>

                            {/* Score label */}
                            <text
                                x={pos.x}
                                y={pos.y - 15}
                                textAnchor="middle"
                                className={`text-sm font-bold transition-all ${isHovered ? 'fill-blue-600' : 'fill-gray-600'
                                    }`}
                            >
                                {dimension.score}
                            </text>
                        </g>
                    );
                })}

                {/* Central core - Overall score */}
                <g>
                    <circle
                        cx={centerX}
                        cy={centerY}
                        r={40 + (overallScore / 100) * 20}
                        fill="url(#coreGradient)"
                        stroke="rgba(251, 191, 36, 0.5)"
                        strokeWidth={2}
                    />
                    <defs>
                        <radialGradient id="coreGradient" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="rgba(251, 191, 36, 0.8)" />
                            <stop offset="100%" stopColor="rgba(245, 158, 11, 0.4)" />
                        </radialGradient>
                    </defs>
                    <text
                        x={centerX}
                        y={centerY - 5}
                        textAnchor="middle"
                        className="text-lg font-bold text-amber-600"
                    >
                        {overallScore.toFixed(1)}
                    </text>
                    <text
                        x={centerX}
                        y={centerY + 12}
                        textAnchor="middle"
                        className="text-xs text-amber-700"
                    >
                        PDI
                    </text>
                </g>
            </svg>

            {/* Tooltip */}
            <AnimatePresence>
                {showTooltip && hoveredDimension && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bg-white rounded-lg shadow-xl p-4 z-50 border border-gray-200"
                        style={{
                            left: tooltipPosition.x + 20,
                            top: tooltipPosition.y - 20,
                            minWidth: '200px'
                        }}
                    >
                        {(() => {
                            const dim = data.find(d => d.dimension === hoveredDimension);
                            if (!dim) return null;
                            return (
                                <>
                                    <h4 className="font-bold text-gray-800 mb-2">{dim.dimension}</h4>
                                    <div className="space-y-1 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Skor Saat Ini:</span>
                                            <span className="font-semibold text-blue-600">{dim.score}</span>
                                        </div>
                                        {dim.previousScore && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Skor Sebelumnya:</span>
                                                <span className="font-semibold text-purple-600">{dim.previousScore}</span>
                                            </div>
                                        )}
                                        {dim.facultyAverage && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Rata-rata Fakultas:</span>
                                                <span className="font-semibold text-gray-600">{dim.facultyAverage}</span>
                                            </div>
                                        )}
                                        {dim.target && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Target:</span>
                                                <span className="font-semibold text-green-600">{dim.target}</span>
                                            </div>
                                        )}
                                    </div>
                                </>
                            );
                        })()}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-3 text-sm">Legenda</h4>
                <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-1 bg-blue-500 rounded" />
                        <span className="text-gray-600">Skor Saat Ini</span>
                    </div>
                    {showComparison && (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-1 bg-purple-500 rounded" style={{ borderStyle: 'dashed' }} />
                            <span className="text-gray-600">Skor Sebelumnya</span>
                        </div>
                    )}
                    {showComparison && (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-1 bg-gray-400 rounded" style={{ borderStyle: 'dashed' }} />
                            <span className="text-gray-600">Rata-rata Fakultas</span>
                        </div>
                    )}
                    {showTarget && (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-1 bg-green-500 rounded" style={{ borderStyle: 'dashed' }} />
                            <span className="text-gray-600">Target Pengembangan</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Metrics Panel */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-3 text-sm">Metrik Holistik</h4>
                <div className="space-y-3">
                    <div>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-600">Personal Development Index</span>
                            <span className="font-bold text-amber-600">{overallScore.toFixed(1)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${overallScore}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="bg-amber-500 h-2 rounded-full"
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-600">Balance Index</span>
                            <span className="font-bold text-blue-600">{(balanceIndex * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${balanceIndex * 100}%` }}
                                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                                className="bg-blue-500 h-2 rounded-full"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Strengths & Growth Areas */}
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-3 text-sm">Analisis</h4>
                <div className="space-y-3">
                    <div>
                        <span className="text-xs font-semibold text-green-600 block mb-1">💪 Kekuatan</span>
                        <div className="space-y-1">
                            {strengths.map((s, i) => (
                                <div key={i} className="text-xs text-gray-700 flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-green-500" />
                                    {s.dimension} ({s.score})
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <span className="text-xs font-semibold text-orange-600 block mb-1">🎯 Area Pengembangan</span>
                        <div className="space-y-1">
                            {growthAreas.map((g, i) => (
                                <div key={i} className="text-xs text-gray-700 flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                                    {g.dimension} ({g.score})
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HolisticRadarChart;
