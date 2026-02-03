/**
 * Holistic Assessment Scoring Engine
 * 
 * Implements scoring algorithms for all 9 dimensions based on research data
 * from ASSESSMENT BROU folder with IRT-based adjustments
 */

import { DimensionData, AssessmentItem, Subdimension, ScoringConfig } from '@/data/dimensions/types';

// ============================================================================
// SCORING ENGINE TYPES
// ============================================================================

export interface ScoringResult {
  compositeScore: number;
  subdimensionScores: Record<string, number>;
  percentile: number;
  level: string;
  confidenceInterval: {
    lower: number;
    upper: number;
  };
  reliabilityIndex: number;
}

export interface FeedbackResult {
  strengths: string[];
  growthAreas: string[];
  recommendations: string[];
  developmentPath: string[];
}

export interface AssessmentResponse {
  dimensionId: number;
  dimensionSlug: string;
  scoring: ScoringResult;
  feedback: FeedbackResult;
  timestamp: string;
}

// ============================================================================
// DIMENSION 1: COGNITIVE & INTELLECTUAL DEVELOPMENT
// ============================================================================

export const COGNITIVE_WEIGHTS = {
  critical_thinking: 1.2,
  growth_mindset: 1.0,
  creativity: 1.1,
  metacognition: 1.3
};

export function calculateCognitiveScore(
  responses: Record<string, number>,
  userContext?: any
): ScoringResult {
  // Calculate subdimension scores
  const subdimensionScores: Record<string, number> = {
    critical_thinking: calculateSubscore(['COG_CT1', 'COG_CT2'], responses),
    growth_mindset: calculateSubscore(['COG_GM1', 'COG_GM2'], responses),
    creativity: calculateSubscore(['COG_CRE1', 'COG_CRE2'], responses),
    metacognition: calculateSubscore(['COG_MET1', 'COG_MET2'], responses)
  };

  // Calculate weighted composite score
  const weightedSum = Object.entries(subdimensionScores).reduce((sum, [dim, score]) => {
    return sum + score * (COGNITIVE_WEIGHTS[dim as keyof typeof COGNITIVE_WEIGHTS] || 1);
  }, 0);
  
  const totalWeight = Object.values(COGNITIVE_WEIGHTS).reduce((sum, w) => sum + w, 0);
  const compositeRaw = weightedSum / totalWeight;

  // Apply IRT-based adjustment
  const theta = estimateTheta(responses);
  const se = calculateStandardError(theta);
  const adjustedScore = applyIRTAdjustment(compositeRaw, theta, se);

  // Calculate percentile based on Indonesian norms
  const percentile = calculatePercentile(adjustedScore, 62.3, 11.5);

  // Determine level
  const level = determineCognitiveLevel(adjustedScore);

  // Calculate reliability index
  const reliabilityIndex = calculateReliabilityIndex(responses, 0.87);

  return {
    compositeScore: Math.round(Math.min(100, Math.max(0, adjustedScore)) * 10) / 10,
    subdimensionScores,
    percentile,
    level,
    confidenceInterval: {
      lower: Math.round((adjustedScore - 1.96 * 3.2) * 10) / 10,
      upper: Math.round((adjustedScore + 1.96 * 3.2) * 10) / 10
    },
    reliabilityIndex
  };
}

function determineCognitiveLevel(score: number): string {
  if (score >= 85) return 'EXPERT';
  if (score >= 70) return 'ADVANCED';
  if (score >= 55) return 'COMPETENT';
  if (score >= 40) return 'DEVELOPING';
  return 'BEGINNER';
}

// ============================================================================
// DIMENSION 2: SELF-MANAGEMENT & PRODUCTIVITY
// ============================================================================

export const SELF_MANAGEMENT_WEIGHTS = {
  time_management: 1.3,
  procrastination: 1.4,
  self_control: 1.2,
  deep_work: 1.4,
  energy_management: 1.1,
  prioritization: 1.3
};

export function calculateSelfManagementScore(
  responses: Record<string, number>,
  userContext?: any
): ScoringResult {
  const subdimensionScores: Record<string, number> = {
    time_management: calculateSubscore(['SM_TM1', 'SM_TM2'], responses),
    procrastination: calculateReverseSubscore(['SM_PROC1'], responses),
    self_control: calculateSubscore(['SM_SC1', 'SM_SC2'], responses),
    deep_work: calculateSubscore(['SM_DW1'], responses),
    energy_management: calculateSubscore(['SM_EM1'], responses),
    prioritization: calculateSubscore(['SM_PRIOR1'], responses)
  };

  const weightedSum = Object.entries(subdimensionScores).reduce((sum, [dim, score]) => {
    return sum + score * (SELF_MANAGEMENT_WEIGHTS[dim as keyof typeof SELF_MANAGEMENT_WEIGHTS] || 1);
  }, 0);
  
  const totalWeight = Object.values(SELF_MANAGEMENT_WEIGHTS).reduce((sum, w) => sum + w, 0);
  const compositeRaw = weightedSum / totalWeight;

  const theta = estimateTheta(responses);
  const se = calculateStandardError(theta);
  const adjustedScore = applyIRTAdjustment(compositeRaw, theta, se);

  const percentile = calculatePercentile(adjustedScore, 58.0, 12.4);
  const level = determineSelfManagementLevel(adjustedScore);
  const reliabilityIndex = calculateReliabilityIndex(responses, 0.87);

  return {
    compositeScore: Math.round(Math.min(100, Math.max(0, adjustedScore)) * 10) / 10,
    subdimensionScores,
    percentile,
    level,
    confidenceInterval: {
      lower: Math.round((adjustedScore - 1.96 * 3.5) * 10) / 10,
      upper: Math.round((adjustedScore + 1.96 * 3.5) * 10) / 10
    },
    reliabilityIndex
  };
}

