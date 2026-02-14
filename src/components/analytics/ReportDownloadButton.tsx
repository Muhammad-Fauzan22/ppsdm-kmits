'use client';

import React from 'react';
import { AnalyticsReportTemplate } from './AnalyticsReportTemplate';
import { Button } from '@/components/ui/button';
import { FileDown, Loader2 } from 'lucide-react';
import { AnalyticsSummary, DepartmentStat } from '@/lib/analytics/service';
import dynamic from 'next/dynamic';

const PDFDownloadLink = dynamic(
    () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
    {
        ssr: false,
        loading: () => <Button disabled size="sm">Loading PDF...</Button>,
    }
);

interface Props {
    summary: AnalyticsSummary | null;
    deptStats: DepartmentStat[];
}

export function ReportDownloadButton({ summary, deptStats }: Props) {
    if (!summary) return <Button disabled size="sm">Loading...</Button>;

    const generatedAt = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <PDFDownloadLink
            document={<AnalyticsReportTemplate summary={summary} deptStats={deptStats} generatedAt={generatedAt} />}
            fileName={`PPSDM_Report_${new Date().toISOString().split('T')[0]}.pdf`}
        >
            {({ blob, url, loading, error }) => (
                <Button size="sm" disabled={loading} className="gap-2 bg-blue-600 hover:bg-blue-700">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
                    {loading ? 'Generating...' : 'Export PDF'}
                </Button>
            )}
        </PDFDownloadLink>
    );
}
