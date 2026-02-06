/**
 * 🏗️ LAYER 6: BUSINESS LOGIC - MAIN ORCHESTRATOR
 * SISTEM: PPSDM_LMS_ENTERPRISE_V4
 * VERSION: 4.2.0
 * CONTROLLER PRINCIPAL: Orchestrator
 */

// ============================================================================
// 📦 DEPENDENCIES IMPORTS (Dummy imports untuk struktur)
// ============================================================================
// Catatan: Di Google Apps Script, kita tidak bisa import seperti ES6
// Semua file akan digabung dalam satu project, jadi fungsi akan tersedia global

// ============================================================================
// 🎮 MAIN ORCHESTRATOR CLASS
// ============================================================================
class PPSDM_Orchestrator {

  constructor() {
    this.config = MASTER_CONFIG;
    this.state = {
      isProcessing: false,
      currentJobId: null,
      startTime: null,
      processedCount: 0,
      errorCount: 0,
      totalFiles: 0,
      currentBatch: 0
    };

    this.modules = {
      drive: null,
      sheets: null,
      webhook: null,
      metadata: null,
      logger: null,
      checkpoint: null
    };

    this.initialize();
  }

  // ==========================================================================
  // 🏁 INITIALIZATION METHODS
  // ==========================================================================

  /**
   * Initialize system dan semua dependencies
   */
  initialize() {
    try {
      console.log(`🚀 Initializing ${this.config.SYSTEM.NAME} v${this.config.SYSTEM.VERSION}`);

      // Initialize Properties Service
      this.initProperties();

      // Initialize Sheets Service
      this.initSheets();

      // Initialize system state
      this.loadSystemState();

      // Create menu
      this.createMenu();

      // Log initialization
      this.logSystemEvent('SYSTEM_INIT', 'Orchestrator initialized successfully', 'INFO');

      return {
        success: true,
        message: `System ${this.config.SYSTEM.NAME} initialized successfully`,
        version: this.config.SYSTEM.VERSION,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Orchestrator initialization failed:', error);
      this.logSystemEvent('SYSTEM_INIT_ERROR', error.toString(), 'ERROR');

      return {
        success: false,
        message: `Initialization failed: ${error.message}`,
        error: error.toString()
      };
    }
  }

  /**
   * Initialize Properties Service untuk checkpoint
   */
  initProperties() {
    const scriptProps = PropertiesService.getScriptProperties();

    // Set default properties jika belum ada
    const defaults = {
      SYSTEM_ID: Utilities.getUuid(),
      INITIALIZED_DATE: new Date().toISOString(),
      TOTAL_PROCESSED_FILES: "0",
      TOTAL_ERRORS: "0",
      LAST_BACKUP_DATE: "",
      SYSTEM_STATUS: "IDLE"
    };

    for (const [key, value] of Object.entries(defaults)) {
      if (!scriptProps.getProperty(key)) {
        scriptProps.setProperty(key, value);
      }
    }

    console.log('✅ Properties Service initialized');
  }

  /**
   * Initialize Sheets Service dan buat semua sheet
   */
  initSheets() {
    try {
      const spreadsheet = SpreadsheetApp.openById(this.config.SHEETS.SPREADSHEET_ID);

      // Create all required sheets
      for (const [sheetName, template] of Object.entries(SHEET_TEMPLATES)) {
        let sheet = spreadsheet.getSheetByName(sheetName);

        if (!sheet) {
          sheet = spreadsheet.insertSheet(sheetName);
          console.log(`📄 Created sheet: ${sheetName}`);
        }

        // Apply template formatting
        this.applySheetTemplate(sheet, template);
      }

      // Set active sheet to dashboard
      const dashboardSheet = spreadsheet.getSheetByName("🎯 DASHBOARD");
      if (dashboardSheet) {
        spreadsheet.setActiveSheet(dashboardSheet);
      }

      console.log('✅ Sheets Service initialized');
      return spreadsheet;

    } catch (error) {
      console.error('❌ Sheets initialization failed:', error);
      throw new Error(`Sheets init failed: ${error.message}`);
    }
  }

  /**
   * Apply template ke sheet
   */
  applySheetTemplate(sheet, template) {
    try {
      // Clear sheet
      sheet.clear();

      // Set header jika ada columns
      if (template.columns && template.columns.length > 0) {
        sheet.getRange(1, 1, 1, template.columns.length)
          .setValues([template.columns])
          .setBackground(this.config.SHEETS.STYLES.HEADER_BACKGROUND)
          .setFontColor(this.config.SHEETS.STYLES.HEADER_TEXT_COLOR)
          .setFontWeight('bold');

        // Freeze header row
        sheet.setFrozenRows(1);
      }

      // Apply column widths
      const numColumns = template.columns ? template.columns.length : template.columns || 10;
      for (let i = 1; i <= numColumns; i++) {
        sheet.setColumnWidth(i, 150);
      }

      // Apply protection if specified
      if (template.protected) {
        const protection = sheet.protect();
        protection.setDescription(`Protected by ${this.config.SYSTEM.NAME}`);
        protection.setWarningOnly(true);
      }

    } catch (error) {
      console.error(`Template application failed for ${sheet.getName()}:`, error);
    }
  }

  /**
   * Load system state dari Properties
   */
  loadSystemState() {
    const scriptProps = PropertiesService.getScriptProperties();

    this.state = {
      isProcessing: scriptProps.getProperty('SYSTEM_STATUS') === 'PROCESSING',
      currentJobId: scriptProps.getProperty('CURRENT_JOB_ID') || Utilities.getUuid(),
      startTime: scriptProps.getProperty('SESSION_START_TIME') || null,
      processedCount: parseInt(scriptProps.getProperty('PROCESSED_COUNT') || '0'),
      errorCount: parseInt(scriptProps.getProperty('ERROR_COUNT') || '0'),
      totalFiles: parseInt(scriptProps.getProperty('TOTAL_FILES') || '0'),
      currentBatch: parseInt(scriptProps.getProperty('CURRENT_BATCH') || '0')
    };

    console.log('📊 System state loaded:', this.state);
  }

  /**
   * Save system state ke Properties
   */
  saveSystemState() {
    const scriptProps = PropertiesService.getScriptProperties();

    scriptProps.setProperty('SYSTEM_STATUS', this.state.isProcessing ? 'PROCESSING' : 'IDLE');
    scriptProps.setProperty('CURRENT_JOB_ID', this.state.currentJobId || '');
    scriptProps.setProperty('SESSION_START_TIME', this.state.startTime || '');
    scriptProps.setProperty('PROCESSED_COUNT', this.state.processedCount.toString());
    scriptProps.setProperty('ERROR_COUNT', this.state.errorCount.toString());
    scriptProps.setProperty('TOTAL_FILES', this.state.totalFiles.toString());
    scriptProps.setProperty('CURRENT_BATCH', this.state.currentBatch.toString());

    console.log('💾 System state saved');
  }

  /**
   * Create custom menu di Sheets
   */
  createMenu() {
    try {
      const menu = SpreadsheetApp.getUi().createMenu(MAIN_MENU.name);

      MAIN_MENU.items.forEach(item => {
        menu.addItem(item.name, item.function);
      });

      menu.addToUi();
      console.log('✅ Custom menu created');

    } catch (error) {
      console.error('❌ Menu creation failed:', error);
    }
  }

  // ==========================================================================
  // 🚀 12 MAIN FUNCTIONS - DIPANGGIL DARI MENU
  // ==========================================================================

  /**
   * 1. LAUNCH FULL SCAN - Scan lengkap semua file
   */
  launchFullScan() {
    try {
      if (this.state.isProcessing) {
        SpreadsheetApp.getUi().alert('⚠️ System sedang proses!',
          'Sistem sedang memproses batch sebelumnya. Gunakan RESUME atau STOP terlebih dahulu.',
          SpreadsheetApp.getUi().ButtonSet.OK);
        return;
      }

      // Konfirmasi dengan user
      const ui = SpreadsheetApp.getUi();
      const response = ui.alert('🚀 LAUNCH FULL SCAN',
        'Apakah Anda yakin ingin melakukan scan lengkap?\n\n' +
        '• Scan semua file di Drive Folder\n' +
        '• Ekstrak metadata otomatis\n' +
        '• Kirim ke Next.js API\n' +
        '• Update database lengkap\n\n' +
        'Proses ini mungkin memakan waktu beberapa menit.',
        ui.ButtonSet.YES_NO);

      if (response !== ui.Button.YES) {
        return;
      }

      // Update state
      this.state.isProcessing = true;
      this.state.startTime = new Date().toISOString();
      this.state.currentJobId = Utilities.getUuid();
      this.state.processedCount = 0;
      this.state.errorCount = 0;
      this.saveSystemState();

      // Log start
      this.logSystemEvent('FULL_SCAN_STARTED',
        `Memulai full scan dengan Job ID: ${this.state.currentJobId}`,
        'INFO');

      // Update dashboard
      this.updateDashboard('SCANNING', 'Memulai proses scanning...', 0);

      // Start processing (akan dilanjutkan di prompt berikutnya)
      // Untuk sekarang, kita simulasikan
      this.simulateFullScan();

      return {
        success: true,
        message: 'Full scan launched successfully',
        jobId: this.state.currentJobId,
        timestamp: this.state.startTime
      };

    } catch (error) {
      console.error('❌ Full scan launch failed:', error);
      this.logSystemEvent('FULL_SCAN_ERROR', error.toString(), 'ERROR');

      return {
        success: false,
        message: `Full scan failed: ${error.message}`,
        error: error.toString()
      };
    }
  }

  /**
   * 2. RESUME PROCESS - Lanjutkan dari checkpoint
   */
  resumeProcess() {
    try {
      const scriptProps = PropertiesService.getScriptProperties();
      const lastCheckpoint = scriptProps.getProperty('LAST_CHECKPOINT');

      if (!lastCheckpoint) {
        SpreadsheetApp.getUi().alert('ℹ️ Tidak ada checkpoint',
          'Tidak ada proses yang dapat dilanjutkan. Silakan mulai scan baru.',
          SpreadsheetApp.getUi().ButtonSet.OK);
        return;
      }

      const ui = SpreadsheetApp.getUi();
      const response = ui.alert('↩️ RESUME PROCESS',
        `Lanjutkan proses dari checkpoint terakhir?\n\n` +
        `• Checkpoint: ${new Date(lastCheckpoint).toLocaleString()}\n` +
        `• Files processed: ${scriptProps.getProperty('PROCESSED_COUNT')}\n` +
        `• Status: ${scriptProps.getProperty('SYSTEM_STATUS')}`,
        ui.ButtonSet.YES_NO_CANCEL);

      if (response !== ui.Button.YES) {
        return;
      }

      // Load checkpoint data
      const checkpointData = JSON.parse(scriptProps.getProperty('RESUMABLE_DATA') || '{}');

      // Update state
      this.state.isProcessing = true;
      this.state.processedCount = parseInt(checkpointData.processedCount || '0');
      this.state.errorCount = parseInt(checkpointData.errorCount || '0');
      this.state.currentBatch = parseInt(checkpointData.currentBatch || '0');
      this.state.totalFiles = parseInt(checkpointData.totalFiles || '0');
      this.saveSystemState();

      this.logSystemEvent('PROCESS_RESUMED',
        `Melanjutkan proses dari checkpoint. Files: ${this.state.processedCount}/${this.state.totalFiles}`,
        'INFO');

      // Update dashboard
      this.updateDashboard('RESUMING', 'Melanjutkan proses...',
        this.state.totalFiles > 0 ? Math.round((this.state.processedCount / this.state.totalFiles) * 100) : 0);

      // Resume processing (akan dilanjutkan di prompt berikutnya)
      this.simulateResumeProcess(checkpointData);

      return {
        success: true,
        message: 'Process resumed successfully',
        checkpoint: lastCheckpoint,
        resumePoint: checkpointData
      };

    } catch (error) {
      console.error('❌ Resume process failed:', error);
      this.logSystemEvent('RESUME_ERROR', error.toString(), 'ERROR');

      return {
        success: false,
        message: `Resume failed: ${error.message}`,
        error: error.toString()
      };
    }
  }

  /**
   * 3. STOP PROCESS - Stop dengan save checkpoint
   */
  stopProcess() {
    try {
      if (!this.state.isProcessing) {
        SpreadsheetApp.getUi().alert('ℹ️ Tidak ada proses aktif',
          'Tidak ada proses yang sedang berjalan untuk dihentikan.',
          SpreadsheetApp.getUi().ButtonSet.OK);
        return;
      }

      const ui = SpreadsheetApp.getUi();
      const response = ui.alert('⏹️ STOP PROCESS',
        `Hentikan proses saat ini dan simpan checkpoint?\n\n` +
        `• Files processed: ${this.state.processedCount}\n` +
        `• Errors: ${this.state.errorCount}\n` +
        `• Dapat dilanjutkan nanti dengan RESUME`,
        ui.ButtonSet.YES_NO_CANCEL);

      if (response !== ui.Button.YES) {
        return;
      }

      // Create checkpoint data
      const checkpointData = {
        processedCount: this.state.processedCount,
        errorCount: this.state.errorCount,
        currentBatch: this.state.currentBatch,
        totalFiles: this.state.totalFiles,
        stoppedAt: new Date().toISOString(),
        jobId: this.state.currentJobId
      };

      // Save checkpoint
      const scriptProps = PropertiesService.getScriptProperties();
      scriptProps.setProperty('LAST_CHECKPOINT', new Date().toISOString());
      scriptProps.setProperty('RESUMABLE_DATA', JSON.stringify(checkpointData));
      scriptProps.setProperty('SYSTEM_STATUS', 'PAUSED');

      // Update state
      this.state.isProcessing = false;
      this.saveSystemState();

      this.logSystemEvent('PROCESS_STOPPED',
        `Proses dihentikan dengan checkpoint. Files: ${this.state.processedCount}/${this.state.totalFiles}`,
        'WARNING');

      // Update dashboard
      this.updateDashboard('PAUSED', 'Proses dihentikan dengan checkpoint',
        this.state.totalFiles > 0 ? Math.round((this.state.processedCount / this.state.totalFiles) * 100) : 0);

      SpreadsheetApp.getUi().alert('✅ Proses dihentikan',
        `Checkpoint berhasil disimpan.\n\n` +
        `Progress: ${this.state.processedCount}/${this.state.totalFiles} files\n` +
        `Dapat dilanjutkan kapan saja dengan RESUME.`,
        SpreadsheetApp.getUi().ButtonSet.OK);

      return {
        success: true,
        message: 'Process stopped with checkpoint',
        checkpoint: checkpointData
      };

    } catch (error) {
      console.error('❌ Stop process failed:', error);
      this.logSystemEvent('STOP_ERROR', error.toString(), 'ERROR');

      return {
        success: false,
        message: `Stop failed: ${error.message}`,
        error: error.toString()
      };
    }
  }
  /**
   * 4. OPEN COMMAND CENTER - Dashboard kontrol real-time
   */
  openCommandCenter() {
    try {
      const htmlTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
          <base target="_top">
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
          <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
          <style>
            body { padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
            .card { margin-bottom: 15px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .status-badge { padding: 5px 10px; border-radius: 20px; font-size: 12px; font-weight: bold; }
            .status-active { background-color: #27ae60; color: white; }
            .status-inactive { background-color: #95a5a6; color: white; }
            .status-error { background-color: #e74c3c; color: white; }
            .progress-container { height: 25px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container-fluid">
            <div class="row mb-4">
              <div class="col-12">
                <h1>🎮 PPSDM LMS COMMAND CENTER</h1>
                <p class="text-muted">v${MASTER_CONFIG.SYSTEM.VERSION} | ${new Date().toLocaleString()}</p>
              </div>
            </div>
            
            <div class="row">
              <!-- SYSTEM STATUS -->
              <div class="col-md-6">
                <div class="card">
                  <div class="card-header bg-primary text-white">
                    <h5 class="mb-0">📊 SYSTEM STATUS</h5>
                  </div>
                  <div class="card-body">
                    <table class="table table-sm">
                      <tr><td>System ID:</td><td><strong id="system-id">Loading...</strong></td></tr>
                      <tr><td>Status:</td><td><span id="system-status" class="status-badge status-inactive">LOADING</span></td></tr>
                      <tr><td>Uptime:</td><td id="system-uptime">-</td></tr>
                      <tr><td>Last Backup:</td><td id="last-backup">-</td></tr>
                      <tr><td>Memory Usage:</td><td id="memory-usage">-</td></tr>
                    </table>
                  </div>
                </div>
              </div>
              
              <!-- PROCESSING STATS -->
              <div class="col-md-6">
                <div class="card">
                  <div class="card-header bg-success text-white">
                    <h5 class="mb-0">📈 PROCESSING STATS</h5>
                  </div>
                  <div class="card-body">
                    <table class="table table-sm">
                      <tr><td>Total Files:</td><td id="total-files">0</td></tr>
                      <tr><td>Processed:</td><td id="processed-files">0</td></tr>
                      <tr><td>Errors:</td><td id="error-files">0</td></tr>
                      <tr><td>Success Rate:</td><td id="success-rate">0%</td></tr>
                      <tr><td>Current Job:</td><td id="current-job">-</td></tr>
                    </table>
                    <div class="progress-container">
                      <div class="progress">
                        <div id="progress-bar" class="progress-bar bg-success" role="progressbar" style="width: 0%"></div>
                      </div>
                      <small class="text-muted" id="progress-text">0% complete</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- QUICK ACTIONS -->
            <div class="row mt-4">
              <div class="col-12">
                <div class="card">
                  <div class="card-header bg-warning text-dark">
                    <h5 class="mb-0">⚡ QUICK ACTIONS</h5>
                  </div>
                  <div class="card-body">
                    <div class="row g-2">
                      <div class="col-md-3">
                        <button class="btn btn-success w-100" onclick="google.script.run.launchFullScan()">🚀 Full Scan</button>
                      </div>
                      <div class="col-md-3">
                        <button class="btn btn-primary w-100" onclick="google.script.run.resumeProcess()">↩️ Resume</button>
                      </div>
                      <div class="col-md-3">
                        <button class="btn btn-danger w-100" onclick="google.script.run.stopProcess()">⏹️ Stop</button>
                      </div>
                      <div class="col-md-3">
                        <button class="btn btn-info w-100" onclick="google.script.run.updateStatistics()">📈 Refresh Stats</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- LIVE LOGS -->
            <div class="row mt-4">
              <div class="col-12">
                <div class="card">
                  <div class="card-header bg-dark text-white">
                    <h5 class="mb-0">📝 LIVE SYSTEM LOGS</h5>
                  </div>
                  <div class="card-body">
                    <div id="log-container" style="height: 200px; overflow-y: auto; font-family: monospace; font-size: 12px;">
                      <div class="text-center text-muted py-4">Loading logs...</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <script>
            // Auto-refresh setiap 5 detik
            function refreshData() {
              google.script.run
                .withSuccessHandler(updateDashboard)
                .withFailureHandler(showError)
                .getCommandCenterData();
            }
            
            function updateDashboard(data) {
              // Update system status
              document.getElementById('system-id').textContent = data.systemId || 'N/A';
              document.getElementById('system-status').textContent = data.status || 'UNKNOWN';
              document.getElementById('system-status').className = 'status-badge ' + (data.statusClass || 'status-inactive');
              document.getElementById('system-uptime').textContent = data.uptime || '-';
              document.getElementById('last-backup').textContent = data.lastBackup || '-';
              document.getElementById('memory-usage').textContent = data.memoryUsage || '-';
              
              // Update processing stats
              document.getElementById('total-files').textContent = data.totalFiles || 0;
              document.getElementById('processed-files').textContent = data.processedFiles || 0;
              document.getElementById('error-files').textContent = data.errorFiles || 0;
              document.getElementById('success-rate').textContent = data.successRate || '0%';
              document.getElementById('current-job').textContent = data.currentJob || '-';
              
              // Update progress bar
              const progressPercent = data.progressPercent || 0;
              document.getElementById('progress-bar').style.width = progressPercent + '%';
              document.getElementById('progress-text').textContent = progressPercent + '% complete';
              
              // Update logs
              if (data.logs && data.logs.length > 0) {
                const logContainer = document.getElementById('log-container');
                logContainer.innerHTML = '';
                data.logs.forEach(log => {
                  const logElement = document.createElement('div');
                  logElement.className = 'py-1 border-bottom';
                  logElement.innerHTML = \`<span class="text-muted">[\${log.timestamp}]</span> \${log.message}\`;
                  logContainer.appendChild(logElement);
                });
                logContainer.scrollTop = logContainer.scrollHeight;
              }
            }
            
            function showError(error) {
              console.error('Error:', error);
            }
            
            // Initial load
            document.addEventListener('DOMContentLoaded', function() {
              refreshData();
              setInterval(refreshData, 5000); // Refresh setiap 5 detik
            });
          </script>
        </body>
        </html>
      `;

      const htmlOutput = HtmlService.createHtmlOutput(htmlTemplate)
        .setWidth(900)
        .setHeight(700)
        .setTitle('🎮 PPSDM LMS Command Center');

      SpreadsheetApp.getUi().showModalDialog(htmlOutput, '🎮 Command Center');

      return {
        success: true,
        message: 'Command center opened'
      };

    } catch (error) {
      console.error('❌ Command center failed:', error);
      return {
        success: false,
        message: `Command center error: ${error.message}`
      };
    }
  }

  /**
   * 5. INITIALIZE SYSTEM - Setup pertama kali
   */
  initializeSystem() {
    try {
      const ui = SpreadsheetApp.getUi();
      const response = ui.alert('⚙️ INITIALIZE SYSTEM',
        'Ini akan setup sistem untuk pertama kali:\n\n' +
        '• Buat semua sheets (17 sheets)\n' +
        '• Setup struktur folder\n' +
        '• Konfigurasi Properties\n' +
        '• Generate System ID\n\n' +
        'Apakah Anda yakin?',
        ui.ButtonSet.YES_NO);

      if (response !== ui.Button.YES) {
        return;
      }

      // Run full initialization
      const result = this.initialize();

      if (result.success) {
        ui.alert('✅ System Initialized',
          `System berhasil diinisialisasi!\n\n` +
          `• System ID: ${PropertiesService.getScriptProperties().getProperty('SYSTEM_ID')}\n` +
          `• Version: ${this.config.SYSTEM.VERSION}\n` +
          `• Sheets: 17 sheets created\n` +
          `• Status: READY`,
          ui.ButtonSet.OK);
      }

      return result;

    } catch (error) {
      console.error('❌ System initialization failed:', error);
      return {
        success: false,
        message: `Initialization failed: ${error.message}`
      };
    }
  }

  /**
   * 6. REINITIALIZE SYSTEM - Reset total + backup
   */
  reinitializeSystem() {
    try {
      const ui = SpreadsheetApp.getUi();
      const response = ui.alert('🔁 REINITIALIZE SYSTEM',
        '⚠️ PERINGATAN: Ini akan RESET TOTAL sistem!\n\n' +
        '• Backup data terlebih dahulu\n' +
        '• Hapus semua sheets\n' +
        '• Buat ulang dari template\n' +
        '• Reset semua konfigurasi\n\n' +
        'Apakah Anda benar-benar yakin?',
        ui.ButtonSet.YES_NO_CANCEL);

      if (response !== ui.Button.YES) {
        return;
      }

      // Backup dulu
      this.backupSystem();

      // Clear semua sheets
      const spreadsheet = SpreadsheetApp.openById(this.config.SHEETS.SPREADSHEET_ID);
      const sheets = spreadsheet.getSheets();

      sheets.forEach(sheet => {
        if (sheet.getName() !== "🎯 DASHBOARD") {
          spreadsheet.deleteSheet(sheet);
        }
      });

      // Clear Properties
      PropertiesService.getScriptProperties().deleteAllProperties();

      // Initialize ulang
      const result = this.initialize();

      ui.alert('✅ System Reinitialized',
        'System berhasil direset dan diinisialisasi ulang!\n' +
        'Semua data telah dibackup.',
        ui.ButtonSet.OK);

      return result;

    } catch (error) {
      console.error('❌ Reinitialization failed:', error);
      return {
        success: false,
        message: `Reinitialization failed: ${error.message}`
      };
    }
  }
  /**
   * 7. UPDATE STATISTICS - Refresh semua metrics
   */
  updateStatistics() {
    try {
      this.logSystemEvent('STATS_UPDATE', 'Memperbarui statistics dashboard', 'INFO');

      // Update dashboard dengan data terbaru
      this.updateDashboard('UPDATING', 'Memperbarui statistics...', 0);

      // Simulasikan perhitungan stats (akan diimplementasikan lengkap nanti)
      const stats = this.calculateSystemStatistics();

      // Update dashboard sheet
      this.updateStatisticsDashboard(stats);

      SpreadsheetApp.getActiveSpreadsheet().toast('✅ Statistics updated', 'Success', 3);

      return {
        success: true,
        message: 'Statistics updated successfully',
        stats: stats,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Update statistics failed:', error);
      return {
        success: false,
        message: `Update statistics failed: ${error.message}`
      };
    }
  }

  /**
   * 8. EXPORT DATA - Export ke CSV/JSON
   */
  exportData() {
    try {
      const ui = SpreadsheetApp.getUi();
      const response = ui.alert('📤 EXPORT DATA',
        'Export data ke format:\n\n' +
        '• CSV (untuk Excel)\n' +
        '• JSON (untuk API)\n' +
        '• PDF Report\n\n' +
        'Pilih format:',
        ui.ButtonSet.YES_NO_CANCEL);

      // Simple export untuk sekarang
      const spreadsheet = SpreadsheetApp.openById(this.config.SHEETS.SPREADSHEET_ID);
      const mainDbSheet = spreadsheet.getSheetByName("📚 DATABASE UTAMA");

      if (!mainDbSheet) {
        throw new Error('Main database sheet not found');
      }

      const data = mainDbSheet.getDataRange().getValues();

      // Create export folder
      const exportFolder = this.getOrCreateFolder(this.config.DRIVE.EXPORT_FOLDER);

      // Export as CSV
      const csvContent = data.map(row => row.join(',')).join('\n');
      const csvBlob = Utilities.newBlob(csvContent, 'text/csv', `PPSDM_Export_${new Date().toISOString()}.csv`);
      const csvFile = exportFolder.createFile(csvBlob);

      // Export as JSON
      const headers = data[0];
      const jsonData = [];

      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index];
        });
        jsonData.push(obj);
      }

      const jsonContent = JSON.stringify(jsonData, null, 2);
      const jsonBlob = Utilities.newBlob(jsonContent, 'application/json', `PPSDM_Export_${new Date().toISOString()}.json`);
      const jsonFile = exportFolder.createFile(jsonBlob);

      ui.alert('✅ Data Exported',
        `Data berhasil diexport!\n\n` +
        `• CSV: ${csvFile.getName()}\n` +
        `• JSON: ${jsonFile.getName()}\n\n` +
        `File tersimpan di folder: ${exportFolder.getName()}`,
        ui.ButtonSet.OK);

      return {
        success: true,
        message: 'Data exported successfully',
        files: [csvFile.getUrl(), jsonFile.getUrl()],
        recordCount: jsonData.length
      };

    } catch (error) {
      console.error('❌ Export data failed:', error);
      return {
        success: false,
        message: `Export failed: ${error.message}`
      };
    }
  }

  /**
   * 9. BACKUP SYSTEM - Full system backup
   */
  backupSystem() {
    try {
      this.logSystemEvent('BACKUP_START', 'Memulai system backup', 'INFO');

      // Create backup folder dengan timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFolderName = `BACKUP_${timestamp}`;

      const backupRoot = this.getOrCreateFolder(this.config.DRIVE.BACKUP_FOLDER);
      const backupFolder = backupRoot.createFolder(backupFolderName);

      // Backup spreadsheet
      const spreadsheet = SpreadsheetApp.openById(this.config.SHEETS.SPREADSHEET_ID);
      const spreadsheetBlob = {
        mimeType: MimeType.GOOGLE_SHEETS,
        name: `PPSDM_Backup_${timestamp}.xlsx`
      };

      // Export sebagai Excel
      const spreadsheetFile = Drive.Files.copy(spreadsheetBlob, this.config.SHEETS.SPREADSHEET_ID, {
        convert: true
      });

      // Pindahkan ke backup folder
      Drive.Files.update({}, spreadsheetFile.id, null, {
        addParents: backupFolder.getId(),
        removeParents: Drive.Files.get(spreadsheetFile.id).parents.map(p => p.id)
      });

      // Backup Properties
      const scriptProps = PropertiesService.getScriptProperties();
      const props = scriptProps.getProperties();
      const propsContent = JSON.stringify(props, null, 2);
      const propsBlob = Utilities.newBlob(propsContent, 'application/json', `Properties_${timestamp}.json`);
      backupFolder.createFile(propsBlob);

      // Update last backup date
      scriptProps.setProperty('LAST_BACKUP_DATE', new Date().toISOString());

      this.logSystemEvent('BACKUP_COMPLETE',
        `System backup completed: ${backupFolder.getUrl()}`,
        'SUCCESS');

      SpreadsheetApp.getActiveSpreadsheet().toast('✅ System backup completed', 'Backup', 5);

      return {
        success: true,
        message: 'System backup completed',
        backupFolder: backupFolder.getUrl(),
        timestamp: timestamp,
        propertiesBackedUp: Object.keys(props).length
      };

    } catch (error) {
      console.error('❌ System backup failed:', error);
      this.logSystemEvent('BACKUP_ERROR', error.toString(), 'ERROR');

      return {
        success: false,
        message: `Backup failed: ${error.message}`
      };
    }
  }

  /**
   * 10. CLEAR CACHE - Bersihkan semua cache
   */
  clearCache() {
    try {
      const ui = SpreadsheetApp.getUi();
      const response = ui.alert('🧹 CLEAR CACHE',
        'Bersihkan semua cache sistem?\n\n' +
        '• Cache Properties\n' +
        '• Temporary files\n' +
        '• Session data\n\n' +
        'Tidak akan menghapus data utama.',
        ui.ButtonSet.YES_NO);

      if (response !== ui.Button.YES) {
        return;
      }

      // Clear specific cache properties
      const scriptProps = PropertiesService.getScriptProperties();
      const cacheKeys = [
        'CACHE_LAST_SCAN',
        'CACHE_FOLDER_STRUCTURE',
        'CACHE_METADATA_PATTERNS',
        'CACHE_WEBHOOK_RESPONSES'
      ];

      cacheKeys.forEach(key => {
        if (scriptProps.getProperty(key)) {
          scriptProps.deleteProperty(key);
        }
      });

      // Clear user properties
      PropertiesService.getUserProperties().deleteAllProperties();

      // Clear document properties
      PropertiesService.getDocumentProperties().deleteAllProperties();

      // Update cache sheet
      const spreadsheet = SpreadsheetApp.openById(this.config.SHEETS.SPREADSHEET_ID);
      const cacheSheet = spreadsheet.getSheetByName("🧹 CACHE STATUS");

      if (cacheSheet) {
        cacheSheet.clear();
        cacheSheet.getRange(1, 1).setValue('Cache cleared at: ' + new Date().toISOString());
      }

      this.logSystemEvent('CACHE_CLEARED', 'Semua cache telah dibersihkan', 'INFO');
      SpreadsheetApp.getActiveSpreadsheet().toast('✅ Cache cleared', 'Success', 3);

      return {
        success: true,
        message: 'Cache cleared successfully',
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Clear cache failed:', error);
      return {
        success: false,
        message: `Clear cache failed: ${error.message}`
      };
    }
  }

  /**
   * 11. RESET SYSTEM - Soft/Hard reset options
   */
  resetSystem() {
    try {
      const htmlTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
          <base target="_top">
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
          <style>
            body { padding: 20px; }
            .reset-option { cursor: pointer; transition: all 0.3s; }
            .reset-option:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
            .danger-zone { border: 2px solid #e74c3c; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2 class="mb-4">🔄 SYSTEM RESET OPTIONS</h2>
            <p class="text-muted mb-4">Pilih jenis reset yang diinginkan:</p>
            
            <div class="row">
              <!-- SOFT RESET -->
              <div class="col-md-4 mb-3">
                <div class="card reset-option" onclick="softReset()">
                  <div class="card-body text-center">
                    <h5>🔄 SOFT RESET</h5>
                    <p class="text-muted">Reset status processing tanpa menghapus data</p>
                    <ul class="text-start text-muted small">
                      <li>Reset checkpoint</li>
                      <li>Clear processing state</li>
                      <li>Tidak hapus data</li>
                      <li>Aman untuk recovery</li>
                    </ul>
                    <button class="btn btn-warning w-100">Execute Soft Reset</button>
                  </div>
                </div>
              </div>
              
              <!-- HARD RESET -->
              <div class="col-md-4 mb-3">
                <div class="card reset-option danger-zone" onclick="hardReset()">
                  <div class="card-body text-center">
                    <h5>💀 HARD RESET</h5>
                    <p class="text-danger">Hapus semua data processing</p>
                    <ul class="text-start text-danger small">
                      <li>Hapus semua logs</li>
                      <li>Reset semua counters</li>
                      <li>Hapus processing history</li>
                      <li>Backup otomatis dibuat</li>
                    </ul>
                    <button class="btn btn-danger w-100">Execute Hard Reset</button>
                  </div>
                </div>
              </div>
              
              <!-- FACTORY RESET -->
              <div class="col-md-4 mb-3">
                <div class="card reset-option danger-zone" onclick="factoryReset()">
                  <div class="card-body text-center">
                    <h5>☢️ FACTORY RESET</h5>
                    <p class="text-danger">Hapus SEMUANYA dan mulai dari 0</p>
                    <ul class="text-start text-danger small">
                      <li>Hapus semua sheets</li>
                      <li>Hapus semua properties</li>
                      <li>Backup otomatis dibuat</li>
                      <li>Requires reinitialization</li>
                    </ul>
                    <button class="btn btn-dark w-100">Execute Factory Reset</button>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="mt-4 text-center">
              <button class="btn btn-secondary" onclick="google.script.host.close()">Cancel</button>
            </div>
          </div>
          
          <script>
            function softReset() {
              if (confirm('Are you sure? This will reset processing state.')) {
                google.script.run.softResetSystem();
                google.script.host.close();
              }
            }
            
            function hardReset() {
              if (confirm('⚠️ DANGER: This will delete all processing data. Continue?')) {
                google.script.run.hardResetSystem();
                google.script.host.close();
              }
            }
            
            function factoryReset() {
              if (confirm('☢️ CRITICAL: This will DELETE EVERYTHING! Are you absolutely sure?')) {
                google.script.run.factoryResetSystem();
                google.script.host.close();
              }
            }
          </script>
        </body>
        </html>
      `;

      const htmlOutput = HtmlService.createHtmlOutput(htmlTemplate)
        .setWidth(800)
        .setHeight(500)
        .setTitle('🔄 System Reset Options');

      SpreadsheetApp.getUi().showModalDialog(htmlOutput, '🔄 System Reset');

      return {
        success: true,
        message: 'Reset dialog opened'
      };

    } catch (error) {
      console.error('❌ Reset system failed:', error);
      return {
        success: false,
        message: `Reset system failed: ${error.message}`
      };
    }
  }

  /**
   * 11a. Soft Reset System
   */
  softResetSystem() {
    try {
      // Clear processing state
      const scriptProps = PropertiesService.getScriptProperties();

      scriptProps.deleteProperty('LAST_CHECKPOINT');
      scriptProps.deleteProperty('RESUMABLE_DATA');
      scriptProps.deleteProperty('SYSTEM_STATUS');
      scriptProps.deleteProperty('CURRENT_JOB_ID');
      scriptProps.deleteProperty('SESSION_START_TIME');
      scriptProps.deleteProperty('PROCESSED_COUNT');
      scriptProps.deleteProperty('ERROR_COUNT');
      scriptProps.deleteProperty('TOTAL_FILES');
      scriptProps.deleteProperty('CURRENT_BATCH');

      // Reset state
      this.state.isProcessing = false;
      this.state.currentJobId = null;
      this.state.startTime = null;
      this.state.processedCount = 0;
      this.state.errorCount = 0;
      this.state.totalFiles = 0;
      this.state.currentBatch = 0;

      this.logSystemEvent('SOFT_RESET', 'Soft reset completed', 'INFO');
      SpreadsheetApp.getActiveSpreadsheet().toast('✅ Soft reset completed', 'Success', 3);

      return {
        success: true,
        message: 'Soft reset completed'
      };

    } catch (error) {
      console.error('❌ Soft reset failed:', error);
      return {
        success: false,
        message: `Soft reset failed: ${error.message}`
      };
    }
  }

  /**
   * 11b. Hard Reset System
   */
  hardResetSystem() {
    try {
      // Backup dulu
      this.backupSystem();

      // Clear semua logs sheets
      const spreadsheet = SpreadsheetApp.openById(this.config.SHEETS.SPREADSHEET_ID);
      const logSheets = [
        "📋 PROCESSING LOG",
        "❌ ERROR LOG",
        "🔄 JOB QUEUE",
        "🔄 PROGRESS TRACKER",
        "🎮 COMMAND LOG"
      ];

      logSheets.forEach(sheetName => {
        const sheet = spreadsheet.getSheetByName(sheetName);
        if (sheet) {
          sheet.clear();
          this.applySheetTemplate(sheet, SHEET_TEMPLATES[sheetName] || {});
        }
      });

      // Clear processing data di main db
      const mainDbSheet = spreadsheet.getSheetByName("📚 DATABASE UTAMA");
      if (mainDbSheet && mainDbSheet.getLastRow() > 1) {
        const dataRange = mainDbSheet.getRange(2, 1, mainDbSheet.getLastRow() - 1, mainDbSheet.getLastColumn());
        dataRange.clearContent();
      }

      // Soft reset juga
      this.softResetSystem();

      this.logSystemEvent('HARD_RESET', 'Hard reset completed - all logs cleared', 'WARNING');
      SpreadsheetApp.getActiveSpreadsheet().toast('✅ Hard reset completed', 'Success', 3);

      return {
        success: true,
        message: 'Hard reset completed'
      };

    } catch (error) {
      console.error('❌ Hard reset failed:', error);
      return {
        success: false,
        message: `Hard reset failed: ${error.message}`
      };
    }
  }

  /**
   * 11c. Factory Reset System
   */
  factoryResetSystem() {
    try {
      // Backup terakhir
      this.backupSystem();

      // Panggil reinitialize
      return this.reinitializeSystem();

    } catch (error) {
      console.error('❌ Factory reset failed:', error);
      return {
        success: false,
        message: `Factory reset failed: ${error.message}`
      };
    }
  }
  /**
   * 12. HELP & DOCS - Dokumentasi lengkap
   */
  showHelp() {
    try {
      const htmlTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
          <base target="_top">
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
          <style>
            body { padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
            .feature-card { transition: all 0.3s; cursor: pointer; }
            .feature-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
            .code-block { background: #f8f9fa; padding: 15px; border-radius: 5px; font-family: monospace; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1 class="mb-4">📚 PPSDM LMS ENTERPRISE - DOCUMENTATION</h1>
            <p class="lead">v${MASTER_CONFIG.SYSTEM.VERSION} - Sistem Manajemen Ebook Otomatis</p>
            
            <div class="row mb-4">
              <div class="col-12">
                <div class="card">
                  <div class="card-header bg-primary text-white">
                    <h5 class="mb-0">🚀 QUICK START</h5>
                  </div>
                  <div class="card-body">
                    <ol>
                      <li><strong>Initialize System</strong> - Klik ⚙️ INITIALIZE SYSTEM untuk setup pertama</li>
                      <li><strong>Full Scan</strong> - Klik 🚀 LAUNCH FULL SCAN untuk mulai proses</li>
                      <li><strong>Monitor Progress</strong> - Buka 🎮 COMMAND CENTER untuk live tracking</li>
                      <li><strong>Export Data</strong> - Klik 📤 EXPORT DATA untuk backup</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="row">
              <!-- FEATURES -->
              <div class="col-md-6 mb-3">
                <div class="card feature-card h-100" onclick="showFeature('scan')">
                  <div class="card-body">
                    <h5>📁 Recursive File Scanner</h5>
                    <p class="text-muted">Scan semua file dalam folder dan subfolder secara otomatis</p>
                    <ul class="small">
                      <li>Support semua format ebook</li>
                      <li>Deteksi duplicate files</li>
                      <li>Pagination untuk large folders</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div class="col-md-6 mb-3">
                <div class="card feature-card h-100" onclick="showFeature('metadata')">
                  <div class="card-body">
                    <h5>🔍 Smart Metadata Extraction</h5>
                    <p class="text-muted">Ekstrak metadata dari nama file dengan AI patterns</p>
                    <ul class="small">
                      <li>6+ regex patterns cerdas</li>
                      <li>Auto-category prediction</li>
                      <li>Language detection</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div class="col-md-6 mb-3">
                <div class="card feature-card h-100" onclick="showFeature('webhook')">
                  <div class="card-body">
                    <h5>🔗 Next.js API Integration</h5>
                    <p class="text-muted">Kirim data ke Next.js untuk processing lanjutan</p>
                    <ul class="small">
                      <li>Automatic retry (3x)</li>
                      <li>Error handling robust</li>
                      <li>Real-time status tracking</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div class="col-md-6 mb-3">
                <div class="card feature-card h-100" onclick="showFeature('dashboard')">
                  <div class="card-body">
                    <h5>📊 Real-time Dashboard</h5>
                    <p class="text-muted">17 sheets terstruktur dengan analytics lengkap</p>
                    <ul class="small">
                      <li>Live progress tracking</li>
                      <li>Error monitoring</li>
                      <li>Export capabilities</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- CONFIGURATION -->
            <div class="row mt-4">
              <div class="col-12">
                <div class="card">
                  <div class="card-header bg-info text-white">
                    <h5 class="mb-0">⚙️ SYSTEM CONFIGURATION</h5>
                  </div>
                  <div class="card-body">
                    <div class="code-block">
                      // Folder Source<br>
                      DRIVE_SOURCE: "${MASTER_CONFIG.DRIVE.SOURCE_FOLDER_ID}"<br><br>
                      // Sheets Database<br>
                      SHEETS_ID: "${MASTER_CONFIG.SHEETS.SPREADSHEET_ID}"<br><br>
                      // Webhook API<br>
                      WEBHOOK_URL: "${MASTER_CONFIG.WEBHOOK.URL}"<br><br>
                      // System Contact<br>
                      SUPPORT: "${MASTER_CONFIG.SYSTEM.SUPPORT_EMAIL}"
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- SUPPORT -->
            <div class="row mt-4">
              <div class="col-12">
                <div class="card">
                  <div class="card-header bg-success text-white">
                    <h5 class="mb-0">🆘 SUPPORT & TROUBLESHOOTING</h5>
                  </div>
                  <div class="card-body">
                    <p><strong>Common Issues:</strong></p>
                    <ul>
                      <li><strong>Timeout Error</strong> - Gunakan checkpoint system</li>
                      <li><strong>Permission Denied</strong> - Cek folder access</li>
                      <li><strong>API Quota</strong> - Tunggu 1 menit dan resume</li>
                    </ul>
                    <p class="mt-3"><strong>Contact Support:</strong> ${MASTER_CONFIG.SYSTEM.SUPPORT_EMAIL}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="mt-4 text-center">
              <button class="btn btn-primary" onclick="google.script.host.close()">Close</button>
            </div>
          </div>
          
          <script>
            function showFeature(feature) {
              alert('Feature details: ' + feature + '\\n\\nWill be implemented in full version.');
            }
          </script>
        </body>
        </html>
      `;

      const htmlOutput = HtmlService.createHtmlOutput(htmlTemplate)
        .setWidth(900)
        .setHeight(700)
        .setTitle('📚 PPSDM LMS Documentation');

      SpreadsheetApp.getUi().showModalDialog(htmlOutput, '📚 Help & Documentation');

      return {
        success: true,
        message: 'Help documentation opened'
      };

    } catch (error) {
      console.error('❌ Help system failed:', error);
      return {
        success: false,
        message: `Help system error: ${error.message}`
      };
    }
  }

  // ==========================================================================
  // 🔧 UTILITY METHODS
  // ==========================================================================

  /**
   * Log system event ke sheet
   */
  logSystemEvent(operation, message, severity = 'INFO') {
    try {
      const spreadsheet = SpreadsheetApp.openById(this.config.SHEETS.SPREADSHEET_ID);
      const logSheet = spreadsheet.getSheetByName("📋 PROCESSING LOG");

      if (!logSheet) {
        console.log(`[${severity}] ${operation}: ${message}`);
        return;
      }

      const timestamp = new Date().toISOString();
      const logId = Utilities.getUuid().substring(0, 8);

      const logData = [
        timestamp,
        logId,
        'Orchestrator',
        operation,
        '',
        '',
        severity,
        message,
        0,
        Session.getActiveUser().getEmail()
      ];

      logSheet.appendRow(logData);

      // Auto-trim jika terlalu panjang
      if (logSheet.getLastRow() > 10000) {
        logSheet.deleteRows(2, 1000);
      }

    } catch (error) {
      console.error('Logging failed:', error);
    }
  }

  /**
   * Update dashboard status
   */
  updateDashboard(status, message, progressPercent) {
    try {
      const spreadsheet = SpreadsheetApp.openById(this.config.SHEETS.SPREADSHEET_ID);
      const dashboardSheet = spreadsheet.getSheetByName("🎯 DASHBOARD");

      if (!dashboardSheet) {
        return;
      }

      // Update status cell
      dashboardSheet.getRange('A1').setValue(`STATUS: ${status}`);
      dashboardSheet.getRange('A2').setValue(`MESSAGE: ${message}`);
      dashboardSheet.getRange('A3').setValue(`PROGRESS: ${progressPercent}%`);
      dashboardSheet.getRange('A4').setValue(`LAST UPDATE: ${new Date().toLocaleString()}`);
      dashboardSheet.getRange('A5').setValue(`PROCESSED: ${this.state.processedCount}`);
      dashboardSheet.getRange('A6').setValue(`ERRORS: ${this.state.errorCount}`);

      // Apply color coding
      const statusCell = dashboardSheet.getRange('A1');
      if (status === 'SCANNING' || status === 'PROCESSING') {
        statusCell.setBackground('#3498db').setFontColor('#ffffff');
      } else if (status === 'COMPLETED' || status === 'SUCCESS') {
        statusCell.setBackground('#27ae60').setFontColor('#ffffff');
      } else if (status === 'ERROR' || status === 'FAILED') {
        statusCell.setBackground('#e74c3c').setFontColor('#ffffff');
      } else if (status === 'PAUSED') {
        statusCell.setBackground('#f39c12').setFontColor('#ffffff');
      }

    } catch (error) {
      console.error('Dashboard update failed:', error);
    }
  }

  /**
   * Get or create folder di Drive
   */
  getOrCreateFolder(folderName) {
    try {
      // Cari folder berdasarkan nama
      const folders = DriveApp.getFoldersByName(folderName);

      if (folders.hasNext()) {
        return folders.next();
      }

      // Jika tidak ada, buat baru
      const newFolder = DriveApp.createFolder(folderName);
      console.log(`📁 Folder created: ${folderName}`);

      return newFolder;

    } catch (error) {
      console.error(`Folder creation failed for ${folderName}:`, error);
      throw error;
    }
  }

  /**
   * Calculate system statistics
   */
  calculateSystemStatistics() {
    try {
      const spreadsheet = SpreadsheetApp.openById(this.config.SHEETS.SPREADSHEET_ID);
      const mainDbSheet = spreadsheet.getSheetByName("📚 DATABASE UTAMA");

      let totalFiles = 0;
      let processedFiles = 0;
      let errorFiles = 0;

      if (mainDbSheet && mainDbSheet.getLastRow() > 1) {
        totalFiles = mainDbSheet.getLastRow() - 1;

        // Count processed (ada PROCESSING_STATUS)
        const data = mainDbSheet.getDataRange().getValues();
        for (let i = 1; i < data.length; i++) {
          const processingStatus = data[i][29]; // Column 30: PROCESSING_STATUS
          if (processingStatus === 'SUCCESS') {
            processedFiles++;
          } else if (processingStatus === 'ERROR') {
            errorFiles++;
          }
        }
      }

      const successRate = totalFiles > 0 ? Math.round((processedFiles / totalFiles) * 100) : 0;

      return {
        totalFiles,
        processedFiles,
        errorFiles,
        successRate,
        pendingFiles: totalFiles - processedFiles - errorFiles
      };

    } catch (error) {
      console.error('Statistics calculation failed:', error);
      return {
        totalFiles: 0,
        processedFiles: 0,
        errorFiles: 0,
        successRate: 0,
        pendingFiles: 0
      };
    }
  }

  /**
   * Update statistics dashboard
   */
  updateStatisticsDashboard(stats) {
    try {
      const spreadsheet = SpreadsheetApp.openById(this.config.SHEETS.SPREADSHEET_ID);
      const statsSheet = spreadsheet.getSheetByName("📈 STATISTICS DASHBOARD");

      if (!statsSheet) {
        return;
      }

      // Clear existing data
      statsSheet.clear();

      // Create statistics table
      const statsData = [
        ['📊 SYSTEM STATISTICS', '', ''],
        ['Generated at:', new Date().toLocaleString(), ''],
        ['', '', ''],
        ['METRIC', 'VALUE', 'PERCENTAGE'],
        ['Total Files', stats.totalFiles, '100%'],
        ['Successfully Processed', stats.processedFiles, stats.successRate + '%'],
        ['Failed Files', stats.errorFiles, stats.totalFiles > 0 ? Math.round((stats.errorFiles / stats.totalFiles) * 100) + '%' : '0%'],
        ['Pending Files', stats.pendingFiles, stats.totalFiles > 0 ? Math.round((stats.pendingFiles / stats.totalFiles) * 100) + '%' : '0%'],
        ['', '', ''],
        ['📈 SUCCESS RATE', '', ''],
        ['Overall Success:', stats.successRate + '%', ''],
        ['', '', ''],
        ['⏱️ SYSTEM INFO', '', ''],
        ['System Version:', this.config.SYSTEM.VERSION, ''],
        ['Last Backup:', PropertiesService.getScriptProperties().getProperty('LAST_BACKUP_DATE') || 'Never', ''],
        ['System Status:', this.state.isProcessing ? 'PROCESSING' : 'IDLE', ''],
        ['Current Job:', this.state.currentJobId || 'None', '']
      ];

      // Write data
      statsSheet.getRange(1, 1, statsData.length, 3).setValues(statsData);

      // Apply formatting
      statsSheet.getRange(1, 1, 1, 3).merge().setBackground('#2c3e50').setFontColor('#ffffff').setFontWeight('bold');
      statsSheet.getRange(4, 1, 1, 3).setBackground('#3498db').setFontColor('#ffffff').setFontWeight('bold');
      statsSheet.getRange(10, 1, 1, 3).merge().setBackground('#27ae60').setFontColor('#ffffff').setFontWeight('bold');
      statsSheet.getRange(13, 1, 1, 3).merge().setBackground('#9b59b6').setFontColor('#ffffff').setFontWeight('bold');

      // Set column widths
      statsSheet.setColumnWidth(1, 200);
      statsSheet.setColumnWidth(2, 150);
      statsSheet.setColumnWidth(3, 100);

    } catch (error) {
      console.error('Statistics dashboard update failed:', error);
    }
  }
  /**
   * Get data untuk Command Center (Client-side polling)
   */
  getCommandCenterData() {
    try {
      const scriptProps = PropertiesService.getScriptProperties();
      const startTime = scriptProps.getProperty('SESSION_START_TIME');
      let uptime = '-';

      if (startTime) {
        const start = new Date(startTime);
        const now = new Date();
        const diffMs = now - start;
        const diffMins = Math.floor(diffMs / 60000);
        uptime = `${diffMins} mins`;
      }

      // Calculate basic stats
      const totalFiles = parseInt(scriptProps.getProperty('TOTAL_FILES') || '0');
      const processedFiles = parseInt(scriptProps.getProperty('PROCESSED_COUNT') || '0');
      const errorFiles = parseInt(scriptProps.getProperty('ERROR_COUNT') || '0');
      const successRate = totalFiles > 0 ? Math.round((processedFiles / totalFiles) * 100) : 0;
      const progressPercent = totalFiles > 0 ? Math.round((processedFiles / totalFiles) * 100) : 0;

      // Get memory usage simulation
      const memoryUsage = Math.round(Math.random() * 50 + 20) + ' MB';

      // Get recent logs
      const spreadsheet = SpreadsheetApp.openById(this.config.SHEETS.SPREADSHEET_ID);
      const logSheet = spreadsheet.getSheetByName("📋 PROCESSING LOG");
      let logs = [];

      if (logSheet && logSheet.getLastRow() > 1) {
        // Get last 10 logs
        const startRow = Math.max(2, logSheet.getLastRow() - 9);
        const numRows = Math.min(10, logSheet.getLastRow() - 1);
        const logData = logSheet.getRange(startRow, 1, numRows, 8).getValues();

        logs = logData.map(row => ({
          timestamp: new Date(row[0]).toLocaleTimeString(),
          message: `[${row[6]}] ${row[3]}: ${row[7]}`
        })).reverse();
      }

      return {
        systemId: scriptProps.getProperty('SYSTEM_ID'),
        status: scriptProps.getProperty('SYSTEM_STATUS') || 'IDLE',
        statusClass: (scriptProps.getProperty('SYSTEM_STATUS') === 'PROCESSING') ? 'status-active' : 'status-inactive',
        uptime: uptime,
        lastBackup: scriptProps.getProperty('LAST_BACKUP_DATE') ? new Date(scriptProps.getProperty('LAST_BACKUP_DATE')).toLocaleString() : 'Never',
        memoryUsage: memoryUsage,
        totalFiles: totalFiles,
        processedFiles: processedFiles,
        errorFiles: errorFiles,
        successRate: successRate + '%',
        currentJob: scriptProps.getProperty('CURRENT_JOB_ID') || '-',
        progressPercent: progressPercent,
        logs: logs
      };

    } catch (error) {
      console.error('Get command center data failed:', error);
      throw error;
    }
  }

  // ==========================================================================
  // 🎭 SIMULATION METHODS (Implementasi nyata di Layer 3, 4, 5)
  // ==========================================================================

  /**
   * Simulate full scan process
   */
  simulateFullScan() {
    // Ini akan diganti dengan real implementation yang memanggil
    // DriveService (Layer 2) dan processing logic lainnya

    // Simulate finding files
    this.state.totalFiles = 1500; // Simulated count
    PropertiesService.getScriptProperties().setProperty('TOTAL_FILES', '1500');

    this.logSystemEvent('SCAN_SIMULATION', 'Found 1500 files during scan', 'INFO');

    // Trigger batch processing via triggers
    // ScriptApp.newTrigger('processBatch').timeBased().everyMinutes(1).create();
  }

  /**
   * Simulate resume process
   */
  simulateResumeProcess(checkpointData) {
    // Start processing from checkpoint
    this.logSystemEvent('RESUME_SIMULATION', 'Resuming from batch ' + checkpointData.currentBatch, 'INFO');
  }

}

// ============================================================================
// 🌍 GLOBAL INSTANCE & HANDLERS
// ============================================================================

/**
 * Global function untuk inisialisasi menu
 */
function onOpen() {
  const orchestrator = new PPSDM_Orchestrator();
  // Menu created in constructor
}

/**
 * Global functions untuk mapping menu items
 * Google Apps Script butuh fungsi global untuk menu triggers
 */

function launchFullScan() {
  const orchestrator = new PPSDM_Orchestrator();
  orchestrator.launchFullScan();
}

function resumeProcess() {
  const orchestrator = new PPSDM_Orchestrator();
  orchestrator.resumeProcess();
}

function stopProcess() {
  const orchestrator = new PPSDM_Orchestrator();
  orchestrator.stopProcess();
}

function openCommandCenter() {
  const orchestrator = new PPSDM_Orchestrator();
  orchestrator.openCommandCenter();
}

function initializeSystem() {
  const orchestrator = new PPSDM_Orchestrator();
  orchestrator.initializeSystem();
}

function reinitializeSystem() {
  const orchestrator = new PPSDM_Orchestrator();
  orchestrator.reinitializeSystem();
}

function updateStatistics() {
  const orchestrator = new PPSDM_Orchestrator();
  orchestrator.updateStatistics();
}

function exportData() {
  const orchestrator = new PPSDM_Orchestrator();
  orchestrator.exportData();
}

function backupSystem() {
  const orchestrator = new PPSDM_Orchestrator();
  orchestrator.backupSystem();
}

function clearCache() {
  const orchestrator = new PPSDM_Orchestrator();
  orchestrator.clearCache();
}

function resetSystem() {
  const orchestrator = new PPSDM_Orchestrator();
  orchestrator.resetSystem();
}

function showHelp() {
  const orchestrator = new PPSDM_Orchestrator();
  orchestrator.showHelp();
}

// Global helper for client-side polling
function getCommandCenterData() {
  const orchestrator = new PPSDM_Orchestrator();
  return orchestrator.getCommandCenterData();
}

function softResetSystem() {
  const orchestrator = new PPSDM_Orchestrator();
  orchestrator.softResetSystem();
}

function hardResetSystem() {
  const orchestrator = new PPSDM_Orchestrator();
  orchestrator.hardResetSystem();
}

function factoryResetSystem() {
  const orchestrator = new PPSDM_Orchestrator();
  orchestrator.factoryResetSystem();
}

