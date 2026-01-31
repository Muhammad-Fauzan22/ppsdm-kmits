#!/usr/bin/env python3
"""
ITS Comprehensive Web Scraper
============================
Mengambil data dari SEMUA bagian website resmi ITS (its.ac.id)
berdasarkan struktur navigasi yang tertera di screenshot.

Struktur Menu yang Discrape:
- Main Menu: Calon Mahasiswa, Mahasiswa, Mahasiswa Baru, Dosen & Staf, Orang Tua, Alumni
- Secondary Menu: Profil ITS, Pendaftaran, Kuliah di ITS, Riset, Inovasi, Inisiatif, Layanan, Berita

Author: PPSDM KMITS LMS
Version: 3.0
"""

import sys
import os
sys.stdout.reconfigure(encoding='utf-8')

import requests
from bs4 import BeautifulSoup
import json
import time
import argparse
import re
from datetime import datetime
from urllib.parse import urljoin, urlparse
from typing import List, Dict, Optional, Set
from dataclasses import dataclass, asdict

# Supabase Integration
try:
    from supabase import create_client, Client
    HAS_SUPABASE = True
except ImportError:
    HAS_SUPABASE = False
    print("⚠️ Supabase not installed. Database storage disabled.")


@dataclass
class ScrapedContent:
    """Structured data model for scraped content"""
    id: str
    title: str
    content: str
    url: str
    source_section: str  # Which ITS menu section
    category: str
    subcategory: str
    published_date: Optional[str]
    author: Optional[str]
    image_url: Optional[str]
    scraped_at: str
    tags: List[str]
    metadata: Dict


