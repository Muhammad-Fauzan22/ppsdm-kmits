import { createClient } from "@/lib/supabase/server";
import { ResourceViewer } from "@/components/library/ResourceViewer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// Halaman ini bersifat Server Component (SEO Friendly & Cepat)
export default async function ResourceDetailPage({ params }: { params: { id: string } }) {
    const supabase = await createClient();

    // Ambil data buku + konten AI (derived_content)
    const { data: resource, error } = await supabase
        .from("learning_resources")
        .select("*")
        .eq("id", params.id)
        .single();

    if (error || !resource) {
        return notFound();
    }

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            {/* Navigation */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <Link href="/library">
                    <Button variant="ghost" className="mb-4 hover:bg-white/50">
                        <ArrowLeft className="mr-2 size-4" /> Kembali ke Perpustakaan
                    </Button>
                </Link>

                {/* The Main Event: Resource Viewer */}
                <ResourceViewer resource={resource} />
            </div>
        </div>
    );
}
