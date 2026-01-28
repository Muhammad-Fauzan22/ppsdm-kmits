-- Create video_resources table for caching YouTube content
create type video_category as enum ('HARDSKILL', 'SOFTSKILL', 'ACADEMIC', 'GENERAL');

create table if not exists video_resources (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  topic_key text not null, -- The search term used (e.g., 'public speaking')
  youtube_video_id text not null,
  title text not null,
  description text,
  thumbnail_url text,
  channel_title text,
  category video_category default 'GENERAL',
  
  -- Prevent duplicate videos for the same topic
  unique(topic_key, youtube_video_id)
);

-- Index for fast lookups
create index if not exists video_resources_topic_idx on video_resources (topic_key);

-- RLS Policies
alter table video_resources enable row level security;

-- Everyone can read
create policy "Public videos are viewable by everyone"
  on video_resources for select
  using (true);

-- Only service role or admins can insert (in this case, we'll likely use service role in server actions)
-- For development simplicity allowing authenticated insert, but ideally restrict to server-side functions
create policy "Authenticated users can insert videos"
  on video_resources for insert
  with check (auth.role() = 'authenticated');
