#!/usr/bin/env python3
"""
Master E-Book Processing Engine
Mengolah semua buku dari CSV menjadi learning modules
Menggunakan Gemini + Nemotron untuk content generation
"""

import os
import json
import csv
from datetime import datetime
from pathlib import Path
from typing import Optional
from dotenv import load_dotenv
import google.generativeai as genai
from supabase import create_client

# Load environment
env_path = Path(__file__).parent.parent / ".env.local"
load_dotenv(env_path)

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
GEMINI_API_KEY = os.getenv("GOOGLE_GENERATIVE_AI_API_KEY")

if not all([SUPABASE_URL, SUPABASE_KEY, GEMINI_API_KEY]):
    print("❌ Missing credentials")
    exit(1)

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
genai.configure(api_key=GEMINI_API_KEY)

# CSV file path
EBOOK_CSV = Path(__file__).parent.parent / "EBOOK MANAGEMENT SYSTEM - 📚 DATABASE UTAMA.csv"

class EbookProcessor:
    def __init__(self):
        self.model = genai.GenerativeModel("gemini-pro")
        self.processed_count = 0
        self.failed_count = 0
        
    def read_ebook_csv(self) -> list:
        """Baca semua buku dari CSV"""
        books = []
        try:
            with open(EBOOK_CSV, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    if row.get('TITLE') and row.get('TITLE').strip():
                        books.append(row)
            print(f"📚 {len(books)} buku ditemukan di CSV")
            return books
        except Exception as e:
            print(f"❌ Error reading CSV: {e}")
            return []

    def generate_course_from_book(self, book: dict) -> Optional[dict]:
        """Generate course/modules dari informasi buku"""
        title = book.get('TITLE', 'Unknown Book')
        author = book.get('AUTHOR', 'Unknown')
        category = book.get('CATEGORY', 'General')
        
        prompt = f"""
Buatkan kurikulum pembelajaran dari buku berikut:
JUDUL: {title}
PENULIS: {author}
KATEGORI: {category}
DESKRIPSI SINGKAT: {book.get('TAGS', 'Educational content')}

Hasilkan dalam format JSON dengan struktur:
{{
    "course_title": "Judul kursus yang menarik",
    "course_description": "Deskripsi singkat (2-3 kalimat)",
    "modules": [
        {{
            "title": "Modul 1: ...",
            "description": "Penjelasan modul",
            "content": "Konten pembelajaran (markdown)",
            "learning_objectives": ["Tujuan 1", "Tujuan 2"],
            "key_concepts": ["Konsep 1", "Konsep 2"]
        }}
    ],
    "learning_outcomes": ["Hasil pembelajaran 1", "Hasil pembelajaran 2"],
    "xp_reward": 100
}}

Buat 2-3 modul yang relevan dan informatif.
"""
        
        try:
            response = self.model.generate_content(prompt)
            if response.text:
                # Parse JSON dari response
                import re
                json_match = re.search(r'\{.*\}', response.text, re.DOTALL)
                if json_match:
                    return json.loads(json_match.group())
            return None
        except Exception as e:
            print(f"⚠️  Error generating content for {title}: {e}")
            return None

    def insert_course_to_db(self, book: dict, course_data: dict) -> Optional[str]:
        """Masukkan course ke database"""
        try:
            # 1. Create course
            course_payload = {
                "title": course_data.get("course_title", book.get('TITLE', 'Unknown')),
                "slug": book.get('TITLE', 'unknown').lower().replace(' ', '-')[:50],
                "description": course_data.get("course_description", ""),
                "category": book.get('CATEGORY', 'general'),
                "level": "intermediate",
                "cover_image": f"https://images.pollinations.ai/600x400/{book.get('CATEGORY', 'book').lower()}",
                "is_published": True,
            }
            
            course_response = supabase.table("courses").insert(course_payload).execute()
            if not course_response.data:
                print(f"❌ Failed to create course for {book.get('TITLE')}")
                return None
                
            course_id = course_response.data[0]["id"]
            print(f"✅ Course created: {course_payload['title']}")
            
            # 2. Create modules
            for i, module in enumerate(course_data.get("modules", []), 1):
                module_payload = {
                    "course_id": course_id,
                    "title": module.get("title", f"Module {i}"),
                    "description": module.get("description", ""),
                    "content": module.get("content", ""),
                    "module_order": i,
                    "learning_outcomes": json.dumps(module.get("learning_objectives", [])),
                    "is_published": True,
                }
                
                module_response = supabase.table("modules").insert(module_payload).execute()
                if module_response.data:
                    print(f"  ✅ Module {i}: {module.get('title', 'Untitled')}")
                else:
                    print(f"  ❌ Failed to create module {i}")
            
            return course_id
            
        except Exception as e:
            print(f"❌ Error inserting to DB: {e}")
            return None

    def process_all_books(self):
        """Process semua buku"""
        books = self.read_ebook_csv()
        if not books:
            print("No books found!")
            return
            
        print(f"\n🚀 Processing {len(books)} books...\n")
        
        for i, book in enumerate(books[:15], 1):  # Limit to 15 untuk testing
            title = book.get('TITLE', 'Unknown')
            print(f"\n[{i}/{min(15, len(books))}] Processing: {title[:50]}...")
            
            # Generate content
            course_data = self.generate_course_from_book(book)
            if not course_data:
                print(f"  ⚠️  Skipping - content generation failed")
                self.failed_count += 1
                continue
            
            # Insert to DB
            course_id = self.insert_course_to_db(book, course_data)
            if course_id:
                self.processed_count += 1
            else:
                self.failed_count += 1
        
        print(f"\n" + "="*60)
        print(f"📊 Processing complete!")
        print(f"✅ Successfully processed: {self.processed_count}")
        print(f"❌ Failed: {self.failed_count}")
        print(f"="*60)

if __name__ == "__main__":
    processor = EbookProcessor()
    processor.process_all_books()
