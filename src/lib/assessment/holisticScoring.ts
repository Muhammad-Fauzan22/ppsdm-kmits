
// Removed uuid package import in favor of crypto.randomUUID (native)

// --- Types ---

export type Dimension =
    | 'cognitive'
    | 'self_management'
    | 'financial'
    | 'physical'
    | 'emotional'
    | 'mental_health'
    | 'character'
    | 'spiritual'
    | 'environmental';

export type UserContext = {
    year: 'freshman' | 'sophomore' | 'junior' | 'senior';
    faculty: 'engineering' | 'business' | 'science' | 'arts' | 'other';
    careerPath?: 'entrepreneur' | 'research' | 'corporate' | 'public_service';
};

export type HolisticProfile = {
    scores: Record<Dimension, number>;
    context: UserContext;
    archetype: ArchetypeResult;
    insights: Insights;
    recommendations: HolisticRecommendation[];
    growthProjection: GrowthProjection[];
};

export type ArchetypeResult = {
    primary: string;
    confidence: number;
    secondary: string[];
    description: string;
};

export type Insights = {
    strengths: Dimension[];
    criticalGaps: Dimension[];
    interactionEffects: Record<Dimension, number>; // Net influence
};

export type HolisticRecommendation = {
    dimension: Dimension;
    action: string;
    type: 'immediate' | 'strategic' | 'compensatory';
    impactScore: number;
};

export type GrowthProjection = {
    month: number;
    scores: Record<Dimension, number>;
};

// --- CONSTANTS ---

const INTERACTION_MATRIX: Record<Dimension, Partial<Record<Dimension, number>>> = {
    cognitive: { self_management: 0.72, financial: 0.58, emotional: 0.68 },
    self_management: { cognitive: 0.65, financial: 0.71, physical: 0.69, mental_health: 0.73 },
    financial: { self_management: 0.68, environmental: 0.61 },
    physical: { mental_health: 0.78, emotional: 0.72, cognitive: 0.55 },
    emotional: { mental_health: 0.82, character: 0.71, spiritual: 0.66 },
    mental_health: { physical: 0.74, emotional: 0.79, cognitive: 0.71 },
    character: { spiritual: 0.74, environmental: 0.67, emotional: 0.68 },
    spiritual: { character: 0.71, environmental: 0.69, mental_health: 0.59 },
    environmental: { spiritual: 0.65, character: 0.63, financial: 0.56 },
};

const ARCHETYPES = {
    INTEGRATED_HOLISTIC: {
        check: (s: any) => Object.values(s).every((v: any) => v > 70),
        desc: "Well-rounded development. Strong integration across all areas."
    },
    COGNITIVE_SPECIALIST: {
        check: (s: any) => s.cognitive > 85 && s.emotional < 70,
        desc: "Strong intellectual capabilities but weaker emotional/social development."
    },
    EMOTIONAL_ANCHOR: {
        check: (s: any) => s.emotional > 85 && s.mental_health > 80,
        desc: "Strong emotional intelligence and stability."
    },
    STRUGGLING_FOUNDATION: {
        check: (s: any) => s.self_management < 45 && s.physical < 50,
        desc: "Critical need for foundation skills development."
    },
    PRACTICAL_MANAGER: {
        check: (s: any) => s.self_management > 85 && s.financial > 75,
        desc: "Excellent organizational and resource management skills."
    },
    // Default fallback handled in code
};

// --- CORE ENGINE ---

export class HolisticProfileProcessor {

    process(scores: Record<Dimension, number>, context: UserContext): HolisticProfile {
        // 1. Calculate Interaction Effects
        const interactions = this.calculateInteractions(scores);

        // 2. Identify Archetype
        const archetype = this.classifyArchetype(scores);

        // 3. Generate Insights (Gaps & Strengths)
        const insights = this.generateInsights(scores, interactions);

        // 4. Create Recommendations
        const recs = this.generateRecommendations(scores, insights, context);

        // 5. Predict Growth
        const projection = this.predictGrowth(scores, recs);

        return {
            scores,
            context,
            archetype,
            insights,
            recommendations: recs,
            growthProjection: projection
        };
    }

