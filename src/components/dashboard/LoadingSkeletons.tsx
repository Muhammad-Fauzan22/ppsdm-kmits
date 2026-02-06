/**
 * Loading Skeletons
 * 
 * Reusable loading skeleton components for dashboard pages
 */

'use client';

import { motion } from 'framer-motion';

// Animation variants for skeletons
const skeletonVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3 }
  },
};

const pulseAnimation = {
  animate: {
    opacity: [0.4, 0.8, 0.4],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

/**
 * Stat Card Skeleton
 */
export function StatCardSkeleton() {
  return (
    <motion.div
      variants={skeletonVariants}
      initial="hidden"
      animate="visible"
      className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/[0.08] rounded-xl p-5"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <motion.div 
            {...pulseAnimation}
            className="h-3 w-20 bg-slate-700 rounded mb-2" 
          />
          <motion.div 
            {...pulseAnimation}
            className="h-8 w-16 bg-slate-600 rounded" 
          />
        </div>
        <motion.div 
          {...pulseAnimation}
          className="w-10 h-10 rounded-lg bg-slate-700" 
        />
      </div>
    </motion.div>
  );
}

/**
 * Stat Cards Grid Skeleton
 */
export function StatCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Welcome Section Skeleton
 */
export function WelcomeSectionSkeleton() {
  return (
    <motion.div
      variants={skeletonVariants}
      initial="hidden"
      animate="visible"
      className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/[0.08] rounded-xl p-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1">
          <motion.div 
            {...pulseAnimation}
            className="h-8 w-64 bg-slate-600 rounded mb-2" 
          />
          <motion.div 
            {...pulseAnimation}
            className="h-4 w-48 bg-slate-700 rounded" 
          />
        </div>
        <motion.div 
          {...pulseAnimation}
          className="h-16 w-32 bg-slate-700 rounded-lg" 
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/[0.08]">
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div 
            key={i}
            {...pulseAnimation}
            className="h-12 bg-slate-700/50 rounded" 
          />
        ))}
      </div>
    </motion.div>
  );
}

/**
 * Activity Item Skeleton
 */
export function ActivityItemSkeleton() {
  return (
    <motion.div
      variants={skeletonVariants}
      initial="hidden"
      animate="visible"
      className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/[0.08] rounded-xl p-4 flex items-center gap-4"
    >
      <motion.div 
        {...pulseAnimation}
        className="w-10 h-10 rounded-full bg-slate-700 shrink-0" 
      />
      <div className="flex-1 min-w-0">
        <motion.div 
          {...pulseAnimation}
          className="h-4 w-32 bg-slate-600 rounded mb-1" 
        />
        <motion.div 
          {...pulseAnimation}
          className="h-3 w-48 bg-slate-700 rounded" 
        />
      </div>
      <motion.div 
        {...pulseAnimation}
        className="h-6 w-16 bg-slate-700 rounded-full" 
      />
    </motion.div>
  );
}

/**
 * Activity List Skeleton
 */
export function ActivityListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <ActivityItemSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Goal Card Skeleton
 */
