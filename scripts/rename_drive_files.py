#!/usr/bin/env python3
"""
Google Drive File Renamer
Renames files in Drive according to book titles from CSV database
"""

import os
import csv
import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
import re

# Google Drive API
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('drive_rename.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Configuration
SCOPES = ['https://www.googleapis.com/auth/drive']
CSV_PATH = Path("EBOOK MANAGEMENT SYSTEM - 📚 DATABASE UTAMA.csv")
CREDENTIALS_FILE = Path("credentials.json")
TOKEN_FILE = Path("token.json")
RENAME_LOG = Path("rename_operations.json")

@dataclass
class BookInfo:
    """Book information from CSV"""
    id: str
    drive_id: str
    file_name: str
    title: str
    author: str
    category: str
    extension: str

@dataclass
class RenameOperation:
    """Rename operation record"""
    drive_id: str
    old_name: str
    new_name: str
    status: str
    timestamp: str
    error: Optional[str] = None

class DriveFileRenamer:
    """Renames Google Drive files based on CSV database"""
    
    # Naming patterns
    PATTERNS = {
        'academic': "Buku {index} - {title} - {author}.pdf",
        'regulation': "Peraturan - {title}.pdf",
        'organizational': "ORG - {title}.pdf",
        'general': "Dokumen - {title}.pdf"
    }
    
    def __init__(self):
        self.service = None
        self.books: List[BookInfo] = []
        self.rename_history: List[RenameOperation] = []
        self.index_counter = 1
        
    def authenticate(self) -> bool:
        """Authenticate with Google Drive API"""
        creds = None
        
        # Load existing token
        if TOKEN_FILE.exists():
            creds = Credentials.from_authorized_user_file(str(TOKEN_FILE), SCOPES)
        
        # Refresh or create new credentials
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            elif CREDENTIALS_FILE.exists():
                flow = InstalledAppFlow.from_client_secrets_file(
                    str(CREDENTIALS_FILE), SCOPES)
                creds = flow.run_local_server(port=0)
            else:
                logger.error(f"Credentials file not found: {CREDENTIALS_FILE}")
                return False
            
            # Save token
            with open(TOKEN_FILE, 'w') as token:
                token.write(creds.to_json())
        
        self.service = build('drive', 'v3', credentials=creds)
        logger.info("✅ Successfully authenticated with Google Drive")
        return True
    
    def load_books_from_csv(self) -> int:
        """Load book data from CSV file"""
        self.books = []
        
        try:
            with open(CSV_PATH, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    # Only process PDF files with valid Drive IDs
                    if row.get('EXTENSION', '').lower() == 'pdf' and row.get('DRIVE_ID'):
                        book = BookInfo(
                            id=row['ID'],
                            drive_id=row['DRIVE_ID'],
                            file_name=row.get('FILE_NAME', ''),
                            title=row.get('TITLE', 'Unknown'),
                            author=row.get('AUTHOR', 'Unknown') or 'Unknown',
                            category=row.get('CATEGORY', 'General'),
                            extension='pdf'
                        )
                        self.books.append(book)
            
            logger.info(f"📚 Loaded {len(self.books)} PDF books from CSV")
            return len(self.books)
            
        except Exception as e:
            logger.error(f"❌ Error loading CSV: {e}")
            return 0
    
    def determine_file_type(self, book: BookInfo) -> str:
        """Determine file type category for naming pattern"""
        title_lower = book.title.lower()
        category_lower = book.category.lower()
        
        # Check for regulations
        if any(kw in title_lower for kw in ['peraturan', 'uu ', 'undang-undang', 'rektor', 'statuta']):
            return 'regulation'
        
        # Check for organizational documents
        if any(kw in title_lower for kw in ['organisasi', 'ormawa', 'himpunan', 'ukm', 'bem']):
            return 'organizational'
        
        # Check for academic documents
        if any(kw in title_lower for kw in ['buku', 'panduan', 'modul', 'ebook', 'textbook']):
            return 'academic'
        
        return 'general'
    
    def generate_new_filename(self, book: BookInfo) -> str:
        """Generate new filename based on book info"""
        file_type = self.determine_file_type(book)
        
        # Clean title for filename
        clean_title = self._clean_filename(book.title)
        clean_author = self._clean_filename(book.author)
        
        if file_type == 'academic':
            new_name = f"Buku {self.index_counter:03d} - {clean_title}"
            if clean_author and clean_author != 'Unknown':
                new_name += f" - {clean_author}"
            self.index_counter += 1
        elif file_type == 'regulation':
            new_name = f"Peraturan - {clean_title}"
        elif file_type == 'organizational':
            new_name = f"ORG - {clean_title}"
        else:
            new_name = f"Dokumen - {clean_title}"
        
        # Add extension
        new_name += f".{book.extension}"
        
        return new_name
    
    def _clean_filename(self, text: str) -> str:
        """Clean text for safe filename"""
        if not text:
            return "Unknown"
        
        # Remove invalid filename characters
        text = re.sub(r'[<>:"/\\|?*]', '', text)
        # Replace multiple spaces
        text = re.sub(r'\s+', ' ', text)
        # Limit length
        text = text.strip()[:100]
        return text
    
    def get_drive_file_info(self, drive_id: str) -> Optional[Dict]:
        """Get file info from Google Drive"""
        try:
            file = self.service.files().get(
                fileId=drive_id,
                fields='id, name, mimeType, modifiedTime'
            ).execute()
            return file
        except HttpError as e:
            logger.warning(f"Could not get file info for {drive_id}: {e}")
            return None
    
    def rename_file(self, drive_id: str, new_name: str) -> bool:
        """Rename a file in Google Drive"""
        try:
            # Get current file info
            file_info = self.get_drive_file_info(drive_id)
            if not file_info:
                return False
            
            old_name = file_info['name']
            
            # Check if already renamed
            if old_name == new_name:
                logger.info(f"⏩ Already correctly named: {new_name}")
                return True
            
            # Perform rename
            updated_file = self.service.files().update(
                fileId=drive_id,
                body={'name': new_name}
            ).execute()
            
            logger.info(f"✅ Renamed: '{old_name}' → '{new_name}'")
            
            # Log operation
            operation = RenameOperation(
                drive_id=drive_id,
                old_name=old_name,
                new_name=new_name,
                status='success',
                timestamp=datetime.now().isoformat()
            )
            self.rename_history.append(operation)
            
            return True
            
        except HttpError as e:
            error_msg = str(e)
            logger.error(f"❌ Failed to rename {drive_id}: {error_msg}")
            
            # Log failed operation
            operation = RenameOperation(
                drive_id=drive_id,
                old_name='unknown',
                new_name=new_name,
                status='failed',
                timestamp=datetime.now().isoformat(),
                error=error_msg
            )
            self.rename_history.append(operation)
            
            return False
    
    def preview_renames(self) -> List[Tuple[str, str, str]]:
        """Preview all rename operations without executing"""
        previews = []
        
        for book in self.books:
            new_name = self.generate_new_filename(book)
            previews.append((book.drive_id, book.file_name, new_name))
        
        return previews
    
    def execute_renames(self, dry_run: bool = False) -> Dict[str, int]:
        """Execute all rename operations"""
        stats = {'success': 0, 'failed': 0, 'skipped': 0}
        
        logger.info(f"{'[DRY RUN] ' if dry_run else ''}Starting rename operations...")
        
        for i, book in enumerate(self.books, 1):
            logger.info(f"Processing {i}/{len(self.books)}: {book.title}")
            
            new_name = self.generate_new_filename(book)
            
            if dry_run:
                logger.info(f"  Would rename: '{book.file_name}' → '{new_name}'")
                stats['success'] += 1
            else:
                if self.rename_file(book.drive_id, new_name):
                    stats['success'] += 1
                else:
                    stats['failed'] += 1
        
        # Save rename history
        self._save_rename_history()
        
        return stats
    
    def _save_rename_history(self):
        """Save rename operations to log file"""
        history_data = [
            {
                'drive_id': op.drive_id,
                'old_name': op.old_name,
                'new_name': op.new_name,
                'status': op.status,
                'timestamp': op.timestamp,
                'error': op.error
            }
            for op in self.rename_history
        ]
        
        with open(RENAME_LOG, 'w', encoding='utf-8') as f:
            json.dump(history_data, f, indent=2, ensure_ascii=False)
        
        logger.info(f"💾 Rename history saved to {RENAME_LOG}")
    
    def generate_rename_report(self) -> str:
        """Generate a detailed rename report"""
        report_lines = [
            "=" * 80,
            "GOOGLE DRIVE FILE RENAME REPORT",
            "=" * 80,
            f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
            f"Total books processed: {len(self.books)}",
            f"Total rename operations: {len(self.rename_history)}",
            "",
            "RENAME OPERATIONS:",
            "-" * 80
        ]
        
        for op in self.rename_history:
            status_icon = "✅" if op.status == 'success' else "❌"
            report_lines.append(f"{status_icon} {op.old_name}")
            report_lines.append(f"   → {op.new_name}")
            if op.error:
                report_lines.append(f"   Error: {op.error}")
            report_lines.append("")
        
        report_lines.extend([
            "-" * 80,
            "END OF REPORT"
        ])
        
        return "\n".join(report_lines)
    
    def revert_renames(self, log_file: Optional[Path] = None):
        """Revert renames based on log file"""
        log_file = log_file or RENAME_LOG
        
        if not log_file.exists():
            logger.error(f"Log file not found: {log_file}")
            return
        
        with open(log_file, 'r') as f:
            operations = json.load(f)
        
        logger.info(f"Reverting {len(operations)} rename operations...")
        
        reverted = 0
        failed = 0
        
        for op in operations:
            if op['status'] == 'success':
                try:
                    # Revert to old name
                    self.service.files().update(
                        fileId=op['drive_id'],
                        body={'name': op['old_name']}
                    ).execute()
                    logger.info(f"Reverted: '{op['new_name']}' → '{op['old_name']}'")
                    reverted += 1
                except Exception as e:
                    logger.error(f"Failed to revert {op['drive_id']}: {e}")
                    failed += 1
        
        logger.info(f"Revert complete: {reverted} successful, {failed} failed")

def main():
    """Main entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Rename Google Drive files based on CSV database')
    parser.add_argument('--preview', action='store_true', help='Preview renames without executing')
    parser.add_argument('--dry-run', action='store_true', help='Simulate renames without making changes')
    parser.add_argument('--revert', action='store_true', help='Revert renames from log file')
    parser.add_argument('--limit', type=int, help='Limit number of files to process')
    args = parser.parse_args()
    
    renamer = DriveFileRenamer()
    
    # Authenticate
    if not renamer.authenticate():
        logger.error("Authentication failed")
        return
    
    if args.revert:
        renamer.revert_renames()
        return
    
    # Load books
    count = renamer.load_books_from_csv()
    if count == 0:
        logger.error("No books loaded from CSV")
        return
    
    # Apply limit if specified
    if args.limit:
        renamer.books = renamer.books[:args.limit]
        logger.info(f"Limited to {args.limit} books")
    
    if args.preview or args.dry_run:
        # Preview mode
        print("\n" + "=" * 80)
        print("RENAME PREVIEW")
        print("=" * 80)
        
        previews = renamer.preview_renames()
        for drive_id, old_name, new_name in previews:
            print(f"\nOld: {old_name}")
            print(f"New: {new_name}")
            print(f"ID: {drive_id}")
        
        print(f"\n{'=' * 80}")
        print(f"Total: {len(previews)} files")
        
        if not args.dry_run:
            confirm = input("\nExecute these renames? (yes/no): ")
            if confirm.lower() != 'yes':
                print("Aborted")
                return
    
    # Execute renames
    stats = renamer.execute_renames(dry_run=args.dry_run)
    
    # Print summary
    print("\n" + "=" * 80)
    print("RENAME SUMMARY")
    print("=" * 80)
    print(f"Successful: {stats['success']}")
    print(f"Failed: {stats['failed']}")
    print(f"Skipped: {stats['skipped']}")
    
    if not args.dry_run:
        # Save report
        report = renamer.generate_rename_report()
        report_file = Path(f"rename_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt")
        with open(report_file, 'w', encoding='utf-8') as f:
            f.write(report)
        print(f"\n📄 Report saved to: {report_file}")

if __name__ == '__main__':
    main()
