'use client';

/**
 * Mobile Menu Component
 * 
 * Mobile menu yang responsif dan aksesibel
 * Mendukung keyboard navigation dan screen readers
 * 
 * @see https://www.w3.org/WAI/ARIA/apg/
 */

import React, { useState, useRef, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MenuItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  badge?: number;
}

interface MobileMenuProps {
  items: MenuItem[];
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

/**
 * Mobile Menu Component
 */
export function MobileMenu({
  items,
  isOpen = false,
  onClose,
  className,
}: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose?.();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setActiveItem((prev) => {
            if (!prev) return items[0]?.label;
            const currentIndex = items.findIndex(item => item.label === prev);
            if (currentIndex < items.length - 1) {
              return items[currentIndex + 1]?.label;
            }
            return prev;
          });
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveItem((prev) => {
            if (!prev) return items[items.length - 1]?.label;
            const currentIndex = items.findIndex(item => item.label === prev);
            if (currentIndex > 0) {
              return items[currentIndex - 1]?.label;
            }
            return prev;
          });
          break;
        case 'Home':
        case 'End':
          e.preventDefault();
          const currentIndex = items.findIndex(item => item.label === activeItem);
          if (e.key === 'Home') {
            setActiveItem(items[0]?.label);
          } else if (e.key === 'End') {
            setActiveItem(items[items.length - 1]?.label);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, items, activeItem]);

  // Focus trap for accessibility
  useEffect(() => {
    if (isOpen && menuRef.current) {
      const focusableElements = menuRef.current.querySelectorAll(
        'button, [href]'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      const handleTab = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          e.preventDefault();
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement?.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement?.focus();
            }
          }
        }
      };

      menuRef.current.addEventListener('keydown', handleTab);

      return () => {
        menuRef.current?.removeEventListener('keydown', handleTab);
      };
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-background border-r shadow-xl transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          className
        )}
        role="navigation"
        aria-label="Menu navigasi utama"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-md"
            aria-label="Tutup menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Menu Items */}
        <nav aria-label="Menu items">
          <ul className="py-2" role="menu">
            {items.map((item, index) => (
              <li key={index} role="none">
                {item.href ? (
                  <a
                    href={item.href}
                    onClick={() => {
                      setActiveItem(item.label);
                      item.onClick?.();
                    }}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-md transition-colors',
                      activeItem === item.label
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent hover:text-accent-foreground'
                    )}
                    aria-current={activeItem === item.label ? 'page' : undefined}
                  >
                    {item.icon && (
                      <span className="flex-shrink-0" aria-hidden="true">
                        {item.icon}
                      </span>
                    )}
                    <span className="flex-1">{item.label}</span>
                    {item.badge !== undefined && (
                      <span
                        className={cn(
                          'ml-auto px-2 py-0.5 text-xs font-medium rounded-full',
                          activeItem === item.label
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </a>
                ) : (
                  <button
                    onClick={() => {
                      setActiveItem(item.label);
                      item.onClick?.();
                    }}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-left',
                      activeItem === item.label
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent hover:text-accent-foreground'
                    )}
                    aria-current={activeItem === item.label ? 'page' : undefined}
                  >
                    {item.icon && (
                      <span className="flex-shrink-0" aria-hidden="true">
                        {item.icon}
                      </span>
                    )}
                    <span className="flex-1">{item.label}</span>
                  </button>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t">
          <p className="text-xs text-center text-muted-foreground">
            © 2025 PPSDM KMITS
          </p>
        </div>
      </div>
    </>
  );
}

/**
 * Mobile Menu Item Component
 */
export function MobileMenuItem({
  item,
  isActive = false,
  onClick,
}: {
  item: MenuItem;
  isActive?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-left',
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'hover:bg-accent hover:text-accent-foreground'
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      {item.icon && (
        <span className="flex-shrink-0" aria-hidden="true">
          {item.icon}
        </span>
      )}
      <span className="flex-1">{item.label}</span>
      {item.badge !== undefined && (
        <span
          className={cn(
            'ml-auto px-2 py-0.5 text-xs font-medium rounded-full',
            isActive
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground'
          )}
        >
          {item.badge}
        </span>
      )}
    </button>
  );
}

/**
 * Mobile Menu Toggle Button
 */
export function MobileMenuToggle({
  isOpen,
  onClick,
  badge,
}: {
  isOpen: boolean;
  onClick: () => void;
  badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative p-2 rounded-md transition-colors',
        isOpen ? 'bg-primary text-primary-foreground' : 'hover:bg-accent hover:text-accent-foreground'
      )}
      aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
      aria-expanded={isOpen}
      aria-controls="mobile-menu"
    >
      <Menu className="h-6 w-6" />
      {badge !== undefined && (
        <span
          className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs font-bold"
        >
          {badge}
        </span>
      )}
    </button>
  );
}

/**
 * Mobile Menu Overlay
 */
export function MobileMenuOverlay({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={onClick}
          aria-hidden="true"
        />
      )}
    </>
  );
}
