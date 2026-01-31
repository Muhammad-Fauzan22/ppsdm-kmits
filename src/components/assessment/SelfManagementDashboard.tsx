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

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Clock, Target, Zap, Calendar, TrendingUp } from 'lucide-react';

interface TimelineData {
  date: string;
  deepWork: number;
  taskCompletion: number;
  focusDuration: number;
  distractions: number;
}

interface GaugeProps {
  value: number;
  max: number;
  label: string;
  color: string;
  size?: number;
}

const CircularGauge: React.FC<GaugeProps> = ({ value, max, label, color, size = 120 }) => {
  const percentage = (value / max) * 100;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white">{Math.round(value)}</span>
          <span className="text-xs text-slate-400">%</span>
        </div>
      </div>
      <span className="mt-2 text-sm text-slate-300 text-center">{label}</span>
    </div>
  );
};

interface SelfManagementDashboardProps {
  data: {
    timeline: TimelineData[];
    gauges: {
      timeManagement: number;
      procrastinationControl: number;
      selfControl: number;
      energyManagement: number;
      prioritization: number;
      goalAchievement: number;
    };
    heatmapData: number[][];
  };
  className?: string;
}

export const SelfManagementDashboard: React.FC<SelfManagementDashboardProps> = ({
  data,
  className = '',
}) => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('week');

  const gaugeData = [
    { key: 'timeManagement', label: 'Time Management', value: data.gauges.timeManagement, color: '#3498db' },
    { key: 'procrastinationControl', label: 'Procrastination Control', value: data.gauges.procrastinationControl, color: '#e74c3c' },
    { key: 'selfControl', label: 'Self-Control', value: data.gauges.selfControl, color: '#2ecc71' },
    { key: 'energyManagement', label: 'Energy Management', value: data.gauges.energyManagement, color: '#f39c12' },
    { key: 'prioritization', label: 'Prioritization', value: data.gauges.prioritization, color: '#9b59b6' },
    { key: 'goalAchievement', label: 'Goal Achievement', value: data.gauges.goalAchievement, color: '#1abc9c' },
  ];

  return (
    <div className={`bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-6 h-6 text-green-500" />
            Self-Management Dashboard
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Timeline produktivitas & gauge manajemen diri
          </p>
        </div>
        <div className="flex bg-slate-800 rounded-lg p-1">
          {(['week', 'month', 'quarter'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                timeRange === range
                  ? 'bg-[#135bec] text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Timeline */}
        <div className="space-y-4">
          <div className="bg-slate-800/50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Productivity Timeline
            </h4>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.timeline}>
                  <defs>
                    <linearGradient id="colorDeepWork" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3498db" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3498db" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2ecc71" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2ecc71" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#94a3b8' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="deepWork"
                    stroke="#3498db"
                    fillOpacity={1}
                    fill="url(#colorDeepWork)"
                    name="Deep Work"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="focusDuration"
                    stroke="#2ecc71"
                    fillOpacity={1}
                    fill="url(#colorFocus)"
                    name="Focus Duration"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-800/50 rounded-lg p-3">
              <div className="text-xs text-slate-400 mb-1">Avg Deep Work</div>
              <div className="text-2xl font-bold text-blue-400">
                {Math.round(data.timeline.reduce((sum, d) => sum + d.deepWork, 0) / data.timeline.length)}%
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3">
              <div className="text-xs text-slate-400 mb-1">Task Completion</div>
              <div className="text-2xl font-bold text-green-400">
                {Math.round(data.timeline.reduce((sum, d) => sum + d.taskCompletion, 0) / data.timeline.length)}%
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Gauges */}
        <div className="space-y-4">
          <div className="bg-slate-800/50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Self-Management Gauges
            </h4>
            <div className="grid grid-cols-3 gap-4">
              {gaugeData.map((gauge, index) => (
                <motion.div
                  key={gauge.key}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CircularGauge
                    value={gauge.value}
                    max={100}
                    label={gauge.label}
                    color={gauge.color}
                    size={100}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-slate-800/50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              Improvement Tips
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                Gunakan teknik Pomodoro untuk meningkatkan fokus
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">•</span>
                Tetapkan prioritas dengan Eisenhower Matrix
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">•</span>
                Blok waktu untuk deep work tanpa distraksi
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelfManagementDashboard;
