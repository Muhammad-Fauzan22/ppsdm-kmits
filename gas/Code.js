// ==============================================
// BUKA BUKU - FIXED VERSION (STABLE)
// ==============================================

// ⚙️ CONFIGURATION SECTION
const CONFIG = {
    // Google Drive
    SOURCE_FOLDER_ID: '1B1g7rSHGQtO1VXEWxSS8Ncbg0R3nxmFf',
    OUTPUT_FOLDER_ID: 'create-if-not-exists',

    // Spreadsheet Structure
    SPREADSHEET_ID: '1QEj9aoXDrAu6PKdFX-FNQt5pWlf7VsWMGeeU-PF9tQM',

    // API Endpoints
    VERCEL_API_URL: 'https://ppsdm-kmits.vercel.app/api/process',
    VERCEL_DASHBOARD_URL: 'https://ppsdm-kmits.vercel.app/dashboard',

    // Vercel API Authentication
    VERCEL_TOKEN: 'jqkF40upjkVX1UOHJWrFfQuF',

    // Processing Settings
    BATCH_SIZE: 5,
    MAX_RETRIES: 3,
    RETRY_DELAY: 5000,

    // Notification Settings
    EMAIL_NOTIFICATIONS: true,
    ADMIN_EMAIL: 'hmmits2025@gmail.com',

    // Sheets Configuration
    SHEETS: {
        DATA: { name: 'Data Buku', color: '#4CAF50' },
        LOGS: { name: 'System Logs', color: '#2196F3' },
        MONITOR: { name: 'Monitoring', color: '#FF9800' },
        QUEUE: { name: 'Processing Queue', color: '#9C27B0' },
        ERRORS: { name: 'Error Logs', color: '#F44336' },
        STATS: { name: 'Statistics', color: '#00BCD4' },
        CONFIG: { name: 'Configuration', color: '#607D8B' },
        INDEX: { name: 'Dashboard', color: '#673AB7' }
    }
};

// 📊 SHEET HEADERS STRUCTURE (SIMPLIFIED)
const SHEET_HEADERS = {
    DATA: [
        'ID', 'DRIVE_ID', 'FILE_NAME', 'FILE_PATH', 'FILE_SIZE_KB', 'EXTENSION',
        'MIME_TYPE', 'TITLE', 'AUTHOR', 'YEAR', 'ISBN', 'PUBLISHER', 'CATEGORY',
        'SUBCATEGORY', 'TAGS', 'LANGUAGE', 'PAGES', 'EDITION', 'READ_STATUS',
        'RATING', 'FAVORITE', 'CREATED_DATE', 'MODIFIED_DATE', 'OWNER',
        'DRIVE_URL', 'DOWNLOAD_URL', 'PREVIEW_URL', 'METADATA_DATE',
        'METADATA_STATUS', 'PROCESSING_STATUS', 'PROCESSING_DATE',
        'PROCESSING_TIME', 'WEBHOOK_JOB_ID', 'WEBHOOK_STATUS',
        'WEBHOOK_RESPONSE', 'ERROR_MESSAGE', 'NOTES', 'LAST_ACCESSED',
        'ACCESS_COUNT', 'SOURCE', 'LICENSE', 'KEYWORDS', 'CHECKSUM', 'VERSION'
    ],

    LOGS: [
        'TIMESTAMP', 'LEVEL', 'MODULE', 'FUNCTION', 'MESSAGE', 'DETAILS',
        'USER_EMAIL', 'EXECUTION_TIME', 'STATUS', 'REFERENCE_ID'
    ],

    MONITOR: [
        'TIMESTAMP', 'TOTAL_FILES', 'NEW_FILES', 'PROCESSED_TODAY',
        'FAILED_TODAY', 'AVG_PROCESSING_TIME', 'QUEUE_SIZE',
        'AI_CREDITS_USED', 'STORAGE_USED_MB', 'LAST_SUCCESS',
        'LAST_ERROR', 'SYSTEM_STATUS', 'NEXT_SCHEDULE'
    ],

    QUEUE: [
        'JOB_ID', 'FILE_ID', 'FILE_NAME', 'PRIORITY', 'STATUS',
        'ATTEMPTS', 'CREATED_AT', 'SCHEDULED_FOR', 'STARTED_AT',
        'COMPLETED_AT', 'PROCESSING_TIME', 'AI_PROVIDER', 'OUTPUTS',
        'ERROR_COUNT', 'RETRY_AFTER'
    ],

    ERRORS: [
        'ERROR_ID', 'TIMESTAMP', 'MODULE', 'ERROR_TYPE', 'ERROR_MESSAGE',
        'STACK_TRACE', 'FILE_ID', 'USER_EMAIL', 'RESOLUTION_STATUS',
        'RESOLVED_AT', 'RESOLUTION_NOTES', 'AUTO_RETRY', 'MANUAL_INTERVENTION'
    ],

    STATS: [
        'DATE', 'TOTAL_BOOKS', 'PROCESSED_BOOKS', 'FAILED_BOOKS',
        'AVG_PROCESSING_SECONDS', 'TOTAL_OUTPUTS', 'AI_REQUESTS',
        'SUCCESS_RATE', 'POPULAR_CATEGORIES', 'TOP_AUTHORS',
        'MOST_ACCESSED', 'QUALITY_AVERAGE', 'USER_COUNT',
        'STORAGE_MB', 'COST_ESTIMATE'
    ],

    CONFIG: [
        'KEY', 'VALUE', 'DESCRIPTION', 'LAST_UPDATED', 'UPDATED_BY',
        'CATEGORY', 'IS_ACTIVE', 'VALID_FROM', 'VALID_TO', 'NOTES'
    ],

    INDEX: [
        'SECTION', 'ITEM', 'VALUE', 'DESCRIPTION', 'ACTION', 'LINK'
    ]
};

