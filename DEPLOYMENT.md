# PPSDM KMITS — Deployment Guide

## Prerequisites
- Node.js 18+
- npm 9+
- Netlify CLI or Vercel CLI
- Google Cloud service account with Sheets API enabled

---

## Environment Variables

Create `.env.local` with:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google Sheets (choose one method)
# Method 1: Base64-encoded JSON (recommended for cloud)
GOOGLE_SHEETS_CREDENTIALS_JSON=<base64-encoded-service-account-json>
# Method 2: File path (local development)
GOOGLE_APPLICATION_CREDENTIALS=./credentials.json

GOOGLE_SHEET_ID=your-spreadsheet-id

# Security
CSRF_SECRET=<32-byte-hex>
JWT_SECRET=<32-byte-hex>
WEBHOOK_SECRET=<32-byte-hex>

# Optional
REDIS_URL=redis://localhost:6379
SENTRY_DSN=your-sentry-dsn
```

### Generating Secrets
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Encoding Google Credentials for Cloud
```bash
# On macOS/Linux:
cat credentials.json | base64
# On Windows PowerShell:
[Convert]::ToBase64String([IO.File]::ReadAllBytes("credentials.json"))
```

---

## Deploy to Netlify

### Via CLI
```bash
npm install -g netlify-cli
netlify login
cd ppsdm-kmits
npm run build
netlify deploy --prod --dir=.next
```

### Via Dashboard
1. Connect your GitHub repo at [app.netlify.com](https://app.netlify.com)
2. Set **Build command**: `npm run build`
3. Set **Publish directory**: `.next`
4. Add all environment variables in Site Settings → Environment Variables
5. Deploy

---

## Deploy to Vercel

```bash
npm install -g vercel
vercel login
cd ppsdm-kmits
vercel --prod
```

Add environment variables in the Vercel dashboard under Project Settings → Environment Variables.

---

## Post-Deploy Checklist

- [ ] Verify all pages load correctly
- [ ] Test Google Sheets data appears on Activities page
- [ ] Confirm webhook receives updates from Apps Script
- [ ] Check Sentry for errors
- [ ] Run Lighthouse audit on key pages
- [ ] Verify admin login works
