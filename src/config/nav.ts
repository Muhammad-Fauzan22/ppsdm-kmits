/**
 * Navigation configuration for all user roles
 * Updated to match unified /dashboard structure
 */
export const NAV_CONFIG = {
    admin: [
        { label: "Dashboard", href: "/admin", icon: "dashboard" },
        { label: "Factory", href: "/admin/factory", icon: "factory" },
        { label: "Analytics", href: "/admin/analytics", icon: "analytics" },
        { label: "Configuration", href: "/admin/configuration", icon: "tune" },
        { label: "Programs", href: "/admin/programs", icon: "school" },
        { label: "Users", href: "/admin/users", icon: "group" },
        { label: "Reports", href: "/admin/reports", icon: "bar_chart" },
        { label: "Settings", href: "/admin/settings", icon: "settings" },
    ],
    mentor: [
        { label: "Dashboard", href: "/supervisor/dashboard", icon: "dashboard" },
        { label: "My Mentees", href: "/supervisor/mentees", icon: "group" },
        { label: "Reports", href: "/supervisor/reports", icon: "description" },
        { label: "Schedule", href: "/supervisor/schedule", icon: "calendar_month" },
        { label: "Approvals", href: "/supervisor/approvals", icon: "check_circle" },
        { label: "Settings", href: "/supervisor/settings", icon: "settings" },
    ],
    // Student navigation - now unified with /dashboard
    student: [
        { label: "Dashboard", href: "/dashboard/home", icon: "dashboard" },
        { label: "My Dimensions", href: "/dashboard/dimensions", icon: "category" },
        { label: "Analytics", href: "/dashboard/analytics", icon: "analytics" },
        { label: "Library & AI", href: "/dashboard/library", icon: "auto_stories" },
        { label: "Courses", href: "/dashboard/courses", icon: "school" },
        { label: "Assessments", href: "/dashboard/assessment", icon: "quiz" },
        { label: "Roadmap", href: "/dashboard/roadmap", icon: "map" },
        { label: "Personal OS", href: "/dashboard/pos", icon: "check_circle" },
        { label: "Mentorship", href: "/dashboard/mentoring", icon: "support_agent" },
        { label: "Achievements", href: "/dashboard/achievements", icon: "emoji_events" },
        { label: "Community", href: "/dashboard/community", icon: "forum" },
    ]
};
