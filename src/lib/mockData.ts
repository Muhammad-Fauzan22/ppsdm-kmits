// Mock Data Service for Demo/Development
// This provides realistic data for testing the application

import type { User, Activity, Program, DimensionScore, Notification, Badge, DimensionType } from "./database.types";

// Generate random ID
const generateId = () => Math.random().toString(36).substring(2, 11);

// Random date within range
const randomDate = (start: Date, end: Date) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Mock Users
export const mockUsers: User[] = [
    {
        id: "user-1",
        email: "5025201001@student.its.ac.id",
        full_name: "Rian Santoso",
        nrp: "5025201001",
        avatar_url: "https://i.pravatar.cc/150?u=rian",
        department: "Informatics Engineering",
        semester: 5,
        role: "student",
        created_at: "2024-01-15T00:00:00Z",
        updated_at: "2024-03-01T00:00:00Z",
    },
    {
        id: "user-2",
        email: "5025201002@student.its.ac.id",
        full_name: "Aisyah Putri",
        nrp: "5025201002",
        avatar_url: "https://i.pravatar.cc/150?u=aisyah",
        department: "Electrical Engineering",
        semester: 4,
        role: "student",
        created_at: "2024-01-20T00:00:00Z",
        updated_at: "2024-03-05T00:00:00Z",
    },
    {
        id: "user-3",
        email: "lecturer@its.ac.id",
        full_name: "Dr. Budi Raharjo",
        nrp: "",
        avatar_url: "https://i.pravatar.cc/150?u=budi",
        department: "Informatics Engineering",
        semester: 0,
        role: "lecturer",
        created_at: "2023-08-01T00:00:00Z",
        updated_at: "2024-02-15T00:00:00Z",
    },
];

// Mock Dimension Scores
export const mockDimensionScores: DimensionScore[] = [
    { id: "ds-1", user_id: "user-1", dimension: "cognitive", score: 88, updated_at: "2024-03-01T00:00:00Z" },
    { id: "ds-2", user_id: "user-1", dimension: "affective", score: 75, updated_at: "2024-03-01T00:00:00Z" },
    { id: "ds-3", user_id: "user-1", dimension: "psychomotor", score: 82, updated_at: "2024-03-01T00:00:00Z" },
    { id: "ds-4", user_id: "user-1", dimension: "spiritual", score: 95, updated_at: "2024-03-01T00:00:00Z" },
    { id: "ds-5", user_id: "user-1", dimension: "social", score: 85, updated_at: "2024-03-01T00:00:00Z" },
    { id: "ds-6", user_id: "user-1", dimension: "financial", score: 60, updated_at: "2024-03-01T00:00:00Z" },
    { id: "ds-7", user_id: "user-1", dimension: "health", score: 78, updated_at: "2024-03-01T00:00:00Z" },
    { id: "ds-8", user_id: "user-1", dimension: "character", score: 90, updated_at: "2024-03-01T00:00:00Z" },
    { id: "ds-9", user_id: "user-1", dimension: "environmental", score: 70, updated_at: "2024-03-01T00:00:00Z" },
];

// Mock Activities
export const mockActivities: Activity[] = [
    {
        id: "act-1",
        user_id: "user-1",
        title: "Complete Leadership Workshop",
        description: "Participate in 3-day leadership training program",
        dimension: "social",
        points: 50,
        status: "completed",
        completed_at: "2024-02-28T00:00:00Z",
        created_at: "2024-02-01T00:00:00Z",
    },
    {
        id: "act-2",
        user_id: "user-1",
        title: "Submit Research Proposal Draft",
        description: "First draft of undergraduate thesis proposal",
        dimension: "cognitive",
        points: 30,
        status: "in-progress",
        due_date: "2024-03-18",
        created_at: "2024-02-15T00:00:00Z",
    },
    {
        id: "act-3",
        user_id: "user-1",
        title: "Attend Financial Literacy Seminar",
        description: "Learn about personal finance and investment basics",
        dimension: "financial",
        points: 25,
        status: "upcoming",
        due_date: "2024-03-22",
        created_at: "2024-03-01T00:00:00Z",
    },
    {
        id: "act-4",
        user_id: "user-1",
        title: "Weekly Meditation Session",
        description: "Mindfulness and spiritual development",
        dimension: "spiritual",
        points: 15,
        status: "upcoming",
        due_date: "2024-03-20",
        created_at: "2024-03-01T00:00:00Z",
    },
    {
        id: "act-5",
        user_id: "user-1",
        title: "Gym Training Session",
        description: "Physical fitness routine",
        dimension: "health",
        points: 10,
        status: "completed",
        completed_at: "2024-03-01T00:00:00Z",
        created_at: "2024-02-25T00:00:00Z",
    },
];

