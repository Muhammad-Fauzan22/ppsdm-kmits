#!/usr/bin/env python3
"""
Google Drive Uploader Module for PPSDM KMM LMS
Handles automatic folder creation and file uploads for processed books

Author: PPSDM KMM Content Factory
Version: 2.0.0
"""

import os
import json
import time
import logging
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
import mimetypes
import pickle

# Google Drive API imports
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload, MediaIoBaseUpload
from googleapiclient.errors import HttpError
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google.oauth2 import service_account
import io

# Setup logging
logger = logging.getLogger(__name__)

# Folder structure constants
FOLDER_STRUCTURE = {
    "01_Course_Metadata": {
        "description": "Course metadata and configuration files",
        "subfolders": {}
    },
    "02_Modules": {
        "description": "Module definitions and structure",
        "subfolders": {}
    },
    "03_Lessons": {
        "description": "Lesson content organized by module",
        "subfolders": {}  # Will be created dynamically per module
    },
    "04_Quizzes": {
        "description": "Quiz questions and assessments",
        "subfolders": {}
    },
    "05_Assignments": {
        "description": "Practical assignments and projects",
        "subfolders": {}
    },
    "06_Media": {
        "description": "Media files (audio, images, videos)",
        "subfolders": {
            "Audio": {},
            "Images": {},
            "Videos": {}
        }
    },
    "07_Assessments": {
        "description": "Final and module assessments",
        "subfolders": {}
    },
    "08_Exports": {
        "description": "Export packages (SCORM, xAPI)",
        "subfolders": {
            "SCORM": {},
            "xAPI": {}
        }
    }
}


class UploadStatus(Enum):
    """Upload status enumeration"""
    PENDING = "pending"
    UPLOADING = "uploading"
    COMPLETED = "completed"
    FAILED = "failed"
    RETRYING = "retrying"
    SKIPPED = "skipped"


@dataclass
class UploadTask:
    """Represents a single upload task"""
    id: str
    book_id: str
    file_name: str
    file_path: str
    target_folder_id: str
    mime_type: str
    status: UploadStatus = UploadStatus.PENDING
    progress: float = 0.0
    drive_file_id: Optional[str] = None
    drive_file_url: Optional[str] = None
    error_message: Optional[str] = None
    attempts: int = 0
    max_attempts: int = 3
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    file_size: int = 0


