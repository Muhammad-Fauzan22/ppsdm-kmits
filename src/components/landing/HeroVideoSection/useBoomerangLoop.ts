"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface BoomerangLoopConfig {
  totalFrames: number;
  fps?: number;
  midPoint?: number; // Frame 40 (pivot point)
  easeAtEnds?: boolean;
  easeDuration?: number;
  autoPlay?: boolean;
  pattern?: "simple" | "wave" | "complex";
}

interface BoomerangLoopReturn {
  currentFrame: number;
  phase: "forward-1" | "forward-2" | "backward-1" | "backward-2" | "forward" | "reverse";
  progress: number;
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
  reset: () => void;
  setFrame: (frame: number) => void;
}

/**
 * Enhanced boomerang loop with multiple patterns:
 * - simple: 1→80→1 (basic forward-reverse)
 * - wave: 1→40→80→40 (stop at mid, oscillate)
 * - complex: 1→40→80→40→1 (full pattern with restart) - DEFAULT
 */
export function useBoomerangLoop({
  totalFrames,
  fps = 24,
  midPoint = 40,
  easeAtEnds = true,
  easeDuration = 3,
  autoPlay = true,
  pattern = "complex",
}: BoomerangLoopConfig): BoomerangLoopReturn {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [phase, setPhase] = useState<"forward-1" | "forward-2" | "backward-1" | "backward-2" | "forward" | "reverse">("forward-1");
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const baseFrameInterval = 1000 / fps;

  const animate = useCallback(
    (timestamp: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }

      const delta = timestamp - lastTimeRef.current;
      const frameInterval = baseFrameInterval;

      if (delta >= frameInterval) {
        setCurrentFrame((prev) => {
          let nextFrame = prev;
          let nextPhase = phase;

          if (pattern === "complex") {
            // Pattern: 1→40→80→40→1
            switch (phase) {
              case "forward-1": // 1 → 40
                nextFrame = prev + 1;
                if (prev >= midPoint - 1) {
                  nextPhase = "forward-2";
                }
                break;
              case "forward-2": // 40 → 80
                nextFrame = prev + 1;
                if (prev >= totalFrames - 1) {
                  nextPhase = "backward-1";
                }
                break;
              case "backward-1": // 80 → 40
                nextFrame = prev - 1;
                if (prev <= midPoint) {
                  nextPhase = "backward-2";
                }
                break;
              case "backward-2": // 40 → 1
                nextFrame = prev - 1;
                if (prev <= 0) {
                  nextPhase = "forward-1";
                  nextFrame = 0;
                }
                break;
            }
          } else if (pattern === "wave") {
            // Pattern: 1→40→80→40→1 (continuous wave)
            switch (phase) {
              case "forward-1": // 1 → 40
                nextFrame = prev + 1;
                if (prev >= midPoint - 1) {
                  nextPhase = "forward-2";
                }
                break;
              case "forward-2": // 40 → 80
                nextFrame = prev + 1;
                if (prev >= totalFrames - 1) {
                  nextPhase = "backward-2";
                }
                break;
              case "backward-2": // 80 → 40
                nextFrame = prev - 1;
                if (prev <= midPoint) {
                  nextPhase = "forward-1";
                }
                break;
              default:
                nextPhase = "forward-1";
            }
          } else {
            // Simple pattern: 1→80→1
            if (phase === "forward") {
              nextFrame = prev + 1;
              if (prev >= totalFrames - 1) {
                nextPhase = "reverse";
              }
            } else {
              nextFrame = prev - 1;
              if (prev <= 0) {
                nextPhase = "forward";
                nextFrame = 0;
              }
            }
          }

          setPhase(nextPhase);
          setProgress((nextFrame / totalFrames) * 100);
          return nextFrame;
        });
        lastTimeRef.current = timestamp;
      }

      rafRef.current = requestAnimationFrame(animate);
    },
    [phase, totalFrames, midPoint, pattern, baseFrameInterval]
  );

  useEffect(() => {
    if (isPlaying) {
      rafRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isPlaying, animate]);

  const play = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
  }, []);

  const reset = useCallback(() => {
    setCurrentFrame(0);
    setPhase("forward-1");
    lastTimeRef.current = 0;
  }, []);

  const setFrame = useCallback((frame: number) => {
    setCurrentFrame(Math.max(0, Math.min(frame, totalFrames - 1)));
  }, [totalFrames]);

  return {
    currentFrame,
    phase,
    progress,
    isPlaying,
    play,
    pause,
    reset,
    setFrame,
  };
}

export default useBoomerangLoop;