// Mock Programs
export const mockPrograms: Program[] = [
    {
        id: "prog-1",
        title: "Leadership Development Program 2024",
        description: "Comprehensive 6-month leadership training for student leaders",
        category: "Leadership",
        status: "active",
        start_date: "2024-01-01",
        end_date: "2024-06-30",
        max_participants: 50,
        current_participants: 42,
        created_by: "user-3",
        created_at: "2023-12-01T00:00:00Z",
    },
    {
        id: "prog-2",
        title: "Research Bootcamp",
        description: "Intensive research methodology training",
        category: "Academic",
        status: "active",
        start_date: "2024-02-01",
        end_date: "2024-04-30",
        max_participants: 30,
        current_participants: 28,
        created_by: "user-3",
        created_at: "2024-01-15T00:00:00Z",
    },
    {
        id: "prog-3",
        title: "Entrepreneur Mindset Workshop",
        description: "Building entrepreneurial thinking skills",
        category: "Entrepreneurship",
        status: "draft",
        start_date: "2024-04-01",
        end_date: "2024-05-31",
        max_participants: 40,
        current_participants: 0,
        created_by: "user-3",
        created_at: "2024-02-20T00:00:00Z",
    },
];

// Mock Badges
export const mockBadges: Badge[] = [
    {
        id: "badge-1",
        name: "Dean's List",
        description: "Achieved outstanding academic performance",
        icon: "school",
        color: "#FFD700",
        requirement_type: "score_threshold",
        requirement_value: 85,
    },
    {
        id: "badge-2",
        name: "Team Player",
        description: "Completed 5 collaborative activities",
        icon: "groups",
        color: "#4169E1",
        requirement_type: "activity_count",
        requirement_value: 5,
    },
    {
        id: "badge-3",
        name: "Wellness Warrior",
        description: "Maintained 7-day health streak",
        icon: "fitness_center",
        color: "#27AE60",
        requirement_type: "streak",
        requirement_value: 7,
    },
    {
        id: "badge-4",
        name: "Innovator",
        description: "Completed a research or innovation project",
        icon: "lightbulb",
        color: "#9B59B6",
        requirement_type: "special",
        requirement_value: 1,
    },
    {
        id: "badge-5",
        name: "Consistent Learner",
        description: "Completed activities 5 days in a row",
        icon: "trending_up",
        color: "#E74C3C",
        requirement_type: "streak",
        requirement_value: 5,
    },
];

// Mock Notifications
export const mockNotifications: Notification[] = [
    {
        id: "notif-1",
        user_id: "user-1",
        type: "achievement",
        title: "Badge Unlocked! 🏆",
        message: "You earned the 'Consistent Learner' badge for completing 5 activities in a row.",
        read: false,
        created_at: new Date().toISOString(),
    },
    {
        id: "notif-2",
        user_id: "user-1",
        type: "reminder",
        title: "Upcoming Deadline",
        message: "Your research proposal is due in 2 days. Don't forget to submit!",
        read: false,
        created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "notif-3",
        user_id: "user-1",
        type: "feedback",
        title: "Mentor Feedback Received",
        message: "Dr. Budi has provided feedback on your weekly progress report.",
        read: true,
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "notif-4",
        user_id: "user-1",
        type: "program",
        title: "New Program Available",
        message: "Entrepreneur Mindset Workshop registrations are now open!",
        read: true,
        created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    },
];

// Growth history data for charts
export const mockGrowthHistory = [
    { month: "Jan", score: 65, cognitive: 70, affective: 60, social: 68 },
    { month: "Feb", score: 68, cognitive: 72, affective: 62, social: 70 },
    { month: "Mar", score: 72, cognitive: 78, affective: 68, social: 75 },
    { month: "Apr", score: 70, cognitive: 75, affective: 65, social: 72 },
    { month: "May", score: 78, cognitive: 82, affective: 72, social: 80 },
    { month: "Jun", score: 82, cognitive: 85, affective: 78, social: 83 },
    { month: "Jul", score: 85, cognitive: 88, affective: 80, social: 85 },
];

// Weekly engagement data
export const mockEngagementData = [
    { week: "Week 1", activities: 3, points: 45 },
    { week: "Week 2", activities: 5, points: 72 },
    { week: "Week 3", activities: 4, points: 58 },
    { week: "Week 4", activities: 7, points: 95 },
    { week: "Week 5", activities: 6, points: 82 },
    { week: "Week 6", activities: 8, points: 110 },
];

// Helper function to get dimension label
export const getDimensionLabel = (dimension: DimensionType): string => {
    const labels: Record<DimensionType, string> = {
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
    return labels[dimension];
};

// Simulate API delay
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API functions
export const mockApi = {
    // User
    getCurrentUser: async () => {
        await delay(300);
        return mockUsers[0];
    },

    // Activities
    getActivities: async () => {
        await delay(300);
        return mockActivities;
    },

    createActivity: async (activity: Omit<Activity, "id" | "created_at">) => {
        await delay(300);
        const newActivity: Activity = {
            ...activity,
            id: generateId(),
            created_at: new Date().toISOString(),
        };
        return newActivity;
    },

    // Dimension Scores
    getDimensionScores: async () => {
        await delay(300);
        return mockDimensionScores;
    },

    // Programs
    getPrograms: async () => {
        await delay(300);
        return mockPrograms;
    },

    // Notifications
    getNotifications: async () => {
        await delay(200);
        return mockNotifications;
    },

    markNotificationRead: async (id: string) => {
        await delay(100);
        return { success: true, id };
    },

    // Badges
    getBadges: async () => {
        await delay(200);
        return mockBadges;
    },

    // Growth data
    getGrowthHistory: async () => {
        await delay(300);
        return mockGrowthHistory;
    },
};