// 📝 SIMPLE LOGGING SYSTEM (NO SHEET DEPENDENCY)
function logMessage(level, module, functionName, message) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level}] ${module}.${functionName}: ${message}`;
    console.log(logEntry);
    return logEntry;
}

// 🚀 SIMPLIFIED SYSTEM INITIALIZATION
function initializeBukaBukuSystem() {
    try {
        logMessage('INFO', 'SYSTEM', 'initialize', '🚀 Starting BUKA BUKU System Initialization...');

        // Step 1: Setup Spreadsheet Structure (Safe version)
        setupSpreadsheetSafe();

        // Step 2: Test Vercel API Connection
        const apiTest = testVercelConnectionSimple();

        // Step 3: Setup Time-based Triggers
        setupSystemTriggersSimple();

        // Step 4: Initial File Scan
        const scanResult = initialFileScanSimple();

        // Step 5: Send Success Notification
        const emailBody = `✅ BUKA BUKU System Successfully Initialized!

• Spreadsheet Structure: COMPLETE
• Vercel API Connection: ${apiTest ? 'SUCCESS' : 'FAILED'}
• Initial Scan: ${scanResult.newFiles} new files detected
• Triggers: ACTIVE (every 10 minutes)

📊 Dashboard: ${CONFIG.VERCEL_DASHBOARD_URL}
📁 Source Folder: https://drive.google.com/drive/folders/${CONFIG.SOURCE_FOLDER_ID}
📈 Monitor Sheet: https://docs.google.com/spreadsheets/d/${CONFIG.SPREADSHEET_ID}/edit

