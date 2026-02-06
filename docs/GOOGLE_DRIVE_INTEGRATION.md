# Google Drive Integration for PPSDM KMM LMS

## Overview

This module provides automatic Google Drive folder creation and file upload functionality for each processed book in the PPSDM KMM LMS system.

## Features

- **Automatic Folder Structure Creation**: Creates organized folder structure for each book
- **Automatic File Upload**: Uploads all generated content (JSON, lessons, quizzes, media, SCORM packages)
- **Upload Progress Tracking**: Real-time tracking of upload progress
- **Service Account Authentication**: Secure authentication using Google Service Accounts
- **Rate Limiting**: Built-in rate limiting to handle API limits
- **Resumable Uploads**: Supports resumable uploads for large files
- **Admin UI Integration**: Visual indicators and sync controls in the Admin panel

## Folder Structure

For each book, the following folder structure is created in Google Drive:

```
📁 {book_slug}_{book_id}
├── 📁 01_Course_Metadata
│   └── course_info.json
├── 📁 02_Modules
│   └── modules.json
├── 📁 03_Lessons
│   └── lesson files (.md)
├── 📁 04_Quizzes
│   └── quizzes.json
├── 📁 05_Assignments
│   └── assignment files
├── 📁 06_Media
│   ├── 📁 Audio
│   ├── 📁 Images
│   │   └── cover_image.jpg
│   └── 📁 Videos
├── 📁 07_Assessments
│   └── assessment files
└── 📁 08_Exports
    ├── 📁 SCORM
    │   └── course_scorm.zip
    └── 📁 xAPI
        └── statements.json
```

## Setup

### 1. Create Google Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google Drive API:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Drive API"
   - Click "Enable"
4. Create Service Account:
   - Go to "IAM & Admin" > "Service Accounts"
   - Click "Create Service Account"
   - Name: `ppsdm-kmm-drive-uploader`
   - Role: `Editor` (or create custom role with Drive permissions)
5. Create Key:
   - Select the service account
   - Go to "Keys" tab
   - Click "Add Key" > "Create New Key"
   - Choose JSON format
   - Download and save the key file

### 2. Configure Environment Variables

Add the following to your `.env.local` file:

```env
# Google Drive Integration
GOOGLE_DRIVE_FOLDER_ID=your_root_folder_id_here
GOOGLE_SERVICE_ACCOUNT_KEY_PATH=./config/service-account.json
```

### 3. Set Up Root Folder

1. Create a folder in Google Drive where all book folders will be stored
2. Share this folder with the service account email (found in the JSON key file)
3. Give the service account "Editor" permissions
4. Copy the folder ID from the URL and set it as `GOOGLE_DRIVE_FOLDER_ID`

### 4. Install Dependencies

```bash
pip install -r scrapers/requirements.txt
```

## Database Schema

The following columns have been added to track Drive upload status:

### ebooks table
- `drive_folder_id` (TEXT): Google Drive folder ID
- `drive_folder_url` (TEXT): URL to access the folder
- `drive_upload_status` (TEXT): pending | uploading | completed | failed
- `drive_upload_progress` (INTEGER): 0-100
- `drive_uploaded_at` (TIMESTAMPTZ): Upload completion timestamp

### courses_from_ebooks table
- `drive_content_url` (TEXT): URL to course content in Drive
- `drive_folder_id` (TEXT): Google Drive folder ID
- `drive_sync_status` (TEXT): sync status
- `drive_last_sync_at` (TIMESTAMPTZ): Last sync timestamp

### ebook_upload_tracking table
- Tracks individual file uploads with status, progress, and error messages

## Usage

### Automatic Upload (Batch Processing)

Upload happens automatically when running batch processing:

```bash
# Process books with Drive upload (default)
python scripts/batch_process_ebooks.py --limit 10

# Process without Drive upload
python scripts/batch_process_ebooks.py --limit 10 --disable-drive-upload
```

### Manual Upload via Admin UI

1. Navigate to **Admin Panel** > **Ebook Processor**
2. View Drive sync status in the stats card
3. Click **"Sync to Drive"** button for batch sync
4. Or click the cloud icon next to individual books for single sync
5. Click the folder icon to open the Drive folder (if already synced)

