/**
 * Physical Health & Vitality Gauges Component
 * 
 * Visualisasi kesehatan fisik dan vitalitas dalam bentuk gauge dan trend
 * Berdasarkan spesifikasi dari ASSESSMENT BROU/10 Diagram untuk Visualisasi Holist.txt
 * 
 * Features:
 * - 8 circular gauges untuk sub-dimensi kesehatan fisik
 * - Health trend visualization
 * - Vitality index calculation
 * - Risk factor identification
 * - Health recommendations
 */

'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface HealthMetric {
  name: string;
  value: number;
  target: number;
  category: 'activity' | 'sleep' | 'nutrition' | 'vitality' | 'hydration' | 'stress' | 'preventive' | 'awareness';
  unit?: string;
  trend?: 'improving' | 'stable' | 'declining';
}

interface HealthRisk {
  risk: string;
  severity: 'high' | 'moderate' | 'low';
  impact: string;
}

interface PhysicalHealthGaugesProps {
  metrics: HealthMetric[];
  risks: HealthRisk[];
  vitalityIndex: number;
  width?: number;
  height?: number;
  showRecommendations?: boolean;
  className?: string;
}

// Color scheme for health visualization
const HEALTH_COLORS = {
  excellent: '#10b981',  // Green
  good: '#22c55e',      // Green
  moderate: '#f59e0b',   // Yellow/Orange
  needs_work: '#ef4444', // Red
  critical: '#dc2626'     // Dark Red
};

const CATEGORY_COLORS = {
  activity: '#3b82f6',    // Blue
  sleep: '#8b5cf6',      // Purple
  nutrition: '#10b981',   // Green
  vitality: '#f59e0b',    // Orange
  hydration: '#06b6d4',   // Cyan
  stress: '#ef4444',      // Red
  preventive: '#8b5cf6', // Purple
  awareness: '#6366f1'    // Indigo
};

