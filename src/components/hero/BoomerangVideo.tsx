'use client';

import { motion } from 'framer-motion';

interface BoomerangVideoProps {
  opacity?: number;
  className?: string;
}

export function BoomerangVideo({ opacity = 0.3, className = '' }: BoomerangVideoProps) {
  // Video Background implementation based on user request (Video ID: 263)
  return (
    <div className={`absolute inset-0 w-full h-full overflow-hidden bg-[#0A0F1A] ${className}`}>
      <video
        autoPlay
        loop
        muted
        playsInline
        // Using the previous hero frame as a placeholder/poster since we can't extract frame 1 from the new video
        poster="/assets/hero-sequence/A_seamless_hypnotic_1080p_202601282032_000.jpg"
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        style={{ opacity }}
      >
        <source src="/assets/hero-video/hero.webm" type="video/webm" />
        <source src="/assets/hero-video/hero.mp4" type="video/mp4" />
      </video>

      {/* Glass Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0F1A]/50 to-[#0A0F1A] z-10" />

      {/* Optional: Overlay mesh for texture if needed, currently kept minimal as per video focus */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] bg-center z-10 mix-blend-overlay" />
    </div>
  );
}

export default BoomerangVideo;
