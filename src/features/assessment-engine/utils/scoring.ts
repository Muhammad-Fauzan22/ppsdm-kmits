/**
 * Scoring Utilities for Assessment Engine
 */

import { 
  DimensionConfig, 
  AssessmentResponse, 
  ScoringConfig,
  ScoringAlgorithmType,
  DimensionScores,
  ScoreInterpretation,
  ScoreThresholds
} from '../core/types';

export interface ScoringResult {
  scores: DimensionScores;
  interpretation: ScoreInterpretation;
  rawResponses: AssessmentResponse[];
  calculatedAt: string;
}

export type ScoringAlgorithm = ScoringAlgorithmType;


/**
 * Calculate score based on dimension config and responses
 */
export function calculateScore(
  dimension: DimensionConfig,
  responses: AssessmentResponse[]
): ScoringResult {
  const { scoringAlgorithm } = dimension;
  const scoringConfig = dimension.instruments[0]?.scoring || { algorithm: 'simpleSum' };

  let scores: DimensionScores;

  switch (scoringAlgorithm) {
    case 'weightedSum':
      scores = calculateWeightedSum(responses, scoringConfig);
      break;
    case 'average':
      scores = calculateAverage(responses, scoringConfig);
      break;
    case 'irt':
      // IRT scoring would require more complex implementation
      scores = calculateSimpleSum(responses, scoringConfig);
      break;
    case 'simpleSum':
    default:
      scores = calculateSimpleSum(responses, scoringConfig);
      break;
  }

  // Normalize to 0-100 scale
  if (scoringConfig.normalizeTo100 !== false) {
    scores.normalized = normalizeScore(scores.raw, responses.length, scoringConfig);
  }

  // Calculate interpretation
  const interpretation = interpretScore(scores.normalized, dimension.thresholds);

  return {
    scores,
    interpretation,
    rawResponses: responses,
    calculatedAt: new Date().toISOString()
  };
}

/**
 * Simple sum scoring
 */
function calculateSimpleSum(
  responses: AssessmentResponse[],
  config: ScoringConfig
): DimensionScores {
  let total = 0;
  const byCategory: Record<string, number> = {};
  const byInstrument: Record<string, number> = {};

  responses.forEach((response, index) => {
    let value = Number(response.value) || 0;
    
    // Handle reverse scoring
    if (config.reverseScored?.[index]) {
      value = reverseScore(value, config);
    }

    total += value;

    // Track by category if available
    if (response.category) {
      byCategory[response.category] = (byCategory[response.category] || 0) + value;
    }

    // Track by instrument
    if (response.instrumentId) {
      byInstrument[response.instrumentId] = (byInstrument[response.instrumentId] || 0) + value;
    }
  });

  return {
    total,
    raw: total,
    normalized: total,
    byCategory: Object.keys(byCategory).length > 0 ? byCategory : undefined,
    byInstrument: Object.keys(byInstrument).length > 0 ? byInstrument : undefined
  };
}

/**
 * Weighted sum scoring
 */
function calculateWeightedSum(
  responses: AssessmentResponse[],
  config: ScoringConfig
): DimensionScores {
  let total = 0;
  const weights = config.weights || [];

  responses.forEach((response, index) => {
    let value = Number(response.value) || 0;
    const weight = weights[index] || 1;

    // Handle reverse scoring
    if (config.reverseScored?.[index]) {
      value = reverseScore(value, config);
    }

    total += value * weight;
  });

  return {
    total,
    raw: total,
    normalized: total
  };
}

/**
 * Average scoring
 */
function calculateAverage(
  responses: AssessmentResponse[],
  config: ScoringConfig
): DimensionScores {
  if (responses.length === 0) {
    return { total: 0, raw: 0, normalized: 0 };
  }

  const sum = calculateSimpleSum(responses, config);
  const average = sum.raw / responses.length;

  return {
    total: sum.total,
    raw: average,
    normalized: average
  };
}

/**
 * Reverse score value
 */
function reverseScore(value: number, config: ScoringConfig): number {
  // Assuming 1-5 Likert scale by default
  const max = 5;
  const min = 1;
  return max - (value - min);
}

/**
 * Normalize score to 0-100 scale
 */
export function normalizeScore(

  rawScore: number, 
  itemCount: number, 
  config: ScoringConfig
): number {
  if (itemCount === 0) return 0;

  // Assuming 1-5 Likert scale
  const maxPerItem = 5;
  const minPerItem = 1;
  const maxPossible = itemCount * maxPerItem;
  const minPossible = itemCount * minPerItem;

  const normalized = ((rawScore - minPossible) / (maxPossible - minPossible)) * 100;
  return Math.round(Math.max(0, Math.min(100, normalized)));
}

/**
 * Interpret score based on thresholds
 */
function interpretScore(
  normalizedScore: number, 
  thresholds: ScoreThresholds
): ScoreInterpretation {
  if (normalizedScore >= thresholds.high.min) {
    return {
      level: 'high',
      label: thresholds.high.label,
      description: thresholds.high.description || '',
      color: thresholds.high.color || '#10B981'
    };
  } else if (normalizedScore >= thresholds.medium.min) {
    return {
      level: 'medium',
      label: thresholds.medium.label,
      description: thresholds.medium.description || '',
      color: thresholds.medium.color || '#F59E0B'
    };
  } else {
    return {
      level: 'low',
      label: thresholds.low.label,
      description: thresholds.low.description || '',
      color: thresholds.low.color || '#EF4444'
    };
  }
}

/**
 * Calculate weighted score
 */
export function calculateWeightedScore(
  responses: AssessmentResponse[],
  weights: number[]
): number {
  if (responses.length === 0 || weights.length === 0) return 0;
  
  let weightedSum = 0;
  let totalWeight = 0;
  
  responses.forEach((response, index) => {
    const value = Number(response.value) || 0;
    const weight = weights[index] || 1;
    weightedSum += value * weight;
    totalWeight += weight;
  });
  
  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

/**
 * Apply reverse scoring to responses
 */
export function applyReverseScoring(
  responses: AssessmentResponse[],
  reverseIndices: boolean[],
  scaleMax: number = 5,
  scaleMin: number = 1
): AssessmentResponse[] {
  return responses.map((response, index) => {
    if (!reverseIndices[index]) return response;
    
    const value = Number(response.value) || 0;
    const reversedValue = scaleMax - (value - scaleMin);
    
    return {
      ...response,
      value: reversedValue
    };
  });
}

/**
 * Get recommendations based on score level
 */
export function getRecommendations(
  level: 'low' | 'medium' | 'high',
  dimension: DimensionConfig
): string[] {
  return dimension.recommendations[level] || [];
}


/**
 * Calculate percentile rank
 */
export function calculatePercentile(
  userScore: number,
  allScores: number[]
): number {
  if (allScores.length === 0) return 50;

  const below = allScores.filter(score => score < userScore).length;
  const equal = allScores.filter(score => score === userScore).length;

  return Math.round(((below + equal / 2) / allScores.length) * 100);
}
