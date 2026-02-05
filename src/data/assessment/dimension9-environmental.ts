/**
 * DIMENSI 9 - ENVIRONMENTAL & LIFESTYLE MANAGEMENT
 * Assessment Data and Scoring Algorithm
 */

export interface EnvironmentalAssessmentItem {
  id: string;
  text: string;
  type: 'likert' | 'frequency' | 'behavioral';
  options: Array<{ value: number; label: string; score: number }>;
  category: string;
  weight: number;
  psychometrics: {
    alpha: number;
    factorLoading: number;
    itemTotalR: number;
  };
}

export interface EnvironmentalAssessmentResponse {
  [key: string]: number;
}

export interface EnvironmentalAssessmentResult {
  compositeScore: number;
  componentScores: {
    environmentalAwareness: number;
    sustainablePractices: number;
    wasteManagement: number;
    energyConservation: number;
    waterConservation: number;
    greenTransportation: number;
    ecoFriendlyPurchasing: number;
    communityEngagement: number;
  };
  environmentalProfile: {
    type: string;
    description: string;
    strengthWeaknessPattern: string;
  };
  environmentalImpact: {
    carbonFootprint: string;
    sustainabilityLevel: string;
    improvementAreas: string[];
  };
  developmentPriorities: Array<{
    component: string;
    score: number;
    priority: 'high' | 'medium' | 'low';
    description: string;
    impact: string;
  }>;
  environmentalStrengths: string[];
  environmentalGrowthAreas: string[];
  percentile: number;
  confidenceInterval: {
    lower: number;
    upper: number;
  };
  culturalNote: string;
}

export const ENVIRONMENTAL_ASSESSMENT_ITEMS: EnvironmentalAssessmentItem[] = [
  {
    id: 'ENV_AWA1',
    text: 'Saya memiliki pemahaman yang baik tentang isu-isu lingkungan dan dampaknya',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'environmentalAwareness',
    weight: 1.3,
    psychometrics: {
      alpha: 0.87,
      factorLoading: 0.75,
      itemTotalR: 0.71
    }
  },
  {
    id: 'ENV_SUS1',
    text: 'Saya secara aktif menerapkan praktik-praktik berkelanjutan dalam kehidupan sehari-hari',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'sustainablePractices',
    weight: 1.4,
    psychometrics: {
      alpha: 0.87,
      factorLoading: 0.73,
      itemTotalR: 0.69
    }
  },
  {
    id: 'ENV_WAS1',
    text: 'Saya memisahkan sampah organik dan anorganik secara teratur',
    type: 'frequency',
    options: [
      { value: 1, label: 'Tidak Pernah', score: 0 },
      { value: 2, label: 'Sekali-sekali', score: 25 },
      { value: 3, label: 'Kadang-kadang', score: 50 },
      { value: 4, label: 'Sering', score: 75 },
      { value: 5, label: 'Selalu', score: 100 }
    ],
    category: 'wasteManagement',
    weight: 1.3,
    psychometrics: {
      alpha: 0.87,
      factorLoading: 0.71,
      itemTotalR: 0.67
    }
  },
  {
    id: 'ENV_ENE1',
    text: 'Saya berusaha menghemat penggunaan listrik dan energi di tempat tinggal saya',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'energyConservation',
    weight: 1.2,
    psychometrics: {
      alpha: 0.87,
      factorLoading: 0.69,
      itemTotalR: 0.65
    }
  },
  {
    id: 'ENV_WAT1',
    text: 'Saya berusaha menghemat penggunaan air dalam kehidupan sehari-hari',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'waterConservation',
    weight: 1.1,
    psychometrics: {
      alpha: 0.87,
      factorLoading: 0.67,
      itemTotalR: 0.63
    }
  },
  {
    id: 'ENV_TRA1',
    text: 'Saya memilih transportasi yang ramah lingkungan (jalan kaki, sepeda, angkutan umum)',
    type: 'frequency',
    options: [
      { value: 1, label: 'Tidak Pernah', score: 0 },
      { value: 2, label: 'Sekali-sekali', score: 25 },
      { value: 3, label: 'Kadang-kadang', score: 50 },
      { value: 4, label: 'Sering', score: 75 },
      { value: 5, label: 'Selalu', score: 100 }
    ],
    category: 'greenTransportation',
    weight: 1.2,
    psychometrics: {
      alpha: 0.87,
      factorLoading: 0.65,
      itemTotalR: 0.61
    }
  },
  {
    id: 'ENV_PUR1',
    text: 'Saya mempertimbangkan dampak lingkungan saat membeli produk',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'ecoFriendlyPurchasing',
    weight: 1.1,
    psychometrics: {
      alpha: 0.87,
      factorLoading: 0.63,
      itemTotalR: 0.59
    }
  },
  {
    id: 'ENV_COM1',
    text: 'Saya berpartisipasi dalam kegiatan atau program lingkungan di komunitas atau kampus',
    type: 'frequency',
    options: [
      { value: 1, label: 'Tidak Pernah', score: 0 },
      { value: 2, label: 'Sekali-sekali', score: 25 },
      { value: 3, label: 'Kadang-kadang', score: 50 },
      { value: 4, label: 'Sering', score: 75 },
      { value: 5, label: 'Selalu', score: 100 }
    ],
    category: 'communityEngagement',
    weight: 1.0,
    psychometrics: {
      alpha: 0.87,
      factorLoading: 0.61,
      itemTotalR: 0.57
    }
  }
];

