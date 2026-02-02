'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAssessmentStore } from '@/lib/assessment/store';

interface Question {
  id: string;
  text: string;
  subDimension: string;
  reverseScored?: boolean;
}

interface AssessmentQuestionProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onComplete: () => void;
  onBack: () => void;
}

const likertLabels = {
  1: 'Sangat Tidak Setuju',
  2: 'Tidak Setuju',
  3: 'Netral',
  4: 'Setuju',
  5: 'Sangat Setuju',
};

export function AssessmentQuestion({
  question,
  questionNumber,
  totalQuestions,
  onComplete,
  onBack,
}: AssessmentQuestionProps) {
  const [localSelected, setLocalSelected] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutes per question
  const { dimensions, currentDimension, setAnswer, nextQuestion, prevQuestion } = useAssessmentStore();
  
  // Get answers for current dimension
  const answers = dimensions[currentDimension || '']?.answers || {};
  
  // Load existing answer
  useEffect(() => {
    const existing = answers[question.id];
    if (existing) {
      setLocalSelected(existing.value);
    }
  }, [question.id, answers]);
  
  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Auto-submit if time runs out
          if (localSelected !== null) {
            handleSubmit();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [localSelected]);
  
  const handleSelect = (value: number) => {
    setLocalSelected(value);
    setAnswer(question.id, value);
  };
  
  const handleSubmit = () => {
    if (localSelected === null) return;
    
    if (questionNumber >= totalQuestions - 1) {
      onComplete();
    } else {
      nextQuestion();
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const progress = ((questionNumber + 1) / totalQuestions) * 100;
  
  return (
    <div className="min-h-screen bg-[#0A0F1A] text-white pt-20 pb-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Kembali
          </button>
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">Pertanyaan {questionNumber + 1} dari {totalQuestions}</span>
              <span className={`flex items-center gap-1 ${timeRemaining < 30 ? 'text-red-400' : 'text-slate-400'}`}>
                <span className="material-symbols-outlined text-sm">timer</span>
                {formatTime(timeRemaining)}
              </span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#135bec] to-[#00d4ff]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
        
        {/* Question Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-8 mb-6"
        >
          <div className="mb-4">
            <span className="text-xs font-semibold text-brand-accent uppercase tracking-wider">
              {question.subDimension}
            </span>
          </div>
          
          <h2 className="text-xl md:text-2xl font-bold leading-relaxed mb-8">
            {question.text}
          </h2>
          
          {/* Likert Scale */}
          <div className="space-y-3">
            <div className="grid grid-cols-5 gap-3">
              {[1, 2, 3, 4, 5].map((value) => (
                <motion.button
                  key={value}
                  onClick={() => handleSelect(value)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    localSelected === value 
                      ? 'border-brand-accent bg-brand-accent/20' 
                      : 'border-white/10 bg-white/5 hover:border-white/30'
                  }`}
                >
                  <span className="block text-2xl font-bold mb-1">{value}</span>
                  <span className="text-xs text-slate-400 hidden sm:block">
                    {likertLabels[value as keyof typeof likertLabels]}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
           Sebelumnya
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={localSelected === null}
            className="flex items-center gap-2 px-8 py-4 bg-[#0A0F1A] text-white font-bold rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {questionNumber >= totalQuestions - 1 ? 'Selesai' : 'Selanjutnya'}
            <span className="material-symbols-outlined">
              {questionNumber >= totalQuestions - 1 ? 'check' : 'arrow_forward'}
            </span>
          </button>
        </div>
        
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalQuestions }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i <= questionNumber 
                  ? 'bg-brand-accent' 
                  : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default AssessmentQuestion;