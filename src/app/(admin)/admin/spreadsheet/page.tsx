"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    RefreshCw,
    CheckCircle2,
    Database,
    Clock,
    AlertCircle,
    Loader2,
    Zap,
    FileSpreadsheet,
    ExternalLink,
    ShieldCheck,
} from "lucide-react";

interface SyncState {
    syncing: boolean;
    lastSync: string | null;
    status: "idle" | "success" | "error";
    message: string;
}

interface SheetHealth {
    name: string;
    count: number;
    status: "ok" | "error" | "empty";
}

export default function AdminSpreadsheetPage() {
    const [sync, setSync] = useState<SyncState>({
        syncing: false,
        lastSync: null,
        status: "idle",
        message: "",
    });

    const [sheets, setSheets] = useState<SheetHealth[]>([]);
    const [loading, setLoading] = useState(true);

    const SHEET_NAMES = ["Activities", "Members", "Finances", "Knowledge"];

    async function loadSheetHealth() {
        setLoading(true);
        const results: SheetHealth[] = [];

        for (const name of SHEET_NAMES) {
            try {
                const res = await fetch(`/api/sheets/${name.toLowerCase()}`);
                const data = await res.json();
                results.push({
                    name,
                    count: data.success ? data.data?.length || data.meta?.totalRecords || 0 : 0,
                    status: data.success ? (data.data?.length > 0 ? "ok" : "empty") : "error",
                });
            } catch {
                results.push({ name, count: 0, status: "error" });
            }
        }

        setSheets(results);
        setLoading(false);
    }

    useEffect(() => {
        loadSheetHealth();
    }, []);

    async function handleSync() {
        setSync({ syncing: true, lastSync: sync.lastSync, status: "idle", message: "Invalidating cache..." });

        try {
            const res = await fetch("/api/sheets/webhook", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    secret: "your-webhook-secret-key",
                }),
            });

            const data = await res.json();

            if (data.success) {
                setSync({
                    syncing: false,
                    lastSync: new Date().toISOString(),
                    status: "success",
                    message: "Cache berhasil di-refresh! Data terbaru dari Google Sheets.",
                });
                // Reload health
                await loadSheetHealth();
            } else {
                setSync({
                    syncing: false,
                    lastSync: sync.lastSync,
                    status: "error",
                    message: data.error || "Sync gagal",
                });
            }
        } catch {
            setSync({
                syncing: false,
                lastSync: sync.lastSync,
                status: "error",
                message: "Koneksi gagal. Periksa jaringan.",
            });
        }
    }

    const statusIcon = {
        ok: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
        empty: <AlertCircle className="w-5 h-5 text-amber-500" />,
        error: <AlertCircle className="w-5 h-5 text-red-500" />,
    };

    const statusLabel = {
        ok: "Aktif",
        empty: "Kosong",
        error: "Error",
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
                            <FileSpreadsheet className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Spreadsheet Control Panel</h1>
                            <p className="text-sm text-slate-500">Kelola sinkronisasi data Google Sheets</p>
                        </div>
                    </div>
                    <a
                        href={`https://docs.google.com/spreadsheets/d/${process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID || "1QEj9aoXDrAu6PKdFX-FNQt5pWlf7VsWMGeeU-PF9tQM"}/edit`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button variant="outline" className="gap-2">
                            <ExternalLink className="w-4 h-4" />
                            Buka Spreadsheet
                        </Button>
                    </a>
                </div>

                {/* Sync Control */}
                <Card className="border-none shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h2 className="text-lg font-bold flex items-center gap-2">
                                    <Zap className="w-5 h-5" />
                                    Cache Sync
                                </h2>
                                <p className="text-blue-100 text-sm">
                                    Force-refresh semua cache dari Google Sheets
                                </p>
                            </div>
                            <Button
                                onClick={handleSync}
                                disabled={sync.syncing}
                                className="bg-white text-blue-700 hover:bg-blue-50 font-semibold gap-2 shadow-lg"
                            >
                                {sync.syncing ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <RefreshCw className="w-4 h-4" />
                                )}
                                {sync.syncing ? "Syncing..." : "Sync Now"}
                            </Button>
                        </div>
                    </div>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-600">
                                    {sync.lastSync
                                        ? `Terakhir sync: ${new Date(sync.lastSync).toLocaleString("id-ID")}`
                                        : "Belum pernah sync manual"}
                                </span>
                            </div>
                            {sync.status === "success" && (
                                <Badge className="bg-green-100 text-green-700 gap-1">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Sukses
                                </Badge>
                            )}
                            {sync.status === "error" && (
                                <Badge className="bg-red-100 text-red-700 gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {sync.message}
                                </Badge>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Sheet Health */}
                <div>
                    <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Database className="w-5 h-5" />
                        Status Data Sheets
                    </h2>
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                            <span className="ml-2 text-slate-500">Memuat status...</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {sheets.map((s) => (
                                <Card key={s.name} className="border-none shadow-sm hover:shadow-md transition-shadow">
                                    <CardContent className="p-5 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {statusIcon[s.status]}
                                            <div>
                                                <h3 className="font-semibold text-slate-800">{s.name}</h3>
                                                <p className="text-xs text-slate-500">{s.count} records</p>
                                            </div>
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className={
                                                s.status === "ok"
                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                    : s.status === "empty"
                                                        ? "bg-amber-50 text-amber-700 border-amber-200"
                                                        : "bg-red-50 text-red-700 border-red-200"
                                            }
                                        >
                                            {statusLabel[s.status]}
                                        </Badge>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* API Endpoints Reference */}
                <Card className="border-none shadow-sm">
                    <CardContent className="p-6 space-y-3">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5" />
                            API Endpoints
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-slate-500 border-b">
                                        <th className="pb-2 font-semibold">Endpoint</th>
                                        <th className="pb-2 font-semibold">Method</th>
                                        <th className="pb-2 font-semibold">Params</th>
                                    </tr>
                                </thead>
                                <tbody className="text-slate-700">
                                    <tr className="border-b border-slate-100">
                                        <td className="py-2 font-mono text-xs">/api/sheets/activities</td>
                                        <td className="py-2"><Badge variant="outline" className="bg-blue-50 text-blue-700">GET</Badge></td>
                                        <td className="py-2 text-xs text-slate-500">?status=Selesai</td>
                                    </tr>
                                    <tr className="border-b border-slate-100">
                                        <td className="py-2 font-mono text-xs">/api/sheets/members</td>
                                        <td className="py-2"><Badge variant="outline" className="bg-blue-50 text-blue-700">GET</Badge></td>
                                        <td className="py-2 text-xs text-slate-500">?year=2024&department=...&divisi=...</td>
                                    </tr>
                                    <tr className="border-b border-slate-100">
                                        <td className="py-2 font-mono text-xs">/api/sheets/finances</td>
                                        <td className="py-2"><Badge variant="outline" className="bg-blue-50 text-blue-700">GET</Badge></td>
                                        <td className="py-2 text-xs text-slate-500">?summary=true&category=...</td>
                                    </tr>
                                    <tr className="border-b border-slate-100">
                                        <td className="py-2 font-mono text-xs">/api/sheets/knowledge</td>
                                        <td className="py-2"><Badge variant="outline" className="bg-blue-50 text-blue-700">GET</Badge></td>
                                        <td className="py-2 text-xs text-slate-500">?q=search&category=...&difficulty=...</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 font-mono text-xs">/api/sheets/webhook</td>
                                        <td className="py-2"><Badge variant="outline" className="bg-green-50 text-green-700">POST</Badge></td>
                                        <td className="py-2 text-xs text-slate-500">{"{ sheetName, secret }"}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
