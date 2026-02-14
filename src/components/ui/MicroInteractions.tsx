'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Heart, Bookmark, Share2, Copy, Download, ChevronDown } from 'lucide-react';

export interface MicroInteractionProps {
  type: 'like' | 'bookmark' | 'share' | 'copy' | 'download';
  count?: number;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function MicroInteraction({
  type,
  count = 0,
  active = false,
  onClick,
  className = ''
}: MicroInteractionProps) {
  const icons = {
    like: <Heart className="w-5 h-5" />,
    bookmark: <Bookmark className="w-5 h-5" />,
    share: <Share2 className="w-5 h-5" />,
    copy: <Copy className="w-5 h-5" />,
    download: <Download className="w-5 h-5" />,
  };

  const labels = {
    like: 'Like',
    bookmark: 'Bookmark',
    share: 'Share',
    copy: 'Copy',
    download: 'Download',
  };

  return (
    <button
      onClick={onClick}
      className={`group relative flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${active
        ? 'bg-blue-600 text-white hover:bg-blue-700'
        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
        } ${className}`}
      aria-label={`${labels[type]} ${count > 0 ? `(${count})` : ''}`}
      aria-pressed={active}
    >
      <span className={`flex justify-center items-center transition-transform duration-200 ${active
        ? 'scale-110'
        : 'group-hover:scale-110'
        }`}>
        {icons[type]}
      </span>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
}

// Action buttons group component
export interface ActionButtonsProps {
  actions: {
    primary?: {
      label: string;
      onClick: () => void;
      icon?: React.ReactNode;
    };
    secondary?: {
      label: string;
      onClick: () => void;
      icon?: React.ReactNode;
    };
    tertiary?: {
      label: string;
      onClick: () => void;
      icon?: React.ReactNode;
    };
  };
  className?: string;
}

export function ActionButtons({ actions, className = '' }: ActionButtonsProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {actions.primary && (
        <button
          onClick={actions.primary.onClick}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {actions.primary.icon && (
            <span className="flex">{actions.primary.icon}</span>
          )}
          {actions.primary.label}
        </button>
      )}

      {actions.secondary && (
        <button
          onClick={actions.secondary.onClick}
          className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
        >
          {actions.secondary.icon && (
            <span className="flex">{actions.secondary.icon}</span>
          )}
          {actions.secondary.label}
        </button>
      )}

      {actions.tertiary && (
        <button
          onClick={actions.tertiary.onClick}
          className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-slate-500 focus:ring-offset-1"
        >
          {actions.tertiary.icon && (
            <span className="flex">{actions.tertiary.icon}</span>
          )}
          {actions.tertiary.label}
        </button>
      )}
    </div>
  );
}

// Quick action menu component
export interface QuickActionMenuProps {
  trigger: React.ReactNode;
  items: {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    badge?: string;
  }[];
  className?: string;
}

export function QuickActionMenu({ trigger, items, className = '' }: QuickActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {trigger}
        <ChevronDown className="text-slate-400 w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden"
            role="menu"
          >
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1"
              >
                <span className="text-slate-600 dark:text-slate-400">{item.icon}</span>
                <span className="flex-1 text-sm font-medium text-slate-900 dark:text-white">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
