export interface SkillNode {
    id: string;
    label: string;
    group: 'tech' | 'soft' | 'domain' | 'core';
    description: string;
    status: 'locked' | 'unlocked' | 'mastered';
    x?: number; // Initial positions (optional, for simulation)
    y?: number;
}

export interface SkillEdge {
    source: string;
    target: string;
    type: 'prerequisite' | 'related';
}

export const ENGINEERING_SKILL_GRAPH: { nodes: SkillNode[]; edges: SkillEdge[] } = {
    nodes: [
        // Core
        { id: 'math_basic', label: 'Basic Math', group: 'core', description: 'Foundation of everything.', status: 'mastered', x: 400, y: 300 },
        { id: 'logic', label: 'Logic', group: 'core', description: 'Critical thinking basics.', status: 'mastered', x: 500, y: 300 },

        // Tech Path
        { id: 'prog_basic', label: 'Programming 101', group: 'tech', description: 'Introduction to algorithms.', status: 'mastered', x: 600, y: 200 },
        { id: 'python', label: 'Python', group: 'tech', description: 'Data scripting language.', status: 'unlocked', x: 700, y: 150 },
        { id: 'web_dev', label: 'Web Dev', group: 'tech', description: 'HTML/CSS/JS.', status: 'unlocked', x: 700, y: 250 },
        { id: 'db_sql', label: 'Database (SQL)', group: 'tech', description: 'Data storage mastery.', status: 'locked', x: 800, y: 200 },
        { id: 'ai_ml', label: 'AI/ML', group: 'tech', description: 'Advanced intelligence systems.', status: 'locked', x: 850, y: 100 },

        // Domain Path
        { id: 'physics', label: 'Physics', group: 'domain', description: 'Mechanics and usage.', status: 'mastered', x: 500, y: 400 },
        { id: 'thermo', label: 'Thermodynamics', group: 'domain', description: 'Heat and energy.', status: 'unlocked', x: 600, y: 450 },
        { id: 'fluids', label: 'Fluid Dynamics', group: 'domain', description: 'Flow of matter.', status: 'locked', x: 700, y: 500 },

        // Soft Skills
        { id: 'comm', label: 'Communication', group: 'soft', description: 'Speaking and writing clearly.', status: 'mastered', x: 300, y: 250 },
        { id: 'team', label: 'Teamwork', group: 'soft', description: 'Working effective in groups.', status: 'unlocked', x: 200, y: 200 },
        { id: 'lead', label: 'Leadership', group: 'soft', description: 'Guiding others.', status: 'locked', x: 100, y: 150 },
        { id: 'ethics', label: 'Professional Ethics', group: 'soft', description: 'Moral principles in eng.', status: 'unlocked', x: 250, y: 350 },
    ],
    edges: [
        { source: 'math_basic', target: 'physics', type: 'prerequisite' },
        { source: 'math_basic', target: 'prog_basic', type: 'prerequisite' },
        { source: 'logic', target: 'prog_basic', type: 'related' },

        { source: 'prog_basic', target: 'python', type: 'prerequisite' },
        { source: 'prog_basic', target: 'web_dev', type: 'prerequisite' },
        { source: 'python', target: 'ai_ml', type: 'prerequisite' },
        { source: 'web_dev', target: 'db_sql', type: 'related' },
        { source: 'python', target: 'db_sql', type: 'related' },
        { source: 'math_basic', target: 'ai_ml', type: 'related' },

        { source: 'physics', target: 'thermo', type: 'prerequisite' },
        { source: 'thermo', target: 'fluids', type: 'prerequisite' },

        { source: 'comm', target: 'team', type: 'related' },
        { source: 'team', target: 'lead', type: 'prerequisite' },
        { source: 'comm', target: 'ethics', type: 'related' }
    ]
};
