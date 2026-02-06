#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Infinity Loop Architecture - Quick Start Script
    
.DESCRIPTION
    Easy launcher for infinity loop with safety checks
#>

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Magenta
Write-Host "║   🤖 INFINITY LOOP ARCHITECTURE - Quick Start Launcher 🤖     ║" -ForegroundColor Magenta
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Magenta
Write-Host ""

# Safety Checks
Write-Host "🔍 Running safety checks..." -ForegroundColor Cyan

# Check API Key
if (-not $env:NVIDIA_API_KEY) {
    Write-Host "❌ NVIDIA_API_KEY not set!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Set it with:" -ForegroundColor Yellow
    Write-Host '  $env:NVIDIA_API_KEY = "sk-your-key-here"' -ForegroundColor Green
    Write-Host ""
    exit 1
}
Write-Host "✅ API Key detected" -ForegroundColor Green

# Check Python
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python found: $pythonVersion" -ForegroundColor Green
}
catch {
    Write-Host "❌ Python not found" -ForegroundColor Red
    exit 1
}

# Check Git
try {
    $gitVersion = git --version 2>&1
    Write-Host "✅ Git found: $gitVersion" -ForegroundColor Green
}
catch {
    Write-Host "⚠️  Git not found (backup before running)" -ForegroundColor Yellow
}

# Check Python script exists
if (-not (Test-Path "scripts/infinity_loop.py")) {
    Write-Host "❌ scripts/infinity_loop.py not found" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Infinity Loop script found" -ForegroundColor Green

Write-Host ""
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan

Write-Host ""
Write-Host "SELECT MODE:" -ForegroundColor Yellow
Write-Host "  1. Quick Test (3 iterations) - Safe, see what happens" -ForegroundColor Gray
Write-Host "  2. Session (10 iterations)   - More comprehensive" -ForegroundColor Gray
Write-Host "  3. Extended (50 iterations)  - Deep improvement" -ForegroundColor Gray
Write-Host "  4. Infinite Loop             - Forever, Ctrl+C to stop" -ForegroundColor Gray
Write-Host "  5. Custom Iterations         - You specify count" -ForegroundColor Gray
Write-Host ""

$choice = Read-Host "Enter choice (1-5)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "🚀 Starting QUICK TEST (3 iterations)" -ForegroundColor Green
        Write-Host ""
        python scripts/infinity_loop.py --iterations 3
    }
    "2" {
        Write-Host ""
        Write-Host "🚀 Starting SESSION (10 iterations)" -ForegroundColor Green
        Write-Host ""
        python scripts/infinity_loop.py --iterations 10
    }
    "3" {
        Write-Host ""
        Write-Host "🚀 Starting EXTENDED (50 iterations)" -ForegroundColor Green
        Write-Host ""
        python scripts/infinity_loop.py --iterations 50
    }
    "4" {
        Write-Host ""
        Write-Host "🚀 Starting INFINITE LOOP (Press Ctrl+C to stop)" -ForegroundColor Green
        Write-Host ""
        python scripts/infinity_loop.py
    }
    "5" {
        $iterations = Read-Host "How many iterations?"
        if ($iterations -match '^\d+$') {
            Write-Host ""
            Write-Host "🚀 Starting with $iterations iterations" -ForegroundColor Green
            Write-Host ""
            python scripts/infinity_loop.py --iterations $iterations
        }
        else {
            Write-Host "❌ Invalid input" -ForegroundColor Red
            exit 1
        }
    }
    default {
        Write-Host "❌ Invalid choice" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "✅ Infinity Loop Complete" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Review changes: git diff" -ForegroundColor Cyan
Write-Host "  2. Check logs: Get-ChildItem infinity_loop_logs" -ForegroundColor Cyan
Write-Host "  3. Commit: git add . && git commit -m 'feat: infinity loop improvements'" -ForegroundColor Cyan
Write-Host ""
