import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { authRateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = authRateLimit(request);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const body = await request.json();

    // Validate input
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.issues
        },
        { status: 400 }
      );
    }

    const { email, password } = validationResult.data;

    // Validate email domain
    if (!email.endsWith('@student.its.ac.id')) {
      return NextResponse.json(
        { error: 'Only @student.its.ac.id emails are allowed' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Attempt login
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password,
    });

    if (error) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
      message: 'Login successful'
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
