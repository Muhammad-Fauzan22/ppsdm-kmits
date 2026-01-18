// Course Management System
// Lightweight course structure for LMS functionality

export interface Course {
    id: string;
    title: string;
    description: string;
    instructor: string;
    thumbnail?: string;
    category: string;
    dimensions: string[];    // Related PPSDM dimensions
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    duration: string;        // e.g., "4 hours"
    modules: CourseModule[];
    prerequisites: string[]; // Course IDs
    xpReward: number;
    certificateEnabled: boolean;
    enrollmentCount: number;
    rating: number;
    createdAt: string;
    updatedAt: string;
}

export interface CourseModule {
    id: string;
    title: string;
    description: string;
    order: number;
    duration: string;
    lessons: Lesson[];
    quiz?: Quiz;
}

export interface Lesson {
    id: string;
    title: string;
    type: 'video' | 'text' | 'interactive' | 'exercise' | 'download';
    content: string;         // URL for video, markdown for text
    duration: string;
    xpReward: number;
}

export interface Quiz {
    id: string;
    title: string;
    questions: QuizQuestion[];
    passingScore: number;    // Percentage
    maxAttempts: number;
    timeLimit?: number;      // Minutes
}

export interface QuizQuestion {
    id: string;
    text: string;
    type: 'multiple_choice' | 'true_false' | 'short_answer';
    options?: string[];
    correctAnswer: string | number;
    explanation?: string;
    points: number;
}

export interface CourseEnrollment {
    userId: string;
    courseId: string;
    enrolledAt: string;
    progress: number;        // 0-100
    completedLessons: string[];
    quizScores: Record<string, number>;
    completedAt?: string;
    certificateId?: string;
}

// ============================================
// SAMPLE COURSES FOR PPSDM DIMENSIONS
// ============================================

