'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';

// ==========================================
// ICON COMPONENT SYSTEM
// Supports: Material Icons, Lucide Icons, SVG
// With automatic fallback and loading states
// ==========================================

export type IconType = 'material' | 'lucide' | 'svg';
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

export interface IconProps {
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
  '3xl': 'text-3xl w-12 h-12',
  '4xl': 'text-4xl w-16 h-16',
};



// Lucide icon mapping for fallback
const lucideIconMap: Record<string, keyof typeof LucideIcons> = {
  home: 'Home',
  dashboard: 'LayoutDashboard',
  menu: 'Menu',
  close: 'X',
  arrow_back: 'ArrowLeft',
  arrow_forward: 'ArrowRight',
  arrow_up: 'ArrowUp',
  arrow_down: 'ArrowDown',
  chevron_left: 'ChevronLeft',
  chevron_right: 'ChevronRight',
  chevron_up: 'ChevronUp',
  chevron_down: 'ChevronDown',
  search: 'Search',
  add: 'Plus',
  edit: 'Pencil',
  delete: 'Trash2',
  save: 'Save',
  download: 'Download',
  upload: 'Upload',
  share: 'Share2',
  print: 'Printer',
  refresh: 'RefreshCw',
  settings: 'Settings',
  check: 'Check',
  check_circle: 'CheckCircle',
  error: 'AlertCircle',
  warning: 'AlertTriangle',
  info: 'Info',
  help: 'HelpCircle',
  notifications: 'Bell',
  person: 'User',
  group: 'Users',
  school: 'GraduationCap',
  book: 'BookOpen',
  article: 'FileText',
  assessment: 'ClipboardCheck',
  analytics: 'BarChart3',
  calendar: 'Calendar',
  mail: 'Mail',
  phone: 'Phone',
  favorite: 'Heart',
  star: 'Star',
  visibility: 'Eye',
  visibility_off: 'EyeOff',
  lock: 'Lock',
  unlock: 'Unlock',
  more_vert: 'MoreVertical',
  more_horiz: 'MoreHorizontal',
  filter: 'Filter',
  sort: 'ArrowUpDown',
  // Additional explicit mappings
  bolt: 'Zap',
  play_circle: 'PlayCircle',
  emoji_events: 'Trophy',
  psychology: 'BrainCircuit',
  verified: 'BadgeCheck',
  map: 'Map',
  groups_3: 'Users',
  quiz: 'FileQuestion',
  badge: 'IdCard',
  route: 'Signpost',
  lightbulb: 'Lightbulb',
  expand_more: 'ChevronDown',
  expand_less: 'ChevronUp',
  verified_user: 'ShieldCheck',
  location_on: 'MapPin',
  account_circle: 'UserCircle',
  logout: 'LogOut',
  login: 'LogIn',
  history: 'History',
  tune: 'SlidersHorizontal',
  auto_awesome: 'Sparkles',
  play_arrow: 'Play',
  bookmark: 'Bookmark',
  bookmark_border: 'Bookmark',
  sentiment_very_satisfied: 'Smile',
  mood: 'Laugh',
  sentiment_neutral: 'Meh',
  sentiment_dissatisfied: 'Frown',
  assignment_ind: 'UserSquare',
  photo_camera: 'Camera',
  lock_open: 'Unlock',
  delete_forever: 'Trash2',
  notifications_active: 'BellRing',
  trending_up: 'TrendingUp',
  widgets: 'LayoutGrid',
  description: 'FileText',
  campaign: 'Megaphone',
  group_add: 'UserPlus',
  add_circle: 'PlusCircle',
  remove_circle: 'MinusCircle',
  cancel: 'XCircle',
  more_time: 'Clock',
  timer: 'Timer',
  speed: 'Gauge',
  language: 'Globe',
  public: 'Globe',
  science: 'FlaskConical',
  biotech: 'FlaskConical',
  computer: 'Monitor',
  smartphone: 'Smartphone',
  tablet: 'Tablet',
  laptop: 'Laptop',
  desktop_windows: 'Monitor',
  keyboard_arrow_down: 'ChevronDown',
  keyboard_arrow_up: 'ChevronUp',
  keyboard_arrow_left: 'ChevronLeft',
  keyboard_arrow_right: 'ChevronRight',
  arrow_back_ios: 'ChevronLeft',
  arrow_forward_ios: 'ChevronRight',
  drag_indicator: 'GripVertical',
  drag_handle: 'GripHorizontal',
  menu_book: 'Book',
  library_books: 'Library',
  local_library: 'Library',
  import_contacts: 'BookOpen',
  auto_stories: 'BookOpen',
  wysiwyg: 'AppWindow',
  web: 'Layout',
  grid_view: 'LayoutGrid',
  list: 'List',
  view_list: 'List',
  view_module: 'LayoutGrid',
  view_quilt: 'LayoutDashboard',
  view_stream: 'Rows',
  table_rows: 'Rows',
  table_chart: 'Table',
  pie_chart: 'PieChart',
  bar_chart: 'BarChart',
  show_chart: 'LineChart',
  query_stats: 'Activity',
  timeline: 'History',
  update: 'RefreshCcw',
  pending: 'Clock',
  check_box: 'CheckSquare',
  check_box_outline_blank: 'Square',
  radio_button_checked: 'Disc',
  radio_button_unchecked: 'Circle',
  indeterminate_check_box: 'MinusSquare',
  toggle_on: 'ToggleRight',
  toggle_off: 'ToggleLeft',
  key: 'Key',
  vpn_key: 'Key',
  password: 'Asterisk',
  fingerprint: 'Fingerprint',
  face: 'Smile',
  redeem: 'Gift',
  card_giftcard: 'Gift',
  shopping_cart: 'ShoppingCart',
  shopping_bag: 'ShoppingBag',
  credit_card: 'CreditCard',
  payments: 'Banknote',
  account_balance: 'Landmark',
  account_balance_wallet: 'Wallet',
  receipt: 'Receipt',
  receipt_long: 'Receipt',
  attach_money: 'DollarSign',
  monetization_on: 'Coins',
  category: 'Shapes',
  layers: 'Layers',
  content_copy: 'Copy',
  content_paste: 'ClipboardPaste',
  content_cut: 'Scissors',
  format_bold: 'Bold',
  format_italic: 'Italic',
  format_underlined: 'Underline',
  format_strikethrough: 'Strikethrough',
  format_align_left: 'AlignLeft',
  format_align_center: 'AlignCenter',
  format_align_right: 'AlignRight',
  format_align_justify: 'AlignJustify',
  format_list_bulleted: 'List',
  format_list_numbered: 'ListOrdered',
  format_quote: 'Quote',
  link: 'Link',
  image: 'Image',
  movie: 'Film',
  videocam: 'Video',
  mic: 'Mic',
  volume_up: 'Volume2',
  volume_off: 'VolumeX',
  music_note: 'Music',
  palette: 'Palette',
  brush: 'Brush',
  color_lens: 'Palette',
  cleaning_services: 'Sparkles',
};

