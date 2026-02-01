/**
 * Google Drive Integration
 * 
 * Access the 2TB "BUKA BUKU" folder for e-book storage
 * Folder ID: 1B1g7rSHGQtO1VXEWxSS8Ncbg0R3nxmFf
 */

import { google } from 'googleapis';

// Google Drive folder containing books
export const DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || '1B1g7rSHGQtO1VXEWxSS8Ncbg0R3nxmFf';

// Supported e-book formats
export const SUPPORTED_BOOK_FORMATS = [
  'application/pdf',
  'application/epub+zip',
  'application/x-mobipocket-ebook',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size: string;
  modifiedTime: string;
  webViewLink: string;
  downloadUrl?: string;
  thumbnailLink?: string;
  description?: string;
}

export interface BookMetadata {
  id: string;
  title: string;
  author?: string;
  format: string;
  size: number;
  uploadedAt: Date;
  downloadUrl: string;
  category?: string;
  tags?: string[];
}

/**
 * Initialize Google Drive API client
 */
function getDriveClient() {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  // For service account or existing token
  const drive = google.drive({
    version: 'v3',
    auth,
  });

  return drive;
}

/**
 * List all books in the Google Drive folder
 */
export async function listBooksInDrive(
  folderId: string = DRIVE_FOLDER_ID
): Promise<BookMetadata[]> {
  try {
    const drive = getDriveClient();
    
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'files(id, name, mimeType, size, modifiedTime, webViewLink, thumbnailLink, description)',
      pageSize: 1000,
      orderBy: 'modifiedTime desc',
    });

    const files = response.data.files || [];
    
    return files
      .filter(file => SUPPORTED_BOOK_FORMATS.includes(file.mimeType || ''))
      .map(file => ({
        id: file.id!,
        title: file.name?.replace(/\.[^/.]+$/, '') || 'Untitled',
        format: getFormatFromMimeType(file.mimeType!),
        size: parseInt(file.size || '0', 10),
        uploadedAt: new Date(file.modifiedTime || Date.now()),
        downloadUrl: `https://drive.google.com/uc?export=download&id=${file.id}`,
        category: extractCategoryFromName(file.name || ''),
        tags: extractTagsFromDescription(file.description),
      }));
  } catch (error) {
    console.error('Error listing books from Drive:', error);
    throw new Error('Failed to list books from Google Drive');
  }
}

/**
 * Get file details from Google Drive
 */
