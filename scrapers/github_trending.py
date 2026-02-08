#!/usr/bin/env python3
"""
GitHub Trending Scraper - Mengambil repository trending untuk referensi teknologi
"""

import argparse
import json
import os
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


# Programming languages relevant to ITS students
RELEVANT_LANGUAGES = [
    'python', 'javascript', 'typescript', 'java', 'cpp', 'c', 'go', 'rust',
    'html', 'css', 'php', 'kotlin', 'swift', 'dart', 'r', 'matlab'
]

# Topics relevant to engineering and technology
RELEVANT_TOPICS = [
    'machine-learning', 'artificial-intelligence', 'data-science', 'web-development',
    'mobile-development', 'iot', 'robotics', 'computer-vision', 'nlp',
    'engineering', 'education', 'learning', 'tutorial', 'documentation'
]


def fetch_github_trending(
    language: str = None,
    since: str = 'daily',
    spoken_language: str = None
) -> List[Dict]:
    """Fetch trending repositories from GitHub"""
    if not HAS_DEPS:
        # Return mock data if dependencies not available
        return [
            {
                "name": "its-surabaya/awesome-engineering",
                "full_name": "its-surabaya/awesome-engineering",
                "url": "https://github.com/its-surabaya/awesome-engineering",
                "description": "Kumpulan resource engineering untuk mahasiswa ITS",
                "language": "Python",
                "stars": 1500,
                "stars_today": 45,
                "forks": 200,
                "topics": ["education", "engineering", "tutorial"],
                "source": "GitHub Trending",
                "scraped_at": datetime.now().isoformat()
            }
        ]
    
    repos = []
    
    try:
        # GitHub trending page URL
        url = "https://github.com/trending"
        if language:
            url += f"/{language}"
        url += f"?since={since}"
        if spoken_language:
            url += f"&spoken_language_code={spoken_language}"
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Parse repository articles
        articles = soup.find_all('article', class_='Box-row')
        
        for article in articles:
            try:
                # Extract repository name
                h2 = article.find('h2', class_='h3')
                if not h2:
                    continue
                
                a_tag = h2.find('a')
                if not a_tag:
                    continue
                
                full_name = a_tag.get_text(strip=True).replace(' ', '').replace('\n', '')
                repo_url = f"https://github.com{a_tag['href']}"
                
                # Extract description
                p_tag = article.find('p', class_='col-9')
                description = p_tag.get_text(strip=True) if p_tag else "No description"
                
                # Extract programming language
                lang_span = article.find('span', itemprop='programmingLanguage')
                language = lang_span.get_text(strip=True) if lang_span else "Unknown"
                
                # Extract stars and forks
                link_tags = article.find_all('a', class_='Link--muted')
                stars = 0
                forks = 0
                
                for link in link_tags:
                    text = link.get_text(strip=True)
                    if 'star' in link.get('href', ''):
                        stars = int(text.replace(',', '')) if text.replace(',', '').isdigit() else 0
                    elif 'fork' in link.get('href', ''):
                        forks = int(text.replace(',', '')) if text.replace(',', '').isdigit() else 0
                
                # Extract today's stars
                today_span = article.find('span', class_='d-inline-block float-sm-right')
                stars_today = 0
                if today_span:
                    today_text = today_span.get_text(strip=True)
                    # Parse "123 stars today"
                    import re
                    match = re.search(r'(\d+)', today_text)
                    if match:
                        stars_today = int(match.group(1))
                
                # Extract topics
                topic_links = article.find_all('a', class_='topic-tag')
                topics = [t.get_text(strip=True) for t in topic_links]
                
                repos.append({
                    "name": full_name.split('/')[-1],
                    "full_name": full_name,
                    "url": repo_url,
                    "description": description[:500],
                    "language": language,
                    "stars": stars,
                    "stars_today": stars_today,
                    "forks": forks,
                    "topics": topics,
                    "source": "GitHub Trending",
                    "scraped_at": datetime.now().isoformat()
                })
                
            except Exception as e:
                print(f"Error parsing repository: {e}")
                continue
                
    except Exception as e:
        print(f"Error fetching GitHub trending: {e}")
    
    return repos


