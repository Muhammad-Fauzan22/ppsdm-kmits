# ARIA Implementation Guide - PPSDM KMITS

## WCAG 2.1 AA ARIA Requirements

### ARIA Roles
- **button**: For clickable elements that trigger actions
- **link**: For navigation links
- **navigation**: For navigation menus
- **main**: For main content area
- **complementary**: For sidebars and supplementary content
- **search**: For search inputs
- **dialog**: For modals and popups
- **alert**: For important messages
- **status**: For status indicators
- **progressbar**: For progress indicators
- **tablist**: For tab interfaces
- **tab**: For individual tabs
- **menu**: For dropdown menus
- **menuitem**: For menu items

### ARIA Properties
- **aria-label**: Provides an accessible name for elements without visible text
- **aria-labelledby**: Associates element with another element that provides its label
- **aria-describedby**: Associates element with another element that provides additional description
- **aria-expanded**: Indicates whether an expandable element is expanded
- **aria-hidden**: Hides elements from assistive technologies
- **aria-current**: Indicates the current item within a set
- **aria-selected**: Indicates the selected item
- **aria-disabled**: Indicates disabled state
- **aria-invalid**: Indicates invalid form field
- **aria-required**: Indicates required form field
- **aria-modal**: Indicates modal dialog
- **aria-live**: Indicates dynamic content region
- **aria-atomic**: Indicates whether updates to the region should be atomic
- **aria-busy**: Indicates element is being modified
- **aria-controls**: Identifies the element(s) whose contents or presence are controlled by the current element
- **aria-haspopup**: Indicates availability of popup menu
- **aria-pressed**: Indicates toggle button state
- **aria-checked**: Indicates checkbox/radio button state
- **aria-valuemin**: Minimum value for range widgets
- **aria-valuemax**: Maximum value for range widgets
- **aria-valuenow**: Current value for range widgets
- **aria-orientation**: Indicates orientation of element
- **aria-sort**: Indicates sort order of items

## Implementation Checklist

### ✅ Already Implemented
- [x] Navigation menus have `aria-label`
- [x] Modals have `aria-modal="true"`
- [x] Form inputs have `aria-label` or associated labels
- [x] Buttons have `aria-label` when needed
- [x] Breadcrumbs have `aria-label="Breadcrumb"`
- [x] Theme toggle has `aria-label="Toggle theme"`
- [x] Logout button has `aria-label="Log Out"`
- [x] Search inputs have `aria-label`
- [x] Progress bars have `aria-valuemax` and `aria-label`
- [x] Password strength indicators have `aria-label`

### ⚠️ Needs Review
- [ ] All interactive elements without visible text need `aria-label`
- [ ] Icon-only buttons need `aria-label`
- [ ] Dynamic content regions need `aria-live`
- [ ] Error messages need `aria-live="polite"`
- [ ] Success messages need `aria-live="polite"`
- [ ] Loading states need `aria-busy="true"`
- [ ] Tab interfaces need `role="tablist"` and `role="tab"`
- [ ] Dropdown menus need `aria-haspopup="true"`
- [ ] Toggle buttons need `aria-pressed`
- [ ] Checkboxes need `aria-checked`
- [ ] Radio buttons need `aria-checked`
- [ ] Range inputs need `aria-valuemin`, `aria-valuemax`, `aria-valuenow`
- [ ] Tooltips need `aria-describedby`
- [ ] Accordions need `aria-expanded` and `aria-controls`

## Code Examples

### Button with Icon Only
```tsx
// ❌ BAD - No accessible name
<button onClick={handleAction}>
  <Icon className="w-5 h-5" />
</button>

// ✅ GOOD - Has aria-label
<button onClick={handleAction} aria-label="Close modal">
  <Icon className="w-5 h-5" />
</button>
```

### Toggle Button
```tsx
// ❌ BAD - No state indication
<button onClick={toggleTheme}>
  <Icon className="w-5 h-5" />
</button>

// ✅ GOOD - Has aria-pressed
<button 
  onClick={toggleTheme} 
  aria-label="Toggle theme" 
  aria-pressed={isDarkMode}
>
  <Icon className="w-5 h-5" />
</button>
```

### Modal Dialog
```tsx
// ❌ BAD - Missing ARIA attributes
<div className="fixed inset-0 z-50">
  <div className="modal-content">
    <h2>Title</h2>
    <button onClick={onClose}>Close</button>
  </div>
</div>

// ✅ GOOD - Proper ARIA implementation
<div 
  className="fixed inset-0 z-50" 
  role="dialog" 
  aria-modal="true" 
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <div className="modal-content">
    <h2 id="modal-title">Title</h2>
    <p id="modal-description">Description</p>
    <button onClick={onClose} aria-label="Close modal">Close</button>
  </div>
</div>
```

