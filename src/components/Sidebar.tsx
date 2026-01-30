"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface SidebarProps {
    variant?: "admin" | "mentor" | "student";
}

import { NAV_CONFIG } from "@/config/nav";

export function Sidebar({ variant = "admin" }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const navItems = NAV_CONFIG[variant];
    const title = variant === "admin" ? "Admin Console" :
        variant === "mentor" ? "Lecturer Portal" : "Student Hub";

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/auth/login");
    };

    const handleViewDocs = () => {
        window.open("/help", "_blank");
    };

    return (
        <aside className="w-64 flex-shrink-0 bg-background dark:bg-card border-r border-border flex flex-col h-full">
            <div className="flex flex-col h-full">
                {/* Brand */}
                <div className="p-4 border-b border-border">
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="size-8 flex items-center justify-center rounded bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                            <span className="material-symbols-outlined text-lg">school</span>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-base font-bold leading-normal text-foreground">PPSDM KMM</h1>
                            <p className="text-muted-foreground text-xs font-normal">{title}</p>
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
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                            >
                                <span className={`material-symbols-outlined text-[24px] ${active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`}>
                                    {item.icon}
                                </span>
                                <span className="text-sm font-medium leading-normal">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Help Widget */}
                <div className="p-4 border-t border-border">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/10">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="material-symbols-outlined text-primary">help</span>
                            <span className="font-bold text-sm text-foreground">Need Help?</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">
                            Check the documentation for guidelines.
                        </p>
                        <button
                            onClick={handleViewDocs}
                            className="w-full py-1.5 text-xs font-bold text-primary bg-muted rounded-lg border border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all"
                        >
                            View Docs
                        </button>
                    </div>
                    <button
                        aria-label="Log Out"
                        onClick={handleLogout}
                        className="mt-4 flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors w-full"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        <p className="text-sm font-medium leading-normal">Log Out</p>
                    </button>
                </div>
            </div>
        </aside>
    );
}
