/**
 * Spiritual Development Tree Component
 * 
 * Visualisasi pengembangan spiritual dalam bentuk tree diagram
 * Berdasarkan spesifikasi dari ASSESSMENT BROU/10 Diagram untuk Visualisasi Holist.txt
 * 
 * Features:
 * - Tree structure untuk 3 komponen spiritual
 * - Branches untuk sub-komponen
 * - Leaves untuk praktik dan aktivitas
 * - Ikigai framework integration
 * - Spiritual maturity level
 * - Life satisfaction index
 */

'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface SpiritualComponent {
  name: string;
  score: number;
  target: number;
  category: 'purpose' | 'gratitude' | 'altruism';
  description: string;
  practices: string[];
  icon: string;
}

interface IkigaiProfile {
  whatYouLove: number;
  whatYouAreGoodAt: number;
  whatTheWorldNeeds: number;
  whatYouCanBePaidFor: number;
}

interface SpiritualMaturity {
  level: string;
  description: string;
  color: string;
  icon: string;
}

interface SpiritualTreeProps {
  components: SpiritualComponent[];
  ikigaiProfile: IkigaiProfile;
  spiritualMaturity: SpiritualMaturity;
  lifeSatisfactionIndex: number;
  purposeClarity: number;
  width?: number;
  height?: number;
  showIkigai?: boolean;
  className?: string;
}

// Color scheme for spiritual visualization
const SPIRITUAL_COLORS = {
  transcendent: '#8b5cf6',    // Purple
  integrated: '#6366f1',      // Indigo
  seeking: '#f59e0b',         // Orange
  questioning: '#f97316',      // Orange
  unexplored: '#ef4444',      // Red

  purpose: '#8b5cf6',         // Purple
  gratitude: '#10b981',       // Green
  altruism: '#ec4899',        // Pink

  ikigai_love: '#ec4899',     // Pink
  ikigai_good: '#8b5cf6',     // Purple
  ikigai_needs: '#10b981',    // Green
  ikigai_paid: '#f59e0b'      // Orange
};

const CATEGORY_LABELS = {
  purpose: 'Tujuan & Makna',
  gratitude: 'Rasa Syukur',
  altruism: 'Altruisme & Kontribusi'
};

