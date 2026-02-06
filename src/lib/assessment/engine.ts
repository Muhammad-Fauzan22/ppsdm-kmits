/**
 * Holistic Assessment Engine - 9 Dimensions
 * Based on validated psychometric instruments
 * 
 * Dimensions:
 * 1. Cognitive & Intellectual Development
 * 2. Self-Management & Productivity
 * 3. Financial Intelligence
 * 4. Physical Health & Vitality
 * 5. Emotional & Social Intelligence
 * 6. Mental Health & Psychological Wellbeing
 * 7. Character & Ethics
 * 8. Spiritual Development
 * 9. Environmental Management & Lifestyle
 * 
 * Sources: validatedInstruments.ts
 */

import {
  COGNITIVE_ITEMS,
  COGNITIVE_SUBDIMENSIONS,
  COGNITIVE_INTERPRETATION_LEVELS,
  COGNITIVE_NORMS,
  calculateCognitiveScore as calculateCognitiveScoreDetailed,
  generateCognitiveFeedback,
  type CognitiveItem,
} from './dimension1-cognitive';

import {
  SELF_MANAGEMENT_ITEMS,
  SELF_MANAGEMENT_SUBDIMENSIONS,
  SELF_MANAGEMENT_INTERPRETATION_LEVELS,
  SELF_MANAGEMENT_NORMS,
  calculateSelfManagementScore as calculateSelfManagementScoreDetailed,
  generateSelfManagementFeedback,
  type SelfManagementItem,
} from './dimension2-selfmanagement';



export interface AssessmentResponse {
  userId: string;
  timestamp: string;
  responses: Record<string, number>;
}

export interface DimensionScore {
  id: string;
  name: string;
  score: number;
  percentile: number;
  level: string;
  subscores: Record<string, number>;
  confidenceInterval: [number, number];
  interpretation: string;
  strengths: string[];
  growthAreas: string[];
  recommendations: string[];
}

export interface HolisticAssessmentResult {
  userId: string;
  timestamp: string;
  overallScore: number;
  balanceIndex: number;
  dimensions: DimensionScore[];
  quadrantScores: {
    cognitive: number;
    affective: number;
    social: number;
  };
  profile: {
    type: string;
    description: string;
    dominantDimensions: string[];
    developmentPriorities: string[];
  };
}

// ============================================================================
// DIMENSI 1: KOGNITIF & INTELEKTUAL
// ============================================================================

export function calculateCognitiveScore(responses: Record<string, number>): DimensionScore {
  // Use the detailed calculation from dimension1-cognitive.ts
  const result = calculateCognitiveScoreDetailed(responses);
  const feedback = generateCognitiveFeedback(result.compositeScore, result.subscores);

  // Map subscores to the expected format
  const subscores: Record<string, number> = {
    criticalThinking: result.subscores.critical_thinking,
    growthMindset: result.subscores.growth_mindset,
    creativity: result.subscores.creativity,
    metacognition: result.subscores.metacognition,
  };

  // Get interpretation level details
  const levelData = COGNITIVE_INTERPRETATION_LEVELS.find(
    l => l.level === result.level
  ) || COGNITIVE_INTERPRETATION_LEVELS[0];

  return {
    id: 'cognitive',
    name: 'Kognitif & Intelektual',
    score: result.compositeScore,
    percentile: result.percentile,
    level: result.level,
    subscores,
    confidenceInterval: result.confidenceInterval,
    interpretation: levelData.description,
    strengths: feedback.strengths,
    growthAreas: feedback.growthAreas,
    recommendations: feedback.recommendations,
  };
}

// Export cognitive items for use in components
export { COGNITIVE_ITEMS, COGNITIVE_SUBDIMENSIONS, COGNITIVE_INTERPRETATION_LEVELS, COGNITIVE_NORMS };
export type { CognitiveItem };

// ============================================================================
// DIMENSI 2: MANAJEMEN DIRI & PRODUKTIVITAS
// ============================================================================

