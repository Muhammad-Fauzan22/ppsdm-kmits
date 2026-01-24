"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, TrendingUp, AlertTriangle } from "lucide-react";
import Link from "next/link";

interface DimensionCardProps {
    id: string;
    title: string;
    description: string;
    score: number | null;
    icon: React.ReactNode;
    colorClass: string;
    href: string;
}

export function DimensionCard({ id, title, description, score, icon, colorClass, href }: DimensionCardProps) {
    const hasScore = score !== null;

    // Determine status based on score
    let status = "Not Started";
    let statusColor = "bg-gray-100 text-gray-800";
    if (hasScore) {
        if (score! >= 80) {
            status = "Excellent";
            statusColor = "bg-green-100 text-green-700";
        } else if (score! >= 60) {
            status = "Good";
            statusColor = "bg-blue-100 text-blue-700";
        } else if (score! >= 40) {
            status = "Moderate";
            statusColor = "bg-yellow-100 text-yellow-700";
        } else {
            status = "Critical";
            statusColor = "bg-red-100 text-red-700";
        }
    }

    return (
        <Card className="hover:shadow-lg transition-all duration-300 group border-l-4" style={{ borderLeftColor: 'var(--accent-color)' }}>
            <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10 text-opacity-100`}>
                        {icon}
                    </div>
                    <Badge variant="secondary" className={`${statusColor} font-semibold border-none`}>
                        {hasScore ? `${score}%` : 'New'}
                    </Badge>
                </div>

                <h3 className="font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">{title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 h-10 mb-4">
                    {description}
                </p>

                <div className="flex items-center justify-between mt-auto">
                    {hasScore ? (
                        <div className="flex items-center gap-1 text-xs font-medium text-green-600">
                            <TrendingUp className="size-3" />
                            <span>On Track</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                            <CheckCircle2 className="size-3" />
                            <span>0/1 Completed</span>
                        </div>
                    )}

                    <Link href={href}>
                        <Button size="sm" variant={hasScore ? "outline" : "default"} className="gap-1 h-8">
                            {hasScore ? "View Report" : "Start"}
                            <ArrowRight className="size-3" />
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
