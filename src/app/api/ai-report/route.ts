import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// AI Psychometric Report Generator
// Uses Groq FREE tier (14,400 requests/day)
// Generates personalized narrative reports based on assessment results

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const PSYCHOMETRIC_PROMPT = `Kamu adalah seorang psikolog pendidikan dan konselor pengembangan mahasiswa. Tugasmu adalah menginterpretasikan hasil assessment psikometrik mahasiswa teknik Indonesia.

KONTEKS PENTING:
- Ini adalah platform PPSDM KMM untuk mahasiswa ITS
- Ada 9 dimensi pengembangan: Kognitif, Self-Management, Finansial, Kesehatan Fisik, Kecerdasan Emosional, Kesehatan Mental, Karakter & Etika, Spiritual, Environmental
- Skor berkisar 0-100
- Data benchmark nasional dan ITS tersedia

GAYA PENULISAN:
- Gunakan Bahasa Indonesia yang sopan, hangat, dan memotivasi
- Sebut mahasiswa dengan "Kamu" bukan "Anda"
- Berikan apresiasi pada kelebihan sebelum menyebutkan area pengembangan
- Gunakan emoji secara bijak (2-3 per paragraf)
- Panjang respon: 400-600 kata
- Format markdown dengan headers

STRUKTUR RESPON:
1. **Profil Singkat** - Gambaran umum profil mahasiswa
2. **Kelebihan Utama** - 2-3 dimensi terkuat dengan penjelasan
3. **Area Pengembangan** - 2-3 dimensi yang perlu ditingkatkan
4. **Rekomendasi Personal** - 3 langkah konkret minggu ini
5. **Pesan Motivasi** - Kalimat penutup yang menginspirasi

BATASAN:
- JANGAN memberikan diagnosis psikologis klinis
- JANGAN menyarankan obat atau terapi medis
- Jika ada indikasi masalah serius, arahkan ke layanan konseling kampus`;

interface AssessmentData {
    userId?: string;
    userName?: string;
    scores: Record<string, number>;
    benchmarks?: {
        national: Record<string, number>;
        its: Record<string, number>;
    };
    previousScores?: Record<string, number>;
}

function generatePrompt(data: AssessmentData): string {
    const { userName, scores, benchmarks, previousScores } = data;

    const dimensionNames: Record<string, string> = {
        cognitive: 'Kognitif (Berpikir Kritis)',
        self_management: 'Self-Management (Manajemen Diri)',
        financial: 'Literasi Finansial',
        physical_health: 'Kesehatan Fisik',
        emotional_intelligence: 'Kecerdasan Emosional',
        mental_health: 'Kesehatan Mental',
        character_ethics: 'Karakter & Etika',
        spiritual: 'Pengembangan Spiritual',
        environmental: 'Gaya Hidup & Lingkungan',
    };

    let prompt = `Buat laporan psikometrik untuk mahasiswa${userName ? ` bernama ${userName}` : ''}.\n\n`;
    prompt += `## HASIL ASSESSMENT (Skor 0-100):\n`;

    Object.entries(scores).forEach(([dim, score]) => {
        const name = dimensionNames[dim] || dim;
        prompt += `- ${name}: ${score}/100`;

        if (benchmarks) {
            const natAvg = benchmarks.national[dim];
            const itsAvg = benchmarks.its[dim];
            if (natAvg) prompt += ` (Rata-rata Nasional: ${natAvg})`;
            if (itsAvg) prompt += ` (Rata-rata ITS: ${itsAvg})`;
        }

        if (previousScores && previousScores[dim]) {
            const change = score - previousScores[dim];
            prompt += ` [Perubahan: ${change > 0 ? '+' : ''}${change}]`;
        }

        prompt += '\n';
    });

    // Add context
    const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const strongest = sortedScores.slice(0, 3);
    const weakest = sortedScores.slice(-3).reverse();

    prompt += `\n## ANALISIS AWAL:\n`;
    prompt += `- Dimensi terkuat: ${strongest.map(([d, s]) => `${dimensionNames[d] || d} (${s})`).join(', ')}\n`;
    prompt += `- Dimensi perlu pengembangan: ${weakest.map(([d, s]) => `${dimensionNames[d] || d} (${s})`).join(', ')}\n`;

    const avg = Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length;
    prompt += `- Rata-rata keseluruhan: ${avg.toFixed(1)}/100\n`;

    return prompt;
}