class ITSComprehensiveScraper:
    """
    Komprehensif scraper untuk website ITS
    Mengambil data dari semua bagian website sesuai struktur menu resmi
    """
    
    BASE_URL = "https://www.its.ac.id"
    
    # Mapping semua section ITS dari screenshot
    ITS_SECTIONS = {
        # Main Menu (Top Navigation)
        "calon_mahasiswa": {
            "url": "https://www.its.ac.id/admission/",
            "label": "Calon Mahasiswa",
            "subpages": [
                "https://www.its.ac.id/beasiswa/",
                "https://www.its.ac.id/admission/program-sarjana/",
                "https://www.its.ac.id/admission/jalur-masuk/",
            ]
        },
        "mahasiswa": {
            "url": "https://www.its.ac.id/mahasiswa/",
            "label": "Mahasiswa",
            "subpages": [
                "https://www.its.ac.id/mahasiswa/beasiswa/",
                "https://www.its.ac.id/mahasiswa/prestasi/",
                "https://www.its.ac.id/mahasiswa/organisasi/",
            ]
        },
        "mahasiswa_baru": {
            "url": "https://www.its.ac.id/admission/mahasiswa-baru/",
            "label": "Mahasiswa Baru",
            "subpages": [
                "https://www.its.ac.id/admission/registrasi/",
                "https://www.its.ac.id/admission/biaya-kuliah/",
            ]
        },
        "dosen_staf": {
            "url": "https://www.its.ac.id/dosen-staf/",
            "label": "Dosen & Staf",
            "subpages": [
                "https://www.its.ac.id/dosen-staf/penelitian-pengabdian/",
                "https://www.its.ac.id/dosen-staf/hibah/",
            ]
        },
        "orang_tua": {
            "url": "https://www.its.ac.id/orang-tua/",
            "label": "Orang Tua",
            "subpages": [
                "https://www.its.ac.id/orang-tua/panduan/",
                "https://www.its.ac.id/orang-tua/faq/",
            ]
        },
        "alumni": {
            "url": "https://alumni.its.ac.id/",
            "label": "Alumni",
            "subpages": [
                "https://alumni.its.ac.id/vacancy/",
                "https://alumni.its.ac.id/networking/",
            ]
        },
        
        # Secondary Menu (Main Navigation)
        "profil_its": {
            "url": "https://www.its.ac.id/profil/",
            "label": "Profil ITS",
            "subpages": [
                "https://www.its.ac.id/profil/sejarah/",
                "https://www.its.ac.id/profil/visi-misi/",
                "https://www.its.ac.id/profil/pimpinan/",
                "https://www.its.ac.id/profil/fakultas-departemen/",
                "https://www.its.ac.id/profil/kerjasama/",
            ]
        },
        "pendaftaran": {
            "url": "https://www.its.ac.id/admission/",
            "label": "Pendaftaran",
            "subpages": [
                "https://www.its.ac.id/admission/sarjana/",
                "https://www.its.ac.id/admission/magister/",
                "https://www.its.ac.id/admission/doktor/",
                "https://www.its.ac.id/admission/profesi/",
                "https://www.its.ac.id/admission/vokasi/",
                "https://www.its.ac.id/admission/internasional/",
            ]
        },
        "kuliah_di_its": {
            "url": "https://www.its.ac.id/kuliah/",
            "label": "Kuliah di ITS",
            "subpages": [
                "https://www.its.ac.id/kuliah/sarjana/",
                "https://www.its.ac.id/kuliah/magister/",
                "https://www.its.ac.id/kuliah/doktor/",
                "https://www.its.ac.id/kuliah/vokasi/",
                "https://www.its.ac.id/kuliah/mbkm/",
                "https://www.its.ac.id/kuliah/internasional/",
            ]
        },
        "riset": {
            "url": "https://www.its.ac.id/riset/",
            "label": "Riset",
            "subpages": [
                "https://www.its.ac.id/riset/pusat/",
                "https://www.its.ac.id/riset/publikasi/",
                "https://www.its.ac.id/riset/hibah/",
                "https://www.its.ac.id/riset/inovasi/",
                "https://repository.its.ac.id/",
            ]
        },
        "inovasi": {
            "url": "https://www.its.ac.id/inovasi/",
            "label": "Inovasi",
            "subpages": [
                "https://www.its.ac.id/inovasi/inkubator/",
                "https://www.its.ac.id/inovasi/startup/",
                "https://www.its.ac.id/inovasi/teknologi/",
                "https://www.its.ac.id/inovasi/paten/",
            ]
        },
        "inisiatif": {
            "url": "https://www.its.ac.id/inisiatif/",
            "label": "Inisiatif",
            "subpages": [
                "https://www.its.ac.id/inisiatif/global/",
                "https://www.its.ac.id/inisiatif/sustainability/",
                "https://www.its.ac.id/inisiatif/smart-campus/",
                "https://www.its.ac.id/inisiatif/entrepreneurship/",
            ]
        },
        "layanan": {
            "url": "https://www.its.ac.id/layanan/",
            "label": "Layanan",
            "subpages": [
                "https://www.its.ac.id/layanan/akademik/",
                "https://www.its.ac.id/layanan/perpustakaan/",
                "https://www.its.ac.id/layanan/keuangan/",
                "https://www.its.ac.id/layanan/asrama/",
                "https://www.its.ac.id/layanan/karir/",
            ]
        },
        "berita": {
            "url": "https://www.its.ac.id/news/",
            "label": "Berita",
            "subpages": [
                "https://www.its.ac.id/news/pengumuman/",
                "https://www.its.ac.id/news/event/",
                "https://www.its.ac.id/news/prestasi/",
                "https://www.its.ac.id/news/press-release/",
            ]
        },
    }
    
    # Kategori otomatis
    CATEGORIES = {
        "academic": ["kuliah", "mata kuliah", "sks", "semester", "jadwal", "kurikulum", "akademik", "ujian"],
        "research": ["riset", "penelitian", "jurnal", "publikasi", "laboratorium", "hibah", "repository"],
        "innovation": ["inovasi", "startup", "inkubator", "paten", "teknologi", "bisnis"],
        "scholarship": ["beasiswa", "funding", "biaya", "bantuan", "kuliah gratis"],
        "announcement": ["pengumuman", "info", "informasi", "update", "terbaru"],
        "achievement": ["prestasi", "juara", "menang", "penghargaan", "lomba", "kompetisi"],
        "event": ["event", "acara", "seminar", "workshop", "webinar", "konferensi"],
        "student": ["mahasiswa", "organisasi", "bem", "hima", "kegiatan", "ukm"],
        "admission": ["pendaftaran", "registrasi", "jalur masuk", "snmptn", "sbmptn"],
        "service": ["layanan", "perpustakaan", "asrama", "kesehatan", "karir"],
    }
    
    def __init__(self, delay: int = 3, supabase_url: str = None, supabase_key: str = None):
        self.delay = delay
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "id,en-US;q=0.9,en;q=0.8",
        })
        
        self.scraped_urls: Set[str] = set()
        self.results: List[ScrapedContent] = []
        
        # Setup Supabase
        self.supabase = None
        if HAS_SUPABASE and supabase_url and supabase_key:
            try:
                self.supabase = create_client(supabase_url, supabase_key)
                print("✅ Connected to Supabase")
            except Exception as e:
                print(f"⚠️ Supabase connection failed: {e}")
    
    def _rate_limit(self):
        """Respectful rate limiting"""
        time.sleep(self.delay)
    
    def _fetch(self, url: str) -> Optional[BeautifulSoup]:
        """Fetch and parse webpage"""
        try:
            print(f"🔍 Fetching: {url}")
            response = self.session.get(url, timeout=30)
            response.raise_for_status()
            return BeautifulSoup(response.content, "html.parser")
        except Exception as e:
            print(f"❌ Error fetching {url}: {e}")
            return None
    
    def _generate_id(self, url: str, title: str) -> str:
        """Generate unique ID"""
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        url_hash = str(hash(url) % 10000)
        return f"its_{timestamp}_{url_hash}"
    
    def _auto_categorize(self, title: str, content: str) -> tuple:
        """Auto-categorize content"""
        text = f"{title} {content}".lower()
        
        for category, keywords in self.CATEGORIES.items():
            for keyword in keywords:
                if keyword in text:
                    return category, "auto-detected"
        
        return "general", "auto-detected"
    
    def _extract_date(self, soup: BeautifulSoup) -> Optional[str]:
        """Extract publication date"""
        # Try common date patterns
        date_selectors = [
            "time",
            ".date",
            ".published",
            ".entry-date",
            "[datetime]",
            "meta[property='article:published_time']",
        ]
        
        for selector in date_selectors:
            element = soup.select_one(selector)
            if element:
                if element.name == "meta":
                    return element.get("content")
                return element.get_text(strip=True)
        
        return None
    
    def _extract_author(self, soup: BeautifulSoup) -> Optional[str]:
        """Extract author name"""
        author_selectors = [
            ".author",
            ".byline",
            ".entry-author",
            "meta[name='author']",
        ]
        
        for selector in author_selectors:
            element = soup.select_one(selector)
            if element:
                if element.name == "meta":
                    return element.get("content")
                return element.get_text(strip=True)
        
        return None
    
    def scrape_news_section(self, pages: int = 3) -> List[ScrapedContent]:
        """Scrape Berita section"""
        print("\n📰 Scraping: BERITA section")
        base_url = "https://www.its.ac.id/news/"
        
        for page in range(1, pages + 1):
            url = f"{base_url}page/{page}/" if page > 1 else base_url
            soup = self._fetch(url)
            if not soup:
                continue
            
            # Find article cards
            articles = soup.find_all("article") or soup.find_all("div", class_=re.compile("post|news|article"))
            
            for article in articles[:10]:  # Limit per page
                try:
                    link_elem = article.find("a")
                    if not link_elem:
                        continue
                    
                    article_url = link_elem.get("href")
                    if not article_url or article_url in self.scraped_urls:
                        continue
                    
                    # Make absolute URL
                    if not article_url.startswith("http"):
                        article_url = urljoin(self.BASE_URL, article_url)
                    
                    # Get article details
                    title_elem = article.find(["h2", "h3", "h1"]) or article.find("a")
                    title = title_elem.get_text(strip=True) if title_elem else "No Title"
                    
                    content_elem = article.find("p") or article.find("div", class_=re.compile("excerpt|summary"))
                    content = content_elem.get_text(strip=True) if content_elem else ""
                    
                    # Scrape full article for more content
                    full_soup = self._fetch(article_url)
                    if full_soup:
                        full_content_elem = full_soup.find("article") or full_soup.find("main") or full_soup.find("div", class_=re.compile("content|entry"))
                        if full_content_elem:
                            full_content = full_content_elem.get_text(separator="\n", strip=True)
                            if len(full_content) > len(content):
                                content = full_content[:5000]  # Limit content length
                        
                        date = self._extract_date(full_soup)
                        author = self._extract_author(full_soup)
                    else:
                        date = None
                        author = None
                    
                    category, subcategory = self._auto_categorize(title, content)
                    
                    scraped = ScrapedContent(
                        id=self._generate_id(article_url, title),
                        title=title,
                        content=content,
                        url=article_url,
                        source_section="berita",
                        category=category,
                        subcategory=subcategory,
                        published_date=date,
                        author=author,
                        image_url=None,
                        scraped_at=datetime.now().isoformat(),
                        tags=[],
                        metadata={"page": page}
                    )
                    
                    self.results.append(scraped)
                    self.scraped_urls.add(article_url)
                    print(f"  ✅ Scraped: {title[:60]}...")
                    
                    self._rate_limit()
                    
                except Exception as e:
                    print(f"  ⚠️ Error processing article: {e}")
                    continue
        
        return [r for r in self.results if r.source_section == "berita"]
    
    def scrape_section(self, section_key: str) -> List[ScrapedContent]:
        """Scrape a specific ITS section"""
        section = self.ITS_SECTIONS.get(section_key)
        if not section:
            print(f"❌ Unknown section: {section_key}")
            return []
        
        print(f"\n📄 Scraping: {section['label']}")
        
        # Scrape main page
        self._scrape_page(section["url"], section_key, section["label"])
        
        # Scrape subpages
        for subpage_url in section.get("subpages", []):
            self._scrape_page(subpage_url, section_key, section["label"])
        
        return [r for r in self.results if r.source_section == section_key]
    
    def _scrape_page(self, url: str, section_key: str, section_label: str):
        """Scrape a single page"""
        if url in self.scraped_urls:
            return
        
        soup = self._fetch(url)
        if not soup:
            return
        
        try:
            # Extract page title
            title_elem = soup.find("h1") or soup.find("title")
            title = title_elem.get_text(strip=True) if title_elem else section_label
            
            # Extract main content
            content_selectors = [
                "main",
                "article",
                ".content",
                ".entry-content",
                "#content",
                ".page-content",
            ]
            
            content = ""
            for selector in content_selectors:
                elem = soup.select_one(selector)
                if elem:
                    content = elem.get_text(separator="\n", strip=True)
                    break
            
            if not content:
                content = soup.get_text(separator="\n", strip=True)
            
            # Limit content length
            content = content[:5000]
            
            date = self._extract_date(soup)
            author = self._extract_author(soup)
            category, subcategory = self._auto_categorize(title, content)
            
            scraped = ScrapedContent(
                id=self._generate_id(url, title),
                title=title,
                content=content,
                url=url,
                source_section=section_key,
                category=category,
                subcategory=subcategory,
                published_date=date,
                author=author,
                image_url=None,
                scraped_at=datetime.now().isoformat(),
                tags=[],
                metadata={"section_label": section_label}
            )
            
            self.results.append(scraped)
            self.scraped_urls.add(url)
            print(f"  ✅ Scraped: {title[:60]}...")
            
            self._rate_limit()
            
        except Exception as e:
            print(f"  ⚠️ Error scraping page: {e}")
    
    def scrape_all_sections(self) -> List[ScrapedContent]:
        """Scrape ALL ITS sections comprehensively"""
        print("🚀 Starting comprehensive ITS website scraping...")
        print(f"📊 Total sections to scrape: {len(self.ITS_SECTIONS)}")
        
        for section_key in self.ITS_SECTIONS.keys():
            self.scrape_section(section_key)
        
        # Also scrape news section with pagination
        self.scrape_news_section(pages=5)
        
        print(f"\n✅ Scraping complete! Total items: {len(self.results)}")
        return self.results
    
    def save_to_json(self, filename: str = None):
        """Save results to JSON file"""
        if not filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"its_comprehensive_scrape_{timestamp}.json"
        
        output_path = os.path.join(os.path.dirname(__file__), filename)
        
        data = [asdict(item) for item in self.results]
        
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f"💾 Saved to: {output_path}")
        return output_path
    
    def save_to_supabase(self) -> bool:
        """Save results to Supabase database"""
        if not self.supabase:
            print("❌ Supabase not configured")
            return False
        
        print("\n💾 Saving to Supabase...")
        
        try:
            # Prepare data
            data = [asdict(item) for item in self.results]
            
            # Insert in batches
            batch_size = 50
            for i in range(0, len(data), batch_size):
                batch = data[i:i + batch_size]
                self.supabase.table("scraped_its_content").upsert(batch).execute()
                print(f"  ✅ Saved batch {i//batch_size + 1}/{(len(data) + batch_size - 1)//batch_size}")
            
            print(f"✅ All {len(data)} items saved to Supabase")
            return True
            
        except Exception as e:
            print(f"❌ Error saving to Supabase: {e}")
            return False
    
    def get_statistics(self) -> Dict:
        """Get scraping statistics"""
        stats = {
            "total_items": len(self.results),
            "by_section": {},
            "by_category": {},
        }
        
        for item in self.results:
            # By section
            if item.source_section not in stats["by_section"]:
                stats["by_section"][item.source_section] = 0
            stats["by_section"][item.source_section] += 1
            
            # By category
            if item.category not in stats["by_category"]:
                stats["by_category"][item.category] = 0
            stats["by_category"][item.category] += 1
        
        return stats


