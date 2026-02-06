"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, AlertTriangle, XCircle, Database, Brain, HardDrive } from 'lucide-react';
import { motion } from 'framer-motion';

type ServiceStatus = 'operational' | 'degraded' | 'down' | 'checking';

interface HealthMetric {
    name: string;
    status: ServiceStatus;
    latency?: string;
    message?: string;
    icon: any;
}

export function SystemHealthWidget() {
    const [metrics, setMetrics] = useState<HealthMetric[]>([
        { name: 'Database (Supabase)', status: 'checking', icon: Database },
        { name: 'AI Engine (Groq/Gemini)', status: 'checking', icon: Brain },
        { name: 'Content Storage (Drive/CDN)', status: 'checking', icon: HardDrive },
    ]);

    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    useEffect(() => {
        // Simulate health checks
        const checkHealth = async () => {
            // In a real app, these would be API calls to /api/health
            await new Promise(r => setTimeout(r, 1500));

            setMetrics([
                { name: 'Database (Supabase)', status: 'operational', latency: '45ms', icon: Database },
                { name: 'AI Engine (Groq/Gemini)', status: 'operational', message: 'Ready for Batch', icon: Brain },
                { name: 'Content Storage (Hybrid)', status: 'operational', message: 'Google Drive Integration Active', icon: HardDrive },
            ]);
            setLastUpdated(new Date());
        };

        checkHealth();
        const interval = setInterval(checkHealth, 30000); // Check every 30s
        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status: ServiceStatus) => {
        switch (status) {
            case 'operational': return 'text-green-500 bg-green-500/10 border-green-500/20';
            case 'degraded': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
            case 'down': return 'text-red-500 bg-red-500/10 border-red-500/20';
            default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
        }
    };

    const getStatusIcon = (status: ServiceStatus) => {
        switch (status) {
            case 'operational': return <CheckCircle2 className="w-4 h-4" />;
            case 'degraded': return <AlertTriangle className="w-4 h-4" />;
            case 'down': return <XCircle className="w-4 h-4" />;
            default: return <Loader2 className="w-4 h-4 animate-spin" />;
        }
    };

    return (
        <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Status</CardTitle>
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-xs text-muted-foreground">Updated {lastUpdated.toLocaleTimeString()}</span>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {metrics.map((metric, i) => (
                        <div key={metric.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${getStatusColor(metric.status)}`}>
                                    <metric.icon className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium leading-none">{metric.name}</div>
                                    {metric.message && <p className="text-xs text-muted-foreground mt-1">{metric.message}</p>}
                                </div>
                            </div>
                            <Badge variant="outline" className={`gap-1 ${getStatusColor(metric.status)}`}>
                                {getStatusIcon(metric.status)}
                                <span className="capitalize">{metric.status}</span>
                                {metric.latency && <span className="text-[10px] ml-1 opacity-70">({metric.latency})</span>}
                            </Badge>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
