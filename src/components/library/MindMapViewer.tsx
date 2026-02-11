"use client";
import { useEffect, useRef } from "react";
import mermaid from "mermaid";

export function MindMapViewer({ chartCode }: { chartCode: string }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current && chartCode) {
            try {
                mermaid.initialize({
                    startOnLoad: true,
                    theme: 'base',
                    themeVariables: {
                        primaryColor: '#e0e7ff',
                        edgeLabelBackground: '#ffffff',
                        tertiaryColor: '#f1f5f9'
                    },
                    securityLevel: 'loose'
                });

                // Render diagram
                // We use a unique ID to prevent collision if multiple charts are on page (though tabs help)
                const id = `mermaid-svg-${Math.random().toString(36).substr(2, 9)}`;
                mermaid.render(id, chartCode).then((result) => {
                    if (ref.current) ref.current.innerHTML = result.svg;
                });
            } catch (e) {
                if (ref.current) ref.current.innerHTML = "<div class='text-red-400 p-4'>Gagal merender diagram. Format data tidak valid.</div>";
            }
        }
    }, [chartCode]);

    return (
        <div className="w-full overflow-x-auto p-8 bg-white rounded-xl border border-slate-200 shadow-sm flex justify-center min-h-[300px]">
            <div ref={ref} className="mermaid-chart w-full text-center" />
        </div>
    );
}
