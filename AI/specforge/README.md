# SpecForge

Turn rough feature ideas into structured technical specs using AI.

## Tech stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Express, TypeScript, PostgreSQL
- **Auth:** Google OAuth + JWT (httpOnly cookie)
- **AI:** OpenAI Chat Completions

## Environment files

Copy the example env files and fill in secrets:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env.local
```

### `server/.env`

Required for local development:

- `DATABASE_URL` — PostgreSQL connection string
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`
- `JWT_SECRET`
- `OPENAI_API_KEY`, `OPENAI_MODEL`
- `FRONTEND_URL` (default `http://localhost:3000`)
- `PORT` (default `4000`)

### `client/.env.local`

- `NEXT_PUBLIC_API_URL` — backend URL (default `http://localhost:4000`)

Google OAuth redirect URI in Google Cloud Console:

```txt
http://localhost:4000/auth/google/callback
```

## Local setup

### 1. Start PostgreSQL

From the project root:

```bash
docker compose up -d
```

Postgres runs on port `5438` (see `docker-compose.yml`).

### 2. Backend

```bash
cd server
npm install
npm run migrate
npm run dev
```

API: `http://localhost:4000`  
Health check: `GET /health`

### 3. Frontend

In a second terminal:

```bash
cd client
npm install
npm run dev
```

App: `http://localhost:3000`

## Project structure

```txt
client/     Next.js frontend
server/     Express API
specs/      Implementation specs (build guide)
```

Build for production:

```bash
cd server && npm run build && npm start
cd client && npm run build && npm start
```
