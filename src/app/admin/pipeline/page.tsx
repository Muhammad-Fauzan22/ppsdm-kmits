"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, FileText } from "lucide-react";

export default function PipelineDashboard() {
    const [logs, setLogs] = useState<any[]>([]);
    const supabase = createClient();

    useEffect(() => {
        // 1. Load Data Awal
        const fetchLogs = async () => {
            const { data } = await supabase
                .from('learning_resources')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(10);
            if (data) setLogs(data);
        };
        fetchLogs();

        // 2. Subscribe Realtime (Live Update!)
        const channel = supabase
            .channel('pipeline-monitor')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'learning_resources' },
                (payload) => {
                    setLogs(prev => [payload.new, ...prev].slice(0, 10));
                })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Pipeline Control Tower</h1>
                    <p className="text-muted-foreground">Live monitoring of Orchestrator & AI ingestion.</p>
                </div>
                <Badge variant="outline" className="px-4 py-1 border-green-500 text-green-600 bg-green-50 animate-pulse">
                    ● System Online
                </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Metric Cards */}
                <Card className="p-4 bg-blue-50 border-blue-100">
                    <h3 className="text-sm font-medium text-blue-600">Total Ingested</h3>
                    <p className="text-3xl font-bold mt-2">{logs.length}+</p>
                </Card>
                <Card className="p-4 bg-purple-50 border-purple-100">
                    <h3 className="text-sm font-medium text-purple-600">AI Tokens Used</h3>
                    <p className="text-3xl font-bold mt-2">~12.5k</p>
                </Card>
                <Card className="p-4 bg-orange-50 border-orange-100">
                    <h3 className="text-sm font-medium text-orange-600">Processing Rate</h3>
                    <p className="text-3xl font-bold mt-2">12 files/min</p>
                </Card>
            </div>

            <Card>
                <div className="p-4 border-b bg-slate-50">
                    <h3 className="font-semibold flex items-center gap-2">
                        <Loader2 className="size-4 animate-spin text-slate-400" />
                        Live Ingestion Feed
                    </h3>
                </div>
                <div className="divide-y">
                    {logs.map((log) => (
                        <div key={log.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded bg-slate-100 flex items-center justify-center text-slate-500">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm">{log.title}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="secondary" className="text-[10px] h-5">{log.category}</Badge>
                                        <span className="text-xs text-slate-400">by {log.author}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <Badge className="bg-green-100 text-green-700 border-green-200 shadow-none">
                                    <CheckCircle2 className="size-3 mr-1" /> AI Processed
                                </Badge>
                                <span className="text-xs text-slate-400 font-mono">
                                    {new Date(log.created_at).toLocaleTimeString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