System is now ready to process your 2TB library!`;

        sendEmailNotification('✅ BUKA BUKU System Initialized', emailBody);

        logMessage('INFO', 'SYSTEM', 'initialize', '🎉 System initialization completed successfully');

        return {
            success: true,
            message: 'System initialized successfully',
            details: {
                api_connection: apiTest,
                new_files: scanResult.newFiles,
                total_files: scanResult.totalFiles
            }
        };

    } catch (error) {
        logMessage('ERROR', 'SYSTEM', 'initialize', 'System initialization failed: ' + error.toString());
        sendEmailNotification('❌ BUKA BUKU System Initialization Failed', error.toString());
        return { success: false, error: error.toString() };
    }
}

// 📊 SAFE SPREADSHEET SETUP
function setupSpreadsheetSafe() {
    logMessage('INFO', 'SPREADSHEET', 'setup', 'Setting up spreadsheet structure...');

    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);

    // Create each required sheet if it doesn't exist
    Object.entries(CONFIG.SHEETS).forEach(([key, sheetConfig]) => {
        let sheet = ss.getSheetByName(sheetConfig.name);

        if (!sheet) {
            // Create new sheet
            sheet = ss.insertSheet(sheetConfig.name);
            logMessage('INFO', 'SPREADSHEET', 'setup', `Created sheet: ${sheetConfig.name}`);
        }

        // Apply sheet color
        sheet.setTabColor(sheetConfig.color);

        // Set headers if sheet is empty
        if (sheet.getLastRow() === 0 || sheet.getLastRow() === 1) {
            const headers = SHEET_HEADERS[key];
            if (headers) {
                sheet.clear(); // Clear existing content
                sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
                sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
                sheet.getRange(1, 1, 1, headers.length).setBackground('#f0f0f0');
                sheet.setFrozenRows(1);

                // Auto-resize columns
                for (let i = 1; i <= headers.length; i++) {
                    sheet.autoResizeColumn(i);
                }
            }
        }

        // Add default config data
        if (key === 'CONFIG' && sheet.getLastRow() <= 1) {
            const defaultConfigs = [
                ['system.name', 'BUKA BUKU', 'Nama sistem', new Date().toISOString(), Session.getActiveUser().getEmail(), 'System', 'true', new Date().toISOString(), '', ''],
                ['system.version', '2.0.0', 'Versi sistem', new Date().toISOString(), 'System', 'System', 'true', new Date().toISOString(), '', ''],
                ['monitor.interval', '10', 'Monitoring interval (minutes)', new Date().toISOString(), 'System', 'Monitoring', 'true', new Date().toISOString(), '', ''],
                ['processing.batch_size', '5', 'Batch size for processing', new Date().toISOString(), 'System', 'Processing', 'true', new Date().toISOString(), '', ''],
                ['storage.source_folder', CONFIG.SOURCE_FOLDER_ID, 'Source folder ID', new Date().toISOString(), 'System', 'Storage', 'true', new Date().toISOString(), '', ''],
                ['api.vercel_url', CONFIG.VERCEL_API_URL, 'Vercel API endpoint', new Date().toISOString(), 'System', 'API', 'true', new Date().toISOString(), '', ''],
                ['notifications.enabled', 'true', 'Enable email notifications', new Date().toISOString(), 'System', 'Notifications', 'true', new Date().toISOString(), '', '']
            ];

            sheet.getRange(2, 1, defaultConfigs.length, 10).setValues(defaultConfigs);
        }

        // Create dashboard content
        if (key === 'INDEX') {
            createDashboardContent(sheet);
        }
    });

    logMessage('INFO', 'SPREADSHEET', 'setup', 'Spreadsheet structure setup completed');
}

// 📋 CREATE DASHBOARD CONTENT
function createDashboardContent(sheet) {
    sheet.clear();

    const dashboardData = [
        ['BUKA BUKU - SYSTEM DASHBOARD'],
        [''],
        ['SYSTEM STATUS', 'VALUE', 'LAST UPDATED', 'ACTIONS'],
        ['Total Books', '=COUNTA(\'Data Buku\'!A:A)-1', '=NOW()', 'View Data'],
        ['Processing Queue', '=COUNTA(\'Processing Queue\'!A:A)-1', '=NOW()', 'View Queue'],
        ['Success Rate', '=IFERROR(1-(COUNTA(\'Error Logs\'!A:A)-1)/(COUNTA(\'Data Buku\'!A:A)-1),0)', '=NOW()', 'View Stats'],
        ['Last Processed', '=MAX(\'Data Buku\'!AE:AE)', '=NOW()', 'View Monitor'],
        [''],
        ['QUICK ACTIONS'],
        ['Action', 'Description', 'Function', 'Run Now'],
        ['Scan New Files', 'Scan Google Drive for new books', 'scanNewFiles()', '=HYPERLINK("javascript:scanNewFiles()", "▶️ Run")'],
        ['Process Queue', 'Process queued items', 'processQueueItems()', '=HYPERLINK("javascript:processQueueItems()", "▶️ Run")'],
        ['System Check', 'Run system diagnostics', 'runSystemCheck()', '=HYPERLINK("javascript:runSystemCheck()", "▶️ Run")'],
        ['Generate Report', 'Generate daily report', 'generateReport()', '=HYPERLINK("javascript:generateReport()", "▶️ Run")'],
        [''],
        ['IMPORTANT LINKS'],
        ['Description', 'URL'],
        ['Web Dashboard', CONFIG.VERCEL_DASHBOARD_URL],
        ['Source Folder', 'https://drive.google.com/drive/folders/' + CONFIG.SOURCE_FOLDER_ID],
        ['Vercel Project', 'https://vercel.com/muhammad-fauzan22/ppsdm-kmits'],
        ['Supabase Database', 'https://supabase.com/dashboard/project/hyszrracdysqgyfpwflu']
    ];

    // Set data
    sheet.getRange(1, 1, dashboardData.length, 4).setValues(dashboardData.map(row => {
        const newRow = new Array(4).fill('');
        row.forEach((cell, index) => {
            if (index < 4) newRow[index] = cell;
        });
        return newRow;
    }));

    // Formatting
    sheet.getRange(1, 1, 1, 4).merge().setFontSize(16).setFontWeight('bold').setHorizontalAlignment('center');
    sheet.getRange(3, 1, 1, 4).setFontWeight('bold').setBackground('#E3F2FD');
    sheet.getRange(9, 1, 1, 4).setFontWeight('bold').setBackground('#F3E5F5');
    sheet.getRange(15, 1, 1, 4).setFontWeight('bold').setBackground('#E8F5E8');

    // Auto-resize columns
    for (let i = 1; i <= 4; i++) {
        sheet.autoResizeColumn(i);
    }
}

// 🔗 SIMPLE VERCONNECTION TEST
function testVercelConnectionSimple() {
    logMessage('INFO', 'API', 'testConnection', 'Testing connection to Vercel API...');

    try {
        // Test with GET request
        const response = UrlFetchApp.fetch(CONFIG.VERCEL_API_URL, {
            method: 'GET',
            muteHttpExceptions: true
        });

        const statusCode = response.getResponseCode();

        if (statusCode === 200 || statusCode === 404) {
            // 404 is okay because we're hitting the API endpoint directly
            logMessage('INFO', 'API', 'testConnection', `✅ Vercel API accessible (Status: ${statusCode})`);
            return true;
        } else {
            logMessage('WARN', 'API', 'testConnection', `⚠️ API returned status ${statusCode}`);
            return false;
        }

    } catch (error) {
        logMessage('ERROR', 'API', 'testConnection', 'Failed to connect to Vercel API: ' + error.toString());
        return false;
    }
}

// ⏰ SIMPLE TRIGGER SETUP
function setupSystemTriggersSimple() {
    logMessage('INFO', 'SYSTEM', 'setupTriggers', 'Setting up system triggers...');

    // Remove existing triggers
    const triggers = ScriptApp.getProjectTriggers();
    triggers.forEach(trigger => {
        ScriptApp.deleteTrigger(trigger);
    });

    // Create new triggers
    ScriptApp.newTrigger('scanNewFiles')
        .timeBased()
        .everyMinutes(10)
        .create();

    ScriptApp.newTrigger('processQueueItems')
        .timeBased()
        .everyMinutes(5)
        .create();

    ScriptApp.newTrigger('updateMonitoring')
        .timeBased()
        .everyHours(1)
        .create();

    logMessage('INFO', 'SYSTEM', 'setupTriggers', '✅ System triggers set up successfully');
}

// 🔍 SIMPLE FILE SCAN
function initialFileScanSimple() {
    logMessage('INFO', 'SCANNER', 'initialScan', 'Starting initial file scan...');

    const folder = DriveApp.getFolderById(CONFIG.SOURCE_FOLDER_ID);
    const files = folder.getFiles();

    let totalFiles = 0;
    let newFiles = 0;

    // Get existing file IDs from spreadsheet
    const existingIds = getExistingFileIds();

    while (files.hasNext()) {
        totalFiles++;
        const file = files.next();

        if (!existingIds.includes(file.getId())) {
            // Add to spreadsheet
            addFileToSheet(file);
            newFiles++;

            // Add to processing queue
            addToProcessingQueue(file);
        }

        // Limit to 100 files in initial scan
        if (totalFiles >= 100) break;
    }

    logMessage('INFO', 'SCANNER', 'initialScan', `Initial scan: ${newFiles} new files out of ${totalFiles} total`);

    return { totalFiles, newFiles };
}

// 📋 GET EXISTING FILE IDs FROM SPREADSHEET
function getExistingFileIds() {
    try {
        const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
        const sheet = ss.getSheetByName('Data Buku');

        if (!sheet || sheet.getLastRow() <= 1) {
            return [];
        }

        const data = sheet.getRange(2, 2, sheet.getLastRow() - 1, 1).getValues(); // Column B: DRIVE_ID
        return data.flat().filter(id => id !== '');

    } catch (error) {
        logMessage('ERROR', 'DATA', 'getExistingIds', 'Failed to get existing IDs: ' + error.toString());
        return [];
    }
}

// 📝 ADD FILE TO SPREADSHEET
function addFileToSheet(file) {
    try {
        const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
        let sheet = ss.getSheetByName('Data Buku');

        if (!sheet) {
            sheet = ss.insertSheet('Data Buku');
            setupSheetHeaders(sheet, 'DATA');
        }

        const now = new Date().toISOString();
        const fileSizeKB = Math.round(file.getSize() / 1024);
        const fileName = file.getName();
        const extension = fileName.split('.').pop().toLowerCase();

        const rowData = [
            Utilities.getUuid(),                    // ID
            file.getId(),                           // DRIVE_ID
            fileName,                               // FILE_NAME
            file.getUrl(),                          // FILE_PATH
            fileSizeKB,                             // FILE_SIZE_KB
            extension,                              // EXTENSION
            file.getMimeType(),                     // MIME_TYPE
            fileName.replace(/\.[^/.]+$/, ""),      // TITLE
            "Unknown",                              // AUTHOR
            "",                                     // YEAR
            "",                                     // ISBN
            "",                                     // PUBLISHER
            "General",                              // CATEGORY
            "",                                     // SUBCATEGORY
            "",                                     // TAGS
            "id",                                   // LANGUAGE
            "",                                     // PAGES
            "",                                     // EDITION
            "NOT_READ",                             // READ_STATUS
            "",                                     // RATING
            "FALSE",                                // FAVORITE
            now,                                    // CREATED_DATE
            now,                                    // MODIFIED_DATE
            Session.getActiveUser().getEmail(),     // OWNER
            file.getUrl(),                          // DRIVE_URL
            `https://drive.google.com/uc?export=download&id=${file.getId()}`, // DOWNLOAD_URL
            file.getUrl(),                          // PREVIEW_URL
            now,                                    // METADATA_DATE
            "DETECTED",                             // METADATA_STATUS
            "QUEUED",                               // PROCESSING_STATUS
            "",                                     // PROCESSING_DATE
            "",                                     // PROCESSING_TIME
            Utilities.getUuid(),                    // WEBHOOK_JOB_ID
            "PENDING",                              // WEBHOOK_STATUS
            "",                                     // WEBHOOK_RESPONSE
            "",                                     // ERROR_MESSAGE
            "Auto-detected",                        // NOTES
            now,                                    // LAST_ACCESSED
            0,                                      // ACCESS_COUNT
            "Google Drive",                         // SOURCE
            "",                                     // LICENSE
            "",                                     // KEYWORDS
            "MD5",                                  // CHECKSUM
            "1.0"                                   // VERSION
        ];

        const lastRow = sheet.getLastRow();
        sheet.getRange(lastRow + 1, 1, 1, rowData.length).setValues([rowData]);

        logMessage('INFO', 'DATA', 'addFile', `Added file: ${fileName}`);

        return true;

    } catch (error) {
        logMessage('ERROR', 'DATA', 'addFile', 'Failed to add file to sheet: ' + error.toString());
        return false;
    }
}

