/**
 * 🏗️ LAYER 2: INFRASTRUCTURE - DRIVE SERVICE
 * SISTEM: PPSDM_LMS_ENTERPRISE_V4
 * VERSION: 4.2.0
 * SERVICE: Drive Operations
 */

class DriveService {

    constructor() {
        this.config = MASTER_CONFIG;
        this.cache = new Map();
        this.rateLimitDelay = 1000; // 1 second between API calls
        this.maxRetries = 3;
    }

    // ==========================================================================
    // 📁 FOLDER OPERATIONS
    // ==========================================================================

    /**
     * Get source folder for scanning
     */
    getSourceFolder() {
        try {
            console.log(`📁 Getting source folder: ${this.config.DRIVE.SOURCE_FOLDER_ID}`);

            const folder = DriveApp.getFolderById(this.config.DRIVE.SOURCE_FOLDER_ID);

            if (!folder) {
                throw new Error(`Source folder not found: ${this.config.DRIVE.SOURCE_FOLDER_ID}`);
            }

            this.logDriveEvent('GET_SOURCE_FOLDER', 'Source folder retrieved successfully', 'SUCCESS', {
                folderId: folder.getId(),
                folderName: folder.getName(),
                folderUrl: folder.getUrl()
            });

            return {
                success: true,
                folder: folder,
                metadata: {
                    id: folder.getId(),
                    name: folder.getName(),
                    url: folder.getUrl(),
                    dateCreated: folder.getDateCreated(),
                    lastUpdated: folder.getLastUpdated()
                }
            };

        } catch (error) {
            console.error('❌ Failed to get source folder:', error);
            this.logDriveEvent('GET_SOURCE_FOLDER_ERROR', error.toString(), 'ERROR', {
                folderId: this.config.DRIVE.SOURCE_FOLDER_ID
            });

            return {
                success: false,
                error: error.message,
                errorCode: 'DRIVE_FOLDER_NOT_FOUND'
            };
        }
    }

    /**
     * Get or create system folder
     */
    getOrCreateSystemFolder(folderName) {
        try {
            // Check cache first
            const cacheKey = `folder_${folderName}`;
            if (this.cache.has(cacheKey)) {
                return this.cache.get(cacheKey);
            }

            console.log(`📁 Getting/Creating system folder: ${folderName}`);

            let folder;
            const folders = DriveApp.getFoldersByName(folderName);

            if (folders.hasNext()) {
                folder = folders.next();
                console.log(`✅ Found existing folder: ${folderName}`);
            } else {
                // Create new folder
                folder = DriveApp.createFolder(folderName);
                console.log(`✅ Created new folder: ${folderName}`);

                // Set folder permissions
                this.setFolderPermissions(folder, {
                    viewers: this.config.DRIVE.PERMISSIONS.VIEWERS,
                    editors: this.config.DRIVE.PERMISSIONS.EDITORS,
                    domain: this.config.DRIVE.PERMISSIONS.DOMAIN
                });
            }

            const result = {
                success: true,
                folder: folder,
                metadata: {
                    id: folder.getId(),
                    name: folder.getName(),
                    url: folder.getUrl(),
                    dateCreated: folder.getDateCreated(),
                    lastUpdated: folder.getLastUpdated(),
                    exists: true
                }
            };

            // Cache result
            this.cache.set(cacheKey, result);

            this.logDriveEvent('GET_CREATE_FOLDER', `Folder processed: ${folderName}`, 'SUCCESS', {
                folderId: folder.getId(),
                folderName: folder.getName(),
                action: folders.hasNext() ? 'FOUND' : 'CREATED'
            });

            return result;

        } catch (error) {
            console.error(`❌ Failed to get/create folder ${folderName}:`, error);
            this.logDriveEvent('GET_CREATE_FOLDER_ERROR', error.toString(), 'ERROR', {
                folderName: folderName
            });

            return {
                success: false,
                error: error.message,
                errorCode: 'DRIVE_FOLDER_CREATE_ERROR'
            };
        }
    }

