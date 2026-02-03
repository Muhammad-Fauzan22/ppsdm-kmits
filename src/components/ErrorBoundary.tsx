"use client";

import { Component, ReactNode } from "react";
import Link from "next/link";

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Error caught by boundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-6">
                    <div className="max-w-md text-center">
                        <div className="size-20 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-4xl">
                                error
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Oops! Something went wrong
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            We encountered an unexpected error. Please try again or contact support if the problem persists.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => this.setState({ hasError: false })}
                                className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-light transition-colors"
                            >
                                Try Again
                            </button>
                            <Link
                                href="/"
                                className="px-6 py-2 border border-border-light dark:border-border-dark rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                Go Home
                            </Link>
                        </div>
                        {process.env.NODE_ENV === "development" && this.state.error && (
                            <details className="mt-6 text-left bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                                <summary className="cursor-pointer font-medium text-sm">
                                    Error Details (Dev Only)
                                </summary>
                                <pre className="mt-2 text-xs text-red-600 dark:text-red-400 overflow-auto">
                                    {this.state.error.message}
                                    {"\n"}
                                    {this.state.error.stack}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// 404 Not Found Component
export function NotFound() {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-6">
            <div className="max-w-md text-center">
                <div className="text-9xl font-bold text-primary/20 mb-4">404</div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Page Not Found
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-light transition-colors"
                >
                    <span className="material-symbols-outlined text-[20px]">home</span>
                    Back to Home
                </Link>
            </div>
        </div>
    );
}

// Empty state component
export function EmptyState({
    icon = "inbox",
    title = "No data",
    description = "There's nothing here yet.",
    action,
}: {
    icon?: string;
    title?: string;
    description?: string;
    action?: ReactNode;
}) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="size-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-gray-400 text-4xl">{icon}</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{title}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-sm">{description}</p>
            {action}
        </div>
    );
}

// Offline indicator
export function OfflineIndicator() {
    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-yellow-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
            <span className="material-symbols-outlined text-[18px]">wifi_off</span>
            <span className="text-sm font-medium">You&apos;re offline</span>
        </div>
    );
}
