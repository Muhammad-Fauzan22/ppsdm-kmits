# PPSDM KMITS Supabase CLI Setup Script (Windows PowerShell)
# Usage: .\scripts\setup_supabase_cli.ps1

$ErrorActionPreference = "Stop"

# Colors
$Red = "`e[31m"
$Green = "`e[32m"
$Yellow = "`e[33m"
$Blue = "`e[34m"
$Reset = "`e[0m"

function Write-Header {
    param([string]$Message)
    Write-Host ""
    Write-Host "$Blue$Message$Reset"
    Write-Host ($Blue + ("=" * $Message.Length) + $Reset)
}

function Write-Success {
    param([string]$Message)
    Write-Host "$Green✅ $Message$Reset"
}

function Write-Warning {
    param([string]$Message)
    Write-Host "$Yellow⚠️  $Message$Reset"
}

function Write-Error {
    param([string]$Message)
    Write-Host "$Red❌ $Message$Reset"
}

# Header
Write-Host ""
Write-Host "$Blue╔════════════════════════════════════════════════════════════╗$Reset"
Write-Host "$Blue║        🚀 PPSDM KMITS Supabase CLI Setup                   ║$Reset"
Write-Host "$Blue║        Windows PowerShell Edition                          ║$Reset"
Write-Host "$Blue╚════════════════════════════════════════════════════════════╝$Reset"
Write-Host ""

# Check if running from project root
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptPath
Set-Location $projectRoot

Write-Header "Checking Prerequisites"

# Check Docker
try {
    $dockerVersion = docker --version
    Write-Success "Docker found: $dockerVersion"
    
    # Check if Docker is running
    $dockerInfo = docker info 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Docker is not running. Please start Docker Desktop."
        exit 1
    }
    Write-Success "Docker is running"
} catch {
    Write-Error "Docker not found. Please install Docker Desktop."
    Write-Host "Download: https://www.docker.com/products/docker-desktop"
    exit 1
}

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Success "Node.js found: $nodeVersion"
} catch {
    Write-Error "Node.js not found. Please install Node.js."
    exit 1
}

# Check Supabase CLI
Write-Host ""
Write-Header "Installing Supabase CLI"

if (-not (Test-Path "node_modules/supabase")) {
    Write-Host "Installing Supabase CLI as dev dependency..."
    npm install --save-dev supabase
    Write-Success "Supabase CLI installed"
} else {
    Write-Success "Supabase CLI already installed"
}

# Check if already initialized
Write-Host ""
Write-Header "Initializing Supabase Project"

if (Test-Path "supabase/config.toml") {
    Write-Warning "Supabase already initialized"
    $reinit = Read-Host "Reinitialize? (y/N)"
    if ($reinit -eq "y" -or $reinit -eq "Y") {
        Remove-Item -Recurse -Force supabase
        npx supabase init
        Write-Success "Supabase reinitialized"
    }
} else {
    Write-Host "Initializing Supabase..."
    npx supabase init
    Write-Success "Supabase initialized"
}

# Check for .env.local
Write-Host ""
Write-Header "Environment Configuration"

if (-not (Test-Path ".env.local")) {
    Write-Warning ".env.local not found"
    
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env.local"
        Write-Success "Created .env.local from template"
    } else {
        Write-Error ".env.example not found"
        exit 1
    }
}

# Prompt for Supabase project details
Write-Host ""
Write-Host "Please enter your Supabase cloud project details."
Write-Host "Find these at: https://app.supabase.com/project/_/settings/api"
Write-Host ""

$projectRef = Read-Host "Project Reference ID (e.g., abcdefghijklmnopqrst)"

if ([string]::IsNullOrWhiteSpace($projectRef)) {
    Write-Warning "No project ref provided. Skipping cloud link."
    Write-Host "You can link later with: npx supabase link --project-ref <ref>"
} else {
    Write-Host ""
    Write-Header "Linking to Cloud Project"
    
    npx supabase link --project-ref $projectRef
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Linked to cloud project: $projectRef"
        
        # Pull database
        Write-Host ""
        Write-Header "Pulling Database Schema"
        npx supabase db pull
        Write-Success "Database schema pulled"
    } else {
        Write-Error "Failed to link to cloud project"
        Write-Host "You can try manually: npx supabase link --project-ref $projectRef"
    }
}

# Start local stack
Write-Host ""
Write-Header "Starting Local Supabase"

npx supabase start

if ($LASTEXITCODE -eq 0) {
    Write-Success "Local Supabase started!"
    
    # Get credentials
    $status = npx supabase status --output json | ConvertFrom-Json
    
    Write-Host ""
    Write-Header "Local Supabase Credentials"
    Write-Host "API URL:      http://localhost:54321"
    Write-Host "Studio URL:   http://localhost:54323"
    Write-Host "DB URL:       postgresql://postgres:postgres@localhost:54322/postgres"
    Write-Host ""
    Write-Host "Update your .env.local with:"
    Write-Host "  NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321"
    Write-Host "  NEXT_PUBLIC_SUPABASE_ANON_KEY=<from supabase status>"
    
    # Run status to show all details
    Write-Host ""
    npx supabase status
} else {
    Write-Error "Failed to start local Supabase"
    exit 1
}

# Final instructions
Write-Host ""
Write-Host "$Green╔════════════════════════════════════════════════════════════╗$Reset"
Write-Host "$Green║        ✅ Setup Complete!                                  ║$Reset"
Write-Host "$Green╚════════════════════════════════════════════════════════════╝$Reset"
Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. Update .env.local with local Supabase credentials"
Write-Host "  2. Run: npm run dev"
Write-Host "  3. Visit: http://localhost:3000"
Write-Host ""
Write-Host "Useful commands:"
Write-Host "  npx supabase status     - View local status"
Write-Host "  npx supabase stop       - Stop local stack"
Write-Host "  npx supabase db reset   - Reset local database"
Write-Host "  npx supabase db push    - Push changes to cloud"
Write-Host ""
Write-Host "For more info, see: SUPABASE_CLI_GUIDE.md"
