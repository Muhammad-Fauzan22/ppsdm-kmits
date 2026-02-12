# 🧪 THOROUGH TESTING EXECUTION PLAN
**Option 3 Selected:** Full Thorough Testing  
**Date:** 2026-02-09  
**Scope:** All Critical Implementations from 72-Hour Sprint

---

## 📋 TESTING SCOPE

### Priority 1: UU PDP Compliance APIs (CRITICAL)
- [ ] Data Export API (`/api/user/export`)
- [ ] Account Deletion API (`/api/user/delete`)
- [ ] Deletion Cancellation API (`/api/user/delete/cancel`)
- [ ] Audit Logging Verification

### Priority 2: Anonymous User Flow (CRITICAL)
- [ ] Anonymous Assessment Submission
- [ ] Session Token Management
- [ ] Guest to User Migration

### Priority 3: Font Optimization (HIGH)
- [ ] Layout Rendering
- [ ] Font Loading Performance
- [ ] Visual Consistency

### Priority 4: Generic Assessment Engine (MEDIUM)
- [ ] AssessmentRunner Component
- [ ] Configuration System
- [ ] Integration Points

### Priority 5: Build & Type Safety (CRITICAL)
- [ ] TypeScript Compilation
- [ ] Build Success
- [ ] Runtime Errors

---

## 🔧 TEST ENVIRONMENT SETUP

```bash
# 1. Verify Database Migrations
cd ppsdm-kmits
npx supabase migration up

# 2. Install Dependencies
npm install

# 3. Verify Environment Variables
cp .env.local.example .env.local
# Add required vars:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY

# 4. Build Project
npm run build

# 5. Start Development Server
npm run dev
```

---

## 🧪 TEST CASES

### TEST 1: Data Export API

#### 1.1 Authenticated User Export
```bash
# Test with valid authentication
curl -X GET http://localhost:3000/api/user/export \
  -H "Cookie: sb-access-token=VALID_TOKEN" \
  -H "Accept: application/pdf" \
  --output test-export.pdf
```

**Expected Results:**
- ✅ HTTP 200 OK
- ✅ PDF file downloaded
- ✅ File size > 0 bytes
- ✅ Contains KMITS branding
- ✅ Audit log entry created

#### 1.2 Unauthenticated Request
```bash
curl -X GET http://localhost:3000/api/user/export
```

**Expected Results:**
- ✅ HTTP 401 Unauthorized
- ✅ JSON error response: `{"error": "Unauthorized. Please login to export your data."}`

#### 1.3 PDF Content Verification
```bash
# Check PDF structure
pdfinfo test-export.pdf

# Expected:
# Title: PPSDM KM ITS - Data Export Report
# Author: Tim IT PPSDM KM ITS
# Pages: >= 1
```

#### 1.4 Audit Log Verification
```sql
-- Query to verify audit logging
SELECT * FROM data_export_logs 
WHERE user_id = 'TEST_USER_ID' 
ORDER BY exported_at DESC 
LIMIT 1;

-- Expected: 1 row with export_format = 'pdf'
```

---

### TEST 2: Account Deletion API

#### 2.1 Initiate Deletion (Authenticated)
```bash
curl -X POST http://localhost:3000/api/user/delete \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-access-token=VALID_TOKEN" \
  -d '{
    "reason": "User requested deletion",
    "anonymizeData": false
  }'
```

**Expected Results:**
- ✅ HTTP 200 OK
- ✅ Response: `{"success": true, "message": "Account deletion scheduled", "scheduledDeletionDate": "2026-02-23T..."}`
- ✅ User status updated to `pending_deletion`
- ✅ `deletion_requests` table entry created

#### 2.2 Grace Period Verification
```sql
-- Verify 14-day grace period
SELECT 
  requested_at,
  scheduled_deletion_at,
  EXTRACT(DAY FROM (scheduled_deletion_at - requested_at)) as grace_period_days
FROM deletion_requests
WHERE user_id = 'TEST_USER_ID';

-- Expected: grace_period_days = 14
```

