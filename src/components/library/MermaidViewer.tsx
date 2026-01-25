"use client";

import React, { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

interface MermaidViewerProps {
    chart: string;
}

export function MermaidViewer({ chart }: MermaidViewerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [svg, setSvg] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!chart) return;

        const renderChart = async () => {
            try {
                // Dynamic import from CDN to avoid huge bundle size and install issues
                // @ts-ignore
                const mermaid = (await import('https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs')).default;

                mermaid.initialize({
                    startOnLoad: false,
                    theme: 'default',
                    securityLevel: 'loose',
                });

                const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
                const { svg } = await mermaid.render(id, chart);
                setSvg(svg);
            } catch (err: any) {
                console.error("Mermaid Render Error:", err);
                setError("Gagal merender diagram. Format mungkin tidak valid.");
            }
        };

        renderChart();
    }, [chart]);

    if (error) return <div className="text-red-500 text-sm p-4 bg-red-50 rounded">{error}</div>;
    if (!svg) return <div className="flex items-center gap-2 p-8 text-slate-400"><Loader2 className="animate-spin" /> Generating Visual Knowledge Graph...</div>;

    return (
        <div
            ref={containerRef}
            className="w-full overflow-x-auto p-4 bg-white rounded-xl shadow-sm border border-slate-100 flex justify-center"
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
}
