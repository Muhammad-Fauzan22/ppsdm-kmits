/**
 * Diagram 5: Physical Health & Vitality Dashboard
 * Vitality metrics dengan progress rings
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Moon, Utensils, Droplets, Heart, Zap } from 'lucide-react';

interface HealthMetric {
  name: string;
  value: number;
  target: number;
  unit: string;
  icon: React.ElementType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
}

interface PhysicalHealthDashboardProps {
  data: {
    metrics: HealthMetric[];
    overallScore: number;
    vitalityIndex: 'low' | 'moderate' | 'good' | 'high';
    recommendations: string[];
  };
  className?: string;
}

const CircularProgress: React.FC<{ value: number; max: number; color: string; size?: number }> = ({
  value, max, color, size = 100
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#1e293b" strokeWidth={strokeWidth} fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold text-white">{Math.round(percentage)}%</span>
      </div>
    </div>
  );
};

export const PhysicalHealthDashboard: React.FC<PhysicalHealthDashboardProps> = ({
  data,
  className = '',
}) => {
  const vitalityColors = {
    low: '#e74c3c',
    moderate: '#f39c12',
    good: '#2ecc71',
    high: '#1abc9c',
  };

  const vitalityLabels = {
    low: 'Low Vitality',
    moderate: 'Moderate Vitality',
    good: 'Good Vitality',
    high: 'High Vitality',
  };

  return (
    <div className={`bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-teal-500" />
            Physical Health & Vitality
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Kesehatan fisik dan tingkat vitalitas harian
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400 mb-1">Overall Score</div>
          <div className="text-3xl font-bold text-white">{data.overallScore}</div>
        </div>
      </div>

      {/* Vitality Index */}
      <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: `${vitalityColors[data.vitalityIndex]}20`, border: `1px solid ${vitalityColors[data.vitalityIndex]}40` }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="w-8 h-8" style={{ color: vitalityColors[data.vitalityIndex] }} />
            <div>
              <div className="text-sm font-medium" style={{ color: vitalityColors[data.vitalityIndex] }}>
                {vitalityLabels[data.vitalityIndex]}
              </div>
              <div className="text-xs text-slate-400">Berdasarkan aktivitas fisik, tidur, dan nutrisi</div>
            </div>
          </div>
          <div className="text-4xl font-bold" style={{ color: vitalityColors[data.vitalityIndex] }}>
            {data.overallScore}
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {data.metrics.map((metric, index) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-800/50 rounded-xl p-4 flex flex-col items-center"
          >
            <div className="mb-3">
              <CircularProgress value={metric.value} max={metric.target} color={metric.color} size={80} />
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <metric.icon className="w-4 h-4" style={{ color: metric.color }} />
                <span className="text-xs text-slate-400">{metric.name}</span>
              </div>
              <div className="text-lg font-bold text-white">
                {metric.value} <span className="text-xs text-slate-500">{metric.unit}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recommendations */}
      <div className="bg-slate-800/50 rounded-xl p-4">
        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Heart className="w-4 h-4 text-red-400" />
          Health Recommendations
        </h4>
        <ul className="space-y-2">
          {data.recommendations.map((rec, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-slate-300">
              <span className="text-teal-400">•</span>
              {rec}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PhysicalHealthDashboard;