def fetch_multiple_languages(languages: List[str] = None, since: str = 'daily') -> List[Dict]:
    """Fetch trending repos for multiple languages"""
    if not languages:
        languages = ['python', 'javascript', 'typescript', 'java']
    
    all_repos = []
    for lang in languages:
        print(f"Fetching trending {lang} repositories...")
        repos = fetch_github_trending(language=lang, since=since)
        all_repos.extend(repos)
    
    # Remove duplicates based on full_name
    seen = set()
    unique_repos = []
    for repo in all_repos:
        if repo['full_name'] not in seen:
            seen.add(repo['full_name'])
            unique_repos.append(repo)
    
    return unique_repos


def save_to_supabase(repos: List[Dict], supabase_url: str, supabase_key: str):
    """Save repositories to Supabase"""
    if not HAS_SUPABASE:
        print("Supabase not available, skipping database save")
        return False
    
    try:
        supabase = create_client(supabase_url, supabase_key)
        
        for repo in repos:
            # Check if repo already exists
            existing = supabase.table('scraped_content')\
                .select('id')\
                .eq('url', repo['url'])\
                .execute()
            
            if existing.data:
                print(f"Skipping existing repo: {repo['name'][:50]}...")
                continue
            
            # Insert new repo
            data = {
                'title': repo['name'],
                'url': repo['url'],
                'content': repo['description'],
                'source': repo['source'],
                'content_type': 'repository',
                'published_at': repo['scraped_at'],  # GitHub doesn't have published date
                'metadata': {
                    'full_name': repo['full_name'],
                    'language': repo['language'],
                    'stars': repo['stars'],
                    'stars_today': repo['stars_today'],
                    'forks': repo['forks'],
                    'topics': repo['topics'],
                    'scraped_at': repo['scraped_at']
                }
            }
            
            result = supabase.table('scraped_content').insert(data).execute()
            print(f"Saved: {repo['name'][:50]}...")
        
        return True
        
    except Exception as e:
        print(f"Error saving to Supabase: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(description='GitHub Trending Scraper')
    parser.add_argument('--language', type=str, help='Programming language filter')
    parser.add_argument('--languages', type=str, nargs='+', help='Multiple programming languages')
    parser.add_argument('--since', type=str, default='daily', choices=['daily', 'weekly', 'monthly'],
                        help='Time period')
    parser.add_argument('--output', type=str, help='Output JSON file')
    parser.add_argument('--supabase', action='store_true', help='Save to Supabase')
    parser.add_argument('--relevant-only', action='store_true', 
                        help='Filter only relevant languages for ITS students')
    
    args = parser.parse_args()
    
    # Determine which languages to fetch
    if args.relevant_only:
        languages = RELEVANT_LANGUAGES[:8]  # Top 8 relevant languages
    elif args.languages:
        languages = args.languages
    elif args.language:
        languages = [args.language]
    else:
        languages = ['python', 'javascript', 'typescript', 'java']
    
    print(f"Fetching GitHub trending repositories...")
    if len(languages) == 1:
        repos = fetch_github_trending(languages[0], args.since)
    else:
        repos = fetch_multiple_languages(languages, args.since)
    
    print(f"Found {len(repos)} repositories")
    
    # Save to file if output specified
    if args.output:
        with open(args.output, 'w', encoding='utf-8') as f:
            json.dump(repos, f, ensure_ascii=False, indent=2)
        print(f"Saved to {args.output}")
    
    # Save to Supabase if requested
    if args.supabase:
        supabase_url = os.environ.get('SUPABASE_URL')
        supabase_key = os.environ.get('SUPABASE_KEY')
        
        if not supabase_url or not supabase_key:
            print("Error: SUPABASE_URL and SUPABASE_KEY environment variables required")
            sys.exit(1)
        
        save_to_supabase(repos, supabase_url, supabase_key)
    
    # Print summary - use ASCII only to avoid Unicode encoding issues on Windows
    print(f"\nScraped {len(repos)} repositories")
    for repo in repos[:10]:
        # Use ASCII star character instead of Unicode
        print(f"  - {repo['full_name']} ({repo['language']}) * {repo['stars']}")


if __name__ == '__main__':
    main()
