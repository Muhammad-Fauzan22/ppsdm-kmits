"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { CheckCircle, Clock, BarChart3, Shield, Target, Zap, Brain, Users, TrendingUp } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  stats?: string;
  color: string;
  delay: number;
}

function FeatureCard({ icon, title, description, stats, color, delay }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      viewport={{ once: true }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-white/60 mb-3">{description}</p>
      {stats && (
        <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white/80 text-sm font-medium">
          {stats}
        </span>
      )}
    </motion.div>
  );
}

function ProcessStep({ number, title, description, delay }: { number: number; title: string; description: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      viewport={{ once: true }}
      className="flex gap-4"
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-bold">
        {number}
      </div>
      <div>
        <h4 className="text-lg font-semibold text-white mb-1">{title}</h4>
        <p className="text-white/60 text-sm">{description}</p>
      </div>
    </motion.div>
  );
}

export function AssessmentEngineShowcase() {
  const features = [
    {
      icon: <Brain className="w-6 h-6 text-white" />,
      title: "72 Pertanyaan Tervalidasi",
      description: "Instrument psikometrik dengan reliabilitas tinggi, diadaptasi untuk konteks mahasiswa Indonesia",
      stats: "Reliabilitas Tinggi",
      color: "from-violet-500 to-purple-500"
    },
    {
      icon: <Users className="w-6 h-6 text-white" />,
      title: "Norma 2,000+ Mahasiswa",
      description: "Data normatif dari sampel representatif mahasiswa Indonesia dari berbagai universitas",
      stats: "Data Valid",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-white" />,
      title: "IRT-based Scoring",
      description: "Item Response Theory untuk akurasi maksimal dalam pengukuran kemampuan",
      stats: "Akurasi Tinggi",
      color: "from-emerald-500 to-green-500"
    },
    {
      icon: <Target className="w-6 h-6 text-white" />,
      title: "Personalized Weighting",
      description: "Penyesuaian bobot berdasarkan konteks jurusan dan tujuan karir",
      stats: "Personalisasi",
      color: "from-amber-500 to-orange-500"
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-white" />,
      title: "Visual Radar Chart",
      description: "Visualisasi 9 dimensi dalam satu tampilan untuk gambaran holistik",
      stats: "Holistik",
      color: "from-rose-500 to-pink-500"
    },
    {
      icon: <Zap className="w-6 h-6 text-white" />,
      title: "Instant Feedback",
      description: "Hasil analisis langsung dengan rekomendasi pengembangan personal",
      stats: "Real-time",
      color: "from-indigo-500 to-violet-500"
    }
  ];

  const process = [
    { title: "Registrasi Cepat", description: "2 menit dengan SSO ITS" },
    { title: "Assessment Holistik", description: "30 menit, 9 dimensi" },
    { title: "Analisis Otomatis", description: "Instant scoring dengan AI" },
    { title: "Personalized Report", description: "40+ halaman PDF" },
    { title: "Action Plan", description: "Rekomendasi intervensi spesifik" }
  ];

  const psychometricStats = [
    { label: "Reliability", value: "Teruji", desc: "Konsisten (Excellent)" },
    { label: "Validity", value: "Valid", desc: "Akurasi Tinggi" },
    { label: "Standard Error", value: "Minim", desc: "Presisi Tinggi" },
    { label: "Test-Retest", value: "Stabil", desc: "Konsistensi Waktu" }
  ];

  return (
    <section className="py-24 bg-[#0A0F1A]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-violet-500/20 text-violet-400 text-sm font-medium mb-4">
            Assessment Engine
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Assessment{" "}
            <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              Psikometrik Tervalidasi
            </span>
          </h2>
          <p className="text-xl text-white/60 max-w-3xl mx-auto">
            Bukan tes biasa, tapi pemetaan potensi berbasis sains dengan instrument terstandarisasi
          </p>
        </motion.div>

        {/* Psychometric Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {psychometricStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-6 bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30 rounded-2xl text-center"
            >
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-white/80 font-medium">{stat.label}</div>
              <div className="text-xs text-white/50 mt-1">{stat.desc}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} {...feature} delay={index * 0.1} />
          ))}
        </div>

        {/* Process Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-white mb-8 text-center">
            Proses Assessment
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {process.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl text-center h-full">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-bold mx-auto mb-4">
                    {index + 1}
                  </div>
                  <h4 className="text-white font-semibold mb-2">{step.title}</h4>
                  <p className="text-white/50 text-sm">{step.description}</p>
                </div>
                {index < process.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-violet-500 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Sample Output Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/30 rounded-3xl p-8 md:p-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Visualisasi Hasil yang Jelas
              </h3>
              <p className="text-white/60 mb-6">
                Setelah menyelesaikan assessment, Anda akan menerima laporan lengkap dengan:
              </p>
              <ul className="space-y-3">
                {[
                  "Radar Chart 9 dimensi interaktif",
                  "Analisis gap antara kondisi saat ini dan target",
                  "Prioritas pengembangan berdasarkan impact & effort",
                  "Rekomendasi intervensi yang dipersonalisasi",
                  "Tracking progress dari waktu ke waktu"
                ].map((item, index) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 text-white/70"
                  >
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* 3D Radar Chart Preview */}
            <div className="relative perspective-1000 group">
              <div className="aspect-square max-w-xs mx-auto flex items-center justify-center transform-style-3d transition-transform duration-700 group-hover:rotate-y-12">

                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />

                {/* 3D Rotating Layers */}
                <div className="relative w-64 h-64 transform-style-3d animate-[spin_30s_linear_infinite]">

                  {/* Layer 1: Base Grid */}
                  <div className="absolute inset-0 transform translate-z-0 opacity-30">
                    <svg viewBox="0 0 200 200" className="w-full h-full text-slate-500">
                      <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
                      <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
                      <circle cx="100" cy="100" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
                      {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
                        <line key={deg} x1="100" y1="100" x2={100 + 90 * Math.cos(deg * Math.PI / 180)} y2={100 + 90 * Math.sin(deg * Math.PI / 180)} stroke="currentColor" strokeWidth="0.5" />
                      ))}
                    </svg>
                  </div>

                  {/* Layer 2: Data Polygon (Lower Confidence) */}
                  <div className="absolute inset-0 transform translate-z-[20px] opacity-40">
                    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]">
                      <polygon points="100,20 170,80 160,160 40,160 30,80" fill="rgba(139, 92, 246, 0.2)" stroke="rgba(139, 92, 246, 0.5)" strokeWidth="1" />
                    </svg>
                  </div>

                  {/* Layer 3: Main Data Polygon (High Confidence) */}
                  <div className="absolute inset-0 transform translate-z-[40px]">
                    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_15px_rgba(56,189,248,0.6)]">
                      <polygon points="100,30 155,70 145,130 55,130 45,70" fill="rgba(56, 189, 248, 0.3)" stroke="#38BDF8" strokeWidth="2" />
                      {[
                        [100, 30], [155, 70], [145, 130], [55, 130], [45, 70]
                      ].map(([x, y], i) => (
                        <circle key={i} cx={x} cy={y} r="3" fill="#fff" className="animate-pulse" />
                      ))}
                    </svg>
                  </div>

                  {/* Floating Labels (3D) */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 transform translate-z-[50px] bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] text-white border border-white/10">
                    Cognitive
                  </div>
                  <div className="absolute bottom-10 right-0 transform translate-z-[50px] bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] text-white border border-white/10">
                    Social
                  </div>
                  <div className="absolute bottom-10 left-0 transform translate-z-[50px] bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] text-white border border-white/10">
                    Emotional
                  </div>

                </div>
              </div>

              <div className="text-center mt-8">
                <span className="inline-flex items-center gap-2 text-white/50 text-xs px-3 py-1 rounded-full bg-white/5 border border-white/5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                  </span>
                  Interactive 3D Preview
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default AssessmentEngineShowcase;
