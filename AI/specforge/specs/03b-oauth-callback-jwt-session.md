# Spec 03B — OAuth Callback, JWT Cookie, and Session Endpoints

## Goal

Complete backend authentication after Section 03A by handling Google's OAuth callback, creating/finding the user, issuing an httpOnly JWT cookie, and adding session endpoints.

This section completes backend auth only. It does not add frontend auth pages or UI.

## Current State Assumed

- Section 03A is complete.
- `server/src/lib/google-oauth.ts` exists with:
  - `buildGoogleAuthUrl`
  - `exchangeCodeForAccessToken`
  - `fetchGoogleProfile`
- `GET /auth/google` already exists.
- Database migrations from Section 02 are complete.
- `users` table exists.
- Google OAuth values are already available in `server/.env`.

## Files Allowed to Change

- `server/package.json`
- `server/.env.example`
- `server/src/routes/auth.routes.ts`
- `server/src/middleware/auth.middleware.ts`
- `server/src/repository/user.repository.ts`
- `server/src/lib/jwt.ts`

## Files Not Allowed to Change

- Frontend files inside `client/`
- Database migration files
- OpenAI files
- Specs routes
- Dashboard routes
- Notification routes
- Test-only routes or temporary debug endpoints

## Implementation Steps

### 1. Add JWT dependency if missing

Add runtime dependency:

- `jsonwebtoken`

Add dev type dependency if needed:

- `@types/jsonwebtoken`

Do not add unrelated auth libraries.

### 2. Update `server/.env.example`

Add JWT env values only if missing:

```env
JWT_SECRET=
JWT_EXPIRES_IN=7d
```

Keep existing Google OAuth env values.

### 3. Create `server/src/lib/jwt.ts`

Create a small helper module.

Required exports:

- `signAuthToken(payload)`
- `verifyAuthToken(token)`

Token payload should contain only:

```ts
{
  userId: string;
  email: string;
}
```

Rules:

- Read `JWT_SECRET` from env.
- Use `JWT_EXPIRES_IN` with default `7d`.
- Throw clear errors for missing JWT secret.
- Do not store the full user profile inside the JWT.

### 4. Create `server/src/repository/user.repository.ts`

Create database functions for auth.

Required functions:

- `findUserByGoogleId(googleId: string)`
- `findUserById(userId: string)`
- `findOrCreateGoogleUser(input)`

Input shape for `findOrCreateGoogleUser`:

```ts
{
  googleId: string
  email: string
  name: string
  avatarUrl?: string
}
```

Rules:

- Use raw `pg` parameterized queries.
- Use the existing DB pool from Section 02.
- Map `avatar_url` to `avatarUrl`.
- Keep this repository focused on users only.

### 5. Create `server/src/middleware/auth.middleware.ts`

Create middleware that:

- Reads JWT from the `token` cookie.
- Verifies the token.
- Attaches a minimal authenticated user object to the request.
- Returns `401` if token is missing or invalid.

Keep the type approach simple.

### 6. Update `server/src/routes/auth.routes.ts`

Keep existing:

```txt
GET /auth/google
```

Add:

```txt
GET /auth/google/callback
GET /auth/me
POST /auth/logout
```

#### `GET /auth/google/callback`

Behavior:

1. Read `code` from query params.
2. Exchange code for Google access token.
3. Fetch Google profile.
4. Find or create the user in Postgres.
5. Sign JWT with `{ userId, email }`.
6. Set cookie named `token`.
7. Redirect to:

```txt
FRONTEND_URL/dashboard
```

Cookie rules for local dev:

```ts
httpOnly: true;
sameSite: "lax";
secure: false;
```

#### `GET /auth/me`

Behavior:

- Protected by auth middleware.
- Loads current user from the database using `userId`.
- Returns the current user object.

#### `POST /auth/logout`

Behavior:

- Clears the `token` cookie.
- Returns:

```json
{
  "success": true
}
```

## Verification

Do not add a test endpoint.

Do not require browser-based OAuth testing in this section because the frontend auth flow is not complete yet.

Only verify that the backend compiles/starts:

```bash
cd server
npm run dev
```

Expected:

- Server starts.
- No TypeScript/runtime errors from the new auth files.

Full end-to-end OAuth testing will happen later after frontend auth-aware layout and redirects exist.

## Tracker Update

After implementation, update `context/tracker.md`:

- Mark Section 03B as completed.
- Set next section to OpenAI spec generation.
- Keep notes short.
