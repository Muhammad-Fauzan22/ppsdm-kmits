# 🚀 PPSDM KMM - Rencana Implementasi Sistem Assessment 9 Dimensi

## 📋 Ringkasan Eksekutif

Dokumen ini berisi rencana implementasi komprehensif untuk sistem **Holistic Assessment 9 Dimensi** yang akan diakses oleh publik (mahasiswa ITS). Sistem ini mencakup:

1. **Landing Page** dengan video boomerang di Hero Section
2. **Pre-Test Information Pages** untuk setiap dimensi (9 halaman)
3. **Assessment Questions** dengan 8 pertanyaan per dimensi (72 total)
4. **Progress Tracking** dengan popup pengingat
5. **10 Visualisasi Diagram** untuk hasil assessment
6. **IRT-based Scoring Algorithm** dengan interpretasi level
7. **Privacy & Compliance** (PDP Indonesia)

---

## 🎯 FASE 1: Infrastruktur Dasar

### 1.1 Setup Database Schema dengan Supabase

**Lokasi File**: `supabase/migrations/001_ppsdm_dimensions.sql` (sudah ada)

**Tabel yang perlu dibuat/diperbarui**:

```sql
-- Tabel untuk responses individual per pertanyaan
CREATE TABLE IF NOT EXISTS assessment_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    dimension VARCHAR(20) NOT NULL,
    question_id VARCHAR(50) NOT NULL,
    response_value INTEGER CHECK (response_value BETWEEN 1 AND 5),
    time_spent_seconds INTEGER DEFAULT 0,
    answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, dimension, question_id)
);

-- Tabel untuk progress assessment user
CREATE TABLE IF NOT EXISTS assessment_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    dimension VARCHAR(20) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('not_started', 'in_progress', 'completed')) DEFAULT 'not_started',
    current_question INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    time_spent_seconds INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, dimension)
);

-- Tabel untuk hasil komprehensif
CREATE TABLE IF NOT EXISTS assessment_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    dimension VARCHAR(20) NOT NULL,
    raw_score DECIMAL(5,2) NOT NULL,
    adjusted_score DECIMAL(5,2) NOT NULL,
    percentile INTEGER NOT NULL,
    level VARCHAR(20) NOT NULL,
    confidence_interval_low DECIMAL(5,2),
    confidence_interval_high DECIMAL(5,2),
    interpretation TEXT NOT NULL,
    strengths TEXT[] DEFAULT '{}',
    growth_areas TEXT[] DEFAULT '{}',
    recommendations TEXT[] DEFAULT '{}',
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, dimension)
);

-- Tabel untuk hasil holistik keseluruhan
CREATE TABLE IF NOT EXISTS holistic_assessment_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    overall_score DECIMAL(5,2) NOT NULL,
    balance_index DECIMAL(5,2) NOT NULL,
    profile_type VARCHAR(50) NOT NULL,
    profile_description TEXT NOT NULL,
    dominant_dimensions TEXT[] DEFAULT '{}',
    development_priorities TEXT[] DEFAULT '{}',
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);
```

### 1.2 API Endpoints untuk Scoring Algorithm

**Lokasi**: `src/app/api/assessment/`

```
POST   /api/assessment/start              - Mulai assessment baru
GET    /api/assessment/progress           - Get progress user
POST   /api/assessment/response           - Simpan jawaban
POST   /api/assessment/complete           - Selesaikan dimensi
POST   /api/assessment/calculate          - Hitung skor (IRT-based)
GET    /api/assessment/results            - Get hasil assessment
GET    /api/assessment/holistic           - Get hasil holistik
```

**IRT-Based Scoring Algorithm** (`src/lib/assessment/irtScorer.ts`):

```typescript
// Item Response Theory (IRT) - 2PL Model
interface ItemParameters {
  difficulty: number;      // b parameter
  discrimination: number;  // a parameter
  guessing: number;        // c parameter (for 3PL)
}

interface IRTScoreResult {
  theta: number;                    // Latent trait estimate
  se: number;                       // Standard error
  information: number;              // Test information
  rawScore: number;
  adjustedScore: number;
  percentile: number;
}

export function calculateIRTScore(
  responses: Record<string, number>,
  itemParameters: Record<string, ItemParameters>,
  dimension: string
): IRTScoreResult {
  // EAP-Post sample algorithm untuk estimasi theta
  const theta = estimateTheta(responses, itemParameters);
  const se = calculateStandardError(theta, itemParameters);
  const information = calculateTestInformation(responses, itemParameters);
  
  // Convert theta ke 0-100 scale
  const normalizedScore = normalizeTheta(theta, dimension);
  const adjustedScore = applyReliabilityAdjustment(normalizedScore, dimension);
  
  return {
    theta,
    se,
    information,
    rawScore: normalizedScore,
    adjustedScore,
    percentile: calculatePercentile(normalizedScore, dimension),
  };
}

function estimateTheta(
  responses: Record<string, number>,
  itemParams: Record<string, ItemParameters>
): number {
  // Expected A Posteriori (EAP) dengan prior N(0,1)
  const priorMean = 0;
  const priorVariance = 1;
  
  // Numerical integration using Gauss-Hermite quadrature
  const quadraturePoints = [-3, -2, -1, 0, 1, 2, 3];
  const quadratureWeights = [0.004, 0.054, 0.240, 0.398, 0.240, 0.054, 0.004];
  
  let numerator = 0;
  let denominator = 0;
  
  for (let i = 0; i < quadraturePoints.length; i++) {
    const theta = quadraturePoints[i];
    let likelihood = 1;
    
    for (const [itemId, response] of Object.entries(responses)) {
      const params = itemParams[itemId];
      if (params) {
        const prob = calculateItemProbability(theta, params, response);
        likelihood *= prob;
      }
    }
    
    const posterior = likelihood * Math.exp(-0.5 * Math.pow(theta - priorMean, 2) / priorVariance);
    numerator += theta * posterior * quadratureWeights[i];
    denominator += posterior * quadratureWeights[i];
  }
  
  return denominator > 0 ? numerator / denominator : 0;
}

function calculateItemProbability(
  theta: number,
  params: ItemParameters,
  response: number
): number {
  // 2PL Model: P(X=1) = 1 / (1 + exp(-a(b - theta)))
  const logit = params.discrimination * (theta - params.difficulty);
  
  if (response === 1) {
    // Correct response
    return 1 / (1 + Math.exp(-logit));
  } else {
    // Incorrect response
    return 1 - (1 / (1 + Math.exp(-logit)));
  }
}
```