function determineSelfManagementLevel(score: number): string {
  if (score >= 85) return 'MASTER';
  if (score >= 70) return 'ADVANCED';
  if (score >= 55) return 'COMPETENT';
  if (score >= 40) return 'DEVELOPING';
  return 'BEGINNER';
}

// ============================================================================
// DIMENSION 3: FINANCIAL INTELLIGENCE
// ============================================================================

export const FINANCIAL_WEIGHTS = {
  knowledge: 0.4,
  behavior: 0.5,
  self_efficacy: 0.1
};

export function calculateFinancialScore(
  responses: Record<string, number>,
  userContext?: any
): ScoringResult {
  // Knowledge items (multiple choice - 0 or 1)
  const knowledgeItems = ['FIN_KNOW1', 'FIN_KNOW2', 'FIN_KNOW3'];
  const knowledgeCorrect = knowledgeItems.filter(item => responses[item] === 1).length;
  const knowledgeScore = (knowledgeCorrect / knowledgeItems.length) * 100;

  // Behavior items (Likert 1-5)
  const behaviorItems = ['FIN_BEH1', 'FIN_BEH2', 'FIN_BEH3'];
  const behaviorScore = calculateSubscore(behaviorItems, responses);

  // Self-efficacy items (Likert 1-5)
  const efficacyItems = ['FIN_EFF1', 'FIN_EFF2'];
  const efficacyScore = calculateSubscore(efficacyItems, responses);

  const subdimensionScores: Record<string, number> = {
    knowledge: knowledgeScore,
    behavior: behaviorScore,
    self_efficacy: efficacyScore
  };

  const weightedSum = 
    knowledgeScore * FINANCIAL_WEIGHTS.knowledge +
    behaviorScore * FINANCIAL_WEIGHTS.behavior +
    efficacyScore * FINANCIAL_WEIGHTS.self_efficacy;

  const adjustedScore = applyContextualAdjustments(weightedSum, userContext);

  const percentile = calculatePercentile(adjustedScore, 56.5, 16.2);
  const level = determineFinancialLevel(adjustedScore);
  const reliabilityIndex = calculateReliabilityIndex(responses, 0.85);

  return {
    compositeScore: Math.round(Math.min(100, Math.max(0, adjustedScore)) * 10) / 10,
    subdimensionScores,
    percentile,
    level,
    confidenceInterval: {
      lower: Math.round((adjustedScore - 1.96 * 4.2) * 10) / 10,
      upper: Math.round((adjustedScore + 1.96 * 4.2) * 10) / 10
    },
    reliabilityIndex
  };
}

function determineFinancialLevel(score: number): string {
  if (score >= 75) return 'ADVANCED';
  if (score >= 60) return 'PROFICIENT';
  if (score >= 45) return 'BASIC';
  if (score >= 30) return 'LIMITED';
  return 'VERY_LIMITED';
}

// ============================================================================
// DIMENSION 4: PHYSICAL HEALTH & VITALITY
// ============================================================================

export const PHYSICAL_WEIGHTS = {
  physical_activity: 1.3,
  sleep_quality: 1.4,
  nutrition: 1.2,
  vitality: 1.1,
  hydration: 1.0,
  stress_management: 1.3,
  preventive_care: 1.1,
  body_awareness: 1.2
};

export function calculatePhysicalScore(
  responses: Record<string, number>,
  userContext?: any
): ScoringResult {
  const subdimensionScores: Record<string, number> = {
    physical_activity: mapFrequencyToScore(responses['PHY_ACT1'] || 0),
    sleep_quality: mapSleepToScore(responses['PHY_SLP1'] || 3),
    nutrition: calculateSubscore(['PHY_NUT1'], responses),
    vitality: calculateSubscore(['PHY_VIT1'], responses),
    hydration: calculateSubscore(['PHY_HYDR1'], responses),
    stress_management: calculateSubscore(['PHY_STR1'], responses),
    preventive_care: calculateSubscore(['PHY_PREV1'], responses),
    body_awareness: calculateSubscore(['PHY_BODY1'], responses)
  };

  const weightedSum = Object.entries(subdimensionScores).reduce((sum, [dim, score]) => {
    return sum + score * (PHYSICAL_WEIGHTS[dim as keyof typeof PHYSICAL_WEIGHTS] || 1);
  }, 0);
  
  const totalWeight = Object.values(PHYSICAL_WEIGHTS).reduce((sum, w) => sum + w, 0);
  const compositeRaw = weightedSum / totalWeight;

  const theta = estimateTheta(responses);
  const se = calculateStandardError(theta);
  const adjustedScore = applyIRTAdjustment(compositeRaw, theta, se);

  const percentile = calculatePercentile(adjustedScore, 57.5, 14.0);
  const level = determinePhysicalLevel(adjustedScore);
  const reliabilityIndex = calculateReliabilityIndex(responses, 0.84);

  return {
    compositeScore: Math.round(Math.min(100, Math.max(0, adjustedScore)) * 10) / 10,
    subdimensionScores,
    percentile,
    level,
    confidenceInterval: {
      lower: Math.round((adjustedScore - 1.96 * 3.8) * 10) / 10,
      upper: Math.round((adjustedScore + 1.96 * 3.8) * 10) / 10
    },
    reliabilityIndex
  };
}

function determinePhysicalLevel(score: number): string {
  if (score >= 83) return 'EXCELLENT';
  if (score >= 66) return 'GOOD';
  if (score >= 54) return 'AVERAGE';
  if (score >= 44) return 'BELOW_AVERAGE';
  return 'NEEDS_IMPROVEMENT';
}

// ============================================================================
// DIMENSION 5: EMOTIONAL & SOCIAL INTELLIGENCE
// ============================================================================

