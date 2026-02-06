/**
 * Mental Health & Psychological Bar Component
 * 
 * Visualisasi kesehatan mental dan psikologis dalam bentuk bar dan trend
 * Berdasarkan spesifikasi dari ASSESSMENT BROU/10 Diagram untuk Visualisasi Holist.txt
 * 
 * Features:
 * - 8 bar untuk sub-dimensi kesehatan mental
 * - Flourishing level indicator
 * - Risk flags identification
 * - Trend visualization
 * - Crisis resources display
 * - Support recommendations
 */

'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface MentalHealthMetric {
  name: string;
  value: number;
  target: number;
  category: 'wellbeing' | 'resilience' | 'stress' | 'mindfulness' | 'trauma' | 'academic' | 'coping' | 'help_seeking';
  unit?: string;
  trend?: 'improving' | 'stable' | 'declining';
  description: string;
}

interface RiskFlag {
  risk: string;
  severity: 'high' | 'moderate' | 'low';
  impact: string;
  recommendation: string;
}

interface FlourishingLevel {
  level: string;
  description: string;
  color: string;
  icon: string;
}

interface MentalHealthBarProps {
  metrics: MentalHealthMetric[];
  riskFlags: RiskFlag[];
  flourishingLevel: FlourishingLevel;
  overallScore: number;
  width?: number;
  height?: number;
  showCrisisResources?: boolean;
  className?: string;
}

// Color scheme for mental health visualization
const MH_COLORS = {
  flourishing: '#10b981',    // Green
  good: '#22c55e',         // Green
  moderate: '#f59e0b',      // Yellow/Orange
  languishing: '#f97316',   // Orange
  struggling: '#ef4444',    // Red
  distressed: '#dc2626',    // Dark Red

  wellbeing: '#8b5cf6',     // Purple
  resilience: '#06b6d4',     // Cyan
  stress: '#ef4444',        // Red
  mindfulness: '#10b981',   // Green
  trauma: '#f59e0b',        // Orange
  academic: '#6366f1',      // Indigo
  coping: '#8b5cf6',        // Purple
  help_seeking: '#ec4899'   // Pink
};

const CATEGORY_LABELS = {
  wellbeing: 'Kesejahteraan',
  resilience: 'Ketahanan',
  stress: 'Manajemen Stres',
  mindfulness: 'Kesadaran Penuh',
  trauma: 'Penyembuhan Trauma',
  academic: 'Stres Akademik',
  coping: 'Strategi Coping',
  help_seeking: 'Pencarian Bantuan'
};

