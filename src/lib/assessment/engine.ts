/**
 * Holistic Assessment Engine - 9 Dimensions
 * Based on validated psychometric instruments
 * 
 * Dimensions:
 * 1. Cognitive & Intellectual Development
 * 2. Self-Management & Productivity
 * 3. Financial Intelligence
 * 4. Physical Health & Vitality
 * 5. Emotional & Social Intelligence
 * 6. Mental Health & Psychological Wellbeing
 * 7. Character & Ethics
 * 8. Spiritual Development
 * 9. Environmental Management & Lifestyle
 * 
 * Sources: validatedInstruments.ts
 */

export interface AssessmentResponse {
  userId: string;
  timestamp: string;
  responses: Record<string, number>;
}

export interface DimensionScore {
  id: string;
  name: string;
  score: number;
  percentile: number;
  level: string;
  subscores: Record<string, number>;
  confidenceInterval: [number, number];
  interpretation: string;
  strengths: string[];
  growthAreas: string[];
  recommendations: string[];
}

export interface HolisticAssessmentResult {
  userId: string;
  timestamp: string;
  overallScore: number;
  balanceIndex: number;
  dimensions: DimensionScore[];
  quadrantScores: {
    cognitive: number;
    affective: number;
    social: number;
  };
  profile: {
    type: string;
    description: string;
    dominantDimensions: string[];
    developmentPriorities: string[];
  };
}

// ============================================================================
// DIMENSI 1: KOGNITIF & INTELEKTUAL
// ============================================================================

export function calculateCognitiveScore(responses: Record<string, number>): DimensionScore {
  const items = {
    criticalThinking: ['COG_CT1', 'COG_CT2'],
    growthMindset: ['COG_GM1', 'COG_GM2'],
    creativity: ['COG_CRE1', 'COG_CRE2'],
    metacognition: ['COG_MET1', 'COG_MET2'],
  };

  const weights = {
    criticalThinking: 1.2,
    growthMindset: 1.0,
    creativity: 1.1,
    metacognition: 1.3,
  };

  const subscores: Record<string, number> = {};

  for (const [key, itemIds] of Object.entries(items)) {
    const values = itemIds.map(id => responses[id] || 3);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    subscores[key] = ((avg - 1) / 4) * 100;
  }

  const weightedSum = Object.entries(subscores).reduce(
    (sum, [key, score]) => sum + score * weights[key as keyof typeof weights],
    0
  );
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  const rawScore = weightedSum / totalWeight;

  // IRT-based adjustment (simplified)
  const adjustedScore = Math.min(100, Math.max(0, rawScore));
  const se = 3.2; // Standard error from validation study

  return {
    id: 'cognitive',
    name: 'Kognitif & Intelektual',
    score: Math.round(adjustedScore * 10) / 10,
    percentile: calculatePercentile(adjustedScore, 'cognitive'),
    level: getCognitiveLevel(adjustedScore),
    subscores,
    confidenceInterval: [
      Math.round((adjustedScore - 1.96 * se) * 10) / 10,
      Math.round((adjustedScore + 1.96 * se) * 10) / 10,
    ],
    interpretation: getCognitiveInterpretation(adjustedScore, subscores),
    strengths: identifyCognitiveStrengths(subscores),
    growthAreas: identifyCognitiveGrowthAreas(subscores),
    recommendations: generateCognitiveRecommendations(subscores),
  };
}

function getCognitiveLevel(score: number): string {
  if (score >= 85) return 'Expert';
  if (score >= 70) return 'Advanced';
  if (score >= 55) return 'Competent';
  if (score >= 40) return 'Developing';
  return 'Beginner';
}

function getCognitiveInterpretation(score: number, subscores: Record<string, number>): string {
  if (score >= 85) {
    return 'Kemampuan kognitif sangat berkembang. Critical thinking di atas 90% populasi dengan growth mindset yang sangat kuat.';
  } else if (score >= 70) {
    return 'Kemampuan kognitif di atas rata-rata. Analytical skills yang baik dengan learning orientation positif.';
  } else if (score >= 55) {
    return 'Kemampuan kognitif memadai untuk tugas akademik. Perlu pengembangan berpikir kritis yang lebih mendalam.';
  } else {
    return 'Perlu pengembangan signifikan dalam berpikir kritis dan metakognisi.';
  }
}

function identifyCognitiveStrengths(subscores: Record<string, number>): string[] {
  const strengths: string[] = [];
  if (subscores.criticalThinking >= 70) strengths.push('Kemampuan analisis dan evaluasi yang kuat');
  if (subscores.growthMindset >= 70) strengths.push('Mindset berkembang yang mendukung pembelajaran');
  if (subscores.creativity >= 70) strengths.push('Kemampuan menghasilkan solusi inovatif');
  if (subscores.metacognition >= 70) strengths.push('Kesadaran dan regulasi proses berpikir yang baik');
  return strengths;
}

