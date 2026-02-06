"use client";

import { motion } from "framer-motion";

interface KeyFindingsProps {
  findings: string[];
}

export function KeyFindings({ findings }: KeyFindingsProps) {
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
            Temuan Utama Riset
          </h2>
          <p className="text-slate-400 max-w-2xl">
            Berikut adalah temuan kunci dari penelitian yang mendukung
            pengembangan assessment ini.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {findings.map((finding, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card rounded-2xl p-6 border-l-4 border-cyan-500"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-cyan-400 font-bold">{index + 1}</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {finding}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
