/**
 * DIMENSI 5 - EMOTIONAL INTELLIGENCE & SOCIAL
 * Assessment Data and Scoring Algorithm
 */

export interface EmotionalIntelligenceAssessmentItem {
  id: string;
  text: string;
  type: 'likert';
  options: Array<{ value: number; label: string; score: number }>;
  category: string;
  weight: number;
  psychometrics: {
    alpha: number;
    factorLoading: number;
    itemTotalR: number;
  };
}

export interface EmotionalIntelligenceAssessmentResponse {
  [key: string]: number;
}

export interface EmotionalIntelligenceAssessmentResult {
  compositeScore: number;
  componentScores: {
    selfAwareness: number;
    socialAwareness: number;
    selfManagement: number;
    relationshipManagement: number;
  };
  eiProfile: {
    type: string;
    description: string;
    strengthWeaknessPattern: string;
  };
  developmentPriorities: Array<{
    component: string;
    score: number;
    priority: 'high' | 'medium' | 'low';
    description: string;
    impact: string;
  }>;
  emotionalCompetenceLevel: string;
  percentile: number;
  confidenceInterval: {
    lower: number;
    upper: number;
  };
  culturalNote: string;
}

export const EMOTIONAL_INTELLIGENCE_ASSESSMENT_ITEMS: EmotionalIntelligenceAssessmentItem[] = [
  {
    id: 'EMO_SELF1',
    text: 'Saya dapat dengan akurat mengenali dan memberi nama perasaan yang saya alami',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'selfAwareness',
    weight: 1.3,
    psychometrics: {
      alpha: 0.84,
      factorLoading: 0.74,
      itemTotalR: 0.70
    }
  },
  {
    id: 'EMO_EMP1',
    text: 'Saya dapat memahami perasaan orang lain meskipun mereka tidak mengungkapkannya secara verbal',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'socialAwareness',
    weight: 1.4,
    psychometrics: {
      alpha: 0.84,
      factorLoading: 0.70,
      itemTotalR: 0.67
    }
  },
  {
    id: 'EMO_REG1',
    text: 'Saya dapat menenangkan diri ketika merasakan emosi negatif yang kuat',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'selfManagement',
    weight: 1.2,
    psychometrics: {
      alpha: 0.84,
      factorLoading: 0.76,
      itemTotalR: 0.72
    }
  },
  {
    id: 'EMO_SOC1',
    text: 'Saya dapat memulai dan mempertahankan percakapan yang menyenangkan dengan orang baru',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'relationshipManagement',
    weight: 1.1,
    psychometrics: {
      alpha: 0.84,
      factorLoading: 0.69,
      itemTotalR: 0.65
    }
  },
  {
    id: 'EMO_ASS1',
    text: 'Saya dapat menyampaikan pendapat dan kebutuhan saya dengan jelas tanpa menjadi agresif',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'relationshipManagement',
    weight: 1.2,
    psychometrics: {
      alpha: 0.84,
      factorLoading: 0.66,
      itemTotalR: 0.62
    }
  },
  {
    id: 'EMO_CON1',
    text: 'Dalam situasi konflik, saya mencari solusi yang menguntungkan semua pihak',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'relationshipManagement',
    weight: 1.3,
    psychometrics: {
      alpha: 0.84,
      factorLoading: 0.71,
      itemTotalR: 0.68
    }
  },
  {
    id: 'EMO_EXP1',
    text: 'Saya dapat mengungkapkan perasaan dengan tepat sesuai konteks sosial dan budaya',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'selfManagement',
    weight: 1.1,
    psychometrics: {
      alpha: 0.84,
      factorLoading: 0.73,
      itemTotalR: 0.69
    }
  },
  {
    id: 'EMO_SAW1',
    text: 'Saya peka terhadap dinamika kelompok dan norma sosial yang tidak terucap dalam situasi sosial',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'socialAwareness',
    weight: 1.0,
    psychometrics: {
      alpha: 0.84,
      factorLoading: 0.68,
      itemTotalR: 0.64
    }
  }
];

export const EMOTIONAL_INTELLIGENCE_WEIGHTS = {
  selfAwareness: 1.3,
  socialAwareness: 1.4,
  selfManagement: 1.2,
  relationshipManagement: 1.3
};