#### 2.3 Cancel Deletion (Within Grace Period)
```bash
curl -X POST http://localhost:3000/api/user/delete/cancel \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-access-token=VALID_TOKEN" \
  -d '{
    "reason": "Changed my mind"
  }'
```

**Expected Results:**
- ✅ HTTP 200 OK
- ✅ Response: `{"success": true, "message": "Account deletion cancelled"}`
- ✅ User status restored to `active`
- ✅ `deletion_cancellations` table entry created

#### 2.4 Unauthenticated Deletion Request
```bash
curl -X POST http://localhost:3000/api/user/delete
```

**Expected Results:**
- ✅ HTTP 401 Unauthorized

---

### TEST 3: Anonymous User Assessment Flow

#### 3.1 Anonymous Session Creation
```bash
curl -X POST http://localhost:3000/api/assessment/submit \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "anon-session-123",
    "dimension": "cognitive",
    "questionId": "q1",
    "responseValue": 4,
    "timeSpentMs": 5000,
    "sessionToken": "anon-token-xyz789"
  }'
```

**Expected Results:**
- ✅ HTTP 200 OK
- ✅ Session created with `user_id = NULL`
- ✅ `session_token` stored in database

#### 3.2 Verify RLS Policy
```sql
-- Verify anonymous user can read their own session
-- (Run as anon user in Supabase)
SELECT * FROM assessment_sessions 
WHERE session_token = 'anon-token-xyz789';

-- Expected: 1 row returned
```

#### 3.3 Progress Tracking for Anonymous
```bash
# Submit multiple responses
for i in {1..5}; do
  curl -X POST http://localhost:3000/api/assessment/submit \
    -H "Content-Type: application/json" \
    -d "{
      \"sessionId\": \"anon-session-123\",
      \"dimension\": \"cognitive\",
      \"questionId\": \"q$i\",
      \"responseValue\": $((RANDOM % 5 + 1)),
      \"sessionToken\": \"anon-token-xyz789\"
    }"
done
```

**Expected Results:**
- ✅ All 5 requests succeed
- ✅ Progress tracked in `assessment_progress` table
- ✅ `session_token` used as conflict target

---

### TEST 4: Font Optimization

#### 4.1 Layout File Verification
```bash
# Check optimized layout exists
ls -la src/app/layout-optimized.tsx

# Verify font imports
grep -n "next/font/google" src/app/layout-optimized.tsx
```

**Expected:**
- ✅ File exists
- ✅ Only 2 font imports: Inter and Space Grotesk

#### 4.2 Font Loading Test
```bash
# Start dev server and check network tab
npm run dev

# In browser DevTools:
# 1. Open http://localhost:3000
# 2. Check Network tab
# 3. Filter by "Font"
# 4. Verify only 2 font requests
```

**Expected Results:**
- ✅ Only 2 font files loaded
- ✅ Fonts use `display: swap`
- ✅ No 404 errors for fonts

#### 4.3 Visual Regression
```bash
# Compare screenshots (manual or automated)
# Key pages to check:
# - Landing page
# - Dashboard
# - Assessment page
# - Login page
```

**Checklist:**
- ✅ No layout shift during font loading
- ✅ Text readable immediately (FOUT handled)
- ✅ Branding colors correct (ITS Blue)
- ✅ Typography hierarchy maintained

---

### TEST 5: Generic Assessment Engine

#### 5.1 Component Rendering
```tsx
// Test component in isolation
import { AssessmentRunner } from '@/features/assessment-engine';

// Render with test config
<AssessmentRunner
  dimensionId="cognitive"
  onComplete={(results) => console.log(results)}
  onError={(error) => console.error(error)}
/>
```

**Expected:**
- ✅ Component mounts without errors
- ✅ Consent step displayed first
- ✅ Questions render correctly
- ✅ Navigation works

#### 5.2 Configuration System
```bash
# Verify dimension configs
cat src/features/assessment-engine/config/dimensions.ts | grep -c "dimensionConfigs"

# Expected: 9 dimensions defined
```

