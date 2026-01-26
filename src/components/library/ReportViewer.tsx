"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface ReportViewerProps {
    content: string;
}

import ReactMarkdown from 'react-markdown';

export function ReportViewer({ content }: ReportViewerProps) {
    if (!content) return <div className="text-center p-8 text-slate-400">No report generated.</div>;

    return (
        <ScrollArea className="h-[600px] w-full rounded-md border p-8 bg-white shadow-sm">
            <article className="prose prose-slate max-w-none">
                <ReactMarkdown>{content}</ReactMarkdown>
            </article>
        </ScrollArea>
    );
}
