# UI Implementation Plan - PPSDM KMITS

## Overview
Berdasarkan analisis 40+ UI designs di folder `stitch_ppsdm_idea_1`, berikut adalah rencana implementasi lengkap untuk frontend dan backend.

## A. Design System & Component Library

### 1. Core Design Tokens
```
Colors:
- Primary: #135bec (ITS Blue)
- Secondary: #FFD700 (Gold)
- Success: #10b981
- Warning: #f59e0b
- Danger: #ef4444
- Background: #0A0F1A (Dark)
- Surface: #1a1f2e
- Border: #334155

Typography:
- Font: Inter, system-ui
- Headings: 600 weight
- Body: 400 weight

Spacing:
- Base: 4px
- Scale: 4, 8, 12, 16, 24, 32, 48, 64
```

### 2. Component Library Structure
```
components/
├── ui/                    # Base UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── Badge.tsx
│   ├── Avatar.tsx
│   ├── Progress.tsx
│   └── Tooltip.tsx
├── layout/                # Layout components
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Container.tsx
├── charts/                # Chart components
│   ├── RadarChart.tsx
│   ├── SunburstChart.tsx
│   ├── GaugeChart.tsx
│   └── TimelineChart.tsx
└── assessment/            # Assessment-specific
    └── (sudah dibuat 10 diagram)
```

## B. Frontend Implementation Roadmap

### Phase 1: Core Infrastructure (Week 1)
1. **Design System Setup**
   - Tailwind configuration extended
   - Color palette implementation
   - Typography system
   - Spacing scale
   - Animation library (Framer Motion)

2. **Base Components**
   - Button variants (primary, secondary, ghost, danger)
   - Card components (default, hoverable, clickable)
   - Input components (text, select, textarea, checkbox)
   - Modal/Dialog system
   - Toast notifications

### Phase 2: Landing Pages (Week 2)
Berdasarkan 4 versi landing page designs:

1. **Landing Page V1** - Hero Focus
   - Full-screen hero section
   - Animated background
   - CTA buttons
   - Stats counter

2. **Landing Page V2** - Feature Focus
   - Feature grid layout
   - Interactive cards
   - Testimonials section

3. **Landing Page V3** - Content Focus
   - Rich content sections
   - Video integration
   - FAQ accordion

4. **Landing Page V4** - Conversion Focus
   - Lead capture forms
   - Social proof
   - Trust badges

### Phase 3: Dashboard Views (Week 3-4)

#### Student Dashboard
- Overview cards (9 dimensions summary)
- Quick actions menu
- Recent activities feed
- Progress charts
- Notifications panel

#### Holistic Development Dashboard
- 9-Dimension radar chart
- Timeline progression
- Goal setting interface
- Achievement badges

#### AI-Powered Quantum Learning Library
- Resource search with AI
- Recommendation engine
- Bookmarking system
- Progress tracking
- Multi-modal viewer (video, PDF, interactive)

### Phase 4: Assessment & Portfolio (Week 5-6)

1. **Assessment System** (Sudah 90% selesai)
   - 10 diagram visualizations ✓
   - Questionnaire interface
   - Results interpretation
   - Recommendations engine

2. **Portfolio Management**
   - Achievement gallery
   - Certificate showcase
   - Activity timeline
   - Skills matrix
   - Export to PDF

3. **Student Activity Portfolio**
   - Activity logging
   - Photo/documentation upload
   - Supervisor approval workflow
   - Verification system

### Phase 5: Admin & Supervisor (Week 7-8)

1. **Admin Command Center**
   - System health monitoring
   - User management
   - Content moderation
   - Analytics dashboard
   - API management

2. **Supervisor Dashboard**
   - Mentee list view
   - Cohort analytics
   - Approval queue
   - Performance reports
   - Messaging system

3. **Approval Workflow**
   - Activity verification
   - Portfolio review
   - Bulk approval
   - Rejection with feedback

### Phase 6: Specialized Features (Week 9-10)

1. **AI Co-Creation & Brainstorming Lab**
   - AI-assisted ideation
   - Collaborative workspace
   - Mind mapping
   - Export options

2. **Biometric & Health Sync**
   - Wearable integration
   - Health metrics display
   - Trend analysis
   - Recommendations

3. **Habit Forge & Energy Analytics**
   - Habit tracker
   - Streak counter
   - Energy level logging
   - Correlation analysis

4. **Digital Twin - Vision 2034**
   - Future scenario simulation
   - Career path visualization
   - Skill gap analysis
   - Industry alignment