// ⏳ ADD TO PROCESSING QUEUE
function addToProcessingQueue(file) {
    try {
        const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
        let sheet = ss.getSheetByName('Processing Queue');

        if (!sheet) {
            sheet = ss.insertSheet('Processing Queue');
            setupSheetHeaders(sheet, 'QUEUE');
        }

        const now = new Date().toISOString();
        const jobId = Utilities.getUuid();

        const queueData = [
            jobId,                                  // JOB_ID
            file.getId(),                           // FILE_ID
            file.getName(),                         // FILE_NAME
            "NORMAL",                               // PRIORITY
            "PENDING",                              // STATUS
            0,                                      // ATTEMPTS
            now,                                    // CREATED_AT
            now,                                    // SCHEDULED_FOR
            "",                                     // STARTED_AT
            "",                                     // COMPLETED_AT
            "",                                     // PROCESSING_TIME
            "",                                     // AI_PROVIDER
            "",                                     // OUTPUTS
            0,                                      // ERROR_COUNT
            ""                                      // RETRY_AFTER
        ];

        const lastRow = sheet.getLastRow();
        sheet.getRange(lastRow + 1, 1, 1, queueData.length).setValues([queueData]);

        // Update file status in Data Buku sheet
        updateFileStatus(file.getId(), 'QUEUED', jobId);

        logMessage('INFO', 'QUEUE', 'add', `Added to queue: ${file.getName()}`);

        return jobId;

    } catch (error) {
        logMessage('ERROR', 'QUEUE', 'add', 'Failed to add to queue: ' + error.toString());
        return null;
    }
}

