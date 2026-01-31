import { Nudge, NUDGE_LIBRARY } from './library';

const STORAGE_KEY_LAST_SHOWN = 'nudge_last_shown_at';
const STORAGE_KEY_HISTORY = 'nudge_history';
const COOLDOWN_MINUTES = 60; // Don't show nudges too often

interface NudgeHistory {
    [nudgeId: string]: number; // timestamp
}

export class NudgeEngine {
    static shouldShowNudge(): boolean {
        if (typeof window === 'undefined') return false;

        const lastShown = localStorage.getItem(STORAGE_KEY_LAST_SHOWN);
        if (!lastShown) return true;

        const lastShownTime = parseInt(lastShown, 10);
        const now = Date.now();
        const diffMinutes = (now - lastShownTime) / (1000 * 60);

        return diffMinutes >= COOLDOWN_MINUTES;
    }

    static getNextNudge(): Nudge | null {
        if (!this.shouldShowNudge()) return null;

        const history: NudgeHistory = JSON.parse(localStorage.getItem(STORAGE_KEY_HISTORY) || '{}');

        // Sort by priority (1 is highest)
        // Filter out nudges shown recently (e.g., in last 24 hours)
        const sortedNudges = [...NUDGE_LIBRARY].sort((a, b) => a.priority - b.priority);

        // Naive selection: Find first available high priority nudge
        for (const nudge of sortedNudges) {
            if (!history[nudge.id]) {
                // Never shown
                return nudge;
            }

            const lastShown = history[nudge.id];
            const hoursSince = (Date.now() - lastShown) / (1000 * 60 * 60);

            // If trigger is 'streak', show more often. If 'tip', less often.
            if (hoursSince > 24) {
                return nudge;
            }
        }

        // Fallback: Random nudge if all have been shown
        return sortedNudges[Math.floor(Math.random() * sortedNudges.length)];
    }

    static markAsShown(nudgeId: string) {
        if (typeof window === 'undefined') return;

        const now = Date.now();
        localStorage.setItem(STORAGE_KEY_LAST_SHOWN, now.toString());

        const history: NudgeHistory = JSON.parse(localStorage.getItem(STORAGE_KEY_HISTORY) || '{}');
        history[nudgeId] = now;
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
    }
}
