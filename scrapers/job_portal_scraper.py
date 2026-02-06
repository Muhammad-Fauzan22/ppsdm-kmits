#!/usr/bin/env python3
"""
Job Portal Scraper for Indonesian Job Market
============================================
Scrapes job listings from Kalibrr, Glints, and other Indonesian job portals.
Maps job listings to 9 dimensions (primarily Professional, Leadership, Financial).

Author: PPSDM KMITS LMS
Version: 4.0
"""

import sys
import os
sys.stdout.reconfigure(encoding='utf-8')

import asyncio
import aiohttp
from bs4 import BeautifulSoup
import json
import re
from datetime import datetime
from typing import List, Dict, Optional
from dataclasses import dataclass, asdict

# Supabase Integration
try:
    from supabase import create_client, Client
    HAS_SUPABASE = True
except ImportError:
    HAS_SUPABASE = False


@dataclass
class JobListing:
    """Structured job listing data"""
    id: str
    title: str
    company: str
    location: str
    job_type: str  # full-time, part-time, internship, contract
    description: str
    requirements: List[str]
    skills: List[str]
    salary_range: Optional[str]
    experience_level: str  # entry, mid, senior
    education_required: Optional[str]
    url: str
    source: str  # kalibrr, glints, etc.
    posted_date: Optional[str]
    deadline: Optional[str]
    is_remote: bool = False
    dimensions: List[str] = None  # Mapped to 9 dimensions
    
    def __post_init__(self):
        if self.dimensions is None:
            self.dimensions = []


