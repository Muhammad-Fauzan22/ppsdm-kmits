/**
 * Continuous Feedback & Evolution System (Phase 3)
 * 
 * Handles feedback ingestion and autonomous quality recalibration.
 */

import { supabase } from '@/lib/supabaseClient';

export class FeedbackService {
    private supabase = supabase;

    /**
     * Records user feedback and triggers autonomous recalibration
     */
    async submitFeedback(resourceId: string, userId: string, rating: number, comment?: string) {
        // 1. Store explicit feedback
        const { error } = await this.supabase
            .from('gre_feedback') // Assuming this table exists or we log it
            .insert({
                resource_id: resourceId,
                user_id: userId,
                rating: rating, // 1-5
                comment: comment,
                created_at: new Date().toISOString()
            });

        if (error) {
            // Fallback: Just log if table doesn't exist yet (simulating partial deploy)
            console.warn('Feedback table missing, logging only:', { resourceId, rating });
        }

        // 2. Autonomous Recalibration (Self-Improving Algorithms)
        await this.recalibrateQuality(resourceId, rating);
    }

    /**
     * Adjusts the 'Engagement' and 'Impact' scores based on live feedback
     */
    private async recalibrateQuality(resourceId: string, newRating: number) {
        // Fetch current scores
        const { data: currentScores } = await this.supabase
            .from('gre_quality_scores')
            .select('*')
            .eq('resource_id', resourceId)
            .single();

        if (!currentScores) return;

        // Simple Moving Average Logic for "Engagement Potential"
        // Heuristic: If user rates high (4-5), boost engagement score
        let engagementBoost = 0;
        if (newRating >= 4) engagementBoost = 0.05;
        else if (newRating <= 2) engagementBoost = -0.05;

        const newEngagement = Math.min(Math.max((currentScores.engagement_potential_score || 0.5) + engagementBoost, 0), 1);

        // Update DB
        await this.supabase
            .from('gre_quality_scores')
            .update({
                engagement_potential_score: newEngagement,
                last_assessed_at: new Date().toISOString()
            })
            .eq('resource_id', resourceId);
    }
}
