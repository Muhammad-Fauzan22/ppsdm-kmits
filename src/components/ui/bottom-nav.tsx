"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
    label: string;
    href: string;
    icon: string;
}

const navItems: NavItem[] = [
    { label: "Home", href: "/", icon: "home" },
    { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
    { label: "RPI", href: "/rpi", icon: "view_kanban" },
    { label: "Portfolio", href: "/portfolio", icon: "folder_special" },
    { label: "Activities", href: "/activities", icon: "checklist" },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-card-dark border-t border-border-light dark:border-border-dark md:hidden safe-area-bottom">
            <div className="flex items-center justify-around h-16">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors ${isActive
                                ? "text-primary"
                                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                }`}
                        >
                            <span className={`material-symbols-outlined text-[22px] ${isActive ? "font-bold" : ""}`}>
                                {item.icon}
                            </span>
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
