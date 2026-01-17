import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { DimensionType } from "./database.types";

// Merge Tailwind classes with clsx
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Format date to readable string
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
        ...options,
    });
}

// Format relative time (e.g., "2 hours ago")
export function formatRelativeTime(date: string | Date): string {
    const d = typeof date === "string" ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return "just now";
    if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`;
    if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`;
    if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
    return formatDate(d);
}

// Dimension display names
export const dimensionLabels: Record<DimensionType, string> = {
    cognitive: "Kognitif",
    affective: "Afektif",
    psychomotor: "Psikomotorik",
    spiritual: "Spiritual",
    social: "Sosial",
    financial: "Finansial",
    health: "Kesehatan",
    character: "Karakter",
    environmental: "Lingkungan",
};

// Dimension colors
export const dimensionColors: Record<DimensionType, { bg: string; text: string; border: string }> = {
    cognitive: { bg: "bg-blue-500", text: "text-blue-500", border: "border-blue-500" },
    affective: { bg: "bg-pink-500", text: "text-pink-500", border: "border-pink-500" },
    psychomotor: { bg: "bg-orange-500", text: "text-orange-500", border: "border-orange-500" },
    spiritual: { bg: "bg-purple-500", text: "text-purple-500", border: "border-purple-500" },
    social: { bg: "bg-cyan-500", text: "text-cyan-500", border: "border-cyan-500" },
    financial: { bg: "bg-green-500", text: "text-green-500", border: "border-green-500" },
    health: { bg: "bg-red-500", text: "text-red-500", border: "border-red-500" },
    character: { bg: "bg-indigo-500", text: "text-indigo-500", border: "border-indigo-500" },
    environmental: { bg: "bg-teal-500", text: "text-teal-500", border: "border-teal-500" },
};

// Dimension icons
export const dimensionIcons: Record<DimensionType, string> = {
    cognitive: "psychology",
    affective: "favorite",
    psychomotor: "directions_run",
    spiritual: "self_improvement",
    social: "groups",
    financial: "payments",
    health: "fitness_center",
    character: "verified_user",
    environmental: "eco",
};

// Calculate overall score from dimension scores
export function calculateOverallScore(scores: { score: number }[]): number {
    if (scores.length === 0) return 0;
    const total = scores.reduce((acc, s) => acc + s.score, 0);
    return Math.round(total / scores.length);
}

// Get score level text
export function getScoreLevel(score: number): { label: string; color: string } {
    if (score >= 90) return { label: "Excellent", color: "text-green-500" };
    if (score >= 80) return { label: "Very Good", color: "text-blue-500" };
    if (score >= 70) return { label: "Good", color: "text-cyan-500" };
    if (score >= 60) return { label: "Fair", color: "text-yellow-500" };
    return { label: "Needs Improvement", color: "text-red-500" };
}

// Generate avatar initials
export function getInitials(name: string): string {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

// Truncate text with ellipsis
export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + "...";
}

// Format number with thousands separator
export function formatNumber(num: number): string {
    return num.toLocaleString("id-ID");
}

// Calculate percentage
export function calculatePercentage(value: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
}

// Generate unique ID
export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Delay helper for async operations
export function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Check if running on server
export const isServer = typeof window === "undefined";

// Check if running on client
export const isClient = !isServer;
