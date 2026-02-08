"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  BookOpen,
  LayoutGrid,
  Trophy,
  Settings,
  User,
  HelpCircle,
  MessageSquare,
  ChevronRight,
  PieChart,
  Factory,
  Moon,
  Sun,
  Library,
  Map,
  Target,
  Users,
  ClipboardCheck,
  GraduationCap,
  Heart,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";

const navigation = [
  {
    title: "Overview",
    items: [
      { name: "Dashboard", href: "/dashboard/home", icon: Home },
      { name: "My Dimensions", href: "/dashboard/dimensions", icon: LayoutGrid },
      { name: "Analytics", href: "/dashboard/analytics", icon: PieChart },
    ]
  },
  {
    title: "Learning",
    items: [
      { name: "Library & AI", href: "/dashboard/library", icon: Library },
      { name: "My Courses", href: "/dashboard/courses", icon: BookOpen },
      { name: "Assessments", href: "/dashboard/assessment", icon: ClipboardCheck },
    ]
  },
  {
    title: "Growth",
    items: [
      { name: "My Roadmap", href: "/dashboard/roadmap", icon: Map },
      { name: "Personal OS", href: "/dashboard/pos", icon: Target },
      { name: "Mentorship", href: "/dashboard/mentoring", icon: GraduationCap },
    ]
  },
  {
    title: "Community",
    items: [
      { name: "Study Groups", href: "/dashboard/community", icon: Users },
      { name: "Achievements", href: "/dashboard/achievements", icon: Trophy },
    ]
  },
  {
    title: "Account",
    items: [
      { name: "Profile", href: "/dashboard/profile", icon: User },
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
      { name: "Help", href: "/help", icon: HelpCircle },
    ]
  },
  {
    title: "Admin",
    items: [
      { name: "Factory", href: "/admin/factory", icon: Factory },
    ],
  }
];

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
      aria-label="Toggle theme"
    >
      {resolvedTheme === "dark" ? (
        <Sun className="w-5 h-5 text-amber-400" />
      ) : (
        <Moon className="w-5 h-5 text-slate-600" />
      )}
    </button>
  );
}

export const Sidebar = React.memo(function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex h-screen w-72 flex-col fixed left-0 top-0 bg-white dark:bg-[#070B14] border-r border-slate-200 dark:border-white/5 z-50 overflow-hidden transition-colors duration-300">
      {/* Logo Section */}
      <div className="h-20 flex items-center px-6 border-b border-slate-200 dark:border-white/5 bg-white/50 dark:bg-[#070B14]/50 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
            <span className="font-bold text-white text-xl">P</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-800 dark:text-white tracking-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">PPSDM KMITS</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">Student Portal</span>
          </div>
        </Link>
      </div>

      {/* Navigation Scroll Area */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-hide">
        {navigation.map((section) => (
          <div key={section.title}>
            <h3 className="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
              {section.title}
            </h3>
            <div className="space-y-0.5">
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
                        "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300",
                        isActive
                          ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-600 dark:text-cyan-400"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                      )}
                    >
                      {/* Active Indicator Line */}
                      {isActive && (
                        <motion.div
                          layoutId="activeSidebar"
                          className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500 dark:bg-cyan-400 rounded-l-xl"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        />
                      )}

                      <item.icon
                        className={cn(
                          "w-4 h-4 transition-colors duration-300",
                          isActive ? "text-cyan-600 dark:text-cyan-400" : "text-slate-400 dark:text-slate-500 group-hover:text-cyan-500 dark:group-hover:text-cyan-400"
                        )}
                      />
                      <span className="flex-grow">{item.name}</span>

                      {isActive && (
                        <ChevronRight className="w-3 h-3 text-cyan-500/50" />
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
      <div className="p-3 border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#0A0F1A]">
        <div className="flex items-center gap-2 mb-2 px-1">
          <ThemeToggle />
          <span className="text-[10px] text-slate-500">Theme</span>
        </div>
        <Link href="/dashboard/profile" className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors group cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 p-[2px]">
            <div className="w-full h-full rounded-full bg-white dark:bg-[#0A0F1A] flex items-center justify-center text-slate-700 dark:text-white font-bold text-sm">
              U
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-800 dark:text-white truncate group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">Mahasiswa</p>
            <p className="text-[10px] text-slate-500 truncate">S1 Informatika</p>
          </div>
        </Link>
      </div>
    </aside>
  );
});

Sidebar.displayName = 'Sidebar';
