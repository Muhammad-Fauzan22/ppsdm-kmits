// ==============================================
// 📚 EBOOK MANAGEMENT SYSTEM V3.5.0
// ==============================================

// CONFIGURASI UTAMA
const CONFIG = {
  "SYSTEM_NAME": "EBOOK_LMS_ENTERPRISE_V3",
  "VERSION": "3.5.0",
  "BUILD_DATE": "2024-01-24",
  
  "DRIVE": {
    "SOURCE_FOLDER_ID": "1B1g7rSHGQtO1VXEWxSS8Ncbg0R3nxmFf",
    "PROCESSED_FOLDER_NAME": "📚 PROCESSED BOOKS",
    "ARCHIVE_FOLDER_NAME": "📦 ARCHIVE",
    "BACKUP_FOLDER_NAME": "💾 SYSTEM BACKUPS",
    "EXPORT_FOLDER_NAME": "📤 DATA EXPORTS",
    "TEMP_FOLDER_NAME": "⚡ TEMP PROCESSING",
    "LOGS_FOLDER_NAME": "📝 SYSTEM LOGS"
  },
  
  "SHEETS": {
    "SPREADSHEET_ID": "1QEj9aoXDrAu6PKdFX-FNQt5pWlf7VsWMGeeU-PF9tQM",
    "SHEET_NAMES": [
      "🎯 DASHBOARD",
      "📚 DATABASE UTAMA",
      "📊 METADATA ANALYSIS",
      "🗂️ KATEGORI & TAG",
      "📈 STATISTICS DASHBOARD",
      "📁 STRUKTUR FOLDER",
      "🔍 SEARCH INDEX",
      "❌ ERROR LOG",
      "📝 RINGKASAN",
      "🔄 PROGRESS TRACKER",
      "🏆 MILESTONES",
      "📋 PROCESSING LOG",
      "⚙️ SYSTEM CONFIG",
      "🧹 CACHE STATUS",
      "💾 BACKUP LOG"
    ],
    
    "COLUMNS": {
      "MAIN_DB": [
        "ID", "DRIVE_ID", "FILE_NAME", "FILE_PATH", "FILE_SIZE_KB", "EXTENSION", "MIME_TYPE",
        "TITLE", "AUTHOR", "YEAR", "ISBN", "PUBLISHER", "CATEGORY", "SUBCATEGORY", "TAGS",
        "LANGUAGE", "PAGES", "EDITION", "READ_STATUS", "RATING", "FAVORITE", "CREATED_DATE",
        "MODIFIED_DATE", "OWNER", "DRIVE_URL", "DOWNLOAD_URL", "PREVIEW_URL", "METADATA_DATE",
        "METADATA_STATUS", "PROCESSING_STATUS", "PROCESSING_DATE", "PROCESSING_TIME",
        "STEPPER_JOB_ID", "OUTPUT_URL", "ERROR_MESSAGE", "NOTES", "LAST_ACCESSED",
        "ACCESS_COUNT", "SOURCE", "LICENSE", "KEYWORDS"
      ],
      
      "PROCESSING_LOG": [
        "TIMESTAMP", "LOG_ID", "MODULE", "OPERATION", "FILE_ID", "FILE_NAME",
        "STATUS", "MESSAGE", "DURATION_MS", "USER"
      ],
      
      "ERROR_LOG": [
        "TIMESTAMP", "ERROR_ID", "SEVERITY", "MODULE", "FUNCTION", "FILE_ID",
        "ERROR_CODE", "ERROR_MESSAGE", "STACK_TRACE", "RESOLUTION", "RESOLVED",
        "RESOLVED_BY", "RESOLVED_DATE"
      ],
      
      "METADATA_ANALYSIS": [
        "FILE_ID", "ANALYSIS_DATE", "TITLE_CONFIDENCE", "AUTHOR_CONFIDENCE",
        "YEAR_CONFIDENCE", "ISBN_CONFIDENCE", "LANGUAGE_DETECTED", "PAGE_COUNT",
        "WORD_COUNT", "FILE_FORMAT", "ENCRYPTION_STATUS", "METADATA_QUALITY_SCORE",
        "SUGGESTED_CATEGORY", "SUGGESTED_TAGS", "OCR_REQUIRED", "OCR_STATUS",
        "COVER_IMAGE_URL", "TABLE_OF_CONTENTS", "KEY_TOPICS", "READING_LEVEL",
        "SENTIMENT_SCORE", "COMPLEXITY_SCORE", "RECOMMENDED_ACTIONS"
      ],
      
      "STATISTICS_DASHBOARD": [
        "METRIC_DATE", "TOTAL_BOOKS", "TOTAL_SIZE_MB", "BY_CATEGORY", "BY_LANGUAGE",
        "BY_YEAR", "PROCESSED_TODAY", "ERRORS_TODAY", "AVG_PROCESSING_TIME",
        "TOP_AUTHORS", "TOP_CATEGORIES", "MOST_ACCESSED", "RECENT_ADDITIONS",
        "SYSTEM_HEALTH", "STORAGE_USAGE", "API_CALLS", "USER_ACTIVITY"
      ]
    }
  },
  
  "PROCESSING": {
    "BATCH_SIZE": 20,
    "MAX_EXECUTION_MINUTES": 5,
    "CHECKPOINT_INTERVAL": 10,
    "MAX_FILE_SIZE_MB": 50,
    "SUPPORTED_FORMATS": ["pdf", "doc", "docx", "txt", "epub", "mobi", "azw", "rtf"],
    "ENABLE_RECURSIVE_SCAN": true,
    "ENABLE_AUTO_RENAME": true,
    "ENABLE_METADATA_EXTRACTION": true,
    "ENABLE_CATEGORY_PREDICTION": true,
    "ENABLE_STEPPER_INTEGRATION": false
  },
  
  "NOTIFICATION": {
    "ADMIN_EMAIL": "punyofauzan3@gmail.com",
    "ENABLE_EMAIL_ALERTS": true,
    "ENABLE_SHEET_NOTIFICATIONS": true,
    "DAILY_REPORT_HOUR": 9,
    "WEEKLY_REPORT_DAY": 1
  },
  
  "MAINTENANCE": {
    "AUTO_BACKUP_DAYS": 7,
    "MAX_CACHE_SIZE_MB": 50,
    "CLEANUP_INTERVAL_HOURS": 24,
    "LOG_RETENTION_DAYS": 30
  }
};

// VARIABEL GLOBAL
let ACTIVE_BATCHES = new Map();
let SYSTEM_LOG = [];
let API_ENDPOINT = 'https://ppsdm-kmits.vercel.app/api/process';
let VERBOSE_LOGGING = true;

// ==============================================
// 🚀 FUNGSI INISIALISASI SISTEM
// ==============================================

/**
 * Fungsi utama untuk menginisialisasi sistem
 * Dipanggil dari tombol "🚀 INITIALIZE SYSTEM"
 */