export function calculateSelfManagementScore(responses: Record<string, number>): DimensionScore {
  // Use the detailed calculation from dimension2-selfmanagement.ts
  const result = calculateSelfManagementScoreDetailed(responses);
  const feedback = generateSelfManagementFeedback(result);

  // Map subscores to the expected format
  const subscores: Record<string, number> = {
    timeManagement: result.subdimensionScores.time_management,
    procrastination: result.subdimensionScores.procrastination,
    selfControl: result.subdimensionScores.self_control,
    deepWork: result.subdimensionScores.deep_work,
    energyManagement: result.subdimensionScores.energy_management,
    prioritization: result.subdimensionScores.prioritization,
  };

  // Get interpretation level details
  const levelData = SELF_MANAGEMENT_INTERPRETATION_LEVELS.find(
    l => l.level === result.level
  ) || SELF_MANAGEMENT_INTERPRETATION_LEVELS[0];

  return {
    id: 'self_management',
    name: 'Manajemen Diri & Produktivitas',
    score: result.compositeScore,
    percentile: result.percentile,
    level: result.level,
    subscores,
    confidenceInterval: result.confidenceInterval,
    interpretation: levelData.description,
    strengths: feedback.strengths.map(s => s.area),
    growthAreas: feedback.challenges.map(c => c.area),
    recommendations: feedback.personalizedRecommendations.map(r => r.title),
  };
}

// Export self-management items for use in components
export { SELF_MANAGEMENT_ITEMS, SELF_MANAGEMENT_SUBDIMENSIONS, SELF_MANAGEMENT_INTERPRETATION_LEVELS, SELF_MANAGEMENT_NORMS };
export type { SelfManagementItem };

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================


/**
 * Calculate percentile rank based on score and dimension norms
 */
function calculatePercentile(score: number, dimension: string): number {
  // Simplified percentile calculation based on normal distribution
  // In production, this would use actual normative data from the database
  const mean = 50;
  const std = 15;
  const zScore = (score - mean) / std;

  // Approximate percentile from z-score using error function approximation
  const percentile = Math.round((0.5 * (1 + erf(zScore / Math.sqrt(2)))) * 100);

  return Math.min(99, Math.max(1, percentile));
}

/**
 * Error function approximation for percentile calculation
 */
function erf(x: number): number {
  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);

  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const t = 1 / (1 + p * x);
  const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return sign * y;
}



// ============================================================================
// DIMENSI 9: ENVIRONMENTAL
// ============================================================================

export function calculateEnvironmentalScore(responses: Record<string, number>): DimensionScore {
  const items = {
    awareness: ['ENV1', 'ENV2'],
    behavior: ['ENV3', 'ENV4'],
    workLifeBalance: ['ENV5', 'ENV6'],
    digitalWellbeing: ['ENV7', 'ENV8'],
    energy: ['ENV9', 'ENV10'],
  };

  const weights = {
    awareness: 1.0,
    behavior: 1.1,
    workLifeBalance: 1.2,
    digitalWellbeing: 1.2,
    energy: 1.0,
  };

  const subscores: Record<string, number> = {};
  for (const [key, itemIds] of Object.entries(items)) {
    const values = itemIds.map(id => responses[id] || 3);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    subscores[key] = ((avg - 1) / 4) * 100;
  }

  const weightedSum = Object.entries(subscores).reduce(
    (sum, [key, score]) => sum + score * weights[key as keyof typeof weights],
    0
  );
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  const adjustedScore = Math.min(100, Math.max(0, weightedSum / totalWeight));
  const se = 3.8;

  return {
    id: 'environmental',
    name: 'Lingkungan',
    score: Math.round(adjustedScore * 10) / 10,
    percentile: calculatePercentile(adjustedScore, 'environmental'),
    level: adjustedScore >= 70 ? 'Eco-Conscious' : 'Aware',
    subscores,
    confidenceInterval: [
      Math.round((adjustedScore - 1.96 * se) * 10) / 10,
      Math.round((adjustedScore + 1.96 * se) * 10) / 10,
    ],
    interpretation: 'Kesadaran dan perilaku terhadap lingkungan serta manajemen gaya hidup.',
    strengths: subscores.behavior >= 70 ? ['Perilaku ramah lingkungan'] : [],
    growthAreas: subscores.workLifeBalance < 50 ? ['Perlu balance yang lebih baik'] : [],
    recommendations: ['Kurangi penggunaan plastik', 'Atur waktu digital detox'],
  };
}

