import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET tasks for current user
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");
        const goalId = searchParams.get("goal_id");
        const date = searchParams.get("date");

        let query = supabase
            .from("tasks")
            .select("*, goals(title, dimension)")
            .eq("user_id", user.id)
            .order("scheduled_start", { ascending: true });

        if (status) {
            query = query.eq("status", status);
        }

        if (goalId) {
            query = query.eq("goal_id", goalId);
        }

        if (date) {
            query = query
                .gte("scheduled_start", `${date}T00:00:00`)
                .lte("scheduled_start", `${date}T23:59:59`);
        }

        const { data, error } = await query;

        if (error) throw error;

        return NextResponse.json({
            success: true,
            data,
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch tasks" },
            { status: 500 }
        );
    }
}

// POST - Create new task
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const {
            title,
            description,
            goal_id,
            estimated_duration_minutes,
            scheduled_start,
            scheduled_end,
            energy_level_required,
            focus_level_required,
            tags
        } = body;

        if (!title) {
            return NextResponse.json(
                { error: "Title is required" },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from("tasks")
            .insert({
                user_id: user.id,
                title,
                description,
                goal_id,
                estimated_duration_minutes,
                scheduled_start,
                scheduled_end,
                energy_level_required,
                focus_level_required,
                tags,
                status: "pending",
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
            { error: "Failed to create task" },
            { status: 500 }
        );
    }
}

// PATCH - Update task
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
                { error: "Task ID is required" },
                { status: 400 }
            );
        }

        // If marking as completed, add completed_at
        if (updates.status === "completed" && !updates.completed_at) {
            updates.completed_at = new Date().toISOString();
            updates.completion_percentage = 100;
        }

        const { data, error } = await supabase
            .from("tasks")
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
            { error: "Failed to update task" },
            { status: 500 }
        );
    }
}
