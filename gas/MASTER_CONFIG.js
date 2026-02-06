/**
 * 🏗️ LAYER 1: FOUNDATION - MASTER CONFIGURATION
 * SISTEM: PPSDM_LMS_ENTERPRISE_V4
 * VERSION: 4.2.0
 * AUTHOR: Fauzan
 * COPYRIGHT: 2024 PPSDM Kementerian Kesehatan
 */

// ============================================================================
// 🎯 MASTER CONFIGURATION - HARUS DICOCOKKAN PERSIS
// ============================================================================
const MASTER_CONFIG = {
    // IDENTITAS SISTEM
    SYSTEM: {
        NAME: "PPSDM_LMS_ENTERPRISE_V4",
        VERSION: "4.2.0",
        BUILD_DATE: "2024-01-24",
        SUPPORT_EMAIL: "punyofauzan3@gmail.com",
        API_KEY: "AIzaSyDIDGbcVeFMdgV2uOpYngDX73tcygoTNrk",
        MAX_RUNTIME_MS: 330000, // 5.5 menit
        MAX_MEMORY_BYTES: 104857600 // 100MB
    },

    // GOOGLE DRIVE - PAKAI INI
    DRIVE: {
        SOURCE_FOLDER_ID: "1B1g7rSHGQtO1VXEWxSS8Ncbg0R3nxmFf",
        PROCESSED_FOLDER: "📚 PROCESSED_BOOKS",
        ARCHIVE_FOLDER: "📦 ARCHIVE",
        BACKUP_FOLDER: "💾 SYSTEM_BACKUPS",
        ERROR_FOLDER: "❌ ERROR_FILES",
        LOGS_FOLDER: "📝 SYSTEM_LOGS",
        EXPORT_FOLDER: "📤 DATA_EXPORTS",

        // PERMISSION SETTINGS
        PERMISSIONS: {
            VIEWERS: ["punyofauzan3@gmail.com"],
            EDITORS: ["punyofauzan3@gmail.com"],
            DOMAIN: "kemkes.go.id"
        }
    },

    // GOOGLE SHEETS - PAKAI INI  
    SHEETS: {
        SPREADSHEET_ID: "1QEj9aoXDrAu6PKdFX-FNQt5pWlf7VsWMGeeU-PF9tQM",

        // 17 SHEETS WAJIB - NAMA HARUS SAMA
        TABLES: {
            DASHBOARD: "🎯 DASHBOARD",
            MAIN_DB: "📚 DATABASE UTAMA",
            ANALYSIS: "📊 METADATA ANALYSIS",
            CATEGORIES: "🗂️ KATEGORI & TAG",
            STATS: "📈 STATISTICS DASHBOARD",
            FOLDERS: "📁 STRUKTUR FOLDER",
            SEARCH: "🔍 SEARCH INDEX",
            ERROR_LOG: "❌ ERROR LOG",
            SUMMARY: "📝 RINGKASAN",
            PROGRESS: "🔄 PROGRESS TRACKER",
            MILESTONES: "🏆 MILESTONES",
            PROCESS_LOG: "📋 PROCESSING LOG",
            CONFIG: "⚙️ SYSTEM CONFIG",
            CACHE: "🧹 CACHE STATUS",
            BACKUP_LOG: "💾 BACKUP LOG",
            JOB_QUEUE: "🔄 JOB QUEUE",
            COMMAND_LOG: "🎮 COMMAND LOG"
        },

        // COLUMN STRUCTURE - FIXED
        COLUMNS: {
            MAIN_DB: [
                'ID', 'DRIVE_ID', 'FILE_NAME', 'FILE_PATH', 'FILE_SIZE_KB',
                'EXTENSION', 'MIME_TYPE', 'TITLE', 'AUTHOR', 'YEAR', 'ISBN',
                'PUBLISHER', 'CATEGORY', 'SUBCATEGORY', 'TAGS', 'LANGUAGE',
                'PAGES', 'EDITION', 'READ_STATUS', 'RATING', 'FAVORITE',
                'CREATED_DATE', 'MODIFIED_DATE', 'OWNER', 'DRIVE_URL',
                'DOWNLOAD_URL', 'PREVIEW_URL', 'METADATA_DATE', 'METADATA_STATUS',
                'PROCESSING_STATUS', 'PROCESSING_DATE', 'PROCESSING_TIME',
                'WEBHOOK_JOB_ID', 'WEBHOOK_STATUS', 'WEBHOOK_RESPONSE',
                'ERROR_MESSAGE', 'NOTES', 'LAST_ACCESSED', 'ACCESS_COUNT',
                'SOURCE', 'LICENSE', 'KEYWORDS', 'CHECKSUM', 'VERSION'
            ],

            PROCESS_LOG: [
                'TIMESTAMP', 'LOG_ID', 'MODULE', 'OPERATION', 'FILE_ID',
                'FILE_NAME', 'STATUS', 'MESSAGE', 'DURATION_MS', 'USER'
            ],

            ERROR_LOG: [
                'TIMESTAMP', 'ERROR_ID', 'SEVERITY', 'MODULE', 'FUNCTION',
                'FILE_ID', 'ERROR_CODE', 'ERROR_MESSAGE', 'STACK_TRACE',
                'RESOLUTION', 'RESOLVED', 'RESOLVED_BY', 'RESOLVED_DATE'
            ],

            JOB_QUEUE: [
                'JOB_ID', 'STATUS', 'PRIORITY', 'FILE_ID', 'FILE_NAME',
                'OPERATION', 'CREATED_AT', 'STARTED_AT', 'COMPLETED_AT',
                'RETRY_COUNT', 'ERROR_MESSAGE', 'NEXT_RETRY'
            ]
        },

        // STYLING & FORMATTING
        STYLES: {
            HEADER_BACKGROUND: "#2c3e50",
            HEADER_TEXT_COLOR: "#ffffff",
            SUCCESS_COLOR: "#27ae60",
            ERROR_COLOR: "#e74c3c",
            WARNING_COLOR: "#f39c12",
            INFO_COLOR: "#3498db"
        }
    },

    // INTEGRASI NEXT.JS API - WAJIB
    WEBHOOK: {
        URL: "https://ppsdm-kmm.vercel.app/api/webhooks/process-book",
        HEADERS: {
            "Content-Type": "application/json",
            "X-API-Source": "PPSDM-LMS-Orchestrator",
            "Authorization": "Bearer internal-system",
            "X-Request-ID": "",
            "X-Timestamp": ""
        },
        RETRY_COUNT: 3,
        RETRY_DELAY: 2000,
        TIMEOUT_MS: 30000,
        BATCH_SIZE: 5,

        // PAYLOAD STRUCTURE - HARUS PERSIS INI
        PAYLOAD_TEMPLATE: {
            "event": "ebook_processing_request",
            "workflow_id": "2185",
            "timestamp": "{TIMESTAMP}",
            "job_id": "{JOB_ID}",

            "file": {
                "id": "{DRIVE_ID}",
                "name": "{FILE_NAME}",
                "download_url": "{DOWNLOAD_URL}",
                "preview_url": "{PREVIEW_URL}",
                "size_kb": "{SIZE_KB}",
                "extension": "{EXTENSION}",
                "mime_type": "{MIME_TYPE}"
            },

            "metadata": {
                "title": "{TITLE}",
                "author": "{AUTHOR}",
                "year": "{YEAR}",
                "category": "{CATEGORY}",
                "language": "{LANGUAGE}",
                "tags": "{TAGS_ARRAY}",
                "extracted_confidence": "{CONFIDENCE}"
            },

            "processing_config": {
                "pipeline": "ebook_ai_processor",
                "quality": "high",
                "output_formats": ["json", "markdown", "csv", "html"],
                "features": ["ocr", "summary", "module_generation", "assessment"],
                "language": "id"
            },

            "notification": {
                "email": "punyofauzan3@gmail.com",
                "webhook_url": "https://hooks.stepper.io/workflow/2185"
            },

            "system_info": {
                "system_id": "{SYSTEM_ID}",
                "version": "4.2.0",
                "spreadsheet_url": "{SPREADSHEET_URL}",
                "trigger_type": "{TRIGGER_TYPE}"
            }
        },

        // STATUS CODES
        STATUS: {
            PENDING: "pending",
            PROCESSING: "processing",
            SUCCESS: "success",
            FAILED: "failed",
            RETRY: "retry"
        }
    },

    // PROCESSING CONFIG - OPTIMAL
    PROCESSING: {
        BATCH_SIZE: 15,
        MAX_EXECUTION_MINUTES: 5.5,
        CHECKPOINT_INTERVAL: 10,
        TRIGGER_INTERVAL_MINUTES: 5,
        MAX_FILE_SIZE_MB: 100,

        SUPPORTED_FORMATS: {
            PDF: ["pdf"],
            DOCUMENT: ["doc", "docx", "rtf", "odt"],
            EBOOK: ["epub", "mobi", "azw", "azw3"],
            TEXT: ["txt", "md", "html", "htm"],
            PRESENTATION: ["ppt", "pptx"],
            SPREADSHEET: ["xls", "xlsx", "csv"]
        },

        VALID_MIME_TYPES: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
            'application/epub+zip',
            'application/vnd.amazon.ebook',
            'application/rtf',
            'text/html'
        ],

        FLAGS: {
            ENABLE_RECURSIVE: true,
            ENABLE_AUTO_RENAME: true,
            ENABLE_METADATA_EXTRACTION: true,
            ENABLE_CATEGORY_PREDICTION: true,
            ENABLE_WEBHOOK: true,
            ENABLE_BACKUP: true,
            ENABLE_LOGGING: true,
            ENABLE_CACHE: true
        }
    },

    // METADATA EXTRACTION PATTERNS
    METADATA: {
        PATTERNS: [
            // Pattern 1: Author - Title (Year) - Publisher
            {
                regex: /^([^\-]+?)\s*[-\u2013\u2014]\s*(.+?)\s*\(\s*(\d{4})\s*\)(?:\s*[-\u2013\u2014]\s*(.+))?$/i,
                groups: ["author", "title", "year", "publisher"],
                confidence: 0.9
            },

            // Pattern 2: Title - Author (Year)
            {
                regex: /^(.+?)\s*[-\u2013\u2014]\s*(.+?)\s*\(\s*(\d{4})\s*\)$/i,
                groups: ["title", "author", "year"],
                confidence: 0.85
            },

            // Pattern 3: Author - Title
            {
                regex: /^([^\-]+?)\s*[-\u2013\u2014]\s*(.+)$/i,
                groups: ["author", "title"],
                confidence: 0.7
            },

            // Pattern 4: Title (Year) - Author
            {
                regex: /^(.+?)\s*\(\s*(\d{4})\s*\)\s*[-\u2013\u2014]\s*(.+)$/i,
                groups: ["title", "year", "author"],
                confidence: 0.8
            },

            // Pattern 5: ISBN based
            {
                regex: /ISBN[\s\-:]*([\d\-Xx]+).*?(.+?)[-\u2013\u2014](.+)/i,
                groups: ["isbn", "title", "author"],
                confidence: 0.95
            },

            // Pattern 6: Simple title with year
            {
                regex: /^(.+?)\s*\(\s*(\d{4})\s*\)$/i,
                groups: ["title", "year"],
                confidence: 0.6
            }
        ],

        CATEGORIES: {
            KESEHATAN: ["kesehatan", "medicine", "medis", "kesehatan masyarakat", "public health"],
            MANAJEMEN: ["manajemen", "management", "administrasi", "leadership"],
            TEKNOLOGI: ["teknologi", "technology", "informatika", "komputer", "software"],
            PENDIDIKAN: ["pendidikan", "education", "pembelajaran", "kurikulum"],
            HUKUM: ["hukum", "law", "legal", "peraturan"],
            EKONOMI: ["ekonomi", "finance", "keuangan", "akuntansi"]
        },

        LANGUAGES: {
            ID: ["indonesia", "indonesian", "bahasa indonesia", "ind"],
            EN: ["english", "inggris", "eng", "en-us", "en-gb"],
            AR: ["arab", "arabic", "bahasa arab"],
            OTHER: ["other", "lainnya"]
        }
    },

    // CHECKPOINT SYSTEM KEYS
    CHECKPOINT: {
        LAST_PROCESSED_INDEX: "last_processed_index",
        CURRENT_BATCH: "current_batch",
        TOTAL_FILES: "total_files_discovered",
        PROCESSING_STATUS: "system_processing_status",
        JOB_ID: "current_job_id",
        ERROR_COUNT: "error_count_this_session",
        START_TIME: "session_start_time",
        LAST_CHECKPOINT: "last_checkpoint_timestamp",
        RESUMABLE_DATA: "resumable_data_json",
        CURRENT_FOLDER_ID: "current_folder_id",
        SCAN_DEPTH: "current_scan_depth"
    },

    // SUPABASE INTEGRATION
    SUPABASE: {
        URL: "https://hyszrracdysqgyfpwflu.supabase.co",
        ANON_KEY: "sb_publishable_jdFxbjWbuitaWjblDEnKbA_04MrSCjr",
        TABLES: {
            BOOKS: "books",
            MODULES: "learning_modules",
            USERS: "users",
            PROCESSING_QUEUE: "processing_queue"
        }
    },

    // STEPPER WORKFLOW
    STEPPER: {
        WORKFLOW_ID: "2185",
        WEBHOOK_URL: "https://hooks.stepper.io/workflow/2185",
        ENABLED: true
    },

    // SYSTEM CONSTANTS
    CONSTANTS: {
        MILLIS_PER_MINUTE: 60000,
        MILLIS_PER_HOUR: 3600000,
        MILLIS_PER_DAY: 86400000,
        BYTES_PER_MB: 1048576,
        MAX_ROWS_PER_SHEET: 50000
    }
};