---

## 🎨 FASE 2: Landing Page & Hero Section

### 2.1 Implementasi Video Boomerang

**Assets Tersedia**:
- Lokasi: `ppsdm-kmits/A_seamless_hypnotic_1080p_202601282032_000/`
- Frames: 80 gambar (000-079.jpg)

**Component**: `src/components/hero/BoomerangVideo.tsx`

```typescript
'use client';

import { useEffect, useRef, useState } from 'react';

interface BoomerangVideoProps {
  opacity?: number;
  className?: string;
}

export function BoomerangVideo({ opacity = 0.3, className = '' }: BoomerangVideoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const directionRef = useRef(1); // 1 = forward, -1 = reverse
  const [isLoaded, setIsLoaded] = useState(false);
  
  const TOTAL_FRAMES = 80;
  const FRAME_RATE = 30;
  const FRAME_PATH = '/assets/boomerang/A_seamless_hypnotic_1080p_202601282032_';
  
  useEffect(() => {
    // Preload images
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;
    
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          setIsLoaded(true);
        }
      };
      img.src = `${FRAME_PATH}${String(i).padStart(3, '0')}.jpg`;
      images.push(img);
    }
    
    let animationId: number;
    let lastTime = 0;
    const frameInterval = 1000 / FRAME_RATE;
    
    const animate = (currentTime: number) => {
      if (!lastTime) lastTime = currentTime;
      const deltaTime = currentTime - lastTime;
      
      if (deltaTime >= frameInterval) {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        
        if (canvas && ctx && images[frameRef.current]) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(images[frameRef.current], 0, 0, canvas.width, canvas.height);
          
          frameRef.current += directionRef.current;
          
          // Boomerang logic: forward then reverse
          if (frameRef.current >= TOTAL_FRAMES - 1) {
            directionRef.current = -1;
          } else if (frameRef.current <= 0) {
            directionRef.current = 1;
          }
        }
        
        lastTime = currentTime;
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);
  
  if (!isLoaded) {
    return (
      <div className={`absolute inset-0 bg-gradient-to-br from-its-blue/20 to-brand-blue/10 ${className}`}>
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse text-brand-accent">Memuat animasi...</div>
        </div>
      </div>
    );
  }
  
  return (
    <canvas
      ref={canvasRef}
      width={1920}
      height={1080}
      className={`absolute inset-0 w-full h-full object-cover ${className}`}
      style={{ 
        opacity,
        mixBlendMode: 'screen'
      }}
    />
  );
}
```

### 2.2 Hero Section dengan CTA

**Component**: `src/components/hero/HeroSection.tsx`

```typescript
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { BoomerangVideo } from './BoomerangVideo';

export function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-6 py-20 text-center overflow-hidden its-gradient">
      <BoomerangVideo opacity={0.25} />
      
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-blue/20 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-its-blue/30 rounded-full blur-[150px] pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-5xl mx-auto"
      >
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-3 rounded-full border border-brand-blue/30 bg-brand-blue/10 px-4 py-1.5 text-xs font-semibold text-brand-accent backdrop-blur-md mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-accent"></span>
          </span>
          Join 12,450+ Students
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black font-heading tracking-tighter text-white leading-[1.05] mb-6"
        >
          Elevate Your <br />
          <span className="gradient-text">Human Capital</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-2xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed mb-10"
        >
          Assessment holistik 9 dimensi untuk pengembangan potensi mahasiswa ITS secara komprehensif
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto"
        >
          <Link 
            href="/assessment"
            className="w-full sm:w-auto px-8 py-4 bg-white text-its-blue font-bold rounded-2xl hover:bg-brand-accent hover:text-its-dark transition-all hover:scale-105 shadow-2xl shadow-brand-accent/20 flex items-center justify-center gap-2 text-lg group"
          >
            Mulai Assessment Gratis
            <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">bolt</span>
          </Link>
          <button className="w-full sm:w-auto px-8 py-4 glass-card text-white font-bold rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-lg border-white/20 hover:border-brand-accent/50 group">
            <span className="material-symbols-outlined group-hover:text-brand-accent transition-colors">play_circle</span>
            Tonton Demo
          </button>
        </motion.div>
        
        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-24 grid grid-cols-3 gap-8 md:gap-20 border-t border-white/5 pt-12 px-8 rounded-3xl bg-white/[0.02] backdrop-blur-sm"
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl md:text-4xl font-bold text-white">9</span>
            <span className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-slate-500">Dimensi Utama</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl md:text-4xl font-bold text-white">72</span>
            <span className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-slate-500">Pertanyaan</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl md:text-4xl font-bold text-white">100%</span>
            <span className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-slate-500">Gratis ITS</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
```

---

## 🧩 FASE 3: Halaman Assessment & 9 Dimensi Cards

### 3.1 Halaman /assessment/ dengan 9 Dimensi Cards

**Lokasi**: `src/app/(public)/assessment/page.tsx`

