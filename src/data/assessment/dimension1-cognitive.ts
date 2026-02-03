/**
 * DIMENSI 1 - COGNITIVE & INTELLECTUAL DEVELOPMENT
 * Assessment Data and Scoring Algorithm
 */

export interface CognitiveAssessmentItem {
  id: string;
  text: string;
  type: 'likert' | 'frequency';
  options: Array<{ value: number; label: string; score: number }>;
  category: string;
  weight: number;
  psychometrics: {
    alpha: number;
    factorLoading: number;
    itemTotalR: number;
  };
}

export interface CognitiveAssessmentResponse {
  [key: string]: number;
}

export interface CognitiveAssessmentResult {
  compositeScore: number;
  componentScores: {
    criticalThinking: number;
    problemSolving: number;
    learningAgility: number;
    knowledgeApplication: number;
    creativity: number;
    informationLiteracy: number;
    metacognition: number;
    intellectualCuriosity: number;
  };
  cognitiveProfile: string;
  developmentPriorities: Array<{
    component: string;
    score: number;
    priority: 'high' | 'medium' | 'low';
    description: string;
    impact: string;
  }>;
  percentile: number;
  confidenceInterval: {
    lower: number;
    upper: number;
  };
}

export const COGNITIVE_ASSESSMENT_ITEMS: CognitiveAssessmentItem[] = [
  {
    id: 'COG_CT1',
    text: 'Saya dapat menganalisis informasi secara kritis sebelum membuat keputusan',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'criticalThinking',
    weight: 1.3,
    psychometrics: {
      alpha: 0.87,
      factorLoading: 0.74,
      itemTotalR: 0.70
    }
  },
  {
    id: 'COG_PS1',
    text: 'Saya dapat menemukan solusi kreatif untuk masalah yang kompleks',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'problemSolving',
    weight: 1.4,
    psychometrics: {
      alpha: 0.87,
      factorLoading: 0.76,
      itemTotalR: 0.72
    }
  },
  {
    id: 'COG_LA1',
    text: 'Saya dapat mempelajari hal baru dengan cepat dan efektif',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'learningAgility',
    weight: 1.3,
    psychometrics: {
      alpha: 0.87,
      factorLoading: 0.72,
      itemTotalR: 0.68
    }
  },
  {
    id: 'COG_KA1',
    text: 'Saya dapat menerapkan pengetahuan yang saya pelajari dalam situasi nyata',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'knowledgeApplication',
    weight: 1.2,
    psychometrics: {
      alpha: 0.87,
      factorLoading: 0.70,
      itemTotalR: 0.66
    }
  },
  {
    id: 'COG_CR1',
    text: 'Saya sering memiliki ide-ide kreatif dan inovatif',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'creativity',
    weight: 1.1,
    psychometrics: {
      alpha: 0.87,
      factorLoading: 0.68,
      itemTotalR: 0.64
    }
  },
  {
    id: 'COG_IL1',
    text: 'Saya dapat mengevaluasi kredibilitas sumber informasi secara akurat',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'informationLiteracy',
    weight: 1.1,
    psychometrics: {
      alpha: 0.87,
      factorLoading: 0.66,
      itemTotalR: 0.62
    }
  },
  {
    id: 'COG_MC1',
    text: 'Saya menyadari bagaimana saya belajar dan dapat menyesuaikan strategi belajar saya',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'metacognition',
    weight: 1.2,
    psychometrics: {
      alpha: 0.87,
      factorLoading: 0.70,
      itemTotalR: 0.66
    }
  },
  {
    id: 'COG_IC1',
    text: 'Saya memiliki rasa ingin tahu yang kuat dan suka mempelajari hal baru',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'intellectualCuriosity',
    weight: 1.0,
    psychometrics: {
      alpha: 0.87,
      factorLoading: 0.65,
      itemTotalR: 0.61
    }
  }
];

export const COGNITIVE_WEIGHTS = {
  criticalThinking: 1.3,
  problemSolving: 1.4,
  learningAgility: 1.3,
  knowledgeApplication: 1.2,
  creativity: 1.1,
  informationLiteracy: 1.1,
  metacognition: 1.2,
  intellectualCuriosity: 1.0
};

export const COGNITIVE_NORMS = {
  general: {
    mean: 58.5,
    sd: 14.8,
    n: 2000,
    distribution: 'normal'
  },
  byFaculty: {
    STEM: { mean: 61.2, sd: 13.5 },
    socialSciences: { mean: 57.8, sd: 14.2 },
    humanities: { mean: 56.5, sd: 15.1 }
  },
  byYear: {
    year1: { mean: 55.3, sd: 15.2 },
    year2: { mean: 58.7, sd: 14.5 },
    year3: { mean: 60.2, sd: 14.1 },
    year4: { mean: 61.8, sd: 13.8 }
  }
};

export const COGNITIVE_INTERPRETATION = {
  levels: [
    { range: '80-100', label: 'Exceptional Cognitive', description: 'Kemampuan kognitif luar biasa' },
    { range: '70-79', label: 'Advanced Cognitive', description: 'Kemampuan kognitif sangat baik' },
    { range: '60-69', label: 'Proficient Cognitive', description: 'Kemampuan kognitif baik' },
    { range: '50-59', label: 'Developing Cognitive', description: 'Kemampuan kognitif sedang berkembang' },
    { range: '40-49', label: 'Emerging Cognitive', description: 'Kemampuan kognitif mulai berkembang' },
    { range: '0-39', label: 'Needs Development', description: 'Perlu pengembangan kognitif' }
  ],
  profiles: {
    analyticalThinker: 'Pemikir Analitis - Kuat dalam analisis dan pemecahan masalah',
    creativeInnovator: 'Inovator Kreatif - Kuat dalam kreativitas dan inovasi',
    strategicLearner: 'Pembelajar Strategis - Kuat dalam metakognisi dan pembelajaran',
    balancedCognitive: 'Kognitif Seimbang - Seimbang di semua area kognitif',
    developingCognitive: 'Kognitif Berkembang - Sedang mengembangkan kemampuan kognitif'
  }
};

