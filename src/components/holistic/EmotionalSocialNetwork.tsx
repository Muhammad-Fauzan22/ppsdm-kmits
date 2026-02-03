/**
 * Emotional & Social Intelligence Network Component
 * 
 * Visualisasi kecerdasan emosional dan sosial dalam bentuk network graph
 * Berdasarkan spesifikasi dari ASSESSMENT BROU/10 Diagram untuk Visualisasi Holist.txt
 * 
 * Features:
 * - Force-directed graph untuk kompetensi EI
 * - 4 komponen Goleman (Self-Awareness, Social Awareness, Self-Management, Relationship Management)
 * - Node size berdasarkan skor mastery
 * - Edge strength berdasarkan hubungan antar kompetensi
 * - Cluster grouping berdasarkan kategori
 * - Interactive hover dan click untuk detail
 * - Comparison dengan faculty average
 */

'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface EICompetency {
  id: string;
  name: string;
  category: 'self_awareness' | 'social_awareness' | 'self_management' | 'relationship_management';
  score: number;
  facultyAverage: number;
  description: string;
  icon: string;
}

interface EIConnection {
  source: string;
  target: string;
  strength: number;
  type: 'strong' | 'moderate' | 'weak';
}

interface EIProfile {
  type: string;
  description: string;
  strengths: string[];
  developmentAreas: string[];
}

interface EmotionalSocialNetworkProps {
  competencies: EICompetency[];
  connections: EIConnection[];
  profile: EIProfile;
  overallScore: number;
  width?: number;
  height?: number;
  showComparison?: boolean;
  className?: string;
}

// Color scheme for EI visualization
const EI_COLORS = {
  self_awareness: '#8b5cf6',    // Purple
  social_awareness: '#06b6d4',   // Cyan
  self_management: '#f59e0b',    // Orange
  relationship_management: '#10b981', // Green
  excellent: '#10b981',
  good: '#22c55e',
  moderate: '#f59e0b',
  needs_work: '#ef4444',
  critical: '#dc2626'
};

const CATEGORY_LABELS = {
  self_awareness: 'Kesadaran Diri',
  social_awareness: 'Kesadaran Sosial',
  self_management: 'Manajemen Diri',
  relationship_management: 'Manajemen Hubungan'
};

