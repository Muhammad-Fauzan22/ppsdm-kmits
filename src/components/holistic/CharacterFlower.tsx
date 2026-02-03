/**
 * Character & Ethics Flower Component
 * 
 * Visualisasi karakter dan etika dalam bentuk flower diagram
 * Berdasarkan spesifikasi dari ASSESSMENT BROU/10 Diagram untuk Visualisasi Holist.txt
 * 
 * Features:
 * - 8 petals untuk setiap strength karakter
 * - Center core untuk ethical maturity level
 * - Petal size berdasarkan skor
 * - Color coding berdasarkan level
 * - Signature strengths identification
 * - Development areas display
 */

'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface CharacterStrength {
  name: string;
  score: number;
  target: number;
  category: 'integrity' | 'courage' | 'fairness' | 'responsibility' | 'humility' | 'compassion' | 'discipline' | 'ethical_reasoning';
  description: string;
  icon: string;
}

interface EthicalMaturity {
  level: string;
  description: string;
  color: string;
  icon: string;
}

interface CharacterFlowerProps {
  strengths: CharacterStrength[];
  ethicalMaturity: EthicalMaturity;
  signatureStrengths: string[];
  developmentAreas: string[];
  overallScore: number;
  width?: number;
  height?: number;
  showComparison?: boolean;
  className?: string;
}

// Color scheme for character visualization
const CHAR_COLORS = {
  integrity: '#3b82f6',      // Blue
  courage: '#ef4444',        // Red
  fairness: '#10b981',       // Green
  responsibility: '#f59e0b',  // Orange
  humility: '#8b5cf6',       // Purple
  compassion: '#ec4899',     // Pink
  discipline: '#06b6d4',      // Cyan
  ethical_reasoning: '#6366f1', // Indigo

  exemplary: '#10b981',     // Green
  strong: '#22c55e',         // Green
  good: '#f59e0b',          // Orange
  developing: '#f97316',     // Orange
  emerging: '#ef4444',       // Red
  needs_development: '#dc2626' // Dark Red
};

const CATEGORY_LABELS = {
  integrity: 'Integritas',
  courage: 'Keberanian',
  fairness: 'Keadilan',
  responsibility: 'Tanggung Jawab',
  humility: 'Kerendahan Hati',
  compassion: 'Kasih Sayang',
  discipline: 'Disiplin Diri',
  ethical_reasoning: 'Penalaran Etis'
};

