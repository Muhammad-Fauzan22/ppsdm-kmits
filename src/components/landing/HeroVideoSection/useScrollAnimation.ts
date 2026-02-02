/**
 * useScrollAnimation.ts
 * Hook for scroll-based animation with narrative-driven progression
 */

import { useState, useEffect, useCallback, useRef } from "react";

// Narrative phases configuration
export interface NarrativePhase {
  id: string;
  name: string;
  description: string;
  startProgress: number;
  endProgress: number;
  color: string;
  icon: string;
}

export const NARRATIVE_PHASES: NarrativePhase[] = [
  {
    id: "problem",
    name: "Tantangan",
    description: "9 Dimensi fragmentasi pengembangan manusia",
    startProgress: 0,
    endProgress: 0.25,
    color: "#ef4444", // red
    icon: "warning",
  },
  {
    id: "connection",
    name: "Koneksi",
    description: "Platform terintegrasi menyatukan semua aspek",
    startProgress: 0.25,
    endProgress: 0.5,
    color: "#f59e0b", // amber
    icon: "hub",
  },
  {
    id: "transformation",
    name: "Transformasi",
    description: "Sistem unified dengan PPSDM di pusat",
    startProgress: 0.5,
    endProgress: 0.75,
    color: "#10b981", // emerald
    icon: "transform",
  },
  {
    id: "impact",
    name: "Dampak",
    description: "Jaringan berkembang ke jalur karir",
    startProgress: 0.75,
    endProgress: 1.0,
    color: "#3b82f6", // blue
    icon: "rocket_launch",
  },
];

// Scroll animation state interface
export interface ScrollAnimationState {
  scrollProgress: number;
  currentPhase: NarrativePhase;
  phaseProgress: number;
  isScrolling: boolean;
  scrollVelocity: number;
  scrollDirection: "up" | "down";
  viewportHeight: number;
  sectionHeight: number;
}

// Hook configuration interface
interface UseScrollAnimationConfig {
  sectionRef: React.RefObject<HTMLElement>;
  totalHeight?: number;
  smoothFactor?: number;
  debounceMs?: number;
}

export function useScrollAnimation(config: UseScrollAnimationConfig) {
  const { sectionRef, totalHeight = 4000, smoothFactor = 0.1, debounceMs = 16 } = config;

  const [state, setState] = useState<ScrollAnimationState>({
    scrollProgress: 0,
    currentPhase: NARRATIVE_PHASES[0],
    phaseProgress: 0,
    isScrolling: false,
    scrollVelocity: 0,
    scrollDirection: "down",
    viewportHeight: typeof window !== "undefined" ? window.innerHeight : 0,
    sectionHeight: totalHeight,
  });

  const lastScrollTop = useRef(0);
  const lastScrollTime = useRef(Date.now());
  const animationFrameId = useRef<number | null>(null);
  const smoothedProgress = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate current phase based on progress
  const calculateCurrentPhase = useCallback((progress: number): NarrativePhase => {
    const phase = NARRATIVE_PHASES.find(
      (p) => progress >= p.startProgress && progress < p.endProgress
    );
    return phase || NARRATIVE_PHASES[NARRATIVE_PHASES.length - 1];
  }, []);

  // Calculate phase-local progress
  const calculatePhaseProgress = useCallback((progress: number, phase: NarrativePhase): number => {
    const phaseRange = phase.endProgress - phase.startProgress;
    const relativeProgress = progress - phase.startProgress;
    return Math.max(0, Math.min(1, relativeProgress / phaseRange));
  }, []);

  // Easing function for smooth animation
  const easeInOutCubic = useCallback((t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }, []);

  // Main scroll handler
  const handleScroll = useCallback(() => {
    if (!sectionRef.current) return;

    const scrollTop = window.scrollY;
    const viewportHeight = window.innerHeight;
    const sectionTop = sectionRef.current.offsetTop;
    const sectionHeight = sectionRef.current.offsetHeight;

    // Calculate progress relative to the section
    const relativeScroll = scrollTop - sectionTop;
    const rawProgress = Math.max(0, Math.min(1, relativeScroll / (sectionHeight - viewportHeight)));

    // Calculate scroll velocity
    const now = Date.now();
    const timeDelta = now - lastScrollTime.current;
    const scrollDelta = scrollTop - lastScrollTop.current;
    const velocity = timeDelta > 0 ? Math.abs(scrollDelta) / timeDelta : 0;

    // Update last scroll values
    lastScrollTop.current = scrollTop;
    lastScrollTime.current = now;

    // Apply smoothing to progress
    smoothedProgress.current = smoothedProgress.current + (rawProgress - smoothedProgress.current) * smoothFactor;
    const smoothedValue = easeInOutCubic(smoothedProgress.current);

    // Determine scroll direction
    const scrollDirection = scrollDelta > 0 ? "down" : scrollDelta < 0 ? "up" : "down";

    // Get current phase and calculate phase progress
    const currentPhase = calculateCurrentPhase(smoothedValue);
    const phaseProgress = calculatePhaseProgress(smoothedValue, currentPhase);

    setState((prev) => ({
      ...prev,
      scrollProgress: smoothedValue,
      currentPhase,
      phaseProgress,
      isScrolling: true,
      scrollVelocity: velocity,
      scrollDirection,
      viewportHeight,
      sectionHeight,
    }));

    // Clear existing timeout and set new one to detect scroll end
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setState((prev) => ({ ...prev, isScrolling: false }));
    }, 150);
  }, [sectionRef, smoothFactor, calculateCurrentPhase, calculatePhaseProgress, easeInOutCubic]);

  // Set up scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    // Initial calculation
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [handleScroll]);

  // Helper function to get specific phase data
  const getPhaseById = useCallback((phaseId: string): NarrativePhase | undefined => {
    return NARRATIVE_PHASES.find((p) => p.id === phaseId);
  }, []);

  // Helper function to get animation values for a specific phase
  const getPhaseAnimationValues = useCallback((phaseId: string): Record<string, number> => {
    const phase = getPhaseById(phaseId);
    if (!phase) return {};

    const progress = calculatePhaseProgress(state.scrollProgress, phase);

    return {
      progress,
      scale: 0.5 + progress * 0.5,
      opacity: progress,
      rotation: progress * 360,
      translateX: (progress - 0.5) * 100,
      translateY: (1 - progress) * -50,
    };
  }, [state.scrollProgress, calculatePhaseProgress, getPhaseById]);

  return {
    ...state,
    // Helper methods
    getPhaseById,
    getPhaseAnimationValues,
    // Computed values
    isInPhase: (phaseId: string) => state.currentPhase.id === phaseId,
    progressToPhase: (phaseId: string) => {
      const phase = getPhaseById(phaseId);
      return phase ? calculatePhaseProgress(state.scrollProgress, phase) : 0;
    },
  };
}

export default useScrollAnimation;