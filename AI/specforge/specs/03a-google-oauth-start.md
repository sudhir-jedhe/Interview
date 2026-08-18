# Spec 03A — Google OAuth Start Route

## Goal

Add the first half of backend authentication: environment variables, Google OAuth helper functions, and the route that builds the Google OAuth redirect URL.

This section does not complete login. The callback, JWT cookie, `/auth/me`, and logout are handled in Section 03B.

## Current State Assumed

- Section 01 backend foundation is complete.
- Section 02 database and migrations are complete.
- `server/src/server.ts` exists.
- `server/src/routes/index.ts` exists and is mounted by the server.
- `server/.env.example` exists.
- Root `docker-compose.yml` and Postgres setup already exist.
- Google Cloud OAuth setup is completed.
- Required Google OAuth values are added to `server/.env`.

## Files Allowed to Change

- `server/package.json`
- `server/.env.example`
- `server/src/routes/index.ts`
- `server/src/routes/auth.routes.ts`
- `server/src/lib/google-oauth.ts`

## Files Not Allowed to Change

- Frontend files inside `client/`
- Database migration files
- Repository files
- OpenAI files
- Specs feature routes
- Dashboard routes
- Notification routes
- Test-only endpoints

## Implementation Steps

### 1. Keep package changes minimal

Do not add Google SDK packages in this section.

Use standard `fetch`, `URL`, and `URLSearchParams`.

### 2. Update `server/.env.example`

Add only these auth-related values if missing:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:4000/auth/google/callback
FRONTEND_URL=http://localhost:3000
```

Do not add OpenAI or future feature env variables.

### 3. Create `server/src/lib/google-oauth.ts`

Create a small helper module.

Required exports:

- `buildGoogleAuthUrl()`
- `exchangeCodeForAccessToken(code: string)`
- `fetchGoogleProfile(accessToken: string)`

Expected Google profile shape:

```ts
{
  id: string
  email: string
  name: string
  picture?: string
}
```

Rules:

- Read credentials from `process.env`.
- Throw clear errors if required values are missing.
- Use `URLSearchParams` for OAuth query/body data.
- Do not touch the database here.
- Do not sign JWTs here.

### 4. Create `server/src/routes/auth.routes.ts`

Create an Express router with only:

```txt
GET /auth/google
```

Behavior:

- Calls `buildGoogleAuthUrl()`.
- Redirects to the returned Google URL.
- Does not implement `/auth/google/callback`.
- Does not set cookies.
- Does not query the database.

### 5. Mount auth routes

Update `server/src/routes/index.ts` so the auth router is mounted at:

```txt
/auth
```

Do not remove the existing health route.

## Verification

Do not add a test endpoint.

Do not require full OAuth browser testing in this section.

Only verify that the backend still starts without TypeScript/runtime errors:

```bash
cd server
npm run dev
```

Expected:

- Server starts.
- Existing `/health` behavior is not broken.

Full OAuth testing will happen later after the frontend auth flow exists.

## Tracker Update

After implementation, update `context/tracker.md`:

- Mark Section 03A as completed.
- Set next section to Section 03B.
- Keep notes short.
