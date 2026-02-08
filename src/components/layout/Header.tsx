"use client";

import { Bell, Search } from "lucide-react";
import { usePathname } from "next/navigation";

export function Header() {
    const pathname = usePathname();
    // Simple breadcrumb logic
    const pathSegments = pathname.split('/').filter(Boolean);
    const title = pathSegments.length > 1
        ? pathSegments[1].charAt(0).toUpperCase() + pathSegments[1].slice(1)
        : "Dashboard";

    return (
        <header className="h-20 flex items-center justify-between px-8 border-b border-slate-200 dark:border-white/5 bg-white/50 dark:bg-[#070B14]/50 backdrop-blur-xl z-40 transition-colors duration-300">
            {/* Left: Breadcrumbs / Page Title */}
            <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white capitalize">{title}</h1>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>PPSDM</span>
                    <span>/</span>
                    <span className="text-cyan-600 dark:text-cyan-400 capitalize">{title}</span>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative hidden md:block group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-cyan-500 dark:group-focus-within:text-cyan-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 w-64 transition-all"
                    />
                </div>

                <button className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-[#070B14]" />
                </button>
            </div>
        </header>
    );
}
