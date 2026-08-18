# Spec 05 — Specs Create API with Async Generation

## Goal

Create the authenticated backend API that accepts a spec request, saves it as `generating`, triggers OpenAI generation in the background, and updates the database when generation finishes.

This section builds only the create flow.

## Current State Assumed

- Section 01 backend foundation is complete.
- Section 02 database and migrations are complete.
- Section 03B backend auth is complete.
- Section 04 OpenAI generation helper is complete.
- `users`, `specs`, and `notifications` tables already exist.
- `generateTechnicalSpec()` exists in `server/src/lib/openai.ts`.
- Auth middleware already protects backend routes and exposes the current user id.

## Files Allowed to Change

- `server/src/routes/index.ts`
- `server/src/routes/specs.routes.ts`
- `server/src/repository/spec.repository.ts`
- `server/src/repository/notification.repository.ts`
- `server/src/middleware/auth.middleware.ts` only if a small exported request type is needed for TypeScript compatibility

## Files Not Allowed to Change

- Frontend files inside `client/`
- Database migration files
- Google OAuth helper
- JWT helper
- OpenAI helper behavior
- Dashboard routes
- Notification routes
- Test-only routes or temporary debug endpoints

## API Built in This Section

### `POST /specs`

Auth required.

Request body:

```json
{
  "title": "Build team invite flow",
  "problem_description": "Teams need a simple way to invite members.",
  "tech_stack": "Next.js, Express, PostgreSQL",
  "complexity": "medium",
  "notes": "Keep it simple for MVP."
}
```

Response should return immediately:

```json
{
  "id": "spec_uuid",
  "status": "generating"
}
```

Do not wait for OpenAI before responding.

## Implementation Steps

### 1. Create `server/src/repository/spec.repository.ts`

Add focused database helpers for the create flow only.

Required functions:

- `createSpec(input)`
- `markSpecReady(input)`
- `markSpecFailed(input)`

`createSpec(input)` inserts:

- `user_id`
- `title`
- `problem_description`
- `tech_stack`
- `complexity`
- `notes`
- `status = 'generating'`

It returns:

```ts
{
  id: string;
  status: "generating";
}
```

`markSpecReady(input)` updates:

- `generated_content`
- `status = 'ready'`

`markSpecFailed(input)` updates:

- `status = 'failed'`

Rules:

- Use raw `pg` parameterized queries.
- Do not add list/read helpers yet.
- Do not add delete/edit helpers.

### 2. Create `server/src/repository/notification.repository.ts`

Add only the notification helpers needed by the create flow.

Required functions:

- `createNotification(input)`
- `createSpecReadyNotification(input)`
- `createSpecFailedNotification(input)`

Keep messages simple.

Examples:

```txt
Generating spec: <title>
Spec ready: <title>
Spec failed: <title>
```

Rules:

- Use raw `pg` parameterized queries.
- Do not add notification list/read APIs yet.
- Do not add mark-read logic yet.

### 3. Create `server/src/routes/specs.routes.ts`

Create an Express router.

Add only:

```txt
POST /
```

When mounted under `/specs`, this becomes:

```txt
POST /specs
```

Route behavior:

1. Require auth middleware.
2. Read body fields.
3. Perform simple validation:
   - `title` required
   - `problem_description` required
   - `tech_stack` required
   - `complexity` must be `small`, `medium`, or `large`
4. Insert spec row with `status = 'generating'`.
5. Create initial notification.
6. Return `{ id, status: 'generating' }` immediately.
7. Start async generation after response path is created.

Async generation behavior:

1. Call `generateTechnicalSpec()` with the user's input.
2. On success:
   - update spec status to `ready`
   - save `generated_content`
   - create ready notification
3. On failure:
   - update spec status to `failed`
   - create failed notification
   - log the error on the server

Implementation rule:

Use a small internal async function in the route file, for example:

```ts
void runSpecGeneration(...)
```

Do not add a queue, worker, BullMQ, Redis, cron job, or background service in this section.

### 4. Mount specs route

Update `server/src/routes/index.ts`:

```txt
/specs
```

Do not remove existing health or auth routes.

## Error Handling Rules

For validation errors, return:

```json
{
  "message": "Readable error message"
}
```

Use status code `400`.

For unauthenticated requests, rely on the existing auth middleware.

For unexpected route errors, return status code `500` with a simple message.

Do not expose OpenAI error details to the client.

## Verification

Do not add a test endpoint.

Do not require full authenticated endpoint testing in this section because frontend auth is not complete yet.

Only verify that the backend compiles/starts:

```bash
cd server
npm run dev
```

Expected:

- Server starts.
- Existing `/health` route still works.
- No TypeScript/runtime errors from the new create-flow files.

Full create-flow testing will happen after frontend API client and create page exist.

## Tracker Update

After implementation, update `context/tracker.md`:

- Mark Section 05 as completed.
- Set next section to Section 06 — Read APIs for Specs, Dashboard, and Notifications.
- Keep notes short.
