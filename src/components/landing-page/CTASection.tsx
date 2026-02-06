"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, Users, Star } from "lucide-react";

export function CTASection() {
  const stats = [
    { value: "2,347+", label: "Mahasiswa Bergabung" },
    { value: "98%", label: "Tingkat Kepuasan" },
    { value: "9", label: "Dimensi Holistik" },
    { value: "100%", label: "Gratis untuk ITS" }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-[#0A0F1A] to-violet-950/20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Mulai Perjalanan Pengembangan Diri Anda{" "}
            <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              Sekarang
            </span>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-8">
            Bergabung dengan 2,347+ mahasiswa ITS yang sudah menemukan peta menuju versi terbaik diri mereka.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a
              href="/assessment/start"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all"
            >
              <span>Mulai Assessment Gratis</span>
              <ArrowRight className="w-5 h-5" />
            </motion.a>
            
            <motion.a
              href="/demo"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition-all"
            >
              <Play className="w-5 h-5" />
              <span>Lihat Demo Platform</span>
            </motion.a>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-white/50 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Signals */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-8 text-white/40"
        >
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <span className="text-sm">Didukung oleh ITS</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            <span className="text-sm">Akreditasi Terverifikasi</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            <span className="text-sm">Riset Terpublikasi</span>
          </div>
        </motion.div>

        {/* Secondary CTA for Different User Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* For Prospective Users */}
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-2">
              Masih Ragu?
            </h3>
            <p className="text-white/50 text-sm mb-4">
              Coba mini-assessment 5 menit untuk merasakan pengalaman assessment kami.
            </p>
            <a
              href="/assessment/preview"
              className="text-violet-400 hover:text-violet-300 text-sm font-medium inline-flex items-center gap-1"
            >
              Coba Mini-Assessment
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* For Faculty/Staff */}
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-2">
              Dosen & Staff ITS
            </h3>
            <p className="text-white/50 text-sm mb-4">
              Akses dashboard kelas untuk memantau perkembangan mahasiswa.
            </p>
            <a
              href="/faculty/dashboard"
              className="text-violet-400 hover:text-violet-300 text-sm font-medium inline-flex items-center gap-1"
            >
              Akses Dashboard
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* For Researchers */}
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-2">
              Peneliti
            </h3>
            <p className="text-white/50 text-sm mb-4">
              Akses data agregat untuk penelitian pengembangan pendidikan.
            </p>
            <a
              href="/research/access"
              className="text-violet-400 hover:text-violet-300 text-sm font-medium inline-flex items-center gap-1"
            >
              Ajukan Akses
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default CTASection;
