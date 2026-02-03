import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { authRateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

const signupSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  nrp: z.string().length(9, 'NRP must be exactly 9 characters'),
  department: z.string().min(2, 'Department must be at least 2 characters'),
});

export async function POST(request: Request) {
    try {
        // Apply rate limiting
        const rateLimitResponse = authRateLimit(request);
        if (rateLimitResponse) {
            return rateLimitResponse;
        }

        const supabase = await createClient();
        const body = await request.json();

        // Validate input
        const validationResult = signupSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: 'Validation failed',
                    details: validationResult.error.issues
                },
                { status: 400 }
            );
        }

        const { email, password, full_name, nrp, department } = validationResult.data;

        // Sign up user
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name,
                    nrp,
                    department,
                },
            },
        });

        if (authError) {
            return NextResponse.json({ error: authError.message }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            user: authData.user,
            message: "Account created. Please check your email for verification.",
        });
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { error: "Signup failed" },
            { status: 500 }
        );
    }
}
