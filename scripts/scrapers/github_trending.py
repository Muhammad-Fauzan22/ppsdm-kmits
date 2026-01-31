import requests
from bs4 import BeautifulSoup
import logging
from datetime import datetime

class GitHubTrending:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.url = "https://github.com/trending"
    
    def scrape_trending(self, language='python'):
        """Scrape GitHub Trending page"""
        target_url = f"{self.url}/{language}?since=daily"
        self.logger.info(f"Scraping GitHub Trending ({language})...")
        
        try:
            response = requests.get(target_url, timeout=10)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            repos = []
            rows = soup.select('article.Box-row')
            
            for row in rows[:5]:
                try:
                    title_elem = row.select_one('h2 h3 a')
                    if not title_elem: continue
                    
                    name_raw = title_elem.get_text(strip=True)
                    # Name is usually "author / repo"
                    name = name_raw.replace(' ', '')
                    
                    link = "https://github.com" + title_elem['href']
                    
                    desc_elem = row.select_one('p.col-9')
                    description = desc_elem.get_text(strip=True) if desc_elem else "No description"
                    
                    # Stars
                    stars_elem = row.select_one('a[href$="/stargazers"]')
                    stars = stars_elem.get_text(strip=True) if stars_elem else "0"
                    
                    repos.append({
                        'name': name,
                        'url': link,
                        'description': description,
                        'stars': stars,
                        'language': language,
                        'scraped_at': datetime.now().isoformat()
                    })
                except Exception as e:
                    continue
            
            return repos
            
        except Exception as e:
            self.logger.error(f"Error scraping GitHub Trending: {e}")
            return []

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    gh = GitHubTrending()
    print(gh.scrape_trending('typescript'))
