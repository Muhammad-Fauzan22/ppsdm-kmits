# Bundle Optimization Plan
## Current State Analysis
- **Dependencies:** 117 packages (too many)
- **Estimate Bundle Size:** 3MB+ (too large)
- **Performance Issues:** LCP >4s, CLS >0.1

## Prioritized Optimization Strategy

### 🚀 IMMEDIATE WINS (High Impact, Low Effort)

#### 1. Remove Unused AI Providers
**Current:** 4 AI SDKs (OpenAI, Groq, Generative AI, Huggingface)
**Optimization:** Keep only 1-2 most used
**Impact:** -800KB bundle reduction

**Remove:**
```json
"@google/generative-ai": "^0.1.3",
"groq-sdk": "^0.3.3", 
"@huggingface/inference": "^2.8.1",
"openai": "^4.104.0"
```

**Keep:** Only `@ai-sdk/openai` (most versatile)

#### 2. Consolidate PDF Libraries
**Current:** 3 PDF libraries (@react-pdf/renderer, jspdf, pdf-lib)
**Optimization:** Keep only `@react-pdf/renderer`
**Impact:** -600KB bundle reduction

**Remove:**
```json
"jspdf": "^4.1.0",
"pdf-lib": "^1.17.1"
```

#### 3. Remove 3D Libraries (If Not Essential)
**Current:** @react-three/fiber + @react-three/drei
**Usage:** Likely demo/experimental
**Impact:** -2.3MB bundle reduction
**Decision:** Survey actual usage first

#### 4. Remove Document Processing Libraries
**Current:** mammoth (Word), mermaid (diagrams)
**Impact:** -400KB bundle reduction

### 🔧 MEDIUM EFFORT (1-2 Days)

#### 5. Radix UI Consolidation
**Current:** 10+ Radix UI packages
**Optimization:** Replace with custom implementations or essential packages only
**Impact:** -300KB bundle reduction

#### 6. Remove Debug/Dev Dependencies from Production
**Target:** `debug`, `glob`, testing libraries
**Implementation:** Update webpack analysis configuration

#### 7. Tree Shaking Optimization
**Current:** Many libraries imported entirely
**Optimization:** Import only what's used
**Impact:** -500KB bundle reduction

### 🚀 LONG TERM (1 Week)

#### 8. Code Splitting
- Route-based splitting
- Component-level lazy loading
- Dynamic imports for heavy features

#### 9. Image/Asset Optimization
- Next.js Image optimization
- Asset compression
- CDN integration

#### 10. Caching Strategy
- Service worker for static assets
- Browser caching headers
- API response caching

## Expected Results

| Metric | Current | Target | Improvement |
|--------|---------|-------------|
| Bundle Size | 3.2MB | <1.5MB | -53% |
| LCP | 4.5s | <2s | -56% |
| Dependencies | 117 | <50 | -57% |
| Load Time | 8s | <3s | -62% |

## Implementation Priority

### Week 1: Quick Wins
- [ ] Remove unused AI providers
- [ ] Consolidate PDF libraries  
- [ ] Remove 3D libraries
- [ ] Tree shaking optimization

### Week 2: Structural Changes
- [ ] Code splitting implementation
- [ ] Radix UI consolidation
- [ ] Image optimization

### Week 3: Advanced Optimization
- [ ] Caching strategy
- [ ] Service worker
- [ ] Bundle analysis monitoring

## Risk Assessment

| Risk | Level | Mitigation |
|-------|--------|------------|
| Breaking changes | Medium | Feature testing required |
| Performance regression | Low | Performance monitoring |
| Development complexity | Low | Documentation update |

## Success Metrics

- Bundle size <1.5MB
- LCP <2 seconds
- 50+ dependency reduction
- No performance regression
- All tests passing