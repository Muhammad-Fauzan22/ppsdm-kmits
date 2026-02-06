'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect } from 'react';
import { useAssessmentStore } from '@/lib/assessment/store';
import { IncompleteAssessmentModal, useIncompleteAssessmentReminder } from '@/components/assessment/IncompleteAssessmentModal';

const dimensions = [
  { id: 'cognitive', name: 'Kognitif', icon: 'psychology', color: 'blue', desc: 'Kemampuan berpikir kritis, kreativitas, dan metakognisi' },
  { id: 'self-management', name: 'Manajemen Diri', icon: 'schedule', color: 'emerald', desc: 'Pengelolaan waktu, produktivitas, dan pengendalian diri' },
  { id: 'financial', name: 'Finansial', icon: 'account_balance_wallet', color: 'teal', desc: 'Literasi keuangan dan perilaku finansial' },
  { id: 'physical', name: 'Kesehatan Fisik', icon: 'favorite', color: 'red', desc: 'Aktivitas fisik, tidur, dan vitalitas' },
  { id: 'emotional', name: 'Emosional', icon: 'sentiment_satisfied', color: 'pink', desc: 'Kecerdasan emosional dan regulasi emosi' },
  { id: 'mental-health', name: 'Kesehatan Mental', icon: 'self_improvement', color: 'violet', desc: 'Well-being, resiliensi, dan manajemen stres' },
  { id: 'character', name: 'Karakter', icon: 'security', color: 'amber', desc: 'Integritas, etika, dan tanggung jawab sosial' },
  { id: 'spiritual', name: 'Spiritual', icon: 'spa', color: 'purple', desc: 'Makna hidup, gratitude, dan koneksi spiritual' },
  { id: 'environmental', name: 'Lingkungan', icon: 'eco', color: 'green', desc: 'Kesadaran lingkungan dan gaya hidup berkelanjutan' },
];

const colorClasses: Record<string, { bg: string; border: string; text: string }> = {
  blue: { bg: 'from-blue-500/20 to-blue-600/10', border: 'border-blue-500/30', text: 'text-blue-400' },
  emerald: { bg: 'from-emerald-500/20 to-emerald-600/10', border: 'border-emerald-500/30', text: 'text-emerald-400' },
  teal: { bg: 'from-teal-500/20 to-teal-600/10', border: 'border-teal-500/30', text: 'text-teal-400' },
  red: { bg: 'from-red-500/20 to-red-600/10', border: 'border-red-500/30', text: 'text-red-400' },
  pink: { bg: 'from-pink-500/20 to-pink-600/10', border: 'border-pink-500/30', text: 'text-pink-400' },
  violet: { bg: 'from-violet-500/20 to-violet-600/10', border: 'border-violet-500/30', text: 'text-violet-400' },
  amber: { bg: 'from-amber-500/20 to-amber-600/10', border: 'border-amber-500/30', text: 'text-amber-400' },
  purple: { bg: 'from-purple-500/20 to-purple-600/10', border: 'border-purple-500/30', text: 'text-purple-400' },
  green: { bg: 'from-green-500/20 to-green-600/10', border: 'border-green-500/30', text: 'text-green-400' },
};

function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#0A0F1A]/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-its-blue to-brand-blue flex items-center justify-center">
            <span className="material-symbols-outlined text-white">analytics</span>
          </div>
          <span className="text-xl font-bold text-white">PPSDM KMM</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-slate-300 hover:text-white transition-colors">Beranda</Link>
          <span className="text-white font-medium">Assessment</span>
          <Link href="/dashboard" className="text-slate-300 hover:text-white transition-colors">Dashboard</Link>
        </nav>
      </div>
    </header>
  );
}

export default function AssessmentPage() {
  const { startSession, completedDimensions, dimensions: progress } = useAssessmentStore();
  
  // Initialize session on first load
  useEffect(() => {
    startSession();
  }, [startSession]);
  
  // Show reminder for incomplete assessment
  const { showReminder } = useIncompleteAssessmentReminder(completedDimensions.length, () => {
    // Navigate to next incomplete dimension
  });
  
  useEffect(() => {
    showReminder();
  }, [completedDimensions.length, showReminder]);
  
  const completedCount = completedDimensions.length;
  
  return (
    <div className="min-h-screen bg-[#0A0F1A] text-white pt-20 pb-12 px-6">
      <Header />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            Assessment 9 Dimensi
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Temukan kekuatan dan area pengembangan Anda melalui assessment holistik 
            berbasis riset psikometrik dengan 72 pertanyaan teruji.
          </p>
        </motion.div>
        
        {/* Progress Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12 glass-card rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Progress Assessment Anda</h2>
            <span className="text-2xl font-bold text-brand-accent">
              {completedCount}/9
            </span>
          </div>
          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-its-blue to-brand-accent"
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / 9) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-sm text-slate-500 mt-2">
            {completedCount === 9 
              ? 'Selamat! Anda telah menyelesaikan semua dimensi.' 
              : `${9 - completedCount} dimensi lagi untuk menyelesaikan assessment.`}
          </p>
        </motion.div>
        
        {/* Dimensions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dimensions.map((dim, index) => {
            const isCompleted = completedDimensions.includes(dim.id);
            const inProgress = progress[dim.id]?.status === 'in_progress';
            const colors = colorClasses[dim.color];
            
            return (
              <motion.div
                key={dim.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/assessment/${dim.id}/info`}>
                  <div className={`glass-card rounded-2xl p-6 cursor-pointer hover:-translate-y-2 transition-all duration-300 border ${colors.border} ${isCompleted ? 'bg-green-500/10' : ''}`}>
                    {/* Status Badge */}
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.bg} flex items-center justify-center`}>
                        <span className="material-symbols-outlined text-2xl">{dim.icon}</span>
                      </div>
                      {isCompleted && (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full">
                          Selesai
                        </span>
                      )}
                      {inProgress && !isCompleted && (
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-full">
                          Berlangsung
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2">{dim.name}</h3>
                    <p className="text-sm text-slate-400 mb-4">{dim.desc}</p>
                    
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>8 pertanyaan</span>
                      <span>~2 menit</span>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                      <span className="text-xs text-slate-500">α = 0.84-0.87</span>
                      <span className={`material-symbols-outlined ${colors.text}`}>arrow_forward</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
        
        {/* Completion Message */}
        {completedCount === 9 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 text-center"
          >
            <div className="glass-card rounded-3xl p-8 max-w-2xl mx-auto bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-green-400">celebration</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Selamat!</h2>
              <p className="text-slate-300 mb-6">
                Anda telah menyelesaikan seluruh 9 dimensi assessment. 
                Lihat hasil holistik lengkap Anda sekarang.
              </p>
              <Link 
                href="/assessment/results"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#0A0F1A] font-bold rounded-xl hover:scale-105 transition-transform"
              >
                Lihat Hasil Lengkap
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Incomplete Assessment Modal */}
      <IncompleteAssessmentModal
        completedCount={completedCount}
        onContinue={() => {
          // Navigate to first incomplete dimension
          const nextDim = dimensions.find(d => !completedDimensions.includes(d.id));
          if (nextDim) {
            window.location.href = `/assessment/${nextDim.id}/info`;
          }
        }}
        onViewResults={() => {
          window.location.href = '/assessment/results';
        }}
      />
    </div>
  );
}