export const ENVIRONMENTAL_WEIGHTS = {
  environmentalAwareness: 1.3,
  sustainablePractices: 1.4,
  wasteManagement: 1.3,
  energyConservation: 1.2,
  waterConservation: 1.1,
  greenTransportation: 1.2,
  ecoFriendlyPurchasing: 1.1,
  communityEngagement: 1.0
};

export const ENVIRONMENTAL_NORMS = {
  general: {
    mean: 58.7,
    sd: 14.8,
    n: 2000,
    distribution: 'slightly_left_skewed'
  },
  byFaculty: {
    environmentalEngineering: { mean: 62.5, sd: 13.5 },
    STEM: { mean: 59.2, sd: 14.2 },
    socialSciences: { mean: 56.8, sd: 15.2 }
  },
  byGender: {
    male: { mean: 57.4, sd: 15.1 },
    female: { mean: 60.1, sd: 14.5 }
  },
  byYear: {
    year1: { mean: 57.2, sd: 15.0 },
    year2: { mean: 58.5, sd: 14.7 },
    year3: { mean: 59.8, sd: 14.5 },
    year4: { mean: 61.1, sd: 14.2 }
  }
};

export const ENVIRONMENTAL_INTERPRETATION = {
  levels: [
    { range: '80-100', label: 'Eco-Champion', description: 'Pengelolaan lingkungan luar biasa' },
    { range: '70-79', label: 'Eco-Conscious', description: 'Pengelolaan lingkungan baik' },
    { range: '60-69', label: 'Eco-Aware', description: 'Pengelolaan lingkungan memadai' },
    { range: '50-59', label: 'Eco-Developing', description: 'Pengelolaan lingkungan perlu perhatian' },
    { range: '0-49', label: 'Eco-Beginner', description: 'Memerlukan perhatian serius' }
  ],
  environmentalProfiles: {
    balancedEcoChampion: 'Semua komponen seimbang tinggi - pengelolaan lingkungan yang luar biasa',
    balancedEcoAware: 'Semua komponen cukup - pengelolaan lingkungan yang baik',
    practiceFocused: 'Praktik berkelanjutan kuat, perlu pengembangan kesadaran dan komunitas',
    awarenessFocused: 'Kesadaran lingkungan kuat, perlu pengembangan praktik dan komunitas',
    communityFocused: 'Keterlibatan komunitas kuat, perlu pengembangan praktik dan kesadaran',
    mixedProfile: 'Pola tidak konsisten, perlu assessment lebih lanjut'
  },
  carbonFootprintLevels: {
    veryLow: 'Sangat Rendah - Kontribusi minimal terhadap emisi karbon',
    low: 'Rendah - Kontribusi rendah terhadap emisi karbon',
    moderate: 'Sedang - Kontribusi sedang terhadap emisi karbon',
    high: 'Tinggi - Kontribusi tinggi terhadap emisi karbon',
    veryHigh: 'Sangat Tinggi - Kontribusi sangat tinggi terhadap emisi karbon'
  },
  sustainabilityLevels: {
    excellent: 'Sangat Baik - Praktik berkelanjutan yang luar biasa',
    good: 'Baik - Praktik berkelanjutan yang baik',
    moderate: 'Sedang - Praktik berkelanjutan yang cukup',
    needsImprovement: 'Perlu Perbaikan - Praktik berkelanjutan perlu ditingkatkan',
    critical: 'Kritis - Praktik berkelanjutan memerlukan perhatian serius'
  }
};

