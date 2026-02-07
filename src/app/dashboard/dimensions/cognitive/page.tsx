'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Brain, 
  ArrowLeft, 
  TrendingUp, 
  Award, 
  BookOpen,
  Target
} from 'lucide-react';

export default function CognitiveDimensionPage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass-panel border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/dimensions" className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="bg-blue-500/20 p-2 rounded-lg">
              <Brain className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-slate-500">Dimension 02</span>
              <h1 className="text-xl font-bold font-display">Cognitive</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-2xl font-bold text-blue-500">92%</div>
              <div className="text-xs text-slate-500">Mastery Level</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-blue-700 p-0.5">
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
            <div className="text-2xl font-bold">+5.1%</div>
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
            <div className="text-2xl font-bold">32</div>
            <div className="text-xs text-slate-400">Available</div>
          </div>
          
          <div className="bg-white dark:bg-surface-dark rounded-xl p-6 border border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-5 h-5 text-red-500" />
              <span className="text-sm text-slate-500">Goals</span>
            </div>
            <div className="text-2xl font-bold">7/10</div>
            <div className="text-xs text-slate-400">Completed</div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Assessment Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-gray-200 dark:border-white/10">
              <h2 className="text-xl font-bold mb-4">Cognitive Assessment</h2>
              <p className="text-slate-500 mb-6">
                Evaluate your critical thinking, learning agility, and knowledge acquisition capabilities.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <span className="text-blue-500 font-bold">01</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Critical Thinking</h3>
                      <p className="text-sm text-slate-500">Analytical reasoning</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    Start
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <span className="text-blue-500 font-bold">02</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Learning Agility</h3>
                      <p className="text-sm text-slate-500">Adaptability to new concepts</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg cursor-not-allowed">
                    Locked
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <span className="text-blue-500 font-bold">03</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Knowledge Base</h3>
                      <p className="text-sm text-slate-500">Domain expertise</p>
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
                <div className="p-4 border border-gray-200 dark:border-white/10 rounded-xl hover:border-blue-500/50 transition-colors cursor-pointer">
                  <div className="w-full h-32 bg-gradient-to-br from-blue-500/20 to-blue-700/20 rounded-lg mb-3 flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-blue-500" />
                  </div>
                  <h3 className="font-semibold mb-1">Critical Thinking 101</h3>
                  <p className="text-sm text-slate-500">Course • 60 min</p>
                </div>
                
                <div className="p-4 border border-gray-200 dark:border-white/10 rounded-xl hover:border-blue-500/50 transition-colors cursor-pointer">
                  <div className="w-full h-32 bg-gradient-to-br from-blue-500/20 to-blue-700/20 rounded-lg mb-3 flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-blue-500" />
                  </div>
                  <h3 className="font-semibold mb-1">Problem Solving</h3>
                  <p className="text-sm text-slate-500">Workshop • 90 min</p>
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
                    <span className="text-slate-500">Critical Thinking</span>
                    <span className="font-semibold">95%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '95%' }} />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500">Learning Agility</span>
                    <span className="font-semibold">88%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '88%' }} />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500">Knowledge</span>
                    <span className="font-semibold">92%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '92%' }} />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-gray-200 dark:border-white/10">
              <h3 className="font-bold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full p-3 text-left bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-blue-500/10 hover:text-blue-500 transition-colors">
                  <span className="font-medium">Continue Assessment</span>
                </button>
                <button className="w-full p-3 text-left bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-blue-500/10 hover:text-blue-500 transition-colors">
                  <span className="font-medium">View Report</span>
                </button>
                <button className="w-full p-3 text-left bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-blue-500/10 hover:text-blue-500 transition-colors">
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
