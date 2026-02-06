/**
 * DIMENSI 2 - SELF-MANAGEMENT & PRODUCTIVITY
 * Assessment Data and Scoring Algorithm
 */

export interface SelfManagementAssessmentItem {
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

export interface SelfManagementAssessmentResponse {
  [key: string]: number;
}

export interface SelfManagementAssessmentResult {
  compositeScore: number;
  componentScores: {
    goalSetting: number;
    timeManagement: number;
    selfDiscipline: number;
    focusConcentration: number;
    taskPrioritization: number;
    procrastinationManagement: number;
    productivityHabits: number;
    selfMotivation: number;
  };
  productivityProfile: string;
  developmentPriorities: Array<{
    component: string;
    score: number;
    priority: 'high' | 'medium' | 'low';
    description: string;
    impact: string;
  }>;
  productivityIndex: number;
  percentile: number;
  confidenceInterval: {
    lower: number;
    upper: number;
  };
}

export const SELF_MANAGEMENT_ASSESSMENT_ITEMS: SelfManagementAssessmentItem[] = [
  {
    id: 'SM_GS1',
    text: 'Saya menetapkan tujuan yang spesifik, terukur, dan dapat dicapai (SMART goals)',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'goalSetting',
    weight: 1.3,
    psychometrics: {
      alpha: 0.87,
      factorLoading: 0.74,
      itemTotalR: 0.70
    }
  },
  {
    id: 'SM_TM1',
    text: 'Saya dapat mengatur waktu saya dengan efektif untuk menyelesaikan tugas dan tanggung jawab',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'timeManagement',
    weight: 1.4,
    psychometrics: {
      alpha: 0.87,
      factorLoading: 0.76,
      itemTotalR: 0.72
    }
  },
  {
    id: 'SM_SD1',
    text: 'Saya dapat menahan diri dari godaan yang mengganggu produktivitas saya',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'selfDiscipline',
    weight: 1.3,
    psychometrics: {
      alpha: 0.87,
      factorLoading: 0.72,
      itemTotalR: 0.68
    }
  },
  {
    id: 'SM_FC1',
    text: 'Saya dapat mempertahankan fokus dan konsentrasi saat mengerjakan tugas penting',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'focusConcentration',
    weight: 1.2,
    psychometrics: {
      alpha: 0.87,
      factorLoading: 0.70,
      itemTotalR: 0.66
    }
  },
  {
    id: 'SM_TP1',
    text: 'Saya dapat memprioritaskan tugas berdasarkan urgensi dan kepentingannya',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'taskPrioritization',
    weight: 1.2,
    psychometrics: {
      alpha: 0.87,
      factorLoading: 0.68,
      itemTotalR: 0.64
    }
  },
  {
    id: 'SM_PM1',
    text: 'Saya jarang menunda tugas yang penting (procrastination)',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'procrastinationManagement',
    weight: 1.3,
    psychometrics: {
      alpha: 0.87,
      factorLoading: 0.71,
      itemTotalR: 0.67
    }
  },
  {
    id: 'SM_PH1',
    text: 'Saya memiliki kebiasaan produktif yang konsisten dalam kehidupan sehari-hari',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'productivityHabits',
    weight: 1.1,
    psychometrics: {
      alpha: 0.87,
      factorLoading: 0.66,
      itemTotalR: 0.62
    }
  },
  {
    id: 'SM_SM1',
    text: 'Saya memiliki motivasi diri yang kuat untuk mencapai tujuan saya',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'selfMotivation',
    weight: 1.2,
    psychometrics: {
      alpha: 0.87,
      factorLoading: 0.69,
      itemTotalR: 0.65
    }
  }
];

export const SELF_MANAGEMENT_WEIGHTS = {
  goalSetting: 1.3,
  timeManagement: 1.4,
  selfDiscipline: 1.3,
  focusConcentration: 1.2,
  taskPrioritization: 1.2,
  procrastinationManagement: 1.3,
  productivityHabits: 1.1,
  selfMotivation: 1.2
};

export const SELF_MANAGEMENT_NORMS = {
  general: {
    mean: 57.8,
    sd: 14.5,
    n: 2000,
    distribution: 'normal'
  },
  byFaculty: {
    STEM: { mean: 59.2, sd: 13.8 },
    socialSciences: { mean: 57.5, sd: 14.2 },
    humanities: { mean: 56.8, sd: 15.1 }
  },
  byYear: {
    year1: { mean: 54.3, sd: 15.2 },
    year2: { mean: 57.8, sd: 14.5 },
    year3: { mean: 59.5, sd: 14.1 },
    year4: { mean: 60.2, sd: 13.8 }
  }
};

export const SELF_MANAGEMENT_INTERPRETATION = {
  levels: [
    { range: '80-100', label: 'Exceptional Productivity', description: 'Produktivitas luar biasa' },
    { range: '70-79', label: 'High Productivity', description: 'Produktivitas sangat tinggi' },
    { range: '60-69', label: 'Good Productivity', description: 'Produktivitas baik' },
    { range: '50-59', label: 'Moderate Productivity', description: 'Produktivitas sedang' },
    { range: '40-49', label: 'Developing Productivity', description: 'Produktivitas sedang berkembang' },
    { range: '0-39', label: 'Needs Development', description: 'Perlu pengembangan produktivitas' }
  ],
  profiles: {
    disciplinedAchiever: 'Achiever Disiplin - Kuat dalam disiplin dan manajemen waktu',
    strategicPlanner: 'Perencana Strategis - Kuat dalam perencanaan dan prioritas',
    focusedWorker: 'Pekerja Fokus - Kuat dalam konsentrasi dan fokus',
    selfMotivated: 'Motivasi Diri Tinggi - Kuat dalam motivasi dan kebiasaan produktif',
    balancedProductive: 'Produktif Seimbang - Seimbang di semua area manajemen diri',
    developingProductivity: 'Produktivitas Berkembang - Sedang mengembangkan manajemen diri'
  }
};

/**
 * Calculate self-management assessment score
 */
export function calculateSelfManagementScore(
  responses: SelfManagementAssessmentResponse,
  userContext?: { faculty?: string; year?: number }
): SelfManagementAssessmentResult {
  // Calculate component scores
  const componentScores: any = {};
  
  for (const item of SELF_MANAGEMENT_ASSESSMENT_ITEMS) {
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
    finalComponentScores[component] = (scores as number[]).reduce((a: number, b: number) => a + b, 0) / (scores as number[]).length;
  }
  
  // Calculate weighted composite score
  let weightedSum = 0;
  let totalWeight = 0;
  
  for (const [component, weight] of Object.entries(SELF_MANAGEMENT_WEIGHTS)) {
    weightedSum += finalComponentScores[component] * weight;
    totalWeight += weight;
  }
  
  const compositeRaw = weightedSum / totalWeight;
  
  // Adjust for context
  let adjustedScore = compositeRaw;
  if (userContext?.faculty) {
    const facultyNorm = SELF_MANAGEMENT_NORMS.byFaculty[userContext.faculty as keyof typeof SELF_MANAGEMENT_NORMS.byFaculty];
    if (facultyNorm) {
      adjustedScore = compositeRaw + (facultyNorm.mean - SELF_MANAGEMENT_NORMS.general.mean);
    }
  }
  
  // Determine productivity profile
  const sortedComponents = Object.entries(finalComponentScores as Record<string, number>).sort((a, b) => b[1] - a[1]);
  const topComponents = sortedComponents.slice(0, 2).map(([comp]) => comp);
  
  let productivityProfile = 'developingProductivity';
  if (adjustedScore >= 70) {
    productivityProfile = 'balancedProductive';
  } else if (topComponents.includes('selfDiscipline') && topComponents.includes('timeManagement')) {
    productivityProfile = 'disciplinedAchiever';
  } else if (topComponents.includes('goalSetting') && topComponents.includes('taskPrioritization')) {
    productivityProfile = 'strategicPlanner';
  } else if (topComponents.includes('focusConcentration') && topComponents.includes('selfMotivation')) {
    productivityProfile = 'focusedWorker';
  } else if (topComponents.includes('selfMotivation') && topComponents.includes('productivityHabits')) {
    productivityProfile = 'selfMotivated';
  }
  
  // Identify development priorities
  const developmentPriorities = Object.entries(finalComponentScores as Record<string, number>)
    .filter(([_, score]) => score < 50)
    .map(([component, score]) => ({
      component,
      score,
      priority: (score < 40 ? 'high' : score < 50 ? 'medium' : 'low') as 'high' | 'medium' | 'low',
      description: getComponentDescription(component),
      impact: getComponentImpact(component)
    }))
    .sort((a, b) => a.score - b.score);
  
  // Calculate productivity index
  const productivityIndex = calculateProductivityIndex(finalComponentScores);
  
  // Calculate percentile
  const percentile = calculatePercentile(adjustedScore, SELF_MANAGEMENT_NORMS.general);
  
  // Calculate confidence interval
  const standardError = 3.8;
  const confidenceInterval = {
    lower: Math.round(adjustedScore - 1.96 * standardError),
    upper: Math.round(adjustedScore + 1.96 * standardError)
  };
  
  return {
    compositeScore: Math.round(Math.min(100, Math.max(0, adjustedScore))),
    componentScores: finalComponentScores,
    productivityProfile,
    developmentPriorities,
    productivityIndex,
    percentile,
    confidenceInterval
  };
}

function getComponentDescription(component: string): string {
  const descriptions: Record<string, string> = {
    goalSetting: 'Mengembangkan kemampuan menetapkan tujuan yang efektif',
    timeManagement: 'Meningkatkan manajemen waktu dan prioritas',
    selfDiscipline: 'Mengembangkan disiplin diri dan kontrol diri',
    focusConcentration: 'Meningkatkan kemampuan fokus dan konsentrasi',
    taskPrioritization: 'Meningkatkan kemampuan memprioritaskan tugas',
    procrastinationManagement: 'Mengurangi kebiasaan menunda tugas',
    productivityHabits: 'Mengembangkan kebiasaan produktif yang konsisten',
    selfMotivation: 'Meningkatkan motivasi diri dan ketekunan'
  };
  return descriptions[component] || component;
}

function getComponentImpact(component: string): string {
  const impacts: Record<string, string> = {
    goalSetting: 'Mempengaruhi pencapaian tujuan dan arah hidup',
    timeManagement: 'Mempengaruhi efisiensi dan efektivitas kerja',
    selfDiscipline: 'Mempengaruhi konsistensi dan kualitas hasil',
    focusConcentration: 'Mempengaruhi kualitas dan kecepatan kerja',
    taskPrioritization: 'Mempengaruhi penyelesaian tugas yang tepat waktu',
    procrastinationManagement: 'Mempengaruhi produktivitas dan stres',
    productivityHabits: 'Mempengaruhi hasil jangka panjang',
    selfMotivation: 'Mempengaruhi ketekunan dan pencapaian tujuan'
  };
  return impacts[component] || 'Mempengaruhi produktivitas';
}

function calculateProductivityIndex(scores: any): number {
  const keyComponents = ['timeManagement', 'selfDiscipline', 'focusConcentration', 'taskPrioritization'];
  const avgScore = keyComponents.reduce((sum, comp) => sum + (scores[comp] || 0), 0) / keyComponents.length;
  return Math.round(avgScore);
}

function calculatePercentile(score: number, norm: { mean: number; sd: number }): number {
  const zScore = (score - norm.mean) / norm.sd;
  const percentile = 50 * (1 + Math.tanh(zScore * 0.7));
  return Math.round(Math.min(99, Math.max(1, percentile)));
}
