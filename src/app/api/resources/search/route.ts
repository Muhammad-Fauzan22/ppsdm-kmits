
import { NextRequest, NextResponse } from 'next/server';
import { GlobalResourceEngine } from '@/lib/resources/GlobalResourceEngine';
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient();

        const { searchParams } = new URL(req.url);
        const query = searchParams.get('q') || undefined;
        const domain = searchParams.get('domain') || undefined;
        const type = searchParams.get('type') || undefined;

        const engine = new GlobalResourceEngine();
        const resources = await engine.findResources(supabase, {
            query,
            domain,
            type
        });

        return NextResponse.json({ success: true, count: resources?.length, data: resources });

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
