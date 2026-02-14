"use client";

import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

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
        success: <CheckCircle className="w-5 h-5" />,
        error: <AlertCircle className="w-5 h-5" />,
        warning: <AlertTriangle className="w-5 h-5" />,
        info: <Info className="w-5 h-5" />,
    };

    return (
        <div
            className={`fixed top-4 right-4 z-50 ${styles[type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in-right`}
        >
            {icons[type]}
            <span className="font-medium">{message}</span>
            <button onClick={onClose} className="ml-2 hover:opacity-80">
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}
