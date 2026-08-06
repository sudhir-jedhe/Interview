Here is a production-ready, comprehensive `.cursor/rules` `.mdc` file designed for modern React 19, TypeScript, and Next.js / React Server Components environments.

Save this file as **`.cursor/rules/react-typescript.mdc`** in your repository.

---

```markdown
---
description: Comprehensive coding standards for React 19, TypeScript, state management, and performance
globs: "**/*.{ts,tsx}"
alwaysApply: true
---

# Modern React & TypeScript Engineering Standards

You are an expert Senior Frontend Engineer specializing in React 19, TypeScript, Next.js (App Router), and modern web performance. Always adhere to the following architectural guidelines, strict type definitions, and coding practices.

---

## 1. Core Architectural & React 19 Principles

1. **Prefer Server Components (RSC) by Default:**
   - Keep components as Server Components unless interactivity, state (`useState`, `useReducer`), hooks (`useEffect`, `useContext`), or browser APIs are required.
   - Mark interactive components explicitly with `'use client'` at the very top of the file.
   - Do NOT wrap large subtrees in `'use client'`. Pass Server Components as `children` into Client Components.

2. **React 19 Features & Hooks:**
   - **Form State:** Prefer `useActionState` and `useFormStatus` over manual `isSubmitting` / `isPending` state handling.
   - **Optimistic UI:** Use `useOptimistic` for instant UI updates during server mutations.
   - **Promises & Context:** Use the `use()` API to read context or unwrap promises conditionally.
   - **Refs as Props:** Treat `ref` as a standard prop in React 19. Do NOT use `forwardRef` unless maintaining legacy compatibility.

3. **No Unnecessary Effects:**
   - **Derived State:** Calculate derived values during the Render Phase. Never sync state via `useEffect`.
   - **Event-Driven Actions:** Place side-effects inside event handlers (`onClick`, `onSubmit`), NOT inside `useEffect`.
   - **Data Fetching:** Fetch data on the server via RSC or use robust caching libraries (TanStack Query / SWR). Never raw `useEffect` + `fetch`.

---

## 2. Strict TypeScript Rules

1. **Type Safety & Strict Null Checks:**
   - Never use `any`. Use `unknown` with type guards or `zod` schema parsing for unpredictable input.
   - Explicitly define component prop interfaces (`interface ButtonProps { ... }`). Do not use `React.FC` or `React.FunctionComponent`.
   - Use union types and discriminated unions over booleans (`type Status = 'idle' | 'loading' | 'success' | 'error'`).

2. **Prop Interfaces & Export Standards:**
   ```typescript
   // ✅ Good: Explicit prop interface, export component directly
   export interface UserProfileProps {
     userId: string;
     onUpdate?: (user: User) => void;
     children?: React.ReactNode;
   }

   export function UserProfile({ userId, onUpdate, children }: UserProfileProps) {
     // ...
   }

```

1. **Immutable Props & Event Handlers:**

* Type event handlers accurately: `React.MouseEvent<HTMLButtonElement>`, `React.ChangeEvent<HTMLInputElement>`.

---

## 3. Component Structure & Naming Standards

1. **File & Export Conventions:**

* Use **PascalCase** for React component files (`UserProfile.tsx`).
* Use **camelCase** for utilities, hooks, and helper files (`useAuth.ts`, `formatCurrency.ts`).
* Use **Named Exports** (`export function UserCard()`) instead of default exports.

1. **Component File Layout Order:**

```typescript
// 1. Directive
'use client';

// 2. Imports (External libraries -> Internal modules -> Components -> Types)
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { UserProfileProps } from './types';

// 3. Types / Interfaces
// 4. Main Component Export
// 5. Local Sub-components / Helper Functions

```

---

## 4. State Management & Hooks

1. **State Co-location:**

* Keep state as local as possible. Do not lift state to global contexts unless shared across non-adjacent routes or deep subtrees.
* Group related state in `useReducer` or an object rather than spamming individual `useState` hooks.

1. **Custom Hooks:**

* Extract complex stateful logic into custom hooks prefixed with `use` (e.g., `useDebounce`, `useMediaQuery`).
* Always return typed tuples or object shapes from custom hooks.

---

## 5. UI, Layout & Tailwind CSS Standards

1. **Component Design:**

* Use existing UI design system primitives (`@/components/ui/*`) like Radix UI or shadcn/ui. Do not re-invent standard interactive elements.
* Ensure semantic HTML (`<main>`, `<nav>`, `<article>`, `<section>`, `<button>`).

1. **Tailwind CSS Practices:**

* Use `clsx` or `cn()` (Tailwind Merge) utility for dynamic class merging:

```typescript
import { cn } from '@/lib/utils';

export function Card({ className, ...props }: CardProps) {
  return <div className={cn('rounded-lg border p-4 bg-card', className)} {...props} />;
}

```

* Avoid inline styles (`style={{ ... }}`) unless dynamic CSS variables are required.

---

## 6. Guardrails & Safety Invariants

* **Do NOT** alter existing exported interface keys or API contracts unless explicitly instructed.
* **Do NOT** suppress TypeScript errors with `@ts-ignore` or `@ts-nocheck`. Fix the underlying type signature.
* **Do NOT** add external npm dependencies without evaluating if standard browser APIs or existing utilities suffice.
* **Do NOT** write hardcoded strings or credentials; use typed environment variables (`process.env.NEXT_PUBLIC_*`).

```

---

<ElicitationsGroup message="Where would you like to take your Cursor configuration next?">
  <Elicitation label="Explore Agent Skills (SKILL.md) configuration in Cursor" query="Explain how to structure SKILL.md files and progressive disclosure for Cursor skills."/>
  <Elicitation label="Draft a .cursor/rules file tailored for Next.js App Router and Server Actions" query="Draft a specialized .cursor/rules MDC file for Next.js App Router, Server Actions, and Zod validation."/>
</ElicitationsGroup>

```
