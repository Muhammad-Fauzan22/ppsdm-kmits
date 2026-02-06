"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";

interface ProblemCardProps {
  title: string;
  description: string;
  icon: string;
  index: number;
}

function ProblemCard({ title, description, icon, index }: ProblemCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 transition-colors group"
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-violet-400 transition-colors">
        {title}
      </h3>
      <p className="text-white/70 leading-relaxed">{description}</p>
    </motion.div>
  );
}

interface SolutionPillarProps {
  title: string;
  description: string;
  stats: { label: string; value: string };
  index: number;
  color: string;
}

function SolutionPillar({ title, description, stats, index, color }: SolutionPillarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      viewport={{ once: true }}
      className="relative p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden group"
    >
      {/* Animated gradient background */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10`}
        transition={{ duration: 0.3 }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-white/60">
            Pillar {index + 1}
          </span>
        </div>

        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-white/70 leading-relaxed mb-6">{description}</p>

        <div className="flex items-center gap-4">
          <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${color.split(" ")[0]} ${color.split(" ")[1]}`}
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              transition={{ delay: 0.5, duration: 1 }}
            />
          </div>
          <span className="text-sm font-semibold text-white/90">{stats.value}</span>
        </div>
        <p className="text-xs text-white/50 mt-1">{stats.label}</p>
      </div>
    </motion.div>
  );
}

export function ProblemSolutionSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const problems = [
    {
      title: "Pemahaman Diri yang Terfragmentasi",
      description: "Kebanyakan mahasiswa hanya fokus pada IPK, tanpa memahami 8 dimensi perkembangan lainnya. Tidak ada alat untuk mengukur perkembangan karakter, kesehatan mental, dan kecerdasan finansial secara terintegrasi.",
      icon: "🔍"
    },
    {
      title: "Sistem Pendidikan yang Parsial",
      description: "Kurikulum kampus hanya mengembangkan aspek kognitif, meninggalkan 8 dimensi penting lainnya. Tidak ada roadmap pengembangan diri yang personal dan berbasis data.",
      icon: "📚"
    },
    {
      title: "Preparasi Karir yang Tidak Holistik",
      description: "Lulusan teknik sering kali unggul teknis tetapi tertinggal dalam soft skills dan leadership. Kesenjangan antara kompetensi akademik dan kebutuhan dunia kerja yang kompleks.",
      icon: "💼"
    }
  ];

  const solutions = [
    {
      title: "Assessment Berbasis Sains",
      description: "72 pertanyaan psikometrik tervalidasi dengan reliabilitas tinggi. Norma dari 2,000+ mahasiswa Indonesia dengan instant personalized feedback.",
      stats: { label: "Reliabilitas", value: "Teruji Ilmiah" },
      color: "from-violet-500 to-purple-600"
    },
    {
      title: "Personalized Development Pathways",
      description: "Rekomendasi intervensi yang disesuaikan dengan profil unik Anda. Learning path otomatis berdasarkan gap analysis dengan progress tracking real-time.",
      stats: { label: "Personalisasi", value: "100%" },
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "Ecosystem Integration",
      description: "Terhubung dengan sistem ITS, BEM, Himpunan, UKM. Jembatan alumni-mahasiswa dan industry partnership pathways.",
      stats: { label: "Integrations", value: "15+" },
      color: "from-emerald-500 to-green-600"
    }
  ];

  return (
    <section ref={sectionRef} className="relative py-24 bg-[#0A0F1A] overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.span
            className="inline-block px-4 py-2 rounded-full bg-violet-500/20 text-violet-400 text-sm font-medium mb-4"
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
          >
            Problem & Solution
          </motion.span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Dari Tantangan Menuju{" "}
            <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              Solusi
            </span>
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Kami memahami tantangan yang dihadapi mahasiswa Indonesia dan menyediakan solusi berbasis sains untuk mengatasinya.
          </p>
        </motion.div>

        {/* Problems Grid */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <span className="w-1 h-8 bg-gradient-to-b from-red-500 to-orange-500 rounded-full" />
            Tantangan yang Kami Temui
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {problems.map((problem, index) => (
              <ProblemCard key={index} {...problem} index={index} />
            ))}
          </div>
        </div>

        {/* Solutions Grid */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <span className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-green-500 rounded-full" />
            Solusi Kami
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {solutions.map((solution, index) => (
              <SolutionPillar key={index} {...solution} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProblemSolutionSection;