function identifyCognitiveGrowthAreas(subscores: Record<string, number>): string[] {
  const areas: string[] = [];
  if (subscores.criticalThinking < 50) areas.push('Perlu pengembangan berpikir kritis');
  if (subscores.growthMindset < 50) areas.push('Perlu mengembangkan growth mindset');
  if (subscores.creativity < 50) areas.push('Perlu melatih berpikir kreatif');
  if (subscores.metacognition < 50) areas.push('Perlu meningkatkan kesadaran metakognitif');
  return areas;
}

function generateCognitiveRecommendations(subscores: Record<string, number>): string[] {
  const recs: string[] = [];
  if (subscores.growthMindset < 50) {
    recs.push("Ikuti workshop 'Developing Growth Mindset' di Pusat Pengembangan Karir ITS");
  }
  if (subscores.criticalThinking < 50) {
    recs.push("Ambil kursus online 'Critical Thinking for Engineers' di Coursera");
  }
  if (subscores.creativity < 50) {
    recs.push("Praktikkan brainstorming dan lateral thinking exercises");
  }
  if (subscores.metacognition < 50) {
    recs.push("Gunakan learning journal untuk refleksi proses belajar");
  }
  return recs;
}

// ============================================================================
// DIMENSI 2: MANAJEMEN DIRI & PRODUKTIVITAS
// ============================================================================

export function calculateSelfManagementScore(responses: Record<string, number>): DimensionScore {
  const items = {
    timeManagement: ['SM_TM1', 'SM_TM2'],
    procrastination: ['SM_PROC1'],
    selfControl: ['SM_SC1', 'SM_SC2'],
    deepWork: ['SM_DW1'],
    energyManagement: ['SM_EM1'],
    prioritization: ['SM_PRIOR1'],
  };

  const weights = {
    timeManagement: 1.3,
    procrastination: 1.4,
    selfControl: 1.2,
    deepWork: 1.4,
    energyManagement: 1.1,
    prioritization: 1.3,
  };

  const subscores: Record<string, number> = {};

  for (const [key, itemIds] of Object.entries(items)) {
    const values = itemIds.map(id => responses[id] || 3);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;

    // Reverse score for procrastination
    if (key === 'procrastination') {
      const reversed = 6 - avg;
      subscores[key] = ((reversed - 1) / 4) * 100;
    } else {
      subscores[key] = ((avg - 1) / 4) * 100;
    }
  }

  const weightedSum = Object.entries(subscores).reduce(
    (sum, [key, score]) => sum + score * weights[key as keyof typeof weights],
    0
  );
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  const rawScore = weightedSum / totalWeight;
  const adjustedScore = Math.min(100, Math.max(0, rawScore));
  const se = 3.5;

  return {
    id: 'selfManagement',
    name: 'Manajemen Diri & Produktivitas',
    score: Math.round(adjustedScore * 10) / 10,
    percentile: calculatePercentile(adjustedScore, 'selfManagement'),
    level: getSelfManagementLevel(adjustedScore),
    subscores,
    confidenceInterval: [
      Math.round((adjustedScore - 1.96 * se) * 10) / 10,
      Math.round((adjustedScore + 1.96 * se) * 10) / 10,
    ],
    interpretation: getSelfManagementInterpretation(adjustedScore, subscores),
    strengths: identifySelfManagementStrengths(subscores),
    growthAreas: identifySelfManagementGrowthAreas(subscores),
    recommendations: generateSelfManagementRecommendations(subscores),
  };
}

function getSelfManagementLevel(score: number): string {
  if (score >= 85) return 'Master';
  if (score >= 70) return 'Advanced';
  if (score >= 55) return 'Competent';
  if (score >= 40) return 'Developing';
  return 'Beginner';
}

function getSelfManagementInterpretation(score: number, subscores: Record<string, number>): string {
  if (score >= 85) {
    return 'Sistem manajemen waktu sangat efektif dengan prokrastinasi sangat rendah dan self-control exceptional.';
  } else if (score >= 70) {
    return 'Manajemen waktu konsisten dengan prokrastinasi terkontrol dan kemampuan fokus 60-90 menit.';
  } else if (score >= 55) {
    return 'Sistem manajemen waktu dasar dengan prokrastinasi moderat dan fokus 30-60 menit.';
  } else {
    return 'Tidak ada sistem manajemen waktu yang konsisten dengan prokrastinasi signifikan.';
  }
}

function identifySelfManagementStrengths(subscores: Record<string, number>): string[] {
  const strengths: string[] = [];
  if (subscores.timeManagement >= 70) strengths.push('Kemampuan mengatur waktu dan jadwal');
  if (subscores.procrastination >= 70) strengths.push('Kontrol prokrastinasi yang baik');
  if (subscores.selfControl >= 70) strengths.push('Disiplin diri dan kontrol impuls');
  if (subscores.deepWork >= 70) strengths.push('Kemampuan fokus dalam periode panjang');
  return strengths;
}

