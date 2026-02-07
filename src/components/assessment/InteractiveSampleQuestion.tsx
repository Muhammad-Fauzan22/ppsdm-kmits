"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Lightbulb, ArrowRight, RotateCcw } from 'lucide-react';

interface SampleQuestion {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  dimension: string;
}

const sampleQuestions: SampleQuestion[] = [
  {
    id: '1',
    dimension: 'Kecerdasan Emosional',
    question: 'Dalam situasi tim yang sedang mengalami konflik, apa tindakan terbaik yang harus dilakukan?',
    options: [
      {
        id: 'a',
        text: 'Mengabaikan konflik dan fokus pada tugas masing-masing',
        isCorrect: false,
        explanation: 'Mengabaikan konflik dapat memperburuk situasi dan menurunkan produktivitas tim.'
      },
      {
        id: 'b',
        text: 'Mendengarkan semua pihak dan mencari solusi win-win',
        isCorrect: true,
        explanation: 'Benar! Mendengarkan aktif dan mencari solusi yang menguntungkan semua pihak adalah ciri kecerdasan emosional tinggi.'
      },
      {
        id: 'c',
        text: 'Memihak pada pihak yang paling dominan',
        isCorrect: false,
        explanation: 'Memihak dapat menciptakan ketidakadilan dan memperpanjang konflik.'
      }
    ]
  },
  {
    id: '2',
    dimension: 'Manajemen Diri',
    question: 'Anda memiliki deadline tugas yang sangat ketat. Bagaimana cara mengelola stres?',
    options: [
      {
        id: 'a',
        text: 'Mengerjakan semua tugas sekaligus tanpa istirahat',
        isCorrect: false,
        explanation: 'Multitasking dan tanpa istirahat justru menurunkan kualitas hasil dan kesehatan mental.'
      },
      {
        id: 'b',
        text: 'Membuat prioritas dan jadwal kerja yang realistis',
        isCorrect: true,
        explanation: 'Tepat! Prioritisasi dan time management adalah kunci manajemen stres yang efektif.'
      },
      {
        id: 'c',
        text: 'Menunda-nunda sampai mendekati deadline',
        isCorrect: false,
        explanation: 'Prokrastinasi akan meningkatkan stres dan menurunkan kualitas pekerjaan.'
      }
    ]
  }
];

/**
 * InteractiveSampleQuestion Component
 * 
 * Komponen soal asesmen interaktif yang benar-benar fungsional.
 * Pengguna dapat memilih jawaban, mendapat feedback langsung,
 * dan melihat penjelasan edukatif.
 */
export function InteractiveSampleQuestion() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const currentQuestion = sampleQuestions[currentIndex];

  const handleOptionSelect = (optionId: string) => {
    if (showResult) return; // Prevent changing after answer revealed
    setSelectedOption(optionId);
  };

  const handleSubmit = () => {
    if (!selectedOption) return;
    
    setShowResult(true);
    setAttempts(prev => prev + 1);
    
    const selectedAnswer = currentQuestion.options.find(opt => opt.id === selectedOption);
    if (selectedAnswer?.isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < sampleQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowResult(false);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowResult(false);
    setScore(0);
    setAttempts(0);
  };

  const selectedAnswer = selectedOption 
    ? currentQuestion.options.find(opt => opt.id === selectedOption)
    : null;

  const progress = ((currentIndex + 1) / sampleQuestions.length) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
        <div className="flex items-center justify-between text-white">
          <div>
            <p className="text-sm opacity-90">Coba Asesmen Interaktif</p>
            <h3 className="font-semibold">{currentQuestion.dimension}</h3>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{score}/{attempts}</p>
            <p className="text-xs opacity-90">Skor</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-white rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="text-xs text-white/80 mt-1">Soal {currentIndex + 1} dari {sampleQuestions.length}</p>
      </div>

      {/* Question Content */}
      <div className="p-6">
        <h4 className="text-lg font-medium text-slate-800 mb-6 leading-relaxed">
          {currentQuestion.question}
        </h4>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedOption === option.id;
            const isCorrect = option.isCorrect;
            const showCorrectness = showResult && (isSelected || isCorrect);
            
            let buttonClass = "w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ";
            
            if (showResult) {
              if (isCorrect) {
                buttonClass += "border-green-500 bg-green-50 text-green-800";
              } else if (isSelected && !isCorrect) {
                buttonClass += "border-red-500 bg-red-50 text-red-800";
              } else {
                buttonClass += "border-slate-200 bg-slate-50 text-slate-500";
              }
            } else {
              buttonClass += isSelected 
                ? "border-blue-500 bg-blue-50 text-blue-800" 
                : "border-slate-200 hover:border-blue-300 hover:bg-slate-50 text-slate-700";
            }

            return (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option.id)}
                disabled={showResult}
                className={buttonClass}
                aria-pressed={isSelected}
                aria-label={`Pilihan ${option.id}: ${option.text}`}
              >
                <div className="flex items-start gap-3">
                  <span className={`
                    flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${showResult 
                      ? (isCorrect 
                        ? "bg-green-500 text-white" 
                        : (isSelected ? "bg-red-500 text-white" : "bg-slate-300 text-slate-600"))
                      : (isSelected ? "bg-blue-500 text-white" : "bg-slate-200 text-slate-600")
                    }
                  `}>
                    {showResult 
                      ? (isCorrect ? <CheckCircle className="w-5 h-5" /> : (isSelected ? <XCircle className="w-5 h-5" /> : option.id.toUpperCase()))
                      : option.id.toUpperCase()
                    }
                  </span>
                  <span className="pt-1">{option.text}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Feedback Section */}
        <AnimatePresence>
          {showResult && selectedAnswer && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`
                mt-6 p-4 rounded-xl
                ${selectedAnswer.isCorrect ? "bg-green-100 border border-green-200" : "bg-amber-100 border border-amber-200"}
              `}
            >
              <div className="flex items-start gap-3">
                <Lightbulb className={`w-5 h-5 mt-0.5 ${selectedAnswer.isCorrect ? "text-green-600" : "text-amber-600"}`} />
                <div>
                  <p className={`font-medium ${selectedAnswer.isCorrect ? "text-green-800" : "text-amber-800"}`}>
                    {selectedAnswer.isCorrect ? "Jawaban Benar!" : "Belum Tepat"}
                  </p>
                  <p className={`text-sm mt-1 ${selectedAnswer.isCorrect ? "text-green-700" : "text-amber-700"}`}>
                    {selectedAnswer.explanation}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          {!showResult ? (
            <button
              onClick={handleSubmit}
              disabled={!selectedOption}
              className={`
                flex-1 py-3 px-6 rounded-xl font-medium flex items-center justify-center gap-2
                ${selectedOption 
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200" 
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }
                transition-all duration-200
              `}
              aria-label="Kirim jawaban"
            >
              Periksa Jawaban
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <>
              {currentIndex < sampleQuestions.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-blue-200"
                  aria-label="Soal berikutnya"
                >
                  Soal Berikutnya
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleReset}
                  className="flex-1 py-3 px-6 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 flex items-center justify-center gap-2 transition-all duration-200"
                  aria-label="Coba lagi dari awal"
                >
                  <RotateCcw className="w-4 h-4" />
                  Coba Lagi
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default InteractiveSampleQuestion;
