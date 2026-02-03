"use client";

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