function initializeBukaBukuSystem() {
  try {
    logSystem("SYSTEM.initializeBukaBukuSystem", "🚀 Memulai inisialisasi sistem BUKA BUKU...");
    
    // 1. Setup Spreadsheet terlebih dahulu (tanpa menghapus sheet yang ada)
    const spreadsheet = setupSpreadsheetStructure();
    logSystem("SYSTEM.initializeBukaBukuSystem", "✅ Struktur spreadsheet siap");
    
    // 2. Setup folder di Google Drive
    const folderStructure = setupDriveFolderStructure();
    logSystem("SYSTEM.initializeBukaBukuSystem", "✅ Struktur folder siap");
    
    // 3. Setup triggers
    setupSystemTriggers();
    logSystem("SYSTEM.initializeBukaBukuSystem", "✅ Triggers sistem disetup");
    
    // 4. Buat backup awal
    createInitialBackup();
    logSystem("SYSTEM.initializeBukaBukuSystem", "✅ Backup awal dibuat");
    
    // 5. Update dashboard
    updateDashboard();
    logSystem("SYSTEM.initializeBukaBukuSystem", "✅ Dashboard diperbarui");
    
    // 6. Kirim notifikasi
    sendNotification("✅ BUKA BUKU System Initialization Complete", 
      `System ${CONFIG.SYSTEM_NAME} v${CONFIG.VERSION} berhasil diinisialisasi pada ${new Date().toLocaleString()}`);
    
    logSystem("SYSTEM.initializeBukaBukuSystem", "🎉 Inisialisasi sistem SELESAI!");
    
    return {
      success: true,
      message: "System initialized successfully",
      spreadsheet: spreadsheet.getId(),
      folders: folderStructure,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    logError("SYSTEM.initializeBukaBukuSystem", error, { severity: "CRITICAL" });
    sendNotification("❌ BUKA BUKU System Initialization Failed", 
      `Error: ${error.message}\n\nSilakan periksa log error di spreadsheet.`);
    
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Setup struktur spreadsheet tanpa menghapus sheet yang ada
 */
function setupSpreadsheetStructure() {
  try {
    logSystem("SPREADSHEET.setupSpreadsheetStructure", "📊 Membuat struktur spreadsheet...");
    
    // Buka spreadsheet berdasarkan ID
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SHEETS.SPREADSHEET_ID);
    
    // Untuk setiap sheet yang diperlukan, buat jika belum ada
    CONFIG.SHEETS.SHEET_NAMES.forEach(sheetName => {
      let sheet = spreadsheet.getSheetByName(sheetName);
      
      if (!sheet) {
        sheet = spreadsheet.insertSheet(sheetName);
        logSystem("SPREADSHEET.setupSpreadsheetStructure", `📄 Sheet "${sheetName}" dibuat`);
      } else {
        logSystem("SPREADSHEET.setupSpreadsheetStructure", `📄 Sheet "${sheetName}" sudah ada`);
      }
      
      // Setup konten berdasarkan jenis sheet
      setupSheetContent(sheet, sheetName);
    });
    
    // Hapus sheet default jika ada (Sheet1, Sheet2, etc)
    const allSheets = spreadsheet.getSheets();
    const defaultSheets = allSheets.filter(sheet => 
      sheet.getName().match(/^Sheet\d*$/) && 
      !CONFIG.SHEETS.SHEET_NAMES.includes(sheet.getName())
    );
    
    // Biarkan minimal 1 sheet yang tidak akan kita hapus
    if (defaultSheets.length > 1) {
      for (let i = defaultSheets.length - 1; i >= 1; i--) {
        spreadsheet.deleteSheet(defaultSheets[i]);
      }
    }
    
    logSystem("SPREADSHEET.setupSpreadsheetStructure", "✅ Struktur spreadsheet berhasil disetup");
    return spreadsheet;
    
  } catch (error) {
    logError("SPREADSHEET.setupSpreadsheetStructure", error);
    throw error;
  }
}

/**
 * Setup konten setiap sheet berdasarkan namanya
 */
function setupSheetContent(sheet, sheetName) {
  try {
    sheet.clear(); // Clear existing content
    
    switch(sheetName) {
      case "🎯 DASHBOARD":
        setupDashboardSheet(sheet);
        break;
        
      case "📚 DATABASE UTAMA":
        setupMainDatabaseSheet(sheet);
        break;
        
      case "📊 METADATA ANALYSIS":
        setupMetadataAnalysisSheet(sheet);
        break;
        
      case "🗂️ KATEGORI & TAG":
        setupCategoriesSheet(sheet);
        break;
        
      case "📈 STATISTICS DASHBOARD":
        setupStatisticsSheet(sheet);
        break;
        
      case "📁 STRUKTUR FOLDER":
        setupFolderStructureSheet(sheet);
        break;
        
      case "🔍 SEARCH INDEX":
        setupSearchIndexSheet(sheet);
        break;
        
      case "❌ ERROR LOG":
        setupErrorLogSheet(sheet);
        break;
        
      case "📝 RINGKASAN":
        setupSummarySheet(sheet);
        break;
        
      case "🔄 PROGRESS TRACKER":
        setupProgressTrackerSheet(sheet);
        break;
        
      case "🏆 MILESTONES":
        setupMilestonesSheet(sheet);
        break;
        
      case "📋 PROCESSING LOG":
        setupProcessingLogSheet(sheet);
        break;
        
      case "⚙️ SYSTEM CONFIG":
        setupSystemConfigSheet(sheet);
        break;
        
      case "🧹 CACHE STATUS":
        setupCacheStatusSheet(sheet);
        break;
        
      case "💾 BACKUP LOG":
        setupBackupLogSheet(sheet);
        break;
    }
    
    // Format dasar untuk semua sheet
    sheet.getRange(1, 1, 1, sheet.getLastColumn()).setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, sheet.getLastColumn());
    
  } catch (error) {
    logError("SPREADSHEET.setupSheetContent", error, { sheetName: sheetName });
  }
}

// ==============================================
// 📄 FUNGSI SETUP TIAP SHEET
// ==============================================

function setupDashboardSheet(sheet) {
  const headers = ["METRIC", "VALUE", "STATUS", "LAST_UPDATED", "TREND"];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Add dashboard content
  const metrics = [
    ["📊 Total Books", "0", "⚪", new Date().toISOString(), "→"],
    ["📈 Processed Today", "0", "🟢", new Date().toISOString(), "↑"],
    ["⚠️ Errors Today", "0", "🟡", new Date().toISOString(), "→"],
    ["⏱️ Avg Processing Time", "0s", "🟢", new Date().toISOString(), "↓"],
    ["💾 Storage Used", "0 MB", "🟢", new Date().toISOString(), "→"],
    ["🎯 System Health", "100%", "🟢", new Date().toISOString(), "→"],
    ["⏰ Last Scan", "Never", "⚪", new Date().toISOString(), "→"],
    ["👥 Active Users", "1", "🟢", new Date().toISOString(), "→"]
  ];
  
  sheet.getRange(3, 1, metrics.length, 5).setValues(metrics);
  
  // Add buttons section
  sheet.getRange(15, 1).setValue("⚡ QUICK ACTIONS");
  sheet.getRange(15, 1).setFontWeight('bold');
  
  const actions = [
    ["🔍 Scan New Files", "scanNewBooks()"],
    ["📊 Re-extract Metadata", "extractMetadataBatch()"],
    ["🔄 Reprocess Failed", "reprocessFailedFiles()"],
    ["📤 Export All Data", "exportAllData()"],
    ["🧹 Cleanup Temp", "cleanupTempFiles()"],
    ["💾 Backup Now", "createBackupNow()"],
    ["🔄 Sync Structure", "syncDriveStructure()"],
    ["📊 Update Dashboard", "updateDashboard()"]
  ];
  
  sheet.getRange(16, 1, actions.length, 2).setValues(actions);
  
  // Add charts placeholder
  sheet.getRange(25, 1).setValue("📈 REAL-TIME METRICS");
  sheet.getRange(25, 1).setFontWeight('bold');
}

function setupMainDatabaseSheet(sheet) {
  const headers = CONFIG.SHEETS.COLUMNS.MAIN_DB;
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format header
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground("#1976D2")
    .setFontColor("#FFFFFF")
    .setFontWeight("bold")
    .setVerticalAlignment("middle");
  
  // Set column widths
  const columnWidths = {
    1: 180,   // ID
    2: 180,   // DRIVE_ID
    3: 300,   // FILE_NAME
    4: 400,   // FILE_PATH
    5: 80,    // FILE_SIZE_KB
    6: 80,    // EXTENSION
    7: 120,   // MIME_TYPE
    8: 250,   // TITLE
    9: 150,   // AUTHOR
    10: 60,   // YEAR
    11: 120,  // ISBN
    12: 150,  // PUBLISHER
    13: 120,  // CATEGORY
    14: 120,  // SUBCATEGORY
    15: 200,  // TAGS
    16: 80,   // LANGUAGE
    17: 60,   // PAGES
    18: 80,   // EDITION
    19: 100,  // READ_STATUS
    20: 60,   // RATING
    21: 80,   // FAVORITE
    22: 150,  // CREATED_DATE
    23: 150,  // MODIFIED_DATE
    24: 150,  // OWNER
    25: 300,  // DRIVE_URL
    26: 300,  // DOWNLOAD_URL
    27: 300,  // PREVIEW_URL
    28: 150,  // METADATA_DATE
    29: 120,  // METADATA_STATUS
    30: 120,  // PROCESSING_STATUS
    31: 150,  // PROCESSING_DATE
    32: 100,  // PROCESSING_TIME
    33: 180,  // STEPPER_JOB_ID
    34: 300,  // OUTPUT_URL
    35: 300,  // ERROR_MESSAGE
    36: 250,  // NOTES
    37: 150,  // LAST_ACCESSED
    38: 100,  // ACCESS_COUNT
    39: 100,  // SOURCE
    40: 120,  // LICENSE
    41: 200   // KEYWORDS
  };
  
  Object.keys(columnWidths).forEach(col => {
    sheet.setColumnWidth(parseInt(col), columnWidths[col]);
  });
  
  // Freeze header row
  sheet.setFrozenRows(1);
  
  // Add data validation for certain columns
  const statusValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['PENDING', 'PROCESSING', 'COMPLETED', 'ERROR', 'ARCHIVED'])
    .setAllowInvalid(false)
    .build();
    
  sheet.getRange(2, 30, 1000, 1).setDataValidation(statusValidation);
  
  const readStatusValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['NOT_READ', 'READING', 'READ', 'REVIEWED'])
    .setAllowInvalid(false)
    .build();
    
  sheet.getRange(2, 19, 1000, 1).setDataValidation(readStatusValidation);
}

function setupMetadataAnalysisSheet(sheet) {
  const headers = CONFIG.SHEETS.COLUMNS.METADATA_ANALYSIS;
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground("#9C27B0")
    .setFontColor("#FFFFFF")
    .setFontWeight("bold");
}

function setupCategoriesSheet(sheet) {
  sheet.getRange(1, 1).setValue("🗂️ KATEGORI & TAG").setFontSize(14).setFontWeight("bold");
  
  const headers = ["CATEGORY_ID", "CATEGORY_NAME", "PARENT_CATEGORY", "BOOK_COUNT", 
                   "LAST_UPDATED", "COLOR_CODE", "DESCRIPTION", "AUTO_TAGS", "MANUAL_TAGS"];
  sheet.getRange(3, 1, 1, headers.length).setValues([headers]);
  
  sheet.getRange(3, 1, 1, headers.length)
    .setBackground("#2196F3")
    .setFontColor("#FFFFFF")
    .setFontWeight("bold");
  
  // Add sample categories
  const sampleCategories = [
    ["CAT001", "Fiction", "", "0", new Date().toISOString(), "#FF5722", "Fictional works", "novel,story,fiction", ""],
    ["CAT002", "Non-Fiction", "", "0", new Date().toISOString(), "#4CAF50", "Non-fictional works", "facts,real,information", ""],
    ["CAT003", "Technology", "Non-Fiction", "0", new Date().toISOString(), "#2196F3", "Technology related", "tech,computer,software", ""],
    ["CAT004", "Business", "Non-Fiction", "0", new Date().toISOString(), "#9C27B0", "Business and management", "business,management,finance", ""],
    ["CAT005", "Science", "Non-Fiction", "0", new Date().toISOString(), "#00BCD4", "Scientific works", "science,research,discovery", ""]
  ];
  
  sheet.getRange(4, 1, sampleCategories.length, 9).setValues(sampleCategories);
  
  // Setup tag management section
  sheet.getRange(15, 1).setValue("🏷️ TAG MANAGEMENT").setFontSize(12).setFontWeight("bold");
  
  const tagHeaders = ["TAG_ID", "TAG_NAME", "USAGE_COUNT", "RELATED_TAGS", "LAST_USED", "CATEGORIES"];
  sheet.getRange(16, 1, 1, tagHeaders.length).setValues([tagHeaders]);
}

function setupStatisticsSheet(sheet) {
  const headers = CONFIG.SHEETS.COLUMNS.STATISTICS_DASHBOARD;
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  sheet.getRange(1, 1, 1, headers.length)
    .setBackground("#FF9800")
    .setFontColor("#FFFFFF")
    .setFontWeight("bold");
}

function setupFolderStructureSheet(sheet) {
  sheet.getRange(1, 1).setValue("📁 STRUKTUR FOLDER GOOGLE DRIVE").setFontSize(14).setFontWeight("bold");
  
  const headers = ["FOLDER_ID", "FOLDER_NAME", "PARENT_FOLDER_ID", "FULL_PATH", 
                   "FILE_COUNT", "TOTAL_SIZE_MB", "LAST_SCANNED", "STATUS"];
  sheet.getRange(3, 1, 1, headers.length).setValues([headers]);
  
  sheet.getRange(3, 1, 1, headers.length)
    .setBackground("#607D8B")
    .setFontColor("#FFFFFF")
    .setFontWeight("bold");
}

function setupSearchIndexSheet(sheet) {
  sheet.getRange(1, 1).setValue("🔍 SEARCH INDEX").setFontSize(14).setFontWeight("bold");
  
  const headers = ["INDEX_ID", "FILE_ID", "TITLE", "AUTHOR", "CATEGORY", "TAGS", 
                   "CONTENT_EXTRACT", "KEYWORDS", "LAST_INDEXED", "RELEVANCE_SCORE"];
  sheet.getRange(3, 1, 1, headers.length).setValues([headers]);
  
  sheet.getRange(3, 1, 1, headers.length)
    .setBackground("#795548")
    .setFontColor("#FFFFFF")
    .setFontWeight("bold");
}

function setupErrorLogSheet(sheet) {
  const headers = CONFIG.SHEETS.COLUMNS.ERROR_LOG;
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground("#F44336")
    .setFontColor("#FFFFFF")
    .setFontWeight("bold");
  
  // Set column widths
  sheet.setColumnWidth(1, 180);  // TIMESTAMP
  sheet.setColumnWidth(2, 120);  // ERROR_ID
  sheet.setColumnWidth(3, 80);   // SEVERITY
  sheet.setColumnWidth(4, 120);  // MODULE
  sheet.setColumnWidth(5, 120);  // FUNCTION
  sheet.setColumnWidth(6, 180);  // FILE_ID
  sheet.setColumnWidth(7, 100);  // ERROR_CODE
  sheet.setColumnWidth(8, 400);  // ERROR_MESSAGE
  sheet.setColumnWidth(9, 400);  // STACK_TRACE
  sheet.setColumnWidth(10, 250); // RESOLUTION
  sheet.setColumnWidth(11, 80);  // RESOLVED
  sheet.setColumnWidth(12, 120); // RESOLVED_BY
  sheet.setColumnWidth(13, 150); // RESOLVED_DATE
}

