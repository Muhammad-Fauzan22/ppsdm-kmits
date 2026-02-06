"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { DimensionData } from "@/data/dimensions";

interface DimensionCardProps {
  dimension: DimensionData;
  index: number;
}

export function DimensionCard({ dimension, index }: DimensionCardProps) {
  const isSoft = dimension.type === "soft";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="group relative h-full flex flex-col justify-between p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 hover:border-its-blue/50 transition-all duration-300"
    >
      {/* Top Section */}
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isSoft ? "bg-its-gold/10 text-its-gold" : "bg-brand-blue/10 text-brand-blue"}`}>
            <span className="material-symbols-outlined text-2xl">{dimension.icon}</span>
          </div>
          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${isSoft ? "bg-its-gold/10 text-its-gold" : "bg-brand-blue/10 text-brand-blue"}`}>
            {dimension.type} Skill
          </span>
        </div>

        <h3 className="text-xl font-bold font-heading text-white mb-2 group-hover:text-brand-accent transition-colors">
          {dimension.title}
        </h3>
        <p className="text-sm text-slate-400 leading-relaxed mb-4">
          {dimension.description}
        </p>

        {/* Validation Stat */}
        <div className="flex items-center gap-2 mb-6">
          <span className="material-symbols-outlined text-green-500 text-sm">verified_user</span>
          <span className="text-xs font-semibold text-slate-300 bg-white/5 py-1 px-2 rounded">
            {dimension.stat}
          </span>
        </div>
      </div>

      {/* Bottom Action */}
      <Link
        href={dimension.link}
        className="mt-auto w-full py-3 rounded-xl bg-white/5 border border-white/10 text-center text-sm font-semibold text-white hover:bg-brand-blue hover:text-white hover:border-brand-blue transition-all"
      >
        Pelajari Detil
      </Link>
    </motion.div>
  );
}
