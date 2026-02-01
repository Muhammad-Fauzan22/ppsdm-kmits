/**
 * Diagram 6: Emotional Intelligence Radar
 * 4-component radar untuk Emotional & Social Intelligence
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Heart, Users, Brain, MessageCircle } from 'lucide-react';

interface EmotionalData {
  component: string;
  score: number;
  fullMark: number;
}

interface EmotionalRadarProps {
  data: {
    selfAwareness: number;
    socialAwareness: number;
    selfManagement: number;
    relationshipManagement: number;
  };
  className?: string;
}

export const EmotionalRadar: React.FC<EmotionalRadarProps> = ({
  data,
  className = '',
}) => {
  const chartData: EmotionalData[] = [
    { component: 'Self-Awareness', score: data.selfAwareness, fullMark: 100 },
    { component: 'Social Awareness', score: data.socialAwareness, fullMark: 100 },
    { component: 'Self-Management', score: data.selfManagement, fullMark: 100 },
    { component: 'Relationship Mgmt', score: data.relationshipManagement, fullMark: 100 },
  ];

  const components = [
    { name: 'Self-Awareness', value: data.selfAwareness, icon: Brain, color: '#9b59b6', desc: 'Kesadaran diri emosional' },
    { name: 'Social Awareness', value: data.socialAwareness, icon: Users, color: '#3498db', desc: 'Empati dan kesadaran sosial' },
    { name: 'Self-Management', value: data.selfManagement, icon: Heart, color: '#e74c3c', desc: 'Regulasi emosi diri' },
    { name: 'Relationship Mgmt', value: data.relationshipManagement, icon: MessageCircle, color: '#2ecc71', desc: 'Keterampilan interpersonal' },
  ];

  const overallScore = (data.selfAwareness + data.socialAwareness + data.selfManagement + data.relationshipManagement) / 4;

  return (
    <div className={`bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Heart className="w-6 h-6 text-pink-500" />
            Emotional Intelligence Radar
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Model Goleman: 4 komponen kecerdasan emosional
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400 mb-1">Overall EI Score</div>
          <div className="text-3xl font-bold text-pink-400">{overallScore.toFixed(1)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="component" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} />
              <Radar
                name="EI Score"
                dataKey="score"
                stroke="#ec4899"
                strokeWidth={3}
                fill="#ec4899"
                fillOpacity={0.25}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#94a3b8' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Component Breakdown */}
        <div className="space-y-4">
          {components.map((comp, index) => (
            <motion.div
              key={comp.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800/50 rounded-xl p-4"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${comp.color}20` }}>
                  <comp.icon className="w-5 h-5" style={{ color: comp.color }} />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{comp.name}</div>
                  <div className="text-xs text-slate-400">{comp.desc}</div>
                </div>
                <div className="ml-auto text-2xl font-bold" style={{ color: comp.color }}>
                  {comp.value}
                </div>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: comp.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${comp.value}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmotionalRadar;