function setupSummarySheet(sheet) {
  sheet.getRange(1, 1).setValue("📝 RINGKASAN SISTEM").setFontSize(14).setFontWeight("bold");
  
  const headers = ["REPORT_ID", "REPORT_TYPE", "PERIOD_START", "PERIOD_END", "GENERATED_BY",
                   "TOTAL_BOOKS", "NEW_BOOKS", "PROCESSED_BOOKS", "ERRORS", "AVG_PROCESSING_TIME",
                   "STORAGE_GROWTH_MB", "TOP_CATEGORY", "MOST_ACTIVE_USER", "RECOMMENDATIONS"];
  sheet.getRange(3, 1, 1, headers.length).setValues([headers]);
  
  sheet.getRange(3, 1, 1, headers.length)
    .setBackground("#009688")
    .setFontColor("#FFFFFF")
    .setFontWeight("bold");
}

function setupProgressTrackerSheet(sheet) {
  const headers = CONFIG.SHEETS.COLUMNS.PROCESSING_LOG;
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground("#FF9800")
    .setFontColor("#FFFFFF")
    .setFontWeight("bold");
}

function setupMilestonesSheet(sheet) {
  sheet.getRange(1, 1).setValue("🏆 MILESTONES & ACHIEVEMENTS").setFontSize(14).setFontWeight("bold");
  
  const headers = ["MILESTONE_ID", "MILESTONE_NAME", "TYPE", "TARGET", "CURRENT", 
                   "PROGRESS", "ACHIEVED_DATE", "REWARD", "NEXT_MILESTONE"];
  sheet.getRange(3, 1, 1, headers.length).setValues([headers]);
  
  sheet.getRange(3, 1, 1, headers.length)
    .setBackground("#FFC107")
    .setFontColor("#000000")
    .setFontWeight("bold");
}

function setupProcessingLogSheet(sheet) {
  sheet.getRange(1, 1).setValue("📋 PROCESSING LOG").setFontSize(14).setFontWeight("bold");
  
  const headers = ["LOG_ID", "OPERATION", "BATCH_ID", "START_TIME", "END_TIME",
                   "FILES_PROCESSED", "SUCCESS_COUNT", "FAILED_COUNT", "DURATION_SEC",
                   "INITIATED_BY", "STATUS", "ERRORS", "CHECKPOINT"];
  sheet.getRange(3, 1, 1, headers.length).setValues([headers]);
  
  sheet.getRange(3, 1, 1, headers.length)
    .setBackground("#673AB7")
    .setFontColor("#FFFFFF")
    .setFontWeight("bold");
}

function setupSystemConfigSheet(sheet) {
  sheet.getRange(1, 1).setValue("⚙️ SYSTEM CONFIGURATION").setFontSize(14).setFontWeight("bold");
  
  // Tampilkan CONFIG dalam format yang mudah dibaca
  const configData = [];
  
  configData.push(["SYSTEM_NAME", CONFIG.SYSTEM_NAME]);
  configData.push(["VERSION", CONFIG.VERSION]);
  configData.push(["BUILD_DATE", CONFIG.BUILD_DATE]);
  configData.push(["", ""]);
  
  // DRIVE Config
  configData.push(["📁 DRIVE CONFIGURATION", ""]);
  Object.keys(CONFIG.DRIVE).forEach(key => {
    configData.push([`  ${key}`, CONFIG.DRIVE[key]]);
  });
  
  configData.push(["", ""]);
  
  // PROCESSING Config
  configData.push(["⚡ PROCESSING CONFIGURATION", ""]);
  Object.keys(CONFIG.PROCESSING).forEach(key => {
    configData.push([`  ${key}`, CONFIG.PROCESSING[key]]);
  });
  
  configData.push(["", ""]);
  
  // NOTIFICATION Config
  configData.push(["🔔 NOTIFICATION CONFIGURATION", ""]);
  Object.keys(CONFIG.NOTIFICATION).forEach(key => {
    configData.push([`  ${key}`, CONFIG.NOTIFICATION[key]]);
  });
  
  configData.push(["", ""]);
  
  // MAINTENANCE Config
  configData.push(["🧹 MAINTENANCE CONFIGURATION", ""]);
  Object.keys(CONFIG.MAINTENANCE).forEach(key => {
    configData.push([`  ${key}`, CONFIG.MAINTENANCE[key]]);
  });
  
  sheet.getRange(3, 1, configData.length, 2).setValues(configData);
  
  // Add editable settings section
  sheet.getRange(configData.length + 5, 1).setValue("⚙️ EDITABLE SETTINGS").setFontWeight('bold');
  
  const editableSettings = [
    ["Setting", "Value", "Description", "Default", "Last Modified"],
    ["API_ENDPOINT", API_ENDPOINT, "Vercel API endpoint", "https://ppsdm-kmits.vercel.app/api/process", ""],
    ["BATCH_SIZE", CONFIG.PROCESSING.BATCH_SIZE, "Number of files to process per batch", 20, ""],
    ["MAX_FILE_SIZE_MB", CONFIG.PROCESSING.MAX_FILE_SIZE_MB, "Maximum file size in MB", 50, ""],
    ["ENABLE_EMAIL_ALERTS", CONFIG.NOTIFICATION.ENABLE_EMAIL_ALERTS, "Send email notifications", true, ""],
    ["ADMIN_EMAIL", CONFIG.NOTIFICATION.ADMIN_EMAIL, "Admin email for notifications", "punyofauzan3@gmail.com", ""]
  ];
  
  sheet.getRange(configData.length + 6, 1, editableSettings.length, 5).setValues(editableSettings);
}

function setupCacheStatusSheet(sheet) {
  sheet.getRange(1, 1).setValue("🧹 CACHE STATUS").setFontSize(14).setFontWeight("bold");
  
  const headers = ["CACHE_ID", "CACHE_TYPE", "CREATED_AT", "LAST_ACCESSED", 
                   "SIZE_KB", "ITEMS_COUNT", "HIT_RATE", "STATUS", "CLEANUP_SCHEDULED"];
  sheet.getRange(3, 1, 1, headers.length).setValues([headers]);
  
  sheet.getRange(3, 1, 1, headers.length)
    .setBackground("#8BC34A")
    .setFontColor("#000000")
    .setFontWeight("bold");
}

function setupBackupLogSheet(sheet) {
  sheet.getRange(1, 1).setValue("💾 BACKUP LOG").setFontSize(14).setFontWeight("bold");
  
  const headers = ["BACKUP_ID", "BACKUP_TYPE", "START_TIME", "END_TIME", "SIZE_MB",
                   "FILES_BACKED_UP", "LOCATION", "STATUS", "VERIFIED", "RESTORE_POINT"];
  sheet.getRange(3, 1, 1, headers.length).setValues([headers]);
  
  sheet.getRange(3, 1, 1, headers.length)
    .setBackground("#3F51B5")
    .setFontColor("#FFFFFF")
    .setFontWeight("bold");
}

// ==============================================
// 📁 FUNGSI DRIVE MANAGEMENT
// ==============================================

function setupDriveFolderStructure() {
  try {
    logSystem("DRIVE.setupDriveFolderStructure", "📁 Membuat struktur folder...");
    
    const sourceFolder = DriveApp.getFolderById(CONFIG.DRIVE.SOURCE_FOLDER_ID);
    const folders = {};
    
    // Buat semua folder yang diperlukan
    const folderNames = [
      CONFIG.DRIVE.PROCESSED_FOLDER_NAME,
      CONFIG.DRIVE.ARCHIVE_FOLDER_NAME,
      CONFIG.DRIVE.BACKUP_FOLDER_NAME,
      CONFIG.DRIVE.EXPORT_FOLDER_NAME,
      CONFIG.DRIVE.TEMP_FOLDER_NAME,
      CONFIG.DRIVE.LOGS_FOLDER_NAME
    ];
    
    folderNames.forEach(folderName => {
      try {
        const existingFolders = sourceFolder.getFoldersByName(folderName);
        
        if (existingFolders.hasNext()) {
          folders[folderName] = existingFolders.next();
          logSystem("DRIVE.setupDriveFolderStructure", `✅ Folder "${folderName}" sudah ada`);
        } else {
          folders[folderName] = sourceFolder.createFolder(folderName);
          logSystem("DRIVE.setupDriveFolderStructure", `📁 Folder "${folderName}" dibuat`);
        }
      } catch (error) {
        logError("DRIVE.setupDriveFolderStructure", error, { folderName: folderName });
      }
    });
    
    // Update folder structure sheet
    updateFolderStructureSheet(folders);
    
    return folders;
    
  } catch (error) {
    logError("DRIVE.setupDriveFolderStructure", error);
    throw error;
  }
}

function updateFolderStructureSheet(folders) {
  try {
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SHEETS.SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName("📁 STRUKTUR FOLDER");
    
    if (!sheet) return;
    
    const data = [];
    const now = new Date().toISOString();
    
    // Add source folder
    try {
      const sourceFolder = DriveApp.getFolderById(CONFIG.DRIVE.SOURCE_FOLDER_ID);
      data.push([
        CONFIG.DRIVE.SOURCE_FOLDER_ID,
        "📂 SOURCE FOLDER",
        "",
        sourceFolder.getUrl(),
        sourceFolder.getFiles().hasNext() ? ">0" : "0",
        "0",
        now,
        "ACTIVE"
      ]);
    } catch (e) {
      data.push([
        CONFIG.DRIVE.SOURCE_FOLDER_ID,
        "📂 SOURCE FOLDER",
        "",
        "NOT ACCESSIBLE",
        "0",
        "0",
        now,
        "ERROR"
      ]);
    }
    
    // Add all subfolders
    Object.keys(folders).forEach(folderName => {
      const folder = folders[folderName];
      if (folder) {
        try {
          const fileIterator = folder.getFiles();
          let fileCount = 0;
          let totalSize = 0;
          
          while (fileIterator.hasNext() && fileCount < 1000) {
            const file = fileIterator.next();
            fileCount++;
            totalSize += file.getSize();
          }
          
          data.push([
        folder.getId(),
        folderName,
        CONFIG.DRIVE.SOURCE_FOLDER_ID,
        folder.getUrl(),
        fileCount,
        Math.round(totalSize / (1024 * 1024)),
        now,
        "ACTIVE"
          ]);
        } catch (e) {
          data.push([
            folder.getId(),
            folderName,
            CONFIG.DRIVE.SOURCE_FOLDER_ID,
            folder.getUrl(),
        "ERROR",
        "ERROR",
            now,
        "ERROR"
          ]);
        }
      }
    });
    
    // Clear existing data and write new
    if (sheet.getLastRow() > 3) {
      sheet.getRange(4, 1, sheet.getLastRow() - 3, 8).clearContent();
    }
    
    if (data.length > 0) {
      sheet.getRange(4, 1, data.length, 8).setValues(data);
    }
    
  } catch (error) {
    logError("DRIVE.updateFolderStructureSheet", error);
  }
}

// ==============================================
// 🔍 FUNGSI SCANNING & PROCESSING
// ==============================================

