#!/usr/bin/env python3
"""
Smart E-Book to Learning Content Converter
Mengubah buku dari CSV menjadi learning modules dengan smart mapping
"""

import csv
from pathlib import Path
from dotenv import load_dotenv
import os
from supabase import create_client

# Load environment
env_path = Path(__file__).parent.parent / ".env.local"
load_dotenv(env_path)

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not all([SUPABASE_URL, SUPABASE_KEY]):
    print("❌ Missing Supabase credentials")
    exit(1)

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

EBOOK_CSV = Path(__file__).parent.parent / "EBOOK MANAGEMENT SYSTEM - 📚 DATABASE UTAMA.csv"

# Content templates untuk berbagai kategori
CONTENT_TEMPLATES = {
    "PPSDM": {
        "template": """
# {title}

## Pendahuluan
{title} adalah bagian penting dari Pengembangan Soft Skills dan Kepemimpinan Mahasiswa (PPSDM) di Instititut Teknologi Sepuluh Nopember.

## Pokok Bahasan
- Pengertian dan tujuan
- Nilai-nilai utama
- Penerapan praktis
- Studi kasus

## Tujuan Pembelajaran
Setelah mempelajari materi ini, Anda diharapkan dapat:
1. Memahami konsep dasar
2. Menerapkan prinsip-prinsip yang dipelajari
3. Memberikan kontribusi positif

## Referensi
- Dokumen resmi ITS
- Panduan implementasi
- Best practices
""",
        "xp": 150,
        "level": "intermediate"
    },
    "Hukum": {
        "template": """
# {title}

## Latar Belakang Hukum
Peraturan perundang-undangan ini mengatur {category_detail} di Indonesia.

## Isi Pokok
- Pasal-pasal utama
- Ketentuan umum
- Hak dan kewajiban
- Sanksi dan penyelesaian

## Relevansi untuk Mahasiswa
- Memahami kerangka hukum
- Mengetahui hak dan tanggung jawab
- Aplikasi dalam konteks akademik

## Ringkasan
Pengetahuan tentang {title} penting untuk memahami sistem hukum Indonesia dan peran aktif dalam masyarakat.
""",
        "xp": 100,
        "level": "advanced"
    },
    "Sejarah": {
        "template": """
# {title}

## Konteks Historis
{title} merupakan bagian penting dari sejarah Indonesia modern.

## Periode dan Peristiwa Kunci
- Era pra-kemerdekaan
- Perjuangan nasional
- Dampak sosial-politik
- Warisan hingga masa kini

## Tokoh-tokoh Penting
- Pemimpin gerakan
- Kontribusi mereka
- Legacy yang ditinggalkan

## Pelajaran untuk Generasi Muda
- Semangat kepahlawanan
- Nasionalisme
- Tanggung jawab sosial
- Kepemimpinan

## Kesimpulan
Memahami sejarah membantu kita menghargai perjuangan generasi sebelumnya dan terinspirasi untuk berkontribusi pada masa depan bangsa.
""",
        "xp": 120,
        "level": "intermediate"
    },
    "Pendidikan": {
        "template": """
# {title}

## Teori Pendidikan
{title} memberikan perspektif baru dalam pendekatan pembelajaran.

## Prinsip-prinsip Utama
- Paradigma pembelajaran
- Metode instruksional
- Peran pendidik dan peserta didik
- Evaluasi dan hasil

## Aplikasi Praktis
- Di ruang kelas
- Dalam pembelajaran mandiri
- Dalam komunitas belajar
- Dalam pengembangan kurikulum

## Keunggulan dan Tantangan
- Manfaat penerapan
- Hambatan implementasi
- Solusi alternatif

## Refleksi
Konsep ini relevan untuk membangun sistem pendidikan yang inklusif, berkualitas, dan berdampak.
""",
        "xp": 140,
        "level": "intermediate"
    },
    "Default": {
        "template": """
# {title}

## Pengenalan
{title} adalah sumber pembelajaran yang berharga untuk pengembangan pengetahuan dan keterampilan.

## Poin-poin Penting
- Konsep utama
- Aplikasi praktis
- Relevansi kontemporer
- Hubungan dengan topik lain

## Pembelajaran Utama
Materi ini dirancang untuk membantu Anda:
1. Memahami konsep dasar
2. Menganalisis situasi kompleks
3. Membuat keputusan berdasarkan informasi

## Pengembangan Lebih Lanjut
- Riset tambahan
- Diskusi kelompok
- Studi kasus
- Aplikasi kehidupan nyata

## Penutup
Bergabunglah dalam perjalanan pembelajaran ini dan tingkatkan pemahaman Anda tentang {title}.
""",
        "xp": 100,
        "level": "beginner"
    }
}

