/**
 * DIMENSI 7 - CHARACTER & ETHICS
 * Assessment Data and Scoring Algorithm
 */

export interface CharacterAssessmentItem {
  id: string;
  text: string;
  type: 'likert' | 'behavioral';
  options: Array<{ value: number; label: string; score: number }>;
  category: string;
  weight: number;
  psychometrics: {
    alpha: number;
    factorLoading: number;
    itemTotalR: number;
  };
}

export interface CharacterAssessmentResponse {
  [key: string]: number;
}

export interface CharacterAssessmentResult {
  compositeScore: number;
  componentScores: {
    integrity: number;
    responsibility: number;
    empathy: number;
    fairness: number;
    respect: number;
    citizenship: number;
    courage: number;
    humility: number;
  };
  characterProfile: {
    type: string;
    description: string;
    strengthWeaknessPattern: string;
  };
  ethicalDecisionMaking: {
    style: string;
    description: string;
    strengths: string[];
    areasForDevelopment: string[];
  };
  developmentPriorities: Array<{
    component: string;
    score: number;
    priority: 'high' | 'medium' | 'low';
    description: string;
    impact: string;
  }>;
  characterStrengths: string[];
  characterGrowthAreas: string[];
  percentile: number;
  confidenceInterval: {
    lower: number;
    upper: number;
  };
  culturalNote: string;
}

export const CHARACTER_ASSESSMENT_ITEMS: CharacterAssessmentItem[] = [
  {
    id: 'CHAR_INT1',
    text: 'Saya bertindak sesuai dengan nilai-nilai saya, bahkan ketika tidak ada orang yang melihat',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'integrity',
    weight: 1.4,
    psychometrics: {
      alpha: 0.88,
      factorLoading: 0.76,
      itemTotalR: 0.72
    }
  },
  {
    id: 'CHAR_RESP1',
    text: 'Saya menerima tanggung jawab penuh atas tindakan dan keputusan saya',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'responsibility',
    weight: 1.3,
    psychometrics: {
      alpha: 0.88,
      factorLoading: 0.74,
      itemTotalR: 0.70
    }
  },
  {
    id: 'CHAR_EMP1',
    text: 'Saya dapat memahami dan merasakan apa yang dialami orang lain',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'empathy',
    weight: 1.2,
    psychometrics: {
      alpha: 0.88,
      factorLoading: 0.70,
      itemTotalR: 0.66
    }
  },
  {
    id: 'CHAR_FAIR1',
    text: 'Saya memperlakukan semua orang dengan adil, tanpa memandang status atau latar belakang',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'fairness',
    weight: 1.3,
    psychometrics: {
      alpha: 0.88,
      factorLoading: 0.72,
      itemTotalR: 0.68
    }
  },
  {
    id: 'CHAR_RES1',
    text: 'Saya menghormati perbedaan pendapat dan perspektif orang lain',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'respect',
    weight: 1.1,
    psychometrics: {
      alpha: 0.88,
      factorLoading: 0.68,
      itemTotalR: 0.64
    }
  },
  {
    id: 'CHAR_CIT1',
    text: 'Saya aktif berkontribusi untuk kebaikan komunitas dan lingkungan sekitar',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'citizenship',
    weight: 1.2,
    psychometrics: {
      alpha: 0.88,
      factorLoading: 0.66,
      itemTotalR: 0.62
    }
  },
  {
    id: 'CHAR_COU1',
    text: 'Saya berani mengambil tindakan yang benar, meskipun tidak populer atau sulit',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'courage',
    weight: 1.1,
    psychometrics: {
      alpha: 0.88,
      factorLoading: 0.64,
      itemTotalR: 0.60
    }
  },
  {
    id: 'CHAR_HUM1',
    text: 'Saya mengakui kelemahan saya dan bersedia belajar dari orang lain',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'humility',
    weight: 1.0,
    psychometrics: {
      alpha: 0.88,
      factorLoading: 0.62,
      itemTotalR: 0.58
    }
  }
];

