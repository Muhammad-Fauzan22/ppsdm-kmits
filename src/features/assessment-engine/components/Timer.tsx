/**
 * Timer Component
 * Displays elapsed time for timed assessments
 */

'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TimerProps {
  startTime: Date;
  isRunning?: boolean;
  className?: string;
  theme?: 'default' | 'minimal' | 'gamified';
  showIcon?: boolean;
}

export function Timer({
  startTime,
  isRunning = true,
  className = '',
  theme = 'default',
  showIcon = true
}: TimerProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setElapsed(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, isRunning]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getThemeStyles = () => {
    switch (theme) {
      case 'gamified':
        return 'bg-slate-800/50 text-cyan-400 border-slate-700';
      case 'minimal':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border font-mono text-sm ${getThemeStyles()} ${className}`}
    >
      {showIcon && (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )}
      <span>{formatTime(elapsed)}</span>
    </motion.div>
  );
}
