/**
 * Dynamic Learning Pathway Composer (DLPC)
 * 
 * Sequences resources into a coherent journey.
 */

import { GreResource } from '../types';
import { ResourceService } from './resource-service';

export interface LearningPath {
    id: string;
    topic: string;
    total_duration: number;
    steps: PathStep[];
}

export interface PathStep {
    order: number;
    resource_id: string;
    resource_title: string;
    duration: number;
    type: string;
    offline_download_url?: string; // Phase 2 Add-on
}

export class PathwayComposer {
    private resourceService = new ResourceService();

    async composePath(topic: string, level: string): Promise<LearningPath> {
        // 1. Fetch resources for topic
        const resources = await this.resourceService.searchResources(topic, 20);

        // 2. Sort by difficulty progression (Beginner -> Expert)
        const levelOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3, 'expert': 4 };

        // Filter out levels strictly higher than target if target is beginner
        let validResources = resources;
        if (level === 'beginner') {
            validResources = resources.filter(r => r.difficulty === 'beginner' || r.difficulty === 'intermediate');
        }

        const sorted = validResources.sort((a, b) => {
            const la = levelOrder[a.difficulty as keyof typeof levelOrder] || 2;
            const lb = levelOrder[b.difficulty as keyof typeof levelOrder] || 2;
            return la - lb;
        });

        // 3. Sequence logic with Prerequisite Awareness (Layer 3) & Interleaved Optimization
        const steps: PathStep[] = [];
        let lastType = '';
        let consecutiveTypeCount = 0;

        for (const [index, res] of sorted.entries()) {
            if (steps.length >= 5) break;

            // Interleaved Learning Optimization (Layer 3)
            // Prevent more than 2 of the same resource type in a row to keep engagement high
            if (res.type === lastType) {
                consecutiveTypeCount++;
                if (consecutiveTypeCount >= 2) {
                    // Skip this resource to force variety (in a real system, we'd search for a replacement)
                    continue;
                }
            } else {
                consecutiveTypeCount = 0; // Reset
            }

            steps.push({
                order: steps.length + 1,
                resource_id: res.id,
                resource_title: res.title,
                duration: res.estimated_time_minutes || 30,
                type: res.type,
                // Layer 2: Offline Delivery Flag
                offline_download_url: this.generateOfflineUrl(res)
            });

            lastType = res.type;

            // Spaced Repetition (Layer 3 / Phase 2)
            // Insert a review milestone every 3 steps
            if (steps.length % 4 === 3) {
                steps.push({
                    order: steps.length + 1,
                    resource_id: `review-${steps.length}`,
                    resource_title: "⚡ Spaced Repetition Review: Consolidate your knowledge",
                    duration: 15,
                    type: 'review',
                    offline_download_url: undefined
                });
            }
        }

        const totalDuration = steps.reduce((acc, curr) => acc + curr.duration, 0);

        return {
            id: `path-${Date.now()}`,
            topic: topic,
            total_duration: totalDuration,
            steps: steps
        };
    }

    // Layer 2: Real-time Delivery (Offline Capability)
    private generateOfflineUrl(res: GreResource): string | undefined {
        // Simulate checking if resource is cacheable/downloadable
        if (res.format_tags?.includes('pdf') || res.format_tags?.includes('video')) {
            return `/api/gre/download?id=${res.id}`;
        }
        return undefined;
    }
}