export const CHARACTER_WEIGHTS = {
  integrity: 1.4,
  responsibility: 1.3,
  empathy: 1.2,
  fairness: 1.3,
  respect: 1.1,
  citizenship: 1.2,
  courage: 1.1,
  humility: 1.0
};

export const CHARACTER_NORMS = {
  general: {
    mean: 62.3,
    sd: 13.8,
    n: 2000,
    distribution: 'slightly_left_skewed'
  },
  byFaculty: {
    humanitiesBusiness: { mean: 64.5, sd: 13.2 },
    socialSciences: { mean: 63.1, sd: 13.5 },
    STEM: { mean: 59.8, sd: 14.2 }
  },
  byGender: {
    male: { mean: 61.2, sd: 14.1 },
    female: { mean: 63.5, sd: 13.5 }
  },
  byYear: {
    year1: { mean: 60.8, sd: 14.2 },
    year2: { mean: 62.1, sd: 13.8 },
    year3: { mean: 63.4, sd: 13.5 },
    year4: { mean: 64.7, sd: 13.2 }
  }
};

export const CHARACTER_INTERPRETATION = {
  levels: [
    { range: '80-100', label: 'Exemplary', description: 'Karakter luar biasa' },
    { range: '70-79', label: 'Strong', description: 'Karakter kuat' },
    { range: '60-69', label: 'Developing', description: 'Karakter berkembang' },
    { range: '50-59', label: 'Emerging', description: 'Karakter mulai berkembang' },
    { range: '0-49', label: 'Needs Attention', description: 'Memerlukan perhatian serius' }
  ],
  characterProfiles: {
    balancedStrongCharacter: 'Semua komponen seimbang tinggi - ideal untuk kepemimpinan',
    balancedModerateCharacter: 'Semua komponen cukup - baik untuk kerja tim',
    integrityFocused: 'Integritas tinggi, perlu pengembangan komponen lain',
    empathyFocused: 'Empati tinggi, perlu pengembangan integritas dan tanggung jawab',
    responsibilityFocused: 'Tanggung jawab tinggi, perlu pengembangan empati dan keadilan',
    mixedProfile: 'Pola tidak konsisten, perlu assessment lebih lanjut'
  },
  ethicalDecisionStyles: {
    principled: 'Berdasarkan prinsip moral yang kuat',
    utilitarian: 'Fokus pada hasil terbaik untuk mayoritas',
    careBased: 'Fokus pada hubungan dan kepedulian',
    situational: 'Bervariasi tergantung konteks'
  }
};

/**
 * Calculate character assessment score
 */
