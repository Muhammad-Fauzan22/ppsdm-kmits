/**
 * Configuration constants for Hero Video Section
 */

// Base path to be image sequence folder
export const SEQUENCE_BASE_PATH = "/hero-sequence";

// File naming pattern
export const SEQUENCE_PREFIX = "A_seamless_hypnotic_1080p_202601282032_";
export const SEQUENCE_EXTENSION = "jpg";

// Frame range - all 80 frames are available (000-079)
export const FRAME_START = 0;
export const FRAME_END = 79;

// Generate array of all available frames
export const AVAILABLE_FRAMES = Array.from(
  { length: FRAME_END - FRAME_START + 1 },
  (_, i) => FRAME_START + i
);

// Total frames count
export const TOTAL_FRAMES = AVAILABLE_FRAMES.length; // 80 frames

// Animation settings
export const ANIMATION_CONFIG = {
  fps: 24, // Target frames per second (smooth cinematic feel)
  easeAtEnds: true, // Slow down at endpoints for smooth reversal
  easeDuration: 3, // Number of frames to ease at start/end
  autoPlay: true, // Auto-start animation
  midPoint: 40, // Pivot frame for complex boomerang pattern
  pattern: "complex" as const, // 'simple' | 'wave' | 'complex'
};

// Priority frames for initial loading (every 10th frame for quick preview)
export const PRIORITY_FRAME_INDICES = [
  0, // First frame - gold sphere intro
  8, // Early animation
  16, // Building up
  24, // ~1/3 through
  32, // Midpoint approaching
  40, // Neural network expanding
  48, // Complex network
  56, // Peak complexity
  64, // Returning
  72, // Near end
  79, // Last frame
];

// Loading states
export const LOADING_STATES = {
  IDLE: "idle",
  LOADING_PRIORITY: "loading_priority",
  LOADING_REMAINING: "loading_remaining",
  COMPLETE: "complete",
  ERROR: "error",
} as const;

// Generate frame path from index
export function getFramePath(frameIndex: number): string {
  const frameNumber = AVAILABLE_FRAMES[frameIndex];
  if (frameNumber === undefined) {
    console.warn(`Invalid frame index: ${frameIndex}`);
    return "";
  }
  const paddedNumber = frameNumber.toString().padStart(3, "0");
  return `${SEQUENCE_BASE_PATH}/${SEQUENCE_PREFIX}${paddedNumber}.${SEQUENCE_EXTENSION}`;
}

// Generate all frame paths
export function getAllFramePaths(): string[] {
  return AVAILABLE_FRAMES.map((frameNumber) => {
    const paddedNumber = frameNumber.toString().padStart(3, "0");
    return `${SEQUENCE_BASE_PATH}/${SEQUENCE_PREFIX}${paddedNumber}.${SEQUENCE_EXTENSION}`;
  });
}

// Viewport sizes for responsive loading
export const VIEWPORT_BREAKPOINTS = {
  mobile: 640,
  tablet: 1024,
  desktop: 1920,
};

// Performance settings based on device
export const PERFORMANCE_PRESETS = {
  low: {
    fps: 15,
    skipFrames: 2, // Load every 3rd frame
    quality: "low",
  },
  medium: {
    fps: 24,
    skipFrames: 1, // Load every 2nd frame
    quality: "medium",
  },
  high: {
    fps: 30,
    skipFrames: 0, // Load all frames
    quality: "high",
  },
};