    /**
     * Set folder permissions
     */
    setFolderPermissions(folder, permissions) {
        try {
            // Remove all existing permissions first (except owner)
            const currentPermissions = folder.getAccess();
            if (currentPermissions === DriveApp.Access.PRIVATE) {
                // Add domain access if specified
                if (permissions.domain) {
                    folder.setSharing(DriveApp.Access.DOMAIN, DriveApp.Permission.VIEW);
                }

                // Add viewers
                if (permissions.viewers && permissions.viewers.length > 0) {
                    permissions.viewers.forEach(email => {
                        try {
                            folder.addViewer(email);
                        } catch (e) {
                            console.warn(`Could not add viewer ${email}:`, e.message);
                        }
                    });
                }

                // Add editors
                if (permissions.editors && permissions.editors.length > 0) {
                    permissions.editors.forEach(email => {
                        try {
                            folder.addEditor(email);
                        } catch (e) {
                            console.warn(`Could not add editor ${email}:`, e.message);
                        }
                    });
                }
            }

            console.log(`✅ Permissions set for folder: ${folder.getName()}`);
            return true;

        } catch (error) {
            console.error('❌ Failed to set folder permissions:', error);
            return false;
        }
    }

    /**
     * Create all system folders structure
     */
    createSystemFolders() {
        try {
            console.log('🏗️ Creating system folder structure...');

            const folders = [
                this.config.DRIVE.PROCESSED_FOLDER,
                this.config.DRIVE.ARCHIVE_FOLDER,
                this.config.DRIVE.BACKUP_FOLDER,
                this.config.DRIVE.ERROR_FOLDER,
                this.config.DRIVE.LOGS_FOLDER,
                this.config.DRIVE.EXPORT_FOLDER
            ];

            const results = [];

            folders.forEach(folderName => {
                const result = this.getOrCreateSystemFolder(folderName);
                results.push({
                    folder: folderName,
                    success: result.success,
                    id: result.metadata?.id || null
                });

                // Rate limiting
                Utilities.sleep(this.rateLimitDelay);
            });

            this.logDriveEvent('CREATE_SYSTEM_FOLDERS', 'System folders created', 'SUCCESS', {
                foldersCreated: results.filter(r => r.success).length,
                totalFolders: folders.length
            });

            return {
                success: true,
                results: results,
                summary: {
                    total: folders.length,
                    success: results.filter(r => r.success).length,
                    failed: results.filter(r => !r.success).length
                }
            };

        } catch (error) {
            console.error('❌ Failed to create system folders:', error);
            this.logDriveEvent('CREATE_SYSTEM_FOLDERS_ERROR', error.toString(), 'ERROR');

            return {
                success: false,
                error: error.message
            };
        }
    }
    // ==========================================================================
    // 🔍 FILE SCANNING OPERATIONS
    // ==========================================================================

