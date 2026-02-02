"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface BoomerangLoopConfig {
  totalFrames: number;
  fps?: number;
  easeAtEnds?: boolean;
  easeDuration?: number;
  autoPlay?: boolean;
}

interface BoomerangLoopReturn {
  currentFrame: number;
  direction: "forward" | "reverse";
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
  reset: () => void;
  setFrame: (frame: number) => void;
}

/**
 * Custom hook for boomerang loop animation
 * Creates seamless forward-reverse-loop animation for image sequences
 */
export function useBoomerangLoop({
  totalFrames,
  fps = 30,
  easeAtEnds = true,
  easeDuration = 5,
  autoPlay = true,
}: BoomerangLoopConfig): BoomerangLoopReturn {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [direction, setDirection] = useState<"forward" | "reverse">("forward");
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const baseFrameInterval = 1000 / fps;

  // Calculate eased frame interval for smoother endpoints
  const getFrameInterval = useCallback(
    (frame: number) => {
      if (!easeAtEnds) return baseFrameInterval;

      // Ease at start (frames 0 to easeDuration)
      if (frame < easeDuration) {
        const progress = frame / easeDuration;
        const easeMultiplier = 1 + (1 - progress) * 0.5; // Slow down by up to 50%
        return baseFrameInterval * easeMultiplier;
      }

      // Ease at end (frames totalFrames - easeDuration to totalFrames)
      if (frame > totalFrames - easeDuration) {
        const progress = (totalFrames - frame) / easeDuration;
        const easeMultiplier = 1 + (1 - progress) * 0.5;
        return baseFrameInterval * easeMultiplier;
      }

      return baseFrameInterval;
    },
    [baseFrameInterval, easeAtEnds, easeDuration, totalFrames]
  );

  const animate = useCallback(
    (timestamp: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }

      const delta = timestamp - lastTimeRef.current;
      const frameInterval = getFrameInterval(currentFrame);

      if (delta >= frameInterval) {
        setCurrentFrame((prev) => {
          if (direction === "forward") {
            if (prev >= totalFrames - 1) {
              setDirection("reverse");
              return prev - 1;
            }
            return prev + 1;
          } else {
            if (prev <= 0) {
              setDirection("forward");
              return prev + 1;
            }
            return prev - 1;
          }
        });
        lastTimeRef.current = timestamp;
      }

      rafRef.current = requestAnimationFrame(animate);
    },
    [direction, totalFrames, currentFrame, getFrameInterval]
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
    setDirection("forward");
    lastTimeRef.current = 0;
  }, []);

  const setFrame = useCallback((frame: number) => {
    setCurrentFrame(Math.max(0, Math.min(frame, totalFrames - 1)));
  }, [totalFrames]);

  return {
    currentFrame,
    direction,
    isPlaying,
    play,
    pause,
    reset,
    setFrame,
  };
}

export default useBoomerangLoop;
