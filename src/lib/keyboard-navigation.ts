/**
 * KEYBOARD NAVIGATION UTILITIES
 * 
 * This file provides utilities for implementing keyboard navigation
 * and ensuring WCAG 2.1 AA compliance for keyboard accessibility.
 */

/**
 * Keyboard key codes
 */
export const KEY_CODES = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
  PAGE_UP: 'PageUp',
  PAGE_DOWN: 'PageDown',
} as const;

/**
 * Check if key is an activation key
 */
export function isActivationKey(key: string): boolean {
  return key === KEY_CODES.ENTER || key === KEY_CODES.SPACE;
}

/**
 * Check if key is a navigation key
 */
export function isNavigationKey(key: string): boolean {
  return [
    KEY_CODES.ARROW_UP,
    KEY_CODES.ARROW_DOWN,
    KEY_CODES.ARROW_LEFT,
    KEY_CODES.ARROW_RIGHT,
    KEY_CODES.HOME,
    KEY_CODES.END,
    KEY_CODES.PAGE_UP,
    KEY_CODES.PAGE_DOWN,
  ].includes(key as any);
}

/**
 * Check if key is an escape key
 */
export function isEscapeKey(key: string): boolean {
  return key === KEY_CODES.ESCAPE;
}

/**
 * Handle keyboard activation
 */
export function handleKeyboardActivation(
  event: KeyboardEvent,
  callback: () => void
): void {
  if (isActivationKey(event.key)) {
    event.preventDefault();
    callback();
  }
}

/**
 * Handle keyboard navigation
 */
export function handleKeyboardNavigation(
  event: KeyboardEvent,
  onUp?: () => void,
  onDown?: () => void,
  onLeft?: () => void,
  onRight?: () => void,
  onHome?: () => void,
  onEnd?: () => void
): void {
  switch (event.key) {
    case KEY_CODES.ARROW_UP:
      event.preventDefault();
      onUp?.();
      break;
    case KEY_CODES.ARROW_DOWN:
      event.preventDefault();
      onDown?.();
      break;
    case KEY_CODES.ARROW_LEFT:
      event.preventDefault();
      onLeft?.();
      break;
    case KEY_CODES.ARROW_RIGHT:
      event.preventDefault();
      onRight?.();
      break;
    case KEY_CODES.HOME:
      event.preventDefault();
      onHome?.();
      break;
    case KEY_CODES.END:
      event.preventDefault();
      onEnd?.();
      break;
  }
}

/**
 * Handle keyboard escape
 */
export function handleKeyboardEscape(
  event: KeyboardEvent,
  callback: () => void
): void {
  if (isEscapeKey(event.key)) {
    event.preventDefault();
    callback();
  }
}

/**
 * Trap focus within a container
 */
export function trapFocus(
  container: HTMLElement,
  onEscape?: () => void
): () => void {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  ) as NodeListOf<HTMLElement>;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === KEY_CODES.TAB) {
      if (e.shiftKey) {
        // Shift + Tab: Move to previous focusable element
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: Move to next focusable element
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    } else if (e.key === KEY_CODES.ESCAPE && onEscape) {
      onEscape();
    }
  };

  container.addEventListener('keydown', handleKeyDown);

  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Set focus to first focusable element in container
 */
export function focusFirstElement(container: HTMLElement): void {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  ) as NodeListOf<HTMLElement>;

  if (focusableElements.length > 0) {
    focusableElements[0].focus();
  }
}

/**
 * Set focus to last focusable element in container
 */
export function focusLastElement(container: HTMLElement): void {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  ) as NodeListOf<HTMLElement>;

  if (focusableElements.length > 0) {
    focusableElements[focusableElements.length - 1].focus();
  }
}

/**
 * Check if element is focusable
 */
export function isFocusable(element: HTMLElement): boolean {
  if (element.tabIndex < 0) {
    return false;
  }

  const focusableTags = ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'];
  if (focusableTags.includes(element.tagName)) {
    return true;
  }

  return element.hasAttribute('tabindex');
}

/**
 * Get all focusable elements in container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  ) as HTMLElement[];
}

/**
 * Handle keyboard shortcuts
 */
export interface KeyboardShortcuts {
  [key: string]: () => void;
}

export function handleKeyboardShortcuts(
  event: KeyboardEvent,
  shortcuts: KeyboardShortcuts
): void {
  const handler = shortcuts[event.key];
  if (handler) {
    event.preventDefault();
    handler();
  }
}

/**
 * Create keyboard navigation hook
 */
export function useKeyboardNavigation(
  options: {
    onEscape?: () => void;
    onEnter?: () => void;
    onArrowUp?: () => void;
    onArrowDown?: () => void;
    onArrowLeft?: () => void;
    onArrowRight?: () => void;
  }
) {
  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case KEY_CODES.ESCAPE:
        options.onEscape?.();
        break;
      case KEY_CODES.ENTER:
        options.onEnter?.();
        break;
      case KEY_CODES.ARROW_UP:
        e.preventDefault();
        options.onArrowUp?.();
        break;
      case KEY_CODES.ARROW_DOWN:
        e.preventDefault();
        options.onArrowDown?.();
        break;
      case KEY_CODES.ARROW_LEFT:
        e.preventDefault();
        options.onArrowLeft?.();
        break;
      case KEY_CODES.ARROW_RIGHT:
        e.preventDefault();
        options.onArrowRight?.();
        break;
    }
  };

  return {
    onKeyDown: handleKeyDown,
  };
}
