/**
 * Navigation Component
 * Handles next, previous, and complete actions for assessment
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface NavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  onComplete?: () => void;
  isFirst: boolean;
  isLast: boolean;
  hasAnswered: boolean;
  isSubmitting?: boolean;
  theme?: 'default' | 'minimal' | 'gamified';
  accentColor?: string;
}

export function Navigation({
  onPrevious,
  onNext,
  onComplete,
  isFirst,
  isLast,
  hasAnswered,
  isSubmitting = false,
  theme = 'default',
  accentColor = '#013880'
}: NavigationProps) {
  const getThemeStyles = () => {
    switch (theme) {
      case 'gamified':
        return {
          container: 'bg-slate-800/50 border-slate-700',
          prevBtn: 'bg-slate-700 text-white hover:bg-slate-600',
          nextBtn: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white',
          completeBtn: 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
        };
      case 'minimal':
        return {
          container: 'bg-white border-gray-100',
          prevBtn: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
          nextBtn: 'bg-gray-900 text-white hover:bg-gray-800',
          completeBtn: 'bg-green-600 text-white hover:bg-green-700'
        };
      default:
        return {
          container: 'bg-white border-slate-200',
          prevBtn: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
          nextBtn: 'bg-blue-600 text-white hover:bg-blue-700',
          completeBtn: 'bg-green-600 text-white hover:bg-green-700'
        };
    }
  };

  const styles = getThemeStyles();

  return (
    <div className={`mt-8 p-4 rounded-xl border ${styles.container} flex items-center justify-between`}>
      {/* Previous Button */}
      <motion.button
        onClick={onPrevious}
        disabled={isFirst || isSubmitting}
        className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
          isFirst 
            ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400' 
            : styles.prevBtn
        }`}
        whileHover={!isFirst ? { scale: 1.02 } : {}}
        whileTap={!isFirst ? { scale: 0.98 } : {}}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Sebelumnya
      </motion.button>

      {/* Next / Complete Button */}
      {isLast ? (
        <motion.button
          onClick={onComplete || onNext}
          disabled={!hasAnswered || isSubmitting}
          className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
            !hasAnswered || isSubmitting
              ? 'opacity-50 cursor-not-allowed bg-gray-300 text-gray-500'
              : styles.completeBtn
          }`}
          whileHover={hasAnswered && !isSubmitting ? { scale: 1.02 } : {}}
          whileTap={hasAnswered && !isSubmitting ? { scale: 0.98 } : {}}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Menyimpan...
            </>
          ) : (
            <>
              Selesai
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </>
          )}
        </motion.button>
      ) : (
        <motion.button
          onClick={onNext}
          disabled={!hasAnswered || isSubmitting}
          className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
            !hasAnswered || isSubmitting
              ? 'opacity-50 cursor-not-allowed bg-gray-300 text-gray-500'
              : styles.nextBtn
          }`}
          whileHover={hasAnswered && !isSubmitting ? { scale: 1.02 } : {}}
          whileTap={hasAnswered && !isSubmitting ? { scale: 0.98 } : {}}
        >
          Selanjutnya
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      )}
    </div>
  );
}