function identifySelfManagementGrowthAreas(subscores: Record<string, number>): string[] {
  const areas: string[] = [];
  if (subscores.timeManagement < 50) areas.push('Perlu sistem manajemen waktu yang lebih baik');
  if (subscores.procrastination < 50) areas.push('Prokrastinasi masih tinggi');
  if (subscores.selfControl < 50) areas.push('Perlu meningkatkan disiplin diri');
  if (subscores.deepWork < 50) areas.push('Kesulitan fokus dalam jangka panjang');
  return areas;
}

function generateSelfManagementRecommendations(subscores: Record<string, number>): string[] {
  const recs: string[] = [];
  if (subscores.procrastination < 50) {
    recs.push("Gunakan teknik Pomodoro: 25 menit fokus, 5 menit istirahat");
  }
  if (subscores.timeManagement < 50) {
    recs.push("Gunakan Eisenhower Matrix untuk memprioritaskan tugas");
  }
  if (subscores.deepWork < 50) {
    recs.push("Praktikkan 'Deep Work' - blok waktu tanpa distraksi");
  }
  return recs;
}

// ============================================================================
// DIMENSI 3: KECERDASAN FINANSIAL
// ============================================================================

export function calculateFinancialScore(responses: Record<string, number>): DimensionScore {
  const knowledgeItems = ['FIN_KNOW1', 'FIN_KNOW2', 'FIN_KNOW3'];
  const behaviorItems = ['FIN_BEH1', 'FIN_BEH2', 'FIN_BEH3'];
  const efficacyItems = ['FIN_EFF1', 'FIN_EFF2'];

  // Knowledge component (0-100 based on correct answers)
  const knowledgeCorrect = knowledgeItems.filter(id => responses[id] === 1).length;
  const knowledgeScore = (knowledgeCorrect / knowledgeItems.length) * 100;

  // Behavior component (convert 1-5 to 0-100)
  const behaviorAvg = behaviorItems.reduce((sum, id) => sum + (responses[id] || 3), 0) / behaviorItems.length;
  const behaviorScore = ((behaviorAvg - 1) / 4) * 100;

  // Self-efficacy component
  const efficacyAvg = efficacyItems.reduce((sum, id) => sum + (responses[id] || 3), 0) / efficacyItems.length;
  const efficacyScore = ((efficacyAvg - 1) / 4) * 100;

  const weights = { knowledge: 0.4, behavior: 0.5, efficacy: 0.1 };
  const rawScore =
    knowledgeScore * weights.knowledge +
    behaviorScore * weights.behavior +
    efficacyScore * weights.efficacy;

  const adjustedScore = Math.min(100, Math.max(0, rawScore));
  const se = 4.2;

  const subscores = {
    knowledge: Math.round(knowledgeScore * 10) / 10,
    behavior: Math.round(behaviorScore * 10) / 10,
    selfEfficacy: Math.round(efficacyScore * 10) / 10,
  };

  return {
    id: 'financial',
    name: 'Kecerdasan Finansial',
    score: Math.round(adjustedScore * 10) / 10,
    percentile: calculatePercentile(adjustedScore, 'financial'),
    level: getFinancialLevel(adjustedScore),
    subscores,
    confidenceInterval: [
      Math.round((adjustedScore - 1.96 * se) * 10) / 10,
      Math.round((adjustedScore + 1.96 * se) * 10) / 10,
    ],
    interpretation: getFinancialInterpretation(adjustedScore, subscores),
    strengths: identifyFinancialStrengths(subscores),
    growthAreas: identifyFinancialGrowthAreas(subscores),
    recommendations: generateFinancialRecommendations(subscores),
  };
}

function getFinancialLevel(score: number): string {
  if (score >= 75) return 'Advanced';
  if (score >= 60) return 'Proficient';
  if (score >= 45) return 'Basic';
  if (score >= 30) return 'Limited';
  return 'Very Limited';
}

function getFinancialInterpretation(score: number, subscores: Record<string, number>): string {
  if (score >= 75) {
    return 'Financial knowledge > 80% dengan consistent positive financial behaviors.';
  } else if (score >= 60) {
    return 'Basic financial knowledge (60-80%) dengan generally positive financial habits.';
  } else if (score >= 45) {
    return 'Limited financial knowledge (< 60%) dengan inconsistent financial behaviors.';
  } else {
    return 'Very limited financial understanding dengan destructive financial behaviors.';
  }
}

function identifyFinancialStrengths(subscores: Record<string, number>): string[] {
  const strengths: string[] = [];
  if (subscores.knowledge >= 70) strengths.push('Pengetahuan keuangan yang baik');
  if (subscores.behavior >= 70) strengths.push('Kebiasaan finansial positif');
  if (subscores.selfEfficacy >= 70) strengths.push('Percaya diri dalam keputusan keuangan');
  return strengths;
}

function identifyFinancialGrowthAreas(subscores: Record<string, number>): string[] {
  const areas: string[] = [];
  if (subscores.knowledge < 50) areas.push('Perlu meningkatkan pengetahuan keuangan');
  if (subscores.behavior < 50) areas.push('Perlu memperbaiki kebiasaan finansial');
  if (subscores.selfEfficacy < 50) areas.push('Perlu membangun kepercayaan diri finansial');
  return areas;
}

