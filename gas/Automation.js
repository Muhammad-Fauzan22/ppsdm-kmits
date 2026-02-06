/**
 * ⚡ CORE PROCESSING ENGINE (PPSDM Automation)
 * Copy content ini ke file 'Automation.gs' di Google Apps Script editor Anda.
 */

// Helper: Cek apakah file sudah diproses
// Menggunakan Properties Service untuk lightweight tracking (bisa diganti Sheet DB)
function isFileProcessed(fileId) {
    const cache = CacheService.getScriptCache();
    if (cache.get(fileId)) return true;

    // Jika tidak ada di cache, bisa cek di DB Sheet jika perlu. 
    // Untuk versi Lite, kita anggap kalau file sudah dipindahkan folder berarti processed.
    return false;
}

// Class Definition (Extending Orchestrator)
PPSDM_Orchestrator.prototype.processBatch = function () {
    const props = PropertiesService.getScriptProperties();

    // 1. Cek Safety Lock
    if (props.getProperty('SYSTEM_STATUS') === 'PAUSED') {
        console.log('⛔ System is PAUSED. Skipping batch.');
        return;
    }

    const startTime = new Date().getTime();
    const BATCH_SIZE = this.config.PROCESSING?.BATCH_SIZE || 5;
    const TIME_LIMIT = 280 * 1000; // 4 menit 40 detik (Limit Google)

    // 2. Ambil File dari Queue
    const sourceFolder = DriveApp.getFolderById(this.config.DRIVE.SOURCE_FOLDER_ID);
    const files = sourceFolder.getFiles();

    let processedInBatch = 0;

    while (files.hasNext() && processedInBatch < BATCH_SIZE) {
        if (new Date().getTime() - startTime > TIME_LIMIT) {
            console.log('⚠️ Time limit reached. Exiting.');
            break;
        }

        const file = files.next();
        const fileId = file.getId();

        // Skip jika sudah diproses (Double check)
        if (this.isFileProcessed && this.isFileProcessed(fileId)) continue;

        try {
            console.log(`🔄 Processing: ${file.getName()}`);

            // 3. Ekstrak Metadata
            const metadata = this.extractMetadata(file.getName());
            metadata.format = file.getMimeType();

            // 4. Kirim ke Webhook Next.js
            const webhookResponse = this.sendToWebhook(file, metadata);

            // 5. Pindahkan ke Folder Processed
            const destFolder = this.getOrCreateFolder(this.config.DRIVE.PROCESSED_FOLDER_NAME || "Processed");
            file.moveTo(destFolder);

            // 6. Log (Optional)
            console.log("✅ Success:", webhookResponse);

            processedInBatch++;

            // Update Cache (Processed)
            CacheService.getScriptCache().put(fileId, "TRUE", 21600); // Cache 6 jam

        } catch (e) {
            console.error(`❌ Error processing ${file.getName()}: ${e.message}`);

            // Pindahkan ke Folder Error
            const errorFolder = this.getOrCreateFolder(this.config.DRIVE.ERROR_FOLDER_NAME || "Errors");
            file.moveTo(errorFolder);
        }
    }

    console.log(`✅ Batch completed. Processed: ${processedInBatch} files.`);
};

// Helper: Kirim ke Next.js
PPSDM_Orchestrator.prototype.sendToWebhook = function (file, metadata) {
    const payload = {
        job_id: Utilities.getUuid(),
        timestamp: new Date().toISOString(),
        file: {
            id: file.getId(),
            name: file.getName(),
            download_url: file.getDownloadUrl(),
            preview_url: file.getUrl(),
            mime_type: file.getMimeType()
        },
        metadata: metadata
    };

    const options = {
        method: 'post',
        contentType: 'application/json',
        headers: {
            "Authorization": "Bearer internal-system" // Sesuaikan dengan route.ts
        },
        payload: JSON.stringify(payload),
        muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(this.config.WEBHOOK.URL, options);
    const respText = response.getContentText();

    if (response.getResponseCode() >= 400) {
        throw new Error(`Webhook Error (${response.getResponseCode()}): ${respText}`);
    }

    return JSON.parse(respText);
};

/**
 * 🧠 SMART PARSER ENGINE
 * Mengubah nama file berantakan menjadi metadata terstruktur
 */
PPSDM_Orchestrator.prototype.extractMetadata = function (filename) {
    // Pola 1: [Kategori] Judul - Penulis (Tahun)
    const pattern1 = /^\[(.*?)\]\s*(.*?)\s*-\s*(.*?)\s*\((\d{4})\)/;

    // Pola 2: Judul - Penulis
    const pattern2 = /^(.*?)\s*-\s*(.*?)(\.|$)/;

    let metadata = {
        title: filename,
        author: "Unknown",
        category: "General",
        year: new Date().getFullYear(),
        tags: []
    };

    if (pattern1.test(filename)) {
        const match = filename.match(pattern1);
        metadata.category = match[1];
        metadata.title = match[2];
        metadata.author = match[3];
        metadata.year = match[4];
    } else if (pattern2.test(filename)) {
        const match = filename.match(pattern2);
        metadata.title = match[1];
        metadata.author = match[2];
    }

    // Auto-Tagging
    const keywords = {
        "money": ["Finance", "Wealth"],
        "habit": ["Self-Improvement", "Productivity"],
        "code": ["Technology", "Programming"],
        "sehat": ["Health", "Wellness"],
        "lead": ["Leadership", "Management"]
    };

    Object.keys(keywords).forEach(key => {
        if (metadata.title.toLowerCase().includes(key)) {
            metadata.tags.push(...keywords[key]);
        }
    });

    return metadata;
};
