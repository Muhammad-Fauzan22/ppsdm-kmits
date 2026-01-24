"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface HeaderProps {
    variant?: "light" | "dark";
}

export function Header({ variant = "light" }: HeaderProps) {
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);

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
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    const navItems = [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Perpustakaan", href: "/perpustakaan" }, // Added Library link
        { label: "RPI Planning", href: "/rpi" },
        { label: "Portfolio", href: "/portfolio" },
    ];

    const isActive = (href: string) => pathname === href;

    const getPageContext = () => {
        if (pathname?.includes('/nexus')) return 'program pengembangan diri';
        if (pathname?.includes('/mentorship')) return 'sesi mentoring';
        return 'aktivitas';
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-white dark:bg-card-dark border-b border-border-light dark:border-border-dark px-4 lg:px-10 py-3 shadow-sm">
            <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                {/* Logo & Title */}
                <Link href="/" className="flex items-center gap-4 text-primary dark:text-white hover:opacity-80 transition-opacity">
                    <div className="size-8 flex items-center justify-center bg-primary rounded-lg text-white">
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
                                    ? "text-primary dark:text-white font-semibold border-b-2 border-primary pb-0.5"
                                    : "text-neutral-mid dark:text-gray-400 hover:text-primary dark:hover:text-white"
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                    <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>

                    {/* User Actions */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <button aria-label="User Profile" className="relative group flex items-center gap-2">
                                    <div
                                        className="bg-center bg-no-repeat bg-cover rounded-full size-10 ring-2 ring-offset-2 ring-gray-100 dark:ring-gray-700 dark:ring-offset-background-dark"
                                        style={{
                                            backgroundImage: user.user_metadata?.avatar_url
                                                ? `url("${user.user_metadata.avatar_url}")`
                                                : 'url("https://ui-avatars.com/api/?name=User&background=random")',
                                        }}
                                    ></div>
                                    <div className="text-left hidden xl:block">
                                        <p className="text-xs font-bold text-gray-700 dark:text-white line-clamp-1 max-w-[100px]">{user.email}</p>
                                        <p className="text-[10px] text-green-600 font-bold">Online</p>
                                    </div>

                                    {/* Dropdown for Logout */}
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-card-dark rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl"
                                        >
                                            Keluar
                                        </button>
                                    </div>
                                </button>
                            </>
                        ) : (
                            <Link href="/login" className="px-5 py-2 bg-primary text-white rounded-lg font-bold hover:bg-opacity-90 transition-all text-sm shadow-md">
                                Masuk
                            </Link>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Toggle */}
                <button aria-label="Toggle Mobile Menu" className="lg:hidden text-primary dark:text-white">
                    <span className="material-symbols-outlined text-3xl">menu</span>
                </button>
            </div>
        </header>
    );
}