    /**
     * Scan folder recursively with pagination
     */
    scanFolderRecursive(folderId = null, options = {}) {
        try {
            const startTime = new Date();
            const targetFolderId = folderId || this.config.DRIVE.SOURCE_FOLDER_ID;

            console.log(`🔍 Starting recursive scan of folder: ${targetFolderId}`);

            const scanOptions = {
                recursive: options.recursive !== false,
                maxDepth: options.maxDepth || 10,
                pageSize: options.pageSize || 100,
                pageToken: options.pageToken || null,
                supportedFormats: options.supportedFormats || this.getAllSupportedFormats(),
                maxFiles: options.maxFiles || 1000
            };

            let allFiles = [];
            let foldersProcessed = 0;
            let totalFilesFound = 0;

            // Use Drive API for advanced operations
            const drive = Drive;

            // Build query
            let query = `'${targetFolderId}' in parents and trashed = false`;

            // Add mime type filters if specified
            if (scanOptions.supportedFormats && scanOptions.supportedFormats.length > 0) {
                const mimeQueries = scanOptions.supportedFormats.map(format =>
                    `mimeType = '${this.getMimeTypeFromExtension(format)}'`
                ).join(' or ');

                if (mimeQueries) {
                    query += ` and (${mimeQueries})`;
                }
            }

            console.log(`🔍 Query: ${query}`);

            // Execute search with pagination
            let pageToken = scanOptions.pageToken;
            let files = [];
            let processedInThisPage = 0;

            do {
                const params = {
                    q: query,
                    pageSize: scanOptions.pageSize,
                    fields: 'nextPageToken, files(id, name, mimeType, size, createdTime, modifiedTime, parents, webViewLink, thumbnailLink)',
                    orderBy: 'name'
                };

                if (pageToken) {
                    params.pageToken = pageToken;
                }

                // Add rate limiting
                Utilities.sleep(this.rateLimitDelay);

                const response = drive.Files.list(params);
                files = response.files;
                pageToken = response.nextPageToken;

                // Process files in this page
                if (files && files.length > 0) {
                    const processedFiles = this.processFileBatch(files, targetFolderId);
                    allFiles = allFiles.concat(processedFiles);
                    processedInThisPage += processedFiles.length;
                    totalFilesFound += processedFiles.length;

                    console.log(`📄 Processed page: ${processedFiles.length} files (Total: ${totalFilesFound})`);
                }

                // Check if we've reached max files
                if (scanOptions.maxFiles && totalFilesFound >= scanOptions.maxFiles) {
                    console.log(`⚠️ Reached max files limit: ${scanOptions.maxFiles}`);
                    break;
                }

            } while (pageToken && (!scanOptions.maxFiles || totalFilesFound < scanOptions.maxFiles));

            // If recursive, scan subfolders
            if (scanOptions.recursive && scanOptions.maxDepth > 0) {
                const subfolders = this.getSubfolders(targetFolderId);
                foldersProcessed = subfolders.length;

                for (const subfolder of subfolders) {
                    const subOptions = {
                        ...scanOptions,
                        maxDepth: scanOptions.maxDepth - 1
                    };

                    const subResult = this.scanFolderRecursive(subfolder.id, subOptions);

                    if (subResult.success && subResult.files) {
                        allFiles = allFiles.concat(subResult.files);
                        totalFilesFound += subResult.files.length;
                    }

                    // Check max files
                    if (scanOptions.maxFiles && totalFilesFound >= scanOptions.maxFiles) {
                        break;
                    }
                }
            }

            const duration = new Date() - startTime;

            this.logDriveEvent('SCAN_FOLDER_RECURSIVE',
                `Recursive scan completed: ${totalFilesFound} files, ${foldersProcessed} folders`,
                'SUCCESS', {
                folderId: targetFolderId,
                totalFiles: totalFilesFound,
                foldersProcessed: foldersProcessed,
                durationMs: duration,
                hasMore: !!pageToken,
                nextPageToken: pageToken
            });

            return {
                success: true,
                files: allFiles,
                metadata: {
                    totalFiles: totalFilesFound,
                    foldersProcessed: foldersProcessed,
                    durationMs: duration,
                    hasMore: !!pageToken,
                    nextPageToken: pageToken,
                    pageSize: scanOptions.pageSize,
                    scannedAt: new Date().toISOString()
                }
            };

        } catch (error) {
            console.error('❌ Recursive scan failed:', error);
            this.logDriveEvent('SCAN_FOLDER_RECURSIVE_ERROR', error.toString(), 'ERROR', {
                folderId: folderId
            });

            return {
                success: false,
                error: error.message,
                errorCode: 'DRIVE_SCAN_ERROR'
            };
        }
    }

    /**
     * Process a batch of files from Drive API
     */
    processFileBatch(files, parentFolderId) {
        return files.map(file => {
            const extension = this.getFileExtension(file.name);
            const mimeType = file.mimeType;

            return {
                id: file.id,
                name: file.name,
                size: parseInt(file.size) || 0,
                sizeKB: Math.round((parseInt(file.size) || 0) / 1024),
                mimeType: mimeType,
                extension: extension,
                url: file.webViewLink,
                downloadUrl: `https://drive.google.com/uc?export=download&id=${file.id}`,
                previewUrl: `https://drive.google.com/file/d/${file.id}/preview`,
                thumbnailUrl: file.thumbnailLink,
                parentFolderId: parentFolderId,
                createdTime: file.createdTime,
                modifiedTime: file.modifiedTime,
                parents: file.parents || [],
                isSupported: this.isSupportedFormat(extension, mimeType),
                metadataStatus: 'PENDING'
            };
        });
    }

