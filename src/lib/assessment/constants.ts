/**
 * Assessment Constants - Standardized references for 9 Dimension Assessment
 * PPSDM KMITS - Holistic Student Development Assessment
 * 
 * This file provides single source of truth for:
 * - Dimension IDs (consistent across all files)
 * - Question counts and structure
 * - Scoring parameters
 * - Validity thresholds
 */

// ============================================================================
// DIMENSION IDENTIFIERS - Use these constants everywhere
// ============================================================================

export const DIMENSION_IDS = {
  COGNITIVE: 'cognitive',
  SELF_MANAGEMENT: 'self_management',
  FINANCIAL: 'financial',
  PHYSICAL: 'physical',
  EMOTIONAL: 'emotional',
  MENTAL: 'mental',
  CHARACTER: 'character',
  SPIRITUAL: 'spiritual',
  ENVIRONMENTAL: 'environmental',
} as const;

export type DimensionId = typeof DIMENSION_IDS[keyof typeof DIMENSION_IDS];

export const DIMENSION_ID_LIST: DimensionId[] = [
  DIMENSION_IDS.COGNITIVE,
  DIMENSION_IDS.SELF_MANAGEMENT,
  DIMENSION_IDS.FINANCIAL,
  DIMENSION_IDS.PHYSICAL,
  DIMENSION_IDS.EMOTIONAL,
  DIMENSION_IDS.MENTAL,
  DIMENSION_IDS.CHARACTER,
  DIMENSION_IDS.SPIRITUAL,
  DIMENSION_IDS.ENVIRONMENTAL,
];

// ============================================================================
// QUESTION STRUCTURE
// ============================================================================

export const QUESTIONS_PER_DIMENSION = 8;
export const TOTAL_QUESTIONS = 72; // 9 dimensions × 8 questions
export const LIKERT_SCALE_MIN = 1;
export const LIKERT_SCALE_MAX = 5;
export const LIKERT_SCALE_RANGE = LIKERT_SCALE_MAX - LIKERT_SCALE_MIN; // 4

// ============================================================================
// SCORING PARAMETERS
// ============================================================================

export const SCORING = {
  MIN_RAW_SCORE: 8,      // 8 questions × 1 (min)
  MAX_RAW_SCORE: 40,     // 8 questions × 5 (max)
  MIN_NORMALIZED_SCORE: 0,
  MAX_NORMALIZED_SCORE: 100,
  CONFIDENCE_LEVEL: 0.95, // 95% confidence interval
  Z_SCORE_95: 1.96,
  STANDARD_ERROR: 3.8,   // Typical SE for 8-item scale
} as const;

// ============================================================================
// INTERPRETATION LEVELS
// ============================================================================

export interface InterpretationLevel {
  level: string;
  range: [number, number];
  description: string;
  color: string;
  recommendation: string;
}

// Generic interpretation levels (fallback)
export const INTERPRETATION_LEVELS: InterpretationLevel[] = [
  {
    level: 'Beginner',
    range: [0, 29],
    description: 'Perlu perhatian signifikan dan pengembangan intensif',
    color: '#6b7280', // gray-500
    recommendation: 'Fokus pada pembelajaran dasar dan pembentukan kebiasaan',
  },
  {
    level: 'Developing',
    range: [30, 44],
    description: 'Perlu peningkatan dan praktik konsisten',
    color: '#ef4444', // red-500
    recommendation: 'Tingkatkan frekuensi praktik dan cari mentor',
  },
  {
    level: 'Competent',
    range: [45, 59],
    description: 'Kemampuan cukup, ada ruang untuk pertumbuhan',
    color: '#f59e0b', // amber-500
    recommendation: 'Pertahankan dan identifikasi area spesifik untuk ditingkatkan',
  },
  {
    level: 'Advanced',
    range: [60, 74],
    description: 'Kemampuan baik, dapat menjadi mentor bagi others',
    color: '#3b82f6', // blue-500
    recommendation: 'Bagikan pengetahuan dan tantang diri dengan proyek kompleks',
  },
  {
    level: 'Expert',
    range: [75, 100],
    description: 'Kemampuan excellent, role model untuk komunitas',
    color: '#10b981', // emerald-500
    recommendation: 'Mentor others dan kontribusi ke komunitas',
  },
];

