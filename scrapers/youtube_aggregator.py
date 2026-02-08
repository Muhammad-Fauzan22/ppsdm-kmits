#!/usr/bin/env python3
"""
YouTube Aggregator - Mengambil video edukasi dari channel YouTube ITS
"""

import argparse
import json
import os
import sys
from datetime import datetime
from typing import List, Dict, Optional

# Try to import optional dependencies
try:
    from googleapiclient.discovery import build
    from googleapiclient.errors import HttpError
    HAS_GOOGLE_API = True
except ImportError:
    HAS_GOOGLE_API = False
    print("Warning: google-api-python-client not installed. Using mock data.")

try:
    from supabase import create_client
    HAS_SUPABASE = True
except ImportError:
    HAS_SUPABASE = False


# Channel IDs for educational content
DEFAULT_CHANNELS = [
    "UCZ9b4xB-Ji1q3z8L3U7Z1Xw",  # Example: ITS Official (replace with actual)
]

# Keywords for filtering educational content
EDUCATION_KEYWORDS = [
    "kuliah", "tutorial", "belajar", "edukasi", "webinar", "seminar",
    "workshop", "pelatihan", "kursus", "materi", "pembelajaran"
]


def fetch_youtube_videos(
    api_key: str,
    channel_ids: List[str] = None,
    max_results: int = 50
) -> List[Dict]:
    """Fetch videos from YouTube channels"""
    if not HAS_GOOGLE_API:
        # Return mock data if dependencies not available
        return [
            {
                "title": "Tutorial Belajar Online - ITS",
                "video_id": "dQw4w9WgXcQ",
                "url": "https://youtube.com/watch?v=dQw4w9WgXcQ",
                "channel": "ITS Official",
                "published_at": datetime.now().isoformat(),
                "description": "Video tutorial pembelajaran dari ITS...",
                "thumbnail": "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
                "duration": "PT15M30S",
                "view_count": 1500,
                "source": "YouTube"
            }
        ]
    
    if not channel_ids:
        channel_ids = DEFAULT_CHANNELS
    
    videos = []
    
    try:
        youtube = build('youtube', 'v3', developerKey=api_key)
        
        for channel_id in channel_ids:
            try:
                # Get channel uploads playlist
                channel_response = youtube.channels().list(
                    part='contentDetails',
                    id=channel_id
                ).execute()
                
                if not channel_response['items']:
                    continue
                
                uploads_playlist_id = channel_response['items'][0]['contentDetails']['relatedPlaylists']['uploads']
                
                # Get videos from uploads playlist
                playlist_response = youtube.playlistItems().list(
                    part='snippet',
                    playlistId=uploads_playlist_id,
                    maxResults=max_results
                ).execute()
                
                for item in playlist_response['items']:
                    snippet = item['snippet']
                    video_id = snippet['resourceId']['videoId']
                    
                    # Get video details
                    video_response = youtube.videos().list(
                        part='contentDetails,statistics',
                        id=video_id
                    ).execute()
                    
                    if not video_response['items']:
                        continue
                    
                    video_details = video_response['items'][0]
                    
                    # Check if educational content
                    title = snippet['title']
                    description = snippet['description']
                    is_educational = any(
                        keyword in title.lower() or keyword in description.lower()
                        for keyword in EDUCATION_KEYWORDS
                    )
                    
                    videos.append({
                        "title": title,
                        "video_id": video_id,
                        "url": f"https://youtube.com/watch?v={video_id}",
                        "channel": snippet['channelTitle'],
                        "published_at": snippet['publishedAt'],
                        "description": description[:500],
                        "thumbnail": snippet['thumbnails']['high']['url'] if 'high' in snippet['thumbnails'] else snippet['thumbnails']['default']['url'],
                        "duration": video_details['contentDetails']['duration'],
                        "view_count": int(video_details['statistics'].get('viewCount', 0)),
                        "is_educational": is_educational,
                        "source": "YouTube",
                        "scraped_at": datetime.now().isoformat()
                    })
                    
            except HttpError as e:
                print(f"Error fetching channel {channel_id}: {e}")
                continue
                
    except Exception as e:
        print(f"Error building YouTube service: {e}")
    
    return videos


def save_to_supabase(videos: List[Dict], supabase_url: str, supabase_key: str):
    """Save videos to Supabase"""
    if not HAS_SUPABASE:
        print("Supabase not available, skipping database save")
        return False
    
    try:
        supabase = create_client(supabase_url, supabase_key)
        
        for video in videos:
            # Check if video already exists
            existing = supabase.table('scraped_content')\
                .select('id')\
                .eq('url', video['url'])\
                .execute()
            
            if existing.data:
                print(f"Skipping existing video: {video['title'][:50]}...")
                continue
            
            # Insert new video
            data = {
                'title': video['title'],
                'url': video['url'],
                'content': video['description'],
                'source': video['source'],
                'content_type': 'video',
                'published_at': video['published_at'],
                'metadata': {
                    'video_id': video['video_id'],
                    'channel': video['channel'],
                    'duration': video['duration'],
                    'view_count': video['view_count'],
                    'thumbnail': video['thumbnail'],
                    'is_educational': video.get('is_educational', False),
                    'scraped_at': video['scraped_at']
                }
            }
            
            result = supabase.table('scraped_content').insert(data).execute()
            print(f"Saved: {video['title'][:50]}...")
        
        return True
        
    except Exception as e:
        print(f"Error saving to Supabase: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(description='YouTube Video Aggregator')
    parser.add_argument('--api-key', type=str, help='YouTube Data API key')
    parser.add_argument('--channels', type=str, nargs='+', help='YouTube channel IDs')
    parser.add_argument('--max-results', type=int, default=50, help='Max videos per channel')
    parser.add_argument('--output', type=str, help='Output JSON file')
    parser.add_argument('--supabase', action='store_true', help='Save to Supabase')
    parser.add_argument('--educational-only', action='store_true', help='Filter educational content only')
    
    args = parser.parse_args()
    
    # Get API key
    api_key = args.api_key or os.environ.get('YOUTUBE_API_KEY')
    if not api_key and HAS_GOOGLE_API:
        print("Error: YouTube API key required. Use --api-key or YOUTUBE_API_KEY env var")
        sys.exit(1)
    
    print("Fetching YouTube videos...")
    videos = fetch_youtube_videos(api_key, args.channels, args.max_results)
    
    # Filter educational content if requested
    if args.educational_only:
        videos = [v for v in videos if v.get('is_educational', False)]
    
    print(f"Found {len(videos)} videos")
    
    # Save to file if output specified
    if args.output:
        with open(args.output, 'w', encoding='utf-8') as f:
            json.dump(videos, f, ensure_ascii=False, indent=2)
        print(f"Saved to {args.output}")
    
    # Save to Supabase if requested
    if args.supabase:
        supabase_url = os.environ.get('SUPABASE_URL')
        supabase_key = os.environ.get('SUPABASE_KEY')
        
        if not supabase_url or not supabase_key:
            print("Error: SUPABASE_URL and SUPABASE_KEY environment variables required")
            sys.exit(1)
        
        save_to_supabase(videos, supabase_url, supabase_key)
    
    # Print summary
    print(f"\nScraped {len(videos)} videos")
    for video in videos[:5]:
        edu_marker = " [EDU]" if video.get('is_educational') else ""
        print(f"  - {video['title'][:60]}...{edu_marker}")


if __name__ == '__main__':
    main()
