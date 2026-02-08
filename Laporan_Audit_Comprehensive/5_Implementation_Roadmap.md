# Implementation Roadmap (Volume 5)
**Date:** 2026-02-08
**Auditor:** Antigravity

---

## 1. Prioritized Roadmap

This roadmap is divided into **Correction** (Fixing) and **Evolution** (Improving).

### Phase 1: Critical Stabilization (Days 1-7)
**Focus: Compliance & Stability**

1.  **Security Database Fix:**
    - Update `assessment_sessions` schema to allow `NULL` `user_id` for anonymous sessions OR enforce login.
    - **Action:** `ALTER TABLE assessment_sessions ALTER COLUMN user_id DROP NOT NULL;`
2.  **Compliance Features (GDPR/UU PDP):**
    - Implement `/api/user/delete` (DELETE) endpoint.
    - Implement `/api/user/export` (GET) endpoint (PDF/JSON).
3.  **Frontend Optimization:**
    - Reduce `layout.tsx` fonts to 2 (Inter, Space Grotesk).
    - Enable `next/dynamic` for heavy visual components.

### Phase 2: Refactoring & Testing (Days 8-21)
**Focus: Efficiency & Scalability**

1.  **Unified Assessment Engine:**
    - Create `src/components/assessment/AssessmentRunner.tsx`.
    - Delete 9 duplicate folders (`app/financial-assessment`, etc.).
    - Replace with dynamic route `app/assessment/[dimension]/page.tsx`.
2.  **Testing Infrastructure:**
    - Setup Playwright.
    - Write **1 Golden Path Test** (Login -> Assessment -> Submit).
3.  **Database Strategy:**
    - Consolidate migrations into a clean baseline.
    - Stop using "manual SQL execution" via API.

### Phase 3: Advanced AI & Psychometrics (Month 2)
**Focus: Value & Accuracy**

1.  **AI Orchestrator Integration:**
    - Expose `scripts/ai_orchestrator.py` via a secure API (FastAPI/Flask) or Supabase Function.
    - Use this to generate **adaptive learning paths** based on `gap_analysis_results`.
2.  **Psychometric Logic Upgrade:**
    - Implement IRT (Item Response Theory) in `calculate_dimension_score` function.
    - Add "Reverse Scored" items to detect lazy answering.

---

## 2. Resource Requirements & Timeline

| Phase | Duration | Roles Needed | Estimated Effort |
| :--- | :--- | :--- | :--- |
| **1. Stabilization** | 1 Week | 1 Full Stack Dev, 1 DB Admin | 60 Hours |
| **2. Refactoring** | 2 Weeks | 2 Full Stack Devs | 120 Hours |
| **3. AI/Psychometrics** | 4 Weeks | 1 AI Engineer, 1 Backend Dev | 200 Hours |

---

## 3. Risk Assessment

| Risk | Probability | Impact | Mitigation |
| :--- | :--- | :--- | :--- |
| **Migration Failure** | Medium | High | Backup DB before schema changes. Use transaction blocks. |
| **User Data Loss** | Low | Critical | Implement Soft Delete instead of Hard Delete initially. |
| **Performance Regression** | Low | Medium | Enforce `Lighthouse CI` in GitHub Actions. |
| **AI Cost Overrun** | High | Low | Implement strict Rate Limiting and Token Usage Quotas. |

---

## 4. Final Success Metrics
- **Performance:** LCP < 2.5s, CLS < 0.1.
- **Security:** 0 Critical Vulnerabilities (OWASP Top 10).
- **Code Quality:** < 5% Code Duplication.
- **Completeness:** 100% Feature Parity with Audit Plan.
