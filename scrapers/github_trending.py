#!/usr/bin/env python3
"""
GitHub Trending Scraper

Mengumpulkan repository trending dari GitHub berdasarkan
bahasa pemrograman dan periode waktu.

Usage:
    scraper = GitHubTrendingScraper()
    repos = scraper.fetch_trending(language='python', since='weekly')
    scraper.save_to_supabase(repos)
"""

import os
import sys
import requests
from datetime import datetime, timedelta
from typing import List, Dict, Optional

# Fix Windows Unicode
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

try:
    from supabase import create_client, Client
except ImportError:
    create_client = None
    Client = None


class GitHubTrendingScraper:
    """
    Scraper untuk repository trending GitHub
    
    Features:
    - Multi-language support
    - Multiple time periods (daily, weekly, monthly)
    - Supabase integration
    - Rate limit handling
    
    Languages:
        - Python, JavaScript, TypeScript
        - Java, Go, Rust
        - PHP, Ruby, C++
    """
    
    GITHUB_API = "https://api.github.com"
    
    # Programming languages to track
    LANGUAGES = [
        'python', 'javascript', 'typescript',
        'java', 'go', 'rust', 'php',
        'ruby', 'c++', 'c#', 'swift'
    ]
    
    def __init__(self):
        """Initialize with GitHub token if available"""
        self.token = os.environ.get('GITHUB_TOKEN')
        self.headers = {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'PPSDM-KMITS-Scraper/1.0'
        }
        
        if self.token:
            self.headers['Authorization'] = f'token {self.token}'
            print("✅ GitHub token configured")
        else:
            print("⚠️ No GitHub token - using unauthenticated requests (60/hour limit)")
    
    def fetch_trending(self, language: Optional[str] = None, 
                      since: str = 'weekly') -> List[Dict]:
        """
        Fetch trending repositories
        
        Args:
            language: Programming language filter (e.g., 'python')
            since: Time period ('daily', 'weekly', 'monthly')
            
        Returns:
            List of repository dictionaries
        """
        # Calculate date range
        date_map = {'daily': 1, 'weekly': 7, 'monthly': 30}
        days = date_map.get(since, 7)
        date_since = (datetime.now() - timedelta(days=days)).strftime('%Y-%m-%d')
        
        # Build query
        query = f"created:>{date_since}"
        if language:
            query += f" language:{language}"
        
        print(f"🔍 Searching: {query}")
        
        try:
            response = requests.get(
                f"{self.GITHUB_API}/search/repositories",
                params={
                    'q': query,
                    'sort': 'stars',
                    'order': 'desc',
                    'per_page': 10
                },
                headers=self.headers,
                timeout=15
            )
            response.raise_for_status()
            
            repos = []
            for item in response.json().get('items', []):
                repo_data = {
                    'platform': 'github',
                    'type': 'repository',
                    'name': item['name'],
                    'full_name': item['full_name'],
                    'description': item['description'] or '',
                    'url': item['html_url'],
                    'stars': item['stargazers_count'],
                    'forks': item['forks_count'],
                    'language': item['language'] or 'Unknown',
                    'topics': item.get('topics', [])[:5],  # Limit topics
                    'created_at': item['created_at'],
                    'scraped_at': datetime.now().isoformat(),
                    'trending_period': since
                }
                repos.append(repo_data)
            
            return repos
            
        except requests.exceptions.RequestException as e:
            print(f"❌ Network error: {e}")
            return []
        except Exception as e:
            print(f"❌ Error: {e}")
            return []
    
    def fetch_multi_language(self, since: str = 'weekly') -> Dict[str, List[Dict]]:
        """
        Fetch trending for multiple languages
        
        Args:
            since: Time period
            
        Returns:
            Dictionary with language as key
        """
        print(f"🐙 GitHub Trending Scraper - {since.upper()}")
        print("=" * 70)
        
        results = {}
        total_repos = 0
        
        for lang in self.LANGUAGES[:6]:  # Top 6 languages
            try:
                print(f"\n📦 {lang.title()}")
                repos = self.fetch_trending(language=lang, since=since)
                results[lang] = repos
                total_repos += len(repos)
                print(f"   ✓ Found {len(repos)} repositories")
            except Exception as e:
                print(f"   ❌ Error: {e}")
                results[lang] = []
        
        print("\n" + "=" * 70)
        print(f"✅ Total repositories: {total_repos}")
        
        return results
    
    def save_to_supabase(self, repos: List[Dict]) -> bool:
        """Save repositories to Supabase"""
        if not create_client:
            print("❌ Supabase client not available")
            return False
        
        supabase_url = os.environ.get('SUPABASE_URL')
        supabase_key = os.environ.get('SUPABASE_KEY')
        
        if not supabase_url or not supabase_key:
            print("❌ Supabase credentials not found")
            return False
        
        try:
            print(f"\n💾 Saving {len(repos)} repositories...")
            
            supabase: Client = create_client(supabase_url, supabase_key)
            
            inserted = 0
            skipped = 0
            
            for repo in repos:
                try:
                    # Check for duplicates
                    existing = supabase.table('scraped_repos') \
                        .select('id') \
                        .eq('full_name', repo['full_name']) \
                        .eq('trending_period', repo['trending_period']) \
                        .execute()
                    
                    if existing.data:
                        skipped += 1
                        continue
                    
                    # Insert new record
                    supabase.table('scraped_repos').insert(repo).execute()
                    inserted += 1
                    
                except Exception as e:
                    print(f"   ⚠️ Error: {e}")
                    continue
            
            print(f"✅ Inserted: {inserted}, Skipped: {skipped}")
            return True
            
        except Exception as e:
            print(f"❌ Error: {e}")
            return False
    
    def save_multi_to_supabase(self, results: Dict[str, List[Dict]]) -> bool:
        """Save multi-language results to Supabase"""
        all_repos = []
        for lang, repos in results.items():
            all_repos.extend(repos)
        
        return self.save_to_supabase(all_repos)
    
    def save_to_json(self, repos: List[Dict], filename: str = 'github_trending.json'):
        """Save to JSON file"""
        import json
        
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(repos, f, ensure_ascii=False, indent=2)
            print(f"✅ Saved to {filename}")
        except Exception as e:
            print(f"❌ Error: {e}")


