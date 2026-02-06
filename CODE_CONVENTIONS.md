"# TypeScript Strict Configuration Guide for PPSDM KMITS

## Table of Contents

1. [Naming Conventions](#naming-conventions)
2. [Component Naming Patterns](#component-naming-patterns)
3. [File Naming Conventions](#file-naming-conventions)
4. [Code Organization Guidelines](#code-organization-guidelines)
5. [Type Definitions](#type-definitions)
6. [Function Guidelines](#function-guidelines)

---

## Naming Conventions

### Interfaces

**Pattern:** PascalCase with descriptive names

```typescript
// Good
interface IUserProfile { }
interface UserRepository { }
interface AssessmentResult { }

// Bad
interface userProfile { }
interface iUserProfile { }
interface user_repo { }
```

### Types

```typescript
// Good
type UserId = string;
type AssessmentScore = number;
type DimensionType = 'cognitive' | 'physical' | 'spiritual';

// Bad
type user_id = string;
type assessmentScoreType { }
```

### Enums

```typescript
// Good
enum UserRole {
  ADMIN = 'ADMIN',
  MENTOR = 'MENTOR',
  STUDENT = 'STUDENT',
}

// Bad
enum user_roles { }
enum STATUS { }
```

### Variables

```typescript
// Good
const userProfile = { };
let currentAssessment: AssessmentResult | null = null;
const isValidInput = true;

// Bad
const UserProfile = { };
let CurrentAssessment = null;
const VALID_INPUT = true;
```

### Constants

```typescript
// Good - compile-time constants
const MAX_RETRY_COUNT = 3;
const DEFAULT_TIMEOUT_MS = 5000;

// Good - runtime constants
const apiEndpoints = {
  BASE_URL: '/api/v1',
  ASSESSMENT: '/assessment',
};
```

### Functions

```typescript
// Good
function calculateAssessmentScore(answers: Answer[]): number {
  return answers.reduce((sum, a) => sum + a.score, 0);
}

async function fetchUserProfile(userId: string): Promise<UserProfile> {
  // implementation
}

// Bad
function calculate(answers: Answer[]): number { }
function get() { }
function do_stuff() { }
```

---

## Component Naming Patterns

### React Components

```tsx
// UserProfile.tsx
export function UserProfile({ userId }: UserProfileProps) {
  // implementation
}

// Bad - lowercase
export const userProfile = ({ userId }) => { };
```

### Component Categories

| Category | Pattern | Example |
|----------|---------|---------|
| UI Components | PascalCase | Button.tsx |
| Feature Components | PascalCase | AssessmentCard.tsx |
| Pages | page.tsx | assessment/page.tsx |
| Utilities | camelCase | formatDate.ts |
| Hooks | camelCase with use prefix | useAuth.ts |

---

## File Naming Conventions

| File Type | Convention | Example |
|-----------|------------|---------|
| Components | PascalCase | UserProfile.tsx |
| Pages | kebab-case | assessment-page.tsx |
| Utilities | camelCase | formatDate.ts |
| Constants | UPPER_SNAKE_CASE | API_CONFIG.ts |
| Types | PascalCase | UserTypes.ts |
| Hooks | camelCase | useAuth.ts |
| Config | kebab-case | eslint.config.mjs |

---

## Code Organization Guidelines

### Import Order

```typescript
// 1. Node.js built-in modules
import { readFile } from 'fs/promises';
import path from 'path';

// 2. External dependencies
import { useState, useEffect } from 'react';
import { z } from 'zod';

// 3. Internal imports
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/hooks/useAuth';
import { formatDate } from '@/lib/utils/formatDate';
import type { User } from '@/types/user';
```

### Function Organization

```typescript
export function UserProfile({ userId }: UserProfileProps) {
  // 1. Hooks
  const { user, loading } = useUser(userId);
  
  // 2. State
  const [isEditing, setIsEditing] = useState(false);
  
  // 3. Computed values
  const displayName = user ? `${user.firstName} ${user.lastName}` : 'Unknown';
  
  // 4. Event handlers
  const handleEdit = () => setIsEditing(true);
  const handleSave = async () => { /* ... */ };
  const handleCancel = () => setIsEditing(false);
  
  // 5. Render
  if (loading) return <Spinner />;
  
  return (
    <div className="user-profile">
      {/* content */}
    </div>
  );
}
```

---

## Type Definitions

### Interface vs Type Alias

```typescript
// Use interface for object types that might be extended
interface User {
  id: string;
  name: string;
  email: string;
}

interface AdminUser extends User {
  permissions: string[];
}

// Use type alias for unions, primitives, or tuples
type UserId = string;
type AssessmentResult = SuccessResult | ErrorResult;
type Coordinate = [number, number];
```

### Generic Types

```typescript
// Good - Well-named generics
function getFirstItem<T>(items: T[]): T | null {
  return items.length > 0 ? items[0] : null;
}

interface Repository<T, TId> {
  findById(id: TId): Promise<T | null>;
  findAll(): Promise<T[]>;
}
```

---

## Function Guidelines

### Parameter Handling

```typescript
// Good - Typed parameters
async function createAssessment(
  data: CreateAssessmentDto,
  options: AssessmentOptions = {}
): Promise<Assessment> {
  // implementation
}

// Good - Destructured parameters
function formatUser({ firstName, lastName, age }: UserInput): FormattedUser {
  return { fullName: `${firstName} ${lastName}`, age };
}
```

### Return Types

```typescript
// Good - Explicit return types
export function calculateScore(answers: Answer[]): number {
  return answers.reduce((sum, a) => sum + a.score, 0);
}

// Good - Promise return types
export async function fetchUser(id: string): Promise<User | null> {
  const response = await api.get(`/users/${id}`);
  return response.data;
}

// Good - void for event handlers
export function handleClick(event: React.MouseEvent): void {
  event.preventDefault();
}
```

### Early Returns

```typescript
// Good - Early returns for guard clauses
function processAssessment(input: AssessmentInput): AssessmentResult {
  if (!input.isValid) {
    return { success: false, error: 'Invalid input' };
  }
  if (input.isComplete) {
    return { success: true, data: input.data };
  }
  return processIncomplete(input);
}

// Bad - Nested conditionals
function processAssessment(input: AssessmentInput): AssessmentResult {
  if (input.isValid) {
    if (input.isComplete) {
      return { success: true, data: input.data };
    } else {
      return processIncomplete(input);
    }
  } else {
    return { success: false, error: 'Invalid input' };
  }
}
```

---

## Summary

Following these conventions ensures:

1. **Consistency** across the codebase
2. **Readability** for team members
3. **Maintainability** as the project grows
4. **Type Safety** through strict TypeScript configuration" 
