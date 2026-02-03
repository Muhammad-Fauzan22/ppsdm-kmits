/**
 * Environmental & Lifestyle Dashboard Component
 * 
 * Visualisasi manajemen lingkungan dan gaya hidup dalam bentuk dashboard komprehensif
 * Berdasarkan spesifikasi dari ASSESSMENT BROU/10 Diagram untuk Visualisasi Holist.txt
 * 
 * Features:
 * - 8 metrics untuk komponen lingkungan dan gaya hidup
 * - Sustainability index calculation
 * - Carbon footprint estimation
 * - Work-life balance score
 * - Digital wellbeing tracker
 * - Community engagement display
 */

'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface EnvironmentalMetric {
  name: string;
  value: number;
  target: number;
  category: 'awareness' | 'behavior' | 'wlb' | 'digital' | 'minimalism' | 'community' | 'advocacy' | 'carbon';
  unit?: string;
  trend?: 'improving' | 'stable' | 'declining';
  description: string;
  icon: string;
}

interface SustainabilityIndicators {
  sustainableBehavior: string;
  workLifeBalance: string;
  digitalWellbeing: string;
  carbonFootprint: number;
  communityEngagement: string;
}

interface LifestyleHealth {
  level: string;
  description: string;
  color: string;
  icon: string;
}

interface EnvironmentalDashboardProps {
  metrics: EnvironmentalMetric[];
  sustainabilityIndicators: SustainabilityIndicators;
  lifestyleHealth: LifestyleHealth;
  overallScore: number;
  width?: number;
  height?: number;
  showComparison?: boolean;
  className?: string;
}

// Color scheme for environmental visualization
const ENV_COLORS = {
  leader: '#10b981',      // Green
  advanced: '#22c55e',     // Green
  competent: '#f59e0b',    // Orange
  developing: '#f97316',   // Orange
  beginner: '#ef4444',     // Red

  awareness: '#3b82f6',    // Blue
  behavior: '#10b981',     // Green
  wlb: '#8b5cf6',         // Purple
  digital: '#6366f1',      // Indigo
  minimalism: '#f59e0b',    // Orange
  community: '#ec4899',     // Pink
  advocacy: '#06b6d4',     // Cyan
  carbon: '#14b8a6'        // Teal
};

const CATEGORY_LABELS = {
  awareness: 'Kesadaran Lingkungan',
  behavior: 'Perilaku Berkelanjutan',
  wlb: 'Work-Life Balance',
  digital: 'Kesejahteraan Digital',
  minimalism: 'Minimalisme',
  community: 'Keterlibatan Komunitas',
  advocacy: 'Advokasi Lingkungan',
  carbon: 'Jejak Karbon'
};

