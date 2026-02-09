/**
 * Progress Tracker Component
 * Shows assessment progress with visual indicators
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ProgressTrackerProps {
  current: number;
  total: number;
  percentage: number;
  color?: string;
  className?: string;
  showSegments?: boolean;
}

export function ProgressTracker({
  current,
  total,
  percentage,
  color = '#013880',
  className = '',
  showSegments = false
}: ProgressTrackerProps) {
  const segments = Array.from({ length: total }, (_, i) => i < current);

  return (
    <div className={`w-full ${className}`}>
      {/* Progress Bar */}
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full rounded-full transition-all duration-500"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
        />
      </div>

      {/* Progress Info */}
      <div className="flex justify-between items-center mt-2 text-sm">
        <span className="text-gray-600">
          {current} dari {total} pertanyaan
        </span>
        <span className="font-medium" style={{ color }}>
          {percentage}%
        </span>
      </div>

      {/* Segment Indicators (optional) */}
      {showSegments && (
        <div className="flex gap-1 mt-3">
          {segments.map((answered, index) => (
            <div
              key={index}
              className={`flex-1 h-1 rounded-full transition-colors duration-300 ${
                answered ? 'bg-green-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
