# Form Label Validation Guide - PPSDM KMITS

## WCAG 2.1 AA Form Label Requirements

### Label Association Methods
1. **Explicit Label Element**: Use `<label>` with `htmlFor` attribute
2. **Implicit Label**: Wrap input inside `<label>` element
3. **aria-label**: Provide accessible name for elements without visible labels
4. **aria-labelledby**: Associate element with another element that provides its label
5. **aria-describedby**: Associate element with additional description

### Required Attributes
- **required**: Indicates required form field
- **aria-required**: Alternative to `required` attribute
- **aria-invalid**: Indicates invalid form field
- **aria-describedby**: Associates error message with input
- **placeholder**: Provides hint (not a substitute for label)

## Implementation Checklist

### ✅ Already Implemented
- [x] Form.tsx has proper label associations
- [x] Input components have `label` prop
- [x] Textarea components have `label` prop
- [x] Select components have `label` prop
- [x] Checkbox components have `label` prop
- [x] Radio components have `label` prop
- [x] DateInput components have `label` prop
- [x] SearchInput has `placeholder` attribute
- [x] FormValidation has proper error associations
- [x] AccessibleComponents has proper ARIA attributes

### ⚠️ Needs Review
- [ ] All inputs without visible labels need `aria-label`
- [ ] All inputs need `required` or `aria-required` for required fields
- [ ] Error messages need `aria-describedby` association
- [ ] Placeholder text should not be used as label substitute
- [ ] All form groups need proper fieldset/legend
- [ ] Range inputs need `aria-valuemin`, `aria-valuemax`, `aria-valuenow`
- [ ] Checkbox groups need proper fieldset/legend
- [ ] Radio button groups need proper fieldset/legend

## Code Examples

### ✅ GOOD: Explicit Label
```tsx
// Using label with htmlFor
<label htmlFor="email">Email</label>
<input 
  id="email" 
  type="email" 
  required 
  aria-required="true"
/>
```

### ✅ GOOD: Implicit Label
```tsx
// Wrapping input inside label
<label>
  Email
  <input type="email" required />
</label>
```

### ✅ GOOD: aria-label for Icon-Only Inputs
```tsx
// Input with icon, no visible label
<div className="relative">
  <span className="absolute left-3">
    <SearchIcon />
  </span>
  <input 
    type="text" 
    aria-label="Search"
    placeholder="Search..."
  />
</div>
```

### ✅ GOOD: Error Message Association
```tsx
// Error message associated with input
<div>
  <input 
    id="email"
    type="email" 
    aria-invalid="true"
    aria-describedby="email-error"
  />
  <p id="email-error" role="alert" className="error">
    Please enter a valid email address
  </p>
</div>
```

### ✅ GOOD: Required Field
```tsx
// Required field with aria-required
<label htmlFor="password">Password</label>
<input 
  id="password" 
  type="password" 
  required 
  aria-required="true"
/>
```

### ✅ GOOD: Range Input with ARIA
```tsx
// Range input with proper ARIA attributes
<label htmlFor="volume">Volume</label>
<input 
  id="volume"
  type="range"
  min="0"
  max="100"
  aria-valuemin="0"
  aria-valuemax="100"
  aria-valuenow={volume}
  aria-label="Volume control"
/>
```

### ✅ GOOD: Checkbox Group
```tsx
// Checkbox group with fieldset/legend
<fieldset>
  <legend>Select your interests</legend>
  <div>
    <label>
      <input type="checkbox" name="interest" value="coding" />
      Coding
    </label>
    <label>
      <input type="checkbox" name="interest" value="design" />
      Design
    </label>
  </div>
</fieldset>
```

### ✅ GOOD: Radio Button Group
```tsx
// Radio button group with fieldset/legend
<fieldset>
  <legend>Choose your plan</legend>
  <div>
    <label>
      <input type="radio" name="plan" value="free" />
      Free Plan
    </label>
    <label>
      <input type="radio" name="plan" value="premium" />
      Premium Plan
    </label>
  </div>
</fieldset>
```

### ❌ BAD: Placeholder as Label
```tsx
// BAD - Placeholder should not be used as label
<input 
  type="text" 
  placeholder="Email Address" 
  // Missing label!
/>

// GOOD - Proper label with placeholder as hint
<label htmlFor="email">Email Address</label>
<input 
  id="email" 
  type="email" 
  placeholder="example@its.ac.id"
/>
```

### ❌ BAD: No Error Association
```tsx
// BAD - Error not associated with input
<div>
  <input type="email" />
  <p className="error">Invalid email</p>
  // Screen reader won't know this error is for the input
</div>

// GOOD - Error associated with input
<div>
  <input 
    id="email"
    type="email" 
    aria-invalid="true"
    aria-describedby="email-error"
  />
  <p id="email-error" role="alert" className="error">
    Invalid email
  </p>
</div>
```

## Testing Checklist

### Manual Testing
1. **Screen Reader Testing**
   - [ ] Verify all inputs have accessible labels
   - [ ] Verify required fields are announced
   - [ ] Verify error messages are associated with inputs
   - [ ] Verify form validation messages are announced

2. **Keyboard Testing**
   - [ ] Tab through all form fields
   - [ ] Verify focus order is logical
   - [ ] Verify required fields are indicated
   - [ ] Verify error fields receive focus

3. **Visual Testing**
   - [ ] Verify labels are visually associated with inputs
   - [ ] Verify required indicators are visible
   - [ ] Verify error messages are visually associated
   - [ ] Verify focus indicators are visible on form fields

### Automated Testing
```bash
# Install axe-core for automated accessibility testing
npm install --save-dev @axe-core/react

# Run accessibility audit
npm run test:a11y

# Use axe DevTools extension in Chrome
# https://chrome.google.com/webstore/detail/axe-devtools/lhdoppojpmngadmnindnejefpokejb
```

## Form Validation Best Practices

### 1. Provide Clear Instructions
- Explain what information is needed
- Provide examples of expected format
- Explain why information is needed (when appropriate)

### 2. Give Immediate Feedback
- Show validation errors immediately
- Use clear, specific error messages
- Associate errors with the relevant field

### 3. Use Appropriate Input Types
- Use `type="email"` for email addresses
- Use `type="tel"` for phone numbers
- Use `type="url"` for web addresses
- Use `type="number"` for numeric input

### 4. Group Related Fields
- Use `<fieldset>` and `<legend>` for related radio/checkbox groups
- Use visual grouping with borders or spacing
- Provide group-level instructions

### 5. Make Forms Keyboard Accessible
- Ensure all form controls are keyboard accessible
- Provide clear focus indicators
- Support keyboard shortcuts where appropriate

### 6. Provide Success Feedback
- Confirm successful form submission
- Provide next steps after submission
- Use `aria-live` regions for dynamic messages

## Resources

- [WCAG 2.1 Form Requirements](https://www.w3.org/WAI/WCAG21/quickref/#input-purposes)
- [ARIA Authoring Practices](https://www.w3.org/TR/wai-aria-practices-1.1/)
- [HTML5 Form Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility/HTML/Forms)
- [Form Accessibility Best Practices](https://webaim.org/techniques/forms/)
- [axe DevTools](https://www.deque.com/axe/)
