import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET goals for current user
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");
        const dimension = searchParams.get("dimension");

        let query = supabase
            .from("goals")
            .select("*, tasks(count)")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (status) {
            query = query.eq("status", status);
        }

        if (dimension) {
            query = query.eq("dimension", dimension);
        }

        const { data, error } = await query;

        if (error) throw error;

        return NextResponse.json({
            success: true,
            data,
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch goals" },
            { status: 500 }
        );
    }
}

// POST - Create new goal
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { title, description, dimension, target_value, unit, deadline_date, priority } = body;

        if (!title || !dimension) {
            return NextResponse.json(
                { error: "Title and dimension are required" },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from("goals")
            .insert({
                user_id: user.id,
                title,
                description,
                dimension,
                target_value,
                unit,
                deadline_date,
                priority: priority || 3,
                status: "active",
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({
            success: true,
            data,
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to create goal" },
            { status: 500 }
        );
    }
}

// PATCH - Update goal
export async function PATCH(request: NextRequest) {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json(
                { error: "Goal ID is required" },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from("goals")
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq("id", id)
            .eq("user_id", user.id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({
            success: true,
            data,
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to update goal" },
            { status: 500 }
        );
    }
}

// DELETE - Delete goal
export async function DELETE(request: NextRequest) {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { error: "Goal ID is required" },
                { status: 400 }
            );
        }

        const { error } = await supabase
            .from("goals")
            .delete()
            .eq("id", id)
            .eq("user_id", user.id);

        if (error) throw error;

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete goal" },
            { status: 500 }
        );
    }
}
