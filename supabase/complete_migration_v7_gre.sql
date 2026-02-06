-- ==============================================================================
-- GLOBAL RESOURCE ENGINE (GRE) - SCHEMA MIGRATION V7
-- Description: Core schema for GRE Knowledge Graph, Quality Assessment, and Vector Search
-- ==============================================================================

-- 1. Enable PGVECTOR Extension for Quantum-Simulated Search
create extension if not exists vector with schema extensions;

-- 2. ENUMs for Resource Classification
create type gre_resource_type as enum (
  'course', 'article', 'video', 'book', 'podcast', 'project', 'tool', 'paper', 'repository'
);

create type gre_difficulty_level as enum (
  'beginner', 'intermediate', 'advanced', 'expert'
);

-- 3. MAIN TABLE: GRE Resources (Nodes in the Graph)
create table if not exists gre_resources (
  id uuid primary key default uuid_generate_v4(),
  
  -- Core Metadata
  title text not null,
  description text,
  url text unique not null,
  type gre_resource_type not null default 'article',
  
  -- Contextual Metadata
  languages text[] default '{id}', -- ISO language codes
  difficulty gre_difficulty_level default 'beginner',
  estimated_time_minutes integer, -- Duration in minutes
  format_tags text[], -- e.g., ['pdf', 'interactive', 'mp4']
  
  -- Cost Metadata (JSONB for flexibility)
  cost_info jsonb default '{"is_free": true, "currency": "IDR", "amount": 0}'::jsonb,
  
  -- Vector Embedding (OpenAI text-embedding-ada-002 uses 1536 dims)
  embedding vector(1536),
  
  -- Source Metadata
  source_platform text, -- e.g., 'Coursera', 'Youtube', 'OpenAlex'
  external_id text, -- ID from the source platform
  
  -- System Field
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. QUALITY TABLE: 12-Dimensional Quality Scores
create table if not exists gre_quality_scores (
  resource_id uuid primary key references gre_resources(id) on delete cascade,
  
  -- Dimensions (0.0 to 1.0)
  pedagogical_score float default 0,
  scientific_accuracy_score float default 0,
  technical_quality_score float default 0,
  production_quality_score float default 0,
  accessibility_score float default 0,
  recency_score float default 0,
  credibility_score float default 0,
  engagement_potential_score float default 0,
  practical_application_score float default 0,
  cultural_relevance_score float default 0,
  scalability_score float default 0,
  impact_score float default 0,
  
  -- Aggregated
  overall_score float generated always as (
    (pedagogical_score + scientific_accuracy_score + technical_quality_score + 
     production_quality_score + accessibility_score + recency_score + 
     credibility_score + engagement_potential_score + practical_application_score + 
     cultural_relevance_score + scalability_score + impact_score) / 12
  ) stored,
  
  last_assessed_at timestamptz default now()
);

-- 5. GRAPH EDGES: Relationships between Resources
create table if not exists gre_graph_edges (
  source_id uuid references gre_resources(id) on delete cascade,
  target_id uuid references gre_resources(id) on delete cascade,
  relation_type text not null, -- 'prerequisite', 'complements', 'similar_to', 'next_step'
  weight float default 1.0,
  
  created_at timestamptz default now(),
  primary key (source_id, target_id, relation_type)
);

-- 6. INDEXES for Performance
-- HNSW Index for Fast Vector Similarity Search
create index if not exists gre_resources_embedding_idx 
on gre_resources 
using hnsw (embedding vector_cosine_ops);

-- Trigram Index for text search on Title (if not using Full Text Search yet)
create extension if not exists pg_trgm with schema extensions;
create index if not exists gre_resources_title_trgm_idx 
on gre_resources 
using gist (title gist_trgm_ops);

-- Standard Indexes
create index if not exists gre_resources_type_idx on gre_resources(type);
create index if not exists gre_quality_scores_overall_idx on gre_quality_scores(overall_score desc);

-- 7. RLS POLICIES (Row Level Security)
alter table gre_resources enable row level security;
alter table gre_quality_scores enable row level security;
alter table gre_graph_edges enable row level security;

-- Public Read Policy (Everyone can search/view resources)
create policy "Public resources are viewable by everyone" 
on gre_resources for select 
using (true);

create policy "Public quality scores are viewable by everyone" 
on gre_quality_scores for select 
using (true);

create policy "Public edges are viewable by everyone" 
on gre_graph_edges for select 
using (true);

-- Admin Write Policy (Adjust role as needed, assuming service_role or admin user)
-- For now, allowing authenticated users to insert might be too open, so strict to service_role mostly
-- Or specific admin users.
create policy "Admins can insert resources" 
on gre_resources for insert 
to authenticated 
with check ( true ); -- TODO: Refine to admin only later

-- 8. FUNCTIONS

-- Basic Semantic Search Function
create or replace function match_gre_resources (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  title text,
  type gre_resource_type,
  similarity float
)
language plpgsql
stable
as $$
begin
  return query (
    select
      gre_resources.id,
      gre_resources.title,
      gre_resources.type,
      1 - (gre_resources.embedding <=> query_embedding) as similarity
    from gre_resources
    where 1 - (gre_resources.embedding <=> query_embedding) > match_threshold
    order by gre_resources.embedding <=> query_embedding
    limit match_count
  );
end;
$$;