function scanNewBooks() {
  const batchId = Utilities.getUuid();
  const startTime = Date.now();
  
  try {
    logSystem("SCAN.scanNewBooks", `🔍 Memulai scan buku baru (Batch: ${batchId})`);
    
    // Dapatkan semua file dari folder sumber
    const sourceFolder = DriveApp.getFolderById(CONFIG.DRIVE.SOURCE_FOLDER_ID);
    const files = getAllFilesRecursive(sourceFolder);
    
    logSystem("SCAN.scanNewBooks", `📁 Ditemukan ${files.length} file total`);
    
    // Filter file yang didukung
    const supportedFiles = files.filter(file => {
      const ext = file.getName().split('.').pop().toLowerCase();
      return CONFIG.PROCESSING.SUPPORTED_FORMATS.includes(ext);
    });
    
    logSystem("SCAN.scanNewBooks", `✅ ${supportedFiles.length} file dengan format didukung`);
    
    // Buka database
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SHEETS.SPREADSHEET_ID);
    const dbSheet = spreadsheet.getSheetByName("📚 DATABASE UTAMA");
    const existingIds = getExistingFileIds(dbSheet);
    
    // Filter file yang belum ada di database
    const newFiles = supportedFiles.filter(file => !existingIds.has(file.getId()));
    
    logSystem("SCAN.scanNewBooks", `🆕 ${newFiles.length} file baru akan ditambahkan`);
    
    // Batch processing
    const batchSize = Math.min(CONFIG.PROCESSING.BATCH_SIZE, newFiles.length);
    let processed = 0;
    let added = 0;
    let errors = 0;
    
    for (let i = 0; i < batchSize; i++) {
      const file = newFiles[i];
      
      try {
        const result = addFileToDatabase(dbSheet, file);
        if (result.success) {
          added++;
        } else {
          errors++;
        }
      } catch (error) {
        errors++;
        logError("SCAN.scanNewBooks", error, { 
          fileId: file.getId(), 
          fileName: file.getName() 
        });
      }
      
      processed++;
      
      // Update progress setiap 5 file
      if (processed % 5 === 0) {
        logSystem("SCAN.scanNewBooks", `⏳ Progress: ${processed}/${batchSize} files`);
      }
      
      // Jeda singkat untuk menghindari rate limit
      Utilities.sleep(100);
    }
    
    const duration = Date.now() - startTime;
    
    logSystem("SCAN.scanNewBooks", `✅ Scan selesai: ${added} ditambahkan, ${errors} error (${duration}ms)`);
    
    // Update dashboard
    updateDashboard();
    
    // Kirim notifikasi jika ada file baru
    if (added > 0) {
      sendNotification("📚 New Books Scanned", 
        `${added} buku baru ditambahkan ke database.\n${errors} error terjadi selama pemrosesan.`);
    }
    
    return {
      success: true,
      batchId: batchId,
      totalFiles: files.length,
      supportedFiles: supportedFiles.length,
      newFiles: newFiles.length,
      added: added,
      errors: errors,
      duration: duration
    };
    
  } catch (error) {
    logError("SCAN.scanNewBooks", error, { batchId: batchId });
    return {
      success: false,
      error: error.message,
      batchId: batchId,
      duration: Date.now() - startTime
    };
  }
}

function getAllFilesRecursive(folder) {
  const files = [];
  const stack = [folder];
  const visited = new Set();
  
  while (stack.length > 0) {
    const currentFolder = stack.pop();
    const folderId = currentFolder.getId();
    
    // Hindari infinite loop
    if (visited.has(folderId)) continue;
    visited.add(folderId);
    
    try {
      // Tambahkan semua file dari folder ini
      const folderFiles = currentFolder.getFiles();
      while (folderFiles.hasNext()) {
        files.push(folderFiles.next());
      }
      
      // Jika recursive scan diaktifkan, tambahkan subfolder
      if (CONFIG.PROCESSING.ENABLE_RECURSIVE_SCAN) {
        const subfolders = currentFolder.getFolders();
        while (subfolders.hasNext()) {
          stack.push(subfolders.next());
        }
      }
    } catch (error) {
      logError("SCAN.getAllFilesRecursive", error, { folderId: folderId });
    }
  }
  
  return files;
}

function getExistingFileIds(dbSheet) {
  const ids = new Set();
  
  try {
    const data = dbSheet.getDataRange().getValues();
    const driveIdIndex = 1; // Kolom B adalah DRIVE_ID
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][driveIdIndex]) {
        ids.add(data[i][driveIdIndex].toString());
      }
    }
  } catch (error) {
    logError("SCAN.getExistingFileIds", error);
  }
  
  return ids;
}

function addFileToDatabase(dbSheet, file) {
  try {
    const now = new Date().toISOString();
    const fileSizeKB = Math.round(file.getSize() / 1024);
    const mimeType = file.getMimeType();
    const fileName = file.getName();
    const fileExt = fileName.split('.').pop().toLowerCase();
    
    // Generate data untuk row baru
    const newRow = [
      Utilities.getUuid(),                    // ID
      file.getId(),                           // DRIVE_ID
      fileName,                               // FILE_NAME
      file.getUrl(),                          // FILE_PATH
      fileSizeKB,                             // FILE_SIZE_KB
      fileExt,                                // EXTENSION
      mimeType,                               // MIME_TYPE
      fileName.replace(/\.[^/.]+$/, ""),      // TITLE (remove extension)
      "",                                     // AUTHOR
      "",                                     // YEAR
      "",                                     // ISBN
      "",                                     // PUBLISHER
      "",                                     // CATEGORY
      "",                                     // SUBCATEGORY
      "",                                     // TAGS
      "",                                     // LANGUAGE
      "",                                     // PAGES
      "",                                     // EDITION
      "NOT_READ",                             // READ_STATUS
      "",                                     // RATING
      "FALSE",                                // FAVORITE
      now,                                    // CREATED_DATE
      now,                                    // MODIFIED_DATE
      file.getOwner().getEmail(),             // OWNER
      file.getUrl(),                          // DRIVE_URL
      `https://drive.google.com/uc?export=download&id=${file.getId()}`, // DOWNLOAD_URL
      file.getUrl(),                          // PREVIEW_URL
      now,                                    // METADATA_DATE
      "PENDING",                              // METADATA_STATUS
      "PENDING",                              // PROCESSING_STATUS
      "",                                     // PROCESSING_DATE
      "",                                     // PROCESSING_TIME
      "",                                     // STEPPER_JOB_ID
      "",                                     // OUTPUT_URL
      "",                                     // ERROR_MESSAGE
      "Ditambahkan oleh sistem scan otomatis", // NOTES
      now,                                    // LAST_ACCESSED
      0,                                      // ACCESS_COUNT
      "Google Drive",                         // SOURCE
      "",                                     // LICENSE
      ""                                      // KEYWORDS
    ];
    
    // Tambahkan row ke database
    dbSheet.appendRow(newRow);
    
    // Log ke processing log
    logProcessing("ADD_FILE", "SUCCESS", {
      fileId: file.getId(),
      fileName: fileName,
      message: "File berhasil ditambahkan ke database"
    });
    
    return {
      success: true,
      fileId: file.getId(),
      fileName: fileName
    };
    
  } catch (error) {
    logError("SCAN.addFileToDatabase", error, { 
      fileId: file.getId(), 
      fileName: file.getName() 
    });
    
    return {
      success: false,
      error: error.message
    };
  }
}

// ==============================================
// 🧠 FUNGSI METADATA EXTRACTION
// ==============================================

function extractMetadataBatch() {
  const batchId = Utilities.getUuid();
  const startTime = Date.now();
  
  try {
    logSystem("METADATA.extractMetadataBatch", `🧠 Memulai ekstraksi metadata (Batch: ${batchId})`);
    
    // Buka database
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SHEETS.SPREADSHEET_ID);
    const dbSheet = spreadsheet.getSheetByName("📚 DATABASE UTAMA");
    const metaSheet = spreadsheet.getSheetByName("📊 METADATA ANALYSIS");
    
    // Cari file yang perlu diekstrak metadata
    const data = dbSheet.getDataRange().getValues();
    const headers = data[0];
    
    const statusIndex = headers.indexOf("METADATA_STATUS");
    const processingIndex = headers.indexOf("PROCESSING_STATUS");
    const driveIdIndex = headers.indexOf("DRIVE_ID");
    const fileNameIndex = headers.indexOf("FILE_NAME");
    
    // Filter file dengan status PENDING
    const pendingFiles = [];
    for (let i = 1; i < data.length; i++) {
      if (data[i][statusIndex] === "PENDING" && data[i][processingIndex] !== "PROCESSING") {
        pendingFiles.push({
          row: i + 1,
          driveId: data[i][driveIdIndex],
          fileName: data[i][fileNameIndex],
          data: data[i]
        });
      }
    }
    
    logSystem("METADATA.extractMetadataBatch", `📊 ${pendingFiles.length} file perlu ekstraksi metadata`);
    
    // Batasi batch size
    const filesToProcess = pendingFiles.slice(0, CONFIG.PROCESSING.BATCH_SIZE);
    let processed = 0;
    let success = 0;
    let errors = 0;
    
    // Process each file
    filesToProcess.forEach(file => {
      try {
        // Update status menjadi PROCESSING
        dbSheet.getRange(file.row, statusIndex + 1).setValue("PROCESSING");
        dbSheet.getRange(file.row, processingIndex + 1).setValue("PROCESSING");
        
        // Simulasi ekstraksi metadata
        const metadata = extractFileMetadata(file.driveId, file.fileName);
        
        // Update database dengan metadata
        updateMetadataInDatabase(dbSheet, metaSheet, file, metadata);
        
        // Update status menjadi COMPLETED
        dbSheet.getRange(file.row, statusIndex + 1).setValue("COMPLETED");
        dbSheet.getRange(file.row, processingIndex + 1).setValue("COMPLETED");
        
        success++;
        
        // Log progress
        logProcessing("EXTRACT_METADATA", "SUCCESS", {
          fileId: file.driveId,
          fileName: file.fileName,
          metadata: Object.keys(metadata).length
        });
        
      } catch (error) {
        errors++;
        
        // Update status menjadi ERROR
        dbSheet.getRange(file.row, statusIndex + 1).setValue("ERROR");
        dbSheet.getRange(file.row, processingIndex + 1).setValue("ERROR");
        
        // Log error
        logError("METADATA.extractMetadataBatch", error, {
          fileId: file.driveId,
          fileName: file.fileName
        });
      }
      
      processed++;
      
      // Update progress
      if (processed % 5 === 0) {
        logSystem("METADATA.extractMetadataBatch", `⏳ Progress: ${processed}/${filesToProcess.length} files`);
      }
      
      // Jeda untuk menghindari rate limit
      Utilities.sleep(200);
    });
    
    const duration = Date.now() - startTime;
    
    logSystem("METADATA.extractMetadataBatch", `✅ Ekstraksi selesai: ${success} sukses, ${errors} error (${duration}ms)`);
    
    // Update dashboard
    updateDashboard();
    
    return {
      success: true,
      batchId: batchId,
      processed: processed,
      success: success,
      errors: errors,
      duration: duration
    };
    
  } catch (error) {
    logError("METADATA.extractMetadataBatch", error, { batchId: batchId });
    return {
      success: false,
      error: error.message,
      batchId: batchId,
      duration: Date.now() - startTime
    };
  }
}

