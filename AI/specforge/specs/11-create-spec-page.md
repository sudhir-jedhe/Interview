# Spec 11 — Create Spec Page

## Goal

Build the authenticated create spec page.

This page lets a signed-in user submit a feature idea to `POST /specs`, then redirects back to `/specs` where the existing polling page can show the generating status.

This section is frontend-only.

## Current State Assumed

- Section 07 frontend API clients and shared types are complete.
- Section 08 app layout and navbar are complete.
- Section 10 specs list page and polling are complete.
- Backend `GET /auth/me` exists.
- Backend `POST /specs` exists.
- `client/src/lib/server.ts` exports `serverApiFetch`.
- `client/src/lib/client.ts` exports `clientApiFetch`.
- `client/src/types/index.ts` contains `User` and `SpecComplexity`.
- Theme tokens already exist in `client/src/app/globals.css`.

## Files Allowed to Change

- `client/src/app/specs/new/page.tsx`
- `client/src/components/spec-form.tsx`

## Files Not Allowed to Change

- Backend files inside `server/`
- `client/src/app/layout.tsx`
- `client/src/app/page.tsx`
- `client/src/app/specs/page.tsx`
- `client/src/app/specs/[id]/page.tsx`
- `client/src/app/dashboard/page.tsx`
- `client/src/components/navbar.tsx`
- `client/src/components/spec-card.tsx`
- `client/src/components/specs-polling-client.tsx`
- `client/src/components/notification-bell.tsx`
- API helper files
- Shared type files
- `client/src/app/globals.css`
- shadcn/ui generated files

## Page Route

```txt
/specs/new
```

## Behavior

### Auth check

In `client/src/app/specs/new/page.tsx`:

1. Fetch current user using:

```ts
serverApiFetch<User>("/auth/me");
```

2. If no user is returned, redirect to:

```txt
/
```

3. If user exists, render the create spec page.

Use Next.js `redirect` from `next/navigation`.

## Components

### 1. `client/src/app/specs/new/page.tsx`

Render the page shell.

Page layout:

- back link to `/specs`
- title: `Create New Spec`
- short description explaining that the user can enter a rough feature idea
- centered or readable form container
- render `<SpecForm />`

Suggested container:

```txt
mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8
```

Do not submit directly from the server page.

### 2. `client/src/components/spec-form.tsx`

Create a client component.

Add `"use client"` at the top.

Form fields:

| Field               | Input type | Required |
| ------------------- | ---------- | -------- |
| Feature title       | text input | yes      |
| Problem description | textarea   | yes      |
| Tech stack          | text input | yes      |
| Complexity          | select     | yes      |
| Additional notes    | textarea   | no       |

Use form field names matching backend request body:

```txt
title
problem_description
tech_stack
complexity
notes
```

Allowed complexity values:

```txt
small
medium
large
```

Submit behavior:

1. Prevent default submit.
2. Build request body from local state.
3. Do a simple client-side check:
   - title required
   - problem_description required
   - tech_stack required
4. Call:

```ts
clientApiFetch<{ id: string; status: "generating" }>("/specs", {
  method: "POST",
  body: JSON.stringify(payload),
});
```

5. While submitting:
   - disable submit button
   - button text: `Generating...`
6. On success:
   - redirect to `/specs`
7. On failure:
   - show a simple error message above the form

Use `useRouter` from `next/navigation`.

## Styling Rules

Use only installed theme tokens from `globals.css`.

Allowed examples:

- `bg-background`
- `bg-card`
- `bg-muted`
- `text-foreground`
- `text-muted-foreground`
- `border-border`
- `bg-primary`
- `text-primary-foreground`

Avoid random Tailwind colors such as:

- `bg-blue-600`
- `text-slate-500`
- `bg-green-100`
- `text-red-600`
- `bg-zinc-900`

Form styling guidance:

- form wrapper: `rounded-2xl border border-border bg-card p-6`
- labels: readable and close to inputs
- inputs/textareas/selects: use border and background tokens
- submit button: primary style
- secondary/back link: outline or muted style
- error message: keep simple and token-based; do not add strong random red classes

## Scope Limits

Do not build:

- specs list changes
- spec detail page
- dashboard page
- notification bell
- backend changes
- full validation library
- toast notifications
- file upload
- AI output preview on this page
- edit/delete functionality

Those come later or are intentionally excluded.

## Verification

Run from `client/`:

```bash
npm run build
```

Expected:

- `/specs/new` page builds.
- Unauthenticated users are redirected to `/`.
- Form submits to `POST /specs`.
- Successful submit redirects to `/specs`.
- No backend files are changed.

If full auth testing is not ready locally, build verification is enough for this section.

## Tracker Update

After implementation, update `context/tracker.md`:

- Mark Section 11 as completed.
- Set next section to Section 12 — View Spec Page and Output Renderer.
- Keep notes short.
