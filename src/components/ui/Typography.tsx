'use client';

import { ReactNode } from 'react';

// Typography scale for consistent sizing
export const typography = {
  fontSize: {
    xs: 'text-xs',      // 12px
    sm: 'text-sm',      // 14px
    base: 'text-base',   // 16px
    lg: 'text-lg',      // 18px
    xl: 'text-xl',      // 20px
    '2xl': 'text-2xl',  // 24px
    '3xl': 'text-3xl',  // 30px
    '4xl': 'text-4xl',  // 36px
    '5xl': 'text-5xl',  // 48px
  },
  fontWeight: {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold',
  },
  lineHeight: {
    tight: 'leading-tight',
    normal: 'leading-normal',
    relaxed: 'leading-relaxed',
    loose: 'leading-loose',
  },
  letterSpacing: {
    tight: 'tracking-tighter',
    normal: 'tracking-normal',
    wide: 'tracking-wide',
  },
};

// Heading components
export interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
  className?: string;
  gradient?: boolean;
}

export function Heading({ level, children, className = '', gradient = false }: HeadingProps) {
  const levelStyles = {
    1: 'text-4xl font-bold tracking-tight',
    2: 'text-3xl font-bold tracking-tight',
    3: 'text-2xl font-bold tracking-tight',
    4: 'text-xl font-bold tracking-tight',
    5: 'text-lg font-bold tracking-tight',
    6: 'text-base font-bold tracking-tight',
  };

  const gradientStyles = gradient
    ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'
    : 'text-slate-900 dark:text-white';

  return (
    <h1
      className={`${levelStyles[level]} ${gradientStyles} ${className}`}
    >
      {children}
    </h1>
  );
}

// Subheading component
export interface SubheadingProps {
  level: 1 | 2 | 3;
  children: ReactNode;
  className?: string;
}

export function Subheading({ level, children, className = '' }: SubheadingProps) {
  const levelStyles = {
    1: 'text-2xl font-semibold tracking-tight',
    2: 'text-xl font-semibold tracking-tight',
    3: 'text-lg font-semibold tracking-tight',
  };

  return (
    <h2
      className={`${levelStyles[level]} text-slate-900 dark:text-white ${className}`}
    >
      {children}
    </h2>
  );
}

// Text component with variants
export interface TextProps {
  variant?: 'primary' | 'secondary' | 'muted' | 'success' | 'error' | 'warning';
  size?: 'xs' | 'sm' | 'base' | 'lg';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  children: ReactNode;
  className?: string;
  truncate?: boolean;
}

export function Text({ 
  variant = 'primary',
  size = 'base',
  weight = 'normal',
  children,
  className = '',
  truncate = false
}: TextProps) {
  const variantStyles = {
    primary: 'text-slate-900 dark:text-white',
    secondary: 'text-slate-600 dark:text-slate-400',
    muted: 'text-slate-400 dark:text-slate-500',
    success: 'text-green-600 dark:text-green-400',
    error: 'text-red-600 dark:text-red-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
  };

  const sizeStyles = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
  };

  const weightStyles = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  const truncateClass = truncate ? 'line-clamp-2' : '';

  return (
    <p
      className={`${variantStyles[variant]} ${sizeStyles[size]} ${weightStyles[weight]} ${truncateClass} ${className}`}
    >
      {children}
    </p>
  );
}

// Label component
export interface LabelProps {
  children: ReactNode;
  htmlFor?: string;
  required?: boolean;
  className?: string;
}

export function Label({ children, htmlFor, required = false, className = '' }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 ${className}`}
    >
      {children}
      {required && (
        <span className="text-red-500 ml-1" aria-label="required">
          *
        </span>
      )}
    </label>
  );
}

// Caption component
export interface CaptionProps {
  children: ReactNode;
  className?: string;
}

export function Caption({ children, className = '' }: CaptionProps) {
  return (
    <p className={`text-xs text-slate-500 dark:text-slate-400 mt-1 ${className}`}>
      {children}
    </p>
  );
}

// Link text component
export interface LinkTextProps {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
}

export function LinkText({ href, children, className = '', external = false }: LinkTextProps) {
  return (
    <a
      href={href}
      className={`text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline underline-offset-2 hover:underline-offset-4 transition-all ${className}`}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
    >
      {children}
      {external && (
        <span className="material-symbols-outlined text-xs align-middle ml-1">
          open_in_new
        </span>
      )}
    </a>
  );
}

// Badge component
export interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'md', className = '' }: BadgeProps) {
  const variantStyles = {
    default: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
    primary: 'bg-blue-600 text-white',
    success: 'bg-green-600 text-white',
    warning: 'bg-yellow-600 text-white',
    error: 'bg-red-600 text-white',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
}

// Divider component
export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function Divider({ orientation = 'horizontal', className = '' }: DividerProps) {
  const orientationStyles = {
    horizontal: 'w-full h-px bg-slate-200 dark:bg-slate-800',
    vertical: 'h-full w-px bg-slate-200 dark:bg-slate-800',
  };

  return (
    <div
      className={orientationStyles[orientation] + ' ' + className}
      role="separator"
      aria-orientation={orientation}
    />
  );
}
