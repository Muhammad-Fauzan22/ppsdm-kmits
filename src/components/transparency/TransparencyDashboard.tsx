"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RefreshCw, Eye, DollarSign, Calendar, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface Activity {
    Activity_ID: string;
    Activity_Name: string;
    Date_Time: string;
    Location: string;
    Organizer: string;
    Participants_List: string[];
    Budget_Allocated: number;
    Budget_Used: number;
    Status: "Planning" | "Active" | "Completed" | "Cancelled";
}

export interface Finance {
    Transaction_ID: string;
    Date: string;
    Description: string;
    Category: string;
    Amount: number;
    Payment_Method: string;
    Verified: boolean;
}

interface TransparencyDashboardProps {
    initialActivities: Activity[];
    initialFinances: Finance[];
}

export function TransparencyDashboard({ initialActivities, initialFinances }: TransparencyDashboardProps) {
    const [activities] = useState<Activity[]>(initialActivities);
    const [finances] = useState<Finance[]>(initialFinances);
    const [activeTab, setActiveTab] = useState<"activities" | "finances">("activities");

    const statusColor = (status: string) => {
        switch (status) {
            case "Completed":
                return "bg-green-100 text-green-800 border-green-200";
            case "Active":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "Planning":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "Cancelled":
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const categoryColor = (category: string) => {
        if (category === "Income") {
            return "bg-green-100 text-green-800 border-green-200";
        }
        return "bg-red-100 text-red-800 border-red-200";
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Transparansi Kegiatan</h1>
                    <p className="text-muted-foreground mt-1">
                        Informasi tentang kegiatan dan keuangan organisasi secara terbuka dan transparan
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.reload()}
                    className="flex items-center gap-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh Data
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-200 rounded-full">
                                <Calendar className="w-6 h-6 text-blue-700" />
                            </div>
                            <div>
                                <p className="text-sm text-blue-700 font-medium">Total Kegiatan</p>
                                <p className="text-2xl font-bold text-blue-900">{activities.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-200 rounded-full">
                                <Eye className="w-6 h-6 text-green-700" />
                            </div>
                            <div>
                                <p className="text-sm text-green-700 font-medium">Kegiatan Aktif</p>
                                <p className="text-2xl font-bold text-green-900">
                                    {activities.filter(a => a.Status === "Active").length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-200 rounded-full">
                                <DollarSign className="w-6 h-6 text-purple-700" />
                            </div>
                            <div>
                                <p className="text-sm text-purple-700 font-medium">Total Pemasukan</p>
                                <p className="text-2xl font-bold text-purple-900">
                                    Rp {finances.filter(f => f.Category === "Income").reduce((sum, f) => sum + f.Amount, 0).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-orange-200 rounded-full">
                                <FileText className="w-6 h-6 text-orange-700" />
                            </div>
                            <div>
                                <p className="text-sm text-orange-700 font-medium">Total Pengeluaran</p>
                                <p className="text-2xl font-bold text-orange-900">
                                    Rp {finances.filter(f => f.Category !== "Income").reduce((sum, f) => sum + f.Amount, 0).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <div className="border-b mb-6">
                <nav className="flex space-x-8">
                    <button
                        onClick={() => setActiveTab("activities")}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "activities"
                                ? "border-primary text-primary"
                                : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
                            }`}
                    >
                        Kegiatan
                    </button>
                    <button
                        onClick={() => setActiveTab("finances")}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "finances"
                                ? "border-primary text-primary"
                                : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
                            }`}
                    >
                        Keuangan
                    </button>
                </nav>
            </div>

            {/* Activities Tab */}
            {activeTab === "activities" && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Daftar Kegiatan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID Kegiatan</TableHead>
                                    <TableHead>Nama Kegiatan</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead>Lokasi</TableHead>
                                    <TableHead>Penyelenggara</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Budget</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {activities.map((activity) => (
                                    <TableRow key={activity.Activity_ID}>
                                        <TableCell className="font-medium">{activity.Activity_ID}</TableCell>
                                        <TableCell>{activity.Activity_Name}</TableCell>
                                        <TableCell>{activity.Date_Time}</TableCell>
                                        <TableCell>{activity.Location}</TableCell>
                                        <TableCell>{activity.Organizer}</TableCell>
                                        <TableCell>
                                            <Badge className={statusColor(activity.Status)}>
                                                {activity.Status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            Rp {activity.Budget_Allocated.toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {activities.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                Tidak ada data kegiatan
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Finances Tab */}
            {activeTab === "finances" && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <DollarSign className="w-5 h-5" />
                            Laporan Keuangan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID Transaksi</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead>Deskripsi</TableHead>
                                    <TableHead>Kategori</TableHead>
                                    <TableHead>Jumlah</TableHead>
                                    <TableHead>Metode Pembayaran</TableHead>
                                    <TableHead>Verifikasi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {finances.map((finance) => (
                                    <TableRow key={finance.Transaction_ID}>
                                        <TableCell className="font-medium">{finance.Transaction_ID}</TableCell>
                                        <TableCell>{finance.Date}</TableCell>
                                        <TableCell>{finance.Description}</TableCell>
                                        <TableCell>
                                            <Badge className={categoryColor(finance.Category)}>
                                                {finance.Category}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            Rp {finance.Amount.toLocaleString()}
                                        </TableCell>
                                        <TableCell>{finance.Payment_Method}</TableCell>
                                        <TableCell>
                                            {finance.Verified ? (
                                                <Badge className="bg-green-100 text-green-800 border-green-200">
                                                    Terverifikasi
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                                    Menunggu
                                                </Badge>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {finances.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                Tidak ada data keuangan
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Footer */}
            <div className="mt-8 text-center text-sm text-muted-foreground">
                <p>Data diperbarui secara otomatis dari Google Sheets</p>
                <p className="mt-1">Terakhir diperbarui: {new Date().toLocaleString()}</p>
            </div>
        </div>
    );
}
