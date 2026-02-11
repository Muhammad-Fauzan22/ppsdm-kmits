import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema for course update
const courseUpdateSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().min(10).optional(),
  cover_image: z.string().url().optional().nullable(),
  category: z.string().optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'all_levels']).optional(),
  duration: z.number().int().positive().optional().nullable(),
  xp_reward: z.number().int().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  featured: z.boolean().optional(),
});

// GET /api/courses/[id] - Get course details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    // Get course with modules and lessons
    const { data: course, error } = await supabase
      .from('courses')
      .select(`
        *,
        modules:modules(
          *,
          lessons:lessons(*)
        ),
        prerequisites:course_prerequisites(
          prerequisite_course:courses!prerequisite_course_id(id, title, slug)
        )
      `)
      .eq('id', id)
      .single();

    if (error || !course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Get enrollment count
    const { count: enrollmentCount } = await supabase
      .from('enrollments')
      .select('*', { count: 'exact', head: true })
      .eq('course_id', id)
      .eq('status', 'active');

    // Get user's enrollment if logged in
    const { data: { session } } = await supabase.auth.getSession();
    let userEnrollment = null;
    let userProgress = null;

    if (session) {
      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('*')
        .eq('course_id', id)
        .eq('user_id', session.user.id)
        .single();

      userEnrollment = enrollment;

      if (enrollment) {
        // Get lesson progress
        const { data: progress } = await supabase
          .from('lesson_progress')
          .select('*')
          .eq('course_id', id)
          .eq('user_id', session.user.id);

        userProgress = progress;
      }
    }

    return NextResponse.json({
      data: {
        ...course,
        enrollment_count: enrollmentCount || 0,
        user_enrollment: userEnrollment,
        user_progress: userProgress
      }
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/courses/[id] - Update course
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is course creator or admin
    const { data: course } = await supabase
      .from('courses')
      .select('created_by')
      .eq('id', id)
      .single();

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Check permissions (simplified - should check admin role too)
    if (course.created_by !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = courseUpdateSchema.parse(body);

    // Update course
    const { data: updatedCourse, error } = await supabase
      .from('courses')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString(),
        published_at: validatedData.status === 'published' ? new Date().toISOString() : undefined
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update course' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: updatedCourse,
      message: 'Course updated successfully'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/courses/[id] - Delete course
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Delete course (cascades to modules, lessons, etc.)
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete course' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Course deleted successfully'
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
