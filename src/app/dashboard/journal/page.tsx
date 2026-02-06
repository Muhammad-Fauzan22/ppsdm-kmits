'use client';

import { useState } from 'react';
import Link from 'next/link';
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

// Mock journal entries
const journalEntries = [
  {
    id: 1,
    date: '2024-02-01',
    title: 'Weekly Reflection',
    content: 'This week I focused on improving my communication skills. I participated in three group discussions and received positive feedback from my peers. I also completed the first module of the Emotional Intelligence training.',
    mood: 'happy',
    tags: ['reflection', 'communication', 'emotional-intelligence'],
  },
  {
    id: 2,
    date: '2024-01-28',
    title: 'Goal Progress Update',
    content: 'Made significant progress on my Python learning goal. Completed the pandas fundamentals module and started working on a small data analysis project using real datasets.',
    mood: 'excited',
    tags: ['goals', 'python', 'data-analysis'],
  },
  {
    id: 3,
    date: '2024-01-25',
    title: 'Challenges Faced',
    content: 'Struggled with time management this week. Found it difficult to balance coursework with personal development activities. Need to prioritize better and create a more structured schedule.',
    mood: 'neutral',
    tags: ['challenges', 'time-management'],
  },
];

const moodIcons: Record<string, string> = {
  happy: 'sentiment_very_satisfied',
  excited: 'mood',
  neutral: 'sentiment_neutral',
  sad: 'sentiment_dissatisfied',
};

const moodColors: Record<string, string> = {
  happy: 'text-green-400',
  excited: 'text-yellow-400',
  neutral: 'text-slate-400',
  sad: 'text-red-400',
};

function JournalCard({ entry }: { entry: typeof journalEntries[0] }) {
  return (
    <motion.div
      variants={itemVariants}
      className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/[0.08] rounded-xl p-5 hover:border-white/[0.12] transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-white font-semibold">{entry.title}</h3>
            <span className={`material-symbols-outlined ${moodColors[entry.mood]}`}>
              {moodIcons[entry.mood]}
            </span>
          </div>
          <p className="text-slate-400 text-sm line-clamp-3">{entry.content}</p>
          <div className="flex items-center gap-2 mt-3">
            {entry.tags.map((tag) => (
              <span 
                key={tag}
                className="px-2 py-0.5 bg-[#003366]/30 text-[#1A4D80] text-[10px] rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">
            {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function JournalPage() {
  const [showNewEntry, setShowNewEntry] = useState(false);

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
          <h1 className="text-2xl md:text-3xl font-bold text-white">Personal Journal</h1>
          <p className="text-slate-400 text-sm mt-1">
            Reflect on your journey, track your thoughts, and document your growth
          </p>
        </div>
        <button
          onClick={() => setShowNewEntry(true)}
          className="px-4 py-2.5 bg-[#FFD700] text-[#0f1923] rounded-lg font-bold hover:bg-[#FFD700]/90 transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">add</span>
          New Entry
        </button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">
        <div className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/[0.08] rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-white">{journalEntries.length}</p>
          <p className="text-slate-400 text-xs uppercase tracking-wider mt-1">Entries</p>
        </div>
        <div className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/[0.08] rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-green-400">5</p>
          <p className="text-slate-400 text-xs uppercase tracking-wider mt-1">Day Streak</p>
        </div>
        <div className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/[0.08] rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-[#FFD700]">12</p>
          <p className="text-slate-400 text-xs uppercase tracking-wider mt-1">Tags Used</p>
        </div>
      </motion.div>

      {/* Journal Entries */}
      <section>
        <motion.h2 variants={itemVariants} className="text-lg font-bold text-white mb-4">
          Recent Entries
        </motion.h2>
        <div className="space-y-4">
          {journalEntries.map((entry) => (
            <JournalCard key={entry.id} entry={entry} />
          ))}
        </div>
      </section>

      {/* Prompts Section */}
      <motion.section variants={itemVariants}>
        <div className="bg-gradient-to-r from-[#003366]/30 to-[#1e293b]/30 border border-[#003366]/30 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-3">Writing Prompts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button className="text-left p-3 bg-[#0f1923]/50 rounded-lg hover:bg-[#0f1923] transition-colors">
              <p className="text-slate-300 text-sm">What was your biggest win this week?</p>
            </button>
            <button className="text-left p-3 bg-[#0f1923]/50 rounded-lg hover:bg-[#0f1923] transition-colors">
              <p className="text-slate-300 text-sm">What challenge did you overcome recently?</p>
            </button>
            <button className="text-left p-3 bg-[#0f1923]/50 rounded-lg hover:bg-[#0f1923] transition-colors">
              <p className="text-slate-300 text-sm">What are you grateful for today?</p>
            </button>
            <button className="text-left p-3 bg-[#0f1923]/50 rounded-lg hover:bg-[#0f1923] transition-colors">
              <p className="text-slate-300 text-sm">What skill would you like to improve next?</p>
            </button>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