export const EnvironmentalDashboard: React.FC<EnvironmentalDashboardProps> = ({
  metrics,
  sustainabilityIndicators,
  lifestyleHealth,
  overallScore,
  width = 800,
  height = 600,
  showComparison = true,
  className = ''
}) => {
  const [selectedMetric, setSelectedMetric] = useState<EnvironmentalMetric | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showCarbonModal, setShowCarbonModal] = useState(false);

  // Get metric color based on value
  const getMetricColor = (value: number) => {
    if (value >= 80) return ENV_COLORS.leader;
    if (value >= 72) return ENV_COLORS.advanced;
    if (value >= 64) return ENV_COLORS.competent;
    if (value >= 52) return ENV_COLORS.developing;
    if (value >= 43) return ENV_COLORS.beginner;
    return ENV_COLORS.beginner;
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    return ENV_COLORS[category as keyof typeof ENV_COLORS] || '#6b7280';
  };

  // Get trend icon
  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'improving': return '📈';
      case 'declining': return '📉';
      default: return '➡️';
    }
  };

  // Calculate overall lifestyle status
  const getLifestyleStatus = (score: number) => {
    if (score >= 75) return { status: 'Highly Balanced & Sustainable', color: ENV_COLORS.leader, icon: '🌟' };
    if (score >= 60) return { status: 'Balanced', color: ENV_COLORS.advanced, icon: '✨' };
    if (score >= 45) return { status: 'Moderate', color: ENV_COLORS.competent, icon: '🎯' };
    if (score >= 30) return { status: 'Needs Improvement', color: ENV_COLORS.developing, icon: '⚠️' };
    return { status: 'Significant Improvement Needed', color: ENV_COLORS.beginner, icon: '🚨' };
  };

  const lifestyleStatus = getLifestyleStatus(overallScore);

  // Handle metric click
  const handleMetricClick = (metric: EnvironmentalMetric) => {
    setSelectedMetric(metric);
    setActiveCategory(metric.category);
    setShowTooltip(true);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Manajemen Lingkungan & Gaya Hidup</h3>
          <p className="text-sm text-gray-600">Metrik keberlanjutan dan keseimbangan hidup</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Lifestyle Status Badge */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg px-4 py-2">
            <span className="text-2xl">{lifestyleStatus.icon}</span>
            <div>
              <div className="text-xs text-gray-600">Status Gaya Hidup</div>
              <div className="text-lg font-bold" style={{ color: lifestyleStatus.color }}>
                {overallScore}
              </div>
            </div>
          </div>

          {/* Carbon Button */}
          <button
            onClick={() => setShowCarbonModal(true)}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-semibold"
          >
            🌍 Jejak Karbon
          </button>
        </div>
      </div>

      {/* Overall Summary */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-xs text-gray-600 mb-1">Indeks Keberlanjutan</div>
          <div className="text-2xl font-bold text-green-600">
            {sustainabilityIndicators.sustainableBehavior}
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-xs text-gray-600 mb-1">Work-Life Balance</div>
          <div className="text-2xl font-bold text-purple-600">
            {sustainabilityIndicators.workLifeBalance}
          </div>
        </div>
        <div className="bg-indigo-50 rounded-lg p-4">
          <div className="text-xs text-gray-600 mb-1">Kesejahteraan Digital</div>
          <div className="text-2xl font-bold text-indigo-600">
            {sustainabilityIndicators.digitalWellbeing}
          </div>
        </div>
        <div className="bg-teal-50 rounded-lg p-4">
          <div className="text-xs text-gray-600 mb-1">Jejak Karbon</div>
          <div className="text-2xl font-bold text-teal-600">
            {sustainabilityIndicators.carbonFootprint} ton
          </div>
        </div>
      </div>

      {/* Environmental Metrics */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 mb-6">
        <h4 className="font-bold text-gray-800 mb-4">Metrik Lingkungan & Gaya Hidup</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => {
            const metricColor = getMetricColor(metric.value);
            const categoryColor = getCategoryColor(metric.category);
            const progressWidth = (metric.value / 100) * 100;
            const targetWidth = (metric.target / 100) * 100;

            return (
              <div
                key={metric.name}
                className="p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
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
                onClick={() => handleMetricClick(metric)}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: categoryColor }}
                  />
                  <span className="font-semibold text-gray-800 text-sm">{metric.name}</span>
                </div>

                {/* Progress Bar */}
                <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden mb-2">
                  {/* Target Line */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-gray-400 z-10"
                    style={{ left: `${targetWidth}%` }}
                  />

                  {/* Value Bar */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressWidth}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: metricColor }}
                  />
                </div>

                {/* Score Display */}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold" style={{ color: metricColor }}>
                    {metric.value}
                  </span>
                  {metric.trend && (
                    <span className="text-sm">
                      {getTrendIcon(metric.trend)} {metric.trend}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-6 text-xs flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500" />
            <span className="text-gray-600">Leader (≥80)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-400" />
            <span className="text-gray-600">Advanced (72-79)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-orange-500" />
            <span className="text-gray-600">Competent (64-71)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-orange-600" />
            <span className="text-gray-600">Developing (52-63)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500" />
            <span className="text-gray-600">Beginner (43-51)</span>
          </div>
        </div>
      </div>

      {/* Sustainability Indicators */}
      <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6 border border-gray-200 mb-6">
        <h4 className="font-bold text-gray-800 mb-4">Indikator Keberlanjutan</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">♻️</span>
              <span className="font-semibold text-gray-800 text-sm">Perilaku Berkelanjutan</span>
            </div>
            <div className="text-lg font-bold text-green-600">
              {sustainabilityIndicators.sustainableBehavior}
            </div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">⚖️</span>
              <span className="font-semibold text-gray-800 text-sm">Work-Life Balance</span>
            </div>
            <div className="text-lg font-bold text-purple-600">
              {sustainabilityIndicators.workLifeBalance}
            </div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">📱</span>
              <span className="font-semibold text-gray-800 text-sm">Kesejahteraan Digital</span>
            </div>
            <div className="text-lg font-bold text-indigo-600">
              {sustainabilityIndicators.digitalWellbeing}
            </div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">👥</span>
              <span className="font-semibold text-gray-800 text-sm">Keterlibatan Komunitas</span>
            </div>
            <div className="text-lg font-bold text-pink-600">
              {sustainabilityIndicators.communityEngagement}
            </div>
          </div>
        </div>
      </div>

      {/* Lifestyle Health */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-gray-200 mb-6">
        <h4 className="font-bold text-gray-800 mb-4">Kesehatan Gaya Hidup</h4>

        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{lifestyleHealth.icon}</span>
            <div>
              <div className="text-xs text-gray-600">Level</div>
              <div className="text-lg font-bold text-gray-800">
                {lifestyleHealth.level.replace(/_/g, ' ')}
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            {lifestyleHealth.description}
          </p>
        </div>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && selectedMetric && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bg-white rounded-xl shadow-2xl p-6 z-50 border border-gray-200"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              minWidth: '320px'
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                style={{ backgroundColor: getCategoryColor(selectedMetric.category) }}
              >
                {selectedMetric.icon}
              </div>
              <div>
                <h4 className="font-bold text-gray-800">{selectedMetric.name}</h4>
                <div className="text-sm text-gray-600">
                  {CATEGORY_LABELS[selectedMetric.category as keyof typeof CATEGORY_LABELS]}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Skor Saat Ini:</span>
                <span
                  className="text-lg font-bold"
                  style={{ color: getMetricColor(selectedMetric.value) }}
                >
                  {selectedMetric.value}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Target:</span>
                <span className="text-lg font-bold text-green-600">
                  {selectedMetric.target}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Gap:</span>
                <span
                  className={`text-lg font-bold ${selectedMetric.target - selectedMetric.value > 0
                      ? 'text-yellow-600'
                      : 'text-green-600'
                    }`}
                >
                  {selectedMetric.target - selectedMetric.value > 0 ? '+' : ''}
                  {selectedMetric.target - selectedMetric.value}
                </span>
              </div>

              {selectedMetric.trend && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Trend:</span>
                  <span className="font-semibold">
                    {getTrendIcon(selectedMetric.trend)} {selectedMetric.trend}
                  </span>
                </div>
              )}
            </div>

            <p className="text-sm text-gray-600 mt-4">
              {selectedMetric.description}
            </p>

            <button
              onClick={() => setShowTooltip(false)}
              className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Tutup
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Carbon Footprint Modal */}
      <AnimatePresence>
        {showCarbonModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowCarbonModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">🌍 Analisis Jejak Karbon</h3>
                <button
                  onClick={() => setShowCarbonModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600">Estimasi Jejak Karbon Tahunan</div>
                    <div className="text-3xl font-bold text-teal-600">
                      {sustainabilityIndicators.carbonFootprint} ton CO₂
                    </div>
                  </div>
                  <div className="text-6xl">🌍</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">✅</span>
                    <span className="font-semibold text-gray-800">Optimal</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    &lt; 4.5 ton CO₂/tahun - Di bawah rata-rata mahasiswa Indonesia
                  </p>
                </div>

                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">⚠️</span>
                    <span className="font-semibold text-gray-800">Perlu Perhatian</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    4.5 - 5.5 ton CO₂/tahun - Mendekati rata-rata
                  </p>
                </div>

                <div className="bg-red-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">🚨</span>
                    <span className="font-semibold text-gray-800">Kritis</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    &gt; 5.5 ton CO₂/tahun - Di atas rata-rata, perlu tindakan
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>💡 Tips Mengurangi Jejak Karbon:</strong> Kurangi penggunaan plastik sekali pakai, gunakan transportasi umum, hemat energi, dan pilih produk lokal.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnvironmentalDashboard;
