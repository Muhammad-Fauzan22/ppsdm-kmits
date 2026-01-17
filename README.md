# PPSDM KMITS

> **Platform Pengembangan Sumber Daya Mahasiswa** - A Holistic Student Development Ecosystem for ITS (Institut Teknologi Sepuluh Nopember)

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat-square&logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-Ready-3ecf8e?style=flat-square&logo=supabase)

## 🎯 Overview

PPSDM KMITS is a comprehensive student development platform built on the **9 Dimensions of Human Development** framework:

1. **Kognitif** (Cognitive) - Academic & intellectual growth
2. **Afektif** (Affective) - Emotional intelligence
3. **Psikomotorik** (Psychomotor) - Physical skills
4. **Spiritual** - Religious & spiritual development
5. **Sosial** (Social) - Interpersonal skills
6. **Finansial** (Financial) - Financial literacy
7. **Kesehatan** (Health) - Physical & mental wellness
8. **Karakter** (Character) - Personal values & ethics
9. **Lingkungan** (Environmental) - Sustainability awareness

## ✨ Features

### For Students
- 📊 **Personal Dashboard** - Track your development across all 9 dimensions
- 📈 **Analytics** - Visualize your growth journey with interactive charts
- 📝 **RPI Management** - Plan your Individual Development Goals
- 🎨 **Portfolio Builder** - Create professional portfolios
- 🏆 **Achievements** - Earn badges and track progress

### For Mentors
- 👥 **Mentee Management** - Track multiple students' progress
- 💬 **Feedback System** - Provide guidance and evaluations
- 📅 **Session Scheduling** - Manage mentorship appointments

### For Administrators
- 📋 **Program Management** - Create and manage development programs
- 📊 **Analytics Dashboard** - Monitor platform-wide metrics
- 🔔 **Announcements** - Communicate with all users

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (for backend)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/ppsdm-kmits.git
cd ppsdm-kmits

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Add your Supabase credentials to .env.local
# NEXT_PUBLIC_SUPABASE_URL=your_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Database Setup

Run the SQL migration in your Supabase SQL Editor:

```bash
# Located at:
supabase/migrations/001_initial_schema.sql
```

## 📁 Project Structure

```
ppsdm-kmits/
├── public/
│   ├── manifest.json    # PWA manifest
│   └── sw.js            # Service worker
├── src/
│   ├── app/             # Next.js App Router pages
│   │   ├── api/         # API routes
│   │   ├── dashboard/   # Student dashboard
│   │   ├── admin/       # Admin portal
│   │   └── ...          # Other pages
│   ├── components/      # Reusable UI components
│   │   ├── Animations.tsx
│   │   ├── Charts.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── Header.tsx
│   │   ├── Loading.tsx
│   │   └── Sidebar.tsx
│   └── lib/
│       ├── database.types.ts  # TypeScript types
│       ├── hooks.ts           # Custom React hooks
│       ├── stores.ts          # Zustand state stores
│       ├── supabase/          # Supabase clients
│       └── utils.ts           # Utility functions
└── supabase/
    └── migrations/      # SQL migration scripts
```

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **State** | Zustand |
| **Charts** | Recharts |
| **Animations** | Framer Motion |
| **Database** | PostgreSQL (Supabase) |
| **Auth** | Supabase Auth |
| **Icons** | Material Symbols |

## 🎨 Design System

### Colors
- **Primary**: `#330066` (Deep Purple)
- **ITS Blue**: `#003366`
- **Growth Green**: `#27AE60`
- **Active Yellow**: `#F2C94C`

### Typography
- **Font**: Inter (Google Fonts)
- **Icons**: Material Symbols Outlined

## 📱 PWA Support

The app is fully PWA-ready with:
- ✅ Web App Manifest
- ✅ Service Worker (offline caching)
- ✅ iOS/Android install prompts
- ✅ Push notification support

## 🧪 Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## 📦 API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/profile` | GET | Get user profile |
| `/api/profile` | PATCH | Update profile |
| `/api/activities` | GET | List activities |
| `/api/activities` | POST | Create activity |

## 🔒 Authentication

The platform uses Supabase Auth with:
- Email/Password authentication
- ITS SSO integration (planned)
- Protected routes via middleware

## 📄 License

This project is part of the PPSDM initiative by Kabinet Mahasiswa ITS.

---

Built with ❤️ by the PPSDM KMITS Development Team
