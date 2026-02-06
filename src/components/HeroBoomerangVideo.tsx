"use client";

import React from "react";

interface HeroBoomerangVideoProps {
  className?: string;
  // Keep these props to avoid breaking existing usage, even if ignored
  frameCount?: number;
  framePrefix?: string;
  frameExtension?: string;
  folderPath?: string;
  duration?: number;
  easing?: string;
  fps?: number;
  priorityFrames?: number;
  autoPlay?: boolean;
  showControls?: boolean;
  showProgress?: boolean;
  onLoadComplete?: () => void;
  onLoopComplete?: () => void;
}

export function HeroBoomerangVideo({
  className = "",
}: HeroBoomerangVideoProps) {
  // Performance Optimization: Replaced 80-frame canvas animation with optimized HTML5 Video
  return (
    <div className={`relative w-full h-screen overflow-hidden ${className}`}>
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="/assets/hero-sequence/A_seamless_hypnotic_1080p_202601282032_000.jpg"
        className="absolute inset-0 w-full h-full object-cover"
      >
        {/* In production, this should point to an optimized WebM/MP4 file */}
        {/* Fallback to static image if video fails or not provided */}
        <img
          src="/assets/hero-sequence/A_seamless_hypnotic_1080p_202601282032_000.jpg"
          alt="Hero Animation"
          className="w-full h-full object-cover"
        />
      </video>

      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0F1A]/30 via-transparent to-[#0A0F1A]/80 pointer-events-none" />
    </div>
  );
}

export const BoomerangImage = HeroBoomerangVideo;

export default HeroBoomerangVideo;