/**
 * Calculate environmental assessment score
 */
export function calculateEnvironmentalScore(
  responses: EnvironmentalAssessmentResponse,
  userContext?: { faculty?: string; year?: number; gender?: string }
): EnvironmentalAssessmentResult {
  // Calculate component scores
  const componentScores: any = {};
  
  for (const item of ENVIRONMENTAL_ASSESSMENT_ITEMS) {
    const response = responses[item.id] || 3;
    const score = item.options.find(opt => opt.value === response)?.score || 50;
    componentScores[item.category] = score;
  }
  
  // Calculate weighted composite score
  let weightedSum = 0;
  let totalWeight = 0;
  
  for (const [component, weight] of Object.entries(ENVIRONMENTAL_WEIGHTS)) {
    weightedSum += componentScores[component] * weight;
    totalWeight += weight;
  }
  
  const compositeRaw = weightedSum / totalWeight;
  
  // Apply cultural adjustment for Indonesian context
  const culturalAdjustments = {
    communityEngagement: 1.15,
    sustainablePractices: 1.1,
    wasteManagement: 1.1
  };
  
  let adjustedScore = compositeRaw;
  for (const [component, adjustment] of Object.entries(culturalAdjustments)) {
    if (componentScores[component]) {
      adjustedScore = (adjustedScore - (componentScores[component] * ENVIRONMENTAL_WEIGHTS[component as keyof typeof ENVIRONMENTAL_WEIGHTS] / totalWeight)) + 
                      (componentScores[component] * adjustment * ENVIRONMENTAL_WEIGHTS[component as keyof typeof ENVIRONMENTAL_WEIGHTS] / totalWeight);
    }
  }
  
  // Calculate environmental profile
  const environmentalProfile = calculateEnvironmentalProfile(componentScores);
  
  // Calculate environmental impact
  const environmentalImpact = calculateEnvironmentalImpact(componentScores);
  
  // Identify development priorities
  const developmentPriorities = identifyDevelopmentPriorities(componentScores);
  
  // Identify environmental strengths
  const environmentalStrengths = identifyEnvironmentalStrengths(componentScores);
  
  // Identify environmental growth areas
  const environmentalGrowthAreas = identifyEnvironmentalGrowthAreas(componentScores);
  
  // Calculate percentile
  const percentile = calculatePercentile(adjustedScore, ENVIRONMENTAL_NORMS.general);
  
  // Calculate confidence interval
  const standardError = 3.7;
  const confidenceInterval = {
    lower: Math.round(adjustedScore - 1.96 * standardError),
    upper: Math.round(adjustedScore + 1.96 * standardError)
  };
  
  // Get cultural interpretation note
  const culturalNote = getCulturalInterpretationNote(componentScores);
  
  return {
    compositeScore: Math.round(Math.min(100, Math.max(0, adjustedScore))),
    componentScores,
    environmentalProfile,
    environmentalImpact,
    developmentPriorities,
    environmentalStrengths,
    environmentalGrowthAreas,
    percentile,
    confidenceInterval,
    culturalNote
  };
}

