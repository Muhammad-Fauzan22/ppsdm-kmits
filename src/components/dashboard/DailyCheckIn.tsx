'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Smile, Meh, Frown, Zap, Heart, Brain, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MoodOption {
  value: number;
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
}

interface EnergyOption {
  value: number;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const MOOD_OPTIONS: MoodOption[] = [
  { value: 1, label: 'Sangat Buruk', emoji: '😞', color: 'text-red-400', bgColor: 'bg-red-500/20 border-red-500/40' },
  { value: 2, label: 'Buruk', emoji: '😕', color: 'text-orange-400', bgColor: 'bg-orange-500/20 border-orange-500/40' },
  { value: 3, label: 'Biasa', emoji: '😐', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20 border-yellow-500/40' },
  { value: 4, label: 'Baik', emoji: '😊', color: 'text-green-400', bgColor: 'bg-green-500/20 border-green-500/40' },
  { value: 5, label: 'Luar Biasa', emoji: '🤩', color: 'text-blue-400', bgColor: 'bg-blue-500/20 border-blue-500/40' },
];

const ENERGY_OPTIONS: EnergyOption[] = [
  { value: 1, label: 'Sangat Lelah', icon: <Frown className="w-4 h-4" />, color: 'text-red-400' },
  { value: 2, label: 'Lelah', icon: <Meh className="w-4 h-4" />, color: 'text-orange-400' },
  { value: 3, label: 'Normal', icon: <Smile className="w-4 h-4" />, color: 'text-yellow-400' },
  { value: 4, label: 'Berenergi', icon: <Zap className="w-4 h-4" />, color: 'text-green-400' },
  { value: 5, label: 'Penuh Semangat', icon: <Sun className="w-4 h-4" />, color: 'text-blue-400' },
];

const FOCUS_AREAS = [
  { id: 'study', label: 'Belajar', icon: '📚' },
  { id: 'health', label: 'Kesehatan', icon: '💪' },
  { id: 'social', label: 'Sosial', icon: '👥' },
  { id: 'mental', label: 'Mental', icon: '🧠' },
  { id: 'spiritual', label: 'Spiritual', icon: '✨' },
  { id: 'finance', label: 'Finansial', icon: '💰' },
];

const STORAGE_KEY = 'ppsdm_daily_checkin';

interface CheckInData {
  date: string;
  mood: number;
  energy: number;
  focusAreas: string[];
  note: string;
  completedAt: string;
}

export function DailyCheckIn() {
  const [step, setStep] = useState<'prompt' | 'mood' | 'energy' | 'focus' | 'note' | 'done'>('prompt');
  const [mood, setMood] = useState<number | null>(null);
  const [energy, setEnergy] = useState<number | null>(null);
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [alreadyDone, setAlreadyDone] = useState(false);
  const [todayData, setTodayData] = useState<CheckInData | null>(null);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data: CheckInData = JSON.parse(stored);
        if (data.date === today) {
          setAlreadyDone(true);
          setTodayData(data);
          setStep('done');
        }
      }
    } catch {
      // ignore
    }
  }, [today]);

  const toggleFocusArea = (id: string) => {
    setFocusAreas(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleComplete = () => {
    const data: CheckInData = {
      date: today,
      mood: mood!,
      energy: energy!,
      focusAreas,
      note,
      completedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore
    }
    setTodayData(data);
    setAlreadyDone(true);
    setStep('done');
  };

  const selectedMood = MOOD_OPTIONS.find(m => m.value === mood);
  const selectedEnergy = ENERGY_OPTIONS.find(e => e.value === energy);

  if (step === 'done' && todayData) {
    const doneMood = MOOD_OPTIONS.find(m => m.value === todayData.mood);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl bg-gradient-to-br from-green-900/30 to-emerald-900/20 border border-green-500/20 p-5"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-green-300">Check-in Hari Ini ✓</p>
            <p className="text-xs text-slate-400">
              {new Date(todayData.completedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-2xl">{doneMood?.emoji}</span>
          <div>
            <p className="text-white font-medium">{doneMood?.label}</p>
            <p className="text-slate-400 text-xs">
              Fokus: {todayData.focusAreas.map(id => FOCUS_AREAS.find(f => f.id === id)?.label).join(', ') || 'Tidak ada'}
            </p>
          </div>
        </div>
        {todayData.note && (
          <p className="mt-3 text-xs text-slate-400 italic border-t border-white/5 pt-3">
            &ldquo;{todayData.note}&rdquo;
          </p>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-gradient-to-br from-indigo-900/40 to-purple-900/30 border border-indigo-500/20 p-5"
    >
      <AnimatePresence mode="wait">
        {/* PROMPT */}
        {step === 'prompt' && (
          <motion.div key="prompt" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🌅</span>
              <div>
                <p className="text-sm font-bold text-white">Daily Check-in</p>
                <p className="text-xs text-slate-400">Bagaimana kondisi Anda hari ini?</p>
              </div>
            </div>
            <Button
              onClick={() => setStep('mood')}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm"
              size="sm"
            >
              Mulai Check-in (1 menit)
            </Button>
          </motion.div>
        )}

        {/* MOOD */}
        {step === 'mood' && (
          <motion.div key="mood" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <p className="text-sm font-bold text-white mb-1">Bagaimana suasana hati Anda?</p>
            <p className="text-xs text-slate-400 mb-4">Pilih yang paling menggambarkan perasaan Anda</p>
            <div className="flex gap-2 mb-4">
              {MOOD_OPTIONS.map(option => (
                <button
                  key={option.value}
                  onClick={() => setMood(option.value)}
                  className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${
                    mood === option.value
                      ? option.bgColor + ' scale-105'
                      : 'border-white/10 hover:border-white/20 bg-white/5'
                  }`}
                >
                  <span className="text-xl">{option.emoji}</span>
                  <span className={`text-[10px] font-medium ${mood === option.value ? option.color : 'text-slate-400'}`}>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
            <Button
              onClick={() => setStep('energy')}
              disabled={!mood}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm disabled:opacity-40"
              size="sm"
            >
              Lanjut →
            </Button>
          </motion.div>
        )}

        {/* ENERGY */}
        {step === 'energy' && (
          <motion.div key="energy" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <p className="text-sm font-bold text-white mb-1">Level energi Anda?</p>
            <p className="text-xs text-slate-400 mb-4">Seberapa berenergi Anda hari ini?</p>
            <div className="space-y-2 mb-4">
              {ENERGY_OPTIONS.map(option => (
                <button
                  key={option.value}
                  onClick={() => setEnergy(option.value)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                    energy === option.value
                      ? 'border-indigo-500/60 bg-indigo-500/20'
                      : 'border-white/10 hover:border-white/20 bg-white/5'
                  }`}
                >
                  <span className={energy === option.value ? option.color : 'text-slate-400'}>
                    {option.icon}
                  </span>
                  <span className={`text-sm font-medium ${energy === option.value ? 'text-white' : 'text-slate-300'}`}>
                    {option.label}
                  </span>
                  {/* Energy bar */}
                  <div className="ml-auto flex gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i <= option.value ? 'bg-indigo-400' : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setStep('mood')} variant="outline" size="sm" className="flex-1 border-white/10 text-slate-300">
                ← Kembali
              </Button>
              <Button
                onClick={() => setStep('focus')}
                disabled={!energy}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-sm disabled:opacity-40"
                size="sm"
              >
                Lanjut →
              </Button>
            </div>
          </motion.div>
        )}

        {/* FOCUS */}
        {step === 'focus' && (
          <motion.div key="focus" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <p className="text-sm font-bold text-white mb-1">Fokus hari ini?</p>
            <p className="text-xs text-slate-400 mb-4">Pilih area yang ingin Anda kembangkan (boleh lebih dari satu)</p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {FOCUS_AREAS.map(area => (
                <button
                  key={area.id}
                  onClick={() => toggleFocusArea(area.id)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
                    focusAreas.includes(area.id)
                      ? 'border-indigo-500/60 bg-indigo-500/20'
                      : 'border-white/10 hover:border-white/20 bg-white/5'
                  }`}
                >
                  <span className="text-xl">{area.icon}</span>
                  <span className={`text-[10px] font-medium ${focusAreas.includes(area.id) ? 'text-indigo-300' : 'text-slate-400'}`}>
                    {area.label}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setStep('energy')} variant="outline" size="sm" className="flex-1 border-white/10 text-slate-300">
                ← Kembali
              </Button>
              <Button
                onClick={() => setStep('note')}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-sm"
                size="sm"
              >
                Lanjut →
              </Button>
            </div>
          </motion.div>
        )}

        {/* NOTE */}
        {step === 'note' && (
          <motion.div key="note" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <p className="text-sm font-bold text-white mb-1">Catatan singkat (opsional)</p>
            <p className="text-xs text-slate-400 mb-3">Apa yang ingin Anda capai hari ini?</p>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Contoh: Selesaikan tugas kuliah, olahraga 30 menit..."
              maxLength={200}
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-slate-500 resize-none focus:outline-none focus:border-indigo-500/50 mb-3"
            />
            <div className="flex gap-2">
              <Button onClick={() => setStep('focus')} variant="outline" size="sm" className="flex-1 border-white/10 text-slate-300">
                ← Kembali
              </Button>
              <Button
                onClick={handleComplete}
                className="flex-1 bg-green-600 hover:bg-green-500 text-white text-sm"
                size="sm"
              >
                <CheckCircle className="w-4 h-4 mr-1" /> Selesai!
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress dots */}
      {step !== 'prompt' && step !== 'done' && (
        <div className="flex justify-center gap-1.5 mt-4">
          {['mood', 'energy', 'focus', 'note'].map((s, i) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                s === step ? 'w-4 bg-indigo-400' : 'w-1.5 bg-white/20'
              }`}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
