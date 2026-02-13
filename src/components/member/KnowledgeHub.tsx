"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    BookOpen,
    ExternalLink,
    Search,
    Star,
    Download,
    Loader2,
    AlertCircle,
    Video,
    FileText,
    Presentation,
    Newspaper,
} from "lucide-react";

interface KnowledgeItem {
    ID: string;
    Judul: string;
    Tipe: string;
    Kategori: string;
    Tingkat: string;
    Durasi: string;
    Pembuat: string;
    Link: string;
    Tag: string[];
    Rating: number;
    Unduhan: number;
}

const typeIcons: Record<string, any> = {
    Video: Video,
    PDF: FileText,
    Presentasi: Presentation,
    Artikel: Newspaper,
};

const difficultyColors: Record<string, string> = {
    Beginner: "bg-green-100 text-green-700 border-green-200",
    Intermediate: "bg-amber-100 text-amber-700 border-amber-200",
    Advanced: "bg-red-100 text-red-700 border-red-200",
};

export function KnowledgeHub() {
    const [resources, setResources] = useState<KnowledgeItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                const res = await fetch("/api/sheets/knowledge");
                const data = await res.json();
                if (data.success) setResources(data.data);
                else setError("Gagal memuat sumber belajar");
            } catch {
                setError("Gagal memuat sumber belajar");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const categories = useMemo(() => {
        const cats = new Set(resources.map((r) => r.Kategori).filter(Boolean));
        return Array.from(cats);
    }, [resources]);

    const filtered = useMemo(() => {
        let data = resources;
        if (search) {
            const q = search.toLowerCase();
            data = data.filter(
                (r) =>
                    r.Judul?.toLowerCase().includes(q) ||
                    r.Tag?.some((t) => t.toLowerCase().includes(q)) ||
                    r.Kategori?.toLowerCase().includes(q)
            );
        }
        if (selectedCategory) data = data.filter((r) => r.Kategori === selectedCategory);
        if (selectedDifficulty) data = data.filter((r) => r.Tingkat === selectedDifficulty);
        return data;
    }, [resources, search, selectedCategory, selectedDifficulty]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-3 text-slate-600">Memuat sumber belajar...</span>
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
            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari sumber belajar..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-sm"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    <Button
                        variant={selectedCategory === null ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(null)}
                    >
                        Semua
                    </Button>
                    {categories.map((cat) => (
                        <Button
                            key={cat}
                            variant={selectedCategory === cat ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                        >
                            {cat}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Difficulty Filter */}
            <div className="flex gap-2">
                {["Beginner", "Intermediate", "Advanced"].map((d) => (
                    <Badge
                        key={d}
                        variant="outline"
                        className={`cursor-pointer transition-all ${selectedDifficulty === d
                                ? difficultyColors[d] + " ring-2 ring-offset-1 ring-blue-300"
                                : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                            }`}
                        onClick={() => setSelectedDifficulty(selectedDifficulty === d ? null : d)}
                    >
                        {d}
                    </Badge>
                ))}
            </div>

            {/* Resource Grid */}
            {filtered.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed rounded-xl">
                    <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">Tidak ada sumber belajar yang cocok.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((r) => {
                        const Icon = typeIcons[r.Tipe] || BookOpen;
                        return (
                            <Card key={r.ID} className="border-none shadow-sm hover:shadow-md transition-shadow group">
                                <CardContent className="p-5 space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0">
                                            <Icon className="w-5 h-5 text-white" />
                                        </div>
                                        <Badge variant="outline" className={difficultyColors[r.Tingkat] || "bg-slate-100 text-slate-600"}>
                                            {r.Tingkat}
                                        </Badge>
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-sm text-slate-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                            {r.Judul}
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {r.Pembuat} · {r.Durasi}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-1">
                                        {r.Tag?.slice(0, 3).map((t) => (
                                            <span key={t} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                                                {t}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t">
                                        <div className="flex items-center gap-3 text-xs text-slate-500">
                                            <span className="flex items-center gap-1">
                                                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                                {r.Rating?.toFixed(1)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Download className="w-3 h-3" />
                                                {r.Unduhan}
                                            </span>
                                        </div>
                                        {r.Link && (
                                            <a href={r.Link} target="_blank" rel="noopener noreferrer">
                                                <Button variant="ghost" size="sm" className="gap-1 text-blue-600 text-xs h-7">
                                                    Buka <ExternalLink className="w-3 h-3" />
                                                </Button>
                                            </a>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
