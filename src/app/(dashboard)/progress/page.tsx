'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { dimensions, getDimensionStats } from '@/lib/navigation';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Progress over time data
const progressHistory = [
  { month: 'Jan', overall: 65, hard: 62, soft: 68 },
  { month: 'Feb', overall: 68, hard: 65, soft: 71 },
  { month: 'Mar', overall: 70, hard: 67, soft: 73 },
  { month: 'Apr', overall: 71, hard: 69, soft: 73 },
  { month: 'May', overall: 70, hard: 68, soft: 72 },
  { month: 'Jun', overall: 72, hard: 70, soft: 74 },
  { month: 'Jul', overall: 73, hard: 71, soft: 75 },
  { month: 'Aug', overall: 72, hard: 70, soft: 74 },
  { month: 'Sep', overall: 73, hard: 71, soft: 75 },
  { month: 'Oct', overall: 72, hard: 70, soft: 74 },
  { month: 'Nov', overall: 73, hard: 71, soft: 75 },
  { month: 'Dec', overall: 72.5, hard: 70, soft: 74.5 },
];

// Milestone achievements
const milestones = [
  { id: 1, title: 'First Assessment Complete', date: '2024-01-15', icon: 'assignment_turned_in', color: 'blue' },
  { id: 2, title: 'Level 2 Scholar Achieved', date: '2024-02-20', icon: 'school', color: 'gold' },
  { id: 3, title: '10 Day Streak', date: '2024-03-05', icon: 'local_fire_department', color: 'orange' },
  { id: 4, title: 'First Goal Completed', date: '2024-03-15', icon: 'flag', color: 'green' },
  { id: 5, title: 'Level 3 Scholar Achieved', date: '2024-04-10', icon: 'stars', color: 'gold' },
  { id: 6, title: '30 Day Streak', date: '2024-04-25', icon: 'whatshot', color: 'orange' },
  { id: 7, title: 'All Dimensions Above 50', date: '2024-05-20', icon: 'trending_up', color: 'purple' },
  { id: 8, title: 'Level 4 Scholar Achieved', date: '2024-06-15', icon: 'workspace_premium', color: 'gold' },
];

// Skill development trajectory
const skillTrajectory = [
  { skill: 'Leadership', start: 45, current: 72, target: 90 },
  { skill: 'Communication', start: 60, current: 82, target: 95 },
  { skill: 'Critical Thinking', start: 55, current: 75, target: 85 },
  { skill: 'Technical', start: 40, current: 65, target: 80 },
  { skill: 'Creativity', start: 50, current: 78, target: 85 },
];

