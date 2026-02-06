'use client';

/**
 * Analytics Component for PPSDM KMITS
 * Integrates with Plausible Analytics (free tier: 10k pages/month)
 * 
 * @example
 * // In your layout or page:
 * import Analytics from '@/components/analytics/Analytics';
 * 
 * export default function RootLayout({ children }) {
 *   return (
 *     <html lang="id">
 *       <body>
 *         <Analytics />
 *         {children}
 *       </body>
 *     </html>
 *   );
 * }
 */

import { useEffect, useRef, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// Plausible Analytics type declarations
declare global {
  interface Window {
    plausible?: (event: string, options?: PlausibleOptions) => void;
    plausible_q?: PlausibleQueue;
  }

  interface PlausibleOptions {
    u?: string;
    props?: Record<string, string | number | boolean | undefined>;
    domain?: string;
  }

  interface PlausibleQueue {
    push: (args: [string, PlausibleOptions?]) => void;
  }
}

/**
 * Analytics hook for tracking custom events
 */
export function useAnalytics() {
  const track = useCallback((eventName: string, properties?: Record<string, unknown>) => {
    trackEvent(eventName, properties);
  }, []);

  return { track };
}

/**
 * Track a custom event in Plausible
 */
export function trackEvent(eventName: string, properties?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  
  // Type-safe property conversion
  const safeProps: Record<string, string | number | boolean> = {};
  if (properties) {
    for (const [key, value] of Object.entries(properties)) {
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        safeProps[key] = value;
      } else {
        safeProps[key] = String(value);
      }
    }
  }
  
  if (window.plausible) {
    window.plausible(eventName, { props: safeProps });
  } else if (window.plausible_q) {
    // Queue event if Plausible hasn't loaded yet
    window.plausible_q.push([eventName, { props: safeProps }]);
  }
}

/**
 * Track page views
 */
export function trackPageView(path: string): void {
  trackEvent('pageview', { path });
}

/**
 * Track search queries
 */
export function trackSearch(query: string, results: number): void {
  trackEvent('search', { query, results });
}

/**
 * Track user signups/registrations
 */
export function trackSignup(method: string): void {
  trackEvent('signup', { method });
}

/**
 * Track button clicks
 */
export function trackButtonClick(buttonName: string, location: string): void {
  trackEvent('button_click', { button_name: buttonName, location });
}

/**
 * Track form submissions
 */
export function trackFormSubmit(formName: string, success: boolean): void {
  trackEvent('form_submit', { form_name: formName, success });
}

/**
 * Track file downloads
 */
export function trackDownload(fileName: string, fileType: string): void {
  trackEvent('download', { file_name: fileName, file_type: fileType });
}

/**
 * Main Analytics component
 * Automatically tracks page views on route changes
 */
export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const previousPath = useRef<string>('');
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Skip on server-side
    if (typeof window === 'undefined') return;

    // Initialize Plausible script if not already loaded
    if (!hasInitialized.current) {
      const script = document.createElement('script');
      script.defer = true;
      script.dataset.domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || 'ppsdm-kmits.vercel.app';
      script.src = 'https://plausible.io/js/script.js';
      script.id = 'plausible-analytics';
      
      // Add custom event tracking extensions
      script.setAttribute('data-api', 'https://plausible.io/api/event');
      
      document.head.appendChild(script);
      hasInitialized.current = true;
    }

    // Track page view on navigation
    const currentPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    
    if (previousPath.current !== currentPath) {
      trackPageView(currentPath);
      previousPath.current = currentPath;
    }
  }, [pathname, searchParams]);

  return null;
}

/**
 * Track outbound link clicks
 */
export function useOutboundLinkTracking() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a');

      if (link && link.href && !link.href.startsWith(window.location.origin)) {
        trackEvent('outbound_link_click', {
          url: link.href,
          text: link.textContent?.trim() || '',
        });
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);
}

/**
 * Track scroll depth
 */
export function useScrollDepthTracking() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const milestones = [25, 50, 75, 100];
    const tracked = new Set<number>();

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPosition = window.scrollY;
      const scrollPercentage = Math.round((scrollPosition / scrollHeight) * 100);

      milestones.forEach(milestone => {
        if (scrollPercentage >= milestone && !tracked.has(milestone)) {
          tracked.add(milestone);
          trackEvent('scroll_depth', { depth: milestone });
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
}

/**
 * Track time on page
 */
export function useTimeOnPageTracking() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const startTime = Date.now();
    let lastReported = startTime;
    const reportingInterval = 30000; // Report every 30 seconds

    const interval = setInterval(() => {
      const now = Date.now();
      const timeOnPage = now - startTime;
      
      if (now - lastReported >= reportingInterval) {
        trackEvent('time_on_page', { 
          seconds: Math.round(timeOnPage / 1000),
          reported_at: Math.round((now - lastReported) / 1000)
        });
        lastReported = now;
      }
    }, reportingInterval);

    return () => clearInterval(interval);
  }, []);
}
