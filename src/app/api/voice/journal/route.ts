import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/voice/journal - Get journal entries
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') ?? '20', 10)

    let query = supabase
      .from('voice_journal')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (search) {
      query = query.ilike('transcript', `%${search}%`)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ entries: data ?? [] })
  } catch (error) {
    console.error('GET /api/voice/journal error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/voice/journal - Create a new journal entry
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const audioFile = formData.get('audio') as File | null
    const transcript = formData.get('transcript') as string ?? ''
    const duration = parseInt(formData.get('duration') as string ?? '0', 10)
    const mood = parseInt(formData.get('mood') as string ?? '3', 10)

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 })
    }

    // Upload audio to Supabase Storage
    const fileName = `${user.id}/${Date.now()}.webm`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('voice-notes')
      .upload(fileName, audioFile, {
        contentType: 'audio/webm',
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ error: 'Failed to upload audio' }, { status: 500 })
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('voice-notes')
      .getPublicUrl(uploadData.path)

    // Save journal entry
    const { data, error } = await supabase
      .from('voice_journal')
      .insert({
        user_id: user.id,
        audio_url: publicUrl,
        transcript,
        duration,
        mood: Math.min(5, Math.max(1, mood)),
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, entry: data }, { status: 201 })
  } catch (error) {
    console.error('POST /api/voice/journal error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE /api/voice/journal - Delete a journal entry
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }

    // Get entry to delete audio file
    const { data: entry } = await supabase
      .from('voice_journal')
      .select('audio_url')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (entry?.audio_url) {
      // Extract path from URL and delete from storage
      const url = new URL(entry.audio_url)
      const path = url.pathname.split('/voice-notes/')[1]
      if (path) {
        await supabase.storage.from('voice-notes').remove([path])
      }
    }

    const { error } = await supabase
      .from('voice_journal')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/voice/journal error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
