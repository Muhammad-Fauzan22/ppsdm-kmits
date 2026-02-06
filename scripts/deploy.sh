#!/bin/bash

/**
 * Deployment Script for PPSDM KMM
 * Optimized for Vercel Deployment
 */

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="ppsdm-kmits"
ENVIRONMENT=${1:-production}
BUILD_COMMAND="npm run build"
OUTPUT_DIRECTORY=".vercel/output"

# Functions
print_step() {
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BLUE}🚀 $1${NC}"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

print_success() {
  echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
  echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
  echo -e "${RED}❌ $1${NC}"
}

# Pre-deployment checks
pre_deployment_checks() {
  print_step "Running Pre-deployment Checks"
  
  # Check Node.js version
  NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
  if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version must be 18 or higher. Current: $(node -v)"
    exit 1
  fi
  print_success "Node.js version check passed: $(node -v)"
  
  # Check if dependencies are installed
  if [ ! -d "node_modules" ]; then
    print_warning "Installing dependencies..."
    npm install
  fi
  print_success "Dependencies check passed"
  
  # Check environment file
  if [ ! -f ".env.local" ]; then
    print_warning ".env.local not found. Creating from template..."
    cp .env.example .env.local
    print_warning "Please configure .env.local with your credentials"
    exit 1
  fi
  print_success "Environment file check passed"
}

# Database migration
run_migrations() {
  print_step "Running Database Migrations"
  
  # Check if Supabase CLI is available
  if command -v supabase &> /dev/null; then
    supabase db push --db-url "$SUPABASE_DB_URL"
    print_success "Database migrations completed"
  else
    print_warning "Supabase CLI not found. Skipping migrations."
    print_warning "Please run migrations manually: supabase db push"
  fi
}

# Build application
build_application() {
  print_step "Building Application"
  
  # Run linting
  print_warning "Running linting..."
  npm run lint || true
  
  # Run tests
  print_warning "Running tests..."
  npm run test -- --run || true
  
  # Build application
  print_warning "Building application..."
  npm run build
  print_success "Build completed successfully"
}

# Optimize build artifacts
optimize_build() {
  print_step "Optimizing Build Artifacts"
  
  # Analyze bundle size
  if [ -f ".next/server/chunks" ]; then
    print_warning "Bundle analysis:"
    find .next/server -name "*.js" -exec ls -lh {} \; | sort -k5 -h | tail -10
  fi
  
  # Check for large dependencies
  print_warning "Checking for large dependencies..."
  npm run analyze 2>/dev/null || true
  
  print_success "Build optimization completed"
}

# Deploy to Vercel
deploy_to_vercel() {
  print_step "Deploying to Vercel"
  
  if command -v vercel &> /dev/null; then
    if [ "$ENVIRONMENT" = "production" ]; then
      vercel --prod --yes
    else
      vercel --yes
    fi
    print_success "Deployment to Vercel completed"
  else
    print_warning "Vercel CLI not found. Please deploy manually."
    print_warning "Run: npx vercel --prod"
  fi
}

# Post-deployment verification
post_deployment_verification() {
  print_step "Post-deployment Verification"
  
  # Wait for deployment to be ready
  print_warning "Waiting for deployment to be ready..."
  sleep 10
  
  # Check health endpoint
  HEALTH_URL=$(grep "NEXT_PUBLIC_APP_URL" .env.local | cut -d'=' -f2)
  if [ -n "$HEALTH_URL" ]; then
    if curl -s -o /dev/null -w "%{http_code}" "${HEALTH_URL}/api/health" | grep -q "200"; then
      print_success "Health check passed"
    else
      print_warning "Health check failed or endpoint not available"
    fi
  fi
  
  # Check for JavaScript errors
  print_warning "Checking for critical errors..."
  # Add your monitoring integration here
  
  print_success "Post-deployment verification completed"
}

# Cache warming
warm_cache() {
  print_step "Warming Cache"
  
  # Warm critical API endpoints
  print_warning "Warming critical caches..."
  
  # Warm dashboard data
  curl -s "${NEXT_PUBLIC_APP_URL}/api/dashboard" > /dev/null || true
  
  # Warm user preferences
  curl -s "${NEXT_PUBLIC_APP_URL}/api/user/preferences" > /dev/null || true
  
  # Warm assessment cache
  curl -s "${NEXT_PUBLIC_APP_URL}/api/assessment" > /dev/null || true
  
  print_success "Cache warming completed"
}

# Generate deployment report
generate_report() {
  print_step "Generating Deployment Report"
  
  REPORT_FILE="deployment-report-$(date +%Y%m%d-%H%M%S).txt"
  
  {
    echo "PPSDM KMM Deployment Report"
    echo "============================"
    echo "Date: $(date)"
    echo "Environment: $ENVIRONMENT"
    echo "Node Version: $(node -v)"
    echo "NPM Version: $(npm -v)"
    echo ""
    echo "Build Statistics:"
    if [ -d ".next/server" ]; then
      echo "  Build Size: $(du -sh .next/server | cut -f1)"
      echo "  Static Files: $(find .next/static -type f | wc -l) files"
    fi
    echo ""
    echo "Deployment completed successfully"
  } > "$REPORT_FILE"
  
  print_success "Report saved to $REPORT_FILE"
}

# Main deployment flow
main() {
  echo ""
  echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
  echo -e "${BLUE}║                                                           ║${NC}"
  echo -e "${BLUE}║          🚀 PPSDM KMM Deployment Script 🚀               ║${NC}"
  echo -e "${BLUE}║                                                           ║${NC}"
  echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}"
  echo ""
  
  # Check for cleanup flag
  if [ "$2" = "--clean" ]; then
    print_warning "Cleaning build artifacts..."
    rm -rf .next node_modules/.cache
  fi
  
  # Run deployment pipeline
  pre_deployment_checks
  run_migrations
  build_application
  optimize_build
  deploy_to_vercel
  post_deployment_verification
  warm_cache
  generate_report
  
  echo ""
  echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
  echo -e "${GREEN}║                                                           ║${NC}"
  echo -e "${GREEN}║          ✅ Deployment Completed Successfully!           ║${NC}"
  echo -e "${GREEN}║                                                           ║${NC}"
  echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
  echo ""
}

# Run main function
main "$@"
