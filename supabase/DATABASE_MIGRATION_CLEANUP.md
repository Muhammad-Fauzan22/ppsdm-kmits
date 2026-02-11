# Database Migration Cleanup Guide

## Overview
This document outlines the database migration cleanup process for PPSDM KMITS.

## Current State
- **Total migration files:** 39 (too many)
- **Issues:** Duplicates, inconsistent naming, redundant schemas
- **Solution:** Create consolidated baseline migration

## New Baseline Migration
- **File:** `20260211000001_baseline_v2.sql`
- **Features:** 
  - Consolidated all schemas
  - UU PDP compliance fields
  - Anonymous user support
  - Row Level Security (RLS)
  - Performance indexes
  - Views for common queries

## Migration Strategy

### For New Deployments
1. Use `20260211000001_baseline_v2.sql` as starting point
2. Ignore all previous migration files (pre-2026-02-11)
3. Future migrations start from `20260211000002_*`

### For Existing Deployments
1. Create backup of current database
2. Apply baseline migration in staging environment
3. Test thoroughly before production deployment
4. Plan migration window carefully

## Files to Archive
```
Archived files (pre-2026-02-11):
- 001_initial_schema.sql
- 001_ppsdm_dimensions.sql
- 002_assessment_tables.sql
- All 2024* migrations (duplicates)
- All 202601* migrations (incomplete)
- All assessment-specific schemas (replaced by baseline)
```

## Benefits
- ✅ Single source of truth for schema
- ✅ Eliminated 39+ migration complexity
- ✅ Built-in UU PDP compliance
- ✅ Anonymous user support
- ✅ Performance optimized
- ✅ Clean RLS policies
- ✅ Comprehensive indexing

## Next Steps
1. Test baseline migration in staging
2. Update deployment scripts
3. Archive old migration files
4. Update development documentation
5. Train team on new structure

## Rollback Plan
If issues arise:
1. Restore from backup
2. Revert to previous migration approach
3. Investigate and fix issues
4. Reattempt consolidation