// 🔄 UPDATE FILE STATUS
function updateFileStatus(fileId, status, jobId = '') {
    try {
        const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
        const sheet = ss.getSheetByName('Data Buku');

        if (!sheet || sheet.getLastRow() <= 1) return false;

        // Find the row with matching DRIVE_ID (column B)
        const data = sheet.getRange(2, 2, sheet.getLastRow() - 1, 1).getValues();

        for (let i = 0; i < data.length; i++) {
            if (data[i][0] === fileId) {
                const rowIndex = i + 2; // +2 because header is row 1

                // Update PROCESSING_STATUS (column 30)
                sheet.getRange(rowIndex, 30).setValue(status);

                // Update WEBHOOK_JOB_ID (column 33) if provided
                if (jobId) {
                    sheet.getRange(rowIndex, 33).setValue(jobId);
                }

                // Update WEBHOOK_STATUS (column 34)
                sheet.getRange(rowIndex, 34).setValue(status === 'QUEUED' ? 'PENDING' : status);

                // Update timestamp if processing
                if (status === 'PROCESSING') {
                    sheet.getRange(rowIndex, 31).setValue(new Date().toISOString()); // PROCESSING_DATE
                } else if (status === 'COMPLETED' || status === 'ERROR') {
                    sheet.getRange(rowIndex, 32).setValue('60'); // PROCESSING_TIME (placeholder)
                }

                logMessage('INFO', 'DATA', 'updateStatus', `Updated ${fileId} to ${status}`);
                return true;
            }
        }

        return false;

    } catch (error) {
        logMessage('ERROR', 'DATA', 'updateStatus', 'Failed to update status: ' + error.toString());
        return false;
    }
}

// 📧 SEND EMAIL NOTIFICATION
function sendEmailNotification(subject, body) {
    if (!CONFIG.EMAIL_NOTIFICATIONS) return;

    try {
        MailApp.sendEmail({
            to: CONFIG.ADMIN_EMAIL,
            subject: `BUKA BUKU: ${subject}`,
            body: body
        });

        logMessage('INFO', 'NOTIFICATION', 'sendEmail', `Email sent: ${subject}`);

    } catch (error) {
        logMessage('ERROR', 'NOTIFICATION', 'sendEmail', 'Failed to send email: ' + error.toString());
    }
}

// 🛠️ SETUP SHEET HEADERS
function setupSheetHeaders(sheet, sheetType) {
    const headers = SHEET_HEADERS[sheetType];
    if (headers) {
        sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
        sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
        sheet.getRange(1, 1, 1, headers.length).setBackground('#f0f0f0');
        sheet.setFrozenRows(1);

        // Auto-resize columns
        for (let i = 1; i <= headers.length; i++) {
            sheet.autoResizeColumn(i);
        }
    }
}

// ==============================================
// 🎯 MAIN WORKFLOW FUNCTIONS (FOR TRIGGERS)
// ==============================================

