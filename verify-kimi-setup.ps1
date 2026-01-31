#!/usr/bin/env pwsh
<#
.SYNOPSIS
    KIMI K2.5 Automation System - Installation Verification
    
.DESCRIPTION
    Verifies all components are properly installed and configured
    
.EXAMPLE
    .\verify-kimi-setup.ps1
#>

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Magenta
Write-Host "║   🤖 KIMI K2.5 Automation System - Installation Verification  ║" -ForegroundColor Magenta
Write-Host "╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Magenta
Write-Host ""

$allGood = $true

# Check Python
Write-Host "✓ Checking Python..." -ForegroundColor Cyan
try {
    $pythonVersion = python --version 2>&1
    Write-Host "  ✅ $pythonVersion found" -ForegroundColor Green
}
catch {
    Write-Host "  ❌ Python not found - please install Python 3.9+" -ForegroundColor Red
    $allGood = $false
}

# Check requests library
Write-Host ""
Write-Host "✓ Checking requests library..." -ForegroundColor Cyan
try {
    python -c "import requests; print(f'Version: {requests.__version__}')" 2>&1 | ForEach-Object {
        Write-Host "  ✅ requests library found - $_" -ForegroundColor Green
    }
}
catch {
    Write-Host "  ⚠️  requests library not found - installing..." -ForegroundColor Yellow
    pip install requests --quiet
    Write-Host "  ✅ requests installed" -ForegroundColor Green
}

# Check API Key
Write-Host ""
Write-Host "✓ Checking NVIDIA API Key..." -ForegroundColor Cyan
if ($env:NVIDIA_API_KEY) {
    $keyPreview = $env:NVIDIA_API_KEY.Substring(0, [Math]::Min(15, $env:NVIDIA_API_KEY.Length)) + "..."
    Write-Host "  ✅ API Key found: $keyPreview" -ForegroundColor Green
}
else {
    Write-Host "  ⚠️  API Key not set in environment" -ForegroundColor Yellow
    Write-Host "  Set it with: `$env:NVIDIA_API_KEY = 'your-key'" -ForegroundColor Yellow
}

# Check Scripts
Write-Host ""
Write-Host "✓ Checking Scripts..." -ForegroundColor Cyan
$scripts = @(
    "scripts/start-kimi.ps1",
    "scripts/kimi-automation.py",
    "scripts/monitor-kimi.ps1"
)
$scripts | ForEach-Object {
    if (Test-Path $_) {
        Write-Host "  ✅ $_ found" -ForegroundColor Green
    }
    else {
        Write-Host "  ❌ $_ NOT FOUND" -ForegroundColor Red
        $allGood = $false
    }
}

# Check Documentation
Write-Host ""
Write-Host "✓ Checking Documentation..." -ForegroundColor Cyan
$docs = @(
    "KIMI_README.md",
    "KIMI_QUICKSTART.md",
    "KIMI_AUTOMATION_STRATEGY.md",
    "KIMI_WORKFLOW_PROMPTS.md",
    "KIMI_AUTOMATION_INDEX.md",
    "KIMI_SYSTEM_READY.md"
)
$docs | ForEach-Object {
    if (Test-Path $_) {
        Write-Host "  ✅ $_ found" -ForegroundColor Green
    }
    else {
        Write-Host "  ❌ $_ NOT FOUND" -ForegroundColor Red
        $allGood = $false
    }
}

# Check Logs Directory
Write-Host ""
Write-Host "✓ Checking Logs Directory..." -ForegroundColor Cyan
if (-not (Test-Path "kimi_automation_logs")) {
    New-Item -ItemType Directory -Name "kimi_automation_logs" -Force | Out-Null
    Write-Host "  ✅ kimi_automation_logs directory created" -ForegroundColor Green
}
else {
    Write-Host "  ✅ kimi_automation_logs directory exists" -ForegroundColor Green
}

# Summary
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan

if ($allGood) {
    Write-Host ""
    Write-Host "🎉 ALL SYSTEMS GO! Setup verified successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Set API key: `$env:NVIDIA_API_KEY = 'your-key'" -ForegroundColor Cyan
    Write-Host "2. Read: KIMI_README.md" -ForegroundColor Cyan
    Write-Host "3. Run: .\scripts\start-kimi.ps1 -analysis" -ForegroundColor Cyan
    Write-Host ""
}
else {
    Write-Host ""
    Write-Host "⚠️  Some components need attention - see above" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Documentation:" -ForegroundColor Yellow
Write-Host "  • Quick Start: KIMI_README.md (5 min read)" -ForegroundColor Cyan
Write-Host "  • Detailed Setup: KIMI_QUICKSTART.md (10 min read)" -ForegroundColor Cyan
Write-Host "  • Full Index: KIMI_AUTOMATION_INDEX.md" -ForegroundColor Cyan
Write-Host ""
