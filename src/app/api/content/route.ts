import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// Validation schema for query parameters
const querySchema = z.object({
  dimension: z.string().optional(),
  type: z.string().optional(),
  search: z.string().optional(),
  limit: z.string().transform(Number).default('20'),
  offset: z.string().transform(Number).default('0'),
  sort_by: z.enum(['relevance', 'quality', 'date', 'trending']).default('relevance'),
});

// Content item type
interface ContentItem {
  id: string;
  title: string;
  description: string | null;
  images: string[] | null;
  videos: string[] | null;
  content_type: string;
  metadata: { duration?: string } | null;
  dimensions: string[] | null;
  quality_score: number;
  relevance_score: number;
  engagement_score: number;
  author: string | null;
  source_name: string;
  source_url: string;
  publish_date: string | null;
  scrape_date: string | null;
  tags: string[] | null;
  is_verified: boolean;
}


export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const params = querySchema.parse({
      dimension: searchParams.get('dimension') || undefined,
      type: searchParams.get('type') || undefined,
      search: searchParams.get('search') || undefined,
      limit: searchParams.get('limit') || '20',
      offset: searchParams.get('offset') || '0',
      sort_by: searchParams.get('sort_by') || 'relevance',
    });

    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Build query
    let query = supabase
      .from('scraped_content')
      .select(`
        *,
        content_dimension_mapping (
          dimension,
          confidence
        )
      `)
      .eq('is_verified', true)
      .range(params.offset, params.offset + params.limit - 1);


    // Apply filters
    if (params.dimension && params.dimension !== 'all') {
      query = query.contains('dimensions', [params.dimension]);
    }

    if (params.type && params.type !== 'all') {
      query = query.eq('content_type', params.type);
    }


    if (params.search) {
      query = query.or(`title.ilike.%${params.search}%,description.ilike.%${params.search}%`);
    }

    // Apply sorting
    switch (params.sort_by) {
      case 'quality':
        query = query.order('quality_score', { ascending: false });
        break;
      case 'date':
        query = query.order('publish_date', { ascending: false });
        break;
      case 'trending':
        query = query.order('engagement_score', { ascending: false });
        break;
      case 'relevance':
      default:
        query = query.order('relevance_score', { ascending: false });
        break;
    }

    // Execute query
    const { data: contents, error, count } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch content', details: error.message },
        { status: 500 }
      );
    }

    // Transform data for frontend
    const transformedContents = (contents as ContentItem[] | null)?.map((content: ContentItem) => ({
      id: content.id,
      title: content.title,
      description: content.description,
      imageUrl: content.images?.[0] || null,
      videoUrl: content.videos?.[0] || null,
      type: content.content_type,
      duration: content.metadata?.duration || null,
      dimensions: content.dimensions || [],
      qualityScore: content.quality_score,
      relevanceScore: content.relevance_score,
      engagementScore: content.engagement_score,
      author: content.author,
      source: content.source_name,
      sourceUrl: content.source_url,
      publishedAt: content.publish_date,
      isNew: isNewContent(content.scrape_date),
      isTrending: content.engagement_score > 80,
      tags: content.tags || [],
    }));


    return NextResponse.json({
      contents: transformedContents,
      total: count,
      limit: params.limit,
      offset: params.offset,
    });

  } catch (error) {
    console.error('API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to check if content is new (within 7 days)
function isNewContent(scrapeDate: string | null): boolean {
  if (!scrapeDate) return false;
  const date = new Date(scrapeDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 7;
}

// POST endpoint to track content interactions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content_id, interaction_type, user_id, metadata } = body;

    if (!content_id || !interaction_type || !user_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Insert interaction
    const { error } = await supabase
      .from('user_content_interactions')
      .insert({
        user_id,
        content_id,
        interaction_type,
        interaction_data: metadata || {},
      });

    if (error) {
      console.error('Failed to track interaction:', error);
      return NextResponse.json(
        { error: 'Failed to track interaction' },
        { status: 500 }
      );
    }

    // Update engagement score
    await supabase.rpc('update_content_engagement', {
      content_id: content_id,
      interaction_type: interaction_type,
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
