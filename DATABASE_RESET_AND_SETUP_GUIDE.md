# PPSDM KMITS - Database Reset & Complete Setup Guide

## 📋 Overview

Panduan ini menjelaskan cara mereset database Supabase dan mempush schema lengkap yang mencakup semua fitur sistem PPSDM KMITS.

## 🎯 Features Covered

1. **9 Dimensions Assessment Framework** - Kecerdasan Spiritual, Emosional, Intelektual, Fisik, Sosial, Finansial, Okupasional, Lingkungan, Karakter
2. **LMS (Learning Management System)** - Courses, Modules, Lessons, Quizzes
3. **Gamification** - XP, Badges, Levels, Streaks
4. **Ebook Processing** - Google Drive integration, AI content generation
5. **Content Aggregator** - YouTube, News, GitHub scraping
6. **AI Tutor** - Chat sessions, RAG vector store
7. **Social Features** - Study groups, peer reviews
8. **Journal** - Personal reflection entries

## 🔧 Files Created

### SQL Schema Files
| File | Description |
|------|-------------|
| `supabase/complete_integrated_schema.sql` | Schema utama lengkap dengan semua tabel |
| `supabase/rls_policies.sql` | Row Level Security policies |
| `supabase/reset_and_push_schema.sql` | Script reset lengkap (alternatif) |

### Python Scripts
| File | Description |
|------|-------------|
| `scripts/execute_complete_schema.py` | Script eksekusi schema via REST API |
| `scripts/reset_and_setup_database.py` | Script setup lengkap dengan MCP |

## 🚀 Quick Start

### Method 1: Using Supabase Dashboard (Recommended)

1. **Login to Supabase Dashboard**
   - URL: https://supabase.com/dashboard
   - Project: `xncugiuvaetzjxuyfsko`

2. **Open SQL Editor**
   - Navigate to: SQL Editor → New Query

3. **Execute Schema**
   - Copy content from `supabase/complete_integrated_schema.sql`
   - Paste ke SQL Editor
   - Click "Run"
   - Repeat for `supabase/rls_policies.sql`

4. **Verify Setup**
   ```sql
   -- Check tables
   SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
   
   -- Check dimensions
   SELECT * FROM dimensions ORDER BY order_index;
   
   -- Check badges
   SELECT * FROM badges;
   ```

### Method 2: Using Python Script

```bash
# Set service role key (required for full access)
export SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Run setup
cd ppsdm-kmits
python scripts/execute_complete_schema.py
```

### Method 3: Using Supabase CLI

```bash
# Login
supabase login

# Link project
supabase link --project-ref xncugiuvaetzjxuyfsko

# Execute schema
supabase db execute --file supabase/complete_integrated_schema.sql
supabase db execute --file supabase/rls_policies.sql
```

## 📊 Database Schema Structure

### Core Tables
```
auth.users (Supabase managed)
├── profiles (extends auth.users)
├── faculties
├── departments
```

### 9 Dimensions Framework
```
dimensions (9 fixed records)
├── assessments
├── dimension_stats
├── goals
└── idps (Individual Development Plans)
```

### LMS
```
courses
├── modules
│   ├── lessons
│   │   └── quizzes
│   │       └── questions
├── enrollments
└── user_lesson_progress
```

### Gamification
```
badges (7 default badges)
├── user_badges
├── user_xp
├── xp_history
└── xp_transactions
```

### Ebook Processing
```
ebooks
├── ebook_content
└── courses_from_ebooks
```

### Content Aggregator
```
content_sources
└── aggregated_content
```

### AI Tutor
```
chat_sessions
├── chat_messages
└── knowledge_vectors (pgvector)
```

### Social & Journal
```
study_groups
├── study_group_members
├── peer_reviews
└── journal_entries
```

## 🔐 Security (RLS)

All tables have Row Level Security enabled with policies:

- **Profiles**: Public read, own write
- **Assessments/Goals/IDPs**: Own data only
- **Courses**: Public read published, admin write
- **Enrollments**: Own data only
- **Gamification**: Public read badges/XP, own write
- **Chat**: Private to user
- **Journal**: Private to user

## 🗄️ Storage Buckets

Created automatically:
- `avatars` - User profile pictures
- `course-content` - Course materials
- `ebooks` - PDF files
- `certificates` - Generated certificates
- `badges` - Badge images
- `journal` - Private journal attachments
- `content` - Aggregated content

## 📈 Indexes & Performance

All tables have optimized indexes:
- Primary keys (UUID)
- Foreign key indexes
- Search indexes (category, status, etc.)
- Vector similarity index (pgvector)

## 🔄 Triggers & Functions

Auto-executed triggers:
- `on_auth_user_created` - Auto-create profile
- `on_assessment_completed` - Update dimension stats
- `xp_added` - Calculate XP and levels
- `update_updated_at_column` - Auto-update timestamps
- `update_dimension_improvement` - Calculate score changes

## 🧪 Testing the Setup

```sql
-- Test 1: Check all tables
SELECT 
    tablename,
    pg_size_pretty(pg_total_relation_size(tablename::regclass)) as size
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Test 2: Check RLS enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND rowsecurity = true;

-- Test 3: Check extensions
SELECT extname, extversion FROM pg_extension;

-- Test 4: Check views
SELECT viewname FROM pg_views WHERE schemaname = 'public';

-- Test 5: Check triggers
SELECT tgname, tgrelid::regclass as table 
FROM pg_trigger 
WHERE NOT tgisinternal;
```

## 🚨 Reset Database (Caution!)

To completely reset and start fresh:

```sql
-- WARNING: This will DELETE ALL DATA
-- Execute in SQL Editor:

-- Drop all tables (cascade)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

-- Re-run complete schema
-- Copy from complete_integrated_schema.sql
```

## 📞 Troubleshooting

### Issue: Permission Denied
**Solution**: Use service_role key instead of anon key

### Issue: Extension not found
**Solution**: Enable extensions in Dashboard:
- Database → Extensions → Enable `uuid-ossp`, `pgcrypto`, `vector`

### Issue: Vector operations fail
**Solution**: Ensure pgvector extension is enabled:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### Issue: Storage buckets not created
**Solution**: Create manually in Dashboard:
- Storage → New Bucket

## 📝 Migration History

| Version | Date | Changes |
|---------|------|---------|
| 2.0.0 | 2025-01-XX | Complete integrated schema |
| 1.0.0 | 2024-XX-XX | Initial separate schemas |

## 🔗 Related Files

- `supabase/setup_complete_database.sql` - Legacy schema
- `supabase/migrations/` - Migration files
- `scripts/verify_database_setup.py` - Verification script

## ✅ Post-Setup Checklist

- [ ] All 9 dimensions inserted
- [ ] Default badges created
- [ ] RLS policies active
- [ ] Storage buckets created
- [ ] Extensions enabled
- [ ] Triggers functioning
- [ ] Test user can register
- [ ] Test assessment can be saved

## 📚 Documentation

For more details, see:
- `SUPABASE_SETUP_GUIDE.md`
- `MCP_INTEGRATION_GUIDE.md`
- `docs/AI_ML_IMPLEMENTATION.md`

---

**PPSDM KMITS Team** | 2025