```typescript
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

interface Dimension {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  bgGradient: string;
  questions: number;
  estimatedTime: string;
  reliability: string;
}

const dimensions: Dimension[] = [
  {
    id: 'cognitive',
    name: 'Kognitif',
    description: 'Kemampuan berpikir kritis, kreativitas, dan metakognisi',
    icon: 'psychology',
    color: 'blue',
    bgGradient: 'from-blue-500/20 to-blue-600/10',
    questions: 8,
    estimatedTime: '~2 menit',
    reliability: 'α = 0.87',
  },
  {
    id: 'self-management',
    name: 'Manajemen Diri',
    description: 'Pengelolaan waktu, produktivitas, dan pengendalian diri',
    icon: 'schedule',
    color: 'emerald',
    bgGradient: 'from-emerald-500/20 to-emerald-600/10',
    questions: 8,
    estimatedTime: '~2 menit',
    reliability: 'α = 0.87',
  },
  {
    id: 'financial',
    name: 'Finansial',
    description: 'Literasi keuangan dan perilaku finansial',
    icon: 'account_balance_wallet',
    color: 'teal',
    bgGradient: 'from-teal-500/20 to-teal-600/10',
    questions: 8,
    estimatedTime: '~2 menit',
    reliability: 'α = 0.85',
  },
  {
    id: 'physical',
    name: 'Kesehatan Fisik',
    description: 'Aktivitas fisik, tidur, dan vitalitas',
    icon: 'favorite',
    color: 'red',
    bgGradient: 'from-red-500/20 to-red-600/10',
    questions: 8,
    estimatedTime: '~2 menit',
    reliability: 'α = 0.84',
  },
  {
    id: 'emotional',
    name: 'Emosional',
    description: 'Kecerdasan emosional dan regulasi emosi',
    icon: 'sentiment_satisfied',
    color: 'pink',
    bgGradient: 'from-pink-500/20 to-pink-600/10',
    questions: 8,
    estimatedTime: '~2 menit',
    reliability: 'α = 0.84',
  },
  {
    id: 'mental-health',
    name: 'Kesehatan Mental',
    description: 'Well-being, resiliensi, dan manajemen stres',
    icon: 'self_improvement',
    color: 'violet',
    bgGradient: 'from-violet-500/20 to-violet-600/10',
    questions: 8,
    estimatedTime: '~2 menit',
    reliability: 'α = 0.86',
  },
  {
    id: 'character',
    name: 'Karakter',
    description: 'Integritas, etika, dan tanggung jawab sosial',
    icon: 'security',
    color: 'amber',
    bgGradient: 'from-amber-500/20 to-amber-600/10',
    questions: 8,
    estimatedTime: '~2 menit',
    reliability: 'α = 0.84',
  },
  {
    id: 'spiritual',
    name: 'Spiritual',
    description: 'Makna hidup, gratitude, dan koneksi spiritual',
    icon: 'spa',
    color: 'purple',
    bgGradient: 'from-purple-500/20 to-purple-600/10',
    questions: 8,
    estimatedTime: '~2 menit',
    reliability: 'α = 0.85',
  },
  {
    id: 'environmental',
    name: 'Lingkungan',
    description: 'Kesadaran lingkungan dan gaya hidup berkelanjutan',
    icon: 'eco',
    color: 'green',
    bgGradient: 'from-green-500/20 to-green-600/10',
    questions: 8,
    estimatedTime: '~2 menit',
    reliability: 'α = 0.83',
  },
];

export default function AssessmentPage() {
  const [completedDimensions, setCompletedDimensions] = useState<string[]>([]);
  const [inProgressDimension, setInProgressDimension] = useState<string | null>(null);
  
  return (
    <div className="min-h-screen bg-[#0A0F1A] text-white pt-24 pb-12 px-6">
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
            Temukan kekuatan dan area pengembangan Anda melalui assessment holistik berbasis riset psikometrik
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
              {completedDimensions.length}/9
            </span>
          </div>
          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-its-blue to-brand-accent"
              initial={{ width: 0 }}
              animate={{ width: `${(completedDimensions.length / 9) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>
        
        {/* Dimensions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dimensions.map((dim, index) => {
            const isCompleted = completedDimensions.includes(dim.id);
            const isInProgress = inProgressDimension === dim.id;
            
            return (
              <motion.div
                key={dim.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/assessment/${dim.id}/info`}>
                  <div className={`glass-card rounded-2xl p-6 cursor-pointer hover:-translate-y-2 transition-all duration-300 border border-white/10 ${isCompleted ? 'border-green-500/50' : ''}`}>
                    {/* Status Badge */}
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${dim.bgGradient} flex items-center justify-center`}>
                        <span className="material-symbols-outlined text-2xl">{dim.icon}</span>
                      </div>
                      {isCompleted && (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full">
                          Selesai
                        </span>
                      )}
                      {isInProgress && (
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-full">
                          Berlangsung
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2">{dim.name}</h3>
                    <p className="text-sm text-slate-400 mb-4">{dim.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{dim.questions} pertanyaan</span>
                      <span>{dim.estimatedTime}</span>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                      <span className="text-xs text-slate-500">{dim.reliability}</span>
                      <span className="material-symbols-outlined text-brand-accent">arrow_forward</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

### 3.2 Component DimensionInfoPage

**Lokasi**: `src/components/assessment/DimensionInfoPage.tsx`

```typescript
'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface DimensionInfoPageProps {
  dimension: {
    id: string;
    name: string;
    nameEn: string;
    icon: string;
    color: string;
    description: string;
    reliability: number;
    sampleSize: number;
    validity: {
      cfi: number;
      rmsea: number;
    };
    researchBasis: string[];
    subDimensions: {
      name: string;
      description: string;
      itemCount: number;
      weight: number;
    }[];
    whatIsMeasured: string[];
    estimatedTime: string;
    currentStep: number;
    totalSteps: number;
  };
  onStart: () => void;
}

