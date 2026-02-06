/**
 * PPSDM SWARM BRIDGE
 * Paste this code into Extensions > Apps Script in your Spreadsheet.
 * Triggers the Vercel AI Swarm Webhook for each row.
 */

// CONFIGURATION
const VERCEL_ENDPOINT = "https://your-vercel-app.vercel.app/api/webhooks/process-book"; // Replace with your actual domain later
const AUTH_TOKEN = "Bearer internal-system"; // Must match route.ts check

function processPendingRows() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1"); // Check your sheet name, maybe 'EBOOK MANAGEMENT SYSTEM' based on ID?
  // Let's assume the first sheet is the target
  const targetSheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  
  const data = targetSheet.getDataRange().getValues();
  const headers = data[0];
  
  // Column Mappings (Indices based on your paste)
  // ID=0, FILE_NAME=2, DOWNLOAD_URL=25, TITLE=7, AUTHOR=8, CATEGORY=12, TAGS=14, STATUS=29 (PROCESSING_STATUS)
  
  const COL = {
    ID: headers.indexOf('ID'),
    FILE_NAME: headers.indexOf('FILE_NAME'),
    DOWNLOAD_URL: headers.indexOf('DOWNLOAD_URL'),
    EXTENSION: headers.indexOf('EXTENSION'),
    TITLE: headers.indexOf('TITLE'),
    AUTHOR: headers.indexOf('AUTHOR'),
    CATEGORY: headers.indexOf('CATEGORY'),
    TAGS: headers.indexOf('TAGS'),
    STATUS: headers.indexOf('PROCESSING_STATUS'),
    WEBHOOK_RES: headers.indexOf('WEBHOOK_RESPONSE'),
    ERROR: headers.indexOf('ERROR_MESSAGE')
  };

  // Iterate rows (skip header)
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const status = row[COL.STATUS];
    
    // Process only PENDING or ERROR rows (optional)
    if (status === 'PENDING' || status === 'ERROR' || status === '') {
      
      const payload = {
        job_id: row[COL.ID],
        file: {
          name: row[COL.FILE_NAME],
          download_url: row[COL.DOWNLOAD_URL],
          extension: row[COL.EXTENSION] || 'pdf'
        },
        metadata: {
          title: row[COL.TITLE],
          author: row[COL.AUTHOR] || 'Unknown',
          category: row[COL.CATEGORY] || 'General',
          tags: row[COL.TAGS] ? row[COL.TAGS].toString().split(',') : []
        }
      };

      try {
        // Call Vercel Swarm Webhook
        const options = {
          'method' : 'post',
          'contentType': 'application/json',
          'headers': { 'Authorization': AUTH_TOKEN },
          'payload' : JSON.stringify(payload),
          'muteHttpExceptions': true
        };
        
        const response = UrlFetchApp.fetch(VERCEL_ENDPOINT, options);
        const resCode = response.getResponseCode();
        const resText = response.getContentText();
        
        if (resCode === 200) {
          // Success
          targetSheet.getRange(i + 1, COL.STATUS + 1).setValue('PROCESSING');
          targetSheet.getRange(i + 1, COL.WEBHOOK_RES + 1).setValue(resText);
          targetSheet.getRange(i + 1, COL.ERROR + 1).setValue('');
          Logger.log(`[Success] Triggered for ${row[COL.FILE_NAME]}`);
        } else {
          // Failure
          targetSheet.getRange(i + 1, COL.STATUS + 1).setValue('ERROR');
          targetSheet.getRange(i + 1, COL.ERROR + 1).setValue(`HTTP ${resCode}: ${resText}`);
          Logger.log(`[Error] Failed for ${row[COL.FILE_NAME]}: ${resText}`);
        }
        
      } catch (e) {
        targetSheet.getRange(i + 1, COL.STATUS + 1).setValue('ERROR');
        targetSheet.getRange(i + 1, COL.ERROR + 1).setValue(e.toString());
        Logger.log(`[Exception] ${e.toString()}`);
      }
      
      // Rate limit safety (Google Script Limit)
      Utilities.sleep(1000); 
    }
  }
}
