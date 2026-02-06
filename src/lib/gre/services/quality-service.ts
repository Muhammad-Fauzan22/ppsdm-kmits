import { GreResource, QualityScores } from '../types';

export class QualityAssessmentService {

    /**
     * Calculates the 12-dimensional quality scores for a resource.
     * Implements comprehensive heuristics for the "Perfect Model".
     */
    assessQuality(resource: Partial<GreResource>): QualityScores {
        // 1. Pedagogical Effectiveness
        const pedagogical = this.assessPedagogical(resource);

        // 2. Scientific Accuracy
        const scientific = this.assessScientific(resource);

        // 3. Technical Quality
        const technical = this.assessTechnical(resource);

        // 4. Production Quality
        const production = this.assessProduction(resource);

        // 5. Accessibility Compliance
        const accessibility = this.assessAccessibility(resource);

        // 6. Recency & Maintenance
        const recency = this.assessRecency(resource);

        // 7. Source Credibility
        const credibility = this.assessCredibility(resource);

        // 8. Engagement Potential
        const engagement = this.assessEngagement(resource);

        // 9. Practical Application
        const practicality = this.assessPracticality(resource);

        // 10. Cultural Relevance (Default neutral, adapted by context later)
        const cultural = 0.6;

        // 11. Scalability
        const scalability = this.assessScalability(resource);

        // 12. Impact Evidence (Default neutral until feedback)
        const impact = 0.5;

        const scores: QualityScores = {
            resource_id: resource.id || 'temp',
            pedagogical_score: pedagogical,
            scientific_accuracy_score: scientific,
            technical_quality_score: technical,
            production_quality_score: production,
            accessibility_score: accessibility,
            recency_score: recency,
            credibility_score: credibility,
            engagement_potential_score: engagement,
            practical_application_score: practicality,
            cultural_relevance_score: cultural,
            scalability_score: scalability,
            impact_score: impact,
            overall_score: 0, // Calculated below
            last_assessed_at: new Date().toISOString()
        };

        // Calculate aggregated overall score
        const values = [
            pedagogical, scientific, technical, production, accessibility, recency,
            credibility, engagement, practicality, cultural, scalability, impact
        ];
        const total = values.reduce((a, b) => a + b, 0);
        scores.overall_score = parseFloat((total / values.length).toFixed(2));

        return scores;
    }

    // --- Dimension Heuristics ---

    private assessPedagogical(res: Partial<GreResource>): number {
        let score = 0.4;
        if (res.difficulty) score += 0.2;
        if (res.title && res.title.toLowerCase().includes('introduction')) score += 0.1;
        if (res.description && res.description.length > 100) score += 0.2;
        if (res.type === 'course') score += 0.1;
        return Math.min(score, 1.0);
    }

    private assessScientific(res: Partial<GreResource>): number {
        if (res.type === 'paper') return 0.95;
        if (res.source_platform?.toLowerCase().includes('scholar')) return 0.9;
        if (res.description?.includes('doi.org')) return 0.9;
        return 0.5;
    }

    private assessTechnical(res: Partial<GreResource>): number {
        if (res.url?.startsWith('https')) return 0.8;
        return 0.4;
    }

    private assessProduction(res: Partial<GreResource>): number {
        if (res.type === 'video') return 0.7; // Assume video has higher production effort
        if (res.format_tags?.includes('pdf')) return 0.6;
        return 0.5;
    }

    private assessAccessibility(res: Partial<GreResource>): number {
        // Detect potential accessibility metadata
        let score = 0.5;
        if (res.format_tags?.includes('text') || res.format_tags?.includes('html')) score += 0.3; // Screen reader friendly
        return Math.min(score, 1.0);
    }

    private assessRecency(res: Partial<GreResource>): number {
        // In real app, parse date. Heuristic: Assume crawled content is generally relevant.
        return 0.8;
    }

    private assessCredibility(res: Partial<GreResource>): number {
        const trustedDomains = ['edu', 'gov', 'org', 'ac.id'];
        let score = 0.5;
        try {
            const hostname = new URL(res.url || '').hostname;
            if (trustedDomains.some(d => hostname.endsWith(d))) score += 0.3;
        } catch (e) { }
        return Math.min(score, 1.0);
    }

    private assessEngagement(res: Partial<GreResource>): number {
        // Initial prediction: Interactive > Video > Text
        if (res.format_tags?.includes('interactive')) return 0.9;
        if (res.type === 'video') return 0.8;
        return 0.6;
    }

    private assessPracticality(res: Partial<GreResource>): number {
        if (res.type === 'project' || res.type === 'tool') return 0.9;
        if (res.description?.toLowerCase().includes('tutorial')) return 0.8;
        return 0.5;
    }

    private assessScalability(res: Partial<GreResource>): number {
        // Digital resources are inherently scalable
        return 0.9;
    }
}
