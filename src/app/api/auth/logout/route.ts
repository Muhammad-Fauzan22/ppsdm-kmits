import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { authRateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
    try {
        // Apply rate limiting
        const rateLimitResponse = authRateLimit(request as any);
        if (rateLimitResponse) {
            return rateLimitResponse;
        }

        const supabase = await createClient();

        const { error } = await supabase.auth.signOut();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: "Logout failed" },
            { status: 500 }
        );
    }
}