// ============================================================================
// GENERIC DIMENSION SCORE CALCULATOR
// ============================================================================

/**
 * Calculate dimension score based on responses and questions
 * Used by the /api/assessment/complete route
 */
export function calculateDimensionScore(
  responses: any[],
  questions: any[],
  dimension: string
): {
  rawScore: number;
  normalizedScore: number;
  percentile: number;
  subDimensionScores: Record<string, number>;
} {
  // Build response map
  const responseMap: Record<string, number> = {};
  responses.forEach(r => {
    responseMap[r.question_id] = r.value;
  });

  // Calculate raw score
  let totalScore = 0;
  let maxPossibleScore = 0;
  const subDimensionTotals: Record<string, { sum: number; count: number }> = {};

  questions.forEach(q => {
    const value = responseMap[q.id] || 3;
    const scoreValue = q.reverse_scored ? (6 - value) : value;

    totalScore += scoreValue;
    maxPossibleScore += 5;

    // Track subdimension scores
    const subDim = q.sub_dimension || 'general';
    if (!subDimensionTotals[subDim]) {
      subDimensionTotals[subDim] = { sum: 0, count: 0 };
    }
    subDimensionTotals[subDim].sum += scoreValue;
    subDimensionTotals[subDim].count += 1;
  });

  const rawScore = totalScore;
  const normalizedScore = maxPossibleScore > 0
    ? Math.round((totalScore / maxPossibleScore) * 100)
    : 0;

  // Calculate subdimension scores
  const subDimensionScores: Record<string, number> = {};
  Object.entries(subDimensionTotals).forEach(([key, { sum, count }]) => {
    subDimensionScores[key] = Math.round((sum / (count * 5)) * 100);
  });

  return {
    rawScore,
    normalizedScore,
    percentile: calculatePercentile(normalizedScore, dimension),
    subDimensionScores,
  };
}

// ============================================================================
// HOLISTIC SCORE CALCULATOR
// ============================================================================

/**
 * Calculate holistic score from all dimension results
 */
export function calculateHolisticScore(dimensionResults: any[]): {
  overallScore: number;
  dimensionScores: Record<string, number>;
  profileType: string;
  strengths: string[];
  growthAreas: string[];
  recommendations: string[];
} {
  // Calculate overall score as weighted average
  const dimensionScores: Record<string, number> = {};
  let totalScore = 0;

  dimensionResults.forEach(result => {
    dimensionScores[result.dimension] = result.normalized_score;
    totalScore += result.normalized_score;
  });

  const overallScore = Math.round(totalScore / dimensionResults.length);

  // Identify strengths (top 3 dimensions)
  const sortedDimensions = Object.entries(dimensionScores)
    .sort(([, a], [, b]) => b - a);

  const strengths = sortedDimensions.slice(0, 3).map(([dim]) => dim);
  const growthAreas = sortedDimensions.slice(-3).map(([dim]) => dim);

  // Determine profile type
  let profileType = 'Balanced';
  if (overallScore >= 80) profileType = 'High Achiever';
  else if (overallScore >= 65) profileType = 'Developing';
  else if (overallScore >= 50) profileType = 'Emerging';
  else profileType = 'Foundation';

  // Generate recommendations based on growth areas
  const recommendations = growthAreas.map(area =>
    `Focus on improving ${area} dimension through targeted activities`
  );

  return {
    overallScore,
    dimensionScores,
    profileType,
    strengths,
    growthAreas,
    recommendations,
  };
}

