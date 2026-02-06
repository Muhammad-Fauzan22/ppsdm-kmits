import { generateText } from "@/lib/ai/groq";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { message, context } = await req.json();

        const systemPrompt = `
      Kamu adalah "Seno", maskot AI dari PPSDM KM ITS dan Personal Coach mahasiswa.
      Karakter: Ramah, suportif, sedikit humoris, cerdas secara akademik, dan menggunakan bahasa Indonesia yang santai tapi sopan (khas mahasiswa Surabaya).
      Tugas: Memberikan saran pengembangan diri, rekomendasi buku, atau tips produktivitas berdasarkan data mahasiswa.
      
      Konteks Mahasiswa saat ini:
      Nama: ${context.user?.name || 'Mahasiswa'}
      Skor Holistik (Radar Chart): ${JSON.stringify(context.scores || {})}
      
      Aturan Penjawab:
      1. Jawab singkat dan padat (maksimal 3-4 kalimat).
      2. Jika skor mahasiswa rendah di dimensi tertentu (misal < 50), berikan semangat dan saran konkret yang mudah dilakukan.
      3. Jangan berikan nasihat yang terlalu umum (klise). Referensikan data skor jika relevan.
      4. Jika ditanya buku/materi, sarankan untuk mengecek Library PPSDM.
    `;

        const prompt = `${systemPrompt}\n\nUser: ${message}\nSeno:`;

        // Generate response text
        const reply = await generateText(prompt);

        return NextResponse.json({ reply });
    } catch (error) {
        console.error("AI Chat Error:", error);
        return NextResponse.json({ reply: "Duh, sinyal otak Seno lagi gangguan nih. Coba tanya lagi ya!" }, { status: 500 });
    }
}
