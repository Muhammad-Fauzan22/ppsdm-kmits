'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

import * as LucideIcons from 'lucide-react';

// ==========================================
// ICON COMPONENT SYSTEM
// Supports: Material Icons, Lucide Icons, SVG
// With automatic fallback and loading states
// ==========================================

type IconType = 'material' | 'lucide' | 'svg';
type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface IconProps {
  name: string;
  type?: IconType;
  size?: IconSize;
  className?: string;
  color?: string;
  ariaLabel?: string;
  fallback?: React.ReactNode;
  onClick?: () => void;
}

// Size mapping
const sizeMap: Record<IconSize, string> = {
  xs: 'text-xs w-3 h-3',
  sm: 'text-sm w-4 h-4',
  md: 'text-base w-5 h-5',
  lg: 'text-lg w-6 h-6',
  xl: 'text-xl w-8 h-8',
  '2xl': 'text-2xl w-10 h-10',
};

// Material Icons mapping for common icons
const materialIconMap: Record<string, string> = {
  // Navigation
  'home': 'home',
  'dashboard': 'dashboard',
  'menu': 'menu',
  'close': 'close',
  'arrow_back': 'arrow_back',
  'arrow_forward': 'arrow_forward',
  'arrow_up': 'arrow_upward',
  'arrow_down': 'arrow_downward',
  'chevron_left': 'chevron_left',
  'chevron_right': 'chevron_right',
  'chevron_up': 'expand_less',
  'chevron_down': 'expand_more',
  
  // Actions
  'search': 'search',
  'add': 'add',
  'edit': 'edit',
  'delete': 'delete',
  'save': 'save',
  'download': 'download',
  'upload': 'upload',
  'share': 'share',
  'print': 'print',
  'refresh': 'refresh',
  'settings': 'settings',
  
  // Status
  'check': 'check',
  'check_circle': 'check_circle',
  'error': 'error',
  'warning': 'warning',
  'info': 'info',
  'help': 'help',
  'notifications': 'notifications',
  
  // Content
  'person': 'person',
  'group': 'group',
  'school': 'school',
  'book': 'book',
  'article': 'article',
  'assessment': 'assessment',
  'analytics': 'analytics',
  'calendar': 'calendar',
  'mail': 'mail',
  'phone': 'phone',
  
  // UI
  'favorite': 'favorite',
  'star': 'star',
  'visibility': 'visibility',
  'visibility_off': 'visibility_off',
  'lock': 'lock',
  'unlock': 'lock_open',
  'more_vert': 'more_vert',
  'more_horiz': 'more_horiz',
  'filter': 'filter_list',
  'sort': 'sort',
};

// Lucide icon mapping for fallback
const lucideIconMap: Record<string, keyof typeof LucideIcons> = {
  'home': 'Home',
  'dashboard': 'LayoutDashboard',
  'menu': 'Menu',
  'close': 'X',
  'arrow_back': 'ArrowLeft',
  'arrow_forward': 'ArrowRight',
  'arrow_up': 'ArrowUp',
  'arrow_down': 'ArrowDown',
  'chevron_left': 'ChevronLeft',
  'chevron_right': 'ChevronRight',
  'chevron_up': 'ChevronUp',
  'chevron_down': 'ChevronDown',
  'search': 'Search',
  'add': 'Plus',
  'edit': 'Pencil',
  'delete': 'Trash2',
  'save': 'Save',
  'download': 'Download',
  'upload': 'Upload',
  'share': 'Share2',
  'print': 'Printer',
  'refresh': 'RefreshCw',
  'settings': 'Settings',
  'check': 'Check',
  'check_circle': 'CheckCircle',
  'error': 'AlertCircle',
  'warning': 'AlertTriangle',
  'info': 'Info',
  'help': 'HelpCircle',
  'notifications': 'Bell',
  'person': 'User',
  'group': 'Users',
  'school': 'GraduationCap',
  'book': 'BookOpen',
  'article': 'FileText',
  'assessment': 'ClipboardCheck',
  'analytics': 'BarChart3',
  'calendar': 'Calendar',
  'mail': 'Mail',
  'phone': 'Phone',
  'favorite': 'Heart',
  'star': 'Star',
  'visibility': 'Eye',
  'visibility_off': 'EyeOff',
  'lock': 'Lock',
  'unlock': 'Unlock',
  'more_vert': 'MoreVertical',
  'more_horiz': 'MoreHorizontal',
  'filter': 'Filter',
  'sort': 'ArrowUpDown',
};

