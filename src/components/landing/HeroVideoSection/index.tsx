"use client";

import { useState, useEffect, memo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, PlayCircle } from "lucide-react";
import { ImageSequencePlayer } from "./ImageSequencePlayer";
import { useBoomerangLoop } from "./useBoomerangLoop";
import { useImagePreloader } from "./useImagePreloader";
import {
  getAllFramePaths,
  TOTAL_FRAMES,
  ANIMATION_CONFIG,
  PRIORITY_FRAME_INDICES,
} from "./constants";

interface HeroVideoSectionProps {
  className?: string;
}

/**
 * Hero section with hypnotic boomerang video background
 * Combines elegant animation with overlay text and CTAs
 */
export function HeroVideoSection({ className }: HeroVideoSectionProps) {
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(true);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Generate frame paths
  const framePaths = getAllFramePaths();

  // Preload images with priority frames first for better performance
  const {
    images,
    loadedCount,
  } = useImagePreloader({
    imagePaths: framePaths,
    priorityIndices: PRIORITY_FRAME_INDICES, // Load priority frames first
    skipFrames: 1, // Load every 2nd frame for performance optimization
    onProgress: (loaded: number, total: number) => {
      // Hide loading indicator once enough frames loaded
      if (loaded > 5) {
        setShowLoadingIndicator(false);
      }
    },
  });

  // Boomerang animation loop with complex pattern: 1→40→80→40→1
  const { currentFrame, phase, pause, play } = useBoomerangLoop({
    totalFrames: TOTAL_FRAMES,
    fps: ANIMATION_CONFIG.fps,
    midPoint: ANIMATION_CONFIG.midPoint,
    easeAtEnds: ANIMATION_CONFIG.easeAtEnds,
    easeDuration: ANIMATION_CONFIG.easeDuration,
    pattern: ANIMATION_CONFIG.pattern,
    autoPlay: !isReducedMotion, // Always autoplay
  });

  // Handle visibility change (pause when tab hidden)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        pause();
      } else if (!isReducedMotion) {
        play();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [pause, play, isReducedMotion]);

  return (
    <section
      className={`relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#070B14] ${className}`}
    >
      {/* Container for video background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {/* Video Background Layer */}
        <div className="absolute inset-0 z-0">
          {/* Loading Placeholder */}
          {showLoadingIndicator && (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 z-10 flex items-center justify-center"
              style={{
                background:
                  "radial-gradient(ellipse at center, #0a1628 0%, #070B14 100%)",
              }}
            >
              {/* Loading spinner with phase indicator */}
              <div className="relative flex flex-col items-center gap-4">
                <div className="relative">
                  <div
                    className="w-20 h-20 rounded-full animate-pulse"
                    style={{
                      background: `radial-gradient(circle, #06b6d430 0%, transparent 70%)`,
                    }}
                  />
                  <div
                    className="absolute inset-0 w-20 h-20 rounded-full border-4 border-white/10 border-t-current animate-spin"
                    style={{ color: "#06b6d4" }}
                  />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <p className="text-sm text-slate-400">Memuat pengalaman...</p>
                  <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full"
                      style={{
                        background: `linear-gradient(90deg, #06b6d4, #3b82f6)`,
                      }}
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Image Sequence Player */}
          {images.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0"
            >
              <ImageSequencePlayer
                images={images}
                currentFrame={currentFrame}
                objectFit="cover"
                className="w-full h-full"
              />
            </motion.div>
          )}

          {/* Gradient overlays container */}
          <div className="absolute inset-0 z-[5]">
            <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-[#070B14]/40 to-transparent" />
          </div>
        </div>
        {/* End Video Background Layer */}

        {/* Content Overlay */}
        <div className="relative z-20 max-w-5xl mx-auto px-6 py-20 flex flex-col items-center text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-3 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold text-cyan-400 backdrop-blur-md mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
            </span>
            Join 12,450+ ITS Students Shaping the Future
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black font-heading tracking-tighter text-white leading-[1.05] mb-6 drop-shadow-2xl"
          >
            Elevate Your <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,212,255,0.5)]">
              Human Capital
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-2xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed mb-10"
          >
            Platform pengembangan terpadu berbasis data untuk mahasiswa ITS.
            Bangun portofolio kompetensi melalui asesmen presisi, roadmap
            terukur, dan bimbingan mentor eksklusif.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto"
          >
            <Link
              href="/try-assessment"
              className="w-full sm:w-auto px-8 py-4 bg-white text-[#070B14] font-bold rounded-2xl hover:bg-cyan-400 transition-all hover:scale-105 shadow-2xl shadow-cyan-500/20 flex items-center justify-center gap-2 text-lg group"
            >
              Mulai Assessment Gratis
              <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/20 text-white font-bold rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-lg hover:border-cyan-500/50 group">
              <PlayCircle className="w-6 h-6 group-hover:text-cyan-400 transition-colors" />
              Tonton Demo
            </button>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-24 grid grid-cols-3 gap-8 md:gap-20 border-t border-white/5 pt-12 px-8 rounded-3xl bg-white/[0.02] backdrop-blur-sm"
          >
            <div className="flex flex-col items-center gap-1 group">
              <span className="text-3xl md:text-4xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                9
              </span>
              <span className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-slate-500">
                Dimensi Utama
              </span>
            </div>
            <div className="flex flex-col items-center gap-1 group relative">
              <div className="absolute -left-4 md:-left-10 top-1/2 -translate-y-1/2 w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
              <div className="absolute -right-4 md:-right-10 top-1/2 -translate-y-1/2 w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
              <span className="text-3xl md:text-4xl font-bold text-white group-hover:text-amber-500 transition-colors">
                50+
              </span>
              <span className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-slate-500">
                Mentors
              </span>
            </div>
            <div className="flex flex-col items-center gap-1 group">
              <span className="text-3xl md:text-4xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                100%
              </span>
              <span className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-slate-500">
                Kurikulum ITS
              </span>
            </div>
          </motion.div>
        </div>

        {/* Debug info (development only) */}
        {process.env.NODE_ENV === "development" && (
          <div className="absolute bottom-4 right-4 z-50 text-xs font-mono text-white/30 bg-black/50 px-3 py-2 rounded backdrop-blur-md">
            <div className="flex items-center gap-2 flex-wrap">
              <span>Frame: {currentFrame + 1}/{TOTAL_FRAMES}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] ${phase.startsWith("forward") ? "bg-cyan-500/30 text-cyan-300" : "bg-amber-500/30 text-amber-300"
                }`}>
                {phase.replace("-", " ").toUpperCase()}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// Memoize HeroVideoSection to prevent unnecessary re-renders
const MemoizedHeroVideoSection = memo(HeroVideoSection);

export default MemoizedHeroVideoSection;