#### 5.3 Hook Functionality
```tsx
// Test useAssessmentEngine hook
const {
  currentQuestion,
  progress,
  responses,
  submitResponse,
  goToNext,
  goToPrevious
} = useAssessmentEngine({
  dimensionId: 'cognitive',
  sessionId: 'test-session'
});

// Expected: All functions defined and callable
```

---

### TEST 6: Build & Type Safety

#### 6.1 TypeScript Compilation
```bash
cd ppsdm-kmits
npx tsc --noEmit 2>&1 | head -50
```

**Expected Results:**
- ✅ No TypeScript errors
- ✅ 0 errors, 0 warnings (critical ones)

#### 6.2 Production Build
```bash
npm run build 2>&1 | tail -30
```

**Expected Results:**
- ✅ Build completes successfully
- ✅ `.next` directory created
- ✅ No compilation errors
- ✅ Static files generated

#### 6.3 Bundle Analysis
```bash
# Check bundle size
du -sh .next/static/

# Analyze chunks
ls -la .next/static/chunks/ | head -20
```

**Expected:**
- ✅ Total bundle < 500KB (excluding images)
- ✅ Reasonable chunk sizes

---

### TEST 7: Integration Testing

#### 7.1 End-to-End User Flow
```bash
# Test complete user journey
# 1. Anonymous user starts assessment
# 2. Completes assessment
# 3. Signs up
# 4. Views results
# 5. Exports data
# 6. Requests deletion
# 7. Cancels deletion
```

**Manual Test Steps:**
1. Open browser in incognito mode
2. Navigate to assessment page
3. Start as guest
4. Answer 3-5 questions
5. Sign up for account
6. Verify session migration
7. Complete assessment
8. Go to profile → Data Management
9. Export data (download PDF)
10. Request account deletion
11. Verify grace period notification
12. Cancel deletion
13. Verify account restored

#### 7.2 API Integration
```bash
# Test all API endpoints
endpoints=(
  "/api/user/export"
  "/api/user/delete"
  "/api/user/delete/cancel"
  "/api/assessment/submit"
  "/api/assessment/complete"
)

for endpoint in "${endpoints[@]}"; do
  echo "Testing: $endpoint"
  curl -s -o /dev/null -w "%{http_code}" http://localhost:3000$endpoint
  echo ""
done
```

---

## 📊 TEST RESULTS TEMPLATE

| Test ID | Test Name | Status | Notes |
|---------|-----------|--------|-------|
| 1.1 | Authenticated Export | ⬜ | |
| 1.2 | Unauthenticated Export | ⬜ | |
| 1.3 | PDF Content | ⬜ | |
| 1.4 | Audit Logging | ⬜ | |
| 2.1 | Initiate Deletion | ⬜ | |
| 2.2 | Grace Period | ⬜ | |
| 2.3 | Cancel Deletion | ⬜ | |
| 2.4 | Unauthenticated Delete | ⬜ | |
| 3.1 | Anonymous Session | ⬜ | |
| 3.2 | RLS Policy | ⬜ | |
| 3.3 | Progress Tracking | ⬜ | |
| 4.1 | Layout File | ⬜ | |
| 4.2 | Font Loading | ⬜ | |
| 4.3 | Visual Regression | ⬜ | |
| 5.1 | Component Rendering | ⬜ | |
| 5.2 | Configuration | ⬜ | |
| 5.3 | Hooks | ⬜ | |
| 6.1 | TypeScript | ⬜ | |
| 6.2 | Production Build | ⬜ | |
| 6.3 | Bundle Size | ⬜ | |
| 7.1 | E2E Flow | ⬜ | |
| 7.2 | API Integration | ⬜ | |

---

## 🐛 BUG TRACKING

| ID | Description | Severity | Status | Assigned |
|----|-------------|----------|--------|----------|
| | | | | |

---

## ✅ SIGN-OFF

**Test Engineer:** _________________  
**Date:** _________________  
**Build Version:** new-master (2391471)

### Final Checklist
- [ ] All Priority 1 tests passed
- [ ] All Priority 2 tests passed
- [ ] No critical bugs open
- [ ] Documentation updated
- [ ] Ready for staging deployment

**Approval for Staging:** ⬜ Approved ⬜ Rejected  
**Notes:** _________________
