import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ebookId } = body;

    if (!ebookId) {
      return NextResponse.json(
        { error: 'Ebook ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get ebook details
    const { data: ebook, error: fetchError } = await supabase
      .from('ebooks')
      .select('*')
      .eq('id', ebookId)
      .single();

    if (fetchError || !ebook) {
      return NextResponse.json(
        { error: 'Ebook not found' },
        { status: 404 }
      );
    }

    // Update status
    await supabase
      .from('ebooks')
      .update({
        processing_status: 'processing',
        updated_at: new Date().toISOString()
      })
      .eq('id', ebookId);

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Cover fetch initiated',
      ebookId: ebookId,
      title: ebook.title
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch book cover' },
      { status: 500 }
    );
  }
}
