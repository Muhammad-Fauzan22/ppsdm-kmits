import time
import schedule
import logging
from datetime import datetime
import os
import sys

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from main import run_pipeline
# Assuming we have a DB utility or similar to fetch jobs.
# For now, we'll mock the job fetching or rely on a placeholder function.
# In a real scenario, this would import from layers.credentialing or a db_utils module.

# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("automation.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("DailyProcessingScheduler")

class DailyProcessingScheduler:
    """Schedule and automate daily processing"""
    
    def __init__(self):
        self.is_running = False
        self.max_retries = 3

    def fetch_pending_jobs(self):
        """
        Mock function to fetch pending jobs from Supabase or a Queue.
        In production, replace this with actual DB call.
        """
        # Example: return [{'id': 'job_123', 'pdf_url': '...', 'status': 'pending'}]
        # For now, we check if a specific folder has new files or just return empty list to not loop infinitely in demo.
        return []

    def update_job_status(self, job_id, status, details=None):
        """Mock function to update job status in DB"""
        logger.info(f"Job {job_id} updated to {status}. Details: {details}")

    def process_pending_queue(self):
        """Process all jobs in the pending queue"""
        if self.is_running:
            logger.warning("Processing already in progress. Skipping cycle.")
            return

        self.is_running = True
        logger.info("Starting processing cycle...")

        try:
            jobs = self.fetch_pending_jobs()
            if not jobs:
                logger.info("No pending jobs found.")
            
            for job in jobs:
                job_id = job.get('id')
                pdf_url = job.get('pdf_url')
                metadata = job.get('metadata', {})
                
                logger.info(f"Processing Job ID: {job_id}")
                self.update_job_status(job_id, 'processing')
                
                try:
                    # Execute the main pipeline
                    result = run_pipeline(pdf_url, metadata)
                    
                    if result.get('status') == 'failed':
                        logger.error(f"Job {job_id} failed: {result.get('error')}")
                        self.update_job_status(job_id, 'failed', result.get('error'))
                    else:
                        logger.info(f"Job {job_id} completed successfully.")
                        self.update_job_status(job_id, 'completed', result)
                        
                except Exception as e:
                    logger.error(f"Critical error processing job {job_id}: {str(e)}")
                    self.update_job_status(job_id, 'failed', str(e))
                    
        except Exception as e:
            logger.error(f"Error in processing cycle: {str(e)}")
        finally:
            self.is_running = False
            logger.info("Processing cycle finished.")

    def setup_automation(self):
        """Set up automated daily processing pipeline"""
        
        logger.info("Initializing Automation Scheduler...")
        
        # Schedule daily processing at 2 AM
        schedule.every().day.at("02:00").do(self.process_pending_queue)
        
        # Also run every minute to check for immediate new jobs (simulation of 'always on')
        schedule.every(1).minutes.do(self.process_pending_queue)
        
        logger.info("Scheduler started. Waiting for triggers...")
        
        while True:
            schedule.run_pending()
            time.sleep(1)

if __name__ == "__main__":
    scheduler = DailyProcessingScheduler()
    try:
        scheduler.setup_automation()
    except KeyboardInterrupt:
        logger.info("Automation stopped by user.")
