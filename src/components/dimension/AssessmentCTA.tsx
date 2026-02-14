"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { DimensionData } from "@/data/dimensions";
import { Zap, LayoutDashboard } from "lucide-react";

interface AssessmentCTAProps {
  dimension: DimensionData;
}

export function AssessmentCTA({ dimension }: AssessmentCTAProps) {
  return (
    <section className="py-16 px-6 bg-[#0A0F1A]">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Siap untuk Mengukur Potensi Anda?
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-8">
            Mulai assessment {dimension.title} sekarang untuk mendapatkan profil
            komprehensif dan rekomendasi personal untuk pengembangan diri.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={dimension.assessmentLink}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-2xl hover:from-cyan-400 hover:to-blue-400 transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              <span>Mulai Assessment</span>
              <Zap className="w-5 h-5" />
            </Link>
            <Link
              href="/assessment"
              className="px-8 py-4 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 transition-all flex items-center gap-2 border border-white/20"
            >
              <span>Lihat Semua Dimensi</span>
              <LayoutDashboard className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