export function DimensionInfoPage({ dimension, onStart }: DimensionInfoPageProps) {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-[#0A0F1A] text-white pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="flex-1 h-2 bg-white/10 rounded-full">
            <motion.div 
              className="h-full rounded-full bg-gradient-to-r from-[#135bec] to-[#00d4ff]"
              initial={{ width: 0 }}
              animate={{ width: `${(dimension.currentStep / dimension.totalSteps) * 100}%` }}
            />
          </div>
          <span className="text-sm text-slate-400">{dimension.currentStep}/{dimension.totalSteps}</span>
        </motion.div>
        
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Kembali
        </button>
        
        {/* Info Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-3xl p-8 mb-8"
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-${dimension.color}-500 to-${dimension.color}-600 flex items-center justify-center`}>
              <span className="material-symbols-outlined text-3xl">{dimension.icon}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{dimension.name}</h1>
              <p className="text-slate-400">{dimension.nameEn}</p>
            </div>
          </div>
          
          {/* Research Badge */}
          <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-white/5 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span className="text-sm">Cronbach's α = {dimension.reliability}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-400">📊</span>
              <span className="text-sm">n = {dimension.sampleSize}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-purple-400">🔬</span>
              <span className="text-sm">CFI = {dimension.validity.cfi}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">📐</span>
              <span className="text-sm">RMSEA = {dimension.validity.rmsea}</span>
            </div>
          </div>
          
          {/* Description */}
          <p className="text-slate-300 leading-relaxed mb-6">
            {dimension.description}
          </p>
          
          {/* What is Measured */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3 text-slate-400">Apa yang akan diukur:</h3>
            <ul className="space-y-2">
              {dimension.whatIsMeasured.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-300">
                  <span className="text-brand-accent mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Sub-dimensions */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3 text-slate-400">Sub-dimensi:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dimension.subDimensions.map((sub, i) => (
                <div key={i} className="p-4 bg-white/5 rounded-xl">
                  <h4 className="font-semibold mb-1">{sub.name}</h4>
                  <p className="text-xs text-slate-400">{sub.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-slate-500">{sub.itemCount} pertanyaan</span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-500">Bobot: {sub.weight}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Sources */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold mb-3 text-slate-400">Berdasarkan Penelitian:</h3>
            <ul className="text-xs text-slate-500 space-y-1">
              {dimension.researchBasis.map((source, i) => (
                <li key={i}>• {source}</li>
              ))}
            </ul>
          </div>
          
          {/* CTA */}
          <div className="flex items-center justify-between pt-6 border-t border-white/10">
            <span className="text-sm text-slate-400 flex items-center gap-2">
              <span className="material-symbols-outlined">schedule</span>
              {dimension.estimatedTime}
            </span>
            <button
              onClick={onStart}
              className="px-8 py-4 bg-white text-[#0A0F1A] font-bold rounded-xl hover:scale-105 transition-transform flex items-center gap-2"
            >
              Mulai Assessment
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
```

---

## 📝 FASE 4: Assessment Questions & Navigation

### 4.1 Component Pertanyaan dengan Skala Likert

**Lokasi**: `src/components/assessment/AssessmentQuestion.tsx`

```typescript
'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface Question {
  id: string;
  text: string;
  subDimension: string;
  reverseScored?: boolean;
}

interface AssessmentQuestionProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedValue: number | null;
  onAnswer: (value: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  timeRemaining: number;
}

const likertLabels = {
  1: 'Sangat Tidak Setuju',
  2: 'Tidak Setuju',
  3: 'Netral',
  4: 'Setuju',
  5: 'Sangat Setuju',
};

export function AssessmentQuestion({
  question,
  questionNumber,
  totalQuestions,
  selectedValue,
  onAnswer,
  onNext,
  onPrevious,
  timeRemaining,
}: AssessmentQuestionProps) {
  const [localSelected, setLocalSelected] = useState<number | null>(selectedValue);
  
  useEffect(() => {
    setLocalSelected(selectedValue);
  }, [selectedValue]);
  
  const handleSelect = (value: number) => {
    setLocalSelected(value);
    onAnswer(value);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="min-h-screen bg-[#0A0F1A] text-white pt-24 pb-12 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Progress & Timer */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">
              {questionNumber}/{totalQuestions}
            </span>
            <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-its-blue to-brand-accent"
                initial={{ width: 0 }}
                animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
              />
            </div>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
            timeRemaining < 60 ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-slate-400'
          }`}>
            <span className="material-symbols-outlined text-sm">timer</span>
            <span className="font-mono">{formatTime(timeRemaining)}</span>
          </div>
        </div>
        
        {/* Question Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-8 mb-8"
        >
          <div className="mb-6">
            <span className="text-xs font-semibold text-brand-accent uppercase tracking-wider">
              {question.subDimension}
            </span>
          </div>
          
          <h2 className="text-2xl font-bold leading-relaxed mb-8">
            {question.text}
          </h2>
          
          {/* Likert Scale */}
          <div className="space-y-4">
            <div className="grid grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((value) => (
                <motion.button
                  key={value}
                  onClick={() => handleSelect(value)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    localSelected === value 
                      ? 'border-brand-accent bg-brand-accent/20' 
                      : 'border-white/10 bg-white/5 hover:border-white/30'
                  }`}
                >
                  <span className="block text-2xl font-bold mb-1">{value}</span>
                  <span className="text-xs text-slate-400">{likertLabels[value as keyof typeof likertLabels]}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={onPrevious}
            disabled={questionNumber === 1}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Sebelumnya
          </button>
          
          <button
            onClick={onNext}
            disabled={localSelected === null}
            className="flex items-center gap-2 px-8 py-4 bg-white text-[#0A0F1A] font-bold rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {questionNumber === totalQuestions ? 'Selesai' : 'Selanjutnya'}
            <span className="material-symbols-outlined">
              {questionNumber === totalQuestions ? 'check' : 'arrow_forward'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
```

### 4.2 Auto-save & Persistent Progress

**Lokasi**: `src/lib/assessment/assessmentStorage.ts`

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface Answer {
  questionId: string;
  value: number;
  timestamp: number;
}

interface AssessmentState {
  // Current dimension
  currentDimension: string | null;
  currentQuestionIndex: number;
  
  // Answers
  answers: Record<string, Answer>;
  
  // Timing
  dimensionStartTime: number | null;
  questionStartTime: number;
  totalTimeSpent: Record<string, number>;
  
  // Actions
  setDimension: (dimension: string) => void;
  setAnswer: (questionId: string, value: number) => void;
  setQuestionIndex: (index: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  resetDimension: (dimension: string) => void;
  getProgress: () => { completed: number; total: number; percent: number };
}

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set, get) => ({
      currentDimension: null,
      currentQuestionIndex: 0,
      answers: {},
      dimensionStartTime: null,
      questionStartTime: Date.now(),
      totalTimeSpent: {},
      
      setDimension: (dimension: string) => {
        const state = get();
        // Save time spent on previous dimension
        if (state.currentDimension) {
          const timeSpent = Date.now() - (state.dimensionStartTime || 0);
          set((state) => ({
            totalTimeSpent: {
              ...state.totalTimeSpent,
              [state.currentDimension!]: (state.totalTimeSpent[state.currentDimension!] || 0) + timeSpent,
            },
          }));
        }
        
        set({
          currentDimension: dimension,
          currentQuestionIndex: 0,
          dimensionStartTime: Date.now(),
          questionStartTime: Date.now(),
        });
      },
      
      setAnswer: (questionId: string, value: number) => {
        set((state) => ({
          answers: {
            ...state.answers,
            [questionId]: {
              questionId,
              value,
              timestamp: Date.now(),
            },
          },
        }));
        
        // Auto-save to localStorage
        localStorage.setItem(`assessment_answers_${get().currentDimension}`, JSON.stringify(get().answers));
      },
      
      setQuestionIndex: (index: number) => {
        // Track time for current question
        const state = get();
        const timeSpent = Date.now() - state.questionStartTime;
        
        set((state) => ({
          currentQuestionIndex: index,
          questionStartTime: Date.now(),
        }));
      },
      
      nextQuestion: () => {
        const state = get();
        set({ currentQuestionIndex: state.currentQuestionIndex + 1 });
      },
      
      previousQuestion: () => {
        const state = get();
        if (state.currentQuestionIndex > 0) {
          set({ currentQuestionIndex: state.currentQuestionIndex - 1 });
        }
      },
      
      resetDimension: (dimension: string) => {
        const answers = get().answers;
        Object.keys(answers).forEach((key) => {
          if (key.startsWith(`${dimension}_`)) {
            delete answers[key];
          }
        });
        set({
          answers,
          currentQuestionIndex: 0,
          dimensionStartTime: Date.now(),
        });
      },
      
      getProgress: () => {
        const state = get();
        const dimension = state.currentDimension;
        if (!dimension) return { completed: 0, total: 0, percent: 0 };
        
        const dimensionAnswers = Object.keys(state.answers).filter(
          (key) => key.startsWith(`${dimension}_`)
        );
        
        return {
          completed: dimensionAnswers.length,
          total: 8, // 8 questions per dimension
          percent: (dimensionAnswers.length / 8) * 100,
        };
      },
    }),
    {
      name: 'assessment-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        answers: state.answers,
        totalTimeSpent: state.totalTimeSpent,
      }),
    }
  )
);
```

---

## 🔔 FASE 5: Popup Reminder & Progress Tracking

### 5.1 Component Popup Reminder

**Lokasi**: `src/components/assessment/IncompleteAssessmentModal.tsx`

```typescript
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { create } from 'zustand';

interface IncompleteAssessmentState {
  isOpen: boolean;
  showReminder: (completedCount: number, totalCount: number) => void;
  closeReminder: () => void;
}

export const useIncompleteAssessmentStore = create<IncompleteAssessmentState>((set) => ({
  isOpen: false,
  showReminder: (completedCount, totalCount) => {
    // Only show if less than 9 dimensions completed
    if (completedCount < totalCount) {
      set({ isOpen: true });
    }
  },
  closeReminder: () => set({ isOpen: false }),
}));

interface IncompleteAssessmentModalProps {
  completedDimensions: string[];
  onContinue: () => void;
  onViewResults: () => void;
}

export function IncompleteAssessmentModal({
  completedDimensions,
  onContinue,
  onViewResults,
}: IncompleteAssessmentModalProps) {
  const { isOpen, closeReminder } = useIncompleteAssessmentStore();
  const [hasInteracted, setHasInteracted] = useState(false);
  
  // Show reminder when user has completed at least 1 dimension but not all
  useEffect(() => {
    if (completedDimensions.length > 0 && completedDimensions.length < 9) {
      // Show after 2 seconds of inactivity
      const timer = setTimeout(() => {
        setHasInteracted(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [completedDimensions]);
  
  const remainingDimensions = 9 - completedDimensions.length;
  
  return (
    <AnimatePresence>
      {isOpen && hasInteracted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={closeReminder}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#1A1F2E] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-its-blue to-brand-accent flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl text-white">notifications</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Assessment Belum Selesai
              </h3>
              <p className="text-slate-400">
                Anda telah menyelesaikan {completedDimensions.length} dari 9 dimensi. 
                Selesaikan {remainingDimensions} dimensi lagi untuk mendapatkan hasil holistik yang lengkap.
              </p>
            </div>
            
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Progress</span>
                <span className="text-brand-accent font-bold">
                  {completedDimensions.length}/9
                </span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-its-blue to-brand-accent transition-all duration-500"
                  style={{ width: `${(completedDimensions.length / 9) * 100}%` }}
                />
              </div>
            </div>
            
            {/* Remaining Dimensions */}
            <div className="mb-6">
              <p className="text-xs text-slate-500 mb-2">Sisa dimensi:</p>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
                  const isCompleted = completedDimensions.includes(`dimension-${num}`);
                  return (
                    <span
                      key={num}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        isCompleted 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-white/10 text-slate-400'
                      }`}
                    >
                      {num}
                    </span>
                  );
                })}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  closeReminder();
                  onContinue();
                }}
                className="w-full py-4 bg-white text-[#0A0F1A] font-bold rounded-xl hover:bg-brand-accent transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">play_arrow</span>
                Lanjutkan Assessment
              </button>
              <button
                onClick={() => {
                  closeReminder();
                  onViewResults();
                }}
                className="w-full py-4 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition-colors"
              >
                Lihat Hasil Sementara
              </button>
              <button
                onClick={closeReminder}
                className="w-full py-3 text-slate-400 hover:text-white transition-colors text-sm"
              >
                Nanti Saja
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

