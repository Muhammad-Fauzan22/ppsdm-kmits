#!/usr/bin/env pwsh
<#
.SYNOPSIS
    KIMI Automation Monitoring Dashboard
    
.DESCRIPTION
    Real-time monitoring and analysis of KIMI automation results
    
.EXAMPLE
    .\scripts\monitor-kimi.ps1
    .\scripts\monitor-kimi.ps1 -watch
    .\scripts\monitor-kimi.ps1 -export
#>

param(
    [switch]$watch,
    [switch]$export,
    [int]$refreshInterval = 5
)

# Colors
$header = "Cyan"
$success = "Green"
$warning = "Yellow"
$error = "Red"
$info = "Blue"

function Show-Banner {
    Write-Host ""
    Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Magenta
    Write-Host "║     🤖 KIMI K2.5 Automation Monitoring Dashboard 🤖      ║" -ForegroundColor Magenta
    Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Magenta
    Write-Host ""
}

function Get-LogDirectory {
    $logDir = "kimi_automation_logs"
    if (-not (Test-Path $logDir)) {
        Write-Host "⚠️  No logs directory found. Run .\scripts\start-kimi.ps1 first" -ForegroundColor $warning
        return $null
    }
    return $logDir
}

function Get-LogFiles {
    param([string]$logDir)
    
    if (-not $logDir) { return $null }
    
    $files = Get-ChildItem $logDir -Filter "*.json" -ErrorAction SilentlyContinue
    return $files | Sort-Object -Descending -Property LastWriteTime
}

function Parse-LogFile {
    param([string]$filePath)
    
    try {
        $content = Get-Content $filePath -Raw | ConvertFrom-Json
        return $content
    }
    catch {
        return $null
    }
}

function Show-SessionSummary {
    param([string]$logDir)
    
    Write-Host "📊 SESSION SUMMARY" -ForegroundColor $header
    Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor $header
    
    $files = Get-LogFiles -logDir $logDir
    
    if (-not $files) {
        Write-Host "No logs found yet" -ForegroundColor $warning
        return
    }
    
    # Count iterations
    $totalLogs = @($files).Count
    Write-Host "Total Logs: $totalLogs" -ForegroundColor $info
    
    # Latest run
    $latest = $files | Select-Object -First 1
    $latestData = Parse-LogFile -filePath $latest.FullName
    
    if ($latestData) {
        Write-Host "Latest Run: $($latest.LastWriteTime.ToString('yyyy-MM-dd HH:mm:ss'))" -ForegroundColor $info
        Write-Host "Latest Iteration: $($latestData.iteration)" -ForegroundColor $info
        Write-Host ""
    }
    
    # Statistics
    $totalSize = ($files | Measure-Object -Property Length -Sum).Sum / 1KB
    Write-Host "Total Log Size: $([math]::Round($totalSize, 2)) KB" -ForegroundColor $info
    
    # Oldest and newest
    $oldest = $files | Sort-Object -Property LastWriteTime | Select-Object -First 1
    $newest = $files | Sort-Object -Property LastWriteTime -Descending | Select-Object -First 1
    
    $timespan = $newest.LastWriteTime - $oldest.LastWriteTime
    Write-Host "Session Duration: $($timespan.Days)d $($timespan.Hours)h $($timespan.Minutes)m" -ForegroundColor $info
    
    Write-Host ""
}

function Show-LatestResults {
    param([string]$logDir)
    
    $files = Get-LogFiles -logDir $logDir
    if (-not $files) { return }
    
    Write-Host "📋 LATEST RESULTS" -ForegroundColor $header
    Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor $header
    
    $latest = $files | Select-Object -First 1
    $data = Parse-LogFile -filePath $latest.FullName
    
    if (-not $data) {
        Write-Host "Could not parse latest log" -ForegroundColor $warning
        return
    }
    
    Write-Host "Iteration: $($data.iteration)" -ForegroundColor $info
    Write-Host "Timestamp: $($data.timestamp)" -ForegroundColor $info
    Write-Host ""
    
    Write-Host "📊 Content Breakdown:" -ForegroundColor $header
    Write-Host "  • Analysis:      $($data.analysis.Length ?? 0) chars" -ForegroundColor $info
    Write-Host "  • Tasks:         $($data.tasks.Length ?? 0) chars" -ForegroundColor $info
    Write-Host "  • Review:        $($data.review.Length ?? 0) chars" -ForegroundColor $info
    Write-Host "  • Implementation: $($data.implementation.Length ?? 0) chars" -ForegroundColor $info
    Write-Host "  • Next Steps:    $($data.next_steps.Length ?? 0) chars" -ForegroundColor $info
    Write-Host ""
    
    # Show preview of analysis
    if ($data.analysis) {
        Write-Host "📝 Analysis Preview:" -ForegroundColor $header
        $preview = $data.analysis.Substring(0, [Math]::Min(200, $data.analysis.Length))
        Write-Host "  $preview..." -ForegroundColor $info
        Write-Host ""
    }
}

