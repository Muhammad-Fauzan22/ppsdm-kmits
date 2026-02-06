"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface LearningModulesProps {
  modules: string[];
  dimensionSlug: string;
}

export function LearningModules({ modules, dimensionSlug }: LearningModulesProps) {
  return (
    <section id="modules" className="py-16 px-6 bg-[#0A0F1A]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Modul Pembelajaran
          </h2>
          <p className="text-slate-400 max-w-2xl">
            Tingkatkan kompetensi Anda melalui modul pembelajaran yang dirancang
            khusus untuk pengembangan dimensi ini.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card rounded-2xl p-6 hover:border-cyan-500/50 transition-all group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-cyan-400 text-2xl">
                    school
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  {module}
                </h3>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                Modul pembelajaran interaktif untuk meningkatkan kompetensi Anda.
              </p>
              <Link
                href={`/dimension/${dimensionSlug}/modules/${index}`}
                className="text-cyan-400 font-semibold text-sm flex items-center gap-2 hover:text-cyan-300 transition-colors"
              >
                <span>Mulai Belajar</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