export const SAMPLE_COURSES: Course[] = [
    {
        id: 'course-critical-thinking-101',
        title: 'Critical Thinking Fundamentals',
        description: 'Pelajari dasar-dasar berpikir kritis untuk pengambilan keputusan yang lebih baik',
        instructor: 'Dr. Ahmad Sulaiman',
        category: 'cognitive',
        dimensions: ['cognitive'],
        difficulty: 'beginner',
        duration: '3 hours',
        xpReward: 150,
        certificateEnabled: true,
        enrollmentCount: 1250,
        rating: 4.7,
        prerequisites: [],
        createdAt: '2024-01-15',
        updatedAt: '2024-06-01',
        modules: [
            {
                id: 'mod-1',
                title: 'Apa itu Berpikir Kritis?',
                description: 'Pengantar konsep berpikir kritis',
                order: 1,
                duration: '45 min',
                lessons: [
                    { id: 'l1', title: 'Definisi & Pentingnya', type: 'video', content: 'https://example.com/video1', duration: '15 min', xpReward: 15 },
                    { id: 'l2', title: 'Hambatan Berpikir Kritis', type: 'text', content: '# Hambatan...\n\n- Bias kognitif\n- Emosi', duration: '10 min', xpReward: 10 },
                    { id: 'l3', title: 'Exercise: Identifikasi Bias', type: 'exercise', content: 'https://example.com/exercise1', duration: '20 min', xpReward: 20 },
                ],
            },
            {
                id: 'mod-2',
                title: 'Teknik Analisis',
                description: 'Metode untuk menganalisis informasi',
                order: 2,
                duration: '1 hour',
                lessons: [
                    { id: 'l4', title: 'SWOT Analysis', type: 'video', content: 'https://example.com/video2', duration: '20 min', xpReward: 20 },
                    { id: 'l5', title: 'Root Cause Analysis', type: 'interactive', content: 'https://example.com/interactive1', duration: '25 min', xpReward: 25 },
                    { id: 'l6', title: 'Decision Matrix', type: 'text', content: '# Decision Matrix...', duration: '15 min', xpReward: 15 },
                ],
                quiz: {
                    id: 'q1',
                    title: 'Quiz: Teknik Analisis',
                    passingScore: 70,
                    maxAttempts: 3,
                    timeLimit: 15,
                    questions: [
                        { id: 'qq1', text: 'SWOT adalah singkatan dari...', type: 'multiple_choice', options: ['Strength, Weakness, Opportunity, Threat', 'Strategy, Work, Outcome, Task'], correctAnswer: 0, points: 10 },
                        { id: 'qq2', text: 'Root Cause Analysis membantu menemukan penyebab utama masalah.', type: 'true_false', correctAnswer: 'true', points: 10 },
                    ],
                },
            },
        ],
    },
    {
        id: 'course-financial-literacy-101',
        title: 'Financial Literacy for Students',
        description: 'Pelajari dasar-dasar pengelolaan keuangan untuk mahasiswa',
        instructor: 'Prof. Siti Nurhaliza',
        category: 'financial',
        dimensions: ['financial'],
        difficulty: 'beginner',
        duration: '4 hours',
        xpReward: 200,
        certificateEnabled: true,
        enrollmentCount: 980,
        rating: 4.8,
        prerequisites: [],
        createdAt: '2024-02-01',
        updatedAt: '2024-07-15',
        modules: [
            {
                id: 'fin-mod-1',
                title: 'Dasar Pengelolaan Keuangan',
                description: 'Konsep dasar keuangan pribadi',
                order: 1,
                duration: '1 hour',
                lessons: [
                    { id: 'fl1', title: 'Kenapa Financial Literacy Penting?', type: 'video', content: 'https://example.com/fin-video1', duration: '15 min', xpReward: 15 },
                    { id: 'fl2', title: 'Income vs Expense', type: 'text', content: '# Arus Kas...', duration: '15 min', xpReward: 15 },
                    { id: 'fl3', title: 'Membuat Budget Pertama', type: 'interactive', content: 'https://example.com/budget-tool', duration: '30 min', xpReward: 30 },
                ],
            },
            {
                id: 'fin-mod-2',
                title: 'Investasi untuk Pemula',
                description: 'Pengantar dunia investasi',
                order: 2,
                duration: '1.5 hours',
                lessons: [
                    { id: 'fl4', title: 'Jenis-jenis Investasi', type: 'video', content: 'https://example.com/fin-video2', duration: '25 min', xpReward: 25 },
                    { id: 'fl5', title: 'Reksadana untuk Mahasiswa', type: 'text', content: '# Reksadana...', duration: '20 min', xpReward: 20 },
                    { id: 'fl6', title: 'Simulasi Investasi', type: 'interactive', content: 'https://example.com/invest-sim', duration: '35 min', xpReward: 35 },
                ],
            },
        ],
    },
    {
        id: 'course-emotional-intelligence',
        title: 'Emotional Intelligence Mastery',
        description: 'Tingkatkan kecerdasan emosional untuk hubungan yang lebih baik',
        instructor: 'Dr. Budi Santoso',
        category: 'emotional',
        dimensions: ['emotional_intelligence', 'mental_health'],
        difficulty: 'intermediate',
        duration: '5 hours',
        xpReward: 250,
        certificateEnabled: true,
        enrollmentCount: 750,
        rating: 4.9,
        prerequisites: [],
        createdAt: '2024-03-10',
        updatedAt: '2024-08-01',
        modules: [
            {
                id: 'eq-mod-1',
                title: 'Mengenal Emosi',
                description: 'Memahami emosi diri sendiri',
                order: 1,
                duration: '1.5 hours',
                lessons: [
                    { id: 'eq1', title: 'Apa itu Kecerdasan Emosional?', type: 'video', content: 'https://example.com/eq-video1', duration: '20 min', xpReward: 20 },
                    { id: 'eq2', title: 'Self-Awareness Exercise', type: 'exercise', content: 'https://example.com/eq-exercise1', duration: '30 min', xpReward: 35 },
                    { id: 'eq3', title: 'Emotion Journaling', type: 'interactive', content: 'https://example.com/eq-journal', duration: '40 min', xpReward: 40 },
                ],
            },
        ],
    },
    {
        id: 'course-mindfulness-basics',
        title: 'Mindfulness & Mental Wellness',
        description: 'Praktik mindfulness untuk kesehatan mental',
        instructor: 'Dr. Dewi Lestari',
        category: 'mental',
        dimensions: ['mental_health', 'spiritual'],
        difficulty: 'beginner',
        duration: '3 hours',
        xpReward: 150,
        certificateEnabled: true,
        enrollmentCount: 1100,
        rating: 4.8,
        prerequisites: [],
        createdAt: '2024-04-01',
        updatedAt: '2024-09-01',
        modules: [
            {
                id: 'mf-mod-1',
                title: 'Introduction to Mindfulness',
                description: 'Dasar-dasar mindfulness',
                order: 1,
                duration: '1 hour',
                lessons: [
                    { id: 'mf1', title: 'What is Mindfulness?', type: 'video', content: 'https://example.com/mf-video1', duration: '15 min', xpReward: 15 },
                    { id: 'mf2', title: 'Breathing Exercise', type: 'exercise', content: 'https://example.com/breathing', duration: '20 min', xpReward: 25 },
                    { id: 'mf3', title: 'Body Scan Meditation', type: 'interactive', content: 'https://example.com/bodyscan', duration: '25 min', xpReward: 30 },
                ],
            },
        ],
    },
];

