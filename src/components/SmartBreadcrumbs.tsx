'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

// Peta nama rute agar lebih manusiawi (bukan "dashboard", tapi "Beranda")
const routeNameMap: Record<string, string> = {
    student: 'Kampus',
    dashboard: 'Dashboard',
    library: 'Perpustakaan',
    courses: 'Mata Kuliah',
    upload: 'Upload Materi',
    settings: 'Pengaturan',
    admin: 'Pusat Komando',
    users: 'Pengguna',
    analytics: 'Analisis Data',
    pos: 'Personal OS',
    community: 'Komunitas',
};

export default function SmartBreadcrumbs() {
    const pathname = usePathname();

    // Jangan tampilkan di halaman home public
    if (pathname === '/') return null;

    const pathSegments = pathname.split('/').filter((segment) => segment !== '');

    return (
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center text-sm font-medium text-slate-500">
            <motion.ol
                className="flex items-center space-x-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
            >
                {/* Home Link */}
                <li>
                    <Link
                        href="/"
                        className="flex items-center hover:text-[#013880] dark:hover:text-blue-400 transition-colors duration-200"
                    >
                        <Home className="h-4 w-4" />
                    </Link>
                </li>

                {pathSegments.map((segment, index) => {
                    // Buat URL akumulatif
                    const href = `/${pathSegments.slice(0, index + 1).join('/')}`;

                    // Cek apakah ini segmen terakhir (current page)
                    const isLast = index === pathSegments.length - 1;

                    // Format nama: Cek map, atau format kapital jika UUID/ID
                    let displayName = routeNameMap[segment] || segment;

                    // Jika segment terlihat seperti ID panjang, pendekkan
                    if (segment.length > 20) {
                        displayName = 'Detail Item';
                    } else {
                        // Capitalize
                        displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
                    }

                    return (
                        <li key={href} className="flex items-center">
                            <ChevronRight className="h-4 w-4 text-slate-300 mx-1" />
                            {isLast ? (
                                <span className="text-[#013880] dark:text-blue-400 font-bold cursor-default">
                                    {displayName}
                                </span>
                            ) : (
                                <Link
                                    href={href}
                                    className="hover:text-[#FFBD07] dark:hover:text-yellow-400 transition-colors duration-200"
                                >
                                    {displayName}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </motion.ol>
        </nav>
    );
}
