/**
 * Holistic Development Cycle Component
 * 
 * Visualisasi siklus pengembangan holistik yang mengintegrasikan 9 dimensi
 * Berdasarkan spesifikasi dari ASSESSMENT BROU/10 Diagram untuk Visualisasi Holist.txt
 * 
 * Features:
 * - 9-dimension integrated view
 * - Development phase indicator
 * - Holistic balance index
 * - Personal development radar
 * - Growth trajectory
 * - Recommendations visualization
 */

'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface DimensionScore {
  id: number;
  name: string;
  score: number;
  previousScore: number;
  target: number;
  category: 'cognitive' | 'self-management' | 'financial' | 'physical' | 'emotional' | 'mental' | 'character' | 'spiritual' | 'environmental';
  color: string;
  icon: string;
}

interface DevelopmentPhase {
  phase: string;
  description: string;
  color: string;
  icon: string;
  requirements: string[];
}

interface HolisticMetrics {
  overallScore: number;
  balanceIndex: number;
  growthRate: number;
  strengths: string[];
  growthAreas: string[];
  quadrantAnalysis: {
    cognitive: number;
    affective: number;
    social: number;
  };
}

interface DevelopmentCycleProps {
  dimensions: DimensionScore[];
  metrics: HolisticMetrics;
  currentPhase: DevelopmentPhase;
  width?: number;
  height?: number;
  showComparison?: boolean;
  className?: string;
}

// Color scheme for holistic visualization
const HOLISTIC_COLORS = {
  cognitive: '#3b82f6',      // Blue
  selfManagement: '#22c55e',  // Green
  financial: '#ef4444',       // Red
  physical: '#10b981',        // Green
  emotional: '#8b5cf6',      // Purple
  mental: '#6366f1',         // Indigo
  character: '#f59e0b',       // Orange
  spiritual: '#ec4899',       // Pink
  environmental: '#06b6d4',   // Cyan
  
  transcendent: '#8b5cf6',    // Purple
  advanced: '#6366f1',        // Indigo
  competent: '#22c55e',       // Green
  developing: '#f59e0b',      // Orange
  beginner: '#ef4444'         // Red
};

const DIMENSION_LABELS = {
  1: 'Kognitif',
  2: 'Manajemen Diri',
  3: 'Finansial',
  4: 'Kesehatan Fisik',
  5: 'Emosional & Sosial',
  6: 'Kesehatan Mental',
  7: 'Karakter & Etika',
  8: 'Spiritual',
  9: 'Lingkungan'
};

const CATEGORY_ICONS = {
  cognitive: '🧠',
  'self-management': '⏰',
  financial: '💰',
  physical: '💪',
  emotional: '❤️',
  mental: '🧘',
  character: '⭐',
  spiritual: '🌟',
  environmental: '🌍'
};