@dataclass
class BookFolderStructure:
    """Represents the complete folder structure for a book"""
    book_id: str
    book_title: str
    book_slug: str
    root_folder_id: str
    root_folder_url: str
    folders: Dict[str, str] = field(default_factory=dict)  # folder_name -> folder_id
    created_at: datetime = field(default_factory=datetime.now)
    
    def get_folder_id(self, folder_name: str) -> Optional[str]:
        """Get folder ID by name"""
        return self.folders.get(folder_name)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for storage"""
        return {
            'book_id': self.book_id,
            'book_title': self.book_title,
            'book_slug': self.book_slug,
            'root_folder_id': self.root_folder_id,
            'root_folder_url': self.root_folder_url,
            'folders': self.folders,
            'created_at': self.created_at.isoformat()
        }


class DriveUploader:
    """
    Main class for Google Drive upload operations
    Handles authentication, folder creation, and file uploads
    """
    
    # API Scopes needed
    SCOPES = [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.file'
    ]
    
    # Rate limiting
    RATE_LIMIT_DELAY = 1.0  # seconds between API calls
    MAX_RETRIES = 3
    
    def __init__(self, credentials_path: Optional[str] = None, root_folder_id: Optional[str] = None):
        """
        Initialize DriveUploader
        
        Args:
            credentials_path: Path to service account JSON file
            root_folder_id: Root folder ID for all course content
        """
        self.credentials_path = credentials_path or os.getenv('GOOGLE_SERVICE_ACCOUNT_KEY_PATH')
        self.root_folder_id = root_folder_id or os.getenv('GOOGLE_DRIVE_FOLDER_ID')
        self.service = None
        self._authenticate()
        
        # Track uploads
        self.active_uploads: Dict[str, UploadTask] = {}
        self.upload_history: List[UploadTask] = []
        
        logger.info(f"DriveUploader initialized (root_folder: {self.root_folder_id})")
    
    def _authenticate(self) -> bool:
        """
        Authenticate with Google Drive API using service account
        
        Returns:
            bool: True if authentication successful
        """
        try:
            if not self.credentials_path or not os.path.exists(self.credentials_path):
                logger.error(f"Service account credentials not found: {self.credentials_path}")
                return False
            
            # Load service account credentials
            credentials = service_account.Credentials.from_service_account_file(
                self.credentials_path,
                scopes=self.SCOPES
            )
            
            # Build Drive service
            self.service = build('drive', 'v3', credentials=credentials)
            
            # Test connection
            about = self.service.about().get(fields='user').execute()
            logger.info(f"✓ Authenticated as: {about.get('user', {}).get('displayName', 'Service Account')}")
            
            return True
            
        except Exception as e:
            logger.error(f"Authentication failed: {e}")
            return False
    
    def _rate_limit(self):
        """Apply rate limiting between API calls"""
        time.sleep(self.RATE_LIMIT_DELAY)
    
    def create_folder(self, name: str, parent_id: Optional[str] = None, 
                      description: Optional[str] = None) -> Optional[str]:
        """
        Create a folder in Google Drive
        
        Args:
            name: Folder name
            parent_id: Parent folder ID (optional)
            description: Folder description (optional)
            
        Returns:
            str: Created folder ID or None if failed
        """
        if not self.service:
            logger.error("Drive service not authenticated")
            return None
        
        try:
            self._rate_limit()
            
            metadata = {
                'name': name,
                'mimeType': 'application/vnd.google-apps.folder',
                'description': description or f'Created by PPSDM KMM LMS on {datetime.now().isoformat()}'
            }
            
            if parent_id:
                metadata['parents'] = [parent_id]
            elif self.root_folder_id:
                metadata['parents'] = [self.root_folder_id]
            
            folder = self.service.files().create(body=metadata, fields='id, webViewLink').execute()
            
            folder_id = folder.get('id')
            logger.debug(f"Created folder '{name}' (ID: {folder_id})")
            
            return folder_id
            
        except HttpError as e:
            logger.error(f"Failed to create folder '{name}': {e}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error creating folder '{name}': {e}")
            return None
    
    def create_book_folder(self, book_title: str, book_id: str, 
                           book_slug: Optional[str] = None) -> Optional[BookFolderStructure]:
        """
        Create complete folder structure for a book
        
        Args:
            book_title: Book title
            book_id: Book ID
            book_slug: URL-friendly book slug (optional)
            
        Returns:
            BookFolderStructure: Complete folder structure info
        """
        if not self.service:
            logger.error("Drive service not authenticated")
            return None
        
        # Generate slug if not provided
        if not book_slug:
            book_slug = self._generate_slug(book_title)
        
        # Create root folder name
        root_folder_name = f"{book_slug}_{book_id[:8]}"
        
        logger.info(f"Creating folder structure for: {book_title}")
        
        try:
            # Create root folder
            root_folder_id = self.create_folder(
                name=root_folder_name,
                description=f"Course content for: {book_title}"
            )
            
            if not root_folder_id:
                logger.error("Failed to create root folder")
                return None
            
            root_folder_url = f"https://drive.google.com/drive/folders/{root_folder_id}"
            
            # Initialize folder structure
            folder_structure = BookFolderStructure(
                book_id=book_id,
                book_title=book_title,
                book_slug=book_slug,
                root_folder_id=root_folder_id,
                root_folder_url=root_folder_url,
                folders={'root': root_folder_id}
            )
            
            # Create main folders
            for folder_name, folder_info in FOLDER_STRUCTURE.items():
                folder_id = self.create_folder(
                    name=folder_name,
                    parent_id=root_folder_id,
                    description=folder_info.get('description', '')
                )
                
                if folder_id:
                    folder_structure.folders[folder_name] = folder_id
                    
                    # Create subfolders
                    subfolders = folder_info.get('subfolders', {})
                    for subfolder_name in subfolders:
                        subfolder_id = self.create_folder(
                            name=subfolder_name,
                            parent_id=folder_id,
                            description=f"{subfolder_name} files for {book_title}"
                        )
                        if subfolder_id:
                            folder_structure.folders[f"{folder_name}/{subfolder_name}"] = subfolder_id
            
            logger.info(f"✓ Created folder structure with {len(folder_structure.folders)} folders")
            return folder_structure
            
        except Exception as e:
            logger.error(f"Failed to create folder structure: {e}")
            return None
    
    def upload_file(self, file_path: str, file_name: Optional[str] = None,
                    folder_id: Optional[str] = None, mime_type: Optional[str] = None,
                    description: Optional[str] = None,
                    book_id: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """
        Upload a file to Google Drive
        
        Args:
            file_path: Local file path
            file_name: Target file name (defaults to original filename)
            folder_id: Target folder ID
            mime_type: File MIME type (auto-detected if not provided)
            description: File description
            book_id: Associated book ID for tracking
            
        Returns:
            dict: Upload result with file_id, web_view_link, etc.
        """
        if not self.service:
            logger.error("Drive service not authenticated")
            return None
        
        path = Path(file_path)
        if not path.exists():
            logger.error(f"File not found: {file_path}")
            return None
        
        # Determine file name
        target_name = file_name or path.name
        
        # Determine MIME type
        if not mime_type:
            mime_type, _ = mimetypes.guess_type(str(path))
            if not mime_type:
                mime_type = 'application/octet-stream'
        
        # Create upload task
        task_id = f"{book_id or 'unknown'}_{int(time.time())}_{target_name}"
        task = UploadTask(
            id=task_id,
            book_id=book_id or 'unknown',
            file_name=target_name,
            file_path=str(path),
            target_folder_id=folder_id or self.root_folder_id or '',
            mime_type=mime_type,
            file_size=path.stat().st_size,
            started_at=datetime.now()
        )
        self.active_uploads[task_id] = task
        
        try:
            task.status = UploadStatus.UPLOADING
            self._rate_limit()
            
            # Prepare file metadata
            file_metadata = {
                'name': target_name,
                'description': description or f'Uploaded by PPSDM KMM LMS on {datetime.now().isoformat()}'
            }
            
            if folder_id:
                file_metadata['parents'] = [folder_id]
            elif self.root_folder_id:
                file_metadata['parents'] = [self.root_folder_id]
            
            # Upload with resumable support for large files
            media = MediaFileUpload(
                str(path),
                mimetype=mime_type,
                resumable=True
            )
            
            # Execute upload with retry logic
            file = self._execute_upload_with_retry(file_metadata, media, task)
            
            if file:
                task.status = UploadStatus.COMPLETED
                task.drive_file_id = file.get('id')
                task.drive_file_url = file.get('webViewLink')
                task.completed_at = datetime.now()
                task.progress = 100.0
                
                result = {
                    'file_id': task.drive_file_id,
                    'file_name': target_name,
                    'mime_type': mime_type,
                    'size': task.file_size,
                    'web_view_link': task.drive_file_url,
                    'web_content_link': file.get('webContentLink'),
                    'uploaded_at': task.completed_at.isoformat()
                }
                
                logger.info(f"✓ Uploaded: {target_name} ({self._format_file_size(task.file_size)})")
                return result
            else:
                task.status = UploadStatus.FAILED
                task.error_message = "Upload returned no result"
                return None
                
        except Exception as e:
            task.status = UploadStatus.FAILED
            task.error_message = str(e)
            logger.error(f"Failed to upload {target_name}: {e}")
            return None
        finally:
            # Move to history
            if task_id in self.active_uploads:
                self.upload_history.append(self.active_uploads.pop(task_id))
    
    def _execute_upload_with_retry(self, file_metadata: Dict, media: MediaFileUpload, 
                                   task: UploadTask) -> Optional[Dict]:
        """Execute upload with retry logic"""
        for attempt in range(self.MAX_RETRIES):
            try:
                task.attempts = attempt + 1
                
                request = self.service.files().create(
                    body=file_metadata,
                    media_body=media,
                    fields='id, name, mimeType, size, webViewLink, webContentLink'
                )
                
                # For resumable uploads, handle the response properly
                response = None
                while response is None:
                    status, response = request.next_chunk()
                    if status:
                        task.progress = status.progress() * 100
                
                return response
                
            except HttpError as e:
                if e.resp.status in [500, 502, 503, 504] and attempt < self.MAX_RETRIES - 1:
                    task.status = UploadStatus.RETRYING
                    wait_time = (attempt + 1) * 2
                    logger.warning(f"Upload error (attempt {attempt + 1}), retrying in {wait_time}s...")
                    time.sleep(wait_time)
                    continue
                else:
                    raise
        
        return None
    
    def upload_json(self, data: Dict, file_name: str, folder_id: Optional[str] = None,
                    description: Optional[str] = None, book_id: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """
        Upload JSON data as a file
        
        Args:
            data: JSON data to upload
            file_name: Target file name
            folder_id: Target folder ID
            description: File description
            book_id: Associated book ID
            
        Returns:
            dict: Upload result
        """
        try:
            # Convert to bytes
            json_str = json.dumps(data, indent=2, ensure_ascii=False)
            json_bytes = json_str.encode('utf-8')
            
            # Create in-memory file
            file_metadata = {
                'name': file_name,
                'mimeType': 'application/json',
                'description': description or f'JSON data uploaded by PPSDM KMM LMS'
            }
            
            if folder_id:
                file_metadata['parents'] = [folder_id]
            elif self.root_folder_id:
                file_metadata['parents'] = [self.root_folder_id]
            
            # Use MediaIoBaseUpload for in-memory data
            media = MediaIoBaseUpload(
                io.BytesIO(json_bytes),
                mimetype='application/json',
                resumable=True
            )
            
            self._rate_limit()
            file = self.service.files().create(
                body=file_metadata,
                media_body=media,
                fields='id, name, mimeType, webViewLink, webContentLink'
            ).execute()
            
            logger.info(f"✓ Uploaded JSON: {file_name}")
            
            return {
                'file_id': file.get('id'),
                'file_name': file_name,
                'mime_type': 'application/json',
                'size': len(json_bytes),
                'web_view_link': file.get('webViewLink'),
                'web_content_link': file.get('webContentLink')
            }
            
        except Exception as e:
            logger.error(f"Failed to upload JSON {file_name}: {e}")
            return None
    
    def upload_course_package(self, book_data: Dict, content_files: Dict[str, List[str]],
                              folder_structure: BookFolderStructure) -> Dict[str, Any]:
        """
        Upload complete course package to Google Drive
        
        Args:
            book_data: Book metadata and course info
            content_files: Dictionary of content files by type
            folder_structure: Complete folder structure
            
        Returns:
            dict: Upload summary
        """
        logger.info(f"Uploading course package for: {book_data.get('title', 'Unknown')}")
        
        results = {
            'uploaded_files': [],
            'failed_files': [],
            'total_size': 0,
            'start_time': datetime.now().isoformat()
        }
        
        try:
            # 1. Upload course metadata
            course_metadata = book_data.get('course', {})
            if course_metadata:
                result = self.upload_json(
                    data=course_metadata,
                    file_name='course_info.json',
                    folder_id=folder_structure.get_folder_id('01_Course_Metadata'),
                    description=f"Course metadata for {book_data.get('title')}",
                    book_id=book_data.get('id')
                )
                if result:
                    results['uploaded_files'].append(result)
                    results['total_size'] += result.get('size', 0)
                else:
                    results['failed_files'].append('course_info.json')
            
            # 2. Upload modules
            modules = book_data.get('modules', [])
            if modules:
                result = self.upload_json(
                    data={'modules': modules},
                    file_name='modules.json',
                    folder_id=folder_structure.get_folder_id('02_Modules'),
                    description=f"Module structure for {book_data.get('title')}",
                    book_id=book_data.get('id')
                )
                if result:
                    results['uploaded_files'].append(result)
                    results['total_size'] += result.get('size', 0)
            
            # 3. Upload lessons
            lessons_folder = folder_structure.get_folder_id('03_Lessons')
            if lessons_folder and 'lessons' in content_files:
                for lesson_file in content_files['lessons']:
                    result = self.upload_file(
                        file_path=lesson_file,
                        folder_id=lessons_folder,
                        book_id=book_data.get('id')
                    )
                    if result:
                        results['uploaded_files'].append(result)
                        results['total_size'] += result.get('size', 0)
                    else:
                        results['failed_files'].append(lesson_file)
            
            # 4. Upload quizzes
            quizzes = book_data.get('quizzes', [])
            if quizzes:
                result = self.upload_json(
                    data={'quizzes': quizzes},
                    file_name='quizzes.json',
                    folder_id=folder_structure.get_folder_id('04_Quizzes'),
                    description=f"Quizzes for {book_data.get('title')}",
                    book_id=book_data.get('id')
                )
                if result:
                    results['uploaded_files'].append(result)
                    results['total_size'] += result.get('size', 0)
            
            # 5. Upload assignments
            if 'assignments' in content_files:
                for assignment_file in content_files['assignments']:
                    result = self.upload_file(
                        file_path=assignment_file,
                        folder_id=folder_structure.get_folder_id('05_Assignments'),
                        book_id=book_data.get('id')
                    )
                    if result:
                        results['uploaded_files'].append(result)
                        results['total_size'] += result.get('size', 0)
            
            # 6. Upload media files
            images_folder = folder_structure.get_folder_id('06_Media/Images')
            if images_folder and 'images' in content_files:
                for image_file in content_files['images']:
                    result = self.upload_file(
                        file_path=image_file,
                        folder_id=images_folder,
                        book_id=book_data.get('id')
                    )
                    if result:
                        results['uploaded_files'].append(result)
                        results['total_size'] += result.get('size', 0)
            
            # 7. Upload cover image
            cover_path = book_data.get('cover_image_path')
            if cover_path and images_folder:
                result = self.upload_file(
                    file_path=cover_path,
                    file_name='cover_image.jpg',
                    folder_id=images_folder,
                    description=f"Cover image for {book_data.get('title')}",
                    book_id=book_data.get('id')
                )
                if result:
                    results['uploaded_files'].append(result)
                    results['total_size'] += result.get('size', 0)
            
            # 8. Upload SCORM package if exists
            scorm_folder = folder_structure.get_folder_id('08_Exports/SCORM')
            if scorm_folder and 'scorm' in content_files:
                for scorm_file in content_files['scorm']:
                    result = self.upload_file(
                        file_path=scorm_file,
                        folder_id=scorm_folder,
                        book_id=book_data.get('id')
                    )
                    if result:
                        results['uploaded_files'].append(result)
                        results['total_size'] += result.get('size', 0)
            
            results['end_time'] = datetime.now().isoformat()
            results['folder_structure'] = folder_structure.to_dict()
            
            logger.info(f"✓ Course package uploaded: {len(results['uploaded_files'])} files, "
                       f"{self._format_file_size(results['total_size'])}")
            
            return results
            
        except Exception as e:
            logger.error(f"Failed to upload course package: {e}")
            results['error'] = str(e)
            return results
    
    def sync_local_to_drive(self, book_id: str, local_output_dir: str,
                            folder_structure: BookFolderStructure) -> Dict[str, Any]:
        """
        Sync local files to Google Drive, uploading missing files and updating changed ones
        
        Args:
            book_id: Book ID
            local_output_dir: Local output directory path
            folder_structure: Complete folder structure
            
        Returns:
            dict: Sync summary
        """
        logger.info(f"Syncing local files to Drive for book: {book_id}")
        
        output_path = Path(local_output_dir)
        if not output_path.exists():
            logger.error(f"Output directory not found: {local_output_dir}")
            return {'error': 'Output directory not found'}
        
        results = {
            'uploaded': [],
            'updated': [],
            'skipped': [],
            'failed': []
        }
        
        # Map local directories to Drive folders
        dir_mapping = {
            'course.json': folder_structure.get_folder_id('01_Course_Metadata'),
            'modules.json': folder_structure.get_folder_id('02_Modules'),
            'lessons': folder_structure.get_folder_id('03_Lessons'),
            'quizzes': folder_structure.get_folder_id('04_Quizzes'),
            'assignments': folder_structure.get_folder_id('05_Assignments'),
            'media/images': folder_structure.get_folder_id('06_Media/Images'),
            'media/audio': folder_structure.get_folder_id('06_Media/Audio'),
            'media/videos': folder_structure.get_folder_id('06_Media/Videos'),
            'exports/scorm': folder_structure.get_folder_id('08_Exports/SCORM'),
            'exports/xapi': folder_structure.get_folder_id('08_Exports/xAPI'),
        }
        
        # Walk through local directory
        for local_dir, drive_folder_id in dir_mapping.items():
            if not drive_folder_id:
                continue
                
            local_path = output_path / local_dir
            if not local_path.exists():
                continue
            
            if local_path.is_file():
                # Single file
                files = [local_path]
            else:
                # Directory - get all files
                files = list(local_path.rglob('*'))
                files = [f for f in files if f.is_file()]
            
            for file_path in files:
                # Check if file already exists in Drive
                existing_file = self._find_file_in_folder(drive_folder_id, file_path.name)
                
                if existing_file:
                    # File exists - could check if it needs updating (compare checksums, sizes, etc.)
                    # For now, skip existing files
                    results['skipped'].append(file_path.name)
                else:
                    # Upload new file
                    result = self.upload_file(
                        file_path=str(file_path),
                        folder_id=drive_folder_id,
                        book_id=book_id
                    )
                    if result:
                        results['uploaded'].append(result)
                    else:
                        results['failed'].append(file_path.name)
        
        return results
    
    def _find_file_in_folder(self, folder_id: str, file_name: str) -> Optional[Dict]:
        """Find a file by name in a specific folder"""
        try:
            self._rate_limit()
            
            query = f"name = '{file_name}' and '{folder_id}' in parents and trashed = false"
            results = self.service.files().list(
                q=query,
                spaces='drive',
                fields='files(id, name, modifiedTime, md5Checksum)'
            ).execute()
            
            files = results.get('files', [])
            return files[0] if files else None
            
        except Exception as e:
            logger.error(f"Error finding file {file_name}: {e}")
            return None
    
    def get_folder_contents(self, folder_id: str) -> List[Dict[str, Any]]:
        """
        Get list of files in a folder
        
        Args:
            folder_id: Folder ID
            
        Returns:
            list: List of file metadata
        """
        try:
            self._rate_limit()
            
            query = f"'{folder_id}' in parents and trashed = false"
            results = self.service.files().list(
                q=query,
                spaces='drive',
                fields='files(id, name, mimeType, size, modifiedTime, webViewLink)'
            ).execute()
            
            return results.get('files', [])
            
        except Exception as e:
            logger.error(f"Error getting folder contents: {e}")
            return []
    
    def get_upload_progress(self, book_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Get upload progress for a book or all active uploads
        
        Args:
            book_id: Book ID (optional, returns all if not provided)
            
        Returns:
            dict: Upload progress information
        """
        if book_id:
            tasks = [t for t in self.active_uploads.values() if t.book_id == book_id]
            completed = [t for t in self.upload_history if t.book_id == book_id]
        else:
            tasks = list(self.active_uploads.values())
            completed = self.upload_history
        
        total = len(tasks) + len(completed)
        completed_count = len([t for t in tasks if t.status == UploadStatus.COMPLETED]) + len(completed)
        
        progress = {
            'total_tasks': total,
            'completed': completed_count,
            'in_progress': len([t for t in tasks if t.status == UploadStatus.UPLOADING]),
            'pending': len([t for t in tasks if t.status == UploadStatus.PENDING]),
            'failed': len([t for t in tasks if t.status == UploadStatus.FAILED]),
            'completion_percentage': (completed_count / total * 100) if total > 0 else 0,
            'active_uploads': [
                {
                    'id': t.id,
                    'file_name': t.file_name,
                    'status': t.status.value,
                    'progress': t.progress,
                    'attempts': t.attempts
                }
                for t in tasks
            ]
        }
        
        return progress
    
    def _generate_slug(self, title: str) -> str:
        """Generate URL-friendly slug from title"""
        import re
        slug = title.lower()
        slug = re.sub(r'[^\w\s-]', '', slug)
        slug = re.sub(r'[-\s]+', '-', slug)
        return slug[:50].strip('-')
    
    def _format_file_size(self, size_bytes: int) -> str:
        """Format file size in human-readable format"""
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size_bytes < 1024:
                return f"{size_bytes:.1f} {unit}"
            size_bytes /= 1024
        return f"{size_bytes:.1f} TB"


