"use client";

import React, { useState } from 'react';
import { PersonalDashboard } from '@/components/member/PersonalDashboard';
import { ActivityCalendar } from '@/components/member/ActivityCalendar';
// import { TransparencyPortal } from '@/components/member/TransparencyPortal';
// import { KnowledgeHub } from '@/components/member/KnowledgeHub';
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  BookOpen,
  User,
  LogOut
} from 'lucide-react';

type TabType = 'dashboard' | 'activities'; // | 'transparency' | 'knowledge';

export default function MemberPortalPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'activities' as TabType, label: 'Activities', icon: Calendar },
    // { id: 'transparency' as TabType, label: 'Transparency', icon: FileText },
    // { id: 'knowledge' as TabType, label: 'Knowledge Hub', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">PPSDM KMITS</h1>
                <p className="text-xs text-slate-500">Member Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-slate-700">Member</span>
              </div>
              <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white/60 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <PersonalDashboard />}
        {activeTab === 'activities' && <ActivityCalendar />}
        {/* {activeTab === 'transparency' && <TransparencyPortal />} */}
        {/* {activeTab === 'knowledge' && <KnowledgeHub />} */}
      </main>
    </div>
  );
}
