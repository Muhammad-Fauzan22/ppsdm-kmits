import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET registration state for current user
export async function GET() {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get registration state
        const { data: state, error } = await supabase
            .from("registration_state")
            .select("*")
            .eq("user_id", user.id)
            .single();

        if (error && error.code !== 'PGRST116') {
            throw error;
        }

        // If no state exists, create one
        if (!state) {
            const { data: newState, error: createError } = await supabase
                .from("registration_state")
                .insert({ user_id: user.id })
                .select()
                .single();

            if (createError) throw createError;

            return NextResponse.json({
                success: true,
                data: newState,
                isNew: true,
            });
        }

        return NextResponse.json({
            success: true,
            data: state,
            isNew: false,
        });
    } catch (error) {
        console.error("Error fetching registration state:", error);
        return NextResponse.json(
            { error: "Failed to fetch registration state" },
            { status: 500 }
        );
    }
}

// POST - Update registration layer data
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { layer, data: layerData, completed } = body;

        if (!layer || !['1', '2', '3', '4'].includes(layer.toString())) {
            return NextResponse.json(
                { error: "Invalid layer" },
                { status: 400 }
            );
        }

        // Build update object
        const updateData: Record<string, unknown> = {
            last_activity: new Date().toISOString(),
        };

        updateData[`layer${layer}_data`] = layerData;

        if (completed) {
            updateData[`layer${layer}_completed`] = true;
            // Move to next layer if not on layer 4
            if (parseInt(layer) < 4) {
                updateData.current_layer = parseInt(layer) + 1;
            } else {
                updateData.completed_at = new Date().toISOString();
            }
        }

        const { data, error } = await supabase
            .from("registration_state")
            .update(updateData)
            .eq("user_id", user.id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({
            success: true,
            data,
        });
    } catch (error) {
        console.error("Error updating registration state:", error);
        return NextResponse.json(
            { error: "Failed to update registration state" },
            { status: 500 }
        );
    }
}
