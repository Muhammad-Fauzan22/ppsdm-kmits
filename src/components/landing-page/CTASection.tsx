"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, Users, Star, Zap, Trophy, TrendingUp } from "lucide-react";
import { useState } from "react";
import confetti from 'canvas-confetti';

/**
 * CTASection - Enhanced with gamification elements
 * Features: XP reward preview, legendary button effect, confetti on click
 */

export function CTASection() {
  const [isClicked, setIsClicked] = useState(false);

  const stats = [
    { value: "2,347+", label: "Mahasiswa Bergabung", icon: Users },
    { value: "98%", label: "Tingkat Kepuasan", icon: Star },
    { value: "9", label: "Dimensi Holistik", icon: Trophy },
    { value: "100%", label: "Gratis untuk ITS", icon: Zap }
  ];

  const handleCTAClick = () => {
    setIsClicked(true);

    // Trigger confetti effect
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FF6B00', '#9C27B0', '#4CAF50']
    });

    // Navigate after animation
    setTimeout(() => {
      window.location.href = '/assessment/start';
    }, 500);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-[#0A0F1A] to-violet-950/20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          {/* XP Reward Teaser */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FFD700]/20 to-[#FF6B00]/20 border border-[#FFD700]/30 rounded-full mb-6"
          >
            <TrendingUp className="w-4 h-4 text-[#FFD700]" />
            <span className="text-sm font-semibold text-[#FFD700]">+500 XP</span>
            <span className="text-sm text-white/60">untuk assessment pertama</span>
          </motion.div>

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
            {/* Legendary-style Primary CTA Button */}
            <motion.button
              onClick={handleCTAClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                relative flex items-center gap-2 px-8 py-4 
                bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600 
                text-white font-bold rounded-xl 
                shadow-lg shadow-violet-500/25 
                hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]
                transition-all duration-300
                overflow-hidden
                ${isClicked ? 'animate-pulse' : ''}
              `}
              style={{ backgroundSize: '200% 100%' }}
            >
              {/* Animated shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
              />

              {/* XP Badge */}
              <span className="relative flex items-center gap-1 text-xs bg-[#FFD700]/20 px-2 py-0.5 rounded-full text-[#FFD700]">
                <Zap className="w-3 h-3" />
                +500 XP
              </span>

              <span className="relative">Mulai Assessment Gratis</span>
              <ArrowRight className="relative w-5 h-5" />
            </motion.button>

            <motion.a
              href="/demo"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition-all apple-button"
            >
              <Play className="w-5 h-5" />
              <span>Lihat Demo Platform</span>
            </motion.a>
          </div>
        </motion.div>

        {/* Stats with Icons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className="text-center p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all hover-lift"
              >
                <Icon className="w-6 h-6 text-violet-400 mx-auto mb-2" />
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-white/50 text-sm">{stat.label}</div>
              </motion.div>
            );
          })}
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
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
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
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-white/20 transition-all hover-lift">
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
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-white/20 transition-all hover-lift">
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
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-white/20 transition-all hover-lift">
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