export const EMOTIONAL_INTELLIGENCE_NORMS = {
  general: {
    mean: 60.5,
    sd: 14.6,
    n: 2000,
    distribution: 'slightly_left_skewed'
  },
  byRegion: {
    java: { mean: 61.8, sd: 14.2 },
    sumatra: { mean: 59.3, sd: 15.1 },
    sulawesi: { mean: 58.7, sd: 15.4 },
    other: { mean: 57.9, sd: 15.8 }
  },
  byFaculty: {
    humanitiesBusiness: { mean: 63.2, sd: 13.5 },
    socialSciences: { mean: 61.4, sd: 14.2 },
    STEM: { mean: 57.9, sd: 15.3 }
  },
  byGender: {
    male: { mean: 58.5, sd: 15.1 },
    female: { mean: 62.8, sd: 14.1 }
  }
};

export const EMOTIONAL_INTELLIGENCE_INTERPRETATION = {
  levels: [
    { range: '80-100', label: 'Exceptional', description: 'Kecerdasan emosional luar biasa' },
    { range: '70-79', label: 'Advanced', description: 'Kecerdasan emosional baik' },
    { range: '60-69', label: 'Proficient', description: 'Kecerdasan emosional memadai' },
    { range: '50-59', label: 'Developing', description: 'Perlu pengembangan kecerdasan emosional' },
    { range: '0-49', label: 'Beginner', description: 'Memerlukan perhatian serius' }
  ],
  eiProfiles: {
    balancedHighEI: 'Semua komponen seimbang tinggi - ideal untuk kepemimpinan',
    balancedModerateEI: 'Semua komponen cukup - baik untuk kerja tim',
    introspectiveFocus: 'Fokus internal kuat, perlu pengembangan sosial',
    socialFocus: 'Fokus sosial kuat, perlu pengembangan internal',
    selfRegulationFocus: 'Regulasi diri kuat, perlu keterampilan sosial',
    relationshipFocus: 'Keterampilan hubungan kuat, perlu regulasi diri',
    mixedProfile: 'Pola tidak konsisten, perlu assessment lebih lanjut'
  }
};

/**
 * Calculate emotional intelligence score
 */
export function calculateEmotionalIntelligenceScore(
  responses: EmotionalIntelligenceAssessmentResponse,
  userContext?: { faculty?: string; gender?: string; region?: string }
): EmotionalIntelligenceAssessmentResult {
  // Map items to Goleman's components
  const componentMapping = {
    selfAwareness: ['EMO_SELF1'],
    socialAwareness: ['EMO_EMP1', 'EMO_SAW1'],
    selfManagement: ['EMO_REG1', 'EMO_EXP1'],
    relationshipManagement: ['EMO_SOC1', 'EMO_ASS1', 'EMO_CON1']
  };
  
  // Calculate component scores
  const componentScores: any = {};
  
  for (const [component, items] of Object.entries(componentMapping)) {
    const itemScores: number[] = [];
    for (const itemId of items) {
      const response = responses[itemId] || 3;
      const score = ((response - 1) / 4) * 100;
      itemScores.push(score);
    }
    componentScores[component] = itemScores.reduce((a: number, b: number) => a + b, 0) / itemScores.length;
  }
  
  // Calculate weighted composite score
  let weightedSum = 0;
  let totalWeight = 0;
  
  for (const [component, weight] of Object.entries(EMOTIONAL_INTELLIGENCE_WEIGHTS)) {
    weightedSum += componentScores[component] * weight;
    totalWeight += weight;
  }
  
  const compositeRaw = weightedSum / totalWeight;
  
  // Apply cultural adjustment for Indonesian context
  const culturalAdjustments = {
    socialAwareness: 1.1,
    relationshipManagement: 1.15
  };
  
  let adjustedScore = compositeRaw;
  for (const [component, adjustment] of Object.entries(culturalAdjustments)) {
    if (componentScores[component]) {
      adjustedScore = (adjustedScore - (componentScores[component] * EMOTIONAL_INTELLIGENCE_WEIGHTS[component as keyof typeof EMOTIONAL_INTELLIGENCE_WEIGHTS] / totalWeight)) + 
                      (componentScores[component] * adjustment * EMOTIONAL_INTELLIGENCE_WEIGHTS[component as keyof typeof EMOTIONAL_INTELLIGENCE_WEIGHTS] / totalWeight);
    }
  }
  
  // Calculate EI profile
  const eiProfile = calculateEIProfile(componentScores);
  
  // Identify development priorities
  const developmentPriorities = identifyDevelopmentPriorities(componentScores);
  
  // Determine emotional competence level
  const emotionalCompetenceLevel = categorizeEILevel(adjustedScore);
  
  // Calculate percentile
  const percentile = calculatePercentile(adjustedScore, EMOTIONAL_INTELLIGENCE_NORMS.general);
  
  // Calculate confidence interval
  const standardError = 3.6;
  const confidenceInterval = {
    lower: Math.round(adjustedScore - 1.96 * standardError),
    upper: Math.round(adjustedScore + 1.96 * standardError)
  };
  
  // Get cultural interpretation note
  const culturalNote = getCulturalInterpretationNote(componentScores);
  
  return {
    compositeScore: Math.round(Math.min(100, Math.max(0, adjustedScore))),
    componentScores: { 
      selfAwareness: Math.round(componentScores.selfAwareness),
      socialAwareness: Math.round(componentScores.socialAwareness),
      selfManagement: Math.round(componentScores.selfManagement),
      relationshipManagement: Math.round(componentScores.relationshipManagement)
    },
    eiProfile,
    developmentPriorities,
    emotionalCompetenceLevel,
    percentile,
    confidenceInterval,
    culturalNote
  };
}

