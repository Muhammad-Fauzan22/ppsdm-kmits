'use client';

import { motion } from 'framer-motion';
import {
  Inbox,
  SearchX,
  Flag,
  History,
  BellOff,
  Trophy,
  WifiOff,
  AlertCircle,
  CheckCircle,
  Plus
} from 'lucide-react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'default' | 'search' | 'error' | 'success';
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  variant = 'default',
  className = ''
}: EmptyStateProps) {
  const variantStyles = {
    default: {
      container: 'bg-white dark:bg-slate-800',
      iconBg: 'bg-slate-100 dark:bg-slate-700',
      iconColor: 'text-slate-400 dark:text-slate-500',
    },
    search: {
      container: 'bg-blue-50 dark:bg-blue-900/20',
      iconBg: 'bg-blue-100 dark:bg-blue-800',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    error: {
      container: 'bg-red-50 dark:bg-red-900/20',
      iconBg: 'bg-red-100 dark:bg-red-800',
      iconColor: 'text-red-600 dark:text-red-400',
    },
    success: {
      container: 'bg-green-50 dark:bg-green-900/20',
      iconBg: 'bg-green-100 dark:bg-green-800',
      iconColor: 'text-green-600 dark:text-green-400',
    },
  };

  const styles = variantStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-center justify-center p-12 ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className={`max-w-md w-full rounded-2xl p-8 text-center ${styles.container}`}>
        {/* Icon */}
        {icon && (
          <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${styles.iconBg}`}>
            <div className="text-4xl">
              {icon}
            </div>
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 max-w-sm mx-auto">
            {description}
          </p>
        )}

        {/* Action Button */}
        {action && (
          <button
            onClick={action.onClick}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="w-5 h-5" />
            {action.label}
          </button>
        )}
      </div>
    </motion.div>
  );
}

// Pre-configured empty states for common use cases
export const EmptyStates = {
  noData: {
    icon: <Inbox className="w-8 h-8" />,
    title: 'No Data Available',
    description: 'There are no items to display at this time.',
  },
  noResults: {
    icon: <SearchX className="w-8 h-8" />,
    title: 'No Results Found',
    description: 'We couldn\'t find any results matching your search criteria.',
    variant: 'search' as const,
  },
  noGoals: {
    icon: <Flag className="w-8 h-8" />,
    title: 'No Goals Set',
    description: 'Start by setting your first goal to track your progress.',
  },
  noActivities: {
    icon: <History className="w-8 h-8" />,
    title: 'No Recent Activities',
    description: 'Your activity feed is empty. Start logging your activities!',
  },
  noNotifications: {
    icon: <BellOff className="w-8 h-8" />,
    title: 'No Notifications',
    description: 'You\'re all caught up! No new notifications.',
  },
  noAchievements: {
    icon: <Trophy className="w-8 h-8" />,
    title: 'No Achievements Yet',
    description: 'Complete your first goal to earn your first achievement badge!',
  },
  connectionError: {
    icon: <WifiOff className="w-8 h-8" />,
    title: 'Connection Error',
    description: 'Unable to connect to the server. Please check your internet connection.',
    variant: 'error' as const,
  },
  serverError: {
    icon: <AlertCircle className="w-8 h-8" />,
    title: 'Something Went Wrong',
    description: 'An unexpected error occurred. Please try again later.',
    variant: 'error' as const,
  },
  success: {
    icon: <CheckCircle className="w-8 h-8" />,
    title: 'All Caught Up!',
    description: 'You\'ve completed all your tasks. Great job!',
    variant: 'success' as const,
  },
};
