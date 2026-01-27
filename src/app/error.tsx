"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ASSETS } from "@/config/assets";
import { RefreshCcw, AlertTriangle } from "lucide-react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {

    useEffect(() => {
        // Log error ke monitoring service (misal: Sentry)
        console.error("Quantum Engine Anomaly Detected:", error);
    }, [error]);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">

            <div className="bg-red-50 p-4 rounded-full mb-6">
                <AlertTriangle className="w-12 h-12 text-red-600" />
            </div>

            <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Sistem Mengalami Gangguan
            </h1>

            <p className="text-slate-500 max-w-md mb-8">
                Terdeteksi anomali pada Quantum Engine. Tim teknis ITS sedang menyelidikinya.
                Silakan coba muat ulang halaman.
            </p>

            <div className="flex gap-4">
                <Button
                    onClick={() => reset()}
                    className="bg-[#013880] hover:bg-[#002554] px-6 h-11"
                >
                    <RefreshCcw className="mr-2 w-4 h-4" /> Restart Sistem
                </Button>
                <Button
                    variant="outline"
                    onClick={() => window.location.href = '/'}
                    className="border-slate-300 text-slate-600 hover:bg-slate-100"
                >
                    Kembali ke Beranda
                </Button>
            </div>

            <div className="mt-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                <Image
                    src={ASSETS.its.logo_biru}
                    alt="ITS Logo"
                    width={100}
                    height={40}
                />
            </div>
        </div>
    );
}
