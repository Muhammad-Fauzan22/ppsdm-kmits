/**
 * DIMENSI 3 - FINANCIAL INTELLIGENCE
 * Assessment Data and Scoring Algorithm
 */

export interface FinancialAssessmentItem {
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

export interface FinancialAssessmentResponse {
  [key: string]: number;
}

export interface FinancialAssessmentResult {
  compositeScore: number;
  componentScores: {
    financialKnowledge: number;
    budgeting: number;
    savingHabits: number;
    investmentAwareness: number;
    debtManagement: number;
    financialPlanning: number;
    consumerBehavior: number;
    financialGoals: number;
  };
  financialProfile: string;
  developmentPriorities: Array<{
    component: string;
    score: number;
    priority: 'high' | 'medium' | 'low';
    description: string;
    impact: string;
  }>;
  financialLiteracyLevel: string;
  percentile: number;
  confidenceInterval: {
    lower: number;
    upper: number;
  };
}

export const FINANCIAL_ASSESSMENT_ITEMS: FinancialAssessmentItem[] = [
  {
    id: 'FIN_FK1',
    text: 'Saya memiliki pengetahuan yang baik tentang konsep keuangan dasar (bunga, inflasi, investasi)',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'financialKnowledge',
    weight: 1.3,
    psychometrics: {
      alpha: 0.85,
      factorLoading: 0.72,
      itemTotalR: 0.68
    }
  },
  {
    id: 'FIN_BG1',
    text: 'Saya membuat anggaran bulanan dan memantau pengeluaran saya',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'budgeting',
    weight: 1.4,
    psychometrics: {
      alpha: 0.85,
      factorLoading: 0.74,
      itemTotalR: 0.70
    }
  },
  {
    id: 'FIN_SH1',
    text: 'Saya secara teratur menyisihkan sebagian uang untuk tabungan',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'savingHabits',
    weight: 1.3,
    psychometrics: {
      alpha: 0.85,
      factorLoading: 0.70,
      itemTotalR: 0.66
    }
  },
  {
    id: 'FIN_IA1',
    text: 'Saya memahami berbagai jenis investasi dan risikonya',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'investmentAwareness',
    weight: 1.2,
    psychometrics: {
      alpha: 0.85,
      factorLoading: 0.68,
      itemTotalR: 0.64
    }
  },
  {
    id: 'FIN_DM1',
    text: 'Saya menghindari hutang yang tidak perlu dan mengelola hutang dengan bijak',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'debtManagement',
    weight: 1.3,
    psychometrics: {
      alpha: 0.85,
      factorLoading: 0.71,
      itemTotalR: 0.67
    }
  },
  {
    id: 'FIN_FP1',
    text: 'Saya memiliki rencana keuangan jangka panjang (pensiun, pembelian rumah, dll.)',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'financialPlanning',
    weight: 1.2,
    psychometrics: {
      alpha: 0.85,
      factorLoading: 0.69,
      itemTotalR: 0.65
    }
  },
  {
    id: 'FIN_CB1',
    text: 'Saya berbelanja secara bijak dan menghindari pembelian impulsif',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'consumerBehavior',
    weight: 1.1,
    psychometrics: {
      alpha: 0.85,
      factorLoading: 0.66,
      itemTotalR: 0.62
    }
  },
  {
    id: 'FIN_FG1',
    text: 'Saya memiliki tujuan keuangan yang jelas dan rencana untuk mencapainya',
    type: 'likert',
    options: [
      { value: 1, label: 'Sangat Tidak Setuju', score: 0 },
      { value: 2, label: 'Tidak Setuju', score: 25 },
      { value: 3, label: 'Netral', score: 50 },
      { value: 4, label: 'Setuju', score: 75 },
      { value: 5, label: 'Sangat Setuju', score: 100 }
    ],
    category: 'financialGoals',
    weight: 1.2,
    psychometrics: {
      alpha: 0.85,
      factorLoading: 0.67,
      itemTotalR: 0.63
    }
  }
];

export const FINANCIAL_WEIGHTS = {
  financialKnowledge: 1.3,
  budgeting: 1.4,
  savingHabits: 1.3,
  investmentAwareness: 1.2,
  debtManagement: 1.3,
  financialPlanning: 1.2,
  consumerBehavior: 1.1,
  financialGoals: 1.2
};

export const FINANCIAL_NORMS = {
  general: {
    mean: 56.5,
    sd: 14.8,
    n: 2000,
    distribution: 'normal'
  },
  byFaculty: {
    STEM: { mean: 58.2, sd: 13.5 },
    socialSciences: { mean: 56.8, sd: 14.2 },
    humanities: { mean: 54.5, sd: 15.1 }
  },
  byYear: {
    year1: { mean: 53.3, sd: 15.2 },
    year2: { mean: 56.7, sd: 14.5 },
    year3: { mean: 58.2, sd: 14.1 },
    year4: { mean: 59.8, sd: 13.8 }
  }
};

export const FINANCIAL_INTERPRETATION = {
  levels: [
    { range: '80-100', label: 'Exceptional Financial', description: 'Kecerdasan finansial luar biasa' },
    { range: '70-79', label: 'Advanced Financial', description: 'Kecerdasan finansial sangat baik' },
    { range: '60-69', label: 'Proficient Financial', description: 'Kecerdasan finansial baik' },
    { range: '50-59', label: 'Developing Financial', description: 'Kecerdasan finansial sedang berkembang' },
    { range: '40-49', label: 'Emerging Financial', description: 'Kecerdasan finansial mulai berkembang' },
    { range: '0-39', label: 'Needs Development', description: 'Perlu pengembangan kecerdasan finansial' }
  ],
  profiles: {
    savvyInvestor: 'Investor Cerdas - Kuat dalam pengetahuan dan investasi',
    disciplinedSaver: 'Penabung Disiplin - Kuat dalam tabungan dan anggaran',
    prudentSpender: 'Pengeluar Bijak - Kuat dalam perilaku konsumen',
    balancedFinancial: 'Finansial Seimbang - Seimbang di semua area keuangan',
    developingFinancial: 'Finansial Berkembang - Sedang mengembangkan kecerdasan finansial'
  }
};

/**
 * Calculate financial assessment score
 */
export function calculateFinancialScore(
  responses: FinancialAssessmentResponse,
  userContext?: { faculty?: string; year?: number }
): FinancialAssessmentResult {
  // Calculate component scores
  const componentScores: any = {};
  
  for (const item of FINANCIAL_ASSESSMENT_ITEMS) {
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
  
  for (const [component, weight] of Object.entries(FINANCIAL_WEIGHTS)) {
    weightedSum += finalComponentScores[component] * weight;
    totalWeight += weight;
  }
  
  const compositeRaw = weightedSum / totalWeight;
  
  // Adjust for context
  let adjustedScore = compositeRaw;
  if (userContext?.faculty) {
    const facultyNorm = FINANCIAL_NORMS.byFaculty[userContext.faculty as keyof typeof FINANCIAL_NORMS.byFaculty];
    if (facultyNorm) {
      adjustedScore = compositeRaw + (facultyNorm.mean - FINANCIAL_NORMS.general.mean);
    }
  }
  
  // Determine financial profile
  const sortedComponents = Object.entries(finalComponentScores).sort((a, b) => b[1] - a[1]);
  const topComponents = sortedComponents.slice(0, 2).map(([comp]) => comp);
  
  let financialProfile = 'developingFinancial';
  if (adjustedScore >= 70) {
    financialProfile = 'balancedFinancial';
  } else if (topComponents.includes('financialKnowledge') && topComponents.includes('investmentAwareness')) {
    financialProfile = 'savvyInvestor';
  } else if (topComponents.includes('budgeting') && topComponents.includes('savingHabits')) {
    financialProfile = 'disciplinedSaver';
  } else if (topComponents.includes('consumerBehavior') && topComponents.includes('debtManagement')) {
    financialProfile = 'prudentSpender';
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
  
  // Determine financial literacy level
  const financialLiteracyLevel = determineFinancialLiteracyLevel(adjustedScore);
  
  // Calculate percentile
  const percentile = calculatePercentile(adjustedScore, FINANCIAL_NORMS.general);
  
  // Calculate confidence interval
  const standardError = 3.9;
  const confidenceInterval = {
    lower: Math.round(adjustedScore - 1.96 * standardError),
    upper: Math.round(adjustedScore + 1.96 * standardError)
  };
  
  return {
    compositeScore: Math.round(Math.min(100, Math.max(0, adjustedScore))),
    componentScores: finalComponentScores,
    financialProfile,
    developmentPriorities,
    financialLiteracyLevel,
    percentile,
    confidenceInterval
  };
}

function getComponentDescription(component: string): string {
  const descriptions: Record<string, string> = {
    financialKnowledge: 'Mengembangkan pengetahuan keuangan dasar',
    budgeting: 'Meningkatkan kemampuan membuat dan mengikuti anggaran',
    savingHabits: 'Mengembangkan kebiasaan menabung secara teratur',
    investmentAwareness: 'Meningkatkan pemahaman tentang investasi',
    debtManagement: 'Mengembangkan kemampuan mengelola hutang',
    financialPlanning: 'Meningkatkan perencanaan keuangan jangka panjang',
    consumerBehavior: 'Mengembangkan perilaku konsumen yang bijak',
    financialGoals: 'Mengembangkan kemampuan menetapkan dan mencapai tujuan keuangan'
  };
  return descriptions[component] || component;
}

function getComponentImpact(component: string): string {
  const impacts: Record<string, string> = {
    financialKnowledge: 'Mempengaruhi kemampuan membuat keputusan keuangan',
    budgeting: 'Mempengaruhi kontrol pengeluaran dan stabilitas keuangan',
    savingHabits: 'Mempengaruhi ketahanan finansial dan persiapan masa depan',
    investmentAwareness: 'Mempengaruhi pertumbuhan kekayaan dan diversifikasi',
    debtManagement: 'Mempengaruhi kesehatan kredit dan beban finansial',
    financialPlanning: 'Mempengaruhi pencapaian tujuan finansial jangka panjang',
    consumerBehavior: 'Mempengaruhi penghematan dan pengeluaran yang efektif',
    financialGoals: 'Mempengaruhi motivasi dan pencapaian tujuan finansial'
  };
  return impacts[component] || 'Mempengaruhi kecerdasan finansial';
}

function determineFinancialLiteracyLevel(score: number): string {
  if (score >= 80) return 'highly_literate';
  if (score >= 65) return 'financially_literate';
  if (score >= 50) return 'moderately_literate';
  if (score >= 35) return 'developing_literacy';
  return 'needs_financial_education';
}

function calculatePercentile(score: number, norm: { mean: number; sd: number }): number {
  const zScore = (score - norm.mean) / norm.sd;
  const percentile = 50 * (1 + Math.tanh(zScore * 0.7));
  return Math.round(Math.min(99, Math.max(1, percentile)));
}
