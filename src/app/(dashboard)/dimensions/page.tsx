'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useDimensions, useDimensionStats } from '@/lib/hooks';
import { DimensionsPageSkeleton, DimensionGridSkeleton } from '@/components/dashboard/LoadingSkeletons';
import { ErrorDisplay, EmptyStateDisplay } from '@/components/dashboard/ErrorDisplay';
import type { Dimension } from '@/lib/db/schema';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Dimension metadata
const DIMENSION_META: Record<string, { 
  name: string; 
  description: string; 
  color: string; 
  icon: string;
  category: 'hard' | 'soft';
}> = {
  cognitive: {
    name: 'Cognitive Intelligence',
    description: 'Critical thinking, problem-solving, and analytical abilities',
    color: '#3b82f6',
    icon: 'psychology',
    category: 'hard',
  },
  emotional: {
    name: 'Emotional Intelligence',
    description: 'Self-awareness, empathy, and relationship management',
    color: '#ec4899',
    icon: 'favorite',
    category: 'soft',
  },
  spiritual: {
    name: 'Spiritual Intelligence',
    description: 'Purpose, meaning, and values alignment',
    color: '#8b5cf6',
    icon: 'self_improvement',
    category: 'soft',
  },
  physical: {
    name: 'Physical Intelligence',
    description: 'Health, fitness, and body awareness',
    color: '#22c55e',
    icon: 'fitness_center',
    category: 'hard',
  },
  creative: {
    name: 'Creative Intelligence',
    description: 'Innovation, imagination, and artistic expression',
    color: '#f59e0b',
    icon: 'palette',
    category: 'soft',
  },
  professional: {
    name: 'Professional Intelligence',
    description: 'Career skills, expertise, and work ethic',
    color: '#0ea5e9',
    icon: 'work',
    category: 'hard',
  },
  leadership: {
    name: 'Leadership Intelligence',
    description: 'Vision, influence, and team development',
    color: '#ef4444',
    icon: 'groups',
    category: 'soft',
  },
  financial: {
    name: 'Financial Intelligence',
    description: 'Money management, investment, and financial planning',
    color: '#10b981',
    icon: 'account_balance',
    category: 'hard',
  },
  environmental: {
    name: 'Environmental Intelligence',
    description: 'Sustainability, eco-awareness, and social responsibility',
    color: '#84cc16',
    icon: 'nature',
    category: 'hard',
  },
};

// Dimension type for UI
interface DimensionUI {
  id: string;
  name: string;
  score: number;
  description: string;
  icon: string;
  color: string;
  category: 'hard' | 'soft';
}

