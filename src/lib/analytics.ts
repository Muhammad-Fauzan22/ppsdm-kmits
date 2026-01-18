// Analytics Engine - Progress Tracking & Insights
// Free implementation using calculation algorithms

export interface DimensionScore {
    dimension: string;
    score: number;
    previousScore: number;
    change: number;
    percentile?: number;
}

export interface GapAnalysis {
    dimension: string;
    currentScore: number;
    targetScore: number;
    gap: number;
    gapPercentage: number;
    priority: 'critical' | 'high' | 'moderate' | 'minimal';
    recommendations: string[];
}

export interface WeeklyProgress {
    weekNumber: number;
    startDate: string;
    endDate: string;
    activitiesCompleted: number;
    resourcesCompleted: number;
    goalsAchieved: number;
    xpEarned: number;
    avgDimensionChange: number;
}

// Dimension benchmarks (Indonesian student norms)
export const DIMENSION_BENCHMARKS: Record<string, { poor: number; below: number; average: number; good: number; excellent: number }> = {
    cognitive: { poor: 40, below: 55, average: 65, good: 78, excellent: 88 },
    emotional: { poor: 35, below: 50, average: 62, good: 75, excellent: 85 },
    social: { poor: 38, below: 52, average: 65, good: 77, excellent: 88 },
    physical: { poor: 30, below: 45, average: 58, good: 72, excellent: 85 },
    financial: { poor: 25, below: 40, average: 55, good: 70, excellent: 82 },
    character: { poor: 45, below: 58, average: 70, good: 82, excellent: 92 },
    spiritual: { poor: 40, below: 55, average: 68, good: 80, excellent: 90 },
    environmental: { poor: 30, below: 45, average: 58, good: 72, excellent: 85 },
    career: { poor: 25, below: 42, average: 55, good: 70, excellent: 85 },
};

// Calculate gap analysis
export function calculateGapAnalysis(
    currentScores: Record<string, number>,
    targetScores?: Record<string, number>
): GapAnalysis[] {
    const dimensions = Object.keys(DIMENSION_BENCHMARKS);

    return dimensions.map(dim => {
        const current = currentScores[dim] || 0;
        const target = targetScores?.[dim] || DIMENSION_BENCHMARKS[dim].good;
        const gap = target - current;
        const gapPercentage = target > 0 ? Math.round((gap / target) * 100) : 0;

        let priority: 'critical' | 'high' | 'moderate' | 'minimal';
        if (gap > 30) priority = 'critical';
        else if (gap > 20) priority = 'high';
        else if (gap > 10) priority = 'moderate';
        else priority = 'minimal';

        const recommendations = getRecommendations(dim, current, gap);

        return {
            dimension: dim,
            currentScore: current,
            targetScore: target,
            gap,
            gapPercentage,
            priority,
            recommendations,
        };
    }).sort((a, b) => b.gap - a.gap);
}

// Get dimension-specific recommendations
function getRecommendations(dimension: string, score: number, gap: number): string[] {
    const recs: Record<string, string[]> = {
        cognitive: ['Latihan berpikir kritis 15 menit/hari', 'Baca 1 buku non-fiksi/bulan', 'Ikuti kursus online gratis'],
        emotional: ['Praktikkan journaling harian', 'Latihan mindfulness 10 menit/hari', 'Komunikasikan perasaan dengan orang terdekat'],
        social: ['Bergabung dengan 1 komunitas baru', 'Latih public speaking mingguan', 'Praktikkan active listening'],
        physical: ['Olahraga 30 menit 3x/minggu', 'Tidur 7-8 jam/malam', 'Kurangi processed food'],
        financial: ['Buat dan ikuti budget bulanan', 'Sisihkan 20% pendapatan', 'Pelajari investasi dasar'],
        character: ['Tetapkan 3 nilai inti pribadi', 'Praktikkan disiplin kecil harian', 'Buat accountability partner'],
        spiritual: ['Refleksi 10 menit setiap pagi', 'Praktikkan gratitude journaling', 'Volunteer 2x/bulan'],
        environmental: ['Kurangi sampah plastik 50%', 'Hemat listrik dan air', 'Gunakan transportasi publik'],
        career: ['Update CV/Resume', 'Network dengan 2 profesional/minggu', 'Identifikasi skill gap dan belajar'],
    };

    if (gap <= 10) return [recs[dimension]?.[0] || 'Pertahankan progress saat ini'];
    if (gap <= 20) return recs[dimension]?.slice(0, 2) || [];
    return recs[dimension] || [];
}