export async function POST(request: NextRequest) {
    try {
        const data: AssessmentData = await request.json();

        if (!data.scores || Object.keys(data.scores).length === 0) {
            return NextResponse.json(
                { error: 'Tidak ada data assessment' },
                { status: 400 }
            );
        }

        // Check for Groq API key
        if (!process.env.GROQ_API_KEY) {
            // Return mock response if no API key
            return NextResponse.json({
                success: true,
                report: generateMockReport(data),
                model: 'mock',
            });
        }

        const userPrompt = generatePrompt(data);

        const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: PSYCHOMETRIC_PROMPT },
                { role: 'user', content: userPrompt },
            ],
            temperature: 0.7,
            max_tokens: 1500,
        });

        const report = completion.choices[0]?.message?.content || 'Gagal membuat laporan';

        return NextResponse.json({
            success: true,
            report,
            model: 'llama-3.3-70b-versatile',
            usage: completion.usage,
        });

    } catch (error) {
        console.error('[AI-Report] Error:', error);

        // Return mock on error
        return NextResponse.json({
            success: true,
            report: generateMockReport({ scores: {} }),
            model: 'fallback',
            error: 'Menggunakan template karena API tidak tersedia',
        });
    }
}

// Mock report for when API is unavailable
function generateMockReport(data: AssessmentData): string {
    const { scores, userName } = data;
    const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const strongest = sortedScores[0];
    const weakest = sortedScores[sortedScores.length - 1];

    return `# Laporan Psikometrik Personal 📊

Halo${userName ? ` ${userName}` : ''}! 👋

## Profil Singkat

Berdasarkan hasil assessment yang telah kamu selesaikan, kamu menunjukkan profil yang menarik dengan berbagai potensi yang dapat dikembangkan. Mari kita telusuri lebih dalam!

## Kelebihan Utama ⭐

${strongest ? `**${strongest[0]}** dengan skor ${strongest[1]}/100 adalah dimensi terkuatmu! Ini menunjukkan bahwa kamu memiliki kemampuan yang baik dalam area ini.` : 'Kamu memiliki berbagai kekuatan yang tersebar di beberapa dimensi.'}

Pertahankan momentum ini dan gunakan kelebihanmu untuk membantu perkembangan di area lain!

## Area Pengembangan 🌱

${weakest && weakest[1] < 60 ? `**${weakest[0]}** dengan skor ${weakest[1]}/100 adalah area yang perlu mendapat perhatian lebih. Jangan khawatir - ini adalah kesempatan untuk bertumbuh!` : 'Secara keseluruhan, skormu cukup seimbang. Fokus pada peningkatan konsisten di semua area.'}

## Rekomendasi Personal 🎯

1. **Minggu Ini**: Dedikasikan 20 menit setiap hari untuk mengembangkan area yang perlu ditingkatkan
2. **Bulan Ini**: Tetapkan satu tujuan spesifik dan terukur untuk setiap dimensi
3. **Semester Ini**: Cari mentor atau komunitas yang bisa mendukung perkembanganmu

## Pesan Motivasi 💫

*"Kamu tidak perlu sempurna untuk memulai, tapi kamu perlu memulai untuk menjadi lebih baik."*

Ingat, setiap langkah kecil yang kamu ambil adalah kemajuan. Platform PPSDM KMM ada di sini untuk mendampingi perjalanan pengembanganmu. Gunakan AI Tutor untuk bertanya dan Learning Paths untuk belajar lebih dalam!

---
*Laporan ini dibuat secara otomatis berdasarkan data assessmentmu. Untuk konseling mendalam, hubungi layanan konseling kampus.*`;
}
