"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderProps {
    variant?: "light" | "dark";
}

export function Header({ variant = "light" }: HeaderProps) {
    const pathname = usePathname();

    const navItems = [
        { label: "Dashboard", href: "/dashboard" },
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
                    <div className="flex items-center gap-4">
                        <button
                            aria-label={`Buat ${getPageContext()} baru`}
                            className="flex items-center gap-2 cursor-pointer bg-primary hover:bg-opacity-90 transition-colors text-white text-sm font-bold h-10 px-5 rounded-lg shadow-md hover:shadow-lg"
                        >
                            <span className="material-symbols-outlined text-lg">add</span>
                            <span>New Activity</span>
                        </button>
                        <button aria-label="User Profile" className="relative group">
                            <div
                                className="bg-center bg-no-repeat bg-cover rounded-full size-10 ring-2 ring-offset-2 ring-gray-100 dark:ring-gray-700 dark:ring-offset-background-dark"
                                style={{
                                    backgroundImage:
                                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuClE0EM96SkM6uD--shNf9TkN55hiP_7YwI6Awx7_v_BQbCKaoxruCniB2yKxNCP7SpnAaI3u7yt23f8pf_txws30mxyqlTcNuLlzyW-qxkUwu4CO108XqnfyA7tpTI4ZvjQoNubGzpxQlJFMGAyTaocUrvthrIGfSoIyBIqFtkJhahbWSuJBgL8PFAyW3tMh-CKAolYhjUlmmxV4TlgXEhIEAdVc7Sg0IBeS0Zz_DXz8wHYz3uFtX7Oz_n6smU3KFkMv6LEpbaWG0")',
                                }}
                            ></div>
                            <span className="absolute bottom-0 right-0 size-3 bg-growth-green border-2 border-white dark:border-card-dark rounded-full"></span>
                        </button>
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
