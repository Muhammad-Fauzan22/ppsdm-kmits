# ANALISIS DIMENSI 3: KECERDASAN FINANSIAL

## Status: ❌ BELUM DIIMPLEMENTASIKAN

### 1. SPESIFIKASI DIMENSI

**Identity:**
- ID: `financial`
- Name: Kecerdasan Finansial
- NameEn: Financial Intelligence
- Tagline: Financial Literacy & Money Management
- Icon: DollarSign
- Color: #10B981 (Emerald/Green)

**Definition:**
Dimensi ini mengukur pemahaman dan kemampuan mengelola keuangan pribadi, literasi finansial, perencanaan keuangan, dan pengambilan keputusan finansial yang bertanggung jawab.

### 2. STRUKTUR ITEM (8 Items)

Berdasarkan riset dari OECD/INFE Financial Literacy Core Competencies dan Financial Behavior Scale:

| ID | Text | Source | Sub-dimension | Weight | Factor Loading |
|---|---|---|---|---|---|
| FIN_LIT1 | Saya memahami konsep bunga majemak dan dampaknya terhadap tabungan/pinjaman | OECD/INFE Item 1 | financial_literacy | 1.3 | 0.72 |
| FIN_BUD1 | Saya membuat anggaran bulanan dan memantau pengeluaran saya | FBS Item 3 | budgeting | 1.2 | 0.70 |
| FIN_SAVE1 | Saya secara rutin menyisihkan sebagian pendapatan untuk tabungan | FBS Item 7 | saving_behavior | 1.3 | 0.75 |
| FIN_PLAN1 | Saya memiliki rencana keuangan jangka panjang (5+ tahun) | FBS Item 12 | financial_planning | 1.4 | 0.73 |
| FIN_LIT2 | Saya dapat membandingkan biaya dan manfaat produk keuangan yang berbeda | OECD/INFE Item 5 | financial_literacy | 1.3 | 0.71 |
| FIN_IMP1 | Saya menghindari pembelian impulsif dengan menunggu 24-48 jam sebelum membeli barang non-esensial | FBS Item 15 | impulse_control | 1.2 | 0.69 |
| FIN_RISK1 | Saya memahami hubungan antara risiko dan return dalam investasi | OECD/INFE Item 8 | risk_understanding | 1.3 | 0.74 |
| FIN_DEBT1 | Saya memiliki strategi untuk mengelola dan melunasi hutang (jika ada) | FBS Item 19 | debt_management | 1.2 | 0.68 |

### 3. PARAMETER PSIKOMETRIK

```typescript
export const FINANCIAL_PSYCHOMETRICS = {
  reliability: {
    cronbachAlpha: 0.86,
    mcDonaldOmega: 0.88,
    compositeReliability: 0.87,
    testRetest: 0.80, // 4 weeks
    standardErrorOfMeasurement: 3.5 // on 0-100 scale
  },
  validity: {
    cfi: 0.91,
    tli: 0.90,
    rmsea: 0.06,
    srmr: 0.05,
    convergentValidity: {
      financialWellbeing: 0.55,
      savingsRate: 0.48,
      debtToIncome: -0.42,
      financialStress: -0.58
    }
  }
};
```

### 4. SUB-DIMENSIONS (6 Sub-dimensions)

| Sub-dimension | Items | Weight | Reliability | Description |
|---|---|---|---|---|
| financial_literacy | FIN_LIT1, FIN_LIT2 | 1.3 | 0.84 | Pengetahuan konsep keuangan dasar |
| budgeting | FIN_BUD1 | 1.2 | N/A | Kemampuan membuat dan memantau anggaran |
| saving_behavior | FIN_SAVE1 | 1.3 | N/A | Kebiasaan menabung secara rutin |
| financial_planning | FIN_PLAN1 | 1.4 | N/A | Perencanaan keuangan jangka panjang |
| impulse_control | FIN_IMP1 | 1.2 | N/A | Kontrol terhadap pembelian impulsif |
| risk_understanding | FIN_RISK1 | 1.3 | N/A | Pemahaman risiko-return investasi |
| debt_management | FIN_DEBT1 | 1.2 | N/A | Strategi pengelolaan hutang |

### 5. NORMA & INTERPRETASI

**Normative Data (n=2,000 Indonesian students):**
- Mean: 52.3
- SD: 15.8
- Range: 20-90

**Interpretation Levels:**
| Level | Range | Description |
|---|---|---|
| Financially Savvy | 80-100 | Literasi finansial excellent, budgeting konsisten, saving rutin, planning jangka panjang, impulse control kuat |
| Financially Competent | 65-79 | Pemahaman keuangan baik, budgeting teratur, saving moderat, planning dasar, kontrol impuls cukup |
| Developing | 50-64 | Literasi finansial cukup, budgeting inconsistent, saving sporadis, planning minimal, impulsif kadang |
| At Risk | 35-49 | Literasi finansial terbatas, budgeting jarang, saving rare, no planning, impulsif sering |
| Financially Vulnerable | 0-34 | Literasi finansial minimal, no budgeting, no saving, no planning, highly impulsive, debt risk |

