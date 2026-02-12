# Color Contrast Fixes - PPSDM KMITS

## WCAG 2.1 AA Compliance Requirements

### Contrast Ratios Required:
- **Normal text** (under 18pt or 14pt bold): **4.5:1** minimum
- **Large text** (18pt and up or 14pt and up bold): **3:1** minimum
- **UI components and graphical objects**: **3:1** minimum

## Identified Color Contrast Issues

### 1. Dark Mode Issues (Slate Colors)

#### Issue 1.1: `text-slate-400` on `bg-slate-800`
- **Current**: text-slate-400 (#94a3b8) on bg-slate-800 (#1e293b)
- **Contrast Ratio**: ~3.2:1 (FAILS for normal text)
- **Fix**: Use `text-slate-300` (#cbd5e1) for ~5.1:1 contrast

#### Issue 1.2: `text-slate-500` on `bg-slate-700`
- **Current**: text-slate-500 (#64748b) on bg-slate-700 (#334155)
- **Contrast Ratio**: ~2.8:1 (FAILS for normal text)
- **Fix**: Use `text-slate-300` (#cbd5e1) for ~4.8:1 contrast

#### Issue 1.3: `text-slate-400` on `bg-slate-900`
- **Current**: text-slate-400 (#94a3b8) on bg-slate-900 (#0f172a)
- **Contrast Ratio**: ~4.1:1 (PASSES for normal text)
- **Status**: OK, but could be improved to `text-slate-300` for better readability

### 2. Light Mode Issues (Gray Colors)

#### Issue 2.1: `text-gray-400` on `bg-gray-800`
- **Current**: text-gray-400 (#9ca3af) on bg-gray-800 (#1f2937)
- **Contrast Ratio**: ~3.2:1 (FAILS for normal text)
- **Fix**: Use `text-gray-300` (#d1d5db) for ~5.1:1 contrast

#### Issue 2.2: `text-gray-500` on `bg-gray-700`
- **Current**: text-gray-500 (#6b7280) on bg-gray-700 (#374151)
- **Contrast Ratio**: ~2.8:1 (FAILS for normal text)
- **Fix**: Use `text-gray-300` (#d1d5db) for ~4.8:1 contrast

#### Issue 2.3: `text-gray-400` on `bg-gray-100`
- **Current**: text-gray-400 (#9ca3af) on bg-gray-100 (#f3f4f6)
- **Contrast Ratio**: ~2.1:1 (FAILS for normal text)
- **Fix**: Use `text-gray-600` (#4b5563) for ~5.1:1 contrast

### 3. Specific Component Issues

#### Issue 3.1: Dashboard Header
- **File**: `src/components/dashboard/Header.tsx`
- **Issue**: `text-slate-400` placeholder text
- **Fix**: Change to `text-slate-300`

#### Issue 3.2: Notification Badge
- **File**: `src/components/dashboard/Header.tsx`
- **Issue**: `bg-slate-600` badge with `text-white`
- **Fix**: Use `bg-slate-500` for better contrast

#### Issue 3.3: Form Labels
- **File**: `src/components/Form.tsx`
- **Issue**: `text-gray-500` hint text
- **Fix**: Change to `text-gray-600`

#### Issue 3.4: Loading Skeletons
- **File**: `src/components/dashboard/LoadingSkeletons.tsx`
- **Issue**: `bg-slate-700` on dark backgrounds
- **Fix**: Use `bg-slate-600` for better contrast

## Recommended Color Mappings

### Dark Mode (Slate)
| Current (Low Contrast) | Recommended (WCAG AA) | Use Case |
|------------------------|----------------------|----------|
| `text-slate-400` | `text-slate-300` | Body text, descriptions |
| `text-slate-500` | `text-slate-300` | Secondary text |
| `text-slate-600` | `text-slate-400` | Tertiary text |
| `bg-slate-700` | `bg-slate-600` | Cards, containers |
| `bg-slate-800` | `bg-slate-700` | Backgrounds |

### Light Mode (Gray)
| Current (Low Contrast) | Recommended (WCAG AA) | Use Case |
|------------------------|----------------------|----------|
| `text-gray-400` | `text-gray-600` | Body text, descriptions |
| `text-gray-500` | `text-gray-600` | Secondary text |
| `text-gray-600` | `text-gray-700` | Tertiary text |
| `bg-gray-100` | `bg-gray-200` | Cards, containers |
| `bg-gray-200` | `bg-gray-300` | Backgrounds |

## Implementation Priority

### Priority 1 (Critical - Affects readability)
1. Fix all `text-slate-400` → `text-slate-300` in dark mode
2. Fix all `text-slate-500` → `text-slate-300` in dark mode
3. Fix all `text-gray-400` → `text-gray-600` in light mode
4. Fix all `text-gray-500` → `text-gray-600` in light mode

### Priority 2 (High - Affects UI components)
1. Fix button text contrast
2. Fix form input placeholder contrast
3. Fix notification badge contrast
4. Fix loading skeleton contrast

### Priority 3 (Medium - Affects decorative elements)
1. Fix icon contrast
2. Fix border contrast
3. Fix divider contrast

## Testing

### Automated Testing
```bash
# Install axe-core for automated accessibility testing
npm install --save-dev @axe-core/react

# Run accessibility audit
npm run test:a11y
```

### Manual Testing
1. Use Chrome DevTools Lighthouse accessibility audit
2. Use axe DevTools extension
3. Test with high contrast mode enabled
4. Test with different color blindness simulators

## Files to Update

### High Priority Files
1. `src/components/dashboard/Header.tsx`
2. `src/components/dashboard/Sidebar.tsx`
3. `src/components/Form.tsx`
4. `src/components/dashboard/LoadingSkeletons.tsx`
5. `src/components/dashboard/ErrorDisplay.tsx`
6. `src/components/features/NudgeNotification.tsx`

### Medium Priority Files
1. `src/components/character/CharacterTracker.tsx`
2. `src/components/financial/FinanceSimulator.tsx`
3. `src/components/health/HealthTracker.tsx`
4. `src/components/gamification/GamificationSystem.tsx`
5. `src/components/gamification/PlayerHUD.tsx`

### Low Priority Files
1. `src/components/blueprint/BlueprintCanvas.tsx`
2. `src/components/blueprint/BlueprintNode.tsx`
3. `src/components/blueprint/BlueprintSidebar.tsx`
4. `src/components/blueprint/DetailModal.tsx`

## References

- [WCAG 2.1 AA Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Tailwind CSS Color Palette](https://tailwindcss.com/docs/customizing-colors)
- [Color Contrast Analyzer](https://www.tpgi.com/color-contrast-checker/)
