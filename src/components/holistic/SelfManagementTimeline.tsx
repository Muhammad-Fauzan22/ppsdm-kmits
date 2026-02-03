/**
 * Self-Management Timeline & Gauge Component
 * 
 * Visualisasi produktivitas dan manajemen diri dalam bentuk timeline dan gauge
 * Berdasarkan spesifikasi dari ASSESSMENT BROU/10 Diagram untuk Visualisasi Holist.txt
 * 
 * Features:
 * - Multi-line productivity timeline
 * - 6 circular gauges untuk sub-dimensi
 * - Habit tracking heatmap
 * - Time range selector
 * - Comparison dengan peers
 */

'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface TimelineData {
  date: string;
  deepWork: number;
  taskCompletion: number;
  focusDuration: number;
  distractions: number;
}

interface GaugeMetric {
  name: string;
  value: number;
  target: number;
  color: string;
}

interface HeatmapData {
  date: string;
  habits: {
    morning_routine: number;
    deep_work_sessions: number;
    exercise: number;
  };
}

interface SelfManagementTimelineProps {
  timelineData: TimelineData[];
  gaugeMetrics: GaugeMetric[];
  heatmapData: HeatmapData[];
  width?: number;
  height?: number;
  showComparison?: boolean;
  className?: string;
}

// Color zones for gauges
const GAUGE_COLORS = {
  excellent: '#10b981',  // Green
  good: '#22c55e',      // Green
  moderate: '#f59e0b',   // Yellow/Orange
  needs_work: '#ef4444'  // Red
};

