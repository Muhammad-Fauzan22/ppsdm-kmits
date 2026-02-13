'use client';

import { useState, useEffect } from 'react';

export default function DailyQuoteWidget() {
    const [quote, setQuote] = useState<{ quote: string; author: string } | null>(null);

    useEffect(() => {
        fetch('/api/quotes/daily')
            .then(res => res.json())
            .then(json => { if (json.success) setQuote(json.data); })
            .catch(console.error);
    }, []);

    if (!quote) return null;

    return (
        <div style={{
            padding: '16px 20px',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.08))',
            borderRadius: 12, borderLeft: '3px solid #6366f1',
            maxWidth: 600, margin: '0 auto',
        }}>
            <div style={{ fontSize: 18, marginBottom: 4, color: '#818cf8' }}>💡</div>
            <p style={{
                color: 'rgba(255,255,255,0.85)', fontSize: 14,
                fontStyle: 'italic', lineHeight: 1.6, margin: 0,
            }}>
                &ldquo;{quote.quote}&rdquo;
            </p>
            <p style={{
                color: 'rgba(255,255,255,0.4)', fontSize: 12,
                margin: '8px 0 0', textAlign: 'right',
            }}>
                — {quote.author}
            </p>
        </div>
    );
}
