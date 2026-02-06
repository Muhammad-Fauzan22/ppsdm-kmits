'use client';

/**
 * Breadcrumb Navigation Component
 * 
 * Breadcrumb navigation untuk navigasi yang lebih baik
 * Mendukung keyboard navigation dan ARIA attributes
 * 
 * @see https://www.w3.org/WAI/ARIA/apg/
 */

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Breadcrumb Component
 */
export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center space-x-2 text-sm', className)}>
      <ol className="flex items-center space-x-2" role="list">
        {items.map((item, index) => (
          <li key={index} className="flex items-center" role="listitem">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            )}
            {item.href ? (
              <Link
                href={item.href}
                className={cn(
                  'hover:text-primary transition-colors',
                  item.current && 'font-medium text-primary',
                  !item.current && 'text-muted-foreground'
                )}
                aria-current={item.current ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={cn(
                  'font-medium text-primary',
                  'text-muted-foreground'
                )}
                aria-current="page"
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * Breadcrumb Item Component
 */
export function BreadcrumbItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn('inline-flex items-center', className)}>{children}</span>;
}

/**
 * Breadcrumb Separator
 */
export function BreadcrumbSeparator({ className }: { className?: string }) {
  return <span className={cn('mx-2 text-muted-foreground', className)}>/</span>;
}

/**
 * Breadcrumb Home Link
 */
export function BreadcrumbHome({ href = '/' }: { href?: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
      aria-label="Home"
    >
      <Home className="h-4 w-4" />
      <span className="sr-only">Home</span>
    </Link>
  );
}
