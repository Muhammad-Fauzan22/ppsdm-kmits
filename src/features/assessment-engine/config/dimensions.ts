/**
 * Dimension Configurations - 9 Dimensi PPSDM KMITS
 * Configuration-driven approach untuk menghindari duplikasi kode
 */

import { DimensionConfig, ResponseScale } from '../core/types';

// ============================================================================
// Response Scales
// ============================================================================

export const responseScales: Record<string, ResponseScale> = {
  likert5: {
    type: 'likert5',
    min: 1,
    max: 5,
    labels: {
      1: 'Sangat Tidak Setuju',
      2: 'Tidak Setuju',
      3: 'Netral',
      4: 'Setuju',
      5: 'Sangat Setuju'
    },
    options: [
      { value: 1, label: '1', description: 'Sangat Tidak Setuju' },
      { value: 2, label: '2', description: 'Tidak Setuju' },
      { value: 3, label: '3', description: 'Netral' },
      { value: 4, label: '4', description: 'Setuju' },
      { value: 5, label: '5', description: 'Sangat Setuju' }
    ]
  },
  likert7: {
    type: 'likert7',
    min: 1,
    max: 7,
    labels: {
      1: 'Sangat Tidak Setuju',
      2: 'Tidak Setuju',
      3: 'Agak Tidak Setuju',
      4: 'Netral',
      5: 'Agak Setuju',
      6: 'Setuju',
      7: 'Sangat Setuju'
    }
  },
  frequency: {
    type: 'frequency',
    min: 1,
    max: 5,
    labels: {
      1: 'Tidak Pernah',
      2: 'Jarang',
      3: 'Kadang-kadang',
      4: 'Sering',
      5: 'Selalu'
    }
  },
  yesno: {
    type: 'yesno',
    min: 0,
    max: 1,
    labels: {
      0: 'Tidak',
      1: 'Ya'
    },
    options: [
      { value: 0, label: 'Tidak', description: 'Tidak' },
      { value: 1, label: 'Ya', description: 'Ya' }
    ]
  }
};

// ============================================================================
// Dimension Configurations
// ============================================================================