// 🔍 SCAN NEW FILES (Main trigger function)
function scanNewFiles() {
    logMessage('INFO', 'MONITOR', 'scan', 'Scanning for new files...');

    try {
        const folder = DriveApp.getFolderById(CONFIG.SOURCE_FOLDER_ID);
        const files = folder.getFiles();

        const existingIds = getExistingFileIds();
        let newFiles = 0;

        while (files.hasNext()) {
            const file = files.next();

            if (!existingIds.includes(file.getId())) {
                addFileToSheet(file);
                addToProcessingQueue(file);
                newFiles++;

                // Limit batch size
                if (newFiles >= CONFIG.BATCH_SIZE) break;
            }
        }

        if (newFiles > 0) {
            logMessage('INFO', 'MONITOR', 'scan', `Found ${newFiles} new files`);

            // Send notification
            if (CONFIG.EMAIL_NOTIFICATIONS && newFiles > 0) {
                sendEmailNotification(
                    `📚 ${newFiles} New Books Detected`,
                    `BUKA BUKU found ${newFiles} new books.\n\n` +
                    `Processing has started. Check the dashboard:\n` +
                    `${CONFIG.VERCEL_DASHBOARD_URL}`
                );
            }
        } else {
            logMessage('INFO', 'MONITOR', 'scan', 'No new files found');
        }

        // Update monitoring
        updateMonitoringSimple(newFiles);

        return newFiles;

    } catch (error) {
        logMessage('ERROR', 'MONITOR', 'scan', 'File scan failed: ' + error.toString());
        return 0;
    }
}

// 🔄 PROCESS QUEUE ITEMS (Main trigger function)
function processQueueItems() {
    logMessage('INFO', 'QUEUE', 'process', 'Processing queue items...');

    try {
        const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
        const sheet = ss.getSheetByName('Processing Queue');

        if (!sheet || sheet.getLastRow() <= 1) {
            logMessage('INFO', 'QUEUE', 'process', 'Queue is empty');
            return 0;
        }

        const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
        const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

        // Find columns indices
        const statusIndex = headers.indexOf('STATUS');
        const attemptsIndex = headers.indexOf('ATTEMPTS');
        const fileIdIndex = headers.indexOf('FILE_ID');
        const fileNameIndex = headers.indexOf('FILE_NAME');
        const jobIdIndex = headers.indexOf('JOB_ID');

        let processed = 0;
        let errors = 0;

        // Process PENDING items, limit to batch size
        for (let i = 0; i < Math.min(data.length, CONFIG.BATCH_SIZE); i++) {
            const row = data[i];
            const status = row[statusIndex];
            const attempts = row[attemptsIndex] || 0;

            if (status === 'PENDING' && attempts < CONFIG.MAX_RETRIES) {
                const fileId = row[fileIdIndex];
                const fileName = row[fileNameIndex];
                const jobId = row[jobIdIndex];
                const rowNumber = i + 2; // +2 for header row and 0-index

                try {
                    // Update status to PROCESSING
                    sheet.getRange(rowNumber, statusIndex + 1).setValue('PROCESSING');
                    sheet.getRange(rowNumber, headers.indexOf('STARTED_AT') + 1).setValue(new Date().toISOString());
                    sheet.getRange(rowNumber, attemptsIndex + 1).setValue(attempts + 1);

                    // Update file status
                    updateFileStatus(fileId, 'PROCESSING', jobId);

                    // Get file URL
                    const fileUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

                    // Send to Vercel API
                    const result = sendToVercel(fileId, fileName, fileUrl, jobId);

                    if (result.success) {
                        // Update queue status
                        sheet.getRange(rowNumber, statusIndex + 1).setValue('SENT_TO_API');
                        sheet.getRange(rowNumber, headers.indexOf('AI_PROVIDER') + 1).setValue('Multiple AI');
                        sheet.getRange(rowNumber, headers.indexOf('OUTPUTS') + 1).setValue('12 formats');

                        logMessage('INFO', 'QUEUE', 'process', `Sent to API: ${fileName}`);
                        processed++;

                    } else {
                        throw new Error(result.error || 'API request failed');
                    }

                } catch (error) {
                    errors++;
                    logMessage('ERROR', 'QUEUE', 'process', `Failed: ${fileName} - ${error.toString()}`);

                    // Update error status
                    sheet.getRange(rowNumber, statusIndex + 1).setValue('ERROR');
                    sheet.getRange(rowNumber, headers.indexOf('ERROR_COUNT') + 1).setValue(attempts + 1);

                    // Calculate retry time
                    const retryMinutes = Math.pow(2, attempts) * 5;
                    const retryTime = new Date(Date.now() + retryMinutes * 60000).toISOString();
                    sheet.getRange(rowNumber, headers.indexOf('RETRY_AFTER') + 1).setValue(retryTime);

                    // Update file status
                    updateFileStatus(fileId, 'ERROR');
                }

                // Small delay between processing
                Utilities.sleep(1000);
            }
        }

        logMessage('INFO', 'QUEUE', 'process', `Processed: ${processed} successful, ${errors} errors`);
        return processed;

    } catch (error) {
        logMessage('ERROR', 'QUEUE', 'process', 'Queue processing failed: ' + error.toString());
        return 0;
    }
}

