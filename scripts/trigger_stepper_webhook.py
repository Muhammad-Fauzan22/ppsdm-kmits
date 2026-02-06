#!/usr/bin/env python3
"""
Trigger Stepper Webhook untuk semua 10 buku
Workflow ID: 2185
"""

import requests
import json
import time
import sys

# Fix Windows Unicode encoding
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

WEBHOOK_URL = "https://hooks.stepper.io/workflow/2185"
EMAIL = "punyofauzan3@gmail.com"

books = [
    {
        "name": "CHEATSHEET MANAJEMEN.pdf",
        "download_url": "https://drive.google.com/uc?export=download&id=10lasKKin4yFKj1jN2LnxXj09a1oq20an",
        "job_id": "57f8abf9-e461-4398-84f5-8d9e8cc45994",
        "timestamp": "2026-01-31T18:16:00.000Z"
    },
    {
        "name": "DRAF NEO PPSDM Keluarga Mahasiswa Mesin ITS.docx",
        "download_url": "https://drive.google.com/uc?export=download&id=1YayXjry7un1LETFOH4c_uSmBdjuUqfAY",
        "job_id": "37b0ce05-b3d7-4973-a833-00680f5d07b0",
        "timestamp": "2026-01-31T18:17:00.000Z"
    },
    {
        "name": "NEOPPSDM.html",
        "download_url": "https://drive.google.com/uc?export=download&id=1Fd9y476TkfkXAO-ku0QbyxTzoS8Nm312",
        "job_id": "aa975eee-aca3-4008-a3bb-d45e6cf79c59",
        "timestamp": "2026-01-31T18:18:00.000Z"
    },
    {
        "name": "ORGANISASI.html",
        "download_url": "https://drive.google.com/uc?export=download&id=1gyUjWnZp9tsZp6jcEsWjwBP_hIbXOrk9",
        "job_id": "00b6f004-1b71-41f7-b8f6-83f380390b6d",
        "timestamp": "2026-01-31T18:19:00.000Z"
    },
    {
        "name": "Naskah Akademik dan Penyusunan PPSDM KMM ITS.pdf",
        "download_url": "https://drive.google.com/uc?export=download&id=1dG88UW61wugYxeZ5_hjAagdXgfjQ5eo7",
        "job_id": "dc93e83a-9869-4462-a47a-3e229a19fc4e",
        "timestamp": "2026-01-31T18:20:00.000Z"
    },
    {
        "name": "SHORT CUT.xlsx",
        "download_url": "https://drive.google.com/uc?export=download&id=1bwmN410LoBW8qeg9r7okQv-mMyHc0UjB",
        "job_id": "f5e2b12b-45b6-41e1-98aa-affe346981c5",
        "timestamp": "2026-01-31T18:21:00.000Z"
    },
    {
        "name": "UU MESIN.html",
        "download_url": "https://drive.google.com/uc?export=download&id=1Lps-OpcNtVsriAEwoYk7NtNG63ZIgJjX",
        "job_id": "853f4f14-c1c7-4989-813c-e1c3a8a17289",
        "timestamp": "2026-01-31T18:22:00.000Z"
    },
    {
        "name": "AD ART ORMAWA.html",
        "download_url": "https://drive.google.com/uc?export=download&id=1hC3xnryLJ9SFPs9taRPE8cqUSKMaRi_b",
        "job_id": "04da3412-d669-47b6-b261-c24b60f2fee4",
        "timestamp": "2026-01-31T18:23:00.000Z"
    },
    {
        "name": "FORUM.html",
        "download_url": "https://drive.google.com/uc?export=download&id=1zTHmK4zvHBRZAiU0qcUOwtH_nZ6V7DU3",
        "job_id": "0a004dcc-accf-4033-9d23-5a2778019b7b",
        "timestamp": "2026-01-31T18:24:00.000Z"
    },
    {
        "name": "Buku 1 KDKM dan HDPSDM MUBES V ITS.pdf",
        "download_url": "https://drive.google.com/uc?export=download&id=1RtJBQ_Hd-ULaOH5l_7PDU4ruiTpWUta3",
        "job_id": "44c9edc5-a7cd-43b2-9951-b48eb622ca64",
        "timestamp": "2026-01-31T18:25:00.000Z"
    }
]

print("=" * 80)
print("🚀 STEPPEK WEBHOOK - PROCESSING 10 BOOKS")
print("=" * 80)
print(f"📧 Notification email: {EMAIL}")
print(f"🔗 Webhook URL: {WEBHOOK_URL}")
print("")

success_count = 0
failed_count = 0

for idx, book in enumerate(books, 1):
    print(f"📚 Book {idx}: {book['name']}")
    
    payload = {
        "file": {
            "name": book["name"],
            "download_url": book["download_url"]
        },
        "job_id": book["job_id"],
        "timestamp": book["timestamp"],
        "notification": {
            "email": EMAIL
        }
    }
    
    try:
        response = requests.post(
            WEBHOOK_URL,
            headers={"Content-Type": "application/json"},
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"   ✅ Triggered - Status: {result.get('status', 'unknown')}")
            success_count += 1
        else:
            print(f"   ⚠️  HTTP {response.status_code}: {response.text[:100]}")
            failed_count += 1
            
    except Exception as e:
        print(f"   ❌ Failed: {str(e)[:100]}")
        failed_count += 1
    
    if idx < len(books):
        time.sleep(2)

print("")
print("=" * 80)
print("🎉 PROCESSING COMPLETE!")
print("=" * 80)
print(f"✅ Success: {success_count} books")
print(f"❌ Failed: {failed_count} books")
print("")
print("📊 Monitor dashboard:")
print("   https://docs.google.com/spreadsheets/d/1prb07HX5pG_4HpENs-buWm_Tw-V80t5en1_nFc808GM")
print(f"📧 Check email: {EMAIL}")
print("")
print("Note: Processing may take 5-30 minutes per book.")
print("You will receive email notifications when each book is complete.")
