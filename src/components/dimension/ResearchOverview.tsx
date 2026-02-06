"use client";

import { motion } from "framer-motion";
import { DimensionResearch } from "@/data/dimensions";

interface ResearchOverviewProps {
  research: DimensionResearch;
}

export function ResearchOverview({ research }: ResearchOverviewProps) {
  return (
    <section className="py-16 px-6 bg-[#0A0F1A]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Validitas & Reliabilitas
          </h2>
          <p className="text-slate-400 max-w-2xl">
            Assessment ini dikembangkan berdasarkan penelitian psikometrik yang ketat
            dengan validasi pada {research.sampleSize} responden Indonesia.
          </p>
        </motion.div>
        
        {/* Psychometric Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Reliability */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-green-400 text-2xl">
                  verified
                </span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-400">Reliability</h3>
                <p className="text-2xl font-bold text-white">
                  α = {research.reliability.toFixed(2)}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Cronbach's Alpha menunjukkan konsistensi internal yang {research.reliability >= 0.8 ? "sangat baik" : "baik"}
            </p>
          </div>
          
          {/* Validity */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-blue-400 text-2xl">
                  assessment
                </span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-400">Validity</h3>
                <p className="text-lg font-bold text-white">
                  {research.validity}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Construct validity melalui Confirmatory Factor Analysis
            </p>
          </div>
          
          {/* Sample Size */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-purple-400 text-2xl">
                  groups
                </span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-400">Sample Size</h3>
                <p className="text-2xl font-bold text-white">
                  n = {research.sampleSize}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Validasi pada populasi mahasiswa Indonesia
            </p>
          </div>
          
          {/* Item Count */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-amber-400 text-2xl">
                  quiz
                </span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-400">Items</h3>
                <p className="text-2xl font-bold text-white">
                  {research.psychometricProperties.itemCount}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Jumlah pertanyaan dalam assessment
            </p>
          </div>
        </div>
        
        {/* Normative Data */}
        <div className="mt-8 glass-card rounded-2xl p-8">
          <h3 className="text-xl font-bold text-white mb-6">Data Normatif</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-slate-400 mb-2">Mean</p>
              <p className="text-3xl font-bold text-cyan-400">
                {research.normativeData.mean}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-2">Standard Deviation</p>
              <p className="text-3xl font-bold text-blue-400">
                {research.normativeData.sd}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-2">Interpretation</p>
              <p className="text-lg text-slate-300">
                {research.normativeData.interpretation}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
