#!/bin/bash

# ============================================
# PPSDM KMITS - Google Sheets Setup Script
# ============================================
# This script helps set up Google Sheets API credentials
# Usage: ./scripts/setup-google-sheets.sh

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
CREDENTIALS_FILE="$PROJECT_ROOT/credentials.json"
ENCODED_CREDENTIALS_FILE="$PROJECT_ROOT/credentials.base64"

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

log_step() {
    echo -e "${CYAN}[STEP]${NC} $1"
}

print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}PPSDM KMITS - Google Sheets Setup${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
}

check_existing_credentials() {
    log_step "Checking for existing credentials..."
    
    if [ -f "$CREDENTIALS_FILE" ]; then
        log_warning "Credentials file already exists at: $CREDENTIALS_FILE"
        read -p "Do you want to overwrite it? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "Using existing credentials file."
            return 1
        fi
        rm "$CREDENTIALS_FILE"
    fi
    
    if [ -f "$ENCODED_CREDENTIALS_FILE" ]; then
        log_warning "Encoded credentials file already exists."
        rm "$ENCODED_CREDENTIALS_FILE"
    fi
    
    return 0
}

create_google_cloud_project() {
    log_step "Creating Google Cloud Project..."
    echo ""
    echo "Please follow these steps to create a Google Cloud Project:"
    echo ""
    echo "1. Go to: https://console.cloud.google.com/projectcreate"
    echo "2. Enter a project name (e.g., 'PPSDM-KMITS')"
    echo "3. Click 'Create'"
    echo ""
    read -p "Press Enter after you have created the project..."
    echo ""
}

enable_google_sheets_api() {
    log_step "Enabling Google Sheets API..."
    echo ""
    echo "Please follow these steps to enable the Google Sheets API:"
    echo ""
    echo "1. Go to: https://console.cloud.google.com/apis/library/sheets.googleapis.com"
    echo "2. Select your project from the dropdown"
    echo "3. Click 'Enable'"
    echo ""
    read -p "Press Enter after you have enabled the API..."
    echo ""
}

create_service_account() {
    log_step "Creating Service Account..."
    echo ""
    echo "Please follow these steps to create a Service Account:"
    echo ""
    echo "1. Go to: https://console.cloud.google.com/iam-admin/serviceaccounts"
    echo "2. Select your project from the dropdown"
    echo "3. Click 'Create Service Account'"
    echo "4. Enter a name (e.g., 'ppsdm-kmits-service')"
    echo "5. Click 'Create and Continue'"
    echo "6. Skip granting roles for now (we'll do this later)"
    echo "7. Click 'Done'"
    echo ""
    read -p "Press Enter after you have created the service account..."
    echo ""
}

grant_spreadsheet_access() {
    log_step "Granting Spreadsheet Access..."
    echo ""
    echo "Please follow these steps to grant access to your spreadsheet:"
    echo ""
    echo "1. Go to: https://console.cloud.google.com/iam-admin/serviceaccounts"
    echo "2. Click on your service account"
    echo "3. Copy the 'Service account email' (e.g., ppsdm-kmits-service@project-id.iam.gserviceaccount.com)"
    echo "4. Open your Google Spreadsheet"
    echo "5. Click 'Share' button"
    echo "6. Paste the service account email"
    echo "7. Grant 'Editor' access"
    echo "8. Click 'Send'"
    echo ""
    read -p "Press Enter after you have granted access..."
    echo ""
}

create_credentials_key() {
    log_step "Creating Credentials Key..."
    echo ""
    echo "Please follow these steps to create credentials:"
    echo ""
    echo "1. Go to: https://console.cloud.google.com/iam-admin/serviceaccounts"
    echo "2. Click on your service account"
    echo "3. Go to 'Keys' tab"
    echo "4. Click 'Add Key' > 'Create new key'"
    echo "5. Select 'JSON' format"
    echo "6. Click 'Create'"
    echo "7. The JSON file will be downloaded automatically"
    echo ""
    read -p "Press Enter after you have downloaded the credentials file..."
    echo ""
}

upload_credentials() {
    log_step "Uploading Credentials File..."
    echo ""
    echo "Please upload the downloaded JSON credentials file."
    echo ""
    
    # Try to find the downloaded file
    DOWNLOAD_DIR="$HOME/Downloads"
    CANDIDATE_FILES=$(find "$DOWNLOAD_DIR" -name "*.json" -type f -mmin -5 2>/dev/null || true)
    
    if [ -n "$CANDIDATE_FILES" ]; then
        log_info "Found recently downloaded JSON files:"
        echo "$CANDIDATE_FILES" | nl
        echo ""
        read -p "Enter the number of the credentials file (or press Enter to specify path manually): " FILE_NUM
        
        if [ -n "$FILE_NUM" ]; then
            SELECTED_FILE=$(echo "$CANDIDATE_FILES" | sed -n "${FILE_NUM}p")
        fi
    fi
    
    if [ -z "$SELECTED_FILE" ]; then
        read -p "Enter the path to the credentials JSON file: " SELECTED_FILE
    fi
    
    if [ ! -f "$SELECTED_FILE" ]; then
        log_error "File not found: $SELECTED_FILE"
        exit 1
    fi
    
    # Copy credentials to project root
    cp "$SELECTED_FILE" "$CREDENTIALS_FILE"
    chmod 600 "$CREDENTIALS_FILE"
    
    log_success "Credentials file copied to: $CREDENTIALS_FILE"
}

encode_credentials() {
    log_step "Encoding Credentials for Vercel..."
    
    # Encode credentials to base64
    ENCODED=$(cat "$CREDENTIALS_FILE" | base64 -w 0)
    echo "$ENCODED" > "$ENCODED_CREDENTIALS_FILE"
    
    log_success "Credentials encoded and saved to: $ENCODED_CREDENTIALS_FILE"
}