// Radar Chart Component
function RadarChart({ 
  data, 
  size = 300 
}: { 
  data: DimensionUI[]; 
  size?: number;
}) {
  const center = size / 2;
  const radius = (size / 2) - 40;
  const angleStep = (2 * Math.PI) / data.length;
  
  // Calculate points for the data polygon
  const points = data.map((dim, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const r = (dim.score / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  // Calculate label positions
  const labels = data.map((dim, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const r = radius + 25;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y, name: dim.name.split(' ')[0], score: dim.score };
  });

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="overflow-visible">
        {/* Background circles */}
        {[0.25, 0.5, 0.75, 1].map((scale, i) => (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={radius * scale}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeDasharray={scale === 1 ? "0" : "4 2"}
            className="text-slate-700"
          />
        ))}
        
        {/* Spoke lines */}
        {data.map((_, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-slate-700"
            />
          );
        })}
        
        {/* Data polygon */}
        <polygon
          points={points}
          fill="rgba(0, 51, 102, 0.6)"
          stroke="#FFD700"
          strokeWidth="2"
          className="opacity-90"
        />
        
        {/* Data points */}
        {data.map((dim, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const r = (dim.score / 100) * radius;
          const x = center + r * Math.cos(angle);
          const y = center + r * Math.sin(angle);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="4"
              fill="#FFD700"
              className="hover:r-6 transition-all cursor-pointer"
            />
          );
        })}
      </svg>
      
      {/* Labels */}
      {labels.map((label, i) => (
        <div
          key={i}
          className="absolute text-[10px] font-bold text-slate-400 bg-[#0f1923]/80 px-1.5 py-0.5 rounded whitespace-nowrap"
          style={{
            left: label.x,
            top: label.y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {label.name}
          <span className="text-[#FFD700] ml-1">{label.score}</span>
        </div>
      ))}
    </div>
  );
}

// Dimension Card Component
function DimensionCard({ 
  dimension, 
}: { 
  dimension: DimensionUI;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const progressColor = dimension.score >= 70 ? 'bg-green-500' : dimension.score >= 50 ? 'bg-[#FFD700]' : 'bg-red-500';
  
  return (
    <motion.div
      variants={itemVariants}
      className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/[0.08] rounded-xl overflow-hidden hover:border-white/[0.12] transition-all"
    >
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start gap-4">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${dimension.color}20`, color: dimension.color }}
          >
            <span className="material-symbols-outlined text-2xl">{dimension.icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-white font-semibold text-sm truncate">{dimension.name}</h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                dimension.category === 'hard' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
              }`}>
                {dimension.category}
              </span>
            </div>
            <p className="text-slate-400 text-xs mt-1 line-clamp-2">{dimension.description}</p>
            
            {/* Progress bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-400">Score</span>
                <span className="text-white font-semibold">{dimension.score}/100</span>
              </div>
              <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${progressColor} transition-all duration-500`}
                  style={{ width: `${dimension.score}%` }}
                />
              </div>
            </div>
          </div>
          <button className="text-slate-400 hover:text-white transition-colors">
            <span className={`material-symbols-outlined transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
              expand_more
            </span>
          </button>
        </div>
      </div>
      
      {/* Expanded content */}
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-white/[0.08] px-4 py-3"
        >
          <div className="space-y-2">
            <Link 
              href={`/dimensions/${dimension.id}`}
              className="flex items-center gap-2 text-sm text-[#1A4D80] hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-sm">analytics</span>
              View detailed analysis
            </Link>
            <Link 
              href={`/goals?dimension=${dimension.id}`}
              className="flex items-center gap-2 text-sm text-[#1A4D80] hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-sm">flag</span>
              Set goals for this dimension
            </Link>
            <button className="flex items-center gap-2 text-sm text-[#1A4D80] hover:text-white transition-colors w-full text-left">
              <span className="material-symbols-outlined text-sm">school</span>
              Find learning resources
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// Stats Summary Component
function StatsSummary({ stats }: { stats: ReturnType<ReturnType<typeof useDimensionStats>['stats']> }) {
  if (!stats) return null;
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/[0.08] rounded-xl p-4">
        <p className="text-xs text-slate-500 uppercase tracking-wider">Average Score</p>
        <p className="text-2xl font-bold text-white mt-1">{stats.avgScore}</p>
      </div>
      <div className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/[0.08] rounded-xl p-4">
        <p className="text-xs text-slate-500 uppercase tracking-wider">Strongest</p>
        <p className="text-lg font-bold text-green-400 mt-1 truncate">{stats.strongest.name}</p>
        <p className="text-xs text-slate-400">{stats.strongest.score}/100</p>
      </div>
      <div className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/[0.08] rounded-xl p-4">
        <p className="text-xs text-slate-500 uppercase tracking-wider">Needs Focus</p>
        <p className="text-lg font-bold text-[#FFD700] mt-1 truncate">{stats.weakest.name}</p>
        <p className="text-xs text-slate-400">{stats.weakest.score}/100</p>
      </div>
      <div className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/[0.08] rounded-xl p-4">
        <p className="text-xs text-slate-500 uppercase tracking-wider">Balance</p>
        <p className="text-lg font-bold text-white mt-1">
          <span className="text-blue-400">{stats.hardCount}</span> Hard / <span className="text-purple-400">{stats.softCount}</span> Soft
        </p>
        <p className="text-xs text-slate-400">Skills</p>
      </div>
    </div>
  );
}

// Main 9 Dimensions Page
export default function DimensionsPage() {
  const [showComparison, setShowComparison] = useState(false);
  const { data: dimensionScores, isLoading, error, errorMessage, refetch } = useDimensions();

  // Transform API data to UI format
  const dimensions: DimensionUI[] = useMemo(() => {
    if (!dimensionScores) return [];
    
    return Object.entries(DIMENSION_META).map(([id, meta]) => ({
      id,
      name: meta.name,
      score: dimensionScores[id as keyof typeof dimensionScores] as number || 0,
      description: meta.description,
      icon: meta.icon,
      color: meta.color,
      category: meta.category,
    }));
  }, [dimensionScores]);

  const stats = useDimensionStats(dimensionScores || null).stats;

  // Show loading skeleton
  if (isLoading) {
    return <DimensionsPageSkeleton />;
  }

  // Show error display
  if (error) {
    return (
      <div className="p-4">
        <ErrorDisplay
          title="Failed to load dimensions"
          message={errorMessage}
          onRetry={refetch}
          variant="fullscreen"
        />
      </div>
    );
  }

  // Show empty state if no data
  if (!dimensionScores || dimensions.length === 0) {
    return (
      <div className="p-4">
        <EmptyStateDisplay
          title="No Dimension Data"
          description="Complete your first assessment to see your dimension scores."
          action={{ 
            label: 'Take Assessment', 
            onClick: () => window.location.href = '/assessments'
          }}
        />
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">9 Dimensions Analysis</h1>
          <p className="text-slate-400 text-sm mt-1">
            Comprehensive overview of your holistic development across all dimensions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              showComparison 
                ? 'bg-[#003366] text-white' 
                : 'bg-[#1e293b]/40 text-slate-300 hover:text-white border border-white/[0.08]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">compare_arrows</span>
            {showComparison ? 'Hide Comparison' : 'Compare with Previous'}
          </button>
          <Link
            href="/assessments"
            className="px-4 py-2 bg-[#FFD700] text-[#0f1923] rounded-lg text-sm font-bold hover:bg-[#FFD700]/90 transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">assessment</span>
            Take Assessment
          </Link>
        </div>
      </motion.div>

      {/* Stats Summary */}
      <motion.section variants={itemVariants}>
        <StatsSummary stats={stats} />
      </motion.section>

      {/* Radar Chart Section */}
      <motion.section variants={itemVariants}>
        <div className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/[0.08] rounded-xl p-6 md:p-8">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Radar Chart */}
            <div className="flex-shrink-0">
              <div className="relative">
                <RadarChart data={dimensions} size={320} />
                {/* Center score */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <p className="text-xs text-slate-400 uppercase tracking-wider">Overall</p>
                    <p className="text-3xl font-bold text-[#FFD700]">{stats?.avgScore || 0}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Dimension Legend */}
            <div className="flex-1 w-full">
              <h3 className="text-white font-semibold mb-4">Dimension Breakdown</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {dimensions.map((dim) => (
                  <div key={dim.id} className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: dim.color }}
                    />
                    <span className="text-sm text-slate-300 flex-1">{dim.name}</span>
                    <span className="text-sm font-semibold text-white">{dim.score}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Dimension Cards Grid */}
      <section>
        <motion.h2 variants={itemVariants} className="text-lg font-bold text-white mb-4">
          Detailed Breakdown
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dimensions.map((dimension) => (
            <DimensionCard key={dimension.id} dimension={dimension} />
          ))}
        </div>
      </section>

      {/* Improvement Suggestions */}
      <motion.section variants={itemVariants}>
        <div className="bg-gradient-to-r from-[#003366]/30 to-[#1e293b]/30 border border-[#003366]/30 rounded-xl p-5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#FFD700]/20 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#FFD700]">tips_and_updates</span>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">Improvement Recommendations</h3>
              <ul className="space-y-2 text-slate-300 text-sm">
                {stats && (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="text-[#FFD700] mt-0.5">•</span>
                      Focus on <strong className="text-white">{stats.weakest.name}</strong> - your lowest scoring dimension at {stats.weakest.score}/100
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#FFD700] mt-0.5">•</span>
                      Maintain your strength in <strong className="text-white">{stats.strongest.name}</strong> - consider mentoring others
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#FFD700] mt-0.5">•</span>
                      Your hard skills average ({stats.hardAvg}) is {stats.hardAvg > stats.softAvg ? 'higher' : 'lower'} than soft skills ({stats.softAvg})
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