// ============================================================================
// 🎛️ 12 TOMBOL UTAMA MENU
// ============================================================================
const MAIN_MENU = {
    name: "🚀 EBOOK ENTERPRISE",
    items: [
        {
            name: "🚀 LAUNCH FULL SCAN",
            function: "launchFullScan",
            description: "Scan lengkap semua file + metadata + webhook",
            icon: "🚀",
            color: "#27ae60"
        },
        {
            name: "↩️ RESUME PROCESS",
            function: "resumeProcess",
            description: "Lanjutkan dari checkpoint terakhir",
            icon: "↩️",
            color: "#3498db"
        },
        {
            name: "⏹️ STOP PROCESS",
            function: "stopProcess",
            description: "Stop dengan save checkpoint",
            icon: "⏹️",
            color: "#e74c3c"
        },
        {
            name: "🎮 OPEN COMMAND CENTER",
            function: "openCommandCenter",
            description: "Dashboard kontrol real-time",
            icon: "🎮",
            color: "#9b59b6"
        },
        {
            name: "⚙️ INITIALIZE SYSTEM",
            function: "initializeSystem",
            description: "Setup pertama kali",
            icon: "⚙️",
            color: "#2c3e50"
        },
        {
            name: "🔁 REINITIALIZE SYSTEM",
            function: "reinitializeSystem",
            description: "Reset total + backup",
            icon: "🔁",
            color: "#f39c12"
        },
        {
            name: "📈 UPDATE STATISTICS",
            function: "updateStatistics",
            description: "Refresh semua metrics",
            icon: "📈",
            color: "#1abc9c"
        },
        {
            name: "📤 EXPORT DATA",
            function: "exportData",
            description: "Export ke CSV/JSON",
            icon: "📤",
            color: "#e67e22"
        },
        {
            name: "💾 BACKUP SYSTEM",
            function: "backupSystem",
            description: "Full system backup",
            icon: "💾",
            color: "#34495e"
        },
        {
            name: "🧹 CLEAR CACHE",
            function: "clearCache",
            description: "Bersihkan semua cache",
            icon: "🧹",
            color: "#95a5a6"
        },
        {
            name: "🔄 RESET SYSTEM",
            function: "resetSystem",
            description: "Soft/Hard reset options",
            icon: "🔄",
            color: "#d35400"
        },
        {
            name: "❓ HELP & DOCS",
            function: "showHelp",
            description: "Dokumentasi lengkap",
            icon: "❓",
            color: "#7f8c8d"
        }
    ]
};

