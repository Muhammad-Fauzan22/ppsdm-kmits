# PPSDM KMITS

**Platform Pengembangan Sumber Daya Mahasiswa — Keluarga Mahasiswa ITS**

A holistic 9-dimension student development platform for Teknik Mesin ITS, built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## New Features (v2.0)

### 🎮 Gamification Engine
- **XP & Levels**: Dynamic progression system based on engagement.
- **Quests**: Daily challenges to boost student activity.
- **Badges**: Achievement system for milestones.
- **Leaderboard**: Competitive rankings to foster excellence.

### 🤖 AI Integration
- **Daily Wisdom**: AI-curated inspirational content.
- **Certificate Generation**: Automated PDF certificates for completed dimensions.

### 📱 Mobile Experience
- **PWA Support**: Installable on iOS/Android.
- **Offline Mode**: Core features available without internet.
- **Push Notifications**: Real-time updates for quests and announcements.

### 📊 Enterprise Analytics
- **Faculty Dashboard**: Real-time insights into student performance.
- **PDF Reporting**: One-click executive summary generation.

---

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

---

## Project Structure

```
ppsdm-kmits/
├── src/
│   ├── app/                    # Next.js App Router pages & API routes
│   │   ├── (admin)/            # Admin dashboard pages
│   │   ├── (auth)/             # Auth pages (login, register)
│   │   ├── (public)/           # Public-facing pages
│   │   ├── api/                # API routes
│   │   │   ├── sheets/         # Google Sheets CRUD + webhook
│   │   │   ├── auth/           # Authentication endpoints
│   │   │   ├── admin/          # Admin-only endpoints
│   │   │   └── webhooks/       # External webhooks
│   │   └── dashboard/          # Student dashboard
│   ├── components/             # Reusable React components
│   │   ├── ui/                 # shadcn/ui base components
│   │   ├── reports/            # Report generation & preview
│   │   ├── visualizations/     # Charts, sunbursts, radar
│   │   ├── lazy-components.tsx # Dynamic imports for code splitting
│   │   └── ErrorBoundary.tsx   # Error boundary wrapper
│   ├── lib/                    # Core libraries & utilities
│   │   ├── google-sheets/      # Sheets service, types, API
│   │   ├── sanitize.ts         # DOMPurify-based XSS prevention
│   │   ├── admin-auth.ts       # Admin authentication utilities
│   │   ├── redis-rate-limit.ts # Rate limiting with Redis fallback
│   │   └── validators.ts       # Zod validation schemas
│   ├── modules/                # Domain-driven modules
│   │   └── assessment/         # Assessment bounded context
│   │       └── domain/         # Entities, value objects, events
│   ├── middleware.ts           # Edge middleware (rate limit, CSP)
│   └── tests/                  # Test utilities & setup
├── docs/                       # Documentation & templates
├── public/                     # Static assets
├── spreadsheet-template.gs     # Google Apps Script for Sheets
├── next.config.mjs             # Next.js configuration
├── vitest.config.ts            # Test configuration
└── tailwind.config.ts          # Tailwind CSS configuration
```

---

## Key Technologies

| Category | Technology |
|----------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 |
| UI Components | shadcn/ui + Radix UI |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Data Source | Google Sheets API |
| Testing | Vitest |
| Error Tracking | Sentry |
| Deployment | Vercel / Netlify |
| Mobile | PWA (next-pwa) + Web Push |
| Analytics | Recharts + RPC Aggregation |
| PDF Engine | @react-pdf/renderer |

---

## Environment Variables

See `.env.example` for the full list. Key variables:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role (server only) |
| `GOOGLE_SHEET_ID` | Google Spreadsheet ID |
| `GOOGLE_SHEETS_CREDENTIALS_JSON` | Base64-encoded service account JSON |
| `WEBHOOK_SECRET` | HMAC secret for webhook authentication |
| `CSRF_SECRET` | CSRF protection secret |
| `JWT_SECRET` | JWT signing secret |

---

## Google Sheets Integration

This platform uses Google Sheets as the single source of truth for dynamic data:

1. **Setup**: Deploy `spreadsheet-template.gs` as an Apps Script
2. **Auto-sync**: Data changes trigger webhooks → cache invalidation
3. **Manual sync**: Use the custom menu in Google Sheets
4. **API**: `/api/sheets/*` endpoints serve typed, cached data

See [USER_GUIDE.md](USER_GUIDE.md) for non-technical instructions.

---

## Testing

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

Test files: `src/**/*.test.{ts,tsx}`

---

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for full instructions.

---

## Security

- **Rate Limiting**: Redis-based with in-memory fallback
- **XSS Prevention**: DOMPurify sanitization on all innerHTML
- **CSP Headers**: Content Security Policy via middleware
- **HMAC Webhooks**: SHA-256 signature verification with replay protection
- **Admin Auth**: Role-based access control via Supabase

See [SECURITY.md](SECURITY.md) for the security policy.

---

## License


---

**Last Updated:** 2026-02-14
