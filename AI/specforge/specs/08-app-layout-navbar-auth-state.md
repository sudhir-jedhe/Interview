# Spec 08 — App Layout, Navbar, and Auth State

## Goal

Add the shared frontend layout and auth-aware navbar.

This section should make the app shell feel connected to backend auth without building any feature pages yet.

## Current State Assumed

- Section 07 frontend API clients and shared types are complete.
- `client/src/lib/server.ts` exports `serverApiFetch`.
- `client/src/lib/client.ts` exports `clientApiFetch`.
- `client/src/types/index.ts` contains the `User` type.
- Backend auth endpoints exist:
  - `GET /auth/google`
  - `GET /auth/me`
  - `POST /auth/logout`
- shadcn/ui is already installed with a theme.
- Theme tokens already exist in `client/src/app/globals.css`.

## Files Allowed to Change

- `client/src/app/layout.tsx`
- `client/src/components/navbar.tsx`

## Files Not Allowed to Change

- Backend files inside `server/`
- Route pages such as:
  - `client/src/app/page.tsx`
  - `client/src/app/specs/page.tsx`
  - `client/src/app/dashboard/page.tsx`
- `client/src/lib/server.ts`
- `client/src/lib/client.ts`
- `client/src/types/index.ts`
- `client/src/app/globals.css`
- shadcn/ui generated files
- Notification bell component
- Specs pages
- Dashboard page

## Implementation Steps

### 1. Update `client/src/app/layout.tsx`

Make the root layout fetch the current user on the server.

Use:

```ts
serverApiFetch<User>("/auth/me");
```

Rules:

- If the request returns `null`, treat the user as unauthenticated.
- Do not redirect from the root layout.
- Render `<Navbar user={user} />` above the page content.
- Keep the main content wrapper simple.
- Do not add page-specific sections in the layout.

Expected layout structure:

```txt
<html>
  <body>
    <Navbar />
    <main>{children}</main>
  </body>
</html>
```

Preserve existing font setup and metadata if already present.

### 2. Create `client/src/components/navbar.tsx`

Create an auth-aware navbar component.

Props:

```ts
type NavbarProps = {
  user: User | null;
};
```

Navbar behavior:

#### Unauthenticated state

Show:

- logo text: `SpecForge`
- `Sign in with Google` button

The sign-in button should navigate to:

```txt
${NEXT_PUBLIC_API_URL}/auth/google
```

Fallback base URL:

```txt
http://localhost:4000
```

#### Authenticated state

Show:

- logo text linking to `/specs`
- nav link to `/specs`
- nav link to `/dashboard`
- small user identity area:
  - avatar image if `avatarUrl` exists
  - otherwise simple initials/fallback circle
  - user name or email
- `Sign out` button

Sign out behavior:

- call `clientApiFetch<{ success: boolean }>("/auth/logout", { method: "POST" })`
- after success, navigate to `/`
- use `window.location.href = "/"` or `router.push("/")`
- keep loading state simple

### 3. Styling rules

Use only existing shadcn/Tailwind theme tokens.

Use classes like:

- `bg-background`
- `bg-card`
- `text-foreground`
- `text-muted-foreground`
- `border-border`
- `bg-primary`
- `text-primary-foreground`

Do not use random Tailwind colors.

Suggested navbar layout:

- sticky or normal top bar is acceptable
- border bottom
- max width container
- logo on the left
- nav/actions on the right
- mobile should not break; simple wrapping or hidden small text is acceptable

### 4. Scope limits

Do not create the notification bell yet.

Do not protect `/specs` or `/dashboard` yet.

Do not create homepage, specs list, create spec page, detail page, or dashboard page.

Do not test full OAuth login flow here.

Feature pages will be added in later sections.

## Verification

Run from `client/`:

```bash
npm run dev
```

Expected:

- Frontend runs successfully.

Do not require full OAuth browser testing in this section.

## Tracker Update

After implementation, update `context/tracker.md`:

- Mark Section 08 as completed.
- Set next section to Section 09 — Public Homepage.
- Keep notes short.
