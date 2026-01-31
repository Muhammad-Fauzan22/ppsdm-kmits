export class RiskEngine {
    // Thresholds for alerts
    private static readonly HIGH_RISK_KEYWORDS = [
        'bunuh diri', 'suicide', 'mati', 'end it all', 'hurt myself',
        'tidak ada harapan', 'hopeless', 'useless', 'tidak berguna'
    ];

    private static readonly DEPRESSION_THRESHOLD = 8; // Scale 1-10
    private static readonly WELLBEING_THRESHOLD = 3;  // Scale 1-10 (Lower is worse)

    static analyzeResponse(questionId: string, answer: string | number): 'none' | 'moderate' | 'high' {
        // 1. Text Analysis (Keyword Matching)
        if (typeof answer === 'string') {
            const lowerAnswer = answer.toLowerCase();
            for (const keyword of this.HIGH_RISK_KEYWORDS) {
                if (lowerAnswer.includes(keyword)) {
                    return 'high';
                }
            }
        }

        // 2. Score Analysis (Specific Questions)
        // Example IDs: 'MEN_DEPR' (Depression), 'MEN_HOPE' (Hopelessness)
        if (typeof answer === 'number') {
            if (questionId.includes('DEPR') && answer >= this.DEPRESSION_THRESHOLD) {
                return 'high';
            }
            if (questionId.includes('SATISFACTION') && answer <= this.WELLBEING_THRESHOLD) {
                return 'moderate';
            }
        }

        return 'none';
    }

    static analyzeHolisticProfile(scores: Record<string, number>): { riskLevel: 'low' | 'moderate' | 'critical', triggers: string[] } {
        const triggers: string[] = [];
        let criticalCount = 0;

        // Check Mental Health Score
        if (scores['mental_health'] && scores['mental_health'] < 40) {
            triggers.push('Low Mental Health Score');
            criticalCount++;
        }

        // Check Emotional Stability
        if (scores['emotional'] && scores['emotional'] < 40) {
            triggers.push('Low Emotional Stability');
        }

        // Check Social Connection (Isolation Risk)
        if (scores['social'] && scores['social'] < 30) {
            triggers.push('Social Isolation Risk');
        }

        if (criticalCount > 0 || triggers.length >= 3) {
            return { riskLevel: 'critical', triggers };
        } else if (triggers.length > 0) {
            return { riskLevel: 'moderate', triggers };
        }

        return { riskLevel: 'low', triggers: [] };
    }
}
