"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface HeaderProps {
    variant?: "light" | "dark";
}

export function Header({ variant = "light" }: HeaderProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, [supabase.auth]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/auth/login");
    };

    const navItems = [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Perpustakaan", href: "/perpustakaan" },
        { label: "RPI Planning", href: "/rpi" },
        { label: "Portfolio", href: "/portfolio" },
    ];

    const isActive = (href: string) => pathname === href;

    return (
        <header className="sticky top-0 z-50 w-full bg-background dark:bg-card border-b border-border px-4 lg:px-10 py-3 shadow-sm">
            <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                {/* Logo & Title */}
                <Link href="/" className="flex items-center gap-4 text-foreground hover:opacity-80 transition-opacity">
                    <div className="size-8 flex items-center justify-center bg-primary rounded-lg text-primary-foreground shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-xl">school</span>
                    </div>
                    <h2 className="text-xl font-bold tracking-tight">PPSDM KMM</h2>
                </Link>

                {/* Global Menu */}
                <div className="hidden lg:flex flex-1 justify-end items-center gap-8">
                    <nav className="flex items-center gap-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`text-sm font-medium transition-colors ${isActive(item.href)
                                    ? "text-primary font-semibold border-b-2 border-primary pb-0.5"
                                    : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                    <div className="h-6 w-px bg-border"></div>

                    {/* User Actions */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <button aria-label="User Profile" className="relative group flex items-center gap-2">
                                    <div
                                        className="bg-center bg-no-repeat bg-cover rounded-full size-10 ring-2 ring-offset-2 ring-background ring-border"
                                        style={{
                                            backgroundImage: user.user_metadata?.avatar_url
                                                ? `url("${user.user_metadata.avatar_url}")`
                                                : 'url("https://ui-avatars.com/api/?name=User&background=random")',
                                        }}
                                    ></div>
                                    <div className="text-left hidden xl:block">
                                        <p className="text-xs font-bold text-foreground line-clamp-1 max-w-[100px]">{user.email}</p>
                                        <p className="text-[10px] text-green-500 font-bold">Online</p>
                                    </div>

                                    {/* Dropdown for Logout */}
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-popover rounded-xl shadow-xl border border-border opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-xl font-medium"
                                        >
                                            Keluar
                                        </button>
                                    </div>
                                </button>
                            </>
                        ) : (
                            <Link href="/auth/login" className="px-5 py-2 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-all text-sm shadow-md shadow-primary/20">
                                Masuk
                            </Link>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    aria-label="Toggle Mobile Menu"
                    className="lg:hidden text-foreground"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <span className="material-symbols-outlined text-3xl">
                        {mobileMenuOpen ? "close" : "menu"}
                    </span>
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 right-0 bg-background dark:bg-card border-b border-border shadow-lg">
                    <nav className="flex flex-col p-4 gap-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive(item.href)
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                        {user ? (
                            <button
                                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                                className="px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 text-left"
                            >
                                Keluar
                            </button>
                        ) : (
                            <Link
                                href="/auth/login"
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-4 py-3 rounded-lg text-sm font-medium bg-primary text-primary-foreground text-center"
                            >
                                Masuk
                            </Link>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}
