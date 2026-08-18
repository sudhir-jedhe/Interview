# Environment & Configuration — Secrets Management

## Why env vars aren't a complete secrets solution

Environment variables are visible to anything with process inspection access (`/proc/<pid>/environ` on Linux, `ps` in some configurations, crash dumps, and any logging that accidentally dumps `process.env`). They're also static for the lifetime of the process — rotating a leaked secret means redeploying. For highly sensitive secrets (database root credentials, signing keys, payment provider keys) at scale, teams use dedicated secret managers (AWS Secrets Manager, HashiCorp Vault, GCP Secret Manager) which add encryption at rest, fine-grained access control, audit logging of every read, and automatic rotation — capabilities plain env vars don't provide. Env vars remain fine for non-sensitive config and lower-stakes secrets; the concept to internalize is that "env var" and "secure" are not synonyms.

## Never log secrets

A frequent, entirely accidental leak vector: logging a full config object that happens to include a password or API key field.

```js
// Never log secrets — a common accidental leak, and the safer alternative
function logConfig(config) {
  const { password, apiKey, ...safe } = config; // strip sensitive keys before logging
  console.log('Loaded config:', safe);
}
logConfig({ host: 'db.internal', password: 'super-secret', apiKey: 'sk_live_xyz' });
```

## Where secrets actually come from in production

Most commonly the hosting platform injects them directly into the container/VM's environment — Kubernetes Secrets mounted as env vars, Docker `--env-file` or `-e` flags set by the deploy pipeline, or a cloud provider's config-var system (Heroku, App Runner, etc.). `.env` + `dotenv` is largely a local-development-only pattern; production rarely reads from a literal file on disk. See `02-dotenv-and-env-files.md` for the `.env`-vs-secret-manager comparison in more depth.
