/**
 * DIMENSI 4 - PHYSICAL HEALTH & VITALITY
 * Assessment Data and Scoring Algorithm
 */

export interface PhysicalHealthAssessmentItem {
  id: string;
  text: string;
  type: 'likert' | 'frequency' | 'duration';
  options: Array<{ value: number; label: string; score: number }>;
  category: string;
  weight: number;
  psychometrics: {
    alpha: number;
    factorLoading: number;
    itemTotalR: number;
  };
}

export interface PhysicalHealthAssessmentResponse {
  [key: string]: number;
}

export interface PhysicalHealthAssessmentResult {
  compositeScore: number;
  componentScores: {
    physicalActivity: number;
    sleepQuality: number;
    nutrition: number;
    vitality: number;
    hydration: number;
    stressManagement: number;
    preventiveCare: number;
    bodyAwareness: number;
  };
  healthProfile: string;
  riskFactors: Array<{
    risk: string;
    severity: 'high' | 'moderate' | 'low';
    impact: string;
  }>;
  vitalityIndex: string;
  percentile: number;
  confidenceInterval: {
    lower: number;
    upper: number;
  };
}

export const PHYSICAL_HEALTH_ASSESSMENT_ITEMS: PhysicalHealthAssessmentItem[] = [
  {
    id: 'PHY_ACT1',
    text: 'Dalam 7 hari terakhir, berapa hari Anda melakukan aktivitas fisik sedang (seperti jalan cepat, bersepeda santai) minimal 30 menit?',
    type: 'frequency',
    options: [
      { value: 0, label: '0 hari', score: 0 },
      { value: 1, label: '1-2 hari', score: 25 },
      { value: 2, label: '3-4 hari', score: 50 },
      { value: 3, label: '5-6 hari', score: 75 },
      { value: 4, label: '7 hari', score: 100 }
    ],
    category: 'physicalActivity',
    weight: 1.3,
    psychometrics: {
      alpha: 0.84,
      factorLoading: 0.71,
      itemTotalR: 0.65
    }
  },
  {
    id: 'PHY_SLP1',
    text: 'Biasanya, berapa jam Anda tidur dalam semalam?',
    type: 'duration',
    options: [
      { value: 1, label: '< 5 jam', score: 0 },
      { value: 2, label: '5-6 jam', score: 25 },
      { value: 3, label: '6-7 jam', score: 50 },
      { value: 4, label: '7-8 jam', score: 100 },
      { value: 5, label: '> 8 jam', score: 75 }
    ],
    category: 'sleepQuality',
    weight: 1.4,
    psychometrics: {
      alpha: 0.84,
      factorLoading: 0.68,
      itemTotalR: 0.65
    }
  },
  {
    id: 'PHY_NUT1',
    text: 'Saya mengonsumsi minimal 3 porsi sayur dan 2 porsi buah setiap hari',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'nutrition',
    weight: 1.2,
    psychometrics: {
      alpha: 0.84,
      factorLoading: 0.65,
      itemTotalR: 0.61
    }
  },
  {
    id: 'PHY_VIT1',
    text: 'Saya merasa penuh energi dan bersemangat menjalani hari',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'vitality',
    weight: 1.1,
    psychometrics: {
      alpha: 0.84,
      factorLoading: 0.72,
      itemTotalR: 0.68
    }
  },
  {
    id: 'PHY_HYDR1',
    text: 'Saya minum minimal 2 liter air per hari',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'hydration',
    weight: 1.0,
    psychometrics: {
      alpha: 0.84,
      factorLoading: 0.65,
      itemTotalR: 0.58
    }
  },
  {
    id: 'PHY_STR1',
    text: 'Saya memiliki strategi efektif untuk mengelola stres fisik dan emosional (seperti olahraga, relaksasi, dll.)',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'stressManagement',
    weight: 1.3,
    psychometrics: {
      alpha: 0.84,
      factorLoading: 0.68,
      itemTotalR: 0.65
    }
  },
  {
    id: 'PHY_PREV1',
    text: 'Saya melakukan pemeriksaan kesehatan rutin dan menjaga vaksinasi terkini',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'preventiveCare',
    weight: 1.1,
    psychometrics: {
      alpha: 0.84,
      factorLoading: 0.62,
      itemTotalR: 0.58
    }
  },
  {
    id: 'PHY_BODY1',
    text: 'Saya memperhatikan sinyal tubuh saya (kelelahan, nyeri, ketidaknyamanan) dan merespons dengan tepat',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'bodyAwareness',
    weight: 1.0,
    psychometrics: {
      alpha: 0.84,
      factorLoading: 0.70,
      itemTotalR: 0.66
    }
  }
];

export const PHYSICAL_HEALTH_WEIGHTS = {
  physicalActivity: 1.3,
  sleepQuality: 1.4,
  nutrition: 1.2,
  vitality: 1.1,
  hydration: 1.0,
  stressManagement: 1.3,
  preventiveCare: 1.1,
  bodyAwareness: 1.0
};

export const PHYSICAL_HEALTH_NORMS = {
  general: {
    mean: 57.5,
    sd: 14.8,
    n: 2000,
    distribution: 'normal'
  },
  byFaculty: {
    healthSports: { mean: 62.3, sd: 13.5 },
    STEM: { mean: 57.8, sd: 14.2 },
    socialSciences: { mean: 53.4, sd: 15.8 }
  },
  byGender: {
    male: { mean: 56.2, sd: 15.1 },
    female: { mean: 58.8, sd: 14.5 }
  }
};

