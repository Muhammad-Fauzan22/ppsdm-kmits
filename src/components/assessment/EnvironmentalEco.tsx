/**
 * Diagram 10: Environmental Lifestyle Eco-System
 * Eco-system visualization untuk environmental awareness
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Recycle, Smartphone, Briefcase, Heart } from 'lucide-react';

interface EnvironmentalEcoProps {
  data: {
    awareness: number;
    behavior: number;
    workLifeBalance: number;
    digitalWellbeing: number;
    minimalism: number;
    communityEngagement: number;
    environmentalAdvocacy: number;
    carbonFootprintAwareness: number;
  };
  className?: string;
}

export const EnvironmentalEco: React.FC<EnvironmentalEcoProps> = ({
  data,
  className = '',
}) => {
  const factors = [
    { name: 'Awareness', value: data.awareness, icon: Leaf, color: '#22c55e' },
    { name: 'Behavior', value: data.behavior, icon: Recycle, color: '#16a34a' },
    { name: 'Work-Life', value: data.workLifeBalance, icon: Briefcase, color: '#3b82f6' },
    { name: 'Digital', value: data.digitalWellbeing, icon: Smartphone, color: '#8b5cf6' },
    { name: 'Minimalism', value: data.minimalism, icon: Leaf, color: '#14b8a6' },
    { name: 'Community', value: data.communityEngagement, icon: Heart, color: '#ec4899' },
    { name: 'Advocacy', value: data.environmentalAdvocacy, icon: Leaf, color: '#f59e0b' },
    { name: 'Carbon', value: data.carbonFootprintAwareness, icon: Recycle, color: '#10b981' },
  ];

  const overallScore = Object.values(data).reduce((a, b) => a + b, 0) / 8;

  return (
    <div className={`bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Leaf className="w-6 h-6 text-green-500" />
            Environmental Lifestyle
          </h3>
          <p className="text-sm text-slate-400 mt-1">Eco-System & Sustainability</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400 mb-1">Eco Score</div>
          <div className="text-3xl font-bold text-green-400">{overallScore.toFixed(1)}</div>
        </div>
      </div>

      {/* Eco-System Visualization */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {factors.map((factor, index) => (
          <motion.div
            key={factor.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="p-4 rounded-xl text-center"
            style={{ backgroundColor: `${factor.color}15`, border: `1px solid ${factor.color}40` }}
          >
            <div className="w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center" style={{ backgroundColor: `${factor.color}30` }}>
              <factor.icon className="w-6 h-6" style={{ color: factor.color }} />
            </div>
            <div className="text-sm text-white font-medium mb-1">{factor.name}</div>
            <div className="text-2xl font-bold" style={{ color: factor.color }}>{factor.value}</div>
            <div className="h-1.5 bg-slate-700 rounded-full mt-2 overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${factor.value}%`, backgroundColor: factor.color }} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Carbon Footprint Estimate */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <Recycle className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">Estimated Carbon Footprint</div>
              <div className="text-xs text-slate-400">Berdasarkan perilaku ramah lingkungan</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-400">
              {(5 - (overallScore / 100) * 1.5).toFixed(1)} tons
            </div>
            <div className="text-xs text-slate-400">CO2/year</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentalEco;
