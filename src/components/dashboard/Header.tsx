'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  user?: {
    name: string;
    avatar?: string;
    level?: number;
  };
  notificationCount?: number;
  onMenuClick?: () => void;
}

export default function DashboardHeader({ 
  user = { name: 'Andi Pratama', level: 4 }, 
  notificationCount = 3,
  onMenuClick 
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const notifications = [
    { id: 1, title: 'Goal Milestone Reached', message: 'You completed 75% of EQ Training', time: '10 min ago', unread: true },
    { id: 2, title: 'New Badge Earned', message: 'Critical Thinker Level 2 unlocked', time: '2h ago', unread: true },
    { id: 3, title: 'Assessment Due', message: 'Complete your monthly check-in', time: '1 day ago', unread: false },
  ];

  return (
    <header className="h-16 flex items-center justify-between border-b border-white/[0.08] bg-[#101418] px-4 sm:px-6 z-20 shrink-0">
      {/* Left side - Logo and menu */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden text-white p-2 hover:bg-white/5 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <Link href="/dashboard" className="flex items-center gap-3 text-white">
          <div className="w-8 h-8 bg-[#003366] rounded flex items-center justify-center text-white font-bold text-lg">
            K
          </div>
          <h2 className="text-white text-lg font-bold tracking-tight hidden sm:block">PPSDM KMITS</h2>
        </Link>
      </div>

      {/* Center - Search bar */}
      <div className="flex flex-1 justify-center max-w-xl px-4 sm:px-8">
        <label className="relative flex w-full items-center">
          <span className="absolute left-3 text-slate-300 material-symbols-outlined">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resources, goals, or mentors..."
            className="w-full bg-[#1e2732] border border-white/[0.08] text-sm rounded-lg py-2 pl-10 pr-4 text-slate-200 focus:ring-1 focus:ring-[#003366] focus:border-[#003366] placeholder-slate-400 transition-colors outline-none"
          />
        </label>
      </div>

      {/* Right side - User info, notifications, avatar */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="text-white text-right hidden md:block">
          <p className="text-xs text-slate-300">{getGreeting()},</p>
          <p className="text-sm font-semibold">{user.name}</p>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined">notifications</span>
            {notificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#101418]"></span>
            )}
          </button>

          {/* Notification Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-80 bg-[#151e29] border border-white/[0.08] rounded-xl shadow-xl z-50 overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08]">
                  <h3 className="text-white font-semibold text-sm">Notifications</h3>
                  <button className="text-xs text-[#FFD700] hover:text-white transition-colors">
                    Mark all read
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`px-4 py-3 border-b border-white/[0.04] hover:bg-white/5 transition-colors cursor-pointer ${
                        notif.unread ? 'bg-[#003366]/10' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${notif.unread ? 'bg-[#FFD700]' : 'bg-slate-500'}`} />
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">{notif.title}</p>
                          <p className="text-slate-300 text-xs mt-0.5">{notif.message}</p>
                          <p className="text-slate-400 text-[10px] mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-white/[0.08]">
                  <Link 
                    href="/dashboard/notifications"
                    className="text-xs text-[#FFD700] hover:text-white transition-colors flex items-center justify-center gap-1"
                    onClick={() => setShowNotifications(false)}
                  >
                    View all notifications
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Avatar */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-9 h-9 rounded-full bg-cover bg-center border border-white/[0.08] cursor-pointer hover:border-[#FFD700]/50 transition-colors overflow-hidden"
            style={{ 
              backgroundImage: user.avatar 
                ? `url(${user.avatar})` 
                : 'linear-gradient(135deg, #003366 0%, #1A4D80 100%)' 
            }}
            aria-label="User menu"
          >
            {!user.avatar && (
              <div className="w-full h-full flex items-center justify-center text-white font-semibold text-sm">
                {user.name.charAt(0)}
              </div>
            )}
          </button>

          {/* User Menu Dropdown */}
          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-56 bg-[#151e29] border border-white/[0.08] rounded-xl shadow-xl z-50 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-white/[0.08]">
                  <p className="text-white font-semibold text-sm">{user.name}</p>
                  <p className="text-[#FFD700] text-xs">Level {user.level} Scholar</p>
                </div>
                <div className="py-1">
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center gap-3 px-4 py-2 text-slate-300 hover:text-white hover:bg-white/5 transition-colors text-sm"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <span className="material-symbols-outlined text-sm">person</span>
                    Profile
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-3 px-4 py-2 text-slate-300 hover:text-white hover:bg-white/5 transition-colors text-sm"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <span className="material-symbols-outlined text-sm">settings</span>
                    Settings
                  </Link>
                </div>
                <div className="border-t border-white/[0.08] py-1">
                  <Link
                    href="/auth/logout"
                    className="flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-sm"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <span className="material-symbols-outlined text-sm">logout</span>
                    Log Out
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showNotifications || showUserMenu) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
        />
      )}
    </header>
  );
}
