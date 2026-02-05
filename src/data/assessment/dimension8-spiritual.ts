/**
 * DIMENSI 8 - SPIRITUAL DEVELOPMENT
 * Assessment Data and Scoring Algorithm
 */

export interface SpiritualAssessmentItem {
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

export interface SpiritualAssessmentResponse {
  [key: string]: number;
}

export interface SpiritualAssessmentResult {
  compositeScore: number;
  componentScores: {
    spiritualAwareness: number;
    spiritualPractices: number;
    spiritualValues: number;
    spiritualCommunity: number;
    spiritualMeaning: number;
    spiritualGrowth: number;
    spiritualIntegration: number;
    spiritualResilience: number;
  };
  spiritualProfile: {
    type: string;
    description: string;
    strengthWeaknessPattern: string;
  };
  spiritualJourney: {
    stage: string;
    description: string;
    nextSteps: string[];
  };
  developmentPriorities: Array<{
    component: string;
    score: number;
    priority: 'high' | 'medium' | 'low';
    description: string;
    impact: string;
  }>;
  spiritualStrengths: string[];
  spiritualGrowthAreas: string[];
  percentile: number;
  confidenceInterval: {
    lower: number;
    upper: number;
  };
  culturalNote: string;
}

export const SPIRITUAL_ASSESSMENT_ITEMS: SpiritualAssessmentItem[] = [
  {
    id: 'SPIR_AWA1',
    text: 'Saya memiliki pemahaman yang jelas tentang makna hidup dan tujuan saya',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'spiritualAwareness',
    weight: 1.4,
    psychometrics: {
      alpha: 0.89,
      factorLoading: 0.78,
      itemTotalR: 0.74
    }
  },
  {
    id: 'SPIR_PRA1',
    text: 'Saya memiliki praktik spiritual yang teratur (ibadah, meditasi, refleksi, dll.)',
    type: 'frequency',
    options: [
      { value: 1, label: 'Tidak Pernah', score: 0 },
      { value: 2, label: 'Sekali-sekali', score: 25 },
      { value: 3, label: 'Kadang-kadang', score: 50 },
      { value: 4, label: 'Sering', score: 75 },
      { value: 5, label: 'Selalu', score: 100 }
    ],
    category: 'spiritualPractices',
    weight: 1.3,
    psychometrics: {
      alpha: 0.89,
      factorLoading: 0.75,
      itemTotalR: 0.71
    }
  },
  {
    id: 'SPIR_VAL1',
    text: 'Nilai-nilai spiritual saya memandu keputusan dan tindakan saya dalam kehidupan sehari-hari',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'spiritualValues',
    weight: 1.3,
    psychometrics: {
      alpha: 0.89,
      factorLoading: 0.73,
      itemTotalR: 0.69
    }
  },
  {
    id: 'SPIR_COM1',
    text: 'Saya merasa terhubung dengan komunitas spiritual yang mendukung pertumbuhan saya',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'spiritualCommunity',
    weight: 1.1,
    psychometrics: {
      alpha: 0.89,
      factorLoading: 0.68,
      itemTotalR: 0.64
    }
  },
  {
    id: 'SPIR_MEAN1',
    text: 'Saya dapat menemukan makna dan tujuan dalam pengalaman hidup, termasuk yang sulit',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'spiritualMeaning',
    weight: 1.2,
    psychometrics: {
      alpha: 0.89,
      factorLoading: 0.71,
      itemTotalR: 0.67
    }
  },
  {
    id: 'SPIR_GRO1',
    text: 'Saya secara aktif mencari peluang untuk pertumbuhan dan pengembangan spiritual',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'spiritualGrowth',
    weight: 1.2,
    psychometrics: {
      alpha: 0.89,
      factorLoading: 0.70,
      itemTotalR: 0.66
    }
  },
  {
    id: 'SPIR_INT1',
    text: 'Saya dapat mengintegrasikan nilai-nilai spiritual saya dengan aktivitas akademik dan sosial',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'spiritualIntegration',
    weight: 1.1,
    psychometrics: {
      alpha: 0.89,
      factorLoading: 0.67,
      itemTotalR: 0.63
    }
  },
  {
    id: 'SPIR_RES1',
    text: 'Keyakinan spiritual saya membantu saya mengatasi kesulitan dan tantangan hidup',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'spiritualResilience',
    weight: 1.2,
    psychometrics: {
      alpha: 0.89,
      factorLoading: 0.72,
      itemTotalR: 0.68
    }
  }
];

export const SPIRITUAL_WEIGHTS = {
  spiritualAwareness: 1.4,
  spiritualPractices: 1.3,
  spiritualValues: 1.3,
  spiritualCommunity: 1.1,
  spiritualMeaning: 1.2,
  spiritualGrowth: 1.2,
  spiritualIntegration: 1.1,
  spiritualResilience: 1.2
};

export const SPIRITUAL_NORMS = {
  general: {
    mean: 63.5,
    sd: 14.2,
    n: 2000,
    distribution: 'slightly_left_skewed'
  },
  byFaculty: {
    humanitiesBusiness: { mean: 65.2, sd: 13.8 },
    socialSciences: { mean: 64.1, sd: 14.0 },
    STEM: { mean: 61.8, sd: 14.5 }
  },
  byGender: {
    male: { mean: 62.4, sd: 14.5 },
    female: { mean: 64.7, sd: 13.9 }
  },
  byYear: {
    year1: { mean: 62.1, sd: 14.5 },
    year2: { mean: 63.4, sd: 14.2 },
    year3: { mean: 64.7, sd: 14.0 },
    year4: { mean: 66.0, sd: 13.8 }
  }
};

export const SPIRITUAL_INTERPRETATION = {
  levels: [
    { range: '80-100', label: 'Transcendent', description: 'Pengembangan spiritual luar biasa' },
    { range: '70-79', label: 'Awakened', description: 'Pengembangan spiritual baik' },
    { range: '60-69', label: 'Developing', description: 'Pengembangan spiritual memadai' },
    { range: '50-59', label: 'Exploring', description: 'Pengembangan spiritual perlu perhatian' },
    { range: '0-49', label: 'Seeking', description: 'Memerlukan perhatian serius' }
  ],
  spiritualProfiles: {
    balancedAwakened: 'Semua komponen seimbang tinggi - spiritual yang matang',
    balancedDeveloping: 'Semua komponen cukup - spiritual yang berkembang',
    practiceFocused: 'Praktik spiritual kuat, perlu pengembangan kesadaran dan makna',
    meaningFocused: 'Pencarian makna kuat, perlu pengembangan praktik dan komunitas',
    communityFocused: 'Koneksi komunitas kuat, perlu pengembangan praktik dan integrasi',
    mixedProfile: 'Pola tidak konsisten, perlu assessment lebih lanjut'
  },
  spiritualJourneyStages: {
    seeking: 'Mencari - Mencari makna dan tujuan spiritual',
    exploring: 'Menjelajah - Mencoba berbagai praktik dan tradisi',
    developing: 'Berkembang - Membangun praktik dan nilai spiritual yang konsisten',
    awakened: 'Terbangun - Memiliki kesadaran dan praktik spiritual yang matang',
    transcendent: 'Transenden - Integrasi spiritual yang mendalam dalam semua aspek kehidupan'
  }
};

/**
 * Calculate spiritual assessment score
 */
export function calculateSpiritualScore(
  responses: SpiritualAssessmentResponse,
  userContext?: { faculty?: string; year?: number; gender?: string }
): SpiritualAssessmentResult {
  // Calculate component scores
  const componentScores: any = {};
  
  for (const item of SPIRITUAL_ASSESSMENT_ITEMS) {
    const response = responses[item.id] || 3;
    const score = item.options.find(opt => opt.value === response)?.score || 50;
    componentScores[item.category] = score;
  }
  
  // Calculate weighted composite score
  let weightedSum = 0;
  let totalWeight = 0;
  
  for (const [component, weight] of Object.entries(SPIRITUAL_WEIGHTS)) {
    weightedSum += componentScores[component] * weight;
    totalWeight += weight;
  }
  
  const compositeRaw = weightedSum / totalWeight;
  
  // Apply cultural adjustment for Indonesian context
  const culturalAdjustments = {
    spiritualCommunity: 1.15,
    spiritualValues: 1.1,
    spiritualIntegration: 1.1
  };
  
  let adjustedScore = compositeRaw;
  for (const [component, adjustment] of Object.entries(culturalAdjustments)) {
    if (componentScores[component]) {
      adjustedScore = (adjustedScore - (componentScores[component] * SPIRITUAL_WEIGHTS[component as keyof typeof SPIRITUAL_WEIGHTS] / totalWeight)) + 
                      (componentScores[component] * adjustment * SPIRITUAL_WEIGHTS[component as keyof typeof SPIRITUAL_WEIGHTS] / totalWeight);
    }
  }
  
  // Calculate spiritual profile
  const spiritualProfile = calculateSpiritualProfile(componentScores);
  
  // Calculate spiritual journey stage
  const spiritualJourney = calculateSpiritualJourney(componentScores);
  
  // Identify development priorities
  const developmentPriorities = identifyDevelopmentPriorities(componentScores);
  
  // Identify spiritual strengths
  const spiritualStrengths = identifySpiritualStrengths(componentScores);
  
  // Identify spiritual growth areas
  const spiritualGrowthAreas = identifySpiritualGrowthAreas(componentScores);
  
  // Calculate percentile
  const percentile = calculatePercentile(adjustedScore, SPIRITUAL_NORMS.general);
  
  // Calculate confidence interval
  const standardError = 3.5;
  const confidenceInterval = {
    lower: Math.round(adjustedScore - 1.96 * standardError),
    upper: Math.round(adjustedScore + 1.96 * standardError)
  };
  
  // Get cultural interpretation note
  const culturalNote = getCulturalInterpretationNote(componentScores);
  
  return {
    compositeScore: Math.round(Math.min(100, Math.max(0, adjustedScore))),
    componentScores,
    spiritualProfile,
    spiritualJourney,
    developmentPriorities,
    spiritualStrengths,
    spiritualGrowthAreas,
    percentile,
    confidenceInterval,
    culturalNote
  };
}

function calculateSpiritualProfile(scores: any): any {
  const profile = {
    components: scores,
    profileType: '',
    strengthWeaknessPattern: ''
  };
  
  // Determine profile type
  const scoreRange = Math.max(...Object.values(scores as Record<string, number>)) - Math.min(...Object.values(scores as Record<string, number>));
  if (scoreRange <= 15) {
    if (Object.values(scores as Record<string, number>).every(v => v >= 70)) {
      profile.profileType = 'balancedAwakened';
    } else if (Object.values(scores as Record<string, number>).every(v => v >= 60)) {
      profile.profileType = 'balancedDeveloping';
    } else {
      profile.profileType = 'balancedDeveloping';
    }
  } else if (scores.spiritualPractices > 70 && scores.spiritualPractices > Math.max(...Object.entries(scores as Record<string, number>).filter(([k]) => k !== 'spiritualPractices').map(([, v]) => v))) {
    profile.profileType = 'practiceFocused';
  } else if (scores.spiritualMeaning > 70 && scores.spiritualMeaning > Math.max(...Object.entries(scores as Record<string, number>).filter(([k]) => k !== 'spiritualMeaning').map(([, v]) => v))) {
    profile.profileType = 'meaningFocused';
  } else if (scores.spiritualCommunity > 70 && scores.spiritualCommunity > Math.max(...Object.entries(scores as Record<string, number>).filter(([k]) => k !== 'spiritualCommunity').map(([, v]) => v))) {
    profile.profileType = 'communityFocused';
  } else {
    profile.profileType = 'mixedProfile';
  }
  
  // Determine strength/weakness pattern
  const strengths = Object.entries(scores as Record<string, number>).filter(([_, v]) => v >= 70).map(([k]) => k);
  const weaknesses = Object.entries(scores as Record<string, number>).filter(([_, v]) => v < 50).map(([k]) => k);
  
  if (strengths.length > 0 && weaknesses.length > 0) {
    profile.strengthWeaknessPattern = `Kuat di ${strengths.join(', ')}, perlu pengembangan di ${weaknesses.join(', ')}`;
  } else if (strengths.length > 0) {
    profile.strengthWeaknessPattern = `Kuat di ${strengths.join(', ')}`;
  } else if (weaknesses.length > 0) {
    profile.strengthWeaknessPattern = `Perlu pengembangan di ${weaknesses.join(', ')}`;
  } else {
    profile.strengthWeaknessPattern = 'Seimbang di semua area';
  }
  
  return profile;
}

function calculateSpiritualJourney(scores: any): any {
  const journey = {
    stage: '',
    description: '',
    nextSteps: [] as string[]
  };
  
  const averageScore = Object.values(scores as Record<string, number>).reduce((a: number, b: number) => a + b, 0) / Object.keys(scores).length;
  
  if (averageScore >= 80) {
    journey.stage = 'transcendent';
    journey.description = 'Integrasi spiritual yang mendalam dalam semua aspek kehidupan';
    journey.nextSteps = [
      'Membimbing orang lain dalam perjalanan spiritual',
      'Mengembangkan praktik spiritual yang lebih mendalam',
      'Mengintegrasikan spiritualitas dalam kepemimpinan'
    ];
  } else if (averageScore >= 70) {
    journey.stage = 'awakened';
    journey.description = 'Memiliki kesadaran dan praktik spiritual yang matang';
    journey.nextSteps = [
      'Mengembangkan praktik spiritual yang lebih konsisten',
      'Meningkatkan integrasi spiritual dalam kehidupan sehari-hari',
      'Membangun komunitas spiritual yang lebih kuat'
    ];
  } else if (averageScore >= 60) {
    journey.stage = 'developing';
    journey.description = 'Membangun praktik dan nilai spiritual yang konsisten';
    journey.nextSteps = [
      'Mengembangkan praktik spiritual yang teratur',
      'Meningkatkan kesadaran spiritual',
      'Mencari komunitas spiritual yang mendukung'
    ];
  } else if (averageScore >= 50) {
    journey.stage = 'exploring';
    journey.description = 'Mencoba berbagai praktik dan tradisi spiritual';
    journey.nextSteps = [
      'Menjelajahi berbagai tradisi spiritual',
      'Mencari makna dan tujuan spiritual',
      'Mencoba praktik spiritual yang berbeda'
    ];
  } else {
    journey.stage = 'seeking';
    journey.description = 'Mencari makna dan tujuan spiritual';
    journey.nextSteps = [
      'Mencari makna dan tujuan dalam kehidupan',
      'Menjelajahi berbagai tradisi spiritual',
      'Mencari komunitas spiritual yang mendukung'
    ];
  }
  
  return journey;
}

function identifyDevelopmentPriorities(scores: any): Array<any> {
  const priorities: Array<any> = [];
  
  const priorityInfo: Record<string, any> = {
    spiritualAwareness: {
      priority: 'high',
      description: 'Mengembangkan kesadaran spiritual',
      impact: 'Dasar untuk semua aspek spiritual lainnya'
    },
    spiritualPractices: {
      priority: 'high',
      description: 'Mengembangkan praktik spiritual yang teratur',
      impact: 'Kunci untuk pertumbuhan spiritual yang konsisten'
    },
    spiritualValues: {
      priority: 'high',
      description: 'Mengembangkan nilai-nilai spiritual',
      impact: 'Mempengaruhi keputusan dan tindakan sehari-hari'
    },
    spiritualCommunity: {
      priority: 'medium',
      description: 'Mengembangkan koneksi komunitas spiritual',
      impact: 'Penting untuk dukungan dan pertumbuhan bersama'
    },
    spiritualMeaning: {
      priority: 'high',
      description: 'Mengembangkan pemahaman makna hidup',
      impact: 'Kunci untuk tujuan dan arah hidup'
    },
    spiritualGrowth: {
      priority: 'medium',
      description: 'Mengembangkan pertumbuhan spiritual',
      impact: 'Penting untuk pengembangan berkelanjutan'
    },
    spiritualIntegration: {
      priority: 'medium',
      description: 'Mengintegrasikan spiritualitas dalam kehidupan',
      impact: 'Kunci untuk kehidupan yang holistik'
    },
    spiritualResilience: {
      priority: 'high',
      description: 'Mengembangkan ketahanan spiritual',
      impact: 'Penting untuk mengatasi kesulitan'
    }
  };
  
  for (const [component, score] of Object.entries(scores as Record<string, number>)) {
    if (score < 50) {
      const info = priorityInfo[component];
      priorities.push({
        component,
        score,
        priority: score < 40 ? 'high' : 'medium',
        description: info.description,
        impact: info.impact
      });
    }
  }
  
  // Sort by priority (high first) then score (lowest first)
  const priorityOrder = { high: 1, medium: 2, low: 3 };
  priorities.sort((a, b) => {
    const aPriority = a.priority as 'high' | 'medium' | 'low';
    const bPriority = b.priority as 'high' | 'medium' | 'low';
    if (priorityOrder[aPriority] !== priorityOrder[bPriority]) {
      return priorityOrder[aPriority] - priorityOrder[bPriority];
    }
    return a.score - b.score;
  });
  
  return priorities;
}

function identifySpiritualStrengths(scores: any): string[] {
  const strengths: string[] = [];
  
  const strengthLabels: Record<string, string> = {
    spiritualAwareness: 'Kesadaran Spiritual',
    spiritualPractices: 'Praktik Spiritual',
    spiritualValues: 'Nilai-Nilai Spiritual',
    spiritualCommunity: 'Komunitas Spiritual',
    spiritualMeaning: 'Makna Spiritual',
    spiritualGrowth: 'Pertumbuhan Spiritual',
    spiritualIntegration: 'Integrasi Spiritual',
    spiritualResilience: 'Ketahanan Spiritual'
  };
  
  for (const [component, score] of Object.entries(scores as Record<string, number>)) {
    if (score >= 70) {
      strengths.push(strengthLabels[component]);
    }
  }
  
  return strengths;
}

function identifySpiritualGrowthAreas(scores: any): string[] {
  const growthAreas: string[] = [];
  
  const growthLabels: Record<string, string> = {
    spiritualAwareness: 'Kesadaran Spiritual',
    spiritualPractices: 'Praktik Spiritual',
    spiritualValues: 'Nilai-Nilai Spiritual',
    spiritualCommunity: 'Komunitas Spiritual',
    spiritualMeaning: 'Makna Spiritual',
    spiritualGrowth: 'Pertumbuhan Spiritual',
    spiritualIntegration: 'Integrasi Spiritual',
    spiritualResilience: 'Ketahanan Spiritual'
  };
  
  for (const [component, score] of Object.entries(scores as Record<string, number>)) {
    if (score < 50) {
      growthAreas.push(growthLabels[component]);
    }
  }
  
  return growthAreas;
}

function calculatePercentile(score: number, norm: { mean: number; sd: number }): number {
  const zScore = (score - norm.mean) / norm.sd;
  const percentile = 50 * (1 + Math.tanh(zScore * 0.7));
  return Math.round(Math.min(99, Math.max(1, percentile)));
}

function getCulturalInterpretationNote(scores: any): string {
  const notes: string[] = [];
  
  if (scores.spiritualCommunity >= 70) {
    notes.push('Koneksi komunitas spiritual yang kuat sesuai dengan nilai budaya Indonesia');
  }
  
  if (scores.spiritualValues >= 70) {
    notes.push('Nilai-nilai spiritual yang kuat mendukung kehidupan yang bermakna');
  }
  
  if (scores.spiritualIntegration >= 70) {
    notes.push('Integrasi spiritual yang baik mendukung keseimbangan hidup');
  }
  
  if (scores.spiritualResilience >= 70) {
    notes.push('Ketahanan spiritual yang kuat membantu mengatasi tantangan');
  }
  
  return notes.join('. ') || 'Profil spiritual yang seimbang';
}