5. **Peer Coaching Marketplace**
   - Coach profiles
   - Booking system
   - Session management
   - Rating & review

6. **Industry Skill Gap Mapper**
   - Industry requirements
   - Personal skill matrix
   - Gap analysis
   - Learning recommendations

### Phase 7: Mobile & Responsive (Week 11)

1. **Mobile Bottom Navigation**
   - Tab bar component
   - Swipe gestures
   - Optimized touch targets

2. **Mobile-specific Views**
   - Simplified dashboard
   - Quick actions
   - Offline support
   - Push notifications

3. **Responsive Adaptations**
   - Breakpoint system
   - Layout adjustments
   - Touch-friendly controls

## C. Backend Implementation Roadmap

### Phase 1: Core Infrastructure (Week 1-2)

1. **Database Schema (Supabase)**
```sql
-- Core Tables
users (id, email, role, profile_data)
profiles (id, user_id, full_name, avatar, faculty)
assessments (id, user_id, dimension_scores, timestamp)
dimensions (id, name, description, weight)

-- Portfolio Tables
achievements (id, user_id, title, description, evidence_url)
activities (id, user_id, type, description, hours, status)
certificates (id, user_id, title, issuer, file_url)

-- Learning Tables
resources (id, title, type, content_url, tags)
bookmarks (id, user_id, resource_id)
progress (id, user_id, resource_id, percent_complete)

-- Social Tables
peer_coaching (id, coach_id, mentee_id, status)
sessions (id, coaching_id, scheduled_at, duration)
messages (id, sender_id, receiver_id, content)

-- System Tables
notifications (id, user_id, type, content, read)
approvals (id, activity_id, supervisor_id, status)
```

2. **Authentication & Authorization**
   - Supabase Auth integration
   - Role-based access (student, supervisor, admin)
   - JWT token management
   - Session handling

3. **API Layer (Next.js API Routes)**
   - RESTful API design
   - GraphQL (optional)
   - Rate limiting
   - Request validation

### Phase 2: Assessment Backend (Week 3)

1. **Assessment Engine** (Sudah selesai)
   - 9 dimension scoring ✓
   - IRT calculations
   - Normative data
   - Recommendation generation

2. **Assessment API Endpoints**
   ```
   POST /api/assessments/submit
   GET /api/assessments/:id/results
   GET /api/assessments/history
   GET /api/assessments/compare
   ```

3. **Report Generation**
   - PDF generation
   - Chart rendering server-side
   - Email delivery

### Phase 3: Portfolio Backend (Week 4)

1. **File Storage (Supabase Storage)**
   - Certificate uploads
   - Photo storage
   - Document management
   - CDN integration

2. **Portfolio API**
   ```
   POST /api/portfolio/activities
   PUT /api/portfolio/activities/:id
   DELETE /api/portfolio/activities/:id
   GET /api/portfolio/export
   ```

3. **Verification System**
   - OCR for certificates
   - Metadata extraction
   - Fraud detection

### Phase 4: AI Features Backend (Week 5-6)

1. **AI Integration**
   - OpenAI API
   - Vector database (Pinecone)
   - Embedding generation
   - RAG implementation

2. **AI Features**
   - Content recommendation
   - Learning path generation
   - Skill gap analysis
   - Career guidance

3. **API Endpoints**
   ```
   POST /api/ai/recommendations
   POST /api/ai/career-path
   POST /api/ai/skill-gap
   POST /api/ai/chat
   ```

### Phase 5: Real-time Features (Week 7)

1. **WebSocket Implementation**
   - Supabase Realtime
   - Live notifications
   - Chat system
   - Collaborative editing

2. **Notification System**
   - In-app notifications
   - Email notifications
   - Push notifications
   - Notification preferences

### Phase 6: Analytics & Reporting (Week 8)

1. **Analytics Engine**
   - Data aggregation
   - Trend analysis
   - Predictive modeling
   - Cohort analysis

2. **Reporting System**
   - Scheduled reports
   - Custom report builder
   - Data export
   - Visualization API

### Phase 7: Integrations (Week 9-10)

1. **External APIs**
   - ITS Academic System
   - LinkedIn API
   - Google Calendar
   - Fitness trackers

2. **Webhook System**
   - Event triggers
   - Third-party integrations
   - Automation workflows

## D. Feature Matrix

| Feature | Frontend | Backend | Status |
|---------|----------|---------|--------|
| 9-Dimension Assessment | 10 Diagrams | Scoring Engine | ✅ 90% |
|