export const dimensionConfigs: Record<string, DimensionConfig> = {
  cognitive: {
    id: 'cognitive',
    title: 'Kognitif & Intelektual',
    description: 'Kemampuan berpikir kritis, kreativitas, dan metakognisi dalam pemecahan masalah',
    icon: 'Brain',
    color: '#013880', // ITS Blue
    instruments: [
      {
        id: 'ctds',
        name: 'Critical Thinking Disposition Scale',
        description: 'Mengukur kecenderungan berpikir kritis',
        items: 8,
        responseScale: 'likert5',
        scoring: {
          algorithm: 'weightedSum',
          weights: [1.2, 1.0, 0.8, 1.1, 1.0, 1.3, 0.9, 1.0],
          reverseScored: [false, false, true, false, true, false, false, false],
          normalizeTo100: true
        },
        timeLimitMinutes: 15
      },
      {
        id: 'creativity',
        name: 'Creative Thinking Assessment',
        description: 'Mengukur kemampuan berpikir kreatif',
        items: 6,
        responseScale: 'likert5',
        scoring: {
          algorithm: 'simpleSum',
          normalizeTo100: true
        }
      }
    ],
    scoringAlgorithm: 'weightedSum',
    thresholds: {
      low: { min: 0, max: 40, label: 'Perlu Pengembangan', color: '#EF4444' },
      medium: { min: 41, max: 70, label: 'Cukup Baik', color: '#F59E0B' },
      high: { min: 71, max: 100, label: 'Sangat Baik', color: '#10B981' }
    },
    recommendations: {
      low: [
        'Ikut workshop critical thinking di PPSDM',
        'Baca buku "Thinking Fast and Slow" oleh Daniel Kahneman',
        'Latihan soal logika dan reasoning mingguan',
        'Ikut komunitas debat atau diskusi akademik'
      ],
      medium: [
        'Latihan soal logika dan reasoning mingguan',
        'Ikut diskusi kelompok rutin',
        'Tantang diri dengan puzzle dan brain teasers',
        'Praktikkan metode Socratic questioning'
      ],
      high: [
        'Jadi mentor untuk junior dalam berpikir kritis',
        'Ikut kompetisi debat atau olimpiade',
        'Ambil peran sebagai facilitator diskusi',
        'Kembangkan metodologi pembelajaran baru'
      ]
    },
    estimatedDurationMinutes: 25,
    order: 1
  },

  'self-management': {
    id: 'self-management',
    title: 'Manajemen Diri',
    description: 'Kemampuan mengatur waktu, emosi, dan produktivitas secara efektif',
    icon: 'Target',
    color: '#7B1FA2', // Purple
    instruments: [
      {
        id: 'time-management',
        name: 'Time Management Questionnaire',
        items: 10,
        responseScale: 'likert5',
        scoring: {
          algorithm: 'simpleSum',
          normalizeTo100: true
        }
      },
      {
        id: 'self-discipline',
        name: 'Self-Discipline Scale',
        items: 8,
        responseScale: 'frequency',
        scoring: {
          algorithm: 'average',
          normalizeTo100: true
        }
      }
    ],
    scoringAlgorithm: 'weightedSum',
    thresholds: {
      low: { min: 0, max: 40, label: 'Perlu Pengembangan', color: '#EF4444' },
      medium: { min: 41, max: 70, label: 'Cukup Baik', color: '#F59E0B' },
      high: { min: 71, max: 100, label: 'Sangat Baik', color: '#10B981' }
    },
    recommendations: {
      low: [
        'Gunakan teknik Pomodoro untuk manajemen waktu',
        'Buat jurnal harian untuk tracking kebiasaan',
        'Ikut workshop time management PPSDM',
        'Gunakan aplikasi productivity tracker'
      ],
      medium: [
        'Tetapkan rutinitas pagi yang konsisten',
        'Praktikkan teknik Eisenhower Matrix',
        'Review dan evaluasi mingguan',
        'Tetapkan goals SMART bulanan'
      ],
      high: [
        'Mentoring teman dalam manajemen waktu',
        'Kembangkan sistem personal productivity',
        'Share best practices di komunitas',
        'Ambil tanggung jawab leadership project'
      ]
    },
    estimatedDurationMinutes: 20,
    order: 2
  },

  'emotional-social': {
    id: 'emotional-social',
    title: 'Emosional & Sosial',
    description: 'Kecerdasan emosional, empati, dan kemampuan interpersonal',
    icon: 'Heart',
    color: '#FF4081', // Pink
    instruments: [
      {
        id: 'eq-assessment',
        name: 'Emotional Quotient Inventory',
        items: 12,
        responseScale: 'likert5',
        scoring: {
          algorithm: 'weightedSum',
          categories: ['self-awareness', 'self-regulation', 'motivation', 'empathy', 'social-skills'],
          normalizeTo100: true
        }
      }
    ],
    scoringAlgorithm: 'weightedSum',
    thresholds: {
      low: { min: 0, max: 40, label: 'Perlu Pengembangan', color: '#EF4444' },
      medium: { min: 41, max: 70, label: 'Cukup Baik', color: '#F59E0B' },
      high: { min: 71, max: 100, label: 'Sangat Baik', color: '#10B981' }
    },
    recommendations: {
      low: [
        'Praktikkan mindfulness dan self-reflection',
        'Ikut workshop komunikasi efektif',
        'Baca buku "Emotional Intelligence" oleh Daniel Goleman',
        'Latihan active listening dalam percakapan'
      ],
      medium: [
        'Journaling emosi harian',
        'Praktikkan teknik regulasi emosi',
        'Ikut kegiatan teamwork dan kolaborasi',
        'Minta feedback dari teman dekat'
      ],
      high: [
        'Jadi mediator dalam konflik teman',
        'Mentoring junior dalam soft skills',
        'Organisasi kegiatan team building',
        'Kembangkan program peer support'
      ]
    },
    estimatedDurationMinutes: 15,
    order: 3
  },

  spiritual: {
    id: 'spiritual',
    title: 'Spiritual & Nilai',
    description: 'Kedalaman spiritual, kebermaknaan hidup, dan integritas nilai',
    icon: 'Sparkles',
    color: '#FFD700', // Gold
    instruments: [
      {
        id: 'spiritual-wellbeing',
        name: 'Spiritual Wellbeing Scale',
        items: 10,
        responseScale: 'likert5',
        scoring: {
          algorithm: 'simpleSum',
          normalizeTo100: true
        }
      },
      {
        id: 'values-clarification',
        name: 'Values Clarification Assessment',
        items: 8,
        responseScale: 'likert5',
        scoring: {
          algorithm: 'average',
          normalizeTo100: true
        }
      }
    ],
    scoringAlgorithm: 'weightedSum',
    thresholds: {
      low: { min: 0, max: 40, label: 'Perlu Pengembangan', color: '#EF4444' },
      medium: { min: 41, max: 70, label: 'Cukup Baik', color: '#F59E0B' },
      high: { min: 71, max: 100, label: 'Sangat Baik', color: '#10B981' }
    },
    recommendations: {
      low: [
        'Refleksi diri melalui journaling spiritual',
        'Ikut kegiatan rohani kampus',
        'Diskusi dengan mentor spiritual',
        'Eksplorasi nilai-nilai fundamental'
      ],
      medium: [
        'Praktikkan meditasi atau doa rutin',
        'Ikut komunitas spiritual',
        'Volunteer untuk kegiatan sosial',
        'Pelajari filsafat dan etika'
      ],
      high: [
        'Jadi facilitator diskusi spiritual',
        'Mentoring junior dalam pengembangan karakter',
        'Organisasi retreat atau workshop',
        'Kembangkan inisiatif kebaikan kampus'
      ]
    },
    estimatedDurationMinutes: 20,
    order: 4
  },

  physical: {
    id: 'physical',
    title: 'Kesehatan Fisik',
    description: 'Kebugaran tubuh, pola hidup sehat, dan manajemen energi fisik',
    icon: 'Activity',
    color: '#4CAF50', // Green
    instruments: [
      {
        id: 'physical-fitness',
        name: 'Physical Fitness Self-Assessment',
        items: 8,
        responseScale: 'frequency',
        scoring: {
          algorithm: 'average',
          normalizeTo100: true
        }
      },
      {
        id: 'lifestyle-habits',
        name: 'Healthy Lifestyle Habits',
        items: 6,
        responseScale: 'yesno',
        scoring: {
          algorithm: 'simpleSum',
          normalizeTo100: true
        }
      }
    ],
    scoringAlgorithm: 'weightedSum',
    thresholds: {
      low: { min: 0, max: 40, label: 'Perlu Pengembangan', color: '#EF4444' },
      medium: { min: 41, max: 70, label: 'Cukup Baik', color: '#F59E0B' },
      high: { min: 71, max: 100, label: 'Sangat Baik', color: '#10B981' }
    },
    recommendations: {
      low: [
        'Buat jadwal olahraga minimal 3x seminggu',
        'Perbaiki pola tidur (7-8 jam)',
        'Kurangi konsumsi junk food',
        'Manfaatkan fasilitas gym kampus'
      ],
      medium: [
        'Tetapkan rutinitas olahraga konsisten',
        'Tracking progress fitness dengan aplikasi',
        'Ikut komunitas olahraga kampus',
        'Pelajari nutrisi dasar'
      ],
      high: [
        'Jadi motivator fitness untuk teman',
        'Ikut kompetisi olahraga kampus',
        'Organisasi event olahraga',
        'Mentoring program wellness'
      ]
    },
    estimatedDurationMinutes: 15,
    order: 5
  },

  'mental-health': {
    id: 'mental-health',
    title: 'Kesehatan Mental',
    description: 'Kesejahteraan psikologis, resilience, dan coping strategies',
    icon: 'BrainCircuit',
    color: '#00BCD4', // Cyan
    instruments: [
      {
        id: 'wellbeing-scale',
        name: 'Warwick-Edinburgh Mental Wellbeing Scale',
        items: 14,
        responseScale: 'likert5',
        scoring: {
          algorithm: 'simpleSum',
          normalizeTo100: true
        }
      },
      {
        id: 'resilience-scale',
        name: 'Brief Resilience Scale',
        items: 6,
        responseScale: 'likert5',
        scoring: {
          algorithm: 'average',
          normalizeTo100: true
        }
      }
    ],
    scoringAlgorithm: 'weightedSum',
    thresholds: {
      low: { min: 0, max: 40, label: 'Perlu Perhatian', color: '#EF4444' },
      medium: { min: 41, max: 70, label: 'Cukup Baik', color: '#F59E0B' },
      high: { min: 71, max: 100, label: 'Sangat Baik', color: '#10B981' }
    },
    recommendations: {
      low: [
        'Hubungi konselor kampus untuk support',
        'Praktikkan teknik grounding dan breathing',
        'Batasi exposure ke stressor berlebihan',
        'Prioritaskan self-care dan istirahat'
      ],
      medium: [
        'Maintain rutinitas self-care',
        'Praktikkan mindfulness meditation',
        'Bangun support system yang kuat',
        'Ikut workshop stress management'
      ],
      high: [
        'Jadi peer counselor atau supporter',
        'Share coping strategies dengan teman',
        'Organisasi kegiatan wellness',
        'Mentoring program mental health'
      ]
    },
    estimatedDurationMinutes: 20,
    order: 6
  },

  character: {
    id: 'character',
    title: 'Karakter & Integritas',
    description: 'Kejujuran, tanggung jawab, dan etika dalam bertindak',
    icon: 'Shield',
    color: '#9C27B0', // Deep Purple
    instruments: [
      {
        id: 'character-strengths',
        name: 'VIA Character Strengths Survey',
        items: 24,
        responseScale: 'likert5',
        scoring: {
          algorithm: 'weightedSum',
          categories: ['wisdom', 'courage', 'humanity', 'justice', 'temperance', 'transcendence'],
          normalizeTo100: true
        }
      }
    ],
    scoringAlgorithm: 'weightedSum',
    thresholds: {
      low: { min: 0, max: 40, label: 'Perlu Pengembangan', color: '#EF4444' },
      medium: { min: 41, max: 70, label: 'Cukup Baik', color: '#F59E0B' },
      high: { min: 71, max: 100, label: 'Sangat Baik', color: '#10B981' }
    },
    recommendations: {
      low: [
        'Refleksi nilai-nilai personal',
        'Pelajari etika dan moral dasar',
        'Cari role model dengan integritas tinggi',
        'Praktikkan kejujuran dalam hal kecil'
      ],
      medium: [
        'Tetapkan personal code of ethics',
        'Ambil tanggung jawab dalam organisasi',
        'Praktikkan accountability',
        'Minta feedback tentang integritas'
      ],
      high: [
        'Jadi role model integritas',
        'Mentoring junior dalam etika',
        'Organisasi program anti-korupsi',
        'Kembangkan inisiatif keadilan sosial'
      ]
    },
    estimatedDurationMinutes: 25,
    order: 7
  },

  financial: {
    id: 'financial',
    title: 'Literasi Keuangan',
    description: 'Manajemen keuangan pribadi, literasi investasi, dan financial planning',
    icon: 'Wallet',
    color: '#FF9800', // Orange
    instruments: [
      {
        id: 'financial-literacy',
        name: 'Financial Literacy Assessment',
        items: 10,
        responseScale: 'likert5',
        scoring: {
          algorithm: 'simpleSum',
          normalizeTo100: true
        }
      },
      {
        id: 'money-habits',
        name: 'Money Management Habits',
        items: 8,
        responseScale: 'frequency',
        scoring: {
          algorithm: 'average',
          normalizeTo100: true
        }
      }
    ],
    scoringAlgorithm: 'weightedSum',
    thresholds: {
      low: { min: 0, max: 40, label: 'Perlu Pengembangan', color: '#EF4444' },
      medium: { min: 41, max: 70, label: 'Cukup Baik', color: '#F59E0B' },
      high: { min: 71, max: 100, label: 'Sangat Baik', color: '#10B981' }
    },
    recommendations: {
      low: [
        'Buat budget bulanan sederhana',
        'Ikut workshop financial literacy PPSDM',
        'Baca buku "Rich Dad Poor Dad"',
        'Tracking pengeluaran harian'
      ],
      medium: [
        'Mulai emergency fund (3-6 bulan)',
        'Pelajari instrumen investasi dasar',
        'Praktikkan 50/30/20 rule',
        'Diskusi dengan mentor keuangan'
      ],
      high: [
        'Mulai investasi jangka panjang',
        'Mentoring teman dalam manajemen keuangan',
        'Organisasi workshop financial literacy',
        'Kembangkan side income'
      ]
    },
    estimatedDurationMinutes: 15,
    order: 8
  },

  environmental: {
    id: 'environmental',
    title: 'Kesadaran Lingkungan',
    description: 'Eco-literacy, sustainable habits, dan tanggung jawab lingkungan',
    icon: 'Leaf',
    color: '#8BC34A', // Light Green
    instruments: [
      {
        id: 'eco-literacy',
        name: 'Environmental Literacy Assessment',
        items: 8,
        responseScale: 'likert5',
        scoring: {
          algorithm: 'simpleSum',
          normalizeTo100: true
        }
      },
      {
        id: 'green-habits',
        name: 'Sustainable Living Habits',
        items: 6,
        responseScale: 'frequency',
        scoring: {
          algorithm: 'average',
          normalizeTo100: true
        }
      }
    ],
    scoringAlgorithm: 'weightedSum',
    thresholds: {
      low: { min: 0, max: 40, label: 'Perlu Pengembangan', color: '#EF4444' },
      medium: { min: 41, max: 70, label: 'Cukup Baik', color: '#F59E0B' },
      high: { min: 71, max: 100, label: 'Sangat Baik', color: '#10B981' }
    },
    recommendations: {
      low: [
        'Pelajari isu lingkungan lokal',
        'Mulai praktik 3R (Reduce, Reuse, Recycle)',
        'Ikut kegiatan green campus',
        'Kurangi penggunaan plastik sekali pakai'
      ],
      medium: [
        'Implementasi sustainable lifestyle',
        'Ikut komunitas lingkungan',
        'Advokasi isu lingkungan di kampus',
        'Tracking carbon footprint'
      ],
      high: [
        'Organisasi kegiatan environmental',
        'Mentoring program eco-literacy',
        'Inisiatif proyek sustainability',
        'Jadi environmental ambassador'
      ]
    },
    estimatedDurationMinutes: 15,
    order: 9
  }
};