---

## 📊 FASE 6: 10 Visualisasi Diagram

### 6.1 Diagram 1: Holistic Development Radar Chart

**Lokasi**: `src/components/visualizations/HolisticRadarChart.tsx`

```typescript
'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface RadarChartProps {
  data: {
    dimension: string;
    score: number;
    percentile: number;
  }[];
  width?: number;
  height?: number;
}

const dimensionLabels: Record<string, string> = {
  cognitive: 'Kognitif',
  'self-management': 'Manajemen Diri',
  financial: 'Finansial',
  physical: 'Kesehatan Fisik',
  emotional: 'Emosional',
  'mental-health': 'Kesehatan Mental',
  character: 'Karakter',
  spiritual: 'Spiritual',
  environmental: 'Lingkungan',
};

const dimensionColors: Record<string, string> = {
  cognitive: '#3B82F6',
  'self-management': '#10B981',
  financial: '#14B8A6',
  physical: '#EF4444',
  emotional: '#EC4899',
  'mental-health': '#8B5CF6',
  character: '#F59E0B',
  spiritual: '#A855F7',
  environmental: '#22C55E',
};

export function HolisticRadarChart({ data, width = 500, height = 500 }: RadarChartProps) {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(centerX, centerY) - 60;
  const levels = 5;
  
  const points = useMemo(() => {
    return data.map((d, i) => {
      const angle = (Math.PI * 2 * i) / data.length - Math.PI / 2;
      const distance = (d.score / 100) * radius;
      return {
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        labelX: centerX + Math.cos(angle) * (radius + 30),
        labelY: centerY + Math.sin(angle) * (radius + 30),
        score: d.score,
        label: dimensionLabels[d.dimension] || d.dimension,
        color: dimensionColors[d.dimension] || '#fff',
        percentile: d.percentile,
      };
    });
  }, [data, centerX, centerY, radius]);
  
  return (
    <div className="relative">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Background circles */}
        {[1, 2, 3, 4, 5].map((level) => (
          <circle
            key={level}
            cx={centerX}
            cy={centerY}
            r={(radius / levels) * level}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
            strokeDasharray="4,4"
          />
        ))}
        
        {/* Axis lines */}
        {data.map((_, i) => {
          const angle = (Math.PI * 2 * i) / data.length - Math.PI / 2;
          return (
            <line
              key={i}
              x1={centerX}
              y1={centerY}
              x2={centerX + Math.cos(angle) * radius}
              y2={centerY + Math.sin(angle) * radius}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
          );
        })}
        
        {/* Data polygon */}
        <motion.polygon
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          points={points.map((p) => `${p.x},${p.y}`).join(' ')}
          fill="rgba(0, 212, 255, 0.2)"
          stroke="#00d4ff"
          strokeWidth="2"
        />
        
        {/* Data points */}
        {points.map((point, i) => (
          <motion.circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="6"
            fill={point.color}
            stroke="#fff"
            strokeWidth="2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
          />
        ))}
        
        {/* Labels */}
        {points.map((point, i) => (
          <g key={i}>
            <text
              x={point.labelX}
              y={point.labelY}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#fff"
              fontSize="12"
              fontWeight="500"
            >
              {point.label}
            </text>
            <text
              x={point.labelX}
              y={point.labelY + 16}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={point.color}
              fontSize="11"
              fontWeight="bold"
            >
              {point.score.toFixed(0)}%
            </text>
          </g>
        ))}
        
        {/* Center score */}
        <text
          x={centerX}
          y={centerY - 8}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#fff"
          fontSize="24"
          fontWeight="bold"
        >
          {Math.round(data.reduce((sum, d) => sum + d.score, 0) / data.length)}%
        </text>
        <text
          x={centerX}
          y={centerY + 16}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#888"
          fontSize="12"
        >
          Overall Score
        </text>
      </svg>
    </div>
  );
}
```

