# Spec 13A — Dashboard Page

## Goal

Build the authenticated dashboard page.

The dashboard should show real stats from the backend and a small recent specs section.

This section is frontend-only.

## Current State Assumed

- Section 07 frontend API clients and shared types are complete.
- Section 08 app layout and navbar are complete.
- Section 10 specs list page is complete.
- Section 12 spec detail page is complete.
- Backend `GET /auth/me` exists.
- Backend `GET /dashboard/stats` exists.
- Backend `GET /specs` exists.
- `client/src/lib/server.ts` exports `serverApiFetch`.
- `client/src/types/index.ts` contains `User`, `DashboardStats`, and `SpecListItem`.
- `client/src/components/spec-card.tsx` exists.
- Theme tokens already exist in `client/src/app/globals.css`.

## Files Allowed to Change

- `client/src/app/dashboard/page.tsx`
- `client/src/components/stat-card.tsx`

## Files Not Allowed to Change

- Backend files inside `server/`
- `client/src/app/layout.tsx`
- `client/src/app/page.tsx`
- `client/src/app/specs/page.tsx`
- `client/src/app/specs/new/page.tsx`
- `client/src/app/specs/[id]/page.tsx`
- `client/src/components/navbar.tsx`
- `client/src/components/notification-bell.tsx`
- API helper files
- Shared type files
- `client/src/app/globals.css`
- shadcn/ui generated files

## Page Route

```txt
/dashboard
```

## Behavior

### Auth check

In `client/src/app/dashboard/page.tsx`:

1. Fetch current user using:

```ts
serverApiFetch<User>("/auth/me");
```

2. If no user is returned, redirect to:

```txt
/
```

3. If user exists, fetch:

```ts
serverApiFetch<DashboardStats>("/dashboard/stats");
serverApiFetch<SpecListItem[]>("/specs");
```

4. Render the dashboard.

Use Next.js `redirect` from `next/navigation`.

If stats or specs return `null`, render safe fallback values.

## Components

### 1. `client/src/components/stat-card.tsx`

Create a small reusable stat card.

Props:

```ts
type StatCardProps = {
  label: string;
  value: string | number;
  helper?: string;
};
```

Rules:

- Presentational only.
- No data fetching.
- No charts.
- Use theme tokens only.

### 2. `client/src/app/dashboard/page.tsx`

Render:

1. Page header
   - title: `Dashboard`
   - description: short text about spec generation activity

2. Four stat cards
   - Total Specs
   - Specs This Week
   - Most Used Complexity
   - Last Generated

3. Recent specs section
   - show latest 3 specs from the `/specs` response
   - reuse `SpecCard`
   - add `View all specs` link to `/specs`

## Data Formatting

For `last_generated_at`:

- If value exists, show a simple formatted date using JavaScript `Date`.
- If missing, show `No specs yet`.

For nullable stats:

- Use `—` or `No data yet`.

Do not add date-fns or extra formatting packages.

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

- page container: `mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8`
- stat grid:
  - desktop: 4 columns
  - tablet: 2 columns
  - mobile: 1 column
- recent specs grid:
  - desktop: 3 columns or 2 columns
  - mobile: 1 column

## Scope Limits

Do not build:

- notification bell
- mark notifications read
- charts
- graphs
- dashboard filters
- backend changes
- API helper changes
- edit/delete actions
- new dashboard APIs

Notification bell and final polish are handled in Section 13B.

## Verification

Run from `client/`:

```bash
npm run build
```

Expected:

- `/dashboard` page builds.
- Unauthenticated users are redirected to `/`.
- Dashboard uses real backend stats.
- Recent specs reuse `SpecCard`.
- No backend files are changed.

If full auth testing is not ready locally, build verification is enough for this section.

## Tracker Update

After implementation, update `context/tracker.md`:

- Mark Section 13A as completed.
- Set next section to Section 13B — Notification Bell and Final Polish.
- Keep notes short.