export const MentalHealthBar: React.FC<MentalHealthBarProps> = ({
  metrics,
  riskFlags,
  flourishingLevel,
  overallScore,
  width = 800,
  height = 600,
  showCrisisResources = true,
  className = ''
}) => {
  const [selectedMetric, setSelectedMetric] = useState<MentalHealthMetric | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showCrisisModal, setShowCrisisModal] = useState(false);

  // Get bar color based on value
  const getBarColor = (value: number) => {
    if (value >= 85) return MH_COLORS.flourishing;
    if (value >= 76) return MH_COLORS.good;
    if (value >= 66) return MH_COLORS.moderate;
    if (value >= 54) return MH_COLORS.languishing;
    if (value >= 44) return MH_COLORS.struggling;
    return MH_COLORS.distressed;
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    return MH_COLORS[category as keyof typeof MH_COLORS] || '#6b7280';
  };

  // Get trend icon
  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'improving': return '📈';
      case 'declining': return '📉';
      default: return '➡️';
    }
  };

  // Calculate overall mental health status
  const getMentalHealthStatus = (score: number) => {
    if (score >= 85) return { status: 'Flourishing', color: MH_COLORS.flourishing, icon: '🌟' };
    if (score >= 76) return { status: 'Good Mental Health', color: MH_COLORS.good, icon: '✨' };
    if (score >= 66) return { status: 'Moderate Mental Health', color: MH_COLORS.moderate, icon: '🎯' };
    if (score >= 54) return { status: 'Languishing', color: MH_COLORS.languishing, icon: '🌱' };
    if (score >= 44) return { status: 'Struggling', color: MH_COLORS.struggling, icon: '⚠️' };
    return { status: 'Distressed', color: MH_COLORS.distressed, icon: '🚨' };
  };

  const mentalHealthStatus = getMentalHealthStatus(overallScore);

  // Crisis resources
  const crisisResources = [
    { name: 'Layanan Konseling ITS', phone: '031-5994254', available: '24/7' },
    { name: 'Layanan Psikologi', phone: '031-5994255', available: '08:00-16:00' },
    { name: 'Hotline Kesehatan Mental', phone: '119', available: '24/7' },
    { name: 'Layanan Darurat', phone: '112', available: '24/7' }
  ];

  return (
    <div className={`relative ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Kesehatan Mental & Psikologis</h3>
          <p className="text-sm text-gray-600">Metrik kesehatan mental dan tingkat kesejahteraan</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Flourishing Level Badge */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-green-50 rounded-lg px-4 py-2">
            <span className="text-2xl">{flourishingLevel.icon}</span>
            <div>
              <div className="text-xs text-gray-600">Level Kesejahteraan</div>
              <div className="text-lg font-bold" style={{ color: flourishingLevel.color }}>
                {flourishingLevel.level}
              </div>
            </div>
          </div>

          {/* Crisis Button */}
          {showCrisisResources && (
            <button
              onClick={() => setShowCrisisModal(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              🆘 Bantuan Darurat
            </button>
          )}
        </div>
      </div>

      {/* Overall Status */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
          <div className="text-xs text-gray-600 mb-1">Status Mental</div>
          <div className="flex items-center gap-2">
            <span className="text-xl">{mentalHealthStatus.icon}</span>
            <div className="text-lg font-bold" style={{ color: mentalHealthStatus.color }}>
              {mentalHealthStatus.status}
            </div>
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-xs text-gray-600 mb-1">Skor Kesehatan</div>
          <div className="text-2xl font-bold text-green-600">
            {overallScore}
          </div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="text-xs text-gray-600 mb-1">Flag Risiko</div>
          <div className="text-2xl font-bold text-yellow-600">
            {riskFlags.length}
          </div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-xs text-gray-600 mb-1">Metrik Optimal</div>
          <div className="text-2xl font-bold text-blue-600">
            {metrics.filter(m => m.value >= 70).length}/{metrics.length}
          </div>
        </div>
      </div>

      {/* Mental Health Bars */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 mb-6">
        <h4 className="font-bold text-gray-800 mb-4">Metrik Kesehatan Mental</h4>

        <div className="space-y-4">
          {metrics.map((metric, index) => {
            const barColor = getBarColor(metric.value);
            const categoryColor = getCategoryColor(metric.category);
            const barWidth = (metric.value / 100) * 100;
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
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: categoryColor }}
                    />
                    <span className="font-semibold text-gray-800">{metric.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold" style={{ color: barColor }}>
                      {metric.value}
                    </span>
                    {metric.trend && (
                      <span className="text-sm">
                        {getTrendIcon(metric.trend)} {metric.trend}
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">
                  {/* Target Line */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-gray-400 z-10"
                    style={{ left: `${targetWidth}%` }}
                  />

                  {/* Value Bar */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${barWidth}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: barColor }}
                  />
                </div>

                {/* Labels */}
                <div className="flex justify-between mt-1 text-xs text-gray-600">
                  <span>0</span>
                  <span>Target: {metric.target}</span>
                  <span>100</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-6 text-xs flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500" />
            <span className="text-gray-600">Flourishing (≥85)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-400" />
            <span className="text-gray-600">Good (76-84)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500" />
            <span className="text-gray-600">Moderate (66-75)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-orange-500" />
            <span className="text-gray-600">Languishing (54-65)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500" />
            <span className="text-gray-600">Struggling (44-53)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-600" />
            <span className="text-gray-600">Distressed (&lt;44)</span>
          </div>
        </div>
      </div>

      {/* Risk Flags Panel */}
      {riskFlags.length > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border border-gray-200 mb-6">
          <h4 className="font-bold text-gray-800 mb-4">Flag Risiko Kesehatan Mental</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {riskFlags.map((risk, index) => (
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
                <div className="text-sm text-gray-600 mb-2">
                  {risk.impact}
                </div>
                <div className="text-xs text-blue-600">
                  💡 {risk.recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Support Recommendations */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-gray-200">
        <h4 className="font-bold text-gray-800 mb-4">Rekomendasi Dukungan</h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {metrics.filter(m => m.value < 70).slice(0, 3).map((metric, index) => {
            const recommendations: Record<string, string> = {
              wellbeing: 'Praktikkan gratitude dan aktivitas yang meningkatkan mood positif',
              resilience: 'Bangun jaringan dukungan sosial dan praktikkan self-care',
              stress: 'Pelajari teknik relaksasi seperti meditasi atau breathing exercises',
              mindfulness: 'Praktikkan mindfulness 10-15 menit setiap hari',
              trauma: 'Pertimbangkan konseling profesional untuk pemrosesan trauma',
              academic: 'Kelola beban akademik dengan prioritas dan time management',
              coping: 'Kembangkan strategi coping yang sehat dan adaptif',
              help_seeking: 'Jangan ragu untuk mencari bantuan profesional jika diperlukan'
            };

            return (
              <div key={index} className="bg-white rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getCategoryColor(metric.category) }}
                  />
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
                <span className="font-bold" style={{ color: getBarColor(selectedMetric.value) }}>
                  {selectedMetric.value}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Target:</span>
                <span className="font-bold text-green-600">
                  {selectedMetric.target}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Gap:</span>
                <span className={`font-bold ${selectedMetric.target - selectedMetric.value > 0 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                  {selectedMetric.target - selectedMetric.value > 0 ? '+' : ''}
                  {selectedMetric.target - selectedMetric.value}
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
            <p className="text-sm text-gray-600 mt-3">
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

      {/* Crisis Modal */}
      <AnimatePresence>
        {showCrisisModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowCrisisModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">🆘 Sumber Daya Krisis</h3>
                <button
                  onClick={() => setShowCrisisModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-800">
                  <strong>⚠️ Penting:</strong> Jika Anda atau seseorang yang Anda kenal sedang dalam krisis atau berpikir untuk menyakiti diri sendiri, segera hubungi salah satu layanan di bawah ini.
                </p>
              </div>

              <div className="space-y-3">
                {crisisResources.map((resource, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <div className="font-semibold text-gray-800">{resource.name}</div>
                      <div className="text-sm text-gray-600">
                        Tersedia: {resource.available}
                      </div>
                    </div>
                    <a
                      href={`tel:${resource.phone}`}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                    >
                      {resource.phone}
                    </a>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>💡 Ingat:</strong> Mencari bantuan adalah tanda kekuatan, bukan kelemahan. Anda tidak sendirian dan ada banyak orang yang siap membantu.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MentalHealthBar;
