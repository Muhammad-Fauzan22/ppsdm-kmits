"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
    variant?: "admin" | "mentor";
}

export function Sidebar({ variant = "admin" }: SidebarProps) {
    const pathname = usePathname();

    const adminNav = [
        { label: "Dashboard", href: "/admin", icon: "dashboard" },
        { label: "Programs", href: "/admin/programs", icon: "school" },
        { label: "Users", href: "/admin/users", icon: "group" },
        { label: "Reports", href: "/admin/reports", icon: "bar_chart" },
        { label: "Settings", href: "/admin/settings", icon: "settings" },
    ];

    const mentorNav = [
        { label: "Dashboard", href: "/mentorship", icon: "dashboard" },
        { label: "My Mentees", href: "/mentorship/mentees", icon: "group" },
        { label: "Reports", href: "/mentorship/reports", icon: "description" },
        { label: "Schedule", href: "/mentorship/schedule", icon: "calendar_month" },
        { label: "Settings", href: "/mentorship/settings", icon: "settings" },
    ];

    const navItems = variant === "admin" ? adminNav : mentorNav;
    const title = variant === "admin" ? "Admin Console" : "Lecturer Portal";

    return (
        <aside className="w-64 flex-shrink-0 bg-white dark:bg-card-dark border-r border-border-light dark:border-border-dark flex flex-col h-full">
            <div className="flex flex-col h-full">
                {/* Brand */}
                <div className="p-4 border-b border-border-light dark:border-border-dark">
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="size-8 flex items-center justify-center rounded bg-primary text-white">
                            <span className="material-symbols-outlined text-lg">school</span>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-base font-bold leading-normal">PPSDM KMM</h1>
                            <p className="text-neutral-mid dark:text-gray-400 text-xs font-normal">{title}</p>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-2">
                    {navItems.map((item) => {
                        const active = pathname === item.href || (item.href !== "/admin" && item.href !== "/mentorship" && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${active
                                    ? "bg-primary text-white shadow-md shadow-primary/30"
                                    : "text-neutral-dark dark:text-gray-200 hover:bg-background-light dark:hover:bg-white/5"
                                    }`}
                            >
                                <span className={`material-symbols-outlined text-[24px] ${active ? "text-white" : "text-neutral-mid dark:text-gray-400"}`}>
                                    {item.icon}
                                </span>
                                <span className="text-sm font-medium leading-normal">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Help Widget */}
                <div className="p-4 border-t border-border-light dark:border-border-dark">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-transparent dark:from-primary/30 border border-primary/10 dark:border-primary/20">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="material-symbols-outlined text-primary dark:text-white">help</span>
                            <span className="font-bold text-sm text-primary dark:text-white">Need Help?</span>
                        </div>
                        <p className="text-xs text-neutral-mid dark:text-gray-300 mb-3">
                            Check the documentation for guidelines.
                        </p>
                        <button className="w-full py-1.5 text-xs font-bold text-primary bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-sm hover:bg-gray-50">
                            View Docs
                        </button>
                    </div>
                    <button className="mt-4 flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-dark dark:text-gray-200 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors w-full">
                        <span className="material-symbols-outlined">logout</span>
                        <p className="text-sm font-medium leading-normal">Log Out</p>
                    </button>
                </div>
            </div>
        </aside>
    );
}