    private calculateInteractions(scores: Record<Dimension, number>): Record<Dimension, number> {
        const effects: any = {};
        for (const dim of Object.keys(scores) as Dimension[]) {
            let influence = 0;
            const relations = INTERACTION_MATRIX[dim];
            if (relations) {
                for (const [target, coef] of Object.entries(relations)) {
                    influence += (scores[target as Dimension] || 0) * (coef || 0);
                }
            }
            effects[dim] = influence / 10; // Normalized influence score
        }
        return effects;
    }

    private classifyArchetype(scores: Record<Dimension, number>): ArchetypeResult {
        for (const [key, def] of Object.entries(ARCHETYPES)) {
            if (def.check(scores)) {
                return {
                    primary: key,
                    confidence: 0.85,
                    secondary: [],
                    description: def.desc
                };
            }
        }

        // Fallback logic
        const variance = this.calculateVariance(Object.values(scores));
        if (variance > 400) return { primary: 'UNBALANCED_ACHIEVER', confidence: 0.7, secondary: [], description: "Extreme strengths mixed with significant gaps." };

        return {
            primary: 'DEVELOPING_GENERALIST',
            confidence: 0.6,
            secondary: [],
            description: "Steady development across most areas without extreme peaks."
        };
    }

    private generateInsights(scores: Record<Dimension, number>, interactions: Record<Dimension, number>): Insights {
        const dims = Object.keys(scores) as Dimension[];
        const sorted = [...dims].sort((a, b) => scores[b] - scores[a]);

        return {
            strengths: sorted.slice(0, 3),
            criticalGaps: sorted.filter(d => scores[d] < 55),
            interactionEffects: interactions
        };
    }

    private generateRecommendations(scores: Record<Dimension, number>, insights: Insights, ctx: UserContext): HolisticRecommendation[] {
        const recs: HolisticRecommendation[] = [];

        // Protocol: Fix foundations first (Self-Mgmt, Physical, Mental)
        if (scores.self_management < 60) {
            recs.push({
                dimension: 'self_management',
                action: 'Bangun rutinitas harian yang solid (Atomic Habits).',
                type: 'immediate',
                impactScore: 9.5
            });
        }

        if (scores.physical < 60 && scores.mental_health < 60) {
            recs.push({
                dimension: 'physical',
                action: 'Prioritaskan tidur 7-8 jam untuk pemulihan kognitif.',
                type: 'immediate',
                impactScore: 9.0
            });
        }

        // Contextual: Engineering students need soft skills
        if (ctx.faculty === 'engineering' && scores.emotional < 70) {
            recs.push({
                dimension: 'emotional',
                action: 'Latih empati dan komunikasi tim (Project Based Learning).',
                type: 'strategic',
                impactScore: 8.5
            });
        }

        // Contextual: Business needs financial/analytics
        if (ctx.faculty === 'business' && scores.financial < 75) {
            recs.push({
                dimension: 'financial',
                action: 'Pelajari instrumen investasi dan analisis pasar.',
                type: 'strategic',
                impactScore: 8.8
            });
        }

        return recs;
    }

    private predictGrowth(scores: Record<Dimension, number>, recs: HolisticRecommendation[]): GrowthProjection[] {
        // Simple linear projection based on recommendation impact
        const baseGrowthRate = 0.5; // points per month
        const projections: GrowthProjection[] = [];

        let current = { ...scores };

        for (let i = 1; i <= 6; i++) {
            const next: any = {};
            for (const dim of Object.keys(current) as Dimension[]) {
                let boost = 0;
                if (recs.find(r => r.dimension === dim)) boost = 1.5; // Bonus for active intervention
                next[dim] = Math.min(100, current[dim] + baseGrowthRate + boost);
            }
            projections.push({ month: i, scores: next });
            current = next;
        }

        return projections;
    }

    private calculateVariance(arr: number[]): number {
        const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
        return arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / arr.length;
    }
}
