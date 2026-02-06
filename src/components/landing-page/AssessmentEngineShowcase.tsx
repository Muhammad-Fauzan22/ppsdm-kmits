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
      stats: "α = 0.87",
      color: "from-violet-500 to-purple-500"
    },
    {
      icon: <Users className="w-6 h-6 text-white" />,
      title: "Norma 2,000+ Mahasiswa",
      description: "Data normatif dari sampel representatif mahasiswa Indonesia dari berbagai universitas",
      stats: "CFI = 0.92",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-white" />,
      title: "IRT-based Scoring",
      description: "Item Response Theory untuk akurasi maksimal dalam pengukuran kemampuan",
      stats: "SEM = 3.2",
      color: "from-emerald-500 to-green-500"
    },
    {
      icon: <Target className="w-6 h-6 text-white" />,
      title: "Personalized Weighting",
      description: "Penyesuaian bobot berdasarkan konteks jurusan dan tujuan karir",
      stats: "95% CI",
      color: "from-amber-500 to-orange-500"
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-white" />,
      title: "Visual Radar Chart",
      description: "Visualisasi 9 dimensi dalam satu tampilan untuk gambaran holistik",
      stats: "9 axes",
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
    { label: "Reliability", value: "α = 0.87", desc: "Excellent (Nunnally)" },
    { label: "Validity", value: "CFI = 0.92", desc: "Good fit indices" },
    { label: "RMSEA", value: "0.05", desc: "Excellent" },
    { label: "Test-Retest", value: "r = 0.82", desc: "4-week interval" }
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
            
            {/* Radar Chart Preview */}
            <div className="relative">
              <div className="aspect-square max-w-xs mx-auto bg-white/5 rounded-2xl p-8 flex items-center justify-center">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {/* Grid circles */}
                  {[0.25, 0.5, 0.75, 1].map((scale, i) => (
                    <circle
                      key={i}
                      cx="100"
                      cy="100"
                      r={80 * scale}
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="0.5"
                    />
                  ))}
                  {/* Axis lines */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                    <line
                      key={i}
                      x1="100"
                      y1="100"
                      x2={100 + 80 * Math.cos((angle - 90) * Math.PI / 180)}
                      y2={100 + 80 * Math.sin((angle - 90) * Math.PI / 180)}
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="0.5"
                    />
                  ))}
                  {/* Data polygon */}
                  <polygon
                    points="100,30 155,70 145,130 55,130 45,70"
                    fill="rgba(139, 92, 246, 0.3)"
                    stroke="rgba(139, 92, 246, 0.8)"
                    strokeWidth="2"
                  />
                  {/* Data points */}
                  {[
                    [100, 30], [155, 70], [145, 130], [55, 130], [45, 70]
                  ].map(([x, y], i) => (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="4"
                      fill="rgba(139, 92, 246, 1)"
                    />
                  ))}
                </svg>
              </div>
              <div className="text-center mt-4">
                <span className="text-white/50 text-sm">Contoh Radar Chart 9 Dimensi</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default AssessmentEngineShowcase;
