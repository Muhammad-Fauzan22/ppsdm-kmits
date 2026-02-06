-- =============================================
-- 🚨 DATABASE RESET SCRIPT (DANGEROUS)
-- This script will DELETE ALL DATA and TABLES in the public schema.
-- Use this only if you want to start completely fresh.
-- =============================================

-- 1. Drop the entire public schema (Cascades to all tables, functions, etc.)
drop schema public cascade;

-- 2. Re-create the public schema
create schema public;

-- 3. Restore default permissions
grant all on schema public to postgres;
grant all on schema public to public;

-- 4. Re-enable standard extensions (add others if needed like vector)
create extension if not exists "uuid-ossp" schema extensions;
create extension if not exists pgcrypto schema extensions;
create extension if not exists pgjwt schema extensions;

-- Enable Vector for AI features
create extension if not exists vector schema public;

comment on schema public is 'standard public schema';

-- Verification
select 'DATABASE HAS BEEN RESET. PLEASE RUN THE MIGRATION SCRIPT NOW.' as status;
