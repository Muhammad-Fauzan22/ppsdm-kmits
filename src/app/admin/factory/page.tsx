'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Learning Factory Command Center
 * ================================
 * Real-time monitoring and control panel for the autonomous pipeline.
 */

interface PipelineRun {
    run_id: string;
    status: string;
    message?: string;
    stats?: any;
    updated_at: string;
}

interface Statistics {
    raw_materials: number;
    learning_modules: number;
    quizzes: number;
    interventions: number;
}

const STATUS_COLORS: Record<string, string> = {
    idle: 'bg-gray-500',
    harvesting: 'bg-blue-500 animate-pulse',
    processing: 'bg-yellow-500 animate-pulse',
    generating: 'bg-purple-500 animate-pulse',
    exporting: 'bg-orange-500 animate-pulse',
    completed: 'bg-green-500',
    error: 'bg-red-500',
};

const PHASE_ICONS: Record<string, string> = {
    harvest: '🌾',
    process: '🧠',
    generate: '📚',
    export: '🎨',
    all: '🏭',
};

export default function FactoryCommandCenter() {
    const [status, setStatus] = useState<string>('idle');
    const [lastRun, setLastRun] = useState<PipelineRun | null>(null);
    const [history, setHistory] = useState<PipelineRun[]>([]);
    const [statistics, setStatistics] = useState<Statistics>({
        raw_materials: 0,
        learning_modules: 0,
        quizzes: 0,
        interventions: 0,
    });
    const [loading, setLoading] = useState(true);
    const [triggering, setTriggering] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const fetchStatus = useCallback(async () => {
        try {
            const res = await fetch('/api/factory/status');
            const data = await res.json();

            if (data.success) {
                setStatus(data.data.current_status);
                setLastRun(data.data.last_run);
                setHistory(data.data.history || []);
                setStatistics(data.data.statistics);
            }
        } catch (error) {
            } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 30000); // Refresh every 30s
        return () => clearInterval(interval);
    }, [fetchStatus]);

    const triggerPipeline = async (phase: string = 'all') => {
        setTriggering(true);
        setMessage(null);

        try {
            const res = await fetch('/api/factory/trigger', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phase }),
            });

            const data = await res.json();

            if (data.success) {
                setMessage(`✅ ${data.message}`);
                setTimeout(fetchStatus, 2000);
            } else {
                setMessage(`❌ Error: ${data.error}`);
            }
        } catch (error: any) {
            setMessage(`❌ Failed: ${error.message}`);
        } finally {
            setTriggering(false);
        }
    };

    const formatTimeAgo = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diff < 60) return `${diff}s ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading Command Center...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                        🏭 Learning Factory Command Center
                    </h1>
                    <p className="text-gray-400 mt-2">
                        Autonomous content generation pipeline - 24/7 operation
                    </p>
                </div>

                {/* Status Banner */}
                <div className={`rounded-xl p-6 mb-8 ${STATUS_COLORS[status]} bg-opacity-20 border border-opacity-30 ${status === 'idle' ? 'border-gray-500' : status === 'completed' ? 'border-green-500' : status === 'error' ? 'border-red-500' : 'border-blue-500'}`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`w-4 h-4 rounded-full ${STATUS_COLORS[status]}`} />
                            <div>
                                <h2 className="text-2xl font-bold text-white uppercase">{status}</h2>
                                <p className="text-gray-300">
                                    {lastRun ? `Last updated: ${formatTimeAgo(lastRun.updated_at)}` : 'No runs yet'}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-white">
                                {statistics.learning_modules}
                            </div>
                            <div className="text-sm text-gray-400">Active Modules</div>
                        </div>
                    </div>
                </div>

                {/* Message */}
                {message && (
                    <div className="mb-6 p-4 rounded-lg bg-gray-800 border border-gray-700 text-white">
                        {message}
                    </div>
                )}

                {/* Trigger Controls */}
                <div className="grid grid-cols-5 gap-4 mb-8">
                    {['all', 'harvest', 'process', 'generate', 'export'].map((phase) => (
                        <button
                            key={phase}
                            onClick={() => triggerPipeline(phase)}
                            disabled={triggering || !['idle', 'completed', 'error'].includes(status)}
                            className={`p-4 rounded-xl border transition-all ${triggering
                                    ? 'bg-gray-700 border-gray-600 cursor-not-allowed'
                                    : 'bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-gray-600'
                                }`}
                        >
                            <div className="text-3xl mb-2">{PHASE_ICONS[phase]}</div>
                            <div className="text-white font-medium capitalize">{phase}</div>
                            <div className="text-xs text-gray-400">
                                {phase === 'all' ? 'Full Pipeline' : `Run ${phase}`}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                    <StatCard
                        icon="📦"
                        label="Raw Materials"
                        value={statistics.raw_materials}
                        color="blue"
                    />
                    <StatCard
                        icon="📚"
                        label="Modules"
                        value={statistics.learning_modules}
                        color="green"
                    />
                    <StatCard
                        icon="📝"
                        label="Quizzes"
                        value={statistics.quizzes}
                        color="purple"
                    />
                    <StatCard
                        icon="💡"
                        label="Interventions"
                        value={statistics.interventions}
                        color="orange"
                    />
                </div>

                {/* Recent Runs */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-xl font-bold text-white mb-4">Recent Pipeline Runs</h3>
                    <div className="space-y-3">
                        {history.length === 0 ? (
                            <p className="text-gray-400">No pipeline runs yet. Trigger your first run above!</p>
                        ) : (
                            history.slice(0, 5).map((run) => (
                                <div
                                    key={run.run_id}
                                    className="flex items-center justify-between p-4 bg-gray-750 rounded-lg border border-gray-600"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${STATUS_COLORS[run.status]}`} />
                                        <div>
                                            <div className="text-white font-medium">{run.run_id}</div>
                                            <div className="text-sm text-gray-400">{run.message || 'No message'}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-white capitalize">{run.status}</div>
                                        <div className="text-sm text-gray-400">{formatTimeAgo(run.updated_at)}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Auto-refresh indicator */}
                <div className="mt-6 text-center text-gray-500 text-sm">
                    Auto-refresh every 30 seconds • Pipeline runs every 6 hours
                </div>
            </div>
        </div>
    );
}

function StatCard({
    icon,
    label,
    value,
    color
}: {
    icon: string;
    label: string;
    value: number;
    color: string
}) {
    const colorClasses: Record<string, string> = {
        blue: 'from-blue-600/20 to-blue-800/20 border-blue-500/30',
        green: 'from-green-600/20 to-green-800/20 border-green-500/30',
        purple: 'from-purple-600/20 to-purple-800/20 border-purple-500/30',
        orange: 'from-orange-600/20 to-orange-800/20 border-orange-500/30',
    };

    return (
        <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl p-6 border`}>
            <div className="text-3xl mb-2">{icon}</div>
            <div className="text-3xl font-bold text-white">{value.toLocaleString()}</div>
            <div className="text-gray-400">{label}</div>
        </div>
    );
}
