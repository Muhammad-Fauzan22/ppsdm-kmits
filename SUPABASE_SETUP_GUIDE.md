# Supabase Setup Guide for PPSDM KMITS

Complete guide for setting up the PPSDM KMITS database on Supabase.

## Quick Start

Choose one of the following methods:

### Option 1: Automated Setup (Recommended for Developers)

```bash
# 1. Set environment variables in .env.local
#    - NEXT_PUBLIC_SUPABASE_URL
#    - SUPABASE_SERVICE_ROLE_KEY

# 2. Run one-click setup
./scripts/one_click_setup.sh
```

### Option 2: Manual Setup (Recommended for Production)

1. Go to [Supabase Dashboard](https://app.supabase.com/project/_/sql)
2. Copy contents from `supabase/setup_complete_database.sql`
3. Paste into SQL Editor and click **Run**

### Option 3: Python Script Setup

```bash
# Install dependencies
pip install supabase

# Set environment variables
export NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Run setup
python scripts/setup_supabase_database.py
```

---

## Prerequisites

### 1. Supabase Account
- Sign up at [supabase.com](https://supabase.com)
- Create a new project
- Wait for project initialization (2-3 minutes)

### 2. Environment Variables

Get these from your Supabase Dashboard → Project Settings → API:

| Variable | Location | Used For |
|----------|----------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project Settings → API → URL | Client & Server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Project Settings → API → anon public | Client & Server |
| `SUPABASE_SERVICE_ROLE_KEY` | Project Settings → API → service_role secret | Database Setup Only |

Create `.env.local`:
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI APIs
GROQ_API_KEY=your-groq-api-key
OPENROUTER_API_KEY=your-openrouter-api-key

# Sentry (optional)
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn

# Upstash Redis (optional)
UPSTASH_REDIS_REST_URL=your-upstash-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-token
```

---

## Detailed Setup Instructions

### Method 1: Manual SQL Execution

1. **Navigate to SQL Editor**
   - Open your Supabase Dashboard
   - Click **SQL Editor** in the left sidebar
   - Click **New query**

2. **Create exec_sql Function First**
   - Open `supabase/exec_sql_function.sql`
   - Copy entire contents
   - Paste into SQL Editor
   - Click **Run**
   - This creates the function needed for automated setup

3. **Run Complete Schema**
   - Open `supabase/setup_complete_database.sql`
   - Copy entire contents
   - Paste into SQL Editor
   - Click **Run**
   - Wait for completion (may take 30-60 seconds)

4. **Verify Setup**
   - Run verification query:
   ```sql
   SELECT * FROM check_setup_status();
   ```

### Method 2: Automated Python Script

1. **Install Python Dependencies**
   ```bash
   pip install supabase python-dotenv
   ```

2. **Ensure exec_sql Function Exists**
   - Run the `exec_sql_function.sql` first (one time only)
   - This can be done manually or via the script

3. **Run Setup Script**
   ```bash
   # From project root
   python scripts/setup_supabase_database.py
   ```

4. **Verify Results**
   ```bash
   python scripts/verify_database_setup.py
   ```

### Method 3: One-Command Setup (Bash)

1. **Make Script Executable**
   ```bash
   chmod +x scripts/one_click_setup.sh
   ```

2. **Run Setup**
   ```bash
   ./scripts/one_click_setup.sh
   ```

3. **Follow Prompts**
   - Script checks for environment variables
   - Installs dependencies if needed
   - Runs database setup
   - Verifies results

---

## Verification

### Quick Verification

Run this SQL in the Supabase SQL Editor:

```sql
-- Check table counts
SELECT 
    (SELECT COUNT(*) FROM dimensions) as dimensions_count,
    (SELECT COUNT(*) FROM badges) as badges_count,
    (SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public' AND tablename NOT LIKE 'pg_%') as total_tables;
```

**Expected Results:**
- `dimensions_count`: 9
- `badges_count`: 7 (or more)
- `total_tables`: 20+

### Detailed Verification

Use the verification script:

```bash
python scripts/verify_database_setup.py
```

Or check individual tables:

```sql
-- List all tables
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Check dimensions
SELECT slug, name FROM dimensions ORDER BY order_index;

-- Check badges
SELECT name, description FROM badges;
```

---

## Troubleshooting

### Common Issues

#### Issue: "exec_sql function does not exist"

**Solution:** Run `exec_sql_function.sql` first:

```sql
-- Quick fix
CREATE OR REPLACE FUNCTION exec_sql(query text)
RETURNS void AS $$
BEGIN
  EXECUTE query;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION exec_sql(text) TO service_role;
```

#### Issue: "Permission denied"

**Solution:** Ensure you're using the **Service Role Key**, not the Anon Key.

- Anon Key: Starts with `eyJhbGciOiJIUzI1NiIs...` (for client-side)
- Service Role Key: Different key for server-side/admin operations

#### Issue: "Table already exists"

**Solution:** This is normal - the script uses `CREATE TABLE IF NOT EXISTS`. You can ignore these warnings or reset:

```sql
-- DANGER: This deletes all data!
DROP TABLE IF EXISTS profiles, dimensions, assessments, ... CASCADE;
```

#### Issue: Python import error

**Solution:** Install dependencies:

```bash
pip install supabase
# or
pip install -r scripts/requirements.txt
```

#### Issue: "SSL certificate verify failed"

**Solution:** Update certificates or use:

```bash
# Linux/Mac
export SSL_CERT_FILE=/path/to/cacert.pem

# Windows PowerShell
$env:SSL_CERT_FILE="C:\path\to\cacert.pem"
```

---

## Security Notes

### Service Role Key

⚠️ **WARNING:** The Service Role Key bypasses all Row Level Security (RLS). Keep it secret!

- Never expose in client-side code
- Never commit to Git (add to `.gitignore`)
- Rotate if compromised

### Recommended Setup Flow

1. **Development:** Use automated setup with Service Role Key
2. **Staging:** Manual SQL execution for controlled deployment
3. **Production:** Manual SQL execution + review each statement

---

## Post-Setup Steps

### 1. Enable Authentication Providers (Optional)

Supabase Dashboard → Authentication → Providers:

- **Email:** Enabled by default
- **Google:** Add OAuth credentials
- **GitHub:** Add OAuth app

### 2. Configure Storage (Optional)

For file uploads:

```sql
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
('avatars', 'avatars', true),
('courses', 'courses', false),
('ebooks', 'ebooks', false);
```

### 3. Set Up RLS Policies

The setup script includes RLS policies. Verify they're active:

```sql
-- Check RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

### 4. Configure Realtime (Optional)

Enable realtime for specific tables:

```sql
-- Enable realtime for notifications
BEGIN;
  -- Remove if exists
  DELETE FROM supabase_realtime.publication 
  WHERE table_name = 'notifications';
  
  -- Add to publication
  ALTER PUBLICATION supabase_realtime 
  ADD TABLE notifications;
COMMIT;
```

---

## Database Schema Overview

### Core Tables

| Table | Purpose |
|-------|---------|
| `profiles` | User profiles extending auth.users |
| `dimensions` | 9 Dimensions framework |
| `assessments` | Assessment results |
| `courses` | Course catalog |
| `modules` | Course modules |
| `lessons` | Module lessons |
| `enrollments` | User course enrollments |

### Gamification Tables

| Table | Purpose |
|-------|---------|
| `user_xp` | Experience points |
| `badges` | Achievement badges |
| `certificates` | Course certificates |
| `user_achievements` | User achievements |

### Content Tables

| Table | Purpose |
|-------|---------|
| `ebooks` | E-book library |
| `ebook_chapters` | E-book chapters |
| `goals` | User goals |
| `idp_plans` | Individual Development Plans |

---

## Next Steps

After database setup:

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Create First Admin User**
   - Sign up via the app
   - Run SQL to promote to admin:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
   ```

3. **Run Tests**
   ```bash
   npm test
   ```

---

## Support

For issues:
1. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. Review Supabase docs: https://supabase.com/docs
3. Open an issue on GitHub

---

## Summary

| Method | Best For | Difficulty |
|--------|----------|------------|
| Manual SQL | Production, learning | Easy |
| Python Script | Development, automation | Medium |
| One-Click | Quick setup, CI/CD | Easy |

**Recommended:** Start with Manual SQL to understand the schema, then use Python Script for development.