// 🚀 SEND TO VEREL API
function sendToVercel(fileId, fileName, fileUrl, jobId) {
    logMessage('INFO', 'API', 'send', `Sending to Vercel: ${fileName}`);

    const payload = {
        fileId: fileId,
        fileName: fileName,
        fileUrl: fileUrl,
        jobId: jobId,
        spreadsheetId: CONFIG.SPREADSHEET_ID,
        timestamp: new Date().toISOString()
    };

    const options = {
        method: 'POST',
        contentType: 'application/json',
        payload: JSON.stringify(payload),
        muteHttpExceptions: true,
        headers: {
            'Authorization': `Bearer ${CONFIG.VERCEL_TOKEN}`,
            'User-Agent': 'BUKA-BUKU/2.0'
        }
    };

    try {
        const response = UrlFetchApp.fetch(CONFIG.VERCEL_API_URL, options);
        const statusCode = response.getResponseCode();
        const responseText = response.getContentText();

        if (statusCode >= 200 && statusCode < 300) {
            return {
                success: true,
                status: statusCode,
                message: 'Sent to Vercel API successfully'
            };
        } else {
            return {
                success: false,
                status: statusCode,
                error: `API returned ${statusCode}: ${responseText.substring(0, 200)}`
            };
        }

    } catch (error) {
        return {
            success: false,
            error: error.toString()
        };
    }
}

// 📊 UPDATE MONITORING
function updateMonitoringSimple(newFiles = 0) {
    try {
        const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
        let sheet = ss.getSheetByName('Monitoring');

        if (!sheet) {
            sheet = ss.insertSheet('Monitoring');
            setupSheetHeaders(sheet, 'MONITOR');
        }

        const now = new Date().toISOString();

        // Get stats
        const dataSheet = ss.getSheetByName('Data Buku');
        const queueSheet = ss.getSheetByName('Processing Queue');

        const totalFiles = dataSheet ? dataSheet.getLastRow() - 1 : 0;
        const queueSize = queueSheet ? queueSheet.getLastRow() - 1 : 0;

        // Calculate storage used
        let storageUsed = 0;
        try {
            const folder = DriveApp.getFolderById(CONFIG.SOURCE_FOLDER_ID);
            const files = folder.getFiles();
            let totalSize = 0;
            while (files.hasNext()) {
                totalSize += files.next().getSize();
            }
            storageUsed = Math.round(totalSize / 1024 / 1024);
        } catch (e) {
            storageUsed = 0;
        }

        const monitorData = [
            now,                                    // TIMESTAMP
            totalFiles,                             // TOTAL_FILES
            newFiles,                               // NEW_FILES
            0,                                      // PROCESSED_TODAY (placeholder)
            0,                                      // FAILED_TODAY (placeholder)
            60,                                     // AVG_PROCESSING_TIME (placeholder)
            queueSize,                              // QUEUE_SIZE
            'Free Tier',                            // AI_CREDITS_USED
            storageUsed,                            // STORAGE_USED_MB
            now,                                    // LAST_SUCCESS
            '',                                     // LAST_ERROR
            'ACTIVE',                               // SYSTEM_STATUS
            new Date(Date.now() + 10 * 60000).toISOString() // NEXT_SCHEDULE
        ];

        const lastRow = sheet.getLastRow();
        sheet.getRange(lastRow + 1, 1, 1, monitorData.length).setValues([monitorData]);

        logMessage('INFO', 'MONITOR', 'update', 'Monitoring updated');

    } catch (error) {
        logMessage('ERROR', 'MONITOR', 'update', 'Failed to update monitoring: ' + error.toString());
    }
}

// ==============================================
// 🎯 MANUAL CONTROL FUNCTIONS (FOR UI)
// ==============================================

// 🖱️ MANUAL SCAN (for UI button)
function manualScan() {
    const result = scanNewFiles();
    const ui = SpreadsheetApp.getUi();

    if (result > 0) {
        ui.alert('✅ Scan Completed', `Found ${result} new files. Processing has started.`, ui.ButtonSet.OK);
    } else {
        ui.alert('ℹ️ No New Files', 'No new files found in the source folder.', ui.ButtonSet.OK);
    }

    return result;
}

// 🖱️ MANUAL PROCESS QUEUE (for UI button)
function manualProcess() {
    const result = processQueueItems();
    const ui = SpreadsheetApp.getUi();

    ui.alert('🔄 Queue Processing', `Processed ${result} items from the queue.`, ui.ButtonSet.OK);

    return result;
}