### Form with Error Message
```tsx
// ❌ BAD - Error not associated with input
<div>
  <input type="email" />
  <p className="error">Invalid email</p>
</div>

// ✅ GOOD - Error associated with input
<div>
  <input 
    type="email" 
    aria-invalid="true" 
    aria-describedby="email-error"
  />
  <p id="email-error" className="error" role="alert">Invalid email</p>
</div>
```

### Tab Interface
```tsx
// ❌ BAD - No ARIA roles
<div>
  <button onClick={() => setActiveTab('tab1')}>Tab 1</button>
  <button onClick={() => setActiveTab('tab2')}>Tab 2</button>
</div>

// ✅ GOOD - Proper tab implementation
<div role="tablist">
  <button 
    role="tab" 
    aria-selected={activeTab === 'tab1'}
    aria-controls="panel-1"
    onClick={() => setActiveTab('tab1')}
  >
    Tab 1
  </button>
  <button 
    role="tab" 
    aria-selected={activeTab === 'tab2'}
    aria-controls="panel-2"
    onClick={() => setActiveTab('tab2')}
  >
    Tab 2
  </button>
</div>
<div id="panel-1" role="tabpanel" aria-labelledby="tab1">
  {/* Tab 1 content */}
</div>
<div id="panel-2" role="tabpanel" aria-labelledby="tab2">
  {/* Tab 2 content */}
</div>
```

### Dropdown Menu
```tsx
// ❌ BAD - No ARIA attributes
<button onClick={() => setShowMenu(!showMenu)}>
  Menu
  {showMenu && (
    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
    </ul>
  )}
</button>

// ✅ GOOD - Proper dropdown implementation
<button 
  onClick={() => setShowMenu(!showMenu)} 
  aria-haspopup="true" 
  aria-expanded={showMenu}
  aria-label="Menu"
>
  Menu
</button>
{showMenu && (
  <ul role="menu" aria-label="Menu items">
    <li role="menuitem">
      <button onClick={() => handleItemClick('item1')}>Item 1</button>
    </li>
    <li role="menuitem">
      <button onClick={() => handleItemClick('item2')}>Item 2</button>
    </li>
  </ul>
)}
```

### Progress Bar
```tsx
// ❌ BAD - No ARIA attributes
<div className="progress-bar">
  <div className="fill" style={{ width: '50%' }}></div>
</div>

// ✅ GOOD - Proper progress bar
<div 
  className="progress-bar" 
  role="progressbar" 
  aria-valuenow={50} 
  aria-valuemin={0} 
  aria-valuemax={100} 
  aria-label="Upload progress"
>
  <div className="fill" style={{ width: '50%' }}></div>
</div>
```

### Live Region for Dynamic Content
```tsx
// ❌ BAD - No live region
<div>
  {notifications.map(notif => (
    <div key={notif.id}>{notif.message}</div>
  ))}
</div>

// ✅ GOOD - Live region for announcements
<div aria-live="polite" aria-atomic="true" aria-label="Notifications">
  {notifications.map(notif => (
    <div key={notif.id} role="status">{notif.message}</div>
  ))}
</div>
```

### Loading State
```tsx
// ❌ BAD - No busy indication
<button onClick={handleSave} disabled={isLoading}>
  {isLoading ? 'Saving...' : 'Save'}
</button>

// ✅ GOOD - Busy state indicated
<button 
  onClick={handleSave} 
  disabled={isLoading}
  aria-busy={isLoading}
>
  {isLoading ? 'Saving...' : 'Save'}
</button>
```

## Testing Checklist

### Manual Testing
1. **Screen Reader Testing**
   - [ ] Test with NVDA (Windows)
   - [ ] Test with JAWS (Windows)
   - [ ] Test with VoiceOver (macOS)
   - [ ] Test with TalkBack (Android)
   - [ ] Test with Voice Control (iOS)

2. **Keyboard Navigation Testing**
   - [ ] Tab through all interactive elements
   - [ ] Verify focus order is logical
   - [ ] Test Enter/Space for activation
   - [ ] Test Escape for closing modals
   - [ ] Test Arrow keys for navigation
   - [ ] Verify focus indicators are visible

3. **Visual Testing**
   - [ ] Verify focus indicators are visible
   - [ ] Test high contrast mode
   - [ ] Test with different zoom levels
   - [ ] Verify color contrast meets WCAG AA

### Automated Testing
```bash
# Install axe-core for automated accessibility testing
npm install --save-dev @axe-core/react

# Run accessibility audit
npm run test:a11y

# Use axe DevTools extension in Chrome
# https://chrome.google.com/webstore/detail/axe-devtools/lhdoppojpmngadmnindnejefpokejb
```

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/TR/wai-aria-practices-1.1/)
- [ARIA in HTML](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA_roles)
- [axe DevTools](https://www.deque.com/axe/)
- [WAVE Web Accessibility Evaluation Tool](https://wave.webaim.org/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