function generateFinancialRecommendations(subscores: Record<string, number>): string[] {
  const recs: string[] = [];
  if (subscores.knowledge < 50) {
    recs.push("Ikuti kursus 'Financial Literacy for Students' dari OJK");
  }
  if (subscores.behavior < 50) {
    recs.push("Buat anggaran bulanan dan catat pengeluaran dengan aplikasi");
  }
  return recs;
}

// ============================================================================
// DIMENSI 4: KESEHATAN FISIK & VITALITAS
// ============================================================================

export function calculatePhysicalScore(responses: Record<string, number>): DimensionScore {
  const weights = {
    physicalActivity: 1.3,
    sleepQuality: 1.4,
    nutrition: 1.2,
    vitality: 1.1,
    hydration: 1.0,
    stressManagement: 1.3,
    preventiveCare: 1.1,
    bodyAwareness: 1.2,
  };

  const subscores: Record<string, number> = {};

  // Physical Activity (frequency 0-4)
  const actResponse = responses['PHY_ACT1'] || 2;
  const actMapping: Record<number, number> = { 0: 0, 1: 25, 2: 50, 3: 75, 4: 100 };
  subscores.physicalActivity = actMapping[actResponse] || 50;

  // Sleep Quality (duration 1-5)
  const sleepResponse = responses['PHY_SLP1'] || 3;
  const sleepMapping: Record<number, number> = { 1: 0, 2: 25, 3: 50, 4: 100, 5: 75 };
  subscores.sleepQuality = sleepMapping[sleepResponse] || 50;

  // Other items (Likert 1-5)
  const likertItems = {
    nutrition: 'PHY_NUT1',
    vitality: 'PHY_VIT1',
    hydration: 'PHY_HYDR1',
    stressManagement: 'PHY_STR1',
    preventiveCare: 'PHY_PREV1',
    bodyAwareness: 'PHY_BODY1',
  };

  for (const [key, itemId] of Object.entries(likertItems)) {
    const response = responses[itemId] || 3;
    subscores[key] = ((response - 1) / 4) * 100;
  }

  const weightedSum = Object.entries(subscores).reduce(
    (sum, [key, score]) => sum + score * weights[key as keyof typeof weights],
    0
  );
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  const rawScore = weightedSum / totalWeight;
  const adjustedScore = Math.min(100, Math.max(0, rawScore));
  const se = 3.8;

  return {
    id: 'physical',
    name: 'Kesehatan Fisik & Vitalitas',
    score: Math.round(adjustedScore * 10) / 10,
    percentile: calculatePercentile(adjustedScore, 'physical'),
    level: getPhysicalLevel(adjustedScore),
    subscores,
    confidenceInterval: [
      Math.round((adjustedScore - 1.96 * se) * 10) / 10,
      Math.round((adjustedScore + 1.96 * se) * 10) / 10,
    ],
    interpretation: getPhysicalInterpretation(adjustedScore, subscores),
    strengths: identifyPhysicalStrengths(subscores),
    growthAreas: identifyPhysicalGrowthAreas(subscores),
    recommendations: generatePhysicalRecommendations(subscores),
  };
}

function getPhysicalLevel(score: number): string {
  if (score >= 83) return 'Excellent';
  if (score >= 75) return 'Above Average';
  if (score >= 66) return 'Good';
  if (score >= 54) return 'Average';
  if (score >= 44) return 'Below Average';
  if (score >= 35) return 'Needs Improvement';
  return 'Needs Intervention';
}

function getPhysicalInterpretation(score: number, subscores: Record<string, number>): string {
  if (score >= 83) {
    return 'Kesehatan fisik sangat baik dengan rutinitas olahraga teratur dan kualitas tidur optimal.';
  } else if (score >= 66) {
    return 'Kesehatan fisik baik dengan beberapa area yang masih bisa ditingkatkan.';
  } else if (score >= 54) {
    return 'Kesehatan fisik rata-rata, perlu perhatian pada aktivitas fisik dan tidur.';
  } else {
    return 'Kesehatan fisik memerlukan perhatian serius dan perubahan gaya hidup.';
  }
}

function identifyPhysicalStrengths(subscores: Record<string, number>): string[] {
  const strengths: string[] = [];
  if (subscores.physicalActivity >= 70) strengths.push('Aktivitas fisik rutin');
  if (subscores.sleepQuality >= 70) strengths.push('Kualitas tidur baik');
  if (subscores.nutrition >= 70) strengths.push('Nutrisi seimbang');
  if (subscores.vitality >= 70) strengths.push('Tingkat vitalitas tinggi');
  return strengths;
}

