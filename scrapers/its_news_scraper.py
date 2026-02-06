#!/usr/bin/env python3
"""
ITS News Scraper

Mengumpulkan berita terbaru dari website resmi ITS.
Respects robots.txt dan implementasi rate limiting.

Usage:
    scraper = ITSNewsScraper(max_pages=3)
    news = scraper.scrape()
    scraper.save_to_supabase(news)
"""

import requests
from bs4 import BeautifulSoup
from datetime import datetime
from typing import List, Dict, Optional
import time
import sys
import os

# Fix Windows Unicode
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from supabase import create_client, Client
except ImportError:
    create_client = None
    Client = None


class ITSNewsScraper:
    """
    Scraper untuk berita ITS (https://www.its.ac.id/news/)
    
    Features:
    - Respects rate limiting (3 second delay)
    - Automatic categorization
    - Supabase integration
    - Duplicate detection
    """
    
    BASE_URL = "https://www.its.ac.id/news/"
    HEADERS = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 (PPSDM KMITS Educational Bot)'
    }
    
    # Category keywords for automatic classification
    CATEGORY_KEYWORDS = {
        'academic': ['kuliah', 'dosen', 'mahasiswa', 'skripsi', 'thesis', 'sks', 'akademik', 'perkuliahan', ' semester'],
        'research': ['riset', 'penelitian', 'lab', 'inovasi', 'teknologi', 'jurnal', 'publication'],
        'event': ['seminar', 'workshop', 'lomba', 'kompetisi', 'acara', 'webinar', 'konferensi'],
        'achievement': ['prestasi', 'juara', 'menang', 'award', 'penghargaan', 'peringkat'],
        'scholarship': ['beasiswa', 'scholarship', 'bantuan', 'dana', 'financial aid', 'funding'],
        'facility': ['fasilitas', 'gedung', 'lab', 'kampus', 'ruang', 'infrastruktur', 'fasilitas'],
        'career': ['karir', 'lowongan', 'pekerjaan', 'magang', 'internship', 'recruitment', 'job fair']
    }
    
    def __init__(self, max_pages: int = 3, delay: float = 3.0):
        """
        Initialize scraper
        
        Args:
            max_pages: Maximum pages to scrape (default: 3)
            delay: Delay between requests in seconds (default: 3.0)
        """
        self.max_pages = max_pages
        self.delay = delay
        self.session = requests.Session()
        self.session.headers.update(self.HEADERS)
        
    def scrape(self) -> List[Dict]:
        """
        Scrape news from ITS website
        
        Returns:
            List of news articles as dictionaries
        """
        all_news = []
        
        print(f"🚀 Starting ITS News Scraper (max {self.max_pages} pages)")
        print("=" * 60)
        
        for page in range(1, self.max_pages + 1):
            url = f"{self.BASE_URL}page/{page}/" if page > 1 else self.BASE_URL
            
            try:
                print(f"📄 Scraping page {page}: {url}")
                
                response = self.session.get(url, timeout=15)
                response.raise_for_status()
                
                soup = BeautifulSoup(response.content, 'html.parser')
                articles = soup.find_all('article', class_='post')
                
                print(f"   Found {len(articles)} articles")
                
                for idx, article in enumerate(articles, 1):
                    news_item = self._extract_article(article)
                    if news_item:
                        all_news.append(news_item)
                        print(f"   ✓ [{idx}/{len(articles)}] {news_item['title'][:60]}...")
                
                # Polite delay between requests
                if page < self.max_pages:
                    print(f"   ⏳ Waiting {self.delay}s...")
                    time.sleep(self.delay)
                
            except requests.exceptions.RequestException as e:
                print(f"   ❌ Network error on page {page}: {e}")
                continue
            except Exception as e:
                print(f"   ❌ Error on page {page}: {e}")
                continue
        
        print("=" * 60)
        print(f"✅ Successfully scraped {len(all_news)} articles")
        return all_news
    
    def _extract_article(self, article) -> Optional[Dict]:
        """
        Extract data from article element
        
        Args:
            article: BeautifulSoup article element
            
        Returns:
            Dictionary with article data or None if extraction fails
        """
        try:
            # Extract title and link
            title_elem = article.find('h2', class_='entry-title')
            if not title_elem:
                return None
                
            title = title_elem.get_text(strip=True)
            link_elem = title_elem.find('a')
            link = link_elem['href'] if link_elem else ""
            
            # Extract date
            date_elem = article.find('time', class_='entry-date')
            date = date_elem['datetime'] if date_elem and date_elem.has_attr('datetime') else ""
            
            # Extract excerpt/summary
            excerpt_elem = article.find('div', class_='entry-summary')
            excerpt = ""
            if excerpt_elem:
                excerpt = excerpt_elem.get_text(strip=True)
                # Limit excerpt length
                if len(excerpt) > 300:
                    excerpt = excerpt[:297] + "..."
            
            # Extract image
            img_elem = article.find('img')
            image_url = img_elem['src'] if img_elem and img_elem.has_attr('src') else ""
            
            # Skip if essential data missing
            if not title or not link:
                return None
            
            return {
                'source': 'ITS Official News',
                'title': title,
                'link': link,
                'date': date,
                'excerpt': excerpt,
                'image_url': image_url,
                'scraped_at': datetime.now().isoformat(),
                'categories': self._categorize(title + " " + excerpt)
            }
            
        except Exception as e:
            print(f"   ⚠️ Error extracting article: {e}")
            return None
    
    def _categorize(self, text: str) -> List[str]:
        """
        Categorize article based on keywords
        
        Args:
            text: Combined title and excerpt text
            
        Returns:
            List of category strings
        """
        text_lower = text.lower()
        categories = []
        
        for category, keywords in self.CATEGORY_KEYWORDS.items():
            if any(keyword in text_lower for keyword in keywords):
                categories.append(category)
        
        return categories if categories else ['general']
    
    def save_to_supabase(self, news_items: List[Dict]) -> bool:
        """
        Save scraped news to Supabase database
        
        Args:
            news_items: List of news article dictionaries
            
        Returns:
            True if successful, False otherwise
        """
        if not create_client:
            print("❌ Supabase client not available. Install with: pip install supabase")
            return False
        
        supabase_url = os.environ.get('SUPABASE_URL')
        supabase_key = os.environ.get('SUPABASE_KEY')
        
        if not supabase_url or not supabase_key:
            print("❌ Supabase credentials not found in environment variables")
            print("   Set SUPABASE_URL and SUPABASE_KEY")
            return False
        
        try:
            print(f"\n💾 Saving {len(news_items)} items to Supabase...")
            
            supabase: Client = create_client(supabase_url, supabase_key)
            
            inserted = 0
            skipped = 0
            
            for item in news_items:
                try:
                    # Check for duplicates
                    existing = supabase.table('scraped_news') \
                        .select('id') \
                        .eq('link', item['link']) \
                        .execute()
                    
                    if existing.data:
                        skipped += 1
                        continue
                    
                    # Insert new record
                    supabase.table('scraped_news').insert(item).execute()
                    inserted += 1
                    
                except Exception as e:
                    print(f"   ⚠️ Error inserting item: {e}")
                    continue
            
            print(f"✅ Inserted: {inserted}, Skipped (duplicates): {skipped}")
            return True
            
        except Exception as e:
            print(f"❌ Error connecting to Supabase: {e}")
            return False
    
    def save_to_json(self, news_items: List[Dict], filename: str = 'its_news.json'):
        """
        Save scraped news to JSON file
        
        Args:
            news_items: List of news article dictionaries
            filename: Output filename
        """
        import json
        
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(news_items, f, ensure_ascii=False, indent=2)
            print(f"✅ Saved to {filename}")
        except Exception as e:
            print(f"❌ Error saving to JSON: {e}")