function Show-IterationHistory {
    param([string]$logDir)
    
    $files = Get-LogFiles -logDir $logDir
    if (-not $files) { return }
    
    Write-Host "📚 ITERATION HISTORY" -ForegroundColor $header
    Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor $header
    
    # Group by iteration number
    $iterations = @{}
    $files | ForEach-Object {
        $data = Parse-LogFile -filePath $_.FullName
        if ($data) {
            $iterNum = $data.iteration
            if (-not $iterations.ContainsKey($iterNum)) {
                $iterations[$iterNum] = @()
            }
            $iterations[$iterNum] += @{
                File = $_.Name
                Timestamp = $data.timestamp
                Size = $_.Length
            }
        }
    }
    
    # Display in order
    $iterations.Keys | Sort-Object -Descending | ForEach-Object {
        $iterNum = $_
        $count = $iterations[$iterNum].Count
        $timestamp = $iterations[$iterNum][0].Timestamp
        $size = ($iterations[$iterNum] | Measure-Object -Property Size -Sum).Sum / 1KB
        
        Write-Host "  Iteration $iterNum ($count files, $([math]::Round($size, 2)) KB)" -ForegroundColor $info
        Write-Host "    └─ Latest: $timestamp" -ForegroundColor $info
    }
    
    Write-Host ""
}

function Show-TopInsights {
    param([string]$logDir)
    
    $files = Get-LogFiles -logDir $logDir
    if (-not $files) { return }
    
    Write-Host "💡 INSIGHTS" -ForegroundColor $header
    Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor $header
    
    $latest = $files | Select-Object -First 1
    $data = Parse-LogFile -filePath $latest.FullName
    
    if ($data -and $data.implementation) {
        # Extract some keywords
        $keywords = @('performance', 'refactor', 'optimize', 'security', 'accessibility')
        Write-Host "Recommendations detected:" -ForegroundColor $header
        
        $keywords | ForEach-Object {
            $keyword = $_
            if ($data.implementation -match $keyword) {
                Write-Host "  ✓ $keyword improvement mentioned" -ForegroundColor $success
            }
        }
    }
    
    Write-Host ""
}

function Show-Dashboard {
    param([string]$logDir)
    
    Clear-Host
    Show-Banner
    Show-SessionSummary -logDir $logDir
    Show-LatestResults -logDir $logDir
    Show-IterationHistory -logDir $logDir
    Show-TopInsights -logDir $logDir
    
    Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor $header
    Write-Host "Last updated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor $info
    
    if ($watch) {
        Write-Host "🔄 Auto-refresh in $refreshInterval seconds... (Ctrl+C to stop)" -ForegroundColor $warning
    }
    else {
        Write-Host "💡 Use '-watch' flag for real-time monitoring" -ForegroundColor $info
    }
    Write-Host ""
}

function Export-Dashboard {
    param([string]$logDir)
    
    Write-Host "📤 Exporting dashboard..." -ForegroundColor $header
    
    $files = Get-LogFiles -logDir $logDir
    if (-not $files) {
        Write-Host "No logs to export" -ForegroundColor $warning
        return
    }
    
    $exportData = @{
        ExportDate = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
        TotalLogs = @($files).Count
        Sessions = @()
    }
    
    $files | Group-Object { 
        (Parse-LogFile -filePath $_.FullName).iteration 
    } | ForEach-Object {
        $iterNum = $_.Name
        $logs = $_.Group
        
        $exportData.Sessions += @{
            IterationNumber = $iterNum
            FileCount = @($logs).Count
            TotalSize = ($logs | Measure-Object -Property Length -Sum).Sum / 1KB
            OldestLog = ($logs | Sort-Object -Property LastWriteTime | Select-Object -First 1).LastWriteTime
            NewestLog = ($logs | Sort-Object -Property LastWriteTime -Descending | Select-Object -First 1).LastWriteTime
        }
    }
    
    $exportFile = "kimi-dashboard-export-$(Get-Date -Format 'yyyyMMdd-HHmmss').json"
    $exportData | ConvertTo-Json | Out-File $exportFile -Encoding UTF8
    
    Write-Host "✅ Exported to: $exportFile" -ForegroundColor $success
}

# Main execution
$logDir = Get-LogDirectory

if ($export) {
    Export-Dashboard -logDir $logDir
}
elseif ($watch) {
    while ($true) {
        Show-Dashboard -logDir $logDir
        Start-Sleep -Seconds $refreshInterval
    }
}
else {
    Show-Dashboard -logDir $logDir
}
