/**
 * Dynamic Import Utilities for Performance Optimization
 * 
 * Provides lazy loading and code splitting utilities for heavy components
 */

import { createLazyComponent } from '@/components/performance/LazyLoad';

// Lazy load visualization components
export const LazySunburst = createLazyComponent(
  () => import('@/components/visualizations/Sunburst'),
  <div className="w-full h-full bg-slate-900 animate-pulse flex items-center justify-center">
    <div className="text-slate-400">Loading visualization...</div>
  </div>
);

export const LazyHolisticRadarChart = createLazyComponent(
  () => import('@/components/visualizations/HolisticRadarChart'),
  <div className="w-full h-full bg-slate-900 animate-pulse flex items-center justify-center">
    <div className="text-slate-400">Loading radar chart...</div>
  </div>
);

// Lazy load hero video components
export const LazyHeroVideoSection = createLazyComponent(
  () => import('@/components/landing/HeroVideoSection'),
  <div className="w-full h-screen bg-slate-900 animate-pulse flex items-center justify-center">
    <div className="text-slate-400">Loading hero section...</div>
  </div>
);

// Lazy load heavy dashboard components
export const LazyDashboardClient = createLazyComponent(
  () => import('@/app/dashboard/DashboardClient'),
  <div className="w-full h-full bg-slate-900 animate-pulse flex items-center justify-center">
    <div className="text-slate-400">Loading dashboard...</div>
  </div>
);

// Lazy load assessment components
export const LazyCognitiveAssessment = createLazyComponent(
  () => import('@/components/assessment/CognitiveAssessment'),
  <div className="w-full h-full bg-slate-900 animate-pulse flex items-center justify-center">
    <div className="text-slate-400">Loading assessment...</div>
  </div>
);

export const LazyEmotionalAssessment = createLazyComponent(
  () => import('@/components/assessment/EmotionalAssessment'),
  <div className="w-full h-full bg-slate-900 animate-pulse flex items-center justify-center">
    <div className="text-slate-400">Loading assessment...</div>
  </div>
);

export const LazyPhysicalAssessment = createLazyComponent(
  () => import('@/components/assessment/PhysicalAssessment'),
  <div className="w-full h-full bg-slate-900 animate-pulse flex items-center justify-center">
    <div className="text-slate-400">Loading assessment...</div>
  </div>
);

// Lazy load chart components
export const LazyCognitiveSunburst = createLazyComponent(
  () => import('@/components/assessment/CognitiveSunburst'),
  <div className="w-full h-full bg-slate-900 animate-pulse flex items-center justify-center">
    <div className="text-slate-400">Loading sunburst...</div>
  </div>
);

export const LazyEmotionalRadar = createLazyComponent(
  () => import('@/components/assessment/EmotionalRadar'),
  <div className="w-full h-full bg-slate-900 animate-pulse flex items-center justify-center">
    <div className="text-slate-400">Loading radar...</div>
  </div>
);

export const LazyFinancialWaterfall = createLazyComponent(
  () => import('@/components/assessment/FinancialWaterfall'),
  <div className="w-full h-full bg-slate-900 animate-pulse flex items-center justify-center">
    <div className="text-slate-400">Loading waterfall...</div>
  </div>
);

// Lazy load psychometric radar - use direct import without .then()
export const LazyPsychometricRadar = createLazyComponent(
  () => import('@/components/PsychometricRadar'),
  <div className="w-full h-full bg-slate-900 animate-pulse flex items-center justify-center">
    <div className="text-slate-400">Loading radar chart...</div>
  </div>
);
