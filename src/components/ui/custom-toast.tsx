"use client";

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
