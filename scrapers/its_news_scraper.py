#!/usr/bin/env python3
"""
ITS News Scraper - Mengambil berita dari website ITS
"""

import argparse
import json
import sys
from datetime import datetime
from typing import List, Dict, Optional

# Try to import optional dependencies
try:
    import requests
    from bs4 import BeautifulSoup
    HAS_DEPS = True
except ImportError:
    HAS_DEPS = False
    print("Warning: requests and beautifulsoup4 not installed. Using mock data.")

try:
    from supabase import create_client
    HAS_SUPABASE = True
except ImportError:
    HAS_SUPABASE = False


def fetch_its_news(pages: int = 3) -> List[Dict]:
    """Fetch news from ITS website"""
    if not HAS_DEPS:
        # Return mock data if dependencies not available
        return [
            {
                "title": "ITS Raih Penghargaan Internasional",
                "url": "https://www.its.ac.id/news/2024/01/01/its-raih-penghargaan/",
                "date": datetime.now().isoformat(),
                "summary": "Institut Teknologi Sepuluh Nopember meraih penghargaan internasional...",
                "source": "ITS News"
            }
        ]
    
    news_items = []
    base_url = "https://www.its.ac.id/news/page/{}/"
    
    for page in range(1, pages + 1):
        try:
            url = base_url.format(page)
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Parse news items (adjust selectors based on actual ITS website structure)
            articles = soup.find_all('article', class_='post')
            
            for article in articles:
                try:
                    title_elem = article.find('h2', class_='entry-title')
                    title = title_elem.get_text(strip=True) if title_elem else "No title"
                    
                    link_elem = title_elem.find('a') if title_elem else None
                    link = link_elem['href'] if link_elem else ""
                    
                    date_elem = article.find('time')
                    date = date_elem['datetime'] if date_elem else datetime.now().isoformat()
                    
                    summary_elem = article.find('div', class_='entry-summary')
                    summary = summary_elem.get_text(strip=True)[:200] if summary_elem else ""
                    
                    news_items.append({
                        "title": title,
                        "url": link,
                        "date": date,
                        "summary": summary,
                        "source": "ITS News",
                        "scraped_at": datetime.now().isoformat()
                    })
                except Exception as e:
                    print(f"Error parsing article: {e}")
                    continue
                    
        except Exception as e:
            print(f"Error fetching page {page}: {e}")
            continue
    
    return news_items


def save_to_supabase(news_items: List[Dict], supabase_url: str, supabase_key: str):
    """Save news items to Supabase"""
    if not HAS_SUPABASE:
        print("Supabase not available, skipping database save")
        return False
    
    try:
        supabase = create_client(supabase_url, supabase_key)
        
        for item in news_items:
            # Check if article already exists
            existing = supabase.table('scraped_content')\
                .select('id')\
                .eq('url', item['url'])\
                .execute()
            
            if existing.data:
                print(f"Skipping existing article: {item['title'][:50]}...")
                continue
            
            # Insert new article
            data = {
                'title': item['title'],
                'url': item['url'],
                'content': item['summary'],
                'source': item['source'],
                'published_at': item['date'],
                'content_type': 'news',
                'metadata': {
                    'scraped_at': item['scraped_at'],
                    'original_url': item['url']
                }
            }
            
            result = supabase.table('scraped_content').insert(data).execute()
            print(f"Saved: {item['title'][:50]}...")
        
        return True
        
    except Exception as e:
        print(f"Error saving to Supabase: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(description='ITS News Scraper')
    parser.add_argument('--pages', type=int, default=3, help='Number of pages to scrape')
    parser.add_argument('--output', type=str, help='Output JSON file')
    parser.add_argument('--supabase', action='store_true', help='Save to Supabase')
    
    args = parser.parse_args()
    
    print(f"Fetching ITS news (pages: {args.pages})...")
    news_items = fetch_its_news(args.pages)
    print(f"Found {len(news_items)} news items")
    
    # Save to file if output specified
    if args.output:
        with open(args.output, 'w', encoding='utf-8') as f:
            json.dump(news_items, f, ensure_ascii=False, indent=2)
        print(f"Saved to {args.output}")
    
    # Save to Supabase if requested
    if args.supabase:
        supabase_url = os.environ.get('SUPABASE_URL')
        supabase_key = os.environ.get('SUPABASE_KEY')
        
        if not supabase_url or not supabase_key:
            print("Error: SUPABASE_URL and SUPABASE_KEY environment variables required")
            sys.exit(1)
        
        save_to_supabase(news_items, supabase_url, supabase_key)
    
    # Print summary
    print(f"\nScraped {len(news_items)} articles")
    for item in news_items[:5]:
        print(f"  - {item['title'][:60]}...")


if __name__ == '__main__':
    import os
    main()
