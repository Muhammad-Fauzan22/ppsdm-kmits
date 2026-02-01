'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useDashboard, useDimensionStats } from '@/lib/hooks';
import { DashboardPageSkeleton, StatCardSkeleton, ActivityItemSkeleton } from '@/components/dashboard/LoadingSkeletons';
import { ErrorDisplay, EmptyStateDisplay } from '@/components/dashboard/ErrorDisplay';
import { Flag, CheckCircle, Zap, Flame, Lightbulb, Target } from 'lucide-react';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Stat Card Component
function StatCard({ 
  label, 
  value, 
  icon: Icon,
  trend,
  color = 'blue' 
}: { 
  label: string; 
  value: string | number; 
  icon: React.ElementType;
  trend?: string;
  color?: 'blue' | 'green' | 'gold' | 'purple';
}) {
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    green: 'bg-green-500/10 text-green-400 border-green-500/20',
    gold: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };

  return (
    <motion.div
      variants={itemVariants}
      className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/[0.08] rounded-xl p-5 hover:border-white/[0.12] transition-colors"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {trend && (
            <p className="text-green-400 text-xs mt-1">{trend}</p>
          )}
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
}

// Quick Action Card Component
function QuickActionCard({ 
  href,
  icon: Icon,
  label,
  description,
  color = 'primary'
}: { 
  href: string;
  icon: React.ElementType;
  label: string;
  description: string;
  color?: 'primary' | 'gold' | 'purple';
}) {
  const colorClasses = {
    primary: 'border-l-[#003366] bg-[#003366]/10 text-[#003366] hover:bg-[#003366] hover:text-white',
    gold: 'border-l-[#FFD700] bg-yellow-500/10 text-yellow-400 hover:bg-[#FFD700] hover:text-black',
    purple: 'border-l-purple-500 bg-purple-500/10 text-purple-400 hover:bg-purple-500 hover:text-white',
  };

  return (
    <Link
      href={href}
      className={`flex items-center gap-4 p-4 rounded-xl border-l-4 bg-[#1e293b]/40 backdrop-blur-sm hover:bg-white/5 transition-all group ${colorClasses[color]}`}
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${colorClasses[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h4 className="text-white font-medium">{label}</h4>
        <p className="text-xs text-slate-400">{description}</p>
      </div>
    </Link>
  );
}

// Activity Item Component
function ActivityItem({ activity }: { activity: { id: string; type: string; title: string; description?: string; created_at: string; xp_earned?: number } }) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'goal_completed':
      case 'milestone_reached':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'assessment_completed':
        return <Target className="w-5 h-5 text-blue-400" />;
      case 'achievement_unlocked':
        return <Zap className="w-5 h-5 text-yellow-400" />;
      case 'level_up':
        return <Zap className="w-5 h-5 text-purple-400" />;
      default:
        return <Flag className="w-5 h-5 text-blue-400" />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case 'goal_completed':
      case 'milestone_reached':
        return 'bg-green-500/10';
      case 'assessment_completed':
        return 'bg-blue-500/10';
      case 'achievement_unlocked':
        return 'bg-yellow-500/10';
      case 'level_up':
        return 'bg-purple-500/10';
      default:
        return 'bg-blue-500/10';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 30) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <motion.div
      variants={itemVariants}
      className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/[0.08] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/[0.12] transition-colors"
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getIconBg(activity.type)}`}>
          {getIcon(activity.type)}
        </div>
        <div>
          <h4 className="text-white font-medium text-sm">{activity.title}</h4>
          <p className="text-slate-400 text-xs">{activity.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 pl-14 sm:pl-0">
        {activity.xp_earned && activity.xp_earned > 0 && (
          <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-green-500/10 text-green-400">
            +{activity.xp_earned} XP
          </span>
        )}
        <span className="text-xs text-slate-500">{formatTimeAgo(activity.created_at)}</span>
      </div>
    </motion.div>
  );
}

// Welcome Section Component
function WelcomeSection({ user, dimensionScores, isLoading }: { 
  user: { full_name?: string; level: number } | undefined; 
  dimensionScores: { cognitive: number; emotional: number; spiritual: number; physical: number; creative: number; professional: number; leadership: number; financial: number; environmental: number; overall_index?: number } | null;
  isLoading: boolean;
}) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const userName = user?.full_name?.split(' ')[0] || 'Student';
  const stats = useDimensionStats(dimensionScores).stats;

  if (isLoading) {
    return (
      <div className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/[0.08] rounded-xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-700 rounded w-64" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 bg-slate-700/50 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/[0.08] rounded-xl p-6 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#003366]/20 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
              {getGreeting()}, {userName}! 👋
            </h1>
            <p className="text-slate-400 text-sm">
              Here's your development overview for today. Keep pushing forward!
            </p>
          </div>
          <div className="bg-[#003366]/40 border border-[#003366] px-4 py-2 rounded-lg backdrop-blur-sm">
            <p className="text-xs text-slate-300 uppercase tracking-wider font-semibold mb-0.5">Overall Index</p>
            <p className="text-3xl font-bold text-[#FFD700] tracking-tight">
              {stats?.avgScore || dimensionScores?.overall_index || 0}
            </p>
          </div>
        </div>

        {/* Mini stats row */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/[0.08]">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Strongest Area</p>
              <p className="text-white font-medium text-sm mt-1">{stats.strongest.name}</p>
              <p className="text-green-400 text-xs">{stats.strongest.score}/100</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Focus Area</p>
              <p className="text-white font-medium text-sm mt-1">{stats.weakest.name}</p>
              <p className="text-[#FFD700] text-xs">{stats.weakest.score}/100</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Hard Skills</p>
              <p className="text-white font-medium text-sm mt-1">{stats.hardAvg}/100</p>
              <p className="text-slate-400 text-xs">{stats.hardCount} dimensions</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Soft Skills</p>
              <p className="text-white font-medium text-sm mt-1">{stats.softAvg}/100</p>
              <p className="text-slate-400 text-xs">{stats.softCount} dimensions</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Main Dashboard Page
export default function DashboardPage() {
  const { data, isLoading, error, errorMessage, refetch } = useDashboard();

  // Show loading skeleton
  if (isLoading) {
    return <DashboardPageSkeleton />;
  }

  // Show error display
  if (error) {
    return (
      <div className="p-4">
        <ErrorDisplay
          title="Failed to load dashboard"
          message={errorMessage}
          onRetry={refetch}
          variant="fullscreen"
        />
      </div>
    );
  }

  // Show empty state if no data
  if (!data) {
    return (
      <div className="p-4">
        <EmptyStateDisplay
          title="No Dashboard Data"
          description="We couldn't load your dashboard information. Please try refreshing the page."
          action={{ label: 'Refresh', onClick: refetch }}
        />
      </div>
    );
  }

  const { user, stats, dimensionScores, recentActivities, activeGoals } = data;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Welcome Section */}
      <WelcomeSection 
        user={user} 
        dimensionScores={dimensionScores} 
        isLoading={isLoading}
      />

      {/* Quick Stats Grid */}
      <section>
        <motion.h2 variants={itemVariants} className="text-lg font-bold text-white mb-4">
          Quick Stats
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard 
            label="Active Goals"
            value={stats?.activeGoalsCount || 0}
            icon={Flag}
            trend={`${stats?.completedGoals || 0} completed`}
            color="blue"
          />
          <StatCard 
            label="Assessments"
            value={stats?.totalAssessments || 0}
            icon={CheckCircle}
            trend="View all"
            color="green"
          />
          <StatCard 
            label="Current Level"
            value={`Level ${stats?.level || 1}`}
            icon={Zap}
            trend={`${stats?.xpProgress || 0}% to next`}
            color="gold"
          />
          <StatCard 
            label="Day Streak"
            value={`${stats?.currentStreak || 0} days`}
            icon={Flame}
            trend="Keep it up!"
            color="purple"
          />
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <motion.h2 variants={itemVariants} className="text-lg font-bold text-white mb-4">
          Quick Actions
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickActionCard
            href="/dimensions"
            icon={Target}
            label="Take Assessment"
            description="Measure your dimensions"
            color="primary"
          />
          <QuickActionCard
            href="/goals"
            icon={Flag}
            label="Set New Goal"
            description="Create a new milestone"
            color="gold"
          />
          <QuickActionCard
            href="/resources"
            icon={Zap}
            label="Explore Resources"
            description="Discover learning materials"
            color="purple"
          />
        </div>
      </section>

      {/* Recent Activity */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <motion.h2 variants={itemVariants} className="text-lg font-bold text-white">
            Recent Activity
          </motion.h2>
          <Link 
            href="/progress" 
            className="text-[#1A4D80] hover:text-white transition-colors text-sm flex items-center gap-1"
          >
            View All
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
        {recentActivities && recentActivities.length > 0 ? (
          <div className="space-y-3">
            {recentActivities.slice(0, 5).map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        ) : (
          <EmptyStateDisplay
            title="No Recent Activity"
            description="Your recent activities will appear here. Start by completing an assessment or creating a goal!"
          />
        )}
      </section>

      {/* Insight Card */}
      <motion.section variants={itemVariants}>
        <div className="bg-gradient-to-r from-[#003366]/30 to-transparent border border-[#003366]/30 rounded-xl p-5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#FFD700]/20 flex items-center justify-center shrink-0">
              <Lightbulb className="w-5 h-5 text-[#FFD700]" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Daily Insight</h3>
              <p className="text-slate-300 text-sm">
                {dimensionScores && useDimensionStats(dimensionScores).stats ? (
                  <>
                    Your {useDimensionStats(dimensionScores).stats?.strongest.name.toLowerCase()} dimension is growing steadily. 
                    Consider focusing on {useDimensionStats(dimensionScores).stats?.weakest.name.toLowerCase()} to maintain balance. 
                    You're only {Math.max(0, 100 - (stats?.xpProgress || 0))}% away from Level {(stats?.level || 1) + 1}!
                  </>
                ) : (
                  'Complete your first assessment to get personalized insights and recommendations.'
                )}
              </p>
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