### API Endpoints

#### Get Drive Status
```http
GET /api/admin/drive-status
GET /api/admin/drive-status?bookId={book_id}
```

#### Sync to Drive
```http
POST /api/admin/sync-to-drive
Content-Type: application/json

{
  "bookId": "uuid",      // Sync single book
  "syncAll": true,       // Sync all pending books
  "dryRun": true         // Preview what would be synced
}
```

## Python API

### DriveUploader Class

```python
from scripts.drive_uploader import DriveUploader

# Initialize
uploader = DriveUploader()

# Create folder structure
folder_structure = uploader.create_book_folder(
    book_title="Book Title",
    book_id="book-uuid",
    book_slug="book-slug"
)

# Upload a file
result = uploader.upload_file(
    file_path="/path/to/file.json",
    folder_id=folder_structure.root_folder_id,
    book_id="book-uuid"
)

# Upload course package
upload_result = uploader.upload_course_package(
    book_data={...},
    content_files={
        'lessons': ['/path/lesson1.md'],
        'images': ['/path/cover.jpg']
    },
    folder_structure=folder_structure
)

# Sync local files to Drive
sync_result = uploader.sync_local_to_drive(
    book_id="book-uuid",
    local_output_dir="/path/to/output",
    folder_structure=folder_structure
)
```

## Rate Limiting

The module includes built-in rate limiting to handle Google Drive API quotas:

- Default delay: 1 second between API calls
- Automatic retry on 500/502/503/504 errors
- Maximum 3 retries per operation

## Error Handling

Common issues and solutions:

### Authentication Errors
- Verify service account JSON file exists and is valid
- Check that GOOGLE_SERVICE_ACCOUNT_KEY_PATH is correct
- Ensure Drive API is enabled in Google Cloud Console

### Permission Errors
- Verify the root folder is shared with the service account
- Check that the service account has "Editor" permissions
- Confirm folder ID in GOOGLE_DRIVE_FOLDER_ID is correct

### Rate Limit Errors
- The module automatically handles rate limits with retries
- For large batches, uploads may take longer due to rate limiting
- Check logs for "rate limit" messages

## Monitoring

### Logs
Drive upload logs are saved to `batch_ebook_processing.log`:
```
[Drive] Starting upload for: Book Title
  Created Drive Folder: book-slug_uuid (ID: ...)
  Uploaded: course_info.json (2.5 KB)
✓ Drive upload complete: https://drive.google.com/drive/folders/...
```

### Admin UI Indicators
- **Cloud icon (gray)**: Not synced
- **Cloud icon with check (green)**: Synced - click to open folder
- **Spinning icon (blue)**: Currently uploading
- **Cloud icon with X (red)**: Upload failed

## Security Considerations

1. **Service Account Key**: Keep the JSON key file secure and never commit it to version control
2. **Environment Variables**: Store sensitive configuration in `.env.local` (already in `.gitignore`)
3. **Folder Permissions**: Only share the root folder with the service account, not individual folders
4. **API Scopes**: The module uses minimal required scopes:
   - `https://www.googleapis.com/auth/drive`
   - `https://www.googleapis.com/auth/drive.file`

## Troubleshooting

### Uploads Not Starting
1. Check that service account key file exists and is readable
2. Verify environment variables are set correctly
3. Check application logs for authentication errors

### Uploads Failing
1. Check available storage in Google Drive
2. Verify service account has not exceeded quota limits
3. Review `batch_ebook_processing.log` for detailed error messages

### Files Not Appearing in Drive
1. Check upload tracking table for error messages
2. Verify folder structure was created successfully
3. Confirm MIME types are correct for file uploads

## Maintenance

### Cleanup Orphaned Folders
If a book is deleted but its Drive folder remains:
```python
from scripts.drive_uploader import DriveUploader
uploader = DriveUploader()
# List all folders and identify orphans
folders = uploader.get_folder_contents(folder_id)
```

### Update Folder Structure
To add new folders to existing book structures:
1. Modify `FOLDER_STRUCTURE` in `drive_uploader.py`
2. Run migration script (if needed)
3. Re-sync books to create new folders
