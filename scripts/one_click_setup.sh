#!/bin/bash
# One-click setup for PPSDM KMITS Database
# Usage: ./scripts/one_click_setup.sh

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║        🚀 PPSDM KMITS Database Setup                       ║"
echo "║        Automated Supabase Configuration                    ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check if .env.local exists
if [ ! -f "$PROJECT_ROOT/.env.local" ]; then
    echo -e "${YELLOW}⚠️  Warning: .env.local not found${NC}"
    echo ""
    echo "Creating from template..."
    
    if [ -f "$PROJECT_ROOT/.env.example" ]; then
        cp "$PROJECT_ROOT/.env.example" "$PROJECT_ROOT/.env.local"
        echo -e "${GREEN}✅ Created .env.local from template${NC}"
        echo ""
        echo -e "${YELLOW}Please edit .env.local and add your Supabase credentials:${NC}"
        echo "  - NEXT_PUBLIC_SUPABASE_URL"
        echo "  - SUPABASE_SERVICE_ROLE_KEY"
        echo ""
        echo "Get these from: https://app.supabase.com/project/_/settings/api"
        exit 1
    else
        echo -e "${RED}❌ Error: .env.example not found${NC}"
        exit 1
    fi
fi

# Load environment variables
export $(grep -v '^#' "$PROJECT_ROOT/.env.local" | xargs)

# Check environment variables
echo -e "${BLUE}🔍 Checking environment...${NC}"

if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo -e "${RED}❌ Error: NEXT_PUBLIC_SUPABASE_URL not set${NC}"
    echo "Please add it to .env.local"
    exit 1
fi

echo -e "${GREEN}  ✅ NEXT_PUBLIC_SUPABASE_URL: ${NEXT_PUBLIC_SUPABASE_URL:0:30}...${NC}"

if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo ""
    echo -e "${YELLOW}⚠️  Warning: SUPABASE_SERVICE_ROLE_KEY not set${NC}"
    echo ""
    echo "For automated setup, you need the Service Role Key."
    echo "Get it from: https://app.supabase.com/project/_/settings/api"
    echo ""
    echo "Alternatively, use manual setup:"
    echo "  1. Open: https://app.supabase.com/project/_/sql"
    echo "  2. Run: supabase/setup_complete_database.sql"
    echo ""
    
    read -p "Continue with manual setup instructions? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cat "$PROJECT_ROOT/SUPABASE_SETUP_GUIDE.md"
    fi
    exit 0
fi

echo -e "${GREEN}  ✅ SUPABASE_SERVICE_ROLE_KEY: ***${NC}"

# Check Python
if ! command -v python3 &> /dev/null; then
    if ! command -v python &> /dev/null; then
        echo -e "${RED}❌ Error: Python not found${NC}"
        echo "Please install Python 3.8 or higher"
        exit 1
    fi
    PYTHON_CMD="python"
else
    PYTHON_CMD="python3"
fi

echo -e "${GREEN}  ✅ Python found: $($PYTHON_CMD --version)${NC}"

# Check pip
if ! command -v pip &> /dev/null && ! command -v pip3 &> /dev/null; then
    echo -e "${RED}❌ Error: pip not found${NC}"
    exit 1
fi

echo -e "${GREEN}  ✅ pip found${NC}"

# Install dependencies if needed
echo ""
echo -e "${BLUE}📦 Checking dependencies...${NC}"

if ! $PYTHON_CMD -c "import supabase" 2>/dev/null; then
    echo -e "${YELLOW}  📦 Installing supabase-py...${NC}"
    pip install supabase || pip3 install supabase
    echo -e "${GREEN}  ✅ supabase-py installed${NC}"
else
    echo -e "${GREEN}  ✅ supabase-py already installed${NC}"
fi

if ! $PYTHON_CMD -c "import dotenv" 2>/dev/null; then
    echo -e "${YELLOW}  📦 Installing python-dotenv...${NC}"
    pip install python-dotenv || pip3 install python-dotenv
    echo -e "${GREEN}  ✅ python-dotenv installed${NC}"
else
    echo -e "${GREEN}  ✅ python-dotenv already installed${NC}"
fi

# Check SQL files exist
echo ""
echo -e "${BLUE}📄 Checking SQL files...${NC}"

SQL_FILE="$PROJECT_ROOT/supabase/setup_complete_database.sql"
if [ ! -f "$SQL_FILE" ]; then
    echo -e "${RED}❌ Error: setup_complete_database.sql not found${NC}"
    echo "Expected at: $SQL_FILE"
    exit 1
fi

echo -e "${GREEN}  ✅ setup_complete_database.sql found${NC}"

# Check exec_sql function exists
EXEC_SQL_FILE="$PROJECT_ROOT/supabase/exec_sql_function.sql"
if [ -f "$EXEC_SQL_FILE" ]; then
    echo -e "${GREEN}  ✅ exec_sql_function.sql found${NC}"
fi

# Run setup
echo ""
echo -e "${BLUE}🔧 Running database setup...${NC}"
echo ""

cd "$PROJECT_ROOT"
$PYTHON_CMD scripts/setup_supabase_database.py

SETUP_STATUS=$?

if [ $SETUP_STATUS -eq 0 ]; then
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║        ✅ Setup Complete!                                  ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Start the development server: npm run dev"
    echo "  2. Visit http://localhost:3000"
    echo "  3. Sign up with your email"
    echo "  4. Run SQL to make yourself admin (see guide)"
    echo ""
    
    # Run verification
    echo -e "${BLUE}🔍 Running verification...${NC}"
    $PYTHON_CMD scripts/verify_database_setup.py || true
else
    echo ""
    echo -e "${RED}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║        ⚠️  Setup completed with errors                     ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo "Some statements may have failed. This is often OK if:"
    echo "  - Tables already exist (CREATE IF NOT EXISTS)"
    echo "  - Some objects were already created"
    echo ""
    echo "Check the errors above and verify with:"
    echo "  python scripts/verify_database_setup.py"
    exit 1
fi

echo ""
echo -e "${BLUE}For help, see: SUPABASE_SETUP_GUIDE.md${NC}"
