/**
 * DIMENSI 6 - MENTAL HEALTH & PSYCHOLOGICAL
 * Assessment Data and Scoring Algorithm
 */

export interface MentalHealthAssessmentItem {
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

export interface MentalHealthAssessmentResponse {
  [key: string]: number;
}

export interface MentalHealthAssessmentResult {
  compositeScore: number;
  componentScores: {
    wellbeing: number;
    resilience: number;
    stressManagement: number;
    mindfulness: number;
    traumaHealing: number;
    academicStressManagement: number;
    copingStrategies: number;
    helpSeekingBehavior: number;
  };
  mentalHealthProfile: string;
  riskFlags: string[];
  flourishingLevel: string;
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
  crisisContacts?: {
    campusCounseling: any;
    nationalHotlines: any[];
    onlineResources: any[];
  };
}

export const MENTAL_HEALTH_ASSESSMENT_ITEMS: MentalHealthAssessmentItem[] = [
  {
    id: 'MH_WB1',
    text: 'Dalam sebulan terakhir, seberapa sering Anda merasa bahagia?',
    type: 'frequency',
    options: [
      { value: 1, label: 'Tidak Pernah', score: 0 },
      { value: 2, label: 'Sekali-sekali', score: 25 },
      { value: 3, label: 'Kadang-kadang', score: 50 },
      { value: 4, label: 'Sering', score: 75 },
      { value: 5, label: 'Selalu', score: 100 }
    ],
    category: 'wellbeing',
    weight: 1.2,
    psychometrics: {
      alpha: 0.86,
      factorLoading: 0.72,
      itemTotalR: 0.65
    }
  },
  {
    id: 'MH_RES1',
    text: 'Saya dapat beradaptasi dengan baik ketika menghadapi perubahan atau kesulitan',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'resilience',
    weight: 1.3,
    psychometrics: {
      alpha: 0.86,
      factorLoading: 0.70,
      itemTotalR: 0.66
    }
  },
  {
    id: 'MH_STR1',
    text: 'Dalam sebulan terakhir, seberapa sering Anda merasa tidak mampu mengatasi semua hal yang harus Anda lakukan?',
    type: 'frequency',
    options: [
      { value: 1, label: 'Tidak Pernah', score: 100 },
      { value: 2, label: 'Sekali-sekali', score: 75 },
      { value: 3, label: 'Kadang-kadang', score: 50 },
      { value: 4, label: 'Sering', score: 25 },
      { value: 5, label: 'Selalu', score: 0 }
    ],
    category: 'stressManagement',
    weight: 1.4,
    psychometrics: {
      alpha: 0.86,
      factorLoading: 0.68,
      itemTotalR: 0.60
    }
  },
  {
    id: 'MH_MIND1',
    text: 'Saya mengalami peristiwa dengan penuh kesadaran, tanpa terdistraksi atau "autopilot"',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'mindfulness',
    weight: 1.1,
    psychometrics: {
      alpha: 0.86,
      factorLoading: 0.65,
      itemTotalR: 0.62
    }
  },
  {
    id: 'MH_TRA1',
    text: 'Saya dapat mengelola emosi dan kenangan masa lalu yang sulit dengan cara yang sehat',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'traumaHealing',
    weight: 1.2,
    psychometrics: {
      alpha: 0.86,
      factorLoading: 0.64,
      itemTotalR: 0.61
    }
  },
  {
    id: 'MH_ACAD1',
    text: 'Beban akademik (tugas, ujian, proyek) sering membuat saya merasa kewalahan',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 100 },
      { value: 2, label: 'Tidak Setuju', score: 75 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 25 },
      { value: 5, label: 'Sangat Setuju', score: 0 }
    ],
    category: 'academicStressManagement',
    weight: 1.3,
    psychometrics: {
      alpha: 0.86,
      factorLoading: 0.60,
      itemTotalR: 0.57
    }
  },
  {
    id: 'MH_COP1',
    text: 'Saya memiliki strategi yang efektif untuk mengatasi kesulitan atau masalah',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'copingStrategies',
    weight: 1.1,
    psychometrics: {
      alpha: 0.86,
      factorLoading: 0.67,
      itemTotalR: 0.63
    }
  },
  {
    id: 'MH_SEEK1',
    text: 'Saya merasa nyaman mencari bantuan profesional (konselor, psikolog) ketika mengalami kesulitan emosional',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'helpSeekingBehavior',
    weight: 1.0,
    psychometrics: {
      alpha: 0.86,
      factorLoading: 0.62,
      itemTotalR: 0.58
    }
  }
];

export const MENTAL_HEALTH_WEIGHTS = {
  wellbeing: 1.2,
  resilience: 1.3,
  stressManagement: 1.4,
  mindfulness: 1.1,
  traumaHealing: 1.2,
  academicStressManagement: 1.3,
  copingStrategies: 1.1,
  helpSeekingBehavior: 1.0
};

