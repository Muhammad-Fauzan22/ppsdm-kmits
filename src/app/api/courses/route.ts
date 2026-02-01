import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema for course creation
const courseSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z.string().min(3).max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().min(10),
  short_description: z.string().max(280).optional(),
  cover_image: z.string().url().optional(),
  category: z.string(),
  subcategory: z.string().optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'all_levels']).default('all_levels'),
  duration: z.number().int().positive().optional(),
  xp_reward: z.number().int().default(0),
  certificate_enabled: z.boolean().default(true),
  passing_score: z.number().int().min(0).max(100).default(70),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  featured: z.boolean().default(false),
});

// GET /api/courses - List all courses
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const level = searchParams.get('level');
    const status = searchParams.get('status') || 'published';
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('courses')
      .select(`
        *,
        modules:modules(count),
        enrollments:enrollments(count)
      `, { count: 'exact' });

    // Apply filters
    if (category) {
      query = query.eq('category', category);
    }
    if (level) {
      query = query.eq('level', level);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (featured === 'true') {
      query = query.eq('featured', true);
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Apply pagination and ordering
    query = query
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: courses, error, count } = await query;

    if (error) {
      console.error('Error fetching courses:', error);
      return NextResponse.json(
        { error: 'Failed to fetch courses' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: courses,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/courses - Create a new course
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = courseSchema.parse(body);

    // Check if slug already exists
    const { data: existingCourse } = await supabase
      .from('courses')
      .select('id')
      .eq('slug', validatedData.slug)
      .single();

    if (existingCourse) {
      return NextResponse.json(
        { error: 'Course with this slug already exists' },
        { status: 409 }
      );
    }

    // Create course
    const { data: course, error } = await supabase
      .from('courses')
      .insert({
        ...validatedData,
        created_by: session.user.id,
        published_at: validatedData.status === 'published' ? new Date().toISOString() : null
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating course:', error);
      return NextResponse.json(
        { error: 'Failed to create course' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { data: course, message: 'Course created successfully' },
      { status: 201 }
    );

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
