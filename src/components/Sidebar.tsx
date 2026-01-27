"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
    variant?: "admin" | "mentor" | "student";
}

import { NAV_CONFIG } from "@/config/nav";

export function Sidebar({ variant = "admin" }: SidebarProps) {
    const pathname = usePathname();

    const navItems = NAV_CONFIG[variant];
    const title = variant === "admin" ? "Admin Console" :
        variant === "mentor" ? "Lecturer Portal" : "Student Hub";

    return (
        <aside className="w-64 flex-shrink-0 bg-[#0B0E14] border-r border-[#1B2128] flex flex-col h-full">
            <div className="flex flex-col h-full">
                {/* Brand */}
                <div className="p-4 border-b border-[#1B2128]">
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="size-8 flex items-center justify-center rounded bg-brand-blue text-white shadow-lg shadow-brand-blue/20">
                            <span className="material-symbols-outlined text-lg">school</span>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-base font-bold leading-normal text-white">PPSDM KMM</h1>
                            <p className="text-slate-500 text-xs font-normal">{title}</p>
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
                                aria-label={`Navigasi ke ${item.label}`}
                                aria-current={active ? "page" : undefined}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${active
                                    ? "bg-brand-blue/10 text-brand-blue font-medium"
                                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                <span className={`material-symbols-outlined text-[24px] ${active ? "text-brand-blue" : "text-slate-500 group-hover:text-white"}`}>
                                    {item.icon}
                                </span>
                                <span className="text-sm font-medium leading-normal">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Help Widget */}
                <div className="p-4 border-t border-[#1B2128]">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-brand-blue/10 to-transparent border border-brand-blue/10">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="material-symbols-outlined text-brand-blue">help</span>
                            <span className="font-bold text-sm text-white">Need Help?</span>
                        </div>
                        <p className="text-xs text-slate-400 mb-3">
                            Check the documentation for guidelines.
                        </p>
                        <button className="w-full py-1.5 text-xs font-bold text-brand-blue bg-[#1B2128] rounded-lg border border-brand-blue/20 hover:bg-brand-blue hover:text-white transition-all">
                            View Docs
                        </button>
                    </div>
                    <button aria-label="Log Out" className="mt-4 flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors w-full">
                        <span className="material-symbols-outlined">logout</span>
                        <p className="text-sm font-medium leading-normal">Log Out</p>
                    </button>
                </div>
            </div>
        </aside>
    );
}
