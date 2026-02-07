'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Fingerprint, 
  Brain, 
  Users, 
  Globe, 
  Wallet,
  Sparkles,
  Dumbbell,
  Clock,
  Flower2
} from 'lucide-react';


interface DimensionCard {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  progress: number;
  trend: number;
  trendDirection: 'up' | 'down' | 'neutral';
}

const dimensions: DimensionCard[] = [
  {
    id: 'character',
    number: '01',
    title: 'Character',
    description: 'Ethics, integrity, and personal values alignment.',
    icon: <Fingerprint className="w-8 h-8" />,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    progress: 78,
    trend: 2.4,
    trendDirection: 'up'
  },
  {
    id: 'cognitive',
    number: '02',
    title: 'Cognitive',
    description: 'Critical thinking, learning agility, and knowledge.',
    icon: <Brain className="w-8 h-8" />,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    progress: 92,
    trend: 5.1,
    trendDirection: 'up'
  },
  {
    id: 'emotional-social',
    number: '03',
    title: 'Emotional-Social',
    description: 'Empathy, relationships, and emotional intelligence.',
    icon: <Users className="w-8 h-8" />,
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/30',
    progress: 64,
    trend: 0,
    trendDirection: 'neutral'
  },
  {
    id: 'environmental',
    number: '04',
    title: 'Environmental',
    description: 'Awareness of surroundings and ecological impact.',
    icon: <Globe className="w-8 h-8" />,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    progress: 45,
    trend: 1.2,
    trendDirection: 'up'
  },
  {
    id: 'financial',
    number: '05',
    title: 'Financial',
    description: 'Resource management and economic stability.',
    icon: <Wallet className="w-8 h-8" />,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
    progress: 88,
    trend: -2.3,
    trendDirection: 'down'
  },
  {
    id: 'mental-health',
    number: '06',
    title: 'Mental Health',
    description: 'Psychological well-being and stress management.',
    icon: <Sparkles className="w-8 h-8" />,
    color: 'text-teal-500',
    bgColor: 'bg-teal-500/10',
    borderColor: 'border-teal-500/30',
    progress: 55,
    trend: 8.4,
    trendDirection: 'up'
  },
  {
    id: 'physical',
    number: '07',
    title: 'Physical',
    description: 'Bodily health, nutrition, and energy levels.',
    icon: <Dumbbell className="w-8 h-8" />,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    progress: 72,
    trend: 3.0,
    trendDirection: 'up'
  },
  {
    id: 'self-management',
    number: '08',
    title: 'Self-Management',
    description: 'Organization, productivity, and goal setting.',
    icon: <Clock className="w-8 h-8" />,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/30',
    progress: 67,
    trend: 0,
    trendDirection: 'neutral'
  },
  {
    id: 'spiritual',
    number: '09',
    title: 'Spiritual',
    description: 'Purpose, inner peace, and connection.',
    icon: <Flower2 className="w-8 h-8" />,
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    progress: 95,
    trend: 12,
    trendDirection: 'up'
  }

];

const TrendIndicator = ({ trend, direction }: { trend: number; direction: 'up' | 'down' | 'neutral' }) => {
  if (direction === 'neutral') {
    return (
      <div className="flex items-center gap-1 text-yellow-400 text-xs font-mono bg-yellow-400/10 px-2 py-1 rounded">
        <span className="text-xs">−</span> 0.0%
      </div>
    );
  }
  
  const isPositive = direction === 'up';
  return (
    <div className={`flex items-center gap-1 text-xs font-mono px-2 py-1 rounded ${
      isPositive ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'
    }`}>
      <span className="text-xs">{isPositive ? '↑' : '↓'}</span>
      {isPositive ? '+' : ''}{trend}%
    </div>
  );
};

