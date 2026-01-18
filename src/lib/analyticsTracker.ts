// Simple Analytics Tracker
// For production, consider:
// - Umami (self-hosted, privacy-focused) - FREE
// - Plausible (privacy-focused) - FREE self-hosted
// - PostHog (product analytics) - 1M events/month FREE

interface AnalyticsEvent {
    name: string;
    properties?: Record<string, string | number | boolean>;
    timestamp: string;
    path: string;
    sessionId: string;
}

class AnalyticsTracker {
    private events: AnalyticsEvent[] = [];
    private sessionId: string;
    private maxEvents = 500;

    constructor() {
        this.sessionId = this.generateSessionId();
    }

    private generateSessionId(): string {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    track(name: string, properties?: Record<string, string | number | boolean>) {
        const event: AnalyticsEvent = {
            name,
            properties,
            timestamp: new Date().toISOString(),
            path: typeof window !== 'undefined' ? window.location.pathname : '',
            sessionId: this.sessionId,
        };

        this.events.push(event);

        if (this.events.length > this.maxEvents) {
            this.events = this.events.slice(-this.maxEvents);
        }

        if (process.env.NODE_ENV === 'development') {
            console.log('[Analytics]', event);
        }
    }

    // Common tracking methods
    pageView(path?: string) {
        this.track('page_view', {
            path: path || (typeof window !== 'undefined' ? window.location.pathname : '')
        });
    }

    assessmentStarted(dimension: string) {
        this.track('assessment_started', { dimension });
    }

    assessmentCompleted(dimension: string, score: number, percentile: number) {
        this.track('assessment_completed', { dimension, score, percentile });
    }

    aiTutorMessage(messageLength: number) {
        this.track('ai_tutor_message', { messageLength });
    }

    resourceClicked(resourceId: string, resourceType: string) {
        this.track('resource_clicked', { resourceId, resourceType });
    }

    goalCreated(goalType: string) {
        this.track('goal_created', { goalType });
    }

    badgeEarned(badgeId: string) {
        this.track('badge_earned', { badgeId });
    }

    getEvents(): AnalyticsEvent[] {
        return [...this.events];
    }

    getSessionSummary() {
        const eventCounts: Record<string, number> = {};
        this.events.forEach(e => {
            eventCounts[e.name] = (eventCounts[e.name] || 0) + 1;
        });
        return {
            sessionId: this.sessionId,
            totalEvents: this.events.length,
            eventCounts,
            startTime: this.events[0]?.timestamp,
            lastEventTime: this.events[this.events.length - 1]?.timestamp,
        };
    }
}

export const analytics = new AnalyticsTracker();
export default analytics;