    /**
     * Get subfolders of a folder
     */
    getSubfolders(folderId) {
        try {
            const drive = Drive;
            const query = `'${folderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;

            const response = drive.Files.list({
                q: query,
                pageSize: 100,
                fields: 'files(id, name)'
            });

            if (!response.files) {
                return [];
            }

            return response.files.map(folder => ({
                id: folder.id,
                name: folder.name
            }));

        } catch (error) {
            console.error(`❌ Failed to get subfolders of ${folderId}:`, error);
            return [];
        }
    }

    /**
     * Get file by ID with retry logic
     */
    getFileById(fileId, retryCount = 0) {
        try {
            console.log(`📄 Getting file: ${fileId} (attempt ${retryCount + 1}/${this.maxRetries})`);

            const file = DriveApp.getFileById(fileId);

            const extension = this.getFileExtension(file.getName());
            const mimeType = file.getMimeType();

            const fileData = {
                id: file.getId(),
                name: file.getName(),
                size: file.getSize(),
                sizeKB: Math.round(file.getSize() / 1024),
                mimeType: mimeType,
                extension: extension,
                url: file.getUrl(),
                downloadUrl: `https://drive.google.com/uc?export=download&id=${fileId}`,
                previewUrl: `https://drive.google.com/file/d/${fileId}/preview`,
                createdTime: file.getDateCreated(),
                modifiedTime: file.getLastUpdated(),
                owner: file.getOwner() ? file.getOwner().getEmail() : 'Unknown',
                isSupported: this.isSupportedFormat(extension, mimeType),
                metadataStatus: 'PENDING',
                checksum: this.calculateFileChecksum(file)
            };

            this.logDriveEvent('GET_FILE_BY_ID', `File retrieved: ${fileData.name}`, 'SUCCESS', {
                fileId: fileId,
                fileName: fileData.name,
                sizeKB: fileData.sizeKB
            });

            return {
                success: true,
                file: fileData,
                rawFile: file
            };

        } catch (error) {
            if (retryCount < this.maxRetries) {
                console.warn(`⚠️ Retry ${retryCount + 1} for file ${fileId}:`, error.message);
                Utilities.sleep(2000 * (retryCount + 1)); // Exponential backoff
                return this.getFileById(fileId, retryCount + 1);
            }

            console.error(`❌ Failed to get file ${fileId} after ${this.maxRetries} retries:`, error);
            this.logDriveEvent('GET_FILE_BY_ID_ERROR', error.toString(), 'ERROR', {
                fileId: fileId,
                retryCount: retryCount
            });

            return {
                success: false,
                error: error.message,
                errorCode: 'DRIVE_FILE_NOT_FOUND'
            };
        }
    }

    /**
     * Get multiple files by IDs
     */
    getFilesByIds(fileIds, batchSize = 10) {
        try {
            console.log(`📦 Getting ${fileIds.length} files in batches of ${batchSize}`);

            const results = [];
            const batches = this.chunkArray(fileIds, batchSize);

            for (let i = 0; i < batches.length; i++) {
                const batch = batches[i];
                console.log(`🔄 Processing batch ${i + 1}/${batches.length}`);

                const batchResults = batch.map(fileId =>
                    this.getFileById(fileId)
                );

                results.push(...batchResults);

                // Rate limiting between batches
                if (i < batches.length - 1) {
                    Utilities.sleep(this.rateLimitDelay * 2);
                }
            }

            const successful = results.filter(r => r.success);
            const failed = results.filter(r => !r.success);

            this.logDriveEvent('GET_FILES_BY_IDS',
                `Batch file retrieval completed: ${successful.length} success, ${failed.length} failed`,
                'SUCCESS', {
                totalRequested: fileIds.length,
                successful: successful.length,
                failed: failed.length
            });

            return {
                success: true,
                results: results,
                summary: {
                    total: fileIds.length,
                    successful: successful.length,
                    failed: failed.length,
                    successRate: Math.round((successful.length / fileIds.length) * 100)
                }
            };

        } catch (error) {
            console.error('❌ Failed to get files by IDs:', error);
            this.logDriveEvent('GET_FILES_BY_IDS_ERROR', error.toString(), 'ERROR');

            return {
                success: false,
                error: error.message
            };
        }
    }
// SPLIT_MARKER_2