// Calculate percentile rank
export function calculatePercentile(score: number, dimension: string): number {
    const benchmarks = DIMENSION_BENCHMARKS[dimension];
    if (!benchmarks) return 50;

    if (score >= benchmarks.excellent) return 95;
    if (score >= benchmarks.good) return 75 + ((score - benchmarks.good) / (benchmarks.excellent - benchmarks.good)) * 20;
    if (score >= benchmarks.average) return 50 + ((score - benchmarks.average) / (benchmarks.good - benchmarks.average)) * 25;
    if (score >= benchmarks.below) return 25 + ((score - benchmarks.below) / (benchmarks.average - benchmarks.below)) * 25;
    if (score >= benchmarks.poor) return 5 + ((score - benchmarks.poor) / (benchmarks.below - benchmarks.poor)) * 20;
    return 5;
}

// Calculate overall development index (0-100)
export function calculateDevelopmentIndex(scores: Record<string, number>): { index: number; category: string } {
    const dims = Object.keys(DIMENSION_BENCHMARKS);
    const total = dims.reduce((sum, dim) => sum + (scores[dim] || 0), 0);
    const index = Math.round(total / dims.length);

    let category: string;
    if (index >= 85) category = 'Sangat Berkembang';
    else if (index >= 70) category = 'Berkembang Baik';
    else if (index >= 55) category = 'Berkembang';
    else if (index >= 40) category = 'Perlu Peningkatan';
    else category = 'Perlu Perhatian Khusus';

    return { index, category };
}

// Calculate balance index (how balanced across dimensions)
export function calculateBalanceIndex(scores: Record<string, number>): { index: number; isBalanced: boolean } {
    const values = Object.values(scores).filter(v => v > 0);
    if (values.length === 0) return { index: 0, isBalanced: false };

    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    // Lower stdDev = more balanced
    const index = Math.max(0, Math.round(100 - stdDev * 2));

    return { index, isBalanced: index >= 70 };
}

// Generate insights based on scores
export function generateInsights(scores: Record<string, number>, previousScores?: Record<string, number>): string[] {
    const insights: string[] = [];
    const { index, category } = calculateDevelopmentIndex(scores);
    const { isBalanced } = calculateBalanceIndex(scores);

    insights.push(`Indeks Pengembangan Anda: ${index}/100 (${category})`);

    // Strongest dimension
    const strongest = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
    if (strongest) {
        insights.push(`Dimensi terkuat: ${strongest[0]} (${strongest[1]})`);
    }

    // Dimension needing attention
    const weakest = Object.entries(scores).sort((a, b) => a[1] - b[1])[0];
    if (weakest && weakest[1] < 60) {
        insights.push(`Fokus pengembangan: ${weakest[0]} (${weakest[1]})`);
    }

    // Balance insight
    if (isBalanced) {
        insights.push('✅ Pengembangan Anda cukup seimbang!');
    } else {
        insights.push('📊 Tips: Fokuskan pengembangan pada dimensi yang lebih rendah');
    }

    // Progress comparison
    if (previousScores) {
        const improved = Object.keys(scores).filter(dim => (scores[dim] || 0) > (previousScores[dim] || 0));
        if (improved.length > 0) {
            insights.push(`🎉 Progress: ${improved.length} dimensi meningkat!`);
        }
    }

    return insights;
}

// Chart data for radar visualization
export function getRadarChartData(scores: Record<string, number>) {
    const dims = ['cognitive', 'emotional', 'social', 'physical', 'financial', 'character', 'spiritual', 'environmental', 'career'];
    const labels = ['Kognitif', 'Emosional', 'Sosial', 'Fisik', 'Finansial', 'Karakter', 'Spiritual', 'Lingkungan', 'Karir'];

    return {
        labels,
        datasets: [{
            label: 'Skor Anda',
            data: dims.map(d => scores[d] || 0),
            backgroundColor: 'rgba(0, 51, 102, 0.2)',
            borderColor: 'rgba(0, 51, 102, 1)',
            borderWidth: 2,
        }]
    };
}