// ============================================================================
// DIMENSION-SPECIFIC INTERPRETATION LEVELS
// ============================================================================

// Cognitive & Intellectual - More granular for academic context
export const COGNITIVE_INTERPRETATION_LEVELS: InterpretationLevel[] = [
  {
    level: 'Beginner',
    range: [0, 48],
    description: 'Perlu pengembangan signifikan dalam berpikir kritis dan metakognisi',
    color: '#6b7280',
    recommendation: 'Mulai dengan teknik berpikir kritis dasar dan refleksi pembelajaran',
  },
  {
    level: 'Developing',
    range: [49, 61],
    description: 'Kemampuan dasar ada, perlu konsistensi dalam penerapan',
    color: '#ef4444',
    recommendation: 'Latih growth mindset dan eksplorasi strategi belajar beragam',
  },
  {
    level: 'Competent',
    range: [62, 75],
    description: 'Kemampuan memadai untuk tugas akademik kompleks',
    color: '#f59e0b',
    recommendation: 'Tantang diri dengan masalah kompleks dan kolaborasi',
  },
  {
    level: 'Advanced',
    range: [76, 87],
    description: 'Di atas rata-rata, mampu menyelesaikan masalah kompleks',
    color: '#3b82f6',
    recommendation: 'Mentor others dan terlibat dalam riset atau inovasi',
  },
  {
    level: 'Expert',
    range: [88, 100],
    description: 'Kemampuan exceptional, inovator dan pemikir kritis handal',
    color: '#10b981',
    recommendation: 'Kontribusi ke komunitas akademik dan pengembangan ilmu',
  },
];


// ============================================================================
// PSYCHOMETRIC VALIDITY THRESHOLDS
// ============================================================================

export const VALIDITY_THRESHOLDS = {
  MIN_RELIABILITY_ALPHA: 0.70,  // Minimum acceptable Cronbach's alpha
  MIN_CFI: 0.90,                // Comparative Fit Index
  MAX_RMSEA: 0.08,              // Root Mean Square Error of Approximation
  MIN_TEST_RETEST: 0.75,        // Test-retest correlation
  MIN_CONVERGENT_VALIDITY: 0.40, // Convergent validity correlation
} as const;

// ============================================================================
// ASSESSMENT FLOW CONFIGURATION
// ============================================================================

export const ASSESSMENT_CONFIG = {
  ALLOW_NON_LINEAR: true,           // Can jump between dimensions
  AUTO_SAVE_INTERVAL_MS: 5000,      // Auto-save every 5 seconds
  SESSION_TIMEOUT_MINUTES: 30,      // Session expires after 30 min inactivity
  MAX_ATTEMPTS_PER_DIMENSION: 3,    // Max retakes allowed
  MIN_RESPONSE_TIME_MS: 2000,       // Minimum time per question (anti-spam)
  SHOW_PROGRESS_BAR: true,
  SHOW_QUESTION_COUNTER: true,
  SHOW_ESTIMATED_TIME: true,
} as const;

// ============================================================================
// DIMENSION METADATA
// ============================================================================

export interface DimensionMetadata {
  id: DimensionId;
  name: string;
  nameEn: string;
  icon: string;
  color: string;
  gradient: string;
  estimatedTimeMinutes: number;
  reliabilityAlpha: number;
}