// ============================================================================
// 🏆 ERROR CODES STANDARD
// ============================================================================
const ERROR_CODES = {
    // SYSTEM ERRORS (1000-1999)
    SYSTEM: {
        INIT_FAILED: 1001,
        CONFIG_ERROR: 1002,
        MEMORY_LIMIT: 1003,
        TIMEOUT: 1004,
        PERMISSION_DENIED: 1005,
        QUOTA_EXCEEDED: 1006
    },

    // DRIVE ERRORS (2000-2999)
    DRIVE: {
        FOLDER_NOT_FOUND: 2001,
        FILE_NOT_FOUND: 2002,
        ACCESS_DENIED: 2003,
        RATE_LIMIT: 2004,
        INVALID_FILE: 2005,
        SIZE_EXCEEDED: 2006
    },

    // SHEETS ERRORS (3000-3999)
    SHEETS: {
        SPREADSHEET_NOT_FOUND: 3001,
        SHEET_NOT_FOUND: 3002,
        WRITE_FAILED: 3003,
        READ_FAILED: 3004,
        FORMAT_ERROR: 3005
    },

    // PROCESSING ERRORS (4000-4999)
    PROCESSING: {
        METADATA_EXTRACTION_FAILED: 4001,
        BATCH_PROCESSING_FAILED: 4002,
        CHECKPOINT_ERROR: 4003,
        WEBHOOK_FAILED: 4004,
        VALIDATION_ERROR: 4005
    },

    // NETWORK ERRORS (5000-5999)
    NETWORK: {
        CONNECTION_FAILED: 5001,
        TIMEOUT: 5002,
        INVALID_RESPONSE: 5003,
        AUTH_FAILED: 5004
    }
};

