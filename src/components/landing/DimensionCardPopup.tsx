"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { DimensionData } from "@/data/dimensions";
import { useMemo } from "react";

interface DimensionCardPopupProps {
  dimension: DimensionData;
  phase: "idle" | "entering" | "active" | "exiting";
  onPhaseChange: (phase: "idle" | "entering" | "active" | "exiting") => void;
}

export function DimensionCardPopup({ dimension, phase, onPhaseChange }: DimensionCardPopupProps) {
  // Memoize key findings and modules to prevent unnecessary re-renders
  const keyFindings = useMemo(() => dimension.research.keyFindings.slice(0, 2), [dimension.research.keyFindings]);
  const modules = useMemo(() => dimension.modules.slice(0, 3), [dimension.modules]);

  return (
    <AnimatePresence mode="wait">
      {phase !== "idle" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="absolute inset-0 z-50 rounded-3xl overflow-hidden"
          onAnimationStart={() => onPhaseChange("entering")}
          onAnimationComplete={() => onPhaseChange("active")}
          onAnimationExitStart={() => onPhaseChange("exiting")}
          role="dialog"
          aria-modal="true"
          aria-label={`${dimension.title} - Detail Information`}
        >
          {/* Holographic Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A0F1A] to-[#1A1F2E]" />
          
          {/* Animated Border */}
          <motion.div
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent bg-[length:200%_100%]"
          />
          
          {/* Content Container */}
          <div className="relative z-10 p-6 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-2xl">
                    {dimension.icon}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{dimension.title}</h3>
                  <p className="text-xs text-cyan-400 font-semibold uppercase tracking-wider">
                    {dimension.tagline}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Research Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-green-400 text-sm">verified</span>
                  <span className="text-xs text-slate-400">Reliability</span>
                </div>
                <p className="text-lg font-bold text-white">
                  α = {dimension.research.reliability.toFixed(2)}
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-blue-400 text-sm">groups</span>
                  <span className="text-xs text-slate-400">Sample</span>
                </div>
                <p className="text-lg font-bold text-white">
                  n = {dimension.research.sampleSize}
                </p>
              </div>
            </div>
            
            {/* Key Findings */}
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Key Findings
              </h4>
              <ul className="space-y-2">
                {keyFindings.map((finding, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="text-cyan-400 mt-0.5">•</span>
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Modules Preview */}
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Learning Modules
              </h4>
              <div className="flex flex-wrap gap-2">
                {modules.map((module, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-cyan-500/10 text-cyan-400 text-xs rounded-full border border-cyan-500/20"
                  >
                    {module}
                  </span>
                ))}
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="mt-auto space-y-2">
              <Link
                href={dimension.assessmentLink}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl hover:from-cyan-400 hover:to-blue-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
                aria-label={`Mulai Assessment untuk ${dimension.title}`}
              >
                <span>Mulai Assessment</span>
                <span className="material-symbols-outlined">bolt</span>
              </Link>
              <Link
                href={dimension.link}
                className="w-full py-3 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 border border-white/10"
                aria-label={`Pelajari Selengkapnya tentang ${dimension.title}`}
              >
                <span>Pelajari Selengkapnya</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
