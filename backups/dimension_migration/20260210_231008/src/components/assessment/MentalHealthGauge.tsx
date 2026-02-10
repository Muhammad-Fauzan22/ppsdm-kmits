/**
 * Diagram 7: Mental Health & Wellbeing Gauge
 * Flourishing scale dengan mental health indicators
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Smile, Frown, AlertCircle } from 'lucide-react';

interface MentalHealthGaugeProps {
  data: {
    emotionalWellbeing: number;
    psychologicalWellbeing: number;
    socialWellbeing: number;
    resilience: number;
    stressLevel: number;
    mindfulness: number;
    lifeSatisfaction: number;
    overallScore: number;
    flourishingLevel: 'flourishing' | 'moderate' | 'languishing' | 'distressed';
  };
  className?: string;
}

export const MentalHealthGauge: React.FC<MentalHealthGaugeProps> = ({
  data,
  className = '',
}) => {
  const flourishingConfig = {
    flourishing: { color: '#10b981', label: 'Flourishing', icon: Sparkles },
    moderate: { color: '#3b82f6', label: 'Moderate', icon: Smile },
    languishing: { color: '#f59e0b', label: 'Languishing', icon: Frown },
    distressed: { color: '#ef4444', label: 'Distressed', icon: AlertCircle },
  };

  const config = flourishingConfig[data.flourishingLevel];
  const Icon = config.icon;

  const indicators = [
    { name: 'Emotional', value: data.emotionalWellbeing, color: '#ec4899' },
    { name: 'Psychological', value: data.psychologicalWellbeing, color: '#8b5cf6' },
    { name: 'Social', value: data.socialWellbeing, color: '#3b82f6' },
    { name: 'Resilience', value: data.resilience, color: '#10b981' },
    { name: 'Stress Mgmt', value: 100 - data.stressLevel, color: '#f59e0b' },
  ];

  return (
    <div className={`bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-violet-500" />
            Mental Health & Wellbeing
          </h3>
        </div>
      </div>

      <div className="mb-6 p-6 rounded-2xl text-center" style={{ backgroundColor: `${config.color}15`, border: `2px solid ${config.color}40` }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${config.color}30`, border: `4px solid ${config.color}` }}
        >
          <Icon className="w-12 h-12" style={{ color: config.color }} />
        </motion.div>
        <div className="text-3xl font-bold mb-1" style={{ color: config.color }}>{config.label}</div>
        <div className="text-5xl font-bold text-white">{data.overallScore}</div>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {indicators.map((ind, i) => (
          <div key={ind.name} className="bg-slate-800/50 rounded-lg p-3 text-center">
            <div className="text-xs text-slate-400 mb-1">{ind.name}</div>
            <div className="text-xl font-bold" style={{ color: ind.color }}>{ind.value}</div>
            <div className="h-1 bg-slate-700 rounded-full mt-2 overflow-hidden">
              <div className="h-full" style={{ width: `${ind.value}%`, backgroundColor: ind.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MentalHealthGauge;
