// Free Learning Resources Integration Service
// Aggregates content from Khan Academy, YouTube, MIT OCW, and Indonesian OER

export interface FreeResource {
    id: string;
    title: string;
    description: string;
    source: 'khan_academy' | 'youtube' | 'mit_ocw' | 'coursera' | 'freecodecamp' | 'indonesiax' | 'rumah_belajar';
    url: string;
    thumbnail?: string;
    duration_minutes?: number;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    skills: string[];
    dimensions: string[];
    language: 'id' | 'en';
    type: 'video' | 'course' | 'article' | 'interactive' | 'quiz';
    rating?: number;
    free: boolean;
}

// Curated free resources mapped to 9 dimensions
export const curatedFreeResources: FreeResource[] = [
    // ============ COGNITIVE / INTELLECTUAL ============
    {
        id: 'ka-critical-thinking',
        title: 'Critical Thinking & Problem Solving',
        description: 'Learn to analyze problems and make better decisions',
        source: 'khan_academy',
        url: 'https://www.khanacademy.org/college-careers-more/learnstorm',
        thumbnail: 'https://cdn.kastatic.org/images/khan-logo-dark-background.png',
        duration_minutes: 120,
        difficulty: 'beginner',
        skills: ['critical-thinking', 'problem-solving', 'analysis'],
        dimensions: ['cognitive', 'intellect'],
        language: 'en',
        type: 'course',
        rating: 4.8,
        free: true,
    },
    {
        id: 'mit-learning-how-to-learn',
        title: 'Learning How to Learn',
        description: 'Powerful mental tools to help you master tough subjects',
        source: 'coursera',
        url: 'https://www.coursera.org/learn/learning-how-to-learn',
        duration_minutes: 900,
        difficulty: 'beginner',
        skills: ['learning', 'memory', 'focus', 'productivity'],
        dimensions: ['cognitive', 'self_management'],
        language: 'en',
        type: 'course',
        rating: 4.9,
        free: true,
    },
    {
        id: 'yt-deep-work',
        title: 'Deep Work - Cara Fokus Maksimal',
        description: 'Teknik deep work untuk produktivitas tinggi',
        source: 'youtube',
        url: 'https://www.youtube.com/watch?v=gTaJhjQHcf8',
        duration_minutes: 45,
        difficulty: 'beginner',
        skills: ['focus', 'productivity', 'deep-work'],
        dimensions: ['cognitive', 'self_management'],
        language: 'id',
        type: 'video',
        rating: 4.7,
        free: true,
    },

    // ============ EMOTIONAL & SOCIAL ============
    {
        id: 'ka-emotional-intelligence',
        title: 'Emotional Intelligence',
        description: 'Understand and manage your emotions effectively',
        source: 'khan_academy',
        url: 'https://www.khanacademy.org/college-careers-more/learnstorm',
        duration_minutes: 90,
        difficulty: 'beginner',
        skills: ['emotional-intelligence', 'self-awareness', 'empathy'],
        dimensions: ['emotional', 'social'],
        language: 'en',
        type: 'course',
        rating: 4.6,
        free: true,
    },
    {
        id: 'yt-communication-skills',
        title: 'Teknik Komunikasi Efektif',
        description: 'Cara berkomunikasi dengan jelas dan persuasif',
        source: 'youtube',
        url: 'https://www.youtube.com/watch?v=HAnw168huqA',
        duration_minutes: 30,
        difficulty: 'beginner',
        skills: ['communication', 'public-speaking', 'persuasion'],
        dimensions: ['social', 'emotional'],
        language: 'id',
        type: 'video',
        rating: 4.5,
        free: true,
    },
    {
        id: 'coursera-conflict-resolution',
        title: 'Conflict Resolution Skills',
        description: 'Learn to resolve conflicts constructively',
        source: 'coursera',
        url: 'https://www.coursera.org/learn/conflict-resolution',
        duration_minutes: 600,
        difficulty: 'intermediate',
        skills: ['conflict-resolution', 'negotiation', 'empathy'],
        dimensions: ['social', 'emotional', 'character'],
        language: 'en',
        type: 'course',
        rating: 4.7,
        free: true,
    },

    // ============ FINANCIAL LITERACY ============
    {
        id: 'ka-personal-finance',
        title: 'Personal Finance',
        description: 'Complete guide to managing your money',
        source: 'khan_academy',
        url: 'https://www.khanacademy.org/college-careers-more/personal-finance',
        thumbnail: 'https://cdn.kastatic.org/images/khan-logo-dark-background.png',
        duration_minutes: 300,
        difficulty: 'beginner',
        skills: ['budgeting', 'saving', 'investing', 'debt-management'],
        dimensions: ['financial'],
        language: 'en',
        type: 'course',
        rating: 4.9,
        free: true,
    },
    {
        id: 'yt-investasi-pemula',
        title: 'Investasi untuk Pemula Indonesia',
        description: 'Panduan lengkap investasi untuk mahasiswa',
        source: 'youtube',
        url: 'https://www.youtube.com/watch?v=ZCFkWDdmXG8',
        duration_minutes: 60,
        difficulty: 'beginner',
        skills: ['investing', 'stocks', 'mutual-funds'],
        dimensions: ['financial'],
        language: 'id',
        type: 'video',
        rating: 4.6,
        free: true,
    },
    {
        id: 'ojk-literasi-keuangan',
        title: 'Literasi Keuangan OJK',
        description: 'Modul literasi keuangan dari Otoritas Jasa Keuangan',
        source: 'rumah_belajar',
        url: 'https://sikapiuangmu.ojk.go.id/',
        duration_minutes: 180,
        difficulty: 'beginner',
        skills: ['financial-literacy', 'banking', 'insurance'],
        dimensions: ['financial'],
        language: 'id',
        type: 'course',
        rating: 4.5,
        free: true,
    },

    // ============ PHYSICAL HEALTH ============
    {
        id: 'yt-home-workout',
        title: '30-Day Home Workout Challenge',
        description: 'Full body workout without equipment',
        source: 'youtube',
        url: 'https://www.youtube.com/watch?v=gC_L9qAHVJ8',
        duration_minutes: 30,
        difficulty: 'beginner',
        skills: ['fitness', 'strength', 'endurance'],
        dimensions: ['physical', 'health'],
        language: 'en',
        type: 'video',
        rating: 4.8,
        free: true,
    },
    {
        id: 'yt-nutrition-basics',
        title: 'Nutrition Fundamentals',
        description: 'Understand macros, calories, and healthy eating',
        source: 'youtube',
        url: 'https://www.youtube.com/watch?v=tHxHH1A7h8A',
        duration_minutes: 45,
        difficulty: 'beginner',
        skills: ['nutrition', 'diet', 'healthy-eating'],
        dimensions: ['physical', 'health'],
        language: 'en',
        type: 'video',
        rating: 4.7,
        free: true,
    },
    {
        id: 'yt-sleep-science',
        title: 'The Science of Better Sleep',
        description: 'Improve your sleep quality with science',
        source: 'youtube',
        url: 'https://www.youtube.com/watch?v=5MuIMqhT8DM',
        duration_minutes: 20,
        difficulty: 'beginner',
        skills: ['sleep', 'rest', 'recovery'],
        dimensions: ['physical', 'health', 'mental'],
        language: 'en',
        type: 'video',
        rating: 4.9,
        free: true,
    },

    // ============ CHARACTER & VALUES ============
    {
        id: 'via-character-strengths',
        title: 'VIA Character Strengths Survey',
        description: 'Discover your top character strengths',
        source: 'freecodecamp',
        url: 'https://www.viacharacter.org/survey/account/register',
        duration_minutes: 30,
        difficulty: 'beginner',
        skills: ['self-awareness', 'character', 'strengths'],
        dimensions: ['character'],
        language: 'en',
        type: 'quiz',
        rating: 4.8,
        free: true,
    },
    {
        id: 'yt-integrity-leadership',
        title: 'Integritas dalam Kepemimpinan',
        description: 'Membangun karakter pemimpin berintegritas',
        source: 'youtube',
        url: 'https://www.youtube.com/watch?v=qd2xPWdxYWo',
        duration_minutes: 35,
        difficulty: 'intermediate',
        skills: ['integrity', 'leadership', 'ethics'],
        dimensions: ['character', 'social'],
        language: 'id',
        type: 'video',
        rating: 4.6,
        free: true,
    },

    // ============ SPIRITUAL & MEANING ============
    {
        id: 'yt-finding-purpose',
        title: 'Finding Your Life Purpose',
        description: 'Discover what gives your life meaning',
        source: 'youtube',
        url: 'https://www.youtube.com/watch?v=vVsXO9brK7M',
        duration_minutes: 25,
        difficulty: 'beginner',
        skills: ['purpose', 'meaning', 'self-discovery'],
        dimensions: ['spiritual'],
        language: 'en',
        type: 'video',
        rating: 4.7,
        free: true,
    },
    {
        id: 'yt-gratitude-practice',
        title: 'The Power of Gratitude',
        description: 'Science-backed gratitude practices',
        source: 'youtube',
        url: 'https://www.youtube.com/watch?v=WPPPFqsECz0',
        duration_minutes: 15,
        difficulty: 'beginner',
        skills: ['gratitude', 'positivity', 'wellbeing'],
        dimensions: ['spiritual', 'mental', 'emotional'],
        language: 'en',
        type: 'video',
        rating: 4.8,
        free: true,
    },
    {
        id: 'yt-mindfulness-meditation',
        title: 'Mindfulness Meditation for Beginners',
        description: 'Learn to meditate in 10 minutes a day',
        source: 'youtube',
        url: 'https://www.youtube.com/watch?v=inpok4MKVLM',
        duration_minutes: 10,
        difficulty: 'beginner',
        skills: ['meditation', 'mindfulness', 'stress-relief'],
        dimensions: ['spiritual', 'mental'],
        language: 'en',
        type: 'video',
        rating: 4.9,
        free: true,
    },

    // ============ ENVIRONMENTAL ============
    {
        id: 'coursera-sustainability',
        title: 'Introduction to Sustainability',
        description: 'Learn about sustainable development',
        source: 'coursera',
        url: 'https://www.coursera.org/learn/sustainability',
        duration_minutes: 600,
        difficulty: 'beginner',
        skills: ['sustainability', 'environment', 'green-living'],
        dimensions: ['environmental'],
        language: 'en',
        type: 'course',
        rating: 4.7,
        free: true,
    },
    {
        id: 'yt-zero-waste',
        title: 'Zero Waste Lifestyle untuk Pemula',
        description: 'Cara mulai gaya hidup minim sampah',
        source: 'youtube',
        url: 'https://www.youtube.com/watch?v=OagTXWfaXEo',
        duration_minutes: 20,
        difficulty: 'beginner',
        skills: ['zero-waste', 'recycling', 'minimalism'],
        dimensions: ['environmental'],
        language: 'id',
        type: 'video',
        rating: 4.5,
        free: true,
    },

    // ============ CAREER & PROFESSIONAL ============
    {
        id: 'coursera-career-success',
        title: 'Career Success Specialization',
        description: 'Build skills for career advancement',
        source: 'coursera',
        url: 'https://www.coursera.org/specializations/career-success',
        duration_minutes: 1200,
        difficulty: 'intermediate',
        skills: ['career-planning', 'networking', 'personal-branding'],
        dimensions: ['career'],
        language: 'en',
        type: 'course',
        rating: 4.6,
        free: true,
    },
    {
        id: 'yt-resume-writing',
        title: 'How to Write a Perfect Resume',
        description: 'Create a resume that gets interviews',
        source: 'youtube',
        url: 'https://www.youtube.com/watch?v=Tt08KmFfIYQ',
        duration_minutes: 25,
        difficulty: 'beginner',
        skills: ['resume', 'job-search', 'career'],
        dimensions: ['career'],
        language: 'en',
        type: 'video',
        rating: 4.7,
        free: true,
    },
    {
        id: 'yt-interview-tips',
        title: 'Interview Tips - Cara Sukses Wawancara Kerja',
        description: 'Teknik wawancara yang efektif',
        source: 'youtube',
        url: 'https://www.youtube.com/watch?v=1mHjMNZZvFo',
        duration_minutes: 35,
        difficulty: 'intermediate',
        skills: ['interviewing', 'communication', 'confidence'],
        dimensions: ['career', 'social'],
        language: 'id',
        type: 'video',
        rating: 4.6,
        free: true,
    },
    {
        id: 'linkedin-learning-trial',
        title: 'LinkedIn Learning Free Courses',
        description: 'Access premium career courses with free trial',
        source: 'youtube',
        url: 'https://www.linkedin.com/learning/',
        duration_minutes: 600,
        difficulty: 'intermediate',
        skills: ['various', 'professional-development'],
        dimensions: ['career', 'cognitive'],
        language: 'en',
        type: 'course',
        rating: 4.8,
        free: true,
    },

    // ============ PROGRAMMING & TECH ============
    {
        id: 'fcc-responsive-web',
        title: 'Responsive Web Design',
        description: 'Learn HTML, CSS, and responsive design',
        source: 'freecodecamp',
        url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/',
        duration_minutes: 1800,
        difficulty: 'beginner',
        skills: ['html', 'css', 'web-development'],
        dimensions: ['cognitive', 'career'],
        language: 'en',
        type: 'course',
        rating: 4.9,
        free: true,
    },
    {
        id: 'fcc-javascript',
        title: 'JavaScript Algorithms and Data Structures',
        description: 'Master JavaScript fundamentals',
        source: 'freecodecamp',
        url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/',
        duration_minutes: 1800,
        difficulty: 'intermediate',
        skills: ['javascript', 'programming', 'algorithms'],
        dimensions: ['cognitive', 'career'],
        language: 'en',
        type: 'course',
        rating: 4.9,
        free: true,
    },
    {
        id: 'ka-computing',
        title: 'Intro to Computer Science',
        description: 'Learn programming fundamentals',
        source: 'khan_academy',
        url: 'https://www.khanacademy.org/computing/intro-to-python-fundamentals',
        duration_minutes: 600,
        difficulty: 'beginner',
        skills: ['python', 'programming', 'computer-science'],
        dimensions: ['cognitive', 'career'],
        language: 'en',
        type: 'course',
        rating: 4.8,
        free: true,
    },
];

