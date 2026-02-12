# PPSDM KMM Database Setup Fix

## ✅ Completed Tasks
- [x] Analyzed the problematic REST API script (`setup_supabase_rest.py`)
- [x] Identified issues: rpc/exec_sql doesn't exist by default, fragile SQL splitting
- [x] Created new direct database connection script (`setup_db_direct.py`) using psycopg2
- [x] Script uses proper connection string format for Supabase
- [x] Script handles large SQL files without manual splitting

## 📋 Next Steps
- [ ] Install required dependencies: `pip install psycopg2-binary python-dotenv`
- [ ] Get database password from Supabase dashboard (not API key)
- [ ] Run the new script: `python scripts/setup_db_direct.py`
- [ ] Verify database setup with `scripts/verify_database_setup.py`

## 🔧 Alternative Methods (if direct connection fails)
1. **Supabase Dashboard (Easiest)**:
   - Go to https://supabase.com/dashboard/project/xncugiuvaetzjxuyfsko
   - Open SQL Editor
   - Copy/paste contents of `supabase/setup_complete_database.sql`
   - Click Run

2. **Supabase CLI (if installed)**:
   - `supabase db push`

## 📝 Notes
- The new script uses Transaction Pooler connection (port 6543)
- Requires database password, not service role key
- Handles complex SQL with functions and triggers properly
- No need to create exec_sql function manually