export const EMOTIONAL_WEIGHTS = {
  self_awareness: 1.3,
  social_awareness: 1.4,
  self_management: 1.2,
  relationship_management: 1.3
};

export function calculateEmotionalScore(
  responses: Record<string, number>,
  userContext?: any
): ScoringResult {
  const subdimensionScores: Record<string, number> = {
    self_awareness: calculateSubscore(['EMO_SELF1'], responses),
    social_awareness: calculateSubscore(['EMO_EMP1', 'EMO_SAW1'], responses),
    self_management: calculateSubscore(['EMO_REG1', 'EMO_EXP1'], responses),
    relationship_management: calculateSubscore(['EMO_SOC1', 'EMO_ASS1', 'EMO_CON1'], responses)
  };

  const weightedSum = Object.entries(subdimensionScores).reduce((sum, [dim, score]) => {
    return sum + score * (EMOTIONAL_WEIGHTS[dim as keyof typeof EMOTIONAL_WEIGHTS] || 1);
  }, 0);
  
  const totalWeight = Object.values(EMOTIONAL_WEIGHTS).reduce((sum, w) => sum + w, 0);
  const compositeRaw = weightedSum / totalWeight;

  const theta = estimateTheta(responses);
  const se = calculateStandardError(theta);
  const adjustedScore = applyCulturalAdjustment(compositeRaw, userContext);

  const percentile = calculatePercentile(adjustedScore, 60.7, 14.5);
  const level = determineEmotionalLevel(adjustedScore);
  const reliabilityIndex = calculateReliabilityIndex(responses, 0.84);

  return {
    compositeScore: Math.round(Math.min(100, Math.max(0, adjustedScore)) * 10) / 10,
    subdimensionScores,
    percentile,
    level,
    confidenceInterval: {
      lower: Math.round((adjustedScore - 1.96 * 3.6) * 10) / 10,
      upper: Math.round((adjustedScore + 1.96 * 3.6) * 10) / 10
    },
    reliabilityIndex
  };
}

function determineEmotionalLevel(score: number): string {
  if (score >= 84) return 'EXCEPTIONAL';
  if (score >= 75) return 'ADVANCED';
  if (score >= 66) return 'PROFICIENT';
  if (score >= 55) return 'AVERAGE';
  if (score >= 45) return 'DEVELOPING';
  return 'LIMITED';
}

// ============================================================================
// DIMENSION 6: MENTAL HEALTH & PSYCHOLOGICAL
// ============================================================================

export const MENTAL_WEIGHTS = {
  well_being: 1.2,
  resilience: 1.3,
  stress_management: 1.4,
  mindfulness: 1.1,
  trauma_healing: 1.2,
  academic_stress_management: 1.3,
  coping_strategies: 1.1,
  help_seeking_behavior: 1.0
};

export function calculateMentalScore(
  responses: Record<string, number>,
  userContext?: any
): ScoringResult {
  const subdimensionScores: Record<string, number> = {
    well_being: calculateSubscore(['MH_WB1'], responses),
    resilience: calculateSubscore(['MH_RES1'], responses),
    stress_management: calculateReverseSubscore(['MH_STR1'], responses),
    mindfulness: calculateSubscore(['MH_MIND1'], responses),
    trauma_healing: calculateSubscore(['MH_TRA1'], responses),
    academic_stress_management: calculateReverseSubscore(['MH_ACAD1'], responses),
    coping_strategies: calculateSubscore(['MH_COP1'], responses),
    help_seeking_behavior: calculateSubscore(['MH_SEEK1'], responses)
  };

  const weightedSum = Object.entries(subdimensionScores).reduce((sum, [dim, score]) => {
    return sum + score * (MENTAL_WEIGHTS[dim as keyof typeof MENTAL_WEIGHTS] || 1);
  }, 0);
  
  const totalWeight = Object.values(MENTAL_WEIGHTS).reduce((sum, w) => sum + w, 0);
  const compositeRaw = weightedSum / totalWeight;

  const theta = estimateTheta(responses);
  const se = calculateStandardError(theta);
  const adjustedScore = applyIRTAdjustment(compositeRaw, theta, se);

  const percentile = calculatePercentile(adjustedScore, 57.1, 14.5);
  const level = determineMentalLevel(adjustedScore);
  const reliabilityIndex = calculateReliabilityIndex(responses, 0.86);

  return {
    compositeScore: Math.round(Math.min(100, Math.max(0, adjustedScore)) * 10) / 10,
    subdimensionScores,
    percentile,
    level,
    confidenceInterval: {
      lower: Math.round((adjustedScore - 1.96 * 3.6) * 10) / 10,
      upper: Math.round((adjustedScore + 1.96 * 3.6) * 10) / 10
    },
    reliabilityIndex
  };
}

function determineMentalLevel(score: number): string {
  if (score >= 85) return 'FLOURISHING';
  if (score >= 76) return 'GOOD_MENTAL_HEALTH';
  if (score >= 66) return 'MODERATE_MENTAL_HEALTH';
  if (score >= 54) return 'AVERAGE';
  if (score >= 44) return 'LANGUISHING';
  return 'STRUGGLING';
}

// ============================================================================
// DIMENSION 7: CHARACTER & ETHICS
// ============================================================================

export const CHARACTER_WEIGHTS = {
  integrity: 1.4,
  courage: 1.3,
  fairness: 1.2,
  responsibility: 1.2,
  humility: 1.1,
  compassion: 1.3,
  self_discipline: 1.2,
  ethical_reasoning: 1.4
};