/**
 * Calculate cognitive assessment score
 */
export function calculateCognitiveScore(
  responses: CognitiveAssessmentResponse,
  userContext?: { faculty?: string; year?: number }
): CognitiveAssessmentResult {
  // Calculate component scores
  const componentScores: any = {};
  
  for (const item of COGNITIVE_ASSESSMENT_ITEMS) {
    const response = responses[item.id] || 3;
    const score = ((response - 1) / 4) * 100;
    
    if (!componentScores[item.category]) {
      componentScores[item.category] = [];
    }
    componentScores[item.category].push(score);
  }
  
  // Average scores for each component
  const finalComponentScores: any = {};
  for (const [component, scores] of Object.entries(componentScores)) {
    finalComponentScores[component] = scores.reduce((a: number, b: number) => a + b, 0) / scores.length;
  }
  
  // Calculate weighted composite score
  let weightedSum = 0;
  let totalWeight = 0;
  
  for (const [component, weight] of Object.entries(COGNITIVE_WEIGHTS)) {
    weightedSum += finalComponentScores[component] * weight;
    totalWeight += weight;
  }
  
  const compositeRaw = weightedSum / totalWeight;
  
  // Adjust for context
  let adjustedScore = compositeRaw;
  if (userContext?.faculty) {
    const facultyNorm = COGNITIVE_NORMS.byFaculty[userContext.faculty as keyof typeof COGNITIVE_NORMS.byFaculty];
    if (facultyNorm) {
      adjustedScore = compositeRaw + (facultyNorm.mean - COGNITIVE_NORMS.general.mean);
    }
  }
  
  // Determine cognitive profile
  const sortedComponents = Object.entries(finalComponentScores).sort((a, b) => b[1] - a[1]);
  const topComponents = sortedComponents.slice(0, 2).map(([comp]) => comp);
  
  let cognitiveProfile = 'developingCognitive';
  if (adjustedScore >= 70) {
    cognitiveProfile = 'balancedCognitive';
  } else if (topComponents.includes('criticalThinking') && topComponents.includes('problemSolving')) {
    cognitiveProfile = 'analyticalThinker';
  } else if (topComponents.includes('creativity') && topComponents.includes('knowledgeApplication')) {
    cognitiveProfile = 'creativeInnovator';
  } else if (topComponents.includes('metacognition') && topComponents.includes('learningAgility')) {
    cognitiveProfile = 'strategicLearner';
  }
  
  // Identify development priorities
  const developmentPriorities = Object.entries(finalComponentScores)
    .filter(([_, score]) => score < 50)
    .map(([component, score]) => ({
      component,
      score,
      priority: score < 40 ? 'high' : 'medium',
      description: getComponentDescription(component),
      impact: getComponentImpact(component)
    }))
    .sort((a, b) => a.score - b.score);
  
  // Calculate percentile
  const percentile = calculatePercentile(adjustedScore, COGNITIVE_NORMS.general);
  
  // Calculate confidence interval
  const standardError = 3.8;
  const confidenceInterval = {
    lower: Math.round(adjustedScore - 1.96 * standardError),
    upper: Math.round(adjustedScore + 1.96 * standardError)
  };
  
  return {
    compositeScore: Math.round(Math.min(100, Math.max(0, adjustedScore))),
    componentScores: finalComponentScores,
    cognitiveProfile,
    developmentPriorities,
    percentile,
    confidenceInterval
  };
}

function getComponentDescription(component: string): string {
  const descriptions: Record<string, string> = {
    criticalThinking: 'Mengembangkan kemampuan berpikir kritis',
    problemSolving: 'Meningkatkan kemampuan pemecahan masalah',
    learningAgility: 'Mengembangkan ketangkasan belajar',
    knowledgeApplication: 'Meningkatkan penerapan pengetahuan',
    creativity: 'Mengembangkan kreativitas dan inovasi',
    informationLiteracy: 'Meningkatkan literasi informasi',
    metacognition: 'Mengembangkan kesadaran metakognitif',
    intellectualCuriosity: 'Meningkatkan rasa ingin tahu intelektual'
  };
  return descriptions[component] || component;
}

function getComponentImpact(component: string): string {
  const impacts: Record<string, string> = {
    criticalThinking: 'Mempengaruhi kualitas keputusan dan analisis',
    problemSolving: 'Mempengaruhi kemampuan mengatasi tantangan',
    learningAgility: 'Mempengaruhi kecepatan dan efektivitas belajar',
    knowledgeApplication: 'Mempengaruhi penerapan teori dalam praktik',
    creativity: 'Mempengaruhi kemampuan inovasi dan solusi kreatif',
    informationLiteracy: 'Mempengaruhi kualitas penelitian dan sumber informasi',
    metacognition: 'Mempengaruhi efektivitas strategi belajar',
    intellectualCuriosity: 'Mempengaruhi motivasi belajar dan pengembangan diri'
  };
  return impacts[component] || 'Mempengaruhi pengembangan kognitif';
}

function calculatePercentile(score: number, norm: { mean: number; sd: number }): number {
  const zScore = (score - norm.mean) / norm.sd;
  // Approximate percentile using standard normal distribution
  const percentile = 50 * (1 + Math.tanh(zScore * 0.7));
  return Math.round(Math.min(99, Math.max(1, percentile)));
}