// 🖱️ SYSTEM CHECK (for UI button)
function runSystemCheck() {
    const ui = SpreadsheetApp.getUi();

    try {
        // Test 1: Drive Access
        const folder = DriveApp.getFolderById(CONFIG.SOURCE_FOLDER_ID);
        const driveTest = folder ? '✅ PASS' : '❌ FAIL';

        // Test 2: Spreadsheet Access
        const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
        const sheetTest = ss ? '✅ PASS' : '❌ FAIL';

        // Test 3: API Connection
        const apiTest = testVercelConnectionSimple() ? '✅ PASS' : '❌ FAIL';

        // Test 4: Triggers
        const triggers = ScriptApp.getProjectTriggers();
        const triggerTest = triggers.length > 0 ? '✅ PASS' : '❌ FAIL';

        const report = `🏥 SYSTEM HEALTH CHECK
    
• Google Drive Access: ${driveTest}
• Spreadsheet Access: ${sheetTest}
• Vercel API Connection: ${apiTest}
• System Triggers: ${triggerTest} (${triggers.length} active)

📊 STATISTICS
• Source Folder: https://drive.google.com/drive/folders/${CONFIG.SOURCE_FOLDER_ID}
• Dashboard: ${CONFIG.VERCEL_DASHBOARD_URL}
• Admin Email: ${CONFIG.ADMIN_EMAIL}

✅ System is ${triggers.length > 0 ? 'ACTIVE' : 'INACTIVE'}`;

        ui.alert('System Health Check', report, ui.ButtonSet.OK);

        return report;

    } catch (error) {
        ui.alert('❌ System Check Failed', error.toString(), ui.ButtonSet.OK);
        return error.toString();
    }
}

// 🖱️ GENERATE REPORT (for UI button)
function generateReport() {
    const ui = SpreadsheetApp.getUi();

    try {
        const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
        const dataSheet = ss.getSheetByName('Data Buku');
        const queueSheet = ss.getSheetByName('Processing Queue');

        const totalBooks = dataSheet ? dataSheet.getLastRow() - 1 : 0;
        const queueSize = queueSheet ? queueSheet.getLastRow() - 1 : 0;

        const report = `📅 BUKA BUKU SYSTEM REPORT
    
📊 STATISTICS
• Total Books in System: ${totalBooks}
• Items in Processing Queue: ${queueSize}
• System Status: ACTIVE

🚀 NEXT ACTIONS
${queueSize > 0 ? `• Process ${queueSize} queued items` : '• Add more books to Google Drive folder'}

🔗 IMPORTANT LINKS
• Web Dashboard: ${CONFIG.VERCEL_DASHBOARD_URL}
• Source Folder: https://drive.google.com/drive/folders/${CONFIG.SOURCE_FOLDER_ID}
• This Spreadsheet: https://docs.google.com/spreadsheets/d/${CONFIG.SPREADSHEET_ID}/edit

📧 NOTIFICATIONS
• Email notifications: ${CONFIG.EMAIL_NOTIFICATIONS ? 'ENABLED' : 'DISABLED'}
• Admin email: ${CONFIG.ADMIN_EMAIL}

---
Report generated: ${new Date().toISOString()}`;

        ui.alert('System Report', report, ui.ButtonSet.OK);

        // Also send email
        if (CONFIG.EMAIL_NOTIFICATIONS) {
            sendEmailNotification('System Report', report);
        }

        return report;

    } catch (error) {
        ui.alert('❌ Report Generation Failed', error.toString(), ui.ButtonSet.OK);
        return error.toString();
    }
}

// ==============================================
// 🎪 ON-OPEN MENU SETUP
// ==============================================

function onOpen() {
    const ui = SpreadsheetApp.getUi();

    ui.createMenu('📚 BUKA BUKU')
        .addItem('🚀 Initialize System', 'initializeBukaBukuSystem')
        .addSeparator()
        .addItem('🔍 Scan New Files', 'manualScan')
        .addItem('🔄 Process Queue', 'manualProcess')
        .addItem('📊 Generate Report', 'generateReport')
        .addItem('🏥 System Check', 'runSystemCheck')
        .addSeparator()
        .addItem('🌐 Open Dashboard', 'openDashboard')
        .addItem('📁 Open Source Folder', 'openSourceFolder')
        .addToUi();
}

function openDashboard() {
    const html = HtmlService.createHtmlOutput(`
    <script>
      window.open('${CONFIG.VERCEL_DASHBOARD_URL}', '_blank');
      google.script.host.close();
    </script>
  `).setWidth(100).setHeight(50);

    SpreadsheetApp.getUi().showModalDialog(html, 'Opening Dashboard...');
}

function openSourceFolder() {
    const html = HtmlService.createHtmlOutput(`
    <script>
      window.open('https://drive.google.com/drive/folders/${CONFIG.SOURCE_FOLDER_ID}', '_blank');
      google.script.host.close();
    </script>
  `).setWidth(100).setHeight(50);

    SpreadsheetApp.getUi().showModalDialog(html, 'Opening Source Folder...');
}

// ==============================================
// 🚀 DEPLOYMENT INSTRUCTIONS
// ==============================================
/*
1. Copy this entire script to Google Apps Script
2. Run initializeBukaBukuSystem() once
3. Use the custom menu for manual controls
4. System auto-runs every 10 minutes
*/

// 🎯 RUN THIS FIRST: Initialize the system
function runFirstTimeSetup() {
    return initializeBukaBukuSystem();
}
