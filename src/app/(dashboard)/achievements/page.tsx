'use client';

import { motion } from 'framer-motion';

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

// Achievement badges data
const achievements = [
  { id: 1, name: 'Critical Thinker', level: 2, icon: 'psychology', color: 'gold', unlocked: true, date: '2024-02-15' },
  { id: 2, name: 'Team Player', level: 1, icon: 'groups', color: 'blue', unlocked: true, date: '2024-01-20' },
  { id: 3, name: 'Innovator', level: 1, icon: 'lightbulb', color: 'purple', unlocked: true, date: '2024-03-05' },
  { id: 4, name: 'Goal Setter', level: 3, icon: 'flag', color: 'green', unlocked: true, date: '2024-02-28' },
  { id: 5, name: 'Consistent Learner', level: 2, icon: 'school', color: 'gold', unlocked: true, date: '2024-03-10' },
  { id: 6, name: 'Early Bird', level: 1, icon: 'wb_sunny', color: 'orange', unlocked: false, progress: 60 },
  { id: 7, name: 'Night Owl', level: 1, icon: 'dark_mode', color: 'indigo', unlocked: false, progress: 40 },
  { id: 8, name: 'Master Communicator', level: 1, icon: 'record_voice_over', color: 'pink', unlocked: false, progress: 25 },
];

const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
  gold: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  blue: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  purple: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
  green: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
  orange: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
  indigo: { bg: 'bg-indigo-500/20', text: 'text-indigo-400', border: 'border-indigo-500/30' },
  pink: { bg: 'bg-pink-500/20', text: 'text-pink-400', border: 'border-pink-500/30' },
};

function AchievementCard({ achievement }: { achievement: typeof achievements[0] }) {
  const colors = colorClasses[achievement.color];
  
  return (
    <motion.div
      variants={itemVariants}
      className={`bg-[#1e293b]/40 backdrop-blur-sm border rounded-xl p-5 transition-all ${
        achievement.unlocked 
          ? `${colors.border} hover:border-opacity-50` 
          : 'border-white/[0.08] opacity-60'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${colors.bg} ${colors.text} border ${colors.border}`}>
          <span className="material-symbols-outlined text-2xl">{achievement.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-white font-semibold truncate">{achievement.name}</h3>
            {achievement.unlocked && (
              <span className="text-[#FFD700] text-xs">Lvl {achievement.level}</span>
            )}
          </div>
          
          {achievement.unlocked ? (
            <>
              <p className="text-slate-400 text-xs mt-1">Unlocked on {achievement.date}</p>
              <div className="flex items-center gap-1 mt-2">
                {[...Array(achievement.level)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-[#FFD700] text-sm">star</span>
                ))}
              </div>
            </>
          ) : (
            <>
              <p className="text-slate-500 text-xs mt-1">Locked</p>
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400">Progress</span>
                  <span className="text-slate-300">{achievement.progress}%</span>
                </div>
                <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-slate-500 rounded-full"
                    style={{ width: `${achievement.progress}%` }}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function AchievementsPage() {
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const progress = Math.round((unlockedCount / totalCount) * 100);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Achievements</h1>
        <p className="text-slate-400 text-sm mt-1">
          Collect badges and showcase your accomplishments
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">
        <div className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/[0.08] rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-[#FFD700]">{unlockedCount}</p>
          <p className="text-slate-400 text-xs uppercase tracking-wider mt-1">Unlocked</p>
        </div>
        <div className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/[0.08] rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-white">{totalCount - unlockedCount}</p>
          <p className="text-slate-400 text-xs uppercase tracking-wider mt-1">Locked</p>
        </div>
        <div className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/[0.08] rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-green-400">{progress}%</p>
          <p className="text-slate-400 text-xs uppercase tracking-wider mt-1">Complete</p>
        </div>
      </motion.div>

      {/* Achievement Grid */}
      <section>
        <motion.h2 variants={itemVariants} className="text-lg font-bold text-white mb-4">
          Your Collection
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </section>
    </motion.div>
  );
}