def main():
    parser = argparse.ArgumentParser(
        description="ITS Comprehensive Web Scraper",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Scrape specific section
  python its_comprehensive_scraper.py --section berita
  
  # Scrape all sections
  python its_comprehensive_scraper.py --all
  
  # Save to Supabase
  python its_comprehensive_scraper.py --all --supabase
  
  # Scrape with custom delay
  python its_comprehensive_scraper.py --all --delay 5
        """
    )
    
    parser.add_argument("--section", choices=list(ITSComprehensiveScraper.ITS_SECTIONS.keys()),
                       help="Scrape specific ITS section")
    parser.add_argument("--all", action="store_true", help="Scrape ALL ITS sections")
    parser.add_argument("--news-pages", type=int, default=3, help="Number of news pages to scrape")
    parser.add_argument("--delay", type=int, default=3, help="Delay between requests (seconds)")
    parser.add_argument("--json", action="store_true", help="Save results to JSON file")
    parser.add_argument("--supabase", action="store_true", help="Save results to Supabase")
    parser.add_argument("--stats", action="store_true", help="Show statistics")
    
    args = parser.parse_args()
    
    # Get Supabase credentials
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_KEY")
    
    # Initialize scraper
    scraper = ITSComprehensiveScraper(
        delay=args.delay,
        supabase_url=supabase_url if args.supabase else None,
        supabase_key=supabase_key if args.supabase else None
    )
    
    # Execute scraping
    if args.all:
        scraper.scrape_all_sections()
    elif args.section:
        if args.section == "berita":
            scraper.scrape_news_section(pages=args.news_pages)
        else:
            scraper.scrape_section(args.section)
    else:
        parser.print_help()
        return
    
    # Save results
    if args.json:
        scraper.save_to_json()
    
    if args.supabase:
        scraper.save_to_supabase()
    
    # Show statistics
    if args.stats or args.all:
        stats = scraper.get_statistics()
        print("\n" + "="*50)
        print("📊 SCRAPING STATISTICS")
        print("="*50)
        print(f"Total Items: {stats['total_items']}")
        print("\nBy Section:")
        for section, count in sorted(stats["by_section"].items(), key=lambda x: x[1], reverse=True):
            print(f"  - {section}: {count}")
        print("\nBy Category:")
        for category, count in sorted(stats["by_category"].items(), key=lambda x: x[1], reverse=True):
            print(f"  - {category}: {count}")


if __name__ == "__main__":
    main()
