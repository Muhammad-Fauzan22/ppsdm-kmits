import requests
from bs4 import BeautifulSoup
import json
import os
import logging
from datetime import datetime

# Setup Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

TARGET_URL = "https://www.its.ac.id/news/"
OUTPUT_FILE = "public/data/its_news.json"

def scrape_its_news():
    logging.info(f"Starting scrape of {TARGET_URL}")
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    try:
        response = requests.get(TARGET_URL, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Adjust selectors based on actual ITS News HTML structure
        # Use generic article selectors first, assuming WordPress structure common on university sites
        articles = soup.select('article')
        
        news_data = []
        
        for article in articles[:6]: # Limit to latest 6
            try:
                title_elem = article.select_one('h2.entry-title a') or article.select_one('h3 a')
                date_elem = article.select_one('time.entry-date') or article.select_one('.date')
                img_elem = article.select_one('img')
                excerpt_elem = article.select_one('.entry-content p') or article.select_one('.post-summary')
                
                if not title_elem:
                    continue

                title = title_elem.get_text(strip=True)
                link = title_elem['href']
                date = date_elem.get_text(strip=True) if date_elem else datetime.now().strftime("%Y-%m-%d")
                image = img_elem['src'] if img_elem else None
                excerpt = excerpt_elem.get_text(strip=True) if excerpt_elem else ""

                news_data.append({
                    "title": title,
                    "link": link,
                    "date": date,
                    "image": image,
                    "excerpt": excerpt,
                    "source": "ITS News"
                })
            except Exception as e:
                logging.warning(f"Error parsing article: {e}")
                continue

        logging.info(f"Scraped {len(news_data)} items.")
        
        # Ensure output directory exists
        os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
        
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            json.dump(news_data, f, indent=2, ensure_ascii=False)
            
        logging.info(f"Saved data to {OUTPUT_FILE}")
        return news_data

    except Exception as e:
        logging.error(f"Scraping failed: {e}")
        return []

if __name__ == "__main__":
    scrape_its_news()
