import React from 'react';
import { TrendingUp, TrendingDown, Minus, Users, Award, Target, Shield, Zap } from 'lucide-react';

interface StatItem {
  label: string;
  value: string | number;
  description: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
}

interface SimplifiedStatsProps {
  stats: StatItem[];
  layout?: 'grid' | 'horizontal' | 'vertical';
  className?: string;
}

/**
 * SimplifiedStats Component
 * 
 * Menggantikan statistik kompleks (α=0.87, β=0.58) dengan bahasa sederhana
 * yang mudah dipahami pengguna umum.
 */
export function SimplifiedStats({ stats, layout = 'grid', className = '' }: SimplifiedStatsProps) {
  const getTrendIcon = (trend?: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTrendColor = (trend?: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return 'text-green-600 bg-green-50';
      case 'down':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const layoutClasses = {
    grid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4',
    horizontal: 'flex flex-wrap gap-4',
    vertical: 'flex flex-col gap-4',
  };

  return (
    <div className={`${layoutClasses[layout]} ${className}`}>
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              {stat.icon && (
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  {stat.icon}
                </div>
              )}
              <span className="text-sm font-medium text-gray-600">{stat.label}</span>
            </div>
            {stat.trend && (
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTrendColor(stat.trend)}`}>
                {getTrendIcon(stat.trend)}
              </div>
            )}
          </div>
          
          <div className="mb-2">
            <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
          </div>
          
          <p className="text-sm text-gray-500 leading-relaxed">{stat.description}</p>
        </div>
      ))}
    </div>
  );
}

/**
 * Predefined stat configurations for common use cases
 */
export const StatPresets = {
  // Untuk halaman assessment
  assessmentReliability: {
    label: 'Tingkat Keandalan',
    value: 'Sangat Tinggi',
    description: 'Hasil asesmen ini konsisten dan dapat diandalkan untuk pengambilan keputusan pengembangan diri.',
    icon: <Shield className="w-5 h-5" />,
    trend: 'up' as const,
  },
  
  // Untuk jumlah peserta
  participantCount: (count: number) => ({
    label: 'Total Peserta',
    value: count.toLocaleString('id-ID'),
    description: 'Mahasiswa ITS yang telah mengikuti program pengembangan holistik.',
    icon: <Users className="w-5 h-5" />,
    trend: 'up' as const,
  }),
  
  // Untuk skor keseluruhan
  overallScore: (score: number) => {
    let level = 'Perlu Perbaikan';
    let trend: 'up' | 'down' | 'neutral' = 'neutral';
    
    if (score >= 80) {
      level = 'Sangat Baik';
      trend = 'up';
    } else if (score >= 60) {
      level = 'Baik';
      trend = 'up';
    } else if (score >= 40) {
      level = 'Cukup';
      trend = 'neutral';
    } else {
      level = 'Perlu Perbaikan';
      trend = 'down';
    }
    
    return {
      label: 'Tingkat Pengembangan',
      value: level,
      description: `Skor keseluruhan Anda adalah ${score}/100. ${level === 'Sangat Baik' ? 'Pertahankan prestasi ini!' : 'Terus berlatih untuk meningkatkan.'}`,
      icon: <Award className="w-5 h-5" />,
      trend,
    };
  },
  
  // Untuk target pencapaian
  achievementTarget: (current: number, target: number) => ({
    label: 'Progres Target',
    value: `${Math.round((current / target) * 100)}%`,
    description: `Anda telah mencapai ${current} dari ${target} target pengembangan.`,
    icon: <Target className="w-5 h-5" />,
    trend: current >= target ? 'up' : 'neutral',
  }),
  
  // Untuk efisiensi
  efficiency: (value: number) => ({
    label: 'Efektivitas Program',
    value: `${value}%`,
    description: 'Tingkat keberhasilan program dalam membantu pengembangan mahasiswa.',
    icon: <Zap className="w-5 h-5" />,
    trend: value >= 70 ? 'up' : value >= 50 ? 'neutral' : 'down',
  }),
};

/**
 * Helper function to convert complex statistical values to simple language
 */
export function simplifyStat(
  type: 'alpha' | 'beta' | 'correlation' | 'percentile' | 'sd',
  value: number
): { label: string; value: string; description: string } {
  switch (type) {
    case 'alpha':
      // Cronbach's Alpha - reliability
      if (value >= 0.9) {
        return {
          label: 'Konsistensi Internal',
          value: 'Sangat Tinggi',
          description: 'Pertanyaan dalam asesmen ini sangat konsisten dan menghasilkan hasil yang dapat diandalkan.',
        };
      } else if (value >= 0.8) {
        return {
          label: 'Konsistensi Internal',
          value: 'Tinggi',
          description: 'Pertanyaan dalam asesmen ini konsisten dan dapat diandalkan.',
        };
      } else if (value >= 0.7) {
        return {
          label: 'Konsistensi Internal',
          value: 'Cukup Baik',
          description: 'Pertanyaan dalam asesmen ini memiliki konsistensi yang cukup baik.',
        };
      } else {
        return {
          label: 'Konsistensi Internal',
          value: 'Perlu Perbaikan',
          description: 'Pertanyaan dalam asesmen ini perlu ditinjau ulang untuk meningkatkan konsistensi.',
        };
      }
      
    case 'beta':
      // Beta coefficient
      if (value >= 0.5) {
        return {
          label: 'Kekuatan Prediksi',
          value: 'Kuat',
          description: 'Asesmen ini sangat efektif dalam memprediksi hasil pengembangan.',
        };
      } else if (value >= 0.3) {
        return {
          label: 'Kekuatan Prediksi',
          value: 'Sedang',
          description: 'Asesmen ini cukup efektif dalam memprediksi hasil pengembangan.',
        };
      } else {
        return {
          label: 'Kekuatan Prediksi',
          value: 'Lemah',
          description: 'Asesmen ini memiliki keterbatasan dalam memprediksi hasil pengembangan.',
        };
      }
      
    case 'correlation':
      // Correlation coefficient
      const absValue = Math.abs(value);
      if (absValue >= 0.7) {
        return {
          label: 'Hubungan Antar Dimensi',
          value: value > 0 ? 'Sangat Positif' : 'Sangat Negatif',
          description: 'Dimensi-dimensi pengembangan saling terkait erat dan saling memengaruhi.',
        };
      } else if (absValue >= 0.4) {
        return {
          label: 'Hubungan Antar Dimensi',
          value: value > 0 ? 'Positif' : 'Negatif',
          description: 'Dimensi-dimensi pengembangan memiliki keterkaitan yang moderat.',
        };
      } else {
        return {
          label: 'Hubungan Antar Dimensi',
          value: 'Lemah',
          description: 'Dimensi-dimensi pengembangan relatif independen satu sama lain.',
        };
      }
      
    case 'percentile':
      // Percentile rank
      if (value >= 90) {
        return {
          label: 'Peringkat Relatif',
          value: '10% Teratas',
          description: 'Anda berada di 10% teratas dibandingkan mahasiswa lain.',
        };
      } else if (value >= 75) {
        return {
          label: 'Peringkat Relatif',
          value: '25% Teratas',
          description: 'Anda berada di 25% teratas dibandingkan mahasiswa lain.',
        };
      } else if (value >= 50) {
        return {
          label: 'Peringkat Relatif',
          value: 'Di Atas Rata-rata',
          description: 'Anda berada di atas rata-rata dibandingkan mahasiswa lain.',
        };
      } else if (value >= 25) {
        return {
          label: 'Peringkat Relatif',
          value: 'Rata-rata',
          description: 'Anda berada di kisaran rata-rata dibandingkan mahasiswa lain.',
        };
      } else {
        return {
          label: 'Peringkat Relatif',
          value: 'Perlu Peningkatan',
          description: 'Anda memiliki potensi besar untuk berkembang lebih lanjut.',
        };
      }
      
    case 'sd':
      // Standard deviation
      if (value <= 10) {
        return {
          label: 'Variasi Skor',
          value: 'Sangat Konsisten',
          description: 'Hasil asesmen menunjukkan konsistensi yang sangat tinggi.',
        };
      } else if (value <= 20) {
        return {
          label: 'Variasi Skor',
          value: 'Konsisten',
          description: 'Hasil asesmen menunjukkan konsistensi yang baik.',
        };
      } else {
        return {
          label: 'Variasi Skor',
          value: 'Bervariasi',
          description: 'Hasil asesmen menunjukkan variasi yang signifikan antar dimensi.',
        };
      }
      
    default:
      return {
        label: 'Statistik',
        value: value.toString(),
        description: 'Nilai statistik pengukuran.',
      };
  }
}

export default SimplifiedStats;
