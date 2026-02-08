"""
YouTube Harvester v2.0 - Infinite Learning Factory
===================================================
Fixed version with REAL transcript extraction using youtube-transcript-api.
Includes rate limiting, retry mechanisms, and proper error handling.
"""

import os
import sys
import asyncio
import logging
import hashlib
from datetime import datetime
from typing import List, Dict, Optional, Any
from dataclasses import dataclass

# Add parent directory for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
from supabase import create_client, Client

# Import our utilities
try:
    from utils.rate_limiter import rate_limiter, wait_for_youtube
    from utils.retry_handler import retry, RetryConfig
    from utils.monitoring import error_monitor, monitor_errors
    from utils.sanitizer import sanitize_text, ContentSanitizer
except ImportError:
    # Fallback for direct execution
    import time
    def wait_for_youtube():
        time.sleep(2)
    def retry(*args, **kwargs):
        def decorator(func):
            return func
        return decorator
    def monitor_errors(*args, **kwargs):
        def decorator(func):
            return func
        return decorator
    class ContentSanitizer:
        def process(self, text):
            return text

# YouTube Transcript API
try:
    from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound
    TRANSCRIPT_API_AVAILABLE = True
except ImportError:
    TRANSCRIPT_API_AVAILABLE = False
    print("⚠️ youtube-transcript-api not installed. Install with: pip install youtube-transcript-api")

# yt-dlp for metadata (optional, as fallback)
try:
    import yt_dlp
    YTDLP_AVAILABLE = True
except ImportError:
    YTDLP_AVAILABLE = False

load_dotenv('.env.local')
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@dataclass
class VideoData:
    """Structured video data."""
    video_id: str
    title: str
    description: str
    channel_title: str
    channel_id: str
    published_at: str
    duration: Optional[int]
    view_count: Optional[int]
    transcript: Optional[str]
    transcript_language: Optional[str]
    thumbnail_url: Optional[str]
    tags: List[str]


# Educational YouTube channels focused on Indonesian students
EDUCATIONAL_CHANNELS = [
    # Indonesian Educational Channels
    {"id": "UCkEFKo_YvN9E_wTf7rQN2-g", "name": "Ruangguru", "dimension": "cognitive"},
    {"id": "UCnMGQ8QR6kKFnymBT_a3N5g", "name": "Zenius Education", "dimension": "cognitive"},
    {"id": "UCh4Oq7LPQD6mG2OXLqvSS5g", "name": "Quipper Indonesia", "dimension": "cognitive"},
    {"id": "UCuxvOJQIcJN2BEZhqzQNIvw", "name": "Satu Persen", "dimension": "mental_health"},
    {"id": "UC55GR5KlxA4hbGK7J9m9PKA", "name": "Kok Bisa?", "dimension": "cognitive"},
    
    # Self Development
    {"id": "UCNczUNL6GjBEeX9NwpK6rsQ", "name": "Merry Riana", "dimension": "self_management"},
    {"id": "UCHCph4o5L1zeRGHGaKdGWyw", "name": "Dedy Corbuzier", "dimension": "character"},
    
    # Financial Literacy
    {"id": "UC5XQvQU4PpHkGxIULBBbDHg", "name": "Felicia Putri Tjiasaka", "dimension": "financial"},
    {"id": "UCqE2a5rWvUu0SqMWryJ-jXQ", "name": "Raditya Dika", "dimension": "self_management"},
    
    # Health & Wellness
    {"id": "UCchA1L3T3bvgLq8gZ6Y7g9Q", "name": "dr. Tirta", "dimension": "physical"},
    
    # International Educational (with Indonesian subtitles often available)
    {"id": "UCsooa4yRKGN_zEE8iknghZA", "name": "TED-Ed", "dimension": "cognitive"},
    {"id": "UCX6b17PVsYBQ0ip5gyeme-Q", "name": "CrashCourse", "dimension": "cognitive"},
    {"id": "UCsXVk37bltHxD1rDPwtNM8Q", "name": "Kurzgesagt", "dimension": "cognitive"},
    {"id": "UCWOA1ZGywLbqmigxE4Qlvuw", "name": "Psychology Today", "dimension": "mental_health"},
]