def main():
    """CLI entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(description='GitHub Trending Scraper')
    parser.add_argument('--language', type=str, help='Specific language')
    parser.add_argument('--since', type=str, default='weekly', 
                       choices=['daily', 'weekly', 'monthly'],
                       help='Time period')
    parser.add_argument('--multi', action='store_true', 
                       help='Fetch all languages')
    parser.add_argument('--json', action='store_true', help='Save to JSON')
    parser.add_argument('--supabase', action='store_true', help='Save to Supabase')
    
    args = parser.parse_args()
    
    scraper = GitHubTrendingScraper()
    
    if args.multi:
        results = scraper.fetch_multi_language(since=args.since)
        
        if args.json:
            import json
            with open('github_trending_multi.json', 'w') as f:
                json.dump(results, f, indent=2)
        
        if args.supabase:
            scraper.save_multi_to_supabase(results)
    else:
        repos = scraper.fetch_trending(
            language=args.language,
            since=args.since
        )
        
        # Print summary
        print("\n📊 Top Repositories:")
        for i, repo in enumerate(repos[:5], 1):
            print(f"\n{i}. {repo['full_name']}")
            print(f"   ⭐ {repo['stars']:,} | 🍴 {repo['forks']:,}")
            print(f"   📝 {repo['description'][:80]}...")
        
        if args.json:
            scraper.save_to_json(repos)
        
        if args.supabase:
            scraper.save_to_supabase(repos)


if __name__ == "__main__":
    main()
