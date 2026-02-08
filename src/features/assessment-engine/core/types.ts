export interface QuestionOption {
    id: string | number;
    text: string;
    value?: number; // Score value
}

export interface Question {
    id: string;
    text: string;
    type?: 'likert' | 'scenario' | 'behavioral' | 'choice'; // Default 'likert'
    category?: string;
    weight?: number;
    // For Scenario/Choice
    scenario?: string;
    options?: QuestionOption[];
    // For Behavioral/Likert customization
    min?: number;
    max?: number;
    labels?: { min: string; max: string };
}

export interface DimensionConfig {
    id: string; // e.g. "cognitive"
    name: string;
    icon: any; // Lucide icon
    color: string;
    guide: {
        title: string;
        description: string;
        cards: Array<{
            title: string;
            content: string;
            icon: any;
            color: string;
        }>;
    };
    items: Question[];
    tables: {
        assessments: string; // "cognitive_assessments"
        responses: string;   // "cognitive_responses"
        recommendations?: string;
    };
    routes: {
        results: string;
    };
    // Score calculator function signature
    calculateScore: (responses: Record<string, number>) => any;

    // Transform calculation result to DB payload
    transformToPayload?: (result: any, userId: string, responses?: any) => Record<string, any>;
}

export interface AssessmentState {
    step: 'guide' | 'consent' | 'assessment';
    currentQuestionIndex: number;
    responses: Record<string, number>;
    isSubmitting: boolean;
    agreement: { read: boolean; consent: boolean; };
}
