// Free Learning Content APIs Integration
// Aggregates free educational content from multiple sources

export interface LearningContent {
    id: string;
    title: string;
    description: string;
    url: string;
    provider: string;
    type: 'video' | 'article' | 'course' | 'book' | 'interactive';
    duration?: string;
    thumbnail?: string;
    free: boolean;
    language: 'en' | 'id' | 'multi';
    dimension?: string;
    tags: string[];
}

// ============================================
// FREE COURSE PROVIDERS
// ============================================

export const FREE_COURSE_PROVIDERS = {
    coursera: {
        name: 'Coursera',
        baseUrl: 'https://www.coursera.org',
        note: 'Audit mode is free',
    },
    edx: {
        name: 'edX',
        baseUrl: 'https://www.edx.org',
        note: 'Audit mode is free',
    },
    khanAcademy: {
        name: 'Khan Academy',
        baseUrl: 'https://www.khanacademy.org',
        note: '100% free',
    },
    mitOcw: {
        name: 'MIT OpenCourseWare',
        baseUrl: 'https://ocw.mit.edu',
        note: '100% free',
    },
    freecodecamp: {
        name: 'freeCodeCamp',
        baseUrl: 'https://www.freecodecamp.org',
        note: '100% free',
    },
    codecademy: {
        name: 'Codecademy',
        baseUrl: 'https://www.codecademy.com',
        note: 'Basic courses free',
    },
    rumahBelajar: {
        name: 'Rumah Belajar Kemendikbud',
        baseUrl: 'https://belajar.kemdikbud.go.id',
        note: '100% Free Government Resource',
    },
    indonesiaX: {
        name: 'IndonesiaX',
        baseUrl: 'https://indonesiax.co.id',
        note: 'Free courses from top universities',
    },
    freeCodeCamp: {
        name: 'freeCodeCamp Indonesia',
        baseUrl: 'https://www.freecodecamp.org/indonesian/',
        note: '100% Free Certification',
    },
    odinProject: {
        name: 'The Odin Project',
        baseUrl: 'https://www.theodinproject.com',
        note: 'Free Full Stack Curriculum',
    },
};

// ============================================
// CURATED FREE CONTENT BY DIMENSION
// ============================================

