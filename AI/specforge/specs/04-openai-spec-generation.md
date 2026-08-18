# Spec 04 — OpenAI Spec Generation Service

## Goal

Create the backend OpenAI helper that turns a user's feature input into a structured technical specification JSON object.

This section only builds the OpenAI generation module. It does not create the `/specs` API route, does not save generated output to the database, and does not add frontend UI.

## Current State Assumed

- Section 01 backend foundation is complete.
- Section 02 database and migrations are complete.
- Section 03A and 03B backend auth sections are complete.
- `server/src/lib/` already exists or can be created.
- OpenAI API key and model values are already present in `server/.env`.

## Files Allowed to Change

- `server/package.json`
- `server/.env.example`
- `server/src/lib/openai.ts`

## Files Not Allowed to Change

- Frontend files inside `client/`
- Auth routes or auth middleware
- Database migration files
- Repository files
- Specs routes
- Dashboard routes
- Notification routes
- Test-only routes or temporary debug endpoints

## Implementation Steps

### 1. Add OpenAI dependency if missing

Add runtime dependency:

- `openai`

Do not add LangChain, AI SDK, workers, queues, or validation libraries in this section.

### 2. Update `server/.env.example`

Add only these OpenAI env values if missing:

```env
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
```

Do not add future deployment or frontend env variables.

### 3. Create `server/src/lib/openai.ts`

Create the OpenAI generation helper in this file.

Required exported input type:

```ts
export type GenerateSpecInput = {
  title: string;
  problem_description: string;
  tech_stack: string;
  complexity: "small" | "medium" | "large";
  notes?: string;
};
```

Required exported output type:

```ts
export type GeneratedSpecContent = {
  overview: string;
  api_endpoints: Array<{
    method: string;
    path: string;
    description: string;
    request_body: unknown;
    response: unknown;
  }>;
  database_schema: Array<{
    table: string;
    columns: Array<{
      name: string;
      type: string;
      notes?: string;
    }>;
  }>;
  frontend_components: string[];
  edge_cases: string[];
  implementation_phases: Array<{
    phase: number;
    title: string;
    tasks: string[];
  }>;
  estimated_effort: string;
};
```

Required exported function:

```ts
export async function generateTechnicalSpec(
  input: GenerateSpecInput,
): Promise<GeneratedSpecContent>;
```

### 4. OpenAI client rules

Inside `openai.ts`:

- Import the OpenAI Node SDK.
- Read `OPENAI_API_KEY` from env.
- Read `OPENAI_MODEL` from env, defaulting to `gpt-4o-mini`.
- Create the OpenAI client inside the module.
- Throw a clear error if `OPENAI_API_KEY` is missing.
- Use Chat Completions with JSON response format.
- Use a low temperature around `0.3`.

### 5. Prompt rules

The system prompt should say the model is a senior software architect.

The user prompt should include:

- title
- problem description
- tech stack
- complexity
- notes

The model must return valid JSON only.

The output shape must match `GeneratedSpecContent`.

Keep the prompt practical and compact. Do not over-engineer it.

### 6. JSON parsing rules

After the OpenAI response:

- Read the message content.
- If content is missing, throw a clear error.
- Parse JSON.
- Return it as `GeneratedSpecContent`.

Do not add heavy runtime schema validation in this section.

A lightweight sanity check is allowed, such as checking `overview` exists before returning.

## Verification

Do not add a test endpoint.

Do not call OpenAI automatically on server startup.

Only verify that the backend still starts without TypeScript/runtime errors:

```bash
cd server
npm run dev
```

Expected:

- Server starts.
- No TypeScript/runtime errors from `server/src/lib/openai.ts`.

The OpenAI helper will be exercised through the `/specs` create flow in the next section.

## Tracker Update

After implementation, update `context/tracker.md`:

- Mark Section 04 as completed.
- Set next section to Section 05 — Specs Create Async Generation.
- Keep notes short.