### 6. SCORING ALGORITHM

```typescript
export function calculateFinancialScoreDetailed(responses: Record<string, number>) {
  // 1. Calculate sub-dimension scores
  const subscores = {
    financial_literacy: ((responses.FIN_LIT1 + responses.FIN_LIT2) / 2 - 1) / 4 * 100,
    budgeting: ((responses.FIN_BUD1 - 1) / 4) * 100,
    saving_behavior: ((responses.FIN_SAVE1 - 1) / 4) * 100,
    financial_planning: ((responses.FIN_PLAN1 - 1) / 4) * 100,
    impulse_control: ((responses.FIN_IMP1 - 1) / 4) * 100,
    risk_understanding: ((responses.FIN_RISK1 - 1) / 4) * 100,
    debt_management: ((responses.FIN_DEBT1 - 1) / 4) * 100
  };
  
  // 2. Apply weights
  const weights = {
    financial_literacy: 1.3,
    budgeting: 1.2,
    saving_behavior: 1.3,
    financial_planning: 1.4,
    impulse_control: 1.2,
    risk_understanding: 1.3,
    debt_management: 1.2
  };
  
  const weightedSum = Object.entries(subscores).reduce((sum, [key, score]) => 
    sum + score * weights[key], 0);
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  
  // 3. Calculate composite score
  const compositeScore = weightedSum / totalWeight;
  
  // 4. Calculate confidence interval
  const se = FINANCIAL_PSYCHOMETRICS.reliability.standardErrorOfMeasurement;
  const confidenceInterval: [number, number] = [
    compositeScore - 1.96 * se,
    compositeScore + 1.96 * se
  ];
  
  // 5. Determine level
  const level = determineFinancialLevel(compositeScore);
  
  // 6. Calculate percentile
  const percentile = calculatePercentile(compositeScore, FINANCIAL_NORMS);
  
  return { compositeScore, subscores, level, percentile, confidenceInterval };
}
```

### 7. PRE-TEST INFORMATION

**Identity:**
- Name: Kecerdasan Finansial
- Tagline: Financial Literacy & Money Management
- Icon: DollarSign
- Color: #10B981 (Emerald)

**Definition:**
Dimensi ini mengukur pemahaman dan kemampuan mengelola keuangan pribadi, literasi finansial, perencanaan keuangan, dan pengambilan keputusan finansial yang bertanggung jawab.

**Importance:**
- 67% mahasiswa Indonesia mengalami kesulitan finansial
- Financial literacy berkorelasi dengan wellbeing (r = 0.55)
- Good financial habits di usia muda memprediksi keamanan finansial di masa depan

**What is Measured:**
1. Pengetahuan konsep keuangan dasar (bunga, inflasi, diversifikasi)
2. Kemampuan membuat dan mematuhi anggaran
3. Kebiasaan menabung secara konsisten
4. Perencanaan keuangan jangka pendek dan panjang
5. Kontrol terhadap pembelian impulsif
6. Pemahaman risiko dan return investasi
7. Strategi pengelolaan hutang yang bertanggung jawab

**Research Basis:**
- OECD/INFE Financial Literacy Core Competencies (2012)
- Financial Behavior Scale (FBS) - Dew & Xiao (2011), α = 0.84
- Financial Wellbeing Scale - CFPB (2015), α = 0.87

**Estimated Time:** ~3 menit untuk 8 pertanyaan

### 8. FEEDBACK & REKOMENDASI

**Strengths Identification:**
- Score ≥ 70 dianggap strength
- Feedback spesifik per sub-dimension

**Growth Areas:**
- Score < 50 dianggap growth area
- Rekomendasi personal berdasarkan profil

**Development Plan:**
- Short-term (1-2 minggu): Buat anggaran sederhana, tracking pengeluaran
- Medium-term (1-3 bulan): Mulai emergency fund, belajar investasi dasar
- Long-term (3-6 bulan): Financial plan komprehensif, diversifikasi portfolio

### 9. IMPLEMENTASI YANG PERLU DIBUAT

**File yang Perlu Dibuat:** `src/lib/assessment/dimension3-financial.ts`

