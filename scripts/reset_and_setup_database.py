#!/usr/bin/env python3
"""
PPSDM KMITS - Database Reset & Complete Setup Script
====================================================

This script will:
1. Connect to Supabase using MCP server
2. Reset all existing tables (DROP ALL)
3. Create complete integrated schema
4. Verify the setup

Author: PPSDM KMITS Team
Version: 2.0.0
"""

import os
import sys
import json
import subprocess
from pathlib import Path
from typing import List, Dict, Any, Optional

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

# Configuration
SUPABASE_URL = "https://xncugiuvaetzjxuyfsko.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhuY3VnaXV2YWV0emp4dXlmc2tvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2Njk4NDgsImV4cCI6MjA4NDI0NTg0OH0.KdxR6patiWJNbvrGOmyaamiP_AXwpGo9abIrl2FVTKk"

# Complete Database Schema SQL
COMPLETE_SCHEMA_SQL = """
-- ============================================
-- PPSDM KMITS - COMPLETE INTEGRATED DATABASE SCHEMA
-- ============================================
-- Version: 2.0.0
-- Description: Unified schema combining all features
-- ============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ============================================
-- 1. CORE AUTH & USER MANAGEMENT
-- ============================================

-- Faculties
CREATE TABLE IF NOT EXISTS faculties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    dean_name VARCHAR(255),
    established_year INTEGER,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Departments
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    faculty_id UUID REFERENCES faculties(id) ON DELETE CASCADE,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    head_name VARCHAR(255),
    description TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    student_id VARCHAR(50) UNIQUE,
    department_id UUID REFERENCES departments(id),
    year_of_study INTEGER,
    avatar_url TEXT,
    bio TEXT,
    learning_style VARCHAR(50),
    interests TEXT[],
    skills JSONB DEFAULT '[]',
    role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('admin', 'student', 'tutor', 'supervisor')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. 9 DIMENSIONS FRAMEWORK
-- ============================================

CREATE TABLE IF NOT EXISTS dimensions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    name_en TEXT,
    description TEXT,
    icon TEXT,
    color TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert 9 Dimensions
INSERT INTO dimensions (slug, name, name_en, description, icon, color, order_index) VALUES
('spiritual', 'Kecerdasan Spiritual', 'Spiritual Intelligence', 'Pengembangan spiritual dan nilai-nilai keagamaan', 'Sparkles', '#8B5CF6', 1),
('emotional', 'Kecerdasan Emosional', 'Emotional Intelligence', 'Kemampuan mengelola emosi dan memahami orang lain', 'Heart', '#EC4899', 2),
('intellectual', 'Kecerdasan Intelektual', 'Intellectual Intelligence', 'Pengembangan akademik dan kognitif', 'Brain', '#3B82F6', 3),
('physical', 'Kesehatan Fisik', 'Physical Health', 'Kebugaran dan kesehatan jasmani', 'Dumbbell', '#10B981', 4),
('social', 'Kecerdasan Sosial', 'Social Intelligence', 'Kemampuan berinteraksi dan berkolaborasi', 'Users', '#F59E0B', 5),
('financial', 'Kecerdasan Finansial', 'Financial Intelligence', 'Manajemen keuangan dan kewirausahaan', 'Wallet', '#14B8A6', 6),
('occupational', 'Kecerdasan Okupasional', 'Occupational Intelligence', 'Pengembangan karir dan profesionalisme', 'Briefcase', '#6366F1', 7),
('environmental', 'Kecerdasan Lingkungan', 'Environmental Intelligence', 'Kesadaran dan kepedulian lingkungan', 'Leaf', '#22C55E', 8),
('character', 'Karakter', 'Character', 'Pembentukan karakter dan integritas diri', 'Shield', '#EF4444', 9)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 3. ASSESSMENTS (9 Dimensions)
-- ============================================

CREATE TABLE IF NOT EXISTS assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    dimension_id UUID REFERENCES dimensions(id),
    assessment_type VARCHAR(50) DEFAULT 'standard',
    score INTEGER CHECK (score >= 0 AND score <= 100),
    answers JSONB,
    metadata JSONB DEFAULT '{}',
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dimension Stats (aggregated scores)
CREATE TABLE IF NOT EXISTS dimension_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    dimension_id UUID REFERENCES dimensions(id),
    current_score INTEGER DEFAULT 0,
    previous_score INTEGER DEFAULT 0,
    improvement INTEGER DEFAULT 0,
    assessment_count INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, dimension_id)
);

-- ============================================
-- 4. GOALS & IDP (Individual Development Plan)
-- ============================================

CREATE TABLE IF NOT EXISTS goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    dimension_id UUID REFERENCES dimensions(id),
    title TEXT NOT NULL,
    description TEXT,
    target_date DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- IDP (Individual Development Plan)
CREATE TABLE IF NOT EXISTS idps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    current_state TEXT,
    desired_state TEXT,
    action_plan JSONB,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. LMS - COURSES & CONTENT
-- ============================================

CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    level VARCHAR(20) CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    difficulty VARCHAR(20) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    duration_minutes INTEGER,
    credit_points INTEGER DEFAULT 0,
    department_id UUID REFERENCES departments(id),
    instructor_id UUID REFERENCES profiles(id),
    thumbnail_url TEXT,
    cover_image TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    prerequisites UUID[] DEFAULT '{}',
    learning_objectives JSONB DEFAULT '[]',
    tags TEXT[],
    xp_reward INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    sequence_order INTEGER NOT NULL DEFAULT 0,
    order_index INTEGER DEFAULT 0,
    duration_minutes INTEGER,
    xp_reward INTEGER DEFAULT 0,
    is_unlocked BOOLEAN DEFAULT FALSE,
    unlock_requirements JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    content_type VARCHAR(50) CHECK (content_type IN ('text', 'video', 'audio', 'pdf', 'quiz', 'interactive')),
    video_url TEXT,
    duration_seconds INTEGER,
    duration INTEGER,
    sequence_order INTEGER NOT NULL DEFAULT 0,
    order_index INTEGER DEFAULT 0,
    is_optional BOOLEAN DEFAULT FALSE,
    resources JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enrollments
CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    progress_percentage INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
    started_at TIMESTAMPTZ,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    last_accessed_at TIMESTAMPTZ,
    total_time_spent_seconds INTEGER DEFAULT 0,
    certificate_issued BOOLEAN DEFAULT FALSE,
    certificate_url TEXT,
    metadata JSONB DEFAULT '{}',
    UNIQUE(user_id, course_id)
);

-- User Lesson Progress
CREATE TABLE IF NOT EXISTS user_lesson_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT FALSE,
    completion_percentage INTEGER DEFAULT 0,
    time_spent_seconds INTEGER DEFAULT 0,
    last_position_seconds INTEGER DEFAULT 0,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

-- ============================================
-- 6. QUIZZES & ASSESSMENTS
-- ============================================

CREATE TABLE IF NOT EXISTS quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    time_limit_minutes INTEGER,
    passing_score INTEGER DEFAULT 70,
    max_attempts INTEGER DEFAULT 3,
    randomize_questions BOOLEAN DEFAULT TRUE,
    show_correct_answers BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer', 'essay', 'code')),
    options JSONB,
    correct_answer TEXT,
    explanation TEXT,
    points INTEGER DEFAULT 1,
    difficulty VARCHAR(20),
    tags TEXT[],
    metadata JSONB DEFAULT '{}',
    sequence_order INTEGER
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    score INTEGER,
    total_points INTEGER,
    percentage DECIMAL(5,2),
    passed BOOLEAN,
    attempt_number INTEGER,
    answers JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}'
);

-- ============================================
-- 7. EBOOKS & CONTENT GENERATION
-- ============================================

CREATE TABLE IF NOT EXISTS ebooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    drive_id TEXT UNIQUE,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    isbn VARCHAR(50),
    publisher VARCHAR(255),
    published_year INTEGER,
    description TEXT,
    cover_url TEXT,
    cover_image TEXT,
    pdf_url TEXT,
    file_name TEXT,
    file_size_bytes BIGINT,
    file_size BIGINT,
    page_count INTEGER,
    category VARCHAR(100),
    tags TEXT[],
    difficulty_level VARCHAR(20),
    estimated_reading_time_minutes INTEGER,
    is_processed BOOLEAN DEFAULT FALSE,
    processing_status VARCHAR(50) DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
    drive_folder_id TEXT,
    drive_file_id TEXT,
    drive_folder_url TEXT,
    drive_upload_status VARCHAR(20) DEFAULT 'pending',
    quality_score INTEGER,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Processed Ebook Content
CREATE TABLE IF NOT EXISTS ebook_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ebook_id UUID REFERENCES ebooks(id) ON DELETE CASCADE,
    content_type VARCHAR(50) CHECK (content_type IN ('summary', 'deep_dive', 'action_plan', 'audio_script', 'gamification', 'presentation', 'podcast_script', 'scenarios', 'infographic')),
    content JSONB NOT NULL,
    ai_provider VARCHAR(50),
    processing_time_ms INTEGER,
    quality_score DECIMAL(4,2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Courses from Ebooks
CREATE TABLE IF NOT EXISTS courses_from_ebooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ebook_id UUID REFERENCES ebooks(id),
    course_id UUID REFERENCES courses(id),
    quality_score INTEGER,
    generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 8. GAMIFICATION
-- ============================================

CREATE TABLE IF NOT EXISTS badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    icon TEXT,
    color TEXT,
    category VARCHAR(50),
    criteria JSONB NOT NULL,
    rarity VARCHAR(20) CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
    points_value INTEGER DEFAULT 0,
    xp_reward INTEGER DEFAULT 0,
    is_nft_ready BOOLEAN DEFAULT FALSE,
    requirement_type TEXT,
    requirement_value INTEGER,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default badges
INSERT INTO badges (slug, name, description, icon, color, xp_reward, requirement_type, requirement_value, rarity, points_value) VALUES
('first_login', 'First Steps', 'Login pertama ke sistem', 'LogIn', '#3B82F6', 10, 'login', 1, 'common', 10),
('complete_profile', 'Identity Established', 'Lengkapi profil Anda', 'User', '#8B5CF6', 20, 'profile_complete', 1, 'common', 20),
('first_assessment', 'Self Discovery', 'Selesaikan assessment pertama', 'ClipboardCheck', '#10B981', 50, 'assessment_complete', 1, 'common', 50),
('dimension_master', 'Dimension Master', 'Capai skor 90+ pada satu dimensi', 'Award', '#F59E0B', 100, 'dimension_score', 90, 'rare', 100),
('course_complete', 'Knowledge Seeker', 'Selesaikan satu course', 'BookOpen', '#EC4899', 75, 'course_complete', 1, 'common', 75),
('streak_7', 'Weekly Warrior', '7 hari streak belajar', 'Flame', '#EF4444', 50, 'streak', 7, 'uncommon', 50),
('streak_30', 'Monthly Master', '30 hari streak belajar', 'Crown', '#FFD700', 200, 'streak', 30, 'epic', 200)
ON CONFLICT (slug) DO NOTHING;

CREATE TABLE IF NOT EXISTS user_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    nft_minted BOOLEAN DEFAULT FALSE,
    nft_token_id TEXT,
    UNIQUE(user_id, badge_id)
);

-- Experience Points
CREATE TABLE IF NOT EXISTS user_xp (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    total_xp INTEGER DEFAULT 0,
    total INTEGER DEFAULT 0,
    current_level INTEGER DEFAULT 1,
    level INTEGER DEFAULT 1,
    xp_to_next_level INTEGER DEFAULT 100,
    streak_days INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_at TIMESTAMPTZ,
    last_activity TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- XP History/Transactions
CREATE TABLE IF NOT EXISTS xp_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    reason TEXT,
    source_type TEXT,
    source_id UUID,
    action_type VARCHAR(100) NOT NULL,
    description TEXT,
    reference_id UUID,
    reference_type VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS xp_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    action_type VARCHAR(100) NOT NULL,
    description TEXT,
    reference_id UUID,
    reference_type VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 9. CERTIFICATES
-- ============================================

CREATE TABLE IF NOT EXISTS certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id),
    certificate_number TEXT UNIQUE,
    template_id TEXT,
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    downloaded_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'
);

-- ============================================
-- 10. SOCIAL FEATURES
-- ============================================

CREATE TABLE IF NOT EXISTS study_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    course_id UUID REFERENCES courses(id),
    created_by UUID REFERENCES auth.users(id),
    max_members INTEGER DEFAULT 10,
    is_private BOOLEAN DEFAULT FALSE,
    invite_code VARCHAR(20),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS study_group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES study_groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(group_id, user_id)
);

CREATE TABLE IF NOT EXISTS group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES study_groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member')),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(group_id, user_id)
);

-- Peer Reviews
CREATE TABLE IF NOT EXISTS peer_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reviewer_id UUID REFERENCES profiles(id),
    reviewee_id UUID REFERENCES profiles(id),
    submission_id UUID,
    submission_type VARCHAR(50),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    criteria_scores JSONB,
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 11. AI TUTOR & CHAT
-- ============================================

CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    context_type VARCHAR(50),
    context_id UUID,
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    role VARCHAR(20) CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    model_used VARCHAR(50),
    tokens_used INTEGER,
    referenced_content JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vector Store for RAG
CREATE TABLE IF NOT EXISTS knowledge_vectors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    embedding VECTOR(1536),
    source_type VARCHAR(50),
    source_id UUID,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 12. CONTENT AGGREGATOR & SCRAPER
-- ============================================

CREATE TABLE IF NOT EXISTS content_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    source_type VARCHAR(50) CHECK (source_type IN ('youtube', 'news', 'github', 'podcast', 'blog', 'research')),
    url TEXT,
    api_endpoint TEXT,
    config JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    last_scraped_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS aggregated_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID REFERENCES content_sources(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    url TEXT,
    image_url TEXT,
    author TEXT,
    published_at TIMESTAMPTZ,
    category TEXT,
    tags TEXT[],
    metadata JSONB DEFAULT '{}',
    is_processed BOOLEAN DEFAULT FALSE,
    processing_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 13. JOURNAL & REFLECTION
-- ============================================

CREATE TABLE IF NOT EXISTS journal_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT,
    content TEXT NOT NULL,
    mood VARCHAR(50),
    tags TEXT[],
    is_private BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- User indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_student_id ON profiles(student_id);
CREATE INDEX IF NOT EXISTS idx_profiles_department ON profiles(department_id);

-- Assessment indexes
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_dimension_id ON assessments(dimension_id);
CREATE INDEX IF NOT EXISTS idx_assessments_completed_at ON assessments(completed_at);

-- Goals indexes
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_status ON goals(status);
CREATE INDEX IF NOT EXISTS idx_goals_dimension_id ON goals(dimension_id);

-- Course indexes
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_department ON courses(department_id);
CREATE INDEX IF NOT EXISTS idx_courses_level ON courses(level);

-- Module & Lesson indexes
CREATE INDEX IF NOT EXISTS idx_modules_course_id ON modules(course_id);
CREATE INDEX IF NOT EXISTS idx_modules_order_index ON modules(order_index);
CREATE INDEX IF NOT EXISTS idx_lessons_module_id ON lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_lessons_order_index ON lessons(order_index);

-- Enrollment indexes
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON enrollments(status);

-- Progress indexes
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_user ON user_lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_lesson ON user_lesson_progress(lesson_id);

-- Quiz indexes
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz ON quiz_attempts(quiz_id);

-- XP indexes
CREATE INDEX IF NOT EXISTS idx_xp_history_user_id ON xp_history(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_history_created_at ON xp_history(created_at);
CREATE INDEX IF NOT EXISTS idx_xp_transactions_user ON xp_transactions(user_id);

-- Ebook indexes
CREATE INDEX IF NOT EXISTS idx_ebooks_processing_status ON ebooks(processing_status);
CREATE INDEX IF NOT EXISTS idx_ebooks_category ON ebooks(category);

-- Gamification indexes
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user_id ON certificates(user_id);

-- Social indexes
CREATE INDEX IF NOT EXISTS idx_study_groups_course_id ON study_groups(course_id);
CREATE INDEX IF NOT EXISTS idx_study_group_members_group ON study_group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_study_group_members_user ON study_group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON group_members(user_id);

-- Content indexes
CREATE INDEX IF NOT EXISTS idx_aggregated_content_source ON aggregated_content(source_id);
CREATE INDEX IF NOT EXISTS idx_aggregated_content_category ON aggregated_content(category);
CREATE INDEX IF NOT EXISTS idx_aggregated_content_published ON aggregated_content(published_at);

-- Chat indexes
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);

-- Vector similarity index
CREATE INDEX IF NOT EXISTS idx_knowledge_vectors_embedding ON knowledge_vectors USING ivfflat (embedding vector_cosine_ops);

-- Journal indexes
CREATE INDEX IF NOT EXISTS idx_journal_entries_user ON journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_created ON journal_entries(created_at);

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- User progress summary view
CREATE OR REPLACE VIEW user_progress_summary AS
SELECT 
    p.id as user_id,
    p.full_name,
    p.role,
    COALESCE(ux.total_xp, 0) as total_xp,
    COALESCE(ux.current_level, 1) as level,
    COALESCE(ux.streak_days, 0) as streak_days,
    COUNT(DISTINCT a.id) as assessments_completed,
    COUNT(DISTINCT g.id) FILTER (WHERE g.status = 'completed') as goals_completed,
    COUNT(DISTINCT g.id) FILTER (WHERE g.status = 'active') as active_goals,
    COUNT(DISTINCT e.id) FILTER (WHERE e.status = 'completed') as courses_completed,
    COUNT(DISTINCT e.id) FILTER (WHERE e.status = 'active') as active_courses,
    COUNT(DISTINCT ub.id) as badges_earned
FROM profiles p
LEFT JOIN user_xp ux ON p.id = ux.user_id
LEFT JOIN assessments a ON p.id = a.user_id
LEFT JOIN goals g ON p.id = g.user_id
LEFT JOIN enrollments e ON p.id = e.user_id
LEFT JOIN user_badges ub ON p.id = ub.user_id
GROUP BY p.id, p.full_name, p.role, ux.total_xp, ux.current_level, ux.streak_days;

-- Dimension leaderboard view
CREATE OR REPLACE VIEW dimension_leaderboard AS
SELECT 
    d.id as dimension_id,
    d.slug,
    d.name,
    d.color,
    ds.user_id,
    p.full_name,
    p.avatar_url,
    ds.current_score,
    ds.improvement,
    RANK() OVER (PARTITION BY d.id ORDER BY ds.current_score DESC) as rank
FROM dimensions d
LEFT JOIN dimension_stats ds ON d.id = ds.dimension_id
LEFT JOIN profiles p ON ds.user_id = p.id
WHERE ds.current_score > 0
ORDER BY d.order_index, ds.current_score DESC;

-- Course enrollment stats view
CREATE OR REPLACE VIEW course_enrollment_stats AS
SELECT 
    c.id as course_id,
    c.title,
    c.category,
    c.level,
    c.xp_reward,
    COUNT(e.id) as total_enrollments,
    COUNT(e.id) FILTER (WHERE e.status = 'completed') as completed_count,
    COUNT(e.id) FILTER (WHERE e.status = 'active') as active_count,
    AVG(e.progress) as average_progress,
    MAX(e.enrolled_at) as last_enrollment_date
FROM courses c
LEFT JOIN enrollments e ON c.id = e.course_id
WHERE c.status = 'published'
GROUP BY c.id, c.title, c.category, c.level, c.xp_reward;

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faculties_updated_at BEFORE UPDATE ON faculties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_modules_updated_at BEFORE UPDATE ON modules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ebooks_updated_at BEFORE UPDATE ON ebooks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_sessions_updated_at BEFORE UPDATE ON chat_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Calculate dimension improvement
CREATE OR REPLACE FUNCTION calculate_dimension_improvement()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.current_score IS NOT NULL THEN
        NEW.improvement = NEW.current_score - OLD.current_score;
    END IF;
    NEW.previous_score = OLD.current_score;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_dimension_improvement 
    BEFORE UPDATE ON dimension_stats
    FOR EACH ROW 
    EXECUTE FUNCTION calculate_dimension_improvement();

-- XP Calculation Functions
CREATE OR REPLACE FUNCTION calculate_level(p_total_xp INTEGER)
RETURNS INTEGER AS $$
BEGIN
    RETURN FLOOR(SQRT(p_total_xp / 100.0)) + 1;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION xp_for_next_level(p_current_level INTEGER)
RETURNS INTEGER AS $$
BEGIN
    RETURN (p_current_level * p_current_level) * 100;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update level on XP change
CREATE OR REPLACE FUNCTION update_user_level()
RETURNS TRIGGER AS $$
DECLARE
    new_level INTEGER;
    next_level_xp INTEGER;
BEGIN
    new_level := calculate_level(NEW.total_xp);
    next_level_xp := xp_for_next_level(new_level);
    
    NEW.current_level := new_level;
    NEW.xp_to_next_level := next_level_xp;
    NEW.updated_at := NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_level BEFORE UPDATE ON user_xp
    FOR EACH ROW EXECUTE FUNCTION update_user_level();

-- Add XP trigger
CREATE OR REPLACE FUNCTION add_xp_to_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_xp (user_id, total_xp, last_activity)
    VALUES (NEW.user_id, NEW.amount, NOW())
    ON CONFLICT (user_id)
    DO UPDATE SET 
        total_xp = user_xp.total_xp + NEW.amount,
        last_activity = NOW(),
        level = CASE 
            WHEN user_xp.total_xp + NEW.amount >= (user_xp.level * 1000) 
            THEN user_xp.level + 1 
            ELSE user_xp.level 
        END;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER xp_added 
    AFTER INSERT ON xp_history
    FOR EACH ROW 
    EXECUTE FUNCTION add_xp_to_user();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, full_name, avatar_url, role)
    VALUES (
        NEW.id, 
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url',
        COALESCE(NEW.raw_user_meta_data->>'role', 'student')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists to avoid errors
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- Auto-create dimension stats when assessment is completed
CREATE OR REPLACE FUNCTION handle_new_assessment()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO dimension_stats (user_id, dimension_id, current_score, assessment_count)
    VALUES (NEW.user_id, NEW.dimension_id, NEW.score, 1)
    ON CONFLICT (user_id, dimension_id)
    DO UPDATE SET 
        current_score = NEW.score,
        previous_score = dimension_stats.current_score,
        improvement = NEW.score - dimension_stats.current_score,
        assessment_count = dimension_stats.assessment_count + 1,
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_assessment_completed ON assessments;

CREATE TRIGGER on_assessment_completed
    AFTER INSERT ON assessments
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_assessment();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE dimension_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE idps ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_xp ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_history
