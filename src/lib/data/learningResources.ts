export interface LearningResource {
    id: string;
    title: string;
    category: 'AI Literacy' | 'Data Fluency' | 'Web Development' | 'Innovation' | 'Leadership' | 'Cybersecurity';
    type: 'Video' | 'Article' | 'Course' | 'Tool' | 'Book';
    url: string;
    description: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    duration?: string; // e.g., "10 min", "2 hours"
    tags: string[];
}

export const INITIAL_RESOURCES: LearningResource[] = [
    // AI Literacy
    {
        id: 'ai-1',
        title: 'Elements of AI',
        category: 'AI Literacy',
        type: 'Course',
        url: 'https://www.elementsofai.com/',
        description: 'A comprehensive introduction to AI for non-experts.',
        difficulty: 'Beginner',
        duration: '30 hours',
        tags: ['Basics', 'Machine Learning', 'Ethics']
    },
    {
        id: 'ai-2',
        title: 'Prompt Engineering Guide',
        category: 'AI Literacy',
        type: 'Article',
        url: 'https://learning.promptingguide.ai/',
        description: 'Master the art of communicating with Large Language Models.',
        difficulty: 'Intermediate',
        duration: '2 hours',
        tags: ['LLM', 'ChatGPT', 'Prompting']
    },

    // Data Fluency
    {
        id: 'df-1',
        title: 'Data Science for Business',
        category: 'Data Fluency',
        type: 'Book',
        url: '#',
        description: 'What you need to know about data mining and data-analytic thinking.',
        difficulty: 'Intermediate',
        duration: '350 pages',
        tags: ['Business', 'Analytics', 'Strategy']
    },
    {
        id: 'df-2',
        title: 'SQL Bolt',
        category: 'Data Fluency',
        type: 'Tool',
        url: 'https://sqlbolt.com/',
        description: 'Learn SQL with simple, interactive exercises.',
        difficulty: 'Beginner',
        duration: '1 hour',
        tags: ['SQL', 'Database', 'Query']
    },

    // Web Development
    {
        id: 'wd-1',
        title: 'MDN Web Docs',
        category: 'Web Development',
        type: 'Article',
        url: 'https://developer.mozilla.org/',
        description: 'The primary resource for documentation on Web standards.',
        difficulty: 'Beginner',
        duration: 'Ongoing',
        tags: ['Reference', 'HTML', 'CSS', 'JS']
    },
    {
        id: 'wd-2',
        title: 'React.dev',
        category: 'Web Development',
        type: 'Article',
        url: 'https://react.dev/',
        description: 'The library for web and native user interfaces.',
        difficulty: 'Intermediate',
        duration: 'Ongoing',
        tags: ['Frontend', 'JavaScript', 'UI']
    },

    // Innovation
    {
        id: 'in-1',
        title: 'IDEO Design Thinking',
        category: 'Innovation',
        type: 'Course',
        url: 'https://www.ideou.com/pages/design-thinking',
        description: 'Unlock your creative potential with design thinking methodology.',
        difficulty: 'Beginner',
        duration: '5 weeks',
        tags: ['Design', 'Creativity', 'Problem Solving']
    },
    {
        id: 'in-2',
        title: 'Y Combinator Startup School',
        category: 'Innovation',
        type: 'Course',
        url: 'https://www.startupschool.org/',
        description: 'The best resource for founders starting a company.',
        difficulty: 'Advanced',
        duration: '8 weeks',
        tags: ['Startup', 'Business', 'Growth']
    },

    // Leadership
    {
        id: 'ld-1',
        title: 'Radical Candor',
        category: 'Leadership',
        type: 'Book',
        url: '#',
        description: 'Be a Kick-Ass Boss Without Losing Your Humanity.',
        difficulty: 'Intermediate',
        duration: '300 pages',
        tags: ['Management', 'Communication', 'Feedback']
    },

    // Cybersecurity
    {
        id: 'cs-1',
        title: 'Have I Been Pwned',
        category: 'Cybersecurity',
        type: 'Tool',
        url: 'https://haveibeenpwned.com/',
        description: 'Check if your personal data has been compromised.',
        difficulty: 'Beginner',
        duration: '5 min',
        tags: ['Security', 'Privacy', 'Tools']
    }
];

// Helper to simulate fetching 500+ resources by multiplying the sample
export const getAllResources = (): LearningResource[] => {
    let allResources = [...INITIAL_RESOURCES];
    // Simple expansion for demo purposes to simulate "database" feel
    // In a real app, this would be a large JSON or DB fetch
    return allResources;
};