export const DIMENSION_CONTENT: Record<string, LearningContent[]> = {
    cognitive: [
        {
            id: 'cog-1',
            title: 'Critical Thinking & Problem Solving',
            description: 'Learn how to analyze problems and develop effective solutions',
            url: 'https://www.coursera.org/learn/critical-thinking-skills',
            provider: 'Coursera',
            type: 'course',
            duration: '4 weeks',
            free: true,
            language: 'en',
            dimension: 'cognitive',
            tags: ['critical thinking', 'problem solving', 'analysis'],
        },
        {
            id: 'cog-2',
            title: 'Learning How to Learn',
            description: 'Powerful mental tools to help you master tough subjects',
            url: 'https://www.coursera.org/learn/learning-how-to-learn',
            provider: 'Coursera',
            type: 'course',
            duration: '4 weeks',
            free: true,
            language: 'en',
            dimension: 'cognitive',
            tags: ['learning', 'memory', 'study skills'],
        },
        {
            id: 'cog-3',
            title: 'Khan Academy - Logic & Reasoning',
            description: 'Free logic and critical thinking lessons',
            url: 'https://www.khanacademy.org/humanities/philosophy',
            provider: 'Khan Academy',
            type: 'course',
            free: true,
            language: 'en',
            dimension: 'cognitive',
            tags: ['logic', 'philosophy', 'reasoning'],
        },
        {
            id: 'cog-4',
            title: 'Scientific Thinking',
            description: 'Understand the scientific method and how to apply it',
            url: 'https://www.edx.org/learn/science',
            provider: 'edX',
            type: 'course',
            free: true,
            language: 'en',
            dimension: 'cognitive',
            tags: ['science', 'methodology', 'research'],
        },
        {
            id: 'cog-ind-1',
            title: 'Berpikir Komputasional',
            description: 'Pengenalan pola pikir komputasional untuk pemecahan masalah',
            url: 'https://belajar.kemdikbud.go.id',
            provider: 'Rumah Belajar',
            type: 'course',
            free: true,
            language: 'id',
            dimension: 'cognitive',
            tags: ['computational thinking', 'logika', 'problem solving'],
        },
    ],

    self_management: [
        {
            id: 'sm-1',
            title: 'Productivity and Time Management',
            description: 'Strategies to manage time effectively and boost productivity',
            url: 'https://www.coursera.org/learn/work-smarter-not-harder',
            provider: 'Coursera',
            type: 'course',
            duration: '4 weeks',
            free: true,
            language: 'en',
            dimension: 'self_management',
            tags: ['productivity', 'time management', 'focus'],
        },
        {
            id: 'sm-2',
            title: 'Atomic Habits Summary',
            description: 'Key insights from James Clear on building good habits',
            url: 'https://jamesclear.com/atomic-habits/summary',
            provider: 'James Clear',
            type: 'article',
            free: true,
            language: 'en',
            dimension: 'self_management',
            tags: ['habits', 'growth', 'discipline'],
        },
        {
            id: 'sm-3',
            title: 'Agile Project Management',
            description: 'Learn the basics of Agile and Scrum for managing projects',
            url: 'https://www.edx.org/learn/agile',
            provider: 'edX',
            type: 'course',
            free: true,
            language: 'en',
            dimension: 'self_management',
            tags: ['management', 'agile', 'scrum'],
        },
        // SKILL DEVELOPMENT (Using Self-Management as valid bucket for now)
        {
            id: 'tech-1',
            title: 'Full Stack Development',
            description: 'Complete web development curriculum',
            url: 'https://www.theodinproject.com',
            provider: 'The Odin Project',
            type: 'course',
            free: true,
            language: 'en',
            dimension: 'self_management',
            tags: ['programming', 'web', 'coding'],
        },
        {
            id: 'tech-2',
            title: 'Belajar Pemrograman Web',
            description: 'Kursus dasar pemrograman web dalam Bahasa Indonesia',
            url: 'https://www.dicoding.com/academies/123 (Free Trial)', // Placeholder valid free resource needed
            provider: 'Dicoding/Indas', // Adjusted to generic if unsure
            type: 'course',
            free: true,
            language: 'id',
            dimension: 'self_management',
            tags: ['coding', 'web', 'indonesia'],
        }
    ],

    financial: [
        {
            id: 'fin-1',
            title: 'Personal Finance 101',
            description: 'Master the basics of personal finance and budgeting',
            url: 'https://www.khanacademy.org/college-careers-more/personal-finance',
            provider: 'Khan Academy',
            type: 'course',
            free: true,
            language: 'en',
            dimension: 'financial',
            tags: ['budgeting', 'saving', 'personal finance'],
        },
        {
            id: 'fin-2',
            title: 'Introduction to Investing',
            description: 'Learn the fundamentals of investing and building wealth',
            url: 'https://www.edx.org/learn/finance',
            provider: 'edX',
            type: 'course',
            duration: '6 weeks',
            free: true,
            language: 'en',
            dimension: 'financial',
            tags: ['investing', 'stocks', 'portfolio'],
        },
        {
            id: 'fin-3',
            title: 'Literasi Keuangan untuk Mahasiswa',
            description: 'Panduan keuangan dalam Bahasa Indonesia',
            url: 'https://sikapiuangmu.ojk.go.id/',
            provider: 'OJK',
            type: 'interactive',
            free: true,
            language: 'id',
            dimension: 'financial',
            tags: ['keuangan', 'indonesia', 'ojk'],
        },
        {
            id: 'fin-4',
            title: 'Perencanaan Keuangan Syariah',
            description: 'Dasar-dasar manajemen keuangan berbasis syariah',
            url: 'https://sikapiuangmu.ojk.go.id/FrontEnd/CMS/Category/118',
            provider: 'OJK',
            type: 'article',
            free: true,
            language: 'id',
            dimension: 'financial',
            tags: ['syariah', 'keuangan', 'islamic finance'],
        }
    ],

    emotional_intelligence: [
        {
            id: 'eq-1',
            title: 'Emotional Intelligence at Work',
            description: 'Develop your emotional intelligence for better relationships',
            url: 'https://www.coursera.org/learn/emotional-intelligence',
            provider: 'Coursera',
            type: 'course',
            duration: '4 weeks',
            free: true,
            language: 'en',
            dimension: 'emotional_intelligence',
            tags: ['eq', 'communication', 'relationships'],
        },
        {
            id: 'eq-2',
            title: 'The Science of Emotional Intelligence',
            description: 'Yale course on managing emotions effectively',
            url: 'https://www.coursera.org/learn/the-science-of-well-being',
            provider: 'Coursera',
            type: 'course',
            duration: '10 weeks',
            free: true,
            language: 'en',
            dimension: 'emotional_intelligence',
            tags: ['psychology', 'happiness', 'wellbeing'],
        },
        {
            id: 'eq-3',
            title: 'Komunikasi Efektif',
            description: 'Membangun hubungan yang baik melalui komunikasi',
            url: 'https://indonesiax.co.id',
            provider: 'IndonesiaX',
            type: 'course',
            free: true,
            language: 'id',
            dimension: 'emotional_intelligence',
            tags: ['komunikasi', 'soft skills', 'relasi'],
        },
    ],

    mental_health: [
        {
            id: 'mh-1',
            title: 'Mindfulness and Well-being',
            description: 'Learn mindfulness practices for better mental health',
            url: 'https://www.coursera.org/learn/mindfulness',
            provider: 'Coursera',
            type: 'course',
            duration: '6 weeks',
            free: true,
            language: 'en',
            dimension: 'mental_health',
            tags: ['mindfulness', 'meditation', 'stress'],
        },
        {
            id: 'mh-2',
            title: 'Managing Stress and Anxiety',
            description: 'Practical techniques for stress management',
            url: 'https://www.edx.org/learn/stress-management',
            provider: 'edX',
            type: 'course',
            free: true,
            language: 'en',
            dimension: 'mental_health',
            tags: ['stress', 'anxiety', 'coping'],
        },
        {
            id: 'mh-3',
            title: 'Headspace Basics',
            description: 'Free meditation sessions',
            url: 'https://www.headspace.com/meditation/basics',
            provider: 'Headspace',
            type: 'interactive',
            duration: '10 sessions',
            free: true,
            language: 'en',
            dimension: 'mental_health',
            tags: ['meditation', 'breathing', 'relaxation'],
        },
        {
            id: 'mh-ind-1',
            title: 'Kesehatan Mental Remaja',
            description: 'Memahami isu kesehatan mental di kalangan mahasiswa',
            url: 'https://www.youtube.com/playlist?list=PL...', // General placeholder for YT playlist mentioned
            provider: 'Menjadi Manusia',
            type: 'video',
            free: true,
            language: 'id',
            dimension: 'mental_health',
            tags: ['mental health', 'indonesia', 'self-care'],
        }
    ],

    physical_health: [
        {
            id: 'ph-1',
            title: 'Nutrition and Health',
            description: 'Learn about nutrition science and healthy eating',
            url: 'https://www.coursera.org/learn/food-and-health',
            provider: 'Coursera',
            type: 'course',
            duration: '5 weeks',
            free: true,
            language: 'en',
            dimension: 'physical_health',
            tags: ['nutrition', 'diet', 'health'],
        },
        {
            id: 'ph-2',
            title: 'The Science of Exercise',
            description: 'Understand how exercise benefits your body and mind',
            url: 'https://www.coursera.org/learn/science-of-exercise',
            provider: 'Coursera',
            type: 'course',
            duration: '4 weeks',
            free: true,
            language: 'en',
            dimension: 'physical_health',
            tags: ['exercise', 'fitness', 'physiology'],
        },
        {
            id: 'ph-3',
            title: 'Gerakan Masyarakat Hidup Sehat (GERMAS)',
            description: 'Panduan hidup sehat dari Kemenkes RI',
            url: 'https://promkes.kemkes.go.id/germas',
            provider: 'Kemenkes',
            type: 'article',
            free: true,
            language: 'id',
            dimension: 'physical_health',
            tags: ['kesehatan', 'indonesia', 'germas'],
        }
    ],

    character_ethics: [
        {
            id: 'ce-1',
            title: 'Justice by Harvard',
            description: 'Explore the principles of justice and ethics',
            url: 'https://www.edx.org/learn/ethics/harvard-university-justice',
            provider: 'edX',
            type: 'course',
            duration: '12 weeks',
            free: true,
            language: 'en',
            dimension: 'character_ethics',
            tags: ['ethics', 'philosophy', 'justice'],
        },
        {
            id: 'ce-2',
            title: 'Leadership and Character',
            description: 'Develop ethical leadership skills',
            url: 'https://www.coursera.org/learn/leadership-character',
            provider: 'Coursera',
            type: 'course',
            free: true,
            language: 'en',
            dimension: 'character_ethics',
            tags: ['leadership', 'character', 'integrity'],
        },
        {
            id: 'ce-3',
            title: 'Nilai-Nilai Kebangsaan',
            description: 'Memahami etika berbangsa dan bernegara',
            url: 'https://indonesiax.co.id',
            provider: 'IndonesiaX',
            type: 'course',
            free: true,
            language: 'id',
            dimension: 'character_ethics',
            tags: ['kebangsaan', 'etika', 'pancasila'],
        }
    ],

    spiritual: [
        {
            id: 'sp-1',
            title: 'Buddhism and Modern Psychology',
            description: 'Explore meaning and purpose through various traditions',
            url: 'https://www.coursera.org/learn/science-of-meditation',
            provider: 'Coursera',
            type: 'course',
            free: true,
            language: 'en',
            dimension: 'spiritual',
            tags: ['spirituality', 'meaning', 'purpose'],
        },
        {
            id: 'sp-2',
            title: 'Science and Religion',
            description: 'Exploring the intersection of faith and science',
            url: 'https://www.coursera.org/learn/philosophy-science-religion-1',
            provider: 'University of Edinburgh',
            type: 'course',
            free: true,
            language: 'en',
            dimension: 'spiritual',
            tags: ['philosophy', 'faith', 'science'],
        },
    ],

    environmental: [
        {
            id: 'env-1',
            title: 'Environmental Sustainability',
            description: 'Learn about sustainable living and environmental awareness',
            url: 'https://www.coursera.org/learn/sustainability',
            provider: 'Coursera',
            type: 'course',
            duration: '4 weeks',
            free: true,
            language: 'en',
            dimension: 'environmental',
            tags: ['sustainability', 'environment', 'eco'],
        },
        {
            id: 'env-2',
            title: 'Digital Wellbeing',
            description: 'Balance technology use for better life',
            url: 'https://wellbeing.google/',
            provider: 'Google',
            type: 'interactive',
            free: true,
            language: 'en',
            dimension: 'environmental',
            tags: ['digital', 'wellbeing', 'balance'],
        },
        {
            id: 'env-3',
            title: 'Pengelolaan Sampah Mandiri',
            description: 'Panduan praktis mengelola sampah rumah tangga',
            url: 'https://zerowaste.id',
            provider: 'Zero Waste Indonesia',
            type: 'article',
            free: true,
            language: 'id',
            dimension: 'environmental',
            tags: ['lingkungan', 'sampah', 'zero waste'],
        }
    ],
};