class JobPortalScraper:
    """
    Scraper for Indonesian job portals.
    Focuses on entry-level and internship positions suitable for ITS students.
    """
    
    # Job portals configuration
    PORTALS = {
        'kalibrr': {
            'base_url': 'https://www.kalibrr.com',
            'search_url': 'https://www.kalibrr.com/k/id/job-board',
            'selectors': {
                'job_card': '[data-testid="job-card"]',
                'title': 'h3',
                'company': '.company-name',
                'location': '.location',
                'description': '.job-description',
                'link': 'a'
            }
        },
        'glints': {
            'base_url': 'https://glints.com',
            'search_url': 'https://glints.com/id/opportunities/jobs',
            'selectors': {
                'job_card': '[data-testid="job-card"]',
                'title': 'h3',
                'company': '.CompanyName',
                'location': '.location',
                'description': '.job-description',
                'link': 'a'
            }
        },
        'jobstreet': {
            'base_url': 'https://www.jobstreet.co.id',
            'search_url': 'https://www.jobstreet.co.id/id/job-search/job-vacancy',
            'selectors': {
                'job_card': '.job-card',
                'title': 'h2',
                'company': '.company',
                'location': '.location',
                'description': '.job-description',
                'link': 'a'
            }
        }
    }
    
    # Keywords for dimension mapping
    DIMENSION_KEYWORDS = {
        'professional': [
            'kerja', 'profesional', 'karir', 'internship', 'magang',
            'full-time', 'part-time', 'kontrak', 'permanent', 'karyawan'
        ],
        'leadership': [
            'leadership', 'kepemimpinan', 'manajemen', 'team lead',
            'supervisor', 'koordinator', 'manager', 'head of'
        ],
        'cognitive': [
            'analyst', 'data', 'research', 'r&d', 'engineering',
            'developer', 'programmer', 'software', 'teknik'
        ],
        'creative': [
            'design', 'creative', 'content', 'marketing', 'media',
            'desain', 'konten', 'kreatif', 'ui/ux', 'graphic'
        ],
        'financial': [
            'finance', 'accounting', 'budget', 'financial', 'investment',
            'akuntansi', 'keuangan', 'perbankan', 'fintech'
        ]
    }
    
    def __init__(self, supabase_url: str = None, supabase_key: str = None):
        self.session: Optional[aiohttp.ClientSession] = None
        self.results: List[JobListing] = []
        
        # Supabase
        self.supabase: Optional[Client] = None
        if HAS_SUPABASE and supabase_url and supabase_key:
            try:
                self.supabase = create_client(supabase_url, supabase_key)
            except Exception as e:
                print(f"Supabase connection failed: {e}")
    
    async def __aenter__(self):
        self.session = aiohttp.ClientSession(
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "id,en-US;q=0.9,en;q=0.8",
            },
            timeout=aiohttp.ClientTimeout(total=30)
        )
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    def _generate_id(self, title: str, company: str, source: str) -> str:
        """Generate unique job ID"""
        timestamp = datetime.now().strftime("%Y%m%d")
        clean_title = re.sub(r'[^a-zA-Z0-9]', '', title.lower())[:20]
        clean_company = re.sub(r'[^a-zA-Z0-9]', '', company.lower())[:10]
        return f"{source}_{timestamp}_{clean_title}_{clean_company}"
    
    def _map_to_dimensions(self, title: str, description: str, skills: List[str]) -> List[str]:
        """Map job to 9 dimensions based on content"""
        text = f"{title} {description} {' '.join(skills)}".lower()
        dimensions = []
        
        for dimension, keywords in self.DIMENSION_KEYWORDS.items():
            for keyword in keywords:
                if keyword in text:
                    dimensions.append(dimension)
                    break
        
        # Default to professional if no match
        if not dimensions:
            dimensions = ['professional']
        
        return list(set(dimensions))  # Remove duplicates
    
    def _parse_salary(self, text: str) -> Optional[str]:
        """Extract salary range from text"""
        # Match patterns like "Rp 5.000.000 - 10.000.000" or "5-10 juta"
        patterns = [
            r'Rp[\s]?([\d\.,]+)[\s]?-[\s]?Rp?[\s]?([\d\.,]+)',
            r'([\d\.,]+)[\s]?-[\s]?([\d\.,]+)[\s]?(juta|jt|million)',
            r'Rp[\s]?([\d\.,]+)[\s]?(juta|jt)',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(0)
        
        return None
    
    def _determine_experience(self, title: str, description: str) -> str:
        """Determine experience level from content"""
        text = f"{title} {description}".lower()
        
        if any(word in text for word in ['fresh graduate', 'entry level', 'junior', '0-1 tahun', 'baru lulus']):
            return 'entry'
        elif any(word in text for word in ['senior', 'lead', 'principal', '5+ tahun', 'manager']):
            return 'senior'
        else:
            return 'mid'
    
    async def scrape_kalibrr(self, max_pages: int = 3) -> List[JobListing]:
        """Scrape Kalibrr job listings"""
        print("🔍 Scraping Kalibrr...")
        jobs = []
        
        for page in range(1, max_pages + 1):
            url = f"{self.PORTALS['kalibrr']['search_url']}?page={page}"
            
            try:
                async with self.session.get(url) as response:
                    if response.status != 200:
                        print(f"  ⚠️ Kalibrr page {page} returned {response.status}")
                        continue
                    
                    html = await response.text()
                    soup = BeautifulSoup(html, 'html.parser')
                    
                    # Find job cards
                    job_cards = soup.find_all(attrs={"data-testid": "job-card"})
                    
                    for card in job_cards[:10]:  # Limit per page
                        try:
                            title_elem = card.find('h3')
                            title = title_elem.get_text(strip=True) if title_elem else "Unknown"
                            
                            company_elem = card.find(class_='company-name') or card.find(attrs={"data-testid": "company-name"})
                            company = company_elem.get_text(strip=True) if company_elem else "Unknown"
                            
                            location_elem = card.find(class_='location') or card.find(attrs={"data-testid": "location"})
                            location = location_elem.get_text(strip=True) if location_elem else "Indonesia"
                            
                            link_elem = card.find('a', href=True)
                            job_url = link_elem['href'] if link_elem else ""
                            if job_url and not job_url.startswith('http'):
                                job_url = f"{self.PORTALS['kalibrr']['base_url']}{job_url}"
                            
                            # Get detailed description
                            description = ""
                            requirements = []
                            if job_url:
                                try:
                                    async with self.session.get(job_url) as detail_response:
                                        if detail_response.status == 200:
                                            detail_html = await detail_response.text()
                                            detail_soup = BeautifulSoup(detail_html, 'html.parser')
                                            
                                            desc_elem = detail_soup.find(attrs={"data-testid": "job-description"})
                                            if desc_elem:
                                                description = desc_elem.get_text(separator='\n', strip=True)
                                            
                                            # Extract requirements
                                            req_elem = detail_soup.find(attrs={"data-testid": "requirements"})
                                            if req_elem:
                                                req_text = req_elem.get_text(separator='\n', strip=True)
                                                requirements = [r.strip() for r in req_text.split('\n') if r.strip()]
                                            
                                            await asyncio.sleep(1)  # Rate limiting
                                except Exception as e:
                                    print(f"  ⚠️ Error fetching job details: {e}")
                            
                            # Create job listing
                            job = JobListing(
                                id=self._generate_id(title, company, 'kalibrr'),
                                title=title,
                                company=company,
                                location=location,
                                job_type='full-time',  # Default, can be improved
                                description=description[:1000],
                                requirements=requirements[:10],
                                skills=[],  # Extract from description
                                salary_range=None,
                                experience_level=self._determine_experience(title, description),
                                education_required=None,
                                url=job_url,
                                source='kalibrr',
                                posted_date=datetime.now().isoformat(),
                                deadline=None,
                                is_remote='remote' in description.lower() or 'wfh' in description.lower(),
                                dimensions=self._map_to_dimensions(title, description, [])
                            )
                            
                            jobs.append(job)
                            print(f"  ✅ {title[:50]}... @ {company[:30]}")
                            
                        except Exception as e:
                            print(f"  ⚠️ Error parsing job card: {e}")
                            continue
                    
                    print(f"  📄 Page {page}: {len(job_cards)} jobs found")
                    
            except Exception as e:
                print(f"  ❌ Error scraping Kalibrr page {page}: {e}")
                continue
            
            await asyncio.sleep(2)  # Rate limiting between pages
        
        return jobs
    
    async def scrape_glints(self, max_pages: int = 3) -> List[JobListing]:
        """Scrape Glints job listings"""
        print("🔍 Scraping Glints...")
        jobs = []
        
        # Glints uses JavaScript rendering, so we'll use a different approach
        # For now, return empty list - in production, use Selenium or API
        print("  ℹ️ Glints requires JavaScript rendering - using API fallback")
        
        # TODO: Implement Glints API or Selenium-based scraping
        # For now, this is a placeholder
        
        return jobs
    
    async def scrape_all(self, max_pages_per_portal: int = 3) -> List[JobListing]:
        """Scrape all job portals"""
        print("🚀 Starting job portal scraping...")
        
        # Scrape Kalibrr
        kalibrr_jobs = await self.scrape_kalibrr(max_pages_per_portal)
        self.results.extend(kalibrr_jobs)
        
        # Scrape Glints (placeholder)
        glints_jobs = await self.scrape_glints(max_pages_per_portal)
        self.results.extend(glints_jobs)
        
        print(f"\n✅ Total jobs scraped: {len(self.results)}")
        return self.results
    
    def save_to_json(self, filename: str = None):
        """Save results to JSON file"""
        if not filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"jobs_scrape_{timestamp}.json"
        
        data = [asdict(job) for job in self.results]
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f"💾 Saved to: {filename}")
        return filename
    
    def save_to_supabase(self) -> bool:
        """Save jobs to Supabase"""
        if not self.supabase:
            print("❌ Supabase not configured")
            return False
        
        print("\n💾 Saving to Supabase...")
        
        try:
            # Prepare data for scraped_content table
            content_data = []
            dimension_mappings = []
            
            for job in self.results:
                # Main content record
                content_record = {
                    'source_url': job.url,
                    'title': job.title,
                    'description': job.description,
                    'content_type': 'job',
                    'author': job.company,
                    'metadata': {
                        'location': job.location,
                        'job_type': job.job_type,
                        'experience_level': job.experience_level,
                        'requirements': job.requirements,
                        'skills': job.skills,
                        'salary_range': job.salary_range,
                        'is_remote': job.is_remote,
                        'source': job.source
                    },
                    'language': 'id',
                    'processing_status': 'ready'
                }
                content_data.append(content_record)
                
                # Dimension mappings
                for dimension in job.dimensions:
                    dimension_mappings.append({
                        'content_id': job.id,  # This will need to be updated after insert
                        'dimension': dimension,
                        'confidence': 80.0,
                        'mapped_by': 'auto'
                    })
            
            # Insert in batches
            batch_size = 50
            for i in range(0, len(content_data), batch_size):
                batch = content_data[i:i + batch_size]
                result = self.supabase.table('scraped_content').upsert(batch).execute()
                print(f"  ✅ Saved batch {i//batch_size + 1}/{(len(content_data) + batch_size - 1)//batch_size}")
            
            print(f"✅ All {len(content_data)} jobs saved to Supabase")
            return True
            
        except Exception as e:
            print(f"❌ Error saving to Supabase: {e}")
            return False
    
    def get_statistics(self) -> Dict:
        """Get scraping statistics"""
        by_dimension = {}
        by_source = {}
        by_experience = {}
        
        for job in self.results:
            # By dimension
            for dim in job.dimensions:
                by_dimension[dim] = by_dimension.get(dim, 0) + 1
            
            # By source
            by_source[job.source] = by_source.get(job.source, 0) + 1
            
            # By experience
            by_experience[job.experience_level] = by_experience.get(job.experience_level, 0) + 1
        
        return {
            'total_jobs': len(self.results),
            'by_dimension': by_dimension,
            'by_source': by_source,
            'by_experience': by_experience
        }


async def main():
    """Main execution"""
    # Get Supabase credentials
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_KEY")
    
    async with JobPortalScraper(supabase_url, supabase_key) as scraper:
        # Scrape jobs
        jobs = await scraper.scrape_all(max_pages_per_portal=2)
        
        # Save results
        scraper.save_to_json()
        
        if supabase_url and supabase_key:
            scraper.save_to_supabase()
        
        # Print statistics
        stats = scraper.get_statistics()
        print("\n" + "="*50)
        print("📊 JOB SCRAPING STATISTICS")
        print("="*50)
        print(f"Total Jobs: {stats['total_jobs']}")
        print(f"\nBy Dimension:")
        for dim, count in sorted(stats['by_dimension'].items(), key=lambda x: x[1], reverse=True):
            print(f"  - {dim}: {count}")
        print(f"\nBy Experience:")
        for exp, count in stats['by_experience'].items():
            print(f"  - {exp}: {count}")


if __name__ == "__main__":
    asyncio.run(main())