export const CharacterFlower: React.FC<CharacterFlowerProps> = ({
  strengths,
  ethicalMaturity,
  signatureStrengths,
  developmentAreas,
  overallScore,
  width = 800,
  height = 600,
  showComparison = true,
  className = ''
}) => {
  const [selectedStrength, setSelectedStrength] = useState<CharacterStrength | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Calculate petal size based on score
  const getPetalSize = (score: number) => {
    return 30 + (score / 100) * 40;
  };

  // Get petal color based on score
  const getPetalColor = (score: number, category: string) => {
    if (score >= 80) return CHAR_COLORS.exemplary;
    if (score >= 70) return CHAR_COLORS.strong;
    if (score >= 60) return CHAR_COLORS.good;
    if (score >= 50) return CHAR_COLORS.developing;
    if (score >= 40) return CHAR_COLORS.emerging;
    return CHAR_COLORS.needs_development;
  };

  // Calculate petal positions around the flower
  const petalPositions = useMemo(() => {
    const centerX = width / 2;
    const centerY = height / 2;
    const positions: Record<string, { x: number; y: number; angle: number }> = {};

    strengths.forEach((strength, index) => {
      const angle = (index / strengths.length) * 2 * Math.PI - Math.PI / 2;
      const radius = 120;
      positions[strength.category] = {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        angle: angle
      };
    });

    return positions;
  }, [strengths, width, height]);

  // Get character level
  const getCharacterLevel = (score: number) => {
    if (score >= 84) return { level: 'Exemplary Character', color: CHAR_COLORS.exemplary, icon: '🌟' };
    if (score >= 76) return { level: 'Strong Character', color: CHAR_COLORS.strong, icon: '✨' };
    if (score >= 67) return { level: 'Good Character', color: CHAR_COLORS.good, icon: '🎯' };
    if (score >= 56) return { level: 'Developing Character', color: CHAR_COLORS.developing, icon: '🌱' };
    if (score >= 46) return { level: 'Basic Character', color: CHAR_COLORS.emerging, icon: '⚠️' };
    return { level: 'Needs Development', color: CHAR_COLORS.needs_development, icon: '🚨' };
  };

  const characterLevel = getCharacterLevel(overallScore);

  // Handle petal click
  const handlePetalClick = (strength: CharacterStrength) => {
    setSelectedStrength(strength);
    setActiveCategory(strength.category);
    setShowTooltip(true);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Karakter & Etika</h3>
          <p className="text-sm text-gray-600">Visualisasi strength karakter dan kematangan etis</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Character Level Badge */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg px-4 py-2">
            <span className="text-2xl">{characterLevel.icon}</span>
            <div>
              <div className="text-xs text-gray-600">Level Karakter</div>
              <div className="text-lg font-bold" style={{ color: characterLevel.color }}>
                {overallScore}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Character Summary */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-xs text-gray-600 mb-1">Signature Strengths</div>
          <div className="text-2xl font-bold text-green-600">
            {signatureStrengths.length}
          </div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="text-xs text-gray-600 mb-1">Development Areas</div>
          <div className="text-2xl font-bold text-yellow-600">
            {developmentAreas.length}
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-xs text-gray-600 mb-1">Ethical Maturity</div>
          <div className="text-lg font-bold text-purple-700 capitalize">
            {ethicalMaturity.level.replace(/_/g, ' ')}
          </div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-xs text-gray-600 mb-1">Strengths ≥ 70</div>
          <div className="text-2xl font-bold text-blue-600">
            {strengths.filter(s => s.score >= 70).length}/{strengths.length}
          </div>
        </div>
      </div>

      {/* Flower Visualization */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 mb-6">
        <h4 className="font-bold text-gray-800 mb-4">Flower Karakter</h4>

        <svg
          width={width}
          height={height}
          className="mx-auto"
          style={{ maxWidth: '100%', height: 'auto' }}
        >
          {/* Center Core - Ethical Maturity */}
          <g>
            {/* Outer glow */}
            <circle
              cx={width / 2}
              cy={height / 2}
              r={60}
              fill={`${ethicalMaturity.color}20`}
              opacity={0.5}
            />

            {/* Main core */}
            <circle
              cx={width / 2}
              cy={height / 2}
              r={50}
              fill={ethicalMaturity.color}
              stroke="#ffffff"
              strokeWidth="3"
            />

            {/* Icon */}
            <text
              x={width / 2}
              y={height / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-3xl"
              style={{ pointerEvents: 'none' }}
            >
              {ethicalMaturity.icon}
            </text>

            {/* Label */}
            <text
              x={width / 2}
              y={height / 2 + 20}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs font-bold fill-white"
              style={{ pointerEvents: 'none' }}
            >
              {ethicalMaturity.level.replace(/_/g, ' ').toUpperCase()}
            </text>
          </g>

          {/* Petals */}
          {strengths.map((strength, index) => {
            const pos = petalPositions[strength.category];
            if (!pos) return null;

            const petalSize = getPetalSize(strength.score);
            const petalColor = getPetalColor(strength.score, strength.category);
            const categoryColor = CHAR_COLORS[strength.category as keyof typeof CHAR_COLORS];
            const isSelected = selectedStrength?.category === strength.category;

            return (
              <g key={strength.category}>
                {/* Petal */}
                <motion.ellipse
                  cx={pos.x}
                  cy={pos.y}
                  rx={petalSize}
                  ry={petalSize * 0.6}
                  fill={petalColor}
                  stroke={isSelected ? '#1f2937' : '#ffffff'}
                  strokeWidth={isSelected ? 3 : 2}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => {
                    setSelectedStrength(strength);
                    setActiveCategory(strength.category);
                    setShowTooltip(true);
                  }}
                  onMouseLeave={() => {
                    setSelectedStrength(null);
                    setActiveCategory(null);
                    setShowTooltip(false);
                  }}
                  onClick={() => handlePetalClick(strength)}
                  transform={`rotate(${pos.angle * 180 / Math.PI}deg)`}
                />

                {/* Petal Icon */}
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xl"
                  style={{ pointerEvents: 'none' }}
                  transform={`rotate(${pos.angle * 180 / Math.PI}deg)`}
                >
                  {strength.icon}
                </text>

                {/* Petal Label */}
                <text
                  x={pos.x}
                  y={pos.y + petalSize * 0.6 + 15}
                  textAnchor="middle"
                  className="text-xs font-semibold fill-gray-700"
                  style={{ pointerEvents: 'none' }}
                >
                  {strength.name}
                </text>

                {/* Score Badge */}
                <rect
                  x={pos.x - 20}
                  y={pos.y - petalSize * 0.6 - 20}
                  width={40}
                  height={20}
                  rx={4}
                  fill={petalColor}
                  opacity={0.9}
                  transform={`rotate(${pos.angle * 180 / Math.PI}deg)`}
                />
                <text
                  x={pos.x}
                  y={pos.y - petalSize * 0.6 - 10}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs font-bold fill-white"
                  style={{ pointerEvents: 'none' }}
                  transform={`rotate(${pos.angle * 180 / Math.PI}deg)`}
                >
                  {strength.score}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-6 text-xs flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500" />
            <span className="text-gray-600">Exemplary (≥80)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-400" />
            <span className="text-gray-600">Strong (70-79)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500" />
            <span className="text-gray-600">Good (60-69)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-orange-500" />
            <span className="text-gray-600">Developing (50-59)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500" />
            <span className="text-gray-600">Emerging (40-49)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-600" />
            <span className="text-gray-600">Needs Development (&lt;40)</span>
          </div>
        </div>
      </div>

      {/* Signature Strengths */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-gray-200 mb-6">
        <h4 className="font-bold text-gray-800 mb-4">Signature Strengths</h4>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {signatureStrengths.map((strength, index) => {
            const strengthData = strengths.find(s => s.category === strength);
            if (!strengthData) return null;

            return (
              <div
                key={index}
                className="bg-white rounded-lg p-4 border-l-4"
                style={{ borderColor: CHAR_COLORS[strengthData.category as keyof typeof CHAR_COLORS] }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{strengthData.icon}</span>
                  <span className="font-semibold text-gray-800 text-sm">{strengthData.name}</span>
                </div>
                <div className="text-lg font-bold" style={{ color: getPetalColor(strengthData.score, strengthData.category) }}>
                  {strengthData.score}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Development Areas */}
      {developmentAreas.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-gray-200 mb-6">
          <h4 className="font-bold text-gray-800 mb-4">Area Pengembangan</h4>

          <div className="flex flex-wrap gap-2">
            {developmentAreas.map((area, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-white text-yellow-700 rounded-full text-sm border border-yellow-300"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Ethical Maturity Description */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-gray-200">
        <h4 className="font-bold text-gray-800 mb-4">Kematangan Etis</h4>

        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{ethicalMaturity.icon}</span>
            <div>
              <div className="text-xs text-gray-600">Level</div>
              <div className="text-lg font-bold text-gray-800 capitalize">
                {ethicalMaturity.level.replace(/_/g, ' ')}
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            {ethicalMaturity.description}
          </p>
        </div>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && selectedStrength && (
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
                style={{ backgroundColor: CHAR_COLORS[selectedStrength.category as keyof typeof CHAR_COLORS] }}
              >
                {selectedStrength.icon}
              </div>
              <div>
                <h4 className="font-bold text-gray-800">{selectedStrength.name}</h4>
                <div className="text-sm text-gray-600">
                  {CATEGORY_LABELS[selectedStrength.category as keyof typeof CATEGORY_LABELS]}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Skor Anda:</span>
                <span
                  className="text-lg font-bold"
                  style={{ color: getPetalColor(selectedStrength.score, selectedStrength.category) }}
                >
                  {selectedStrength.score}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Target:</span>
                <span className="text-lg font-bold text-green-600">
                  {selectedStrength.target}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Gap:</span>
                <span
                  className={`text-lg font-bold ${selectedStrength.target - selectedStrength.score > 0
                    ? 'text-yellow-600'
                    : 'text-green-600'
                    }`}
                >
                  {selectedStrength.target - selectedStrength.score > 0 ? '+' : ''}
                  {selectedStrength.target - selectedStrength.score}
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-600 mt-4">
              {selectedStrength.description}
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
    </div>
  );
};

export default CharacterFlower;