// ============================================================================
// 📊 SHEET TEMPLATES CONFIGURATION
// ============================================================================
const SHEET_TEMPLATES = {
    "🎯 DASHBOARD": {
        type: "DASHBOARD",
        columns: 6,
        frozenRows: 3,
        formulas: true,
        charts: true,
        autoRefresh: true,
        protected: true
    },

    "📚 DATABASE UTAMA": {
        type: "MAIN_DATABASE",
        columns: MASTER_CONFIG.SHEETS.COLUMNS.MAIN_DB.length,
        frozenRows: 1,
        dataValidation: true,
        conditionalFormatting: true,
        filters: true,
        protected: false
    },

    "📋 PROCESSING LOG": {
        type: "AUDIT_LOG",
        columns: MASTER_CONFIG.SHEETS.COLUMNS.PROCESS_LOG,
        maxRows: 10000,
        autoArchive: true,
        protected: false
    },

    "❌ ERROR LOG": {
        type: "ERROR_TRACKING",
        columns: MASTER_CONFIG.SHEETS.COLUMNS.ERROR_LOG,
        colorCoded: true,
        autoAlert: true,
        protected: false
    },

    "🔄 JOB QUEUE": {
        type: "QUEUE_MANAGEMENT",
        columns: MASTER_CONFIG.SHEETS.COLUMNS.JOB_QUEUE,
        maxRows: 1000,
        autoCleanup: true,
        protected: false
    },

    "🔄 PROGRESS TRACKER": {
        type: "PROGRESS_MONITOR",
        columns: ["TIMESTAMP", "OPERATION", "TOTAL_FILES", "PROCESSED",
            "FAILED", "PERCENTAGE", "ESTIMATED_TIME", "STATUS"],
        progressBar: true,
        realTimeUpdate: true,
        protected: false
    }
};

// ============================================================================
// 🔧 UTILITY FUNCTIONS
// ============================================================================
function getConfig() {
    return MASTER_CONFIG;
}

function getMenu() {
    return MAIN_MENU;
}

function getErrorCodes() {
    return ERROR_CODES;
}

function getSheetTemplates() {
    return SHEET_TEMPLATES;
}

// ============================================================================
// 📦 EXPORT MODULE
// ============================================================================
if (typeof module !== 'undefined') {
    module.exports = {
        MASTER_CONFIG,
        MAIN_MENU,
        ERROR_CODES,
        SHEET_TEMPLATES,
        getConfig,
        getMenu,
        getErrorCodes,
        getSheetTemplates
    };
}
