# HireLoop

A personal job application tracker. Sign in with Google or GitHub and every
application you add is yours alone — there's no shared dashboard between
accounts.

Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4,
shadcn/ui, Drizzle ORM, better-auth and Neon PostgreSQL.

## Getting started

```bash
npm install
cp .env.example .env.local        # add your Neon connection string, auth secret, OAuth apps
npm run db:migrate                # create the tables and indexes
npm run db:seed                   # sets up the demo account with 34 sample applications
npm run dev
```

Open http://localhost:3000 and sign in.

> Use Neon's **pooled** connection string (`…-pooler.…`). The client sets
> `prepare: false` because the pooler doesn't support prepared statements.

### Auth setup

HireLoop uses [better-auth](https://www.better-auth.com) with Google and
GitHub as the only sign-in methods.

1. Generate a secret: `openssl rand -base64 32` → `BETTER_AUTH_SECRET`.
2. Create a Google OAuth client at the
   [Cloud Console](https://console.cloud.google.com/apis/credentials) with
   redirect URI `{NEXT_PUBLIC_APP_URL}/api/auth/callback/google`.
3. Create a GitHub OAuth app at
   [github.com/settings/developers](https://github.com/settings/developers)
   with callback URL `{NEXT_PUBLIC_APP_URL}/api/auth/callback/github`.
4. Every application row belongs to the user who created it — new Google/GitHub
   sign-ins always start with an empty tracker. `npm run db:seed` creates a
   single shared **demo account** (`NEXT_PUBLIC_DEMO_EMAIL` /
   `NEXT_PUBLIC_DEMO_PASSWORD`) that the "Try the demo" button on `/login`
   signs into directly, so visitors can look around without an OAuth app of
   their own.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` / `start` | Production build and server |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint, including the React Compiler rules |
| `npm run db:generate` | Generate a migration from `db/schema.ts` |
| `npm run db:migrate` | Apply pending migrations |
| `npm run db:push` | Push the schema directly (interactive; needs a TTY) |
| `npm run db:studio` | Drizzle Studio |
| `npm run db:seed` | (Re)create the demo account and its sample dataset |

## Structure

```
app/
  (app)/            Dashboard shell — sidebar, topbar, mobile tabs
    dashboard/      Stats, widgets, charts
    applications/   Table, detail, new, edit
    board/          Kanban
    analytics/      Charts and distributions
    calendar/       Month view
    settings/       Preferences, import/export, danger zone
  api/auth/         better-auth's catch-all route handler
  login/            Google/GitHub/demo sign-in
  page.tsx          Landing page
actions/            Server actions (mutations, search, import/export)
components/
  analytics/ applications/ board/ calendar/ dashboard/
  landing/ layout/ settings/ shared/ ui/
constants/          Statuses, enums, labels, storage keys
db/
  schema.ts         Tables and indexes, including better-auth's user/session/account
  queries/          Read paths (server-only, request-memoised, scoped to the signed-in user)
  seed.ts
hooks/  lib/  schemas/  types/
lib/auth.ts         better-auth server config (social providers, demo sign-in)
lib/session.ts      getCurrentUserId() — the one place every query/action reads the session from
proxy.ts            Gates the dashboard routes behind a session; this Next.js
                    version renamed `middleware.ts` to `proxy.ts`
```

## Keyboard

`⌘K` command palette · `N` new application · `G` then `D`/`A`/`B`/`N`/`C`/`S`
to jump between sections.

## Notes on a few decisions

**Every row is owned, every query says so.** `applications.user_id` is
`notNull`, and every function in `db/queries/` and every server action reads
the current user from `lib/session.ts` and folds it into the `WHERE` clause
itself — there's no shared "current user" middleware that filters afterward.
Deleting or updating a row you don't own returns "no longer exists" rather
than a 403, the same as if it had never existed.

**Status history is the source of truth for rates.** Interview and offer rates
are computed from `application_status_history`, not the current status — so an
application rejected after a final round still counts as having reached an
interview. `applications` holds current state; the history table is append-only.

**Reads happen in SQL.** Counts, averages, group-bys and the date-bucketed trend
are aggregates, not row fetches, so payload size doesn't grow with the tracker.
Query functions are wrapped in React's `cache()` so widgets sharing an aggregate
cost one round trip per request.

**The URL is the list view's state.** Filters, sort and pagination all round-trip
through search params, which makes any view linkable and lets the server do the
filtering. `lib/search-params.ts` drops unknown values rather than throwing.

**Chart colours are validated, not chosen.** The six categorical slots in
`app/globals.css` were checked for colourblind separation, lightness band and
contrast in both light and dark modes (worst adjacent CVD ΔE 9.1 light / 8.4
dark). The order is the safety mechanism — don't reorder the `--chart-*`
variables. Breakdowns with many categories (status, source) use a single hue and
put identity in the label instead of spending 17 colours on it.

**Local preferences stay local.** Theme, default currency, monthly goal, pinned
applications and table column visibility live in `localStorage` via
`useSyncExternalStore`, so they hydrate without a cascading render. Favourites,
which are durable, are a database column.

**Loading boundaries are scoped, not global.** Most pages render their header
immediately and stream sections with correctly-shaped skeletons, so a
group-level `loading.tsx` would replace those with a worse generic one. Only the
detail and edit routes — which await a single row — get one.

## Verified

Against a live Neon database with the seeded dataset:

- All routes render, production build clean, no server errors
- Transactions on the pooled endpoint, `numeric` and `text[]` round-trips, the
  SQL favourite toggle, cascade delete, and skills search
- Every filter, combined filters, search, sort and pagination
- CSV/JSON export → re-import round-trip, including multi-line Markdown notes
  and loose header matching; validation rejects bad emails, non-http links and
  non-numeric salaries

There is no test suite in this project yet. Drag-and-drop, the ⌘K palette and
the toast/undo flows were not exercised by browser automation.

A `notFound()` on a dynamically-streamed route returns HTTP 200 with the correct
404 UI and `<meta name="robots" content="noindex">`. That is documented Next.js
behaviour for streamed responses, not a bug in this app.

## Deploying

Push to a repo and import it in Vercel. Set `DATABASE_URL` (pooled),
`NEXT_PUBLIC_APP_URL`, `BETTER_AUTH_SECRET`, the Google/GitHub OAuth
credentials, and `NEXT_PUBLIC_DEMO_EMAIL`/`NEXT_PUBLIC_DEMO_PASSWORD` if you
want the demo account. Run `npm run db:migrate` then `npm run db:seed` against
production once.
