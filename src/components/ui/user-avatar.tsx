"use client";

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
