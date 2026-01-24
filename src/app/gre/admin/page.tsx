'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, RefreshCw, Trash2, CheckCircle } from 'lucide-react';

// Mock Data for Governance
const MOCK_DECAY = [
    { id: '1', title: 'Intro to React 2018', score: 0.45, reason: 'Outdated (Recency)', status: 'flagged' },
    { id: '2', title: 'Broken Link Article', score: 0.1, reason: 'Technical Failure', status: 'critical' },
    { id: '3', title: 'Low Engagement Video', score: 0.55, reason: 'Engagement Drop', status: 'warning' },
];

export default function GreGovernanceDashboard() {
    const [resources, setResources] = useState(MOCK_DECAY);

    const handleAction = (id: string, action: 'refresh' | 'retire') => {
        // Simulate API call
        setResources(prev => prev.filter(r => r.id !== id));
    };

    return (
        <div className="container mx-auto py-10 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">GRE Quality Governance</h1>
                    <p className="text-muted-foreground">Monitor resource decay and enforce quality standards (Phase 2).</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Critical Issues</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-red-600">12</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">To Retire</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-orange-600">5</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Auto-Repaired</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-green-600">48</div></CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Decay Queue</h2>
                {resources.map((res) => (
                    <Card key={res.id} className="border-l-4 border-l-red-500">
                        <CardContent className="flex items-center justify-between p-6">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold">{res.title}</h3>
                                    <Badge variant="outline">{res.reason}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">Quality Score: {res.score}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => handleAction(res.id, 'refresh')}>
                                    <RefreshCw className="mr-2 h-4 w-4" /> Recrawl
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => handleAction(res.id, 'retire')}>
                                    <Trash2 className="mr-2 h-4 w-4" /> Retire
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {resources.length === 0 && (
                    <div className="text-center py-10 text-muted-foreground flex flex-col items-center">
                        <CheckCircle className="h-10 w-10 mb-2 text-green-500" />
                        All quality issues resolved.
                    </div>
                )}
            </div>
        </div>
    );
}
