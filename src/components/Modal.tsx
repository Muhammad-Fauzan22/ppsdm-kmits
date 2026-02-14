"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@/components/ui/Icon";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    size?: "sm" | "md" | "lg" | "xl" | "full";
    showCloseButton?: boolean;
}

export function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = "md",
    showCloseButton = true,
}: ModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null);

    const sizes = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        full: "max-w-4xl",
    };

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);

    // Close on overlay click
    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === overlayRef.current) onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={overlayRef}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={handleOverlayClick}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className={`w-full ${sizes[size]} bg-white dark:bg-card-dark rounded-2xl shadow-2xl overflow-hidden`}
                    >
                        {/* Header */}
                        {(title || showCloseButton) && (
                            <div className="flex items-center justify-between px-6 py-4 border-b border-border-light dark:border-border-dark">
                                {title && (
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                        {title}
                                    </h2>
                                )}
                                {showCloseButton && (
                                    <button
                                        onClick={onClose}
                                        className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        <Icon name="X" className="text-gray-500" />
                                    </button>
                                )}
                            </div>
                        )}
                        {/* Content */}
                        <div className="p-6">{children}</div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Confirmation Dialog
interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "info";
}

export function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "info",
}: ConfirmDialogProps) {
    const variants = {
        danger: {
            icon: "AlertTriangle",
            iconColor: "text-red-500 bg-red-100 dark:bg-red-900/30",
            buttonColor: "bg-red-500 hover:bg-red-600",
        },
        warning: {
            icon: "AlertCircle",
            iconColor: "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30",
            buttonColor: "bg-yellow-500 hover:bg-yellow-600",
        },
        info: {
            icon: "HelpCircle",
            iconColor: "text-blue-500 bg-blue-100 dark:bg-blue-900/30",
            buttonColor: "bg-primary hover:bg-primary-light",
        },
    };

    const style = variants[variant];

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={false}>
            <div className="text-center">
                <div className={`size-16 mx-auto rounded-full flex items-center justify-center ${style.iconColor} mb-4`}>
                    <Icon name={style.icon} size="3xl" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 border border-border-light dark:border-border-dark rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`flex-1 py-2.5 text-white rounded-lg font-medium transition-colors ${style.buttonColor}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

// Bottom Sheet (for mobile)
interface BottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
}

export function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
    const overlayRef = useRef<HTMLDivElement>(null);

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === overlayRef.current) onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={overlayRef}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleOverlayClick}
                    className="fixed inset-0 z-50 bg-black/50"
                >
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="absolute bottom-0 left-0 right-0 bg-white dark:bg-card-dark rounded-t-3xl max-h-[85vh] overflow-auto"
                    >
                        {/* Handle */}
                        <div className="flex justify-center pt-3 pb-2">
                            <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
                        </div>
                        {/* Title */}
                        {title && (
                            <div className="px-6 pb-4 border-b border-border-light dark:border-border-dark">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
                            </div>
                        )}
                        {/* Content */}
                        <div className="p-6">{children}</div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Dropdown Menu
interface DropdownItem {
    label: string;
    icon?: string;
    onClick: () => void;
    variant?: "default" | "danger";
}

interface DropdownProps {
    trigger: ReactNode;
    items: DropdownItem[];
    align?: "left" | "right";
}

export function Dropdown({ trigger, items, align = "right" }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute top-full mt-2 ${align === "right" ? "right-0" : "left-0"} min-w-48 bg-white dark:bg-card-dark rounded-xl shadow-xl border border-border-light dark:border-border-dark overflow-hidden z-50`}
                    >
                        {items.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    item.onClick();
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${item.variant === "danger" ? "text-red-500" : "text-gray-700 dark:text-gray-300"
                                    }`}
                            >
                                {item.icon && (
                                    <Icon name={item.icon || ''} size="md" className="text-[20px]" />
                                )}
                                <span className="font-medium">{item.label}</span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
