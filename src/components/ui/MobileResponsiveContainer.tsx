"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface MobileResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

/**
 * MobileResponsiveContainer
 * 
 * Container yang mengimplementasikan mobile-first design principles:
 * - Touch-friendly minimum 44x44px targets
 * - Responsive padding and spacing
 * - Readable font sizes on mobile
 * - Proper viewport handling
 */
export function MobileResponsiveContainer({ 
  children, 
  className,
  as: Component = 'div'
}: MobileResponsiveContainerProps) {
  return (
    <Component
      className={cn(
        // Mobile-first: base styles for mobile
        "w-full px-4 py-4",
        // Tablet: increased padding
        "md:px-6 md:py-6",
        // Desktop: max-width container
        "lg:px-8 lg:py-8 lg:max-w-7xl lg:mx-auto",
        // Touch-friendly spacing
        "space-y-4 md:space-y-6",
        className
      )}
    >
      {children}
    </Component>
  );
}

/**
 * TouchFriendlyButton
 * 
 * Button dengan minimum touch target 44x44px (WCAG 2.1 AA)
 */
interface TouchFriendlyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function TouchFriendlyButton({
  children,
  className,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  ...props
}: TouchFriendlyButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  // Minimum 44px touch target (WCAG 2.1 AA)
  const sizeStyles = {
    sm: "min-h-[44px] min-w-[44px] px-3 py-2 text-sm rounded-lg",
    md: "min-h-[48px] min-w-[48px] px-4 py-2.5 text-base rounded-xl",
    lg: "min-h-[56px] min-w-[56px] px-6 py-3 text-lg rounded-xl"
  };
  
  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:ring-slate-500",
    ghost: "hover:bg-slate-100 text-slate-700 focus-visible:ring-slate-500"
  };

  return (
    <button
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * AccessibleCard
 * 
 * Card component dengan proper ARIA labels dan keyboard navigation
 */
interface AccessibleCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  onClick?: () => void;
  href?: string;
}

export function AccessibleCard({
  children,
  className,
  title,
  description,
  onClick,
  href
}: AccessibleCardProps) {
  const isClickable = !!onClick || !!href;
  
  const content = (
    <div
      className={cn(
        "rounded-xl border border-slate-200 bg-white p-5",
        "transition-all duration-200",
        isClickable && "hover:shadow-lg hover:border-blue-300 cursor-pointer",
        "focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2",
        className
      )}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      aria-label={title ? `${title}. ${description || ''}` : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {children}
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block no-underline">
        {content}
      </a>
    );
  }

  return content;
}

/**
 * ResponsiveGrid
 * 
 * Grid yang responsive: 1 kolom mobile, 2 tablet, 3+ desktop
 */
interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
}

export function ResponsiveGrid({
  children,
  className,
  cols = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = 'md'
}: ResponsiveGridProps) {
  const gapStyles = {
    sm: "gap-3",
    md: "gap-4 md:gap-6",
    lg: "gap-6 md:gap-8"
  };

  const colStyles = {
    sm: cols.sm ? `grid-cols-${cols.sm}` : 'grid-cols-1',
    md: cols.md ? `md:grid-cols-${cols.md}` : '',
    lg: cols.lg ? `lg:grid-cols-${cols.lg}` : '',
    xl: cols.xl ? `xl:grid-cols-${cols.xl}` : ''
  };

  return (
    <div className={cn(
      "grid",
      gapStyles[gap],
      colStyles.sm,
      colStyles.md,
      colStyles.lg,
      colStyles.xl,
      className
    )}>
      {children}
    </div>
  );
}

export default MobileResponsiveContainer;
