# Spec 13B — Notification Bell and Final Polish

## Goal

Add the notification bell to the navbar and do final lightweight polish.

This is the final implementation section.

## Current State Assumed

- Section 07 frontend API clients and shared types are complete.
- Section 08 app layout and navbar are complete.
- Section 10 specs list page is complete.
- Section 11 create spec page is complete.
- Section 12 spec detail page is complete.
- Section 13A dashboard page is complete.
- Backend notification APIs exist:
  - `GET /notifications`
  - `PATCH /notifications/read`
- `client/src/lib/client.ts` exports `clientApiFetch`.
- `client/src/types/index.ts` contains `NotificationItem`.
- Theme tokens already exist in `client/src/app/globals.css`.

## Files Allowed to Change

- `client/src/components/notification-bell.tsx`
- `client/src/components/navbar.tsx`
- `client/src/app/specs/page.tsx`
- `client/src/app/dashboard/page.tsx`
- `README.md`

## Files Not Allowed to Change

- Backend files inside `server/`
- Database migration files
- API helper files
- Shared type files
- Spec create form behavior
- Spec detail output renderer behavior
- OpenAI helper
- Auth backend
- `client/src/app/globals.css`
- shadcn/ui generated files

## Implementation Steps

### 1. Create `client/src/components/notification-bell.tsx`

Create a client component.

Add `"use client"` at the top.

Behavior:

1. Fetch notifications from:

```txt
GET /notifications
```

using:

```ts
clientApiFetch<NotificationItem[]>("/notifications");
```

2. Poll every 10 seconds.

3. Show a bell-style button with unread count.

4. When the user opens the dropdown:
   - show recent notification messages
   - call:

```txt
PATCH /notifications/read
```

- update local state so unread count becomes zero

5. If notification fetch fails:
   - log the error
   - do not crash navbar

Rules:

- Keep the dropdown simple.
- Do not add a separate popover library.
- Do not add toast notifications.
- Do not add sound effects.
- Do not add browser push notifications.
- Do not add external icon libraries unless already installed.

If `lucide-react` is already installed, using `Bell` is acceptable. If not installed, use a simple text/icon fallback without adding a package.

### 2. Update `client/src/components/navbar.tsx`

In the authenticated state:

- render `<NotificationBell />`
- keep existing nav links and sign out behavior
- do not change auth logic

Unauthenticated state should not show notification bell.

### 3. Lightweight empty-state polish

Only touch the listed page files if needed.

Improve empty states without changing core logic:

#### `/specs`

If there are no specs, ensure the empty state clearly says:

```txt
No specs yet
```

and includes a link/button to:

```txt
/specs/new
```

#### `/dashboard`

If there are no recent specs, ensure the section says:

```txt
No recent specs yet
```

and includes a link/button to:

```txt
/specs/new
```

Do not redesign the pages.

### 4. Add root `README.md`

Create or update a concise root README.

Include:

- project name
- short description
- tech stack
- required env files
- how to start Postgres
- how to run backend
- how to run migrations
- how to run frontend
- short note that Google OAuth and OpenAI env values must exist

Keep README practical and not too long.

Do not add marketing-heavy text.

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

Notification bell styling guidance:

- button should be compact
- unread badge should be small
- dropdown should use `bg-card`, `border-border`, and `text-foreground`
- messages should use `text-muted-foreground` for secondary text

## Scope Limits

Do not build:

- notification page
- browser push notifications
- email notifications
- charts
- settings page
- profile page
- billing
- teams/orgs
- edit/delete specs
- export/download
- backend changes
- database changes

## Verification

Run from `client/`:

```bash
npm run build
```

Expected:

- Navbar builds with notification bell for authenticated users.
- Notification dropdown can fetch notifications.
- Opening dropdown marks notifications as read.
- Empty states remain clean.
- README contains local run commands.
- No backend files are changed.

If full auth testing is not ready locally, build verification is enough for this section.

## Tracker Update

After implementation, update `context/tracker.md`:

- Mark Section 13B as completed.
- Mark the core MVP as completed.
- Keep notes short.
