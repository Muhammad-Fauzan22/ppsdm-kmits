'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, Check, Trash2, ChevronDown, ChevronUp, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Goal {
  id: string;
  text: string;
  category: string;
  completed: boolean;
  createdAt: string;
}

interface WeekData {
  weekStart: string;
  goals: Goal[];
}

const CATEGORIES = [
  { id: 'study', label: 'Belajar', emoji: '📚', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  { id: 'health', label: 'Kesehatan', emoji: '💪', color: 'text-green-400 bg-green-500/10 border-green-500/20' },
  { id: 'social', label: 'Sosial', emoji: '👥', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  { id: 'personal', label: 'Pribadi', emoji: '🌱', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
  { id: 'finance', label: 'Finansial', emoji: '💰', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
];

const STORAGE_KEY = 'ppsdm_weekly_goals';

function getWeekStart(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
  d.setDate(diff);
  return d.toISOString().split('T')[0];
}

function loadWeekData(): WeekData {
  const weekStart = getWeekStart(new Date());
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data: WeekData = JSON.parse(stored);
      if (data.weekStart === weekStart) return data;
    }
  } catch {
    // ignore
  }
  return { weekStart, goals: [] };
}

function saveWeekData(data: WeekData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function WeeklyGoals() {
  const [weekData, setWeekData] = useState<WeekData>({ weekStart: '', goals: [] });
  const [isExpanded, setIsExpanded] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newGoalText, setNewGoalText] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState('study');

  useEffect(() => {
    setWeekData(loadWeekData());
  }, []);

  const updateGoals = (goals: Goal[]) => {
    const updated = { ...weekData, goals };
    setWeekData(updated);
    saveWeekData(updated);
  };

  const addGoal = () => {
    if (!newGoalText.trim()) return;
    const goal: Goal = {
      id: Date.now().toString(),
      text: newGoalText.trim(),
      category: newGoalCategory,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    updateGoals([...weekData.goals, goal]);
    setNewGoalText('');
    setIsAdding(false);
  };

  const toggleGoal = (id: string) => {
    updateGoals(weekData.goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  const deleteGoal = (id: string) => {
    updateGoals(weekData.goals.filter(g => g.id !== id));
  };

  const completedCount = weekData.goals.filter(g => g.completed).length;
  const totalCount = weekData.goals.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const weekStartDate = weekData.weekStart
    ? new Date(weekData.weekStart + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
    : '';

  const getCategoryStyle = (categoryId: string) => {
    return CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[0];
  };

  return (
    <div className="rounded-2xl bg-[#0A0F1A]/60 border border-white/5 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-5 hover:bg-white/2 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <Target className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-bold text-white">Target Minggu Ini</h3>
            <p className="text-xs text-slate-400">
              {weekStartDate ? `Mulai ${weekStartDate}` : 'Minggu ini'} · {completedCount}/{totalCount} selesai
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {totalCount > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-xs text-slate-400">{Math.round(progress)}%</span>
            </div>
          )}
          {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">
              {/* Completion celebration */}
              {totalCount > 0 && completedCount === totalCount && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 mb-4"
                >
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <p className="text-sm text-yellow-300 font-medium">Luar biasa! Semua target minggu ini tercapai! 🎉</p>
                </motion.div>
              )}

              {/* Goals List */}
              <div className="space-y-2 mb-4">
                <AnimatePresence>
                  {weekData.goals.map(goal => {
                    const cat = getCategoryStyle(goal.category);
                    return (
                      <motion.div
                        key={goal.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10, height: 0 }}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                          goal.completed
                            ? 'bg-white/3 border-white/5 opacity-60'
                            : 'bg-white/5 border-white/10'
                        }`}
                      >
                        <button
                          onClick={() => toggleGoal(goal.id)}
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                            goal.completed
                              ? 'bg-green-500 border-green-500'
                              : 'border-white/20 hover:border-white/40'
                          }`}
                        >
                          {goal.completed && <Check className="w-3 h-3 text-white" />}
                        </button>

                        <span className={`flex-1 text-sm ${goal.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                          {goal.text}
                        </span>

                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${cat.color}`}>
                          {cat.emoji} {cat.label}
                        </span>

                        <button
                          onClick={() => deleteGoal(goal.id)}
                          className="w-6 h-6 rounded-lg hover:bg-red-500/20 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                          style={{ opacity: 0.4 }}
                          onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                          onMouseLeave={e => (e.currentTarget.style.opacity = '0.4')}
                        >
                          <Trash2 className="w-3 h-3 text-red-400" />
                        </button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {weekData.goals.length === 0 && !isAdding && (
                  <div className="text-center py-6 text-slate-500">
                    <Target className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Belum ada target minggu ini</p>
                    <p className="text-xs mt-1">Tambahkan target untuk tetap fokus!</p>
                  </div>
                )}
              </div>

              {/* Add Goal Form */}
              <AnimatePresence>
                {isAdding && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-3"
                  >
                    <input
                      type="text"
                      value={newGoalText}
                      onChange={e => setNewGoalText(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addGoal()}
                      placeholder="Tulis target Anda..."
                      autoFocus
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 mb-2"
                    />
                    <div className="flex gap-2 flex-wrap mb-2">
                      {CATEGORIES.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => setNewGoalCategory(cat.id)}
                          className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                            newGoalCategory === cat.id ? cat.color : 'border-white/10 text-slate-400 bg-white/5'
                          }`}
                        >
                          {cat.emoji} {cat.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setIsAdding(false)}
                        variant="outline"
                        size="sm"
                        className="flex-1 border-white/10 text-slate-400 text-xs"
                      >
                        Batal
                      </Button>
                      <Button
                        onClick={addGoal}
                        disabled={!newGoalText.trim()}
                        size="sm"
                        className="flex-1 bg-purple-600 hover:bg-purple-500 text-white text-xs disabled:opacity-40"
                      >
                        Tambah Target
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Add Button */}
              {!isAdding && weekData.goals.length < 10 && (
                <button
                  onClick={() => setIsAdding(true)}
                  className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border border-dashed border-white/10 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all text-slate-400 hover:text-purple-300 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Target Baru
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
