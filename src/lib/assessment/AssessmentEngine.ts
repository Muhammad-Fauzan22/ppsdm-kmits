
import { supabase } from '../supabase/supabaseClient';

// EXISTING SCORING MODULES (Verified export names)
import { calculateCognitiveScores } from './cognitiveScoring';
import { calculateFinancialScores } from './financialScoring'; // Plural
import { calculateEmotionalScore as calculateEmotionalScores } from './emotionalScoring'; // Singular
import { calculatePhysicalScore as calculatePhysicalScores } from './physicalScoring'; // Singular
import { calculateMentalScore as calculateMentalScores } from './mentalScoring'; // Singular
import { calculateSpiritualScore as calculateSpiritualScores } from './spiritualScoring'; // Singular

// NEW SCORING MODULES (Created as Plural)
import { calculateSocialScores } from './socialScoring';
import { calculateLeadershipScores } from './leadershipScoring';
import { calculateAdaptabilityScores } from './adaptabilityScoring';
import { calculateEthicsScores } from './ethicsScoring';
import { calculateCreativityScores } from './creativityScoring';

export type AssessmentDomain =
    | 'cognitive'
    | 'emotional'
    | 'financial'
    | 'social'
    | 'leadership'
    | 'adaptability'
    | 'ethics'
    | 'creativity'
    | 'wellbeing'
    | 'physical'
    | 'spiritual';

export interface AssessmentContext {
    userId: string;
    faculty?: string;
    yearLevel?: number;
}

export class AssessmentEngine {

    constructor() { }

    /**
     * Conduct comprehensive assessment for a specific domain
     */
    async conductAssessment(
        userId: string,
        domain: AssessmentDomain,
        responses: Record<string, number>
    ) {
        console.log(`Starting assessment for ${userId} in domain ${domain}`);

        const context = await this.getUserContext(userId);
        let scores, profile, recommendations, validity;

        try {
            switch (domain) {
                case 'cognitive':
                    const cogResult = calculateCognitiveScores(responses, context.faculty as any);
                    scores = cogResult;
                    profile = cogResult.development_category;
                    recommendations = cogResult.recommendations;
                    validity = cogResult.validity_checks;
                    break;
                case 'emotional':
                    const emoResult = calculateEmotionalScores(responses);
                    scores = emoResult;
                    break;
                case 'financial':
                    const finResult = calculateFinancialScores(responses);
                    scores = finResult;
                    break;
                case 'social':
                    const socResult = calculateSocialScores(responses);
                    scores = socResult;
                    break;
                case 'leadership':
                    const leadResult = calculateLeadershipScores(responses);
                    scores = leadResult;
                    break;
                case 'adaptability':
                    const adaptResult = calculateAdaptabilityScores(responses);
                    scores = adaptResult;
                    break;
                case 'ethics':
                    const ethResult = calculateEthicsScores(responses);
                    scores = ethResult;
                    break;
                case 'creativity':
                    const creatResult = calculateCreativityScores(responses);
                    scores = creatResult;
                    break;
                case 'physical':
                    scores = calculatePhysicalScores(responses);
                    break;
                case 'mental':
                case 'wellbeing':
                    scores = calculateMentalScores(responses);
                    break;
                case 'spiritual':
                    const spirResult = calculateSpiritualScores(responses);
                    scores = spirResult;
                    break;
                default:
                    throw new Error(`Domain ${domain} not implemented yet`);
            }
        } catch (error: any) {
            console.error(`Error calculating scores for ${domain}:`, error);
            if (error?.code === 'MODULE_NOT_FOUND' || error?.message?.includes('not found')) {
                return { success: false, error: 'Scoring module missing or import failed' };
            }
            throw new Error(`Calculation failed: ${error.message}`);
        }

        const { error: dbError } = await supabase
            .from('assessments')
            .insert({
                user_id: userId,
                domain: domain,
                scores: scores || {},
                profile_analysis: profile || {},
                recommendations: recommendations || {},
                validity_checks: validity || {},
                completed_at: new Date().toISOString()
            });

        if (dbError) {
            console.error('Database save failed:', dbError);
            throw new Error('Failed to save assessment results');
        }

        return {
            success: true,
            scores,
            profile,
            recommendations
        };
    }

    private async getUserContext(userId: string): Promise<AssessmentContext> {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('faculty, year_level')
                .eq('id', userId)
                .single();

            if (error || !data) return { userId, faculty: 'engineering' };

            return {
                userId,
                faculty: data.faculty,
                yearLevel: data.year_level
            };
        } catch (e) {
            return { userId, faculty: 'engineering' };
        }
    }
}