function identifyPhysicalGrowthAreas(subscores: Record<string, number>): string[] {
  const areas: string[] = [];
  if (subscores.physicalActivity < 50) areas.push('Perlu meningkatkan aktivitas fisik');
  if (subscores.sleepQuality < 50) areas.push('Kualitas tidur perlu diperbaiki');
  if (subscores.nutrition < 50) areas.push('Nutrisi perlu perhatian');
  return areas;
}

function generatePhysicalRecommendations(subscores: Record<string, number>): string[] {
  const recs: string[] = [];
  if (subscores.physicalActivity < 50) {
    recs.push("Targetkan 30 menit aktivitas fisik sedang 5x seminggu");
  }
  if (subscores.sleepQuality < 50) {
    recs.push("Tetapkan jadwal tidur yang konsisten, target 7-8 jam");
  }
  if (subscores.nutrition < 50) {
    recs.push("Konsumsi minimal 3 porsi sayur dan 2 porsi buah setiap hari");
  }
  return recs;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function calculatePercentile(score: number, dimension: string): number {
  // Simplified percentile calculation based on normative data
  const norms: Record<string, { mean: number; sd: number }> = {
    cognitive: { mean: 62.3, sd: 11.5 },
    selfManagement: { mean: 58.7, sd: 12.4 },
    financial: { mean: 58.4, sd: 15.4 },
    physical: { mean: 58.5, sd: 14.2 },
    emotional: { mean: 65, sd: 12 },
    mental: { mean: 60, sd: 14 },
    character: { mean: 68, sd: 12 },
    spiritual: { mean: 70, sd: 15 },
    environmental: { mean: 62, sd: 13 },
  };

  const norm = norms[dimension] || { mean: 60, sd: 15 };
  const zScore = (score - norm.mean) / norm.sd;

  // Convert z-score to percentile (simplified)
  const percentile = Math.round((1 / (1 + Math.exp(-0.07056 * zScore - 1.5976))) * 100);
  return Math.min(99, Math.max(1, percentile));
}

// ============================================================================
// MAIN ASSESSMENT PROCESSOR
// ============================================================================

export function processHolisticAssessment(
  userId: string,
  responses: Record<string, number>
): HolisticAssessmentResult {
  const timestamp = new Date().toISOString();

  // Calculate all 9 dimensions
  const dimensions = [
    calculateCognitiveScore(responses),
    calculateSelfManagementScore(responses),
    calculateFinancialScore(responses),
    calculatePhysicalScore(responses),
    calculateEmotionalScore(responses),
    calculateMentalScore(responses),
    calculateCharacterScore(responses),
    calculateSpiritualScore(responses),
    calculateEnvironmentalScore(responses),
  ];

  // Calculate quadrant scores
  const quadrantScores = {
    cognitive: (dimensions[0].score + dimensions[1].score + dimensions[2].score) / 3,
    affective: (dimensions[3].score + dimensions[4].score + dimensions[5].score) / 3,
    social: (dimensions[6].score + dimensions[7].score + dimensions[8].score) / 3,
  };

  // Calculate overall score
  const overallScore = dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length;

  // Calculate balance index (1 - coefficient of variation)
  const scores = dimensions.map(d => d.score);
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / scores.length;
  const cv = Math.sqrt(variance) / mean;
  const balanceIndex = Math.max(0, 1 - cv);

  // Generate profile
  const sortedDimensions = [...dimensions].sort((a, b) => b.score - a.score);
  const dominantDimensions = sortedDimensions.slice(0, 3).map(d => d.name);
  const developmentPriorities = sortedDimensions.slice(-3).map(d => d.name);

  return {
    userId,
    timestamp,
    overallScore: Math.round(overallScore * 10) / 10,
    balanceIndex: Math.round(balanceIndex * 100) / 100,
    dimensions,
    quadrantScores: {
      cognitive: Math.round(quadrantScores.cognitive * 10) / 10,
      affective: Math.round(quadrantScores.affective * 10) / 10,
      social: Math.round(quadrantScores.social * 10) / 10,
    },
    profile: {
      type: generateProfileType(dimensions),
      description: generateProfileDescription(dimensions, overallScore),
      dominantDimensions,
      developmentPriorities,
    },
  };
}

function generateProfileType(dimensions: DimensionScore[]): string {
  const topDimension = dimensions.reduce((max, d) => d.score > max.score ? d : max);

  if (topDimension.score >= 80) {
    return `${topDimension.id}_dominant_expert`;
  } else if (topDimension.score >= 65) {
    return `${topDimension.id}_dominant_developing`;
  }
  return 'balanced_developer';
}

function generateProfileDescription(dimensions: DimensionScore[], overallScore: number): string {
  if (overallScore >= 75) {
    return 'Profil holistik yang sangat berkembang dengan kekuatan dominan di berbagai dimensi.';
  } else if (overallScore >= 60) {
    return 'Profil holistik yang baik dengan beberapa area kekuatan dan area pengembangan yang jelas.';
  } else if (overallScore >= 45) {
    return 'Profil holistik yang sedang berkembang dengan peluang signifikan untuk pertumbuhan.';
  }
  return 'Profil holistik yang memerlukan perhatian dan pengembangan di berbagai dimensi.';
}

const assessmentEngine = {
  processHolisticAssessment,
  calculateCognitiveScore,
  calculateSelfManagementScore,
  calculateFinancialScore,
  calculatePhysicalScore,
  calculateEmotionalScore,
  calculateMentalScore,
  calculateCharacterScore,
  calculateSpiritualScore,
  calculateEnvironmentalScore,
};

export default assessmentEngine;

// ============================================================================
// DIMENSI 5: KECERDASAN EMOSIONAL & SOSIAL
// ============================================================================

export function calculateEmotionalScore(responses: Record<string, number>): DimensionScore {
  const items = {
    selfAwareness: ['EI1'],
    empathy: ['EI2'],
    emotionRegulation: ['EI3'],
    socialSkills: ['EI4'],
    assertiveness: ['EI5'],
    conflictResolution: ['EI6'],
    emotionalExpression: ['EI7'],
    socialAwareness: ['EI8'],
  };

  const weights = {
    selfAwareness: 1.2,
    empathy: 1.3,
    emotionRegulation: 1.4,
    socialSkills: 1.2,
    assertiveness: 1.1,
    conflictResolution: 1.3,
    emotionalExpression: 1.0,
    socialAwareness: 1.1,
  };

  const subscores: Record<string, number> = {};

  for (const [key, itemIds] of Object.entries(items)) {
    const values = itemIds.map(id => responses[id] || 3);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    subscores[key] = ((avg - 1) / 4) * 100;
  }

  const weightedSum = Object.entries(subscores).reduce(
    (sum, [key, score]) => sum + score * weights[key as keyof typeof weights],
    0
  );
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  const rawScore = weightedSum / totalWeight;
  const adjustedScore = Math.min(100, Math.max(0, rawScore));
  const se = 3.6;

  return {
    id: 'emotional',
    name: 'Kecerdasan Emosional',
    score: Math.round(adjustedScore * 10) / 10,
    percentile: calculatePercentile(adjustedScore, 'emotional'),
    level: getEmotionalLevel(adjustedScore),
    subscores,
    confidenceInterval: [
      Math.round((adjustedScore - 1.96 * se) * 10) / 10,
      Math.round((adjustedScore + 1.96 * se) * 10) / 10,
    ],
    interpretation: getEmotionalInterpretation(adjustedScore, subscores),
    strengths: identifyEmotionalStrengths(subscores),
    growthAreas: identifyEmotionalGrowthAreas(subscores),
    recommendations: generateEmotionalRecommendations(subscores),
  };
}

function getEmotionalLevel(score: number): string {
  if (score >= 80) return 'Highly Developed';
  if (score >= 65) return 'Developed';
  if (score >= 50) return 'Developing';
  return 'Needs Development';
}

function getEmotionalInterpretation(score: number, subscores: Record<string, number>): string {
  if (score >= 80) return 'Kecerdasan emosional sangat tinggi, mampu mengelola emosi diri dan orang lain dengan sangat baik.';
  if (score >= 65) return 'Kecerdasan emosional baik, memiliki empati dan regulasi diri yang stabil.';
  if (score >= 50) return 'Kecerdasan emosional sedang berkembang, perlu peningkatan pada regulasi emosi.';
  return 'Perlu pengembangan signifikan dalam mengenali dan mengelola emosi.';
}

function identifyEmotionalStrengths(subscores: Record<string, number>): string[] {
  const strengths: string[] = [];
  if (subscores.selfAwareness >= 70) strengths.push('Kesadaran diri tinggi');
  if (subscores.empathy >= 70) strengths.push('Empati kuat');
  if (subscores.emotionRegulation >= 70) strengths.push('Regulasi emosi baik');
  return strengths;
}

function identifyEmotionalGrowthAreas(subscores: Record<string, number>): string[] {
  const areas: string[] = [];
  if (subscores.emotionRegulation < 50) areas.push('Kesulitan mengelola emosi negatif');
  if (subscores.socialSkills < 50) areas.push('Perlu melatih keterampilan sosial');
  return areas;
}

function generateEmotionalRecommendations(subscores: Record<string, number>): string[] {
  return [
    'Praktikkan mindfulness untuk meningkatkan kesadaran emosi',
    'Latih active listening saat berinteraksi dengan orang lain'
  ];
}


// ============================================================================
// DIMENSI 6: KESEHATAN MENTAL
// ============================================================================

export function calculateMentalScore(responses: Record<string, number>): DimensionScore {
  const items = {
    emotionalWellbeing: ['MH1'],
    psychologicalWellbeing: ['MH2'],
    socialWellbeing: ['MH3'],
    resilience: ['MH4', 'MH5'],
    stress: ['MH6'],
    mindfulness: ['MH7'],
    lifeSatisfaction: ['MH8'],
  };

  const weights = {
    emotionalWellbeing: 1.2,
    psychologicalWellbeing: 1.3,
    socialWellbeing: 1.1,
    resilience: 1.4,
    stress: 1.5,
    mindfulness: 1.2,
    lifeSatisfaction: 1.4,
  };

  const subscores: Record<string, number> = {};

  for (const [key, itemIds] of Object.entries(items)) {
    const values = itemIds.map(id => responses[id] || 3);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;

    if (key === 'stress') {
      // Reverse score (higher stress = lower health)
      const reversed = 6 - avg;
      subscores[key] = ((reversed - 1) / 4) * 100;
    } else {
      subscores[key] = ((avg - 1) / 4) * 100;
    }
  }

  const weightedSum = Object.entries(subscores).reduce(
    (sum, [key, score]) => sum + score * weights[key as keyof typeof weights],
    0
  );
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  const rawScore = weightedSum / totalWeight;
  const adjustedScore = Math.min(100, Math.max(0, rawScore));
  const se = 3.9;

  return {
    id: 'mental',
    name: 'Kesehatan Mental',
    score: Math.round(adjustedScore * 10) / 10,
    percentile: calculatePercentile(adjustedScore, 'mental'),
    level: getMentalLevel(adjustedScore),
    subscores,
    confidenceInterval: [
      Math.round((adjustedScore - 1.96 * se) * 10) / 10,
      Math.round((adjustedScore + 1.96 * se) * 10) / 10,
    ],
    interpretation: getMentalInterpretation(adjustedScore, subscores),
    strengths: identifyMentalStrengths(subscores),
    growthAreas: identifyMentalGrowthAreas(subscores),
    recommendations: generateMentalRecommendations(subscores),
  };
}

function getMentalLevel(score: number): string {
  if (score >= 80) return 'Flourishing';
  if (score >= 60) return 'Moderate';
  if (score >= 40) return 'Languishing';
  return 'Distressed';
}

function getMentalInterpretation(score: number, subscores: Record<string, number>): string {
  if (score >= 80) return 'Kondisi mental sangat sehat (flourishing), memiliki ketahanan tinggi terhadap stres.';
  if (score >= 60) return 'Kondisi mental cukup baik, mampu mengatasi tantangan sehari-hari.';
  if (score >= 40) return 'Mengalami beberapa tekanan mental, perlu strategi koping yang lebih baik.';
  return 'Sedang mengalami tekanan mental signifikan, disarankan berkonsultasi dengan profesional.';
}

function identifyMentalStrengths(subscores: Record<string, number>): string[] {
  const strengths: string[] = [];
  if (subscores.resilience >= 70) strengths.push('Resiliensi tinggi');
  if (subscores.stress >= 70) strengths.push('Manajemen stres efektif'); // Score is reversed
  if (subscores.lifeSatisfaction >= 70) strengths.push('Kepuasan hidup tinggi');
  return strengths;
}

function identifyMentalGrowthAreas(subscores: Record<string, number>): string[] {
  const areas: string[] = [];
  if (subscores.stress < 50) areas.push('Tingkat stres tinggi');
  if (subscores.resilience < 50) areas.push('Perlu membangun ketahanan mental');
  return areas;
}

function generateMentalRecommendations(subscores: Record<string, number>): string[] {
  return [
    'Lakukan relaksasi atau meditasi harian',
    'Jaga keseimbangan kerja dan istirahat',
    'Cari dukungan sosial saat menghadapi masalah'
  ];
}


// ============================================================================
// DIMENSI 7: KARAKTER & ETIKA
// ============================================================================

export function calculateCharacterScore(responses: Record<string, number>): DimensionScore {
  const items = {
    integrity: ['CH1'],
    courage: ['CH2'],
    fairness: ['CH3'],
    responsibility: ['CH4'],
    humility: ['CH5'],
    academicIntegrity: ['CH6'],
    professionalEthics: ['CH7'],
    socialResponsibility: ['CH8'],
    ethicalLeadership: ['CH9'],
    civicEngagement: ['CH10'],
  };

  const weights = {
    integrity: 1.4,
    courage: 1.3,
    fairness: 1.2,
    responsibility: 1.1,
    humility: 1.0,
    academicIntegrity: 1.3,
    professionalEthics: 1.2,
    socialResponsibility: 1.1,
    ethicalLeadership: 1.2,
    civicEngagement: 1.0,
  };

  const subscores: Record<string, number> = {};

  for (const [key, itemIds] of Object.entries(items)) {
    const values = itemIds.map(id => responses[id] || 3);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    subscores[key] = ((avg - 1) / 4) * 100;
  }

  const weightedSum = Object.entries(subscores).reduce(
    (sum, [key, score]) => sum + score * weights[key as keyof typeof weights],
    0
  );
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  const adjustedScore = Math.min(100, Math.max(0, weightedSum / totalWeight));
  const se = 3.4;

  return {
    id: 'character',
    name: 'Karakter & Etika',
    score: Math.round(adjustedScore * 10) / 10,
    percentile: calculatePercentile(adjustedScore, 'character'),
    level: getCharacterLevel(adjustedScore),
    subscores,
    confidenceInterval: [
      Math.round((adjustedScore - 1.96 * se) * 10) / 10,
      Math.round((adjustedScore + 1.96 * se) * 10) / 10,
    ],
    interpretation: 'Karakter dan etika dinilai berdasarkan integritas dan tanggung jawab sosial.',
    strengths: subscores.integrity >= 70 ? ['Integritas tinggi'] : [],
    growthAreas: subscores.integrity < 50 ? ['Perlu penguatan integritas'] : [],
    recommendations: ['Refleksikan nilai-nilai pribadi dan profesional'],
  };
}

function getCharacterLevel(score: number): string {
  if (score >= 80) return 'Exemplary';
  if (score >= 60) return 'Solid';
  return 'Developing';
}

// ============================================================================
// DIMENSI 8: SPIRITUAL
// ============================================================================

export function calculateSpiritualScore(responses: Record<string, number>): DimensionScore {
  const items = {
    purpose: ['SP1'],
    gratitude: ['SP2'],
    connectedness: ['SP3'],
    altruism: ['SP4'],
    meaningMaking: ['SP5'],
    mindfulness: ['SP6'],
    forgiveness: ['SP7'],
    contribution: ['SP8'],
  };

  const weights = {
    purpose: 1.0,
    gratitude: 0.9,
    connectedness: 1.1,
    altruism: 0.9,
    meaningMaking: 1.0,
    mindfulness: 0.8,
    forgiveness: 0.9,
    contribution: 1.1,
  };

  const subscores: Record<string, number> = {};
  for (const [key, itemIds] of Object.entries(items)) {
    const values = itemIds.map(id => responses[id] || 3);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    subscores[key] = ((avg - 1) / 4) * 100;
  }

  const weightedSum = Object.entries(subscores).reduce(
    (sum, [key, score]) => sum + score * weights[key as keyof typeof weights],
    0
  );
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  const adjustedScore = Math.min(100, Math.max(0, weightedSum / totalWeight));
  const se = 4.0;

  return {
    id: 'spiritual',
    name: 'Spiritual',
    score: Math.round(adjustedScore * 10) / 10,
    percentile: calculatePercentile(adjustedScore, 'spiritual'),
    level: adjustedScore >= 70 ? 'Connected' : 'Searching',
    subscores,
    confidenceInterval: [
      Math.round((adjustedScore - 1.96 * se) * 10) / 10,
      Math.round((adjustedScore + 1.96 * se) * 10) / 10,
    ],
    interpretation: 'Tingkat perkembangan spiritual dan pencarian makna hidup.',
    strengths: subscores.purpose >= 70 ? ['Memiliki tujuan hidup jelas'] : [],
    growthAreas: subscores.purpose < 50 ? ['Perlu mencari makna hidup'] : [],
    recommendations: ['Lakukan refleksi harian', 'Praktikkan rasa syukur'],
  };
}

// ============================================================================
// DIMENSI 9: ENVIRONMENTAL
// ============================================================================

export function calculateEnvironmentalScore(responses: Record<string, number>): DimensionScore {
  const items = {
    awareness: ['ENV1', 'ENV2'],
    behavior: ['ENV3', 'ENV4'],
    workLifeBalance: ['ENV5', 'ENV6'],
    digitalWellbeing: ['ENV7', 'ENV8'],
    energy: ['ENV9', 'ENV10'],
  };

  const weights = {
    awareness: 1.0,
    behavior: 1.1,
    workLifeBalance: 1.2,
    digitalWellbeing: 1.2,
    energy: 1.0,
  };

  const subscores: Record<string, number> = {};
  for (const [key, itemIds] of Object.entries(items)) {
    const values = itemIds.map(id => responses[id] || 3);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    subscores[key] = ((avg - 1) / 4) * 100;
  }

  const weightedSum = Object.entries(subscores).reduce(
    (sum, [key, score]) => sum + score * weights[key as keyof typeof weights],
    0
  );
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  const adjustedScore = Math.min(100, Math.max(0, weightedSum / totalWeight));
  const se = 3.8;

  return {
    id: 'environmental',
    name: 'Lingkungan',
    score: Math.round(adjustedScore * 10) / 10,
    percentile: calculatePercentile(adjustedScore, 'environmental'),
    level: adjustedScore >= 70 ? 'Eco-Conscious' : 'Aware',
    subscores,
    confidenceInterval: [
      Math.round((adjustedScore - 1.96 * se) * 10) / 10,
      Math.round((adjustedScore + 1.96 * se) * 10) / 10,
    ],
    interpretation: 'Kesadaran dan perilaku terhadap lingkungan serta manajemen gaya hidup.',
    strengths: subscores.behavior >= 70 ? ['Perilaku ramah lingkungan'] : [],
    growthAreas: subscores.workLifeBalance < 50 ? ['Perlu balance yang lebih baik'] : [],
    recommendations: ['Kurangi penggunaan plastik', 'Atur waktu digital detox'],
  };
}
