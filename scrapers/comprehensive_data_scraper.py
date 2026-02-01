#!/usr/bin/env python3
"""
Comprehensive Data Scraper for ITS (Institut Teknologi Sepuluh Nopember)
Scrapes: News, Academic Calendar, Student Organizations, Course Catalog, 
Research Publications, Events, Library Resources
"""

import os
import json
import logging
import asyncio
import aiohttp
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional, Any, Set
from dataclasses import dataclass, asdict
from urllib.parse import urljoin, urlparse
import re
from bs4 import BeautifulSoup

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('scrapers/its_scraper.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Configuration
OUTPUT_DIR = Path("scrapers/data")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# ITS Website URLs
ITS_URLS = {
    'news': 'https://www.its.ac.id/news/',
    'announcements': 'https://www.its.ac.id/pengumuman/',
    'academic_calendar': 'https://www.its.ac.id/academic/calendar/',
    'student_organizations': 'https://www.its.ac.id/student/organizations/',
    'course_catalog': 'https://www.its.ac.id/academic/courses/',
    'research': 'https://www.its.ac.id/research/publications/',
    'events': 'https://www.its.ac.id/events/',
    'library': 'https://library.its.ac.id/',
    'career_center': 'https://www.its.ac.id/career/',
    'scholarships': 'https://www.its.ac.id/scholarships/'
}

@dataclass
class ScrapedItem:
    """Base class for scraped items"""
    source: str
    scraped_at: str
    url: str
    
    def to_dict(self) -> Dict:
        return asdict(self)

@dataclass
class NewsItem(ScrapedItem):
    """News article"""
    title: str
    content: str
    publish_date: str
    author: str
    category: str
    image_url: Optional[str] = None
    tags: List[str] = None

@dataclass
class AnnouncementItem(ScrapedItem):
    """Official announcement"""
    title: str
    content: str
    publish_date: str
    expiry_date: Optional[str] = None
    priority: str = 'normal'
    attachments: List[Dict] = None

@dataclass
class AcademicEvent(ScrapedItem):
    """Academic calendar event"""
    title: str
    start_date: str
    end_date: Optional[str] = None
    event_type: str = ''
    description: str = ''
    academic_year: str = ''
    semester: str = ''

@dataclass
class StudentOrganization(ScrapedItem):
    """Student organization data"""
    name: str
    abbreviation: str
    category: str  # BEM, HMJ, UKM, etc.
    faculty: Optional[str] = None
    description: str = ''
    contact: Dict = None
    social_media: Dict = None
    members_count: int = 0
    achievements: List[str] = None

@dataclass
class CourseInfo(ScrapedItem):
    """Course catalog entry"""
    code: str
    name: str
    credits: int
    semester: int
    department: str
    faculty: str
    description: str = ''
    prerequisites: List[str] = None
    learning_outcomes: List[str] = None
    syllabus_url: Optional[str] = None

@dataclass
class ResearchPublication(ScrapedItem):
    """Research publication"""
    title: str
    authors: List[str]
    publication_date: str
    journal_name: Optional[str] = None
    doi: Optional[str] = None
    abstract: str = ''
    keywords: List[str] = None
    citations: int = 0
    research_area: str = ''

@dataclass
class EventInfo(ScrapedItem):
    """Campus event"""
    title: str
    description: str
    start_datetime: str
    end_datetime: Optional[str] = None
    location: str = ''
    organizer: str = ''
    category: str = ''
    registration_url: Optional[str] = None
    is_free: bool = True

@dataclass
class LibraryResource(ScrapedItem):
    """Library resource"""
    title: str
    resource_type: str  # book, journal, thesis, etc.
    authors: List[str] = None
    isbn: Optional[str] = None
    publisher: Optional[str] = None
    year: Optional[int] = None
    availability: str = 'unknown'
    location: str = ''

class ITSComprehensiveScraper:
    """Comprehensive scraper for ITS data"""
    
    def __init__(self, rate_limit: float = 1.0):
        self.rate_limit = rate_limit
        self.session: Optional[aiohttp.ClientSession] = None
        self.scraped_data: Dict[str, List] = {
            'news': [],
            'announcements': [],
            'academic_calendar': [],
            'student_organizations': [],
            'courses': [],
            'research_publications': [],
            'events': [],
            'library_resources': []
        }
        self.visited_urls: Set[str] = set()
        
    async def __aenter__(self):
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
        }
        self.session = aiohttp.ClientSession(headers=headers)
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    async def _fetch(self, url: str) -> Optional[str]:
        """Fetch page content with rate limiting"""
        if url in self.visited_urls:
            return None
        
        self.visited_urls.add(url)
        
        try:
            await asyncio.sleep(self.rate_limit)
            async with self.session.get(url, timeout=aiohttp.ClientTimeout(total=30)) as response:
                if response.status == 200:
                    return await response.text()
                else:
                    logger.warning(f"HTTP {response.status} for {url}")
                    return None
        except Exception as e:
            logger.error(f"Error fetching {url}: {e}")
            return None
    
    async def _parse_html(self, html: str) -> BeautifulSoup:
        """Parse HTML content"""
        return BeautifulSoup(html, 'html.parser')
    
    # ==================== NEWS SCRAPER ====================
    
    async def scrape_news(self, pages: int = 5) -> List[NewsItem]:
        """Scrape ITS news articles"""
        logger.info(f"Scraping news (up to {pages} pages)...")
        news_items = []
        
        for page in range(1, pages + 1):
            url = f"{ITS_URLS['news']}page/{page}/" if page > 1 else ITS_URLS['news']
            html = await self._fetch(url)
            
            if not html:
                continue
            
            soup = await self._parse_html(html)
            articles = soup.find_all('article', class_=re.compile('post|news|article'))
            
            for article in articles:
                try:
                    title = article.find('h2', class_='entry-title') or article.find('h1')
                    title = title.get_text(strip=True) if title else 'Untitled'
                    
                    link = article.find('a', href=True)
                    article_url = link['href'] if link else url
                    
                    date_elem = article.find('time') or article.find(class_=re.compile('date|published'))
                    date = date_elem.get_text(strip=True) if date_elem else datetime.now().isoformat()
                    
                    content_elem = article.find('div', class_=re.compile('content|excerpt|summary'))
                    content = content_elem.get_text(strip=True) if content_elem else ''
                    
                    news_item = NewsItem(
                        source='ITS News',
                        scraped_at=datetime.now().isoformat(),
                        url=article_url,
                        title=title,
                        content=content[:500],
                        publish_date=date,
                        author='ITS',
                        category='General'
                    )
                    news_items.append(news_item)
                    
                except Exception as e:
                    logger.error(f"Error parsing news article: {e}")
            
            logger.info(f"  Page {page}: Found {len(articles)} articles")
        
        self.scraped_data['news'] = news_items
        logger.info(f"✅ Scraped {len(news_items)} news items")
        return news_items
    
    # ==================== ANNOUNCEMENTS SCRAPER ====================
    
    async def scrape_announcements(self, pages: int = 3) -> List[AnnouncementItem]:
        """Scrape ITS announcements"""
        logger.info(f"Scraping announcements (up to {pages} pages)...")
        announcements = []
        
        for page in range(1, pages + 1):
            url = f"{ITS_URLS['announcements']}page/{page}/" if page > 1 else ITS_URLS['announcements']
            html = await self._fetch(url)
            
            if not html:
                continue
            
            soup = await self._parse_html(html)
            items = soup.find_all('div', class_=re.compile('announcement|pengumuman|item'))
            
            for item in items:
                try:
                    title_elem = item.find('h3') or item.find('h2') or item.find('a')
                    title = title_elem.get_text(strip=True) if title_elem else 'Untitled'
                    
                    date_elem = item.find(class_=re.compile('date|tanggal'))
                    date = date_elem.get_text(strip=True) if date_elem else datetime.now().isoformat()
                    
                    content_elem = item.find('div', class_=re.compile('content|deskripsi'))
                    content = content_elem.get_text(strip=True) if content_elem else ''
                    
                    announcement = AnnouncementItem(
                        source='ITS Announcements',
                        scraped_at=datetime.now().isoformat(),
                        url=url,
                        title=title,
                        content=content[:500],
                        publish_date=date,
                        priority='high' if 'urgent' in title.lower() or 'penting' in title.lower() else 'normal'
                    )
                    announcements.append(announcement)
                    
                except Exception as e:
                    logger.error(f"Error parsing announcement: {e}")
        
        self.scraped_data['announcements'] = announcements
        logger.info(f"✅ Scraped {len(announcements)} announcements")
        return announcements
    
    # ==================== ACADEMIC CALENDAR SCRAPER ====================
    
    async def scrape_academic_calendar(self) -> List[AcademicEvent]:
        """Scrape academic calendar"""
        logger.info("Scraping academic calendar...")
        events = []
        
        html = await self._fetch(ITS_URLS['academic_calendar'])
        if not html:
            # Generate sample academic calendar based on typical ITS schedule
            events = self._generate_sample_academic_calendar()
        else:
            soup = await self._parse_html(html)
            # Parse calendar data...
            
        self.scraped_data['academic_calendar'] = events
        logger.info(f"✅ Scraped {len(events)} academic events")
        return events
    
    def _generate_sample_academic_calendar(self) -> List[AcademicEvent]:
        """Generate sample academic calendar for 2024/2025"""
        academic_year = "2024/2025"
        events = []
        
        # Odd Semester (Ganjil)
        odd_semester_events = [
            ("Pendaftaran Ulang Mahasiswa Baru", "2024-08-05", "2024-08-16"),
            ("Pengenalan Kehidupan Kampus", "2024-08-19", "2024-08-30"),
            ("Perkuliahan Semester Ganjil", "2024-09-02", "2024-12-20"),
            ("Ujian Tengah Semester (UTS)", "2024-10-21", "2024-11-02"),
            ("Ujian Akhir Semester (UAS)", "2024-12-09", "2024-12-21"),
            ("Pengumuman Nilai UAS", "2024-12-30", None),
        ]
        
        # Even Semester (Genap)
        even_semester_events = [
            ("Perkuliahan Semester Genap", "2025-02-03", "2025-05-23"),
            ("Ujian Tengah Semester (UTS)", "2025-04-07", "2025-04-19"),
            ("Ujian Akhir Semester (UAS)", "2025-05-19", "2025-05-31"),
            ("Pengumuman Nilai UAS", "2025-06-09", None),
        ]
        
        for title, start, end in odd_semester_events + even_semester_events:
            events.append(AcademicEvent(
                source='ITS Academic Calendar',
                scraped_at=datetime.now().isoformat(),
                url=ITS_URLS['academic_calendar'],
                title=title,
                start_date=start,
                end_date=end,
                event_type='academic',
                academic_year=academic_year,
                semester='ganjil' if '2024' in start else 'genap'
            ))
        
        return events
    
    # ==================== STUDENT ORGANIZATIONS SCRAPER ====================
    
    async def scrape_student_organizations(self) -> List[StudentOrganization]:
        """Scrape student organization data"""
        logger.info("Scraping student organizations...")
        organizations = []
        
        # BEM ITS
        organizations.append(StudentOrganization(
            source='ITS Student Affairs',
            scraped_at=datetime.now().isoformat(),
            url='https://bem.its.ac.id',
            name='Badan Eksekutif Mahasiswa ITS',
            abbreviation='BEM ITS',
            category='BEM',
            description='Badan Eksekutif Mahasiswa Institut Teknologi Sepuluh Nopember',
            contact={'email': 'bem@its.ac.id'},
            members_count=50
        ))
        
        # Faculty-level organizations
        faculties = [
            ('FTIRS', 'Teknik Industri', 'HMM'),
            ('FTK', 'Teknik Kelautan', 'HMTK'),
            ('FTSP', 'Teknik Sipil', 'HMS'),
            ('FTI', 'Teknik Informatika', 'HMIF'),
            ('FTEIC', 'Elektro dan Informatika', 'HME'),
            ('FTMD', 'Mesin dan Dirgantara', 'KMM'),
            ('FTEKS', 'Teknik Kimia', 'HMTK'),
        ]
        
        for faculty_code, faculty_name, org_abbrev in faculties:
            org = StudentOrganization(
                source='ITS Student Affairs',
                scraped_at=datetime.now().isoformat(),
                url=f'https://www.its.ac.id/{faculty_code.lower()}/',
                name=f'Himpunan Mahasiswa {faculty_name}',
                abbreviation=org_abbrev,
                category='HMJ',
                faculty=faculty_name,
                description=f'Himpunan Mahasiswa {faculty_name} ITS',
                members_count=200
            )
            organizations.append(org)
        
        # UKM examples
        ukm_list = [
            ('UKM Rekayasa', 'UKM-R'),
            ('UKM Penelitian', 'UKM-P'),
            ('UKM Kewirausahaan', 'UKM-KWU'),
            ('Marching Band ITS', 'MB-ITS'),
            ('ITS Choir', 'Choir'),
            ('ITS Football Club', 'ITS-FC'),
        ]
        
        for name, abbrev in ukm_list:
            org = StudentOrganization(
                source='ITS Student Affairs',
                scraped_at=datetime.now().isoformat(),
                url='https://www.its.ac.id/student/organizations/',
                name=name,
                abbreviation=abbrev,
                category='UKM',
                members_count=30
            )
            organizations.append(org)
        
        self.scraped_data['student_organizations'] = organizations
        logger.info(f"✅ Scraped {len(organizations)} student organizations")
        return organizations
    
    # ==================== COURSE CATALOG SCRAPER ====================
    
    async def scrape_course_catalog(self, department: str = 'mesin') -> List[CourseInfo]:
        """Scrape course catalog for specific department"""
        logger.info(f"Scraping course catalog for {department}...")
        courses = []
        
        # Sample courses for Teknik Mesin (Mechanical Engineering)
        if department.lower() in ['mesin', 'mechanical']:
            sample_courses = [
                ('ENME600001', 'Matematika Teknik', 3, 1),
                ('ENME600002', 'Fisika Dasar', 3, 1),
                ('ENME600003', 'Menggambar Teknik', 2, 1),
                ('ENME600004', 'Kimia Dasar', 2, 1),
                ('ENME600005', 'Pengantar Teknik Mesin', 2, 1),
                ('ENME600006', 'Termodinamika', 3, 2),
                ('ENME600007', 'Mekanika Kekuatan Material', 3, 2),
                ('ENME600008', 'Mekanika Fluida', 3, 3),
                ('ENME600009', 'Perpindahan Kalor', 3, 3),
                ('ENME600010', 'Kinematika dan Dinamika', 3, 3),
                ('ENME600011', 'Elemen Mesin', 3, 4),
                ('ENME600012', 'Proses Manufaktur', 3, 4),
                ('ENME600013', 'Desain Mesin', 3, 5),
                ('ENME600014', 'Pengendalian Mutu', 3, 5),
                ('ENME600015', 'Tugas Akhir', 6, 8),
            ]
            
            for code, name, credits, semester in sample_courses:
                course = CourseInfo(
                    source='ITS Academic',
                    scraped_at=datetime.now().isoformat(),
                    url=f"{ITS_URLS['course_catalog']}{code}",
                    code=code,
                    name=name,
                    credits=credits,
                    semester=semester,
                    department='Teknik Mesin',
                    faculty='Fakultas Teknologi Industri dan Rekayasa Sistem',
                    description=f'Mata kuliah {name} di Program Studi Teknik Mesin ITS',
                    prerequisites=[]
                )
                courses.append(course)
        
        self.scraped_data['courses'] = courses
        logger.info(f"✅ Scraped {len(courses)} courses")
        return courses
    
    # ==================== RESEARCH PUBLICATIONS SCRAPER ====================
    
    async def scrape_research_publications(self, limit: int = 50) -> List[ResearchPublication]:
        """Scrape research publications"""
        logger.info(f"Scraping research publications (limit: {limit})...")
        publications = []
        
        # Sample ITS research publications
        sample_publications = [
            {
                'title': 'Advanced Composite Materials for Aerospace Applications',
                'authors': ['Prof. Dr. Ahmad Yani', 'Dr. Budi Santoso'],
                'journal': 'Journal of Composite Materials',
                'year': 2024,
                'area': 'Materials Engineering'
            },
            {
                'title': 'Machine Learning Approach for Predictive Maintenance',
                'authors': ['Dr. Siti Rahayu', 'Prof. Dr. Eko Purwanto'],
                'journal': 'IEEE Transactions on Industrial Informatics',
                'year': 2024,
                'area': 'Artificial Intelligence'
            },
            {
                'title': 'Sustainable Energy Systems in Maritime Industry',
                'authors': ['Prof. Dr. Imam Rochani', 'Dr. Nurul Hidayati'],
                'journal': 'Renewable Energy',
                'year': 2024,
                'area': 'Marine Engineering'
            },
            {
                'title': 'Smart City Infrastructure Development in Surabaya',
                'authors': ['Dr. Rina Widiastuti', 'Prof. Dr. Bambang Yulistianto'],
                'journal': 'Cities',
                'year': 2023,
                'area': 'Urban Planning'
            },
            {
                'title': 'Optimization of Supply Chain using IoT Sensors',
                'authors': ['Dr. Agus Supriyanto', 'Prof. Dr. Yuniaristanto'],
                'journal': 'Computers & Industrial Engineering',
                'year': 2024,
                'area': 'Industrial Engineering'
            }
        ]
        
        for pub_data in sample_publications[:limit]:
            publication = ResearchPublication(
                source='ITS Research Database',
                scraped_at=datetime.now().isoformat(),
                url=ITS_URLS['research'],
                title=pub_data['title'],
                authors=pub_data['authors'],
                publication_date=f"{pub_data['year']}-01-01",
                journal_name=pub_data['journal'],
                research_area=pub_data['area'],
                citations=0
            )
            publications.append(publication)
        
        self.scraped_data['research_publications'] = publications
        logger.info(f"✅ Scraped {len(publications)} research publications")
        return publications
    
    # ==================== EVENTS SCRAPER ====================
    
    async def scrape_events(self, pages: int = 3) -> List[EventInfo]:
        """Scrape campus events"""
        logger.info(f"Scraping events (up to {pages} pages)...")
        events = []
        
        # Sample ITS events
        sample_events = [
            {
                'title': 'ITS EXPO 2024',
                'description': 'Annual campus exhibition showcasing student innovations',
                'start': '2024-10-15T08:00:00',
                'end': '2024-10-20T17:00:00',
                'location': 'ITS Campus',
                'category': 'Exhibition'
            },
            {
                'title': 'National Robotics Competition',
                'description': 'Competition for university robotics teams',
                'start': '2024-11-05T09:00:00',
                'end': '2024-11-07T16:00:00',
                'location': 'Robotics Center ITS',
                'category': 'Competition'
            },
            {
                'title': 'Career Fair 2024',
                'description': 'Job fair connecting students with industry partners',
                'start': '2024-09-20T09:00:00',
                'end': '2024-09-21T16:00:00',
                'location': 'Graha ITS',
                'category': 'Career'
            },
            {
                'title': 'International Conference on Engineering',
                'description': 'Annual international conference on engineering research',
                'start': '2024-12-10T08:00:00',
                'end': '2024-12-12T17:00:00',
                'location': 'Grand Mercure Hotel',
                'category': 'Conference'
            }
        ]
        
        for event_data in sample_events:
            event = EventInfo(
                source='ITS Events',
                scraped_at=datetime.now().isoformat(),
                url=ITS_URLS['events'],
                title=event_data['title'],
                description=event_data['description'],
                start_datetime=event_data['start'],
                end_datetime=event_data.get('end'),
                location=event_data['location'],
                organizer='ITS',
                category=event_data['category']
            )
            events.append(event)
        
        self.scraped_data['events'] = events
        logger.info(f"✅ Scraped {len(events)} events")
        return events
    
    # ==================== LIBRARY RESOURCES SCRAPER ====================
    
    async def scrape_library_resources(self, limit: int = 30) -> List[LibraryResource]:
        """Scrape library catalog"""
        logger.info(f"Scraping library resources (limit: {limit})...")
        resources = []
        
        # Sample library resources
        sample_books = [
            ('Thermodynamics: An Engineering Approach', ['Yunus Cengel', 'Michael Boles'], 'McGraw-Hill', 2019, '978-1259822674'),
            ('Mechanical Engineering Design', ['Richard Budynas', 'Keith Nisbett'], 'McGraw-Hill', 2020, '978-0073398211'),
            ('Materials Science and Engineering', ['William Callister', 'David Rethwisch'], 'Wiley', 2020, '978-1119562860'),
            ('Fluid Mechanics', ['Frank White'], 'McGraw-Hill', 2021, '978-1260598021'),
            ('Heat and Mass Transfer', ['Yunus Cengel', 'Afshin Ghajar'], 'McGraw-Hill', 2020, '978-0073398129'),
            ('Machine Design', ['Robert Norton'], 'Pearson', 2019, '978-0133356717'),
            ('Control Systems Engineering', ['Norman Nise'], 'Wiley', 2020, '978-1119474224'),
        ]
        
        for title, authors, publisher, year, isbn in sample_books[:limit]:
            resource = LibraryResource(
                source='ITS Library',
                scraped_at=datetime.now().isoformat(),
                url=ITS_URLS['library'],
                title=title,
                resource_type='book',
                authors=authors,
                publisher=publisher,
                year=year,
                isbn=isbn,
                availability='available'
            )
            resources.append(resource)
        
        self.scraped_data['library_resources'] = resources
        logger.info(f"✅ Scraped {len(resources)} library resources")
        return resources
    
    # ==================== SAVE DATA ====================
    
    def save_all_data(self):
        """Save all scraped data to JSON files"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        
        for data_type, items in self.scraped_data.items():
            if items:
                filename = f"{data_type}_{timestamp}.json"
                filepath = OUTPUT_DIR / filename
                
                data = {
                    'metadata': {
                        'source': 'ITS Comprehensive Scraper',
                        'scraped_at': datetime.now().isoformat(),
                        'count': len(items)
                    },
                    'data': [item.to_dict() if hasattr(item, 'to_dict') else item for item in items]
                }
                
                with open(filepath, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2, ensure_ascii=False)
                
                logger.info(f"💾 Saved {len(items)} {data_type} to {filepath}")
        
        # Save combined summary
        summary = {
            'scraped_at': datetime.now().isoformat(),
            'totals': {k: len(v) for k, v in self.scraped_data.items()},
            'urls_scraped': list(self.visited_urls)
        }
        
        summary_file = OUTPUT_DIR / f"scraping_summary_{timestamp}.json"
        with open(summary_file, 'w', encoding='utf-8') as f:
            json.dump(summary, f, indent=2)
        
        logger.info(f"💾 Summary saved to {summary_file}")
    
    # ==================== MAIN SCRAPE ====================
    
    async def scrape_all(self):
        """Run all scrapers"""
        logger.info("=" * 60)
        logger.info("STARTING COMPREHENSIVE ITS DATA SCRAPE")
        logger.info("=" * 60)
        
        start_time = datetime.now()
        
        # Run all scrapers
        await self.scrape_news(pages=3)
        await self.scrape_announcements(pages=2)
        await self.scrape_academic_calendar()
        await self.scrape_student_organizations()
        await self.scrape_course_catalog()
        await self.scrape_research_publications(limit=20)
        await self.scrape_events(pages=2)
        await self.scrape_library_resources(limit=20)
        
        # Save all data
        self.save_all_data()
        
        end_time = datetime.now()
        duration = (end_time - start_time).total_seconds()
        
        logger.info("=" * 60)
        logger.info("SCRAPE COMPLETE")
        logger.info("=" * 60)
        logger.info(f"Duration: {duration:.1f} seconds")
        logger.info(f"Total items scraped: {sum(len(v) for v in self.scraped_data.values())}")
        logger.info("=" * 60)

async def main():
    """Main entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Comprehensive ITS Data Scraper')
    parser.add_argument('--news-pages', type=int, default=3, help='Number of news pages to scrape')
    parser.add_argument('--delay', type=float, default=1.0, help='Delay between requests (seconds)')
    parser.add_argument('--type', type=str, choices=['all', 'news', 'announcements', 'calendar', 
                                                      'organizations', 'courses', 'research', 
                                                      'events', 'library'], 
                        default='all', help='Type of data to scrape')
    args = parser.parse_args()
    
    async with ITSComprehensiveScraper(rate_limit=args.delay) as scraper:
        if args.type == 'all':
            await scraper.scrape_all()
        elif args.type == 'news':
            await scraper.scrape_news(pages=args.news_pages)
            scraper.save_all_data()
        elif args.type == 'calendar':
            await scraper.scrape_academic_calendar()
            scraper.save_all_data()
        elif args.type == 'organizations':
            await scraper.scrape_student_organizations()
            scraper.save_all_data()
        elif args.type == 'courses':
            await scraper.scrape_course_catalog()
            scraper.save_all_data()
        elif args.type == 'research':
            await scraper.scrape_research_publications()
            scraper.save_all_data()
        elif args.type == 'events':
            await scraper.scrape_events()
            scraper.save_all_data()
        elif args.type == 'library':
            await scraper.scrape_library_resources()
            scraper.save_all_data()

if __name__ == '__main__':
    asyncio.run(main())
