/**
 * useUndoRedo Hook
 * 
 * Custom hook untuk mengelola state dengan kemampuan undo/redo
 * Supports keyboard shortcuts (Ctrl+Z / Ctrl+Y)
 */

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

export interface UseUndoRedoReturn<T> {
  present: T;
  past: T[];
  future: T[];
  undo: () => void;
  redo: () => void;
  set: (newPresent: T) => void;
  reset: (newInitial: T) => void;
  go: (steps: number) => void;
  canUndo: boolean;
  canRedo: boolean;
  history: HistoryState<T>;
}

export function useUndoRedo<T>(initialPresent: T, maxHistory: number = 50): UseUndoRedoReturn<T> {
  const [history, setHistory] = useState<HistoryState<T>>({
    past: [],
    present: initialPresent,
    future: [],
  });

  // Track if this is the initial mount
  const isInitialMount = useRef(true);

  // Initialize with a flag to avoid saving initial state
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    // Initial state is set
  }, []);

  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.past.length === 0) return prev;
      
      const previous = prev.past[prev.past.length - 1];
      const newPast = prev.past.slice(0, -1);
      
      return {
        past: newPast,
        present: previous,
        future: [prev.present, ...prev.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((prev) => {
      if (prev.future.length === 0) return prev;
      
      const next = prev.future[0];
      const newFuture = prev.future.slice(1);
      
      return {
        past: [...prev.past, prev.present],
        present: next,
        future: newFuture,
      };
    });
  }, []);

  const go = useCallback((steps: number) => {
    setHistory((prev) => {
      if (steps > 0) {
        // Redo steps times
        if (prev.future.length < steps) return prev;
        const newFuture = prev.future.slice(0, steps);
        const next = newFuture[newFuture.length - 1];
        return {
          past: [...prev.past, prev.present, ...prev.future.slice(0, steps - 1)],
          present: next,
          future: prev.future.slice(steps),
        };
      } else if (steps < 0) {
        // Undo |steps| times
        const absSteps = Math.abs(steps);
        if (prev.past.length < absSteps) return prev;
        const newPast = prev.past.slice(0, -absSteps);
        const previous = prev.past[prev.past.length - absSteps];
        return {
          past: newPast,
          present: previous,
          future: [prev.present, ...prev.past.slice(-absSteps), ...prev.future],
        };
      }
      return prev;
    });
  }, []);

  const set = useCallback((newPresent: T) => {
    setHistory((prev) => {
      // Don't save to history if value is the same
      if (JSON.stringify(prev.present) === JSON.stringify(newPresent)) {
        return prev;
      }
      
      const newPast = [...prev.past, prev.present];
      
      // Limit history size
      if (newPast.length > maxHistory) {
        newPast.shift();
      }
      
      return {
        past: newPast,
        present: newPresent,
        future: [],
      };
    });
  }, [maxHistory]);

  const reset = useCallback((newInitial: T) => {
    setHistory({
      past: [],
      present: newInitial,
      future: [],
    });
  }, []);

  return {
    present: history.present,
    past: history.past,
    future: history.future,
    undo,
    redo,
    set,
    reset,
    go,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    history,
  };
}

/**
 * Hook untuk keyboard shortcuts undo/redo
 * Automatically binds Ctrl+Z / Cmd+Z untuk undo dan Ctrl+Y / Cmd+Shift+Z untuk redo
 */
export function useUndoRedoKeyboard<T>(
  undoRedo: Pick<UseUndoRedoReturn<T>, 'undo' | 'redo' | 'canUndo' | 'canRedo'>,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl or Cmd key
      const isMod = e.ctrlKey || e.metaKey;
      
      if (!isMod) return;

      // Ctrl+Z or Cmd+Z for undo
      if (e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (undoRedo.canUndo) {
          undoRedo.undo();
        }
      }
      
      // Ctrl+Y or Cmd+Shift+Z for redo
      if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) {
        e.preventDefault();
        if (undoRedo.canRedo) {
          undoRedo.redo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undoRedo, enabled]);
}

/**
 * Composed hook yang includes keyboard shortcuts
 */
export function useUndoRedoWithKeyboard<T>(
  initialPresent: T,
  maxHistory?: number
): UseUndoRedoReturn<T> & {
  keyboardUndo: () => void;
  keyboardRedo: () => void;
} {
  const undoRedo = useUndoRedo(initialPresent, maxHistory);
  
  useUndoRedoKeyboard(undoRedo);
  
  return {
    ...undoRedo,
    keyboardUndo: undoRedo.undo,
    keyboardRedo: undoRedo.redo,
  };
}

export default useUndoRedo;