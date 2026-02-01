'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  dashboardStats, 
  recentActivities, 
  quickActions,
  dimensions,
  getDimensionStats 
} from '@/lib/navigation';

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
  icon, 
  trend,
  color = 'blue' 
}: { 
  label: string; 
  value: string | number; 
  icon: string;
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
          <span className="material-symbols-outlined">{icon}</span>
        </div>
      </div>
    </motion.div>
  );
}

// Quick Action Card Component
function QuickActionCard({ 
  action 
}: { 
  action: typeof quickActions[0] 
}) {
  const colorClasses = {
    primary: 'border-l-[#003366] bg-[#003366]/10 text-[#003366] hover:bg-[#003366] hover:text-white',
    gold: 'border-l-[#FFD700] bg-yellow-500/10 text-yellow-400 hover:bg-[#FFD700] hover:text-black',
    purple: 'border-l-purple-500 bg-purple-500/10 text-purple-400 hover:bg-purple-500 hover:text-white',
  };

  return (
    <Link
      href={action.href}
      className={`flex items-center gap-4 p-4 rounded-xl border-l-4 bg-[#1e293b]/40 backdrop-blur-sm hover:bg-white/5 transition-all group ${action.color === 'primary' ? 'border-l-[#003366]' : action.color === 'gold' ? 'border-l-[#FFD700]' : 'border-l-purple-500'}`}
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${colorClasses[action.color as keyof typeof colorClasses]}`}>
        <span className="material-symbols-outlined">{action.icon}</span>
      </div>
      <div>
        <h4 className="text-white font-medium">{action.label}</h4>
        <p className="text-xs text-slate-400">{action.description}</p>
      </div>
    </Link>
  );
}

// Activity Item Component
function ActivityItem({ activity }: { activity: typeof recentActivities[0] }) {
  const iconBgColors: Record<string, string> = {
    blue: 'bg-blue-500/10 text-blue-400',
    red: 'bg-red-500/10 text-red-400',
    teal: 'bg-teal-500/10 text-teal-400',
    green: 'bg-green-500/10 text-green-400',
    gold: 'bg-yellow-500/10 text-yellow-400',
    slate: 'bg-slate-500/10 text-slate-400',
  };

  const badgeColors: Record<string, string> = {
    green: 'bg-green-500/10 text-green-400',
    gold: 'bg-yellow-500/10 text-yellow-400',
    slate: 'bg-slate-700 text-slate-300',
  };

  return (
    <motion.div
      variants={itemVariants}
      className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/[0.08] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/[0.12] transition-colors"
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${iconBgColors[activity.iconColor] || iconBgColors.blue}`}>
          <span className="material-symbols-outlined">{activity.icon}</span>
        </div>
        <div>
          <h4 className="text-white font-medium text-sm">{activity.title}</h4>
          <p className="text-slate-400 text-xs">{activity.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 pl-14 sm:pl-0">
        {activity.badge && (
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${badgeColors[activity.badge.color] || badgeColors.slate}`}>
            {activity.badge.text}
          </span>
        )}
        <span className="text-xs text-slate-500">{activity.timestamp}</span>
      </div>
    </motion.div>
  );
}

// Welcome Section Component
function WelcomeSection() {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const dimensionStats = getDimensionStats(dimensions);

  return (
    <div className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/[0.08] rounded-xl p-6 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#003366]/20 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
              {getGreeting()}, Andi! 👋
            </h1>
            <p className="text-slate-400 text-sm">
              Here's your development overview for today. Keep pushing forward!
            </p>
          </div>
          <div className="bg-[#003366]/40 border border-[#003366] px-4 py-2 rounded-lg backdrop-blur-sm">
            <p className="text-xs text-slate-300 uppercase tracking-wider font-semibold mb-0.5">Overall Index</p>
            <p className="text-3xl font-bold text-[#FFD700] tracking-tight">{dimensionStats.avgScore}</p>
          </div>
        </div>

        {/* Mini stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/[0.08]">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider">Strongest Area</p>
            <p className="text-white font-medium text-sm mt-1">{dimensionStats.strongest.name}</p>
            <p className="text-green-400 text-xs">{dimensionStats.strongest.score}/100</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider">Focus Area</p>
            <p className="text-white font-medium text-sm mt-1">{dimensionStats.weakest.name}</p>
            <p className="text-[#FFD700] text-xs">{dimensionStats.weakest.score}/100</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider">Hard Skills</p>
            <p className="text-white font-medium text-sm mt-1">{dimensionStats.hardAvg}/100</p>
            <p className="text-slate-400 text-xs">{dimensionStats.hardCount} dimensions</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider">Soft Skills</p>
            <p className="text-white font-medium text-sm mt-1">{dimensionStats.softAvg}/100</p>
            <p className="text-slate-400 text-xs">{dimensionStats.softCount} dimensions</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Dashboard Page
export default function DashboardPage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Welcome Section */}
      <WelcomeSection />

      {/* Quick Stats Grid */}
      <section>
        <motion.h2 variants={itemVariants} className="text-lg font-bold text-white mb-4">
          Quick Stats
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard 
            label="Active Goals"
            value={dashboardStats.activeGoals}
            icon="flag"
            trend="+2 this week"
            color="blue"
          />
          <StatCard 
            label="Assessments"
            value={dashboardStats.completedAssessments}
            icon="assignment_turned_in"
            trend="3 pending"
            color="green"
          />
          <StatCard 
            label="Current Level"
            value={`Level ${dashboardStats.currentLevel}`}
            icon="stars"
            trend="87% to next"
            color="gold"
          />
          <StatCard 
            label="Day Streak"
            value={`${dashboardStats.streak} days`}
            icon="local_fire_department"
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
          {quickActions.map((action) => (
            <QuickActionCard key={action.id} action={action} />
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <motion.h2 variants={itemVariants} className="text-lg font-bold text-white">
            Recent Activity
          </motion.h2>
          <Link 
            href="/dashboard/progress" 
            className="text-[#1A4D80] hover:text-white transition-colors text-sm flex items-center gap-1"
          >
            View All
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      </section>

      {/* Insight Card */}
      <motion.section variants={itemVariants}>
        <div className="bg-gradient-to-r from-[#003366]/30 to-transparent border border-[#003366]/30 rounded-xl p-5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#FFD700]/20 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#FFD700]">lightbulb</span>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Daily Insight</h3>
              <p className="text-slate-300 text-sm">
                Your cognitive dimension is growing steadily. Consider adding a practical workshop 
                to boost your Social metrics. You're only 8 points away from Level 5!
              </p>
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