### 6.2 Diagram 2: Cognitive Development Sunburst (sudah ada)

### 6.3 Diagram 3: Self-Management Timeline & Gauge

**Lokasi**: `src/components/assessment/SelfManagementDashboard.tsx`

```typescript
'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface TimelineData {
  month: string;
  score: number;
  activities: number;
}

interface SelfManagementDashboardProps {
  data: {
    overallScore: number;
    timeManagement: number;
    procrastination: number;
    deepWork: number;
    timeline: TimelineData[];
  };
}

export function SelfManagementDashboard({ data }: SelfManagementDashboardProps) {
  const gaugeRotation = useMemo(() => {
    return (data.overallScore / 100) * 180 - 90;
  }, [data.overallScore]);
  
  return (
    <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-emerald-500">📊</span>
            Self-Management Dashboard
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Timeline & Gauge untuk produktivitas dan manajemen waktu
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gauge Chart */}
        <div className="flex flex-col items-center">
          <div className="relative w-48 h-24">
            {/* Gauge background */}
            <div className="absolute inset-0 rounded-t-full bg-slate-700 overflow-hidden">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-24">
                <svg viewBox="0 0 192 96" className="w-full h-full">
                  <path
                    d="M 16 96 A 80 80 0 0 1 176 96"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="16"
                  />
                </svg>
              </div>
            </div>
            
            {/* Gauge fill */}
            <motion.div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-24 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <svg viewBox="0 0 192 96" className="w-full h-full">
                <motion.path
                  d="M 16 96 A 80 80 0 0 1 176 96"
                  fill="none"
                  stroke="url(#gaugeGradient)"
                  strokeWidth="16"
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: 502 }}
                  animate={{ strokeDashoffset: 502 - (data.overallScore / 100) * 502 }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
                <defs>
                  <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#EF4444" />
                    <stop offset="50%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>
            
            {/* Needle */}
            <motion.div
              className="absolute bottom-0 left-1/2 w-1 h-20 bg-white origin-bottom"
              initial={{ rotate: -90 }}
              animate={{ rotate: gaugeRotation }}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{
                transformOrigin: 'center bottom',
                left: 'calc(50% - 2px)',
                bottom: '0',
              }}
            >
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full" />
            </motion.div>
          </div>
          
          <div className="text-center mt-2">
            <div className="text-3xl font-bold text-white">{data.overallScore}</div>
            <div className="text-sm text-slate-400">Overall Score</div>
          </div>
        </div>
        
        {/* Sub-dimensions */}
        <div className="space-y-4">
          {[
            { name: 'Time Management', value: data.timeManagement, color: 'bg-emerald-500' },
            { name: 'Procrastination Control', value: data.procrastination, color: 'bg-blue-500' },
            { name: 'Deep Work', value: data.deepWork, color: 'bg-purple-500' },
          ].map((item) => (
            <div key={item.name} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">{item.name}</span>
                <span className="text-white font-bold">{item.value}%</span>
              </div>
              <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${item.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Timeline */}
      <div className="mt-6">
        <h4 className="text-sm font-semibold text-white mb-4">Progress Timeline</h4>
        <div className="flex items-end gap-2 h-24">
          {data.timeline.map((item, i) => (
            <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
              <motion.div
                className="w-full bg-gradient-to-t from-emerald-500/50 to-emerald-500/20 rounded-t"
                initial={{ height: 0 }}
                animate={{ height: `${item.score}%` }}
                transition={{ delay: i * 0.1 }}
              />
              <span className="text-xs text-slate-500">{item.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

### 6.4 Diagram 4: Financial Intelligence Waterfall & Network

### 6.5 Diagram 5: Emotional Intelligence Circumplex

### 6.6 Diagram 6: Mental Health Ecosystem Map

### 6.7 Diagram 7: Character Development Compass

### 6.8 Diagram 8: Spiritual Development Mandala

### 6.9 Diagram 9: Environmental & Lifestyle Eco-Map (sudah ada)

### 6.10 Diagram 10: Integrated Development Ecosystem

---

## 🎯 FASE 7: Scoring Algorithm & Interpretasi

### 7.1 Sistem Interpretasi Level

```typescript
// Level definitions based on percentile
const LEVELS = {
  expert: { minPercentile: 95, label: 'Expert', description: 'Di atas 95% populasi' },
  advanced: { minPercentile: 80, label: 'Advanced', description: 'Di atas 80% populasi' },
  competent: { minPercentile: 60, label: 'Competent', description: 'Di atas 60% populasi' },
  developing: { minPercentile: 40, label: 'Developing', description: 'Di atas 40% populasi' },
  beginner: { minPercentile: 0, label: 'Beginner', description: 'Di bawah 40% populasi' },
};

