'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ChevronRight, BarChart2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PulseQuestion {
  id: string;
  dimension: string;
  emoji: string;
  question: string;
  color: string;
}

interface PulseResult {
  date: string;
  scores: Record<string, number>;
  average: number;
  completedAt: string;
}

const PULSE_QUESTIONS: PulseQuestion[] = [
  {
    id: 'cognitive',
    dimension: 'Kognitif',
    emoji: '🧠',
    question: 'Seberapa fokus dan produktif Anda hari ini?',
    color: 'from-blue-600 to-indigo-600',
  },
  {
    id: 'emotional',
    dimension: 'Emosional',
    emoji: '💙',
    question: 'Bagaimana kondisi emosional Anda saat ini?',
    color: 'from-purple-600 to-pink-600',
  },
  {
    id: 'physical',
    dimension: 'Fisik',
    emoji: '💪',
    question: 'Bagaimana kondisi fisik dan kesehatan Anda?',
    color: 'from-green-600 to-emerald-600',
  },
  {
    id: 'social',
    dimension: 'Sosial',
    emoji: '👥',
    question: 'Seberapa terhubung Anda dengan orang-orang di sekitar?',
    color: 'from-orange-600 to-yellow-600',
  },
  {
    id: 'mental',
    dimension: 'Mental',
    emoji: '🌿',
    question: 'Seberapa tenang dan seimbang pikiran Anda?',
    color: 'from-teal-600 to-cyan-600',
  },
];

const SCALE_LABELS = ['Sangat Buruk', 'Buruk', 'Cukup', 'Baik', 'Sangat Baik'];
const SCALE_COLORS = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-500'];

const STORAGE_KEY = 'ppsdm_daily_pulse';

function loadTodayPulse(): PulseResult | null {
  const today = new Date().toISOString().split('T')[0];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data: PulseResult = JSON.parse(stored);
      if (data.date === today) return data;
    }
  } catch {
    // ignore
  }
  return null;
}

export function DailyPulse() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [isStarted, setIsStarted] = useState(false);
  const [result, setResult] = useState<PulseResult | null>(null);
  const [hoveredScore, setHoveredScore] = useState<number | null>(null);

  useEffect(() => {
    const todayResult = loadTodayPulse();
    if (todayResult) setResult(todayResult);
  }, []);

  const handleScore = (score: number) => {
    const question = PULSE_QUESTIONS[currentQuestion];
    const newScores = { ...scores, [question.id]: score };
    setScores(newScores);

    if (currentQuestion < PULSE_QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQuestion(prev => prev + 1), 300);
    } else {
      // Complete
      const average = Object.values(newScores).reduce((a, b) => a + b, 0) / PULSE_QUESTIONS.length;
      const pulseResult: PulseResult = {
        date: new Date().toISOString().split('T')[0],
        scores: newScores,
        average: Math.round(average * 10) / 10,
        completedAt: new Date().toISOString(),
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(pulseResult));
      } catch {
        // ignore
      }
      setResult(pulseResult);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return 'text-emerald-400';
    if (score >= 3.5) return 'text-green-400';
    if (score >= 2.5) return 'text-yellow-400';
    if (score >= 1.5) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 4.5) return 'Luar Biasa';
    if (score >= 3.5) return 'Baik';
    if (score >= 2.5) return 'Cukup';
    if (score >= 1.5) return 'Perlu Perhatian';
    return 'Butuh Dukungan';
  };

  // Show result if already done today
  if (result) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-[#0A0F1A]/60 border border-white/5 p-5"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Daily Pulse ✓</h3>
            <p className="text-xs text-slate-400">
              Rata-rata: <span className={`font-bold ${getScoreColor(result.average)}`}>
                {result.average}/5 · {getScoreLabel(result.average)}
              </span>
            </p>
          </div>
        </div>

        {/* Mini bar chart */}
        <div className="space-y-2">
          {PULSE_QUESTIONS.map(q => {
            const score = result.scores[q.id] || 0;
            return (
              <div key={q.id} className="flex items-center gap-2">
                <span className="text-sm w-4">{q.emoji}</span>
                <span className="text-xs text-slate-400 w-20 flex-shrink-0">{q.dimension}</span>
                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${SCALE_COLORS[score - 1] || 'bg-slate-600'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(score / 5) * 100}%` }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  />
                </div>
                <span className={`text-xs font-bold w-4 ${getScoreColor(score)}`}>{score}</span>
              </div>
            );
          })}
        </div>
      </motion.div>
    );
  }

  // Not started yet
  if (!isStarted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-[#0A0F1A]/60 border border-white/5 p-5"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Daily Pulse</h3>
            <p className="text-xs text-slate-400">5 pertanyaan · ~1 menit</p>
          </div>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Ukur kondisi holistik Anda hari ini dengan 5 pertanyaan singkat. Data ini membantu AI memberikan rekomendasi yang lebih personal.
        </p>
        <Button
          onClick={() => setIsStarted(true)}
          className="w-full bg-cyan-600 hover:bg-cyan-500 text-white text-sm"
          size="sm"
        >
          <BarChart2 className="w-4 h-4 mr-2" />
          Mulai Daily Pulse
        </Button>
      </motion.div>
    );
  }

  // Active assessment
  const question = PULSE_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion) / PULSE_QUESTIONS.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-[#0A0F1A]/60 border border-white/5 overflow-hidden"
    >
      {/* Progress bar */}
      <div className="h-1 bg-white/5">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="p-5">
        {/* Question counter */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-slate-400">
            Pertanyaan {currentQuestion + 1} dari {PULSE_QUESTIONS.length}
          </span>
          <span className="text-xs text-slate-500">{Math.round(progress)}%</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Dimension badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{question.emoji}</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${question.color} text-white`}>
                {question.dimension}
              </span>
            </div>

            {/* Question */}
            <p className="text-sm font-medium text-white mb-5 leading-relaxed">
              {question.question}
            </p>

            {/* Scale buttons */}
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(score => (
                <motion.button
                  key={score}
                  onClick={() => handleScore(score)}
                  onMouseEnter={() => setHoveredScore(score)}
                  onMouseLeave={() => setHoveredScore(null)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-1 flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all ${
                    hoveredScore !== null && score <= hoveredScore
                      ? `${SCALE_COLORS[score - 1]} border-transparent text-white`
                      : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <span className="text-lg font-bold">{score}</span>
                  <span className="text-[9px] leading-tight text-center">
                    {SCALE_LABELS[score - 1]}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