class UploadProgressTracker:
    """
    Track upload progress in database
    """
    
    def __init__(self, supabase_client=None):
        self.supabase = supabase_client
    
    async def track_upload(self, book_id: str, file_name: str, status: str,
                          file_size: int = 0, drive_file_id: Optional[str] = None,
                          error_message: Optional[str] = None) -> bool:
        """
        Track upload progress in database
        
        Args:
            book_id: Book ID
            file_name: File name
            status: Upload status
            file_size: File size in bytes
            drive_file_id: Google Drive file ID
            error_message: Error message if failed
            
        Returns:
            bool: True if tracking successful
        """
        if not self.supabase:
            return False
        
        try:
            data = {
                'book_id': book_id,
                'file_name': file_name,
                'status': status,
                'file_size': file_size,
                'drive_file_id': drive_file_id,
                'error_message': error_message,
                'uploaded_at': datetime.now().isoformat() if status == 'completed' else None
            }
            
            # Insert into upload tracking table
            result = self.supabase.table('ebook_upload_tracking').insert(data).execute()
            return len(result.data) > 0
            
        except Exception as e:
            logger.error(f"Failed to track upload: {e}")
            return False
    
    async def get_upload_status(self, book_id: str) -> Dict[str, Any]:
        """
        Get upload completion percentage for a book
        
        Args:
            book_id: Book ID
            
        Returns:
            dict: Upload status information
        """
        if not self.supabase:
            return {'error': 'Supabase client not available'}
        
        try:
            # Get all uploads for this book
            result = self.supabase.table('ebook_upload_tracking')\
                .select('*')\
                .eq('book_id', book_id)\
                .execute()
            
            uploads = result.data or []
            
            total = len(uploads)
            completed = len([u for u in uploads if u.get('status') == 'completed'])
            failed = len([u for u in uploads if u.get('status') == 'failed'])
            
            return {
                'book_id': book_id,
                'total_files': total,
                'completed': completed,
                'failed': failed,
                'completion_percentage': (completed / total * 100) if total > 0 else 0,
                'uploads': uploads
            }
            
        except Exception as e:
            logger.error(f"Failed to get upload status: {e}")
            return {'error': str(e)}


# Convenience function for creating folder structure
def create_complete_folder_structure(service, book_slug: str, book_title: str, 
                                     book_id: str) -> Optional[BookFolderStructure]:
    """
    Create complete folder structure for a book in Google Drive
    
    Args:
        service: Google Drive API service
        book_slug: URL-friendly book slug
        book_title: Book title
        book_id: Book ID
        
    Returns:
        BookFolderStructure: Complete folder structure
    """
    uploader = DriveUploader()
    uploader.service = service
    return uploader.create_book_folder(book_title, book_id, book_slug)


# Main execution for testing
if __name__ == '__main__':
    # Setup logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    # Test the uploader
    uploader = DriveUploader()
    
    if uploader.service:
        # Test folder creation
        folder_structure = uploader.create_book_folder(
            book_title="Test Book",
            book_id="test-123",
            book_slug="test-book"
        )
        
        if folder_structure:
            print(f"\nCreated folder structure:")
            print(f"Root folder: {folder_structure.root_folder_url}")
            print(f"Folders: {list(folder_structure.folders.keys())}")
