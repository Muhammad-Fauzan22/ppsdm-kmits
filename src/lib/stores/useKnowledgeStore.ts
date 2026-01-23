import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useGamificationStore } from './useGamificationStore';

export interface Note {
    id: string;
    title: string;
    content: string;
    tags: string[];
    createdAt: string;
    lastReviewedAt?: string;
    nextReviewDate?: string; // For Spaced Repetition
    repetitionLevel: number; // 0-5
}

export interface Skill {
    id: string;
    name: string;
    category: string;
    currentLevel: number; // 1-5
    targetLevel: number; // 1-5
    notes?: string;
}

export interface Idea {
    id: string;
    title: string;
    description: string;
    stage: 'raw' | 'developing' | 'prototyping' | 'archived';
    scamperTags: string[]; // e.g., 'Substitute', 'Combine'
    createdAt: string;
}

interface KnowledgeState {
    notes: Note[];
    skills: Skill[];
    ideas: Idea[];

    // Note Actions
    addNote: (note: Omit<Note, 'id' | 'createdAt' | 'repetitionLevel'>) => void;
    reviewNote: (id: string, quality: number) => void; // quality 0-5
    deleteNote: (id: string) => void;

    // Skill Actions
    addSkill: (skill: Omit<Skill, 'id'>) => void;
    updateSkillLevel: (id: string, current: number, target: number) => void;

    // Idea Actions
    addIdea: (idea: Omit<Idea, 'id' | 'createdAt' | 'stage'>) => void;
    moveIdeaStage: (id: string, stage: Idea['stage']) => void;
    deleteIdea: (id: string) => void;
}

export const useKnowledgeStore = create<KnowledgeState>()(
    persist(
        (set, get) => ({
            notes: [],
            skills: [
                { id: '1', name: 'Python Programming', category: 'Tech', currentLevel: 2, targetLevel: 5 },
                { id: '2', name: 'Public Speaking', category: 'Soft Skills', currentLevel: 3, targetLevel: 5 },
                { id: '3', name: 'Data Analysis', category: 'Tech', currentLevel: 1, targetLevel: 4 },
            ],
            ideas: [],

            addNote: (note) => {
                useGamificationStore.getState().addXP(10); // Small XP for note taking
                set((state) => ({
                    notes: [...state.notes, {
                        ...note,
                        id: crypto.randomUUID(),
                        createdAt: new Date().toISOString(),
                        repetitionLevel: 0,
                        nextReviewDate: new Date().toISOString(),
                    }]
                }));
            },

            reviewNote: (id, quality) => set((state) => ({
                notes: state.notes.map(n => {
                    if (n.id !== id) return n;

                    // Simple SuperMemo-2 style interval calculation simplified
                    // quality: 0 (forgot) to 5 (perfect)
                    const newLevel = quality >= 3 ? n.repetitionLevel + 1 : 0;
                    let interval = 1;
                    if (newLevel === 1) interval = 1;
                    else if (newLevel === 2) interval = 6;
                    else interval = Math.round(Math.pow(newLevel, 2)); // Simplified logic

                    const nextDate = new Date();
                    nextDate.setDate(nextDate.getDate() + interval);

                    if (quality >= 4) {
                        useGamificationStore.getState().addXP(15);
                    }

                    return {
                        ...n,
                        lastReviewedAt: new Date().toISOString(),
                        nextReviewDate: nextDate.toISOString(),
                        repetitionLevel: newLevel
                    };
                })
            })),

            deleteNote: (id) => set((state) => ({
                notes: state.notes.filter(n => n.id !== id)
            })),

            addSkill: (skill) => set((state) => ({
                skills: [...state.skills, { ...skill, id: crypto.randomUUID() }]
            })),

            updateSkillLevel: (id, current, target) => {
                const state = get();
                const skill = state.skills.find(s => s.id === id);
                if (skill && current > skill.currentLevel) {
                    useGamificationStore.getState().addXP((current - skill.currentLevel) * 50); // XP for levelling up a skill
                }
                set((state) => ({
                    skills: state.skills.map(s => s.id === id ? { ...s, currentLevel: current, targetLevel: target } : s)
                }));
            },

            addIdea: (idea) => {
                useGamificationStore.getState().addXP(25);
                set((state) => ({
                    ideas: [...state.ideas, {
                        ...idea,
                        id: crypto.randomUUID(),
                        stage: 'raw',
                        createdAt: new Date().toISOString(),
                    }]
                }));
            },

            moveIdeaStage: (id, stage) => set((state) => ({
                ideas: state.ideas.map(i => i.id === id ? { ...i, stage } : i)
            })),

            deleteIdea: (id) => set((state) => ({
                ideas: state.ideas.filter(i => i.id !== id)
            })),
        }),
        {
            name: 'knowledge-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