export const PhysicalHealthGauges: React.FC<PhysicalHealthGaugesProps> = ({
  metrics,
  risks,
  vitalityIndex,
  width = 800,
  height = 600,
  showRecommendations = true,
  className = ''
}) => {
  const [selectedMetric, setSelectedMetric] = useState<HealthMetric | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Get gauge color based on value
  const getGaugeColor = (value: number) => {
    if (value >= 80) return HEALTH_COLORS.excellent;
    if (value >= 65) return HEALTH_COLORS.good;
    if (value >= 50) return HEALTH_COLORS.moderate;
    if (value >= 35) return HEALTH_COLORS.needs_work;
    return HEALTH_COLORS.critical;
  };

  // Calculate gauge arc
  const calculateGaugeArc = (value: number, radius: number) => {
    const angle = (value / 100) * Math.PI;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return { x, y, angle };
  };

  // Calculate overall health score
  const overallHealth = useMemo(() => {
    const avgScore = metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length;
    return {
      score: avgScore,
      level: avgScore >= 80 ? 'excellent' : avgScore >= 65 ? 'good' : avgScore >= 50 ? 'moderate' : 'needs_improvement'
    };
  }, [metrics]);

  // Get vitality level
  const getVitalityLevel = (index: number) => {
    if (index >= 80) return { level: 'High Vitality', color: HEALTH_COLORS.excellent, icon: '⚡' };
    if (index >= 65) return { level: 'Good Vitality', color: HEALTH_COLORS.good, icon: '✨' };
    if (index >= 50) return { level: 'Moderate Vitality', color: HEALTH_COLORS.moderate, icon: '🌟' };
    if (index >= 35) return { level: 'Low Vitality', color: HEALTH_COLORS.needs_work, icon: '⚠️' };
    return { level: 'Very Low Vitality', color: HEALTH_COLORS.critical, icon: '🚨' };
  };

  const vitalityLevel = getVitalityLevel(vitalityIndex);

  // Get trend icon
  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'improving': return '📈';
      case 'declining': return '📉';
      default: return '➡️';
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Kesehatan Fisik & Vitalitas</h3>
          <p className="text-sm text-gray-600">Metrik kesehatan dan tingkat energi Anda</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Vitality Index */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg px-4 py-2">
            <span className="text-2xl">{vitalityLevel.icon}</span>
            <div>
              <div className="text-xs text-gray-600">Vitality Index</div>
              <div className="text-lg font-bold" style={{ color: vitalityLevel.color }}>
                {vitalityIndex}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Health Summary */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-xs text-gray-600 mb-1">Skor Kesehatan</div>
          <div className="text-2xl font-bold text-blue-600">
            {overallHealth.score.toFixed(1)}
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-xs text-gray-600 mb-1">Metrik Optimal</div>
          <div className="text-2xl font-bold text-green-600">
            {metrics.filter(m => m.value >= 70).length}/{metrics.length}
          </div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="text-xs text-gray-600 mb-1">Metrik Perlu Perhatian</div>
          <div className="text-2xl font-bold text-yellow-600">
            {metrics.filter(m => m.value < 50).length}
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-xs text-gray-600 mb-1">Level Kesehatan</div>
          <div className="text-lg font-bold text-purple-600 capitalize">
            {overallHealth.level.replace('_', ' ')}
          </div>
        </div>
      </div>

      {/* Health Gauges Grid */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 mb-6">
        <h4 className="font-bold text-gray-800 mb-4">Metrik Kesehatan Fisik</h4>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {metrics.map((metric, index) => {
            const gaugeColor = getGaugeColor(metric.value);
            const { x, y } = calculateGaugeArc(metric.value, 30);
            const categoryColor = CATEGORY_COLORS[metric.category];

            return (
              <div
                key={metric.name}
                className="flex flex-col items-center p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                onMouseEnter={() => {
                  setSelectedMetric(metric);
                  setActiveCategory(metric.category);
                  setShowTooltip(true);
                }}
                onMouseLeave={() => {
                  setSelectedMetric(null);
                  setActiveCategory(null);
                  setShowTooltip(false);
                }}
              >
                {/* Gauge */}
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

                {/* Metric Info */}
                <div className="text-center">
                  <div className="text-lg font-bold" style={{ color: gaugeColor }}>
                    {metric.value}
                    {metric.unit && <span className="text-sm text-gray-600 ml-1">{metric.unit}</span>}
                  </div>
                  <div className="text-xs text-gray-600 truncate w-20">
                    {metric.name}
                  </div>
                  {metric.trend && (
                    <div className="text-xs mt-1">
                      {getTrendIcon(metric.trend)} {metric.trend}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500" />
            <span className="text-gray-600">Excellent (≥80)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-400" />
            <span className="text-gray-600">Good (65-79)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500" />
            <span className="text-gray-600">Moderate (50-64)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500" />
            <span className="text-gray-600">Needs Work (35-49)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-600" />
            <span className="text-gray-600">Critical (&lt;35)</span>
          </div>
        </div>
      </div>

      {/* Risk Factors Panel */}
      {risks.length > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border border-gray-200 mb-6">
          <h4 className="font-bold text-gray-800 mb-4">Faktor Risiko Kesehatan</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {risks.map((risk, index) => (
              <div
                key={index}
                className={`bg-white rounded-lg p-4 border-l-4 ${risk.severity === 'high' ? 'border-red-500' :
                  risk.severity === 'moderate' ? 'border-yellow-500' :
                    'border-green-500'
                  }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-lg ${risk.severity === 'high' ? '🚨' :
                    risk.severity === 'moderate' ? '⚠️' : '✅'
                    }`} />
                  <span className="font-semibold text-gray-800">{risk.risk}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {risk.impact}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Health Recommendations */}
      {showRecommendations && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-gray-200">
          <h4 className="font-bold text-gray-800 mb-4">Rekomendasi Kesehatan</h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {metrics.filter(m => m.value < 70).slice(0, 3).map((metric, index) => {
              const recommendations: Record<string, string> = {
                activity: 'Tingkatkan aktivitas fisik minimal 150 menit per minggu',
                sleep: 'Tidur 7-8 jam setiap malam untuk kesehatan optimal',
                nutrition: 'Konsumsi minimal 3 porsi sayur dan 2 porsi buah setiap hari',
                vitality: 'Lakukan aktivitas yang meningkatkan energi seperti olahraga ringan',
                hydration: 'Minum minimal 2 liter air per hari',
                stress: 'Praktikkan teknik relaksasi seperti meditasi atau yoga',
                preventive: 'Lakukan pemeriksaan kesehatan rutin setiap 6 bulan',
                awareness: 'Perhatikan sinyal tubuh dan respon dengan tepat'
              };

              return (
                <div key={index} className="bg-white rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${CATEGORY_COLORS[metric.category]}`} />
                    <span className="font-semibold text-gray-800 text-sm">{metric.name}</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {recommendations[metric.category] || 'Lihat rekomendasi khusus'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && selectedMetric && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bg-white rounded-lg shadow-xl p-4 z-50 border border-gray-200"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              minWidth: '280px'
            }}
          >
            <h4 className="font-bold text-gray-800 mb-3">{selectedMetric.name}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Skor Saat Ini:</span>
                <span className="font-bold" style={{ color: getGaugeColor(selectedMetric.value) }}>
                  {selectedMetric.value}
                  {selectedMetric.unit && <span className="ml-1">{selectedMetric.unit}</span>}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Target:</span>
                <span className="font-bold text-green-600">
                  {selectedMetric.target}
                  {selectedMetric.unit && <span className="ml-1">{selectedMetric.unit}</span>}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Gap:</span>
                <span className={`font-bold ${selectedMetric.target - selectedMetric.value > 0 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                  {selectedMetric.target - selectedMetric.value}
                  {selectedMetric.unit && <span className="ml-1">{selectedMetric.unit}</span>}
                </span>
              </div>
              {selectedMetric.trend && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Trend:</span>
                  <span className="font-semibold">
                    {getTrendIcon(selectedMetric.trend)} {selectedMetric.trend}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PhysicalHealthGauges;
