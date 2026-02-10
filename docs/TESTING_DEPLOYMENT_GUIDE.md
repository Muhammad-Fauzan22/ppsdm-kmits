# PPSDM KMITS - Testing & Deployment Guide

## 📋 Table of Contents

1. [Testing Setup](#testing-setup)
2. [Running Tests](#running-tests)
3. [Deployment Setup](#deployment-setup)
4. [Deploying to Vercel](#deploying-to-vercel)
5. [CI/CD Pipelines](#cicd-pipelines)
6. [Troubleshooting](#troubleshooting)

---

## 🧪 Testing Setup

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git

### Install Dependencies

```bash
npm install
```

### Test Files Structure

```
ppsdm-kmits/
├── tests/
│   ├── google-sheets-integration.test.ts  # Google Sheets API tests
│   ├── sheet-parser.test.ts               # Sheet Parser Engine tests
│   ├── page-generator.test.ts             # Dynamic Page Generator tests
│   ├── automation.test.ts                 # Automation features tests
│   └── integration.test.ts                # End-to-end integration tests
├── e2e/
│   └── critical-flows.spec.ts             # Playwright E2E tests
└── src/tests/
    └── setup.ts                           # Vitest setup file
```

---

## 🏃 Running Tests

### Unit Tests (Vitest)

```bash
# Run all tests once
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### E2E Tests (Playwright)

```bash
# Run all E2E tests
npm run e2e

# Run E2E tests in headed mode
npx playwright test --headed

# Run specific test file
npx playwright test e2e/critical-flows.spec.ts

# Run tests in specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Linting

```bash
# Run ESLint
npm run lint

# Fix linting issues
npm run lint:fix
```

### Security Audit

```bash
# Run security audit
npm run security-scan
```

---

## 🚀 Deployment Setup

### Prerequisites

1. **Vercel Account**
   - Sign up at [vercel.com](https://vercel.com)
   - Install Vercel CLI: `npm install -g vercel`

2. **Google Cloud Project**
   - Create a project at [console.cloud.google.com](https://console.cloud.google.com)
   - Enable Google Sheets API
   - Create a service account

3. **Environment Variables**
   - Copy `.env.production.example` to `.env.production`
   - Fill in all required values

### Setup Google Sheets Integration

```bash
# Run the setup script
./scripts/setup-google-sheets.sh

# Or use quick mode if credentials already exist
./scripts/setup-google-sheets.sh --quick
```

The script will guide you through:
1. Creating a Google Cloud Project
2. Enabling Google Sheets API
3. Creating a Service Account
4. Granting spreadsheet access
5. Creating credentials
6. Encoding credentials for Vercel

### Environment Variables

Add these to your Vercel project:

```bash
# Application
NEXT_PUBLIC_APP_URL=https://ppsdm-kmits.vercel.app

# Google Sheets
NEXT_PUBLIC_GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id
GOOGLE_SERVICE_ACCOUNT_CREDENTIALS=your_base64_encoded_credentials

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Providers
OPENAI_API_KEY=sk-your-key
GROQ_API_KEY=gsk-your-key
GOOGLE_AI_API_KEY=your-key
```

---

## 📦 Deploying to Vercel

### Using Deployment Script

```bash
# Deploy to production
./scripts/deploy.sh production

# Deploy to preview
./scripts/deploy.sh preview

# Deploy to development
./scripts/deploy.sh development
```

### Using Vercel CLI

```bash
# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Manual Deployment via Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click "Deployments"
4. Click "Redeploy" or push to main branch

---

## 🔄 CI/CD Pipelines

### Test Workflow (`.github/workflows/test.yml`)

Triggers on:
- Push to any branch
- Pull requests to main/develop
- Manual trigger

Jobs:
1. **Lint & Type Check** - ESLint and TypeScript checks
2. **Unit Tests** - Vitest tests with coverage
3. **Integration Tests** - Database integration tests
4. **E2E Tests** - Playwright tests across browsers
5. **Google Sheets Tests** - API integration tests
6. **Automation Tests** - Automation features tests
7. **Performance Tests** - Lighthouse CI
8. **Test Summary** - Aggregates all results

### Deploy Workflow (`.github/workflows/deploy.yml`)

Triggers on:
- Push to main branch
- Manual trigger

Jobs:
1. **Test** - Run all tests
2. **Build** - Build the application
3. **Deploy** - Deploy to Vercel
4. **E2E Test** - Test deployed application
5. **Notify** - Send notifications
6. **Release** - Create GitHub release

### Required GitHub Secrets

Add these to your repository settings:

```bash
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
GOOGLE_TEST_CREDENTIALS=your_test_credentials
```

---

## 🔧 Troubleshooting

### Tests Failing

**Issue: Tests fail with "Module not found"**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

**Issue: E2E tests timeout**
```bash
# Increase timeout in playwright.config.ts
# actionTimeout: 30000
```

**Issue: Google Sheets tests fail**
```bash
# Verify credentials are properly set
echo $GOOGLE_APPLICATION_CREDENTIALS
```

### Deployment Issues

**Issue: Build fails on Vercel**
```bash
# Check build logs in Vercel dashboard
# Verify all environment variables are set
# Ensure Node.js version is 18+
```

**Issue: Google Sheets not working**
```bash
# Verify spreadsheet ID is correct
# Check service account has editor access
# Ensure credentials are base64 encoded
```

**Issue: Environment variables not loading**
```bash
# Verify .env.production exists
# Check variable names match exactly
# Restart deployment after adding variables
```

### Performance Issues

**Issue: Slow build times**
```bash
# Use Vercel caching
# Optimize dependencies
# Use Next.js dynamic imports
```

**Issue: High memory usage**
```bash
# Increase Vercel function memory limit
# Optimize database queries
# Use caching strategies
```

---

## 📊 Monitoring

### Vercel Dashboard

- **Deployments**: View deployment history
- **Logs**: Real-time logs and errors
- **Analytics**: Performance metrics
- **Settings**: Environment variables and configuration

### Sentry Error Tracking

```bash
# View errors at sentry.io
# Check for runtime errors
# Monitor performance issues
```

### Lighthouse CI

```bash
# View performance reports
# Check accessibility scores
# Monitor best practices
```

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vitest Documentation](https://vitest.dev)
- [Playwright Documentation](https://playwright.dev)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review GitHub Actions logs
3. Check Vercel deployment logs
4. Open an issue on GitHub

---

**Last Updated**: 2026-02-10
