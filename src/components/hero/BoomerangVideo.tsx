'use client';

import { motion } from 'framer-motion';

interface BoomerangVideoProps {
  opacity?: number;
  className?: string;
}

export function BoomerangVideo({ opacity = 0.3, className = '' }: BoomerangVideoProps) {
  // Premium abstract animation replacing the heavy video
  return (
    <div className={`absolute inset-0 overflow-hidden bg-[#0A0F1A] ${className}`}>
      {/* Dynamic Background Mesh */}
      <motion.div
        className="absolute inset-0 opacity-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-its-blue/30 rounded-full blur-[120px] mix-blend-screen animate-float-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-brand-blue/20 rounded-full blur-[100px] mix-blend-screen animate-float-delayed" />
        <div className="absolute top-[30%] left-[40%] w-[40%] h-[40%] bg-its-gold/10 rounded-full blur-[80px] mix-blend-screen animate-pulse-slow" />
      </motion.div>

      {/* Abstract Grid Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      {/* Interactive Elements (Simulating the 'Boomerang' effect) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="w-[800px] h-[800px] border border-white/5 rounded-full"
          animate={{
            rotate: 360,
            scale: [1, 1.05, 1],
          }}
          transition={{
            rotate: { duration: 60, repeat: Infinity, ease: "linear" },
            scale: { duration: 10, repeat: Infinity, ease: "easeInOut" }
          }}
        />
        <motion.div
          className="absolute w-[600px] h-[600px] border border-white/5 rounded-full"
          animate={{
            rotate: -360,
            scale: [1, 0.95, 1],
          }}
          transition={{
            rotate: { duration: 45, repeat: Infinity, ease: "linear" },
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
          }}
        />
      </div>

      {/* Glass Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0F1A]/50 to-[#0A0F1A]" />
    </div>
  );
}

export default BoomerangVideo;
