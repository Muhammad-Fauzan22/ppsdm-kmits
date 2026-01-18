// xAPI Learning Record Store (LRS)
// Lightweight implementation of xAPI standard for learning analytics
// Compliant with xAPI 1.0.3 specification

export interface XAPIActor {
    objectType: 'Agent' | 'Group';
    mbox?: string;          // mailto:email
    account?: {
        homePage: string;
        name: string;
    };
    name?: string;
}

export interface XAPIVerb {
    id: string;             // IRI identifier
    display: Record<string, string>;  // language map
}

export interface XAPIObject {
    objectType: 'Activity' | 'Agent' | 'StatementRef' | 'SubStatement';
    id: string;             // IRI identifier
    definition?: {
        name?: Record<string, string>;
        description?: Record<string, string>;
        type?: string;        // Activity Type IRI
        extensions?: Record<string, unknown>;
    };
}

export interface XAPIResult {
    score?: {
        scaled?: number;      // -1 to 1
        raw?: number;
        min?: number;
        max?: number;
    };
    success?: boolean;
    completion?: boolean;
    response?: string;
    duration?: string;      // ISO 8601 duration
    extensions?: Record<string, unknown>;
}

export interface XAPIContext {
    registration?: string;
    instructor?: XAPIActor;
    team?: XAPIActor;
    contextActivities?: {
        parent?: XAPIObject[];
        grouping?: XAPIObject[];
        category?: XAPIObject[];
        other?: XAPIObject[];
    };
    platform?: string;
    language?: string;
    extensions?: Record<string, unknown>;
}

export interface XAPIStatement {
    id?: string;
    actor: XAPIActor;
    verb: XAPIVerb;
    object: XAPIObject;
    result?: XAPIResult;
    context?: XAPIContext;
    timestamp?: string;
    stored?: string;
    authority?: XAPIActor;
    version?: string;
}

// ============================================
// COMMON xAPI VERBS
// ============================================

export const XAPI_VERBS = {
    // Assessment verbs
    COMPLETED: {
        id: 'http://adlnet.gov/expapi/verbs/completed',
        display: { 'en-US': 'completed', 'id': 'menyelesaikan' },
    },
    PASSED: {
        id: 'http://adlnet.gov/expapi/verbs/passed',
        display: { 'en-US': 'passed', 'id': 'lulus' },
    },
    FAILED: {
        id: 'http://adlnet.gov/expapi/verbs/failed',
        display: { 'en-US': 'failed', 'id': 'gagal' },
    },
    SCORED: {
        id: 'http://adlnet.gov/expapi/verbs/scored',
        display: { 'en-US': 'scored', 'id': 'mendapat skor' },
    },

    // Interaction verbs
    ATTEMPTED: {
        id: 'http://adlnet.gov/expapi/verbs/attempted',
        display: { 'en-US': 'attempted', 'id': 'mencoba' },
    },
    ANSWERED: {
        id: 'http://adlnet.gov/expapi/verbs/answered',
        display: { 'en-US': 'answered', 'id': 'menjawab' },
    },
    ASKED: {
        id: 'http://adlnet.gov/expapi/verbs/asked',
        display: { 'en-US': 'asked', 'id': 'bertanya' },
    },

    // Content verbs
    EXPERIENCED: {
        id: 'http://adlnet.gov/expapi/verbs/experienced',
        display: { 'en-US': 'experienced', 'id': 'mengalami' },
    },
    LAUNCHED: {
        id: 'http://adlnet.gov/expapi/verbs/launched',
        display: { 'en-US': 'launched', 'id': 'membuka' },
    },
    PROGRESSED: {
        id: 'http://adlnet.gov/expapi/verbs/progressed',
        display: { 'en-US': 'progressed', 'id': 'berkembang' },
    },

    // Social verbs
    COMMENTED: {
        id: 'http://id.tincanapi.com/verb/commented',
        display: { 'en-US': 'commented', 'id': 'berkomentar' },
    },
    SHARED: {
        id: 'http://adlnet.gov/expapi/verbs/shared',
        display: { 'en-US': 'shared', 'id': 'membagikan' },
    },
    LIKED: {
        id: 'http://id.tincanapi.com/verb/liked',
        display: { 'en-US': 'liked', 'id': 'menyukai' },
    },

    // Achievement verbs
    EARNED: {
        id: 'http://id.tincanapi.com/verb/earned',
        display: { 'en-US': 'earned', 'id': 'mendapatkan' },
    },
    MASTERED: {
        id: 'http://id.tincanapi.com/verb/mastered',
        display: { 'en-US': 'mastered', 'id': 'menguasai' },
    },
};