export function calculateCharacterScore(
  responses: Record<string, number>,
  userContext?: any
): ScoringResult {
  const subdimensionScores: Record<string, number> = {
    integrity: calculateSubscore(['CHAR_INT1'], responses),
    courage: calculateSubscore(['CHAR_COU1'], responses),
    fairness: calculateSubscore(['CHAR_FAIR1'], responses),
    responsibility: calculateSubscore(['CHAR_RESP1'], responses),
    humility: calculateSubscore(['CHAR_HUM1'], responses),
    compassion: calculateSubscore(['CHAR_COMP1'], responses),
    self_discipline: calculateSubscore(['CHAR_DISC1'], responses),
    ethical_reasoning: calculateSubscore(['CHAR_ETH1'], responses)
  };

  const weightedSum = Object.entries(subdimensionScores).reduce((sum, [dim, score]) => {
    return sum + score * (CHARACTER_WEIGHTS[dim as keyof typeof CHARACTER_WEIGHTS] || 1);
  }, 0);
  
  const totalWeight = Object.values(CHARACTER_WEIGHTS).reduce((sum, w) => sum + w, 0);
  const compositeRaw = weightedSum / totalWeight;

  const adjustedScore = adjustForSocialDesirability(compositeRaw, responses);

  const percentile = calculatePercentile(adjustedScore, 65.0, 15.5);
  const level = determineCharacterLevel(adjustedScore);
  const reliabilityIndex = calculateReliabilityIndex(responses, 0.84);

  return {
    compositeScore: Math.round(Math.min(100, Math.max(0, adjustedScore)) * 10) / 10,
    subdimensionScores,
    percentile,
    level,
    confidenceInterval: {
      lower: Math.round((adjustedScore - 1.96 * 3.2) * 10) / 10,
      upper: Math.round((adjustedScore + 1.96 * 3.2) * 10) / 10
    },
    reliabilityIndex
  };
}

function determineCharacterLevel(score: number): string {
  if (score >= 84) return 'EXEMPLARY';
  if (score >= 76) return 'STRONG';
  if (score >= 67) return 'GOOD';
  if (score >= 56) return 'DEVELOPING';
  if (score >= 46) return 'BASIC';
  return 'EMERGING';
}

// ============================================================================
// DIMENSION 8: SPIRITUAL DEVELOPMENT
// ============================================================================

export const SPIRITUAL_WEIGHTS = {
  purpose_meaning: 1.4,
  gratitude_connection: 1.3,
  altruism_contribution: 1.2
};

export function calculateSpiritualScore(
  responses: Record<string, number>,
  userContext?: any
): ScoringResult {
  const subdimensionScores: Record<string, number> = {
    purpose_meaning: calculateSubscore(['SPI_PUR1', 'SPI_PUR2'], responses),
    gratitude_connection: calculateSubscore(['SPI_GRA1', 'SPI_GRA2', 'SPI_SWB1', 'SPI_SWB2'], responses),
    altruism_contribution: calculateSubscore(['SPI_ALT1', 'SPI_ALT2'], responses)
  };

  const weightedSum = Object.entries(subdimensionScores).reduce((sum, [dim, score]) => {
    return sum + score * (SPIRITUAL_WEIGHTS[dim as keyof typeof SPIRITUAL_WEIGHTS] || 1);
  }, 0);
  
  const totalWeight = Object.values(SPIRITUAL_WEIGHTS).reduce((sum, w) => sum + w, 0);
  const compositeRaw = weightedSum / totalWeight;

  const adjustedScore = userContext?.religion 
    ? adjustForReligiousContext(compositeRaw, userContext.religion)
    : compositeRaw;

  const percentile = calculatePercentile(adjustedScore, 58.5, 14.2);
  const level = determineSpiritualLevel(adjustedScore);
  const reliabilityIndex = calculateReliabilityIndex(responses, 0.85);

  return {
    compositeScore: Math.round(Math.min(100, Math.max(0, adjustedScore)) * 10) / 10,
    subdimensionScores,
    percentile,
    level,
    confidenceInterval: {
      lower: Math.round((adjustedScore - 1.96 * 3.7) * 10) / 10,
      upper: Math.round((adjustedScore + 1.96 * 3.7) * 10) / 10
    },
    reliabilityIndex
  };
}

function determineSpiritualLevel(score: number): string {
  if (score >= 84) return 'TRANSCENDENT';
  if (score >= 75) return 'INTEGRATED';
  if (score >= 66) return 'SEEKING';
  if (score >= 54) return 'QUESTIONING';
  if (score >= 44) return 'BELOW_AVERAGE';
  return 'UNEXPLORED';
}

// ============================================================================
// DIMENSION 9: ENVIRONMENTAL & LIFESTYLE MANAGEMENT
// ============================================================================

export const ENVIRONMENTAL_WEIGHTS = {
  environmental_awareness: 1.2,
  sustainable_behavior: 1.3,
  work_life_balance: 1.4,
  digital_wellbeing: 1.3,
  minimalism: 1.1,
  community_engagement: 1.0,
  environmental_advocacy: 1.1,
  carbon_footprint_awareness: 1.2
};