class SmartEbookConverter:
    def __init__(self):
        self.processed = 0
        self.failed = 0
        self.categories_found = {}
        
    def categorize_book(self, book: dict) -> str:
        """Kategorikan buku berdasarkan title dan category"""
        title = book.get('TITLE', '').lower()
        category = book.get('CATEGORY', '').lower()
        
        if 'ppsdm' in title or 'kepemimpinan' in title or 'soft skill' in category:
            return 'PPSDM'
        elif 'hukum' in category or 'peraturan' in title or 'uu' in title or 'undang' in title:
            return 'Hukum'
        elif 'sejarah' in category or 'gerakan' in title or 'perjuangan' in title:
            return 'Sejarah'
        elif 'pendidikan' in category or 'pedagogi' in title or 'pembelajaran' in title:
            return 'Pendidikan'
        else:
            return 'Default'
    
    def get_template(self, book: dict) -> dict:
        """Ambil template yang sesuai"""
        category = self.categorize_book(book)
        return CONTENT_TEMPLATES.get(category, CONTENT_TEMPLATES['Default']).copy()
    
    def generate_content(self, book: dict) -> str:
        """Generate content dari template"""
        template_data = self.get_template(book)
        title = book.get('TITLE', 'Untitled')
        
        return template_data['template'].format(
            title=title,
            category_detail=book.get('CATEGORY', 'aspek penting')
        )
    
    def read_csv(self):
        """Baca CSV"""
        books = []
        try:
            with open(EBOOK_CSV, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    if row.get('TITLE') and row.get('TITLE').strip():
                        books.append(row)
            print(f"📚 Found {len(books)} books in CSV")
            return books
        except Exception as e:
            print(f"❌ Error reading CSV: {e}")
            return []
    
    def insert_to_db(self, book: dict, is_duplicate=False):
        """Insert course to Supabase"""
        try:
            title = book.get('TITLE', 'Unknown')
            category = self.categorize_book(book)
            template_data = self.get_template(book)
            
            # Check if course already exists
            existing = supabase.table("courses").select("*").eq("title", title).execute()
            if existing.data and is_duplicate:
                print(f"  ⏭️  Already exists: {title[:40]}...")
                return False
            
            # Create course
            course_payload = {
                "title": title,
                "slug": title.lower().replace(' ', '-')[:60],
                "description": f"Learning module from: {title}",
                "category": category.lower(),
                "level": template_data.get('level', 'beginner'),
                "cover_image": f"https://images.pollinations.ai/400x300/{category.lower()}-book",
                "is_published": True,
            }
            
            course_response = supabase.table("courses").insert(course_payload).execute()
            if not course_response.data:
                print(f"  ❌ Failed: {title[:40]}...")
                return False
            
            course_id = course_response.data[0]["id"]
            
            # Create module with generated content
            module_payload = {
                "course_id": course_id,
                "title": f"Modul Utama: {title[:50]}",
                "description": f"Pelajaran interaktif tentang {title}",
                "content": self.generate_content(book),
                "module_order": 1,
                "is_published": True,
            }
            
            module_response = supabase.table("modules").insert(module_payload).execute()
            if module_response.data:
                print(f"  ✅ {title[:40]}...")
                return True
            else:
                print(f"  ⚠️  Module creation failed for {title[:40]}...")
                return False
                
        except Exception as e:
            print(f"  ❌ Error: {str(e)[:50]}...")
            return False
    
    def process_all(self, limit=None):
        """Process semua buku"""
        books = self.read_csv()
        if not books:
            return
        
        if limit:
            books = books[:limit]
        
        print(f"\n🚀 Processing {len(books)} books...\n")
        
        for i, book in enumerate(books, 1):
            category = self.categorize_book(book)
            if category not in self.categories_found:
                self.categories_found[category] = 0
            self.categories_found[category] += 1
            
            if self.insert_to_db(book):
                self.processed += 1
            else:
                self.failed += 1
            
            # Progress
            if i % 5 == 0:
                print(f"   📊 Progress: {i}/{len(books)}")
        
        # Summary
        print(f"\n" + "="*70)
        print(f"✅ PROCESSING COMPLETE!")
        print(f"   Successfully created: {self.processed} courses")
        print(f"   Failed: {self.failed}")
        print(f"   Categories found: {dict(self.categories_found)}")
        print(f"="*70)

if __name__ == "__main__":
    converter = SmartEbookConverter()
    converter.process_all()  # Process all 100 books
