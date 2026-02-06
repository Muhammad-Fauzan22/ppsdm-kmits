/**
 * Contextual Adaptation Layer (Layer 5)
 * 
 * "Real-time adaptation to user context"
 */

export interface UserContext {
    deviceType: 'mobile' | 'desktop' | 'tablet';
    connectionType: '4g' | 'wifi' | 'slow-2g' | 'offline';
    clientLocale: string;
    prefersReducedData: boolean;
}

export class ContextService {

    /**
     * Detects context from Request headers or client-side info
     * (Simulated for server-side usage)
     */
    detectContext(headers: Headers): UserContext {
        const userAgent = headers.get('user-agent') || '';
        const saveData = headers.get('save-data') === 'on';

        // Simple device detection
        let deviceType: 'mobile' | 'desktop' | 'tablet' = 'desktop';
        if (/mobile/i.test(userAgent)) deviceType = 'mobile';
        if (/tablet|ipad/i.test(userAgent)) deviceType = 'tablet';

        return {
            deviceType,
            connectionType: saveData ? 'slow-2g' : 'wifi', // Heuristic inference
            clientLocale: 'id-ID', // Default to Indo for PPSDM
            prefersReducedData: saveData
        };
    }

    /**
     * Adapts a resource validation based on context.
     * e.g., Downgrade video score if bandwidth is low.
     */
    adaptResourceForContext(resourceType: string, context: UserContext): number {
        let suitabilityScore = 1.0;

        // Bandwidth Optimization Rule
        if (context.prefersReducedData && resourceType === 'video') {
            suitabilityScore *= 0.4; // Heavily penalize video on data-saver
        }

        // Device Optimization Rule
        if (context.deviceType === 'mobile' && resourceType === 'tool') {
            suitabilityScore *= 0.7; // Tools might be hard to use on mobile
        }

        return suitabilityScore;
    }
}
