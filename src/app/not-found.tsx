import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ASSETS } from "@/config/assets";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
            <div className="relative w-64 h-64 mb-6">
                <Image
                    src={ASSETS.mascot.seno_studio} // Pastikan config assets ada
                    alt="Seno Bingung"
                    fill
                    className="object-contain opacity-80"
                />
            </div>

            <div className="space-y-3 max-w-md">
                <div className="flex items-center justify-center gap-2 text-[#013880] mb-2">
                    <SearchX className="w-8 h-8" />
                    <h1 className="text-4xl font-bold">404</h1>
                </div>
                <h2 className="text-xl font-semibold text-slate-800">
                    Halaman Hilang dalam Dimensi Lain
                </h2>
                <p className="text-slate-500">
                    Maaf, Seno tidak bisa menemukan halaman yang kamu cari di Quantum Library kami. Mungkin link-nya rusak atau sudah dipindahkan.
                </p>
            </div>

            <Link href="/library" className="mt-8">
                <Button className="bg-[#013880] hover:bg-[#002554] px-8 h-12 rounded-xl text-lg shadow-lg shadow-blue-900/10 transition-all hover:scale-105">
                    <ArrowLeft className="mr-2 w-5 h-5" /> Kembali ke Markas
                </Button>
            </Link>
        </div>
    );
}
