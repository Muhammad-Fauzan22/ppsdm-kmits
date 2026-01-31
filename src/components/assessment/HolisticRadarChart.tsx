/**
 * Diagram 1: Holistic Development Radar Chart
 * 9-Axis Radar Chart dengan Progressive Layers
 * 
 * Features:
 * - 9 dimension axes dengan scale 0-100
 * - Multiple data layers (Current, Previous, Target, Faculty Average)
 * - Interactive hover effects
 * - Quadrant analysis (Cognitive, Affective, Social)
 * - Central PDI (Personal Development Index)
 */

'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Info, Target, TrendingUp, Users } from 'lucide-react';

interface DimensionData {
  dimension: string;
  shortName: string;
  current: number;
  previous: number;
  target: number;
  facultyAverage: number;
  color: string;
}

interface HolisticRadarChartProps {
  data: DimensionData[];
  pdi: number;
  balanceIndex: number;
  onDimensionClick?: (dimension: string) => void;
  showComparison?: boolean;
  className?: string;
}

const DIMENSION_CONFIG: Record<string, { fullName: string; color: string; quadrant: string }> = {
  'Kognitif': { fullName: 'Kognitif & Intelektual', color: '#3498db', quadrant: 'Cognitive' },
  'Manajemen Diri': { fullName: 'Manajemen Diri & Produktivitas', color: '#2ecc71', quadrant: 'Cognitive' },
  'Finansial': { fullName: 'Kecerdasan Finansial', color: '#e74c3c', quadrant: 'Cognitive' },
  'Kesehatan Fisik': { fullName: 'Kesehatan Fisik & Vitalitas', color: '#1abc9c', quadrant: 'Affective' },
  'Kecerdasan Emosional': { fullName: 'Kecerdasan Emosional & Sosial', color: '#9b59b6', quadrant: 'Affective' },
  'Kesehatan Mental': { fullName: 'Kesehatan Mental & Psikologis', color: '#34495e', quadrant: 'Affective' },
  'Karakter': { fullName: 'Karakter & Etika', color: '#f1c40f', quadrant: 'Social' },
  'Spiritual': { fullName: 'Pengembangan Spiritual', color: '#e67e22', quadrant: 'Social' },
  'Lingkungan': { fullName: 'Manajemen Lingkungan', color: '#27ae60', quadrant: 'Social' },
};

