"use client";

import React, { useEffect, useRef } from 'react';

/**
 * SkipToContent
 * 
 * Link untuk skip navigation (WCAG 2.4.1 Bypass Blocks)
 * Memungkinkan keyboard users melewati navigation menu
 */
export function SkipToContent({ contentId = "main-content" }: { contentId?: string }) {
  return (
    <a
      href={`#${contentId}`}
      className="
        sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
        bg-blue-600 text-white px-4 py-2 rounded-lg z-50
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
      "
    >
      Lewati ke konten utama
    </a>
  );
}

/**
 * VisuallyHidden
 * 
 * Content yang tersembunyi visually tapi tetap accessible untuk screen readers
 */
export function VisuallyHidden({ children }: { children: React.ReactNode }) {
  return (
    <span className="sr-only">{children}</span>
  );
}

/**
 * LiveRegion
 * 
 * ARIA live region untuk announce dynamic content changes
 * Penting untuk screen reader users
 */
interface LiveRegionProps {
  children: React.ReactNode;
  politeness?: 'polite' | 'assertive';
  id?: string;
}

export function LiveRegion({ 
  children, 
  politeness = 'polite',
  id 
}: LiveRegionProps) {
  return (
    <div
      id={id}
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {children}
    </div>
  );
}

/**
 * FocusTrap
 * 
 * Trap focus dalam modal/dialog untuk keyboard navigation
 * WCAG 2.4.3 Focus Order
 */
interface FocusTrapProps {
  children: React.ReactNode;
  isActive: boolean;
  onEscape?: () => void;
}

export function FocusTrap({ children, isActive, onEscape }: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;

    const container = containerRef.current;
    if (!container) return;

    // Find all focusable elements
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element
    firstElement?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onEscape) {
        onEscape();
        return;
      }

      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isActive, onEscape]);

  if (!isActive) return <>{children}</>;

  return (
    <div ref={containerRef}>
      {children}
    </div>
  );
}

/**
 * AccessibleFormField
 * 
 * Form field dengan proper labeling dan error handling
 * WCAG 3.3.1 Error Identification, 3.3.2 Labels or Instructions
 */
interface AccessibleFormFieldProps {
  id: string;
  label: string;
  children: React.ReactNode;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export function AccessibleFormField({
  id,
  label,
  children,
  error,
  helperText,
  required
}: AccessibleFormFieldProps) {
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;

  return (
    <div className="space-y-2">
      <label 
        htmlFor={id}
        className="block text-sm font-medium text-slate-700"
      >
        {label}
        {required && <span className="text-red-500 ml-1" aria-label="wajib diisi">*</span>}
      </label>
      
      {helperText && (
        <p id={helperId} className="text-sm text-slate-500">
          {helperText}
        </p>
      )}
      
      {React.cloneElement(children as React.ReactElement, {
        id,
        'aria-describedby': error ? errorId : helperText ? helperId : undefined,
        'aria-invalid': error ? 'true' : undefined,
        'aria-required': required ? 'true' : undefined,
      })}
      
      {error && (
        <p 
          id={errorId}
          className="text-sm text-red-600 flex items-center gap-1"
          role="alert"
        >
          <span aria-hidden="true">⚠</span>
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * AccessibleProgress
 * 
 * Progress indicator dengan proper ARIA attributes
 */
interface AccessibleProgressProps {
  value: number;
  max?: number;
  label: string;
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
}

export function AccessibleProgress({
  value,
  max = 100,
  label,
  size = 'md',
  showPercentage = true
}: AccessibleProgressProps) {
  const percentage = Math.round((value / max) * 100);
  
  const sizeStyles = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        {showPercentage && (
          <span className="text-sm text-slate-500" aria-hidden="true">
            {percentage}%
          </span>
        )}
      </div>
      
      <div 
        className={`w-full bg-slate-200 rounded-full ${sizeStyles[size]}`}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <div
          className="bg-blue-600 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%`, height: '100%' }}
        />
      </div>
      
      <VisuallyHidden>
        {label}: {percentage} persen selesai
      </VisuallyHidden>
    </div>
  );
}

/**
 * AccessibleAlert
 * 
 * Alert/notification dengan proper ARIA roles
 */
interface AccessibleAlertProps {
  children: React.ReactNode;
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  onClose?: () => void;
}

export function AccessibleAlert({
  children,
  type = 'info',
  title,
  onClose
}: AccessibleAlertProps) {
  const role = type === 'error' ? 'alert' : 'status';
  const ariaLive = type === 'error' ? 'assertive' : 'polite';

  const typeStyles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    error: 'bg-red-50 border-red-200 text-red-800'
  };

  const iconStyles = {
    info: 'ℹ',
    success: '✓',
    warning: '⚠',
    error: '✕'
  };

  return (
    <div
      role={role}
      aria-live={ariaLive}
      aria-atomic="true"
      className={`p-4 rounded-lg border ${typeStyles[type]}`}
    >
      <div className="flex items-start gap-3">
        <span className="text-lg" aria-hidden="true">{iconStyles[type]}</span>
        <div className="flex-1">
          {title && (
            <h4 className="font-semibold mb-1">{title}</h4>
          )}
          <div className="text-sm">{children}</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-sm hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded"
            aria-label="Tutup notifikasi"
          >
            <span aria-hidden="true">✕</span>
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * useFocusVisible
 * 
 * Hook untuk detect keyboard focus vs mouse focus
 * Untuk styling focus rings yang tepat
 */
export function useFocusVisible() {
  const [isKeyboard, setIsKeyboard] = React.useState(false);

  useEffect(() => {
    const handleKeyDown = () => setIsKeyboard(true);
    const handleMouseDown = () => setIsKeyboard(false);

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return isKeyboard;
}

export default {
  SkipToContent,
  VisuallyHidden,
  LiveRegion,
  FocusTrap,
  AccessibleFormField,
  AccessibleProgress,
  AccessibleAlert,
  useFocusVisible
};