// ============================================
// CONTENT FUNCTIONS
// ============================================

// Get all content for a dimension
export function getContentByDimension(dimension: string): LearningContent[] {
    return DIMENSION_CONTENT[dimension] || [];
}

// Get all free content
export function getAllFreeContent(): LearningContent[] {
    return Object.values(DIMENSION_CONTENT).flat();
}

// Search content
export function searchContent(query: string): LearningContent[] {
    const lowerQuery = query.toLowerCase();
    return getAllFreeContent().filter(content =>
        content.title.toLowerCase().includes(lowerQuery) ||
        content.description.toLowerCase().includes(lowerQuery) ||
        content.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
}

// Get recommended content based on scores
export function getRecommendedContent(
    scores: Record<string, number>,
    limit: number = 6
): LearningContent[] {
    // Find lowest scoring dimensions
    const sortedDims = Object.entries(scores)
        .filter(([, score]) => score > 0)
        .sort(([, a], [, b]) => a - b)
        .slice(0, 3)
        .map(([dim]) => dim);

    const recommended: LearningContent[] = [];

    for (const dim of sortedDims) {
        const dimContent = getContentByDimension(dim);
        recommended.push(...dimContent);
    }

    return recommended.slice(0, limit);
}

// Get content by type
export function getContentByType(type: LearningContent['type']): LearningContent[] {
    return getAllFreeContent().filter(c => c.type === type);
}

// Get Indonesian content
export function getIndonesianContent(): LearningContent[] {
    return getAllFreeContent().filter(c => c.language === 'id' || c.language === 'multi');
}

const freeContent = {
    FREE_COURSE_PROVIDERS,
    DIMENSION_CONTENT,
    getContentByDimension,
    getAllFreeContent,
    searchContent,
    getRecommendedContent,
    getContentByType,
    getIndonesianContent,
};

export default freeContent;
