import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// Validation schema
const querySchema = z.object({
  user_id: z.string().uuid(),
  limit: z.string().transform(Number).default('10'),
  context: z.enum(['home', 'continue', 'trending', 'discover']).default('home'),
});

// Content item interface
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
      user_id: searchParams.get('user_id') || undefined,
      limit: searchParams.get('limit') || '10',
      context: searchParams.get('context') || 'home',
    });

    if (!params.user_id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Get user profile and dimension scores
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*, dimension_scores(*)')
      .eq('id', params.user_id)
      .single();

    if (profileError) {
      }

    // Get user's content interactions for collaborative filtering
    const { data: interactions, error: interactionsError } = await supabase
      .from('user_content_interactions')
      .select('content_id, interaction_type')
      .eq('user_id', params.user_id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (interactionsError) {
      }

    // Build recommendations based on context
    let recommendations: any[] = [];

    switch (params.context) {
      case 'continue':
        recommendations = await getContinueWatching(supabase, params.user_id, params.limit);
        break;
      
      case 'trending':
        recommendations = await getTrendingContent(supabase, params.limit);
        break;
      
      case 'discover':
        recommendations = await getDiscoveryContent(supabase, params.user_id, params.limit);
        break;
      
      case 'home':
      default:
        recommendations = await getPersonalizedRecommendations(
          supabase, 
          params.user_id, 
          userProfile,
          interactions || [],
          params.limit
        );
        break;
    }

    return NextResponse.json({
      recommendations,
      context: params.context,
      total: recommendations.length,
    });

  } catch (error) {
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

// Get continue watching content
async function getContinueWatching(supabase: any, userId: string, limit: number): Promise<any[]> {
  const { data } = await supabase
    .from('user_content_interactions')
    .select(`
      content_id,
      interaction_data,
      scraped_content (*)
    `)
    .eq('user_id', userId)
    .eq('interaction_type', 'start')
    .not('interaction_data->>progress', 'is', null)
    .lt('interaction_data->>progress', 90)
    .order('created_at', { ascending: false })
    .limit(limit);

  return data?.map((item: any) => transformContent(item.scraped_content)) || [];
}

// Get trending content
async function getTrendingContent(supabase: any, limit: number): Promise<any[]> {
  const { data } = await supabase
    .from('scraped_content')
    .select('*')
    .eq('is_verified', true)
    .gt('engagement_score', 70)
    .order('engagement_score', { ascending: false })
    .order('scrape_date', { ascending: false })
    .limit(limit);

  return data?.map((item: ContentItem) => transformContent(item)) || [];
}

// Get discovery content (diverse, not yet seen)
async function getDiscoveryContent(supabase: any, userId: string, limit: number): Promise<any[]> {
  // Get content IDs the user has already seen
  const { data: seenContent } = await supabase
    .from('user_content_interactions')
    .select('content_id')
    .eq('user_id', userId)
    .in('interaction_type', ['view', 'complete']);

  const seenIds = seenContent?.map((item: any) => item.content_id) || [];

  // Get diverse, high-quality content not yet seen
  let query = supabase
    .from('scraped_content')
    .select('*')
    .eq('is_verified', true)
    .gt('quality_score', 75);

  if (seenIds.length > 0) {
    query = query.not('id', 'in', `(${seenIds.join(',')})`);
  }

  const { data } = await query
    .order('quality_score', { ascending: false })
    .order('scrape_date', { ascending: false })
    .limit(limit);

  return data?.map((item: ContentItem) => transformContent(item)) || [];
}

// Get personalized recommendations
async function getPersonalizedRecommendations(
  supabase: any,
  userId: string,
  userProfile: any,
  interactions: any[],
  limit: number
): Promise<any[]> {
  // Get user's dimension scores
  const dimensionScores = userProfile?.dimension_scores?.[0] || {};
  
  // Find weakest dimensions (opportunity for growth)
  const weakDimensions = Object.entries(dimensionScores)
    .filter(([key]) => !['id', 'user_id', 'created_at', 'updated_at'].includes(key))
    .sort(([, a], [, b]) => (a as number) - (b as number))
    .slice(0, 3)
    .map(([key]) => key);

  // Get content IDs from interactions
  const interactedIds = interactions.map(i => i.content_id);

  // Build query for personalized content
  let query = supabase
    .from('scraped_content')
    .select('*')
    .eq('is_verified', true)
    .gt('relevance_score', 60);

  // Exclude already interacted content
  if (interactedIds.length > 0) {
    query = query.not('id', 'in', `(${interactedIds.join(',')})`);
  }

  // Prioritize weak dimensions
  if (weakDimensions.length > 0) {
    query = query.contains('dimensions', weakDimensions);
  }

  const { data } = await query
    .order('relevance_score', { ascending: false })
    .order('quality_score', { ascending: false })
    .limit(limit);

  // If not enough results, fill with trending content
  let results = data?.map((item: ContentItem) => transformContent(item)) || [];
  
  if (results.length < limit) {
    const remaining = limit - results.length;
    const existingIds = results.map((r: any) => r.id);
    
    const { data: trending } = await supabase
      .from('scraped_content')
      .select('*')
      .eq('is_verified', true)
      .gt('engagement_score', 60)
      .not('id', 'in', `(${[...interactedIds, ...existingIds].join(',')})`)
      .order('engagement_score', { ascending: false })
      .limit(remaining);

    results = [...results, ...(trending?.map((item: ContentItem) => transformContent(item)) || [])];
  }

  return results;
}

// Transform content for frontend
function transformContent(content: ContentItem | null) {
  if (!content) return null;
  
  return {
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
  };
}

// Helper function to check if content is new
function isNewContent(scrapeDate: string | null): boolean {
  if (!scrapeDate) return false;
  const date = new Date(scrapeDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 7;
}
