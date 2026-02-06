"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FrameData {
  src: string;
  index: number;
}

/**
 * HeroBoomerangVideo Component
 * Creates an elegant boomerang effect using 80 frame images
 * Features:
 * - Smooth forward-backward animation loop
 * - Progressive frame loading for performance
 * - Configurable speed and easing
 * - Auto-play with manual controls
 * - Fallback for slow connections
 */
interface HeroBoomerangVideoProps {
  // Frame configuration
  frameCount?: number;
  framePrefix?: string;
  frameExtension?: string;
  folderPath?: string;
  
  // Animation configuration
  duration?: number; // Total cycle duration in ms (default: 3000)
  easing?: string; // CSS easing function
  fps?: number; // Frames per second (default: 26 for smooth 80 frames/3s)
  
  // Display configuration
  priorityFrames?: number; // Number of frames to load immediately
  className?: string;
  
  // Controls
  autoPlay?: boolean;
  showControls?: boolean;
  showProgress?: boolean;
  
  // Callbacks
  onLoadComplete?: () => void;
  onLoopComplete?: () => void;
}

export function HeroBoomerangVideo({
  frameCount = 80,
  framePrefix = "A_seamless_hypnotic_1080p_202601282032_",
  frameExtension = ".jpg",
  folderPath = "/assets/hero-sequence",
  duration = 3000,
  easing = "easeInOutSine",
  fps = 26,
  priorityFrames = 20,
  className = "",
  autoPlay = true,
  showControls = true,
  showProgress = true,
  onLoadComplete,
  onLoopComplete,
}: HeroBoomerangVideoProps) {
  // State
  const [loadedFrames, setLoadedFrames] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [quality, setQuality] = useState<"low" | "high">("low");
  
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const frameImagesRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const startTimeRef = useRef<number>(0);
  
  // Generate frame paths
  const getFramePath = useCallback((index: number) => {
    const paddedIndex = String(index).padStart(3, "0");
    return `${folderPath}/${framePrefix}${paddedIndex}${frameExtension}`;
  }, [folderPath, framePrefix, frameExtension]);
  
  // Preload a single frame
  const preloadFrame = useCallback((index: number, priority = false): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (frameImagesRef.current.has(index)) {
        resolve();
        return;
      }
      
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      img.onload = () => {
        frameImagesRef.current.set(index, img);
        setLoadedFrames(prev => {
          const newSet = new Set(prev);
          newSet.add(index);
          return newSet;
        });
        resolve();
      };
      
      img.onerror = () => {
        // Try with boomerang folder as fallback
        const fallbackPath = `/assets/boomerang/${framePrefix}${String(index).padStart(3, "0")}${frameExtension}`;
        const fallbackImg = new Image();
        fallbackImg.crossOrigin = "anonymous";
        fallbackImg.onload = () => {
          frameImagesRef.current.set(index, fallbackImg);
          setLoadedFrames(prev => {
            const newSet = new Set(prev);
            newSet.add(index);
            return newSet;
          });
          resolve();
        };
        fallbackImg.onerror = reject;
        fallbackImg.src = fallbackPath;
      };
      
      img.src = getFramePath(index);
    });
  }, [getFramePath, framePrefix, frameExtension]);
  
  // Preload all frames
  const preloadAllFrames = useCallback(async () => {
    setIsLoading(true);
    
    // Priority load first N frames
    const priorityPromises = [];
    for (let i = 0; i < Math.min(priorityFrames, frameCount); i++) {
      priorityPromises.push(preloadFrame(i, true));
    }
    await Promise.all(priorityPromises);
    
    // Continue loading remaining frames
    const remainingPromises = [];
    for (let i = priorityFrames; i < frameCount; i++) {
      remainingPromises.push(preloadFrame(i));
    }
    await Promise.all(remainingPromises);
    
    setIsLoading(false);
    onLoadComplete?.();
  }, [frameCount, priorityFrames, preloadFrame, onLoadComplete]);
  
  // Initialize loading
  useEffect(() => {
    preloadAllFrames();
  }, [preloadAllFrames]);
  
  // Animation loop
  useEffect(() => {
    if (!isPlaying || frameImagesRef.current.size === 0) return;
    
    const frameInterval = 1000 / fps;
    let lastFrameTime = 0;
    
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      
      // Calculate current frame based on elapsed time and direction
      const totalFrames = frameCount * 2 - 2; // Forward + Backward (without duplicate endpoints)
      const frameIndex = Math.floor(elapsed / frameInterval) % totalFrames;
      
      // Determine actual frame and direction
      let actualFrame: number;
      let newDirection: "forward" | "backward";
      
      if (frameIndex < frameCount) {
        actualFrame = frameIndex;
        newDirection = "forward";
      } else {
        actualFrame = frameCount - 2 - (frameIndex - frameCount);
        newDirection = "backward";
      }
      
      // Update state if changed
      if (actualFrame !== currentFrame || newDirection !== direction) {
        setCurrentFrame(actualFrame);
        setDirection(newDirection);
        setProgress((frameIndex / totalFrames) * 100);
      }
      
      // Check for loop completion
      if (frameIndex === 0 && direction === "backward" && elapsed > duration) {
        onLoopComplete?.();
        startTimeRef.current = timestamp;
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, fps, frameCount, duration, currentFrame, direction, onLoopComplete]);
  
  // Draw frame to canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const img = frameImagesRef.current.get(currentFrame);
    
    if (canvas && img) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Calculate aspect ratio and draw
        const canvasAspect = canvas.width / canvas.height;
        const imgAspect = img.width / img.height;
        
        let drawWidth: number, drawHeight: number, drawX: number, drawY: number;
        
        if (imgAspect > canvasAspect) {
          drawWidth = canvas.width;
          drawHeight = canvas.width / imgAspect;
          drawX = 0;
          drawY = (canvas.height - drawHeight) / 2;
        } else {
          drawHeight = canvas.height;
          drawWidth = canvas.height * imgAspect;
          drawX = (canvas.width - drawWidth) / 2;
          drawY = 0;
        }
        
        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
      }
    }
  }, [currentFrame]);
  
  // Handle play/pause
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      startTimeRef.current = 0;
    }
  };
  
  // Handle manual frame navigation
  const goToFrame = (frame: number) => {
    setCurrentFrame(Math.max(0, Math.min(frameCount - 1, frame)));
    setProgress((frame / frameCount) * 100);
    startTimeRef.current = 0;
  };
  
  // Calculate loading percentage
  const loadingProgress = Math.round((loadedFrames.size / frameCount) * 100);
  
  return (
    <div className={`relative w-full h-screen overflow-hidden ${className}`}>
      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-[#0A0F1A] flex flex-col items-center justify-center"
          >
            <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4" />
            <p className="text-white/70 text-sm">Memuat animasi... {loadingProgress}%</p>
            {/* Loading bar */}
            <div className="w-48 h-1 bg-white/10 rounded-full mt-4 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${loadingProgress}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-gradient-to-r from-violet-500 to-purple-500"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Video Canvas */}
      <canvas
        ref={canvasRef}
        width={1920}
        height={1080}
        className="w-full h-full object-contain"
      />
      
      {/* Gradient Overlay untuk text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0F1A]/30 via-transparent to-[#0A0F1A]/80 pointer-events-none" />
      
      {/* Direction indicator (subtle) */}
      <motion.div
        className="absolute top-4 right-4 z-20"
        animate={{ 
          opacity: direction === "forward" ? 0.5 : 0.3,
          scale: direction === "forward" ? 1 : 0.9
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-2 px-3 py-1.5 bg-black/30 backdrop-blur rounded-full">
          <motion.div
            animate={{ 
              x: direction === "forward" ? 4 : -4
            }}
            transition={{ duration: 0.3 }}
          >
            <svg className="w-4 h-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </motion.div>
          <span className="text-xs text-white/50 uppercase tracking-wider">
            {direction === "forward" ? "Forward" : "Reverse"}
          </span>
        </div>
      </motion.div>
      
      {/* Progress indicator */}
      {showProgress && (
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <div className="max-w-md mx-auto">
            <div className="flex items-center gap-3">
              <span className="text-xs text-white/50">{currentFrame.toString().padStart(2, "0")}</span>
              <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-violet-500 to-purple-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-white/50">{frameCount.toString().padStart(2, "0")}</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Controls */}
      {showControls && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
          <div className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-xl rounded-full">
            {/* Play/Pause button */}
            <button
              onClick={togglePlay}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              {isPlaying ? (
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </button>
            
            {/* Frame scrubber */}
            <div className="w-32 h-1 bg-white/10 rounded-full cursor-pointer relative">
              <motion.div
                className="absolute top-0 left-0 h-full bg-white/50 rounded-full"
                style={{ width: `${progress}%` }}
              />
              <input
                type="range"
                min={0}
                max={frameCount - 1}
                value={currentFrame}
                onChange={(e) => goToFrame(parseInt(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            
            {/* Speed indicator */}
            <span className="text-xs text-white/50">
              {Math.round(1000 / ((duration * 1000) / (frameCount * 2)))} FPS
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Simpler image-based boomerang animation
 * Uses CSS animations for better performance
 */
interface BoomerangImageProps {
  frameCount?: number;
  className?: string;
}

export function BoomerangImage({
  frameCount = 80,
  className = ""
}: BoomerangImageProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  
  // Generate frame list with forward-backward sequence
  const frames = Array.from({ length: frameCount }, (_, i) => i);
  const boomerangFrames = [...frames, ...frames.slice(1, -1).reverse()];
  
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentFrame(prev => (prev + 1) % boomerangFrames.length);
    }, 1000 / 26); // ~26 FPS
    
    return () => clearInterval(interval);
  }, [isPlaying]);
  
  const frameIndex = boomerangFrames[currentFrame];
  const paddedIndex = String(frameIndex).padStart(3, "0");
  const imagePath = `/assets/hero-sequence/A_seamless_hypnotic_1080p_202601282032_${paddedIndex}.jpg`;
  
  return (
    <div className={`relative w-full h-full ${className}`}>
      <img
        src={imagePath}
        alt={`Frame ${frameIndex}`}
        className="w-full h-full object-cover"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0A0F1A]/80" />
      
      {/* Play/Pause indicator */}
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="absolute bottom-4 right-4 p-2 bg-black/50 rounded-full opacity-50 hover:opacity-100 transition-opacity"
      >
        {isPlaying ? (
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          </svg>
        )}
      </button>
    </div>
  );
}

export default HeroBoomerangVideo;
