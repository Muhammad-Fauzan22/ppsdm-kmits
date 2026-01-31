import csv
import subprocess
import time
import os
import sys
import logging
from pathlib import Path

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("ebook_processing.log"),
        logging.StreamHandler(sys.stdout)
    ]
)

# Configuration
CSV_FILE_NAME = "EBOOK MANAGEMENT SYSTEM - 📚 DATABASE UTAMA.csv"
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent
CSV_PATH = PROJECT_ROOT / CSV_FILE_NAME
BUILDER_SCRIPT = SCRIPT_DIR / "ai_university_builder.py"

def process_ebooks():
    logging.info("STARTING AUTOMATED EBOOK PROCESSING ENGINE")
    
    if not CSV_PATH.exists():
        logging.error(f"CSV Database not found at: {CSV_PATH}")
        return

    ebooks_to_process = []
    
    try:
        with open(CSV_PATH, mode='r', encoding='utf-8') as f:
            reader = csv.reader(f)
            for row in reader:
                # Fallback content extraction: Index 2 seems to be Title based on inspection
                if len(row) > 2:
                    title = row[2]
                    # basic validation to skip header if it exists (though file seems headless)
                    if title and title.lower() != 'title' and title.lower() != 'judul buku':
                        ebooks_to_process.append(title.strip())

    except Exception as e:
        logging.error(f"Failed to read CSV: {e}")
        return

    if not ebooks_to_process:
        logging.warning("No ebooks found in CSV to process.")
        return

    logging.info(f"Found {len(ebooks_to_process)} books in database.")
    
    for i, title in enumerate(ebooks_to_process):
        logging.info(f"[{i+1}/{len(ebooks_to_process)}] Starting Job: {title}")
        
        # Clean title
        clean_title = title.replace('.pdf', '').replace('.epub', '')
        
        try:
            # Check if builder script exists
            if not BUILDER_SCRIPT.exists():
                logging.critical(f"Builder script missing at {BUILDER_SCRIPT}")
                break

            cmd = [sys.executable, str(BUILDER_SCRIPT), clean_title]
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            if result.returncode == 0:
                logging.info(f"SUCCESS: {clean_title}")
            else:
                logging.error(f"FAILED: {clean_title}\nError: {result.stderr}")
                
        except Exception as e:
            logging.error(f"EXCEPTION processing {clean_title}: {e}")
            
        # Cooldown
        time.sleep(2)

    logging.info("PROCESSING COMPLETE")

if __name__ == "__main__":
    process_ebooks()