// ============================================
// PERSONALIZATION ENGINE
// Free implementation connecting scores to resources
// ============================================

export interface LearningResource {
    id: string;
    title: string;
    category: string;
    url: string;
    type: 'video' | 'article' | 'course' | 'exercise';
    duration: string;
    provider: string;
    free: boolean;
}

// Map dimensions to resource categories
const dimensionToCategory: Record<string, string[]> = {
    cognitive: ['critical_thinking', 'problem_solving', 'learning_skills'],
    self_management: ['productivity', 'time_management', 'self_discipline'],
    financial: ['budgeting', 'investing', 'financial_literacy'],
    physical_health: ['exercise', 'nutrition', 'sleep'],
    emotional_intelligence: ['eq', 'communication', 'empathy'],
    mental_health: ['mindfulness', 'stress_management', 'wellbeing'],
    character_ethics: ['character', 'ethics', 'values'],
    spiritual: ['spirituality', 'purpose', 'meaning'],
    environmental: ['sustainability', 'eco_lifestyle', 'digital_wellness'],
};

// Get priority domains (3 lowest scores)
export function getPriorityDomains(scores: Record<string, number>, count: number = 3): {
    domain: string;
    score: number;
    gap: number;
    priority: number;
}[] {
    return Object.entries(scores)
        .filter(([, score]) => score > 0) // Only scored dimensions
        .sort(([, a], [, b]) => a - b)
        .slice(0, count)
        .map(([domain, score], index) => ({
            domain,
            score,
            gap: (DIMENSION_BENCHMARKS[domain]?.good || 75) - score,
            priority: index + 1,
        }));
}

// Get recommended learning path based on lowest scores
export function getRecommendedPath(
    assessmentResults: Record<string, number>,
    allResources: LearningResource[]
): {
    priorityDomains: string[];
    recommendedResources: LearningResource[];
    actionPlan: string[];
} {
    // 1. Identify 3 domains with lowest scores
    const priorityDomains = getPriorityDomains(assessmentResults)
        .map(p => p.domain);

    // 2. Get relevant categories for those domains
    const relevantCategories = priorityDomains
        .flatMap(domain => dimensionToCategory[domain] || []);

    // 3. Filter resources matching those categories
    const recommendedResources = allResources
        .filter(res =>
            relevantCategories.includes(res.category) ||
            priorityDomains.includes(res.category)
        )
        .slice(0, 10); // Limit to top 10

    // 4. Generate action plan
    const actionPlan = priorityDomains.map((domain, idx) => {
        const score = assessmentResults[domain] || 0;
        const target = DIMENSION_BENCHMARKS[domain]?.good || 75;
        return `${idx + 1}. Fokus pada ${domain}: naikan skor dari ${score} ke ${target} (+${target - score} poin)`;
    });

    return { priorityDomains, recommendedResources, actionPlan };
}

