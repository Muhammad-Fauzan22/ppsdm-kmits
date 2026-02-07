'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Fingerprint, 
  ArrowLeft, 
  TrendingUp, 
  Award, 
  BookOpen,
  Target
} from 'lucide-react';

export default function CharacterDimensionPage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass-panel border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/dimensions" className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="bg-purple-500/20 p-2 rounded-lg">
              <Fingerprint className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-slate-500">Dimension 01</span>
              <h1 className="text-xl font-bold font-display">Character</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-2xl font-bold text-purple-500">78%</div>
              <div className="text-xs text-slate-500">Mastery Level</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-purple-700 p-0.5">
              <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-white text-sm font-bold">
                MF
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Hero Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-surface-dark rounded-xl p-6 border border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-sm text-slate-500">Progress</span>
            </div>
            <div className="text-2xl font-bold">+2.4%</div>
            <div className="text-xs text-slate-400">vs last month</div>
          </div>
          
          <div className="bg-white dark:bg-surface-dark rounded-xl p-6 border border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-5 h-5 text-yellow-500" />
              <span className="text-sm text-slate-500">Achievements</span>
            </div>
            <div className="text-2xl font-bold">12</div>
            <div className="text-xs text-slate-400">Unlocked</div>
          </div>
          
          <div className="bg-white dark:bg-surface-dark rounded-xl p-6 border border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-slate-500">Resources</span>
            </div>
            <div className="text-2xl font-bold">24</div>
            <div className="text-xs text-slate-400">Available</div>
          </div>
          
          <div className="bg-white dark:bg-surface-dark rounded-xl p-6 border border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-5 h-5 text-red-500" />
              <span className="text-sm text-slate-500">Goals</span>
            </div>
            <div className="text-2xl font-bold">5/8</div>
            <div className="text-xs text-slate-400">Completed</div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Assessment Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-gray-200 dark:border-white/10">
              <h2 className="text-xl font-bold mb-4">Character Assessment</h2>
              <p className="text-slate-500 mb-6">
                Evaluate your ethical framework, integrity, and personal values alignment through comprehensive assessment modules.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <span className="text-purple-500 font-bold">01</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Ethics Foundation</h3>
                      <p className="text-sm text-slate-500">Core moral principles</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                    Start
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <span className="text-purple-500 font-bold">02</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Integrity Check</h3>
                      <p className="text-sm text-slate-500">Consistency in actions</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg cursor-not-allowed">
                    Locked
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <span className="text-purple-500 font-bold">03</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Values Alignment</h3>
                      <p className="text-sm text-slate-500">Personal values clarity</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg cursor-not-allowed">
                    Locked
                  </button>
                </div>
              </div>
            </div>
            
            {/* Learning Resources */}
            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-gray-200 dark:border-white/10">
              <h2 className="text-xl font-bold mb-4">Recommended Resources</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 dark:border-white/10 rounded-xl hover:border-purple-500/50 transition-colors cursor-pointer">
                  <div className="w-full h-32 bg-gradient-to-br from-purple-500/20 to-purple-700/20 rounded-lg mb-3 flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-purple-500" />
                  </div>
                  <h3 className="font-semibold mb-1">Ethics in Engineering</h3>
                  <p className="text-sm text-slate-500">Course • 45 min</p>
                </div>
                
                <div className="p-4 border border-gray-200 dark:border-white/10 rounded-xl hover:border-purple-500/50 transition-colors cursor-pointer">
                  <div className="w-full h-32 bg-gradient-to-br from-purple-500/20 to-purple-700/20 rounded-lg mb-3 flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-purple-500" />
                  </div>
                  <h3 className="font-semibold mb-1">Leadership Values</h3>
                  <p className="text-sm text-slate-500">Article • 10 min</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Overview */}
            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-gray-200 dark:border-white/10">
              <h3 className="font-bold mb-4">Progress Overview</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500">Ethics</span>
                    <span className="font-semibold">85%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500">Integrity</span>
                    <span className="font-semibold">72%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '72%' }} />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500">Values</span>
                    <span className="font-semibold">78%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '78%' }} />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-gray-200 dark:border-white/10">
              <h3 className="font-bold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full p-3 text-left bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-purple-500/10 hover:text-purple-500 transition-colors">
                  <span className="font-medium">Continue Assessment</span>
                </button>
                <button className="w-full p-3 text-left bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-purple-500/10 hover:text-purple-500 transition-colors">
                  <span className="font-medium">View Report</span>
                </button>
                <button className="w-full p-3 text-left bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-purple-500/10 hover:text-purple-500 transition-colors">
                  <span className="font-medium">Set New Goal</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
