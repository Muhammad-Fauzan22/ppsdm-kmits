/**
 * Lazy-loaded components configuration
 * 
 * This file exports dynamically imported components for code splitting.
 * Heavy components (charts, visualizations, PDF viewers) are lazy-loaded
 * to reduce initial bundle size.
 */

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

// Loading fallback component
const ChartSkeleton = () => (
  <div className="w-full h-[400px] flex items-center justify-center">
    <Skeleton className="w-full h-full" />
  </div>
);

// Heavy visualization components
export const LazySunburst = dynamic(
  () => import('@/components/visualizations/Sunburst'),
  {
    loading: ChartSkeleton,
    ssr: false,
  }
);

export const LazyCognitiveSunburst = dynamic(
  () => import('@/components/assessment/CognitiveSunburst'),
  {
    loading: ChartSkeleton,
    ssr: false,
  }
);

export const LazyHolisticRadarChart = dynamic(
  () => import('@/components/visualizations/HolisticRadarChart'),
  {
    loading: ChartSkeleton,
    ssr: false,
  }
);

// PDF components
export const LazyPDFViewer = dynamic(
  () => import('@/components/pdf/TranscriptDocument').then(mod => mod.TranscriptDocument),
  {
    loading: () => <Skeleton className="w-full h-[600px]" />,
    ssr: false,
  }
);

// 3D components (if any)
export const LazyStewardshipCanvas = dynamic(
  () => import('@/components/stewardship/StewardshipCanvas'),
  {
    loading: ChartSkeleton,
    ssr: false,
  }
);

// Assessment components
export const LazyAssessmentEngine = dynamic(
  () => import('@/components/assessment/AssessmentEngine'),
  {
    loading: () => (
      <div className="p-8">
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    ),
    ssr: false,
  }
);

// Report components
export const LazyReportGenerator = dynamic(
  () => import('./reports/ReportGenerator').then((mod) => mod.ReportGenerator),
  {
    loading: () => <Skeleton className="w-full h-[400px] rounded-xl" />,
    ssr: false,
  }
);

// Heavy UI components
export const LazyRichTextEditor = dynamic(
  () => import('@/components/ui/RichTextEditor'),
  {
    loading: () => <Skeleton className="w-full h-[300px]" />,
    ssr: false,
  }
);

export const LazyDataTable = dynamic(
  () => import('@/components/ui/data-table'),
  {
    loading: () => <Skeleton className="w-full h-[400px]" />,
    ssr: false,
  }
);

// Chart components
export const LazyRechartsComponents = {
  RadarChart: dynamic(
    () => import('recharts').then(mod => ({ default: mod.RadarChart })),
    { ssr: false }
  ),
  LineChart: dynamic(
    () => import('recharts').then(mod => ({ default: mod.LineChart })),
    { ssr: false }
  ),
  BarChart: dynamic(
    () => import('recharts').then(mod => ({ default: mod.BarChart })),
    { ssr: false }
  ),
  PieChart: dynamic(
    () => import('recharts').then(mod => ({ default: mod.PieChart })),
    { ssr: false }
  ),
};

// Export default for easy importing
export default {
  LazySunburst,
  LazyCognitiveSunburst,
  LazyHolisticRadarChart,
  LazyPDFViewer,
  LazyAssessmentEngine,
  LazyReportGenerator,
  LazyStewardshipCanvas,
};
