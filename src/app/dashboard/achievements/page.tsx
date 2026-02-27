'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Zap } from 'lucide-react';
import { AchievementBadges } from '@/components/dashboard/AchievementBadges';
import { StreakCalendar } from '@/components/dashboard/StreakCalendar';

export default function AchievementsPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-yellow-900/60 via-orange-900/40 to-slate-900 p-8 shadow-2xl border border-yellow-500/10">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 rounded-2xl bg-yellow-500/20 flex items-center justify-center">
              <Trophy className="w-7 h-7 text-yellow-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Pencapaian & Penghargaan</h1>
              <p className="text-yellow-200/70 mt-1">Rayakan setiap langkah perjalanan pengembangan diri Anda</p>
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex gap-6 mt-4">
            {[
              { label: 'Badge Diraih', value: '4', icon: <Star className="w-4 h-4 text-yellow-400" /> },
              { label: 'Total XP', value: '650', icon: <Zap className="w-4 h-4 text-blue-400" /> },
              { label: 'Streak Saat Ini', value: '12 hari', icon: <Trophy className="w-4 h-4 text-orange-400" /> },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-2">
                {stat.icon}
                <span className="text-white font-bold">{stat.value}</span>
                <span className="text-slate-400 text-sm">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-yellow-500/10 blur-3xl" />
      </div>

      {/* Badge Gallery */}
      <AchievementBadges />

      {/* Activity Heatmap */}
      <StreakCalendar />

      {/* XP History (placeholder) */}
      <div className="rounded-2xl bg-[#0A0F1A]/60 border border-white/5 p-5">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-blue-400" />
          Riwayat XP
        </h3>
        <div className="space-y-3">
          {[
            { action: 'Menyelesaikan Assessment Kognitif', xp: '+100 XP', time: '2 hari lalu', color: 'text-blue-400' },
            { action: 'Check-in harian (7 hari berturut)', xp: '+200 XP', time: '5 hari lalu', color: 'text-orange-400' },
            { action: 'Bergabung dengan grup belajar', xp: '+50 XP', time: '1 minggu lalu', color: 'text-green-400' },
            { action: 'Menyelesaikan modul Manajemen Diri', xp: '+150 XP', time: '2 minggu lalu', color: 'text-purple-400' },
            { action: 'Login pertama kali', xp: '+50 XP', time: '3 minggu lalu', color: 'text-slate-400' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center justify-between p-3 bg-white/3 rounded-xl border border-white/5"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-current opacity-60" style={{ color: item.color.replace('text-', '') }} />
                <span className="text-sm text-slate-300">{item.action}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-bold ${item.color}`}>{item.xp}</span>
                <span className="text-xs text-slate-500">{item.time}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
