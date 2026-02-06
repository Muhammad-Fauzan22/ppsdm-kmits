'use client';

/**
 * Skeleton Loading Components
 * 
 * Komponen skeleton loading untuk mencegah CLS
 * Memberikan feedback visual saat data sedang di-load
 * 
 * @see https://web.dev/cls/
 */

import { cn } from '@/lib/utils';

/**
 * Base Skeleton Component
 */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-slate-200 dark:bg-slate-800', className)}
      {...props}
    />
  );
}

/**
 * Text Skeleton
 * 
 * Untuk placeholder text
 */
export function TextSkeleton({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'h-4',
            i === lines - 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  );
}

/**
 * Card Skeleton
 * 
 * Untuk placeholder card
 */
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-lg border bg-card p-6', className)}>
      <Skeleton className="h-6 w-3/4 mb-4" />
      <TextSkeleton lines={2} />
    </div>
  );
}

/**
 * Avatar Skeleton
 * 
 * Untuk placeholder avatar
 */
export function AvatarSkeleton({ size = 40 }: { size?: number }) {
  return (
    <Skeleton
      className="rounded-full"
      style={{ width: size, height: size }}
    />
  );
}

/**
 * Image Skeleton
 * 
 * Untuk placeholder image
 */
export function ImageSkeleton({
  width = '100%',
  height = 200,
  className,
}: {
  width?: string | number;
  height?: string | number;
  className?: string;
}) {
  return (
    <Skeleton
      className={className}
      style={{ width, height }}
    />
  );
}

/**
 * Button Skeleton
 * 
 * Untuk placeholder button
 */
export function ButtonSkeleton({
  width = '100%',
  height = 40,
  className,
}: {
  width?: string | number;
  height?: string | number;
  className?: string;
}) {
  return (
    <Skeleton
      className={cn('rounded-md', className)}
      style={{ width, height }}
    />
  );
}

/**
 * Table Skeleton
 * 
 * Untuk placeholder table
 */
export function TableSkeleton({
  rows = 5,
  columns = 4,
  className,
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) {
  return (
    <div className={cn('w-full', className)}>
      {/* Header */}
      <div className="flex gap-4 mb-4 pb-2 border-b">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-6 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 py-3">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * List Skeleton
 * 
 * Untuk placeholder list
 */
export function ListSkeleton({
  items = 5,
  className,
}: {
  items?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <AvatarSkeleton size={40} />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Dashboard Card Skeleton
 * 
 * Untuk placeholder dashboard card
 */
export function DashboardCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-lg border bg-card p-6', className)}>
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <Skeleton className="h-12 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

/**
 * Form Skeleton
 * 
 * Untuk placeholder form
 */
export function FormSkeleton({
  fields = 4,
  className,
}: {
  fields?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-6', className)}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <ButtonSkeleton width="1/2" />
    </div>
  );
}

/**
 * Chart Skeleton
 * 
 * Untuk placeholder chart
 */
export function ChartSkeleton({
  height = 300,
  className,
}: {
  height?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-8 w-24" />
      </div>
      <Skeleton className="w-full" style={{ height }} />
    </div>
  );
}

/**
 * Grid Skeleton
 * 
 * Untuk placeholder grid layout
 */
export function GridSkeleton({
  cols = 3,
  rows = 2,
  className,
}: {
  cols?: number;
  rows?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'grid gap-4',
        `grid-cols-1 md:grid-cols-${Math.min(cols, 2)} lg:grid-cols-${cols}`,
        className
      )}
    >
      {Array.from({ length: cols * rows }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Page Skeleton
 * 
 * Untuk placeholder halaman lengkap
 */
export function PageSkeleton({
  hasHeader = true,
  hasSidebar = false,
  className,
}: {
  hasHeader?: boolean;
  hasSidebar?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('min-h-screen', className)}>
      {hasHeader && (
        <div className="border-b p-4 mb-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <div className="flex items-center gap-4">
              <AvatarSkeleton size={32} />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4">
        <div className={cn('flex gap-6', hasSidebar && 'flex-row')}>
          {hasSidebar && (
            <aside className="w-64 flex-shrink-0">
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            </aside>
          )}
          <main className={cn('flex-1', hasSidebar ? '' : 'w-full')}>
            <Skeleton className="h-12 w-1/2 mb-6" />
            <GridSkeleton cols={3} rows={2} />
          </main>
        </div>
      </div>
    </div>
  );
}