export function calculateCharacterScore(
  responses: CharacterAssessmentResponse,
  userContext?: { faculty?: string; year?: number; gender?: string }
): CharacterAssessmentResult {
  // Calculate component scores
  const componentScores: any = {};
  
  for (const item of CHARACTER_ASSESSMENT_ITEMS) {
    const response = responses[item.id] || 3;
    const score = item.options.find(opt => opt.value === response)?.score || 50;
    componentScores[item.category] = score;
  }
  
  // Calculate weighted composite score
  let weightedSum = 0;
  let totalWeight = 0;
  
  for (const [component, weight] of Object.entries(CHARACTER_WEIGHTS)) {
    weightedSum += componentScores[component] * weight;
    totalWeight += weight;
  }
  
  const compositeRaw = weightedSum / totalWeight;
  
  // Apply cultural adjustment for Indonesian context
  const culturalAdjustments = {
    respect: 1.15,
    citizenship: 1.1,
    humility: 1.1
  };
  
  let adjustedScore = compositeRaw;
  for (const [component, adjustment] of Object.entries(culturalAdjustments)) {
    if (componentScores[component]) {
      adjustedScore = (adjustedScore - (componentScores[component] * CHARACTER_WEIGHTS[component as keyof typeof CHARACTER_WEIGHTS] / totalWeight)) + 
                      (componentScores[component] * adjustment * CHARACTER_WEIGHTS[component as keyof typeof CHARACTER_WEIGHTS] / totalWeight);
    }
  }
  
  // Calculate character profile
  const characterProfile = calculateCharacterProfile(componentScores);
  
  // Calculate ethical decision making style
  const ethicalDecisionMaking = calculateEthicalDecisionMaking(componentScores);
  
  // Identify development priorities
  const developmentPriorities = identifyDevelopmentPriorities(componentScores);
  
  // Identify character strengths
  const characterStrengths = identifyCharacterStrengths(componentScores);
  
  // Identify character growth areas
  const characterGrowthAreas = identifyCharacterGrowthAreas(componentScores);
  
  // Calculate percentile
  const percentile = calculatePercentile(adjustedScore, CHARACTER_NORMS.general);
  
  // Calculate confidence interval
  const standardError = 3.4;
  const confidenceInterval = {
    lower: Math.round(adjustedScore - 1.96 * standardError),
    upper: Math.round(adjustedScore + 1.96 * standardError)
  };
  
  // Get cultural interpretation note
  const culturalNote = getCulturalInterpretationNote(componentScores);
  
  return {
    compositeScore: Math.round(Math.min(100, Math.max(0, adjustedScore))),
    componentScores,
    characterProfile,
    ethicalDecisionMaking,
    developmentPriorities,
    characterStrengths,
    characterGrowthAreas,
    percentile,
    confidenceInterval,
    culturalNote
  };
}

