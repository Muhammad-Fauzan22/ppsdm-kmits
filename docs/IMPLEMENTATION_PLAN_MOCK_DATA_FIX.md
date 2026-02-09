# 🚀 IMPLEMENTATION PLAN: MOCK DATA FIX
**Target:** 72 Jam | **Priority:** P0 - Critical

---

## 📅 TIMELINE

### **Hari 1 (0-8 jam): Critical Components**
- [ ] 1. Fix StudyGroups.tsx - Connect to API
- [ ] 2. Fix weekly-plan/page.tsx - Real assessment scores
- [ ] 3. Fix LeadershipSystem.tsx - Dynamic data
- [ ] 4. Create API endpoints untuk study-groups

### **Hari 2 (8-16 jam): Assessment Visualizations**
- [ ] 5. Fix all *Assessment.tsx components
- [ ] 6. Fix all *Radar.tsx, *Gauge.tsx components
- [ ] 7. Create unified data fetching pattern

### **Hari 3 (16-24 jam): Dashboard & Roadmap**
- [ ] 8. Fix dashboard/roadmap page
- [ ] 9. Fix dashboard pages
- [ ] 10. Implement empty states

### **Hari 4-6 (24-72 jam): Remaining Components**
- [ ] 11. Fix SkillTree, KimiTutor, Analytics
- [ ] 12. Testing & validation
- [ ] 13. Documentation
- [ ] 14. GitHub push

---

## 🎯 IMPLEMENTASI DETAIL

### **Task 1: StudyGroups Component Fix**

**File:** `src/components/StudyGroups.tsx`

**Changes:**
1. Hapus `mockGroups` array
2. Tambah React Query untuk data fetching
3. Tambah loading skeleton
4. Tambah empty state
5. Connect ke `/api/study-groups`

**Code Pattern:**
```typescript
// BEFORE (Mock)
const mockGroups = [...]; // Hardcoded

// AFTER (Real Data)
const { data: groups, isLoading } = useQuery({
  queryKey: ['study-groups'],
  queryFn: fetchStudyGroups
});
```

---

### **Task 2: Weekly Plan Page Fix**

**File:** `src/app/weekly-plan/page.tsx`

**Changes:**
1. Hapus `mockScores` object
2. Fetch dari `/api/assessment-results`
3. Generate plan dari real scores
4. Handle empty state (belum ada assessment)

---

### **Task 3: Create API Endpoints**

**New Files:**
- `src/app/api/study-groups/route.ts`
- `src/app/api/study-groups/join/route.ts`
- `src/app/api/weekly-plan/route.ts`

**Pattern:**
```typescript
// SSR Client Pattern (sudah established)
const supabase = createServerClient(...);
const { data: { user } } = await supabase.auth.getUser();
if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
```

---

## 🛠️ UNIFIED DATA FETCHING PATTERN

### **React Hook Pattern:**
```typescript
// src/lib/hooks/useStudyGroups.ts
export function useStudyGroups() {
  return useQuery({
    queryKey: ['study-groups'],
    queryFn: async () => {
      const res = await fetch('/api/study-groups');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

### **Loading State Pattern:**
```typescript
if (isLoading) return <StudyGroupsSkeleton />;
if (error) return <ErrorDisplay error={error} />;
if (!data || data.length === 0) return <EmptyState />;
```

---

## ✅ CHECKLIST PER KOMPONEN

### StudyGroups.tsx
- [ ] Hapus mockGroups
- [ ] Tambah useStudyGroups hook
- [ ] Tambah StudyGroupsSkeleton
- [ ] Tambah EmptyState
- [ ] Test dengan real data

### WeeklyPlan
- [ ] Hapus mockScores
- [ ] Tambah useAssessmentResults hook
- [ ] Handle no assessment state
- [ ] Generate plan dari real data

### Assessment Visualizations
- [ ] Hapus semua mock data
- [ ] Fetch dari assessment-results API
- [ ] Handle loading states
- [ ] Handle error states

---

## 🧪 TESTING STRATEGY

### **Test Cases:**
1. **Empty Database** - Harus tampil empty state
2. **With Data** - Harus tampil real data
3. **Loading** - Harus tampil skeleton
4. **Error** - Harus tampil error message
5. **Auth** - Harus redirect ke login jika unauthenticated

### **Test Data:**
```sql
-- Insert test study groups
INSERT INTO study_groups (name, description, max_members, is_private) 
VALUES ('Test Group', 'For testing', 10, false);

-- Insert test assessment results
INSERT INTO assessment_results (user_id, dimension, score, completed_at)
VALUES ('test-user-id', 'cognitive', 85, NOW());
```

---

## 📊 SUCCESS METRICS

| Metric | Before | Target | After |
|--------|--------|--------|-------|
| Mock Data Components | 20+ | 0 | ? |
| API Coverage | 30% | 90% | ? |
| Empty State Coverage | 10% | 100% | ? |
| Loading State Coverage | 20% | 100% | ? |
| Test Coverage | 15% | 80% | ? |

---

## 🚨 RISK MITIGATION

| Risk | Mitigation |
|------|------------|
| Breaking Changes | Feature flags untuk gradual rollout |
| Performance | React Query caching + pagination |
| Auth Issues | Proper SSR client pattern |
| Database Load | Implement proper indexing |

---

## 📝 DOCUMENTATION

### **Files to Update:**
- `docs/UI_MOCK_DATA_AUDIT.md` - Update status
- `docs/API_ENDPOINTS.md` - Document new endpoints
- `docs/DATA_FLOW.md` - Document data flow patterns
- `README.md` - Update setup instructions

---

**Ready to Start Implementation** ✅
