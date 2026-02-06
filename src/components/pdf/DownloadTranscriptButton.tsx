"use client";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { FileText, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";

// Lazy load PDF renderer agar tidak memberatkan loading awal halaman dashboard
const PDFDownloadLink = dynamic(
    () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
    {
        ssr: false,
        loading: () => (
            <Button disabled variant="outline" className="gap-2">
                <Loader2 className="size-4 animate-spin" /> Menyiapkan PDF...
            </Button>
        ),
    }
);

// Import Dokumen (Pastikan path sesuai)
import { TranscriptDocument } from "./TranscriptDocument";

export function DownloadTranscriptButton({ student, activities }: { student: any, activities: any[] }) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null; // Prevent hydration mismatch

    return (
        <PDFDownloadLink
            document={<TranscriptDocument student={student} activities={activities} />}
            fileName={`Transkrip_PPSDM_${student.nrp}.pdf`}
        >
            {/* @ts-ignore: React-PDF typing issue */}
            {({ blob, url, loading, error }) => (
                <Button
                    disabled={loading}
                    className="gap-2 bg-its text-white hover:bg-its-light shadow-soft transition-all"
                >
                    {loading ? (
                        <Loader2 className="size-4 animate-spin" />
                    ) : (
                        <FileText className="size-4" />
                    )}
                    {loading ? "Generating..." : "Cetak Transkrip Resmi"}
                </Button>
            )}
        </PDFDownloadLink>
    );
}