function calculateEIProfile(scores: any): any {
  const profile = {
    components: scores,
    profileType: '',
    strengthWeaknessPattern: ''
  };
  
  // Determine profile type
  const scoreRange = Math.max(...Object.values(scores)) - Math.min(...Object.values(scores));
  if (scoreRange <= 15) {
    if (Object.values(scores).every(v => v >= 70)) {
      profile.profileType = 'balancedHighEI';
    } else if (Object.values(scores).every(v => v >= 60)) {
      profile.profileType = 'balancedModerateEI';
    } else {
      profile.profileType = 'balancedModerateEI';
    }
  } else if (scores.selfAwareness > scores.socialAwareness + 20) {
    profile.profileType = 'introspectiveFocus';
  } else if (scores.socialAwareness > scores.selfAwareness + 20) {
    profile.profileType = 'socialFocus';
  } else if (scores.selfManagement > scores.relationshipManagement + 20) {
    profile.profileType = 'selfRegulationFocus';
  } else if (scores.relationshipManagement > scores.selfManagement + 20) {
    profile.profileType = 'relationshipFocus';
  } else {
    profile.profileType = 'mixedProfile';
  }
  
  // Determine strength/weakness pattern
  const strengths = Object.entries(scores).filter(([_, v]) => v >= 70).map(([k]) => k);
  const weaknesses = Object.entries(scores).filter(([_, v]) => v < 50).map(([k]) => k);
  
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

function identifyDevelopmentPriorities(scores: any): Array<any> {
  const priorities: Array<any> = [];
  
  const priorityInfo: Record<string, any> = {
    selfAwareness: {
      priority: 'high',
      description: 'Mengembangkan kesadaran diri emosional',
      impact: 'Dasar untuk semua kompetensi EI lainnya'
    },
    socialAwareness: {
      priority: 'high',
      description: 'Meningkatkan empati dan kesadaran sosial',
      impact: 'Kritis untuk hubungan sosial dan teamwork'
    },
    selfManagement: {
      priority: 'high',
      description: 'Mengembangkan regulasi emosi',
      impact: 'Penting untuk ketahanan dan performa'
    },
    relationshipManagement: {
      priority: 'medium',
      description: 'Meningkatkan keterampilan sosial',
      impact: 'Kunci untuk kepemimpinan dan kolaborasi'
    }
  };
  
  for (const [component, score] of Object.entries(scores)) {
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
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return a.score - b.score;
  });
  
  return priorities;
}

function categorizeEILevel(score: number): string {
  if (score >= 80) return 'exceptional';
  if (score >= 70) return 'advanced';
  if (score >= 60) return 'proficient';
  if (score >= 50) return 'developing';
  return 'beginner';
}

function calculatePercentile(score: number, norm: { mean: number; sd: number }): number {
  const zScore = (score - norm.mean) / norm.sd;
  const percentile = 50 * (1 + Math.tanh(zScore * 0.7));
  return Math.round(Math.min(99, Math.max(1, percentile)));
}

function getCulturalInterpretationNote(scores: any): string {
  const notes: string[] = [];
  
  if (scores.socialAwareness >= 70) {
    notes.push('Kesadaran sosial yang tinggi sesuai dengan nilai kolektivitas Indonesia');
  }
  
  if (scores.relationshipManagement >= 70) {
    notes.push('Keterampilan hubungan yang baik mendukung harmoni sosial (gotong royong)');
  }
  
  if (scores.selfManagement >= 70 && scores.selfAwareness < 60) {
    notes.push('Regulasi emosi baik tapi perlu meningkatkan ekspresi yang sesuai norma budaya');
  }
  
  return notes.join('. ') || 'Profil kecerdasan emosional yang seimbang';
}
