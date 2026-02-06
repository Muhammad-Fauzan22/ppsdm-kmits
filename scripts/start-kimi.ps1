# KIMI K2.5 Automation Wrapper for Windows PowerShell
# Provides easy execution and monitoring of KIMI automation loop

param(
    [int]$iterations = 3,
    [string]$apiKey = $null,
    [switch]$analysis = $false,
    [switch]$continuous = $false,
    [int]$continuousInterval = 3600  # seconds between continuous runs
)

# Colors for output
$infoColor = "Cyan"
$successColor = "Green"
$warningColor = "Yellow"
$errorColor = "Red"

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor $infoColor
}

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor $successColor
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor $warningColor
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor $errorColor
}

function Show-Banner {
    Write-Host ""
    Write-Host "╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Magenta
    Write-Host "║                                                               ║" -ForegroundColor Magenta
    Write-Host "║            🤖 KIMI K2.5 Automation Orchestrator 🤖           ║" -ForegroundColor Magenta
    Write-Host "║                    PPSDM-KMITS Project                       ║" -ForegroundColor Magenta
    Write-Host "║                                                               ║" -ForegroundColor Magenta
    Write-Host "╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Magenta
    Write-Host ""
}

function Check-Prerequisites {
    Write-Info "Checking prerequisites..."
    
    # Check Python
    try {
        $pythonVersion = python --version 2>&1
        Write-Success "Python found: $pythonVersion"
    }
    catch {
        Write-Error "Python not found. Please install Python 3.9+"
        exit 1
    }
    
    # Check requests library
    try {
        python -c "import requests" 2>&1 | Out-Null
        Write-Success "requests library found"
    }
    catch {
        Write-Warning "requests library not found. Installing..."
        pip install requests --quiet
        Write-Success "requests library installed"
    }
    
    # Check API key
    if ($apiKey) {
        $env:NVIDIA_API_KEY = $apiKey
        Write-Success "API Key set from parameter"
    }
    elseif ($env:NVIDIA_API_KEY) {
        Write-Success "API Key found in environment"
    }
    else {
        Write-Error "NVIDIA_API_KEY not set!"
        Write-Info "Set it with: `$env:NVIDIA_API_KEY = 'your-key-here'"
        exit 1
    }
    
    Write-Success "All prerequisites met!`n"
}

function Run-KimiAutomation {
    param(
        [int]$iterations,
        [string]$runId
    )
    
    Write-Host ""
    Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "🚀 Starting KIMI Automation - Run: $runId" -ForegroundColor Magenta
    Write-Host "   Iterations: $iterations | Time: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Cyan
    Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""
    
    $startTime = Get-Date
    
    try {
        # Run automation
        & python scripts/kimi-automation.py $iterations $env:NVIDIA_API_KEY
        
        if ($LASTEXITCODE -eq 0) {
            $endTime = Get-Date
            $duration = $endTime - $startTime
            
            Write-Host ""
            Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Green
            Write-Success "KIMI Automation completed successfully!"
            Write-Host "   Duration: $($duration.TotalSeconds) seconds" -ForegroundColor Green
            Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Green
            
            Show-Results
        }
        else {
            Write-Error "KIMI Automation failed with exit code $LASTEXITCODE"
            return $false
        }
    }
    catch {
        Write-Error "Error running KIMI: $_"
        return $false
    }
    
    return $true
}

function Show-Results {
    Write-Info "KIMI Automation Results:"
    Write-Host ""
    
    # Find latest log
    $logDir = "kimi_automation_logs"
    if (Test-Path $logDir) {
        $latestLog = Get-ChildItem $logDir -Filter "*.json" | Sort-Object -Descending -Property LastWriteTime | Select-Object -First 1
        
        if ($latestLog) {
            Write-Success "Latest log: $($latestLog.Name)"
            Write-Info "Log location: $(Resolve-Path $logDir)"
            Write-Host ""
            
            # Show summary of latest log
            try {
                $content = Get-Content $latestLog.FullName | ConvertFrom-Json
                Write-Host "Summary:" -ForegroundColor Yellow
                Write-Host "  Iteration: $($content.iteration)"
                Write-Host "  Timestamp: $($content.timestamp)"
                Write-Host "  Analysis length: $($content.analysis.Length) chars"
                Write-Host "  Tasks length: $($content.tasks.Length) chars"
                Write-Host "  Review length: $($content.review.Length) chars"
                Write-Host ""
            }
            catch {
                Write-Warning "Could not parse log file"
            }
        }
    }
    else {
        Write-Warning "No logs found yet"
    }
}

function Start-ContinuousAutomation {
    param(
        [int]$interval,
        [int]$iterations
    )
    
    Write-Info "Starting continuous automation mode..."
    Write-Info "Interval: every $($interval/60) minutes"
    
    $runCount = 1
    while ($true) {
        $runId = "continuous-run-$runCount"
        
        $success = Run-KimiAutomation -iterations $iterations -runId $runId
        
        if (-not $success) {
            Write-Warning "Automation run failed. Waiting before retry..."
        }
        
        Write-Info "Next run in $($interval/60) minutes... (Ctrl+C to stop)"
        Start-Sleep -Seconds $interval
        
        $runCount++
    }
}

function Show-Help {
    Write-Host ""
    Write-Host "KIMI K2.5 Automation Orchestrator" -ForegroundColor Magenta
    Write-Host ""
    Write-Host "USAGE:" -ForegroundColor Yellow
    Write-Host "  .\scripts\start-kimi.ps1 [options]"
    Write-Host ""
    Write-Host "OPTIONS:" -ForegroundColor Yellow
    Write-Host "  -iterations <number>     Number of automation iterations (default: 3)"
    Write-Host "  -apiKey <key>           NVIDIA API Key (or set NVIDIA_API_KEY env var)"
    Write-Host "  -analysis               Run analysis only (1 iteration)"
    Write-Host "  -continuous             Run continuously with interval"
    Write-Host "  -continuousInterval <s> Seconds between runs (default: 3600)"
    Write-Host "  -Help                   Show this help message"
    Write-Host ""
    Write-Host "EXAMPLES:" -ForegroundColor Cyan
    Write-Host "  # Single analysis run"
    Write-Host "  .\scripts\start-kimi.ps1 -analysis"
    Write-Host ""
    Write-Host "  # Standard 3-iteration improvement loop"
    Write-Host "  .\scripts\start-kimi.ps1 -iterations 3"
    Write-Host ""
    Write-Host "  # Deep improvement with 5 iterations"
    Write-Host "  .\scripts\start-kimi.ps1 -iterations 5"
    Write-Host ""
    Write-Host "  # Continuous improvement (every hour)"
    Write-Host "  .\scripts\start-kimi.ps1 -continuous -continuousInterval 3600"
    Write-Host ""
    Write-Host "  # With custom API key"
    Write-Host "  .\scripts\start-kimi.ps1 -iterations 3 -apiKey 'sk-xxxxx'"
    Write-Host ""
}

# Main execution
if ($PSBoundParameters['Help'] -or $PSBoundParameters['?']) {
    Show-Help
    exit 0
}

Show-Banner

# Handle analysis flag
if ($analysis) {
    $iterations = 1
    Write-Info "Analysis mode: Running 1 iteration only`n"
}

Check-Prerequisites

if ($continuous) {
    Start-ContinuousAutomation -interval $continuousInterval -iterations $iterations
}
else {
    $runId = "manual-run-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    $success = Run-KimiAutomation -iterations $iterations -runId $runId
    exit ($success ? 0 : 1)
}
