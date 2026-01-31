import requests
import logging
from datetime import datetime

class YouTubeAggregator:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        # Fallback to RSS if no API key, or use public search scraping (carefully)
        # Using RSS feeds for channels is the most reliable free method without API Limits
        self.channels = [
            {'name': 'Web Programming UNPAS', 'id': 'UCkXmLjEr95LVtGuIm3l2dPg'},
            {'name': 'Programmer Zaman Now', 'id': 'UCjBujc8F0CuZqOAq8yG4ctA'},
            {'name': 'Dea Afrizal', 'id': 'UC1A8rM9Oa8M8wDQrR_cZqYg'}
        ]
    
    def scrape_videos(self):
        """Scrape latest videos via RSS feeds"""
        self.logger.info("Scraping YouTube Channels...")
        videos = []
        
        for channel in self.channels:
            rss_url = f"https://www.youtube.com/feeds/videos.xml?channel_id={channel['id']}"
            try:
                response = requests.get(rss_url, timeout=10)
                if response.status_code == 200:
                    # Simple XML parsing
                    from xml.etree import ElementTree
                    root = ElementTree.fromstring(response.content)
                    ns = {'yt': 'http://www.youtube.com/xml/schemas/2015', 'media': 'http://search.yahoo.com/mrss/', 'atom': 'http://www.w3.org/2005/Atom'}
                    
                    for entry in root.findall('{http://www.w3.org/2005/Atom}entry')[:3]:
                        vid = {
                            'title': entry.find('{http://www.w3.org/2005/Atom}title').text,
                            'url': entry.find('{http://www.w3.org/2005/Atom}link').attrib['href'],
                            'channel': channel['name'],
                            'published_at': entry.find('{http://www.w3.org/2005/Atom}published').text,
                            'source': 'YouTube',
                            'scraped_at': datetime.now().isoformat()
                        }
                        # Try to find thumbnail
                        group = entry.find('{http://search.yahoo.com/mrss/}group')
                        if group:
                            thumb = group.find('{http://search.yahoo.com/mrss/}thumbnail')
                            if thumb is not None:
                                vid['thumbnail'] = thumb.attrib['url']
                        
                        videos.append(vid)
            except Exception as e:
                self.logger.error(f"Error scraping data for {channel['name']}: {e}")
                
        return videos

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    yt = YouTubeAggregator()
    print(yt.scrape_videos())