/**
 * Icon Component - Universal icon system with fallbacks
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


  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  // Render Material Icon
  // CHANGED: Check if we have a Lucide mapping first, even for 'material' type
  // This effectively migrates known material icons to Lucide without changing call sites
  const lucideName = lucideIconMap[name];
  const LucideIcon = lucideName ? LucideIcons[lucideName] as React.ComponentType<{ className?: string }> : null;

  if (LucideIcon) {
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

  if (type === 'material') {
    // Force Lucide fallback if mapping exists

    // Check if the name matches a Lucide icon directly (case-insensitive try) or PascalCase
    let FinalLucideIcon: React.ComponentType<{ className?: string }> | null = LucideIcon;

    if (!FinalLucideIcon) {
      // Try PascalCase conversion (e.g. arrow_forward -> ArrowForward)
      const pascalName = name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
      // @ts-ignore
      const PotentialIcon = LucideIcons[pascalName];
      if (PotentialIcon) {
        FinalLucideIcon = PotentialIcon as React.ComponentType<{ className?: string }>;
      }
    }

    if (FinalLucideIcon) {
      const IconComponent = FinalLucideIcon;
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
          <IconComponent className="w-full h-full" />
        </span>
      );
    }
  }



  // Render Lucide Icon (fallback or explicit)
  if (type === 'lucide' || (type === 'material' && hasError)) {
    const lucideName = lucideIconMap[name] || 'Circle';
    const LucideIcon = LucideIcons[lucideName] as React.ComponentType<{
      className?: string;
    }>;

    if (!LucideIcon) {
      return (
        fallback || (
          <span
            className={cn('inline-block bg-gray-200 rounded', sizeMap[size])}
            aria-label={ariaLabel || name}
          />
        )
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

  if (type === 'lucide') {
    const LucideComponent = (LucideIcons[name as keyof typeof LucideIcons] || LucideIcons[lucideIconMap[name]]) as React.ComponentType<{ className?: string }>;

    if (LucideComponent) {
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
          <LucideComponent className="w-full h-full" />
        </span>
      );
    }
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

  return fallback || null;
}

/**
 * IconButton - Clickable icon with proper accessibility
 */
export interface IconButtonProps extends Omit<IconProps, 'onClick'> {
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
export function LoadingIcon({
  size = 'md',
  className,
}: {
  size?: IconSize;
  className?: string;
}) {
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

// Default export for compatibility
export default Icon;
