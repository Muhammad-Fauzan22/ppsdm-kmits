import requests
from bs4 import BeautifulSoup
from datetime import datetime
import logging

class JobScraper:
    def __init__(self):
        self.headers = {
             'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        self.logger = logging.getLogger(__name__)
    
    def scrape_kalibrr(self, keyword="internship", location="Indonesia"):
        """Scrape Kalibrr for internships"""
        self.logger.info(f"Scraping Kalibrr for {keyword} in {location}...")
        # Note: Kalibrr structure is complex and often changes class names. 
        # This is a best-effort scraper based on common structures.
        url = f"https://www.kalibrr.com/home/te/{keyword}/{location}"
        
        try:
            response = requests.get(url, headers=self.headers, timeout=15)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            jobs = []
            # Looking for job card containers. 
            # Note: Classes like 'k-border-b' are typical Tailwind/utility classes which might be stable or not.
            # We'll try to find links that look like job posts.
            
            job_links = soup.select('a[href*="/job/"]')
            
            seen_urls = set()
            
            for link in job_links[:15]:
                try:
                    href = link['href']
                    full_url = f"https://www.kalibrr.com{href}" if href.startswith('/') else href
                    
                    if full_url in seen_urls:
                        continue
                    seen_urls.add(full_url)

                    # Try to find title within the link or parent
                    title = link.get_text(strip=True)
                    if not title:
                         title_elem = link.find(['h2', 'h3', 'div'])
                         title = title_elem.get_text(strip=True) if title_elem else "Unknown Title"

                    if len(title) < 5: continue # Skip likely icons/garbage

                    job = {
                        'title': title,
                        'company': 'See details', # Hard to extract reliably from listing view generic
                        'location': location,
                        'type': 'Internship',
                        'url': full_url,
                        'source': 'Kalibrr',
                        'scraped_at': datetime.now().isoformat()
                    }
                    jobs.append(job)
                except Exception as e:
                    continue
            
            return jobs
            
        except Exception as e:
            self.logger.error(f"Error scraping Kalibrr: {e}")
            return []

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    scraper = JobScraper()
    print(scraper.scrape_kalibrr())
