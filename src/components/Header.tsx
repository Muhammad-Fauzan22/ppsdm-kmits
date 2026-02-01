"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, User, LogOut, Menu, X, Globe, ExternalLink } from "lucide-react";

interface HeaderProps {
    variant?: "light" | "dark";
}

export function Header({ variant = "light" }: HeaderProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const supabase = createClient();

    // Handle Scroll Effect
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Auth State
    useEffect(() => {
        supabase.auth.getSession().then((response: any) => {
            setUser(response.data.session?.user ?? null);
        });
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
            setUser(session?.user ?? null);
        });
        return () => subscription.unsubscribe();
    }, [supabase.auth]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/auth/login");
    };

    // Official ITS Menu Structure
    const menuItems = [
        {
            label: "PROFIL ITS",
            id: "profil",
            links: [
                { label: "Sambutan Rektor", href: "https://www.its.ac.id/about-its/sambutan-rektor/", external: true },
                { label: "Sejarah", href: "https://www.its.ac.id/about-its/sejarah/", external: true },
                { label: "Visi & Misi", href: "https://www.its.ac.id/about-its/visi-misi/", external: true },
                { label: "Facts & Figures", href: "https://www.its.ac.id/about-its/facts-figures/", external: true },
            ]
        },
        {
            label: "AKADEMIK",
            id: "akademik",
            links: [
                { label: "Program Sarjana", href: "/#program-studi", external: false }, // Internal anchor to our landing page section
                { label: "Program Magister", href: "https://www.its.ac.id/admission/pascasarjana/", external: true },
                { label: "Program Doktor", href: "https://www.its.ac.id/admission/pascasarjana/", external: true },
                { label: "Kalender Akademik", href: "https://www.its.ac.id/akademik/kalender-akademik/", external: true },
            ]
        },
        {
            label: "BERITA & INOVASI",
            id: "berita",
            links: [
                { label: "ITS News (Official)", href: "https://www.its.ac.id/news/", external: true },
                { label: "PPSDM Updates", href: "/dashboard", external: false }, // Our Scraper Dashboard
                { label: "Riset & Inovasi", href: "https://www.its.ac.id/research-innovation/", external: true },
            ]
        },
        {
            label: "LAYANAN",
            id: "layanan",
            links: [
                { label: "Perpustakaan", href: "/perpustakaan", external: false },
                { label: "Directory", href: "https://www.its.ac.id/directory/", external: true },
                { label: "Campus Life", href: "https://www.its.ac.id/campus-life/", external: true },
            ]
        }
    ];

    return (
        <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? "bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-md shadow-md" : "bg-white dark:bg-[#0f172a]"}`}>

            {/* 1. TOP BAR (Official Institutional Links) */}
            <div className="bg-[#013880] text-white text-[10px] md:text-xs font-medium py-2 px-4 lg:px-10 hidden md:block">
                <div className="max-w-[1400px] mx-auto flex justify-between items-center">
                    <div className="flex gap-4 opacity-80">
                        <span>Institut Teknologi Sepuluh Nopember</span>
                    </div>
                    <div className="flex gap-6 tracking-wide">
                        <a href="https://www.its.ac.id/admission" target="_blank" className="hover:text-[#FFD700] transition-colors">CALON MAHASISWA</a>
                        <a href="https://www.its.ac.id/student" target="_blank" className="hover:text-[#FFD700] transition-colors">MAHASISWA</a>
                        <a href="https://www.its.ac.id/staff" target="_blank" className="hover:text-[#FFD700] transition-colors">DOSEN & STAF</a>
                        <a href="https://alumni.its.ac.id" target="_blank" className="hover:text-[#FFD700] transition-colors">ALUMNI</a>
                        <a href="https://my.its.ac.id" target="_blank" className="flex items-center gap-1 font-bold text-[#FFD700] hover:text-white transition-colors">
                            <User className="w-3 h-3" />
                            myITS
                        </a>
                    </div>
                </div>
            </div>

            {/* 2. MAIN NAVBAR */}
            <div className="border-b border-gray-100 dark:border-gray-800 px-4 lg:px-10 py-3 lg:py-4">
                <div className="max-w-[1400px] mx-auto flex items-center justify-between">

                    {/* LOGO */}
                    <Link href="/" className="flex items-center gap-3 group">
                        {/* ITS Logo Placeholder - Replace with Image if needed */}
                        <div className="relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-[#013880] text-white rounded-xl shadow-lg shadow-blue-900/20 group-hover:scale-105 transition-transform duration-300">
                            <span className="material-symbols-outlined text-2xl font-bold">school</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg md:text-xl font-bold text-[#013880] dark:text-blue-400 leading-none tracking-tight group-hover:text-blue-600 transition-colors">PPSDM KM</span>
                            <span className="text-[10px] md:text-xs font-bold text-slate-500 dark:text-slate-400 tracking-widest">ITS SURABAYA</span>
                        </div>
                    </Link>

                    {/* DESKTOP NAVIGATION (Aesthetic Dropdowns) */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {menuItems.map((item) => (
                            <div
                                key={item.id}
                                className="relative group"
                                onMouseEnter={() => setActiveDropdown(item.id)}
                                onMouseLeave={() => setActiveDropdown(null)}
                            >
                                <button className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-[#013880] dark:hover:text-blue-400 transition-colors uppercase tracking-wide">
                                    {item.label}
                                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${activeDropdown === item.id ? "rotate-180" : ""}`} />
                                </button>

                                <AnimatePresence>
                                    {activeDropdown === item.id && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 5 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute top-full left-0 w-56 pt-2 z-50"
                                        >
                                            <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden ring-1 ring-black/5">
                                                <div className="p-1 flex flex-col gap-0.5">
                                                    {item.links.map((link) => (
                                                        link.external ? (
                                                            <a
                                                                key={link.label}
                                                                href={link.href}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center justify-between px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-[#013880] dark:hover:text-blue-400 rounded-lg transition-colors"
                                                            >
                                                                {link.label}
                                                                <ExternalLink className="w-3 h-3 opacity-50" />
                                                            </a>
                                                        ) : (
                                                            <Link
                                                                key={link.label}
                                                                href={link.href}
                                                                className="block px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-[#013880] dark:hover:text-blue-400 rounded-lg transition-colors"
                                                            >
                                                                {link.label}
                                                            </Link>
                                                        )
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </nav>

                    {/* ACTION BUTTONS (Persistent) */}
                    <div className="hidden lg:flex items-center gap-3">
                        {/* Search (Visual) */}
                        <button className="p-2 text-slate-400 hover:text-[#013880] transition-colors">
                            <Search className="w-5 h-5" />
                        </button>

                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>

                        {user ? (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/dashboard"
                                    className="px-5 py-2.5 bg-[#013880] hover:bg-blue-700 text-white text-sm font-bold rounded-full shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 transition-all flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-lg">dashboard</span>
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="p-2.5 bg-gray-100 dark:bg-gray-800 text-slate-600 dark:text-slate-300 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"
                                    title="Logout"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link href="/auth/login" className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-[#013880] px-4 transition-colors">
                                    Masuk
                                </Link>
                                <Link
                                    href="/auth/register"
                                    className="px-6 py-2.5 bg-[#FFD700] hover:bg-yellow-400 text-[#013880] text-sm font-bold rounded-full shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/30 transition-all"
                                >
                                    Daftar Sekarang
                                </Link>
                            </>
                        )}
                    </div>

                    {/* MOBILE TOGGLE */}
                    <button
                        className="lg:hidden p-2 text-slate-700 dark:text-white"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                    </button>
                </div>
            </div>

            {/* MOBILE MENU OVERLAY */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-white dark:bg-[#0f172a] border-b border-gray-100 dark:border-gray-800 overflow-hidden shadow-xl"
                    >
                        <div className="p-4 flex flex-col gap-2 max-h-[80vh] overflow-y-auto">
                            {menuItems.map((item) => (
                                <div key={item.id} className="border-b border-gray-50 dark:border-gray-800 pb-2">
                                    <div className="px-2 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                                        {item.label}
                                    </div>
                                    <div className="flex flex-col gap-1 pl-2">
                                        {item.links.map((link) => (
                                            <a
                                                key={link.label}
                                                href={link.href}
                                                target={link.external ? "_blank" : "_self"}
                                                className="block px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                                            >
                                                {link.label}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            <div className="pt-4 flex flex-col gap-3">
                                {user ? (
                                    <>
                                        <Link href="/dashboard" className="w-full py-3 bg-[#013880] text-white font-bold rounded-xl text-center shadow-lg">
                                            Go to Dashboard
                                        </Link>
                                        <button onClick={handleLogout} className="w-full py-3 bg-red-50 text-red-600 font-bold rounded-xl text-center border border-red-100">
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/auth/login" className="w-full py-3 bg-gray-100 text-slate-700 font-bold rounded-xl text-center">
                                            Masuk Akun
                                        </Link>
                                        <Link href="/auth/register" className="w-full py-3 bg-[#FFD700] text-[#013880] font-bold rounded-xl text-center shadow-lg">
                                            Daftar Sekarang
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

