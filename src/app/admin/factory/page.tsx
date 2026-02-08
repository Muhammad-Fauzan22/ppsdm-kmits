'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PipelineStats {
    raw_materials: number;
    modules: number;
    quizzes: number;
    interventions: number;
    by_dimension: Record<string, number>;
    recent_errors: number;
    last_run: string | null;
}

interface ComponentStatus {
    name: string;
    status: 'healthy' | 'warning' | 'error';
    lastRun: string;
    count: number;
}

export default function FactoryDashboard() {
    const [stats, setStats] = useState<PipelineStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, 60000); // Refresh every minute
        return () => clearInterval(interval);
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/learning/stats');
            if (!res.ok) throw new Error('Failed to fetch stats');
            const data = await res.json();
            setStats(data);
            setError(null);
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const components: ComponentStatus[] = [
        { name: 'RSS Harvester', status: 'healthy', lastRun: '2h ago', count: stats?.raw_materials || 0 },
        { name: 'YouTube Harvester', status: 'healthy', lastRun: '2h ago', count: 0 },
        { name: 'Academic Harvester', status: 'healthy', lastRun: '6h ago', count: 0 },
        { name: 'Quality Filter', status: 'healthy', lastRun: '2h ago', count: 0 },
        { name: 'Module Generator', status: 'healthy', lastRun: '2h ago', count: stats?.modules || 0 },
        { name: 'Quiz Generator', status: 'healthy', lastRun: '2h ago', count: stats?.quizzes || 0 },
    ];

    const dimensions = [
        { key: 'cognitive', label: 'Kognitif', color: 'bg-blue-500' },
        { key: 'self_management', label: 'Self Management', color: 'bg-green-500' },
        { key: 'financial', label: 'Finansial', color: 'bg-yellow-500' },
        { key: 'physical', label: 'Fisik', color: 'bg-red-500' },
        { key: 'emotional', label: 'Emosional', color: 'bg-pink-500' },
        { key: 'mental_health', label: 'Mental', color: 'bg-purple-500' },
        { key: 'character', label: 'Karakter', color: 'bg-indigo-500' },
        { key: 'spiritual', label: 'Spiritual', color: 'bg-cyan-500' },
        { key: 'environmental', label: 'Lingkungan', color: 'bg-emerald-500' },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 p-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-700 rounded w-1/3"></div>
                    <div className="grid grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-32 bg-gray-700 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">🏭 Learning Factory Dashboard</h1>
                        <p className="text-gray-400">Real-time content generation monitoring</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-500/20 text-green-400">
                            <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                            System Active
                        </span>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
                        {error}
                    </div>
                )}

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-gray-400 text-sm">Raw Materials</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-blue-400">{stats?.raw_materials || 0}</div>
                            <p className="text-xs text-gray-500">Harvested content</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-gray-400 text-sm">Learning Modules</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-400">{stats?.modules || 0}</div>
                            <p className="text-xs text-gray-500">Generated modules</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-gray-400 text-sm">Quizzes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-purple-400">{stats?.quizzes || 0}</div>
                            <p className="text-xs text-gray-500">Assessment items</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-gray-400 text-sm">Interventions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-orange-400">{stats?.interventions || 0}</div>
                            <p className="text-xs text-gray-500">Active interventions</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Component Status */}
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-white">Pipeline Components</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {components.map(comp => (
                                    <div key={comp.name} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <span className={`w-2 h-2 rounded-full ${comp.status === 'healthy' ? 'bg-green-400' :
                                                    comp.status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
                                                }`}></span>
                                            <span className="font-medium">{comp.name}</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-400">
                                            <span>{comp.lastRun}</span>
                                            <span className="bg-gray-600 px-2 py-0.5 rounded">{comp.count}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Dimension Distribution */}
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-white">Content by Dimension</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {dimensions.map(dim => {
                                    const count = stats?.by_dimension?.[dim.key] || 0;
                                    const total = Object.values(stats?.by_dimension || {}).reduce((a, b) => a + Number(b), 0) || 1;
                                    const percent = (count / total) * 100;

                                    return (
                                        <div key={dim.key} className="space-y-1">
                                            <div className="flex justify-between text-sm">
                                                <span>{dim.label}</span>
                                                <span className="text-gray-400">{count}</span>
                                            </div>
                                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${dim.color} transition-all duration-500`}
                                                    style={{ width: `${Math.max(percent, 2)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card className="bg-gray-800 border-gray-700 mt-8">
                    <CardHeader>
                        <CardTitle className="text-white">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-4">
                            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition">
                                🔄 Refresh Stats
                            </button>
                            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition">
                                ▶️ Trigger Pipeline
                            </button>
                            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition">
                                📊 View Logs
                            </button>
                            <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition">
                                ⚙️ Settings
                            </button>
                        </div>
                    </CardContent>
                </Card>

                <p className="text-center text-gray-500 text-sm mt-8">
                    Last updated: {new Date().toLocaleString('id-ID')} • Auto-refresh: 60s
                </p>
            </div>
        </div>
    );
}
