"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Library, Trophy, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/home", icon: Home },
  { name: "My Courses", href: "/courses", icon: BookOpen },
  { name: "Library", href: "/library", icon: Library },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r border-border">
      <div className="flex h-16 items-center px-6">
        <span className="text-xl font-bold text-primary">PPSDM KMITS</span>
      </div>
      <nav className="flex-1 space-y-1 px-4 py-4">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                isActive
                  ? "bg-secondary text-white"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-white",
                "group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors"
              )}
            >
              <item.icon
                className={cn(
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary",
                  "mr-3 h-5 w-5 flex-shrink-0"
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border">
        <div className="flex items-center">
          <div className="ml-3">
            <p className="text-xs font-medium text-white">Engineering Mode</p>
            <p className="text-xs text-muted-foreground">v3.0.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
