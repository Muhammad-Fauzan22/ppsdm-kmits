"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldCheck, FileText, Lock, CheckCircle2 } from "lucide-react";

export interface Reference {
    author: string;
    year: number;
    title: string;
    source: string;
}

export interface ConsentDisclaimerProps {
    dimensionName: string;
    reliabilityRange: string;
    testRetestRange: string;
    sampleSize: number;
    validationYear: string;
    references: Reference[];
    onBack: () => void;
    onContinue: () => void;
    agreement: { read: boolean; consent: boolean };
    setAgreement: (value: { read: boolean; consent: boolean }) => void;
}

export function ConsentDisclaimer({
    dimensionName,
    reliabilityRange,
    testRetestRange,
    sampleSize,
    validationYear,
    references,
    onBack,
    onContinue,
    agreement,
    setAgreement
}: ConsentDisclaimerProps) {
    const canContinue = agreement.read && agreement.consent;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
            <Card className="max-w-2xl w-full shadow-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShieldCheck className="w-6 h-6 text-green-600" />
                        Persetujuan & Disclaimer
                    </CardTitle>
                    <CardDescription>
                        Assessment {dimensionName} — Scientific Validation Study {validationYear}
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Validity Alert */}
                    <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <AlertTitle>Validitas Data</AlertTitle>
                        <AlertDescription>
                            Instrumen ini memiliki reliabilitas Cronbach&apos;s Alpha α = {reliabilityRange},
                            test-retest reliability r = {testRetestRange}.
                            Divalidasi pada {sampleSize.toLocaleString()} mahasiswa.
                        </AlertDescription>
                    </Alert>

                    {/* References Alert */}
                    <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <AlertTitle>Referensi Ilmiah</AlertTitle>
                        <AlertDescription>
                            <ul className="list-disc list-inside space-y-1 mt-2 text-sm">
                                {references.map((ref, index) => (
                                    <li key={index}>
                                        {ref.author} ({ref.year}). <em>{ref.title}</em>. {ref.source}
                                    </li>
                                ))}
                            </ul>
                        </AlertDescription>
                    </Alert>

                    {/* Data Usage Alert */}
                    <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                        <Lock className="w-4 h-4 text-amber-600" />
                        <AlertTitle>Penggunaan Data</AlertTitle>
                        <AlertDescription>
                            Data Anda akan digunakan secara anonim untuk riset dan personalisasi pengembangan diri.
                            Hasil bersifat developmental, bukan diagnosis klinis.
                        </AlertDescription>
                    </Alert>

                    {/* Checkboxes */}
                    <div className="space-y-4 pt-4">
                        <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <input
                                type="checkbox"
                                id="read"
                                className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                checked={agreement.read}
                                onChange={e => setAgreement({ ...agreement, read: e.target.checked })}
                            />
                            <label htmlFor="read" className="text-sm cursor-pointer">
                                Saya telah membaca <strong>Pedoman Ilmiah</strong> sebelumnya dan memahami konsep yang akan diukur.
                            </label>
                        </div>
                        <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <input
                                type="checkbox"
                                id="consent"
                                className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                checked={agreement.consent}
                                onChange={e => setAgreement({ ...agreement, consent: e.target.checked })}
                            />
                            <label htmlFor="consent" className="text-sm cursor-pointer">
                                Saya setuju berpartisipasi secara sukarela dan memahami bahwa hasil bersifat developmental.
                            </label>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="justify-between">
                    <Button variant="ghost" onClick={onBack}>
                        Kembali ke Pedoman
                    </Button>
                    <Button
                        onClick={onContinue}
                        disabled={!canContinue}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Mulai Assessment
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

export default ConsentDisclaimer;
