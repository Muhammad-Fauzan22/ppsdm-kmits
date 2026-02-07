"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, LayoutDashboard, KanbanSquare, FolderHeart, Trophy, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
    label: string;
    href: string;
    icon: LucideIcon;
    badge?: number;
}

const navItems: NavItem[] = [
    { label: "Home", href: "/", icon: Home },
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "RPI", href: "/rpi", icon: KanbanSquare },
    { label: "Portfolio", href: "/portfolio", icon: FolderHeart },
    { label: "Quests", href: "/activities", icon: Trophy, badge: 3 },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden safe-area-bottom">
            {/* Backdrop blur background */}
            <div className="absolute inset-0 bg-[#0A0A0A]/90 backdrop-blur-xl border-t border-white/10" />

            <div className="relative flex items-center justify-around h-16">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="relative flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-all duration-300"
                        >
                            {/* Active glow effect */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeNavGlow"
                                    className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-gradient-to-r from-ml-cyan to-brand-blue"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    style={{
                                        boxShadow: '0 0 20px rgba(0, 188, 212, 0.6)'
                                    }}
                                />
                            )}

                            {/* Icon container */}
                            <motion.div
                                className={cn(
                                    "relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300",
                                    isActive
                                        ? "bg-gradient-to-br from-ml-cyan/20 to-brand-blue/20"
                                        : "hover:bg-white/5"
                                )}
                                whileTap={{ scale: 0.9 }}
                            >
                                <Icon
                                    className={cn(
                                        "w-5 h-5 transition-colors duration-300",
                                        isActive ? "text-ml-cyan" : "text-slate-400"
                                    )}
                                />

                                {/* Badge */}
                                {item.badge && item.badge > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center bg-ml-orange text-white text-[10px] font-bold rounded-full">
                                        {item.badge}
                                    </span>
                                )}
                            </motion.div>

                            {/* Label */}
                            <span className={cn(
                                "text-[10px] font-medium transition-colors duration-300",
                                isActive ? "text-ml-cyan" : "text-slate-500"
                            )}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
