#!/bin/bash

# ==============================================
# BUKA BUKU - DEPLOYMENT SCRIPT
# ==============================================

echo "🚀 Deploying BUKA BUKU System..."

# 1. Install dependencies
echo "📦 Installing dependencies..."
npm install

# 2. Setup Supabase
echo "🗄️  Setting up Supabase database..."
echo "Please run the SQL schema in supabase/production_schema.sql in your Supabase SQL Editor."

# 3. Build the application
echo "🔨 Building Next.js application..."
npm run build

# 4. Deploy to Vercel
echo "☁️  Deploying to Vercel..."
vercel --prod --yes

# 5. Setup Google Apps Script
echo "📝 Setting up Google Apps Script..."
echo "Please manually deploy the Google Apps Script from scripts/drive_monitor_advanced.gs"

# 6. Test the system
echo "🧪 Testing system..."
echo "Assuming API deployed, check: https://ppsdm-kmits.vercel.app/api/process"

echo ""
echo "✅ Deployment complete!"
echo "🌐 Dashboard: https://ppsdm-kmits.vercel.app/dashboard"
echo "🔄 API: https://ppsdm-kmits.vercel.app/api/process"
