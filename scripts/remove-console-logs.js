#!/usr/bin/env node

/**
 * Script to remove console.log statements from TypeScript/JavaScript files
 * Usage: node scripts/remove-console-logs.js
 * 
 * This script:
 * 1. Scans all .ts, .tsx, .js, .jsx files in src/
 * 2. Removes console.log, console.warn, console.error, console.info statements
 * 3. Preserves console.log in .test.ts files (tests)
 * 4. Creates backups of modified files
 */

const fs = require('fs');
const path = require('path');

// Patterns to match console statements
const consolePatterns = [
  /console\.log\([^)]*\);?\s*\n?/g,
  /console\.warn\([^)]*\);?\s*\n?/g,
  /console\.error\([^)]*\);?\s*\n?/g,
  /console\.info\([^)]*\);?\s*\n?/g,
  /console\.debug\([^)]*\);?\s*\n?/g,
  /console\.trace\([^)]*\);?\s*\n?/g,
];

// Directories to skip
const skipDirs = ['node_modules', '.next', 'dist', 'build', 'coverage', 'public'];

// Extensions to process
const validExtensions = ['.ts', '.tsx', '.js', '.jsx'];

let totalFiles = 0;
let modifiedFiles = 0;
let removedStatements = 0;

function shouldProcessFile(filePath) {
  const ext = path.extname(filePath);
  const basename = path.basename(filePath);
  
  // Skip test files
  if (basename.includes('.test.') || basename.includes('.spec.')) {
    return false;
  }
  
  // Skip non-valid extensions
  if (!validExtensions.includes(ext)) {
    return false;
  }
  
  // Skip files in skip directories
  const parts = filePath.split(path.sep);
  if (parts.some(part => skipDirs.includes(part))) {
    return false;
  }
  
  return true;
}

function removeConsoleLogs(content) {
  let modified = content;
  let count = 0;
  
  consolePatterns.forEach(pattern => {
    const matches = modified.match(pattern);
    if (matches) {
      count += matches.length;
      modified = modified.replace(pattern, '');
    }
  });
  
  return { modified, count };
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const { modified, count } = removeConsoleLogs(content);
    
    if (count > 0) {
      // Create backup
      const backupPath = filePath + '.backup';
      fs.writeFileSync(backupPath, content);
      
      // Write modified content
      fs.writeFileSync(filePath, modified);
      
      modifiedFiles++;
      removedStatements += count;
      console.log(`✓ ${filePath} (${count} statements removed)`);
    }
    
    totalFiles++;
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip certain directories
      if (!skipDirs.includes(file)) {
        walkDir(filePath);
      }
    } else if (shouldProcessFile(filePath)) {
      processFile(filePath);
    }
  });
}

// Main execution
console.log('🧹 Removing console.log statements...\n');

const srcDir = path.join(__dirname, '..', 'src');
if (fs.existsSync(srcDir)) {
  walkDir(srcDir);
  
  console.log('\n📊 Summary:');
  console.log(`   Total files scanned: ${totalFiles}`);
  console.log(`   Files modified: ${modifiedFiles}`);
  console.log(`   Console statements removed: ${removedStatements}`);
  console.log(`\n✅ Done! Backups created with .backup extension`);
  console.log('   To restore: rename .backup files to original names');
} else {
  console.error('❌ src directory not found');
  process.exit(1);
}
