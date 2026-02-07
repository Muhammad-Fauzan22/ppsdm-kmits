"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Heart, 
  Users, 
  ChevronDown, 
  ChevronUp,
  Target,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

// 9 Dimensions grouped into 3 categories for better cognitive load
const dimensionGroups = [
  {
    id: 'intellectual',
    title: 'Kecerdasan & Kognitif',
    icon: Brain,
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50',
    description: 'Mengembangkan kemampuan berpikir, belajar, dan mengelola diri',
    dimensions: [
      { 
        id: 'cognitive', 
        name: 'Kecerdasan Kognitif', 
        description: 'Kemampuan berpikir kritis dan pemecahan masalah',
        questions: 12,
        time: '10 menit'
      },
      { 
        id: 'self-management', 
        name: 'Manajemen Diri', 
        description: 'Pengaturan waktu, emosi, dan produktivitas',
        questions: 15,
        time: '12 menit'
      },
      { 
        id: 'mental-health', 
        name: 'Kesehatan Mental', 
        description: 'Kesejahteraan psikologis dan ketahanan stres',
        questions: 10,
        time: '8 menit'
      }
    ]
  },
  {
    id: 'social',
    title: 'Keterampilan Sosial',
    icon: Users,
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-50',
    description: 'Membangun hubungan, karakter, dan kepedulian sosial',
    dimensions: [
      { 
        id: 'emotional-social', 
        name: 'Kecerdasan Emosional & Sosial', 
        description: 'Memahami diri sendiri dan berinteraksi dengan orang lain',
        questions: 14,
        time: '12 menit'
      },
      { 
        id: 'character', 
        name: 'Karakter', 
        description: 'Integritas, tanggung jawab, dan etika',
        questions: 12,
        time: '10 menit'
      },
      { 
        id: 'environmental', 
        name: 'Kepedulian Lingkungan', 
        description: 'Kesadaran dan tindakan untuk keberlanjutan',
        questions: 8,
        time: '6 menit'
      }
    ]
  },
  {
    id: 'physical',
    title: 'Kesejahteraan Fisik & Spiritual',
    icon: Heart,
    color: 'from-rose-500 to-pink-600',
    bgColor: 'bg-rose-50',
    description: 'Menjaga kesehatan tubuh, keuangan, dan spiritual',
    dimensions: [
      { 
        id: 'physical', 
        name: 'Kesehatan Fisik', 
        description: 'Kebugaran, nutrisi, dan gaya hidup aktif',
        questions: 10,
        time: '8 menit'
      },
      { 
        id: 'financial', 
        name: 'Kecerdasan Finansial', 
        description: 'Manajemen uang dan literasi keuangan',
        questions: 12,
        time: '10 menit'
      },
      { 
        id: 'spiritual', 
        name: 'Spiritual', 
        description: 'Nilai, makna hidup, dan koneksi dengan yang lebih tinggi',
        questions: 10,
        time: '8 menit'
      }
    ]
  }
];

/**
 * DimensionGroups Component
 * 
 * Mengorganisir 9 dimensi menjadi 3 kelompok untuk mengurangi
 * cognitive overload. Menggunakan progressive disclosure pattern.
 */
export function DimensionGroups() {
  const [expandedGroup, setExpandedGroup] = useState<string | null>('intellectual');

  const toggleGroup = (groupId: string) => {
    setExpandedGroup(expandedGroup === groupId ? null : groupId);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
          9 Dimensi Pengembangan Holistik
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Dikelompokkan dalam 3 area utama untuk memudahkan pemahaman dan pengukuran
        </p>
      </div>

      {/* Groups */}
      <div className="space-y-4">
        {dimensionGroups.map((group) => {
          const Icon = group.icon;
          const isExpanded = expandedGroup === group.id;

          return (
            <div 
              key={group.id}
              className={`
                rounded-2xl border-2 overflow-hidden transition-all duration-300
                ${isExpanded ? 'border-slate-300 shadow-lg' : 'border-slate-200 hover:border-slate-300'}
              `}
            >
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(group.id)}
                className={`
                  w-full p-5 md:p-6 flex items-center justify-between
                  ${group.bgColor} hover:opacity-90 transition-opacity
                `}
                aria-expanded={isExpanded}
                aria-controls={`group-content-${group.id}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`
                    w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${group.color}
                    flex items-center justify-center text-white shadow-lg
                  `}>
                    <Icon className="w-6 h-6 md:w-7 md:h-7" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg md:text-xl font-bold text-slate-800">
                      {group.title}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1 hidden md:block">
                      {group.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-500 hidden sm:block">
                    {group.dimensions.length} dimensi
                  </span>
                  <div className={`
                    w-10 h-10 rounded-full bg-white flex items-center justify-center
                    shadow-sm transition-transform duration-300
                    ${isExpanded ? 'rotate-180' : ''}
                  `}>
                    <ChevronDown className="w-5 h-5 text-slate-600" />
                  </div>
                </div>
              </button>

              {/* Expanded Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    id={`group-content-${group.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 md:p-6 bg-white">
                      <p className="text-slate-600 mb-5 md:hidden">
                        {group.description}
                      </p>
                      
                      <div className="grid gap-3">
                        {group.dimensions.map((dimension, index) => (
                          <motion.div
                            key={dimension.id}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Link
                              href={`/assessment/${dimension.id}`}
                              className={`
                                block p-4 rounded-xl border-2 border-slate-100
                                hover:border-blue-300 hover:bg-blue-50/50
                                transition-all duration-200 group
                              `}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">
                                    {dimension.name}
                                  </h4>
                                  <p className="text-sm text-slate-600 mt-1">
                                    {dimension.description}
                                  </p>
                                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                                    <span className="flex items-center gap-1">
                                      <Target className="w-3.5 h-3.5" />
                                      {dimension.questions} pertanyaan
                                    </span>
                                    <span>•</span>
                                    <span>~{dimension.time}</span>
                                  </div>
                                </div>
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                                </div>
                              </div>
                            </Link>
                          </motion.div>
                        ))}
                      </div>

                      {/* Group Action */}
                      <div className="mt-5 pt-5 border-t border-slate-100">
                        <Link
                          href={`/assessment?group=${group.id}`}
                          className={`
                            inline-flex items-center gap-2 px-5 py-2.5 rounded-lg
                            bg-gradient-to-r ${group.color} text-white
                            font-medium text-sm hover:shadow-lg hover:shadow-${group.color.split('-')[1]}-200
                            transition-all duration-200
                          `}
                        >
                          Mulai Asesmen {group.title}
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 p-5 bg-slate-50 rounded-xl border border-slate-200">
        <div className="flex flex-wrap items-center justify-center gap-6 text-center">
          <div>
            <p className="text-2xl font-bold text-slate-800">9</p>
            <p className="text-sm text-slate-600">Dimensi</p>
          </div>
          <div className="w-px h-10 bg-slate-300 hidden sm:block" />
          <div>
            <p className="text-2xl font-bold text-slate-800">103</p>
            <p className="text-sm text-slate-600">Pertanyaan</p>
          </div>
          <div className="w-px h-10 bg-slate-300 hidden sm:block" />
          <div>
            <p className="text-2xl font-bold text-slate-800">~84</p>
            <p className="text-sm text-slate-600">Menit Total</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DimensionGroups;
