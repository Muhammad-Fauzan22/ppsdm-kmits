export interface StudentProfile {
    id: string;
    name: string;
    major: string;
    skills: { [skill: string]: number }; // Skill name -> Mastery Level (0-100)
    interests: string[];
    availability: string[]; // e.g., 'Weekday Evenings', 'Weekends'
}

export interface MatchResult {
    student: StudentProfile;
    compatibilityScore: number;
    matchReasons: string[];
}

export const MOCK_STUDENTS: StudentProfile[] = [
    {
        id: 's_001',
        name: 'Budi Santoso',
        major: 'Informatics',
        skills: { 'Python': 90, 'Design': 40, 'Communication': 60 },
        interests: ['AI', 'Data Science'],
        availability: ['Weekday Evenings']
    },
    {
        id: 's_002',
        name: 'Siti Aminah',
        major: 'Visual Communication Design',
        skills: { 'Python': 30, 'Design': 95, 'Communication': 80 },
        interests: ['UI/UX', 'Web Design'],
        availability: ['Weekday Evenings', 'Weekends']
    },
    {
        id: 's_003',
        name: 'Rizky Pratama',
        major: 'Information Systems',
        skills: { 'Python': 70, 'Design': 70, 'Communication': 85 },
        interests: ['Product Management', 'Startup'],
        availability: ['Weekends']
    },
    {
        id: 's_004',
        name: 'Ayu Lestari',
        major: 'Computer Engineering',
        skills: { 'Python': 85, 'Hardware': 90, 'Design': 20 },
        interests: ['IoT', 'AI'],
        availability: ['Weekday Evenings']
    }
];

export class PeerMatchingEngine {
    static findMatches(currentUser: StudentProfile, candidates: StudentProfile[]): MatchResult[] {
        return candidates
            .filter(c => c.id !== currentUser.id)
            .map(candidate => {
                let score = 0;
                const reasons: string[] = [];

                // 1. Skill Complementarity (Max 40 points)
                // Find skills where one is strong (>80) and other is weak (<50)
                let complementarityCount = 0;
                for (const [skill, level] of Object.entries(currentUser.skills)) {
                    const candidateLevel = candidate.skills[skill] || 0;

                    if ((level > 70 && candidateLevel < 50) || (level < 50 && candidateLevel > 70)) {
                        complementarityCount++;
                    }
                }
                if (complementarityCount > 0) {
                    const points = Math.min(complementarityCount * 15, 40);
                    score += points;
                    reasons.push(`Complementary Skills (+${points})`);
                }

                // 2. Interest Overlap (Max 40 points)
                const sharedInterests = candidate.interests.filter(i => currentUser.interests.includes(i));
                if (sharedInterests.length > 0) {
                    score += 20 + (sharedInterests.length - 1) * 10;
                    reasons.push(`Shared Interests: ${sharedInterests.join(', ')}`);
                }

                // 3. Availability Match (Max 20 points)
                const sharedAvailability = candidate.availability.filter(a => currentUser.availability.includes(a));
                if (sharedAvailability.length > 0) {
                    score += 20;
                }

                return {
                    student: candidate,
                    compatibilityScore: Math.min(score, 100),
                    matchReasons: reasons
                };
            })
            .sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    }
}
