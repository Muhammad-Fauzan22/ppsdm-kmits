import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// Domain configuration
const DOMAINS = {
    self_management: {
        tables: ['goals', 'tasks', 'time_blocks', 'energy_logs'],
        scoreFunction: 'calculate_domain_score',
    },
    intellectual: {
        tables: ['user_skills', 'learning_progress'],
        scoreFunction: 'calculate_domain_score',
    },
    financial: {
        tables: ['budgets', 'transactions', 'financial_goals'],
        scoreFunction: 'calculate_domain_score',
    },
    physical: {
        tables: ['physical_metrics', 'workouts', 'nutrition_logs', 'sleep_logs'],
        scoreFunction: 'calculate_domain_score',
    },
    emotional: {
        tables: ['emotion_logs', 'relationships', 'communication_sessions'],
        scoreFunction: 'calculate_domain_score',
    },
    mental: {
        tables: ['mental_checks', 'mindfulness_sessions', 'resilience_exercises'],
        scoreFunction: 'calculate_domain_score',
    },
    character: {
        tables: ['character_assessments', 'ethical_decisions', 'integrity_logs'],
        scoreFunction: 'calculate_domain_score',
    },
    spiritual: {
        tables: ['purpose_explorations', 'gratitude_logs', 'contributions'],
        scoreFunction: 'calculate_domain_score',
    },
    environmental: {
        tables: ['environmental_impact', 'minimalism_logs', 'legacy_projects'],
        scoreFunction: 'calculate_domain_score',
    },
};

type DomainKey = keyof typeof DOMAINS;

// GET all domain scores for current user
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const domain = searchParams.get("domain") as DomainKey | null;

        if (domain && DOMAINS[domain]) {
            // Get specific domain score
            const { data, error } = await supabase
                .rpc("calculate_domain_score", {
                    p_user_id: user.id,
                    p_domain: domain,
                    p_days: 30
                });

            if (error) throw error;

            return NextResponse.json({
                success: true,
                domain,
                score: data || 0,
            });
        } else {
            // Get all domain scores
            const { data, error } = await supabase
                .rpc("get_all_domain_scores", { p_user_id: user.id });

            if (error) throw error;

            return NextResponse.json({
                success: true,
                scores: data || [],
            });
        }
    } catch (error) {
        console.error("Error fetching domain scores:", error);
        return NextResponse.json(
            { error: "Failed to fetch domain scores" },
            { status: 500 }
        );
    }
}

// POST - Log activity for a domain
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { domain, table, data: recordData } = body;

        if (!domain || !DOMAINS[domain as DomainKey]) {
            return NextResponse.json(
                { error: "Invalid domain" },
                { status: 400 }
            );
        }

        const domainConfig = DOMAINS[domain as DomainKey];

        if (!domainConfig.tables.includes(table)) {
            return NextResponse.json(
                { error: `Table ${table} not allowed for domain ${domain}` },
                { status: 400 }
            );
        }

        // Add user_id to record
        const record = {
            ...recordData,
            user_id: user.id,
        };

        const { data, error } = await supabase
            .from(table)
            .insert(record)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({
            success: true,
            data,
        });
    } catch (error) {
        console.error("Error creating domain record:", error);
        return NextResponse.json(
            { error: "Failed to create record" },
            { status: 500 }
        );
    }
}
