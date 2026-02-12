# PPSDM KMITS - Refinement & Execution Plan

**Status:** Draft
**Phase:** 2 (Planning)
**Based on:** `AUDIT_REPORT.md`

## 1. Executive Strategy
We will execute repairs in **3 Waves** to ensure stability while moving fast.
*   **Wave 1 (Stability First)**: Fix the foundation—Build, Security, and Code Quality (Linting).
*   **Wave 2 (Core Features)**: Implement the missing Spreadsheet Transparency & Financial Schema.
*   **Wave 3 (Optimization)**: Performance tuning and cleanup.

---

## 2. Task Priorities

### P0: CRITICAL (Must Fix Immediately)
*These block production or pose security risks.*

| ID | Task Name | Description | Strategy | Est. |
| :--- | :--- | :--- | :--- | :--- |
| **FIX-001** | **Consolidate Lockfiles** | Multiple lockfiles are causing build warnings and potential instability. | Remove nested `package-lock.json`, regenerate root lockfile, verify clean install. | 30m |
| **FIX-002** | **Security Patch** | 11 Moderate vulnerabilities in `undici`. | Run `npm audit fix`. If breaking, upgrade `@vercel/*` packages carefully. | 30m |
| **FIX-003** | **Linting Zero-Tolerance** | 3,842 lint issues obscure real bugs. | 1. `npm run lint:fix` (auto). <br> 2. Bulk-fix unused vars (prepend `_`). <br> 3. Fix explicit `any` where critical. | 2h |
| **FIX-004** | **Config Harmonization** | Next.js 16 vs `eslint-config-next` 15 mismatch. | Upgrade `eslint-config-next` to match Next.js version in `package.json`. | 15m |

### P1: HIGH (Feature Gaps & Data Integrity)
*Required for the "Transparansi" value proposition.*

| ID | Task Name | Description | Strategy | Est. |
| :--- | :--- | :--- | :--- | :--- |
| **FEAT-001** | **Financial Schema** | `database.types.ts` misses Finance tables (Transactions, Budgets). | Add `FinanceTransaction` and `Budget` interfaces matching `sheet-parser-engine.ts` rules. | 1h |
| **FEAT-002** | **Transparency Pages** | Public pages for Activities & Finance are missing. | Create `/transparansi/kegiatan` and `/transparansi/keuangan` fetching data via `GoogleSheetsService`. | 3h |
| **FEAT-003** | **Sheet Caching** | Direct API calls to Google Sheets are slow/rate-limited. | Implement Redis caching (via `@upstash/redis` or in-memory) for sheet data with 5m TTL. | 1h |

### P2: MEDIUM (Cleanup & Optimization)
*Technical debt reduction.*

| ID | Task Name | Description | Strategy | Est. |
| :--- | :--- | :--- | :--- | :--- |
| **OPT-001** | **Unused Code Removal** | `src/lib/assessment` has complex, potentially unused logic. | Use `knip` or manual analysis to remove dead code identified in audit. | **DONE** |
| **OPT-002** | **Bundle Optimization** | Large bundle size warnings. | Analyze `npm run analyze` report. Lazy load heavy components (Charts, PDF). | 1h |

---

## 3. Implementation Roadmap

### Day 1: Foundation (P0)
1.  **Morning**: executed `FIX-001` (Lockfiles) & `FIX-002` (Security).
2.  **Afternoon**: `FIX-004` (Config) & Start `FIX-003` (Linting - The Big Clean).
3.  **Checkpoint**: Pre-Flight Check (Build + Lint + Test) MUST pass green.

### Day 2: Transparency Features (P1)
1.  **Morning**: `FEAT-001` (Schema) & `FEAT-003` (Caching Layer).
2.  **Afternoon**: `FEAT-002` (Public Frontend for Transparency).
3.  **Checkpoint**: Public pages load data from Mock/Real Sheets successfully.

### Day 3: Optimization & Launch (P2/P3)
1.  **Morning**: `OPT-001` (Dead Code) & `OPT-002` (Bundle).
2.  **Afternoon**: Final Full Pre-Flight Integration Test.
3.  **Launch**: Deploy to Production.

---

## 4. Pre-Flight Protocol (Adopted)
Every commit requires:
1.  `npm run lint` (Must be 0 errors after FIX-003).
2.  `npx tsc --noEmit` (Must be 0 errors).
3.  `npm run build` (Must succeed).

## 5. Branching Strategy
*   Main Branch: `main`
*   Working Branch: `refactor/audit-execution`
*   Feature Branch: `feat/transparency`

---

**Approval Required:**
Please confirm this plan to begin **Wave 1 (P0 Tasks)** immediately.
