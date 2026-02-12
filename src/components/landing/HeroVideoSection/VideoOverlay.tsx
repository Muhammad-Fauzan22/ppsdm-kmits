/**
 * VideoOverlay.tsx
 * Text overlays for narrative phases with animated transitions
 */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NARRATIVE_PHASES } from "./useScrollAnimation";

interface PhaseContent {
  title: string;
  subtitle: string;
  highlightText: string;
  callToAction?: string;
}

export const PHASE_CONTENT: Record<string, PhaseContent> = {
  problem: {
    title: "Tantangan",
    subtitle: "9 Dimensi Fragmentasi",
    highlightText: "Pengembangan Terpisahkan",
    callToAction: "Mari kita lihat realitas yang dihadapi",
  },
  connection: {
    title: "Koneksi",
    subtitle: "MenyatukanSemua Aspek",
    highlightText: "Platform Terintegrasi",
    callToAction: "PPSDM menghubungkan semua dimensi",
  },
  transformation: {
    title: "Transformasi",
    subtitle: "Menuju Kesatuan",
    highlightText: "Sistem Terpadu",
    callToAction: "9 dimensi menjadi satu kesatuan",
  },
  impact: {
    title: "Dampak",
    subtitle: "Masa Depan Cerah",
    highlightText: "Karir yang Gemilang",
    callToAction: "Siap untuk masa depan?",
  },
};

interface VideoOverlayProps {
  currentPhase: string;
  scrollProgress: number;
  phaseProgress: number;
  isMobile?: boolean;
}

export function VideoOverlay({
  currentPhase,
  scrollProgress,
  phaseProgress,
  isMobile = false,
}: VideoOverlayProps) {
  const content = PHASE_CONTENT[currentPhase] || PHASE_CONTENT.problem;

  // Animation variants
  const titleVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.6, ease: "easeOut" as any }
    },
    exit: {
      opacity: 0,
      y: -30,
      filter: "blur(10px)",
      transition: { duration: 0.4, ease: "easeIn" as any }
    },
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: 0.2 }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3, delay: 0.1 }
    },
  };

  const highlightVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, delay: 0.4 }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.3 }
    },
  };

  const ctaVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, delay: 0.6 }
    },
    exit: {
      opacity: 0,
      y: 10,
      transition: { duration: 0.2 }
    },
  };

  const progressBarVariants = {
    initial: { width: 0 },
    animate: {
      width: `${phaseProgress * 100}%`,
      transition: { duration: 0.3, ease: "easeOut" as any }
    },
  };

  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      {/* Phase indicator dots */}
      <div className="absolute top-6 right-6 flex items-center gap-2">
        {NARRATIVE_PHASES.map((phase, index) => {
          const isActive = phase.id === currentPhase;
          const isPast = NARRATIVE_PHASES.findIndex(p => p.id === currentPhase) > index;

          return (
            <motion.div
              key={phase.id}
              className={`w-2 h-2 rounded-full ${isActive ? "scale-125" : ""
                }`}
              style={{
                backgroundColor: isActive ? phase.color : isPast ? "#4b5563" : "#1f2937",
                boxShadow: isActive ? `0 0 10px ${phase.color}` : "none",
              }}
              animate={{
                scale: isActive ? [1, 1.2, 1] : 1,
              }}
              transition={{
                duration: isActive ? 2 : 0.3,
                repeat: isActive ? Infinity : 0,
              }}
            />
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-white/10">
        <motion.div
          className="h-full"
          style={{
            background: `linear-gradient(90deg, ${NARRATIVE_PHASES.find(p => p.id === currentPhase)?.color || "#3b82f6"}, #60a5fa)`,
            boxShadow: `0 0 10px ${NARRATIVE_PHASES.find(p => p.id === currentPhase)?.color || "#3b82f6"}`,
          }}
          initial="initial"
          animate="animate"
          variants={progressBarVariants}
        />
      </div>

      {/* Main content overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhase}
            className="max-w-4xl text-center"
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Phase label */}
            <motion.div
              className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
              style={{
                backgroundColor: `${NARRATIVE_PHASES.find(p => p.id === currentPhase)?.color}20`,
                border: `1px solid ${NARRATIVE_PHASES.find(p => p.id === currentPhase)?.color}40`,
              }}
              variants={subtitleVariants}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: NARRATIVE_PHASES.find(p => p.id === currentPhase)?.color,
                }}
              />
              <span
                className="text-xs font-semibold uppercase tracking-wider"
                style={{
                  color: NARRATIVE_PHASES.find(p => p.id === currentPhase)?.color,
                }}
              >
                {content.title}
              </span>
            </motion.div>

            {/* Main title */}
            <motion.h2
              className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 tracking-tight"
              variants={titleVariants}
            >
              {content.subtitle}
            </motion.h2>

            {/* Highlight text with gradient */}
            <motion.p
              className="text-xl md:text-3xl font-bold mb-8 bg-gradient-to-r bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${NARRATIVE_PHASES.find(p => p.id === currentPhase)?.color} 0%, #60a5fa 100%)`,
              }}
              variants={highlightVariants}
            >
              {content.highlightText}
            </motion.p>

            {/* Call to action */}
            {content.callToAction && (
              <motion.p
                className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto"
                variants={ctaVariants}
              >
                {content.callToAction}
              </motion.p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom indicator with scroll hint */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ opacity: scrollProgress < 0.9 ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <span className="text-xs text-slate-500 uppercase tracking-widest">
          Scroll untuk melanjutkan
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-8 bg-gradient-to-b from-cyan-500 to-transparent"
        />
      </motion.div>

      {/* Phase-specific decorative elements */}
      <PhaseDecorations currentPhase={currentPhase} phaseProgress={phaseProgress} />
    </div>
  );
}

