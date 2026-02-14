'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// ==========================================
// CARD COMPONENT SYSTEM
// With CSS containment and consistent spacing
// ==========================================

type CardVariant = 'default' | 'outlined' | 'elevated' | 'glass' | 'gradient';
type CardSize = 'sm' | 'md' | 'lg' | 'xl';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  size?: CardSize;
  hover?: boolean;
  clickable?: boolean;
  loading?: boolean;
  aspectRatio?: 'video' | 'square' | 'portrait' | 'auto';
  contain?: boolean;
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-white border border-slate-200 shadow-sm',
  outlined: 'bg-transparent border-2 border-slate-300',
  elevated: 'bg-white shadow-lg shadow-slate-200/50 border border-slate-100',
  glass: 'bg-white/80 backdrop-blur-md border border-white/20 shadow-lg',
  gradient: 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100',
};

const sizeStyles: Record<CardSize, string> = {
  sm: 'p-4 rounded-lg',
  md: 'p-6 rounded-xl',
  lg: 'p-8 rounded-2xl',
  xl: 'p-10 rounded-3xl',
};

const aspectStyles: Record<string, string> = {
  video: 'aspect-video',
  square: 'aspect-square',
  portrait: 'aspect-[3/4]',
  auto: '',
};

/**
 * Card Component - Contained card with consistent styling
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({
    className,
    variant = 'default',
    size = 'md',
    hover = false,
    clickable = false,
    loading = false,
    aspectRatio = 'auto',
    contain = true,
    children,
    onClick,
    ...props
  }, ref) => {
    return (
      <div
        ref={ref}
        onClick={onClick}
        className={cn(
          // Base styles
          'relative overflow-hidden',
          'transition-all duration-300 ease-out',

          // Variant styles
          variantStyles[variant],
          sizeStyles[size],

          // Aspect ratio
          aspectStyles[aspectRatio],

          // CSS containment to prevent layout shifts
          contain && 'contain-layout contain-style contain-paint',

          // Hover effects
          hover && 'hover:shadow-xl hover:-translate-y-1',

          // Clickable styles
          clickable && 'cursor-pointer hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]',

          // Loading state
          loading && 'animate-pulse bg-slate-100',

          className
        )}
        {...props}
      >
        {children}

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-slate-100/50 backdrop-blur-sm flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    );
  }
);
Card.displayName = 'Card';


// ==========================================
// CARD HEADER
// ==========================================

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  action?: React.ReactNode;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, action, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-start justify-between gap-4',
        'mb-4',
        className
      )}
      {...props}
    >
      <div className="flex-1 min-w-0">{children}</div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
);
CardHeader.displayName = 'CardHeader';

// ==========================================
// CARD TITLE
// ==========================================

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, as: Component = 'h3', children, ...props }, ref) => (
    <Component
      ref={ref}
      className={cn(
        'font-semibold text-slate-900',
        'text-lg leading-tight',
        'truncate',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
);
CardTitle.displayName = 'CardTitle';

// ==========================================
// CARD DESCRIPTION
// ==========================================

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'text-sm text-slate-600',
      'mt-1',
      'line-clamp-2',
      className
    )}
    {...props}
  >
    {children}
  </p>
));
CardDescription.displayName = 'CardDescription';

// ==========================================
// CARD CONTENT
// ==========================================

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative',
      className
    )}
    {...props}
  >
    {children}
  </div>
));
CardContent.displayName = 'CardContent';

// ==========================================
// CARD FOOTER
// ==========================================

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'left' | 'center' | 'right' | 'between';
}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, align = 'between', children, ...props }, ref) => {
    const alignStyles = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
      between: 'justify-between',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-3',
          'mt-6 pt-4 border-t border-slate-100',
          alignStyles[align],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CardFooter.displayName = 'CardFooter';

// ==========================================
// CARD IMAGE
// ==========================================

interface CardImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  aspectRatio?: 'video' | 'square' | 'portrait' | 'wide';
  overlay?: React.ReactNode;
  loading?: 'eager' | 'lazy';
}

export const CardImage = React.forwardRef<HTMLDivElement, CardImageProps>(
  ({ className, aspectRatio = 'video', overlay, loading = 'lazy', alt = '', ...props }, ref) => {
    const aspectStyles = {
      video: 'aspect-video',
      square: 'aspect-square',
      portrait: 'aspect-[3/4]',
      wide: 'aspect-[21/9]',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative overflow-hidden',
          aspectStyles[aspectRatio],
          'bg-slate-100',
          className
        )}
      >
        <img
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading={loading}
          alt={alt}
          {...props}
        />
        {overlay && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
            {overlay}
          </div>
        )}
      </div>
    );
  }
);
CardImage.displayName = 'CardImage';

// ==========================================
// CARD BADGE
// ==========================================

interface CardBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

export const CardBadge = React.forwardRef<HTMLSpanElement, CardBadgeProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variantStyles = {
      default: 'bg-slate-100 text-slate-700',
      success: 'bg-emerald-100 text-emerald-700',
      warning: 'bg-amber-100 text-amber-700',
      error: 'bg-red-100 text-red-700',
      info: 'bg-blue-100 text-blue-700',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);
CardBadge.displayName = 'CardBadge';

// ==========================================
// DIMENSION CARD (Specialized for PPSDM)
// ==========================================

interface DimensionCardProps extends Omit<CardProps, 'children'> {
  icon: React.ReactNode;
  title: string;
  description: string;
  score?: number;
  maxScore?: number;
  status?: 'not-started' | 'in-progress' | 'completed';
  onAction?: () => void;
  actionLabel?: string;
}

export function DimensionCard({
  icon,
  title,
  description,
  score,
  maxScore = 100,
  status = 'not-started',
  onAction,
  actionLabel = 'Mulai',
  ...cardProps
}: DimensionCardProps) {
  const statusConfig = {
    'not-started': { label: 'Belum Dimulai', color: 'bg-slate-100 text-slate-600' },
    'in-progress': { label: 'Sedang Berlangsung', color: 'bg-blue-100 text-blue-700' },
    'completed': { label: 'Selesai', color: 'bg-emerald-100 text-emerald-700' },
  };

  const currentStatus = statusConfig[status];

  return (
    <Card
      hover
      clickable={!!onAction}
      onClick={onAction}
      {...cardProps}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
          {icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-slate-900 truncate">{title}</h3>
            <span className={cn('text-xs px-2 py-0.5 rounded-full', currentStatus.color)}>
              {currentStatus.label}
            </span>
          </div>
          <p className="text-sm text-slate-600 line-clamp-2">{description}</p>

          {/* Score indicator */}
          {score !== undefined && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-slate-600">Skor</span>
                <span className="font-medium text-slate-900">{score}/{maxScore}</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${(score / maxScore) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Action button */}
          {onAction && (
            <button className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
              {actionLabel}
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}

export default Card;
