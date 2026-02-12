
# Maintenance & Measurement Standard Operating Procedure

## Overview
This document outlines the standard procedures for maintaining the PPSDM KMITS platform and measuring its performance, ensuring the "System Perfection" standard is met.

## 1. System Maintenance
### A. Content Generation Checks
Run the batch processor regularly to ingest new content from the central database.
```bash
python scripts/process_ebooks.py
```
*   **Frequency**: Weekly or after CSV update.
*   **Verification**: Check Supabase `courses` table for new entries.

### B. Health Monitoring
The platform includes a built-in System Health Widget located at `/analytics`.
*   **Indicators**:
    *   **Database**: Checks Supabase connection latency.
    *   **AI Engine**: Verifies API availability (Groq/Gemini).
    *   **Storage**: Ensures Google Drive link accessibility.

### C. Codebase Hygiene
*   **Linting**: Run `npm run lint` before every commit.
*   **Build**: Verify production build with `npm run build` locally to catch route conflicts.

## 2. Measurement & Analytics
### A. User Progress (Gamification)
Track user engagement via the Dashboard (`/home`) and Analytics (`/analytics`).
*   **Key Metrics**:
    *   XP Growth (Learning Velocity)
    *   Module Completion Rate
    *   Quiz Scores (Knowledge Retention)

### B. System Performance
*   **Vercel Analytics**: Enabled for Web Vitals (LCP, FID, CLS).
*   **Supabase Dashboard**: Monitor database egress and query performance.

## 3. Workflow for Updates
1.  **Dev**: Make changes in a feature branch.
2.  **Test**: Run `npm run dev` and verify UI/UX.
3.  **Build**: Run `npm run build` to ensure integrity.
4.  **Push**: Commit to `master` to trigger Vercel deployment.
