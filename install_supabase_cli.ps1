# Install Supabase CLI
Write-Host "Installing Supabase CLI..." -ForegroundColor Green

# Download the latest release
$zipUrl = "https://github.com/supabase/cli/releases/latest/download/supabase_windows_amd64.zip"
$zipPath = "$PSScriptRoot\supabase.zip"
$extractPath = "$PSScriptRoot\supabase_temp"

Write-Host "Downloading Supabase CLI..." -ForegroundColor Yellow
Invoke-WebRequest -Uri $zipUrl -OutFile $zipPath

Write-Host "Extracting..." -ForegroundColor Yellow
Expand-Archive -Path $zipPath -DestinationPath $extractPath -Force

Write-Host "Installing to System32..." -ForegroundColor Yellow
# Try to copy to a local bin directory first
$localBin = "$PSScriptRoot\bin"
if (!(Test-Path $localBin)) {
    New-Item -ItemType Directory -Path $localBin -Force
}
Copy-Item "$extractPath\supabase.exe" "$localBin\supabase.exe" -Force

# Add to PATH for this session
$env:PATH = "$localBin;$env:PATH"

Write-Host "Testing installation..." -ForegroundColor Yellow
& "$localBin\supabase.exe" --version

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Supabase CLI installed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Installation failed" -ForegroundColor Red
}

# Cleanup
Remove-Item $zipPath -Force -ErrorAction SilentlyContinue
Remove-Item $extractPath -Recurse -Force -ErrorAction SilentlyContinue