function extractFileMetadata(fileId, fileName) {
  // Ini adalah simulasi ekstraksi metadata
  // Di implementasi nyata, ini akan memanggil API atau library ekstraksi
  
  const now = new Date().toISOString();
  const fileExt = fileName.split('.').pop().toLowerCase();
  
  // Generate metadata dummy berdasarkan nama file
  const title = fileName.replace(/\.[^/.]+$/, "").replace(/_/g, " ");
  const words = title.split(' ');
  
  // Prediksi kategori berdasarkan kata kunci dalam nama file
  let category = "Unknown";
  let tags = [];
  
  const techKeywords = ["programming", "code", "software", "tech", "computer", "ai", "machine"];
  const businessKeywords = ["business", "management", "finance", "marketing", "entrepreneur"];
  const scienceKeywords = ["science", "physics", "chemistry", "biology", "research"];
  
  if (techKeywords.some(keyword => fileName.toLowerCase().includes(keyword))) {
    category = "Technology";
    tags = ["tech", "programming", "software"];
  } else if (businessKeywords.some(keyword => fileName.toLowerCase().includes(keyword))) {
    category = "Business";
    tags = ["business", "management", "finance"];
  } else if (scienceKeywords.some(keyword => fileName.toLowerCase().includes(keyword))) {
    category = "Science";
    tags = ["science", "research", "academic"];
  }
  
  // Simulasi confidence scores
  const titleConfidence = Math.random() * 30 + 70; // 70-100%
  const authorConfidence = Math.random() * 50 + 20; // 20-70%
  const yearConfidence = Math.random() * 40 + 30; // 30-70%
  
  return {
    // Basic metadata
    title: title,
    author: words.length > 1 ? words[0] : "Unknown",
    year: new Date().getFullYear() - Math.floor(Math.random() * 20),
    category: category,
    tags: tags.join(", "),
    
    // Analysis data
    analysis_date: now,
    title_confidence: Math.round(titleConfidence),
    author_confidence: Math.round(authorConfidence),
    year_confidence: Math.round(yearConfidence),
    isbn_confidence: Math.round(Math.random() * 100),
    language_detected: "English",
    page_count: Math.floor(Math.random() * 500) + 50,
    word_count: Math.floor(Math.random() * 100000) + 5000,
    file_format: fileExt.toUpperCase(),
    encryption_status: "None",
    metadata_quality_score: Math.round((titleConfidence + authorConfidence + yearConfidence) / 3),
    suggested_category: category,
    suggested_tags: tags.join(", "),
    ocr_required: fileExt === "pdf" ? "Maybe" : "No",
    ocr_status: "Not Attempted",
    cover_image_url: "",
    table_of_contents: "",
    key_topics: tags.join(", "),
    reading_level: "Intermediate",
    sentiment_score: Math.round((Math.random() * 40 + 30)), // 30-70
    complexity_score: Math.round((Math.random() * 50 + 30)), // 30-80
    recommended_actions: "Add more tags, verify author name"
  };
}

function updateMetadataInDatabase(dbSheet, metaSheet, file, metadata) {
  try {
    const headers = dbSheet.getRange(1, 1, 1, dbSheet.getLastColumn()).getValues()[0];
    
    // Update kolom utama di database
    const updateMap = {
      "TITLE": metadata.title,
      "AUTHOR": metadata.author,
      "YEAR": metadata.year,
      "CATEGORY": metadata.category,
      "TAGS": metadata.tags,
      "METADATA_DATE": new Date().toISOString()
    };
    
    Object.keys(updateMap).forEach(header => {
      const index = headers.indexOf(header);
      if (index !== -1) {
        dbSheet.getRange(file.row, index + 1).setValue(updateMap[header]);
      }
    });
    
    // Tambahkan ke metadata analysis sheet
    const metaRow = [
      file.driveId,                          // FILE_ID
      metadata.analysis_date,                // ANALYSIS_DATE
      metadata.title_confidence,             // TITLE_CONFIDENCE
      metadata.author_confidence,            // AUTHOR_CONFIDENCE
      metadata.year_confidence,              // YEAR_CONFIDENCE
      metadata.isbn_confidence,              // ISBN_CONFIDENCE
      metadata.language_detected,            // LANGUAGE_DETECTED
      metadata.page_count,                   // PAGE_COUNT
      metadata.word_count,                   // WORD_COUNT
      metadata.file_format,                  // FILE_FORMAT
      metadata.encryption_status,            // ENCRYPTION_STATUS
      metadata.metadata_quality_score,       // METADATA_QUALITY_SCORE
      metadata.suggested_category,           // SUGGESTED_CATEGORY
      metadata.suggested_tags,               // SUGGESTED_TAGS
      metadata.ocr_required,                 // OCR_REQUIRED
      metadata.ocr_status,                   // OCR_STATUS
      metadata.cover_image_url,              // COVER_IMAGE_URL
      metadata.table_of_contents,            // TABLE_OF_CONTENTS
      metadata.key_topics,                   // KEY_TOPICS
      metadata.reading_level,                // READING_LEVEL
      metadata.sentiment_score,              // SENTIMENT_SCORE
      metadata.complexity_score,             // COMPLEXITY_SCORE
      metadata.recommended_actions           // RECOMMENDED_ACTIONS
    ];
    
    metaSheet.appendRow(metaRow);
    
  } catch (error) {
    throw error;
  }
}

// ==============================================
// 📊 FUNGSI DASHBOARD & STATISTICS
// ==============================================

function updateDashboard() {
  try {
    logSystem("DASHBOARD.updateDashboard", "📊 Memperbarui dashboard...");
    
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SHEETS.SPREADSHEET_ID);
    const dashboardSheet = spreadsheet.getSheetByName("🎯 DASHBOARD");
    const dbSheet = spreadsheet.getSheetByName("📚 DATABASE UTAMA");
    const errorSheet = spreadsheet.getSheetByName("❌ ERROR LOG");
    
    // Hitung statistik
    const dbData = dbSheet.getDataRange().getValues();
    const errorData = errorSheet.getDataRange().getValues();
    
    const today = new Date().toISOString().split('T')[0];
    
    // Total books
    const totalBooks = dbData.length - 1; // Exclude header
    
    // Books processed today
    const processingDateIndex = dbSheet.getRange(1, 1, 1, dbSheet.getLastColumn())
      .getValues()[0].indexOf("PROCESSING_DATE");
    
    let processedToday = 0;
    if (processingDateIndex !== -1) {
      for (let i = 1; i < dbData.length; i++) {
        const date = dbData[i][processingDateIndex];
        if (date && date.toString().includes(today)) {
          processedToday++;
        }
      }
    }
    
    // Errors today
    let errorsToday = 0;
    if (errorData.length > 1) {
      const timestampIndex = 0; // First column is TIMESTAMP
      for (let i = 1; i < errorData.length; i++) {
        const date = errorData[i][timestampIndex];
        if (date && date.toString().includes(today)) {
          errorsToday++;
        }
      }
    }
    
    // Average processing time
    const processingTimeIndex = dbSheet.getRange(1, 1, 1, dbSheet.getLastColumn())
      .getValues()[0].indexOf("PROCESSING_TIME");
    
    let totalTime = 0;
    let countTime = 0;
    
    if (processingTimeIndex !== -1) {
      for (let i = 1; i < dbData.length; i++) {
        const time = dbData[i][processingTimeIndex];
        if (time && !isNaN(time)) {
          totalTime += parseInt(time);
          countTime++;
        }
      }
    }
    
    const avgProcessingTime = countTime > 0 ? Math.round(totalTime / countTime) : 0;
    
    // Storage used
    const sizeIndex = dbSheet.getRange(1, 1, 1, dbSheet.getLastColumn())
      .getValues()[0].indexOf("FILE_SIZE_KB");
    
    let totalSizeKB = 0;
    if (sizeIndex !== -1) {
      for (let i = 1; i < dbData.length; i++) {
        const size = dbData[i][sizeIndex];
        if (size && !isNaN(size)) {
          totalSizeKB += parseInt(size);
        }
      }
    }
    
    const storageUsedMB = Math.round(totalSizeKB / 1024);
    
    // Last scan (from processing log)
    const logSheet = spreadsheet.getSheetByName("📋 PROCESSING LOG");
    let lastScan = "Never";
    
    if (logSheet && logSheet.getLastRow() > 3) {
      const logData = logSheet.getRange(4, 4, logSheet.getLastRow() - 3, 1).getValues();
      const dates = logData.filter(row => row[0]).map(row => new Date(row[0]));
      if (dates.length > 0) {
        const latestDate = new Date(Math.max(...dates));
        lastScan = latestDate.toLocaleString();
      }
    }
    
    // Update dashboard values
    const dashboardData = [
      ["📊 Total Books", totalBooks, totalBooks > 0 ? "🟢" : "⚪", new Date().toISOString(), totalBooks > 0 ? "↑" : "→"],
      ["📈 Processed Today", processedToday, processedToday > 0 ? "🟢" : "⚪", new Date().toISOString(), "→"],
      ["⚠️ Errors Today", errorsToday, errorsToday > 0 ? "🟡" : "🟢", new Date().toISOString(), "→"],
      ["⏱️ Avg Processing Time", `${avgProcessingTime}ms`, avgProcessingTime < 5000 ? "🟢" : "🟡", new Date().toISOString(), "→"],
      ["💾 Storage Used", `${storageUsedMB} MB`, storageUsedMB < 1000 ? "🟢" : "🟡", new Date().toISOString(), "↑"],
      ["🎯 System Health", "95%", "🟢", new Date().toISOString(), "→"],
      ["⏰ Last Scan", lastScan, lastScan !== "Never" ? "🟢" : "⚪", new Date().toISOString(), "→"],
      ["👥 Active Users", "1", "🟢", new Date().toISOString(), "→"]
    ];
    
    dashboardSheet.getRange(3, 1, 8, 5).setValues(dashboardData);
    
    // Update statistics dashboard
    updateStatisticsDashboard();
    
    logSystem("DASHBOARD.updateDashboard", "✅ Dashboard berhasil diperbarui");
    
  } catch (error) {
    logError("DASHBOARD.updateDashboard", error);
  }
}

