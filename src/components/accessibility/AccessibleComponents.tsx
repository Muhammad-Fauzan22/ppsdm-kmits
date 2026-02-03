'use client';

/**
 * Accessible Components
 * 
 * Komponen accessibility yang dioptimasi untuk aksesibilitas
 * Mendukung keyboard navigation, ARIA labels, dan screen readers
 * 
 * @see https://www.w3.org/WAI/ARIA/apg/
 */

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

/**
 * Accessible Button
 * 
 * Button dengan keyboard navigation dan ARIA attributes
 */
export function AccessibleButton({
  children,
  className,
  disabled = false,
  variant = 'default',
  size = 'default',
  external = false,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  external?: boolean;
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        variant === 'default' && 'bg-primary text-primary-foreground hover:bg-primary/90',
        variant === 'destructive' && 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        variant === 'outline' && 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        variant === 'secondary' && 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        variant === 'ghost' && 'hover:bg-accent hover:text-accent-foreground',
        variant === 'link' && 'text-primary underline-offset-4 hover:underline',
        size === 'default' && 'h-10 px-4 py-2',
        size === 'sm' && 'h-9 rounded-md px-3',
        size === 'lg' && 'h-11 rounded-md px-8',
        size === 'icon' && 'h-10 w-10',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * Accessible External Link
 * 
 * Link eksternal dengan rel="noopener noreferrer"
 */
export function AccessibleExternalLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={cn(
        'text-primary underline-offset-4 hover:underline',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        className
      )}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <span className="sr-only">(opens in new tab)</span>
    </a>
  );
}

/**
 * Accessible Input
 * 
 * Input dengan error handling dan ARIA attributes
 */
export function AccessibleInput({
  label,
  error,
  id,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
}) {
  const errorId = id ? `${id}-error` : undefined;

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={errorId}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
          'ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-destructive focus-visible:ring-destructive'
        )}
        {...props}
      />
      {error && (
        <p id={errorId} className="text-sm text-destructive mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Accessible Checkbox
 * 
 * Checkbox dengan keyboard navigation dan ARIA attributes
 */
export function AccessibleCheckbox({
  label,
  error,
  checked,
  onChange,
  id,
  className,
}: {
  label?: string;
  error?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  id?: string;
  className?: string;
}) {
  const errorId = id ? `${id}-error` : undefined;

  return (
    <div className="space-x-2">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={errorId}
        className={cn(
          'h-4 w-4 rounded border border-input',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-destructive focus-visible:ring-destructive'
        )}
      />
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      )}
      {error && (
        <p id={errorId} className="text-sm text-destructive mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Accessible Modal
 * 
 * Modal dengan keyboard navigation dan trap focus
 */
export function AccessibleModal({
  isOpen,
  onClose,
  title,
  children,
  className,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = 'hidden';
      previousActiveElement.current?.focus();
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  useEffect(() => {
    const handleTab = (e: KeyboardEvent) => {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements?.[0] as HTMLElement;
      const lastElement = focusableElements?.[focusableElements.length - 1] as HTMLElement;

      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleTab);

    return () => {
      document.removeEventListener('keydown', handleTab);
      document.body.style.overflow = 'unset';
      previousActiveElement.current?.focus();
    };
  }, []);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className={cn(
          'relative w-full max-w-lg rounded-lg bg-background p-6 shadow-lg',
          'focus:outline-none',
          className
        )}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        <div className="mb-4">
          <h2 id="modal-title" className="font-semibold">
            {title}
          </h2>
        </div>
        <div>{children}</div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-md p-2 hover:bg-accent"
          aria-label="Close modal"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

/**
 * Accessible Tooltip
 * 
 * Tooltip dengan keyboard navigation dan ARIA attributes
 */
export function AccessibleTooltip({
  content,
  children,
  className,
}: {
  content: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={triggerRef}
      className="inline-block relative"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className={cn(
            'absolute z-50 px-2 py-1 text-sm bg-foreground text-background rounded',
            'whitespace-nowrap',
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}

/**
 * Skip to Main Content Link
 * 
 * Link untuk skip navigation ke main content
 */
export function SkipToMainContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 px-4 py-2 bg-primary text-primary-foreground rounded-md z-50"
    >
      Skip to main content
    </a>
  );
}

/**
 * Accessible Live Region
 * 
 * Live region untuk screen readers
 */
export function AccessibleLiveRegion({
  message,
  politeness = 'polite',
  className,
}: {
  message: string;
  politeness?: 'polite' | 'assertive' | 'off';
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live={politeness}
      className={cn('sr-only', className)}
    >
      {message}
    </div>
  );
}

/**
 * Accessible Progress Bar
 * 
 * Progress bar dengan ARIA attributes
 */
export function AccessibleProgressBar({
  value,
  max = 100,
  label,
  className,
}: {
  value: number;
  max?: number;
  label?: string;
  className?: string;
}) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
      className={cn('w-full bg-secondary rounded-full h-2.5', className)}
    >
      <div
        className="bg-primary h-2.5 rounded-full transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

/**
 * Accessible Alert
 * 
 * Alert dengan ARIA attributes
 */
export function AccessibleAlert({
  children,
  variant = 'info',
  className,
}: {
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  className?: string;
}) {
  const variantStyles = {
    info: 'bg-blue-50 text-blue-900 border-blue-200',
    success: 'bg-green-50 text-green-900 border-green-200',
    warning: 'bg-yellow-50 text-yellow-900 border-yellow-200',
    error: 'bg-red-50 text-red-900 border-red-200',
  };

  return (
    <div
      role="alert"
      className={cn('p-4 rounded-md border', variantStyles[variant], className)}
    >
      {children}
    </div>
  );
}
