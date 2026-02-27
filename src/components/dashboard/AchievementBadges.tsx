'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Lock, Star, Zap, Heart, Brain, Target, Flame, BookOpen, Users } from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earned: boolean;
  earnedAt?: string;
  progress?: number;
  maxProgress?: number;
  xpReward: number;
  category: string;
}

const RARITY_STYLES = {
  common: {
    border: 'border-slate-500/40',
    bg: 'bg-slate-500/10',
    glow: '',
    label: 'Common',
    labelColor: 'text-slate-400',
    starColor: 'text-slate-400',
  },
  rare: {
    border: 'border-blue-500/50',
    bg: 'bg-blue-500/10',
    glow: 'shadow-blue-500/20',
    label: 'Rare',
    labelColor: 'text-blue-400',
    starColor: 'text-blue-400',
  },
  epic: {
    border: 'border-purple-500/60',
    bg: 'bg-purple-500/15',
    glow: 'shadow-purple-500/30',
    label: 'Epic',
    labelColor: 'text-purple-400',
    starColor: 'text-purple-400',
  },
  legendary: {
    border: 'border-yellow-500/70',
    bg: 'bg-yellow-500/15',
    glow: 'shadow-yellow-500/40',
    label: 'Legendary',
    labelColor: 'text-yellow-400',
    starColor: 'text-yellow-400',
  },
};

const BADGES: Badge[] = [
  {
    id: 'first_login',
    name: 'Langkah Pertama',
    description: 'Selamat datang di PPSDM KMITS! Anda telah memulai perjalanan pengembangan diri.',
    icon: <Star className="w-6 h-6" />,
    rarity: 'common',
    earned: true,
    earnedAt: '2026-01-15',
    xpReward: 50,
    category: 'Milestone',
  },
  {
    id: 'first_assessment',
    name: 'Penjelajah Diri',
    description: 'Menyelesaikan assessment pertama Anda. Kenali diri Anda lebih dalam!',
    icon: <Brain className="w-6 h-6" />,
    rarity: 'common',
    earned: true,
    earnedAt: '2026-01-16',
    xpReward: 100,
    category: 'Assessment',
  },
  {
    id: 'streak_7',
    name: 'Konsisten 7 Hari',
    description: 'Aktif selama 7 hari berturut-turut. Konsistensi adalah kunci kesuksesan!',
    icon: <Flame className="w-6 h-6" />,
    rarity: 'rare',
    earned: true,
    earnedAt: '2026-01-22',
    xpReward: 200,
    category: 'Streak',
  },
  {
    id: 'holistic_explorer',
    name: 'Penjelajah Holistik',
    description: 'Menyelesaikan assessment di 5 dimensi berbeda.',
    icon: <Target className="w-6 h-6" />,
    rarity: 'rare',
    earned: true,
    earnedAt: '2026-02-01',
    xpReward: 300,
    category: 'Assessment',
  },
  {
    id: 'study_buddy',
    name: 'Teman Belajar',
    description: 'Bergabung dengan 3 grup belajar berbeda.',
    icon: <Users className="w-6 h-6" />,
    rarity: 'rare',
    earned: false,
    progress: 1,
    maxProgress: 3,
    xpReward: 250,
    category: 'Sosial',
  },
  {
    id: 'knowledge_seeker',
    name: 'Pencari Ilmu',
    description: 'Menyelesaikan 10 modul pembelajaran.',
    icon: <BookOpen className="w-6 h-6" />,
    rarity: 'epic',
    earned: false,
    progress: 4,
    maxProgress: 10,
    xpReward: 500,
    category: 'Pembelajaran',
  },
  {
    id: 'streak_30',
    name: 'Dedikasi Sebulan',
    description: 'Aktif selama 30 hari berturut-turut. Luar biasa!',
    icon: <Flame className="w-6 h-6" />,
    rarity: 'epic',
    earned: false,
    progress: 12,
    maxProgress: 30,
    xpReward: 750,
    category: 'Streak',
  },
  {
    id: 'holistic_master',
    name: 'Master Holistik',
    description: 'Menyelesaikan semua 9 dimensi assessment dengan skor tinggi.',
    icon: <Trophy className="w-6 h-6" />,
    rarity: 'legendary',
    earned: false,
    progress: 4,
    maxProgress: 9,
    xpReward: 2000,
    category: 'Assessment',
  },
  {
    id: 'wellness_champion',
    name: 'Juara Wellness',
    description: 'Mencapai skor 80+ di semua dimensi kesehatan.',
    icon: <Heart className="w-6 h-6" />,
    rarity: 'legendary',
    earned: false,
    progress: 2,
    maxProgress: 4,
    xpReward: 1500,
    category: 'Kesehatan',
  },
  {
    id: 'energy_boost',
    name: 'Penuh Energi',
    description: 'Check-in dengan energi tinggi selama 5 hari berturut-turut.',
    icon: <Zap className="w-6 h-6" />,
    rarity: 'common',
    earned: false,
    progress: 2,
    maxProgress: 5,
    xpReward: 150,
    category: 'Check-in',
  },
];

