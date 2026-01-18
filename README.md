# PPSDM KMM

> **Platform Pengembangan Sumber Daya Mahasiswa - Himpunan Mahasiswa Mesin (HMM) ITS**

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Ready-green)](https://supabase.com/)
[![PWA](https://img.shields.io/badge/PWA-Enabled-purple)](https://web.dev/progressive-web-apps/)

## 🎯 About

PPSDM KMM is a comprehensive student development platform built on the **9 Dimensions of Human Development** framework:

| Dimension | Description |
|-----------|-------------|
| 🕐 Self-Management | Time, energy, focus, and productivity |
| 🧠 Intellectual | Learning, creativity, digital literacy |
| 💰 Financial | Financial literacy, budgeting, investments |
| 💪 Physical | Fitness, nutrition, sleep, health |
| 💚 Emotional | Self-awareness, empathy, communication |
| 🧘 Mental | Resilience, stress management, mindfulness |
| ⭐ Character | Integrity, discipline, ethics |
| 🕊️ Spiritual | Purpose, gratitude, altruism |
| 🌿 Environmental | Sustainability, minimalism, balance |

## ✨ Features

- **📊 Scientific Gap Analysis** - 100+ validated assessment questions
- **🗺️ Personalized Roadmap** - AI-powered development plans
- **📱 Progressive Web App** - Installable, offline-capable
- **🎮 Gamification** - XP, badges, and levels
- **👥 Mentorship** - Peer connections and mentor matching
- **📚 Free Resources** - Curated learning materials
- **📈 Progress Tracking** - Weekly goals and milestones

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/your-org/ppsdm-kmm.git
cd ppsdm-kmm

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Configure Supabase credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
ppsdm-kmm/
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── onboarding/        # 4-layer registration
│   │   ├── comprehensive-assessment/ # 8-module assessment
│   │   ├── gap-analysis/      # Gap visualization
│   │   ├── roadmap/           # Development plan
│   │   └── dashboard/         # Main dashboard
│   ├── components/            # React components
│   └── lib/                   # Utilities & hooks
├── supabase/
│   ├── complete_migration.sql # Full database schema (40+ tables)
│   └── comprehensive_assessment.sql # Assessment questions
└── public/                    # Static assets & PWA
```

## 📊 Database Schema

The platform uses **40+ PostgreSQL tables** including:

- **Users & Auth** - Profiles, roles, sessions
- **9 Dimensions** - Competencies, benchmarks
- **Assessments** - Questions, sessions, responses
- **Goals** - Milestones, activities, time blocks
- **Resources** - Learning materials, recommendations
- **Gamification** - Badges, XP, levels

## 🔧 Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Database | Supabase (PostgreSQL) |
| Styling | CSS Variables + Tailwind |
| Auth | Supabase Auth |
| Animations | Framer Motion |
| State | Zustand |
| PWA | Service Worker |

## 📱 PWA Features

- **Installable** on mobile & desktop
- **Offline support** with service worker
- **Push notifications** for reminders
- **Full-screen mode** on mobile

## 🎨 Design System

Built with HMM's design tokens:

```css
--its-blue: #003366
--engineering-red: #CC0000
--accent-blue: #0066CC
--hmm-gold: #FFD700
```

## 📈 API Endpoints

| Endpoint | Description |
|----------|-------------|
| `/api/registration` | 4-layer registration flow |
| `/api/comprehensive-assessment` | Assessment sessions |
| `/api/comprehensive-assessment/responses` | Submit answers |
| `/api/comprehensive-assessment/complete` | Calculate gaps |
| `/api/roadmap` | Development plans |
| `/api/resources` | Free learning catalog |
| `/api/domains` | 9-dimension tracking |

## 🚀 Deployment

```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod

# Run Supabase migrations
supabase db push
```

## 📄 License

MIT © 2024 HMM ITS

---

Built with ❤️ by the PPSDM KMM Development Team