export const DevelopmentCycle: React.FC<DevelopmentCycleProps> = ({
  dimensions,
  metrics,
  currentPhase,
  width = 800,
  height = 600,
  showComparison = true,
  className = ''
}) => {
  const [selectedDimension, setSelectedDimension] = useState<DimensionScore | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'radar' | 'timeline' | 'recommendations'>('overview');
  const [showPhaseModal, setShowPhaseModal] = useState(false);

  // Calculate radar chart points
  const radarPoints = useMemo(() => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 80;
    const angleStep = (2 * Math.PI) / dimensions.length;

    return dimensions.map((dim, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const value = dim.score / 100;
      const x = centerX + Math.cos(angle) * radius * value;
      const y = centerY + Math.sin(angle) * radius * value;
      
      return {
        ...dim,
        x,
        y,
        angle,
        radius: radius * value
      };
    });
  }, [dimensions, width, height]);

  // Get phase color
  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'transcendent': return HOLISTIC_COLORS.transcendent;
      case 'advanced': return HOLISTIC_COLORS.advanced;
      case 'competent': return HOLISTIC_COLORS.competent;
      case 'developing': return HOLISTIC_COLORS.developing;
      default: return HOLISTIC_COLORS.beginner;
    }
  };

  // Get balance level
  const getBalanceLevel = (index: number) => {
    if (index >= 0.9) return { level: 'Sangat Seimbang', color: HOLISTIC_COLORS.transcendent, icon: '🌟' };
    if (index >= 0.8) return { level: 'Seimbang', color: HOLISTIC_COLORS.advanced, icon: '✨' };
    if (index >= 0.7) return { level: 'Cukup Seimbang', color: HOLISTIC_COLORS.competent, icon: '🎯' };
    if (index >= 0.6) return { level: 'Perlu Keseimbangan', color: HOLISTIC_COLORS.developing, icon: '⚠️' };
    return { level: 'Tidak Seimbang', color: HOLISTIC_COLORS.beginner, icon: '🚨' };
  };

  const balanceLevel = getBalanceLevel(metrics.balanceIndex);

  // Handle dimension click
  const handleDimensionClick = (dimension: DimensionScore) => {
    setSelectedDimension(dimension);
    setShowTooltip(true);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Siklus Pengembangan Holistik</h3>
          <p className="text-sm text-gray-600">Integrasi 9 dimensi pengembangan personal</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Overall Score Badge */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg px-4 py-2">
            <span className="text-2xl">📊</span>
            <div>
              <div className="text-xs text-gray-600">Skor Keseluruhan</div>
              <div className="text-lg font-bold text-purple-600">
                {metrics.overallScore}
              </div>
            </div>
          </div>
          
          {/* Balance Index Badge */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg px-4 py-2">
            <span className="text-2xl">{balanceLevel.icon}</span>
            <div>
              <div className="text-xs text-gray-600">Indeks Keseimbangan</div>
              <div className="text-lg font-bold" style={{ color: balanceLevel.color }}>
                {(metrics.balanceIndex * 100).toFixed(0)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {[
          { id: 'overview', label: '📊 Overview', icon: '📊' },
          { id: 'radar', label: '🎯 Radar', icon: '🎯' },
          { id: 'timeline', label: '📈 Timeline', icon: '📈' },
          { id: 'recommendations', label: '💡 Rekomendasi', icon: '💡' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === tab.id
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Phase Indicator */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-gray-800">Fase Pengembangan Saat Ini</h4>
              <button
                onClick={() => setShowPhaseModal(true)}
                className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm"
              >
                Lihat Detail
              </button>
            </div>
            
            <div
              className="p-4 rounded-lg"
              style={{ backgroundColor: getPhaseColor(currentPhase.phase) + '20' }}
            >
              <div className="flex items-center gap-3">
                <span className="text-4xl">{currentPhase.icon}</span>
                <div>
                  <div className="text-2xl font-bold" style={{ color: getPhaseColor(currentPhase.phase) }}>
                    {currentPhase.phase.charAt(0).toUpperCase() + currentPhase.phase.slice(1)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {currentPhase.description}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quadrant Analysis */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h4 className="font-bold text-gray-800 mb-4">Analisis Kuadran</h4>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-xs text-gray-600 mb-2">Kognitif</div>
                <div className="text-2xl font-bold text-blue-600">
                  {metrics.quadrantAnalysis.cognitive}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Kognitif, Manajemen Diri, Finansial
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-xs text-gray-600 mb-2">Afektif</div>
                <div className="text-2xl font-bold text-purple-600">
                  {metrics.quadrantAnalysis.affective}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Emosional, Mental, Karakter
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-xs text-gray-600 mb-2">Sosial</div>
                <div className="text-2xl font-bold text-green-600">
                  {metrics.quadrantAnalysis.social}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Spiritual, Lingkungan, Kesehatan Fisik
                </div>
              </div>
            </div>
          </div>

          {/* Strengths & Growth Areas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>💪</span> Kelebihan
              </h4>
              <div className="space-y-2">
                {metrics.strengths.map((strength, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-green-600">✓</span>
                    <span>{strength}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
              <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>🎯</span> Area Pengembangan
              </h4>
              <div className="space-y-2">
                {metrics.growthAreas.map((area, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-orange-600">→</span>
                    <span>{area}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Radar Tab */}
      {activeTab === 'radar' && (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h4 className="font-bold text-gray-800 mb-4">Radar Pengembangan Holistik</h4>
          
          <svg
            width={width}
            height={height}
            className="mx-auto"
            style={{ maxWidth: '100%', height: 'auto' }}
          >
            {/* Background circles */}
            {[20, 40, 60, 80, 100].map((level, index) => {
              const radius = (level / 100) * (Math.min(width, height) / 2 - 80);
              return (
                <circle
                  key={index}
                  cx={width / 2}
                  cy={height / 2}
                  r={radius}
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth={1}
                  strokeDasharray="5,5"
                />
              );
            })}

            {/* Axis lines */}
            {radarPoints.map((point, index) => {
              return (
                <line
                  key={index}
                  x1={width / 2}
                  y1={height / 2}
                  x2={point.x}
                  y2={point.y}
                  stroke="#e5e7eb"
                  strokeWidth={1}
                />
              );
            })}

            {/* Previous score polygon */}
            {showComparison && (
              <polygon
                points={dimensions.map((dim, index) => {
                  const angle = (index * 2 * Math.PI) / dimensions.length - Math.PI / 2;
                  const radius = Math.min(width, height) / 2 - 80;
                  const value = dim.previousScore / 100;
                  const x = width / 2 + Math.cos(angle) * radius * value;
                  const y = height / 2 + Math.sin(angle) * radius * value;
                  return `${x},${y}`;
                }).join(' ')}
                fill="none"
                stroke="#9ca3af"
                strokeWidth={2}
                strokeDasharray="5,5"
              />
            )}

            {/* Current score polygon */}
            <polygon
              points={radarPoints.map(p => `${p.x},${p.y}`).join(' ')}
              fill="rgba(139, 92, 246, 0.2)"
              stroke="#8b5cf6"
              strokeWidth={3}
            />

            {/* Dimension points */}
            {radarPoints.map((point, index) => {
              const isSelected = selectedDimension?.id === point.id;
              
              return (
                <g key={index}>
                  {/* Point circle */}
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={isSelected ? 12 : 8}
                    fill={point.color}
                    stroke={isSelected ? '#1f2937' : '#ffffff'}
                    strokeWidth={isSelected ? 3 : 2}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => {
                      setSelectedDimension(point);
                      setShowTooltip(true);
                    }}
                    onMouseLeave={() => {
                      setSelectedDimension(null);
                      setShowTooltip(false);
                    }}
                    onClick={() => handleDimensionClick(point)}
                  />
                  
                  {/* Icon */}
                  <text
                    x={point.x}
                    y={point.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-sm"
                    style={{ pointerEvents: 'none' }}
                  >
                    {CATEGORY_ICONS[point.category as keyof typeof CATEGORY_ICONS]}
                  </text>
                  
                  {/* Label */}
                  <text
                    x={point.x}
                    y={point.y + 25}
                    textAnchor="middle"
                    className="text-xs font-semibold fill-gray-700"
                    style={{ pointerEvents: 'none' }}
                  >
                    {DIMENSION_LABELS[point.id as keyof typeof DIMENSION_LABELS]}
                  </text>
                  
                  {/* Score badge */}
                  <rect
                    x={point.x - 15}
                    y={point.y - 35}
                    width={30}
                    height={20}
                    rx={4}
                    fill={point.color}
                    opacity={0.9}
                  />
                  <text
                    x={point.x}
                    y={point.y - 25}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xs font-bold fill-white"
                    style={{ pointerEvents: 'none' }}
                  >
                    {point.score}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Legend */}
          <div className="flex justify-center gap-6 mt-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-purple-600" />
              <span className="text-gray-600">Skor Saat Ini</span>
            </div>
            {showComparison && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-gray-400" style={{ borderStyle: 'dashed' }} />
                <span className="text-gray-600">Skor Sebelumnya</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Timeline Tab */}
      {activeTab === 'timeline' && (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h4 className="font-bold text-gray-800 mb-4">Tren Pertumbuhan</h4>
          
          <div className="space-y-4">
            {dimensions.map((dim, index) => {
              const growth = dim.score - dim.previousScore;
              const growthPercent = ((growth / dim.previousScore) * 100).toFixed(1);
              const isPositive = growth >= 0;
              
              return (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ backgroundColor: dim.color + '20' }}>
                    {CATEGORY_ICONS[dim.category as keyof typeof CATEGORY_ICONS]}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-800">{dim.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          {dim.previousScore} → {dim.score}
                        </span>
                        <span
                          className={`text-sm font-semibold ${
                            isPositive ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {isPositive ? '+' : ''}{growthPercent}%
                        </span>
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${dim.score}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: dim.color }}
                      />
                      
                      {/* Target line */}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-gray-400 z-10"
                        style={{ left: `${dim.target}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recommendations Tab */}
      {activeTab === 'recommendations' && (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h4 className="font-bold text-gray-800 mb-4">Rekomendasi Pengembangan</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metrics.growthAreas.map((area, index) => {
              const dimension = dimensions.find(d => d.name === area);
              if (!dimension) return null;
              
              return (
                <div
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg border-l-4"
                  style={{ borderColor: dimension.color }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{CATEGORY_ICONS[dimension.category as keyof typeof CATEGORY_ICONS]}</span>
                    <span className="font-semibold text-gray-800">{area}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-blue-600">📚</span>
                      <span>Ambil kursus pengembangan</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-green-600">🎯</span>
                      <span>Set target harian</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-purple-600">👥</span>
                      <span>Temukan mentor</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && selectedDimension && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
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
                style={{ backgroundColor: selectedDimension.color + '20' }}
              >
                {CATEGORY_ICONS[selectedDimension.category as keyof typeof CATEGORY_ICONS]}
              </div>
              <div>
                <h4 className="font-bold text-gray-800">{selectedDimension.name}</h4>
                <div className="text-sm text-gray-600">
                  {DIMENSION_LABELS[selectedDimension.id as keyof typeof DIMENSION_LABELS]}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Skor Saat Ini:</span>
                <span className="text-lg font-bold" style={{ color: selectedDimension.color }}>
                  {selectedDimension.score}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Skor Sebelumnya:</span>
                <span className="text-lg font-bold text-gray-600">
                  {selectedDimension.previousScore}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Target:</span>
                <span className="text-lg font-bold text-green-600">
                  {selectedDimension.target}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pertumbuhan:</span>
                <span
                  className={`text-lg font-bold ${
                    selectedDimension.score - selectedDimension.previousScore >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {selectedDimension.score - selectedDimension.previousScore >= 0 ? '+' : ''}
                  {selectedDimension.score - selectedDimension.previousScore}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowTooltip(false)}
              className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Tutup
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase Modal */}
      <AnimatePresence>
        {showPhaseModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowPhaseModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Fase Pengembangan</h3>
                <button
                  onClick={() => setShowPhaseModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div
                className="p-6 rounded-lg mb-6"
                style={{ backgroundColor: getPhaseColor(currentPhase.phase) + '20' }}
              >
                <div className="flex items-center gap-4">
                  <span className="text-5xl">{currentPhase.icon}</span>
                  <div>
                    <div className="text-3xl font-bold" style={{ color: getPhaseColor(currentPhase.phase) }}>
                      {currentPhase.phase.charAt(0).toUpperCase() + currentPhase.phase.slice(1)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {currentPhase.description}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Persyaratan Fase Ini:</h4>
                <div className="space-y-2">
                  {currentPhase.requirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="text-green-600">✓</span>
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>💡 Tips:</strong> Fokus pada area pengembangan untuk mencapai fase berikutnya. Konsistensi adalah kunci untuk pertumbuhan holistik.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DevelopmentCycle;