// ============================================
// PPSDM ACTIVITY TYPES
// ============================================

export const PPSDM_ACTIVITY_TYPES = {
    ASSESSMENT: 'https://ppsdm.km.its.ac.id/xapi/activities/assessment',
    DIMENSION: 'https://ppsdm.km.its.ac.id/xapi/activities/dimension',
    LEARNING_PATH: 'https://ppsdm.km.its.ac.id/xapi/activities/learning-path',
    AI_TUTOR_SESSION: 'https://ppsdm.km.its.ac.id/xapi/activities/ai-tutor',
    WEEKLY_PLAN: 'https://ppsdm.km.its.ac.id/xapi/activities/weekly-plan',
    BADGE: 'https://ppsdm.km.its.ac.id/xapi/activities/badge',
    RESOURCE: 'https://ppsdm.km.its.ac.id/xapi/activities/resource',
};

// ============================================
// LEARNING RECORD STORE (LRS) IMPLEMENTATION
// ============================================

class LearningRecordStore {
    private statements: XAPIStatement[] = [];
    private maxStatements = 10000; // Limit for in-memory storage

    // Store a statement
    storeStatement(statement: XAPIStatement): string {
        const id = statement.id || this.generateUUID();
        const storedStatement: XAPIStatement = {
            ...statement,
            id,
            stored: new Date().toISOString(),
            version: '1.0.3',
        };

        this.statements.push(storedStatement);

        // Keep only last N statements
        if (this.statements.length > this.maxStatements) {
            this.statements = this.statements.slice(-this.maxStatements);
        }

        return id;
    }

    // Store multiple statements
    storeStatements(statements: XAPIStatement[]): string[] {
        return statements.map(s => this.storeStatement(s));
    }

    // Get statement by ID
    getStatement(id: string): XAPIStatement | undefined {
        return this.statements.find(s => s.id === id);
    }

    // Query statements
    queryStatements(params: {
        actor?: string;          // Actor email or account name
        verb?: string;           // Verb ID
        activity?: string;       // Activity ID
        since?: string;          // ISO timestamp
        until?: string;          // ISO timestamp
        limit?: number;
    }): XAPIStatement[] {
        let results = [...this.statements];

        if (params.actor) {
            results = results.filter(s =>
                s.actor.mbox === `mailto:${params.actor}` ||
                s.actor.account?.name === params.actor
            );
        }

        if (params.verb) {
            results = results.filter(s => s.verb.id === params.verb);
        }

        if (params.activity) {
            results = results.filter(s => s.object.id === params.activity);
        }

        if (params.since) {
            const since = new Date(params.since).getTime();
            results = results.filter(s =>
                s.timestamp && new Date(s.timestamp).getTime() >= since
            );
        }

        if (params.until) {
            const until = new Date(params.until).getTime();
            results = results.filter(s =>
                s.timestamp && new Date(s.timestamp).getTime() <= until
            );
        }

        // Sort by timestamp descending
        results.sort((a, b) => {
            const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
            const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
            return timeB - timeA;
        });

        if (params.limit) {
            results = results.slice(0, params.limit);
        }

        return results;
    }

    // Get all statements
    getAllStatements(): XAPIStatement[] {
        return [...this.statements];
    }

    // Clear all statements
    clear(): void {
        this.statements = [];
    }

