"use client";

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
