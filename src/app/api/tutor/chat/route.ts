import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { message, history = [] } = await req.json();
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: [
          { role: 'system', content: 'You are Kimi, a helpful AI tutor. Use Socratic teaching.' },
          ...history.slice(-5),
          { role: 'user', content: message }
        ]
      })
    });
    
    const data = await response.json();
    return NextResponse.json({ response: data.choices?.[0]?.message?.content || 'Sorry, could not process.' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
