"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { DimensionData } from "@/data/dimensions";

interface DimensionHeaderProps {
  dimension: DimensionData;
}

export function DimensionHeader({ dimension }: DimensionHeaderProps) {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden" aria-labelledby="dimension-title">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0F1A] to-[#1A1F2E]" aria-hidden="true" />
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: "0.5s" }} />
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Icon */}
          <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-2xl shadow-cyan-500/30" role="img" aria-label={`Icon untuk ${dimension.title}`}>
            <span className="material-symbols-outlined text-white text-5xl">
              {dimension.icon}
            </span>
          </div>
          
          {/* Title */}
          <h1 id="dimension-title" className="text-5xl md:text-6xl font-bold text-white mb-4">
            {dimension.title}
          </h1>
          
          {/* Tagline */}
          <p className="text-xl text-cyan-400 font-semibold mb-6">
            {dimension.tagline}
          </p>
          
          {/* Description */}
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">
            {dimension.longDescription}
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4" role="group" aria-label="Tombol Aksi">
            <Link
              href={dimension.assessmentLink}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-2xl hover:from-cyan-400 hover:to-blue-400 transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20"
              aria-label={`Mulai Assessment untuk ${dimension.title}`}
            >
              <span>Mulai Assessment</span>
              <span className="material-symbols-outlined">bolt</span>
            </Link>
            <Link
              href="#modules"
              className="px-8 py-4 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 transition-all flex items-center gap-2 border border-white/20"
              aria-label={`Lihat Modul Pembelajaran untuk ${dimension.title}`}
            >
              <span>Lihat Modul Pembelajaran</span>
              <span className="material-symbols-outlined">school</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
