'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface RadarChartProps {
  data: {
    dimension: string;
    score: number;
    percentile: number;
  }[];
  width?: number;
  height?: number;
}

const dimensionLabels: Record<string, string> = {
  cognitive: 'Kognitif',
  'self-management': 'Manajemen Diri',
  financial: 'Finansial',
  physical: 'Kesehatan Fisik',
  emotional: 'Emosional',
  'mental-health': 'Kesehatan Mental',
  character: 'Karakter',
  spiritual: 'Spiritual',
  environmental: 'Lingkungan',
};

const dimensionColors: Record<string, string> = {
  cognitive: '#3B82F6',
  'self-management': '#10B981',
  financial: '#14B8A6',
  physical: '#EF4444',
  emotional: '#EC4899',
  'mental-health': '#8B5CF6',
  character: '#F59E0B',
  spiritual: '#A855F7',
  environmental: '#22C55E',
};

export function HolisticRadarChart({ data, width = 500, height = 500 }: RadarChartProps) {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(centerX, centerY) - 60;
  const levels = 5;
  
  const points = useMemo(() => {
    return data.map((d, i) => {
      const angle = (Math.PI * 2 * i) / data.length - Math.PI / 2;
      const distance = (d.score / 100) * radius;
      return {
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        labelX: centerX + Math.cos(angle) * (radius + 30),
        labelY: centerY + Math.sin(angle) * (radius + 30),
        score: d.score,
        label: dimensionLabels[d.dimension] || d.dimension,
        color: dimensionColors[d.dimension] || '#fff',
        percentile: d.percentile,
      };
    });
  }, [data, centerX, centerY, radius]);
  
  return (
    <div className="relative">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Background circles */}
        {[1, 2, 3, 4, 5].map((level) => (
          <circle
            key={level}
            cx={centerX}
            cy={centerY}
            r={(radius / levels) * level}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
            strokeDasharray="4,4"
          />
        ))}
        
        {/* Axis lines */}
        {data.map((_, i) => {
          const angle = (Math.PI * 2 * i) / data.length - Math.PI / 2;
          return (
            <line
              key={i}
              x1={centerX}
              y1={centerY}
              x2={centerX + Math.cos(angle) * radius}
              y2={centerY + Math.sin(angle) * radius}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
          );
        })}
        
        {/* Data polygon */}
        <motion.polygon
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          points={points.map((p) => `${p.x},${p.y}`).join(' ')}
          fill="rgba(0, 212, 255, 0.2)"
          stroke="#00d4ff"
          strokeWidth="2"
        />
        
        {/* Data points */}
        {points.map((point, i) => (
          <motion.circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="6"
            fill={point.color}
            stroke="#fff"
            strokeWidth="2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
          />
        ))}
        
        {/* Labels */}
        {points.map((point, i) => (
          <g key={i}>
            <text
              x={point.labelX}
              y={point.labelY}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#fff"
              fontSize="12"
              fontWeight="500"
            >
              {point.label}
            </text>
            <text
              x={point.labelX}
              y={point.labelY + 16}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={point.color}
              fontSize="11"
              fontWeight="bold"
            >
              {point.score.toFixed(0)}%
            </text>
          </g>
        ))}
        
        {/* Center score */}
        <text
          x={centerX}
          y={centerY - 8}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#fff"
          fontSize="24"
          fontWeight="bold"
        >
          {Math.round(data.reduce((sum, d) => sum + d.score, 0) / data.length)}%
        </text>
        <text
          x={centerX}
          y={centerY + 16}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#888"
          fontSize="12"
        >
          Overall Score
        </text>
      </svg>
    </div>
  );
}

export default HolisticRadarChart;