export function calculateEnvironmentalScore(
  responses: Record<string, number>,
  userContext?: any
): ScoringResult {
  const subdimensionScores: Record<string, number> = {
    environmental_awareness: calculateSubscore(['ENV_AWAR1'], responses),
    sustainable_behavior: calculateSubscore(['ENV_BEHAV1'], responses),
    work_life_balance: calculateSubscore(['ENV_WLB1'], responses),
    digital_wellbeing: calculateSubscore(['ENV_DIGI1'], responses),
    minimalism: calculateSubscore(['ENV_MIN1'], responses),
    community_engagement: calculateSubscore(['ENV_COMM1'], responses),
    environmental_advocacy: calculateSubscore(['ENV_ADV1'], responses),
    carbon_footprint_awareness: calculateSubscore(['ENV_CARBON1'], responses)
  };

  const weightedSum = Object.entries(subdimensionScores).reduce((sum, [dim, score]) => {
    return sum + score * (ENVIRONMENTAL_WEIGHTS[dim as keyof typeof ENVIRONMENTAL_WEIGHTS] || 1);
  }, 0);
  
  const totalWeight = Object.values(ENVIRONMENTAL_WEIGHTS).reduce((sum, w) => sum + w, 0);
  const compositeRaw = weightedSum / totalWeight;

  const adjustedScore = userContext 
    ? adjustForContext(compositeRaw, userContext)
    : compositeRaw;

  const percentile = calculatePercentile(adjustedScore, 55.1, 15.0);
  const level = determineEnvironmentalLevel(adjustedScore);
  const reliabilityIndex = calculateReliabilityIndex(responses, 0.83);

  return {
    compositeScore: Math.round(Math.min(100, Math.max(0, adjustedScore)) * 10) / 10,
    subdimensionScores,
    percentile,
    level,
    confidenceInterval: {
      lower: Math.round((adjustedScore - 1.96 * 4.0) * 10) / 10,
      upper: Math.round((adjustedScore + 1.96 * 4.0) * 10) / 10
    },
    reliabilityIndex
  };
}

