'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, Calendar, TrendingUp } from 'lucide-react';

interface DayActivity {
  date: string; // YYYY-MM-DD
  level: 0 | 1 | 2 | 3 | 4; // 0=none, 1=low, 2=medium, 3=high, 4=max
  activities: string[];
}

const LEVEL_COLORS = [
  'bg-white/5 border-white/5',           // 0 - none
  'bg-green-900/60 border-green-800/40', // 1 - low
  'bg-green-700/70 border-green-600/40', // 2 - medium
  'bg-green-500/80 border-green-400/40', // 3 - high
  'bg-green-400 border-green-300/60',    // 4 - max
];

const LEVEL_LABELS = ['Tidak ada aktivitas', 'Aktivitas ringan', 'Aktivitas sedang', 'Aktivitas tinggi', 'Hari sempurna!'];

function generateMockData(): DayActivity[] {
  const data: DayActivity[] = [];
  const today = new Date();

  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // Generate realistic-looking activity data
    const rand = Math.random();
    let level: 0 | 1 | 2 | 3 | 4 = 0;
    const activities: string[] = [];

    if (rand > 0.35) {
      if (rand > 0.85) {
        level = 4;
        activities.push('Assessment', 'Kursus', 'Check-in', 'Latihan');
      } else if (rand > 0.65) {
        level = 3;
        activities.push('Assessment', 'Kursus', 'Check-in');
      } else if (rand > 0.5) {
        level = 2;
        activities.push('Kursus', 'Check-in');
      } else {
        level = 1;
        activities.push('Check-in');
      }
    }

    data.push({ date: dateStr, level, activities });
  }

  return data;
}

function getWeeks(data: DayActivity[]): DayActivity[][] {
  const weeks: DayActivity[][] = [];
  let currentWeek: DayActivity[] = [];

  // Pad the beginning to start on Sunday
  const firstDay = new Date(data[0].date);
  const startPad = firstDay.getDay(); // 0=Sun, 1=Mon, ...
  for (let i = 0; i < startPad; i++) {
    currentWeek.push({ date: '', level: 0, activities: [] });
  }

  data.forEach(day => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push({ date: '', level: 0, activities: [] });
    }
    weeks.push(currentWeek);
  }

  return weeks;
}

function calculateStreak(data: DayActivity[]): { current: number; longest: number; total: number } {
  const today = new Date().toISOString().split('T')[0];
  let current = 0;
  let longest = 0;
  let temp = 0;
  let total = 0;

  // Calculate from most recent
  const reversed = [...data].reverse();
  let countingCurrent = true;

  for (const day of reversed) {
    if (day.level > 0) {
      total++;
      temp++;
      if (countingCurrent) current++;
      if (temp > longest) longest = temp;
    } else {
      if (day.date <= today) countingCurrent = false;
      temp = 0;
    }
  }

  return { current, longest, total };
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const DAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export function StreakCalendar() {
  const [activityData] = useState<DayActivity[]>(() => generateMockData());
  const [hoveredDay, setHoveredDay] = useState<DayActivity | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const weeks = useMemo(() => getWeeks(activityData), [activityData]);
  const streak = useMemo(() => calculateStreak(activityData), [activityData]);

  // Get month labels for the calendar
  const monthLabels = useMemo(() => {
    const labels: { month: string; weekIndex: number }[] = [];
    let lastMonth = -1;

    weeks.forEach((week, weekIndex) => {
      const firstValidDay = week.find(d => d.date);
      if (firstValidDay) {
        const month = new Date(firstValidDay.date).getMonth();
        if (month !== lastMonth) {
          labels.push({ month: MONTHS[month], weekIndex });
          lastMonth = month;
        }
      }
    });

    return labels;
  }, [weeks]);

  return (
    <div className="rounded-2xl bg-[#0A0F1A]/60 border border-white/5 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Streak Aktivitas</h3>
            <p className="text-xs text-slate-400">365 hari terakhir</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-orange-500/10 border border-orange-500/20 rounded-full px-3 py-1">
          <Flame className="w-3 h-3 text-orange-400" />
          <span className="text-sm font-bold text-orange-300">{streak.current}</span>
          <span className="text-xs text-orange-400/70">hari</span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Streak Saat Ini', value: streak.current, icon: <Flame className="w-3.5 h-3.5 text-orange-400" />, color: 'text-orange-300' },
          { label: 'Streak Terpanjang', value: streak.longest, icon: <Trophy className="w-3.5 h-3.5 text-yellow-400" />, color: 'text-yellow-300' },
          { label: 'Total Hari Aktif', value: streak.total, icon: <TrendingUp className="w-3.5 h-3.5 text-green-400" />, color: 'text-green-300' },
        ].map((stat, i) => (
          <div key={i} className="bg-white/5 rounded-xl p-3 text-center">
            <div className="flex justify-center mb-1">{stat.icon}</div>
            <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-[10px] text-slate-500 leading-tight">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Calendar Heatmap */}
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Month labels */}
          <div className="flex mb-1 ml-8">
            {monthLabels.map((label, i) => (
              <div
                key={i}
                className="text-[10px] text-slate-500 absolute"
                style={{ left: `${label.weekIndex * 14 + 32}px`, position: 'relative', width: 0, overflow: 'visible' }}
              >
                {label.month}
              </div>
            ))}
          </div>

          <div className="flex gap-1">
            {/* Day labels */}
            <div className="flex flex-col gap-1 mr-1">
              {DAYS.map((day, i) => (
                <div key={i} className="h-3 text-[9px] text-slate-600 flex items-center w-6">
                  {i % 2 === 1 ? day : ''}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="flex gap-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => (
                    <motion.div
                      key={dayIndex}
                      className={`w-3 h-3 rounded-sm border cursor-pointer transition-all ${
                        day.date ? LEVEL_COLORS[day.level] : 'bg-transparent border-transparent'
                      }`}
                      whileHover={day.date ? { scale: 1.4 } : {}}
                      onMouseEnter={(e) => {
                        if (day.date) {
                          setHoveredDay(day);
                          const rect = (e.target as HTMLElement).getBoundingClientRect();
                          setTooltipPos({ x: rect.left, y: rect.top });
                        }
                      }}
                      onMouseLeave={() => setHoveredDay(null)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 mt-3 justify-end">
            <span className="text-[10px] text-slate-500">Kurang</span>
            {LEVEL_COLORS.map((color, i) => (
              <div key={i} className={`w-3 h-3 rounded-sm border ${color}`} />
            ))}
            <span className="text-[10px] text-slate-500">Lebih</span>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredDay && hoveredDay.date && (
        <div className="fixed z-50 bg-slate-800 border border-white/10 rounded-lg p-2 text-xs pointer-events-none shadow-xl"
          style={{ left: tooltipPos.x + 16, top: tooltipPos.y - 60 }}
        >
          <p className="font-bold text-white mb-1">
            {new Date(hoveredDay.date + 'T00:00:00').toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}
          </p>
          <p className="text-slate-300">{LEVEL_LABELS[hoveredDay.level]}</p>
          {hoveredDay.activities.length > 0 && (
            <p className="text-slate-400 mt-1">{hoveredDay.activities.join(' · ')}</p>
          )}
        </div>
      )}
    </div>
  );
}
