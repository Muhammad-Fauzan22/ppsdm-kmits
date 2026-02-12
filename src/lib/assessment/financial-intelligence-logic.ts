import { calculateFinancialScores as strategyScore, FinancialResult, FinancialResponse } from './financialScoring';
import { financialDimension } from '@/data/dimensions/financial';

export type { FinancialResult, FinancialResponse };

export const FINANCIAL_ITEMS = financialDimension.items;

export function calculateFinancialScores(responses: FinancialResponse) {
    const raw = strategyScore(responses);

    return {
        composite_score: raw.rawScore,
        composite_percentile: raw.normalizedScore, // Using normalized as percentile proxy if not available
        intelligence_level: raw.level,
        details: {
            knowledge: { score: raw.subscores.knowledge, percentile: raw.subscores.knowledge, theta: 0 },
            behavior: { score: raw.subscores.behavior, percentile: raw.subscores.behavior },
            attitude: { score: raw.subscores.attitude, percentile: raw.subscores.attitude }
        },
        subdomain_scores: raw.subscores,
        recommendations: raw.recommendations,
        properties: {
            interpretation: raw.interpretation,
            color: raw.levelColor
        }
    };
}