export function getLevel(percentile: number) {
  if (percentile >= 95) return LEVELS.expert;
  if (percentile >= 80) return LEVELS.advanced;
  if (percentile >= 60) return LEVELS.competent;
  if (percentile >= 40) return LEVELS.developing;
  return LEVELS.beginner;
}

export function getLevelColor(level: string) {
  const colors: Record<string, string> = {
    expert: 'text-purple-400 bg-purple-500/20',
    advanced: 'text-blue-400 bg-blue-500/20',
    competent: 'text-green-400 bg-green-500/20',
    developing: 'text-yellow-400 bg-yellow-500/20',
    beginner: 'text-red-400 bg-red-500/20',
  };
  return colors[level] || colors.beginner;
}
```

### 7.2 Personalized Feedback Generation

```typescript
interface FeedbackTemplate {
  dimension: string;
  level: string;
  score: number;
  percentile: number;
  subscores: Record<string, number>;
  strengths: string[];
  growthAreas: string[];
}

export function generatePersonalizedFeedback(data: FeedbackTemplate): string {
  const level = getLevel(data.percentile);
  
  let feedback = `# Hasil Assessment ${data.dimension}\n\n`;
  
  feedback += `## Tingkat: ${level.label}\n`;
  feedback += `${level.description} (Persentil ke-${data.percentile})\n\n`;
  
  feedback += `## Kekuatan Utama\n`;
  data.strengths.forEach((strength, i) => {
    feedback += `${i + 1}. ${strength}\n`;
  });
  
  feedback += `\n## Area Pengembangan\n`;
  data.growthAreas.forEach((area, i) => {
    feedback += `${i + 1}. ${area}\n`;
  });
  
  feedback += `\n## Rekomendasi\n`;
  feedback += generateRecommendations(data);
  
  return feedback;
}
```

---

## 🔒 FASE 8: Privacy & Compliance

### 8.1 Informed Consent Flow

```typescript
interface ConsentState {
  hasReadTerms: boolean;
  hasAgreedToDataUse: boolean;
  hasAgreedToResearch: boolean;
  consentTimestamp: string | null;
}

