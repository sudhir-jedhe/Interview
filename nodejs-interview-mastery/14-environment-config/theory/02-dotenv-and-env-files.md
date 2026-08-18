# Environment & Configuration — `.env` Files and `dotenv`

## Why `.env` files exist

In production, environment variables usually come from the hosting platform (Docker, Kubernetes secrets, Heroku config vars, systemd unit files). Locally, developers don't want to `export` a dozen variables by hand every session, so the `dotenv` package reads a `.env` file and merges its key-value pairs into `process.env`.

```js
// .env file (never committed):
// DATABASE_URL=postgres://localhost:5432/myapp
// API_KEY=sk_test_abc123

require('dotenv').config(); // must run before you read process.env values that depend on it
console.log(process.env.DATABASE_URL);
```

`dotenv` isn't magic — it just reads the file and merges key/value pairs into `process.env` synchronously, at the moment `.config()` is called (not automatically at module load, and not before that call). Any code that reads `process.env` *before* `require('dotenv').config()` runs sees `undefined` for values that only exist in `.env`, which is why `dotenv.config()` should be one of the very first lines executed — often via `-r dotenv/config` at the process level so it's guaranteed to run before your own code.

## Why `.env` must never be committed

It's the single most common way real secrets leak into git history — API keys, database passwords, JWT signing secrets. Once committed, the secret is in history forever (even after deletion) unless you rewrite history, and public repos get scraped by bots within minutes. `.env` belongs in `.gitignore` from day one; ship a `.env.example` with placeholder keys (no real values) so teammates know what variables to set.

```
# .gitignore
.env
.env.local
.env.*.local
```

## `.env` files vs real secret managers (Vault, AWS Secrets Manager)

| Aspect | `.env` / plain env vars | Secret manager |
|---|---|---|
| Encryption at rest | No (plaintext file or process env) | Yes |
| Access control | Filesystem/process permissions only | Fine-grained IAM policies per secret |
| Rotation | Manual — redeploy to change | Often automatic, without redeploying every consumer |
| Audit trail | None | Every read logged |
| Setup cost | Trivial | Requires infra integration |

`.env` is fine for local development and low-stakes config; reach for a secret manager when secrets are highly sensitive (payment keys, root DB credentials) or when you need rotation and audit logging for compliance. The most common mistake is treating `.env` as "secure enough" for production secrets simply because it's not committed to git — the file can still leak via server misconfig, backups, or debug endpoints that dump env vars. See `03-secrets-management.md` for more on why plain env vars aren't a complete secrets solution, regardless of source.
