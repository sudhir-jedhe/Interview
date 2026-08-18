# Environment & Configuration

Real applications behave differently across development, staging, and production, and need a way to inject secrets and settings without hardcoding them into source code. This topic covers `process.env` and how environment variables flow into a Node process, `.env` files and the `dotenv` package for local development, why `.env` must never be committed to version control, and patterns for structuring configuration per environment. We also cover `process.argv` for CLI argument parsing, the `NODE_ENV` convention and how libraries (notably Express) change behavior based on it, and the limits of environment variables as a secrets-management mechanism — including when you actually need a dedicated secret manager.

## Folder guide

- **`theory/`** — core concepts, split by topic: `process.env`/`process.argv` basics, `.env` files and `dotenv`, secrets management, and structuring config per environment (including `NODE_ENV`).
- **`snippets/`** — one short, runnable code example per file, each with an explanation.
- **`output-based/`** — "what does this log?" questions with answers and reasoning, one per file.
- **`scenarios/`** — real-world problems (a leaked `.env`, a mid-request crash from a missing var, structuring per-environment config, CLI flag/config-file precedence) each with a worked approach and code.
- **`interview-qa/`** — Q&A pairs grouped into themed files: `process.env` fundamentals, `dotenv`/secrets, and `NODE_ENV`/config structuring.
- **`problems/`** — practice problems with full worked solutions: a from-scratch `dotenv` parser, startup env-var validation, and environment-specific config loading with fallbacks.
- **`assets/`** — placeholder for any images/PDFs from the original notes.

## What's covered

- `process.env` — reading, setting, and where environment variables actually come from
- `.env` files, `dotenv`, and why `.env` belongs in `.gitignore`
- Structuring config for dev/staging/production (config modules, precedence, validation)
- Secrets management concepts — why env vars aren't a complete solution, and what secret managers add
- `process.argv` — parsing CLI arguments
- `NODE_ENV` — the convention, and concrete examples of libraries branching on it (Express view caching)

> Looking for your original notes on this? See `../../SOURCE-MAP.md`.
