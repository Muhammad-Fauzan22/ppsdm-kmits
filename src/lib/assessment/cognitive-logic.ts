import { calculateCognitiveScores, CognitiveScoreResult } from './cognitiveScoring';
import { cognitiveDimension } from '@/data/dimensions/cognitive';

export { calculateCognitiveScores };
export type CognitiveResult = CognitiveScoreResult;
export type CognitiveDimension = 'critical_thinking' | 'growth_mindset' | 'creativity' | 'metacognition';

export const COGNITIVE_ITEMS = cognitiveDimension.items;

export const DIMENSION_LABELS: Record<string, { title: string; color: string }> = {};

cognitiveDimension.subdimensions.forEach(sub => {
    DIMENSION_LABELS[sub.id] = {
        title: sub.name,
        color: sub.color
    };
});