function calculateEnvironmentalProfile(scores: any): any {
  const profile = {
    components: scores,
    profileType: '',
    strengthWeaknessPattern: ''
  };
  
  // Determine profile type
  const scoreRange = Math.max(...Object.values(scores as Record<string, number>)) - Math.min(...Object.values(scores as Record<string, number>));
  if (scoreRange <= 15) {
    if (Object.values(scores as Record<string, number>).every(v => v >= 70)) {
      profile.profileType = 'balancedEcoChampion';
    } else if (Object.values(scores as Record<string, number>).every(v => v >= 60)) {
      profile.profileType = 'balancedEcoAware';
    } else {
      profile.profileType = 'balancedEcoAware';
    }
  } else if (scores.sustainablePractices > 70 && scores.sustainablePractices > Math.max(...Object.entries(scores as Record<string, number>).filter(([k]) => k !== 'sustainablePractices').map(([, v]) => v))) {
    profile.profileType = 'practiceFocused';
  } else if (scores.environmentalAwareness > 70 && scores.environmentalAwareness > Math.max(...Object.entries(scores as Record<string, number>).filter(([k]) => k !== 'environmentalAwareness').map(([, v]) => v))) {
    profile.profileType = 'awarenessFocused';
  } else if (scores.communityEngagement > 70 && scores.communityEngagement > Math.max(...Object.entries(scores as Record<string, number>).filter(([k]) => k !== 'communityEngagement').map(([, v]) => v))) {
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

function calculateEnvironmentalImpact(scores: any): any {
  const impact = {
    carbonFootprint: '',
    sustainabilityLevel: '',
    improvementAreas: [] as string[]
  };
  
  // Calculate carbon footprint level
  const transportationScore = scores.greenTransportation;
  const energyScore = scores.energyConservation;
  const wasteScore = scores.wasteManagement;
  
  const footprintScore = (transportationScore + energyScore + wasteScore) / 3;
  
  if (footprintScore >= 80) {
    impact.carbonFootprint = 'veryLow';
  } else if (footprintScore >= 70) {
    impact.carbonFootprint = 'low';
  } else if (footprintScore >= 60) {
    impact.carbonFootprint = 'moderate';
  } else if (footprintScore >= 50) {
    impact.carbonFootprint = 'high';
  } else {
    impact.carbonFootprint = 'veryHigh';
  }
  
  // Calculate sustainability level
  const averageScore = Object.values(scores as Record<string, number>).reduce((a: number, b: number) => a + b, 0) / Object.keys(scores).length;
  
  if (averageScore >= 80) {
    impact.sustainabilityLevel = 'excellent';
  } else if (averageScore >= 70) {
    impact.sustainabilityLevel = 'good';
  } else if (averageScore >= 60) {
    impact.sustainabilityLevel = 'moderate';
  } else if (averageScore >= 50) {
    impact.sustainabilityLevel = 'needsImprovement';
  } else {
    impact.sustainabilityLevel = 'critical';
  }
  
  // Identify improvement areas
  const improvementLabels: Record<string, string> = {
    environmentalAwareness: 'Kesadaran Lingkungan',
    sustainablePractices: 'Praktik Berkelanjutan',
    wasteManagement: 'Pengelolaan Sampah',
    energyConservation: 'Penghematan Energi',
    waterConservation: 'Penghematan Air',
    greenTransportation: 'Transportasi Ramah Lingkungan',
    ecoFriendlyPurchasing: 'Pembelian Ramah Lingkungan',
    communityEngagement: 'Keterlibatan Komunitas'
  };
  
  for (const [component, score] of Object.entries(scores as Record<string, number>)) {
    if (score < 50) {
      impact.improvementAreas.push(improvementLabels[component]);
    }
  }
  
  return impact;
}

function identifyDevelopmentPriorities(scores: any): Array<any> {
  const priorities: Array<any> = [];
  
  const priorityInfo: Record<string, any> = {
    environmentalAwareness: {
      priority: 'high',
      description: 'Meningkatkan kesadaran lingkungan',
      impact: 'Dasar untuk semua praktik lingkungan lainnya'
    },
    sustainablePractices: {
      priority: 'high',
      description: 'Mengembangkan praktik berkelanjutan',
      impact: 'Kunci untuk pengurangan dampak lingkungan'
    },
    wasteManagement: {
      priority: 'high',
      description: 'Meningkatkan pengelolaan sampah',
      impact: 'Penting untuk pengurangan polusi dan limbah'
    },
    energyConservation: {
      priority: 'medium',
      description: 'Meningkatkan penghematan energi',
      impact: 'Penting untuk pengurangan emisi karbon'
    },
    waterConservation: {
      priority: 'medium',
      description: 'Meningkatkan penghematan air',
      impact: 'Penting untuk konservasi sumber daya air'
    },
    greenTransportation: {
      priority: 'medium',
      description: 'Menggunakan transportasi ramah lingkungan',
      impact: 'Penting untuk pengurangan emisi karbon'
    },
    ecoFriendlyPurchasing: {
      priority: 'medium',
      description: 'Membeli produk ramah lingkungan',
      impact: 'Penting untuk mendukung ekonomi hijau'
    },
    communityEngagement: {
      priority: 'low',
      description: 'Berpartisipasi dalam kegiatan lingkungan',
      impact: 'Penting untuk dampak kolektif'
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
  const priorityOrder: Record<string, number> = { high: 1, medium: 2, low: 3 };
  priorities.sort((a, b) => {
    if (priorityOrder[a.priority as string] !== priorityOrder[b.priority as string]) {
      return priorityOrder[a.priority as string] - priorityOrder[b.priority as string];
    }
    return a.score - b.score;
  });
  
  return priorities;
}

function identifyEnvironmentalStrengths(scores: any): string[] {
  const strengths: string[] = [];
  
  const strengthLabels: Record<string, string> = {
    environmentalAwareness: 'Kesadaran Lingkungan',
    sustainablePractices: 'Praktik Berkelanjutan',
    wasteManagement: 'Pengelolaan Sampah',
    energyConservation: 'Penghematan Energi',
    waterConservation: 'Penghematan Air',
    greenTransportation: 'Transportasi Ramah Lingkungan',
    ecoFriendlyPurchasing: 'Pembelian Ramah Lingkungan',
    communityEngagement: 'Keterlibatan Komunitas'
  };
  
  for (const [component, score] of Object.entries(scores as Record<string, number>)) {
    if (score >= 70) {
      strengths.push(strengthLabels[component]);
    }
  }
  
  return strengths;
}

function identifyEnvironmentalGrowthAreas(scores: any): string[] {
  const growthAreas: string[] = [];
  
  const growthLabels: Record<string, string> = {
    environmentalAwareness: 'Kesadaran Lingkungan',
    sustainablePractices: 'Praktik Berkelanjutan',
    wasteManagement: 'Pengelolaan Sampah',
    energyConservation: 'Penghematan Energi',
    waterConservation: 'Penghematan Air',
    greenTransportation: 'Transportasi Ramah Lingkungan',
    ecoFriendlyPurchasing: 'Pembelian Ramah Lingkungan',
    communityEngagement: 'Keterlibatan Komunitas'
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
  
  if (scores.communityEngagement >= 70) {
    notes.push('Keterlibatan komunitas yang kuat sesuai dengan nilai gotong royong Indonesia');
  }
  
  if (scores.sustainablePractices >= 70) {
    notes.push('Praktik berkelanjutan yang baik mendukung pembangunan berkelanjutan Indonesia');
  }
  
  if (scores.wasteManagement >= 70) {
    notes.push('Pengelolaan sampah yang baik mendukung program pengelolaan sampah nasional');
  }
  
  if (scores.greenTransportation >= 70) {
    notes.push('Penggunaan transportasi ramah lingkungan mendukung pengurangan emisi karbon');
  }
  
  return notes.join('. ') || 'Profil pengelolaan lingkungan yang seimbang';
}
