import { useState, useEffect } from 'react';


const SESSION_TOKEN_KEY = 'ppsdm_guest_session_token';

export function useAnonymousSession() {
    const [sessionToken, setSessionToken] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        // Check for existing token
        let token = localStorage.getItem(SESSION_TOKEN_KEY);

        // If no token exists, generate one
        if (!token) {
            if (typeof crypto !== 'undefined' && crypto.randomUUID) {
                token = crypto.randomUUID();
            } else {
                // Simple fallback
                token = Math.random().toString(36).substring(2) + Date.now().toString(36);
            }
            localStorage.setItem(SESSION_TOKEN_KEY, token);
        }

        setSessionToken(token);
        setIsInitialized(true);
    }, []);

    const clearSession = () => {
        localStorage.removeItem(SESSION_TOKEN_KEY);
        setSessionToken(null);
    };

    return {
        sessionToken,
        isInitialized,
        clearSession,
        // Helper to get token synchronously if needed (caution: might be null before hydrate)
        getSessionToken: () => typeof window !== 'undefined' ? localStorage.getItem(SESSION_TOKEN_KEY) : null
    };
}
