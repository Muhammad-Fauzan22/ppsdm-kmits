"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutDashboard, KanbanSquare, FolderHeart, ListTodo } from "lucide-react";

interface NavItem {
    label: string;
    href: string;
    icon: React.ElementType;
}

const navItems: NavItem[] = [
    { label: "Home", href: "/", icon: Home },
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "RPI", href: "/rpi", icon: KanbanSquare },
    { label: "Portfolio", href: "/portfolio", icon: FolderHeart },
    { label: "Activities", href: "/activities", icon: ListTodo },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-card-dark border-t border-border-light dark:border-border-dark md:hidden safe-area-bottom">
            <div className="flex items-center justify-around h-16">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                    const Icon = item.icon as any;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors ${isActive
                                ? "text-primary"
                                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                }`}
                        >
                            <Icon className="w-[22px] h-[22px]" />
                            <span className="text-[10px] font-medium">{item.label}</span>
                            {isActive && (
                                <span className="absolute top-1 w-1 h-1 bg-primary rounded-full"></span>
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
