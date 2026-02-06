
"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface ModuleReaderProps {
    content: string;
}

export function ModuleReader({ content }: ModuleReaderProps) {
    return (
        <article className="prose prose-zinc dark:prose-invert prose-headings:font-heading prose-p:font-sans lg:prose-lg max-w-none">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                    // Custom components override example
                    h1: ({ node, ...props }) => <h1 className="text-3xl font-bold tracking-tight text-primary mt-8 mb-4" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold tracking-tight mt-6 mb-3 border-b border-border pb-2" {...props} />,
                    a: ({ node, ...props }) => <a className="text-primary hover:underline font-medium" {...props} />,
                    blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-primary pl-4 italic bg-muted/30 py-1 rounded-r" {...props} />,
                }}
            >
                {content}
            </ReactMarkdown>
        </article>
    );
}