// ============================================
// COURSE MANAGEMENT FUNCTIONS
// ============================================

// Get all courses
export function getAllCourses(): Course[] {
    return SAMPLE_COURSES;
}

// Get course by ID
export function getCourse(id: string): Course | undefined {
    return SAMPLE_COURSES.find(c => c.id === id);
}

// Get courses by category
export function getCoursesByCategory(category: string): Course[] {
    return SAMPLE_COURSES.filter(c => c.category === category);
}

// Get courses by dimension
export function getCoursesByDimension(dimension: string): Course[] {
    return SAMPLE_COURSES.filter(c => c.dimensions.includes(dimension));
}

// Get recommended courses based on scores
export function getRecommendedCourses(
    dimensionScores: Record<string, number>,
    limit: number = 5
): Course[] {
    // Find lowest scoring dimensions
    const sortedDimensions = Object.entries(dimensionScores)
        .filter(([, score]) => score > 0)
        .sort(([, a], [, b]) => a - b)
        .slice(0, 3)
        .map(([dim]) => dim);

    // Get courses for those dimensions
    const recommendedIds = new Set<string>();
    const recommended: Course[] = [];

    for (const dim of sortedDimensions) {
        const courses = getCoursesByDimension(dim);
        for (const course of courses) {
            if (!recommendedIds.has(course.id)) {
                recommendedIds.add(course.id);
                recommended.push(course);
            }
        }
    }

    // Sort by rating and return top N
    return recommended
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);
}

// Calculate course progress
export function calculateCourseProgress(
    course: Course,
    completedLessons: string[]
): number {
    const totalLessons = course.modules.reduce(
        (sum, mod) => sum + mod.lessons.length,
        0
    );

    if (totalLessons === 0) return 0;

    const completedCount = completedLessons.filter(lessonId =>
        course.modules.some(mod =>
            mod.lessons.some(lesson => lesson.id === lessonId)
        )
    ).length;

    return Math.round((completedCount / totalLessons) * 100);
}

// Get next lesson in course
export function getNextLesson(
    course: Course,
    completedLessons: string[]
): Lesson | undefined {
    for (const module of course.modules) {
        for (const lesson of module.lessons) {
            if (!completedLessons.includes(lesson.id)) {
                return lesson;
            }
        }
    }
    return undefined;
}

export default {
    getAllCourses,
    getCourse,
    getCoursesByCategory,
    getCoursesByDimension,
    getRecommendedCourses,
    calculateCourseProgress,
    getNextLesson,
    SAMPLE_COURSES,
};
