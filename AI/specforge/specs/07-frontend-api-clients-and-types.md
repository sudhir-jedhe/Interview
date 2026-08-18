# Spec 07 — Frontend API Clients and Shared Types

## Goal

Create the frontend API helper layer and shared TypeScript types used by the upcoming pages.

This section is frontend-only.

It does not build navbar UI, homepage UI, specs pages, dashboard page, polling components, or auth redirects.

## Current State Assumed

- `client/` is an existing Next.js app.
- shadcn/ui is already installed with a theme.
- Backend Sections 01–06 are complete.
- Backend base URL is `http://localhost:4000` in local development.
- Backend uses an httpOnly cookie named `token`.
- Frontend should call the backend directly. Do not create Next.js API proxy routes.

## Files Allowed to Change

- `client/.env.example`
- `client/src/lib/server.ts`
- `client/src/lib/client.ts`
- `client/src/types/index.ts`

## Files Not Allowed to Change

- Backend files inside `server/`
- `client/src/app/layout.tsx`
- `client/src/app/page.tsx`
- Any route pages under `client/src/app/`
- UI components
- shadcn/ui generated files
- `client/src/app/globals.css`

## Implementation Steps

### 1. Create or update `client/.env.example`

Add:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Do not add OpenAI, Google OAuth, JWT secret, or backend-only env values to the frontend env example.

### 2. Create `client/src/types/index.ts`

Add shared frontend-facing types for backend responses.

Required types:

- `User`
- `SpecStatus`
- `SpecComplexity`
- `SpecListItem`
- `GeneratedSpecContent`
- `SpecDetail`
- `DashboardStats`
- `NotificationItem`

Use the backend shapes from completed sections.

Keep types simple and readable.

Do not add Zod schemas or runtime validators.

Expected enum-like unions:

```ts
export type SpecStatus = "generating" | "ready" | "failed";
export type SpecComplexity = "small" | "medium" | "large";
```

`GeneratedSpecContent` should match the OpenAI output shape from Section 04.

### 3. Create `client/src/lib/client.ts`

This file is for Client Components.

Required export:

```ts
export async function clientApiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T>;
```

Rules:

- Use `NEXT_PUBLIC_API_URL`, defaulting to `http://localhost:4000`.
- Use `credentials: "include"` so browser requests send the httpOnly cookie.
- Default `Content-Type` to `application/json`.
- Preserve custom headers from `options`.
- Throw a readable `Error` when `res.ok` is false.
- Return parsed JSON as `T`.
- Keep the helper generic and small.
- Do not add feature-specific functions yet, such as `createSpec()` or `getSpecs()`.

### 4. Create `client/src/lib/server.ts`

This file is for Server Components and server-side rendering.

Required export:

```ts
export async function serverApiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T | null>;
```

Rules:

- Mark the module as server-only using `import "server-only"`.
- Use `NEXT_PUBLIC_API_URL`, defaulting to `http://localhost:4000`.
- Read incoming cookies with `cookies()` from `next/headers`.
- Forward the cookie header to the backend.
- Set `cache: "no-store"`.
- Default `Content-Type` to `application/json`.
- Return `null` when the backend response is not OK.
- Return parsed JSON as `T` when successful.
- Keep this helper generic and small.
- Do not call any specific backend endpoint from this file.

### 5. Keep this section infrastructure-only

Do not add page-level logic.

Do not import these helpers into pages yet.

The upcoming sections will use these helpers when building layout, homepage, specs list, create page, detail page, and dashboard.

## Verification

Run from `client/`:

```bash
npm run dev
```

## Tracker Update

After implementation, update `context/tracker.md`:

- Mark Section 07 as completed.
- Set next section to Section 08 — App Layout, Navbar, and Auth State.
- Keep notes short.
