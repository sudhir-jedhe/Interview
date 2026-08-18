# Section 02 — Database and Migrations

## Goal

Add the PostgreSQL foundation for SpecForge.

This section should make the local database usable, create the first three tables, and provide a repeatable migration runner.

## Current State

Assume Section 01 is already completed.

The project already has:

- `client/` created manually with Next.js and shadcn/ui
- `server/` created manually with `package.json`, `tsconfig.json`, and `src/`
- minimal Express backend foundation from Section 01
- root `docker-compose.yml` file already present
- Cursor project rules in `.cursor/rules/`
- `context/tracker.md`

## Scope

Build only the database foundation.

Do not add:

- Google OAuth
- JWT middleware
- OpenAI integration
- spec generation routes
- dashboard routes
- notification routes
- frontend pages
- frontend components

## Files to Create or Update

Allowed root file:

- `docker-compose.yml`

Allowed backend files:

- `server/package.json`
- `server/.env.example`
- `server/src/db/pool.ts`
- `server/src/db/migrate.ts`
- `server/src/migrations/001_create_users.sql`
- `server/src/migrations/002_create_specs.sql`
- `server/src/migrations/003_create_notifications.sql`

Allowed tracking file:

- `context/tracker.md`

Do not modify frontend files in this section.

## Implementation Requirements

### 1. PostgreSQL Docker Compose

Update the root `docker-compose.yml` so it runs only PostgreSQL.

Use:

- service name: `postgres`
- image: `postgres:16`
- container name: `specforge_postgres`
- database: `specforge`
- user: `postgres`
- password: `postgres`
- port: `5438:5432`
- named volume for persistence

Keep this file simple. Do not add backend or frontend containers.

### 2. Backend Environment Example

Create or update `server/.env.example` with only values needed so far:

```env
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5438/specforge
FRONTEND_URL=http://localhost:3000
```

Do not add Google OAuth, JWT, or OpenAI env variables yet.

Those belong to later sections.

### 3. Backend Package Updates

Update `server/package.json` carefully.

Add database dependencies only if missing:

- `pg`

Add TypeScript/dev dependency only if missing:

- `@types/pg`

Add a migration script:

```json
"migrate": "tsx src/db/migrate.ts"
```

If `tsx` is not already present from Section 01, add it as a dev dependency.

Preserve existing scripts from Section 01.

Do not replace the entire package file unnecessarily.

### 4. Database Pool

Create `server/src/db/pool.ts`.

Requirements:

- import `Pool` from `pg`
- read `DATABASE_URL` from `process.env.DATABASE_URL`
- throw a clear error if `DATABASE_URL` is missing
- export a single shared pool instance
- keep the file small

Do not create repository functions in this section.

Repositories will be added when the related features need them.

### 5. Migration Runner

Create `server/src/db/migrate.ts`.

Requirements:

- load environment variables using `dotenv/config`
- create a `_migrations` table if it does not exist
- read `.sql` files from `server/src/migrations`
- sort migration files alphabetically
- skip files already recorded in `_migrations`
- run each pending SQL file
- insert the filename into `_migrations` after success
- log each migrated filename
- close the database pool at the end
- exit with a non-zero code if migration fails

Keep the migration runner beginner-friendly and readable.

Avoid complex abstractions.

### 6. Migration Files

Create exactly these three migration files.

#### `001_create_users.sql`

Create the `pgcrypto` extension and the `users` table.

Table requirements:

- `id` UUID primary key using `gen_random_uuid()`
- `google_id` unique and required
- `email` unique and required
- `name` required
- `avatar_url` optional
- `created_at` default current timestamp

#### `002_create_specs.sql`

Create the `specs` table.

Table requirements:

- UUID primary key
- `user_id` references `users(id)` and cascades on delete
- input fields for title, problem description, tech stack, complexity, and optional notes
- `generated_content` as `JSONB`
- `status` with allowed values: `generating`, `ready`, `failed`
- default status: `generating`
- `created_at` default current timestamp

Allowed complexity values:

- `small`
- `medium`
- `large`

#### `003_create_notifications.sql`

Create the `notifications` table.

Table requirements:

- UUID primary key
- `user_id` references `users(id)` and cascades on delete
- optional `spec_id` references `specs(id)` and cascades on delete
- `message` required
- `is_read` default false
- `created_at` default current timestamp

## Verification Steps

After Cursor implements this section, run:

```bash
cd server
npm install
```

Then start PostgreSQL from the project root:

```bash
docker compose up -d
```

Then run migrations:

```bash
cd server
npm run migrate
```

Expected result:

- PostgreSQL container starts
- migration runner logs the three migration files
- running `npm run migrate` again skips already-run migrations
- existing `/health` route from Section 01 still works

## Tracker Update

Update `context/tracker.md` after completion.

Use a short update only:

- mark Section 02 as completed
- set current/next section to Section 03 — Google OAuth and JWT Backend
- mention that PostgreSQL, DB pool, migration runner, and three migrations are ready
- list known issues only if any exist