function calculateCharacterProfile(scores: any): any {
  const profile = {
    components: scores,
    profileType: '',
    strengthWeaknessPattern: ''
  };
  
  // Determine profile type
  const scoreRange = Math.max(...Object.values(scores as Record<string, number>)) - Math.min(...Object.values(scores as Record<string, number>));
  if (scoreRange <= 15) {
    if (Object.values(scores as Record<string, number>).every(v => v >= 70)) {
      profile.profileType = 'balancedStrongCharacter';
    } else if (Object.values(scores as Record<string, number>).every(v => v >= 60)) {
      profile.profileType = 'balancedModerateCharacter';
    } else {
      profile.profileType = 'balancedModerateCharacter';
    }
  } else if (scores.integrity > 70 && scores.integrity > Math.max(...Object.entries(scores as Record<string, number>).filter(([k]) => k !== 'integrity').map(([, v]) => v))) {
    profile.profileType = 'integrityFocused';
  } else if (scores.empathy > 70 && scores.empathy > Math.max(...Object.entries(scores as Record<string, number>).filter(([k]) => k !== 'empathy').map(([, v]) => v))) {
    profile.profileType = 'empathyFocused';
  } else if (scores.responsibility > 70 && scores.responsibility > Math.max(...Object.entries(scores as Record<string, number>).filter(([k]) => k !== 'responsibility').map(([, v]) => v))) {
    profile.profileType = 'responsibilityFocused';
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

function calculateEthicalDecisionMaking(scores: any): any {
  const style = {
    style: '',
    description: '',
    strengths: [] as string[],
    areasForDevelopment: [] as string[]
  };
  
  // Determine decision-making style
  if (scores.integrity >= 70 && scores.fairness >= 70) {
    style.style = 'principled';
    style.description = 'Berdasarkan prinsip moral yang kuat';
    style.strengths.push('Integritas tinggi', 'Keadilan kuat');
  } else if (scores.empathy >= 70 && scores.respect >= 70) {
    style.style = 'careBased';
    style.description = 'Fokus pada hubungan dan kepedulian';
    style.strengths.push('Empati tinggi', 'Respect kuat');
  } else if (scores.citizenship >= 70 && scores.responsibility >= 70) {
    style.style = 'utilitarian';
    style.description = 'Fokus pada hasil terbaik untuk mayoritas';
    style.strengths.push('Kewarganegaraan kuat', 'Tanggung jawab tinggi');
  } else {
    style.style = 'situational';
    style.description = 'Bervariasi tergantung konteks';
  }
  
  // Identify areas for development
  const weaknesses = Object.entries(scores as Record<string, number>).filter(([_, v]) => v < 50).map(([k]) => k);
  if (weaknesses.length > 0) {
    style.areasForDevelopment.push(...weaknesses);
  }
  
  return style;
}

function identifyDevelopmentPriorities(scores: any): Array<any> {
  const priorities: Array<any> = [];
  
  const priorityInfo: Record<string, any> = {
    integrity: {
      priority: 'high',
      description: 'Mengembangkan integritas dan kejujuran',
      impact: 'Dasar untuk semua karakter lainnya'
    },
    responsibility: {
      priority: 'high',
      description: 'Meningkatkan tanggung jawab',
      impact: 'Kunci untuk kepercayaan dan kepemimpinan'
    },
    empathy: {
      priority: 'high',
      description: 'Mengembangkan empati',
      impact: 'Kritis untuk hubungan dan kerja tim'
    },
    fairness: {
      priority: 'high',
      description: 'Meningkatkan keadilan',
      impact: 'Penting untuk keadilan sosial dan kepemimpinan'
    },
    respect: {
      priority: 'medium',
      description: 'Mengembangkan rasa hormat',
      impact: 'Kunci untuk harmoni sosial'
    },
    citizenship: {
      priority: 'medium',
      description: 'Meningkatkan kewarganegaraan',
      impact: 'Penting untuk kontribusi sosial'
    },
    courage: {
      priority: 'medium',
      description: 'Mengembangkan keberanian',
      impact: 'Kunci untuk mengambil tindakan yang benar'
    },
    humility: {
      priority: 'medium',
      description: 'Mengembangkan kerendahan hati',
      impact: 'Penting untuk pembelajaran dan pertumbuhan'
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

function identifyCharacterStrengths(scores: any): string[] {
  const strengths: string[] = [];
  
  const strengthLabels: Record<string, string> = {
    integrity: 'Integritas',
    responsibility: 'Tanggung Jawab',
    empathy: 'Empati',
    fairness: 'Keadilan',
    respect: 'Rasa Hormat',
    citizenship: 'Kewarganegaraan',
    courage: 'Keberanian',
    humility: 'Kerendahan Hati'
  };
  
  for (const [component, score] of Object.entries(scores as Record<string, number>)) {
    if (score >= 70) {
      strengths.push(strengthLabels[component]);
    }
  }
  
  return strengths;
}

function identifyCharacterGrowthAreas(scores: any): string[] {
  const growthAreas: string[] = [];
  
  const growthLabels: Record<string, string> = {
    integrity: 'Integritas',
    responsibility: 'Tanggung Jawab',
    empathy: 'Empati',
    fairness: 'Keadilan',
    respect: 'Rasa Hormat',
    citizenship: 'Kewarganegaraan',
    courage: 'Keberanian',
    humility: 'Kerendahan Hati'
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
  
  if (scores.respect >= 70) {
    notes.push('Rasa hormat yang tinggi sesuai dengan nilai budaya Indonesia');
  }
  
  if (scores.citizenship >= 70) {
    notes.push('Kewarganegaraan yang kuat mendukung nilai gotong royong');
  }
  
  if (scores.humility >= 70) {
    notes.push('Kerendahan hati yang baik sesuai dengan nilai budaya Indonesia');
  }
  
  if (scores.empathy >= 70 && scores.respect >= 70) {
    notes.push('Kombinasi empati dan rasa hormat yang kuat mendukung harmoni sosial');
  }
  
  return notes.join('. ') || 'Profil karakter yang seimbang';
}
