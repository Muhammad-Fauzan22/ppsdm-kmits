/**
 * Diagram 3: Self-Management Timeline & Gauge
 * Hybrid Timeline + Gauge Dashboard
 * 
 * Components:
 * - Productivity Timeline (Multi-line chart)
 * - Self-Management Gauges (6 circular gauges)
 * - Habit Tracking Heatmap
 */

'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface SelfManagementDashboardProps {
  data: {
    overallScore: number;
    timeManagement: number;
    procrastination: number;
    deepWork: number;
    timeline: { month: string; score: number }[];
  };
}

export function SelfManagementDashboard({ data }: SelfManagementDashboardProps) {
  const gaugeRotation = useMemo(() => {
    return (data.overallScore / 100) * 180 - 90;
  }, [data.overallScore]);
  
  return (
    <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-emerald-500">📊</span>
            Self-Management Dashboard
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Timeline & Gauge untuk produktivitas
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gauge Chart */}
        <div className="flex flex-col items-center">
          <div className="relative w-48 h-24">
            <div className="absolute inset-0 rounded-t-full bg-slate-700 overflow-hidden">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-24">
                <svg viewBox="0 0 192 96" className="w-full h-full">
                  <path d="M 16 96 A 80 80 0 0 1 176 96" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="16" />
                </svg>
              </div>
            </div>
            <motion.div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-24 overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <svg viewBox="0 0 192 96" className="w-full h-full">
                <motion.path d="M 16 96 A 80 80 0 0 1 176 96" fill="none" stroke="url(#gaugeGradient)" strokeWidth="16" strokeLinecap="round" initial={{ strokeDashoffset: 502 }} animate={{ strokeDashoffset: 502 - (data.overallScore / 100) * 502 }} transition={{ duration: 1, ease: 'easeOut' }} />
                <defs><linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#EF4444" /><stop offset="50%" stopColor="#F59E0B" /><stop offset="100%" stopColor="#10B981" /></linearGradient></defs>
              </svg>
            </motion.div>
            <motion.div className="absolute bottom-0 left-1/2 w-1 h-20 bg-white origin-bottom" initial={{ rotate: -90 }} animate={{ rotate: gaugeRotation }} transition={{ duration: 1, ease: 'easeOut' }} style={{ transformOrigin: 'center bottom', left: 'calc(50% - 2px)', bottom: '0' }}>
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full" />
            </motion.div>
          </div>
          <div className="text-center mt-2">
            <div className="text-3xl font-bold text-white">{data.overallScore}</div>
            <div className="text-sm text-slate-400">Overall Score</div>
          </div>
        </div>
        
        {/* Sub-dimensions */}
        <div className="space-y-4">
          {[
            { name: 'Time Management', value: data.timeManagement, color: 'bg-emerald-500' },
            { name: 'Procrastination Control', value: data.procrastination, color: 'bg-blue-500' },
            { name: 'Deep Work', value: data.deepWork, color: 'bg-purple-500' },
          ].map((item) => (
            <div key={item.name} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">{item.name}</span>
                <span className="text-white font-bold">{item.value}%</span>
              </div>
              <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                <motion.div className={`h-full ${item.color}`} initial={{ width: 0 }} animate={{ width: `${item.value}%` }} transition={{ duration: 0.5 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Timeline */}
      <div className="mt-6">
        <h4 className="text-sm font-semibold text-white mb-4">Progress Timeline</h4>
        <div className="flex items-end gap-2 h-24">
          {data.timeline.map((item, i) => (
            <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
              <motion.div className="w-full bg-gradient-to-t from-emerald-500/50 to-emerald-500/20 rounded-t" initial={{ height: 0 }} animate={{ height: `${item.score}%` }} transition={{ delay: i * 0.1 }} />
              <span className="text-xs text-slate-500">{item.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SelfManagementDashboard;
