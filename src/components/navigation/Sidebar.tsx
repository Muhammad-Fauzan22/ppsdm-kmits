'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Home,
  BookOpen,
  LayoutGrid,
  Trophy,
  Settings,
  User,
  LogOut,
  HelpCircle,
  MessageSquare,
  PieChart,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  href: string;
  icon: any;
  badge?: string | number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navigation: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: Home },
      { name: 'My Dimensions', href: '/dashboard/dimensions', icon: LayoutGrid },
      { name: 'Analytics', href: '/dashboard/analytics', icon: PieChart },
    ]
  },
  {
    title: 'Learning',
    items: [
      { name: 'My Courses', href: '/dashboard/courses', icon: BookOpen },
      { name: 'Mentoring', href: '/dashboard/mentoring', icon: MessageSquare },
      { name: 'Achievements', href: '/dashboard/achievements', icon: Trophy },
    ]
  },
  {
    title: 'Account',
    items: [
      { name: 'Profile Settings', href: '/dashboard/profile', icon: User },
      { name: 'Help Center', href: '/help', icon: HelpCircle },
      { name: 'Settings', href: '/settings', icon: Settings },
    ]
  }
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  user?: {
    name: string;
    avatar?: string;
    role?: string;
  };
}

export const Sidebar = React.memo(function Sidebar({ 
  isOpen = true, 
  onClose,
  user = { name: 'Mahasiswa', role: 'S1 Informatika' }
}: SidebarProps) {
  const pathname = usePathname();

  const handleLogout = () => {
    // Implement logout logic here
    console.log('Logging out...');
  };

  const sidebarContent = (
    <>
      {/* Logo Section */}
      <div className="h-20 flex items-center px-8 border-b border-white/5 bg-[#070B14]/50 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
            <span className="font-bold text-white text-xl">P</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white tracking-tight group-hover:text-cyan-400 transition-colors">PPSDM KMITS</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">Student Hub</span>
          </div>
        </Link>
      </div>

      {/* Navigation Scroll Area */}
      <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-8 scrollbar-hide">
        {navigation.map((section) => (
          <div key={section.title}>
            <h3 className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              {section.title}
              <div className="h-px bg-white/5 flex-grow" />
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="relative group block"
                  >
                    <div
                      className={cn(
                        "relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300",
                        isActive
                          ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-400"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      )}
                    >
                      {/* Active Indicator Line */}
                      {isActive && (
                        <motion.div
                          layoutId="activeSidebar"
                          className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 rounded-l-xl"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        />
                      )}

                      <item.icon
                        className={cn(
                          "w-5 h-5 transition-colors duration-300",
                          isActive ? "text-cyan-400" : "text-slate-500 group-hover:text-cyan-400"
                        )}
                      />
                      <span className="flex-grow">{item.name}</span>

                      {item.badge && (
                        <span className="bg-cyan-500/20 text-cyan-400 text-xs font-bold px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}

                      {isActive && (
                        <ChevronRight className="w-4 h-4 text-cyan-500/50" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-white/5 bg-[#0A0F1A]">
        <Link href="/dashboard/profile" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 p-[2px]">
            <div className="w-full h-full rounded-full bg-[#0A0F1A] border border-transparent overflow-hidden">
              <div className="w-full h-full bg-slate-700 flex items-center justify-center text-white font-bold">
                {user.name.charAt(0)}
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate group-hover:text-cyan-400 transition-colors">{user.name}</p>
            <p className="text-xs text-slate-500 truncate">{user.role}</p>
          </div>
          <Settings className="w-5 h-5 text-slate-500 group-hover:rotate-90 transition-transform duration-500" />
        </Link>
        
        <button
          onClick={handleLogout}
          className="mt-3 flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Log Out</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex h-screen w-72 flex-col fixed left-0 top-0 bg-[#070B14] border-r border-white/5 z-50 overflow-hidden">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar (Drawer) */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-[#070B14] border-r border-white/5 flex flex-col z-50 overflow-hidden"
          >
            {/* Mobile header with close button */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
              <Link href="/" className="flex items-center gap-3 text-white" onClick={onClose}>
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded flex items-center justify-center text-white font-bold text-lg">
                  P
                </div>
                <h2 className="text-white text-lg font-bold tracking-tight">PPSDM KMITS</h2>
              </Link>
              <button 
                onClick={onClose}
                className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
                aria-label="Close menu"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
            
            {/* Scrollable content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {sidebarContent}
            </div>
          </motion.aside>
        </>
      )}
    </>
  );
});

Sidebar.displayName = 'Sidebar';
