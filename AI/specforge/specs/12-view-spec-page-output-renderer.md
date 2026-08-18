# Spec 12 — View Spec Page and Output Renderer

## Goal

Build the authenticated spec detail page.

This page shows one generated technical spec, handles the `generating` state with lightweight polling, and renders the full structured AI output when the spec is ready.

This section is frontend-only.

## Current State Assumed

- Section 07 frontend API clients and shared types are complete.
- Section 08 app layout and navbar are complete.
- Section 10 specs list page and polling are complete.
- Section 11 create spec page is complete.
- Backend `GET /auth/me` exists.
- Backend `GET /specs/:id` exists.
- `client/src/lib/server.ts` exports `serverApiFetch`.
- `client/src/lib/client.ts` exports `clientApiFetch`.
- `client/src/types/index.ts` contains `User`, `SpecDetail`, and `GeneratedSpecContent`.
- Theme tokens already exist in `client/src/app/globals.css`.

## Files Allowed to Change

- `client/src/app/specs/[id]/page.tsx`
- `client/src/components/spec-output.tsx`
- `client/src/components/spec-status-poller.tsx`

## Files Not Allowed to Change

- Backend files inside `server/`
- `client/src/app/layout.tsx`
- `client/src/app/page.tsx`
- `client/src/app/specs/page.tsx`
- `client/src/app/specs/new/page.tsx`
- `client/src/app/dashboard/page.tsx`
- `client/src/components/navbar.tsx`
- `client/src/components/spec-card.tsx`
- `client/src/components/spec-form.tsx`
- `client/src/components/specs-polling-client.tsx`
- `client/src/components/notification-bell.tsx`
- API helper files
- Shared type files
- `client/src/app/globals.css`
- shadcn/ui generated files

## Page Route

```txt
/specs/[id]
```

## Important Next.js 16 Rule

Use `params` as a Promise in the dynamic route page.

Expected pattern:

```ts
type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function SpecDetailPage({ params }: PageProps) {
  const { id } = await params;
}
```

Do not use the older synchronous params pattern.

## Behavior

### Auth check

In `client/src/app/specs/[id]/page.tsx`:

1. Fetch current user using:

```ts
serverApiFetch<User>("/auth/me");
```

2. If no user is returned, redirect to:

```txt
/
```

3. If user exists, fetch spec detail using:

```ts
serverApiFetch<SpecDetail>(`/specs/${id}`);
```

4. If no spec is returned, call Next.js `notFound()`.

Use `redirect` and `notFound` from `next/navigation`.

## Page Layout

At the top of the page, render:

- back link to `/specs`
- spec title
- tech stack
- complexity
- status
- created date

Main content should depend on spec status.

### If status is `generating`

Render:

- a card saying the AI is generating the spec
- a lightweight loading/skeleton style
- `<SpecStatusPoller specId={spec.id} />`

### If status is `failed`

Render:

- a card saying generation failed
- helper text suggesting the user create a new spec
- link/button back to `/specs/new`

### If status is `ready`

Render:

```tsx
<SpecOutput content={spec.generated_content} />
```

If `generated_content` is missing even though status is `ready`, show a simple fallback card saying the output is unavailable.

## Components

### 1. `client/src/components/spec-output.tsx`

Create a presentational component.

Props:

```ts
type SpecOutputProps = {
  content: GeneratedSpecContent;
};
```

Render these sections:

1. Overview
2. API Endpoints
3. Database Schema
4. Frontend Components
5. Edge Cases
6. Implementation Phases
7. Estimated Effort

#### Overview

Render in a card with a paragraph.

#### API Endpoints

Render a simple table.

Columns:

- Method
- Path
- Description

Do not render full request/response JSON deeply. Keep it readable.

#### Database Schema

Render one card per table.

Each card should show:

- table name
- columns list with name, type, and optional notes

#### Frontend Components

Render a bulleted list.

#### Edge Cases

Render a numbered list.

#### Implementation Phases

Render one card per phase.

Each card should show:

- phase number
- title
- task list

Do not add accordion libraries in this section. Simple cards are enough.

#### Estimated Effort

Render a final callout card or badge-style card.

### 2. `client/src/components/spec-status-poller.tsx`

Create a client component.

Add `"use client"` at the top.

Props:

```ts
type SpecStatusPollerProps = {
  specId: string;
};
```

Behavior:

1. Poll:

```txt
GET /specs/:id
```

every 5 seconds using:

```ts
clientApiFetch<SpecDetail>(`/specs/${specId}`);
```

2. If status becomes `ready` or `failed`, refresh the route.

Use:

```ts
router.refresh();
```

from `next/navigation`.

Rules:

- Clean up interval properly.
- Log polling errors without crashing the page.
- Do not add toast notifications.
- Do not use external polling libraries.
- Do not duplicate the full spec output inside this component.

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

Layout guidance:

- page container: `mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8`
- cards: `rounded-2xl border border-border bg-card p-6`
- secondary text: `text-muted-foreground`
- keep output readable; do not create a dense wall of text

## Scope Limits

Do not build:

- edit spec
- delete spec
- export/download
- dashboard
- notification bell
- backend changes
- search/filter
- markdown renderer
- complex JSON viewer
- accordion package
- toast notifications

Those are either later sections or intentionally excluded.

## Verification

Run from `client/`:

```bash
npm run build
```

Expected:

- `/specs/[id]` page builds.
- Unauthenticated users are redirected to `/`.
- Missing specs render `notFound()`.
- Generating specs poll every 5 seconds.
- Ready specs render structured output.
- No backend files are changed.

If full auth testing is not ready locally, build verification is enough for this section.

## Tracker Update

After implementation, update `context/tracker.md`:

- Mark Section 12 as completed.
- Set next section to Section 13 — Dashboard, Notifications, and Final Polish.
- Keep notes short.