function updateStatisticsDashboard() {
  try {
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SHEETS.SPREADSHEET_ID);
    const statsSheet = spreadsheet.getSheetByName("📈 STATISTICS DASHBOARD");
    const dbSheet = spreadsheet.getSheetByName("📚 DATABASE UTAMA");
    
    const dbData = dbSheet.getDataRange().getValues();
    if (dbData.length < 2) return;
    
    const headers = dbData[0];
    
    // Get indices
    const categoryIndex = headers.indexOf("CATEGORY");
    const languageIndex = headers.indexOf("LANGUAGE");
    const yearIndex = headers.indexOf("YEAR");
    const sizeIndex = headers.indexOf("FILE_SIZE_KB");
    
    // Calculate statistics
    const categories = {};
    const languages = {};
    const years = {};
    let totalSizeKB = 0;
    
    for (let i = 1; i < dbData.length; i++) {
      const category = dbData[i][categoryIndex] || "Uncategorized";
      const language = dbData[i][languageIndex] || "Unknown";
      const year = dbData[i][yearIndex] || "Unknown";
      const size = dbData[i][sizeIndex] || 0;
      
      categories[category] = (categories[category] || 0) + 1;
      languages[language] = (languages[language] || 0) + 1;
      years[year] = (years[year] || 0) + 1;
      totalSizeKB += parseInt(size) || 0;
    }
    
    // Convert to strings for display
    const byCategory = Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([cat, count]) => `${cat}: ${count}`)
      .join(", ");
    
    const byLanguage = Object.entries(languages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([lang, count]) => `${lang}: ${count}`)
      .join(", ");
    
    const byYear = Object.entries(years)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([year, count]) => `${year}: ${count}`)
      .join(", ");
    
    // Add new statistics row
    const statsRow = [
      new Date().toISOString(),               // METRIC_DATE
      dbData.length - 1,                      // TOTAL_BOOKS
      Math.round(totalSizeKB / 1024),         // TOTAL_SIZE_MB
      byCategory,                             // BY_CATEGORY
      byLanguage,                             // BY_LANGUAGE
      byYear,                                 // BY_YEAR
      0,                                      // PROCESSED_TODAY (akan diupdate nanti)
      0,                                      // ERRORS_TODAY
      0,                                      // AVG_PROCESSING_TIME
      "",                                     // TOP_AUTHORS
      byCategory,                             // TOP_CATEGORIES
      "",                                     // MOST_ACCESSED
      "",                                     // RECENT_ADDITIONS
      "95%",                                  // SYSTEM_HEALTH
      `${Math.round(totalSizeKB / (1024 * 1024))} GB`, // STORAGE_USAGE
      0,                                      // API_CALLS
      "1 active"                              // USER_ACTIVITY
    ];
    
    // Add to statistics sheet
    const lastRow = statsSheet.getLastRow();
    statsSheet.getRange(lastRow + 1, 1, 1, statsRow.length).setValues([statsRow]);
    
  } catch (error) {
    logError("STATISTICS.updateStatisticsDashboard", error);
  }
}

// ==============================================
// 📧 FUNGSI NOTIFICATION & LOGGING
// ==============================================

function logSystem(module, message) {
  try {
    const timestamp = new Date().toISOString();
    const logId = Utilities.getUuid();
    
    SYSTEM_LOG.push({
      timestamp: timestamp,
      module: module,
      message: message,
      logId: logId
    });
    
    if (VERBOSE_LOGGING) {
      console.log(`[${timestamp}] ${module}: ${message}`);
    }
    
    // Tulis ke processing log sheet
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SHEETS.SPREADSHEET_ID);
    const logSheet = spreadsheet.getSheetByName("📋 PROCESSING LOG");
    
    if (logSheet) {
      const logRow = [
        timestamp,
        logId,
        module.split('.')[0],
        "LOG",
        "",
        "",
        "INFO",
        message,
        0,
        Session.getActiveUser().getEmail()
      ];
      
      logSheet.appendRow(logRow);
    }
    
  } catch (error) {
    console.error(`Error logging: ${error}`);
  }
}

function logError(module, error, context = {}) {
  try {
    const timestamp = new Date().toISOString();
    const errorId = Utilities.getUuid();
    
    console.error(`[${timestamp}] ERROR in ${module}:`, error);
    
    // Tulis ke error log sheet
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SHEETS.SPREADSHEET_ID);
    const errorSheet = spreadsheet.getSheetByName("❌ ERROR LOG");
    
    if (errorSheet) {
      const errorRow = [
        timestamp,
        errorId,
        "ERROR",
        module.split('.')[0],
        module.split('.')[1] || "",
        context.fileId || "",
        error.name || "UNKNOWN",
        error.message || "Unknown error",
        error.stack || "",
        "Check system configuration",
        false,
        "",
        ""
      ];
      
      errorSheet.appendRow(errorRow);
      
      // Highlight row based on severity
      const lastRow = errorSheet.getLastRow();
      const severity = context.severity || "ERROR";
      
      let color = "#FFEBEE"; // Light red for errors
      if (severity === "CRITICAL") color = "#FFCDD2";
      if (severity === "WARNING") color = "#FFF3E0";
      
      errorSheet.getRange(lastRow, 1, 1, 13).setBackground(color);
    }
    
    // Kirim email notifikasi jika error kritis
    if ((context.severity === "CRITICAL" || error.message.includes("permission")) && 
        CONFIG.NOTIFICATION.ENABLE_EMAIL_ALERTS) {
      sendNotification("❌ CRITICAL SYSTEM ERROR", 
        `Module: ${module}\nError: ${error.message}\nTime: ${timestamp}\n\nPlease check error logs immediately.`);
    }
    
  } catch (loggingError) {
    console.error("Failed to log error:", loggingError);
  }
}

function logProcessing(operation, status, details = {}) {
  try {
    const timestamp = new Date().toISOString();
    const logId = Utilities.getUuid();
    
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SHEETS.SPREADSHEET_ID);
    const trackerSheet = spreadsheet.getSheetByName("🔄 PROGRESS TRACKER");
    
    if (trackerSheet) {
      const logRow = [
        timestamp,
        logId,
        "PROCESSING",
        operation,
        details.fileId || "",
        details.fileName || "",
        status,
        details.message || `${operation} completed`,
        details.duration || 0,
        Session.getActiveUser().getEmail()
      ];
      
      trackerSheet.appendRow(logRow);
    }
    
  } catch (error) {
    console.error("Error logging processing:", error);
  }
}

function sendNotification(subject, body) {
  try {
    if (!CONFIG.NOTIFICATION.ENABLE_EMAIL_ALERTS) return;
    
    const userEmail = Session.getActiveUser().getEmail();
    const adminEmail = CONFIG.NOTIFICATION.ADMIN_EMAIL;
    
    // Kirim ke admin
    if (adminEmail && adminEmail !== userEmail) {
      MailApp.sendEmail({
        to: adminEmail,
        subject: `[${CONFIG.SYSTEM_NAME}] ${subject}`,
        body: body,
        name: "Ebook Management System"
      });
    }
    
    // Kirim ke user yang menjalankan
    MailApp.sendEmail({
      to: userEmail,
      subject: `[${CONFIG.SYSTEM_NAME}] ${subject}`,
      body: body,
      name: "Ebook Management System"
    });
    
    logSystem("NOTIFICATION.sendNotification", `Email terkirim: ${subject}`);
    
  } catch (error) {
    logError("NOTIFICATION.sendNotification", error);
  }
}

// ==============================================
// 🔧 FUNGSI MAINTENANCE & BACKUP
// ==============================================

function createInitialBackup() {
  try {
    logSystem("BACKUP.createInitialBackup", "💾 Membuat backup awal...");
    
    const sourceFolder = DriveApp.getFolderById(CONFIG.DRIVE.SOURCE_FOLDER_ID);
    const backupFolder = getOrCreateFolder(sourceFolder, CONFIG.DRIVE.BACKUP_FOLDER_NAME);
    
    const backupName = `SYSTEM_BACKUP_${new Date().toISOString().replace(/[:.]/g, '-')}`;
    const specificBackupFolder = backupFolder.createFolder(backupName);
    
    // Backup spreadsheet
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SHEETS.SPREADSHEET_ID);
    const spreadsheetBlob = getSpreadsheetAsBlob(spreadsheet);
    specificBackupFolder.createFile(spreadsheetBlob.setName(`backup_${spreadsheet.getName()}.xlsx`));
    
    // Backup script (kita sendiri)
    const scriptBlob = Utilities.newBlob(JSON.stringify({
      config: CONFIG,
      timestamp: new Date().toISOString(),
      version: CONFIG.VERSION
    })).setName("system_config_backup.json");
    
    specificBackupFolder.createFile(scriptBlob);
    
    // Log backup
    const backupLog = [
      Utilities.getUuid(),
      "INITIAL",
      new Date().toISOString(),
      new Date().toISOString(),
      Math.round(spreadsheetBlob.getBytes().length / (1024 * 1024)),
      1,
      specificBackupFolder.getUrl(),
      "COMPLETED",
      true,
      backupName
    ];
    
    const spreadsheet2 = SpreadsheetApp.openById(CONFIG.SHEETS.SPREADSHEET_ID);
    const backupSheet = spreadsheet2.getSheetByName("💾 BACKUP LOG");
    if (backupSheet) {
      backupSheet.appendRow(backupLog);
    }
    
    logSystem("BACKUP.createInitialBackup", "✅ Backup awal berhasil dibuat");
    
    return {
      success: true,
      backupId: backupName,
      location: specificBackupFolder.getUrl()
    };
    
  } catch (error) {
    logError("BACKUP.createInitialBackup", error);
    return {
      success: false,
      error: error.message
    };
  }
}

