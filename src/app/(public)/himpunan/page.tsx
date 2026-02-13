import { Metadata } from "next";
import { HimpunanDashboard } from "@/components/himpunan/HimpunanDashboard";

export const dynamic = "force-dynamic";
export const revalidate = 300; // ISR: 5 min

export const metadata: Metadata = {
    title: "Himpunan Overview | PPSDM KMITS",
    description:
        "Halaman utama himpunan PPSDM KMITS — Kegiatan, Keuangan, Anggota, dan Sumber Belajar.",
};

export default function HimpunanPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <HimpunanDashboard />
        </div>
    );
}
