"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface ReportViewerProps {
    content: string;
}

export function ReportViewer({ content }: ReportViewerProps) {
    if (!content) return <div className="text-center p-8 text-slate-400">No report generated.</div>;

    // Simple Markdown-ish rendering for headers and bullets
    // Ideally use 'react-markdown' if available across project
    const renderLine = (line: string, i: number) => {
        if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold text-slate-900 mt-6 mb-4">{line.replace('# ', '')}</h1>;
        if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold text-slate-800 mt-5 mb-3 border-b pb-2">{line.replace('## ', '')}</h2>;
        if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-semibold text-slate-800 mt-4 mb-2">{line.replace('### ', '')}</h3>;
        if (line.startsWith('- ')) return <li key={i} className="ml-4 list-disc text-slate-700 mb-1">{line.replace('- ', '')}</li>;
        if (line.trim() === '') return <br key={i} />;
        return <p key={i} className="text-slate-700 mb-2 leading-relaxed">{line}</p>;
    };

    return (
        <ScrollArea className="h-[600px] w-full rounded-md border p-8 bg-white shadow-sm">
            <article className="prose prose-slate max-w-none">
                {content.split('\n').map((line, i) => renderLine(line, i))}
            </article>
        </ScrollArea>
    );
}