class YouTubeHarvester:
    """
    YouTube content harvester with real transcript extraction.
    """
    
    def __init__(self):
        self.supabase: Client = create_client(
            os.environ.get('NEXT_PUBLIC_SUPABASE_URL', ''),
            os.environ.get('SUPABASE_SERVICE_ROLE_KEY', '')
        )
        self.sanitizer = ContentSanitizer()
        self.stats = {
            'videos_processed': 0,
            'transcripts_extracted': 0,
            'errors': 0,
            'saved': 0
        }
        
        # yt-dlp options for metadata extraction
        self.ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'extract_flat': False,
            'skip_download': True,
            'ignoreerrors': True,
            'no_color': True,
        }
    
    def _get_video_id_from_url(self, url: str) -> Optional[str]:
        """Extract video ID from various YouTube URL formats."""
        import re
        patterns = [
            r'(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})',
            r'youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})',
        ]
        for pattern in patterns:
            match = re.search(pattern, url)
            if match:
                return match.group(1)
        return None
    
    @retry(config=RetryConfig(max_retries=3, initial_delay=2.0))
    def _extract_transcript(self, video_id: str) -> tuple[Optional[str], Optional[str]]:
        """
        Extract transcript from YouTube video.
        
        Returns:
            Tuple of (transcript_text, language_code)
        """
        if not TRANSCRIPT_API_AVAILABLE:
            return None, None
        
        try:
            # Try to get Indonesian transcript first
            transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
            
            # Priority: Manual Indonesian > Manual English > Auto Indonesian > Auto English
            transcript = None
            lang = None
            
            try:
                # Try manual Indonesian first
                transcript = transcript_list.find_manually_created_transcript(['id', 'id-ID'])
                lang = 'id'
            except NoTranscriptFound:
                try:
                    # Try manual English
                    transcript = transcript_list.find_manually_created_transcript(['en', 'en-US', 'en-GB'])
                    lang = 'en'
                except NoTranscriptFound:
                    try:
                        # Try auto-generated Indonesian
                        transcript = transcript_list.find_generated_transcript(['id', 'id-ID'])
                        lang = 'id-auto'
                    except NoTranscriptFound:
                        try:
                            # Try auto-generated English
                            transcript = transcript_list.find_generated_transcript(['en', 'en-US'])
                            lang = 'en-auto'
                        except NoTranscriptFound:
                            return None, None
            
            if transcript:
                # Fetch and format transcript
                transcript_data = transcript.fetch()
                full_text = ' '.join([entry['text'] for entry in transcript_data])
                return full_text, lang
            
            return None, None
            
        except TranscriptsDisabled:
            logger.debug(f"Transcripts disabled for video {video_id}")
            return None, None
        except Exception as e:
            logger.warning(f"Transcript extraction failed for {video_id}: {e}")
            return None, None
    
    @retry(config=RetryConfig(max_retries=2, initial_delay=3.0))
    def _extract_metadata_ytdlp(self, video_url: str) -> Optional[Dict]:
        """Extract video metadata using yt-dlp."""
        if not YTDLP_AVAILABLE:
            return None
        
        try:
            with yt_dlp.YoutubeDL(self.ydl_opts) as ydl:
                info = ydl.extract_info(video_url, download=False)
                if info:
                    return {
                        'id': info.get('id'),
                        'title': info.get('title', ''),
                        'description': info.get('description', ''),
                        'channel': info.get('uploader', ''),
                        'channel_id': info.get('channel_id', ''),
                        'upload_date': info.get('upload_date', ''),
                        'duration': info.get('duration'),
                        'view_count': info.get('view_count'),
                        'thumbnail': info.get('thumbnail'),
                        'tags': info.get('tags', []),
                    }
        except Exception as e:
            logger.warning(f"yt-dlp extraction failed: {e}")
        
        return None
    
    @retry(config=RetryConfig(max_retries=2, initial_delay=2.0))
    def _get_channel_videos_ytdlp(self, channel_id: str, max_videos: int = 10) -> List[str]:
        """Get recent video URLs from a channel using yt-dlp."""
        if not YTDLP_AVAILABLE:
            return []
        
        try:
            channel_url = f"https://www.youtube.com/channel/{channel_id}/videos"
            
            opts = {
                **self.ydl_opts,
                'extract_flat': True,
                'playlistend': max_videos,
            }
            
            with yt_dlp.YoutubeDL(opts) as ydl:
                result = ydl.extract_info(channel_url, download=False)
                if result and 'entries' in result:
                    videos = []
                    for entry in result['entries'][:max_videos]:
                        if entry and entry.get('id'):
                            videos.append(f"https://www.youtube.com/watch?v={entry['id']}")
                    return videos
        except Exception as e:
            logger.warning(f"Failed to get channel videos: {e}")
        
        return []
    
    def _generate_content_hash(self, video_id: str) -> str:
        """Generate unique content hash."""
        return hashlib.md5(f"youtube_{video_id}".encode()).hexdigest()
    
    def _check_duplicate(self, video_id: str) -> bool:
        """Check if video already exists in database."""
        try:
            result = self.supabase.table('raw_materials').select('id').eq(
                'external_id', f"youtube_{video_id}"
            ).execute()
            return len(result.data) > 0
        except:
            return False
    
    @monitor_errors('youtube_harvester')
    def harvest_video(self, video_id: str, channel_info: Dict) -> bool:
        """
        Harvest a single video with transcript.
        
        Args:
            video_id: YouTube video ID
            channel_info: Channel metadata including dimension
        
        Returns:
            True if successfully harvested
        """
        wait_for_youtube()  # Rate limiting
        
        # Check for duplicates
        if self._check_duplicate(video_id):
            logger.debug(f"Video {video_id} already exists, skipping")
            return False
        
        self.stats['videos_processed'] += 1
        
        # Get video metadata
        video_url = f"https://www.youtube.com/watch?v={video_id}"
        metadata = self._extract_metadata_ytdlp(video_url)
        
        if not metadata:
            logger.warning(f"Could not extract metadata for {video_id}")
            self.stats['errors'] += 1
            return False
        
        # Extract transcript (THE KEY FIX!)
        transcript, transcript_lang = self._extract_transcript(video_id)
        
        if transcript:
            self.stats['transcripts_extracted'] += 1
            logger.info(f"✅ Transcript extracted ({transcript_lang}): {metadata.get('title', '')[:50]}...")
        else:
            logger.debug(f"No transcript available for {video_id}")
        
        # Prepare content - combine description and transcript
        content_parts = []
        if metadata.get('description'):
            content_parts.append(f"DESCRIPTION:\n{metadata['description']}")
        if transcript:
            content_parts.append(f"\nTRANSCRIPT:\n{transcript}")
        
        full_content = '\n\n'.join(content_parts)
        
        # Sanitize content
        sanitized_content = self.sanitizer.process(full_content)
        if not sanitized_content or len(sanitized_content) < 50:
            logger.debug(f"Content too short for {video_id}")
            return False
        
        # Parse upload date
        upload_date = metadata.get('upload_date', '')
        published_at = None
        if upload_date and len(upload_date) == 8:
            try:
                published_at = datetime.strptime(upload_date, '%Y%m%d').isoformat()
            except:
                pass
        
        # Prepare record for database
        record = {
            'source_id': self._get_or_create_source(channel_info),
            'external_id': f"youtube_{video_id}",
            'title': metadata.get('title', 'Untitled')[:500],
            'content': sanitized_content,
            'url': video_url,
            'published_at': published_at,
            'language': transcript_lang if transcript_lang else 'id',
            'detected_dimension': channel_info.get('dimension', 'cognitive'),
            'content_hash': self._generate_content_hash(video_id),
            'metadata': {
                'channel_id': metadata.get('channel_id'),
                'channel_name': metadata.get('channel'),
                'duration_seconds': metadata.get('duration'),
                'view_count': metadata.get('view_count'),
                'has_transcript': bool(transcript),
                'transcript_language': transcript_lang,
                'tags': metadata.get('tags', [])[:10],
                'thumbnail': metadata.get('thumbnail'),
            }
        }
        
        # Save to database
        try:
            self.supabase.table('raw_materials').insert(record).execute()
            self.stats['saved'] += 1
            return True
        except Exception as e:
            logger.error(f"Failed to save video {video_id}: {e}")
            self.stats['errors'] += 1
            return False
    
    def _get_or_create_source(self, channel_info: Dict) -> str:
        """Get or create content source for channel."""
        try:
            # Check if source exists
            result = self.supabase.table('content_sources').select('id').eq(
                'url', f"https://www.youtube.com/channel/{channel_info['id']}"
            ).execute()
            
            if result.data:
                return result.data[0]['id']
            
            # Create new source
            new_source = {
                'name': f"YouTube: {channel_info['name']}",
                'source_type': 'youtube',
                'url': f"https://www.youtube.com/channel/{channel_info['id']}",
                'primary_dimension': channel_info.get('dimension', 'cognitive'),
                'is_active': True,
                'fetch_frequency_hours': 12,
            }
            
            result = self.supabase.table('content_sources').insert(new_source).execute()
            return result.data[0]['id']
            
        except Exception as e:
            logger.error(f"Failed to get/create source: {e}")
            return None
    
    def harvest_channel(self, channel_info: Dict, max_videos: int = 10) -> int:
        """
        Harvest videos from a single channel.
        
        Returns:
            Number of videos successfully harvested
        """
        logger.info(f"📺 Harvesting channel: {channel_info['name']}")
        
        # Get recent videos
        video_urls = self._get_channel_videos_ytdlp(channel_info['id'], max_videos)
        
        if not video_urls:
            logger.warning(f"No videos found for channel {channel_info['name']}")
            return 0
        
        harvested = 0
        for url in video_urls:
            video_id = self._get_video_id_from_url(url)
            if video_id:
                if self.harvest_video(video_id, channel_info):
                    harvested += 1
        
        return harvested
    
    def run(self, max_videos_per_channel: int = 5) -> Dict:
        """
        Run the YouTube harvester for all configured channels.
        
        Returns:
            Harvesting statistics
        """
        logger.info("=" * 60)
        logger.info("🎬 YOUTUBE HARVESTER v2.0 - With Real Transcripts")
        logger.info("=" * 60)
        
        if not TRANSCRIPT_API_AVAILABLE:
            logger.error("youtube-transcript-api not available!")
            logger.error("Install: pip install youtube-transcript-api")
            return self.stats
        
        if not YTDLP_AVAILABLE:
            logger.error("yt-dlp not available!")
            logger.error("Install: pip install yt-dlp")
            return self.stats
        
        total_harvested = 0
        
        for channel in EDUCATIONAL_CHANNELS:
            try:
                harvested = self.harvest_channel(channel, max_videos_per_channel)
                total_harvested += harvested
                logger.info(f"  ✓ {channel['name']}: {harvested} videos")
            except Exception as e:
                logger.error(f"  ✗ {channel['name']}: {e}")
                self.stats['errors'] += 1
        
        # Summary
        logger.info("=" * 60)
        logger.info("📊 HARVEST SUMMARY")
        logger.info(f"  Videos Processed: {self.stats['videos_processed']}")
        logger.info(f"  Transcripts Extracted: {self.stats['transcripts_extracted']}")
        logger.info(f"  Successfully Saved: {self.stats['saved']}")
        logger.info(f"  Errors: {self.stats['errors']}")
        logger.info("=" * 60)
        
        return self.stats


def main():
    """Main entry point."""
    try:
        harvester = YouTubeHarvester()
        
        # Parse arguments
        max_videos = int(os.environ.get('YOUTUBE_MAX_VIDEOS', '5'))
        
        stats = harvester.run(max_videos_per_channel=max_videos)
        
        # Exit with error code if too many failures
        if stats['errors'] > stats['saved']:
            sys.exit(1)
        
    except Exception as e:
        logger.exception(f"YouTube harvester failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
