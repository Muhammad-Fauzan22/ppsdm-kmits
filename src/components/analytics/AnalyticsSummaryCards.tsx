'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Activity, Trophy, Zap } from 'lucide-react';
import { AnalyticsSummary } from '@/lib/analytics/service';

interface Props {
    data: AnalyticsSummary | null;
    loading: boolean;
}

export function AnalyticsSummaryCards({ data, loading }: Props) {
    if (loading || !data) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="animate-pulse bg-slate-900/50 border-slate-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="h-4 w-24 bg-slate-800 rounded"></div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-8 w-16 bg-slate-800 rounded mb-1"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    const items = [
        {
            title: 'Total Students',
            value: data.total_students.toLocaleString(),
            icon: Users,
            color: 'text-blue-500',
            description: 'Registered users'
        },
        {
            title: 'Active (7d)',
            value: data.active_users_7d.toLocaleString(),
            icon: Activity,
            color: 'text-green-500',
            description: 'Active this week'
        },
        {
            title: 'Avg XP',
            value: data.avg_xp.toLocaleString(),
            icon: Zap,
            color: 'text-yellow-500',
            description: 'Per student'
        },
        {
            title: 'Quest Completion',
            value: `${data.quest_completion_rate}%`,
            icon: Trophy,
            color: 'text-purple-500',
            description: 'Engagement rate'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((item) => (
                <Card key={item.title} className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">
                            {item.title}
                        </CardTitle>
                        <item.icon className={`h-4 w-4 ${item.color}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{item.value}</div>
                        <p className="text-xs text-slate-500 mt-1">
                            {item.description}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
