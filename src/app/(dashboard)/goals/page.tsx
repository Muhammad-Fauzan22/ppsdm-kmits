'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { goals, Goal } from '@/lib/navigation';

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

// Goal Card Component
function GoalCard({ goal }: { goal: Goal }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const completedMilestones = goal.milestones.filter(m => m.completed).length;
  const totalMilestones = goal.milestones.length;
  
  const isCompleted = goal.status === 'completed';
  const isOverdue = goal.status === 'overdue';
  
  const borderClass = isCompleted 
    ? 'border-green-500/20' 
    : isOverdue 
    ? 'border-red-500/20' 
    : 'border-white/[0.08] hover:border-white/[0.12]';
  
  const titleClass = isCompleted ? 'text-green-400 line-through' : 'text-white';
  const progressColor = isCompleted ? 'bg-green-500' : isOverdue ? 'bg-red-500' : 'bg-[#FFD700]';

  return (
    <motion.div
      variants={itemVariants}
      className={`bg-[#1e293b]/40 backdrop-blur-sm border rounded-xl overflow-hidden transition-all ${borderClass}`}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className={`font-semibold truncate ${titleClass}`}>
                {goal.title}
              </h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                goal.category === 'hard' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'
              }`}>
                {goal.category}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                goal.status === 'active' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                goal.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                'bg-red-500/20 text-red-400 border-red-500/30'
              }`}>
                {goal.status}
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-1">{goal.description}</p>
            
            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-400">Progress</span>
                <span className="text-white font-medium">{completedMilestones}/{totalMilestones} milestones</span>
              </div>
              <div className="h-2.5 bg-slate-700/50 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 rounded-full ${progressColor}`}
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
            </div>
            
            {/* Target date */}
            <div className="flex items-center gap-4 mt-3 text-xs">
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="material-symbols-outlined text-sm">calendar_today</span>
                Target: {new Date(goal.targetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
              {isOverdue && (
                <span className="text-red-400 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">warning</span>
                  Overdue
                </span>
              )}
            </div>
          </div>
          
          {/* Actions */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <span className={`material-symbols-outlined transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
              expand_more
            </span>
          </button>
        </div>
      </div>
      
      {/* Expanded milestones */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-white/[0.08]"
          >
            <div className="p-5">
              <h4 className="text-sm font-semibold text-white mb-3">Milestones</h4>
              <div className="space-y-2">
                {goal.milestones.map((milestone) => {
                  const milestoneTextClass = milestone.completed ? 'text-slate-400 line-through' : 'text-slate-200';
                  const buttonClass = milestone.completed 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : 'border-slate-500 hover:border-[#FFD700]';
                  
                  return (
                    <div 
                      key={milestone.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <button
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${buttonClass}`}
                      >
                        {milestone.completed && (
                          <span className="material-symbols-outlined text-sm">check</span>
                        )}
                      </button>
                      <span className={`text-sm flex-1 ${milestoneTextClass}`}>
                        {milestone.title}
                      </span>
                      {milestone.completedAt && (
                        <span className="text-xs text-slate-500">
                          {new Date(milestone.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* Quick actions */}
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/[0.08]">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-[#003366]/50 hover:bg-[#003366] text-white text-xs rounded-lg transition-colors">
                  <span className="material-symbols-outlined text-sm">add_task</span>
                  Add Milestone
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 text-xs rounded-lg transition-colors">
                  <span className="material-symbols-outlined text-sm">edit</span>
                  Edit Goal
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs rounded-lg transition-colors ml-auto">
                  <span className="material-symbols-outlined text-sm">delete</span>
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Stats Card Component
function StatCard({ 
  label, 
  value, 
  icon, 
  color = 'blue' 
}: { 
  label: string; 
  value: string | number; 
  icon: string;
  color?: 'blue' | 'green' | 'gold' | 'red';
}) {
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    green: 'bg-green-500/10 text-green-400 border-green-500/20',
    gold: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  return (
    <div className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/[0.08] rounded-xl p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">{label}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${colorClasses[color]}`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
      </div>
    </div>
  );
}

// Empty State Component
function EmptyGoalsState({ onCreate }: { onCreate: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/[0.08] rounded-xl p-12 text-center"
    >
      <div className="w-16 h-16 mx-auto bg-[#003366]/20 rounded-full flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-3xl text-[#003366]">flag</span>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">No goals yet</h3>
      <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
        Start your personal development journey by setting your first goal. Track your progress and achieve your dreams.
      </p>
      <button
        onClick={onCreate}
        className="px-6 py-2.5 bg-[#FFD700] text-[#0f1923] rounded-lg font-bold hover:bg-[#FFD700]/90 transition-colors inline-flex items-center gap-2"
      >
        <span className="material-symbols-outlined">add</span>
        Create Your First Goal
      </button>
    </motion.div>
  );
}

// Main Goals Page
export default function GoalsPage() {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'overdue'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'hard' | 'soft'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Filter goals
  const filteredGoals = goals.filter(goal => {
    const statusMatch = filter === 'all' || goal.status === filter;
    const categoryMatch = categoryFilter === 'all' || goal.category === categoryFilter;
    return statusMatch && categoryMatch;
  });

  // Calculate stats
  const activeGoals = goals.filter(g => g.status === 'active').length;
  const completedGoals = goals.filter(g => g.status === 'completed').length;
  const overdueGoals = goals.filter(g => g.status === 'overdue').length;

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
          <h1 className="text-2xl md:text-3xl font-bold text-white">My Goals</h1>
          <p className="text-slate-400 text-sm mt-1">
            Track your progress and achieve your personal development targets
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-[#FFD700] text-[#0f1923] rounded-lg font-bold hover:bg-[#FFD700]/90 transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">add</span>
          New Goal
        </button>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Goals" value={goals.length} icon="flag" color="blue" />
        <StatCard label="Active" value={activeGoals} icon="pending" color="gold" />
        <StatCard label="Completed" value={completedGoals} icon="check_circle" color="green" />
        <StatCard label="Overdue" value={overdueGoals} icon="warning" color="red" />
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
        {/* Status Filter */}
        <div className="flex items-center gap-2 bg-[#1e293b]/40 backdrop-blur-sm border border-white/[0.08] rounded-lg p-1">
          {(['all', 'active', 'completed', 'overdue'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${
                filter === status
                  ? 'bg-[#003366] text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 bg-[#1e293b]/40 backdrop-blur-sm border border-white/[0.08] rounded-lg p-1">
          {(['all', 'hard', 'soft'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${
                categoryFilter === cat
                  ? cat === 'hard'
                    ? 'bg-blue-500/30 text-blue-400'
                    : cat === 'soft'
                    ? 'bg-purple-500/30 text-purple-400'
                    : 'bg-[#003366] text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat === 'all' ? 'All Categories' : `${cat} Skills`}
            </button>
          ))}
        </div>

        {/* Clear filters */}
        {(filter !== 'all' || categoryFilter !== 'all') && (
          <button
            onClick={() => { setFilter('all'); setCategoryFilter('all'); }}
            className="px-3 py-1.5 text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">close</span>
            Clear filters
          </button>
        )}
      </motion.div>

      {/* Goals List */}
      {filteredGoals.length > 0 ? (
        <div className="space-y-4">
          {filteredGoals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      ) : (
        <EmptyGoalsState onCreate={() => setShowCreateModal(true)} />
      )}

      {/* Create Goal Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#151e29] border border-white/[0.08] rounded-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Create New Goal</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <p className="text-slate-400 text-sm mb-6">
                This feature will allow you to create custom goals with milestones. Coming soon!
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 bg-[#003366] text-white rounded-lg font-medium hover:bg-[#003366]/80 transition-colors"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
