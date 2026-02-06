export interface SkillImpact {
    [skillName: string]: number; // e.g., "Leadership": 5
}

export interface SimulationOption {
    id: string;
    text: string;
    nextNodeId: string;
    skillImpact: SkillImpact;
    feedback: string;
}

export interface SimulationNode {
    id: string;
    text: string;
    options: SimulationOption[];
}

export interface SimulationModule {
    id: string;
    title: string;
    role: string;
    company: string;
    description: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    duration: string;
    startNodeId: string;
    nodes: Record<string, SimulationNode>;
}

export const CAREER_SIMULATIONS: SimulationModule[] = [
    {
        id: 'sim_project_crisis',
        title: 'The Critical Deadline',
        role: 'Junior Project Manager',
        company: 'TechCorp Indonesia',
        description: 'A critical client project is delayed, and the lead developer just fell sick. How do you handle the stakeholders?',
        difficulty: 'Intermediate',
        duration: '10 min',
        startNodeId: 'start',
        nodes: {
            'start': {
                id: 'start',
                text: "It's Friday 2 PM. The 'SuperApp' launch is scheduled for Monday 9 AM. Your Lead Developer calls in sick with Dengue fever. The backend integration is only 80% done. The client, Pak Budi, expects a demo on Monday. What do you do?",
                options: [
                    {
                        id: 'opt_1',
                        text: "Push the team to work weekend overtime to finish it.",
                        nextNodeId: 'node_overtime',
                        skillImpact: { "Leadership": -5, "Result Orientation": 10 },
                        feedback: "The team pushes through, but morale plummets. One dev threatens to quit."
                    },
                    {
                        id: 'opt_2',
                        text: "Call Pak Budi immediately to negotiate a limited demo scope.",
                        nextNodeId: 'node_negotiate',
                        skillImpact: { "Communication": 10, "Crisis Management": 8 },
                        feedback: "Pak Budi is annoyed but appreciates the early heads-up. He agrees to see the Frontend only."
                    },
                    {
                        id: 'opt_3',
                        text: "Try to fix the backend code yourself.",
                        nextNodeId: 'node_diy',
                        skillImpact: { "Technical Skill": 5, "Delegation": -10 },
                        feedback: "You fix some bugs, but introduce new ones. You are burnt out by Sunday."
                    }
                ]
            },
            'node_overtime': {
                id: 'node_overtime',
                text: "Monday Morning. The app works, but the team looks like zombies. Pak Budi asks for a new feature. Usually, the team would say yes, but today the room is silent.",
                options: [
                    {
                        id: 'opt_ot_1',
                        text: "Promise the feature for next week.",
                        nextNodeId: 'end_mixed',
                        skillImpact: { "Assertiveness": 5 },
                        feedback: "You bought some time, but trust needs rebuilding."
                    }
                ]
            },
            'node_negotiate': {
                id: 'node_negotiate',
                text: "Monday Morning. You present the polished Frontend flow. Pak Budi asks: 'Where is the payment integration?'",
                options: [
                    {
                        id: 'opt_neg_1',
                        text: "Show the mock video prepared as backup.",
                        nextNodeId: 'end_success',
                        skillImpact: { "Preparation": 10, "Adaptability": 8 },
                        feedback: "Excellent move. The client sees the vision without needing the live code."
                    }
                ]
            },
            'node_diy': {
                id: 'node_diy',
                text: "Monday Morning. The demo crashes on the login screen. Pak Budi stares at you.",
                options: [
                    {
                        id: 'opt_fail_1',
                        text: "Apologize and ask for 2 more days.",
                        nextNodeId: 'end_failure',
                        skillImpact: { "Integrity": 5 },
                        feedback: "Honesty is good, but the project is now at risk."
                    }
                ]
            },
            'end_success': { id: 'end_success', text: "SIMULATION COMPLETE: Success! You managed expectations and delivered value. +20 XP", options: [] },
            'end_mixed': { id: 'end_mixed', text: "SIMULATION COMPLETE: Mixed Result. Product delivered, but team health damaged. +10 XP", options: [] },
            'end_failure': { id: 'end_failure', text: "SIMULATION COMPLETE: Failed. The client lost confidence. Learn to delegate! +0 XP", options: [] }
        }
    }
];
