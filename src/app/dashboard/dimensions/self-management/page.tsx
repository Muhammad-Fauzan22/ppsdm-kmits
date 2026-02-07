'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Settings, 
  ArrowLeft, 
  TrendingUp, 
  Award, 
  BookOpen,
  Target
} from 'lucide-react';

export default function SelfManagementDimensionPage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200">
      <header className="fixed top-0 w-full z-50 glass-panel border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/dimensions" className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="bg-cyan-500/20 p-2 rounded-lg">
              <Settings className="w-6 h-6 text-cyan-500" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-slate-500">Dimension 08</span>
              <h1 className="text-xl font-bold font-display">Self Management</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-2xl font-bold text-cyan-500">88%</div>
              <div className="text-xs text-slate-500">Mastery Level</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-cyan-700 p-0.5">
              <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-white text-sm font-bold">
                MF
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-surface-dark rounded-xl p-6 border border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-sm text-slate-500">Progress</span>
            </div>
            <div className="text-2xl font-bold">+5.2%</div>
            <div className="text-xs text-slate-400">vs last month</div>
          </div>
          
          <div className="bg-white dark:bg-surface-dark rounded-xl p-6 border border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-5 h-5 text-yellow-500" />
              <span className="text-sm text-slate-500">Achievements</span>
            </div>
            <div className="text-2xl font-bold">18</div>
            <div className="text-xs text-slate-400">Unlocked</div>
          </div>
          
          <div className="bg-white dark:bg-surface-dark rounded-xl p-6 border border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-slate-500">Resources</span>
            </div>
            <div className="text-2xl font-bold">35</div>
            <div className="text-xs text-slate-400">Available</div>
          </div>
          
          <div className="bg-white dark:bg-surface-dark rounded-xl p-6 border border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-5 h-5 text-red-500" />
              <span className="text-sm text-slate-500">Goals</span>
            </div>
            <div className="text-2xl font-bold">9/10</div>
            <div className="text-xs text-slate-400">Completed</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-gray-200 dark:border-white/10">
              <h2 className="text-xl font-bold mb-4">Self Management Assessment</h2>
              <p className="text-slate-500 mb-6">
                Evaluate your time management, goal setting, and personal productivity skills.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                      <span className="text-cyan-500 font-bold">01</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Time Management</h3>
                      <p className="text-sm text-slate-500">Prioritization skills</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors">
                    Start
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                      <span className="text-cyan-500 font-bold">02</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Goal Setting</h3>
                      <p className="text-sm text-slate-500">SMART objectives</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg cursor-not-allowed">
                    Locked
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                      <span className="text-cyan-500 font-bold">03</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Productivity</h3>
                      <p className="text-sm text-slate-500">Efficiency habits</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg cursor-not-allowed">
                    Locked
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-gray-200 dark:border-white/10">
              <h3 className="font-bold mb-4">Progress Overview</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500">Time Mgmt</span>
                    <span className="font-semibold">90%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 rounded-full" style={{ width: '90%' }} />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500">Goal Setting</span>
                    <span className="font-semibold">85%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500">Productivity</span>
                    <span className="font-semibold">88%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 rounded-full" style={{ width: '88%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