export function AchievementBadges() {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [filter, setFilter] = useState<'all' | 'earned' | 'locked'>('all');

  const earnedCount = BADGES.filter(b => b.earned).length;
  const totalXP = BADGES.filter(b => b.earned).reduce((sum, b) => sum + b.xpReward, 0);

  const filteredBadges = BADGES.filter(b => {
    if (filter === 'earned') return b.earned;
    if (filter === 'locked') return !b.earned;
    return true;
  });

  return (
    <div className="rounded-2xl bg-[#0A0F1A]/60 border border-white/5 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
            <Trophy className="w-4 h-4 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Pencapaian</h3>
            <p className="text-xs text-slate-400">{earnedCount}/{BADGES.length} badge · {totalXP.toLocaleString()} XP</p>
          </div>
        </div>
        <div className="flex gap-1">
          {(['all', 'earned', 'locked'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-[11px] px-2.5 py-1 rounded-full transition-all ${
                filter === f
                  ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              {f === 'all' ? 'Semua' : f === 'earned' ? 'Diraih' : 'Terkunci'}
            </button>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>Progress Keseluruhan</span>
          <span>{Math.round((earnedCount / BADGES.length) * 100)}%</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(earnedCount / BADGES.length) * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-5 gap-2">
        {filteredBadges.map((badge, i) => {
          const style = RARITY_STYLES[badge.rarity];
          return (
            <motion.button
              key={badge.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedBadge(badge)}
              className={`relative flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${
                badge.earned
                  ? `${style.border} ${style.bg} shadow-lg ${style.glow} hover:scale-105`
                  : 'border-white/5 bg-white/3 opacity-50 hover:opacity-70'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                badge.earned ? style.bg : 'bg-white/5'
              }`}>
                <span className={badge.earned ? style.starColor : 'text-slate-600'}>
                  {badge.earned ? badge.icon : <Lock className="w-4 h-4" />}
                </span>
              </div>
              <span className="text-[9px] text-center leading-tight text-slate-400 line-clamp-2">
                {badge.name}
              </span>
              {!badge.earned && badge.progress !== undefined && badge.maxProgress && (
                <div className="w-full h-0.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
                  />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Badge Detail Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedBadge(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className={`w-72 rounded-2xl border p-6 text-center ${
                RARITY_STYLES[selectedBadge.rarity].border
              } ${RARITY_STYLES[selectedBadge.rarity].bg} bg-[#0D1117] shadow-2xl`}
            >
              {/* Badge Icon */}
              <div className={`w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
                selectedBadge.earned
                  ? `${RARITY_STYLES[selectedBadge.rarity].bg} shadow-lg`
                  : 'bg-white/5'
              }`}>
                <span className={`scale-150 ${
                  selectedBadge.earned
                    ? RARITY_STYLES[selectedBadge.rarity].starColor
                    : 'text-slate-600'
                }`}>
                  {selectedBadge.earned ? selectedBadge.icon : <Lock className="w-8 h-8" />}
                </span>
              </div>

              {/* Rarity */}
              <span className={`text-[11px] font-bold uppercase tracking-wider ${RARITY_STYLES[selectedBadge.rarity].labelColor}`}>
                ✦ {RARITY_STYLES[selectedBadge.rarity].label} ✦
              </span>

              {/* Name & Description */}
              <h3 className="text-lg font-bold text-white mt-2 mb-2">{selectedBadge.name}</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">{selectedBadge.description}</p>

              {/* XP Reward */}
              <div className="flex items-center justify-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-2 mb-4">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-bold text-yellow-300">+{selectedBadge.xpReward} XP</span>
              </div>

              {/* Progress or Earned Date */}
              {selectedBadge.earned ? (
                <p className="text-xs text-slate-500">
                  Diraih pada {selectedBadge.earnedAt
                    ? new Date(selectedBadge.earnedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                    : '-'}
                </p>
              ) : selectedBadge.progress !== undefined && selectedBadge.maxProgress ? (
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Progress</span>
                    <span>{selectedBadge.progress}/{selectedBadge.maxProgress}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${(selectedBadge.progress / selectedBadge.maxProgress) * 100}%` }}
                    />
                  </div>
                </div>
              ) : null}

              <button
                onClick={() => setSelectedBadge(null)}
                className="mt-4 text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                Tutup
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
