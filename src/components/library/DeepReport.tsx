import ReactMarkdown from 'react-markdown';

export function DeepReport({ content }: { content: string }) {
    if (!content) return <div className="p-4 text-slate-400">No report content.</div>;

    return (
        <div className="prose prose-slate prose-headings:text-slate-800 prose-p:text-slate-600 prose-strong:text-slate-700 max-w-none p-8 bg-white rounded-xl shadow-sm border border-slate-100">
            <ReactMarkdown>
                {content}
            </ReactMarkdown>
        </div>
    );
}