function getSpreadsheetAsBlob(spreadsheet) {
  const url = `https://docs.google.com/spreadsheets/d/${spreadsheet.getId()}/export?format=xlsx`;
  const params = {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${ScriptApp.getOAuthToken()}`
    },
    muteHttpExceptions: true
  };
  
  const response = UrlFetchApp.fetch(url, params);
  return response.getBlob();
}

function getOrCreateFolder(parentFolder, folderName) {
  const folders = parentFolder.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  } else {
    return parentFolder.createFolder(folderName);
  }
}

// ==============================================
// ⏰ FUNGSI TRIGGERS & SCHEDULING
// ==============================================

function setupSystemTriggers() {
  try {
    // Hapus semua trigger yang ada
    const allTriggers = ScriptApp.getProjectTriggers();
    allTriggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));
    
    // Buat trigger baru
    
    // 1. Daily maintenance (jam 2 pagi)
    ScriptApp.newTrigger('runDailyMaintenance')
      .timeBased()
      .atHour(2)
      .everyDays(1)
      .create();
    
    // 2. Hourly folder sync
    ScriptApp.newTrigger('syncDriveStructure')
      .timeBased()
      .everyHours(1)
      .create();
    
    // 3. Daily report (jam 9 pagi)
    ScriptApp.newTrigger('generateDailyReport')
      .timeBased()
      .atHour(9)
      .everyDays(1)
      .create();
    
    logSystem("TRIGGERS.setupSystemTriggers", "✅ System triggers berhasil disetup");
    
  } catch (error) {
    logError("TRIGGERS.setupSystemTriggers", error);
  }
}

function runDailyMaintenance() {
  try {
    logSystem("MAINTENANCE.runDailyMaintenance", "🧹 Menjalankan daily maintenance...");
    
    // 1. Cleanup temp files
    cleanupTempFiles();
    
    // 2. Rotate logs
    rotateLogs();
    
    // 3. Validate database
    validateDatabase();
    
    // 4. Create backup jika sudah lebih dari 7 hari
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SHEETS.SPREADSHEET_ID);
    const backupSheet = spreadsheet.getSheetByName("💾 BACKUP LOG");
    
    if (backupSheet && backupSheet.getLastRow() > 3) {
      const lastBackup = backupSheet.getRange(backupSheet.getLastRow(), 3).getValue();
      const daysSinceLastBackup = (new Date() - new Date(lastBackup)) / (1000 * 60 * 60 * 24);
      
      if (daysSinceLastBackup >= CONFIG.MAINTENANCE.AUTO_BACKUP_DAYS) {
        createBackupNow();
      }
    }
    
    logSystem("MAINTENANCE.runDailyMaintenance", "✅ Daily maintenance selesai");
    
  } catch (error) {
    logError("MAINTENANCE.runDailyMaintenance", error);
  }
}

function syncDriveStructure() {
  try {
    logSystem("SYNC.syncDriveStructure", "🔄 Menyinkronkan struktur folder...");
    const folders = setupDriveFolderStructure();
    updateFolderStructureSheet(folders);
    logSystem("SYNC.syncDriveStructure", "✅ Struktur folder tersinkron");
  } catch (error) {
    logError("SYNC.syncDriveStructure", error);
  }
}

function generateDailyReport() {
  try {
    logSystem("REPORT.generateDailyReport", "📊 Membuat daily report...");
    
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SHEETS.SPREADSHEET_ID);
    const summarySheet = spreadsheet.getSheetByName("📝 RINGKASAN");
    
    const reportId = Utilities.getUuid();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const reportData = [
      reportId,
      "DAILY",
      yesterday.toISOString().split('T')[0] + "T00:00:00.000Z",
      new Date().toISOString().split('T')[0] + "T00:00:00.000Z",
      "SYSTEM",
      0,  // TOTAL_BOOKS
      0,  // NEW_BOOKS
      0,  // PROCESSED_BOOKS
      0,  // ERRORS
      0,  // AVG_PROCESSING_TIME
      0,  // STORAGE_GROWTH_MB
      "", // TOP_CATEGORY
      Session.getActiveUser().getEmail(),
      "System running normally"
    ];
    
    if (summarySheet) {
      summarySheet.appendRow(reportData);
    }
    
    // Kirim email report
    if (CONFIG.NOTIFICATION.ENABLE_EMAIL_ALERTS) {
      sendNotification("📊 Daily System Report", 
        `Daily report untuk ${new Date().toLocaleDateString()} telah dibuat.\n\nSilakan cek sheet RINGKASAN untuk detail lengkap.`);
    }
    
    logSystem("REPORT.generateDailyReport", "✅ Daily report berhasil dibuat");
    
  } catch (error) {
    logError("REPORT.generateDailyReport", error);
  }
}

// ==============================================
// 🧹 FUNGSI CLEANUP & VALIDATION
// ==============================================

function cleanupTempFiles() {
  try {
    logSystem("CLEANUP.cleanupTempFiles", "🧹 Membersihkan file temporary...");
    
    const sourceFolder = DriveApp.getFolderById(CONFIG.DRIVE.SOURCE_FOLDER_ID);
    const tempFolder = getOrCreateFolder(sourceFolder, CONFIG.DRIVE.TEMP_FOLDER_NAME);
    
    const files = tempFolder.getFiles();
    let deletedCount = 0;
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - 24); // Hapus file > 24 jam
    
    while (files.hasNext()) {
      const file = files.next();
      if (file.getDateCreated() < cutoffTime) {
        file.setTrashed(true);
        deletedCount++;
      }
    }
    
    logSystem("CLEANUP.cleanupTempFiles", `✅ ${deletedCount} file temporary dihapus`);
    
  } catch (error) {
    logError("CLEANUP.cleanupTempFiles", error);
  }
}

function rotateLogs() {
  try {
    logSystem("MAINTENANCE.rotateLogs", "📋 Memutar logs...");
    
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SHEETS.SPREADSHEET_ID);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - CONFIG.MAINTENANCE.LOG_RETENTION_DAYS);
    
    // Rotate error logs
    const errorSheet = spreadsheet.getSheetByName("❌ ERROR LOG");
    if (errorSheet && errorSheet.getLastRow() > 1) {
      const data = errorSheet.getDataRange().getValues();
      const headers = data[0];
      const timestampIndex = 0;
      
      const newData = [headers];
      for (let i = 1; i < data.length; i++) {
        const rowDate = new Date(data[i][timestampIndex]);
        if (rowDate > cutoffDate) {
          newData.push(data[i]);
        }
      }
      
      errorSheet.clear();
      if (newData.length > 1) {
        errorSheet.getRange(1, 1, newData.length, newData[0].length).setValues(newData);
      }
    }
    
    logSystem("MAINTENANCE.rotateLogs", "✅ Logs berhasil diputar");
    
  } catch (error) {
    logError("MAINTENANCE.rotateLogs", error);
  }
}

function validateDatabase() {
  try {
    logSystem("VALIDATION.validateDatabase", "🔍 Memvalidasi database...");
    
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SHEETS.SPREADSHEET_ID);
    const dbSheet = spreadsheet.getSheetByName("📚 DATABASE UTAMA");
    
    if (!dbSheet || dbSheet.getLastRow() <= 1) return;
    
    const data = dbSheet.getDataRange().getValues();
    const headers = data[0];
    
    const driveIdIndex = headers.indexOf("DRIVE_ID");
    const statusIndex = headers.indexOf("PROCESSING_STATUS");
    
    let fixedCount = 0;
    
    for (let i = 1; i < data.length; i++) {
      const driveId = data[i][driveIdIndex];
      
      try {
        const file = DriveApp.getFileById(driveId);
        if (!file) {
          // File tidak ditemukan, update status
          dbSheet.getRange(i + 1, statusIndex + 1).setValue("ERROR");
          fixedCount++;
        }
      } catch (error) {
        // File tidak ada atau tidak dapat diakses
        dbSheet.getRange(i + 1, statusIndex + 1).setValue("ORPHANED");
        fixedCount++;
      }
    }
    
    logSystem("VALIDATION.validateDatabase", `✅ Database divalidasi, ${fixedCount} entri diperbaiki`);
    
  } catch (error) {
    logError("VALIDATION.validateDatabase", error);
  }
}

// ==============================================
// 🎯 FUNGSI UTILITAS & TOMBOL
// ==============================================

function testSystem() {
  try {
    logSystem("TEST.testSystem", "🧪 Menjalankan test sistem...");
    
    const tests = [];
    
    // Test 1: Akses spreadsheet
    try {
      const spreadsheet = SpreadsheetApp.openById(CONFIG.SHEETS.SPREADSHEET_ID);
      tests.push({ test: "Spreadsheet Access", status: "PASSED", message: "Spreadsheet dapat diakses" });
    } catch (error) {
      tests.push({ test: "Spreadsheet Access", status: "FAILED", message: error.message });
    }
    
    // Test 2: Akses folder
    try {
      const folder = DriveApp.getFolderById(CONFIG.DRIVE.SOURCE_FOLDER_ID);
      tests.push({ test: "Drive Folder Access", status: "PASSED", message: "Folder dapat diakses" });
    } catch (error) {
      tests.push({ test: "Drive Folder Access", status: "FAILED", message: error.message });
    }
    
    // Test 3: Email permission
    try {
      MailApp.sendEmail({
        to: Session.getActiveUser().getEmail(),
        subject: "Test Email dari BUKA BUKU",
        body: "Ini adalah email test dari sistem BUKA BUKU.",
        name: "BUKA BUKU System"
      });
      tests.push({ test: "Email Permission", status: "PASSED", message: "Email dapat dikirim" });
    } catch (error) {
      tests.push({ test: "Email Permission", status: "FAILED", message: error.message });
    }
    
    // Test 4: API Endpoint (optional)
    try {
      const response = UrlFetchApp.fetch(API_ENDPOINT, { method: 'GET', muteHttpExceptions: true });
      if (response.getResponseCode() === 200) {
        tests.push({ test: "API Endpoint", status: "PASSED", message: "API dapat diakses" });
      } else {
        tests.push({ test: "API Endpoint", status: "WARNING", message: `API returned ${response.getResponseCode()}` });
      }
    } catch (error) {
      tests.push({ test: "API Endpoint", status: "FAILED", message: error.message });
    }
    
    // Tampilkan hasil test
    const passed = tests.filter(t => t.status === "PASSED").length;
    const total = tests.length;
    
    const testMessage = `🧪 System Test Results:\n\n` +
      tests.map(t => `${t.status === "PASSED" ? "✅" : t.status === "WARNING" ? "⚠️" : "❌"} ${t.test}: ${t.message}`).join("\n") +
      `\n\n${passed}/${total} tests passed`;
    
    logSystem("TEST.testSystem", testMessage);
    
    return {
      success: passed === total,
      tests: tests,
      summary: `${passed}/${total} tests passed`
    };
    
  } catch (error) {
    logError("TEST.testSystem", error);
    return {
      success: false,
      error: error.message
    };
  }
}

function createBackupNow() {
  try {
    logSystem("BACKUP.createBackupNow", "💾 Membuat backup manual...");
    
    const result = createInitialBackup();
    
    if (result.success) {
      sendNotification("💾 Backup Manual Created", 
        `Backup manual berhasil dibuat.\n\nBackup ID: ${result.backupId}\nLocation: ${result.location}`);
    }
    
    return result;
    
  } catch (error) {
    logError("BACKUP.createBackupNow", error);
    return {
      success: false,
      error: error.message
    };
  }
}

function exportAllData() {
  try {
    logSystem("EXPORT.exportAllData", "📤 Mengekspor semua data...");
    
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SHEETS.SPREADSHEET_ID);
    const sourceFolder = DriveApp.getFolderById(CONFIG.DRIVE.SOURCE_FOLDER_ID);
    const exportFolder = getOrCreateFolder(sourceFolder, CONFIG.DRIVE.EXPORT_FOLDER_NAME);
    
    const exportDate = new Date().toISOString().replace(/[:.]/g, '-');
    const exportFolderName = `EXPORT_${exportDate}`;
    const specificExportFolder = exportFolder.createFolder(exportFolderName);
    
    // Export setiap sheet sebagai CSV
    const sheets = ["📚 DATABASE UTAMA", "📊 METADATA ANALYSIS", "🗂️ KATEGORI & TAG", "❌ ERROR LOG"];
    
    sheets.forEach(sheetName => {
      const sheet = spreadsheet.getSheetByName(sheetName);
      if (sheet && sheet.getLastRow() > 1) {
        const data = sheet.getDataRange().getValues();
        const csvContent = convertToCsv(data);
        const blob = Utilities.newBlob(csvContent, 'text/csv', `${sheetName}_${exportDate}.csv`);
        specificExportFolder.createFile(blob);
      }
    });
    
    logSystem("EXPORT.exportAllData", "✅ Semua data berhasil diekspor");
    
    sendNotification("📤 Data Export Complete", 
      `Semua data berhasil diekspor ke Google Drive.\n\nLocation: ${specificExportFolder.getUrl()}`);
    
    return {
      success: true,
      location: specificExportFolder.getUrl(),
      files: sheets.length
    };
    
  } catch (error) {
    logError("EXPORT.exportAllData", error);
    return {
      success: false,
      error: error.message
    };
  }
}

function convertToCsv(data) {
  return data.map(row => 
    row.map(cell => {
      if (typeof cell === 'string') {
        return `"${cell.replace(/"/g, '""')}"`;
      }
      return cell;
    }).join(',')
  ).join('\n');
}

