# KIMI K2.5 Detailed Workflow Prompts
# Untuk PPSDM-KMITS Project Automation

## FASE 1: PROJECT ANALYSIS
## Objective: Comprehensive understanding of current state

```
Analyze the PPSDM-KMITS project structure and provide:

PROJECT CONTEXT:
- Type: Next.js 15 + Supabase + React
- Purpose: Educational/Professional Development Platform
- Current features: Assessment, Gamification, Collaboration, Credentialing

ANALYSIS REQUIREMENTS:
1. Current Architecture Assessment
   - Frontend structure (Next.js app directory, components)
   - Backend integration (Supabase, APIs)
   - Database schema effectiveness
   - Current UI component library (Radix UI, Tailwind)

2. Code Quality Assessment
   - TypeScript usage consistency
   - Performance metrics
   - Accessibility compliance
   - Responsive design implementation

3. Top 5 Priority Improvements
   For each improvement, specify:
   - Current state vs desired state
   - Impact level (High/Medium/Low)
   - Effort level (Low/Medium/High)
   - Affected files/components
   - User impact

4. Technical Debt
   - Legacy code patterns
   - Deprecated dependencies
   - Security vulnerabilities
   - Performance bottlenecks

5. Actionable Next Steps
   - Quick wins (< 1 hour each)
   - Medium-term improvements
   - Long-term architectural changes

Be specific with file paths and exact technologies found.
```

---

## FASE 2: IMPROVEMENT ROADMAP GENERATION
## Objective: Create detailed implementation plan

```
Based on the project analysis, create a DETAILED IMPLEMENTATION ROADMAP:

FOR EACH TOP IMPROVEMENT:

1. UI/UX IMPROVEMENTS
   - Current component state
   - Design issues
   - User experience gaps
   - Specific component files to modify
   - Mockup/design specifications needed
   - Accessibility fixes required
   - Testing approach

2. FRONTEND ENHANCEMENTS
   - Performance optimization opportunities
   - Code splitting strategies
   - Bundle size reduction
   - React best practices application
   - TypeScript improvements
   - Component composition refactoring
   - State management optimization
   - Exact file locations
   - Code snippets for critical changes

3. BACKEND IMPROVEMENTS
   - API optimization
   - Database query optimization
   - Authentication/Authorization enhancements
   - Supabase schema improvements
   - Business logic refactoring
   - Error handling improvements
   - Logging/monitoring additions

ROADMAP FORMAT:
- Task ID: [UI-001], [FE-002], [BE-003]
- Priority: P0 (Critical), P1 (High), P2 (Medium), P3 (Low)
- Complexity: Low (< 2h), Medium (2-8h), High (> 8h)
- Dependencies: List related tasks
- Files affected: Exact paths
- Description: Detailed spec
- Acceptance criteria: How to verify completion
- Testing strategy: Unit, integration, E2E tests needed

CREATE QUICK-WIN TASKS:
- Can be completed in < 1 hour
- High user-visible impact
- Low risk of breaking things
- Specific implementation steps

DEPENDENCIES GRAPH:
- Show task relationships
- Critical path identification
- Parallelizable tasks
```

---

## FASE 3: DETAILED IMPLEMENTATION GUIDANCE
## Objective: Provide production-ready code

```
For this improvement task:
[TASK_DESCRIPTION]

Provide DETAILED IMPLEMENTATION GUIDANCE:

1. ARCHITECTURE DECISION
   - Why this approach?
   - Alternatives considered?
   - Trade-offs analysis

2. STEP-BY-STEP IMPLEMENTATION
   Step 1: [Detailed steps with file paths]
   Step 2: [Code changes required]
   Step 3: [Integration points]
   Step 4: [Testing approach]

3. CODE EXAMPLES
   - Before/After code samples
   - Key functions/components to implement
   - Integration with existing code
   - Error handling
   - Edge cases

4. INTEGRATION CHECKLIST
   - Files to modify: [list exact paths]
   - Files to create: [list with purpose]
   - Dependencies to add: [npm packages]
   - Database migrations: [SQL if needed]
   - Environment variables: [new ones needed]

5. TESTING STRATEGY
   - Unit tests: [what to test]
   - Integration tests: [components interaction]
   - E2E tests: [user flows]
   - Performance tests: [benchmarks]

6. DEPLOYMENT CHECKLIST
   - Build verification steps
   - Environment variable setup
   - Database schema updates
   - API endpoint testing
   - Rollback plan if issues occur

7. COMMON PITFALLS TO AVOID
   - Performance issues
   - Type safety problems
   - State management conflicts
   - Database N+1 queries
   - Memory leaks
   - Race conditions

8. PERFORMANCE OPTIMIZATION
   - Memoization strategies
   - Lazy loading approaches
   - Code splitting opportunities
   - Bundle optimization
   - API response caching

PROVIDE PRODUCTION-READY CODE - not pseudo-code
Include actual TypeScript/React/SQL as appropriate
```

---

## FASE 4: CODE REVIEW & QUALITY ASSURANCE
## Objective: Ensure quality before merging

