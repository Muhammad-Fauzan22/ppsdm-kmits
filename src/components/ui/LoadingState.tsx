'use client';

import { motion } from 'framer-motion';

export interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'skeleton' | 'dots';
  className?: string;
}

export default function LoadingState({ 
  message = 'Loading...', 
  size = 'md',
  variant = 'spinner',
  className = ''
}: LoadingStateProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  if (variant === 'skeleton') {
    return (
      <div className={`space-y-3 ${className}`} role="status" aria-busy="true" aria-label={message}>
        <div className="animate-pulse">
          <div className={`bg-slate-200 dark:bg-slate-700 rounded ${sizeClasses[size]}`}></div>
        </div>
        <div className="animate-pulse">
          <div className={`bg-slate-200 dark:bg-slate-700 rounded ${sizeClasses[size]}`}></div>
        </div>
        <div className="animate-pulse">
          <div className={`bg-slate-200 dark:bg-slate-700 rounded ${sizeClasses[size]}`}></div>
        </div>
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={`flex items-center gap-2 ${className}`} role="status" aria-busy="true" aria-label={message}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={`bg-blue-600 rounded-full ${sizeClasses[size]}`}
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ 
              scale: [0.8, 1, 0.8],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
        {message && <span className="text-sm text-slate-600 dark:text-slate-400 ml-3">{message}</span>}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`} role="status" aria-busy="true" aria-label={message}>
      <div className={`border-4 border-blue-600 border-t-transparent rounded-full ${sizeClasses[size]} animate-spin`}>
        <div className="w-1/2 h-1/2 bg-blue-600 rounded-full absolute top-1/2 left-1/2"></div>
      </div>
      {message && <span className="text-sm text-slate-600 dark:text-slate-400">{message}</span>}
    </div>
  );
}

// Skeleton card component for loading states
export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl p-6 ${className}`} role="status" aria-busy="true">
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
        <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
        <div className="flex gap-4">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );
}

// Skeleton table row component
export function SkeletonTableRow({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 py-4 border-b border-slate-100 dark:border-slate-800 ${className}`} role="status" aria-busy="true">
      <div className="animate-pulse h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
      </div>
      <div className="animate-pulse h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
    </div>
  );
}