function determineEnvironmentalLevel(score: number): string {
  if (score >= 80) return 'LEADER';
  if (score >= 60) return 'ADVANCED';
  if (score >= 45) return 'COMPETENT';
  if (score >= 30) return 'DEVELOPING';
  return 'BEGINNER';
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function calculateSubscore(items: string[], responses: Record<string, number>): number {
  const validResponses = items.map(item => responses[item] || 3);
  const average = validResponses.reduce((sum, val) => sum + val, 0) / validResponses.length;
  return ((average - 1) / 4) * 100; // Convert 1-5 to 0-100
}

function calculateReverseSubscore(items: string[], responses: Record<string, number>): number {
  const validResponses = items.map(item => responses[item] || 3);
  const average = validResponses.reduce((sum, val) => sum + val, 0) / validResponses.length;
  const reversed = 6 - average; // Reverse score
  return ((reversed - 1) / 4) * 100;
}

function mapFrequencyToScore(value: number): number {
  const mapping: Record<number, number> = {
    0: 0,
    1: 25,
    2: 50,
    3: 75,
    4: 100
  };
  return mapping[value] || 0;
}

function mapSleepToScore(value: number): number {
  const mapping: Record<number, number> = {
    1: 0,   // < 5 hours
    2: 25,  // 5-6 hours
    3: 50,  // 6-7 hours
    4: 100, // 7-8 hours
    5: 75   // > 8 hours
  };
  return mapping[value] || 50;
}

function estimateTheta(responses: Record<string, number>): number {
  // Simplified ML estimation for theta (ability level)
  const values = Object.values(responses);
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  return (mean - 3) / 2; // Map 1-5 to -1 to +1
}

function calculateStandardError(theta: number): number {
  // Simplified SEM calculation based on theta
  return 3.5 * (1 - Math.abs(theta) * 0.2);
}

function applyIRTAdjustment(score: number, theta: number, se: number): number {
  // Apply IRT-based adjustment
  const adjustment = theta * 5; // Small adjustment based on ability
  return score + adjustment;
}

function applyContextualAdjustments(score: number, context?: any): number {
  if (!context) return score;
  
  let adjusted = score;
  
  // Faculty adjustment
  if (context.faculty === 'Engineering') {
    adjusted += 2;
  } else if (context.faculty === 'Social Sciences') {
    adjusted -= 1;
  }
  
  // Year level adjustment
  if (context.yearLevel === 4) {
    adjusted += 3;
  } else if (context.yearLevel === 1) {
    adjusted -= 2;
  }
  
  return Math.min(100, Math.max(0, adjusted));
}

function applyCulturalAdjustment(score: number, context?: any): number {
  // Indonesian cultural adjustment for emotional intelligence
  if (!context) return score;
  
  // Collectivist culture adjustment
  const adjustment = context.gender === 'female' ? 2 : 0;
  return Math.min(100, Math.max(0, score + adjustment));
}

function adjustForSocialDesirability(score: number, responses: Record<string, number>): number {
  // Adjust for social desirability bias
  const avgResponse = Object.values(responses).reduce((sum, val) => sum + val, 0) / Object.keys(responses).length;
  
  if (avgResponse > 4.5) {
    // Likely social desirability bias
    return score * 0.95;
  }
  
  return score;
}

function adjustForReligiousContext(score: number, religion: string): number {
  // Adjust based on religious context
  const religiousAdjustments: Record<string, number> = {
    'Muslim': 0,
    'Christian': 1,
    'Hindu': 0,
    'Buddhist': 1,
    'Other': 0
  };
  
  return Math.min(100, Math.max(0, score + (religiousAdjustments[religion] || 0)));
}

function adjustForContext(score: number, context: any): number {
  if (!context) return score;
  
  let adjusted = score;
  
  // Faculty adjustment
  if (context.faculty === 'Environmental Studies') {
    adjusted += 5;
  } else if (context.faculty === 'STEM') {
    adjusted -= 2;
  }
  
  // Living situation adjustment
  if (context.livingSituation === 'dorm') {
    adjusted += 2;
  }
  
  return Math.min(100, Math.max(0, adjusted));
}

function calculatePercentile(score: number, mean: number, sd: number): number {
  // Calculate percentile using z-score
  const z = (score - mean) / sd;
  // Approximate percentile from z-score
  const percentile = 50 * (1 + Math.tanh(z * 0.7));
  return Math.round(Math.min(99, Math.max(1, percentile)));
}

function calculateReliabilityIndex(responses: Record<string, number>, alpha: number): number {
  // Calculate reliability index based on response consistency
  const values = Object.values(responses);
  const variance = calculateVariance(values);
  const consistency = 1 - (variance / 4); // Max variance for 1-5 scale is 4
  
  return Math.round((alpha * 0.7 + consistency * 0.3) * 100) / 100;
}

function calculateVariance(values: number[]): number {
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  return squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
}

// ============================================================================
// MASTER SCORING FUNCTION
// ============================================================================

export interface HolisticAssessmentInput {
  dimensionId: number;
  responses: Record<string, number>;
  userContext?: any;
}

export function scoreDimension(input: HolisticAssessmentInput): AssessmentResponse {
  const { dimensionId, responses, userContext } = input;
  
  let scoring: ScoringResult;
  let dimensionSlug: string;
  
  switch (dimensionId) {
    case 1:
      scoring = calculateCognitiveScore(responses, userContext);
      dimensionSlug = 'cognitive';
      break;
    case 2:
      scoring = calculateSelfManagementScore(responses, userContext);
      dimensionSlug = 'self-management';
      break;
    case 3:
      scoring = calculateFinancialScore(responses, userContext);
      dimensionSlug = 'financial';
      break;
    case 4:
      scoring = calculatePhysicalScore(responses, userContext);
      dimensionSlug = 'physical';
      break;
    case 5:
      scoring = calculateEmotionalScore(responses, userContext);
      dimensionSlug = 'emotional-social';
      break;
    case 6:
      scoring = calculateMentalScore(responses, userContext);
      dimensionSlug = 'mental-health';
      break;
    case 7:
      scoring = calculateCharacterScore(responses, userContext);
      dimensionSlug = 'character';
      break;
    case 8:
      scoring = calculateSpiritualScore(responses, userContext);
      dimensionSlug = 'spiritual';
      break;
    case 9:
      scoring = calculateEnvironmentalScore(responses, userContext);
      dimensionSlug = 'environmental';
      break;
    default:
      throw new Error(`Invalid dimension ID: ${dimensionId}`);
  }
  
  const feedback = generateFeedback(dimensionId, scoring, responses);
  
  return {
    dimensionId,
    dimensionSlug,
    scoring,
    feedback,
    timestamp: new Date().toISOString()
  };
}

// ============================================================================
// FEEDBACK GENERATOR
// ============================================================================

function generateFeedback(
  dimensionId: number,
  scoring: ScoringResult,
  responses: Record<string, number>
): FeedbackResult {
  const { subdimensionScores, compositeScore } = scoring;
  
  const strengths: string[] = [];
  const growthAreas: string[] = [];
  const recommendations: string[] = [];
  const developmentPath: string[] = [];
  
  // Identify strengths (score >= 70)
  Object.entries(subdimensionScores).forEach(([dim, score]) => {
    if (score >= 70) {
      strengths.push(getStrengthDescription(dimensionId, dim, score));
    } else if (score < 50) {
      growthAreas.push(getGrowthAreaDescription(dimensionId, dim, score));
      recommendations.push(getRecommendation(dimensionId, dim, score));
    }
  });
  
  // Generate development path
  developmentPath.push(...generateDevelopmentPath(dimensionId, compositeScore, subdimensionScores));
  
  return {
    strengths,
    growthAreas,
    recommendations,
    developmentPath
  };
}

function getStrengthDescription(dimensionId: number, subdimension: string, score: number): string {
  const strengthMap: Record<number, Record<string, string>> = {
    1: {
      critical_thinking: 'Kemampuan analisis dan evaluasi yang kuat',
      growth_mindset: 'Mindset berkembang yang mendukung pembelajaran',
      creativity: 'Kemampuan menghasilkan solusi inovatif',
      metacognition: 'Kesadaran dan regulasi proses berpikir yang baik'
    },
    2: {
      time_management: 'Kemampuan mengatur waktu dan jadwal',
      procrastination: 'Kontrol prokrastinasi yang baik',
      self_control: 'Disiplin diri dan kontrol impuls',
      deep_work: 'Kemampuan fokus dalam periode panjang',
      energy_management: 'Manajemen energi yang efektif',
      prioritization: 'Kemampuan memprioritaskan tugas'
    },
    3: {
      knowledge: 'Pengetahuan finansial yang kuat',
      behavior: 'Perilaku finansial yang positif',
      self_efficacy: 'Keyakinan dalam kemampuan finansial'
    },
    4: {
      physical_activity: 'Aktivitas fisik yang teratur',
      sleep_quality: 'Kualitas tidur yang baik',
      nutrition: 'Kebiasaan nutrisi yang sehat',
      vitality: 'Tingkat energi dan vitalitas yang tinggi',
      hydration: 'Kebiasaan hidrasi yang baik',
      stress_management: 'Manajemen stres fisik yang efektif',
      preventive_care: 'Perawatan preventif yang teratur',
      body_awareness: 'Kesadaran tubuh yang baik'
    },
    5: {
      self_awareness: 'Kesadaran emosional yang tinggi',
      social_awareness: 'Kesadaran sosial yang kuat',
      self_management: 'Regulasi emosi yang baik',
      relationship_management: 'Keterampilan hubungan yang kuat'
    },
    6: {
      well_being: 'Kesejahteraan emosional yang tinggi',
      resilience: 'Ketahanan mental yang kuat',
      stress_management: 'Manajemen stres yang efektif',
      mindfulness: 'Praktik mindfulness yang teratur',
      trauma_healing: 'Penyembuhan trauma yang baik',
      academic_stress_management: 'Manajemen stres akademik yang baik',
      coping_strategies: 'Strategi coping yang efektif',
      help_seeking_behavior: 'Kemauan mencari bantuan'
    },
    7: {
      integrity: 'Integritas moral yang kuat',
      courage: 'Keberanian moral yang tinggi',
      fairness: 'Rasa keadilan yang kuat',
      responsibility: 'Tanggung jawab yang tinggi',
      humility: 'Kerendahan hati',
      compassion: 'Kasih sayang dan empati',
      self_discipline: 'Disiplin diri yang kuat',
      ethical_reasoning: 'Penalaran etis yang matang'
    },
    8: {
      purpose_meaning: 'Tujuan hidup yang jelas',
      gratitude_connection: 'Rasa syukur yang kuat',
      altruism_contribution: 'Kontribusi altruistik yang aktif'
    },
    9: {
      environmental_awareness: 'Kesadaran lingkungan yang tinggi',
      sustainable_behavior: 'Perilaku berkelanjutan yang konsisten',
      work_life_balance: 'Keseimbangan kerja-hidup yang baik',
      digital_wellbeing: 'Kesejahteraan digital yang baik',
      minimalism: 'Gaya hidup minimalis',
      community_engagement: 'Keterlibatan komunitas yang aktif',
      environmental_advocacy: 'Advokasi lingkungan yang kuat',
      carbon_footprint_awareness: 'Kesadaran jejak karbon'
    }
  };
  
  return strengthMap[dimensionId]?.[subdimension] || `${subdimension} yang kuat`;
}

function getGrowthAreaDescription(dimensionId: number, subdimension: string, score: number): string {
  const growthMap: Record<number, Record<string, string>> = {
    1: {
      critical_thinking: 'Perlu pengembangan berpikir kritis',
      growth_mindset: 'Perlu mengembangkan growth mindset',
      creativity: 'Perlu melatih berpikir kreatif',
      metacognition: 'Perlu meningkatkan kesadaran metakognitif'
    },
    2: {
      time_management: 'Perlu meningkatkan manajemen waktu',
      procrastination: 'Perlu mengurangi prokrastinasi',
      self_control: 'Perlu meningkatkan kontrol diri',
      deep_work: 'Perlu melatih kemampuan fokus',
      energy_management: 'Perlu mengatur energi lebih baik',
      prioritization: 'Perlu belajar memprioritaskan'
    },
    3: {
      knowledge: 'Perlu meningkatkan literasi finansial',
      behavior: 'Perlu memperbaiki perilaku finansial',
      self_efficacy: 'Perlu meningkatkan keyakinan finansial'
    },
    4: {
      physical_activity: 'Perlu meningkatkan aktivitas fisik',
      sleep_quality: 'Perlu memperbaiki kualitas tidur',
      nutrition: 'Perlu memperbaiki pola makan',
      vitality: 'Perlu meningkatkan vitalitas',
      hydration: 'Perlu meningkatkan hidrasi',
      stress_management: 'Perlu belajar manajemen stres',
      preventive_care: 'Perlu melakukan perawatan preventif',
      body_awareness: 'Perlu meningkatkan kesadaran tubuh'
    },
    5: {
      self_awareness: 'Perlu mengembangkan kesadaran diri',
      social_awareness: 'Perlu meningkatkan kesadaran sosial',
      self_management: 'Perlu mengembangkan regulasi emosi',
      relationship_management: 'Perlu meningkatkan keterampilan sosial'
    },
    6: {
      well_being: 'Perlu meningkatkan kesejahteraan',
      resilience: 'Perlu mengembangkan ketahanan',
      stress_management: 'Perlu belajar manajemen stres',
      mindfulness: 'Perlu mempraktikkan mindfulness',
      trauma_healing: 'Perlu proses penyembuhan trauma',
      academic_stress_management: 'Perlu mengelola stres akademik',
      coping_strategies: 'Perlu mengembangkan strategi coping',
      help_seeking_behavior: 'Perlu lebih terbuka mencari bantuan'
    },
    7: {
      integrity: 'Perlu mengembangkan integritas',
      courage: 'Perlu mengembangkan keberanian moral',
      fairness: 'Perlu meningkatkan rasa keadilan',
      responsibility: 'Perlu meningkatkan tanggung jawab',
      humility: 'Perlu mengembangkan kerendahan hati',
      compassion: 'Perlu meningkatkan empati',
      self_discipline: 'Perlu meningkatkan disiplin diri',
      ethical_reasoning: 'Perlu mengembangkan penalaran etis'
    },
    8: {
      purpose_meaning: 'Perlu mencari tujuan hidup',
      gratitude_connection: 'Perlu mengembangkan rasa syukur',
      altruism_contribution: 'Perlu meningkatkan kontribusi'
    },
    9: {
      environmental_awareness: 'Perlu meningkatkan kesadaran lingkungan',
      sustainable_behavior: 'Perlu mengadopsi perilaku berkelanjutan',
      work_life_balance: 'Perlu mencapai keseimbangan kerja-hidup',
      digital_wellbeing: 'Perlu mengelola penggunaan digital',
      minimalism: 'Perlu mengadopsi gaya hidup minimalis',
      community_engagement: 'Perlu meningkatkan keterlibatan komunitas',
      environmental_advocacy: 'Perlu mengembangkan advokasi lingkungan',
      carbon_footprint_awareness: 'Perlu memahami jejak karbon'
    }
  };
  
  return growthMap[dimensionId]?.[subdimension] || `${subdimension} perlu pengembangan`;
}

function getRecommendation(dimensionId: number, subdimension: string, score: number): string {
  const recommendationMap: Record<number, Record<string, string>> = {
    1: {
      critical_thinking: 'Ikuti workshop "Critical Thinking for Engineers" di Coursera',
      growth_mindset: 'Baca buku "Mindset: The New Psychology of Success" oleh Carol Dweck',
      creativity: 'Ikuti kelas "Design Thinking" di ITS',
      metacognition: 'Praktikkan jurnal refleksi setelah setiap pembelajaran'
    },
    2: {
      time_management: 'Gunakan teknik Pomodoro untuk manajemen waktu',
      procrastination: 'Terapkan "2-Minute Rule" untuk mengatasi prokrastinasi',
      self_control: 'Praktikkan mindfulness untuk meningkatkan kontrol diri',
      deep_work: 'Buat jadwal "Deep Work Sessions" 2-3 jam per hari',
      energy_management: 'Identifikasi jam produktif Anda dan sesuaikan jadwal',
      prioritization: 'Gunakan Matriks Eisenhower untuk memprioritaskan tugas'
    },
    3: {
      knowledge: 'Ikuti kursus "Financial Literacy for Students" di OJK',
      behavior: 'Gunakan aplikasi pencatat keuangan seperti Money Lover',
      self_efficacy: 'Mulai dengan investasi kecil untuk membangun kepercayaan diri'
    },
    4: {
      physical_activity: 'Targetkan 150 menit aktivitas fisik sedang per minggu',
      sleep_quality: 'Tidur 7-8 jam per malam pada waktu yang konsisten',
      nutrition: 'Konsumsi minimal 3 porsi sayur dan 2 porsi buah per hari',
      vitality: 'Praktikkan teknik pernapasan untuk meningkatkan energi',
      hydration: 'Minum minimal 2 liter air per hari',
      stress_management: 'Praktikkan yoga atau meditasi 10-15 menit per hari',
      preventive_care: 'Lakukan check-up kesehatan tahunan',
      body_awareness: 'Praktikkan body scan meditation'
    },
    5: {
      self_awareness: 'Praktikkan jurnal emosi setiap hari',
      social_awareness: 'Latih empati dengan mendengarkan aktif',
      self_management: 'Gunakan teknik "STOP" untuk regulasi emosi',
      relationship_management: 'Ikuti workshop "Effective Communication" di ITS'
    },
    6: {
      well_being: 'Praktikkan gratitude journaling setiap pagi',
      resilience: 'Baca buku "Resilience: Hard-Won Wisdom for Living"',
      stress_management: 'Gunakan aplikasi meditasi seperti Headspace',
      mindfulness: 'Praktikkan mindful breathing 5 menit, 3x sehari',
      trauma_healing: 'Konsultasi dengan konselor kampus jika diperlukan',
      academic_stress_management: 'Gunakan teknik time-blocking untuk tugas akademik',
      coping_strategies: 'Identifikasi 3 strategi coping yang efektif untuk Anda',
      help_seeking_behavior: 'Hubungi Pusat Konseling ITS jika membutuhkan dukungan'
    },
    7: {
      integrity: 'Praktikkan kejujuran dalam situasi kecil sehari-hari',
      courage: 'Berani menyampaikan pendapat dalam diskusi kelas',
      fairness: 'Praktikkan keadilan dalam kerja kelompok',
      responsibility: 'Tepati semua komitmen yang Anda buat',
      humility: 'Terima kritik dengan terbuka dan gunakan untuk belajar',
      compassion: 'Lakukan satu tindakan kebaikan setiap hari',
      self_discipline: 'Gunakan aplikasi habit tracker untuk membangun disiplin',
      ethical_reasoning: 'Diskusikan dilema etika dengan mentor atau dosen'
    },
    8: {
      purpose_meaning: 'Tulis "Personal Mission Statement" Anda',
      gratitude_connection: 'Tulis 3 hal yang Anda syukuri setiap malam',
      altruism_contribution: 'Ikuti kegiatan bakti sosial atau volunteer'
    },
    9: {
      environmental_awareness: 'Ikuti seminar lingkungan di ITS',
      sustainable_behavior: 'Bawa tumbler dan tas belanja sendiri',
      work_life_balance: 'Tetapkan batas waktu untuk kerja/studi',
      digital_wellbeing: 'Gunakan fitur "Screen Time" dan batasi penggunaan',
      minimalism: 'Donasi barang yang tidak digunakan',
      community_engagement: 'Ikuti kegiatan komunitas lokal',
      environmental_advocacy: 'Share tips lingkungan di media sosial',
      carbon_footprint_awareness: 'Gunakan kalkulator jejak karbon online'
    }
  };
  
  return recommendationMap[dimensionId]?.[subdimension] || 'Konsultasi dengan mentor atau dosen';
}

function generateDevelopmentPath(
  dimensionId: number,
  compositeScore: number,
  subdimensionScores: Record<string, number>
): string[] {
  const path: string[] = [];
  
  if (compositeScore < 50) {
    path.push('Fase 1: Foundation Building - Fokus pada pemahaman dasar');
    path.push('Fase 2: Skill Development - Latih keterampilan inti');
    path.push('Fase 3: Practice Application - Terapkan dalam konteks nyata');
    path.push('Fase 4: Mastery - Refine dan advance');
  } else if (compositeScore < 70) {
    path.push('Fase 1: Skill Enhancement - Perkuat keterampilan yang ada');
    path.push('Fase 2: Advanced Practice - Latih pada level yang lebih tinggi');
    path.push('Fase 3: Integration - Integrasikan dengan dimensi lain');
    path.push('Fase 4: Excellence - Capai level expert');
  } else {
    path.push('Fase 1: Advanced Mastery - Kuasai konsep lanjutan');
    path.push('Fase 2: Innovation - Kembangkan pendekatan baru');
    path.push('Fase 3: Leadership - Bagikan pengetahuan dengan orang lain');
    path.push('Fase 4: Legacy - Buat kontribusi berkelanjutan');
  }
  
  return path;
}

// ============================================================================
// EXPORT ALL FUNCTIONS
// ============================================================================

export {
  calculateCognitiveScore,
  calculateSelfManagementScore,
  calculateFinancialScore,
  calculatePhysicalScore,
  calculateEmotionalScore,
  calculateMentalScore,
  calculateCharacterScore,
  calculateSpiritualScore,
  calculateEnvironmentalScore,
  scoreDimension
};
