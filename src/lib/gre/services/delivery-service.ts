/**
 * Adaptive Resource Delivery Engine (Layer 2 & 5)
 * Orchestrates delivery based on context, format, and offline needs.
 */

import { GreResource } from '../types';
import { ContextService, UserContext } from './context-service';
import { FormatTranscoderService } from './transcoding-service';

export interface DeliveryResult {
    resource: GreResource;
    deliveryMethod: 'stream' | 'download' | 'transcode';
    url: string;
    adaptations: string[];
}

export class AdaptiveResourceDeliveryEngine {
    private contextService = new ContextService();
    private transcoder = new FormatTranscoderService();

    async deliverResource(
        resource: GreResource,
        headers: Headers,
        preferences: { offlineMode?: boolean } = {}
    ): Promise<DeliveryResult> {

        // 1. Detect Context
        const context = this.contextService.detectContext(headers);
        const adaptations: string[] = [];

        let finalUrl = resource.url;
        let method: 'stream' | 'download' | 'transcode' = 'stream';

        // 2. Bandwidth Optimization (Layer 5)
        if (context.connectionType === 'slow-2g' || context.prefersReducedData) {
            // E.g. Switch video to low-res or audio-only
            if (resource.type === 'video') {
                if (this.transcoder.canTranscode('video', 'audio')) {
                    finalUrl = this.transcoder.getTranscodedUrl(resource.id, 'audio'); // Simulated audio-only
                    method = 'transcode';
                    adaptations.push('Transcoded to Audio (Low Bandwidth)');
                } else {
                    adaptations.push('Low Resolution Stream Enforced');
                }
            }
        }

        // 3. Offline Preparation (Layer 2)
        if (preferences.offlineMode) {
            // In real app, check if we have a download URL
            if (resource.format_tags?.includes('pdf') || resource.format_tags?.includes('video')) {
                method = 'download';
                finalUrl = `/api/gre/download?id=${resource.id}`;
                adaptations.push('Prepared for Offline Access');
            }
        }

        return {
            resource,
            deliveryMethod: method,
            url: finalUrl,
            adaptations
        };
    }
}