```
DETAILED CODE REVIEW for this implementation:

[IMPLEMENTATION_DETAILS]

REVIEW CHECKLIST:

1. CORRECTNESS
   - Logic is sound
   - Edge cases handled
   - Error handling complete
   - Type safety verified

2. PERFORMANCE
   - No unnecessary re-renders
   - Optimal database queries (check for N+1)
   - Bundle impact assessed
   - Memory leaks prevented
   - Caching strategies applied

3. MAINTAINABILITY
   - Code is readable
   - Comments where needed
   - DRY principle applied
   - SOLID principles followed
   - Naming is clear

4. SECURITY
   - SQL injection prevention (if SQL used)
   - XSS prevention
   - CSRF protection
   - Authentication/authorization checks
   - Sensitive data not exposed
   - Input validation complete

5. ACCESSIBILITY
   - WCAG 2.1 Level AA compliance
   - Keyboard navigation
   - Screen reader support
   - Color contrast
   - ARIA attributes correct

6. TESTING
   - Unit tests written
   - Integration tests pass
   - Test coverage sufficient (>80%)
   - E2E scenarios covered

7. DOCUMENTATION
   - Code is self-documenting
   - Complex logic explained
   - API changes documented
   - Breaking changes noted

SCORE CARD:
- Correctness: [10/10]
- Performance: [10/10]
- Maintainability: [10/10]
- Security: [10/10]
- Accessibility: [10/10]
- Testing: [10/10]
- Documentation: [10/10]

SPECIFIC ISSUES FOUND:
[List any issues with exact line numbers/file paths]

SUGGESTIONS FOR IMPROVEMENT:
[Ranked by priority]

READY FOR PRODUCTION? [YES/NO]
If NO, what needs fixing?
```

---

## FASE 5: CONTINUOUS IMPROVEMENT
## Objective: Maintain momentum and quality

```
For the next iteration:

1. WHAT WORKED WELL?
   - Positive impacts from previous implementation
   - Lessons learned
   - Process improvements

2. NEXT 3 PRIORITY TASKS
   - Task: [what exactly needs to be done]
   - Why: [user/business value]
   - How: [implementation approach]
   - Effort: [estimated time]

3. BLOCKERS & DEPENDENCIES
   - What's blocking progress?
   - External dependencies needed?
   - Knowledge gaps to address?

4. METRICS TO TRACK
   - Performance improvements
   - User satisfaction impact
   - Technical debt reduction
   - Code quality metrics

5. FEEDBACK LOOP
   - What should we measure?
   - How to validate improvements?
   - User testing needed?
   - Analytics to collect?

RECOMMEND NEXT MOST IMPACTFUL CHANGE
```

---

## SPECIAL PROMPTS FOR SPECIFIC AREAS

### For UI/UX Improvements
```
Review the UI/UX of [COMPONENT_PATH]:

1. DESIGN ANALYSIS
   - Current visual design
   - Component interactions
   - User flow through feature
   - Pain points identified

2. IMPROVEMENT SUGGESTIONS
   - Design system alignment
   - Accessibility enhancements
   - User feedback incorporation
   - Mobile responsiveness
   - Dark mode support if applicable

3. EXACT CHANGES NEEDED
   - Tailwind CSS changes
   - Component refactoring
   - Animation/transition improvements
   - Responsive breakpoint fixes

4. BEFORE/AFTER SPECIFICATIONS
   - Visual mockups described
   - State transitions detailed
   - Interaction patterns specified
```

### For Performance Optimization
```
Analyze performance of [COMPONENT_PATH] or [API_ENDPOINT]:

1. CURRENT METRICS
   - Load time
   - Bundle impact
   - Runtime performance
   - Memory usage

2. BOTTLENECKS IDENTIFIED
   - Inefficient renders
   - Slow queries
   - Large assets
   - Blocking operations

3. OPTIMIZATION STRATEGY
   - Caching approach
   - Lazy loading implementation
   - Code splitting strategy
   - Database query optimization
   - API response compression

4. EXACT IMPLEMENTATION
   - Code changes needed
   - Dependencies to add
   - Configuration changes
   - Testing approach

EXPECTED IMPROVEMENTS:
- Load time reduction: X%
- Bundle size reduction: X KB
- Runtime performance: Y% faster
```

### For Security Review
```
Security audit of [FEATURE/FILE]:

1. THREAT ASSESSMENT
   - Potential vulnerabilities
   - Attack vectors identified
   - Data exposure risks
   - Authentication gaps

2. COMPLIANCE CHECK
   - OWASP Top 10 coverage
   - Data privacy (GDPR/local regulations)
   - Rate limiting needed
   - Input validation complete

3. FIXES REQUIRED
   - Specific code vulnerabilities
   - Library updates needed
   - Configuration hardening
   - Secrets management

4. SECURITY TESTING
   - Penetration testing recommendations
   - Security tests to add
   - Verification approach
```

---

## WORKFLOW EXECUTION STEPS

1. **Run Analysis Phase**
   ```bash
   python scripts/kimi-automation.py 1
   ```

2. **Review Generated Tasks**
   - Check `kimi_automation_logs/` for detailed output
   - Prioritize which task to implement first

3. **Implement Improvement**
   - Follow KIMI's detailed guidance
   - Use code examples provided
   - Execute step-by-step checklist

4. **Code Review**
   - Follow KIMI's review checklist
   - Address any issues flagged
   - Verify all criteria met

5. **Test Implementation**
   - Unit tests
   - Integration tests
   - Manual testing
   - Performance testing if applicable

6. **Next Iteration**
   ```bash
   python scripts/kimi-automation.py 1
   ```

---

## NOTES
- All prompts are designed for KIMI K2.5 with extended thinking
- Thinking mode enabled for deeper analysis
- Max tokens: 16384 for comprehensive responses
- Temperature: 1.0 for creative problem-solving
- Focus on production-ready, actionable code
