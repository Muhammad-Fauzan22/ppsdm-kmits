/**
 * Daily Quote API — proxies ZenQuotes.io (free, no API key required)
 * GET /api/quotes/daily
 */

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Fallback quotes in Bahasa Indonesia for when API is unavailable
const FALLBACK_QUOTES = [
    { q: 'Pendidikan adalah senjata paling ampuh yang bisa kamu gunakan untuk mengubah dunia.', a: 'Nelson Mandela' },
    { q: 'Masa depan milik mereka yang percaya pada keindahan mimpi-mimpinya.', a: 'Eleanor Roosevelt' },
    { q: 'Kesuksesan adalah guru yang buruk. Ia membuat orang pintar berpikir bahwa mereka tak bisa kalah.', a: 'Bill Gates' },
    { q: 'Satu-satunya cara untuk melakukan pekerjaan hebat adalah dengan mencintai apa yang kamu kerjakan.', a: 'Steve Jobs' },
    { q: 'Belajarlah dari kemarin, hiduplah untuk hari ini, berharaplah untuk besok.', a: 'Albert Einstein' },
    { q: 'Ilmu pengetahuan tanpa agama itu lumpuh, agama tanpa ilmu pengetahuan itu buta.', a: 'Albert Einstein' },
    { q: 'Tidak ada yang mustahil. Kata itu sendiri berkata "aku mungkin".', a: 'Audrey Hepburn' },
    { q: 'Kualitas tidak pernah terjadi secara kebetulan; selalu merupakan hasil dari niat yang tinggi.', a: 'Will A. Foster' },
    { q: 'Inovasi membedakan antara pemimpin dan pengikut.', a: 'Steve Jobs' },
    { q: 'Keberhasilan bukanlah kunci kebahagian. Kebahagiaan adalah kunci keberhasilan.', a: 'Albert Schweitzer' },
    { q: 'Jangan pernah berhenti belajar karena hidup tidak pernah berhenti mengajar.', a: 'Anonim' },
    { q: 'Teknik mesin mengubah impian menjadi kenyataan dengan angka, garis, dan logika.', a: 'Anonim' },
];

export async function GET() {
    try {
        // Try ZenQuotes API first
        const res = await fetch('https://zenquotes.io/api/today', {
            next: { revalidate: 86400 }, // 24 hours
        });

        if (res.ok) {
            const data = await res.json();
            if (data && data[0]) {
                return NextResponse.json({
                    success: true,
                    data: {
                        quote: data[0].q,
                        author: data[0].a,
                        source: 'zenquotes',
                    },
                }, {
                    headers: {
                        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
                    },
                });
            }
        }

        // Fallback to local quotes
        return getLocalQuote();
    } catch {
        return getLocalQuote();
    }
}

function getLocalQuote() {
    // Use day of year as index to cycle through quotes daily
    const dayOfYear = Math.floor(
        (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );
    const quote = FALLBACK_QUOTES[dayOfYear % FALLBACK_QUOTES.length];

    return NextResponse.json({
        success: true,
        data: {
            quote: quote.q,
            author: quote.a,
            source: 'local',
        },
    }, {
        headers: {
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
    });
}
