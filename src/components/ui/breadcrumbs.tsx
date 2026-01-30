"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export function Breadcrumbs({ className }: { className?: string }) {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);

    // Don't show on dashboard root as it's the home
    if (pathname === "/dashboard") return null;

    return (
        <nav aria-label="Breadcrumb" className={cn("flex items-center text-sm text-slate-500 dark:text-slate-400 mb-4", className)}>
            <div className="flex items-center hover:text-slate-900 dark:hover:text-white transition-colors">
                <Link href="/dashboard" aria-label="Home">
                    <Home className="w-4 h-4" />
                </Link>
            </div>
            {segments.map((segment, index) => {
                const isLast = index === segments.length - 1;
                // Build the path up to this segment. 
                // Note: This simple logic assumes route structure matches URL structure.
                const href = `/${segments.slice(0, index + 1).join("/")}`;

                // Format label: "my-course" -> "My Course"
                const label = segment
                    .replace(/-/g, " ")
                    .replace(/\b\w/g, (char) => char.toUpperCase());

                return (
                    <div key={href} className="flex items-center">
                        <ChevronRight className="w-4 h-4 mx-1 text-slate-400" />
                        {isLast ? (
                            <span className="font-medium text-slate-900 dark:text-white" aria-current="page">
                                {label}
                            </span>
                        ) : (
                            <Link href={href} className="hover:text-slate-900 dark:hover:text-white transition-colors">
                                {label}
                            </Link>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
