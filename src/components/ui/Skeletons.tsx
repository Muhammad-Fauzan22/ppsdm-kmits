import { cn } from "@/lib/utils";

/**
 * Base Skeleton component
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-200 dark:bg-slate-800", className)}
    />
  );
}

/**
 * Skeleton for Sunburst visualization
 */
export function SunburstSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6", className)}>
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48 bg-slate-700" />
          <Skeleton className="h-4 w-64 bg-slate-700" />
        </div>
      </div>
      <div className="h-[450px] w-[450px] flex items-center justify-center">
        <Skeleton className="h-[400px] w-[400px] rounded-full bg-slate-800" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-24 w-full rounded-xl bg-slate-800" />
        <div className="space-y-3">
          <Skeleton className="h-16 w-full rounded-lg bg-slate-800" />
          <Skeleton className="h-16 w-full rounded-lg bg-slate-800" />
          <Skeleton className="h-16 w-full rounded-lg bg-slate-800" />
          <Skeleton className="h-16 w-full rounded-lg bg-slate-800" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for Radar Chart visualization
 */
export function RadarChartSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6", className)}>
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48 bg-slate-700" />
          <Skeleton className="h-4 w-64 bg-slate-700" />
        </div>
      </div>
      <div className="flex items-center justify-center h-[500px]">
        <Skeleton className="h-[450px] w-[450px] rounded-full bg-slate-800" />
      </div>
    </div>
  );
}

/**
 * Skeleton for Cognitive Sunburst visualization
 * Matches the structure of CognitiveSunburst component
 */
export function CognitiveSunburstSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <Skeleton className="h-6 w-64 bg-slate-700" />
          <Skeleton className="h-4 w-80 bg-slate-700" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-lg bg-slate-700" />
          <Skeleton className="h-8 w-12 rounded-lg bg-slate-700" />
          <Skeleton className="h-8 w-8 rounded-lg bg-slate-700" />
          <Skeleton className="h-8 w-8 rounded-lg bg-slate-700" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sunburst Visualization */}
        <div className="lg:col-span-2 h-[450px] flex items-center justify-center">
          <Skeleton className="h-[400px] w-[400px] rounded-full bg-slate-800" />
        </div>

        {/* Side Panel - Details */}
        <div className="space-y-4">
          {/* Overall Score */}
          <Skeleton className="h-24 w-full rounded-xl bg-slate-800" />

          {/* Sub-dimensions */}
          <div className="space-y-3">
            <Skeleton className="h-5 w-32 bg-slate-700" />
            <div className="space-y-3">
              <Skeleton className="h-16 w-full rounded-lg bg-slate-800" />
              <Skeleton className="h-16 w-full rounded-lg bg-slate-800" />
              <Skeleton className="h-16 w-full rounded-lg bg-slate-800" />
              <Skeleton className="h-16 w-full rounded-lg bg-slate-800" />
            </div>
          </div>

          {/* Selected Node Details */}
          <Skeleton className="h-20 w-full rounded-lg bg-slate-800" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for Holistic Radar Chart visualization
 * Matches the structure of HolisticRadarChart component
 */
export function HolisticRadarChartSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <Skeleton className="h-6 w-64 bg-slate-700" />
          <Skeleton className="h-4 w-80 bg-slate-700" />
        </div>

        {/* PDI Display */}
        <div className="flex items-center gap-4">
          <div className="text-center">
            <Skeleton className="h-4 w-32 bg-slate-700 mb-1" />
            <Skeleton className="h-16 w-16 rounded-full bg-slate-800" />
          </div>

          <div className="text-center">
            <Skeleton className="h-4 w-24 bg-slate-700 mb-1" />
            <Skeleton className="h-8 w-16 rounded-lg bg-slate-800" />
          </div>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Radar Chart */}
        <div className="lg:col-span-3">
          <div className="h-[500px] flex items-center justify-center">
            <Skeleton className="h-[450px] w-[450px] rounded-full bg-slate-800" />
          </div>
        </div>

        {/* Side Panel - Quadrant Analysis */}
        <div className="space-y-4">
          <Skeleton className="h-5 w-32 bg-slate-700" />

          {/* Cognitive Quadrant */}
          <Skeleton className="h-20 w-full rounded-lg bg-slate-800" />

          {/* Affective Quadrant */}
          <Skeleton className="h-20 w-full rounded-lg bg-slate-800" />

          {/* Social Quadrant */}
          <Skeleton className="h-20 w-full rounded-lg bg-slate-800" />

          {/* Legend */}
          <div className="pt-4 border-t border-slate-700">
            <Skeleton className="h-5 w-24 bg-slate-700 mb-2" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full bg-slate-800" />
              <Skeleton className="h-4 w-full bg-slate-800" />
              <Skeleton className="h-4 w-full bg-slate-800" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-700">
        <div className="text-center">
          <Skeleton className="h-10 w-16 mx-auto bg-slate-800 mb-2" />
          <Skeleton className="h-4 w-24 mx-auto bg-slate-700" />
        </div>
        <div className="text-center border-x border-slate-700">
          <Skeleton className="h-10 w-16 mx-auto bg-slate-800 mb-2" />
          <Skeleton className="h-4 w-28 mx-auto bg-slate-700" />
        </div>
        <div className="text-center">
          <Skeleton className="h-10 w-16 mx-auto bg-slate-800 mb-2" />
          <Skeleton className="h-4 w-28 mx-auto bg-slate-700" />
        </div>
      </div>
    </div>
  );
}