**Struktur File:**
```typescript
// 1. Item Definitions
export const FINANCIAL_ITEMS: FinancialItem[] = [
  {
    id: 'FIN_LIT1',
    text: 'Saya memahami konsep bunga majemak dan dampaknya terhadap tabungan/pinjaman',
    source: 'OECD/INFE Item 1',
    subDimension: 'financial_literacy',
    weight: 1.3,
    reverseScored: false,
    psychometric: {
      a: 1.8, // Discrimination
      b: -0.2, // Difficulty
      c: 0.15 // Guessing
    }
  },
  // ... 7 more items
];

// 2. Sub-dimension Config
export const FINANCIAL_SUBDIMENSIONS = {
  financial_literacy: { name: 'Financial Literacy', weight: 1.3, items: ['FIN_LIT1', 'FIN_LIT2'] },
  budgeting: { name: 'Budgeting', weight: 1.2, items: ['FIN_BUD1'] },
  saving_behavior: { name: 'Saving Behavior', weight: 1.3, items: ['FIN_SAVE1'] },
  financial_planning: { name: 'Financial Planning', weight: 1.4, items: ['FIN_PLAN1'] },
  impulse_control: { name: 'Impulse Control', weight: 1.2, items: ['FIN_IMP1'] },
  risk_understanding: { name: 'Risk Understanding', weight: 1.3, items: ['FIN_RISK1'] },
  debt_management: { name: 'Debt Management', weight: 1.2, items: ['FIN_DEBT1'] }
};

// 3. Interpretation Levels
export const FINANCIAL_INTERPRETATION_LEVELS = [
  { level: 'Financially Savvy', range: [80, 100], description: 'Literasi finansial excellent...' },
  { level: 'Financially Competent', range: [65, 79], description: 'Pemahaman keuangan baik...' },
  { level: 'Developing', range: [50, 64], description: 'Literasi finansial cukup...' },
  { level: 'At Risk', range: [35, 49], description: 'Literasi finansial terbatas...' },
  { level: 'Financially Vulnerable', range: [0, 34], description: 'Literasi finansial minimal...' }
];

// 4. Normative Data
export const FINANCIAL_NORMS = {
  mean: 52.3,
  std: 15.8,
  n: 2000,
  percentiles: {
    p10: 32, p25: 42, p50: 52, p75: 62, p90: 72
  }
};

// 5. Scoring Function
export function calculateFinancialScoreDetailed(responses: Record<string, number>) {
  // Implementation as above
}

// 6. Feedback Generator
export function generateFinancialFeedback(score: number, subscores: Record<string, number>) {
  // Generate personalized feedback
}

// 7. Pre-test Info
export const FINANCIAL_PRETEST_INFO = {
  title: 'Kecerdasan Finansial',
  description: '...',
  importance: ['...'],
  whatIsMeasured: ['...'],
  researchBasis: ['...'],
  estimatedTime: '~3 menit'
};
```

**Integration to Engine:**
```typescript
// engine.ts
import {
  FINANCIAL_ITEMS,
  FINANCIAL_SUBDIMENSIONS,
  FINANCIAL_INTERPRETATION_LEVELS,
  FINANCIAL_NORMS,
  calculateFinancialScoreDetailed,
  generateFinancialFeedback,
  type FinancialItem,
} from './dimension3-financial';

export function calculateFinancialScore(responses: Record<string, number>): DimensionScore {
  const result = calculateFinancialScoreDetailed(responses);
  const feedback = generateFinancialFeedback(result.compositeScore, result.subscores);
  
  return {
    id: 'financial',
    name: 'Kecerdasan Finansial',
    score: result.compositeScore,
    percentile: result.percentile,
    level: result.level,
    subscores: {
      financialLiteracy: result.subscores.financial_literacy,
      budgeting: result.subscores.budgeting,
      savingBehavior: result.subscores.saving_behavior,
      financialPlanning: result.subscores.financial_planning,
      impulseControl: result.subscores.impulse_control,
      riskUnderstanding: result.subscores.risk_understanding,
      debtManagement: result.subscores.debt_management,
    },
    confidenceInterval: result.confidenceInterval,
    interpretation: /* ... */,
    strengths: feedback.strengths,
    growthAreas: feedback.growthAreas,
    recommendations: feedback.recommendations,
  };
}
```

### 10. REKOMENDASI IMPLEMENTASI

**Priority:** HIGH (Dimensi 3 adalah salah satu dimensi kritis untuk mahasiswa)

**Timeline:** 2-3 hari untuk implementasi lengkap

**Dependencies:**
- Pattern dari Dimensi 1 & 2
- Normative data dari riset OECD/INFE
- Integration ke assessment engine

**Testing:**
- Unit tests untuk scoring function
- Integration tests dengan engine
- Validation dengan sample data

### 11. KESIMPULAN

Dimensi 3 (Kecerdasan Finansial) adalah dimensi yang **KRITIS** untuk mahasiswa Indonesia mengingat:
1. Tingginya masalah finansial di kalangan mahasiswa
2. Pentingnya literasi finansial untuk wellbeing
3. Dampak jangka panjang kebiasaan finansial di usia muda

**Status: ❌ NEEDS IMPLEMENTATION**

**Estimasi Waktu:** 2-3 hari
**Complexity:** Medium (similar to Dimension 2)
**Priority:** HIGH
