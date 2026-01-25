import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatCardProps {
    title: string;
    value: number | string;
    subtitle: string;
    icon: LucideIcon;
    variant?: "primary" | "success" | "warning" | "destructive" | "default";
}

export function StatCard({ title, value, subtitle, icon: Icon, variant = "default" }: StatCardProps) {
    const variants = {
        primary: "text-blue-600 bg-blue-50 border-blue-100",
        success: "text-green-600 bg-green-50 border-green-100",
        warning: "text-yellow-600 bg-yellow-50 border-yellow-100",
        destructive: "text-red-600 bg-red-50 border-red-100",
        default: "text-slate-600 bg-slate-50 border-slate-100",
    };

    const colorClass = variants[variant];

    return (
        <Card className="p-6 border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-500">{title}</h3>
                <div className={`p-2 rounded-lg ${colorClass}`}>
                    <Icon size={20} />
                </div>
            </div>
            <div>
                <div className="text-2xl font-bold text-slate-900">{value}</div>
                <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
            </div>
        </Card>
    );
}