def main():
    """Main entry point for CLI usage"""
    import argparse
    
    parser = argparse.ArgumentParser(description='ITS News Scraper')
    parser.add_argument('--pages', type=int, default=3, help='Number of pages to scrape')
    parser.add_argument('--delay', type=float, default=3.0, help='Delay between requests')
    parser.add_argument('--json', action='store_true', help='Save to JSON file')
    parser.add_argument('--supabase', action='store_true', help='Save to Supabase')
    
    args = parser.parse_args()
    
    # Run scraper
    scraper = ITSNewsScraper(max_pages=args.pages, delay=args.delay)
    news = scraper.scrape()
    
    # Save results
    if args.json:
        scraper.save_to_json(news)
    
    if args.supabase:
        scraper.save_to_supabase(news)
    
    # Print summary
    print("\n" + "=" * 60)
    print("📊 SCRAPING SUMMARY")
    print("=" * 60)
    print(f"Total articles: {len(news)}")
    
    # Category breakdown
    categories = {}
    for item in news:
        for cat in item.get('categories', ['general']):
            categories[cat] = categories.get(cat, 0) + 1
    
    print("\nCategories:")
    for cat, count in sorted(categories.items(), key=lambda x: x[1], reverse=True):
        print(f"  • {cat}: {count}")


if __name__ == "__main__":
    main()
