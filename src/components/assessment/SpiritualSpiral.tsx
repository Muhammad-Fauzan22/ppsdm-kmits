/**
 * Diagram 9: Spiritual Development Spiral
 * Spiral visualization untuk spiritual journey
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Compass, Heart, HandHeart, Leaf } from 'lucide-react';

interface SpiritualSpiralProps {
  data: {
    purpose: number;
    gratitude: number;
    connectedness: number;
    altruism: number;
    meaningMaking: number;
    mindfulness: number;
    forgiveness: number;
    contribution: number;
  };
  className?: string;
}

export const SpiritualSpiral: React.FC<SpiritualSpiralProps> = ({
  data,
  className = '',
}) => {
  const dimensions = [
    { name: 'Purpose', value: data.purpose, icon: Compass, color: '#8b5cf6' },
    { name: 'Gratitude', value: data.gratitude, icon: Heart, color: '#ec4899' },
    { name: 'Connectedness', value: data.connectedness, icon: Sparkles, color: '#3b82f6' },
    { name: 'Altruism', value: data.altruism, icon: HandHeart, color: '#10b981' },
    { name: 'Meaning', value: data.meaningMaking, icon: Compass, color: '#f59e0b' },
    { name: 'Mindfulness', value: data.mindfulness, icon: Leaf, color: '#14b8a6' },
  ];

  const overallScore = Object.values(data).reduce((a, b) => a + b, 0) / 8;

  return (
    <div className={`bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-400" />
            Spiritual Development
          </h3>
          <p className="text-sm text-slate-400 mt-1">Ikigai - Purpose & Connection</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400 mb-1">Spiritual Score</div>
          <div className="text-3xl font-bold text-indigo-400">{overallScore.toFixed(1)}</div>
        </div>
      </div>

      {/* Spiral Visualization */}
      <div className="relative h-[300px] flex items-center justify-center mb-6">
        <svg viewBox="0 0 400 400" className="w-full h-full">
          {/* Spiral Path */}
          <motion.path
            d="M 200 200 m 0 0 a 10 10 0 1 0 20 0 a 20 20 0 1 0 -40 0 a 30 30 0 1 0 60 0 a 40 40 0 1 0 -80 0 a 50 50 0 1 0 100 0"
            fill="none"
            stroke="#4c1d95"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2 }}
          />
          {/* Center */}
          <circle cx="200" cy="200" r="15" fill="#8b5cf6" />
          <text x="200" y="205" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
            {Math.round(overallScore)}
          </text>
        </svg>

        {/* Dimension Nodes */}
        <div className="absolute inset-0">
          {dimensions.map((dim, index) => {
            const angle = (index / dimensions.length) * Math.PI * 2 - Math.PI / 2;
            const radius = 100;
            const x = 50 + (Math.cos(angle) * 35);
            const y = 50 + (Math.sin(angle) * 35);
            
            return (
              <motion.div
                key={dim.name}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="absolute w-16 h-16 rounded-full flex flex-col items-center justify-center"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: `${dim.color}30`,
                  border: `2px solid ${dim.color}`,
                }}
              >
                <dim.icon className="w-5 h-5" style={{ color: dim.color }} />
                <span className="text-xs text-white font-bold">{dim.value}</span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Dimensions Grid */}
      <div className="grid grid-cols-4 gap-3">
        {dimensions.map((dim, index) => (
          <div key={dim.name} className="bg-slate-800/50 rounded-lg p-3 text-center">
            <dim.icon className="w-5 h-5 mx-auto mb-1" style={{ color: dim.color }} />
            <div className="text-xs text-slate-400">{dim.name}</div>
            <div className="text-lg font-bold" style={{ color: dim.color }}>{dim.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpiritualSpiral;