export async function getBookDetails(fileId: string): Promise<DriveFile | null> {
  try {
    const drive = getDriveClient();
    
    const response = await drive.files.get({
      fileId,
      fields: 'id, name, mimeType, size, modifiedTime, webViewLink, thumbnailLink, description',
    });

    const file = response.data;
    
    if (!file.id) return null;

    return {
      id: file.id,
      name: file.name || 'Untitled',
      mimeType: file.mimeType || 'application/octet-stream',
      size: file.size || '0',
      modifiedTime: file.modifiedTime || new Date().toISOString(),
      webViewLink: file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`,
      thumbnailLink: file.thumbnailLink || undefined,
      description: file.description || undefined,
    };
  } catch (error) {
    console.error('Error getting book details:', error);
    return null;
  }
}

/**
 * Download a book from Google Drive
 */
export async function downloadBook(fileId: string): Promise<Buffer> {
  try {
    const drive = getDriveClient();
    
    const response = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'arraybuffer' }
    );

    return Buffer.from(response.data as ArrayBuffer);
  } catch (error) {
    console.error('Error downloading book:', error);
    throw new Error('Failed to download book from Google Drive');
  }
}

/**
 * Get a readable stream for a book (for large files)
 */
export async function getBookStream(fileId: string): Promise<NodeJS.ReadableStream> {
  try {
    const drive = getDriveClient();
    
    const response = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'stream' }
    );

    return response.data as NodeJS.ReadableStream;
  } catch (error) {
    console.error('Error getting book stream:', error);
    throw new Error('Failed to get book stream from Google Drive');
  }
}

/**
 * Upload a book to Google Drive
 */
export async function uploadBook(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string,
  folderId: string = DRIVE_FOLDER_ID,
  description?: string
): Promise<string> {
  try {
    const drive = getDriveClient();
    
    const fileMetadata = {
      name: fileName,
      parents: [folderId],
      description,
    };

    const media = {
      mimeType,
      body: fileBuffer,
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media,
      fields: 'id',
    });

    return response.data.id!;
  } catch (error) {
    console.error('Error uploading book:', error);
    throw new Error('Failed to upload book to Google Drive');
  }
}

/**
 * Search for books in the folder
 */
export async function searchBooks(
  query: string,
  folderId: string = DRIVE_FOLDER_ID
): Promise<BookMetadata[]> {
  try {
    const drive = getDriveClient();
    
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false and (name contains '${query}' or fullText contains '${query}')`,
      fields: 'files(id, name, mimeType, size, modifiedTime, webViewLink, thumbnailLink, description)',
      pageSize: 100,
    });

    const files = response.data.files || [];
    
    return files
      .filter(file => SUPPORTED_BOOK_FORMATS.includes(file.mimeType || ''))
      .map(file => ({
        id: file.id!,
        title: file.name?.replace(/\.[^/.]+$/, '') || 'Untitled',
        format: getFormatFromMimeType(file.mimeType!),
        size: parseInt(file.size || '0', 10),
        uploadedAt: new Date(file.modifiedTime || Date.now()),
        downloadUrl: `https://drive.google.com/uc?export=download&id=${file.id}`,
        category: extractCategoryFromName(file.name || ''),
      }));
  } catch (error) {
    console.error('Error searching books:', error);
    throw new Error('Failed to search books in Google Drive');
  }
}

/**
 * Delete a book from Google Drive
 */
export async function deleteBook(fileId: string): Promise<void> {
  try {
    const drive = getDriveClient();
    await drive.files.delete({ fileId });
  } catch (error) {
    console.error('Error deleting book:', error);
    throw new Error('Failed to delete book from Google Drive');
  }
}

/**
 * Create a folder in Google Drive
 */
export async function createFolder(
  folderName: string,
  parentFolderId: string = DRIVE_FOLDER_ID
): Promise<string> {
  try {
    const drive = getDriveClient();
    
    const fileMetadata = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentFolderId],
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      fields: 'id',
    });

    return response.data.id!;
  } catch (error) {
    console.error('Error creating folder:', error);
    throw new Error('Failed to create folder in Google Drive');
  }
}

// Helper functions

function getFormatFromMimeType(mimeType: string): string {
  const formatMap: Record<string, string> = {
    'application/pdf': 'PDF',
    'application/epub+zip': 'EPUB',
    'application/x-mobipocket-ebook': 'MOBI',
    'text/plain': 'TXT',
    'application/msword': 'DOC',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  };
  
  return formatMap[mimeType] || 'UNKNOWN';
}

function extractCategoryFromName(fileName: string): string {
  // Extract category from filename patterns like "[Category] Book Title.pdf"
  const match = fileName.match(/^\[([^\]]+)\]/);
  return match ? match[1] : 'Uncategorized';
}

function extractTagsFromDescription(description: string | null | undefined): string[] {
  if (!description) return [];
  // Extract tags from description using #tag format
  const tags = description.match(/#\w+/g);
  return tags ? tags.map(tag => tag.slice(1)) : [];
}

// Export default
export default {
  listBooks: listBooksInDrive,
  getDetails: getBookDetails,
  download: downloadBook,
  getStream: getBookStream,
  upload: uploadBook,
  search: searchBooks,
  delete: deleteBook,
  createFolder,
  DRIVE_FOLDER_ID,
  SUPPORTED_BOOK_FORMATS,
};
