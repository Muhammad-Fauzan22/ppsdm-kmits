/**
 * Error Display Components
 * 
 * Reusable error display components for dashboard pages
 */

'use client';

import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, WifiOff } from 'lucide-react';

interface ErrorDisplayProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  isRetrying?: boolean;
  variant?: 'default' | 'inline' | 'fullscreen';
}

/**
 * Error Display Component
 * Shows error messages with retry functionality
 */
export function ErrorDisplay({
  title = 'Something went wrong',
  message,
  onRetry,
  isRetrying = false,
  variant = 'default',
}: ErrorDisplayProps) {
  if (variant === 'inline') {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3"
      >
        <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-red-400 text-sm font-medium">{title}</p>
          <p className="text-red-300/80 text-xs">{message}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            disabled={isRetrying}
            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
          </button>
        )}
      </motion.div>
    );
  }

  if (variant === 'fullscreen') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-[60vh] flex items-center justify-center p-8"
      >
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">{title}</h2>
          <p className="text-slate-400 mb-6">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              disabled={isRetrying}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#003366] hover:bg-[#004080] text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
              {isRetrying ? 'Retrying...' : 'Try Again'}
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1e293b]/40 backdrop-blur-sm border border-red-500/20 rounded-xl p-6"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center shrink-0">
          <AlertCircle className="w-6 h-6 text-red-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
          <p className="text-slate-400 text-sm mb-4">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              disabled={isRetrying}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
              {isRetrying ? 'Retrying...' : 'Try Again'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Network Error Display
 * Shows a network-specific error message
 */
export function NetworkErrorDisplay({ onRetry, isRetrying }: { onRetry?: () => void; isRetrying?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1e293b]/40 backdrop-blur-sm border border-orange-500/20 rounded-xl p-6"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center shrink-0">
          <WifiOff className="w-6 h-6 text-orange-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white mb-1">Network Error</h3>
          <p className="text-slate-400 text-sm mb-4">
            Unable to connect to the server. Please check your internet connection and try again.
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              disabled={isRetrying}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
              {isRetrying ? 'Retrying...' : 'Try Again'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Empty State Display
 * Shows when there's no data to display
 */
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyStateDisplay({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/[0.08] rounded-xl p-8 text-center"
    >
      {icon && (
        <div className="w-16 h-16 bg-slate-700/30 rounded-full flex items-center justify-center mx-auto mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm mb-4 max-w-sm mx-auto">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#003366] hover:bg-[#004080] text-white rounded-lg font-medium transition-colors"
        >
          {action.label}
        </button>
      )}
    </motion.div>
  );
}

/**
 * Auth Error Display
 * Shows when user needs to authenticate
 */
export function AuthErrorDisplay() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1e293b]/40 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-6"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center shrink-0">
          <AlertCircle className="w-6 h-6 text-yellow-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white mb-1">Session Expired</h3>
          <p className="text-slate-400 text-sm mb-4">
            Your session has expired. Please log in again to continue.
          </p>
          <a
            href="/auth/login"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#003366] hover:bg-[#004080] text-white rounded-lg font-medium transition-colors"
          >
            Log In
          </a>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Loading Error Wrapper
 * Combines loading and error states
 */
interface LoadingErrorWrapperProps {
  isLoading: boolean;
  error: Error | null;
  onRetry?: () => void;
  isRetrying?: boolean;
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
}

export function LoadingErrorWrapper({
  isLoading,
  error,
  onRetry,
  isRetrying,
  children,
  loadingComponent,
}: LoadingErrorWrapperProps) {
  if (isLoading) {
    return <>{loadingComponent}</>;
  }

  if (error) {
    return (
      <div className="p-4">
        <ErrorDisplay
          message={error.message || 'An unexpected error occurred'}
          onRetry={onRetry}
          isRetrying={isRetrying}
          variant="fullscreen"
        />
      </div>
    );
  }

  return <>{children}</>;
}
