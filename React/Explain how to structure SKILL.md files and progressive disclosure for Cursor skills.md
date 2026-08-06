In Agentic AI workflows and tools like Cursor, **Agent Skills** extend what the model can do beyond its base context. Instead of forcing the model to read an enormous, monolithic instruction manual on every prompt (which wastes context and degrades reasoning), **Progressive Disclosure** loads detailed instructions **only when a specific task demands them**.

---

# Architecture of Agent Skills & Progressive Disclosure

```text
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 1. CONTEXT INITIALIZATION (Always Loaded — Ultra Low Footprint)        │
 │ • System Prompt + Agent Rules (.cursor/rules/*.mdc)                     │
 │ • Index of Available Skills: Names, Brief Descriptions, Trigger Globs   │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │
                             Matches User Intent
                                     │
                                     ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 2. DYNAMIC SKILL INVOCATION (Progressive Disclosure)                   │
 │ • Agent reads specific SKILL.md file (.cursor/skills/<name>/SKILL.md)  │
 │ • Injecting specialized runbook, workflow steps, and edge-case rules   │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │
                             Needs Secondary Action
                                     │
                                     ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 3. DEEP EXECUTABLE RESOURCE (Lazy Loaded on Demand)                     │
 │ • Agent executes targeted script or reads reference schema           │
 └────────────────────────────────────────────────────────────────────────┘

```

---

## 1. What is Progressive Disclosure?

**Progressive Disclosure** is a design principle where information is revealed in layers as needed, rather than all at once up front:

1. **Level 1 (Metadata Index):** The agent always knows *what skills exist* via a lightweight index (Skill Name + 1-sentence Description). This costs almost zero tokens.
2. **Level 2 (Skill Instructions):** When the user asks for a task matching a skill (e.g., *"Refactor database schema with Prisma"* or *"Run E2E Playwright tests"*), the agent reads `SKILL.md` into active memory.
3. **Level 3 (Execution Artifacts / References):** If the skill references complex JSON schemas, script files, or long API documentation, the agent accesses those files only when executing that specific step.

---

## 2. Recommended Directory Structure

Store skills in your project root under `.cursor/skills/` (or `.claude/skills/`). Each skill gets its own dedicated directory containing its `SKILL.md` entry point and optional supporting scripts or schemas:

```text
my-project/
├── .cursor/
│   ├── rules/                       # Global rules (.mdc)
│   │   └── react-typescript.mdc
│   └── skills/                      # On-demand Agent Skills
│       ├── prisma-migration/
│       │   ├── SKILL.md             # Primary skill instructions
│       │   └── migration-check.sh   # Helper script
│       └── playwright-e2e/
│           ├── SKILL.md
│           └── selector-rules.json  # Reference artifact

```

---

## 3. Anatomy of a Production-Ready `SKILL.md`

A well-structured `SKILL.md` file contains metadata at the top, a clear activation trigger, step-by-step execution workflows, and explicit guardrails.

### Example: `.cursor/skills/prisma-migration/SKILL.md`

```markdown
---
name: prisma-migration
description: Safely run, generate, and verify Prisma database migrations in development and CI environments. Use whenever creating or updating database schemas.
trigger_globs: "prisma/schema.prisma"
---

# Prisma Database Migration Skill

Use this skill when modifying `prisma/schema.prisma`, running database migrations, or generating updated Prisma Client types.

---

## 1. Prerequisites & Validation
Before applying any migration, perform the following checks:
1. Verify local database container is running (`docker ps | grep postgres`).
2. Run `npx prisma validate` to confirm schema syntax is correct.

---

## 2. Standard Workflow Steps

### Step 1: Format Schema
Always format the schema before generating migrations:
```bash
npx prisma format

```

### Step 2: Generate Migration Script

Create a named, descriptive migration file:

```bash
npx prisma migrate dev --name <descriptive_name>

```

### Step 3: Verify Type Generation

Ensure Prisma Client types are updated and non-breaking:

```bash
npx prisma generate
npm run typecheck

```

---

## 3. Safety Guardrails & Invariants

* ❌ **NEVER** run `npx prisma db push` in production branches or features that touch live environments (use `migrate dev` or `migrate deploy`).
* ❌ **NEVER** edit existing migration SQL files inside `prisma/migrations/` if they have already been committed.
* ⚠️ If a migration warns of **data loss** (e.g., dropping a column), pause and ask the developer for explicit confirmation before proceeding.

```

---

## 4. Key Rules for Writing High-Efficiency Skills

1. **Keep Descriptions Trigger-Focused:** The frontmatter `description` determines when the agent loads the skill. Include explicit action verbs and context keywords (e.g., *"Use whenever running Playwright E2E tests or updating test fixtures"*).
2. **Deterministic Step Ordering:** Use numbered steps for workflows where order is critical (Format $\rightarrow$ Validate $\rightarrow$ Execute $\rightarrow$ Typecheck).
3. **Provide Immediate Failure Recovery:** Explain what the agent should do if a step fails (e.g., *"If `prisma migrate dev` fails with a shadow database error, check if Docker PostgreSQL is reachable on port 5432"*).
4. **Isolate Heavy Documentation:** Don't dump 500 lines of API specs into `SKILL.md`. Keep `SKILL.md` concise and link to external reference files (`./reference-api.json`) that the agent can read on demand using file tools.

---

## Summary Matrix

| Metric               | `.cursor/rules/*.mdc`                              | `.cursor/skills/*/SKILL.md`                              |
| :------------------- | :------------------------------------------------- | :------------------------------------------------------- |
| **Loading Strategy** | Always loaded or attached via file globs           | **Lazy-loaded on demand** (Progressive Disclosure)       |
| **Primary Scope**    | Global code style, typing rules, linting standards | Procedural runbooks, multi-step workflows, complex tasks |
| **Token Impact**     | Permanent context overhead                         | Zero token cost until task activation                    |
| **Best Used For**    | *"Always use TypeScript interfaces"*               | *"How to run database migrations safely"*                |

<ElicitationsGroup message="Where would you like to take your AI engineering setup next?">
  <Elicitation label="Draft a SKILL.md for automated Playwright E2E testing" query="Draft a comprehensive SKILL.md file for writing, running, and debugging Playwright E2E tests."/>
  <Elicitation label="Draft a SKILL.md for API endpoint creation with Zod and OpenAPI" query="Draft a comprehensive SKILL.md file for creating type-safe API endpoints validated with Zod."/>
</ElicitationsGroup>

```
