# Spec 10 — Specs List Page and Polling

## Goal

Build the authenticated specs list page.

This page shows the user's generated specs, supports lightweight polling while any spec is still generating, and provides a clear entry point to create a new spec.

This section is frontend-only.

## Current State Assumed

- Section 07 frontend API clients and shared types are complete.
- Section 08 app layout and navbar are complete.
- Section 09 public homepage is complete.
- Backend `GET /auth/me` exists.
- Backend `GET /specs` exists.
- `client/src/lib/server.ts` exports `serverApiFetch`.
- `client/src/lib/client.ts` exports `clientApiFetch`.
- `client/src/types/index.ts` contains `User` and `SpecListItem`.
- Theme tokens already exist in `client/src/app/globals.css`.

## Files Allowed to Change

- `client/src/app/specs/page.tsx`
- `client/src/components/spec-card.tsx`
- `client/src/components/specs-polling-client.tsx`

## Files Not Allowed to Change

- Backend files inside `server/`
- `client/src/app/layout.tsx`
- `client/src/app/page.tsx`
- `client/src/components/navbar.tsx`
- `client/src/app/specs/new/page.tsx`
- `client/src/app/specs/[id]/page.tsx`
- `client/src/app/dashboard/page.tsx`
- `client/src/components/notification-bell.tsx`
- API helper files
- Shared type files
- `client/src/app/globals.css`
- shadcn/ui generated files

## Page Route

```txt
/specs
```

## Behavior

### Auth check

In `client/src/app/specs/page.tsx`:

1. Fetch current user using:

```ts
serverApiFetch<User>("/auth/me");
```

2. If no user is returned, redirect to:

```txt
/
```

3. If user exists, fetch specs using:

```ts
serverApiFetch<SpecListItem[]>("/specs");
```

4. Render the specs list page.

Use Next.js `redirect` from `next/navigation`.

### Initial data fetch

The page should fetch the initial specs server-side.

If the backend returns `null`, treat it as an empty array.

Do not add loading skeletons in this section because the initial render is server-side.

## Components

### 1. `client/src/components/spec-card.tsx`

Create a reusable spec card.

Props:

```ts
type SpecCardProps = {
  spec: SpecListItem;
};
```

Card should show:

- title
- tech stack
- complexity badge
- status badge
- created date
- `View Spec` link to `/specs/[id]`

Status display:

- `generating` → show `Generating`
- `ready` → show `Ready`
- `failed` → show `Failed`

Complexity display:

- `small` → `Small`
- `medium` → `Medium`
- `large` → `Large`

Styling:

- Use theme tokens only.
- Use `rounded-2xl border border-border bg-card p-5` or similar.
- Use `text-muted-foreground` for secondary text.
- Use `bg-primary text-primary-foreground` only for primary action if needed.
- Do not use random color classes.

Important:

- Do not add edit/delete buttons.
- Do not add generated output rendering here.
- Do not fetch data inside this component.

### 2. `client/src/components/specs-polling-client.tsx`

Create a client component for polling.

Props:

```ts
type SpecsPollingClientProps = {
  initialSpecs: SpecListItem[];
};
```

Behavior:

1. Store specs in local state.
2. Check if any spec has `status === "generating"`.
3. If at least one spec is generating, poll:

```txt
GET /specs
```

every 4 seconds using `clientApiFetch<SpecListItem[]>("/specs")`.

4. Stop polling when no spec is generating.
5. Show the current list using `SpecCard`.

Rules:

- Add `"use client"` at the top.
- Keep polling logic simple with `useEffect`.
- Clean up interval properly.
- If polling fails once, do not crash the page. Log the error and continue normal rendering.
- Do not add toast notifications yet.
- Do not use external polling libraries.
- Do not add notification bell behavior here.

### 3. `client/src/app/specs/page.tsx`

Render page layout:

Top row:

- title: `Your Specs`
- description: short helper text
- `New Spec` link/button to `/specs/new`

Main content:

- If no specs:
  - show an empty state card
  - include a link/button to `/specs/new`
- If specs exist:
  - render `<SpecsPollingClient initialSpecs={specs} />`

Grid layout:

- Desktop: 2 columns
- Mobile: 1 column

Use a max-width page container:

```txt
mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8
```

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

For badges, prefer neutral token-based styling:

- base badge: `rounded-full border border-border px-2.5 py-1 text-xs`
- ready/generating/failed can use text labels without unique colors if needed
- do not invent many status colors

## Scope Limits

Do not build:

- create spec form
- spec detail page
- dashboard page
- notification bell
- auth callback page
- backend changes
- edit/delete functionality
- search/filter UI

Those come later or are intentionally excluded.

## Verification

Run from `client/`:

```bash
npm run build
```

Expected:

- `/specs` page builds.
- Unauthenticated users are redirected to `/`.
- Authenticated users see their specs.
- Polling only runs when a spec has `status: "generating"`.
- No backend files are changed.

If full auth testing is not ready locally, build verification is enough for this section.

## Tracker Update

After implementation, update `context/tracker.md`:

- Mark Section 10 as completed.
- Set next section to Section 11 — Create Spec Page.
- Keep notes short.