/**
 * Icon Component - Universal icon system with fallbacks
 * 
 * Usage:
 * <Icon name="home" type="material" size="md" />
 * <Icon name="dashboard" type="lucide" size="lg" />
 * <Icon name="custom" type="svg" className="w-6 h-6" />
 */
export function Icon({
  name,
  type = 'material',
  size = 'md',
  className,
  color,
  ariaLabel,
  fallback,
  onClick,
}: IconProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Check if Material Icons font is loaded
  useEffect(() => {
    if (type === 'material') {
      // Check if font is available
      document.fonts.ready.then(() => {
        setIsLoaded(true);
      }).catch(() => {
        setHasError(true);
      });
      
      // Fallback timeout
      const timer = setTimeout(() => {
        if (!isLoaded) {
          setHasError(true);
        }
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [type, isLoaded]);

  // Handle click with keyboard support
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  // Render Material Icon
  if (type === 'material' && !hasError) {
    const iconName = materialIconMap[name] || name;
    
    return (
      <span
        className={cn(
          'material-symbols-outlined',
          'inline-flex items-center justify-center',
          'select-none',
          'transition-transform duration-200',
          sizeMap[size],
          onClick && 'cursor-pointer hover:scale-110 active:scale-95',
          className
        )}
        style={{ 
          color,
          fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
        }}
        aria-label={ariaLabel || name}
        role={onClick ? 'button' : 'img'}
        tabIndex={onClick ? 0 : undefined}
        onClick={onClick}
        onKeyDown={handleKeyDown}
      >
        {iconName}
      </span>
    );
  }

  // Render Lucide Icon (fallback or explicit)
  if (type === 'lucide' || (type === 'material' && hasError)) {
    const lucideName = lucideIconMap[name] || 'Circle';
    const LucideIcon = LucideIcons[lucideName] as React.ComponentType<{ className?: string }>;
    
    if (!LucideIcon) {
      return fallback || (
        <span 
          className={cn('inline-block bg-gray-200 rounded', sizeMap[size])}
          aria-label={ariaLabel || name}
        />
      );
    }

    return (
      <span
        className={cn(
          'inline-flex items-center justify-center',
          'transition-transform duration-200',
          sizeMap[size],
          onClick && 'cursor-pointer hover:scale-110 active:scale-95',
          className
        )}
        style={{ color }}
        aria-label={ariaLabel || name}
        role={onClick ? 'button' : 'img'}
        tabIndex={onClick ? 0 : undefined}
        onClick={onClick}
        onKeyDown={handleKeyDown}
      >
        <LucideIcon className="w-full h-full" />
      </span>
    );

  }

  // SVG type - render as-is
  if (type === 'svg') {
    return (
      <svg
        className={cn(
          'inline-flex items-center justify-center',
          sizeMap[size],
          className
        )}
        style={{ color }}
        aria-label={ariaLabel || name}
        role={onClick ? 'button' : 'img'}
        tabIndex={onClick ? 0 : undefined}
        onClick={onClick}
        onKeyDown={handleKeyDown}
      >
        <use href={`#${name}`} />
      </svg>
    );
  }

  // Fallback
  return fallback || null;
}

/**
 * IconButton - Clickable icon with proper accessibility
 */
interface IconButtonProps extends Omit<IconProps, 'onClick'> {
  onClick: () => void;
  variant?: 'default' | 'ghost' | 'outline';
  disabled?: boolean;
}

export function IconButton({
  onClick,
  variant = 'default',
  disabled,
  className,
  ...iconProps
}: IconButtonProps) {
  const variantStyles = {
    default: 'bg-slate-100 hover:bg-slate-200 text-slate-700',
    ghost: 'hover:bg-slate-100 text-slate-600',
    outline: 'border border-slate-300 hover:bg-slate-50 text-slate-700',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center',
        'rounded-lg p-2',
        'transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        className
      )}
      aria-label={iconProps.ariaLabel || iconProps.name}
    >
      <Icon {...iconProps} />
    </button>
  );
}

/**
 * Loading Icon - Animated spinner
 */
export function LoadingIcon({ size = 'md', className }: { size?: IconSize; className?: string }) {
  return (
    <Icon
      name="refresh"
      type="material"
      size={size}
      className={cn('animate-spin', className)}
      ariaLabel="Loading"
    />
  );
}

export default Icon;
