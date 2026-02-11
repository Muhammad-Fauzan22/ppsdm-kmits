import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET all programs
export async function GET() {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("programs")
            .select("*")
            .eq("status", "active")
            .order("start_date", { ascending: true });

        if (error) throw error;

        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch programs" },
            { status: 500 }
        );
    }
}
