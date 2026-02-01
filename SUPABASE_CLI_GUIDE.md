# Supabase CLI Setup Guide

This guide walks you through setting up local Supabase development with the CLI.

## Prerequisites

- Docker Desktop installed and running (for local database)
- Supabase CLI installed (already included as dev dependency)
- Access to your Supabase cloud project

## Quick Start

### 1. Initialize Local Project

```bash
npx supabase init
```

This creates:
- `supabase/` directory with config
- `supabase/config.toml` - Local configuration
- `supabase/migrations/` - Database migrations
- `supabase/seed.sql` - Seed data

### 2. Link to Cloud Project

```bash
npx supabase link --project-ref <your-project-ref>
```

Get your project ref from:
- URL: `https://app.supabase.com/project/<project-ref>`
- Or Settings → General → Reference ID

You'll be prompted for your database password.

### 3. Pull Database Schema

```bash
npx supabase db pull
```

This downloads your cloud database schema to local migrations.

### 4. Start Local Development

```bash
npx supabase start
```

This starts:
- PostgreSQL database (localhost:54322)
- Supabase Studio (http://localhost:54323)
- Supabase Auth (http://localhost:54321)
- Realtime, Storage, Edge Functions

### 5. Access Local Studio

Open http://localhost:54323 in your browser.

Default local credentials:
- URL: `http://localhost:54321`
- Anon Key: See output from `supabase start`
- Service Role Key: See output from `supabase start`

## Common Commands

```bash
# Start local stack
npx supabase start

# Stop local stack
npx supabase stop

# View status
npx supabase status

# Link to project
npx supabase link --project-ref <ref>

# Pull schema changes
npx supabase db pull

# Push local changes to cloud
npx supabase db push

# Reset local database
npx supabase db reset

# View logs
npx supabase logs

# Generate types
npx supabase gen types typescript --local > src/lib/database.types.ts
```

## Development Workflow

### Daily Development

1. **Start local environment:**
   ```bash
   npx supabase start
   ```

2. **Develop with local database:**
   - Update `.env.local` to use local URLs:
   ```
   NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<local-anon-key>
   ```

3. **Make schema changes:**
   - Use Supabase Studio (http://localhost:54323)
   - Or create migration files in `supabase/migrations/`

4. **Create migrations from changes:**
   ```bash
   npx supabase db diff -f migration_name
   ```

5. **Reset and test:**
   ```bash
   npx supabase db reset
   ```

### Deploying Changes

1. **Push to cloud:**
   ```bash
   npx supabase db push
   ```

2. **Verify in cloud:**
   ```bash
   npx supabase db dump -f backup.sql
   ```

## Migration Management

### Creating Migrations

```bash
# Create empty migration
npx supabase migration new add_user_preferences

# Create migration from current diff
npx supabase db diff -f add_user_preferences
```

### Migration Files

Migrations are stored in `supabase/migrations/`:

```sql
-- supabase/migrations/20240101120000_add_user_preferences.sql

CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    theme TEXT DEFAULT 'light',
    notifications_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preferences" ON user_preferences
    FOR SELECT USING (auth.uid() = user_id);
```

### Applying Migrations

```bash
# Apply to local
npx supabase db reset

# Apply to cloud
npx supabase db push
```

## Configuration

### config.toml

Edit `supabase/config.toml` for local settings:

```toml
[api]
enabled = true
port = 54321
schemas = ["public", "storage", "graphql_public"]
extra_search_path = ["public", "extensions"]
max_rows = 1000

[db]
port = 54322
shadow_port = 54320
major_version = 15

[studio]
enabled = true
port = 54323
api_url = "http://localhost:54321"
```

### Environment Variables

Create `.env.local`:

```bash
# Local Development
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... # Get from `supabase start`

# For setup scripts (use cloud values)
SUPABASE_SERVICE_ROLE_KEY=your-cloud-service-role-key
```

Get local anon key after running `npx supabase start`.

## Troubleshooting

### Docker Not Running

```
Error: Cannot connect to the Docker daemon
```

**Solution:** Start Docker Desktop

### Port Already in Use

```
Error: bind: address already in use
```

**Solution:** Stop other services using ports 54321-54323:
```bash
npx supabase stop
# Or change ports in config.toml
```

### Migration Conflicts

```bash
# Reset local database
npx supabase db reset

# Or force push
npx supabase db push --include-all
```

### Link Issues

```bash
# Unlink and re-link
npx supabase unlink
npx supabase link --project-ref <ref>
```

## Advanced Usage

### Edge Functions

```bash
# Create function
npx supabase functions new hello

# Serve locally
npx supabase functions serve

# Deploy
npx supabase functions deploy hello
```

### Storage

```bash
# Create bucket locally
npx supabase storage create avatars

# Sync buckets
npx supabase storage sync
```

### Database Branching (Experimental)

```bash
# Create preview branch
npx supabase branches create preview-branch

# Switch branch
npx supabase branches switch preview-branch
```

## Best Practices

1. **Always use local for development**
   - Faster than cloud
   - No internet required
   - Safe to experiment

2. **Commit migrations to Git**
   - Track schema changes
   - Share with team
   - CI/CD deployment

3. **Test migrations before push**
   ```bash
   npx supabase db reset
   ```

4. **Backup before major changes**
   ```bash
   npx supabase db dump -f backup.sql
   ```

5. **Use seed data for testing**
   - Add to `supabase/seed.sql`
   - Auto-applied on reset

## Summary

| Task | Command |
|------|---------|
| Initialize | `npx supabase init` |
| Link | `npx supabase link --project-ref <ref>` |
| Pull | `npx supabase db pull` |
| Start | `npx supabase start` |
| Stop | `npx supabase stop` |
| Push | `npx supabase db push` |
| Reset | `npx supabase db reset` |
| Status | `npx supabase status` |

## Resources

- [Supabase CLI Docs](https://supabase.com/docs/guides/cli)
- [Local Development](https://supabase.com/docs/guides/cli/local-development)
- [Database Migrations](https://supabase.com/docs/guides/cli/managing-environments)
