import logging
import sys
import os
from its_news_scraper import scrape_its_news
# import events_scraper
# import learning_aggregator

# Setup Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

def run_all_scrapers():
    logging.info("🚀 STARTING DAILY SCRAPER JOB")
    
    # 1. ITS News
    try:
        logging.info(">>> Running ITS News Scraper...")
        news = scrape_its_news()
        logging.info(f"✅ ITS News finished. Items: {len(news)}")
    except Exception as e:
        logging.error(f"❌ ITS News Failed: {e}")

    # 2. Events (Placeholder)
    # try:
    #     logging.info(">>> Running Event Scraper...")
    #     scrape_events()
    # except Exception as e:
    #     logging.error(f"❌ Event Scraper Failed: {e}")

    logging.info("🏁 ALL SCRAPERS COMPLETED")

if __name__ == "__main__":
    run_all_scrapers()
