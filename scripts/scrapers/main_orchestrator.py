
import sys
import logging
import json
from datetime import datetime

# Import modules
from its_scraper import ITSScraper
from job_scraper import JobScraper
from supabase_integration import SupabaseIntegration

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('scraper_orchestrator.log', encoding='utf-8')
    ]
)

def main():
    logger = logging.getLogger(__name__)
    logger.info("🚀 STARTING PPSDM SCRAPER ORCHESTRATOR")
    
    # Initialize
    its = ITSScraper()
    jobs = JobScraper()
    db = SupabaseIntegration()
    
    all_results = {
        'news': [],
        'scholarships': [],
        'jobs': []
    }

    # 1. Scrape ITS News
    try:
        news_data = its.scrape_its_news()
        all_results['news'] = news_data
        logger.info(f"✅ Scraped {len(news_data)} news items.")
        
        # Upload
        # Note: Ensure table 'scraped_news' exists in Supabase
        # Mapping fields if necessary
        db_news = [{
            'title': i['title'],
            'url': i['url'],
            'content': i['content'],
            'image_url': i.get('image_url'),
            'published_at': i['publish_date'],
            'source': i['source'],
            'category': i['category']
        } for i in news_data]
        
        db.upload_data('scraped_news', db_news)
        
    except Exception as e:
        logger.error(f"❌ ITS News Scraper Failed: {e}")

    # 2. Scrape Scholarships
    try:
        sch_data = its.scrape_scholarships()
        all_results['scholarships'] = sch_data
        logger.info(f"✅ Scraped {len(sch_data)} scholarships.")
        
        db_sch = [{
            'title': i['title'],
            'url': i['url'],
            'description': f"Provider: {i.get('provider', 'Unknown')}",
            'deadline': i.get('deadline'),
            'category': 'Beasiswa',
            'scraped_at': i['scraped_at']
        } for i in sch_data]
        
        # Assuming table 'scraped_opportunities' or similar
        db.upload_data('scraped_opportunities', db_sch)

    except Exception as e:
        logger.error(f"❌ Scholarship Scraper Failed: {e}")

    # 3. Scrape Jobs
    try:
        job_data = jobs.scrape_kalibrr()
        all_results['jobs'] = job_data
        logger.info(f"✅ Scraped {len(job_data)} jobs.")
        
        db_jobs = [{
            'title': i['title'],
            'url': i['url'],
            'company': i['company'],
            'description': f"Location: {i['location']}",
            'category': 'Magang',
            'scraped_at': i['scraped_at']
        } for i in job_data]
        
        db.upload_data('scraped_opportunities', db_jobs)
        
    except Exception as e:
        logger.error(f"❌ Job Scraper Failed: {e}")


    # 4. Scrape YouTube
    try:
        from youtube_aggregator import YouTubeAggregator
        yt = YouTubeAggregator()
        videos = yt.scrape_videos()
        all_results['videos'] = videos
        logger.info(f"✅ Scraped {len(videos)} videos.")
        
        db_videos = [{
            'title': v['title'],
            'url': v['url'],
            'image_url': v.get('thumbnail'),
            'source': f"YouTube - {v['channel']}",
            'category': 'Video Edukasi',
            'published_at': v['published_at']
        } for v in videos]
        
        # Reuse 'scraped_news' or create 'scraped_videos', defaulting to news for now to save schema changes complexity unless requested
        # Or better, let's just log it if table doesn't exist, or map to news with category 'Video'
        db.upload_data('scraped_news', db_videos) 

    except Exception as e:
        logger.error(f"❌ YouTube Scraper Failed: {e}")

    # 5. Scrape GitHub
    try:
        from github_trending import GitHubTrending
        gh = GitHubTrending()
        repos = gh.scrape_trending('typescript') + gh.scrape_trending('python')
        all_results['repos'] = repos
        logger.info(f"✅ Scraped {len(repos)} repos.")
        
        db_repos = [{
            'title': r['name'],
            'url': r['url'],
            'content': r['description'],
            'source': 'GitHub Trending',
            'category': f"Open Source - {r['language']}",
            'published_at': r['scraped_at']
        } for r in repos]
        
        db.upload_data('scraped_news', db_repos) # reusing news table for content

    except Exception as e:
        logger.error(f"❌ GitHub Scraper Failed: {e}")

    # Save local summary
    with open('latest_scrape_summary.json', 'w') as f:
        json.dump(all_results, f, indent=2)
    
    logger.info("🏁 SCRAPING JOB COMPLETE")


if __name__ == "__main__":
    main()
