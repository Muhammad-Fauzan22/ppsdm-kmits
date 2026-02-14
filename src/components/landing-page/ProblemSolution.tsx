"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Compass, BrainCircuit, Frown, ShieldCheck } from 'lucide-react';

const painPoints = [
  {
    title: "Disorientasi Akademik",
    description: "Hanya 18% mahasiswa merasa jurusan mereka sesuai dengan passion. Kebanyakan 'hanyut' tanpa arah jelas.",
    stat: "82% Mahasiswa Bingung",
    Icon: Compass,
    color: "from-red-500 to-rose-600"
  },
  {
    title: "Kesenjangan Soft Skill",
    description: "IPK 4.0 tidak menjamin karir. Industri butuh Leadership & Emotional Intelligence yang jarang diajarkan di kelas.",
    stat: "Gap Kompetensi",
    Icon: BrainCircuit,
    color: "from-amber-500 to-orange-600"
  },
  {
    title: "Burnout & Stress",
    description: "Tekanan akademik tinggi tanpa manajemen mental yang baik. Kesehatan mental menjadi isu utama mahasiswa teknik.",
    stat: "High Stress Level",
    Icon: Frown,
    color: "from-purple-500 to-fuchsia-600"
  }
];

export default function ProblemSolution() {
  return (
    <section className="py-24 px-4 bg-[#050810]">
      <div className="max-w-7xl mx-auto">
        {/* The Reality Check Header */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-red-400 font-bold tracking-widest text-xs uppercase mb-4"
          >
            The Reality Check
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6"
          >
            Kuliah Saja Tidak Cukup
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-400">
              Untuk Bersaing di 2030.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-slate-400 max-w-3xl mx-auto text-lg"
          >
            Dunia berubah cepat. Lulusan teknik tidak hanya dinilai dari kemampuan menghitung beban struktur,
            tapi bagaimana mereka memimpin tim, mengelola stress, dan beradaptasi.
          </motion.p>
        </div>

        {/* Pain Points */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {painPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-[#0D1220] border border-white/5 rounded-2xl p-6 hover:border-white/20 transition-all"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${point.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity`} />

              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${point.color} flex items-center justify-center mb-4`}>
                  <point.Icon className="text-white w-6 h-6" />
                </div>

                <h3 className="text-xl font-bold text-white mb-3">{point.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">{point.description}</p>

                <div className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${point.color} bg-opacity-20 text-white text-xs font-bold opacity-80`}>
                  {point.stat}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Solution Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/20 mb-6"
          >
            <ShieldCheck className="text-blue-400 w-5 h-5" />
            <span className="text-blue-400 font-semibold">PPSDM KM ITS Hadir Sebagai Solusi</span>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-slate-400 max-w-2xl mx-auto"
          >
            Kami menyediakan Ecosystem Support System yang melengkapi kurikulum akademik ITS.
            Wadah untuk tumbuh menjadi manusia utuh.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
