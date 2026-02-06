# PPSDM KMITS - Database Setup Script (Final Version)
# ====================================================

Write-Host "===============================================================" -ForegroundColor Cyan
Write-Host "  PPSDM KMITS - DATABASE SETUP" -ForegroundColor Cyan
Write-Host "===============================================================" -ForegroundColor Cyan

# Konfigurasi
$ProjectRef = "xncugiuvaetzjxuyfsko"
$SupabaseUrl = "https://$ProjectRef.supabase.co"
$SqlFile = "supabase/setup_complete_database.sql"
$QuickSqlFile = "QUICK_SETUP_SQL.sql"

# Step 1: Cek File SQL
Write-Host "`n[STEP 1] Mengecek File SQL..." -ForegroundColor Yellow

if (-not (Test-Path $SqlFile)) {
    Write-Host "  ERROR: File SQL tidak ditemukan: $SqlFile" -ForegroundColor Red
    exit 1
}

$sqlContent = Get-Content $SqlFile -Raw
$sqlLength = $sqlContent.Length
Write-Host "  OK: File SQL ditemukan ($sqlLength karakter)" -ForegroundColor Green

# Copy ke file yang mudah diakses
Copy-Item $SqlFile $QuickSqlFile -Force
Write-Host "  OK: File dicopy ke $QuickSqlFile" -ForegroundColor Green

# Step 2: Cek Environment
Write-Host "`n[STEP 2] Mengecek Environment Variables..." -ForegroundColor Yellow

$envFile = ".env.local"
if (Test-Path $envFile) {
    Write-Host "  OK: File .env.local ditemukan" -ForegroundColor Green
} else {
    Write-Host "  WARNING: File .env.local tidak ditemukan" -ForegroundColor Yellow
}

# Step 3: Buka Browser
Write-Host "`n[STEP 3] Membuka Supabase SQL Editor..." -ForegroundColor Yellow

$dashboardUrl = "https://app.supabase.com/project/$ProjectRef/sql"
try {
    Start-Process $dashboardUrl
    Write-Host "  OK: Browser dibuka ke $dashboardUrl" -ForegroundColor Green
} catch {
    Write-Host "  WARNING: Tidak bisa membuka browser otomatis" -ForegroundColor Yellow
    Write-Host "         Buka manual: $dashboardUrl" -ForegroundColor White
}

# Step 4: Instruksi Setup
Write-Host "`n===============================================================" -ForegroundColor Cyan
Write-Host "  INSTRUKSI SETUP MANUAL" -ForegroundColor Cyan
Write-Host "===============================================================" -ForegroundColor Cyan

Write-Host @"

LANGKAH 1: Buka SQL Editor
  - Browser sudah terbuka (atau buka manual link di atas)
  - Klik "SQL Editor" di sidebar kiri
  - Klik "New query" atau tombol "+"

LANGKAH 2: Copy SQL
  - Buka file: $QuickSqlFile
  - Tekan Ctrl+A untuk select all
  - Tekan Ctrl+C untuk copy

LANGKAH 3: Paste ke SQL Editor
  - Kembali ke browser (Supabase SQL Editor)
  - Tekan Ctrl+V di text editor
  - Tunggu sebentar (file: $sqlLength karakter)

LANGKAH 4: Execute
  - Klik tombol "Run" (▶️) di atas editor
  - Tunggu sampai selesai (10-30 detik)
  - Akan muncul "Success" jika berhasil

LANGKAH 5: Verifikasi
  - Jalankan: python scripts/check_and_setup_database.py

"@ -ForegroundColor White

# Step 5: Tanya user
$response = Read-Host "Apakah Anda ingin melihat isi file SQL sekarang (y/n)"
if ($response -eq "y" -or $response -eq "Y") {
    Write-Host "`n--- 10 BARIS PERTAMA FILE SQL ---`n" -ForegroundColor Cyan
    Get-Content $QuickSqlFile -TotalCount 10
    Write-Host "`n... (file terlalu panjang, buka di VS Code untuk lengkapnya) ...`n" -ForegroundColor Gray
}

Write-Host "===============================================================" -ForegroundColor Cyan
Write-Host "  SETUP SELESAI" -ForegroundColor Cyan
Write-Host "===============================================================" -ForegroundColor Cyan
Write-Host "File SQL tersedia di: $(Resolve-Path $QuickSqlFile)" -ForegroundColor Green
Write-Host "`nSetelah menjalankan SQL di Supabase Dashboard," -ForegroundColor White
Write-Host "verifikasi dengan menjalankan:" -ForegroundColor White
Write-Host "  python scripts/check_and_setup_database.py" -ForegroundColor Yellow

Read-Host "`nTekan Enter untuk keluar"
