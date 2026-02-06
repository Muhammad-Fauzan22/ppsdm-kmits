import Image from "next/image";
import { AssetConfig } from "@/lib/dynamicAssets";

interface DashboardHeaderProps {
    assets: AssetConfig;
}

export function DashboardHeader({ assets }: DashboardHeaderProps) {
    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

                {/* LOGO COMPLIANCE: Menggunakan Asset Dinamis dari Props */}
                <div className="flex items-center gap-3">
                    <div className="relative w-32 h-10">
                        <Image
                            src={assets.its.logo.blue}
                            alt="Logo ITS"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    {/* Divider vertikal tipis */}
                    <div className="h-8 w-[1px] bg-slate-300 mx-1"></div>

                    <div className="flex flex-col">
                        <span className="font-heading text-its-DEFAULT font-bold text-lg leading-none tracking-tight">
                            PPSDM
                        </span>
                        <span className="text-[10px] font-sans font-medium text-slate-500 uppercase tracking-wider">
                            KM ITS Development
                        </span>
                    </div>
                </div>

                {/* Placeholder User Menu (Bisa ditambahkan later) */}
                <div className="h-8 w-8 bg-slate-100 rounded-full"></div>
            </div>
        </header>
    );
}
