import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '../../../../lib/supabase'

export async function POST(request: Request) {
  try {
    const form = await request.formData()
    const course_id = form.get('course_id') as string
    const module_id = form.get('module_id') as string
    // NOTE: In production, get user from session/auth
    const user_id = form.get('user_id') as string || null

    const supabase = createServerSupabaseClient()

    const payload = {
      user_id: user_id,
      course_id: course_id,
      module_id: module_id,
      is_module_completed: true,
      last_accessed_at: new Date().toISOString()
    }

    // Upsert learning progress (simple logic)
    const { data, error } = await supabase
      .from('learning_progress')
      .upsert(payload, { on_conflict: ['user_id', 'course_id', 'module_id'] })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.redirect(`/dashboard/courses/${course_id}`)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
