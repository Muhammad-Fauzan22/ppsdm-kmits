import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export const dynamic = 'force-dynamic';



// Lazy init to prevent build errors if API key is missing
const getGroqClient = () => new Groq({
    apiKey: process.env.GROQ_API_KEY,
});


const SYSTEM_PROMPT = `Kamu adalah AI Tutor untuk platform PPSDM KMM (Pusat Pengembangan Sumber Daya Mahasiswa - Keluarga Mahasiswa Mesin).

Tugas utamamu:
1. Menjawab pertanyaan tentang assessment dan pengembangan diri mahasiswa
2. Menjelaskan hasil assessment (dimensi: Kognitif, Self-Management, Financial, Fisik, EI, Mental Health, Karakter, Spiritual, Environmental)
3. Memberikan tips pengembangan diri yang praktis
4. Memotivasi mahasiswa untuk terus berkembang

Gaya bahasa:
- Gunakan Bahasa Indonesia yang santai tapi sopan
- Panggil user dengan "Kamu" atau "Kakak" jika konteks formal
- Berikan jawaban yang ringkas tapi informatif (max 200 kata)
- Gunakan emoji sesekali untuk membuat percakapan lebih hidup

Batasan:
- JANGAN memberikan diagnosis kesehatan mental
- Jika user menunjukkan tanda krisis, arahkan ke layanan konseling kampus
- Fokus pada pengembangan diri, bukan masalah akademik spesifik

Kamu bisa akses lewat fitur chat di dashboard.`;

export async function POST(request: NextRequest) {
    try {
        const { message, history = [] } = await request.json();

        if (!message) {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        // Build conversation history
        const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...history.slice(-10), // Keep last 10 messages for context
            { role: 'user', content: message },
        ];

        const completion = await getGroqClient().chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages,
            temperature: 0.7,
            max_tokens: 1024,
            top_p: 0.9,
        });

        const reply = completion.choices[0]?.message?.content || 'Maaf, saya tidak bisa memproses pesanmu sekarang.';

        return NextResponse.json({
            reply,
            model: completion.model,
            usage: completion.usage,
        });
    } catch (error: any) {
        console.error('Groq API Error:', error);

        // Handle rate limit
        if (error?.status === 429) {
            return NextResponse.json(
                { error: 'Terlalu banyak permintaan. Tunggu sebentar ya!' },
                { status: 429 }
            );
        }

        return NextResponse.json(
            { error: 'Maaf, ada masalah dengan AI. Coba lagi nanti.' },
            { status: 500 }
        );
    }
}
