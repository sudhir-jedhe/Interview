# Spec 06 — Read APIs for Specs, Dashboard, and Notifications

## Goal

Add the authenticated backend read APIs needed by the frontend pages:

- list specs
- view one spec
- dashboard stats
- list notifications
- mark notifications as read

This section is backend-only.

## Current State Assumed

- Section 01 backend foundation is complete.
- Section 02 database and migrations are complete.
- Section 03B backend auth is complete.
- Section 04 OpenAI helper is complete.
- Section 05 `POST /specs` async create flow is complete.
- `server/src/repository/spec.repository.ts` already exists.
- `server/src/repository/notification.repository.ts` already exists.
- `server/src/routes/specs.routes.ts` already exists.
- Auth middleware is available and can protect routes.

## Files Allowed to Change

- `server/src/routes/index.ts`
- `server/src/routes/specs.routes.ts`
- `server/src/routes/dashboard.routes.ts`
- `server/src/routes/notifications.routes.ts`
- `server/src/repository/spec.repository.ts`
- `server/src/repository/notification.repository.ts`
- `server/src/repository/dashboard.repository.ts`

## Files Not Allowed to Change

- Frontend files inside `client/`
- Database migration files
- Auth routes or auth middleware
- Google OAuth helper
- JWT helper
- OpenAI helper
- Spec create async generation behavior from Section 05
- Test-only routes or temporary debug endpoints

## APIs Built in This Section

### `GET /specs`

Auth required.

Returns all specs for the authenticated user, newest first.

Response shape:

```json
[
  {
    "id": "uuid",
    "title": "Feature title",
    "tech_stack": "Next.js, Express, PostgreSQL",
    "complexity": "medium",
    "status": "ready",
    "created_at": "2026-01-01T10:00:00.000Z"
  }
]
```

Do not include `generated_content` in the list response.

---

### `GET /specs/:id`

Auth required.

Returns one spec owned by the authenticated user.

Response shape:

```json
{
  "id": "uuid",
  "title": "Feature title",
  "problem_description": "Problem text",
  "tech_stack": "Next.js, Express, PostgreSQL",
  "complexity": "medium",
  "notes": "Optional notes",
  "generated_content": {},
  "status": "ready",
  "created_at": "2026-01-01T10:00:00.000Z"
}
```

If the spec does not exist for this user, return `404`.

---

### `GET /dashboard/stats`

Auth required.

Returns basic dashboard stats for the authenticated user:

```json
{
  "total_specs": 12,
  "specs_this_week": 3,
  "most_used_complexity": "medium",
  "most_used_tech_stack": "Next.js, Express, PostgreSQL",
  "last_generated_at": "2026-01-01T10:00:00.000Z"
}
```

Rules:

- If there are no specs, return `0` counts and `null` for values that do not exist.
- Keep this simple. No charts, no complex analytics.

---

### `GET /notifications`

Auth required.

Returns all notifications for the authenticated user, newest first:

```json
[
  {
    "id": "uuid",
    "spec_id": "uuid",
    "message": "Spec ready: Build team invite flow",
    "is_read": false,
    "created_at": "2026-01-01T10:00:00.000Z"
  }
]
```

---

### `PATCH /notifications/read`

Auth required.

Marks all current user's notifications as read.

Response:

```json
{
  "success": true
}
```

## Implementation Steps

### 1. Extend `server/src/repository/spec.repository.ts`

Add only these read helpers:

- `listSpecsByUser(userId: string)`
- `findSpecByIdForUser(specId: string, userId: string)`

Rules:

- Use raw `pg` parameterized queries.
- Scope every query by `user_id`.
- Keep list response light. Do not return `generated_content` from `listSpecsByUser`.
- Preserve the existing Section 05 create/update helpers.

### 2. Extend `server/src/repository/notification.repository.ts`

Add only these helpers:

- `listNotificationsByUser(userId: string)`
- `markAllNotificationsRead(userId: string)`

Rules:

- Use raw `pg` parameterized queries.
- Scope every query by `user_id`.
- Preserve the existing Section 05 create notification helpers.

### 3. Create `server/src/repository/dashboard.repository.ts`

Add one helper:

- `getDashboardStats(userId: string)`

Rules:

- Use simple SQL queries.
- It is okay to use 3–4 small queries instead of one complex query.
- Keep return keys exactly aligned with the dashboard stats API shape.
- Scope all queries by `user_id`.

### 4. Update `server/src/routes/specs.routes.ts`

Keep existing:

```txt
POST /
```

Add:

```txt
GET /
GET /:id
```

Rules:

- All routes require auth.
- `GET /:id` must only return specs owned by the current user.
- Return `404` for missing specs.
- Do not add edit or delete routes.

### 5. Create `server/src/routes/dashboard.routes.ts`

Add:

```txt
GET /stats
```

When mounted under `/dashboard`, this becomes:

```txt
GET /dashboard/stats
```

Rules:

- Route requires auth.
- Return the result from `getDashboardStats(userId)`.

### 6. Create `server/src/routes/notifications.routes.ts`

Add:

```txt
GET /
PATCH /read
```

When mounted under `/notifications`, these become:

```txt
GET /notifications
PATCH /notifications/read
```

Rules:

- Routes require auth.
- `PATCH /read` marks all current user's notifications as read.

### 7. Mount routes in `server/src/routes/index.ts`

Mount:

```txt
/dashboard
/notifications
```

Keep existing mounts:

```txt
/auth
/specs
/health
```

Do not remove or rename existing routes.

## Error Handling Rules

- For unauthenticated requests, rely on auth middleware.
- For missing spec detail, return `404`.
- For unexpected errors, return `500` with a simple message.
- Do not expose SQL error details to the client.

## Verification

Do not add test-only endpoints.

Do not require authenticated API testing in this section because frontend auth/API clients are not complete yet.

Only verify that the backend compiles/starts:

```bash
cd server
npm run dev
```

Expected:

- Server starts.
- Existing `/health` route still works.
- No TypeScript/runtime errors from the new read API files.

Full API testing will happen after frontend API clients and auth-aware layout exist.

## Tracker Update

After implementation, update `context/tracker.md`:

- Mark Section 06 as completed.
- Set next section to Section 07 — Frontend API Clients and Shared Types.
- Keep notes short.
