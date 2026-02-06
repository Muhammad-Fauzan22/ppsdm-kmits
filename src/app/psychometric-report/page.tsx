"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import PsychometricRadar from "@/components/PsychometricRadar";
import { FadeIn, SlideUp } from "@/components/Animations";
import { Printer, Share2, Download, AlertCircle, FileText, CheckCircle } from "lucide-react";

export default function PsychometricReportPage() {
    const reportRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        window.print();
    };

    const radarData = [
        { subject: 'Cognitive', value: 90, fullMark: 100 },
        { subject: 'Affective', value: 75, fullMark: 100 },
        { subject: 'Psychomotor', value: 82, fullMark: 100 },
        { subject: 'Social', value: 95, fullMark: 100 },
        { subject: 'Spiritual', value: 88, fullMark: 100 },
        { subject: 'Financial', value: 65, fullMark: 100 },
        { subject: 'Health', value: 80, fullMark: 100 },
        { subject: 'Environment', value: 70, fullMark: 100 },
        { subject: 'Character', value: 92, fullMark: 100 },
    ];

    const dimensionDetails = [
        {
            dim: "Kognitif",
            score: 90,
            status: "Excellent",
            desc: "Kemampuan analisis dan pemecahan masalah sangat tinggi.",
            rec: "Pertahankan, ikuti kompetisi akademik tingkat nasional.",
            color: "text-blue-600 bg-blue-50 border-blue-200"
        },
        {
            dim: "Afektif",
            score: 75,
            status: "Good",
            desc: "Mampu mengelola emosi dengan baik.",
            rec: "Tingkatkan empati melalui kegiatan sosial.",
            color: "text-green-600 bg-green-50 border-green-200"
        },
        {
            dim: "Psikomotorik",
            score: 82,
            status: "Very Good",
            desc: "Keterampilan teknis dan praktis yang solid.",
            rec: "Ikuti workshop sertifikasi teknis.",
            color: "text-purple-600 bg-purple-50 border-purple-200"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 font-sans text-foreground p-6 md:p-12 print:p-0 print:bg-white">
            <div className="max-w-5xl mx-auto space-y-8" ref={reportRef}>
                {/* Header Actions */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
                    <div>
                        <FadeIn>
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">Psychometric Report</h1>
                            <p className="text-muted-foreground mt-1">Generated on January 16, 2026 • Valid for Semester 5</p>
                        </FadeIn>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="gap-2" onClick={handlePrint}>
                            <Printer className="size-4" /> Print
                        </Button>
                        <Button variant="outline" className="gap-2">
                            <Share2 className="size-4" /> Share
                        </Button>
                        <Button className="gap-2 bg-its-blue hover:bg-blue-800 text-white">
                            <Download className="size-4" /> Download PDF
                        </Button>
                    </div>
                </div>

                {/* Report Content */}
                <SlideUp delay={0.1}>
                    <Card className="border-none shadow-xl overflow-hidden print:shadow-none print:border">
                        <div className="h-4 bg-gradient-to-r from-its-blue via-blue-500 to-cyan-400"></div>
                        <CardHeader className="pb-8 border-b bg-white dark:bg-zinc-900">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    <div className="size-16 rounded-xl bg-its-blue/10 flex items-center justify-center text-its-blue border border-blue-100">
                                        <FileText className="size-8" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-2xl font-bold text-its-blue">PPSDM KMM</CardTitle>
                                        <CardDescription className="font-medium text-base">Himpunan Mahasiswa Mesin ITS</CardDescription>
                                        <div className="mt-2 flex gap-2">
                                            <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">Verified</Badge>
                                            <Badge variant="outline">Assessment ID: #882190</Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right hidden md:block">
                                    <h3 className="text-lg font-bold">Rian Santoso</h3>
                                    <p className="text-sm text-gray-500">NRP: 5025201001</p>
                                    <p className="text-sm text-gray-500">Teknik Informatika</p>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-8 bg-white dark:bg-zinc-900">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                {/* Left: Radar Chart */}
                                <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-zinc-800/50 rounded-2xl p-6 border border-gray-100 dark:border-zinc-800">
                                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                        <AlertCircle className="size-5 text-its-blue" />
                                        9-Dimension Mapping
                                    </h3>
                                    <div className="w-full h-[350px]">
                                        <PsychometricRadar data={radarData} title="" description="" />
                                    </div>
                                    <div className="mt-6 text-center text-sm text-muted-foreground max-w-xs">
                                        Grafik ini menunjukkan keseimbangan pengembangan diri anda di 9 dimensi utama.
                                    </div>
                                </div>

                                {/* Right: Summary & Key Insights */}
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-foreground">
                                            Executive Summary
                                        </h3>
                                        <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                                            Berdasarkan hasil assessment, Anda memiliki kekuatan dominan pada aspek <span className="font-bold text-its-blue">Kognitif</span> dan <span className="font-bold text-green-600">Sosial</span>. Kemampuan akademis dan interpersonal Anda sangat baik. Namun, perlu perhatian lebih pada aspek <span className="font-bold text-red-500">Finansial</span> dan <span className="font-bold text-orange-500">Afektif</span> untuk mencapai keseimbangan holistik yang optimal.
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold mb-4 text-foreground">Detailed Breakdown</h3>
                                        <div className="space-y-4">
                                            {dimensionDetails.map((item, idx) => (
                                                <div key={idx} className={`p-4 rounded-xl border-l-4 ${item.color.replace('text-', 'border-l-')} bg-white dark:bg-zinc-900 shadow-sm border border-gray-100 dark:border-zinc-800`}>
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="font-bold text-base">{item.dim}</span>
                                                        <span className={`text-sm font-bold px-2 py-0.5 rounded ${item.color.split(' ')[1]} ${item.color.split(' ')[0]}`}>{item.score}/100</span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{item.desc}</p>
                                                    <div className="flex items-start gap-2 text-xs font-medium text-gray-500 bg-gray-50 dark:bg-zinc-800 p-2 rounded">
                                                        <CheckCircle className="size-3 mt-0.5 text-green-500" />
                                                        <span>Rec: {item.rec}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </SlideUp>

                <FadeIn delay={0.2}>
                    <div className="bg-blue-600 text-white rounded-xl p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 print:hidden">
                        <div>
                            <h3 className="text-2xl font-bold mb-2">Siap untuk Level-Up?</h3>
                            <p className="text-blue-100 max-w-xl">
                                Dapatkan rencana pengembangan diri yang telah dipersonalisasi berdasarkan hasil laporan ini.
                            </p>
                        </div>
                        <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 shadow-lg">
                            Generate Action Plan
                        </Button>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
}