export const SpiritualTree: React.FC<SpiritualTreeProps> = ({
  components,
  ikigaiProfile,
  spiritualMaturity,
  lifeSatisfactionIndex,
  purposeClarity,
  width = 800,
  height = 600,
  showIkigai = true,
  className = ''
}) => {
  const [selectedComponent, setSelectedComponent] = useState<SpiritualComponent | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showIkigaiModal, setShowIkigaiModal] = useState(false);

  // Calculate branch size based on score
  const getBranchSize = (score: number) => {
    return 20 + (score / 100) * 30;
  };

  // Get branch color based on score
  const getBranchColor = (score: number, category: string) => {
    if (score >= 80) return SPIRITUAL_COLORS.transcendent;
    if (score >= 65) return SPIRITUAL_COLORS.integrated;
    if (score >= 50) return SPIRITUAL_COLORS.seeking;
    if (score >= 35) return SPIRITUAL_COLORS.questioning;
    return SPIRITUAL_COLORS.unexplored;
  };

  // Calculate tree structure
  const treeStructure = useMemo(() => {
    const centerX = width / 2;
    const trunkHeight = 100;
    const branchY = height - trunkHeight - 50;

    return {
      trunk: {
        x: centerX,
        y: height - 50,
        width: 40,
        height: trunkHeight
      },
      branches: components.map((component, index) => {
        const angle = (index / components.length) * Math.PI - Math.PI / 2;
        const branchLength = 120;
        const startX = centerX;
        const startY = height - trunkHeight - 50;
        const endX = centerX + Math.cos(angle) * branchLength;
        const endY = startY - Math.sin(angle) * branchLength;

        return {
          ...component,
          startX,
          startY,
          endX,
          endY,
          angle,
          branchSize: getBranchSize(component.score),
          branchColor: getBranchColor(component.score, component.category)
        };
      })
    };
  }, [components, width, height]);

  // Get spiritual level
  const getSpiritualLevel = (score: number) => {
    if (score >= 84) return { level: 'Transcendent', color: SPIRITUAL_COLORS.transcendent, icon: '🌟' };
    if (score >= 75) return { level: 'Integrated', color: SPIRITUAL_COLORS.integrated, icon: '✨' };
    if (score >= 66) return { level: 'Good', color: SPIRITUAL_COLORS.seeking, icon: '🎯' };
    if (score >= 54) return { level: 'Seeking', color: SPIRITUAL_COLORS.seeking, icon: '🌱' };
    if (score >= 44) return { level: 'Questioning', color: SPIRITUAL_COLORS.questioning, icon: '❓' };
    return { level: 'Unexplored', color: SPIRITUAL_COLORS.unexplored, icon: '🚨' };
  };

  const spiritualLevel = getSpiritualLevel(lifeSatisfactionIndex);

  // Handle branch click
  const handleBranchClick = (component: SpiritualComponent) => {
    setSelectedComponent(component);
    setActiveCategory(component.category);
    setShowTooltip(true);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Pengembangan Spiritual</h3>
          <p className="text-sm text-gray-600">Visualisasi tujuan hidup, rasa syukur, dan kontribusi</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Spiritual Level Badge */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-green-50 rounded-lg px-4 py-2">
            <span className="text-2xl">{spiritualLevel.icon}</span>
            <div>
              <div className="text-xs text-gray-600">Level Spiritual</div>
              <div className="text-lg font-bold" style={{ color: spiritualLevel.color }}>
                {lifeSatisfactionIndex}
              </div>
            </div>
          </div>

          {/* Ikigai Button */}
          {showIkigai && (
            <button
              onClick={() => setShowIkigaiModal(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
            >
              🎯 Lihat Ikigai
            </button>
          )}
        </div>
      </div>

      {/* Spiritual Summary */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-xs text-gray-600 mb-1">Indeks Kepuasan Hidup</div>
          <div className="text-2xl font-bold text-purple-600">
            {lifeSatisfactionIndex}
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-xs text-gray-600 mb-1">Klaritas Tujuan</div>
          <div className="text-2xl font-bold text-green-600">
            {purposeClarity}
          </div>
        </div>
        <div className="bg-pink-50 rounded-lg p-4">
          <div className="text-xs text-gray-600 mb-1">Praktik Spiritual</div>
          <div className="text-2xl font-bold text-pink-600">
            {components.reduce((sum, c) => sum + c.practices.length, 0)}
          </div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-xs text-gray-600 mb-1">Komponen Optimal</div>
          <div className="text-2xl font-bold text-blue-600">
            {components.filter(c => c.score >= 70).length}/{components.length}
          </div>
        </div>
      </div>

      {/* Tree Visualization */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 mb-6">
        <h4 className="font-bold text-gray-800 mb-4">Pohon Spiritual</h4>

        <svg
          width={width}
          height={height}
          className="mx-auto"
          style={{ maxWidth: '100%', height: 'auto' }}
        >
          {/* Trunk */}
          <rect
            x={treeStructure.trunk.x - treeStructure.trunk.width / 2}
            y={treeStructure.trunk.y - treeStructure.trunk.height}
            width={treeStructure.trunk.width}
            height={treeStructure.trunk.height}
            fill="#8B4513"
            rx={5}
          />

          {/* Trunk Texture */}
          <rect
            x={treeStructure.trunk.x - treeStructure.trunk.width / 2 + 5}
            y={treeStructure.trunk.y - treeStructure.trunk.height + 10}
            width={treeStructure.trunk.width - 10}
            height={treeStructure.trunk.height - 20}
            fill="#A0522D"
            rx={3}
          />

          {/* Branches */}
          {treeStructure.branches.map((branch, index) => {
            const isSelected = selectedComponent?.category === branch.category;

            return (
              <g key={branch.category}>
                {/* Branch Line */}
                <motion.line
                  x1={branch.startX}
                  y1={branch.startY}
                  x2={branch.endX}
                  y2={branch.endY}
                  stroke={branch.branchColor}
                  strokeWidth={branch.branchSize}
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => {
                    setSelectedComponent(branch);
                    setActiveCategory(branch.category);
                    setShowTooltip(true);
                  }}
                  onMouseLeave={() => {
                    setSelectedComponent(null);
                    setActiveCategory(null);
                    setShowTooltip(false);
                  }}
                  onClick={() => handleBranchClick(branch)}
                />

                {/* Branch End Circle */}
                <circle
                  cx={branch.endX}
                  cy={branch.endY}
                  r={branch.branchSize}
                  fill={branch.branchColor}
                  stroke={isSelected ? '#1f2937' : '#ffffff'}
                  strokeWidth={isSelected ? 3 : 2}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => {
                    setSelectedComponent(branch);
                    setActiveCategory(branch.category);
                    setShowTooltip(true);
                  }}
                  onMouseLeave={() => {
                    setSelectedComponent(null);
                    setActiveCategory(null);
                    setShowTooltip(false);
                  }}
                  onClick={() => handleBranchClick(branch)}
                />

                {/* Branch Icon */}
                <text
                  x={branch.endX}
                  y={branch.endY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xl"
                  style={{ pointerEvents: 'none' }}
                >
                  {branch.icon}
                </text>

                {/* Branch Label */}
                <text
                  x={branch.endX}
                  y={branch.endY + branch.branchSize + 20}
                  textAnchor="middle"
                  className="text-xs font-semibold fill-gray-700"
                  style={{ pointerEvents: 'none' }}
                >
                  {branch.name}
                </text>

                {/* Score Badge */}
                <rect
                  x={branch.endX - 20}
                  y={branch.endY - branch.branchSize - 25}
                  width={40}
                  height={20}
                  rx={4}
                  fill={branch.branchColor}
                  opacity={0.9}
                />
                <text
                  x={branch.endX}
                  y={branch.endY - branch.branchSize - 15}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs font-bold fill-white"
                  style={{ pointerEvents: 'none' }}
                >
                  {branch.score}
                </text>

                {/* Leaves (Practices) */}
                {branch.practices.slice(0, 3).map((practice, leafIndex) => {
                  const leafAngle = (leafIndex / 3) * Math.PI - Math.PI / 2;
                  const leafX = branch.endX + Math.cos(leafAngle) * (branch.branchSize + 20);
                  const leafY = branch.endY + Math.sin(leafAngle) * (branch.branchSize + 20);

                  return (
                    <g key={leafIndex}>
                      <ellipse
                        cx={leafX}
                        cy={leafY}
                        rx={8}
                        ry={5}
                        fill="#10b981"
                        opacity={0.8}
                      />
                      <text
                        x={leafX}
                        y={leafY}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-xs"
                        style={{ pointerEvents: 'none' }}
                      >
                        🍃
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-6 text-xs flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-purple-500" />
            <span className="text-gray-600">Transcendent (≥80)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-indigo-500" />
            <span className="text-gray-600">Integrated (65-79)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-orange-500" />
            <span className="text-gray-600">Seeking (50-64)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-orange-600" />
            <span className="text-gray-600">Questioning (35-49)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500" />
            <span className="text-gray-600">Unexplored (&lt;35)</span>
          </div>
        </div>
      </div>

      {/* Spiritual Practices */}
      <div className="bg-gradient-to-r from-green-50 to-purple-50 rounded-xl p-6 border border-gray-200 mb-6">
        <h4 className="font-bold text-gray-800 mb-4">Praktik Spiritual</h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {components.map((component, index) => {
            const categoryColor = SPIRITUAL_COLORS[component.category as keyof typeof SPIRITUAL_COLORS];

            return (
              <div
                key={index}
                className="bg-white rounded-lg p-4 border-l-4"
                style={{ borderColor: categoryColor }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{component.icon}</span>
                  <span className="font-semibold text-gray-800">{component.name}</span>
                </div>
                <div className="space-y-2">
                  {component.practices.slice(0, 3).map((practice, pIndex) => (
                    <div key={pIndex} className="flex items-center gap-2 text-sm text-gray-600">
                      <span>🍃</span>
                      <span>{practice}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Spiritual Maturity */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-gray-200">
        <h4 className="font-bold text-gray-800 mb-4">Kematangan Spiritual</h4>

        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{spiritualMaturity.icon}</span>
            <div>
              <div className="text-xs text-gray-600">Level</div>
              <div className="text-lg font-bold text-gray-800 capitalize">
                {spiritualMaturity.level.replace(/_/g, ' ')}
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            {spiritualMaturity.description}
          </p>
        </div>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && selectedComponent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bg-white rounded-xl shadow-2xl p-6 z-50 border border-gray-200"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              minWidth: '320px',
              maxWidth: '90vw'
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                style={{ backgroundColor: SPIRITUAL_COLORS[selectedComponent.category as keyof typeof SPIRITUAL_COLORS] }}
              >
                {selectedComponent.icon}
              </div>
              <div>
                <h4 className="font-bold text-gray-800">{selectedComponent.name}</h4>
                <div className="text-sm text-gray-600">
                  {CATEGORY_LABELS[selectedComponent.category as keyof typeof CATEGORY_LABELS]}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Skor Anda:</span>
                <span
                  className="text-lg font-bold"
                  style={{ color: getBranchColor(selectedComponent.score, selectedComponent.category) }}
                >
                  {selectedComponent.score}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Target:</span>
                <span className="text-lg font-bold text-green-600">
                  {selectedComponent.target}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Gap:</span>
                <span
                  className={`text-lg font-bold ${selectedComponent.target - selectedComponent.score > 0
                    ? 'text-yellow-600'
                    : 'text-green-600'
                    }`}
                >
                  {selectedComponent.target - selectedComponent.score > 0 ? '+' : ''}
                  {selectedComponent.target - selectedComponent.score}
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-600 mt-4">
              {selectedComponent.description}
            </p>

            <div className="mt-4">
              <div className="text-xs text-gray-600 mb-2">Praktik Spiritual:</div>
              <div className="flex flex-wrap gap-2">
                {selectedComponent.practices.map((practice, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs"
                  >
                    {practice}
                  </span>
                ))}
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

      {/* Ikigai Modal */}
      <AnimatePresence>
        {showIkigaiModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowIkigaiModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">🎯 Framework Ikigai</h3>
                <button
                  onClick={() => setShowIkigaiModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-purple-800">
                  <strong>Ikigai</strong> adalah konsep Jepang yang berarti &quot;alasan untuk hidup&quot;. Framework ini membantu Anda menemukan persimpangan antara apa yang Anda cintai, apa yang Anda kuasai, apa yang dibutuhkan dunia, dan apa yang bisa memberi Anda penghasilan.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-pink-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">💖</span>
                    <span className="font-semibold text-gray-800 text-sm">Apa yang Anda Cintai</span>
                  </div>
                  <div className="text-2xl font-bold text-pink-600">
                    {ikigaiProfile.whatYouLove}
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">⭐</span>
                    <span className="font-semibold text-gray-800 text-sm">Apa yang Anda Kuasai</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    {ikigaiProfile.whatYouAreGoodAt}
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">🌍</span>
                    <span className="font-semibold text-gray-800 text-sm">Apa yang Dibutuhkan Dunia</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {ikigaiProfile.whatTheWorldNeeds}
                  </div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">💰</span>
                    <span className="font-semibold text-gray-800 text-sm">Apa yang Bisa Dibayar</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-600">
                    {ikigaiProfile.whatYouCanBePaidFor}
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>💡 Tips:</strong> Tujuan hidup yang ideal berada di persimpangan keempat area ini. Fokus pada area yang memiliki skor tertinggi untuk menemukan ikigai Anda.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SpiritualTree;
