"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Users,
    Search,
    GraduationCap,
    Briefcase,
    Star,
    Loader2,
    AlertCircle,
    Mail,
    Filter,
} from "lucide-react";

interface MemberData {
    NIM: string;
    Nama: string;
    Email: string;
    Angkatan: string;
    Departemen: string;
    Posisi: string;
    Divisi: string;
    Skill: string[];
    Proyek: string[];
    skorRataRata: number;
}

const positionColors: Record<string, string> = {
    Ketua: "bg-red-100 text-red-700 border-red-200",
    "Wakil Ketua": "bg-orange-100 text-orange-700 border-orange-200",
    Sekretaris: "bg-blue-100 text-blue-700 border-blue-200",
    Bendahara: "bg-green-100 text-green-700 border-green-200",
    Koordinator: "bg-purple-100 text-purple-700 border-purple-200",
};

export function MemberDirectory() {
    const [members, setMembers] = useState<MemberData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const [selectedDept, setSelectedDept] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                const res = await fetch("/api/sheets/members");
                const data = await res.json();
                if (data.success) setMembers(data.data);
                else setError("Gagal memuat data anggota");
            } catch {
                setError("Gagal memuat data anggota");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const years = useMemo(() => {
        const s = new Set(members.map((m) => m.Angkatan).filter(Boolean));
        return Array.from(s).sort().reverse();
    }, [members]);

    const departments = useMemo(() => {
        const s = new Set(members.map((m) => m.Departemen).filter(Boolean));
        return Array.from(s).sort();
    }, [members]);

    const filtered = useMemo(() => {
        let data = members;
        if (search) {
            const q = search.toLowerCase();
            data = data.filter(
                (m) =>
                    m.Nama?.toLowerCase().includes(q) ||
                    m.NIM?.includes(q) ||
                    m.Skill?.some((s) => s.toLowerCase().includes(q))
            );
        }
        if (selectedYear) data = data.filter((m) => m.Angkatan === selectedYear);
        if (selectedDept) data = data.filter((m) => m.Departemen === selectedDept);
        return data;
    }, [members, search, selectedYear, selectedDept]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-3 text-slate-600">Memuat data anggota...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                <p className="text-slate-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Search + Filters */}
            <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari nama, NIM, atau skill..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-sm"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    <select
                        value={selectedYear || ""}
                        onChange={(e) => setSelectedYear(e.target.value || null)}
                        className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                        <option value="">Semua Angkatan</option>
                        {years.map((y) => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                    <select
                        value={selectedDept || ""}
                        onChange={(e) => setSelectedDept(e.target.value || null)}
                        className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                        <option value="">Semua Departemen</option>
                        {departments.map((d) => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {filtered.length} anggota
                </span>
                {selectedYear && <Badge variant="outline" className="cursor-pointer" onClick={() => setSelectedYear(null)}>✕ {selectedYear}</Badge>}
                {selectedDept && <Badge variant="outline" className="cursor-pointer" onClick={() => setSelectedDept(null)}>✕ {selectedDept}</Badge>}
            </div>

            {/* Member Grid */}
            {filtered.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed rounded-xl">
                    <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">Tidak ada anggota yang cocok.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((m) => (
                        <Card key={m.NIM} className="border-none shadow-sm hover:shadow-md transition-all group">
                            <CardContent className="p-5 space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-lg shadow-blue-500/20">
                                        {m.Nama?.[0] || "?"}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                                            {m.Nama}
                                        </h3>
                                        <p className="text-xs text-slate-500">{m.NIM}</p>
                                    </div>
                                    {m.skorRataRata > 0 && (
                                        <div className="flex items-center gap-1 text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-full">
                                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                            {m.skorRataRata}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-1.5 text-xs">
                                    <span className="flex items-center gap-1 text-slate-500">
                                        <GraduationCap className="w-3 h-3" />
                                        {m.Angkatan}
                                    </span>
                                    <span className="flex items-center gap-1 text-slate-500">
                                        <Briefcase className="w-3 h-3" />
                                        {m.Departemen}
                                    </span>
                                    {m.Divisi && (
                                        <Badge variant="outline" className="text-[10px] py-0 h-5">{m.Divisi}</Badge>
                                    )}
                                </div>

                                {m.Posisi && (
                                    <Badge
                                        variant="outline"
                                        className={`text-xs ${positionColors[m.Posisi] || "bg-slate-100 text-slate-600"}`}
                                    >
                                        {m.Posisi}
                                    </Badge>
                                )}

                                {m.Skill && m.Skill.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {m.Skill.slice(0, 4).map((s) => (
                                            <span key={s} className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">
                                                {s}
                                            </span>
                                        ))}
                                        {m.Skill.length > 4 && (
                                            <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">
                                                +{m.Skill.length - 4}
                                            </span>
                                        )}
                                    </div>
                                )}

                                {m.Email && (
                                    <a
                                        href={`mailto:${m.Email}`}
                                        className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 transition-colors pt-1"
                                    >
                                        <Mail className="w-3 h-3" />
                                        {m.Email}
                                    </a>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
