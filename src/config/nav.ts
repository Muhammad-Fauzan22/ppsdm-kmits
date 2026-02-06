export const NAV_CONFIG = {
    admin: [
        { label: "Dashboard", href: "/admin", icon: "dashboard" },
        { label: "Analytics", href: "/admin/analytics", icon: "analytics" }, // NEW
        { label: "Configuration", href: "/admin/configuration", icon: "tune" }, // NEW
        { label: "Programs", href: "/admin/programs", icon: "school" },
        { label: "Users", href: "/admin/users", icon: "group" },
        { label: "Reports", href: "/admin/reports", icon: "bar_chart" },
        { label: "Settings", href: "/admin/settings", icon: "settings" },
    ],
    mentor: [
        { label: "Dashboard", href: "/supervisor", icon: "dashboard" }, // Updated path
        { label: "My Mentees", href: "/supervisor/mentees", icon: "group" }, // Updated path
        { label: "Reports", href: "/supervisor/reports", icon: "description" }, // Updated path
        { label: "Schedule", href: "/supervisor/schedule", icon: "calendar_month" }, // Updated path
        { label: "Approvals", href: "/supervisor/approvals", icon: "check_circle" }, // NEW
        { label: "Settings", href: "/supervisor/settings", icon: "settings" },
    ],
    student: [
        { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
        { label: "My Roadmap", href: "/roadmap", icon: "map" },
        { label: "Personal OS", href: "/pos", icon: "check_circle" }, // Simplified path
        { label: "Assessment Hub", href: "/assessment", icon: "quiz" },
        { label: "Library & AI", href: "/library", icon: "auto_stories" },
        { label: "Mentorship", href: "/mentorship", icon: "school" }, // Added Mentorship
        { label: "Achievements", href: "/portfolio", icon: "emoji_events" }, // Changed to portfolio
        { label: "Community", href: "/community", icon: "forum" },
    ]
};
