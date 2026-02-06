'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import HeroBoomerang from '@/components/HeroBoomerang';

export default function HeroVideo() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();

    // Efek Parallax halus saat scroll
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <div ref={containerRef} className="relative h-screen w-full overflow-hidden bg-slate-900">

            {/* Background Video Layer */}
            <motion.div
                className="absolute inset-0 w-full h-full"
                style={{ y: y1, opacity }}
            >
                <div className="absolute inset-0 bg-[#013880]/30 z-10 mix-blend-multiply pointer-events-none" /> {/* Tint ITS Blue */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-20 pointer-events-none" />

                {/* Placeholder Video - Ganti src dengan file hasil convert sequence Anda */}
                <HeroBoomerang />
            </motion.div>

            {/* Content Layer */}
            <div className="relative z-30 flex flex-col items-center justify-center h-full px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-[#FFBD07]/20 text-[#FFBD07] border border-[#FFBD07]/50 text-sm font-semibold mb-6 backdrop-blur-md">
                        PPSDM KM ITS v2.0
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-lg">
                        Bangun Masa Depan <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
                            Teknologi Maritim
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Platform pengembangan sumber daya manusia berbasis
                        <span className="text-[#FFBD07] font-semibold mx-1">Quantum Learning</span>
                        untuk mahasiswa Institut Teknologi Sepuluh Nopember.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            asChild
                            size="lg"
                            className="bg-[#013880] hover:bg-[#012a60] text-white border-2 border-transparent hover:border-[#FFBD07] transition-all duration-300 rounded-xl px-8 h-14 text-lg shadow-[0_0_20px_rgba(1,56,128,0.5)]"
                        >
                            <Link href="/try-assessment">
                                Mulai Assessment
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-[#FFBD07] rounded-xl px-8 h-14 text-lg backdrop-blur-sm"
                        >
                            <Link href="#methodology">
                                Lihat Fitur
                            </Link>
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
