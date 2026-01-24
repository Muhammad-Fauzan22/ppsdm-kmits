
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: LucideIcon;
    variant?: "default" | "primary" | "success" | "warning" | "destructive";
    className?: string;
}

export function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    variant = "default",
    className,
}: StatCardProps) {
    const variants = {
        default: "bg-card text-card-foreground",
        primary: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-800",
        success: "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-100 dark:border-green-800",
        warning: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-100 dark:border-amber-800",
        destructive: "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-100 dark:border-red-800",
    };

    const iconVariants = {
        default: "text-muted-foreground",
        primary: "text-blue-600 dark:text-blue-400",
        success: "text-green-600 dark:text-green-400",
        warning: "text-amber-600 dark:text-amber-400",
        destructive: "text-red-600 dark:text-red-400",
    };

    return (
        <Card className={cn("transition-all duration-200 hover:shadow-md", variants[variant], className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className={cn("h-4 w-4", iconVariants[variant])} />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {subtitle && (
                    <p className={cn("text-xs mt-1 opacity-80", iconVariants[variant])}>
                        {subtitle}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
