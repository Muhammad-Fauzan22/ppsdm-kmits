"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  BookOpen,
  LayoutGrid, // For Dimensions
  Trophy,
  Settings,
  User,
  LogOut,
  HelpCircle,
  MessageSquare,
  ChevronRight,
  PieChart
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  {
    title: "Overview",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: Home },
      { name: "My Dimensions", href: "/dashboard/dimensions", icon: LayoutGrid },
      { name: "Analytics", href: "/dashboard/analytics", icon: PieChart },
    ]
  },
  {
    title: "Learning",
    items: [
      { name: "My Courses", href: "/dashboard/courses", icon: BookOpen },
      { name: "Mentoring", href: "/dashboard/mentoring", icon: MessageSquare },
      { name: "Achievements", href: "/dashboard/achievements", icon: Trophy },
    ]
  },
  {
    title: "Account",
    items: [
      { name: "Profile Settings", href: "/dashboard/profile", icon: User },
      { name: "Help Center", href: "/help", icon: HelpCircle },
      { name: "Settings", href: "/settings", icon: Settings },
    ]
  }
];

export const Sidebar = React.memo(function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex h-screen w-72 flex-col fixed left-0 top-0 bg-[#070B14] border-r border-white/5 z-50 overflow-hidden">
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
        {navigation.map((section, idx) => (
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
                U
              </div>
              {/* Image would go here */}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate group-hover:text-cyan-400 transition-colors">Mahasiswa</p>
            <p className="text-xs text-slate-500 truncate">S1 Informatika</p>
          </div>
          <Settings className="w-5 h-5 text-slate-500 group-hover:rotate-90 transition-transform duration-500" />
        </Link>
      </div>
    </aside>
  );
});

Sidebar.displayName = 'Sidebar';