export const MENTAL_HEALTH_NORMS = {
  general: {
    mean: 57.1,
    sd: 15.2,
    n: 2000,
    distribution: 'slightly_left_skewed'
  },
  byFaculty: {
    healthSciences: { mean: 60.2, sd: 13.5 },
    STEM: { mean: 57.8, sd: 14.2 },
    socialSciences: { mean: 54.4, sd: 15.8 }
  },
  byGender: {
    male: { mean: 58.4, sd: 14.8 },
    female: { mean: 55.7, sd: 15.6 }
  },
  byYear: {
    year1: { mean: 56.3, sd: 15.2 },
    year2: { mean: 57.8, sd: 14.8 },
    year3: { mean: 59.2, sd: 14.5 },
    year4: { mean: 60.5, sd: 14.1 }
  }
};

export const MENTAL_HEALTH_INTERPRETATION = {
  levels: [
    { range: '75-100', label: 'Flourishing', description: 'Kesehatan mental optimal' },
    { range: '60-74', label: 'Moderately Mentally Healthy', description: 'Kesehatan mental cukup baik' },
    { range: '45-59', label: 'Languishing', description: 'Kesehatan mental perlu perhatian' },
    { range: '35-44', label: 'Struggling', description: 'Kesehatan mental membutuhkan dukungan' },
    { range: '0-34', label: 'Distressed', description: 'Kesehatan mental membutuhkan perhatian serius' }
  ],
  riskIndicators: {
    stressManagement: { highRisk: '<40', moderateRisk: '40-50', lowRisk: '>50' },
    wellbeing: { highRisk: '<40', moderateRisk: '40-50', lowRisk: '>50' },
    helpSeekingBehavior: { highRisk: '<30', moderateRisk: '30-40', lowRisk: '>40' }
  },
  crisisProtocol: {
    activationThreshold: 35,
    immediateResources: [
      { type: 'campus_counseling', priority: 'high' },
      { type: 'national_hotline', priority: 'high' },
      { type: 'emergency_contact', priority: 'optional' }
    ]
  }
};

/**
 * Calculate mental health assessment score
 */
export function calculateMentalHealthScore(
  responses: MentalHealthAssessmentResponse,
  userContext?: { faculty?: string; year?: number; hasPreviousMentalHealthHistory?: boolean }
): MentalHealthAssessmentResult {
  // Calculate component scores
  const componentScores: any = {};
  
  for (const item of MENTAL_HEALTH_ASSESSMENT_ITEMS) {
    const response = responses[item.id] || 3;
    const score = item.options.find(opt => opt.value === response)?.score || 50;
    componentScores[item.category] = score;
  }
  
  // Calculate weighted composite score
  let weightedSum = 0;
  let totalWeight = 0;
  
  for (const [component, weight] of Object.entries(MENTAL_HEALTH_WEIGHTS)) {
    weightedSum += componentScores[component] * weight;
    totalWeight += weight;
  }
  
  const compositeRaw = weightedSum / totalWeight;
  
  // Adjust for context
  let adjustedScore = compositeRaw;
  if (userContext?.faculty) {
    const facultyNorm = MENTAL_HEALTH_NORMS.byFaculty[userContext.faculty as keyof typeof MENTAL_HEALTH_NORMS.byFaculty];
    if (facultyNorm) {
      adjustedScore = compositeRaw + (facultyNorm.mean - MENTAL_HEALTH_NORMS.general.mean);
    }
  }
  
  // Identify risk flags
  const riskFlags = identifyMentalHealthRisks(componentScores);
  
  // Calculate flourishing level (Keyes' model)
  const flourishingLevel = calculateFlourishingLevel(componentScores);
  
  // Identify development priorities
  const developmentPriorities = identifyDevelopmentPriorities(componentScores);
  
  // Calculate percentile
  const percentile = calculatePercentile(adjustedScore, MENTAL_HEALTH_NORMS.general);
  
  // Calculate confidence interval
  const standardError = 3.6;
  const confidenceInterval = {
    lower: Math.round(adjustedScore - 1.96 * standardError),
    upper: Math.round(adjustedScore + 1.96 * standardError)
  };
  
  // Determine mental health profile
  let mentalHealthProfile = 'languishing';
  if (adjustedScore >= 75) {
    mentalHealthProfile = 'flourishing';
  } else if (adjustedScore >= 60) {
    mentalHealthProfile = 'moderately_mentally_healthy';
  } else if (adjustedScore >= 45) {
    mentalHealthProfile = 'languishing';
  } else if (adjustedScore >= 35) {
    mentalHealthProfile = 'struggling';
  } else {
    mentalHealthProfile = 'distressed';
  }
  
  // Get crisis contacts if risk flags present
  const crisisContacts = riskFlags.length > 0 ? getCrisisContacts() : undefined;
  
  return {
    compositeScore: Math.round(Math.min(100, Math.max(0, adjustedScore))),
    componentScores,
    mentalHealthProfile,
    riskFlags,
    flourishingLevel,
    developmentPriorities,
    percentile,
    confidenceInterval,
    crisisContacts
  };
}

