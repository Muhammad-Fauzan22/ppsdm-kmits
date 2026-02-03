'use client';

/**
 * Form Validation Components
 * 
 * Komponen form validation dengan error handling yang lebih baik
 * Mendukung real-time validation, error messages, dan accessibility
 * 
 * @see https://react-hook-form.com/use-form
 */

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Form Field Component
 * 
 * Wrapper untuk form field dengan label, error, dan helper text
 */
export function FormField({
  label,
  error,
  required = false,
  description,
  children,
  className,
}: {
  label: string;
  error?: string;
  required?: boolean;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const errorId = `${label.toLowerCase().replace(/\s+/g, '-')}-error`;

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label
          htmlFor={errorId}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p
          id={errorId}
          className="text-sm text-destructive mt-1"
          role="alert"
        >
          {error}
        </p>
      )}
      {description && (
        <p className="text-xs text-muted-foreground mt-1">
          {description}
        </p>
      )}
    </div>
  );
}

/**
 * Form Error Message Component
 * 
 * Menampilkan error message dengan icon dan styling yang konsisten
 */
export function FormError({
  message,
  type = 'error',
  className,
}: {
  message: string;
  type?: 'error' | 'warning' | 'success' | 'info';
  className?: string;
}) {
  const typeStyles = {
    error: 'bg-red-50 text-red-900 border-red-200',
    warning: 'bg-yellow-50 text-yellow-900 border-yellow-200',
    success: 'bg-green-50 text-green-900 border-green-200',
    info: 'bg-blue-50 text-blue-900 border-blue-200',
  };

  const icons = {
    error: '⚠️',
    warning: '⚡',
    success: '✅',
    info: 'ℹ️',
  };

  return (
    <div
      className={cn(
        'p-4 rounded-md border',
        typeStyles[type],
        className
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <span className="text-xl" aria-hidden="true">
          {icons[type]}
        </span>
        <div className="flex-1">
          <p className="font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Form Success Message Component
 * 
 * Menampilkan success message setelah form submission
 */
export function FormSuccess({
  title,
  message,
  onDismiss,
  className,
}: {
  title: string;
  message: string;
  onDismiss?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'p-4 rounded-md border bg-green-50 text-green-900 border-green-200',
        className
      )}
      role="alert"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <span className="text-2xl" aria-hidden="true">
            ✅
          </span>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{title}</h3>
            <p className="text-sm mt-1">{message}</p>
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-sm text-green-700 hover:text-green-800 font-medium"
            aria-label="Tutup pesan sukses"
          >
            Tutup
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Form Loading State Component
 * 
 * Menampilkan loading state saat form sedang diproses
 */
export function FormLoading({
  message = 'Memproses...',
  className,
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
        <p className="text-sm text-muted-foreground ml-3">
          {message}
        </p>
      </div>
    </div>
  );
}

/**
 * Form Progress Component
 * 
 * Menampilkan progress bar untuk form submission
 */
export function FormProgress({
  progress,
  message,
  className,
}: {
  progress: number;
  message?: string;
  className?: string;
}) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>{message || 'Memproses...'}</span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2.5">
          <div
            className="bg-primary h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Form Actions Component
 * 
 * Wrapper untuk form action buttons (submit, cancel, etc.)
 */
export function FormActions({
  children,
  align = 'right',
  className,
}: {
  children: React.ReactNode;
  align?: 'left' | 'right' | 'center';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 mt-6',
        align === 'left' && 'justify-start',
        align === 'right' && 'justify-end',
        align === 'center' && 'justify-center',
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * Form Submit Button Component
 * 
 * Button untuk submit form dengan loading state
 */
export function FormSubmitButton({
  children,
  isLoading = false,
  disabled = false,
  className,
}: {
  children: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="submit"
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        'bg-primary text-primary-foreground hover:bg-primary/90',
        'disabled:bg-primary/80',
        className
      )}
      aria-disabled={disabled || isLoading}
      aria-busy={isLoading}
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent mr-2"></div>
          <span>Memproses...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

/**
 * Form Cancel Button Component
 * 
 * Button untuk cancel form action
 */
export function FormCancelButton({
  children,
  onClick,
  disabled = false,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        'disabled:bg-secondary/80',
        className
      )}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

/**
 * Form Helper Text Component
 * 
 * Helper text untuk form field
 */
export function FormHelperText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn('text-xs text-muted-foreground mt-1', className)}>
      {children}
    </p>
  );
}

/**
 * Form Character Counter Component
 * 
 * Menampilkan jumlah karakter yang tersisa untuk input dengan limit
 */
export function FormCharacterCounter({
  current,
  max,
  label = 'karakter',
  className,
}: {
  current: number;
  max: number;
  label?: string;
  className?: string;
}) {
  const percentage = (current / max) * 100;
  const isNearLimit = percentage >= 80;
  const isAtLimit = current >= max;

  return (
    <div
      className={cn(
        'flex items-center justify-between text-xs',
        isNearLimit && 'text-yellow-600',
        isAtLimit && 'text-destructive',
        className
      )}
      aria-live="polite"
    >
      <span>
        {current}/{max} {label}
      </span>
      <span className="text-muted-foreground">
        ({percentage.toFixed(0)}%)
      </span>
    </div>
  );
}

/**
 * Form Password Strength Indicator Component
 * 
 * Menampilkan kekuatan password
 */
export function PasswordStrengthIndicator({
  strength,
  className,
}: {
  strength: 'weak' | 'medium' | 'strong' | 'very-strong';
  className?: string;
}) {
  const strengthConfig = {
    weak: { color: 'bg-red-500', width: '25%', label: 'Lemah' },
    medium: { color: 'bg-yellow-500', width: '50%', label: 'Sedang' },
    strong: { color: 'bg-green-500', width: '75%', label: 'Kuat' },
    'very-strong': { color: 'bg-blue-500', width: '100%', label: 'Sangat Kuat' },
  };

  const config = strengthConfig[strength];

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Kekuatan Password:</span>
        <span className={cn('font-medium', config.color === 'bg-red-500' && 'text-red-600')}>
          {config.label}
        </span>
      </div>
      <div className="w-full bg-secondary rounded-full h-2">
        <div
          className={cn(
            'h-2 rounded-full transition-all duration-300',
            config.color
          )}
          style={{ width: config.width }}
          role="progressbar"
          aria-valuenow={strength === 'weak' ? 25 : strength === 'medium' ? 50 : strength === 'strong' ? 75 : 100}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Password strength: ${config.label}`}
        />
      </div>
    </div>
  );
}

/**
 * Form Validation Rules Component
 * 
 * Menampilkan aturan validasi form
 */
export function FormValidationRules({
  rules,
  className,
}: {
  rules: string[];
  className?: string;
}) {
  return (
    <div className={cn('space-y-2', className)}>
      <h4 className="text-sm font-medium mb-2">Aturan Validasi:</h4>
      <ul className="space-y-1 text-xs text-muted-foreground">
        {rules.map((rule, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>{rule}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
