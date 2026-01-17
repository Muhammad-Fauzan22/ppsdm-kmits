"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
    label: string;
    href: string;
    icon: string;
}

const navItems: NavItem[] = [
    { label: "Home", href: "/", icon: "home" },
    { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
    { label: "RPI", href: "/rpi", icon: "view_kanban" },
    { label: "Portfolio", href: "/portfolio", icon: "folder_special" },
    { label: "Activities", href: "/activities", icon: "checklist" },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-card-dark border-t border-border-light dark:border-border-dark md:hidden safe-area-bottom">
            <div className="flex items-center justify-around h-16">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors ${isActive
                                    ? "text-primary"
                                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                }`}
                        >
                            <span className={`material-symbols-outlined text-[22px] ${isActive ? "font-bold" : ""}`}>
                                {item.icon}
                            </span>
                            <span className="text-[10px] font-medium">{item.label}</span>
                            {isActive && (
                                <span className="absolute top-1 w-1 h-1 bg-primary rounded-full"></span>
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

// Toast notification component
export function Toast({
    message,
    type = "info",
    onClose,
}: {
    message: string;
    type?: "success" | "error" | "warning" | "info";
    onClose: () => void;
}) {
    const styles = {
        success: "bg-green-500",
        error: "bg-red-500",
        warning: "bg-yellow-500",
        info: "bg-primary",
    };

    const icons = {
        success: "check_circle",
        error: "error",
        warning: "warning",
        info: "info",
    };

    return (
        <div
            className={`fixed top-4 right-4 z-50 ${styles[type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in-right`}
        >
            <span className="material-symbols-outlined text-[20px]">{icons[type]}</span>
            <span className="font-medium">{message}</span>
            <button onClick={onClose} className="ml-2 hover:opacity-80">
                <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
        </div>
    );
}

// Floating Action Button
export function FAB({
    icon = "add",
    onClick,
    label,
}: {
    icon?: string;
    onClick: () => void;
    label?: string;
}) {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-20 right-4 md:bottom-8 z-40 bg-primary hover:bg-primary-light text-white rounded-full shadow-lg hover:shadow-xl transition-all group"
            style={{ width: label ? "auto" : "56px", height: "56px" }}
        >
            <div className="flex items-center justify-center gap-2 px-4">
                <span className="material-symbols-outlined text-[24px]">{icon}</span>
                {label && <span className="font-medium pr-1">{label}</span>}
            </div>
        </button>
    );
}

// Badge component
export function Badge({
    children,
    variant = "default",
    size = "md",
}: {
    children: React.ReactNode;
    variant?: "default" | "success" | "warning" | "error" | "info";
    size?: "sm" | "md";
}) {
    const variants = {
        default: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
        success: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        warning: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
        error: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        info: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    };

    const sizes = {
        sm: "text-xs px-2 py-0.5",
        md: "text-sm px-2.5 py-1",
    };

    return (
        <span className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]}`}>
            {children}
        </span>
    );
}

// Avatar component
export function Avatar({
    src,
    name,
    size = "md",
    showStatus,
    status = "online",
}: {
    src?: string;
    name: string;
    size?: "sm" | "md" | "lg" | "xl";
    showStatus?: boolean;
    status?: "online" | "offline" | "busy";
}) {
    const sizes = {
        sm: "size-8 text-xs",
        md: "size-10 text-sm",
        lg: "size-14 text-lg",
        xl: "size-20 text-xl",
    };

    const statusSizes = {
        sm: "size-2",
        md: "size-2.5",
        lg: "size-3",
        xl: "size-4",
    };

    const statusColors = {
        online: "bg-green-500",
        offline: "bg-gray-400",
        busy: "bg-red-500",
    };

    const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="relative inline-block">
            {src ? (
                <div
                    className={`${sizes[size]} rounded-full bg-cover bg-center`}
                    style={{ backgroundImage: `url("${src}")` }}
                />
            ) : (
                <div
                    className={`${sizes[size]} rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center`}
                >
                    {initials}
                </div>
            )}
            {showStatus && (
                <span
                    className={`absolute bottom-0 right-0 ${statusSizes[size]} ${statusColors[status]} rounded-full border-2 border-white dark:border-card-dark`}
                />
            )}
        </div>
    );
}

// Card component
export function Card({
    children,
    className = "",
    hover = false,
    onClick,
}: {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    onClick?: () => void;
}) {
    return (
        <div
            onClick={onClick}
            className={`bg-white dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark ${hover ? "hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer" : ""
                } ${onClick ? "cursor-pointer" : ""} ${className}`}
        >
            {children}
        </div>
    );
}