export const EmotionalSocialNetwork: React.FC<EmotionalSocialNetworkProps> = ({
  competencies,
  connections,
  profile,
  overallScore,
  width = 800,
  height = 600,
  showComparison = true,
  className = ''
}) => {
  const [selectedCompetency, setSelectedCompetency] = useState<EICompetency | null>(null);
  const [hoveredCompetency, setHoveredCompetency] = useState<EICompetency | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [simulationMode, setSimulationMode] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  // Calculate node positions using force-directed layout simulation
  const nodePositions = useMemo(() => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;

    // Group nodes by category
    const categories = ['self_awareness', 'social_awareness', 'self_management', 'relationship_management'];
    const positions: Record<string, { x: number; y: number }> = {};

    categories.forEach((category, catIndex) => {
      const categoryCompetencies = competencies.filter(c => c.category === category);
      const angle = (catIndex / categories.length) * 2 * Math.PI - Math.PI / 2;
      const categoryCenterX = centerX + Math.cos(angle) * radius * 0.6;
      const categoryCenterY = centerY + Math.sin(angle) * radius * 0.6;

      categoryCompetencies.forEach((comp, compIndex) => {
        const subAngle = (compIndex / categoryCompetencies.length) * Math.PI - Math.PI / 2;
        const subRadius = radius * 0.3;
        positions[comp.id] = {
          x: categoryCenterX + Math.cos(subAngle) * subRadius,
          y: categoryCenterY + Math.sin(subAngle) * subRadius
        };
      });
    });

    return positions;
  }, [competencies, width, height]);

  // Get node color based on score
  const getNodeColor = (score: number) => {
    if (score >= 80) return EI_COLORS.excellent;
    if (score >= 65) return EI_COLORS.good;
    if (score >= 50) return EI_COLORS.moderate;
    if (score >= 35) return EI_COLORS.needs_work;
    return EI_COLORS.critical;
  };

  // Get node size based on score
  const getNodeSize = (score: number) => {
    return 20 + (score / 100) * 30;
  };

  // Get edge color based on strength
  const getEdgeColor = (strength: number) => {
    if (strength >= 0.8) return '#10b981';
    if (strength >= 0.5) return '#f59e0b';
    return '#94a3b8';
  };

  // Get edge width based on strength
  const getEdgeWidth = (strength: number) => {
    return 1 + strength * 3;
  };

  // Calculate EI level
  const getEILevel = (score: number) => {
    if (score >= 84) return { level: 'Exceptional EI', color: EI_COLORS.excellent, icon: '🌟' };
    if (score >= 75) return { level: 'Advanced EI', color: EI_COLORS.good, icon: '✨' };
    if (score >= 66) return { level: 'Proficient EI', color: EI_COLORS.moderate, icon: '🎯' };
    if (score >= 55) return { level: 'Average EI', color: EI_COLORS.moderate, icon: '📊' };
    if (score >= 45) return { level: 'Developing EI', color: EI_COLORS.needs_work, icon: '🌱' };
    if (score >= 36) return { level: 'Limited EI', color: EI_COLORS.needs_work, icon: '⚠️' };
    return { level: 'Needs Development', color: EI_COLORS.critical, icon: '🚨' };
  };

  const eiLevel = getEILevel(overallScore);

  // Get profile icon
  const getProfileIcon = (type: string) => {
    const icons: Record<string, string> = {
      'balanced_high_ei': '⚖️',
      'balanced_moderate_ei': '🎭',
      'balanced_developing_ei': '🔄',
      'introspective_focus': '🔍',
      'social_focus': '👥',
      'self_regulation_focus': '🎯',
      'relationship_focus': '🤝',
      'mixed_profile': '🎪'
    };
    return icons[type] || '❓';
  };

  // Handle node click
  const handleNodeClick = (competency: EICompetency) => {
    setSelectedCompetency(competency);
    setActiveCategory(competency.category);
    setShowTooltip(true);
  };

  // Handle simulation mode toggle
  const toggleSimulation = () => {
    setSimulationMode(!simulationMode);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Kecerdasan Emosional & Sosial</h3>
          <p className="text-sm text-gray-600">Network kompetensi EI berdasarkan model Goleman</p>
        </div>
        <div className="flex items-center gap-4">
          {/* EI Level Badge */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg px-4 py-2">
            <span className="text-2xl">{eiLevel.icon}</span>
            <div>
              <div className="text-xs text-gray-600">EI Level</div>
              <div className="text-lg font-bold" style={{ color: eiLevel.color }}>
                {overallScore}
              </div>
            </div>
          </div>
          
          {/* Simulation Toggle */}
          <button
            onClick={toggleSimulation}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              simulationMode
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {simulationMode ? '🎮 Simulasi Aktif' : '🎮 Mode Simulasi'}
          </button>
        </div>
      </div>

      {/* EI Profile Summary */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-xs text-gray-600 mb-1">Profil EI</div>
          <div className="flex items-center gap-2">
            <span className="text-xl">{getProfileIcon(profile.type)}</span>
            <div className="text-sm font-semibold text-purple-700 truncate">
              {profile.type.replace(/_/g, ' ')}
            </div>
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-xs text-gray-600 mb-1">Kompetensi Kuat</div>
          <div className="text-lg font-bold text-green-600">
            {profile.strengths.length}
          </div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="text-xs text-gray-600 mb-1">Area Pengembangan</div>
          <div className="text-lg font-bold text-yellow-600">
            {profile.developmentAreas.length}
          </div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-xs text-gray-600 mb-1">Skor Rata-rata</div>
          <div className="text-lg font-bold text-blue-600">
            {competencies.reduce((sum, c) => sum + c.score, 0) / competencies.length}
          </div>
        </div>
      </div>

      {/* Network Visualization */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 mb-6">
        <h4 className="font-bold text-gray-800 mb-4">Network Kompetensi EI</h4>
        
        <svg
          ref={svgRef}
          width={width}
          height={height}
          className="mx-auto"
          style={{ maxWidth: '100%', height: 'auto' }}
        >
          {/* Background circles for categories */}
          {['self_awareness', 'social_awareness', 'self_management', 'relationship_management'].map((category, index) => {
            const centerX = width / 2;
            const centerY = height / 2;
            const radius = Math.min(width, height) * 0.35;
            const angle = (index / 4) * 2 * Math.PI - Math.PI / 2;
            const categoryCenterX = centerX + Math.cos(angle) * radius * 0.6;
            const categoryCenterY = centerY + Math.sin(angle) * radius * 0.6;

            return (
              <g key={category}>
                <circle
                  cx={categoryCenterX}
                  cy={categoryCenterY}
                  r={radius * 0.4}
                  fill={`${EI_COLORS[category as keyof typeof EI_COLORS]}15`}
                  stroke={EI_COLORS[category as keyof typeof EI_COLORS]}
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
                <text
                  x={categoryCenterX}
                  y={categoryCenterY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs font-semibold fill-gray-700"
                >
                  {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
                </text>
              </g>
            );
          })}

          {/* Edges */}
          {connections.map((conn, index) => {
            const sourcePos = nodePositions[conn.source];
            const targetPos = nodePositions[conn.target];
            if (!sourcePos || !targetPos) return null;

            return (
              <line
                key={index}
                x1={sourcePos.x}
                y1={sourcePos.y}
                x2={targetPos.x}
                y2={targetPos.y}
                stroke={getEdgeColor(conn.strength)}
                strokeWidth={getEdgeWidth(conn.strength)}
                opacity={0.6}
                strokeLinecap="round"
              />
            );
          })}

          {/* Nodes */}
          {competencies.map((comp, index) => {
            const pos = nodePositions[comp.id];
            if (!pos) return null;

            const isSelected = selectedCompetency?.id === comp.id;
            const isHovered = hoveredCompetency?.id === comp.id;
            const nodeColor = getNodeColor(comp.score);
            const nodeSize = getNodeSize(comp.score);

            return (
              <g key={comp.id}>
                {/* Node circle */}
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r={nodeSize}
                  fill={nodeColor}
                  stroke={isSelected ? '#1f2937' : '#ffffff'}
                  strokeWidth={isSelected ? 3 : 2}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredCompetency(comp)}
                  onMouseLeave={() => setHoveredCompetency(null)}
                  onClick={() => handleNodeClick(comp)}
                />
                
                {/* Node icon */}
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-lg"
                  style={{ pointerEvents: 'none' }}
                >
                  {comp.icon}
                </text>
                
                {/* Node label */}
                <text
                  x={pos.x}
                  y={pos.y + nodeSize + 15}
                  textAnchor="middle"
                  className="text-xs font-semibold fill-gray-700"
                  style={{ pointerEvents: 'none' }}
                >
                  {comp.name}
                </text>
                
                {/* Score badge */}
                <rect
                  x={pos.x - 20}
                  y={pos.y - nodeSize - 25}
                  width={40}
                  height={20}
                  rx={4}
                  fill={nodeColor}
                  opacity={0.9}
                />
                <text
                  x={pos.x}
                  y={pos.y - nodeSize - 15}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs font-bold fill-white"
                  style={{ pointerEvents: 'none' }}
                >
                  {comp.score}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-purple-500" />
            <span className="text-gray-600">Kesadaran Diri</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-cyan-500" />
            <span className="text-gray-600">Kesadaran Sosial</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-orange-500" />
            <span className="text-gray-600">Manajemen Diri</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500" />
            <span className="text-gray-600">Manajemen Hubungan</span>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-gray-200 mb-6">
        <h4 className="font-bold text-gray-800 mb-4">Profil EI Anda</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Type */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{getProfileIcon(profile.type)}</span>
              <div>
                <div className="text-xs text-gray-600">Tipe Profil</div>
                <div className="text-lg font-bold text-gray-800 capitalize">
                  {profile.type.replace(/_/g, ' ')}
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600">{profile.description}</p>
          </div>

          {/* Strengths */}
          <div className="bg-white rounded-lg p-4">
            <div className="text-xs text-gray-600 mb-2">Kompetensi Kuat</div>
            <ul className="space-y-1">
              {profile.strengths.map((strength, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Development Areas */}
          <div className="bg-white rounded-lg p-4 md:col-span-2">
            <div className="text-xs text-gray-600 mb-2">Area Pengembangan</div>
            <div className="flex flex-wrap gap-2">
              {profile.developmentAreas.map((area, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && selectedCompetency && (
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
                style={{ backgroundColor: `${EI_COLORS[selectedCompetency.category]}20` }}
              >
                {selectedCompetency.icon}
              </div>
              <div>
                <h4 className="font-bold text-gray-800">{selectedCompetency.name}</h4>
                <div className="text-sm text-gray-600">
                  {CATEGORY_LABELS[selectedCompetency.category]}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Skor Anda:</span>
                <span
                  className="text-lg font-bold"
                  style={{ color: getNodeColor(selectedCompetency.score) }}
                >
                  {selectedCompetency.score}
                </span>
              </div>

              {showComparison && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Rata-rata Fakultas:</span>
                  <span className="text-lg font-bold text-gray-700">
                    {selectedCompetency.facultyAverage}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Selisih:</span>
                <span
                  className={`text-lg font-bold ${
                    selectedCompetency.score - selectedCompetency.facultyAverage > 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {selectedCompetency.score - selectedCompetency.facultyAverage > 0 ? '+' : ''}
                  {(selectedCompetency.score - selectedCompetency.facultyAverage).toFixed(1)}
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-600 mt-4">
              {selectedCompetency.description}
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

export default EmotionalSocialNetwork;
