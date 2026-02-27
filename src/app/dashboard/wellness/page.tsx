'use client';

import React from 'react';
import { Heart, Activity, Target, BarChart2 } from 'lucide-react';
import { DailyCheckIn } from '@/components/dashboard/DailyCheckIn';
import { DailyPulse } from '@/components/dashboard/DailyPulse';
import { WeeklyGoals } from '@/components/dashboard/WeeklyGoals';
import { PeerBenchmark } from '@/components/dashboard/PeerBenchmark';

export default function WellnessPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-900/60 via-teal-900/40 to-slate-900 p-8 shadow-2xl border border-green-500/10">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 rounded-2xl bg-green-500/20 flex items-center justify-center">
              <Heart className="w-7 h-7 text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Wellness Tracker</h1>
              <p className="text-green-200/70 mt-1">Pantau kondisi holistik Anda setiap hari</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-green-500/10 blur-3xl" />
      </div>

      {/* Daily Tracking Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
            <Activity className="w-4 h-4 text-cyan-400" />
            Check-in Harian
          </div>
          <DailyCheckIn />
          <DailyPulse />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
            <Target className="w-4 h-4 text-purple-400" />
            Target & Tujuan
          </div>
          <WeeklyGoals />
        </div>
      </div>

      {/* Peer Benchmark */}
      <div>
        <div className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-4">
          <BarChart2 className="w-4 h-4 text-blue-400" />
          Perbandingan dengan Teman Sebaya
        </div>
        <PeerBenchmark />
      </div>

      {/* Wellness Tips */}
      <div className="rounded-2xl bg-[#0A0F1A]/60 border border-white/5 p-5">
        <h3 className="text-sm font-bold text-white mb-4">💡 Tips Wellness Hari Ini</h3>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            {
              emoji: '🧘',
              title: 'Meditasi 5 Menit',
              desc: 'Luangkan 5 menit untuk bernapas dalam dan menenangkan pikiran. Terbukti mengurangi stres 40%.',
              color: 'border-purple-500/20 bg-purple-500/5',
            },
            {
              emoji: '💧',
              title: 'Hidrasi Cukup',
              desc: 'Minum 8 gelas air per hari. Dehidrasi ringan dapat menurunkan konsentrasi hingga 20%.',
              color: 'border-blue-500/20 bg-blue-500/5',
            },
            {
              emoji: '🚶',
              title: 'Jalan Kaki 10 Menit',
              desc: 'Berjalan kaki singkat setelah belajar meningkatkan retensi memori dan mood secara signifikan.',
              color: 'border-green-500/20 bg-green-500/5',
            },
          ].map((tip, i) => (
            <div key={i} className={`rounded-xl border p-4 ${tip.color}`}>
              <div className="text-2xl mb-2">{tip.emoji}</div>
              <h4 className="text-sm font-bold text-white mb-1">{tip.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
