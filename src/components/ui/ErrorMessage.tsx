'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, AlertTriangle, Info, CheckCircle, X } from 'lucide-react';

export interface ErrorMessageProps {
  title: string;
  message?: string;
  variant?: 'error' | 'warning' | 'info' | 'success';
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export default function ErrorMessage({
  title,
  message,
  variant = 'error',
  dismissible = false,
  onDismiss,
  action,
  className = ''
}: ErrorMessageProps) {
  const variantStyles = {
    error: {
      container: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
      icon: 'text-red-600 dark:text-red-400',
      iconBg: 'bg-red-100 dark:bg-red-800',
    },
    warning: {
      container: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
      icon: 'text-yellow-600 dark:text-yellow-400',
      iconBg: 'bg-yellow-100 dark:bg-yellow-800',
    },
    info: {
      container: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
      icon: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-100 dark:bg-blue-800',
    },
    success: {
      container: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
      icon: 'text-green-600 dark:text-green-400',
      iconBg: 'bg-green-100 dark:bg-green-800',
    },
  };

  const styles = variantStyles[variant];
  const icons = {
    error: <AlertCircle className={`text-xl ${styles.icon}`} />,
    warning: <AlertTriangle className={`text-xl ${styles.icon}`} />,
    info: <Info className={`text-xl ${styles.icon}`} />,
    success: <CheckCircle className={`text-xl ${styles.icon}`} />,
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className={`relative ${className}`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className={`rounded-xl border p-6 ${styles.container}`}>
          {/* Dismiss Button */}
          {dismissible && onDismiss && (
            <button
              onClick={onDismiss}
              className="absolute top-4 right-4 p-1 hover:bg-black/5 rounded-full transition-colors"
              aria-label="Dismiss message"
            >
              <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
            </button>
          )}

          {/* Content */}
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${styles.iconBg}`}>
              {icons[variant]}
            </div>

            {/* Text Content */}
            <div className="flex-1 min-w-0">
              <h4 className={`text-lg font-bold mb-1 ${styles.icon}`}>
                {title}
              </h4>
              {message && (
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {message}
                </p>
              )}

              {/* Action Button */}
              {action && (
                <button
                  onClick={action.onClick}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {action.label}
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Inline error message component for form fields
export interface InlineErrorProps {
  message: string;
  variant?: 'error' | 'warning';
  className?: string;
}

export function InlineError({
  message,
  variant = 'error',
  className = ''
}: InlineErrorProps) {
  const variantStyles = {
    error: {
      text: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
    },
    warning: {
      text: 'text-yellow-600 dark:text-yellow-400',
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div
      className={`flex items-center gap-2 text-sm ${styles.bg} ${styles.border} rounded-lg px-3 py-2 ${className}`}
      role="alert"
      aria-live="polite"
    >
      {variant === 'error' ? (
        <AlertCircle className={`w-5 h-5 ${styles.text}`} />
      ) : (
        <AlertTriangle className={`w-5 h-5 ${styles.text}`} />
      )}
      <span className={styles.text}>{message}</span>
    </div>
  );
}

// Toast notification component
export interface ToastProps {
  message: string;
  variant?: 'error' | 'warning' | 'success' | 'info';
  duration?: number;
  onClose?: () => void;
}

export function Toast({
  message,
  variant = 'info',
  duration = 3000,
  onClose
}: ToastProps) {
  const variantStyles = {
    error: {
      bg: 'bg-red-600',
      icon: 'error',
    },
    warning: {
      bg: 'bg-yellow-600',
      icon: 'warning',
    },
    success: {
      bg: 'bg-green-600',
      icon: 'check_circle',
    },
    info: {
      bg: 'bg-blue-600',
      icon: 'info',
    },
  };

  const styles = variantStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className={`fixed bottom-4 right-4 z-50 ${styles.bg} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      {/* Toast Component Implementation */}
      {variantStyles[variant].icon === 'error' && <AlertCircle className="w-5 h-5" />}
      {variantStyles[variant].icon === 'warning' && <AlertTriangle className="w-5 h-5" />}
      {variantStyles[variant].icon === 'check_circle' && <CheckCircle className="w-5 h-5" />}
      {variantStyles[variant].icon === 'info' && <Info className="w-5 h-5" />}

      <span className="font-medium">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 p-1 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Dismiss notification"
        >
          <span className="ml-4 p-1 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-4 h-4" />
          </span>
        </button>
      )}
    </motion.div>
  );
}