// Recommendation engine using content-based filtering
export function recommendResources(
    userGaps: { dimension: string; gap_score: number }[],
    userSkills: string[] = [],
    preferredLanguage: 'id' | 'en' | 'both' = 'both',
    limit: number = 10
): FreeResource[] {
    // Sort gaps by score (highest gap = most need)
    const priorityDimensions = userGaps
        .sort((a, b) => b.gap_score - a.gap_score)
        .slice(0, 3)
        .map(g => g.dimension);

    // Filter and score resources
    const scoredResources = curatedFreeResources
        .filter(r => {
            if (preferredLanguage === 'both') return true;
            return r.language === preferredLanguage;
        })
        .map(resource => {
            let score = 0;

            // Higher score for resources matching priority dimensions
            resource.dimensions.forEach(dim => {
                const dimIndex = priorityDimensions.indexOf(dim);
                if (dimIndex !== -1) {
                    score += (3 - dimIndex) * 10; // 30, 20, 10 points for top 3 dimensions
                }
            });

            // Bonus for matching skills user wants to develop
            resource.skills.forEach(skill => {
                if (!userSkills.includes(skill)) {
                    score += 5; // Skills user doesn't have yet
                }
            });

            // Rating bonus
            score += (resource.rating || 4) * 2;

            // Prefer Indonesian content for Indonesian users
            if (preferredLanguage === 'id' && resource.language === 'id') {
                score += 5;
            }

            return { ...resource, score };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

    return scoredResources;
}

// Get resources by dimension
export function getResourcesByDimension(dimension: string): FreeResource[] {
    return curatedFreeResources.filter(r =>
        r.dimensions.includes(dimension)
    );
}

// Get resources by skill
export function getResourcesBySkill(skill: string): FreeResource[] {
    return curatedFreeResources.filter(r =>
        r.skills.includes(skill)
    );
}

// Search resources
export function searchResources(query: string): FreeResource[] {
    const lowerQuery = query.toLowerCase();
    return curatedFreeResources.filter(r =>
        r.title.toLowerCase().includes(lowerQuery) ||
        r.description.toLowerCase().includes(lowerQuery) ||
        r.skills.some(s => s.toLowerCase().includes(lowerQuery))
    );
}
