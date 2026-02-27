import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const chatMessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1).max(4000),
});

const chatRequestSchema = z.object({
  // New multi-turn format (used by StudyBuddyChat)
  messages: z.array(chatMessageSchema).min(1).max(50).optional(),
  systemPrompt: z.string().max(2000).optional(),
  // Legacy single-message format
  message: z.string().max(2000).optional(),
  context: z.object({
    user: z.object({ name: z.string().optional() }).optional(),
    scores: z.record(z.string(), z.number()).optional(),
  }).optional(),
});

async function callGroq(messages: Array<{ role: string; content: string }>): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY not configured');

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages,
      max_tokens: 512,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq API error: ${response.status} ${error}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

async function callOpenAI(messages: Array<{ role: string; content: string }>): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY not configured');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 512,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${error}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

const DEFAULT_SYSTEM_PROMPT = `Kamu adalah "Seno", AI Coach dari PPSDM KM ITS.
Karakter: Ramah, suportif, cerdas, menggunakan bahasa Indonesia yang santai tapi sopan.
Tugas: Membantu mahasiswa dengan pengembangan diri, strategi belajar, dan wellbeing.
Aturan: Jawab singkat dan padat (maksimal 3-4 paragraf). Berikan saran konkret dan actionable.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = chatRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error.issues },
        { status: 400 }
      );
    }

    const data = validation.data;
    let messages: Array<{ role: string; content: string }> = [];

    if (data.messages) {
      // Multi-turn format (StudyBuddyChat)
      const systemPrompt = data.systemPrompt || DEFAULT_SYSTEM_PROMPT;
      messages = [
        { role: 'system', content: systemPrompt },
        ...data.messages.map(m => ({ role: m.role, content: m.content })),
      ];
    } else if (data.message) {
      // Legacy single-message format
      const systemPrompt = `
Kamu adalah "Seno", maskot AI dari PPSDM KM ITS dan Personal Coach mahasiswa.
Karakter: Ramah, suportif, sedikit humoris, cerdas secara akademik, dan menggunakan bahasa Indonesia yang santai tapi sopan (khas mahasiswa Surabaya).
Tugas: Memberikan saran pengembangan diri, rekomendasi buku, atau tips produktivitas berdasarkan data mahasiswa.

Konteks Mahasiswa saat ini:
Nama: ${data.context?.user?.name || 'Mahasiswa'}
Skor Holistik (Radar Chart): ${JSON.stringify(data.context?.scores || {})}

Aturan Penjawab:
1. Jawab singkat dan padat (maksimal 3-4 kalimat).
2. Jika skor mahasiswa rendah di dimensi tertentu (misal < 50), berikan semangat dan saran konkret yang mudah dilakukan.
3. Jangan berikan nasihat yang terlalu umum (klise). Referensikan data skor jika relevan.
4. Jika ditanya buku/materi, sarankan untuk mengecek Library PPSDM.
      `.trim();

      messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: data.message },
      ];
    } else {
      return NextResponse.json({ error: 'Either messages or message is required' }, { status: 400 });
    }

    // Try providers in order: Groq → OpenAI → fallback
    let reply = '';
    let providerUsed = '';

    try {
      reply = await callGroq(messages);
      providerUsed = 'groq';
    } catch (groqError) {
      console.warn('[AI Chat] Groq failed, trying OpenAI:', groqError);
      try {
        reply = await callOpenAI(messages);
        providerUsed = 'openai';
      } catch (openaiError) {
        console.error('[AI Chat] All providers failed:', openaiError);
        // Fallback response
        reply = 'Maaf, sistem AI sedang tidak tersedia saat ini. Silakan coba lagi dalam beberapa menit. Sementara itu, kamu bisa mengeksplorasi fitur-fitur lain di dashboard! 😊';
        providerUsed = 'fallback';
      }
    }

    // Support both response formats
    if (data.messages) {
      return NextResponse.json({ message: reply, provider: providerUsed });
    } else {
      return NextResponse.json({ reply, provider: providerUsed });
    }

  } catch (error) {
    console.error('[AI Chat] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error', reply: 'Duh, sinyal otak Seno lagi gangguan nih. Coba tanya lagi ya!' },
      { status: 500 }
    );
  }
}