// Decorative elements for each phase
interface PhaseDecorationsProps {
  currentPhase: string;
  phaseProgress: number;
}

function PhaseDecorations({ currentPhase, phaseProgress }: PhaseDecorationsProps) {
  const decorations = {
    problem: (
      <div className="absolute inset-0 pointer-events-none">
        {/* Fragmented circle outlines */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute border border-red-500/20 rounded-full"
            style={{
              width: 200 + i * 100,
              height: 200 + i * 100,
              left: "50%",
              top: "50%",
              marginLeft: -(100 + i * 50),
              marginTop: -(100 + i * 50),
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>
    ),
    connection: (
      <div className="absolute inset-0 pointer-events-none">
        {/* Golden connection lines */}
        <svg className="absolute inset-0 w-full h-full">
          <motion.path
            d="M 20% 30% Q 50% 50% 80% 30%"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeOpacity={0.3}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: phaseProgress }}
            transition={{ duration: 0.5 }}
          />
          <motion.path
            d="M 20% 70% Q 50% 50% 80% 70%"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeOpacity={0.3}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: phaseProgress }}
            transition={{ duration: 0.5, delay: 0.1 }}
          />
          <motion.path
            d="M 50% 20% L 50% 80%"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeOpacity={0.3}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: phaseProgress }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </svg>
      </div>
    ),
    transformation: (
      <div className="absolute inset-0 pointer-events-none">
        {/* Central PPSDM core glow */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 100,
            height: 100,
            background: "radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%)",
            boxShadow: "0 0 60px rgba(16, 185, 129, 0.4)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        {/* Rotating ring */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-emerald-500/30"
          style={{
            width: 200,
            height: 200,
            marginLeft: -100,
            marginTop: -100,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
      </div>
    ),
    impact: (
      <div className="absolute inset-0 pointer-events-none">
        {/* Expanding network nodes */}
        {[0, 1, 2, 3, 4].map((i) => {
          const angle = (i / 5) * Math.PI * 2;
          const radius = 50 + phaseProgress * 200;
          const x = 50 + Math.cos(angle) * radius * 0.5;
          const y = 50 + Math.sin(angle) * radius * 0.5;

          return (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full bg-blue-500"
              style={{
                left: `${x}%`,
                top: `${y}%`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: phaseProgress > i * 0.2 ? 1 : 0,
                opacity: phaseProgress > i * 0.2 ? 0.8 : 0,
              }}
              transition={{ delay: i * 0.1 }}
            />
          );
        })}
        {/* Connecting lines */}
        <svg className="absolute inset-0 w-full h-full">
          {[0, 1, 2, 3, 4].map((i) => {
            const angle = (i / 5) * Math.PI * 2;
            const radius = 50 + phaseProgress * 200;
            const x = 50 + Math.cos(angle) * radius * 0.5;
            const y = 50 + Math.sin(angle) * radius * 0.5;
            return (
              <motion.line
                key={i}
                x1="50%"
                y1="50%"
                x2={`${x}%`}
                y2={`${y}%`}
                stroke="#3b82f6"
                strokeWidth="1"
                strokeOpacity={0.3}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: phaseProgress }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              />
            );
          })}
        </svg>
      </div>
    ),
  };

  return decorations[currentPhase as keyof typeof decorations] || null;
}

export default VideoOverlay;