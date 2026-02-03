'use client';

/**
 * Resource Preloader Component
 * 
 * Preload critical resources untuk meningkatkan LCP
 * Mendukung preloading untuk script, style, font, dan image
 * 
 * @see https://web.dev/preload-critical-assets/
 */

import { useEffect } from 'react';

interface PreloadResource {
  href: string;
  as: 'script' | 'style' | 'font' | 'image' | 'fetch';
  type?: string;
  crossorigin?: 'anonymous' | 'use-credentials';
  integrity?: string;
}

interface ResourcePreloaderProps {
  resources: PreloadResource[];
}

/**
 * Resource Preloader Component
 * 
 * Menambahkan <link rel="preload"> untuk critical resources
 */
export function ResourcePreloader({ resources }: ResourcePreloaderProps) {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const links: HTMLLinkElement[] = [];

    resources.forEach((resource) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;

      if (resource.type) {
        link.type = resource.type;
      }

      if (resource.crossorigin) {
        link.crossOrigin = resource.crossorigin;
      }

      if (resource.integrity) {
        link.integrity = resource.integrity;
      }

      document.head.appendChild(link);
      links.push(link);
    });

    return () => {
      links.forEach((link) => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      });
    };
  }, [resources]);

  return null;
}

/**
 * DNS Prefetch Component
 * 
 * Prefetch DNS untuk external domains
 */
export function DNSPrefetch({ domains }: { domains: string[] }) {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const links: HTMLLinkElement[] = [];

    domains.forEach((domain) => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);
      links.push(link);
    });

    return () => {
      links.forEach((link) => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      });
    };
  }, [domains]);

  return null;
}

/**
 * Preconnect Component
 * 
 * Preconnect ke external domains
 */
export function Preconnect({ domains }: { domains: string[] }) {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const links: HTMLLinkElement[] = [];

    domains.forEach((domain) => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      document.head.appendChild(link);
      links.push(link);
    });

    return () => {
      links.forEach((link) => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      });
    };
  }, [domains]);

  return null;
}

/**
 * Critical Resources Configuration
 * 
 * Daftar critical resources yang perlu di-preload
 */
export const CRITICAL_RESOURCES: PreloadResource[] = [
  // Critical fonts
  {
    href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    as: 'style',
  },
  // Critical images (hero, logos)
  // {
  //   href: '/images/hero-bg.jpg',
  //   as: 'image',
  // },
];

/**
 * External Domains Configuration
 * 
 * Daftar external domains yang perlu di-preconnect
 */
export const EXTERNAL_DOMAINS = [
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
  'https://*.supabase.co',
];

/**
 * Critical Resource Preloader
 * 
 * Preloader untuk semua critical resources
 */
export function CriticalResourcePreloader() {
  return (
    <>
      <ResourcePreloader resources={CRITICAL_RESOURCES} />
      <Preconnect domains={EXTERNAL_DOMAINS} />
    </>
  );
}