function reprocessFailedFiles() {
  try {
    logSystem("REPROCESS.reprocessFailedFiles", "🔄 Memproses ulang file yang gagal...");
    
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SHEETS.SPREADSHEET_ID);
    const dbSheet = spreadsheet.getSheetByName("📚 DATABASE UTAMA");
    
    const data = dbSheet.getDataRange().getValues();
    const headers = data[0];
    
    const statusIndex = headers.indexOf("PROCESSING_STATUS");
    const metadataStatusIndex = headers.indexOf("METADATA_STATUS");
    
    let resetCount = 0;
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][statusIndex] === "ERROR") {
        dbSheet.getRange(i + 1, statusIndex + 1).setValue("PENDING");
        dbSheet.getRange(i + 1, metadataStatusIndex + 1).setValue("PENDING");
        resetCount++;
      }
    }
    
    logSystem("REPROCESS.reprocessFailedFiles", `✅ ${resetCount} file direset ke status PENDING`);
    
    if (resetCount > 0) {
      sendNotification("🔄 Failed Files Reset", 
        `${resetCount} file dengan status ERROR telah direset ke PENDING.\n\nSekarang Anda dapat menjalankan ekstraksi metadata lagi.`);
    }
    
    return {
      success: true,
      resetCount: resetCount
    };
    
  } catch (error) {
    logError("REPROCESS.reprocessFailedFiles", error);
    return {
      success: false,
      error: error.message
    };
  }
}

function quickInitialize() {
  try {
    logSystem("SYSTEM.quickInitialize", "⚡ Inisialisasi cepat...");
    
    // Cukup buat sheet utama saja
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SHEETS.SPREADSHEET_ID);
    
    const essentialSheets = ["🎯 DASHBOARD", "📚 DATABASE UTAMA", "❌ ERROR LOG", "📋 PROCESSING LOG"];
    
    essentialSheets.forEach(sheetName => {
      let sheet = spreadsheet.getSheetByName(sheetName);
      if (!sheet) {
        sheet = spreadsheet.insertSheet(sheetName);
        setupSheetContent(sheet, sheetName);
        logSystem("SYSTEM.quickInitialize", `📄 Sheet "${sheetName}" dibuat`);
      }
    });
    
    // Setup folder minimal
    try {
      const sourceFolder = DriveApp.getFolderById(CONFIG.DRIVE.SOURCE_FOLDER_ID);
      const processedFolder = getOrCreateFolder(sourceFolder, CONFIG.DRIVE.PROCESSED_FOLDER_NAME);
      logSystem("SYSTEM.quickInitialize", "📁 Folder dasar disiapkan");
    } catch (folderError) {
      logSystem("SYSTEM.quickInitialize", "⚠️ Tidak bisa membuat folder, mungkin permission issue");
    }
    
    updateDashboard();
    
    logSystem("SYSTEM.quickInitialize", "✅ Inisialisasi cepat selesai");
    
    sendNotification("⚡ Quick Initialization Complete", 
      "Sistem telah diinisialisasi dengan konfigurasi minimal.\n\nAnda sekarang dapat mulai menggunakan sistem.");
    
    return {
      success: true,
      message: "Quick initialization completed"
    };
    
  } catch (error) {
    logError("SYSTEM.quickInitialize", error);
    return {
      success: false,
      error: error.message
    };
  }
}

// ==============================================
// 🎯 MENU CUSTOM & TOMBOL
// ==============================================

function onOpen() {
  try {
    const ui = SpreadsheetApp.getUi();
    
    // Buat menu utama
    const mainMenu = ui.createMenu('📚 BUKA BUKU V3')
      .addItem('🚀 Initialize System', 'initializeBukaBukuSystem')
      .addSeparator()
      .addSubMenu(ui.createMenu('🔍 Scanning')
        .addItem('Scan New Books', 'scanNewBooks')
        .addItem('Sync Folder Structure', 'syncDriveStructure')
      )
      .addSubMenu(ui.createMenu('🧠 Processing')
        .addItem('Extract Metadata', 'extractMetadataBatch')
        .addItem('Reprocess Failed', 'reprocessFailedFiles')
        .addSeparator()
        .addItem('Validate Database', 'validateDatabase')
      )
      .addSubMenu(ui.createMenu('📊 Dashboard')
        .addItem('Update Dashboard', 'updateDashboard')
        .addItem('Update Statistics', 'updateStatisticsDashboard')
        .addSeparator()
        .addItem('Generate Daily Report', 'generateDailyReport')
      )
      .addSubMenu(ui.createMenu('🔧 Maintenance')
        .addItem('Cleanup Temp Files', 'cleanupTempFiles')
        .addItem('Rotate Logs', 'rotateLogs')
        .addSeparator()
        .addItem('Create Backup', 'createBackupNow')
        .addItem('Export All Data', 'exportAllData')
      )
      .addSeparator()
      .addItem('🧪 Test System', 'testSystem')
      .addItem('⚡ Quick Initialize', 'quickInitialize')
      .addItem('📖 Help & About', 'showHelp')
      .addToUi();
    
    logSystem("SYSTEM.onOpen", "✅ Menu sistem berhasil dibuat");
    
  } catch (error) {
    console.error("Error creating menu:", error);
  }
}

function showHelp() {
  const ui = SpreadsheetApp.getUi();
  
  const helpText = `📚 BUKA BUKU EBOOK MANAGEMENT SYSTEM v${CONFIG.VERSION}

🚀 INITIALIZATION:
1. Klik "🚀 Initialize System" untuk setup lengkap
2. Atau gunakan "⚡ Quick Initialize" untuk setup minimal

🔍 GETTING STARTED:
1. Tambahkan ebook ke folder Google Drive: ${CONFIG.DRIVE.SOURCE_FOLDER_ID}
2. Klik "Scan New Books" untuk menambahkan ke database
3. Klik "Extract Metadata" untuk mengambil informasi buku

📊 MONITORING:
1. Dashboard otomatis terupdate setiap scan
2. Cek "❌ ERROR LOG" untuk masalah sistem
3. Gunakan "📋 PROCESSING LOG" untuk tracking

🔧 MAINTENANCE:
- Sistem backup otomatis setiap 7 hari
- Logs dirotate setiap 30 hari
- Temp files dibersihkan setiap 24 jam

📧 SUPPORT:
- Admin: ${CONFIG.NOTIFICATION.ADMIN_EMAIL}
- System: ${CONFIG.SYSTEM_NAME} v${CONFIG.VERSION}
- Build Date: ${CONFIG.BUILD_DATE}

⚠️ TROUBLESHOOTING:
1. Jika ada error permission, berikan semua izin yang diminta
2. Jika spreadsheet tidak ditemukan, periksa ID di CONFIG
3. Jika folder tidak bisa diakses, pastikan Anda memiliki akses
`;
  
  ui.alert('📖 BUKA BUKU System Help', helpText, ui.ButtonSet.OK);
}

// ==============================================
// 🎉 FUNGSI TAMBAHAN UNTUK INTEGRASI
// ==============================================

function processFileWithAI(fileId, fileName, fileUrl) {
  try {
    logSystem("AI.processFileWithAI", `🤖 Mengirim file ke AI: ${fileName}`);
    
    const payload = {
      fileId: fileId,
      fileName: fileName,
      fileUrl: fileUrl,
      spreadsheetId: CONFIG.SHEETS.SPREADSHEET_ID,
      timestamp: new Date().toISOString()
    };
    
    const options = {
      'method': 'POST',
      'contentType': 'application/json',
      'payload': JSON.stringify(payload),
      'muteHttpExceptions': true,
      'headers': {
        'Authorization': `Bearer jqkF40upjkVX1UOHJWrFfQuF`
      }
    };
    
    const response = UrlFetchApp.fetch(API_ENDPOINT, options);
    const responseText = response.getContentText();
    
    logSystem("AI.processFileWithAI", `✅ Response dari AI: ${responseText.substring(0, 100)}...`);
    
    return JSON.parse(responseText);
    
  } catch (error) {
    logError("AI.processFileWithAI", error, { fileId: fileId, fileName: fileName });
    return {
      success: false,
      error: error.message
    };
  }
}

function triggerPipeline(fileId, fileName, fileUrl) {
  try {
    logSystem("PIPELINE.triggerPipeline", `🚀 Trigger pipeline untuk: ${fileName}`);
    
    const result = processFileWithAI(fileId, fileName, fileUrl);
    
    if (result.success) {
      // Update database dengan hasil AI
      updateDatabaseWithAIResults(fileId, result);
    }
    
    return result;
    
  } catch (error) {
    logError("PIPELINE.triggerPipeline", error, { fileId: fileId, fileName: fileName });
    return {
      success: false,
      error: error.message
    };
  }
}

function updateDatabaseWithAIResults(fileId, aiResult) {
  try {
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SHEETS.SPREADSHEET_ID);
    const dbSheet = spreadsheet.getSheetByName("📚 DATABASE UTAMA");
    
    const data = dbSheet.getDataRange().getValues();
    const headers = data[0];
    
    const driveIdIndex = headers.indexOf("DRIVE_ID");
    const processingStatusIndex = headers.indexOf("PROCESSING_STATUS");
    const outputUrlIndex = headers.indexOf("OUTPUT_URL");
    const processingDateIndex = headers.indexOf("PROCESSING_DATE");
    const processingTimeIndex = headers.indexOf("PROCESSING_TIME");
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][driveIdIndex] === fileId) {
        const now = new Date().toISOString();
        
        dbSheet.getRange(i + 1, processingStatusIndex + 1).setValue("COMPLETED");
        dbSheet.getRange(i + 1, outputUrlIndex + 1).setValue(aiResult.data?.url || "");
        dbSheet.getRange(i + 1, processingDateIndex + 1).setValue(now);
        dbSheet.getRange(i + 1, processingTimeIndex + 1).setValue(aiResult.processingTime || 0);
        
        logSystem("AI.updateDatabaseWithAIResults", `✅ Database updated for: ${fileId}`);
        break;
      }
    }
    
  } catch (error) {
    logError("AI.updateDatabaseWithAIResults", error, { fileId: fileId });
  }
}

// ==============================================
// 🎉 INISIALISASI AWAL
// ==============================================

// Jalankan test saat pertama kali
function firstTimeSetup() {
  console.log("🔧 Running first time setup...");
  
  // Test sistem dulu
  const testResult = testSystem();
  
  if (!testResult.success) {
    console.error("❌ System test failed. Please fix errors before continuing.");
    return;
  }
  
  // Quick initialize
  const initResult = quickInitialize();
  
  if (initResult.success) {
    console.log("✅ First time setup completed successfully!");
    
    // Kirim email konfirmasi
    sendNotification("🎉 BUKA BUKU System Ready", 
      `Sistem BUKA BUKU v${CONFIG.VERSION} berhasil diinisialisasi.\n\n` +
      `Test Results: ${testResult.summary}\n` +
      `Spreadsheet: https://docs.google.com/spreadsheets/d/${CONFIG.SHEETS.SPREADSHEET_ID}\n` +
      `Source Folder: https://drive.google.com/drive/folders/${CONFIG.DRIVE.SOURCE_FOLDER_ID}\n\n` +
      `Anda sekarang dapat mulai menggunakan sistem.`);
  } else {
    console.error("❌ First time setup failed:", initResult.error);
  }
}

// Fungsi ini bisa dipanggil manual untuk setup pertama
function manualFirstTimeSetup() {
  firstTimeSetup();
}
