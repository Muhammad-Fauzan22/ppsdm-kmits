"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SupervisorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', path: '/supervisor/dashboard', icon: 'dashboard' },
        { id: 'approvals', label: 'Approvals', path: '/supervisor/approvals', icon: 'check_circle' },
        { id: 'students', label: 'Students', path: '/supervisor/students', icon: 'group' }, // Placeholder
        { id: 'analytics', label: 'Analytics', path: '/supervisor/analytics', icon: 'analytics' },
        { id: 'settings', label: 'Settings', path: '/supervisor/settings', icon: 'settings' },
    ];

    return (
        <div className="min-h-screen bg-[#0E1015] text-white font-sans flex flex-col">
            {/* Navbar */}
            <nav className="h-16 border-b border-[#2D303E] bg-[#161920] flex items-center justify-between px-8 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <div className="size-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-white">shield_person</span>
                    </div>
                    <span className="font-bold text-lg">PPSDM Supervisor</span>

                    <div className="h-6 w-px bg-[#2D303E] mx-2"></div>

                    <div className="flex gap-1">
                        {navItems.slice(0, 3).map(item => (
                            <Link
                                key={item.id}
                                href={item.path}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${pathname.includes(item.id) ? 'bg-[#2D303E] text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <span className="material-symbols-outlined text-gray-400 absolute left-3 top-2 text-lg">search</span>
                        <input type="text" placeholder="Search student..." className="bg-[#0E1015] border border-[#2D303E] rounded-lg pl-10 pr-4 py-1.5 text-sm text-white focus:border-blue-500 outline-none w-64 transition-colors" />
                    </div>
                    <button className="bg-[#2D303E] p-2 rounded-full hover:bg-gray-700 transition-colors relative">
                        <span className="material-symbols-outlined text-gray-300">notifications</span>
                        <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full"></span>
                    </button>
                    <div className="size-9 rounded-full bg-orange-100 border border-[#2D303E] overflow-hidden">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Prof" className="w-full h-full" alt="Supervisor profile picture" />
                    </div>
                </div>
            </nav>

            {/* Content */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
