'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardHeader from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const user = {
    name: 'Andi Pratama',
    level: 4,
    title: 'Level 4 Scholar',
    avatar: undefined, // Add avatar URL if available
  };

  return (
    <div className="min-h-screen bg-[#0f1923] flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <DashboardHeader 
        user={user}
        notificationCount={3}
        onMenuClick={() => setIsSidebarOpen(true)}
      />
      
      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
          user={user}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-[#0f1923]">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 md:p-6 lg:p-8 min-h-full"
          >
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
