# Spec 01 — Project Foundation

## Goal

Create the minimal backend foundation for SpecForge so the Express API can run locally and return a health response.

This section must stay small. It should only prove that the backend app boots correctly.

## Current State

Manual setup is already complete. See:

- `manual-work/00-initial-project-setup.md`

## Implementation Tasks

### 1. Install minimal backend dependencies

Inside `server/`, install only what is needed for the initial Express API foundation.

Runtime dependencies:

```txt
express
cors
cookie-parser
dotenv
```

Dev dependencies:

```txt
typescript
tsx
@types/node
@types/express
@types/cors
@types/cookie-parser
```

### 2. Update backend scripts

In `server/package.json`, add these scripts:

```json
{
  "dev": "tsx watch src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js"
}
```

Do not add database, auth, OpenAI, migration, or seed scripts yet.

### 3. Keep TypeScript config simple

Update `server/tsconfig.json` only if required for a clean backend build.
Use a simple Node + Express TypeScript setup:

### 4. Create `.env.example`

Create:

```txt
server/.env.example
```

For this section, include only current foundation variables that are needed.

Do not add other env variables yet. Those belong to later specs.

### 5. Create route index

Create:

```txt
server/src/routes/index.ts
```

It should export one Express router with:

```txt
GET /health
```

Expected JSON response:

```json
{
  "status": "ok",
  "service": "specforge-api"
}
```

### 6. Create Express server entry

Create:

```txt
server/src/server.ts
```

Required behavior:

- Load environment variables with `dotenv/config`
- Create an Express app
- Enable CORS for `FRONTEND_URL`
- Enable credentials for cookies
- Enable JSON body parsing
- Enable cookie parsing
- Mount the route index
- Add a simple 404 handler
- Add a simple error handler
- Listen on `PORT` or `4000`

Keep the code beginner-friendly and direct. Do not introduce controllers, services, custom response wrappers, database connection code, or auth middleware yet.

## Scope Limits

Do not implement:

- PostgreSQL
- migrations
- repositories
- Google OAuth
- JWT
- OpenAI
- `/specs` routes
- `/dashboard` routes
- `/notifications` routes
- frontend pages
- frontend API clients
- Docker Compose database setup

## Verification

After Cursor finishes, run:

```bash
cd server
npm run dev
```

Then test in another terminal:

```bash
curl http://localhost:4000/health
```

Expected response:

```json
{ "status": "ok", "service": "specforge-api" }
```

Also verify TypeScript builds:

```bash
cd server
npm run build
```

## Tracker Update Required

After implementation, update `context/tracker.md`:

- Mark Section 01 as completed
- Set current/next section to Section 02 — Database and Migrations
- Add any important implementation note only if it affects future sections

Keep the tracker short. Do not paste code, endpoint docs, package lists, or long session notes into the tracker.
