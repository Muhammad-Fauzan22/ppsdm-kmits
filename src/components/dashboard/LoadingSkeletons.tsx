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
