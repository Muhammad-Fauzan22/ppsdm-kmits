#!/usr/bin/env python3
"""
YouTube Education Aggregator

Mengumpulkan video edukatif dari channel pembelajaran teknologi.
Mendukung channel Indonesia dan internasional.

Usage:
    aggregator = YouTubeAggregator()
    videos = aggregator.fetch_latest_videos(max_results=5)
    aggregator.save_to_supabase(videos)
"""

import os
import sys
from datetime import datetime
from typing import List, Dict, Optional

# Fix Windows Unicode
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

try:
    from googleapiclient.discovery import build
    from googleapiclient.errors import HttpError
except ImportError:
    build = None
    HttpError = None

try:
    from supabase import create_client, Client
except ImportError:
    create_client = None
    Client = None


class YouTubeAggregator:
    """
    Aggregator untuk konten edukasi YouTube
    
    Features:
    - Multiple channel support
    - Automatic tagging
    - Supabase integration
    - Quota management
    
    Indonesian Channels:
        - Programmer Zaman Now
        - Web Programming UNPAS
        - Kawan Koding
        - Dea Afrizal
    
    International Channels:
        - FreeCodeCamp
        - Traversy Media
        - Fireship
        - Web Dev Simplified
    """
    
    # Channel ID mapping
    CHANNELS = {
        # Indonesian Channels
        'Programmer Zaman Now': 'UC14ZKB9XsDZbnHVmr4AmUpQ',
        'Web Programming UNPAS': 'UCkXmLjEr95LVtGuIm3l2dPg',
        'Kawan Koding': 'UCfKsb5cC_6Xw8RZbY0Ff_7w',
        'Dea Afrizal': 'UCkD2YlmY2Rfu1zZxaEg2PQA',
        
        # International Channels
        'FreeCodeCamp': 'UC8butISFwT-Wl7EV0hUK0BQ',
        'Traversy Media': 'UC29ju8bIPH5as8OGnQzwJyA',
        'Fireship': 'UCsBjURrPoezykLs9EqgamOA',
        'Web Dev Simplified': 'UCFbNIlppjAuEX4znoulh0Cw',
        'The Net Ninja': 'UCW5YeuERMmlnqo4oq8vwUpg',
        'Academind': 'UCSJbGtTlrDami-tDGPUV9-w'
    }
    
    # Tech keywords for tagging
    TECH_KEYWORDS = {
        'python': ['python', 'django', 'flask', 'pandas', 'numpy', 'fastapi'],
        'javascript': ['javascript', 'js', 'node', 'nodejs', 'react', 'vue', 'angular', 'svelte'],
        'typescript': ['typescript', 'ts', 'nextjs', 'nestjs'],
        'java': ['java', 'spring', 'springboot', 'jakarta'],
        'go': ['golang', 'go programming'],
        'rust': ['rust', 'rust programming', 'cargo'],
        'php': ['php', 'laravel', 'codeigniter', 'symfony'],
        'database': ['sql', 'mysql', 'postgresql', 'mongodb', 'database', 'prisma'],
        'devops': ['docker', 'kubernetes', 'k8s', 'ci/cd', 'aws', 'cloud', 'azure', 'gcp'],
        'mobile': ['android', 'ios', 'flutter', 'react native', 'mobile', 'kotlin', 'swift'],
        'ai': ['machine learning', 'ai', 'artificial intelligence', 'deep learning', 'tensorflow', 'pytorch'],
        'web': ['html', 'css', 'tailwind', 'bootstrap', 'web development', 'frontend', 'backend'],
        'git': ['git', 'github', 'version control']
    }
    
    def __init__(self):
        """Initialize YouTube API client"""
        if not build:
            raise ImportError("google-api-python-client not installed. Run: pip install google-api-python-client")
        
        api_key = os.environ.get('YOUTUBE_API_KEY')
        if not api_key:
            raise ValueError("YOUTUBE_API_KEY not found in environment variables")
        
        self.youtube = build('youtube', 'v3', developerKey=api_key)
        self.api_calls = 0
        
    def fetch_latest_videos(self, max_results: int = 5) -> List[Dict]:
        """
        Fetch latest videos from all channels
        
        Args:
            max_results: Maximum videos per channel
            
        Returns:
            List of video dictionaries
        """
        all_videos = []
        
        print(f"🎬 YouTube Aggregator - Fetching from {len(self.CHANNELS)} channels")
        print("=" * 70)
        
        for channel_name, channel_id in self.CHANNELS.items():
            try:
                print(f"\n📺 {channel_name}")
                
                # Get uploads playlist ID
                channel_response = self.youtube.channels().list(
                    part='contentDetails',
                    id=channel_id
                ).execute()
                self.api_calls += 1
                
                if not channel_response['items']:
                    print(f"   ⚠️ Channel not found")
                    continue
                
                uploads_playlist_id = channel_response['items'][0]['contentDetails']['relatedPlaylists']['uploads']
                
                # Get videos from playlist
                playlist_response = self.youtube.playlistItems().list(
                    part='snippet',
                    playlistId=uploads_playlist_id,
                    maxResults=max_results
                ).execute()
                self.api_calls += 1
                
                videos_added = 0
                for item in playlist_response.get('items', []):
                    try:
                        snippet = item['snippet']
                        video_data = {
                            'platform': 'youtube',
                            'type': 'video',
                            'title': snippet['title'],
                            'description': snippet['description'][:500] if snippet['description'] else '',
                            'video_id': snippet['resourceId']['videoId'],
                            'thumbnail_url': self._get_best_thumbnail(snippet.get('thumbnails', {})),
                            'channel': channel_name,
                            'url': f"https://youtube.com/watch?v={snippet['resourceId']['videoId']}",
                            'published_at': snippet['publishedAt'],
                            'scraped_at': datetime.now().isoformat(),
                            'tags': self._extract_tags(snippet['title'] + " " + snippet.get('description', ''))
                        }
                        all_videos.append(video_data)
                        videos_added += 1
                    except Exception as e:
                        print(f"   ⚠️ Error processing video: {e}")
                        continue
                
                print(f"   ✓ Fetched {videos_added} videos")
                
            except HttpError as e:
                print(f"   ❌ API error for {channel_name}: {e}")
                continue
            except Exception as e:
                print(f"   ❌ Error for {channel_name}: {e}")
                continue
        
        # Sort by published date (newest first)
        all_videos.sort(key=lambda x: x['published_at'], reverse=True)
        
        print("\n" + "=" * 70)
        print(f"✅ Total videos fetched: {len(all_videos)}")
        print(f"📊 API calls made: {self.api_calls}")
        
        return all_videos
    
    def _get_best_thumbnail(self, thumbnails: Dict) -> str:
        """Get the best available thumbnail URL"""
        for quality in ['maxres', 'standard', 'high', 'medium', 'default']:
            if quality in thumbnails:
                return thumbnails[quality]['url']
        return ""
    
    def _extract_tags(self, text: str) -> List[str]:
        """Extract technology tags from text"""
        text_lower = text.lower()
        tags = []
        
        for tag, keywords in self.TECH_KEYWORDS.items():
            if any(keyword in text_lower for keyword in keywords):
                tags.append(tag)
        
        return list(set(tags))  # Remove duplicates
    
    def save_to_supabase(self, videos: List[Dict]) -> bool:
        """Save videos to Supabase database"""
        if not create_client:
            print("❌ Supabase client not available")
            return False
        
        supabase_url = os.environ.get('SUPABASE_URL')
        supabase_key = os.environ.get('SUPABASE_KEY')
        
        if not supabase_url or not supabase_key:
            print("❌ Supabase credentials not found")
            return False
        
        try:
            print(f"\n💾 Saving {len(videos)} videos to Supabase...")
            
            supabase: Client = create_client(supabase_url, supabase_key)
            
            inserted = 0
            skipped = 0
            
            for video in videos:
                try:
                    # Check for duplicates
                    existing = supabase.table('scraped_videos') \
                        .select('id') \
                        .eq('video_id', video['video_id']) \
                        .execute()
                    
                    if existing.data:
                        skipped += 1
                        continue
                    
                    # Insert new record
                    supabase.table('scraped_videos').insert(video).execute()
                    inserted += 1
                    
                except Exception as e:
                    print(f"   ⚠️ Error inserting video: {e}")
                    continue
            
            print(f"✅ Inserted: {inserted}, Skipped: {skipped}")
            return True
            
        except Exception as e:
            print(f"❌ Error: {e}")
            return False
    
    def save_to_json(self, videos: List[Dict], filename: str = 'youtube_videos.json'):
        """Save videos to JSON file"""
        import json
        
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(videos, f, ensure_ascii=False, indent=2)
            print(f"✅ Saved to {filename}")
        except Exception as e:
            print(f"❌ Error saving: {e}")


def main():
    """CLI entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(description='YouTube Education Aggregator')
    parser.add_argument('--max-results', type=int, default=5, help='Videos per channel')
    parser.add_argument('--json', action='store_true', help='Save to JSON')
    parser.add_argument('--supabase', action='store_true', help='Save to Supabase')
    
    args = parser.parse_args()
    
    try:
        aggregator = YouTubeAggregator()
        videos = aggregator.fetch_latest_videos(max_results=args.max_results)
        
        if args.json:
            aggregator.save_to_json(videos)
        
        if args.supabase:
            aggregator.save_to_supabase(videos)
        
        # Print tag distribution
        all_tags = {}
        for video in videos:
            for tag in video.get('tags', []):
                all_tags[tag] = all_tags.get(tag, 0) + 1
        
        if all_tags:
            print("\n🏷️  Tag Distribution:")
            for tag, count in sorted(all_tags.items(), key=lambda x: x[1], reverse=True)[:10]:
                print(f"   • {tag}: {count}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return 1
    
    return 0


if __name__ == "__main__":
    exit(main())
