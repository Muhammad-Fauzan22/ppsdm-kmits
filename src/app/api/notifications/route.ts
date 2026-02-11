import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { data, error } = await supabase
            .from("notifications")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(50);

        if (error) throw error;

        const unreadCount = data.filter((n: any) => !n.read).length;

        return NextResponse.json({
            success: true,
            data,
            unreadCount,
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch notifications" },
            { status: 500 }
        );
    }
}

export async function PATCH(request: Request) {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();

        if (body.markAllRead) {
            // Mark all as read
            const { error } = await supabase
                .from("notifications")
                .update({ read: true })
                .eq("user_id", user.id);

            if (error) throw error;
        } else if (body.id) {
            // Mark single as read
            const { error } = await supabase
                .from("notifications")
                .update({ read: true })
                .eq("id", body.id)
                .eq("user_id", user.id);

            if (error) throw error;
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to update notifications" },
            { status: 500 }
        );
    }
}
