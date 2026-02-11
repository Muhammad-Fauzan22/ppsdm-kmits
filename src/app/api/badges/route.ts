import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const supabase = await createClient();

        // Get all badges
        const { data: allBadges, error: badgesError } = await supabase
            .from("badges")
            .select("*")
            .order("rarity", { ascending: true });

        if (badgesError) throw badgesError;

        // Get current user's earned badges
        const { data: { user } } = await supabase.auth.getUser();

        let earnedBadgeIds: string[] = [];

        if (user) {
            const { data: userBadges } = await supabase
                .from("user_badges")
                .select("badge_id")
                .eq("user_id", user.id);

            earnedBadgeIds = userBadges?.map((b: any) => b.badge_id) || [];
        }

        // Mark which badges are earned
        const badgesWithStatus = allBadges.map((badge: any) => ({
            ...badge,
            earned: earnedBadgeIds.includes(badge.id),
        }));

        return NextResponse.json({
            success: true,
            data: badgesWithStatus,
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch badges" },
            { status: 500 }
        );
    }
}
