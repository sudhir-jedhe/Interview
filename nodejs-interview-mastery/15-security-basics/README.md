# Security Basics (Node & Express)

Most real-world Node/Express security incidents come from a small, well-known set of mistakes: unparameterized queries, misconfigured CORS, missing rate limits, unvalidated input, and unaudited dependencies. This topic walks through the common vulnerability classes and their concrete mitigations — injection attacks, security headers via `helmet`, CORS pitfalls (especially `*` combined with credentials), rate limiting, input validation/sanitization, dependency supply-chain risk, command injection via `eval`/`child_process`, and secure cookie configuration. The goal isn't exhaustive OWASP coverage but the practical checklist an interviewer expects a mid-level Node engineer to know cold.

## Folder guide

- **`theory/`** — core concepts, split by topic: injection attacks (SQL/NoSQL/command), `helmet`/security headers, CORS, rate limiting, input validation/sanitization, dependency/supply-chain risk, and secure cookie flags.
- **`snippets/`** — one short, runnable code example per file, each with an explanation.
- **`output-based/`** — "what does this log?" questions with answers and reasoning, one per file.
- **`scenarios/`** — real-world problems (brute-force login protection, CORS allowlisting, an admin command-injection review, stored XSS) each with a worked approach and code.
- **`interview-qa/`** — Q&A pairs grouped into themed files: injection/input handling, headers/CORS/rate limiting, cookies/secrets/supply-chain.
- **`problems/`** — practice problems with full worked solutions: a NoSQL injection demo and fix, Express input validation/sanitization middleware, and an in-memory rate limiter.
- **`assets/`** — placeholder for any images/PDFs from the original notes.

## What's covered

- SQL/NoSQL injection and parameterized queries
- `helmet.js` — what headers it actually sets and why each matters
- CORS configuration, and the `Access-Control-Allow-Origin: '*'` + credentials trap
- Rate limiting for brute-force and DoS mitigation
- Input validation and sanitization
- Dependency vulnerabilities — `npm audit`, lockfiles, supply-chain risk
- Command injection via `eval`/`exec` with unsanitized input
- Secure cookie flags — `httpOnly`, `secure`, `sameSite`

> Looking for your original notes on this? See `../../SOURCE-MAP.md`.