export const useConsentStore = create<ConsentState>()(
  persist(
    (set) => ({
      hasReadTerms: false,
      hasAgreedToDataUse: false,
      hasAgreedToResearch: false,
      consentTimestamp: null,
      
      agreeToTerms: () => set({ hasReadTerms: true }),
      toggleDataUse: () => set((state) => ({ hasAgreedToDataUse: !state.hasAgreedToDataUse })),
      toggleResearch: () => set((state) => ({ hasAgreedToResearch: !state.hasAgreedToResearch })),
      
      submitConsent: () => {
        const state = get();
        if (state.hasAgreedToDataUse) {
          set({
            consentTimestamp: new Date().toISOString(),
          });
          return true;
        }
        return false;
      },
      
      reset: () => set({
        hasReadTerms: false,
        hasAgreedToDataUse: false,
        hasAgreedToResearch: false,
        consentTimestamp: null,
      }),
    }),
    {
      name: 'consent-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

### 8.2 Crisis Protocol untuk Mental Health

```typescript
interface CrisisAlert {
  detected: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
}

export function detectCrisis(responses: Record<string, number>): CrisisAlert {
  // Check for suicidal ideation indicators
  const crisisItems = ['MH_SUI_1', 'MH_SUI_2', 'MH_HOPELESS_1'];
  const crisisResponses = crisisItems.map(id => responses[id] || 0);
  const crisisScore = crisisResponses.reduce((a, b) => a + b, 0);
  
  if (crisisScore >= 12) {
    return {
      detected: true,
      severity: 'critical',
      recommendations: [
        'Segera hubungi layanan krisis: (021) 788-42580',
        'Hubungi teman atau keluarga terdekat',
        'Kunjungi Unit Konseling ITS',
        'Jika dalam keadaan darurat, hubungi 119',
      ],
    };
  }
  
  if (crisisScore >= 8) {
    return {
      detected: true,
      severity: 'high',
      recommendations: [
        'Disarankan untuk konsultasi dengan konselor',
        'Hubungi Unit Konseling ITS',
        'Bicarakan dengan teman terpercaya',
      ],
    };
  }
  
  return {
    detected: false,
    severity: 'low',
    recommendations: [],
  };
}
```

---

## ✅ FASE 9: Testing & Deployment

### 9.1 Test Cases

```typescript
describe('Assessment Engine', () => {
  describe('IRT Scoring', () => {
    it('should calculate theta correctly', () => {
      const responses = {
        'COG_CT1': 4,
        'COG_CT2': 5,
        'COG_GM1': 4,
        'COG_GM2': 4,
      };
      
      const result = calculateIRTScore(responses, itemParameters, 'cognitive');
      expect(result.theta).toBeGreaterThan(0);
      expect(result.adjustedScore).toBeGreaterThan(0);
    });
    
    it('should return valid confidence interval', () => {
      const result = calculateIRTScore(responses, itemParameters, 'cognitive');
      expect(result.adjustedScore).toBeGreaterThan(result.confidenceInterval[0]);
      expect(result.adjustedScore).toBeLessThan(result.confidenceInterval[1]);
    });
  });
  
  describe('Level Interpretation', () => {
    it('should return Expert for 95+ percentile', () => {
      const level = getLevel(97);
      expect(level.label).toBe('Expert');
    });
    
    it('should return Beginner for <40 percentile', () => {
      const level = getLevel(25);
      expect(level.label).toBe('Beginner');
    });
  });
  
  describe('Crisis Detection', () => {
    it('should detect crisis with high scores', () => {
      const responses = { 'MH_SUI_1': 5, 'MH_SUI_2': 5, 'MH_HOPELESS_1': 5 };
      const alert = detectCrisis(responses);
      expect(alert.detected).toBe(true);
      expect(alert.severity).toBe('critical');
    });
  });
});
```

---

## 📁 Struktur File

```
src/
├── app/
│   ├── (public)/
│   │   ├── assessment/
│   │   │   ├── page.tsx              # Assessment landing page
│   │   │   └── [dimension]/
│   │   │       ├── info/
│   │   │       │   └── page.tsx      # Pre-test info page
│   │   │       └── test/
│   │   │           └── page.tsx      # Assessment questions
│   │   └── page.tsx                  # Updated landing page
│   ├── api/
│   │   └── assessment/
│   │       ├── start/route.ts
│   │       ├── response/route.ts
│   │       ├── complete/route.ts
│   │       ├── calculate/route.ts
│   │       └── results/route.ts
│   └── layout.tsx
├── components/
│   ├── hero/
│   │   ├── HeroSection.tsx
│   │   └── BoomerangVideo.tsx
│   ├── assessment/
│   │   ├── DimensionInfoPage.tsx
│   │   ├── AssessmentQuestion.tsx
│   │   ├── IncompleteAssessmentModal.tsx
│   │   └── LikertScale.tsx
│   └── visualizations/
│       ├── HolisticRadarChart.tsx
│       ├── SelfManagementDashboard.tsx
│       └── Sunburst.tsx
├── lib/
│   ├── assessment/
│   │   ├── engine.ts                 # Scoring engine
│   │   ├── irtScorer.ts              # IRT algorithm
│   │   ├── questions.ts              # Question bank
│   │   └── assessmentStorage.ts      # Zustand store
│   └── db/
│       └── schema.ts
└── supabase/
    └── migrations/
        └── 001_ppsdm_dimensions.sql
```

---

## 🚀 Prioritas Implementasi

### Phase 1 (Minggu 1): Core Infrastructure
1. ✅ Setup database schema
2. ✅ Implementasi video boomerang
3. ✅ Landing page update

### Phase 2 (Minggu 2): Assessment Flow
1. ⬜ Dimension selection page
2. ⬜ Pre-test info pages
3. ⬜ Question components

### Phase 3 (Minggu 3): Scoring & State
1. ⬜ IRT-based scoring
2. ⬜ Zustand state management
3. ⬜ Auto-save functionality

### Phase 4 (Minggu 4): Visualizations
1. ⬜ 10 visualization diagrams
2. ⬜ Results dashboard
3. ⬜ Progress tracking

### Phase 5 (Minggu 5): Polish & Testing
1. ⬜ Responsive design
2. ⬜ PWA capabilities
3. ⬜ Privacy compliance
4. ⬜ Testing & debugging

---

*Dokumen ini akan diupdate seiring progress implementasi.*