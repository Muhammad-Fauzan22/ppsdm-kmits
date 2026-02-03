"use client";

import { useState, forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from "react";

// Text Input
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: string;
    hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, icon, hint, className = "", ...props }, ref) => {
        return (
            <div className="space-y-1.5">
                {label && (
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                 <div className="relative">
                    {icon && (
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            <span className="material-symbols-outlined text-[20px]">{icon}</span>
                        </span>
                    )}
                    <input
                        ref={ref}
                        className={`w-full ${icon ? "pl-10" : "pl-4"} pr-4 py-2.5 border rounded-xl bg-white dark:bg-card-dark outline-none transition-all ${error
                                ? "border-red-500 focus:ring-2 focus:ring-red-200"
                                : "border-border-light dark:border-border-dark focus:border-primary focus:ring-2 focus:ring-primary/20"
                            } ${className}`}
                        {...props}
                    />
                </div>
                {hint && !error && (
                    <p className="text-xs text-gray-600">{hint}</p>
                )}
                {error && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">error</span>
                        {error}
                    </p>
                )}
            </div>
        );
    }
);
Input.displayName = "Input";

// Textarea
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, hint, className = "", ...props }, ref) => {
        return (
            <div className="space-y-1.5">
                {label && (
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                 <textarea
                    ref={ref}
                    className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-card-dark outline-none transition-all resize-none ${error
                            ? "border-red-500 focus:ring-2 focus:ring-red-200"
                            : "border-border-light dark:border-border-dark focus:border-primary focus:ring-2 focus:ring-primary/20"
                        } ${className}`}
                    rows={4}
                    {...props}
                />
                {hint && !error && (
                    <p className="text-xs text-gray-600">{hint}</p>
                )}
                {error && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">error</span>
                        {error}
                    </p>
                )}
            </div>
        );
    }
);
Textarea.displayName = "Textarea";

// Select
interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
    label?: string;
    error?: string;
    options: SelectOption[];
    placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, options, placeholder, className = "", ...props }, ref) => {
        return (
            <div className="space-y-1.5">
                {label && (
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                <div className="relative">
                     <select
                        ref={ref}
                        className={`w-full px-4 py-2.5 border rounded-xl bg-white dark:bg-card-dark outline-none transition-all appearance-none cursor-pointer ${error
                                ? "border-red-500 focus:ring-2 focus:ring-red-200"
                                : "border-border-light dark:border-border-dark focus:border-primary focus:ring-2 focus:ring-primary/20"
                            } ${className}`}
                        {...props}
                    >
                        {placeholder && (
                            <option value="" disabled>
                                {placeholder}
                            </option>
                        )}
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                        <span className="material-symbols-outlined text-[20px]">expand_more</span>
                    </span>
                </div>
                {error && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">error</span>
                        {error}
                    </p>
                )}
            </div>
        );
    }
);
Select.displayName = "Select";

// Checkbox
interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    label: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ label, className = "", ...props }, ref) => {
        return (
            <label className={`flex items-center gap-3 cursor-pointer group ${className}`}>
                <div className="relative">
                    <input
                        ref={ref}
                        type="checkbox"
                        className="peer sr-only"
                        {...props}
                    />
                    <div className="size-5 border-2 border-border-light dark:border-border-dark rounded-md peer-checked:border-primary peer-checked:bg-primary transition-all flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-[16px] opacity-0 peer-checked:opacity-100 transition-opacity">
                            check
                        </span>
                    </div>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                    {label}
                </span>
            </label>
        );
    }
);
Checkbox.displayName = "Checkbox";

// Radio Button
interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    label: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
    ({ label, className = "", ...props }, ref) => {
        return (
            <label className={`flex items-center gap-3 cursor-pointer group ${className}`}>
                <div className="relative">
                    <input
                        ref={ref}
                        type="radio"
                        className="peer sr-only"
                        {...props}
                    />
                    <div className="size-5 border-2 border-border-light dark:border-border-dark rounded-full peer-checked:border-primary transition-all flex items-center justify-center">
                        <div className="size-2.5 bg-primary rounded-full scale-0 peer-checked:scale-100 transition-transform" />
                    </div>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                    {label}
                </span>
            </label>
        );
    }
);
Radio.displayName = "Radio";

// Toggle Switch
interface ToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    disabled?: boolean;
}

export function Toggle({ checked, onChange, label, disabled = false }: ToggleProps) {
    return (
        <label className={`flex items-center gap-3 ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                disabled={disabled}
                onClick={() => !disabled && onChange(!checked)}
                className={`relative w-11 h-6 rounded-full transition-colors ${checked ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"
                    }`}
            >
                <span
                    className={`absolute top-0.5 left-0.5 size-5 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0"
                        }`}
                />
            </button>
            {label && (
                <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
            )}
        </label>
    );
}

// Search Input
interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    onClear?: () => void;
}

export function SearchInput({
    value,
    onChange,
    placeholder = "Search...",
    onClear,
}: SearchInputProps) {
     return (
        <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <span className="material-symbols-outlined text-[20px]">search</span>
            </span>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-10 pr-10 py-2.5 border border-border-light dark:border-border-dark rounded-xl bg-white dark:bg-card-dark outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
            {value && (
                <button
                    onClick={() => {
                        onChange("");
                        onClear?.();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-600"
                >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
            )}
        </div>
    );
}

// Date Picker Input
interface DateInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    label?: string;
    error?: string;
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
    ({ label, error, className = "", ...props }, ref) => {
        return (
            <div className="space-y-1.5">
                {label && (
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <input
                        ref={ref}
                        type="date"
                        className={`w-full px-4 py-2.5 border rounded-xl bg-white dark:bg-card-dark outline-none transition-all ${error
                                ? "border-red-500"
                                : "border-border-light dark:border-border-dark focus:border-primary focus:ring-2 focus:ring-primary/20"
                            } ${className}`}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="text-xs text-red-500">{error}</p>
                )}
            </div>
        );
    }
);
DateInput.displayName = "DateInput";
