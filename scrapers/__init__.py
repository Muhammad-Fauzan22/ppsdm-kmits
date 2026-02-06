"""
PPSDM KMITS Scraper Package

Package untuk mengumpulkan konten edukatif dan informasi
dari berbagai sumber secara otomatis dan legal.

Modules:
    - its_news_scraper: Scraping berita dari ITS
    - youtube_aggregator: Aggregasi video edukatif
    - github_trending: Repository trending GitHub
    - event_aggregator: Aggregasi event kampus

Usage:
    from scrapers import ITSNewsScraper, YouTubeAggregator
    
    scraper = ITSNewsScraper()
    news = scraper.scrape()
"""

from .its_news_scraper import ITSNewsScraper
from .youtube_aggregator import YouTubeAggregator
from .github_trending import GitHubTrendingScraper
from .event_aggregator import EventAggregator

__version__ = "1.0.0"
__author__ = "PPSDM KMITS Development Team"

__all__ = [
    "ITSNewsScraper",
    "YouTubeAggregator", 
    "GitHubTrendingScraper",
    "EventAggregator"
]
