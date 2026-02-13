import { Metadata } from "next";
import { getActivities } from "@/lib/google-sheets/sheets-api";
import { ActivitiesClient } from "@/components/activities/ActivitiesClient";

export const dynamic = "force-dynamic";
export const revalidate = 300;

export const metadata: Metadata = {
    title: "Kegiatan | PPSDM KMITS",
    description: "Daftar kegiatan dan aktivitas himpunan PPSDM KMITS.",
};

export default async function ActivitiesPage() {
    let activities: any[] = [];
    let error: string | null = null;

    try {
        activities = await getActivities();
    } catch (err) {
        console.error("[ActivitiesPage] Failed to load:", err);
        error = "Gagal memuat data kegiatan. Silakan coba lagi nanti.";
    }

    return (
        <div className="min-h-screen bg-muted/40 font-sans text-foreground">
            <ActivitiesClient initialActivities={activities} error={error} />
        </div>
    );
}