    // Generate UUID
    private generateUUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

// Singleton instance
export const lrs = new LearningRecordStore();

// ============================================
// HELPER FUNCTIONS FOR PPSDM CONTEXT
// ============================================

// Create actor from user
export function createActor(userId: string, userName?: string): XAPIActor {
    return {
        objectType: 'Agent',
        account: {
            homePage: 'https://ppsdm.km.its.ac.id',
            name: userId,
        },
        name: userName,
    };
}

// Record assessment completion
export function recordAssessmentCompleted(
    actor: XAPIActor,
    dimension: string,
    score: number,
    maxScore: number = 100
): string {
    const statement: XAPIStatement = {
        actor,
        verb: XAPI_VERBS.COMPLETED,
        object: {
            objectType: 'Activity',
            id: `https://ppsdm.km.its.ac.id/assessments/${dimension}`,
            definition: {
                name: { 'id': `Assessment ${dimension}` },
                type: PPSDM_ACTIVITY_TYPES.ASSESSMENT,
            },
        },
        result: {
            score: {
                scaled: score / maxScore,
                raw: score,
                min: 0,
                max: maxScore,
            },
            success: score >= 60,
            completion: true,
        },
        context: {
            platform: 'PPSDM KMM',
            language: 'id',
            extensions: {
                'https://ppsdm.km.its.ac.id/xapi/dimension': dimension,
            },
        },
        timestamp: new Date().toISOString(),
    };

    return lrs.storeStatement(statement);
}

// Record badge earned
export function recordBadgeEarned(actor: XAPIActor, badgeId: string, badgeName: string): string {
    const statement: XAPIStatement = {
        actor,
        verb: XAPI_VERBS.EARNED,
        object: {
            objectType: 'Activity',
            id: `https://ppsdm.km.its.ac.id/badges/${badgeId}`,
            definition: {
                name: { 'id': badgeName },
                type: PPSDM_ACTIVITY_TYPES.BADGE,
            },
        },
        timestamp: new Date().toISOString(),
    };

    return lrs.storeStatement(statement);
}

// Record AI Tutor interaction
export function recordAITutorChat(actor: XAPIActor, messageCount: number): string {
    const statement: XAPIStatement = {
        actor,
        verb: XAPI_VERBS.ASKED,
        object: {
            objectType: 'Activity',
            id: 'https://ppsdm.km.its.ac.id/ai-tutor',
            definition: {
                name: { 'id': 'AI Tutor Session' },
                type: PPSDM_ACTIVITY_TYPES.AI_TUTOR_SESSION,
            },
        },
        result: {
            extensions: {
                'https://ppsdm.km.its.ac.id/xapi/message-count': messageCount,
            },
        },
        timestamp: new Date().toISOString(),
    };

    return lrs.storeStatement(statement);
}

// Record learning resource viewed
export function recordResourceViewed(actor: XAPIActor, resourceId: string, resourceTitle: string): string {
    const statement: XAPIStatement = {
        actor,
        verb: XAPI_VERBS.EXPERIENCED,
        object: {
            objectType: 'Activity',
            id: `https://ppsdm.km.its.ac.id/resources/${resourceId}`,
            definition: {
                name: { 'id': resourceTitle },
                type: PPSDM_ACTIVITY_TYPES.RESOURCE,
            },
        },
        timestamp: new Date().toISOString(),
    };

    return lrs.storeStatement(statement);
}

// Get learning analytics for user
export function getLearningAnalytics(userId: string): {
    totalStatements: number;
    assessmentsCompleted: number;
    badgesEarned: number;
    resourcesViewed: number;
    aiTutorSessions: number;
    averageScore: number;
} {
    const userStatements = lrs.queryStatements({ actor: userId });

    const assessments = userStatements.filter(s =>
        s.verb.id === XAPI_VERBS.COMPLETED.id &&
        s.object.definition?.type === PPSDM_ACTIVITY_TYPES.ASSESSMENT
    );

    const badges = userStatements.filter(s =>
        s.verb.id === XAPI_VERBS.EARNED.id &&
        s.object.definition?.type === PPSDM_ACTIVITY_TYPES.BADGE
    );

    const resources = userStatements.filter(s =>
        s.verb.id === XAPI_VERBS.EXPERIENCED.id &&
        s.object.definition?.type === PPSDM_ACTIVITY_TYPES.RESOURCE
    );

    const aiSessions = userStatements.filter(s =>
        s.verb.id === XAPI_VERBS.ASKED.id &&
        s.object.definition?.type === PPSDM_ACTIVITY_TYPES.AI_TUTOR_SESSION
    );

    const scores = assessments
        .map(a => a.result?.score?.raw)
        .filter((s): s is number => s !== undefined);

    const averageScore = scores.length > 0
        ? scores.reduce((a, b) => a + b, 0) / scores.length
        : 0;

    return {
        totalStatements: userStatements.length,
        assessmentsCompleted: assessments.length,
        badgesEarned: badges.length,
        resourcesViewed: resources.length,
        aiTutorSessions: aiSessions.length,
        averageScore: Math.round(averageScore * 10) / 10,
    };
}

export default lrs;