export const PHYSICAL_HEALTH_INTERPRETATION = {
  levels: [
    { range: '80-100', label: 'Optimal', description: 'Kesehatan fisik optimal' },
    { range: '65-79', label: 'Good', description: 'Kesehatan fisik baik' },
    { range: '50-64', label: 'Adequate', description: 'Kesehatan fisik memadai' },
    { range: '35-49', label: 'Needs Improvement', description: 'Kesehatan fisik perlu perbaikan' },
    { range: '0-34', label: 'Needs Intervention', description: 'Perlu perhatian serius' }
  ],
  profiles: {
    activeHealthy: 'Aktif dan Sehat - Kuat dalam aktivitas fisik dan nutrisi',
    wellRested: 'Istirahat Cukup - Kuat dalam kualitas tidur dan energi',
    balancedHealth: 'Kesehatan Seimbang - Seimbang di semua area kesehatan',
    developingHealth: 'Kesehatan Berkembang - Sedang mengembangkan kebiasaan sehat'
  }
};

/**
 * Calculate physical health assessment score
 */
export function calculatePhysicalHealthScore(
  responses: PhysicalHealthAssessmentResponse,
  userContext?: { faculty?: string; gender?: string }
): PhysicalHealthAssessmentResult {
  // Calculate component scores
  const componentScores: any = {};
  
  for (const item of PHYSICAL_HEALTH_ASSESSMENT_ITEMS) {
    const response = responses[item.id] || 3;
    const score = item.options.find(opt => opt.value === response)?.score || 50;
    componentScores[item.category] = score;
  }
  
  // Calculate weighted composite score
  let weightedSum = 0;
  let totalWeight = 0;
  
  for (const [component, weight] of Object.entries(PHYSICAL_HEALTH_WEIGHTS)) {
    weightedSum += componentScores[component] * weight;
    totalWeight += weight;
  }
  
  const compositeRaw = weightedSum / totalWeight;
  
  // Adjust for context
  let adjustedScore = compositeRaw;
  if (userContext?.faculty) {
    const facultyNorm = PHYSICAL_HEALTH_NORMS.byFaculty[userContext.faculty as keyof typeof PHYSICAL_HEALTH_NORMS.byFaculty];
    if (facultyNorm) {
      adjustedScore = compositeRaw + (facultyNorm.mean - PHYSICAL_HEALTH_NORMS.general.mean);
    }
  }
  
  // Determine health profile
  const sortedComponents = Object.entries(componentScores as Record<string, number>).sort((a, b) => b[1] - a[1]);
  const topComponents = sortedComponents.slice(0, 2).map(([comp]) => comp);
  
  let healthProfile = 'developingHealth';
  if (adjustedScore >= 70) {
    healthProfile = 'balancedHealth';
  } else if (topComponents.includes('physicalActivity') && topComponents.includes('nutrition')) {
    healthProfile = 'activeHealthy';
  } else if (topComponents.includes('sleepQuality') && topComponents.includes('vitality')) {
    healthProfile = 'wellRested';
  }
  
  // Identify risk factors
  const riskFactors = identifyHealthRisks(componentScores);
  
  // Calculate vitality index
  const vitalityIndex = calculateVitalityIndex(componentScores);
  
  // Calculate percentile
  const percentile = calculatePercentile(adjustedScore, PHYSICAL_HEALTH_NORMS.general);
  
  // Calculate confidence interval
  const standardError = 3.8;
  const confidenceInterval = {
    lower: Math.round(adjustedScore - 1.96 * standardError),
    upper: Math.round(adjustedScore + 1.96 * standardError)
  };
  
  return {
    compositeScore: Math.round(Math.min(100, Math.max(0, adjustedScore))),
    componentScores,
    healthProfile,
    riskFactors,
    vitalityIndex,
    percentile,
    confidenceInterval
  };
}

function identifyHealthRisks(scores: any): Array<{ risk: string; severity: 'high' | 'moderate' | 'low'; impact: string }> {
  const risks: Array<{ risk: string; severity: 'high' | 'moderate' | 'low'; impact: string }> = [];
  
  // Low physical activity
  if (scores.physicalActivity < 50) {
    risks.push({
      risk: 'inactive_lifestyle',
      severity: scores.physicalActivity < 25 ? 'high' : 'moderate',
      impact: 'Increased risk of chronic diseases and low energy'
    });
  }
  
  // Insufficient sleep
  if (scores.sleepQuality < 50) {
    risks.push({
      risk: 'insufficient_sleep',
      severity: scores.sleepQuality < 25 ? 'high' : 'moderate',
      impact: 'Impaired cognition, mood, and immune function'
    });
  }
  
  // Poor nutrition
  if (scores.nutrition < 50) {
    risks.push({
      risk: 'poor_nutrition',
      severity: 'moderate',
      impact: 'Deficiency in essential nutrients and suboptimal energy'
    });
  }
  
  // Poor hydration
  if (scores.hydration < 50) {
    risks.push({
      risk: 'dehydration',
      severity: 'moderate',
      impact: 'Impaired cognitive and physical function'
    });
  }
  
  return risks;
}

function calculateVitalityIndex(scores: any): string {
  const keyComponents = ['physicalActivity', 'sleepQuality', 'nutrition', 'vitality'];
  const vitalityScore = keyComponents.reduce((sum, comp) => sum + (scores[comp] || 0), 0) / keyComponents.length;
  
  if (vitalityScore >= 80) return 'high_vitality';
  if (vitalityScore >= 65) return 'good_vitality';
  if (vitalityScore >= 50) return 'moderate_vitality';
  if (vitalityScore >= 35) return 'low_vitality';
  return 'very_low_vitality';
}

function calculatePercentile(score: number, norm: { mean: number; sd: number }): number {
  const zScore = (score - norm.mean) / norm.sd;
  const percentile = 50 * (1 + Math.tanh(zScore * 0.7));
  return Math.round(Math.min(99, Math.max(1, percentile)));
}
