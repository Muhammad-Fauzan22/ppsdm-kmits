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

    // Update ebook status to processing
    const { error: updateError } = await supabase
      .from('ebooks')
      .update({
        processing_status: 'processing',
        processing_progress: 0,
        updated_at: new Date().toISOString()
      })
      .eq('id', ebookId);

    if (updateError) throw updateError;

    // Add to processing queue
    const { error: queueError } = await supabase
      .from('ebook_processing_queue')
      .insert({
        ebook_id: ebookId,
        status: 'pending',
        priority: 1
      });

    if (queueError) throw queueError;

    return NextResponse.json({
      success: true,
      message: 'Ebook queued for processing',
      ebookId
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process ebook' },
      { status: 500 }
    );
  }
}
