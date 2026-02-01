'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGoals, type Goal } from '@/lib/hooks';
import { GoalsPageSkeleton } from '@/components/dashboard/LoadingSkeletons';
import { ErrorDisplay, EmptyStateDisplay } from '@/components/dashboard/ErrorDisplay';
import { Flag, CheckCircle, Clock, AlertTriangle, Plus, Edit2, Trash2, Target } from 'lucide-react';

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
function GoalCard({ 
  goal, 
  onUpdate,
  onDelete,
  isMutating 
}: { 
  goal: Goal; 
  onUpdate: (goalId: string, updates: Partial<Goal>) => Promise<void>;
  onDelete: (goalId: string) => Promise<void>;
  isMutating: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const completedMilestones = goal.milestones?.filter(m => m.completed).length || 0;
  const totalMilestones = goal.milestones?.length || 0;
  
  const isCompleted = goal.status === 'completed';
  const isOverdue = goal.status === 'overdue';
  
  const borderClass = isCompleted 
    ? 'border-green-500/20' 
    : isOverdue 
    ? 'border-red-500/20' 
    : 'border-white/[0.08] hover:border-white/[0.12]';
  
  const titleClass = isCompleted ? 'text-green-400 line-through' : 'text-white';
  const progressColor = isCompleted ? 'bg-green-500' : isOverdue ? 'bg-red-500' : 'bg-[#FFD700]';

  const handleToggleMilestone = async (milestoneId: string, completed: boolean) => {
    const updatedMilestones = goal.milestones?.map(m =>
      m.id === milestoneId ? { ...m, completed } : m
    ) || [];
    
    const completedCount = updatedMilestones.filter(m => m.completed).length;
    const newProgress = totalMilestones > 0 
      ? Math.round((completedCount / totalMilestones) * 100) 
      : 0;
    
    await onUpdate(goal.id, { 
      milestones: updatedMilestones,
      progress: newProgress,
      status: newProgress === 100 ? 'completed' : 'active'
    });
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'No deadline';
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

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
                  style={{ width: `${goal.progress || 0}%` }}
                />
              </div>
            </div>
            
            {/* Target date */}
            <div className="flex items-center gap-4 mt-3 text-xs">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                Target: {formatDate(goal.target_date)}
              </div>
              {isOverdue && (
                <span className="text-red-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Overdue
                </span>
              )}
            </div>
          </div>
          
          {/* Actions */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            disabled={isMutating}
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
                {goal.milestones?.map((milestone) => {
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
                        onClick={() => handleToggleMilestone(milestone.id, !milestone.completed)}
                        disabled={isMutating}
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${buttonClass}`}
                      >
                        {milestone.completed && (
                          <CheckCircle className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <span className={`text-sm flex-1 ${milestoneTextClass}`}>
                        {milestone.title}
                      </span>
                    </div>
                  );
                })}
              </div>
              
              {/* Quick actions */}
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/[0.08]">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-[#003366]/50 hover:bg-[#003366] text-white text-xs rounded-lg transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                  Add Milestone
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 text-xs rounded-lg transition-colors">
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit Goal
                </button>
                <button 
                  onClick={() => onDelete(goal.id)}
                  disabled={isMutating}
                  className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs rounded-lg transition-colors ml-auto disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
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
  icon: Icon, 
  color = 'blue' 
}: { 
  label: string; 
  value: string | number; 
  icon: React.ElementType;
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
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

// Main Goals Page
export default function GoalsPage() {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'overdue'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'hard' | 'soft'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const { 
    goals, 
    totalCount,
    isLoading, 
    isMutating,
    error, 
    errorMessage, 
    refetch,
    updateGoal,
    deleteGoal 
  } = useGoals();

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

  const handleUpdateGoal = useCallback(async (goalId: string, updates: Partial<Goal>) => {
    await updateGoal(goalId, updates);
  }, [updateGoal]);

  const handleDeleteGoal = useCallback(async (goalId: string) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      await deleteGoal(goalId);
    }
  }, [deleteGoal]);

  // Show loading skeleton
  if (isLoading) {
    return <GoalsPageSkeleton />;
  }

  // Show error display
  if (error) {
    return (
      <div className="p-4">
        <ErrorDisplay
          title="Failed to load goals"
          message={errorMessage}
          onRetry={refetch}
          variant="fullscreen"
        />
      </div>
    );
  }

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
          <Plus className="w-5 h-5" />
          New Goal
        </button>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Goals" value={totalCount} icon={Flag} color="blue" />
        <StatCard label="Active" value={activeGoals} icon={Clock} color="gold" />
        <StatCard label="Completed" value={completedGoals} icon={CheckCircle} color="green" />
        <StatCard label="Overdue" value={overdueGoals} icon={AlertTriangle} color="red" />
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
                  ? 'bg-[#003366] text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat} Skills
            </button>
          ))}
        </div>
      </motion.div>

      {/* Goals List */}
      <section>
        {filteredGoals.length > 0 ? (
          <div className="space-y-4">
            {filteredGoals.map((goal) => (
              <GoalCard 
                key={goal.id} 
                goal={goal} 
                onUpdate={handleUpdateGoal}
                onDelete={handleDeleteGoal}
                isMutating={isMutating}
              />
            ))}
          </div>
        ) : (
          <EmptyStateDisplay
            icon={<Target className="w-8 h-8 text-[#003366]" />}
            title="No goals yet"
            description="Start your personal development journey by setting your first goal. Track your progress and achieve your dreams."
            action={{ 
              label: 'Create Your First Goal', 
              onClick: () => setShowCreateModal(true) 
            }}
          />
        )}
      </section>
    </motion.div>
  );
}
