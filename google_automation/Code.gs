// ===================== KONFIGURASI =====================
const CONFIG = {
  // Ganti dengan Folder ID Google Drive Anda
  DRIVE_FOLDER_ID: '1B1g7rSHGQtO1VXEWxSS8Ncbg0R3nxmFf',
  
  // URL API Vercel (Ganti setelah deploy)
  // Contoh: https://ppsdm-kmits.vercel.app/api/process
  API_ENDPOINT: 'https://ppsdm-kmits.vercel.app/api/process',
  
  // ID Spreadsheet untuk logging
  SHEET_ID: '1QEj9aoXDrAu6PKdFX-FNQt5pWlf7VsWMGeeU-PF9tQM',
  
  // Tipe file yang akan diproses
  SUPPORTED_TYPES: [
    'application/pdf',
    'application/vnd.google-apps.document', // Google Docs
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
    'text/plain'
  ]
};

// ===================== MENU & TRIGGER =====================
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🚀 BUKA BUKU REAL')
    .addItem('1. Inisialisasi Sistem', 'initializeSystem')
    .addItem('2. Jalankan Scanner (Manual)', 'monitorAndProcessBooks')
    .addItem('3. Test Koneksi API', 'testConnection')
    .addSeparator()
    .addItem('Stop Auto-Scanner', 'stopTriggers')
    .addItem('Start Auto-Scanner (10 Menit)', 'setupTriggers')
    .addToUi();
}

function initializeSystem() {
  const ui = SpreadsheetApp.getUi();
  
  try {
     // 1. Setup Log Sheet
    createLogSheet();
    
    // 2. Setup Dashboard
    setupDashboardSheet();
    
    // 3. Setup Triggers
    setupTriggers();
    
    ui.alert('✅ Sistem Berhasil Diinisialisasi!\n\nScanner akan berjalan otomatis setiap 10 menit.');
  } catch (e) {
    ui.alert('❌ Error: ' + e.toString());
  }
}

// ===================== CORE LOGIC =====================
function monitorAndProcessBooks() {
  console.log('🔍 Starting Scan...');
  
  try {
    const folder = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
    const files = folder.getFiles();
    const processedFiles = getProcessedFileIds(); // Cek log file yang sudah diproses
    
    let processedCount = 0;
    
    while (files.hasNext()) {
      const file = files.next();
      const fileId = file.getId();
      
      // Filter tipe file
      if (!CONFIG.SUPPORTED_TYPES.includes(file.getMimeType())) {
        continue;
      }
      
      // Skip jika sudah diproses
      if (processedFiles.has(fileId)) {
        continue;
      }
      
      console.log(`📄 Memproses file baru: ${file.getName()}`);
      
      // Kirim ke API
      const success = sendFileToApi(file);
      
      if (success) {
        processedCount++;
        // Sleep sebentar agar tidak meledak rate limit API
        Utilities.sleep(1000); 
      }
    }
    
    if (processedCount > 0) {
      updateDashboardStats();
    }
    
    console.log(`✅ Scan Selesai. ${processedCount} file baru diproses.`);
    
  } catch (e) {
    console.error('❌ Scanner Error:', e);
    logToSheet('SYSTEM', 'CRITICAL_ERROR', 'Scanner Failed', e.toString());
  }
}

function sendFileToApi(file) {
  try {
    const token = ScriptApp.getOAuthToken(); // TOKEN KUNCI UNTUK AKSES DRIVE
    
    const payload = {
      fileId: file.getId(),
      fileName: file.getName(),
      fileUrl: file.getUrl(),
      mimeType: file.getMimeType(),
      size: file.getSize()
    };
    
    const options = {
      method: 'POST',
      contentType: 'application/json',
      headers: {
        'Authorization': `Bearer ${token}` // Kirim token ke API
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };
    
    const response = UrlFetchApp.fetch(CONFIG.API_ENDPOINT, options);
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    if (responseCode === 200) {
      // Sukses
      const data = JSON.parse(responseText);
      logToSheet(file.getId(), file.getName(), 'SUCCESS', `Processed in ${data.processingTime}ms`);
      return true;
    } else {
      // Gagal dari API
      logToSheet(file.getId(), file.getName(), 'API_ERROR', `Code: ${responseCode} | ${responseText.substring(0, 100)}`);
      return false;
    }
    
  } catch (e) {
    // Gagal Koneksi
    logToSheet(file.getId(), file.getName(), 'NETWORK_ERROR', e.toString());
    return false;
  }
}

// ===================== HELPER =====================
function getProcessedFileIds() {
  const sheet = getSheet('ProcessedLog');
  const ids = new Set();
  const data = sheet.getDataRange().getValues();
  
  // Mulai baris 2 (skip header)
  for (let i = 1; i < data.length; i++) {
    if (data[i][2] === 'SUCCESS') { // Hanya skip yang SUKSES
      ids.add(data[i][0]);
    }
  }
  return ids;
}

function logToSheet(fileId, fileName, status, details) {
  const sheet = getSheet('ProcessedLog');
  sheet.appendRow([
    fileId,
    fileName,
    status,
    new Date(),
    details
  ]);
}

function getSheet(name) {
  const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

function createLogSheet() {
  const sheet = getSheet('ProcessedLog');
  // Setup Header jika kosong
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['File ID', 'File Name', 'Status', 'Timestamp', 'Details']);
    sheet.getRange('A1:E1').setFontWeight('bold').setBackground('#ddd');
    sheet.setFrozenRows(1);
  }
}

function setupDashboardSheet() {
   const sheet = getSheet('Dashboard');
   // Simple dashboard setup...
   // (User sudah punya setupDashboard yang lebih kompleks di kode sebelumnya, 
   //  tapi ini hanya memastikan sheetnya ada)
}

function updateDashboardStats() {
  // Update last run time di Dashboard
  const sheet = getSheet('Dashboard');
  sheet.getRange('B2').setValue(new Date()); 
}

function setupTriggers() {
  stopTriggers(); // Hapus trigger lama biar ga double
  
  ScriptApp.newTrigger('monitorAndProcessBooks')
    .timeBased()
    .everyMinutes(10)
    .create();
    
  console.log('⏰ Trigger 10 menit dipasang.');
}

function stopTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  for (const t of triggers) {
    ScriptApp.deleteTrigger(t);
  }
  console.log('🚫 Semua trigger dimatikan.');
}

function testConnection() {
  try {
    const response = UrlFetchApp.fetch(CONFIG.API_ENDPOINT.replace('/process', '/status'), {
      muteHttpExceptions: true
    });
    SpreadsheetApp.getUi().alert(`Status API: ${response.getResponseCode()}\nResponse: ${response.getContentText()}`);
  } catch (e) {
    SpreadsheetApp.getUi().alert(`Gagal koneksi: ${e.toString()}`);
  }
}
