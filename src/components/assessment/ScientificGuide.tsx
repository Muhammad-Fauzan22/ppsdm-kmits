"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ConceptCard {
    icon: LucideIcon;
    iconColor: string;
    title: string;
    description: string;
    reference?: string;
}

export interface HighlightPoint {
    text: string;
}

export interface ScientificGuideProps {
    dimensionNumber: number;
    dimensionName: string;
    title: string;
    subtitle: string;
    concepts: ConceptCard[];
    highlightTitle: string;
    highlightPoints: HighlightPoint[];
    onContinue: () => void;
    continueText?: string;
}

export function ScientificGuide({
    dimensionNumber,
    dimensionName,
    title,
    subtitle,
    concepts,
    highlightTitle,
    highlightPoints,
    onContinue,
    continueText = "Saya Paham & Siap"
}: ScientificGuideProps) {
    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] p-6 lg:p-12 font-sans text-slate-900 dark:text-slate-50">
            <div className="max-w-4xl mx-auto space-y-10">

                {/* Hero Section */}
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold text-xs uppercase tracking-wide">
                        Dimensi {dimensionNumber}: {dimensionName}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                        {title.split(' ').map((word, i) =>
                            i === title.split(' ').length - 1
                                ? <span key={i} className="text-blue-600">{word}</span>
                                : <span key={i}>{word} </span>
                        )}
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                        {subtitle}
                    </p>
                </div>

                {/* Scientific Content Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {concepts.map((concept, index) => {
                        const IconComponent = concept.icon;
                        return (
                            <Card key={index} className="border-0 shadow-lg bg-white dark:bg-[#151b26]">
                                <CardHeader>
                                    <IconComponent className={cn("w-10 h-10 mb-2", concept.iconColor)} />
                                    <CardTitle>{concept.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    <p>{concept.description}</p>
                                    {concept.reference && (
                                        <p className="text-xs text-slate-400 mt-2 italic">
                                            — {concept.reference}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}

                    {/* Highlight Card */}
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white md:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-white">{highlightTitle}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-blue-100 leading-relaxed">
                            <ul className="list-disc list-inside space-y-2">
                                {highlightPoints.map((point, index) => (
                                    <li key={index}>{point.text}</li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* Navigation */}
                <div className="flex justify-end pt-8">
                    <Button
                        size="lg"
                        onClick={onContinue}
                        className="gap-2 text-lg px-8 h-14 bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/30 rounded-full"
                    >
                        {continueText} <ArrowRight className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default ScientificGuide;
