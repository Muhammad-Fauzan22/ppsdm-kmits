/**
 * SimplifiedStats Component
 * 
 * Mengubah statistik kompleks (α=0.87, β=0.58) menjadi bahasa sederhana
 * yang mudah dipahami pengguna umum.
 */

import React from 'react';
import { CheckCircle, AlertCircle, Info, TrendingUp, Users, Award } from 'lucide-react';

interface StatProps {
  value: string | number;
  label: string;
  description?: string;
  type?: 'success' | 'warning' | 'info' | 'neutral';
  icon?: React.ReactNode;
}

export function SimplifiedStat({ 
  value, 
  label, 
  description, 
  type = 'neutral',
  icon 
}: StatProps) {
  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    neutral: 'bg-gray-50 border-gray-200 text-gray-800'
  };

  const iconColors = {
    success: 'text-green-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
    neutral: 'text-gray-600'
  };

  return (
    <div className={`p-4 rounded-lg border ${colors[type]} transition-all hover:shadow-md`}>
      <div className="flex items-start gap-3">
        {icon && (
          <div className={`shrink-0 ${iconColors[type]}`}>
            {icon}
          </div>
        )}
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-sm font-medium">{label}</div>
          {description && (
            <div className="text-xs mt-1 opacity-80">{description}</div>
          )}
        </div>
      </div>
    </div>
  );
}

interface ReliabilityBadgeProps {
  alpha?: number;
  beta?: number;
  sampleSize?: number;
  simplified?: boolean;
}

