import { useState, useEffect } from "react"

export interface Toast {
    id: string
    title?: string
    description?: string
    action?: React.ReactNode
    variant?: "default" | "destructive"
}

export function useToast() {
    const [toasts, setToasts] = useState<Toast[]>([])

    function toast({ title, description, variant }: Omit<Toast, "id">) {
        const id = Math.random().toString(36).substring(2, 9)
        const newToast = { id, title, description, variant }
        setToasts((prev) => [...prev, newToast])

        // Simple console log for now as fallback
        // Auto dismiss
        setTimeout(() => {
            dismiss(id)
        }, 3000)

        return {
            id,
            dismiss: () => dismiss(id),
            update: (props: Partial<Toast>) => {
                setToasts((prev) =>
                    prev.map((t) => (t.id === id ? { ...t, ...props } : t))
                )
            },
        }
    }

    function dismiss(toastId?: string) {
        setToasts((prev) => prev.filter((toast) => toast.id !== toastId))
    }

    return {
        toasts,
        toast,
        dismiss,
    }
}