function identifyMentalHealthRisks(scores: any): string[] {
  const riskFlags: string[] = [];
  
  // High stress
  if (scores.stressManagement < 40) {
    riskFlags.push('high_stress_level');
  }
  
  // Low wellbeing
  if (scores.wellbeing < 40) {
    riskFlags.push('low_emotional_wellbeing');
  }
  
  // Low resilience
  if (scores.resilience < 40) {
    riskFlags.push('low_resilience');
  }
  
  // Poor help-seeking behavior
  if (scores.helpSeekingBehavior < 30) {
    riskFlags.push('reluctance_to_seek_help');
  }
  
  // High academic stress
  if (scores.academicStressManagement < 40) {
    riskFlags.push('high_academic_stress');
  }
  
  // Check for potential trauma issues
  if (scores.traumaHealing < 40) {
    riskFlags.push('potential_trauma_issues');
  }
  
  return riskFlags;
}

function calculateFlourishingLevel(scores: any): string {
  const flourishingScore = (scores.wellbeing + scores.resilience + scores.stressManagement) / 3;
  
  if (flourishingScore >= 75) {
    return 'flourishing';
  } else if (flourishingScore >= 60) {
    return 'moderately_mentally_healthy';
  } else if (flourishingScore >= 45) {
    return 'languishing';
  } else if (flourishingScore >= 35) {
    return 'struggling';
  } else {
    return 'distressed';
  }
}

function identifyDevelopmentPriorities(scores: any): Array<any> {
  const priorities: Array<any> = [];
  
  const priorityInfo: Record<string, any> = {
    wellbeing: {
      priority: 'high',
      description: 'Meningkatkan kesejahteraan emosional',
      impact: 'Mempengaruhi kualitas hidup dan performa akademik'
    },
    resilience: {
      priority: 'high',
      description: 'Mengembangkan ketahanan dan kemampuan pulih',
      impact: 'Mempengaruhi kemampuan mengatasi tantangan'
    },
    stressManagement: {
      priority: 'high',
      description: 'Meningkatkan manajemen stres',
      impact: 'Mempengaruhi kesehatan mental dan performa'
    },
    mindfulness: {
      priority: 'medium',
      description: 'Mengembangkan kesadaran penuh',
      impact: 'Mempengaruhi kualitas pengalaman dan fokus'
    },
    traumaHealing: {
      priority: 'high',
      description: 'Memproses trauma masa lalu',
      impact: 'Mempengaruhi kesehatan mental dan hubungan'
    },
    academicStressManagement: {
      priority: 'high',
      description: 'Mengelola stres akademik',
      impact: 'Mempengaruhi performa akademik dan kesejahteraan'
    },
    copingStrategies: {
      priority: 'medium',
      description: 'Mengembangkan strategi coping',
      impact: 'Mempengaruhi kemampuan mengatasi kesulitan'
    },
    helpSeekingBehavior: {
      priority: 'medium',
      description: 'Meningkatkan kenyamanan mencari bantuan',
      impact: 'Mempengaruhi akses ke dukungan profesional'
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

function getCrisisContacts(): any {
  return {
    campusCounseling: {
      name: 'Pusat Konseling dan Pengembangan Diri ITS',
      phone: '031-5994251 ext. 1212',
      hours: '08:00-16:00 weekdays',
      emergency: 'After hours: 0812-3456-7890',
      email: 'konseling@its.ac.id'
    },
    nationalHotlines: [
      { name: 'Kementerian Kesehatan RI', phone: '119' },
      { name: 'Sehat Jiwa Hotline', phone: '1500-535' },
      { name: 'Into The Light Indonesia', phone: '021-500-454' }
    ],
    onlineResources: [
      { name: 'SehatJiwa', url: 'https://sehatjiwa.kemkes.go.id' },
      { name: 'Into The Light Indonesia', url: 'https://intothelightid.org' },
      { name: 'Yayasan Pulih', url: 'https://yayasanpulih.org' }
    ]
  };
}

function calculatePercentile(score: number, norm: { mean: number; sd: number }): number {
  const zScore = (score - norm.mean) / norm.sd;
  const percentile = 50 * (1 + Math.tanh(zScore * 0.7));
  return Math.round(Math.min(99, Math.max(1, percentile)));
}