export function ReliabilityBadge({ 
  alpha, 
  beta, 
  sampleSize,
  simplified = true 
}: ReliabilityBadgeProps) {
  if (!simplified) {
    // Tampilkan data mentah untuk admin/researcher
    return (
      <div className="text-xs font-mono bg-gray-100 p-2 rounded">
        {alpha !== undefined && <span>α={alpha.toFixed(2)} </span>}
        {beta !== undefined && <span>β={beta.toFixed(2)} </span>}
        {sampleSize !== undefined && <span>n={sampleSize}</span>}
      </div>
    );
  }

  // Simplified version untuk user umum
  let reliability: { level: string; color: string; icon: React.ReactNode; description: string };
  
  if (alpha === undefined) {
    reliability = {
      level: 'Data Terbatas',
      color: 'bg-gray-100 text-gray-700 border-gray-300',
      icon: <Info className="w-4 h-4" />,
      description: 'Masih dalam pengumpulan data'
    };
  } else if (alpha >= 0.9) {
    reliability = {
      level: 'Sangat Terpercaya',
      color: 'bg-green-100 text-green-700 border-green-300',
      icon: <CheckCircle className="w-4 h-4" />,
      description: 'Hasil assessment sangat konsisten'
    };
  } else if (alpha >= 0.8) {
    reliability = {
      level: 'Terpercaya',
      color: 'bg-blue-100 text-blue-700 border-blue-300',
      icon: <CheckCircle className="w-4 h-4" />,
      description: 'Hasil assessment konsisten'
    };
  } else if (alpha >= 0.7) {
    reliability = {
      level: 'Cukup Terpercaya',
      color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      icon: <AlertCircle className="w-4 h-4" />,
      description: 'Hasil cukup konsisten, perlu validasi tambahan'
    };
  } else {
    reliability = {
      level: 'Perlu Perhatian',
      color: 'bg-orange-100 text-orange-700 border-orange-300',
      icon: <AlertCircle className="w-4 h-4" />,
      description: 'Sedang dalam pengembangan dan perbaikan'
    };
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm ${reliability.color}`}>
      {reliability.icon}
      <span className="font-medium">{reliability.level}</span>
    </div>
  );
}

// Helper function untuk mengkonversi statistik kompleks ke bahasa sederhana
export function simplifyStat(
  type: 'correlation' | 'reliability' | 'validity' | 'percentile' | 'score',
  value: number,
  context?: string
): { label: string; description: string; recommendation?: string } {
  switch (type) {
    case 'correlation':
      if (value >= 0.7) return {
        label: 'Hubungan Kuat',
        description: 'Dua variabel ini sangat berkaitan',
        recommendation: 'Fokus pada pengembangan bersama'
      };
      if (value >= 0.4) return {
        label: 'Hubungan Sedang',
        description: 'Ada keterkaitan yang cukup signifikan',
        recommendation: 'Pertimbangkan pengembangan terintegrasi'
      };
      return {
        label: 'Hubungan Lemah',
        description: 'Keterkaitan tidak terlalu signifikan',
        recommendation: 'Kembangkan secara terpisah'
      };

    case 'reliability':
      if (value >= 0.9) return {
        label: 'Sangat Konsisten',
        description: 'Hasil pengukuran sangat stabil'
      };
      if (value >= 0.8) return {
        label: 'Konsisten',
        description: 'Hasil pengukuran stabil'
      };
      if (value >= 0.7) return {
        label: 'Cukup Konsisten',
        description: 'Hasil cukup stabil, perlu perhatian'
      };
      return {
        label: 'Sedang Dikembangkan',
        description: 'Instrumen sedang dalam perbaikan'
      };

    case 'validity':
      if (value >= 0.8) return {
        label: 'Valid',
        description: 'Mengukur apa yang seharusnya diukur'
      };
      return {
        label: 'Sedang Divalidasi',
        description: 'Proses validasi masih berlangsung'
      };

    case 'percentile':
      if (value >= 90) return {
        label: 'Unggul',
        description: 'Lebih baik dari 90% peserta',
        recommendation: 'Pertahankan dan jadikan mentor'
      };
      if (value >= 75) return {
        label: 'Baik',
        description: 'Lebih baik dari 75% peserta',
        recommendation: 'Tingkatkan ke level unggul'
      };
      if (value >= 50) return {
        label: 'Cukup',
        description: 'Di atas rata-rata',
        recommendation: 'Fokus pada area pengembangan'
      };
      if (value >= 25) return {
        label: 'Perlu Perhatian',
        description: 'Di bawah rata-rata',
        recommendation: 'Buat rencana pengembangan intensif'
      };
      return {
        label: 'Perlu Bantuan',
        description: 'Perlu dukungan pengembangan',
        recommendation: 'Cari bantuan mentor segera'
      };

    case 'score':
      if (value >= 80) return {
        label: 'Tinggi',
        description: 'Kemampuan sudah baik'
      };
      if (value >= 60) return {
        label: 'Sedang',
        description: 'Ada ruang untuk meningkat'
      };
      return {
        label: 'Perlu Pengembangan',
        description: 'Fokus pada area ini'
      };

    default:
      return {
        label: 'Data Tersedia',
        description: 'Informasi lengkap tersedia'
      };
  }
}

// Component untuk menampilkan statistik populasi dengan bahasa sederhana
export function PopulationStats({ 
  totalUsers, 
  activeUsers, 
  completionRate 
}: { 
  totalUsers: number; 
  activeUsers: number; 
  completionRate: number;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <SimplifiedStat
        value={totalUsers.toLocaleString('id-ID')}
        label="Total Mahasiswa"
        description="Yang telah bergabung platform"
        type="info"
        icon={<Users className="w-5 h-5" />}
      />
      <SimplifiedStat
        value={activeUsers.toLocaleString('id-ID')}
        label="Sedang Aktif"
        description="Aktif dalam 30 hari terakhir"
        type="success"
        icon={<TrendingUp className="w-5 h-5" />}
      />
      <SimplifiedStat
        value={`${Math.round(completionRate)}%`}
        label="Tingkat Penyelesaian"
        description="Assessment yang diselesaikan"
        type={completionRate >= 70 ? 'success' : completionRate >= 50 ? 'warning' : 'neutral'}
        icon={<Award className="w-5 h-5" />}
      />
    </div>
  );
}
