"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    FileText,
    CheckCircle2,
    Loader2,
    AlertCircle,
} from "lucide-react";

interface FinanceItem {
    "ID Transaksi": string;
    Tanggal: string;
    Deskripsi: string;
    Kategori: string;
    Jumlah: number;
    "Metode Pembayaran": string;
    Bukti: string;
    Disetujui: string;
    "Kode Anggaran": string;
}

interface FinanceSummary {
    totalPemasukan: number;
    totalPengeluaran: number;
    saldo: number;
    perKategori: Record<string, number>;
    transaksiTerakhir: FinanceItem[];
}

function formatRupiah(amount: number): string {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(amount);
}

function categoryColor(cat: string) {
    const map: Record<string, string> = {
        Pemasukan: "bg-emerald-100 text-emerald-700 border-emerald-200",
        Operasional: "bg-blue-100 text-blue-700 border-blue-200",
        Acara: "bg-purple-100 text-purple-700 border-purple-200",
        Aset: "bg-amber-100 text-amber-700 border-amber-200",
        Lainnya: "bg-gray-100 text-gray-700 border-gray-200",
    };
    return map[cat] || map.Lainnya;
}

export function TransparencyPortal() {
    const [summary, setSummary] = useState<FinanceSummary | null>(null);
    const [transactions, setTransactions] = useState<FinanceItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                const [sumRes, allRes] = await Promise.all([
                    fetch("/api/sheets/finances?summary=true"),
                    fetch("/api/sheets/finances"),
                ]);
                const sumData = await sumRes.json();
                const allData = await allRes.json();

                if (sumData.success) setSummary(sumData.data);
                if (allData.success) setTransactions(allData.data);
            } catch (err) {
                setError("Gagal memuat data keuangan");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-3 text-slate-600">Memuat data transparansi...</span>
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
        <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-none shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100/50">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Total Pemasukan</p>
                                <p className="text-2xl font-bold text-emerald-700 mt-1">
                                    {formatRupiah(summary?.totalPemasukan || 0)}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-emerald-200/50 rounded-xl flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-emerald-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-gradient-to-br from-red-50 to-red-100/50">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-red-600 uppercase tracking-wider">Total Pengeluaran</p>
                                <p className="text-2xl font-bold text-red-700 mt-1">
                                    {formatRupiah(summary?.totalPengeluaran || 0)}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-red-200/50 rounded-xl flex items-center justify-center">
                                <TrendingDown className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/50">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Saldo</p>
                                <p className="text-2xl font-bold text-blue-700 mt-1">
                                    {formatRupiah(summary?.saldo || 0)}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-blue-200/50 rounded-xl flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Category Breakdown */}
            {summary?.perKategori && Object.keys(summary.perKategori).length > 0 && (
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Breakdown per Kategori</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {Object.entries(summary.perKategori).map(([cat, amount]) => {
                                const total = summary.totalPemasukan + summary.totalPengeluaran;
                                const pct = total > 0 ? (amount / total) * 100 : 0;
                                return (
                                    <div key={cat} className="flex items-center gap-3">
                                        <Badge variant="outline" className={`${categoryColor(cat)} min-w-[100px] justify-center`}>
                                            {cat}
                                        </Badge>
                                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all"
                                                style={{ width: `${Math.min(pct, 100)}%` }}
                                            />
                                        </div>
                                        <span className="text-sm font-semibold text-slate-700 min-w-[120px] text-right">
                                            {formatRupiah(amount)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Transaction Table */}
            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Riwayat Transaksi
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {transactions.length === 0 ? (
                        <p className="text-center text-slate-500 py-8">Belum ada transaksi yang tercatat.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-left text-slate-500">
                                        <th className="pb-3 font-semibold">Tanggal</th>
                                        <th className="pb-3 font-semibold">Deskripsi</th>
                                        <th className="pb-3 font-semibold">Kategori</th>
                                        <th className="pb-3 font-semibold text-right">Jumlah</th>
                                        <th className="pb-3 font-semibold text-center">Bukti</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((t, i) => (
                                        <tr key={t["ID Transaksi"] || i} className="border-b border-slate-100 last:border-0">
                                            <td className="py-3 text-slate-600">{t.Tanggal}</td>
                                            <td className="py-3 font-medium text-slate-800">{t.Deskripsi}</td>
                                            <td className="py-3">
                                                <Badge variant="outline" className={`${categoryColor(t.Kategori)} text-xs`}>
                                                    {t.Kategori}
                                                </Badge>
                                            </td>
                                            <td className={`py-3 text-right font-semibold ${t.Kategori === "Pemasukan" ? "text-emerald-600" : "text-red-600"}`}>
                                                {t.Kategori === "Pemasukan" ? "+" : "-"}{formatRupiah(t.Jumlah)}
                                            </td>
                                            <td className="py-3 text-center">
                                                {t.Bukti ? (
                                                    <a href={t.Bukti} target="_blank" rel="noopener noreferrer">
                                                        <Button variant="ghost" size="sm" className="gap-1 text-blue-600">
                                                            <ArrowUpRight className="w-3 h-3" />
                                                            Lihat
                                                        </Button>
                                                    </a>
                                                ) : (
                                                    <CheckCircle2 className="w-4 h-4 text-slate-300 mx-auto" />
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
