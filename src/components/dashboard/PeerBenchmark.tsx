'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';

interface DimensionBenchmark {
  id: string;
  name: string;
  emoji: string;
  userScore: number;
  peerAverage: number;
  topPercentile: number; // 90th percentile
  percentileRank: number; // user's percentile
}

// Mock data - in production this would come from the API
const BENCHMARK_DATA: DimensionBenchmark[] = [
  { id: 'cognitive', name: 'Kognitif', emoji: '🧠', userScore: 78, peerAverage: 65, topPercentile: 88, percentileRank: 72 },
  { id: 'emotional', name: 'Emosional', emoji: '💙', userScore: 72, peerAverage: 70, topPercentile: 90, percentileRank: 55 },
  { id: 'physical', name: 'Fisik', emoji: '💪', userScore: 65, peerAverage: 68, topPercentile: 85, percentileRank: 42 },
  { id: 'financial', name: 'Finansial', emoji: '💰', userScore: 58, peerAverage: 55, topPercentile: 80, percentileRank: 60 },
  { id: 'social', name: 'Sosial', emoji: '👥', userScore: 82, peerAverage: 72, topPercentile: 92, percentileRank: 78 },
  { id: 'mental', name: 'Mental', emoji: '🌿', userScore: 70, peerAverage: 66, topPercentile: 87, percentileRank: 62 },
  { id: 'character', name: 'Karakter', emoji: '⭐', userScore: 85, peerAverage: 74, topPercentile: 93, percentileRank: 80 },
  { id: 'spiritual', name: 'Spiritual', emoji: '✨', userScore: 75, peerAverage: 71, topPercentile: 89, percentileRank: 65 },
  { id: 'environmental', name: 'Lingkungan', emoji: '🌱', userScore: 60, peerAverage: 62, topPercentile: 82, percentileRank: 48 },
];

function getPercentileLabel(percentile: number): string {
  if (percentile >= 90) return 'Top 10%';
  if (percentile >= 75) return 'Top 25%';
  if (percentile >= 50) return 'Di atas rata-rata';
  if (percentile >= 25) return 'Di bawah rata-rata';
  return 'Perlu peningkatan';
}

function getPercentileColor(percentile: number): string {
  if (percentile >= 75) return 'text-green-400';
  if (percentile >= 50) return 'text-blue-400';
  if (percentile >= 25) return 'text-yellow-400';
  return 'text-red-400';
}

export function PeerBenchmark() {
  const [showInfo, setShowInfo] = useState(false);
  const [selectedDimension, setSelectedDimension] = useState<DimensionBenchmark | null>(null);

  const overallUserAvg = Math.round(BENCHMARK_DATA.reduce((s, d) => s + d.userScore, 0) / BENCHMARK_DATA.length);
  const overallPeerAvg = Math.round(BENCHMARK_DATA.reduce((s, d) => s + d.peerAverage, 0) / BENCHMARK_DATA.length);
  const overallPercentile = Math.round(BENCHMARK_DATA.reduce((s, d) => s + d.percentileRank, 0) / BENCHMARK_DATA.length);

  return (
    <div className="rounded-2xl bg-[#0A0F1A]/60 border border-white/5 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Perbandingan Teman Sebaya</h3>
            <p className="text-xs text-slate-400">Anonim · 1,247 mahasiswa ITS</p>
          </div>
        </div>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
        >
          <Info className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      {/* Info tooltip */}
      {showInfo && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-900/30 border border-blue-500/20 rounded-xl p-3 mb-4 text-xs text-blue-200"
        >
          Data perbandingan bersifat anonim dan agregat. Tidak ada informasi pribadi yang dibagikan. 
          Tujuannya untuk membantu Anda memahami posisi relatif dan area yang perlu ditingkatkan.
        </motion.div>
      )}

      {/* Overall Summary */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-white/5 rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-white">{overallUserAvg}</div>
          <div className="text-[10px] text-slate-400">Skor Anda</div>
        </div>
        <div className="bg-white/5 rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-slate-300">{overallPeerAvg}</div>
          <div className="text-[10px] text-slate-400">Rata-rata</div>
        </div>
        <div className="bg-white/5 rounded-xl p-3 text-center">
          <div className={`text-xl font-bold ${getPercentileColor(overallPercentile)}`}>
            {overallPercentile}%
          </div>
          <div className="text-[10px] text-slate-400">Persentil</div>
        </div>
      </div>

      {/* Dimension Bars */}
      <div className="space-y-3">
        {BENCHMARK_DATA.map((dim, i) => {
          const diff = dim.userScore - dim.peerAverage;
          const isAbove = diff > 0;
          const isEqual = diff === 0;

          return (
            <motion.div
              key={dim.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="cursor-pointer"
              onClick={() => setSelectedDimension(selectedDimension?.id === dim.id ? null : dim)}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm">{dim.emoji}</span>
                <span className="text-xs text-slate-300 flex-1">{dim.name}</span>
                <div className="flex items-center gap-1">
                  {isAbove ? (
                    <TrendingUp className="w-3 h-3 text-green-400" />
                  ) : isEqual ? (
                    <Minus className="w-3 h-3 text-slate-400" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-400" />
                  )}
                  <span className={`text-[11px] font-bold ${isAbove ? 'text-green-400' : isEqual ? 'text-slate-400' : 'text-red-400'}`}>
                    {isAbove ? '+' : ''}{diff}
                  </span>
                </div>
                <span className="text-xs font-bold text-white w-6 text-right">{dim.userScore}</span>
              </div>

              {/* Stacked bar */}
              <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                {/* Peer average marker */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white/30 z-10"
                  style={{ left: `${dim.peerAverage}%` }}
                />
                {/* User score bar */}
                <motion.div
                  className={`h-full rounded-full ${
                    dim.percentileRank >= 75 ? 'bg-green-500' :
                    dim.percentileRank >= 50 ? 'bg-blue-500' :
                    dim.percentileRank >= 25 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${dim.userScore}%` }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                />
              </div>

              {/* Expanded detail */}
              {selectedDimension?.id === dim.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-2 bg-white/5 rounded-xl p-3 text-xs"
                >
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="font-bold text-white">{dim.userScore}/100</div>
                      <div className="text-slate-500">Skor Anda</div>
                    </div>
                    <div>
                      <div className="font-bold text-slate-300">{dim.peerAverage}/100</div>
                      <div className="text-slate-500">Rata-rata</div>
                    </div>
                    <div>
                      <div className={`font-bold ${getPercentileColor(dim.percentileRank)}`}>
                        {getPercentileLabel(dim.percentileRank)}
                      </div>
                      <div className="text-slate-500">Posisi Anda</div>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-white/5 text-slate-400">
                    Target top 10%: <span className="text-white font-medium">{dim.topPercentile}/100</span>
                    {dim.userScore < dim.topPercentile && (
                      <span className="text-yellow-400"> (+{dim.topPercentile - dim.userScore} poin lagi)</span>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/5 text-[10px] text-slate-500">
        <div className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-white/30" />
          <span>Rata-rata teman</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-2 rounded-sm bg-green-500" />
          <span>Top 25%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-2 rounded-sm bg-blue-500" />
          <span>Di atas rata-rata</span>
        </div>
      </div>
    </div>
  );
}
