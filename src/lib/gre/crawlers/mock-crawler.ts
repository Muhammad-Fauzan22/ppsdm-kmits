import { BaseCrawler, CrawlResult } from './base';
import { GreResource } from '../types';

export class MockCrawler extends BaseCrawler {
    sourceName = 'MockSource';

    async crawl(query?: string): Promise<CrawlResult> {
        // Simulate API latency
        await new Promise(resolve => setTimeout(resolve, 500));

        const mockResources: Partial<GreResource>[] = [
            {
                title: 'Introduction to Quantum Computing',
                url: 'https://example.com/quantum-intro',
                type: 'course',
                description: 'A basic introduction to qubits and superposition.',
                difficulty: 'beginner',
                format_tags: ['video', 'interactive'],
                languages: ['en'],
                cost_info: { is_free: true, currency: 'USD', amount: 0 },
                source_platform: 'MockEducation',
            },
            {
                title: 'Advanced Machine Learning Patterns',
                url: 'https://example.com/ml-patterns',
                type: 'article',
                description: 'Deep dive into transformer architectures.',
                difficulty: 'advanced',
                format_tags: ['text'],
                languages: ['en'],
                cost_info: { is_free: true, currency: 'USD', amount: 0 },
                source_platform: 'MockEducation',
            },
            {
                title: 'Belajar Fundamental React.js',
                url: 'https://dicoding.com/react-fundamental',
                type: 'course',
                description: 'Pelajari dasar-dasar komponen, state, dan props.',
                difficulty: 'beginner',
                format_tags: ['code', 'interactive'],
                languages: ['id'],
                cost_info: { is_free: false, currency: 'IDR', amount: 500000 },
                source_platform: 'DicodingMock',
            }
        ];

        return {
            resources: mockResources,
            errors: []
        };
    }
}
