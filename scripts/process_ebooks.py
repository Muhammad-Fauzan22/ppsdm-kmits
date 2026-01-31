
import csv
import subprocess
import time
import os
import sys

# Path to CSV
CSV_PATH = r"EBOOK MANAGEMENT SYSTEM - 📚 DATABASE UTAMA.csv"

def process_ebooks():
    print("STARTING MASS EBOOK PROCESSING")
    
    # Manual list from user request to ensure exact match
    ebooks = [
        "CHEATSHEET MANAJEMEN",
        "DRAF NEO PPSDM Keluarga Mahasiswa Mesin ITS",
        "NEOPPSDM",
        "ORGANISASI",
        "Naskah Akademik dan Penyusunan PPSDM KMM ITS",
        "SHORT CUT",
        "UU MESIN",
        "AD ART ORMAWA",
        "FORUM",
        "Buku 1 KDKM dan HDPSDM MUBES V ITS"
    ]

    print(f"Processing {len(ebooks)} books from priority list.")
    
    for i, title in enumerate(ebooks):
        print(f"\n[{i+1}/{len(ebooks)}] Processing: {title}")
        
        # Strip extension if present
        clean_title = title.replace('.pdf', '').replace('.epub', '')
        
        try:
            # Call ai_university_builder.py
            cmd = ["python", "scripts/ai_university_builder.py", clean_title]
            subprocess.run(cmd, check=True)
            print(f"Completed: {clean_title}")
        except subprocess.CalledProcessError as e:
            print(f"Failed: {clean_title} - {e}")
        except Exception as e:
            print(f"Error: {e}")
            
        # Cooldown to avoid API Rate Limits
        time.sleep(5)

if __name__ == "__main__":
    process_ebooks()
