import {
    Zap, LayoutDashboard, TrendingUp, PlayCircle,
    AlertTriangle, Sparkles, CheckCircle2, Award, Map
} from "lucide-react";

// Konfigurasi statis untuk Dimension Cards
// Memudahkan penambahan/pengurangan dimensi tanpa ubah kode UI
export const DIMENSION_CONFIG = [
    {
        id: "dim_intellectual",
        title: "Intellectual",
        description: "Cognitive capacity, creativity, and digital literacy.",
        icon: Zap,
        colorClass: "bg-blue-500",
        href: "/dashboard/dimensions/cognitive"
    },
    {
        id: "dim_self_mgmt",
        title: "Self-Management",
        description: "Productivity, habits, and time management.",
        icon: LayoutDashboard,
        colorClass: "bg-indigo-500",
        href: "/dashboard/dimensions/self-management"
    },
    {
        id: "dim_financial",
        title: "Financial",
        description: "Budgeting, investment, and economic literacy.",
        icon: TrendingUp,
        colorClass: "bg-green-500",
        href: "/dashboard/dimensions/financial"
    },
    {
        id: "dim_physical",
        title: "Physical",
        description: "Health, vitality, sleep, and nutrition.",
        icon: PlayCircle,
        colorClass: "bg-red-500",
        href: "/dashboard/dimensions/physical"
    },
    {
        id: "dim_mental",
        title: "Mental Stability",
        description: "Emotional resilience and stress management.",
        icon: AlertTriangle,
        colorClass: "bg-orange-500",
        href: "/dashboard/dimensions/mental-health"
    },
    {
        id: "dim_psychological",
        title: "Psychological",
        description: "Self-esteem, well-being, and mindset.",
        icon: Sparkles,
        colorClass: "bg-purple-500",
        href: "/dashboard/dimensions/emotional-social"
    },
    {
        id: "dim_character",
        title: "Character",
        description: "Ethics, integrity, and moral compass.",
        icon: CheckCircle2,
        colorClass: "bg-emerald-500",
        href: "/dashboard/dimensions/character"
    },
    {
        id: "dim_spiritual",
        title: "Spiritual",
        description: "Purpose, meaning, and connection.",
        icon: Award,
        colorClass: "bg-sky-500",
        href: "/dashboard/dimensions/spiritual"
    },
    {
        id: "dim_environmental",
        title: "Environmental",
        description: "Sustainability and living environment.",
        icon: Map,
        colorClass: "bg-teal-500",
        href: "/dashboard/dimensions/environmental"
    },
];