// Generate personalized weekly plan
export function generateWeeklyPlan(
    scores: Record<string, number>,
    availableHours: number = 5
): {
    day: string;
    activity: string;
    dimension: string;
    duration: string;
    xpReward: number;
}[] {
    const priorityDomains = getPriorityDomains(scores, 3);
    const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

    const activities: Record<string, { activity: string; duration: string; xp: number }[]> = {
        cognitive: [
            { activity: 'Baca artikel ilmiah 📚', duration: '30 min', xp: 25 },
            { activity: 'Puzzle/brain game 🧩', duration: '15 min', xp: 15 },
            { activity: 'Kursus online (Coursera/edX) 💻', duration: '45 min', xp: 40 },
        ],
        self_management: [
            { activity: 'Review weekly goals 📝', duration: '20 min', xp: 20 },
            { activity: 'Time-blocking session ⏰', duration: '15 min', xp: 15 },
            { activity: 'Productivity app practice 📱', duration: '30 min', xp: 25 },
        ],
        financial: [
            { activity: 'Update budget tracker 💰', duration: '20 min', xp: 25 },
            { activity: 'Baca artikel finansial 📰', duration: '30 min', xp: 20 },
            { activity: 'Investment simulation 📈', duration: '30 min', xp: 30 },
        ],
        physical_health: [
            { activity: 'Workout session 💪', duration: '30 min', xp: 35 },
            { activity: 'Stretching/yoga 🧘', duration: '20 min', xp: 20 },
            { activity: 'Meal prep planning 🥗', duration: '20 min', xp: 15 },
        ],
        emotional_intelligence: [
            { activity: 'Journaling session ✏️', duration: '15 min', xp: 20 },
            { activity: 'Communication practice 🗣️', duration: '30 min', xp: 30 },
            { activity: 'Emotion regulation exercise 💚', duration: '15 min', xp: 20 },
        ],
        mental_health: [
            { activity: 'Mindfulness meditation 🧘', duration: '15 min', xp: 25 },
            { activity: 'Gratitude journaling 🙏', duration: '10 min', xp: 15 },
            { activity: 'Digital detox time 📵', duration: '60 min', xp: 20 },
        ],
        character_ethics: [
            { activity: 'Value reflection session 🔍', duration: '20 min', xp: 25 },
            { activity: 'Ethics case study 📖', duration: '30 min', xp: 30 },
            { activity: 'Volunteer planning 🤝', duration: '20 min', xp: 25 },
        ],
        spiritual: [
            { activity: 'Purpose journaling 📝', duration: '20 min', xp: 25 },
            { activity: 'Gratitude practice 🙏', duration: '10 min', xp: 15 },
            { activity: 'Meaning reflection 🕊️', duration: '20 min', xp: 20 },
        ],
        environmental: [
            { activity: 'Eco-habit tracking 🌍', duration: '15 min', xp: 15 },
            { activity: 'Sustainability learning 📚', duration: '30 min', xp: 25 },
            { activity: 'Digital wellness check 📱', duration: '15 min', xp: 15 },
        ],
    };

    const plan: {
        day: string;
        activity: string;
        dimension: string;
        duration: string;
        xpReward: number;
    }[] = [];

    days.forEach((day, index) => {
        // Rotate through priority domains
        const domain = priorityDomains[index % priorityDomains.length];
        const domainActivities = activities[domain.domain] || activities['cognitive'];
        const activity = domainActivities[index % domainActivities.length];

        plan.push({
            day,
            activity: activity.activity,
            dimension: domain.domain,
            duration: activity.duration,
            xpReward: activity.xp,
        });
    });

    return plan;
}

// Get comparison summary for dashboard
export function getComparisonSummary(scores: Record<string, number>): {
    aboveNational: string[];
    belowNational: string[];
    aboveITS: string[];
    belowITS: string[];
    overallMessage: string;
} {
    const aboveNational: string[] = [];
    const belowNational: string[] = [];
    const aboveITS: string[] = [];
    const belowITS: string[] = [];

    // Simplified comparison using existing benchmarks
    Object.entries(scores).forEach(([dim, score]) => {
        const benchmark = DIMENSION_BENCHMARKS[dim];
        if (!benchmark) return;

        // Compare to "average" as national proxy
        if (score >= benchmark.average) {
            aboveNational.push(dim);
        } else {
            belowNational.push(dim);
        }

        // Compare to "good" as ITS proxy (higher standard)
        if (score >= benchmark.good) {
            aboveITS.push(dim);
        } else {
            belowITS.push(dim);
        }
    });

    const completedDims = Object.keys(scores).filter(k => scores[k] > 0).length;
    const avgScore = Object.values(scores).filter(v => v > 0).reduce((a, b) => a + b, 0) / (completedDims || 1);

    let overallMessage: string;
    if (aboveNational.length >= completedDims * 0.8) {
        overallMessage = '🌟 Excellent! Skor kamu di atas rata-rata nasional!';
    } else if (aboveNational.length >= completedDims * 0.5) {
        overallMessage = '✅ Good! Separuh skor kamu di atas rata-rata nasional.';
    } else {
        overallMessage = '📈 Keep growing! Fokus pada dimensi yang perlu ditingkatkan.';
    }

    return {
        aboveNational,
        belowNational,
        aboveITS,
        belowITS,
        overallMessage,
    };
}