export const SelfManagementTimeline: React.FC<SelfManagementTimelineProps> = ({
  timelineData,
  gaugeMetrics,
  heatmapData,
  width = 800,
  height = 600,
  showComparison = true,
  className = ''
}) => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('week');
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipData, setTooltipData] = useState<any>(null);

  // Filter data based on time range
  const filteredTimelineData = useMemo(() => {
    const now = new Date();
    const ranges = {
      week: 7,
      month: 30,
      quarter: 90
    };
    const days = ranges[timeRange];
    return timelineData.slice(-days);
  }, [timelineData, timeRange]);

  // Calculate trend
  const calculateTrend = (data: number[]) => {
    if (data.length < 2) return { trend: 'stable', change: 0 };
    const first = data[0];
    const last = data[data.length - 1];
    const change = ((last - first) / first) * 100;
    return {
      trend: change > 5 ? 'increasing' : change < -5 ? 'decreasing' : 'stable',
      change
    };
  };

  const deepWorkTrend = calculateTrend(filteredTimelineData.map(d => d.deepWork));
  const taskCompletionTrend = calculateTrend(filteredTimelineData.map(d => d.taskCompletion));

  // Get gauge color based on value
  const getGaugeColor = (value: number) => {
    if (value >= 80) return GAUGE_COLORS.excellent;
    if (value >= 60) return GAUGE_COLORS.good;
    if (value >= 40) return GAUGE_COLORS.moderate;
    return GAUGE_COLORS.needs_work;
  };

  // Calculate gauge arc
  const calculateGaugeArc = (value: number, radius: number) => {
    const angle = (value / 100) * Math.PI;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return { x, y, angle };
  };

  return (
    <div className={`relative ${className}`}>
      {/* Header with time range selector */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Manajemen Diri & Produktivitas</h3>
          <p className="text-sm text-gray-600">Timeline dan metrik produktivitas Anda</p>
        </div>
        <div className="flex gap-2">
          {(['week', 'month', 'quarter'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range === 'week' ? 'Minggu' : range === 'month' ? 'Bulan' : 'Kuartal'}
            </button>
          ))}
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel: Productivity Timeline */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h4 className="font-bold text-gray-800 mb-4">Timeline Produktivitas</h4>
          
          {/* Trend indicators */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-xs text-gray-600 mb-1">Deep Work</div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-blue-600">
                  {deepWorkTrend.trend === 'increasing' ? '↑' : deepWorkTrend.trend === 'decreasing' ? '↓' : '→'}
                </span>
                <span className={`text-sm ${deepWorkTrend.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(deepWorkTrend.change).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-xs text-gray-600 mb-1">Task Completion</div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-green-600">
                  {taskCompletionTrend.trend === 'increasing' ? '↑' : taskCompletionTrend.trend === 'decreasing' ? '↓' : '→'}
                </span>
                <span className={`text-sm ${taskCompletionTrend.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(taskCompletionTrend.change).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Timeline chart */}
          <svg width="100%" height="200" className="overflow-visible">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((value) => (
              <line
                key={value}
                x1="0"
                y1={200 - (value / 100) * 180}
                x2="100%"
                y2={200 - (value / 100) * 180}
                stroke="#e5e7eb"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            ))}

            {/* Deep Work line */}
            <motion.path
              d={`M ${filteredTimelineData.map((d, i) => {
                const x = (i / (filteredTimelineData.length - 1)) * 100 + '%';
                const y = 200 - (d.deepWork / 100) * 180;
                return `${x},${y}`;
              }).join(' L ')}`}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1 }}
            />

            {/* Task Completion line */}
            <motion.path
              d={`M ${filteredTimelineData.map((d, i) => {
                const x = (i / (filteredTimelineData.length - 1)) * 100 + '%';
                const y = 200 - (d.taskCompletion / 100) * 180;
                return `${x},${y}`;
              }).join(' L ')}`}
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            />

            {/* Focus Duration line */}
            <motion.path
              d={`M ${filteredTimelineData.map((d, i) => {
                const x = (i / (filteredTimelineData.length - 1)) * 100 + '%';
                const y = 200 - (d.focusDuration / 100) * 180;
                return `${x},${y}`;
              }).join(' L ')}`}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2"
              strokeDasharray="5 5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            />
          </svg>

          {/* Legend */}
          <div className="flex justify-center gap-6 mt-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-gray-600">Deep Work</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-gray-600">Task Completion</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-gray-600">Focus Duration</span>
            </div>
          </div>
        </div>

        {/* Right Panel: Self-Management Gauges */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h4 className="font-bold text-gray-800 mb-4">Metrik Manajemen Diri</h4>
          
          <div className="grid grid-cols-2 gap-4">
            {gaugeMetrics.map((metric, index) => {
              const gaugeColor = getGaugeColor(metric.value);
              const { x, y } = calculateGaugeArc(metric.value, 30);

              return (
                <div
                  key={metric.name}
                  className="flex flex-col items-center p-3 bg-gray-50 rounded-lg"
                  onMouseEnter={() => {
                    setSelectedMetric(metric.name);
                    setTooltipData(metric);
                    setShowTooltip(true);
                  }}
                  onMouseLeave={() => {
                    setSelectedMetric(null);
                    setShowTooltip(false);
                  }}
                >
                  <svg width="80" height="50" className="mb-2">
                    {/* Background arc */}
                    <path
                      d="M 10 50 A 30 30 0 0 1 70 50"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                    {/* Value arc */}
                    <motion.path
                      d={`M 10 50 A 30 30 0 ${metric.value > 50 ? 1 : 0} 1 ${40 + x} ${50 - y}`}
                      fill="none"
                      stroke={gaugeColor}
                      strokeWidth="8"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </svg>
                  <div className="text-center">
                    <div className="text-lg font-bold" style={{ color: gaugeColor }}>
                      {metric.value}
                    </div>
                    <div className="text-xs text-gray-600 truncate w-20">
                      {metric.name}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Panel: Habit Tracking Heatmap */}
      <div className="mt-6 bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <h4 className="font-bold text-gray-800 mb-4">Tracking Kebiasaan</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Morning Routine Heatmap */}
          <div>
            <h5 className="text-sm font-semibold text-gray-700 mb-3">Morning Routine</h5>
            <div className="grid grid-cols-7 gap-1">
              {heatmapData.slice(-7).map((day, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded flex items-center justify-center text-xs font-semibold ${
                    day.habits.morning_routine >= 3 ? 'bg-green-500 text-white' :
                    day.habits.morning_routine >= 2 ? 'bg-green-300 text-green-800' :
                    day.habits.morning_routine >= 1 ? 'bg-yellow-300 text-yellow-800' :
                    'bg-red-200 text-red-800'
                  }`}
                >
                  {day.habits.morning_routine}
                </div>
              ))}
            </div>
          </div>

          {/* Deep Work Sessions Heatmap */}
          <div>
            <h5 className="text-sm font-semibold text-gray-700 mb-3">Deep Work Sessions</h5>
            <div className="grid grid-cols-7 gap-1">
              {heatmapData.slice(-7).map((day, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded flex items-center justify-center text-xs font-semibold ${
                    day.habits.deep_work_sessions >= 4 ? 'bg-blue-500 text-white' :
                    day.habits.deep_work_sessions >= 3 ? 'bg-blue-300 text-blue-800' :
                    day.habits.deep_work_sessions >= 2 ? 'bg-blue-200 text-blue-800' :
                    'bg-gray-200 text-gray-800'
                  }`}
                >
                  {day.habits.deep_work_sessions}
                </div>
              ))}
            </div>
          </div>

          {/* Exercise Heatmap */}
          <div>
            <h5 className="text-sm font-semibold text-gray-700 mb-3">Exercise</h5>
            <div className="grid grid-cols-7 gap-1">
              {heatmapData.slice(-7).map((day, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded flex items-center justify-center text-xs font-semibold ${
                    day.habits.exercise >= 1 ? 'bg-purple-500 text-white' :
                    'bg-gray-200 text-gray-800'
                  }`}
                >
                  {day.habits.exercise ? '✓' : '✗'}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Heatmap Legend */}
        <div className="flex justify-center gap-6 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500" />
            <span className="text-gray-600">Excellent (≥3)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-300" />
            <span className="text-gray-600">Good (2)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-300" />
            <span className="text-gray-600">Fair (1)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-200" />
            <span className="text-gray-600">Poor (0)</span>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && tooltipData && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bg-white rounded-lg shadow-xl p-4 z-50 border border-gray-200"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              minWidth: '250px'
            }}
          >
            <h4 className="font-bold text-gray-800 mb-2">{tooltipData.name}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Skor Saat Ini:</span>
                <span className="font-bold text-blue-600">{tooltipData.value}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Target:</span>
                <span className="font-bold text-green-600">{tooltipData.target}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Gap:</span>
                <span className={`font-bold ${
                  tooltipData.target - tooltipData.value > 0 ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {tooltipData.target - tooltipData.value}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comparison Panel (optional) */}
      {showComparison && (
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-gray-200">
          <h4 className="font-bold text-gray-800 mb-4">Perbandingan dengan Teman Sebaya</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">72</div>
              <div className="text-xs text-gray-600">Skor Anda</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">65</div>
              <div className="text-xs text-gray-600">Rata-rata Fakultas</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">+7</div>
              <div className="text-xs text-gray-600">Di Atas Rata-rata</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelfManagementTimeline;
