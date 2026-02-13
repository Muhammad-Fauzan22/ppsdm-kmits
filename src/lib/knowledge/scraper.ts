/**
 * RSS Feed Scraper for Knowledge Hub.
 * Fetches and parses RSS/Atom feeds from engineering news sources.
 */

import { transformContent } from './transformer';
import type { KnowledgeItem } from './types';

interface RSSItem {
    title: string;
    link: string;
    description: string;
    pubDate: string;
    imageUrl?: string;
    source: string;
}

// ─── RSS Sources ────────────────────────────────────

export const RSS_SOURCES = [
    {
        name: 'MIT Technology Review',
        url: 'https://www.technologyreview.com/feed/',
        category: 'news',
    },
    {
        name: 'Engineering.com',
        url: 'https://www.engineering.com/feed/',
        category: 'news',
    },
    {
        name: 'IEEE Spectrum',
        url: 'https://spectrum.ieee.org/feeds/feed.rss',
        category: 'news',
    },
    {
        name: 'Hackaday',
        url: 'https://hackaday.com/feed/',
        category: 'news',
    },
];

// ─── XML Parser (lightweight, no dependency) ────────

function extractTagContent(xml: string, tag: string): string {
    // Handle CDATA
    const cdataRegex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`, 'i');
    const cdataMatch = xml.match(cdataRegex);
    if (cdataMatch) return cdataMatch[1].trim();

    // Handle regular content
    const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i');
    const match = xml.match(regex);
    return match ? match[1].trim() : '';
}

function extractImageUrl(xml: string): string | undefined {
    // Check for media:content or enclosure
    const mediaMatch = xml.match(/url=["']([^"']+\.(jpg|jpeg|png|gif|webp)[^"']*)/i);
    if (mediaMatch) return mediaMatch[1];

    // Check for <img> in description
    const imgMatch = xml.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgMatch) return imgMatch[1];

    return undefined;
}

function stripHtmlTags(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim();
}

// ─── Parse RSS Feed ─────────────────────────────────

function parseRSSFeed(xml: string, sourceName: string): RSSItem[] {
    const items: RSSItem[] = [];

    // Split by <item> or <entry> (Atom)
    const itemRegex = /<item[\s>]([\s\S]*?)<\/item>|<entry[\s>]([\s\S]*?)<\/entry>/gi;
    let match;

    while ((match = itemRegex.exec(xml)) !== null) {
        const itemXml = match[1] || match[2];
        if (!itemXml) continue;

        const title = stripHtmlTags(extractTagContent(itemXml, 'title'));
        const link = extractTagContent(itemXml, 'link') || itemXml.match(/href=["']([^"']+)["']/)?.[1] || '';
        const description = stripHtmlTags(extractTagContent(itemXml, 'description') || extractTagContent(itemXml, 'summary') || extractTagContent(itemXml, 'content'));
        const pubDate = extractTagContent(itemXml, 'pubDate') || extractTagContent(itemXml, 'published') || extractTagContent(itemXml, 'updated');
        const imageUrl = extractImageUrl(itemXml);

        if (title && link) {
            items.push({
                title,
                link: link.startsWith('http') ? link : `https://${link}`,
                description: description.substring(0, 500),
                pubDate,
                imageUrl,
                source: sourceName,
            });
        }
    }

    return items;
}

// ─── Fetch Single Feed ──────────────────────────────

async function fetchFeed(source: typeof RSS_SOURCES[0]): Promise<RSSItem[]> {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(source.url, {
            signal: controller.signal,
            headers: { 'User-Agent': 'PPSDM-KMITS-KnowledgeHub/1.0' },
        });

        clearTimeout(timeout);

        if (!response.ok) {
            console.warn(`[Scraper] Failed to fetch ${source.name}: ${response.status}`);
            return [];
        }

        const xml = await response.text();
        return parseRSSFeed(xml, source.name);
    } catch (error) {
        console.warn(`[Scraper] Error fetching ${source.name}:`, error);
        return [];
    }
}

// ─── Main Scraper ───────────────────────────────────

export async function scrapeAllFeeds(): Promise<Omit<KnowledgeItem, 'id' | 'created_at' | 'updated_at'>[]> {
    const allItems: RSSItem[] = [];

    // Fetch all feeds in parallel
    const results = await Promise.allSettled(RSS_SOURCES.map(fetchFeed));

    for (const result of results) {
        if (result.status === 'fulfilled') {
            allItems.push(...result.value);
        }
    }

    // Deduplicate by URL
    const seen = new Set<string>();
    const unique = allItems.filter(item => {
        if (seen.has(item.link)) return false;
        seen.add(item.link);
        return true;
    });

    // Transform into KnowledgeItem format
    return unique.map(item => {
        const fullText = `${item.title}. ${item.description}`;
        const metadata = transformContent(fullText, 'news');

        return {
            source: item.source,
            title: item.title,
            content: item.description,
            summary: item.description.substring(0, 200),
            url: item.link,
            image_url: item.imageUrl || null,
            published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
            interactive_metadata: metadata,
            category: 'news',
            tags: metadata.terms.slice(0, 5).map(t => t.term),
            is_current: true,
        };
    });
}