// ============================================================================
// Helper Functions
// ============================================================================

export function getDimensionConfig(id: string): DimensionConfig | undefined {
  return dimensionConfigs[id];
}

export function getAllDimensions(): DimensionConfig[] {
  return Object.values(dimensionConfigs).sort((a, b) => a.order - b.order);
}

export function getDimensionByOrder(order: number): DimensionConfig | undefined {
  return Object.values(dimensionConfigs).find(d => d.order === order);
}

export function getTotalEstimatedDuration(): number {
  return Object.values(dimensionConfigs).reduce((total, dim) => total + dim.estimatedDurationMinutes, 0);
}

export function getResponseScale(type: string): ResponseScale | undefined {
  return responseScales[type];
}

// ============================================================================
// Legacy Export Names (for backward compatibility)
// ============================================================================

/** @deprecated Use dimensionConfigs instead */
export const dimensions = dimensionConfigs;

/** @deprecated Use getDimensionConfig('cognitive') instead */
export const cognitiveConfig = dimensionConfigs.cognitive;

/** @deprecated Use getDimensionConfig('self-management') instead */
export const selfManagementConfig = dimensionConfigs['self-management'];

/** @deprecated Use getDimensionConfig('emotional-social') instead */
export const emotionalConfig = dimensionConfigs['emotional-social'];

/** @deprecated Use getDimensionConfig('spiritual') instead */
export const spiritualConfig = dimensionConfigs.spiritual;

/** @deprecated Use getDimensionConfig('physical') instead */
export const physicalConfig = dimensionConfigs.physical;

/** @deprecated Use getDimensionConfig('mental-health') instead */
export const mentalConfig = dimensionConfigs['mental-health'];

/** @deprecated Use getDimensionConfig('character') instead */
export const characterConfig = dimensionConfigs.character;

/** @deprecated Use getDimensionConfig('financial') instead */
export const financialConfig = dimensionConfigs.financial;

/** @deprecated Use getDimensionConfig('environmental') instead */
export const environmentalConfig = dimensionConfigs.environmental;

/** @deprecated Use getDimensionConfig('emotional-social') instead */
export const socialConfig = dimensionConfigs['emotional-social'];
