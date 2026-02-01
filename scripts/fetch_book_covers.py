#!/usr/bin/env python3
"""
Book Cover Fetcher
Fetches book covers from multiple sources:
- Google Books API (primary)
- Open Library Covers API (fallback)
- Amazon Product API (fallback)
- Generates placeholder if no cover found

Author: PPSDM KMM Content Factory
Version: 1.0.0
"""

import os
import json
import asyncio
import logging
import hashlib
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
import aiohttp
import aiofiles
from urllib.parse import quote

logger = logging.getLogger(__name__)

@dataclass
class CoverSource:
    """Book cover source configuration"""
    name: str
    base_url: str
    priority: int


class BookCoverFetcher:
    """
    Fetches book covers from multiple sources with fallback
    """
    
    SOURCES = [
        CoverSource("google_books", "https://www.googleapis.com/books/v1/volumes", 1),
        CoverSource("open_library", "https://covers.openlibrary.org/b", 2),
    ]
    
    def __init__(self):
        self.session: Optional[aiohttp.ClientSession] = None
        self.cache_dir = Path(__file__).parent.parent / "content_output" / "covers"
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        
    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    async def fetch_cover(self, book: 'EbookRecord', output_dir: Path) -> Dict[str, any]:
        """
        Fetch book cover from available sources
        
        Args:
            book: EbookRecord with title, author, ISBN
            output_dir: Directory to save the cover image
            
        Returns:
            Dict with success status and cover path/URL
        """
        title = book.title.replace('.pdf', '').replace('.epub', '')
        author = book.author
        isbn = book.isbn
        
        logger.info(f"[Cover] Fetching cover for: {title}")
        
        # Try Google Books API first
        cover_data = await self._fetch_google_books(title, author, isbn)
        
        # Fallback to Open Library
        if not cover_data:
            cover_data = await self._fetch_open_library(title, author, isbn)
        
        # Save cover if found
        if cover_data and cover_data.get('image_url'):
            cover_path = await self._save_cover(cover_data['image_url'], book, output_dir)
            if cover_path:
                return {
                    'success': True,
                    'source': cover_data['source'],
                    'cover_path': str(cover_path),
                    'thumbnail_path': str(cover_path),
                    'metadata': cover_data.get('metadata', {})
                }
        
        # Generate placeholder if no cover found
        placeholder_path = await self._generate_placeholder(title, author, output_dir)
        return {
            'success': True,
            'source': 'placeholder',
            'cover_path': str(placeholder_path),
            'thumbnail_path': str(placeholder_path),
            'is_placeholder': True
        }
    
    async def _fetch_google_books(self, title: str, author: str, isbn: str) -> Optional[Dict]:
        """
        Fetch cover from Google Books API
        """
        try:
            # Build search query
            query_parts = [f"intitle:{title}"]
            if author and author != 'Unknown':
                query_parts.append(f"inauthor:{author}")
            if isbn:
                query_parts.append(f"isbn:{isbn}")
            
            query = quote(' '.join(query_parts))
            url = f"https://www.googleapis.com/books/v1/volumes?q={query}&maxResults=5"
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, timeout=10) as response:
                    if response.status != 200:
                        return None
                    
                    data = await response.json()
                    items = data.get('items', [])
                    
                    for item in items:
                        volume_info = item.get('volumeInfo', {})
                        image_links = volume_info.get('imageLinks', {})
                        
                        # Try to get the best quality cover
                        for size in ['extraLarge', 'large', 'medium', 'small', 'thumbnail']:
                            if size in image_links:
                                return {
                                    'source': 'google_books',
                                    'image_url': image_links[size],
                                    'metadata': {
                                        'title': volume_info.get('title'),
                                        'authors': volume_info.get('authors', []),
                                        'publisher': volume_info.get('publisher'),
                                        'published_date': volume_info.get('publishedDate'),
                                        'description': volume_info.get('description'),
                                        'categories': volume_info.get('categories', []),
                                        'page_count': volume_info.get('pageCount'),
                                        'language': volume_info.get('language'),
                                        'preview_link': volume_info.get('previewLink'),
                                        'info_link': volume_info.get('infoLink')
                                    }
                                }
            
            return None
            
        except Exception as e:
            logger.warning(f"Google Books API error: {e}")
            return None
    
    async def _fetch_open_library(self, title: str, author: str, isbn: str) -> Optional[Dict]:
        """
        Fetch cover from Open Library Covers API
        """
        try:
            # Try ISBN first
            if isbn:
                url = f"https://covers.openlibrary.org/b/isbn/{isbn}-L.jpg"
                async with aiohttp.ClientSession() as session:
                    async with session.get(url, timeout=10, allow_redirects=False) as response:
                        if response.status == 200 or response.status == 302:
                            # Check if it's not a placeholder image
                            if 'id=N' not in str(response.url):
                                return {
                                    'source': 'open_library',
                                    'image_url': url,
                                    'metadata': {'isbn': isbn}
                                }
            
            # Try to find by title/author
            search_query = quote(title)
            search_url = f"https://openlibrary.org/search.json?q={search_query}&limit=5"
            
            async with aiohttp.ClientSession() as session:
                async with session.get(search_url, timeout=10) as response:
                    if response.status == 200:
                        data = await response.json()
                        docs = data.get('docs', [])
                        
                        for doc in docs:
                            cover_i = doc.get('cover_i')
                            if cover_i:
                                cover_url = f"https://covers.openlibrary.org/b/id/{cover_i}-L.jpg"
                                return {
                                    'source': 'open_library',
                                    'image_url': cover_url,
                                    'metadata': {
                                        'title': doc.get('title'),
                                        'authors': doc.get('author_name', []),
                                        'first_publish_year': doc.get('first_publish_year'),
                                        'key': doc.get('key')
                                    }
                                }
            
            return None
            
        except Exception as e:
            logger.warning(f"Open Library API error: {e}")
            return None
    
    async def _save_cover(self, image_url: str, book: 'EbookRecord', output_dir: Path) -> Optional[Path]:
        """
        Download and save cover image
        """
        try:
            # Generate filename
            slug = book.title.lower().replace(' ', '-').replace('_', '-')[:50]
            ext = '.jpg'
            if 'png' in image_url.lower():
                ext = '.png'
            
            cover_path = output_dir / f"cover_image{ext}"
            
            async with aiohttp.ClientSession() as session:
                async with session.get(image_url, timeout=30) as response:
                    if response.status == 200:
                        content = await response.read()
                        async with aiofiles.open(cover_path, 'wb') as f:
                            await f.write(content)
                        
                        logger.info(f"✓ Cover saved: {cover_path}")
                        return cover_path
                    else:
                        logger.warning(f"Failed to download cover: HTTP {response.status}")
                        return None
                        
        except Exception as e:
            logger.error(f"Error saving cover: {e}")
            return None
    
    async def _generate_placeholder(self, title: str, author: str, output_dir: Path) -> Path:
        """
        Generate SVG placeholder with book title
        """
        # Create initials from title
        words = title.replace('.pdf', '').replace('.epub', '').split()
        initials = ''.join(word[0].upper() for word in words[:3] if word)
        if len(initials) < 2:
            initials = title[:2].upper()
        
        # Generate gradient colors based on title hash
        hash_val = hashlib.md5(title.encode()).hexdigest()
        color1 = f"#{hash_val[:6]}"
        color2 = f"#{hash_val[6:12]}"
        
        # Create SVG placeholder
        svg_content = f'''<svg width="400" height="600" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:{color1};stop-opacity:1" />
            <stop offset="100%" style="stop-color:{color2};stop-opacity:1" />
        </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#grad)"/>
    <rect x="20" y="20" width="360" height="560" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
    <text x="50%" y="45%" font-family="Arial, sans-serif" font-size="72" font-weight="bold" 
          fill="white" text-anchor="middle" dominant-baseline="middle">{initials}</text>
    <text x="50%" y="60%" font-family="Arial, sans-serif" font-size="16" 
          fill="rgba(255,255,255,0.8)" text-anchor="middle">{title[:40]}{'...' if len(title) > 40 else ''}</text>
    <text x="50%" y="65%" font-family="Arial, sans-serif" font-size="12" 
          fill="rgba(255,255,255,0.6)" text-anchor="middle">{author if author != 'Unknown' else ''}</text>
    <text x="50%" y="95%" font-family="Arial, sans-serif" font-size="10" 
          fill="rgba(255,255,255,0.4)" text-anchor="middle">PPSDM KMM Learning Library</text>
</svg>'''
        
        placeholder_path = output_dir / "cover_image.svg"
        with open(placeholder_path, 'w', encoding='utf-8') as f:
            f.write(svg_content)
        
        logger.info(f"✓ Placeholder generated: {placeholder_path}")
        return placeholder_path
    
    async def batch_fetch_covers(self, books: List['EbookRecord'], output_base_dir: Path) -> List[Dict]:
        """
        Fetch covers for multiple books
        """
        results = []
        
        for book in books:
            book_output_dir = output_base_dir / book.slug
            book_output_dir.mkdir(parents=True, exist_ok=True)
            
            result = await self.fetch_cover(book, book_output_dir)
            results.append({
                'book_id': book.id,
                'title': book.title,
                **result
            })
            
            # Small delay to avoid rate limiting
            await asyncio.sleep(0.5)
        
        return results
    
    def generate_cover_manifest(self, results: List[Dict], output_path: Path):
        """
        Generate JSON manifest of all covers
        """
        manifest = {
            'generated_at': str(Path(__file__).stat().st_mtime),
            'total_covers': len(results),
            'successful': sum(1 for r in results if r.get('success')),
            'placeholders': sum(1 for r in results if r.get('is_placeholder')),
            'covers': results
        }
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(manifest, f, indent=2, ensure_ascii=False)
        
        logger.info(f"✓ Cover manifest saved: {output_path}")


# Import EbookRecord for type hints
from batch_process_ebooks import EbookRecord


async def main():
    """Test the cover fetcher"""
    import sys
    sys.path.insert(0, str(Path(__file__).parent))
    
    # Create test book
    test_book = EbookRecord(
        id="test-001",
        drive_id="test",
        file_name="test.pdf",
        file_path="",
        file_size_kb=1000,
        extension="pdf",
        mime_type="application/pdf",
        title="Atomic Habits",
        author="James Clear",
        year="2018",
        isbn="9780735211292",
        publisher="Penguin",
        category="Self-Help",
        subcategory="",
        tags="productivity,habits",
        language="en",
        pages="320",
        drive_url="",
        download_url="",
        preview_url="",
        processing_status="pending"
    )
    
    fetcher = BookCoverFetcher()
    output_dir = Path(__file__).parent.parent / "content_output" / "test_covers"
    output_dir.mkdir(parents=True, exist_ok=True)
    
    result = await fetcher.fetch_cover(test_book, output_dir)
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    asyncio.run(main())