export function GoalCardSkeleton() {
  return (
    <motion.div
      variants={skeletonVariants}
      initial="hidden"
      animate="visible"
      className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/[0.08] rounded-xl p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <motion.div 
              {...pulseAnimation}
              className="h-5 w-32 bg-slate-600 rounded" 
            />
            <motion.div 
              {...pulseAnimation}
              className="h-5 w-16 bg-slate-700 rounded-full" 
            />
          </div>
          <motion.div 
            {...pulseAnimation}
            className="h-3 w-full max-w-xs bg-slate-700 rounded mb-4" 
          />
          <motion.div 
            {...pulseAnimation}
            className="h-2 bg-slate-700 rounded-full w-full mb-2" 
          />
          <div className="flex items-center gap-4">
            <motion.div 
              {...pulseAnimation}
              className="h-3 w-20 bg-slate-700 rounded" 
            />
            <motion.div 
              {...pulseAnimation}
              className="h-3 w-24 bg-slate-700 rounded" 
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Goals List Skeleton
 */
export function GoalsListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <GoalCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Dimension Card Skeleton
 */
export function DimensionCardSkeleton() {
  return (
    <motion.div
      variants={skeletonVariants}
      initial="hidden"
      animate="visible"
      className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/[0.08] rounded-xl p-5"
    >
      <div className="flex items-center gap-3 mb-3">
        <motion.div 
          {...pulseAnimation}
          className="w-12 h-12 rounded-xl bg-slate-700" 
        />
        <div className="flex-1">
          <motion.div 
            {...pulseAnimation}
            className="h-5 w-24 bg-slate-600 rounded mb-1" 
          />
          <motion.div 
            {...pulseAnimation}
            className="h-3 w-16 bg-slate-700 rounded" 
          />
        </div>
      </div>
      <motion.div 
        {...pulseAnimation}
        className="h-8 w-16 bg-slate-600 rounded mb-2" 
      />
      <motion.div 
        {...pulseAnimation}
        className="h-2 bg-slate-700 rounded-full w-full" 
      />
    </motion.div>
  );
}

/**
 * Dimension Grid Skeleton
 */
export function DimensionGridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <DimensionCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Chart Skeleton
 */
export function ChartSkeleton() {
  return (
    <motion.div
      variants={skeletonVariants}
      initial="hidden"
      animate="visible"
      className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/[0.08] rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <motion.div 
          {...pulseAnimation}
          className="h-6 w-32 bg-slate-600 rounded" 
        />
        <motion.div 
          {...pulseAnimation}
          className="h-8 w-32 bg-slate-700 rounded" 
        />
      </div>
      <motion.div 
        {...pulseAnimation}
        className="h-64 bg-slate-700/30 rounded-lg" 
      />
    </motion.div>
  );
}

/**
 * Quick Action Card Skeleton
 */
export function QuickActionSkeleton() {
  return (
    <motion.div
      variants={skeletonVariants}
      initial="hidden"
      animate="visible"
      className="flex items-center gap-4 p-4 rounded-xl bg-[#1e293b]/40 border border-white/[0.08]"
    >
      <motion.div 
        {...pulseAnimation}
        className="w-10 h-10 rounded-lg bg-slate-700" 
      />
      <div className="flex-1">
        <motion.div 
          {...pulseAnimation}
          className="h-4 w-24 bg-slate-600 rounded mb-1" 
        />
        <motion.div 
          {...pulseAnimation}
          className="h-3 w-32 bg-slate-700 rounded" 
        />
      </div>
    </motion.div>
  );
}

/**
 * Quick Actions Skeleton
 */
export function QuickActionsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <QuickActionSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Dashboard Page Skeleton (Full page)
 */
export function DashboardPageSkeleton() {
  return (
    <div className="space-y-8">
      <WelcomeSectionSkeleton />
      
      <section>
        <motion.div 
          {...pulseAnimation}
          className="h-6 w-32 bg-slate-600 rounded mb-4" 
        />
        <StatCardsSkeleton count={4} />
      </section>
      
      <section>
        <motion.div 
          {...pulseAnimation}
          className="h-6 w-32 bg-slate-600 rounded mb-4" 
        />
        <QuickActionsSkeleton count={3} />
      </section>
      
      <section>
        <div className="flex items-center justify-between mb-4">
          <motion.div 
            {...pulseAnimation}
            className="h-6 w-40 bg-slate-600 rounded" 
          />
          <motion.div 
            {...pulseAnimation}
            className="h-4 w-16 bg-slate-700 rounded" 
          />
        </div>
        <ActivityListSkeleton count={5} />
      </section>
    </div>
  );
}

/**
 * Dimensions Page Skeleton
 */
export function DimensionsPageSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.div 
          {...pulseAnimation}
          className="h-8 w-48 bg-slate-600 rounded" 
        />
        <motion.div 
          {...pulseAnimation}
          className="h-10 w-32 bg-slate-700 rounded" 
        />
      </div>

      {/* Radar Chart */}
      <div className="flex justify-center">
        <motion.div 
          {...pulseAnimation}
          className="w-80 h-80 rounded-full bg-slate-700/30" 
        />
      </div>

      {/* Dimension Grid */}
      <section>
        <motion.div 
          {...pulseAnimation}
          className="h-6 w-48 bg-slate-600 rounded mb-4" 
        />
        <DimensionGridSkeleton count={9} />
      </section>
    </div>
  );
}

/**
 * Goals Page Skeleton
 */
export function GoalsPageSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.div 
          {...pulseAnimation}
          className="h-8 w-32 bg-slate-600 rounded" 
        />
        <motion.div 
          {...pulseAnimation}
          className="h-10 w-32 bg-slate-700 rounded" 
        />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div 
            key={i}
            {...pulseAnimation}
            className="h-24 bg-slate-700/50 rounded-xl" 
          />
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div 
            key={i}
            {...pulseAnimation}
            className="h-8 w-20 bg-slate-700 rounded-full" 
          />
        ))}
      </div>

      {/* Goals List */}
      <GoalsListSkeleton count={5} />
    </div>
  );
}

/**
 * Progress Page Skeleton
 */
export function ProgressPageSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.div 
          {...pulseAnimation}
          className="h-8 w-40 bg-slate-600 rounded" 
        />
        <motion.div 
          {...pulseAnimation}
          className="h-10 w-40 bg-slate-700 rounded" 
        />
      </div>

      {/* Stats Cards */}
      <StatCardsSkeleton count={4} />

      {/* Chart */}
      <ChartSkeleton />

      {/* Milestones */}
      <section>
        <motion.div 
          {...pulseAnimation}
          className="h-6 w-40 bg-slate-600 rounded mb-4" 
        />
        <ActivityListSkeleton count={4} />
      </section>
    </div>
  );
}