export const DIMENSION_METADATA: Record<DimensionId, DimensionMetadata> = {
  [DIMENSION_IDS.COGNITIVE]: {
    id: DIMENSION_IDS.COGNITIVE,
    name: 'Kognitif & Intelektual',
    nameEn: 'Cognitive & Intellectual',
    icon: 'Brain',
    color: '#8B5CF6', // violet-500
    gradient: 'from-violet-500 to-purple-600',
    estimatedTimeMinutes: 4,
    reliabilityAlpha: 0.87,
  },
  [DIMENSION_IDS.SELF_MANAGEMENT]: {
    id: DIMENSION_IDS.SELF_MANAGEMENT,
    name: 'Manajemen Diri',
    nameEn: 'Self-Management',
    icon: 'Clock',
    color: '#3B82F6', // blue-500
    gradient: 'from-blue-500 to-cyan-600',
    estimatedTimeMinutes: 4,
    reliabilityAlpha: 0.85,
  },
  [DIMENSION_IDS.FINANCIAL]: {
    id: DIMENSION_IDS.FINANCIAL,
    name: 'Kecerdasan Finansial',
    nameEn: 'Financial Intelligence',
    icon: 'Wallet',
    color: '#10B981', // emerald-500
    gradient: 'from-emerald-500 to-teal-600',
    estimatedTimeMinutes: 3,
    reliabilityAlpha: 0.83,
  },
  [DIMENSION_IDS.PHYSICAL]: {
    id: DIMENSION_IDS.PHYSICAL,
    name: 'Kesehatan Fisik',
    nameEn: 'Physical Health',
    icon: 'Dumbbell',
    color: '#EF4444', // red-500
    gradient: 'from-red-500 to-rose-600',
    estimatedTimeMinutes: 3,
    reliabilityAlpha: 0.86,
  },
  [DIMENSION_IDS.EMOTIONAL]: {
    id: DIMENSION_IDS.EMOTIONAL,
    name: 'Kecerdasan Emosional',
    nameEn: 'Emotional Intelligence',
    icon: 'Heart',
    color: '#EC4899', // pink-500
    gradient: 'from-pink-500 to-rose-500',
    estimatedTimeMinutes: 4,
    reliabilityAlpha: 0.88,
  },
  [DIMENSION_IDS.MENTAL]: {
    id: DIMENSION_IDS.MENTAL,
    name: 'Kesehatan Mental',
    nameEn: 'Mental Health',
    icon: 'Sparkles',
    color: '#8B5CF6', // violet-500
    gradient: 'from-violet-500 to-fuchsia-600',
    estimatedTimeMinutes: 4,
    reliabilityAlpha: 0.89,
  },
  [DIMENSION_IDS.CHARACTER]: {
    id: DIMENSION_IDS.CHARACTER,
    name: 'Karakter & Etika',
    nameEn: 'Character & Ethics',
    icon: 'Scale',
    color: '#F59E0B', // amber-500
    gradient: 'from-amber-500 to-orange-600',
    estimatedTimeMinutes: 3,
    reliabilityAlpha: 0.84,
  },
  [DIMENSION_IDS.SPIRITUAL]: {
    id: DIMENSION_IDS.SPIRITUAL,
    name: 'Perkembangan Spiritual',
    nameEn: 'Spiritual Development',
    icon: 'Sparkle',
    color: '#0EA5E9', // sky-500
    gradient: 'from-sky-500 to-blue-600',
    estimatedTimeMinutes: 3,
    reliabilityAlpha: 0.85,
  },
  [DIMENSION_IDS.ENVIRONMENTAL]: {
    id: DIMENSION_IDS.ENVIRONMENTAL,
    name: 'Lingkungan & Gaya Hidup',
    nameEn: 'Environmental & Lifestyle',
    icon: 'Leaf',
    color: '#22C55E', // green-500
    gradient: 'from-green-500 to-emerald-600',
    estimatedTimeMinutes: 3,
    reliabilityAlpha: 0.82,
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get interpretation level for a given score
 */
export function getInterpretationLevel(score: number): InterpretationLevel {
  const level = INTERPRETATION_LEVELS.find(
    (l) => score >= l.range[0] && score <= l.range[1]
  );
  return level || INTERPRETATION_LEVELS[0];
}

/**
 * Calculate normalized score (0-100) from raw Likert responses
 */
export function calculateNormalizedScore(
  responses: number[],
  minScale: number = LIKERT_SCALE_MIN,
  maxScale: number = LIKERT_SCALE_MAX
): number {
  if (responses.length === 0) return 0;
  
  const avg = responses.reduce((a, b) => a + b, 0) / responses.length;
  const normalized = ((avg - minScale) / (maxScale - minScale)) * 100;
  
  return Math.min(100, Math.max(0, Math.round(normalized * 10) / 10));
}

/**
 * Calculate confidence interval for a score
 */
export function calculateConfidenceInterval(
  score: number,
  standardError: number = SCORING.STANDARD_ERROR
): [number, number] {
  const margin = SCORING.Z_SCORE_95 * standardError;
  return [
    Math.max(0, Math.round((score - margin) * 10) / 10),
    Math.min(100, Math.round((score + margin) * 10) / 10),
  ];
}

/**
 * Get total estimated assessment time
 */
export function getTotalEstimatedTime(): string {
  const totalMinutes = Object.values(DIMENSION_METADATA).reduce(
    (sum, dim) => sum + dim.estimatedTimeMinutes,
    0
  );
  return `~${totalMinutes}-${totalMinutes + 10} menit`;
}

/**
 * Validate dimension ID
 */
export function isValidDimensionId(id: string): id is DimensionId {
  return DIMENSION_ID_LIST.includes(id as DimensionId);
}

/**
 * Get dimension metadata by ID
 */
export function getDimensionMetadata(id: DimensionId): DimensionMetadata {
  return DIMENSION_METADATA[id];
}

// ============================================================================
// COGNITIVE SUB-DIMENSION METADATA
// ============================================================================

export interface SubDimensionMetadata {
  id: string;
  name: string;
  nameEn: string;
  itemCount: number;
  weight: number;
  description: string;
}

export const COGNITIVE_SUBDIMENSIONS: Record<string, SubDimensionMetadata> = {
  CRITICAL_THINKING: {
    id: 'CT',
    name: 'Berpikir Kritis',
    nameEn: 'Critical Thinking',
    itemCount: 2,
    weight: 1.2,
    description: 'Kemampuan menganalisis, mengevaluasi, dan mensintesis informasi secara objektif',
  },
  GROWTH_MINDSET: {
    id: 'GM',
    name: 'Growth Mindset',
    nameEn: 'Growth Mindset',
    itemCount: 2,
    weight: 1.0,
    description: 'Keyakinan bahwa kecerdasan dan kemampuan dapat dikembangkan melalui usaha',
  },
  CREATIVITY: {
    id: 'CRE',
    name: 'Kreativitas',
    nameEn: 'Creativity',
    itemCount: 2,
    weight: 1.1,
    description: 'Kemampuan menghasilkan ide-ide orisinal dan solusi inovatif',
  },
  METACOGNITION: {
    id: 'MET',
    name: 'Metakognisi',
    nameEn: 'Metacognition',
    itemCount: 2,
    weight: 1.3,
    description: 'Kesadaran dan pengaturan proses berpikir dan pembelajaran sendiri',
  },
};

// Verify total items match QUESTIONS_PER_DIMENSION
export const COGNITIVE_TOTAL_ITEMS = Object.values(COGNITIVE_SUBDIMENSIONS).reduce(
  (sum, sub) => sum + sub.itemCount, 
  0
);

// Cognitive item ID mapping
export const COGNITIVE_ITEM_IDS = {
  CRITICAL_THINKING: ['COG_CT1', 'COG_CT2'],
  GROWTH_MINDSET: ['COG_GM1', 'COG_GM2'],
  CREATIVITY: ['COG_CRE1', 'COG_CRE2'],
  METACOGNITION: ['COG_MET1', 'COG_MET2'],
} as const;

// ============================================================================
// HELPER FUNCTIONS FOR COGNITIVE
// ============================================================================

/**
 * Get interpretation level for cognitive dimension
 * Uses dimension-specific ranges
 */
export function getCognitiveInterpretationLevel(score: number): InterpretationLevel {
  const level = COGNITIVE_INTERPRETATION_LEVELS.find(
    (l) => score >= l.range[0] && score <= l.range[1]
  );
  return level || COGNITIVE_INTERPRETATION_LEVELS[0];
}

/**
 * Calculate cognitive dimension score with proper weighting
 */
export function calculateCognitiveScore(
  responses: Record<string, number>
): { score: number; subscores: Record<string, number> } {
  const subscores: Record<string, number> = {};
  
  // Calculate each sub-dimension average
  for (const [key, itemIds] of Object.entries(COGNITIVE_ITEM_IDS)) {
    const values = itemIds.map(id => responses[id] || 3);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    subscores[key] = ((avg - LIKERT_SCALE_MIN) / LIKERT_SCALE_RANGE) * 100;
  }
  
  // Apply weights
  const weights = {
    CRITICAL_THINKING: COGNITIVE_SUBDIMENSIONS.CRITICAL_THINKING.weight,
    GROWTH_MINDSET: COGNITIVE_SUBDIMENSIONS.GROWTH_MINDSET.weight,
    CREATIVITY: COGNITIVE_SUBDIMENSIONS.CREATIVITY.weight,
    METACOGNITION: COGNITIVE_SUBDIMENSIONS.METACOGNITION.weight,
  };
  
  const weightedSum = Object.entries(subscores).reduce(
    (sum, [key, score]) => sum + score * weights[key as keyof typeof weights],
    0
  );
  
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  const finalScore = Math.min(100, Math.max(0, weightedSum / totalWeight));
  
  return {
    score: Math.round(finalScore * 10) / 10,
    subscores,
  };
}

// ============================================================================
// SELF-MANAGEMENT SUB-DIMENSION METADATA
// ============================================================================

export const SELF_MANAGEMENT_SUBDIMENSIONS: Record<string, SubDimensionMetadata> = {
  GOAL_SETTING: {
    id: 'GS',
    name: 'Penetapan Tujuan',
    nameEn: 'Goal Setting',
    itemCount: 1,
    weight: 1.3,
    description: 'Kemampuan menetapkan tujuan SMART yang efektif',
  },
  TIME_MANAGEMENT: {
    id: 'TM',
    name: 'Manajemen Waktu',
    nameEn: 'Time Management',
    itemCount: 1,
    weight: 1.4,
    description: 'Kemampuan mengatur dan mengoptimalkan penggunaan waktu',
  },
  SELF_DISCIPLINE: {
    id: 'SD',
    name: 'Disiplin Diri',
    nameEn: 'Self-Discipline',
    itemCount: 1,
    weight: 1.3,
    description: 'Kemampuan menahan diri dari godaan dan mengontrol impuls',
  },
  FOCUS_CONCENTRATION: {
    id: 'FC',
    name: 'Fokus & Konsentrasi',
    nameEn: 'Focus & Concentration',
    itemCount: 1,
    weight: 1.2,
    description: 'Kemampuan mempertahankan fokus pada tugas penting',
  },
  TASK_PRIORITIZATION: {
    id: 'TP',
    name: 'Prioritisasi Tugas',
    nameEn: 'Task Prioritization',
    itemCount: 1,
    weight: 1.2,
    description: 'Kemampuan memprioritaskan tugas berdasarkan urgensi dan kepentingan',
  },
  PROCRASTINATION_MANAGEMENT: {
    id: 'PM',
    name: 'Manajemen Prokrastinasi',
    nameEn: 'Procrastination Management',
    itemCount: 1,
    weight: 1.3,
    description: 'Kemampuan mengelola dan mengurangi penundaan tugas',
  },
  PRODUCTIVITY_HABITS: {
    id: 'PH',
    name: 'Kebiasaan Produktif',
    nameEn: 'Productivity Habits',
    itemCount: 1,
    weight: 1.1,
    description: 'Konsistensi dalam praktik produktif sehari-hari',
  },
  SELF_MOTIVATION: {
    id: 'SM',
    name: 'Motivasi Diri',
    nameEn: 'Self-Motivation',
    itemCount: 1,
    weight: 1.2,
    description: 'Kemampuan mempertahankan motivasi untuk mencapai tujuan',
  },
};

// Verify total items match QUESTIONS_PER_DIMENSION
export const SELF_MANAGEMENT_TOTAL_ITEMS = Object.values(SELF_MANAGEMENT_SUBDIMENSIONS).reduce(
  (sum, sub) => sum + sub.itemCount, 
  0
);

// Self-Management item ID mapping
export const SELF_MANAGEMENT_ITEM_IDS = {
  GOAL_SETTING: ['SM_GS1'],
  TIME_MANAGEMENT: ['SM_TM1'],
  SELF_DISCIPLINE: ['SM_SD1'],
  FOCUS_CONCENTRATION: ['SM_FC1'],
  TASK_PRIORITIZATION: ['SM_TP1'],
  PROCRASTINATION_MANAGEMENT: ['SM_PM1'],
  PRODUCTIVITY_HABITS: ['SM_PH1'],
  SELF_MOTIVATION: ['SM_SM1'],
} as const;

// ============================================================================
// SELF-MANAGEMENT INTERPRETATION LEVELS
// ============================================================================

export const SELF_MANAGEMENT_INTERPRETATION_LEVELS: InterpretationLevel[] = [
  {
    level: 'Exceptional',
    range: [80, 100],
    description: 'Produktivitas luar biasa, role model untuk manajemen diri',
    color: '#10b981', // emerald-500
    recommendation: 'Mentor others dan bagikan teknik produktivitas Anda',
  },
  {
    level: 'High',
    range: [70, 79],
    description: 'Produktivitas sangat tinggi, konsisten dalam manajemen diri',
    color: '#3b82f6', // blue-500
    recommendation: 'Pertahankan dan tingkatkan kebiasaan produktif',
  },
  {
    level: 'Good',
    range: [60, 69],
    description: 'Produktivitas baik, mampu mengelola diri dengan efektif',
    color: '#8b5cf6', // violet-500
    recommendation: 'Identifikasi area spesifik untuk optimasi lebih lanjut',
  },
  {
    level: 'Moderate',
    range: [50, 59],
    description: 'Produktivitas sedang, ada ruang untuk peningkatan',
    color: '#f59e0b', // amber-500
    recommendation: 'Fokus pada pengembangan kebiasaan produktif',
  },
  {
    level: 'Developing',
    range: [40, 49],
    description: 'Sedang mengembangkan keterampilan manajemen diri',
    color: '#f97316', // orange-500
    recommendation: 'Pelajari teknik manajemen waktu dan prioritas',
  },
  {
    level: 'Needs Development',
    range: [0, 39],
    description: 'Perlu pengembangan signifikan dalam produktivitas',
    color: '#ef4444', // red-500
    recommendation: 'Mulai dengan teknik dasar dan cari mentor',
  },
];

// ============================================================================
// HELPER FUNCTIONS FOR SELF-MANAGEMENT
// ============================================================================

/**
 * Get interpretation level for self-management dimension
 */
export function getSelfManagementInterpretationLevel(score: number): InterpretationLevel {
  const level = SELF_MANAGEMENT_INTERPRETATION_LEVELS.find(
    (l) => score >= l.range[0] && score <= l.range[1]
  );
  return level || SELF_MANAGEMENT_INTERPRETATION_LEVELS[0];
}

/**
 * Calculate self-management dimension score with proper weighting
 */
export function calculateSelfManagementScore(
  responses: Record<string, number>
): { score: number; subscores: Record<string, number> } {
  const subscores: Record<string, number> = {};
  
  // Calculate each sub-dimension average
  for (const [key, itemIds] of Object.entries(SELF_MANAGEMENT_ITEM_IDS)) {
    const values = itemIds.map(id => responses[id] || 3);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    subscores[key] = ((avg - LIKERT_SCALE_MIN) / LIKERT_SCALE_RANGE) * 100;
  }
  
  // Apply weights
  const weights = {
    GOAL_SETTING: SELF_MANAGEMENT_SUBDIMENSIONS.GOAL_SETTING.weight,
    TIME_MANAGEMENT: SELF_MANAGEMENT_SUBDIMENSIONS.TIME_MANAGEMENT.weight,
    SELF_DISCIPLINE: SELF_MANAGEMENT_SUBDIMENSIONS.SELF_DISCIPLINE.weight,
    FOCUS_CONCENTRATION: SELF_MANAGEMENT_SUBDIMENSIONS.FOCUS_CONCENTRATION.weight,
    TASK_PRIORITIZATION: SELF_MANAGEMENT_SUBDIMENSIONS.TASK_PRIORITIZATION.weight,
    PROCRASTINATION_MANAGEMENT: SELF_MANAGEMENT_SUBDIMENSIONS.PROCRASTINATION_MANAGEMENT.weight,
    PRODUCTIVITY_HABITS: SELF_MANAGEMENT_SUBDIMENSIONS.PRODUCTIVITY_HABITS.weight,
    SELF_MOTIVATION: SELF_MANAGEMENT_SUBDIMENSIONS.SELF_MOTIVATION.weight,
  };
  
  const weightedSum = Object.entries(subscores).reduce(
    (sum, [key, score]) => sum + score * weights[key as keyof typeof weights],
    0
  );
  
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  const finalScore = Math.min(100, Math.max(0, weightedSum / totalWeight));
  
  return {
    score: Math.round(finalScore * 10) / 10,
    subscores,
  };
}

// ============================================================================
// FINANCIAL SUB-DIMENSION METADATA
// ============================================================================

export const FINANCIAL_SUBDIMENSIONS: Record<string, SubDimensionMetadata> = {
  KNOWLEDGE: {
    id: 'FK',
    name: 'Pengetahuan Keuangan',
    nameEn: 'Financial Knowledge',
    itemCount: 3,
    weight: 1.1,
    description: 'Pemahaman konsep keuangan dasar seperti bunga, inflasi, dan diversifikasi',
  },
  BEHAVIOR: {
    id: 'FB',
    name: 'Perilaku Keuangan',
    nameEn: 'Financial Behavior',
    itemCount: 4,
    weight: 1.05,
    description: 'Praktik pengelolaan keuangan sehari-hari termasuk anggaran dan tabungan',
  },
  ATTITUDE: {
    id: 'FA',
    name: 'Sikap Keuangan',
    nameEn: 'Financial Attitude',
    itemCount: 3,
    weight: 0.93,
    description: 'Keyakinan dan preferensi terhadap pengelolaan keuangan jangka panjang',
  },
  DIGITAL: {
    id: 'FD',
    name: 'Literasi Digital',
    nameEn: 'Digital Financial Literacy',
    itemCount: 2,
    weight: 1.1,
    description: 'Pemahaman transaksi digital dan keamanan finansial online',
  },
  ENGINEERING: {
    id: 'FE',
    name: 'Keuangan Teknik',
    nameEn: 'Engineering Financial Skills',
    itemCount: 2,
    weight: 1.1,
    description: 'Keterampilan estimasi biaya proyek dan analisis cost-benefit',
  },
};

// Verify total items (12 items for Financial - exceeds target of 8)
export const FINANCIAL_TOTAL_ITEMS = Object.values(FINANCIAL_SUBDIMENSIONS).reduce(
  (sum, sub) => sum + sub.itemCount, 
  0
);

// Financial item ID mapping
export const FINANCIAL_ITEM_IDS = {
  KNOWLEDGE: ['FK1', 'FK2', 'FK3'],
  BEHAVIOR: ['FB1', 'FB2', 'FB3', 'FB4'],
  ATTITUDE: ['FA1', 'FA2', 'FA3'],
  DIGITAL: ['FD1', 'FD2'],
  ENGINEERING: ['FE1', 'FE2'],
} as const;

// ============================================================================
// FINANCIAL INTERPRETATION LEVELS
// ============================================================================

export const FINANCIAL_INTERPRETATION_LEVELS: InterpretationLevel[] = [
  {
    level: 'Excellent',
    range: [85, 100],
    description: 'Financially savvy, above 85% peers in financial management',
    color: '#10b981', // emerald-500
    recommendation: 'Mentor others and explore advanced investment strategies',
  },
  {
    level: 'Advanced',
    range: [70, 84],
    description: 'Above average financial management skills',
    color: '#3b82f6', // blue-500
    recommendation: 'Continue good practices and expand financial knowledge',
  },
  {
    level: 'Competent',
    range: [55, 69],
    description: 'Adequate for academic success and basic financial planning',
    color: '#f59e0b', // amber-500
    recommendation: 'Focus on budgeting and saving habits improvement',
  },
  {
    level: 'Developing',
    range: [40, 54],
    description: 'Financial skills developing, needs consistent practice',
    color: '#ef4444', // red-500
    recommendation: 'Learn basic financial literacy and start budgeting',
  },
  {
    level: 'Beginner',
    range: [0, 39],
    description: 'Needs significant development in financial management',
    color: '#6b7280', // gray-500
    recommendation: 'Start with basic financial education and seek guidance',
  },
];

// ============================================================================
// HELPER FUNCTIONS FOR FINANCIAL
// ============================================================================

/**
 * Get interpretation level for financial dimension
 */
export function getFinancialInterpretationLevel(score: number): InterpretationLevel {
  const level = FINANCIAL_INTERPRETATION_LEVELS.find(
    (l) => score >= l.range[0] && score <= l.range[1]
  );
  return level || FINANCIAL_INTERPRETATION_LEVELS[0];
}

/**
 * Calculate financial dimension score with proper weighting
 */
export function calculateFinancialScore(
  responses: Record<string, number>
): { score: number; subscores: Record<string, number> } {
  const subscores: Record<string, number> = {};
  
  // Calculate each sub-dimension average
  for (const [key, itemIds] of Object.entries(FINANCIAL_ITEM_IDS)) {
    const values = itemIds.map(id => responses[id] || 3);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    subscores[key] = ((avg - LIKERT_SCALE_MIN) / LIKERT_SCALE_RANGE) * 100;
  }
  
  // Apply weights
  const weights = {
    KNOWLEDGE: FINANCIAL_SUBDIMENSIONS.KNOWLEDGE.weight,
    BEHAVIOR: FINANCIAL_SUBDIMENSIONS.BEHAVIOR.weight,
    ATTITUDE: FINANCIAL_SUBDIMENSIONS.ATTITUDE.weight,
    DIGITAL: FINANCIAL_SUBDIMENSIONS.DIGITAL.weight,
    ENGINEERING: FINANCIAL_SUBDIMENSIONS.ENGINEERING.weight,
  };
  
  const weightedSum = Object.entries(subscores).reduce(
    (sum, [key, score]) => sum + score * weights[key as keyof typeof weights],
    0
  );
  
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  const finalScore = Math.min(100, Math.max(0, weightedSum / totalWeight));
  
  return {
    score: Math.round(finalScore * 10) / 10,
    subscores,
  };
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================



export default {
  DIMENSION_IDS,
  DIMENSION_ID_LIST,
  QUESTIONS_PER_DIMENSION,
  TOTAL_QUESTIONS,
  LIKERT_SCALE_MIN,
  LIKERT_SCALE_MAX,
  SCORING,
  INTERPRETATION_LEVELS,
  COGNITIVE_INTERPRETATION_LEVELS,
  SELF_MANAGEMENT_INTERPRETATION_LEVELS,
  FINANCIAL_INTERPRETATION_LEVELS,
  VALIDITY_THRESHOLDS,
  ASSESSMENT_CONFIG,
  DIMENSION_METADATA,
  COGNITIVE_SUBDIMENSIONS,
  COGNITIVE_ITEM_IDS,
  COGNITIVE_TOTAL_ITEMS,
  SELF_MANAGEMENT_SUBDIMENSIONS,
  SELF_MANAGEMENT_ITEM_IDS,
  SELF_MANAGEMENT_TOTAL_ITEMS,
  FINANCIAL_SUBDIMENSIONS,
  FINANCIAL_ITEM_IDS,
  FINANCIAL_TOTAL_ITEMS,
  getInterpretationLevel,
  getCognitiveInterpretationLevel,
  getSelfManagementInterpretationLevel,
  getFinancialInterpretationLevel,
  calculateNormalizedScore,
  calculateConfidenceInterval,
  calculateCognitiveScore,
  calculateSelfManagementScore,
  calculateFinancialScore,
  getTotalEstimatedTime,
  isValidDimensionId,
  getDimensionMetadata,
};
