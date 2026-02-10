#!/bin/bash

# ============================================
# PPSDM KMITS - Deployment Script
# ============================================
# This script handles deployment to Vercel
# Usage: ./scripts/deploy.sh [environment]
# Environments: production, preview, development

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
ENVIRONMENT="${1:-production}"
VERCEL_CLI="vercel"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_dependencies() {
    log_info "Checking dependencies..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install Node.js 18 or higher."
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed."
        exit 1
    fi
    
    # Check Vercel CLI
    if ! command -v $VERCEL_CLI &> /dev/null; then
        log_warning "Vercel CLI is not installed. Installing..."
        npm install -g vercel
    fi
    
    log_success "All dependencies are installed."
}

validate_environment() {
    log_info "Validating environment: $ENVIRONMENT"
    
    case $ENVIRONMENT in
        production|preview|development)
            ;;
        *)
            log_error "Invalid environment. Use: production, preview, or development"
            exit 1
            ;;
    esac
    
    # Check if .env.production exists for production deployment
    if [ "$ENVIRONMENT" = "production" ] && [ ! -f "$PROJECT_ROOT/.env.production" ]; then
        log_warning ".env.production not found. Using Vercel environment variables."
    fi
}

run_tests() {
    log_info "Running tests..."
    
    cd "$PROJECT_ROOT"
    
    # Run unit tests
    log_info "Running unit tests with Vitest..."
    npm run test -- --run
    
    # Run E2E tests if in production
    if [ "$ENVIRONMENT" = "production" ]; then
        log_info "Running E2E tests with Playwright..."
        npm run e2e
    fi
    
    log_success "All tests passed."
}

build_project() {
    log_info "Building project..."
    
    cd "$PROJECT_ROOT"
    
    # Install dependencies
    log_info "Installing dependencies..."
    npm ci
    
    # Build the project
    log_info "Building Next.js application..."
    npm run build
    
    log_success "Build completed successfully."
}

deploy_to_vercel() {
    log_info "Deploying to Vercel ($ENVIRONMENT)..."
    
    cd "$PROJECT_ROOT"
    
    # Set deployment flags based on environment
    if [ "$ENVIRONMENT" = "production" ]; then
        $VERCEL_CLI --prod
    else
        $VERCEL_CLI
    fi
    
    log_success "Deployment completed successfully."
}

setup_google_sheets() {
    log_info "Setting up Google Sheets integration..."
    
    # Check if credentials file exists
    if [ -f "$PROJECT_ROOT/credentials.json" ]; then
        log_info "Google Sheets credentials found."
        
        # Encode credentials to base64 for Vercel
        ENCODED_CREDENTIALS=$(cat "$PROJECT_ROOT/credentials.json" | base64 -w 0)
        log_info "Credentials encoded. Add this to Vercel environment variables:"
        echo "GOOGLE_SERVICE_ACCOUNT_CREDENTIALS=$ENCODED_CREDENTIALS"
    else
        log_warning "Google Sheets credentials not found. Run setup-google-sheets.sh to set up."
    fi
}

verify_deployment() {
    log_info "Verifying deployment..."
    
    # Get the deployment URL from Vercel
    DEPLOYMENT_URL=$($VERCEL_CLI ls --prod 2>/dev/null | head -n 2 | tail -n 1 | awk '{print $2}')
    
    if [ -n "$DEPLOYMENT_URL" ]; then
        log_success "Deployment URL: $DEPLOYMENT_URL"
        
        # Wait for deployment to be ready
        log_info "Waiting for deployment to be ready..."
        sleep 10
        
        # Check if the site is accessible
        if curl -f -s -o /dev/null "$DEPLOYMENT_URL"; then
            log_success "Deployment is accessible and working."
        else
            log_warning "Deployment URL is not yet accessible. Please check manually."
        fi
    else
        log_warning "Could not retrieve deployment URL."
    fi
}

cleanup() {
    log_info "Cleaning up temporary files..."
    
    # Remove any temporary build files
    rm -rf "$PROJECT_ROOT/.next"
    rm -rf "$PROJECT_ROOT/node_modules/.cache"
    
    log_success "Cleanup completed."
}

main() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}PPSDM KMITS - Deployment Script${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
    
    # Change to project root
    cd "$PROJECT_ROOT"
    
    # Run deployment steps
    check_dependencies
    validate_environment
    run_tests
    build_project
    setup_google_sheets
    deploy_to_vercel
    verify_deployment
    cleanup
    
    echo ""
    log_success "Deployment process completed successfully!"
    echo ""
    log_info "Next steps:"
    echo "  1. Verify the deployment URL"
    echo "  2. Check environment variables in Vercel dashboard"
    echo "  3. Test Google Sheets integration"
    echo "  4. Monitor logs in Vercel dashboard"
    echo ""
}

# Handle script arguments
case "${1:-}" in
    --help|-h)
        echo "Usage: $0 [environment]"
        echo ""
        echo "Environments:"
        echo "  production   Deploy to production (default)"
        echo "  preview      Deploy to preview environment"
        echo "  development  Deploy to development environment"
        echo ""
        echo "Options:"
        echo "  --help, -h   Show this help message"
        echo "  --skip-tests Skip running tests"
        echo "  --skip-build Skip building the project"
        exit 0
        ;;
    --skip-tests)
        SKIP_TESTS=true
        shift
        ;;
    --skip-build)
        SKIP_BUILD=true
        shift
        ;;
esac

# Run main function
main "$@"
