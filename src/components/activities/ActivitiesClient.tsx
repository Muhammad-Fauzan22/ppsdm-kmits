"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    CheckCircle,
    Clock,
    Calendar,
    Plus,
    MoreVertical,
    Inbox,
    ListChecks,
    Activity as ActivityIcon,
    Filter,
    MapPin,
    Users,
    AlertCircle,
} from "lucide-react";
import { FadeIn, SlideUp, StaggerContainer, StaggerItem } from "@/components/Animations";

interface Activity {
    ID: string;
    "Nama Kegiatan": string;
    Tanggal: string;
    Lokasi: string;
    Penyelenggara: string;
    Peserta: string[];
    Anggaran: number;
    Pengeluaran: number;
    Status: "Rencana" | "Berlangsung" | "Selesai" | "Dibatalkan";
}

interface Props {
    initialActivities: Activity[];
    error: string | null;
}

const statusConfig = {
    Rencana: { color: "bg-blue-100 text-blue-700 border-blue-200", icon: Clock, label: "Rencana" },
    Berlangsung: { color: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: ActivityIcon, label: "Berlangsung" },
    Selesai: { color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle, label: "Selesai" },
    Dibatalkan: { color: "bg-red-100 text-red-700 border-red-200", icon: AlertCircle, label: "Dibatalkan" },
};

function formatRupiah(n: number) {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
}

export function ActivitiesClient({ initialActivities, error }: Props) {
    type FilterType = "all" | "Rencana" | "Berlangsung" | "Selesai" | "Dibatalkan";
    const [filter, setFilter] = useState<FilterType>("all");

    const activities = initialActivities || [];
    const filteredActivities = filter === "all"
        ? activities
        : activities.filter((a) => a.Status === filter);

    const totalAnggaran = activities.reduce((acc, a) => acc + (a.Anggaran || 0), 0);
    const totalSelesai = activities.filter((a) => a.Status === "Selesai").length;

    if (error) {
        return (
            <div className="text-center py-20">
                <AlertCircle className="size-12 text-red-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-foreground">{error}</h3>
            </div>
        );
    }

    return (
        <>
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <ListChecks className="size-6" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold tracking-tight">Kegiatan Himpunan</h1>
                            <p className="text-xs text-muted-foreground">Data langsung dari Google Sheets</p>
                        </div>
                    </Link>
                </div>
                <Button className="gap-2 shadow-sm">
                    <Plus className="size-4" />
                    Tambah Kegiatan
                </Button>
            </header>

            <main className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
                {/* Stats Summary */}
                <FadeIn>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card className="border-none shadow-sm bg-white dark:bg-card">
                            <CardContent className="p-6 flex flex-col gap-1">
                                <span className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Total</span>
                                <div className="flex items-end justify-between">
                                    <span className="text-3xl font-bold">{activities.length}</span>
                                    <ListChecks className="size-5 text-muted-foreground opacity-50" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-sm bg-white dark:bg-card">
                            <CardContent className="p-6 flex flex-col gap-1">
                                <span className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Selesai</span>
                                <div className="flex items-end justify-between">
                                    <span className="text-3xl font-bold text-green-600">{totalSelesai}</span>
                                    <CheckCircle className="size-5 text-green-600 opacity-50" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-sm bg-white dark:bg-card">
                            <CardContent className="p-6 flex flex-col gap-1">
                                <span className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Berlangsung</span>
                                <div className="flex items-end justify-between">
                                    <span className="text-3xl font-bold text-yellow-600">{activities.filter((a) => a.Status === "Berlangsung").length}</span>
                                    <ActivityIcon className="size-5 text-yellow-600 opacity-50" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-sm bg-white dark:bg-card">
                            <CardContent className="p-6 flex flex-col gap-1">
                                <span className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Total Anggaran</span>
                                <div className="flex items-end justify-between">
                                    <span className="text-2xl font-bold text-primary">{formatRupiah(totalAnggaran)}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </FadeIn>

                {/* Filter Tabs */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 p-1 bg-muted rounded-lg border">
                        {(["all", "Berlangsung", "Rencana", "Selesai", "Dibatalkan"] as const).map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === status
                                    ? "bg-white dark:bg-zinc-800 text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10"
                                    }`}
                            >
                                {status === "all" ? "Semua" : status}
                            </button>
                        ))}
                    </div>
                    <Button variant="outline" size="sm" className="gap-2 text-muted-foreground">
                        <Filter className="size-4" />
                        Urutkan
                    </Button>
                </div>

                {/* Activity List */}
                <StaggerContainer className="space-y-4">
                    {filteredActivities.map((activity) => {
                        const config = statusConfig[activity.Status] || statusConfig.Rencana;
                        const StatusIcon = config.icon;
                        return (
                            <StaggerItem key={activity.ID}>
                                <Card className="border-none shadow-sm hover:shadow-md transition-shadow group">
                                    <CardContent className="p-5 flex items-center gap-5">
                                        <div className="size-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-black/5">
                                            <StatusIcon className="size-6" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4">
                                                <div>
                                                    <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                                        {activity["Nama Kegiatan"]}
                                                    </h3>
                                                    <div className="flex items-center gap-3 mt-1.5">
                                                        <Badge variant="outline" className={`font-medium border-transparent ${config.color}`}>
                                                            {config.label}
                                                        </Badge>
                                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <Calendar className="size-3.5" />
                                                            {activity.Tanggal}
                                                        </span>
                                                        {activity.Lokasi && (
                                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                                <MapPin className="size-3.5" />
                                                                {activity.Lokasi}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between md:justify-end gap-6 mt-2 md:mt-0 w-full md:w-auto">
                                                    {activity.Peserta && activity.Peserta.length > 0 && (
                                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                            <Users className="size-3.5" />
                                                            {activity.Peserta.length} peserta
                                                        </div>
                                                    )}
                                                    <div className="text-right">
                                                        <p className="text-sm font-bold text-primary">{formatRupiah(activity.Anggaran || 0)}</p>
                                                        <p className="text-[10px] uppercase text-muted-foreground font-semibold">Anggaran</p>
                                                    </div>
                                                    <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-foreground">
                                                        <MoreVertical className="size-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </StaggerItem>
                        );
                    })}
                </StaggerContainer>

                {filteredActivities.length === 0 && (
                    <FadeIn>
                        <div className="text-center py-20 border-2 border-dashed rounded-xl">
                            <div className="size-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                <Inbox className="size-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">Tidak ada kegiatan</h3>
                            <p className="text-muted-foreground max-w-sm mx-auto mt-1">
                                {activities.length === 0
                                    ? "Belum ada data kegiatan di Google Sheets. Tambahkan data di spreadsheet untuk melihatnya di sini."
                                    : "Tidak ada kegiatan yang cocok dengan filter. Coba ubah filter."}
                            </p>
                            <Button variant="outline" className="mt-6" onClick={() => { }}>
                                Reset Filter
                            </Button>
                        </div>
                    </FadeIn>
                )}
            </main>
        </>
    );
}