// Simple Bar Chart Component
function ProgressBarChart() {
  const maxValue = 100;
  const barWidth = 20;
  const gap = 8;
  const chartHeight = 200;
  
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[600px] pt-8 pb-4 px-4">
        {/* Y-axis labels */}
        <div className="flex">
          <div className="flex flex-col justify-between h-[200px] pr-4 text-xs text-slate-500">
            <span>100</span>
            <span>75</span>
            <span>50</span>
            <span>25</span>
            <span>0</span>
          </div>
          
          {/* Chart area */}
          <div className="flex-1 relative">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="border-t border-slate-700/30 h-0" />
              ))}
            </div>
            
            {/* Bars */}
            <div className="flex items-end justify-around h-[200px]">
              {progressHistory.map((data, index) => {
                const barHeight = (data.overall / maxValue) * chartHeight;
                const hardHeight = (data.hard / maxValue) * chartHeight;
                const softHeight = (data.soft / maxValue) * chartHeight;
                
                return (
                  <div key={index} className="flex flex-col items-center gap-1">
                    <div className="flex items-end gap-0.5">
                      {/* Hard skills bar */}
                      <div
                        className="w-2 bg-blue-500 rounded-t"
                        style={{ height: `${hardHeight}px` }}
                        title={`Hard: ${data.hard}`}
                      />
                      {/* Overall bar */}
                      <div
                        className="w-3 bg-[#FFD700] rounded-t"
                        style={{ height: `${barHeight}px` }}
                        title={`Overall: ${data.overall}`}
                      />
                      {/* Soft skills bar */}
                      <div
                        className="w-2 bg-purple-500 rounded-t"
                        style={{ height: `${softHeight}px` }}
                        title={`Soft: ${data.soft}`}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500">{data.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex justify-center gap-6 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#FFD700] rounded" />
            <span className="text-slate-400">Overall</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded" />
            <span className="text-slate-400">Hard Skills</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded" />
            <span className="text-slate-400">Soft Skills</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Skill Trajectory Bar Component
function TrajectoryBar({ skill }: { skill: typeof skillTrajectory[0] }) {
  const progress = ((skill.current - skill.start) / (skill.target - skill.start)) * 100;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-white font-medium">{skill.skill}</span>
        <div className="flex items-center gap-4 text-xs">
          <span className="text-slate-500">Start: {skill.start}</span>
          <span className="text-[#FFD700] font-semibold">Current: {skill.current}</span>
          <span className="text-slate-400">Target: {skill.target}</span>
        </div>
      </div>
      <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden relative">
        {/* Start marker */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-slate-500 z-10"
          style={{ left: `${(skill.start / 100) * 100}%` }}
        />
        {/* Progress bar */}
        <div 
          className="h-full bg-gradient-to-r from-[#003366] to-[#FFD700] rounded-full transition-all duration-500"
          style={{ width: `${skill.current}%` }}
        />
        {/* Target marker */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-green-500 z-10"
          style={{ left: `${(skill.target / 100) * 100}%` }}
        />
      </div>
    </div>
  );
}

// Milestone Card Component
function MilestoneCard({ milestone, index }: { milestone: typeof milestones[0]; index: number }) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    gold: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    green: 'bg-green-500/20 text-green-400 border-green-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  };

  return (
    <motion.div
      variants={itemVariants}
      className="relative flex gap-4"
    >
      {/* Timeline line */}
      {index < milestones.length - 1 && (
        <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-slate-700/50" />
      )}
      
      {/* Icon */}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center border shrink-0 ${colorClasses[milestone.color]}`}>
        <span className="material-symbols-outlined text-sm">{milestone.icon}</span>
      </div>
      
      {/* Content */}
      <div className="flex-1 pb-8">
        <h4 className="text-white font-medium text-sm">{milestone.title}</h4>
        <p className="text-slate-500 text-xs mt-0.5">
          {new Date(milestone.date).toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
          })}
        </p>
      </div>
    </motion.div>
  );
}

// Stat Card Component
function StatCard({ 
  label, 
  value, 
  subtext,
  icon, 
  trend,
  color = 'blue' 
}: { 
  label: string; 
  value: string | number;
  subtext?: string;
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
    <div className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/[0.08] rounded-xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">{label}</p>
          <p className="text-3xl font-bold text-white mt-1">{value}</p>
          {subtext && <p className="text-slate-500 text-xs mt-0.5">{subtext}</p>}
          {trend && <p className="text-green-400 text-xs mt-1">{trend}</p>}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colorClasses[color]}`}>
          <span className="material-symbols-outlined text-xl">{icon}</span>
        </div>
      </div>
    </div>
  );
}

// Main Progress Page
export default function ProgressPage() {
  const [timeRange, setTimeRange] = useState<'3m' | '6m' | '1y' | 'all'>('1y');
  const stats = getDimensionStats(dimensions);
  
  // Calculate improvement
  const currentAvg = stats.avgScore;
  const previousAvg = 68; // Mock previous average
  const improvement = ((currentAvg - previousAvg) / previousAvg * 100).toFixed(1);

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
          <h1 className="text-2xl md:text-3xl font-bold text-white">Progress Tracking</h1>
          <p className="text-slate-400 text-sm mt-1">
            Monitor your development journey and celebrate your achievements
          </p>
        </div>
        <Link
          href="/dashboard/dimensions"
          className="px-4 py-2 bg-[#003366]/50 hover:bg-[#003366] text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">analytics</span>
          View 9 Dimensions
        </Link>
      </motion.div>

      {/* Key Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          label="Overall Score" 
          value={stats.avgScore} 
          subtext="out of 100"
          icon="trending_up" 
          trend={`+${improvement}% from last year`}
          color="gold" 
        />
        <StatCard 
          label="Assessments" 
          value={12} 
          subtext="completed"
          icon="assignment_turned_in" 
          color="blue" 
        />
        <StatCard 
          label="Current Streak" 
          value="15 days" 
          subtext="keep it up!"
          icon="local_fire_department" 
          trend="Best: 30 days"
          color="purple" 
        />
        <StatCard 
          label="Goals Achieved" 
          value="8/12" 
          subtext="this year"
          icon="emoji_events" 
          trend="67% completion rate"
          color="green" 
        />
      </motion.div>

      {/* Progress Chart */}
      <motion.section variants={itemVariants}>
        <div className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/[0.08] rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">Progress Over Time</h2>
              <p className="text-slate-400 text-sm">Your development journey throughout the year</p>
            </div>
            <div className="flex items-center gap-2 bg-[#0f1923] rounded-lg p-1">
              {(['3m', '6m', '1y', 'all'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    timeRange === range
                      ? 'bg-[#003366] text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {range === 'all' ? 'All Time' : range}
                </button>
              ))}
            </div>
          </div>
          <ProgressBarChart />
        </div>
      </motion.section>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skill Development Trajectory */}
        <motion.section variants={itemVariants}>
          <div className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/[0.08] rounded-xl p-6 h-full">
            <h2 className="text-lg font-bold text-white mb-2">Skill Development Trajectory</h2>
            <p className="text-slate-400 text-sm mb-6">Track your progress from start to target</p>
            <div className="space-y-5">
              {skillTrajectory.map((skill) => (
                <TrajectoryBar key={skill.skill} skill={skill} />
              ))}
            </div>
          </div>
        </motion.section>

        {/* Milestone Achievements */}
        <motion.section variants={itemVariants}>
          <div className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/[0.08] rounded-xl p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-white">Milestone Achievements</h2>
                <p className="text-slate-400 text-sm">Your journey milestones</p>
              </div>
              <span className="text-2xl font-bold text-[#FFD700]">{milestones.length}</span>
            </div>
            <div className="space-y-0 max-h-[400px] overflow-y-auto pr-2">
              {milestones.map((milestone, index) => (
                <MilestoneCard key={milestone.id} milestone={milestone} index={index} />
              ))}
            </div>
          </div>
        </motion.section>
      </div>

      {/* Improvement Insights */}
      <motion.section variants={itemVariants}>
        <div className="bg-gradient-to-r from-[#003366]/30 to-[#1e293b]/30 border border-[#003366]/30 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#FFD700]/20 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#FFD700]">insights</span>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-2">Growth Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#0f1923]/50 rounded-lg p-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Fastest Growing</p>
                  <p className="text-green-400 font-semibold">Leadership & Influence</p>
                  <p className="text-slate-400 text-xs mt-1">+7 points this quarter</p>
                </div>
                <div className="bg-[#0f1923]/50 rounded-lg p-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Most Consistent</p>
                  <p className="text-blue-400 font-semibold">Emotional & Social</p>
                  <p className="text-slate-400 text-xs mt-1">Stable high performance</p>
                </div>
                <div className="bg-[#0f1923]/50 rounded-lg p-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Needs Attention</p>
                  <p className="text-[#FFD700] font-semibold">Environmental & Global</p>
                  <p className="text-slate-400 text-xs mt-1">+3 points this quarter</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
