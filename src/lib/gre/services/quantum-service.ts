/**
 * Quantum Resource Recommendation Engine (QRRE) - Simulated
 * 
 * Implements "Quantum Integration Principle":
 * 1. Superposition: Retrieve top-k probabilistic matches
 * 2. Entanglement: Find hidden connections via graph edges
 * 3. Interference: Re-rank based on user context (constructive/destructive)
 * 4. Collapse: Return final set
 */

import { GreResource, SearchResult } from '../types';
import { ResourceService } from './resource-service';

export interface UserState {
    interests: string[];
    skill_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    learning_style?: 'visual' | 'textual' | 'interactive';
    time_available_minutes?: number;
}

export class QuantumRecommendationService {
    private resourceService = new ResourceService();

    /**
     * Main "Collapse" function to determine optimal resources
     */
    async collapseWaveFunction(userState: UserState, limit: number = 5): Promise<SearchResult[]> {
        // 1. Superposition: Get broad set of candidates (simulating all possibilities)
        // In real app, this would use vector search on user interests
        const primaryInterest = userState.interests[0] || 'general';
        const candidates = await this.resourceService.searchResources(primaryInterest, 50);

        // 2. Entanglement (Layer 4 - Deep Connection)
        // "Entanglement Detection: Hidden connections between seemingly unrelated resources"
        // In a real system, this would query the graph for hidden edges (e.g. shared rare concepts)
        const entangledCandidates = await this.entangleResources(candidates);

        // 3. Interference: Apply Constructive/Destructive weights
        const collapsed = entangledCandidates.map(candidate => {
            let probability = candidate.similarity || 0.5;

            // Constructive Interference (Boost)
            // Constructive Interference (Boost)
            if (candidate.difficulty === userState.skill_level) {
                probability += 0.2; // Match difficulty
            }

            // Layer 5: Contextual Adaptation Integration
            // (In a real app, UserState would include full context object)
            // We simulate a context check here
            if (userState.time_available_minutes && candidate.estimated_time_minutes &&
                candidate.estimated_time_minutes > userState.time_available_minutes) {
                probability -= 0.4; // Penalize heavy duration mismatch (Context constraint)
            }
            if (candidate.format_tags && userState.learning_style &&
                this.matchFormat(candidate.format_tags, userState.learning_style)) {
                probability += 0.1; // Match style
            }

            // Destructive Interference (Dampen)
            if (userState.skill_level === 'beginner' && candidate.difficulty === 'expert') {
                probability -= 0.3; // Too hard
            }

            return { ...candidate, probability };
        });

        // 3a. Goal Trajectory Simulation (Layer 4)
        // "Is this resource moving the user towards their stated goal?"
        // Hardcoded simulation: Prefer 'advanced' resources if user is 'intermediate' (Growth trajectory)
        const trajectoryAligned = collapsed.map(c => {
            let prob = c.probability || 0.5;
            if (userState.skill_level === 'intermediate' && c.difficulty === 'advanced') {
                prob += 0.1; // Push for growth
            }
            return { ...c, probability: prob };
        });

        // 4. Serendipity Injection (Layer 4)
        // "Entanglement Detection: Hidden connections between seemingly unrelated resources"
        const serendipidous = await this.injectSerendipity(trajectoryAligned as SearchResultWithProbability[], userState);

        // 5. Shortlist, Sort & Return
        return serendipidous
            .sort((a, b) => (b.probability || 0) - (a.probability || 0))
            .slice(0, limit) as SearchResult[];
    }

    private matchFormat(tags: string[], style: string): boolean {
        if (style === 'visual' && (tags.includes('video') || tags.includes('image'))) return true;
        if (style === 'textual' && (tags.includes('text') || tags.includes('pdf') || tags.includes('article'))) return true;
        if (style === 'interactive' && (tags.includes('tool') || tags.includes('project'))) return true;
        return false;
    }

    /**
     * Inject 1 random high-quality resource outside the user's immediate interest bubble.
     */
    private async injectSerendipity(candidates: SearchResultWithProbability[], userState: UserState): Promise<SearchResultWithProbability[]> {
        // Fetch a random high-quality resource from a different domain
        const randomTopics = ['philosophy', 'astronomy', 'history', 'art', 'bioinformatics'];
        const randomTopic = randomTopics[Math.floor(Math.random() * randomTopics.length)];

        // Avoid user's own topic
        if (userState.interests.includes(randomTopic)) return candidates;

        const surprises = await this.resourceService.searchResources(randomTopic, 1);
        if (surprises.length > 0) {
            const surprise = surprises[0] as SearchResultWithProbability;
            surprise.similarity = 0.8; // Artificially boost to ensure visibility
            surprise.title = `[Serendipity] ${surprise.title}`; // Label it
            surprise.probability = 0.8;
            candidates.push(surprise);
        }

        return candidates;
    }
    /**
     * Entanglement Logic (Layer 4)
     * Finds hidden connections (mocked for now) to expand the candidate set.
     */
    private async entangleResources(candidates: SearchResult[]): Promise<SearchResult[]> {
        // In a real implementation: Cypher query to find nodes sharing >2 rare concepts
        // Mock: Duplicate a few candidates and label them as "Entangled" variations
        const entangled = [...candidates];

        if (candidates.length > 0) {
            const seed = candidates[0];
            const entangedResource: SearchResult = {
                ...seed,
                id: `entangled_${seed.id}`,
                title: `[Entangled] Related to: ${seed.title}`,
                similarity: (seed.similarity || 0.5) * 0.9,
            };
            entangled.push(entangedResource);
        }

        return entangled;
    }
}

interface SearchResultWithProbability extends SearchResult {
    probability: number;
}