export const HolisticRadarChart: React.FC<HolisticRadarChartProps> = ({
  data,
  pdi,
  balanceIndex,
  onDimensionClick,
  showComparison = true,
  className = '',
}) => {
  const [activeLayer, setActiveLayer] = useState<'current' | 'all'>('all');
  const [hoveredDimension, setHoveredDimension] = useState<string | null>(null);

  const chartData = useMemo(() => {
    return data.map(d => ({
      dimension: d.shortName,
      fullDimension: d.dimension,
      'Skor Saat Ini': d.current,
      'Periode Lalu': d.previous,
      'Target': d.target,
      'Rata-rata Fakultas': d.facultyAverage,
      color: d.color,
    }));
  }, [data]);

  const quadrantScores = useMemo(() => {
    const cognitive = data.filter(d => DIMENSION_CONFIG[d.shortName]?.quadrant === 'Cognitive');
    const affective = data.filter(d => DIMENSION_CONFIG[d.shortName]?.quadrant === 'Affective');
    const social = data.filter(d => DIMENSION_CONFIG[d.shortName]?.quadrant === 'Social');

    return {
      cognitive: cognitive.reduce((sum, d) => sum + d.current, 0) / cognitive.length,
      affective: affective.reduce((sum, d) => sum + d.current, 0) / affective.length,
      social: social.reduce((sum, d) => sum + d.current, 0) / social.length,
    };
  }, [data]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dimensionData = data.find(d => d.shortName === label);
      if (!dimensionData) return null;

      return (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 shadow-xl">
          <p className="font-bold text-white mb-2">{dimensionData.dimension}</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#135bec' }} />
              <span className="text-sm text-slate-300">Skor Saat Ini: </span>
              <span className="text-sm font-bold text-white">{dimensionData.current}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#94a3b8' }} />
              <span className="text-sm text-slate-300">Periode Lalu: </span>
              <span className="text-sm font-bold text-slate-400">{dimensionData.previous}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FFD700' }} />
              <span className="text-sm text-slate-300">Target: </span>
              <span className="text-sm font-bold text-[#FFD700]">{dimensionData.target}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Target className="w-6 h-6 text-[#135bec]" />
            Holistic Development Radar
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Visualisasi 9 dimensi perkembangan holistik
          </p>
        </div>
        
        {/* PDI Display */}
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-xs text-slate-400 mb-1">Personal Development Index</div>
            <div className="relative">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="#1e293b"
                  strokeWidth="4"
                  fill="none"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="url(#pdiGradient)"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${(pdi / 100) * 176} 176`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="pdiGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#135bec" />
                    <stop offset="100%" stopColor="#FFD700" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-white">{Math.round(pdi)}</span>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-xs text-slate-400 mb-1">Balance Index</div>
            <div className="text-2xl font-bold text-[#2ecc71]">
              {(balanceIndex * 100).toFixed(0)}%
            </div>
          </div>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Radar Chart */}
        <div className="lg:col-span-3 h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis
                dataKey="dimension"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                className="cursor-pointer"
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: '#64748b', fontSize: 10 }}
                tickCount={6}
              />
              
              {activeLayer === 'all' && (
                <>
                  {/* Faculty Average - Dotted */}
                  <Radar
                    name="Rata-rata Fakultas"
                    dataKey="Rata-rata Fakultas"
                    stroke="#64748b"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    fill="transparent"
                  />
                  
                  {/* Target - Shaded */}
                  <Radar
                    name="Target"
                    dataKey="Target"
                    stroke="#FFD700"
                    strokeWidth={2}
                    fill="#FFD700"
                    fillOpacity={0.1}
                  />
                  
                  {/* Previous - Dashed */}
                  <Radar
                    name="Periode Lalu"
                    dataKey="Periode Lalu"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    strokeDasharray="8 4"
                    fill="transparent"
                  />
                </>
              )}
              
              {/* Current - Solid */}
              <Radar
                name="Skor Saat Ini"
                dataKey="Skor Saat Ini"
                stroke="#135bec"
                strokeWidth={3}
                fill="#135bec"
                fillOpacity={0.25}
              />
              
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Side Panel - Quadrant Analysis */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-white mb-3">Analisis Kuadran</h4>
          
          {/* Cognitive Quadrant */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-sm font-medium text-blue-400">Cognitive</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {quadrantScores.cognitive.toFixed(1)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Kognitif, Manajemen Diri, Finansial
            </p>
          </div>

          {/* Affective Quadrant */}
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="text-sm font-medium text-purple-400">Affective</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {quadrantScores.affective.toFixed(1)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Kesehatan Fisik, Emosional, Mental
            </p>
          </div>

          {/* Social Quadrant */}
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm font-medium text-green-400">Social</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {quadrantScores.social.toFixed(1)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Karakter, Spiritual, Lingkungan
            </p>
          </div>

          {/* Legend */}
          <div className="pt-4 border-t border-slate-700">
            <h4 className="text-sm font-semibold text-white mb-2">Keterangan</h4>
            <div className="space-y-1 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3 h-3" />
                <span>Garis solid = Skor saat ini</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-3 h-3" />
                <span>Garis putus = Rata-rata</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-3 h-3" />
                <span>Area emas = Target</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-700">
        <div className="text-center">
          <div className="text-3xl font-bold text-[#135bec]">
            {data.filter(d => d.current >= 70).length}
          </div>
          <div className="text-sm text-slate-400">Dimensi Unggul</div>
        </div>
        <div className="text-center border-x border-slate-700">
          <div className="text-3xl font-bold text-[#FFD700]">
            {data.filter(d => d.current >= 50 && d.current < 70).length}
          </div>
          <div className="text-sm text-slate-400">Dimensi Berkembang</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-slate-400">
            {data.filter(d => d.current < 50).length}
          </div>
          <div className="text-sm text-slate-400">Perlu Perhatian</div>
        </div>
      </div>
    </div>
  );
};

export default HolisticRadarChart;
