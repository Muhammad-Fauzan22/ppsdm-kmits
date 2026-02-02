"use client";

import { motion } from "framer-motion";
import { ChevronRight, Clock, Users, BookOpen, CheckCircle } from "lucide-react";
import { DIMENSION_DATA, type DimensionInfo } from "@/lib/dimensionData";

interface DimensionPreTestInfoProps {
  dimensionId: string;
  onStart: () => void;
  onBack?: () => void;
}

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  Brain: ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
    </svg>
  ),
  Clock: ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  DollarSign: ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  Dumbbell: ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m6.5 6.5 11 11"/>
      <path d="m21 21-1-1"/>
      <path d="m3 3 1 1"/>
      <path d="m18 22 4-4"/>
      <path d="m2 6 4-4"/>
    </svg>
  ),
  Heart: ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
    </svg>
  ),
  Sparkles: ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/>
      <path d="M19 17v4"/>
      <path d="M3 5h4"/>
      <path d="M17 19h4"/>
    </svg>
  ),
  Scale: ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
      <path d="M7 21h10"/>
      <path d="M12 3v18"/>
      <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>
    </svg>
  ),
  Sparkle: ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    </svg>
  ),
  Leaf: ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
    </svg>
  ),
};

export function DimensionPreTestInfo({ dimensionId, onStart, onBack }: DimensionPreTestInfoProps) {
  const dimension = DIMENSION_DATA[dimensionId];
  
  if (!dimension) {
    return <div>Dimension not found</div>;
  }

  const IconComponent = icons[dimension.icon] || icons.Brain;

  return (
    <div className="min-h-screen bg-[#0A0F1A] text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-br ${dimension.gradient} opacity-5`} />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-400">Assessment Progress</span>
            <span className="text-sm font-semibold" style={{ color: dimension.color }}>
              {dimension.step} / {dimension.totalSteps}
            </span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(dimension.step / dimension.totalSteps) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ backgroundColor: dimension.color }}
            />
          </div>
        </div>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden"
        >
          {/* Header Section */}
          <div className={`p-8 bg-gradient-to-br ${dimension.gradient} relative overflow-hidden`}>
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10 flex items-start gap-6">
              <div className="p-4 bg-white/20 backdrop-blur rounded-2xl">
                <IconComponent className="w-12 h-12 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-white/80 text-sm font-medium tracking-wider uppercase">
                    Dimensi {dimension.step}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {dimension.name}
                </h1>
                <p className="text-white/90 text-lg">{dimension.nameEn}</p>
                <p className="text-white/70 mt-2 italic">"{dimension.tagline}"</p>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="px-8 py-4 bg-white/5 border-b border-white/10 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-sm">
                <span className="text-slate-400">Reliabilitas:</span>{" "}
                <span className="font-semibold">α = {dimension.reliability}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-sm">
                <span className="text-slate-400">Sampel:</span>{" "}
                <span className="font-semibold">n = {dimension.sampleSize.toLocaleString()}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <span className="text-sm">
                <span className="text-slate-400">Validitas:</span>{" "}
                <span className="font-semibold">CFI = {dimension.validity.cfi}</span>
              </span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Clock className="w-5 h-5 text-slate-400" />
              <span className="text-sm text-slate-400">{dimension.estimatedTime}</span>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="w-1 h-6 rounded-full" style={{ backgroundColor: dimension.color }} />
                Tentang Dimensi Ini
              </h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                {dimension.longDescription}
              </p>
              <div className="p-4 bg-white/5 rounded-xl border-l-4" style={{ borderColor: dimension.color }}>
                <p className="text-sm text-slate-400 italic">
                  💡 {dimension.importanceText}
                </p>
              </div>
            </div>

            {/* What Will Be Measured */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="w-1 h-6 rounded-full" style={{ backgroundColor: dimension.color }} />
                Apa yang Akan Diukur?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {dimension.whatIsMeasured.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-3 p-3 bg-white/5 rounded-lg"
                  >
                    <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: `${dimension.color}33`, color: dimension.color }}
                    >
                      {index + 1}
                    </span>
                    <span className="text-sm text-slate-300">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Sub-dimensions Grid */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="w-1 h-6 rounded-full" style={{ backgroundColor: dimension.color }} />
                Sub-Dimensi ({dimension.subDimensions.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dimension.subDimensions.map((sub, index) => (
                  <motion.div
                    key={sub.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-white">{sub.name}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-slate-400">
                        {sub.itemCount} item
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mb-2">{sub.nameEn}</p>
                    <p className="text-sm text-slate-300">{sub.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Research Sources */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="w-1 h-6 rounded-full" style={{ backgroundColor: dimension.color }} />
                Dasar Riset Ilmiah
              </h2>
              <div className="p-4 bg-white/5 rounded-xl">
                <ul className="space-y-2">
                  {dimension.researchBasis.map((source, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-slate-400">
                      <span className="text-slate-500">•</span>
                      {source}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Interpretation Preview */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="w-1 h-6 rounded-full" style={{ backgroundColor: dimension.color }} />
                Level Interpretasi
              </h2>
              <div className="space-y-2">
                {dimension.interpretationLevels.map((level, index) => (
                  <div
                    key={level.level}
                    className="flex items-center gap-4 p-3 bg-white/5 rounded-lg"
                  >
                    <div className="flex-shrink-0 w-24">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${
                        index === 4 ? 'bg-green-500/20 text-green-400' :
                        index === 3 ? 'bg-blue-500/20 text-blue-400' :
                        index === 2 ? 'bg-yellow-500/20 text-yellow-400' :
                        index === 1 ? 'bg-orange-500/20 text-orange-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {level.level}
                      </span>
                    </div>
                    <div className="flex-1">
                      <span className="text-slate-400 text-sm">{level.range[0]} - {level.range[1]}:</span>{" "}
                      <span className="text-slate-300 text-sm">{level.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
              {onBack && (
                <button
                  onClick={onBack}
                  className="w-full sm:w-auto px-6 py-3 text-slate-400 hover:text-white transition-colors"
                >
                  ← Kembali
                </button>
              )}
              <div className="flex items-center gap-2 text-slate-400">
                <Clock className="w-5 h-5" />
                <span>{dimension.estimatedTime} untuk {dimension.subDimensions.reduce((sum, s) => sum + s.itemCount, 0)} pertanyaan</span>
              </div>
              <button
                onClick={onStart}
                className="w-full sm:w-auto px-8 py-4 bg-white text-[#0A0F1A] font-bold rounded-xl hover:scale-105 transition-transform flex items-center justify-center gap-2 group"
              >
                Mulai Assessment
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-slate-500">
            Data Anda dijaga kerahasiaannya dan hanya digunakan untuk pengembangan personal.{" "}
            <a href="/privacy" className="text-slate-400 hover:text-white underline">Kebijakan Privasi</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