export default function DimensionsHubPage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 font-sans">
      {/* Background Effects */}
      <div className="fixed top-20 left-0 w-64 h-64 bg-primary rounded-full blur-[120px] opacity-10 pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[150px] opacity-10 pointer-events-none z-0" />

      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass-panel border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-primary/20 p-2 rounded-lg">
              <span className="material-icons-round text-primary text-2xl">hub</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 font-display">PPSDM KMITS</span>
              <h1 className="text-xl font-bold font-display tracking-tight text-slate-900 dark:text-white">MYDIMENSION</h1>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-1 text-sm font-medium">
            <Link href="/dashboard" className="px-4 py-2 text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
              Home
            </Link>
            <span className="text-slate-600 dark:text-slate-600">/</span>
            <Link href="/dashboard" className="px-4 py-2 text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
              Dashboard
            </Link>
            <span className="text-slate-600 dark:text-slate-600">/</span>
            <span className="px-4 py-2 text-primary font-semibold bg-primary/10 rounded-full">Dimensions</span>
          </nav>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-slate-200 dark:bg-slate-800 rounded-full border border-slate-300 dark:border-slate-700 hover:border-primary transition-colors">
              <span className="material-icons-round text-sm">tune</span>
              Quantum Filter
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-blue-600 p-0.5 shadow-neon">
              <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-white text-sm font-bold">
                MF
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        {/* Page Header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-slate-900 dark:text-white mb-2">
              Development Hub
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl">
              Explore and cultivate your 9 dimensions of growth. Track your progress across cognitive, emotional, and environmental pillars.
            </p>
          </div>
          <div className="hidden lg:flex items-center space-x-2 text-xs font-mono text-primary bg-primary/5 px-4 py-2 rounded-lg border border-primary/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span>SYSTEM ONLINE: v2.4.0</span>
          </div>
        </div>

        {/* Dimensions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dimensions.map((dimension) => (
            <Link 
              key={dimension.id}
              href={`/dashboard/dimensions/${dimension.id}`}
              className="group relative bg-white dark:bg-surface-dark rounded-2xl p-6 border border-gray-200 dark:border-white/10 hover-glow transition-all duration-300 overflow-hidden block"
            >
              {/* Background Number */}
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="font-display text-6xl font-bold text-slate-900 dark:text-white">
                  {dimension.number}
                </span>
              </div>

              {/* Icon & Trend */}
              <div className="flex justify-between items-start mb-6 relative z-10">
              <div className={`w-14 h-14 rounded-xl ${dimension.bgColor} flex items-center justify-center border ${dimension.borderColor} group-hover:${dimension.color.replace('text-', 'border-')} transition-colors`}>
                  <span className={dimension.color}>{dimension.icon}</span>
                </div>

                <TrendIndicator trend={dimension.trend} direction={dimension.trendDirection} />
              </div>

              {/* Title & Description */}
              <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">
                {dimension.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                {dimension.description}
              </p>

              {/* Progress */}
              <div className="flex items-center justify-between mt-auto">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400 uppercase tracking-wider mb-1">Mastery</span>
                  <div className="flex items-end gap-1">
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">
                      {dimension.progress}%
                    </span>
                  </div>
                  <div className="w-24 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">
                    <div 
                      className={`h-full ${dimension.color.replace('text-', 'bg-')} rounded-full transition-all duration-500`} 
                      style={{ width: `${dimension.progress}%` }}
                    />
                  </div>
                </div>
            <button className="w-10 h-10 rounded-full border border-gray-300 dark:border-white/20 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all group-hover:rotate-45">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>

              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 dark:text-slate-600 font-mono border-t border-gray-200 dark:border-white/10 pt-8">
          <div className="flex gap-4 mb-4 md:mb-0">
            <span>INDEX OF /DASHBOARD/DIMENSIONS</span>
            <span>STATUS: STABLE</span>
            <span>LATENCY: 12ms</span>
          </div>
          <div>
            © 2024 PPSDM KMITS. All Systems Operational.
          </div>
        </div>
      </main>
    </div>
  );
}