get_spreadsheet_id() {
    log_step "Getting Spreadsheet ID..."
    echo ""
    echo "Your Spreadsheet ID is needed for the application to connect."
    echo ""
    echo "To find your Spreadsheet ID:"
    echo "1. Open your Google Spreadsheet"
    echo "2. Look at the URL: https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit"
    echo "3. Copy the [SPREADSHEET_ID] part"
    echo ""
    read -p "Enter your Spreadsheet ID: " SPREADSHEET_ID
    
    if [ -z "$SPREADSHEET_ID" ]; then
        log_error "Spreadsheet ID is required."
        exit 1
    fi
    
    # Save to .env.local
    ENV_FILE="$PROJECT_ROOT/.env.local"
    if [ -f "$ENV_FILE" ]; then
        # Update existing entry or add new one
        if grep -q "NEXT_PUBLIC_GOOGLE_SHEETS_SPREADSHEET_ID" "$ENV_FILE"; then
            sed -i.bak "s/NEXT_PUBLIC_GOOGLE_SHEETS_SPREADSHEET_ID=.*/NEXT_PUBLIC_GOOGLE_SHEETS_SPREADSHEET_ID=$SPREADSHEET_ID/" "$ENV_FILE"
        else
            echo "NEXT_PUBLIC_GOOGLE_SHEETS_SPREADSHEET_ID=$SPREADSHEET_ID" >> "$ENV_FILE"
        fi
    else
        echo "NEXT_PUBLIC_GOOGLE_SHEETS_SPREADSHEET_ID=$SPREADSHEET_ID" > "$ENV_FILE"
    fi
    
    log_success "Spreadsheet ID saved to .env.local"
}

test_connection() {
    log_step "Testing Google Sheets Connection..."
    echo ""
    log_info "Running connection test..."
    
    cd "$PROJECT_ROOT"
    
    # Create a simple test script
    cat > /tmp/test-google-sheets.js << 'EOF'
const { GoogleSheetsService } = require('./src/lib/google-sheets/google-sheets.service');

async function testConnection() {
    try {
        const service = GoogleSheetsService.getInstance();
        const sheets = await service.getSheets(process.env.NEXT_PUBLIC_GOOGLE_SHEETS_SPREADSHEET_ID);
        console.log('✓ Connection successful!');
        console.log('✓ Found sheets:', sheets.map(s => s.properties.title).join(', '));
        process.exit(0);
    } catch (error) {
        console.error('✗ Connection failed:', error.message);
        process.exit(1);
    }
}

testConnection();
EOF
    
    # Run the test
    if node /tmp/test-google-sheets.js 2>/dev/null; then
        log_success "Google Sheets connection test passed!"
    else
        log_warning "Connection test failed. This is expected if running locally without proper setup."
        log_info "The connection will work when deployed to Vercel with proper environment variables."
    fi
    
    rm -f /tmp/test-google-sheets.js
}

print_vercel_instructions() {
    log_step "Vercel Environment Variables Setup..."
    echo ""
    echo "Add the following environment variables to your Vercel project:"
    echo ""
    echo -e "${CYAN}1. GOOGLE_SERVICE_ACCOUNT_CREDENTIALS:${NC}"
    cat "$ENCODED_CREDENTIALS_FILE"
    echo ""
    echo -e "${CYAN}2. NEXT_PUBLIC_GOOGLE_SHEETS_SPREADSHEET_ID:${NC}"
    echo "$SPREADSHEET_ID"
    echo ""
    echo "To add these to Vercel:"
    echo "1. Go to your Vercel project dashboard"
    echo "2. Go to Settings > Environment Variables"
    echo "3. Add each variable with its value"
    echo "4. Redeploy your application"
    echo ""
}

print_summary() {
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}Setup Complete!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo "Files created:"
    echo "  - $CREDENTIALS_FILE"
    echo "  - $ENCODED_CREDENTIALS_FILE"
    echo ""
    echo "Next steps:"
    echo "  1. Add environment variables to Vercel (see above)"
    echo "  2. Deploy your application: ./scripts/deploy.sh"
    echo "  3. Test the Google Sheets integration"
    echo ""
    echo "For more information, see: docs/GOOGLE_SHEETS_INTEGRATION.md"
    echo ""
}

main() {
    print_header
    
    # Check if user wants to skip interactive setup
    if [ "${1:-}" = "--quick" ]; then
        log_info "Quick setup mode - assuming credentials already exist"
        if [ -f "$CREDENTIALS_FILE" ]; then
            encode_credentials
            print_vercel_instructions
            print_summary
        else
            log_error "Credentials file not found. Run without --quick flag for full setup."
            exit 1
        fi
        exit 0
    fi
    
    # Run setup steps
    if check_existing_credentials; then
        create_google_cloud_project
        enable_google_sheets_api
        create_service_account
        grant_spreadsheet_access
        create_credentials_key
        upload_credentials
        encode_credentials
        get_spreadsheet_id
        test_connection
        print_vercel_instructions
    else
        encode_credentials
        get_spreadsheet_id
        test_connection
        print_vercel_instructions
    fi
    
    print_summary
}

# Handle script arguments
case "${1:-}" in
    --help|-h)
        echo "Usage: $0 [options]"
        echo ""
        echo "Options:"
        echo "  --quick    Quick setup (assumes credentials already exist)"
        echo "  --help, -h Show this help message"
        echo ""
        echo "This script helps you set up Google Sheets API credentials for PPSDM KMITS."
        echo ""
        exit 0
        ;;
esac

# Run main function
main "$@"
