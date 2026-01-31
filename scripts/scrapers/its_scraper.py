import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime
import time
import random
import logging

class ITSScraper:
    def __init__(self):
        self.base_url = "https://www.its.ac.id"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        self.logger = logging.getLogger(__name__)

    def scrape_its_news(self):
        """Scrape news from ITS website"""
        self.logger.info("Scraping ITS News...")
        try:
            response = requests.get(
                f"{self.base_url}/news/",
                headers=self.headers,
                timeout=15
            )
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            
            news_items = []
            # Adjust selectors based on actual website structure
            # ITS typically uses WordPress
            articles = soup.select('article')
            
            for article in articles[:10]:  # Limit to 10 articles
                try:
                    title_elem = article.select_one('h2.entry-title a') or article.select_one('h3 a')
                    if not title_elem:
                        continue
                        
                    title = title_elem.text.strip()
                    url = title_elem['href']
                    
                    # Extract date
                    date_elem = article.select_one('time.entry-date') or article.select_one('.date')
                    publish_date = date_elem.get_text(strip=True) if date_elem else datetime.now().strftime('%Y-%m-%d')
                    
                    # Extract excerpt/content
                    content_elem = article.select_one('.entry-content') or article.select_one('.post-summary')
                    content = content_elem.get_text(strip=True) if content_elem else ""

                    # Extract Image
                    img_elem = article.select_one('img')
                    image_url = img_elem['src'] if img_elem else None
                    
                    news_item = {
                        'title': title,
                        'content': content,
                        'url': url,
                        'image_url': image_url,
                        'category': 'Campus News',
                        'publish_date': publish_date,
                        'source': 'ITS Official',
                        'scraped_at': datetime.now().isoformat()
                    }
                    
                    news_items.append(news_item)
                except Exception as e:
                    self.logger.warning(f"Error parsing article item: {e}")
                    continue
            
            return news_items
            
        except Exception as e:
            self.logger.error(f"Error scraping ITS news: {e}")
            return []

    def scrape_scholarships(self):
        """Scrape scholarship information from Beasiswa.co.id (Example source)"""
        self.logger.info("Scraping Scholarships...")
        url = "https://beasiswa.co.id/category/beasiswa/"
        try:
            response = requests.get(url, headers=self.headers, timeout=15)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            scholarships = []
            articles = soup.select('article')
            
            for article in articles[:8]:
                try:
                    title_elem = article.select_one('h2.entry-title a')
                    if not title_elem:
                        continue

                    title = title_elem.text.strip()
                    link = title_elem['href']
                    
                    date_elem = article.select_one('time.entry-date')
                    date = date_elem.get_text(strip=True) if date_elem else ""
                    
                    scholarship = {
                        'title': title,
                        'provider': 'External',
                        'deadline': 'See details', # Often hard to scrape without parsing full page
                        'url': link,
                        'category': 'Beasiswa',
                        'publish_date': date,
                        'source': 'Beasiswa.co.id',
                        'scraped_at': datetime.now().isoformat()
                    }
                    scholarships.append(scholarship)
                except Exception as e:
                    self.logger.warning(f"Error parsing scholarship item: {e}")
                    continue
            
            return scholarships
        except Exception as e:
            self.logger.error(f"Error scraping scholarships: {e}")
            return []

if __name__ == "__main__":
    # Test run
    logging.basicConfig(level=logging.INFO)
    scraper = ITSScraper()
    print(json.dumps(scraper.scrape_its_news(), indent=2))
