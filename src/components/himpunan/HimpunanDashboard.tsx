"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Calendar,
    Users,
    DollarSign,
    BookOpen,
    Activity,
    TrendingUp,
    MapPin,
    Clock,
    Loader2,
    AlertCircle,
    ExternalLink,
} from "lucide-react";

// ─── Types (matching API shape) ──────────────────────────────────

interface ActivityData {
    ID: string;
    "Nama Kegiatan": string;
    Tanggal: string;
    Lokasi: string;
    Status: string;
    Peserta: string[];
    Anggaran: number;
    Pengeluaran: number;
}

interface MemberData {
    NIM: string;
    Nama: string;
    Angkatan: string;
    Departemen: string;
    Posisi: string;
    Divisi: string;
}

interface FinanceSummary {
    totalPemasukan: number;
    totalPengeluaran: number;
    saldo: number;
    perKategori: Record<string, number>;
}

interface KnowledgeData {
    ID: string;
    Judul: string;
    Tipe: string;
    Kategori: string;
    Tingkat: string;
}

// ─── Helpers ─────────────────────────────────────────────────────

function formatRupiah(n: number) {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
}

function statusColor(s: string) {
    const map: Record<string, string> = {
        Rencana: "bg-blue-100 text-blue-700",
        Berlangsung: "bg-yellow-100 text-yellow-700",
        Selesai: "bg-green-100 text-green-700",
        Dibatalkan: "bg-red-100 text-red-700",
    };
    return map[s] || "bg-gray-100 text-gray-700";
}

// ─── Main Component ──────────────────────────────────────────────

type Section = "activities" | "finances" | "members" | "knowledge";

export function HimpunanDashboard() {
    const [activeSection, setActiveSection] = useState<Section>("activities");
    const [activities, setActivities] = useState<ActivityData[]>([]);
    const [members, setMembers] = useState<MemberData[]>([]);
    const [financeSummary, setFinanceSummary] = useState<FinanceSummary | null>(null);
    const [knowledge, setKnowledge] = useState<KnowledgeData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                const [actRes, memRes, finRes, knRes] = await Promise.all([
                    fetch("/api/sheets/activities"),
                    fetch("/api/sheets/members"),
                    fetch("/api/sheets/finances?summary=true"),
                    fetch("/api/sheets/knowledge"),
                ]);

                const [actData, memData, finData, knData] = await Promise.all([
                    actRes.json(),
                    memRes.json(),
                    finRes.json(),
                    knRes.json(),
                ]);

                if (actData.success) setActivities(actData.data);
                if (memData.success) setMembers(memData.data);
                if (finData.success) setFinanceSummary(finData.data);
                if (knData.success) setKnowledge(knData.data);
            } catch {
                setError("Gagal memuat data himpunan");
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const sections = [
        { id: "activities" as Section, label: "Kegiatan", icon: Calendar, count: activities.length },
        { id: "finances" as Section, label: "Keuangan", icon: DollarSign, count: null },
        { id: "members" as Section, label: "Anggota", icon: Users, count: members.length },
        { id: "knowledge" as Section, label: "Sumber Belajar", icon: BookOpen, count: knowledge.length },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                <span className="ml-4 text-lg text-slate-600">Memuat data himpunan dari Google Sheets...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-32">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <p className="text-lg text-slate-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                    Himpunan <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-700">PPSDM KMITS</span>
                </h1>
                <p className="text-slate-500 max-w-xl mx-auto">
                    Pusat informasi kegiatan, keuangan, keanggotaan, dan sumber belajar — diperbarui otomatis dari Google Spreadsheet.
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">{activities.length}</p>
                            <p className="text-xs text-slate-500">Kegiatan</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">{formatRupiah(financeSummary?.saldo || 0)}</p>
                            <p className="text-xs text-slate-500">Saldo</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                            <Users className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">{members.length}</p>
                            <p className="text-xs text-slate-500">Anggota</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">{knowledge.length}</p>
                            <p className="text-xs text-slate-500">Resources</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Section Tabs */}
            <div className="flex gap-2 border-b pb-2 overflow-x-auto">
                {sections.map((sec) => {
                    const Icon = sec.icon;
                    return (
                        <button
                            key={sec.id}
                            onClick={() => setActiveSection(sec.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-sm font-medium transition-colors whitespace-nowrap ${activeSection === sec.id
                                    ? "bg-white text-blue-700 shadow-sm border border-b-white -mb-[1px]"
                                    : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {sec.label}
                            {sec.count !== null && (
                                <span className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full">
                                    {sec.count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Content */}
            {activeSection === "activities" && (
                <div className="space-y-4">
                    {activities.length === 0 ? (
                        <p className="text-center py-12 text-slate-500">Belum ada kegiatan.</p>
                    ) : (
                        activities.map((a) => (
                            <Card key={a.ID} className="border-none shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="p-5 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shrink-0">
                                        <Activity className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-slate-800 line-clamp-1">{a["Nama Kegiatan"]}</h3>
                                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{a.Tanggal}</span>
                                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{a.Lokasi}</span>
                                        </div>
                                    </div>
                                    <Badge className={statusColor(a.Status)}>{a.Status}</Badge>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            )}

            {activeSection === "finances" && financeSummary && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-none shadow-sm bg-emerald-50">
                        <CardContent className="p-6 text-center">
                            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Pemasukan</p>
                            <p className="text-2xl font-bold text-emerald-700 mt-1">{formatRupiah(financeSummary.totalPemasukan)}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm bg-red-50">
                        <CardContent className="p-6 text-center">
                            <p className="text-xs font-semibold text-red-600 uppercase tracking-wider">Pengeluaran</p>
                            <p className="text-2xl font-bold text-red-700 mt-1">{formatRupiah(financeSummary.totalPengeluaran)}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm bg-blue-50">
                        <CardContent className="p-6 text-center">
                            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Saldo</p>
                            <p className="text-2xl font-bold text-blue-700 mt-1">{formatRupiah(financeSummary.saldo)}</p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {activeSection === "members" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {members.length === 0 ? (
                        <p className="col-span-full text-center py-12 text-slate-500">Belum ada anggota.</p>
                    ) : (
                        members.map((m) => (
                            <Card key={m.NIM} className="border-none shadow-sm">
                                <CardContent className="p-5 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                                        {m.Nama?.[0] || "?"}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-slate-800 truncate">{m.Nama}</p>
                                        <p className="text-xs text-slate-500">{m.Departemen} · {m.Angkatan}</p>
                                        {m.Posisi && <Badge variant="outline" className="mt-1 text-xs">{m.Posisi}</Badge>}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            )}

            {activeSection === "knowledge" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {knowledge.length === 0 ? (
                        <p className="col-span-full text-center py-12 text-slate-500">Belum ada sumber belajar.</p>
                    ) : (
                        knowledge.map((k) => (
                            <Card key={k.ID} className="border-none shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="p-5 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Badge variant="outline">{k.Tipe}</Badge>
                                        <Badge className={
                                            k.Tingkat === "Beginner" ? "bg-green-100 text-green-700" :
                                                k.Tingkat === "Intermediate" ? "bg-amber-100 text-amber-700" :
                                                    "bg-red-100 text-red-700"
                                        }>
                                            {k.Tingkat}
                                        </Badge>
                                    </div>
                                    <h3 className="font-semibold text-slate-800 line-clamp-2">{k.Judul}</h3>
                                    <p className="text-xs text-slate-500">{k.Kategori}</p>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
