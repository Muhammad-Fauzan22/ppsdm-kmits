import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, DimensionScore, Activity, Notification } from "@/lib/database.types";

// Mock user for demo purposes
const mockUser: User = {
    id: "1",
    email: "5025201001@student.its.ac.id",
    full_name: "Rian Santoso",
    nrp: "5025201001",
    avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCoz-5CBTBA6Ayqk18_LahdcYj4owOJiXGJ6ohIG_MrvMA9HTriWJKW_FG-SWX3XuGjVbi1uWn50i-6tGM6XvQjNL5rnhEd8TtzYDaDOsvhBxi1iUbog-kVlZbuO4NNA9718DqXbQVXf7sm1z0A3W9Mc_-8hMn-WHb0OvmO32Jlq08uFhRuE9xb0-NueKCD7gwut6M8kCEewkFGZdi2UTQushlvUzn6GPSquQdolNiS6VzLT77DVfIHvOzoopFXf6hAaNTVbF_I9XI",
    department: "Informatics Engineering",
    semester: 5,
    role: "student",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
};

const mockDimensionScores: DimensionScore[] = [
    { id: "1", user_id: "1", dimension: "cognitive", score: 88, updated_at: new Date().toISOString() },
    { id: "2", user_id: "1", dimension: "affective", score: 75, updated_at: new Date().toISOString() },
    { id: "3", user_id: "1", dimension: "psychomotor", score: 82, updated_at: new Date().toISOString() },
    { id: "4", user_id: "1", dimension: "spiritual", score: 95, updated_at: new Date().toISOString() },
    { id: "5", user_id: "1", dimension: "social", score: 85, updated_at: new Date().toISOString() },
    { id: "6", user_id: "1", dimension: "financial", score: 60, updated_at: new Date().toISOString() },
    { id: "7", user_id: "1", dimension: "health", score: 78, updated_at: new Date().toISOString() },
    { id: "8", user_id: "1", dimension: "character", score: 90, updated_at: new Date().toISOString() },
    { id: "9", user_id: "1", dimension: "environmental", score: 70, updated_at: new Date().toISOString() },
];

// Auth Store
interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            login: async (email: string, password: string) => {
                set({ isLoading: true });
                // Simulate API call
                await new Promise((resolve) => setTimeout(resolve, 1000));
                // For demo, always succeed
                set({ user: mockUser, isAuthenticated: true, isLoading: false });
            },
            logout: () => {
                set({ user: null, isAuthenticated: false });
            },
            setUser: (user) => {
                set({ user, isAuthenticated: !!user });
            },
        }),
        {
            name: "auth-storage",
        }
    )
);

// User Profile Store
interface ProfileState {
    dimensionScores: DimensionScore[];
    totalScore: number;
    points: number;
    level: number;
    fetchScores: () => Promise<void>;
    updateScore: (dimension: DimensionScore["dimension"], score: number) => void;
}

export const useProfileStore = create<ProfileState>()((set, get) => ({
    dimensionScores: mockDimensionScores,
    totalScore: 85,
    points: 1250,
    level: 12,
    fetchScores: async () => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        set({ dimensionScores: mockDimensionScores });
    },
    updateScore: (dimension, score) => {
        const scores = get().dimensionScores.map((s) =>
            s.dimension === dimension ? { ...s, score } : s
        );
        const total = Math.round(scores.reduce((acc, s) => acc + s.score, 0) / scores.length);
        set({ dimensionScores: scores, totalScore: total });
    },
}));

// Activities Store
interface ActivitiesState {
    activities: Activity[];
    isLoading: boolean;
    fetchActivities: () => Promise<void>;
    addActivity: (activity: Omit<Activity, "id" | "created_at">) => void;
    updateActivityStatus: (id: string, status: Activity["status"]) => void;
}

export const useActivitiesStore = create<ActivitiesState>()((set, get) => ({
    activities: [
        {
            id: "1",
            user_id: "1",
            title: "Complete Leadership Workshop",
            dimension: "social",
            points: 50,
            status: "completed",
            created_at: new Date().toISOString(),
        },
        {
            id: "2",
            user_id: "1",
            title: "Submit Research Proposal Draft",
            dimension: "cognitive",
            points: 30,
            status: "in-progress",
            due_date: "2024-03-18",
            created_at: new Date().toISOString(),
        },
        {
            id: "3",
            user_id: "1",
            title: "Attend Financial Literacy Seminar",
            dimension: "financial",
            points: 25,
            status: "upcoming",
            due_date: "2024-03-22",
            created_at: new Date().toISOString(),
        },
    ],
    isLoading: false,
    fetchActivities: async () => {
        set({ isLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 500));
        set({ isLoading: false });
    },
    addActivity: (activity) => {
        const newActivity: Activity = {
            ...activity,
            id: Date.now().toString(),
            created_at: new Date().toISOString(),
        };
        set({ activities: [...get().activities, newActivity] });
    },
    updateActivityStatus: (id, status) => {
        set({
            activities: get().activities.map((a) =>
                a.id === id
                    ? { ...a, status, completed_at: status === "completed" ? new Date().toISOString() : undefined }
                    : a
            ),
        });
    },
}));

// Notifications Store
interface NotificationsState {
    notifications: Notification[];
    unreadCount: number;
    fetchNotifications: () => Promise<void>;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
}

export const useNotificationsStore = create<NotificationsState>()((set, get) => ({
    notifications: [
        {
            id: "1",
            user_id: "1",
            type: "achievement",
            title: "Badge Unlocked! 🏆",
            message: "You earned the 'Consistent Learner' badge.",
            read: false,
            created_at: new Date().toISOString(),
        },
        {
            id: "2",
            user_id: "1",
            type: "reminder",
            title: "Upcoming Deadline",
            message: "Research proposal due in 2 days.",
            read: false,
            created_at: new Date().toISOString(),
        },
    ],
    unreadCount: 2,
    fetchNotifications: async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
    },
    markAsRead: (id) => {
        const notifications = get().notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
        );
        set({
            notifications,
            unreadCount: notifications.filter((n) => !n.read).length,
        });
    },
    markAllAsRead: () => {
        set({
            notifications: get().notifications.map((n) => ({ ...n, read: true })),
            unreadCount: 0,
        });
    },
}));

// Theme Store
interface ThemeState {
    theme: "light" | "dark" | "system";
    setTheme: (theme: "light" | "dark" | "system") => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            theme: "system",
            setTheme: (theme) => set({ theme }),
        }),
        {
            name: "theme-storage",
        }
    )
);
