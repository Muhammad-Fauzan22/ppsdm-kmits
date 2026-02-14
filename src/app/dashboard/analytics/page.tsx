'use client';

import React, { useEffect, useState } from 'react';
import { AnalyticsService, AnalyticsSummary, DepartmentStat } from '@/lib/analytics/service';
import { AnalyticsSummaryCards } from '@/components/analytics/AnalyticsSummaryCards';
import { DepartmentParticipationChart } from '@/components/analytics/DepartmentParticipationChart';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { ReportDownloadButton } from '@/components/analytics/ReportDownloadButton';

export default function AnalyticsPage() {
    const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
    const [deptStats, setDeptStats] = useState<DepartmentStat[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [summaryData, deptData] = await Promise.all([
                AnalyticsService.getSummary(),
                AnalyticsService.getDepartmentStats()
            ]);
            setSummary(summaryData);
            setDeptStats(deptData);
        } catch (error) {
            console.error('Failed to load analytics', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="space-y-6 p-6 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                        Enterprise Analytics
                    </h1>
                    <p className="text-slate-400">
                        Real-time insights into student development and engagement.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={fetchData} className="gap-2 border-slate-700 hover:bg-slate-800">
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <ReportDownloadButton summary={summary} deptStats={deptStats} />
                </div>
            </div>

            <AnalyticsSummaryCards data={summary} loading={loading} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <DepartmentParticipationChart data={deptStats} />

                {/* Placeholder for Dimension Radar Chart (Future) */}
                <div className="lg:col-span-1 bg-slate-900/50 border border-slate-800 rounded-lg p-6 flex flex-col items-center justify-center text-center backdrop-blur-sm">
                    <div className="text-slate-500 mb-2">Dimension Analysis</div>
                    <div className="text-xs text-slate-600">Complete assessments to unlock this view</div>
                </div>
            </div>
        </div>
    );
}
